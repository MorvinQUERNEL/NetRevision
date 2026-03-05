<?php

namespace App\Command;

use App\Entity\User;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Commande de recap quotidien personnalise.
 *
 * Envoie chaque matin un email de recap aux utilisateurs actifs,
 * avec leurs chapitres faibles, leur streak, leurs stats hebdo
 * et un objectif du jour.
 *
 * Cron recommande : tous les jours a 08:00
 *   0 8 * * * php /clients/revision-reseaux/backend/bin/console app:email:daily-recap
 */
#[AsCommand(
    name: 'app:email:daily-recap',
    description: 'Envoie un recap quotidien personnalise aux utilisateurs actifs',
)]
class DailyRecapCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private EmailService $emailService,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $conn = $this->em->getConnection();

        // ---------------------------------------------------------------
        // 1. Recuperer les utilisateurs actifs eligibles au recap
        //    - is_active = 1
        //    - daily_recap_enabled = 1 (COALESCE car le champ n'existe pas encore)
        //    - last_login_at dans les 30 derniers jours
        // ---------------------------------------------------------------
        $thirtyDaysAgo = (new \DateTimeImmutable('-30 days'))->format('Y-m-d H:i:s');

        $users = $conn->fetchAllAssociative(
            'SELECT id, email, first_name, last_name, login_streak, total_points
             FROM `user`
             WHERE is_active = 1
               AND COALESCE(daily_recap_enabled, 1) = 1
               AND last_login_at IS NOT NULL
               AND last_login_at >= ?',
            [$thirtyDaysAgo]
        );

        $io->info(sprintf('Utilisateurs eligibles au recap quotidien : %d', count($users)));

        $sent = 0;
        $failed = 0;
        $sevenDaysAgo = (new \DateTimeImmutable('-7 days'))->format('Y-m-d H:i:s');

        // ---------------------------------------------------------------
        // 2. Pour chaque utilisateur, collecter les donnees personnalisees
        // ---------------------------------------------------------------
        foreach ($users as $userData) {
            try {
                $userIdBin = $userData['id'];

                // ----- Chapitres faibles (top 3) -----
                // On cherche les chapitres avec le score quiz le plus bas
                // (ou sans quiz passe), tries par score ASC
                $weakChapters = $conn->fetchAllAssociative(
                    'SELECT c.title AS chapter_title,
                            COALESCE(p.quiz_score, 0) AS quiz_score
                     FROM chapter c
                     LEFT JOIN progress p ON p.chapter_id = c.id AND p.user_id = ?
                     ORDER BY COALESCE(p.quiz_score, 0) ASC
                     LIMIT 3',
                    [$userIdBin]
                );

                // ----- Streak actuel -----
                $currentStreak = (int) ($userData['login_streak'] ?? 0);

                // ----- Stats de la semaine (7 derniers jours) -----
                $coursesThisWeek = (int) $conn->fetchOne(
                    'SELECT COUNT(*)
                     FROM progress
                     WHERE user_id = ?
                       AND course_completed = 1
                       AND updated_at >= ?',
                    [$userIdBin, $sevenDaysAgo]
                );

                $quizzesThisWeek = (int) $conn->fetchOne(
                    'SELECT COUNT(*)
                     FROM progress
                     WHERE user_id = ?
                       AND quiz_score IS NOT NULL
                       AND quiz_completed_at >= ?',
                    [$userIdBin, $sevenDaysAgo]
                );

                // ----- Suggestion d'objectif du jour -----
                // Basee sur le chapitre le plus faible
                $dailyGoal = 'Reviser un chapitre et obtenir 80%+';
                if (!empty($weakChapters)) {
                    $weakestTitle = $weakChapters[0]['chapter_title'];
                    $dailyGoal = sprintf('Revoir %s et obtenir 80%%+', $weakestTitle);
                }

                // ----- Stat motivante -----
                // Nombre total de questions repondues (quiz + examens)
                $totalQuestionsAnswered = (int) $conn->fetchOne(
                    'SELECT COUNT(*)
                     FROM progress
                     WHERE user_id = ?
                       AND quiz_score IS NOT NULL',
                    [$userIdBin]
                );

                // Position au classement
                $rankPosition = (int) $conn->fetchOne(
                    'SELECT COUNT(*) + 1
                     FROM `user`
                     WHERE total_points > ?
                       AND is_active = 1',
                    [(int) $userData['total_points']]
                );

                // -------------------------------------------------------
                // 3. Construire le tableau de donnees et envoyer l'email
                // -------------------------------------------------------
                $data = [
                    'firstName'              => $userData['first_name'],
                    'streak'                 => $currentStreak,
                    'weakChapters'           => $weakChapters,
                    'coursesThisWeek'        => $coursesThisWeek,
                    'quizzesThisWeek'        => $quizzesThisWeek,
                    'dailyGoal'              => $dailyGoal,
                    'totalQuestionsAnswered' => $totalQuestionsAnswered,
                    'rankPosition'           => $rankPosition,
                ];

                // Charger l'entite User pour EmailService
                $user = $this->em->getRepository(User::class)->find($userIdBin);
                if (!$user) {
                    $io->warning(sprintf('Utilisateur introuvable en entite : %s', $userData['email']));
                    $failed++;
                    continue;
                }

                $this->emailService->sendDailyRecap($user, $data);
                $sent++;

                $io->text(sprintf(
                    '  Envoye a %s (%s %s) — streak %d, %d chapitres faibles',
                    $userData['email'],
                    $userData['first_name'],
                    $userData['last_name'],
                    $currentStreak,
                    count($weakChapters)
                ));
            } catch (\Throwable $e) {
                // On log l'erreur mais on continue avec les autres utilisateurs
                $failed++;
                $io->error(sprintf(
                    'Erreur pour %s : %s',
                    $userData['email'] ?? 'inconnu',
                    $e->getMessage()
                ));
            }
        }

        // ---------------------------------------------------------------
        // 4. Resume final
        // ---------------------------------------------------------------
        $io->newLine();
        $io->success(sprintf(
            'Recap quotidien termine — %d envoye(s), %d echec(s) sur %d eligible(s)',
            $sent,
            $failed,
            count($users)
        ));

        return Command::SUCCESS;
    }
}
