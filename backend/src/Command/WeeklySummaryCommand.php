<?php

namespace App\Command;

use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:email:weekly-summary',
    description: 'Send weekly summary emails to active users',
)]
class WeeklySummaryCommand extends Command
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

        // Get all active users who have logged in at least once
        $users = $conn->fetchAllAssociative(
            'SELECT id, email, first_name, last_name, total_points, login_streak, last_login_at, avatar_url, auth_provider
             FROM `user`
             WHERE is_active = 1 AND last_login_at IS NOT NULL'
        );

        $io->info(sprintf('Found %d active users', count($users)));

        $oneWeekAgo = (new \DateTimeImmutable('-7 days'))->format('Y-m-d H:i:s');
        $sent = 0;

        foreach ($users as $userData) {
            $userIdBin = $userData['id'];

            // Stats for this week
            $coursesThisWeek = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM progress WHERE user_id = ? AND course_completed = 1 AND updated_at >= ?',
                [$userIdBin, $oneWeekAgo]
            );
            $quizzesThisWeek = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM progress WHERE user_id = ? AND quiz_score IS NOT NULL AND quiz_completed_at >= ?',
                [$userIdBin, $oneWeekAgo]
            );
            $badgesThisWeek = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM user_badge WHERE user_id = ? AND unlocked_at >= ?',
                [$userIdBin, $oneWeekAgo]
            );

            // Global stats
            $totalCourses = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM progress WHERE user_id = ? AND course_completed = 1',
                [$userIdBin]
            );
            $totalBadges = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM user_badge WHERE user_id = ?',
                [$userIdBin]
            );
            $rank = (int) $conn->fetchOne(
                'SELECT COUNT(*) + 1 FROM `user` WHERE total_points > ? AND is_active = 1',
                [(int) $userData['total_points']]
            );

            // Skip if no activity this week
            if ($coursesThisWeek === 0 && $quizzesThisWeek === 0 && $badgesThisWeek === 0) {
                continue;
            }

            // Build a lightweight User-like object for EmailService
            $user = $this->loadUser($userIdBin);
            if (!$user) {
                continue;
            }

            $stats = [
                'coursesThisWeek' => $coursesThisWeek,
                'quizzesThisWeek' => $quizzesThisWeek,
                'badgesThisWeek' => $badgesThisWeek,
                'totalPoints' => (int) $userData['total_points'],
                'totalCourses' => $totalCourses,
                'totalBadges' => $totalBadges,
                'rank' => $rank,
            ];

            $this->emailService->sendWeeklySummary($user, $stats);
            $sent++;

            $io->text(sprintf('  Sent to %s (%s %s)', $userData['email'], $userData['first_name'], $userData['last_name']));
        }

        $io->success(sprintf('Weekly summary sent to %d users', $sent));

        return Command::SUCCESS;
    }

    private function loadUser(string $userIdBin): ?\App\Entity\User
    {
        return $this->em->getRepository(\App\Entity\User::class)->find($userIdBin);
    }
}
