<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\BadgeRepository;
use App\Repository\ChapterRepository;
use Doctrine\ORM\EntityManagerInterface;

class BadgeService
{
    private const POINTS_PER_BADGE = 15;

    public function __construct(
        private EntityManagerInterface $em,
        private BadgeRepository $badgeRepo,
        private ChapterRepository $chapterRepo,
        private EmailService $emailService,
    ) {}

    /**
     * Check and award all applicable badges for a user.
     * Returns array of newly unlocked badge slugs.
     */
    public function checkAndAward(User $user): array
    {
        $newBadges = [];
        $conn = $this->em->getConnection();
        $userIdBin = $user->getId()->toBinary();
        $totalChapters = count($this->chapterRepo->findAll());

        // Fetch counts via raw SQL to avoid UUID issues
        $completedCourses = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM progress WHERE user_id = ? AND course_completed = 1',
            [$userIdBin]
        );
        $completedQuizzes = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM progress WHERE user_id = ? AND quiz_score IS NOT NULL',
            [$userIdBin]
        );
        $perfectQuizzes = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM progress WHERE user_id = ? AND quiz_score = 100',
            [$userIdBin]
        );
        $today = (new \DateTimeImmutable('today'))->format('Y-m-d');
        $tomorrow = (new \DateTimeImmutable('tomorrow'))->format('Y-m-d');
        $quizzesToday = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM progress WHERE user_id = ? AND quiz_completed_at >= ? AND quiz_completed_at < ?',
            [$userIdBin, $today, $tomorrow]
        );
        $passedExams = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM progress WHERE user_id = ? AND exam_passed = 1',
            [$userIdBin]
        );
        $passedExam = $passedExams > 0;
        $maxExamScore = (int) $conn->fetchOne(
            'SELECT COALESCE(MAX(exam_score), 0) FROM progress WHERE user_id = ? AND exam_score IS NOT NULL',
            [$userIdBin]
        );
        $noteCount = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM note WHERE user_id = ?',
            [$userIdBin]
        );
        $flashcardChapters = (int) $conn->fetchOne(
            'SELECT COUNT(*) FROM progress WHERE user_id = ? AND flashcards_reviewed > 0',
            [$userIdBin]
        );
        $userRank = (int) $conn->fetchOne(
            'SELECT COUNT(*) + 1 FROM `user` WHERE total_points > ? AND is_active = 1',
            [$user->getTotalPoints()]
        );

        $checks = [
            // --- 12 badges originaux ---
            'first-login' => $user->getLastLoginAt() !== null,
            'first-course' => $completedCourses >= 1,
            'first-quiz' => $completedQuizzes >= 1,
            'perfect-quiz' => $perfectQuizzes >= 1,
            'five-chapters' => $completedCourses >= 5,
            'all-chapters' => $completedCourses >= $totalChapters,
            'all-quizzes' => $completedQuizzes >= $totalChapters,
            'exam-passed' => $passedExam,
            'speed-demon' => $quizzesToday >= 3,
            'note-taker' => $noteCount >= 5,
            'top-10' => $userRank <= 10,
            'streak-3' => $user->getLoginStreak() >= 3,

            // --- 16 nouveaux badges ---
            'ten-chapters' => $completedCourses >= 10,
            'twenty-chapters' => $completedCourses >= 20,
            'half-quizzes' => $completedQuizzes >= 16,
            'five-perfect' => $perfectQuizzes >= 5,
            'all-exams' => $passedExams >= 4,
            'exam-ace' => $maxExamScore >= 90,
            'flashcard-fan' => $flashcardChapters >= 10,
            'flashcard-master' => $flashcardChapters >= $totalChapters,
            'points-100' => $user->getTotalPoints() >= 100,
            'points-500' => $user->getTotalPoints() >= 500,
            'points-1000' => $user->getTotalPoints() >= 1000,
            'streak-7' => $user->getLoginStreak() >= 7,
            'streak-30' => $user->getLoginStreak() >= 30,
            'note-master' => $noteCount >= 15,
            'top-3' => $userRank <= 3,
            'completionist' => $completedCourses >= $totalChapters && $completedQuizzes >= $totalChapters && $passedExams >= 4,
        ];

        foreach ($checks as $slug => $condition) {
            if (!$condition) {
                continue;
            }

            $badge = $this->badgeRepo->findBySlug($slug);
            if (!$badge) {
                continue;
            }

            // Check if already awarded
            $exists = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM user_badge WHERE user_id = ? AND badge_id = ?',
                [$userIdBin, $badge->getId()]
            );
            if ($exists > 0) {
                continue;
            }

            // Award badge
            $conn->executeStatement(
                'INSERT IGNORE INTO user_badge (user_id, badge_id, unlocked_at) VALUES (?, ?, ?)',
                [$userIdBin, $badge->getId(), (new \DateTimeImmutable())->format('Y-m-d H:i:s')]
            );

            $user->addPoints(self::POINTS_PER_BADGE);
            $newBadges[] = $slug;
        }

        if (!empty($newBadges)) {
            $this->em->flush(); // Flush user points update

            // Send badge notification email
            $badgeInfos = [];
            foreach ($newBadges as $slug) {
                $badge = $this->badgeRepo->findBySlug($slug);
                if ($badge) {
                    $badgeInfos[] = [
                        'name' => $badge->getName(),
                        'description' => $badge->getDescription(),
                        'icon' => $badge->getIcon(),
                    ];
                }
            }
            $this->emailService->sendBadgeUnlocked($user, $badgeInfos);
        }

        return $newBadges;
    }
}
