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

#[AsCommand(
    name: 'app:email:inactivity-reminder',
    description: 'Send reminder emails to users inactive for 7+ days',
)]
class InactivityReminderCommand extends Command
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

        $sevenDaysAgo = (new \DateTimeImmutable('-7 days'))->format('Y-m-d H:i:s');
        $thirtyDaysAgo = (new \DateTimeImmutable('-30 days'))->format('Y-m-d H:i:s');

        // Users inactive 7+ days who haven't received a reminder in the last 30 days
        $users = $conn->fetchAllAssociative(
            'SELECT id, email, first_name
             FROM `user`
             WHERE is_active = 1
               AND last_login_at IS NOT NULL
               AND last_login_at < ?
               AND (last_inactivity_email_at IS NULL OR last_inactivity_email_at < ?)',
            [$sevenDaysAgo, $thirtyDaysAgo]
        );

        $io->info(sprintf('Found %d inactive users', count($users)));

        $sent = 0;
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        foreach ($users as $userData) {
            $user = $this->em->getRepository(User::class)->find($userData['id']);
            if (!$user) {
                continue;
            }

            $this->emailService->sendInactivityReminder($user);

            // Update lastInactivityEmailAt via raw SQL (UUID issue)
            $conn->executeStatement(
                'UPDATE `user` SET last_inactivity_email_at = ? WHERE id = ?',
                [$now, $userData['id']]
            );

            $sent++;
            $io->text(sprintf('  Sent to %s', $userData['email']));
        }

        $io->success(sprintf('Inactivity reminder sent to %d users', $sent));

        return Command::SUCCESS;
    }
}
