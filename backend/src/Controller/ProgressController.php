<?php

namespace App\Controller;

use App\Entity\Progress;
use App\Entity\User;
use App\Repository\ChapterRepository;
use App\Repository\ProgressRepository;
use App\Service\BadgeService;
use App\Service\PointsService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ProgressController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ProgressRepository $progressRepo,
        private ChapterRepository $chapterRepo,
        private PointsService $pointsService,
        private BadgeService $badgeService,
    ) {}

    #[Route('/api/progress', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $formation = $request->query->get('formation');

        $conn = $this->em->getConnection();

        $sql = 'SELECT p.*, c.slug as chapter_slug, c.title as chapter_title, c.formation as chapter_formation
                FROM progress p
                JOIN chapter c ON p.chapter_id = c.id
                WHERE p.user_id = ?';
        $params = [$user->getId()->toBinary()];

        if ($formation) {
            $sql .= ' AND c.formation = ?';
            $params[] = $formation;
        }

        $sql .= ' ORDER BY c.order_index ASC';

        $rows = $conn->fetchAllAssociative($sql, $params);

        $data = array_map(fn(array $row) => [
            'id' => $row['id'],
            'chapterSlug' => $row['chapter_slug'],
            'chapterTitle' => $row['chapter_title'],
            'courseCompleted' => (bool) $row['course_completed'],
            'quizScore' => $row['quiz_score'] !== null ? (int) $row['quiz_score'] : null,
            'quizCompletedAt' => $row['quiz_completed_at'],
            'examScore' => $row['exam_score'] !== null ? (int) $row['exam_score'] : null,
            'examPassed' => (bool) $row['exam_passed'],
            'examCompletedAt' => $row['exam_completed_at'],
            'flashcardsReviewed' => (int) $row['flashcards_reviewed'],
            'updatedAt' => $row['updated_at'],
        ], $rows);

        return $this->json(['progress' => $data]);
    }

    #[Route('/api/progress/{chapterSlug}/course', methods: ['POST'])]
    public function markCourseComplete(string $chapterSlug): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $conn = $this->em->getConnection();

        $chapter = $this->chapterRepo->findBySlug($chapterSlug);
        if (!$chapter) {
            return $this->json(['error' => 'Chapitre introuvable'], 404);
        }

        $userIdBin = $user->getId()->toBinary();

        // Upsert progress
        $conn->executeStatement(
            'INSERT INTO progress (user_id, chapter_id, course_completed, exam_passed, flashcards_reviewed, created_at, updated_at)
             VALUES (?, ?, 1, 0, 0, NOW(), NOW())
             ON DUPLICATE KEY UPDATE course_completed = 1, updated_at = NOW()',
            [$userIdBin, $chapter->getId()]
        );

        // Check if this was a new course completion (for points)
        $row = $conn->fetchAssociative(
            'SELECT * FROM progress p JOIN chapter c ON p.chapter_id = c.id WHERE p.user_id = ? AND c.slug = ?',
            [$userIdBin, $chapterSlug]
        );

        // Award points if first time
        $wasNew = $row && $row['updated_at'] === $row['created_at'];
        if ($wasNew || true) {
            // Always try to award course points - PointsService handles dedup
            $this->pointsService->awardCourseCompleted($user);
            $this->em->flush();
        }

        $this->badgeService->checkAndAward($user);

        return $this->json([
            'progress' => $this->formatProgressRow($row),
            'totalPoints' => $user->getTotalPoints(),
        ]);
    }

    #[Route('/api/progress/{chapterSlug}/quiz', methods: ['POST'])]
    public function submitQuizScore(string $chapterSlug, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['score']) || !is_numeric($data['score'])) {
            return $this->json(['error' => 'Score requis (0-100)'], 400);
        }

        $score = max(0, min(100, (int) $data['score']));
        $conn = $this->em->getConnection();

        $chapter = $this->chapterRepo->findBySlug($chapterSlug);
        if (!$chapter) {
            return $this->json(['error' => 'Chapitre introuvable'], 404);
        }

        $userIdBin = $user->getId()->toBinary();

        // Get existing progress
        $existing = $conn->fetchAssociative(
            'SELECT * FROM progress p WHERE p.user_id = ? AND p.chapter_id = ?',
            [$userIdBin, $chapter->getId()]
        );

        $oldScore = $existing ? $existing['quiz_score'] : null;
        $isNewQuiz = $oldScore === null;
        $isBetterScore = $oldScore !== null && $score > (int) $oldScore;

        // Upsert
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $conn->executeStatement(
            'INSERT INTO progress (user_id, chapter_id, quiz_score, quiz_completed_at, course_completed, exam_passed, flashcards_reviewed, created_at, updated_at)
             VALUES (?, ?, ?, ?, 0, 0, 0, ?, ?)
             ON DUPLICATE KEY UPDATE
                quiz_score = IF(? > COALESCE(quiz_score, 0), ?, quiz_score),
                quiz_completed_at = IF(? > COALESCE(quiz_score, 0), ?, quiz_completed_at),
                updated_at = ?',
            [$userIdBin, $chapter->getId(), $score, $now, $now, $now,
             $score, $score, $score, $now, $now]
        );

        // Award points
        if ($isNewQuiz) {
            $this->pointsService->awardQuizCompleted($user, $score);
        } elseif ($isBetterScore) {
            $oldPoints = (int) round((int) $oldScore * PointsService::QUIZ_MULTIPLIER);
            $newPoints = (int) round($score * PointsService::QUIZ_MULTIPLIER);
            $user->addPoints($newPoints - $oldPoints);

            if ($score === 100 && (int) $oldScore < 100) {
                $user->addPoints(PointsService::PERFECT_QUIZ_BONUS);
            }
        }

        if ($isNewQuiz || $isBetterScore) {
            $this->em->flush();
        }

        $newBadges = $this->badgeService->checkAndAward($user);

        $row = $conn->fetchAssociative(
            'SELECT p.*, c.slug as chapter_slug, c.title as chapter_title
             FROM progress p JOIN chapter c ON p.chapter_id = c.id
             WHERE p.user_id = ? AND c.slug = ?',
            [$userIdBin, $chapterSlug]
        );

        return $this->json([
            'progress' => $this->formatProgressRow($row),
            'totalPoints' => $user->getTotalPoints(),
            'newBadges' => $newBadges,
        ]);
    }

    #[Route('/api/progress/{chapterSlug}/exam', methods: ['POST'])]
    public function submitExamScore(string $chapterSlug, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['score']) || !is_numeric($data['score'])) {
            return $this->json(['error' => 'Score requis (0-100)'], 400);
        }

        $score = max(0, min(100, (int) $data['score']));
        $passed = $score >= 70;
        $conn = $this->em->getConnection();

        $chapter = $this->chapterRepo->findBySlug($chapterSlug);
        if (!$chapter) {
            return $this->json(['error' => 'Chapitre introuvable'], 404);
        }

        $userIdBin = $user->getId()->toBinary();

        // Get existing
        $existing = $conn->fetchAssociative(
            'SELECT * FROM progress p WHERE p.user_id = ? AND p.chapter_id = ?',
            [$userIdBin, $chapter->getId()]
        );

        $oldScore = $existing ? $existing['exam_score'] : null;
        $isFirstExam = $oldScore === null;
        $isBetterScore = $oldScore !== null && $score > (int) $oldScore;

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $passedInt = $passed ? 1 : 0;

        $conn->executeStatement(
            'INSERT INTO progress (user_id, chapter_id, exam_score, exam_passed, exam_completed_at, course_completed, flashcards_reviewed, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)
             ON DUPLICATE KEY UPDATE
                exam_score = IF(? > COALESCE(exam_score, 0), ?, exam_score),
                exam_passed = IF(? > COALESCE(exam_score, 0), ?, exam_passed),
                exam_completed_at = IF(? > COALESCE(exam_score, 0), ?, exam_completed_at),
                updated_at = ?',
            [$userIdBin, $chapter->getId(), $score, $passedInt, $now, $now, $now,
             $score, $score, $score, $passedInt, $score, $now, $now]
        );

        if ($passed && ($isFirstExam || ($isBetterScore && !$existing['exam_passed']))) {
            $this->pointsService->awardExamPassed($user);
            $this->em->flush();
        }

        $newBadges = $this->badgeService->checkAndAward($user);

        $row = $conn->fetchAssociative(
            'SELECT p.*, c.slug as chapter_slug, c.title as chapter_title
             FROM progress p JOIN chapter c ON p.chapter_id = c.id
             WHERE p.user_id = ? AND c.slug = ?',
            [$userIdBin, $chapterSlug]
        );

        return $this->json([
            'progress' => $this->formatProgressRow($row),
            'totalPoints' => $user->getTotalPoints(),
            'newBadges' => $newBadges,
        ]);
    }

    #[Route('/api/progress/{chapterSlug}/flashcards', methods: ['POST'])]
    public function incrementFlashcards(string $chapterSlug): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $conn = $this->em->getConnection();

        $chapter = $this->chapterRepo->findBySlug($chapterSlug);
        if (!$chapter) {
            return $this->json(['error' => 'Chapitre introuvable'], 404);
        }

        $userIdBin = $user->getId()->toBinary();
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        $conn->executeStatement(
            'INSERT INTO progress (user_id, chapter_id, flashcards_reviewed, course_completed, exam_passed, created_at, updated_at)
             VALUES (?, ?, 1, 0, 0, ?, ?)
             ON DUPLICATE KEY UPDATE flashcards_reviewed = flashcards_reviewed + 1, updated_at = ?',
            [$userIdBin, $chapter->getId(), $now, $now, $now]
        );

        $row = $conn->fetchAssociative(
            'SELECT p.*, c.slug as chapter_slug, c.title as chapter_title
             FROM progress p JOIN chapter c ON p.chapter_id = c.id
             WHERE p.user_id = ? AND c.slug = ?',
            [$userIdBin, $chapterSlug]
        );

        return $this->json(['progress' => $this->formatProgressRow($row)]);
    }

    private function formatProgressRow(?array $row): ?array
    {
        if (!$row) {
            return null;
        }

        return [
            'id' => (int) $row['id'],
            'chapterSlug' => $row['chapter_slug'] ?? null,
            'chapterTitle' => $row['chapter_title'] ?? null,
            'courseCompleted' => (bool) $row['course_completed'],
            'quizScore' => $row['quiz_score'] !== null ? (int) $row['quiz_score'] : null,
            'quizCompletedAt' => $row['quiz_completed_at'],
            'examScore' => $row['exam_score'] !== null ? (int) $row['exam_score'] : null,
            'examPassed' => (bool) $row['exam_passed'],
            'examCompletedAt' => $row['exam_completed_at'],
            'flashcardsReviewed' => (int) $row['flashcards_reviewed'],
            'updatedAt' => $row['updated_at'],
        ];
    }
}
