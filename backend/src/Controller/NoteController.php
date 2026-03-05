<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\BadgeService;
use App\Service\PointsService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class NoteController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PointsService $pointsService,
        private BadgeService $badgeService,
    ) {}

    #[Route('/api/notes', methods: ['GET'])]
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $conn = $this->em->getConnection();

        $rows = $conn->fetchAllAssociative(
            'SELECT * FROM note WHERE user_id = ? ORDER BY updated_at DESC',
            [$user->getId()->toBinary()]
        );

        $data = array_map(fn(array $r) => [
            'id' => (int) $r['id'],
            'chapterSlug' => $r['chapter_slug'],
            'content' => $r['content'],
            'createdAt' => $r['created_at'],
            'updatedAt' => $r['updated_at'],
        ], $rows);

        return $this->json(['notes' => $data]);
    }

    #[Route('/api/notes/{chapterSlug}', methods: ['GET'])]
    public function show(string $chapterSlug): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $conn = $this->em->getConnection();

        $row = $conn->fetchAssociative(
            'SELECT * FROM note WHERE user_id = ? AND chapter_slug = ?',
            [$user->getId()->toBinary(), $chapterSlug]
        );

        if (!$row) {
            return $this->json(['note' => null]);
        }

        return $this->json(['note' => [
            'id' => (int) $row['id'],
            'chapterSlug' => $row['chapter_slug'],
            'content' => $row['content'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at'],
        ]]);
    }

    #[Route('/api/notes/{chapterSlug}', methods: ['PUT'])]
    public function upsert(string $chapterSlug, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['content'])) {
            return $this->json(['error' => 'Contenu requis'], 400);
        }

        $conn = $this->em->getConnection();
        $userIdBin = $user->getId()->toBinary();
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        // Check if exists
        $existing = $conn->fetchAssociative(
            'SELECT id FROM note WHERE user_id = ? AND chapter_slug = ?',
            [$userIdBin, $chapterSlug]
        );

        $isNew = !$existing;

        $conn->executeStatement(
            'INSERT INTO note (user_id, chapter_slug, content, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE content = ?, updated_at = ?',
            [$userIdBin, $chapterSlug, $data['content'], $now, $now,
             $data['content'], $now]
        );

        if ($isNew) {
            $this->pointsService->awardNoteCreated($user);
            $this->em->flush();
            $this->badgeService->checkAndAward($user);
        }

        $row = $conn->fetchAssociative(
            'SELECT * FROM note WHERE user_id = ? AND chapter_slug = ?',
            [$userIdBin, $chapterSlug]
        );

        return $this->json([
            'note' => [
                'id' => (int) $row['id'],
                'chapterSlug' => $row['chapter_slug'],
                'content' => $row['content'],
                'createdAt' => $row['created_at'],
                'updatedAt' => $row['updated_at'],
            ],
            'totalPoints' => $user->getTotalPoints(),
        ]);
    }
}
