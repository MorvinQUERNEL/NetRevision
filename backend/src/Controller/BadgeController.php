<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class BadgeController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}

    #[Route('/api/badges', methods: ['GET'])]
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $conn = $this->em->getConnection();

        $allBadges = $conn->fetchAllAssociative(
            'SELECT * FROM badge ORDER BY id ASC'
        );

        $userBadges = $conn->fetchAllAssociative(
            'SELECT badge_id, unlocked_at FROM user_badge WHERE user_id = ?',
            [$user->getId()->toBinary()]
        );

        $unlockedMap = [];
        foreach ($userBadges as $ub) {
            $unlockedMap[$ub['badge_id']] = $ub['unlocked_at'];
        }

        $data = array_map(function (array $badge) use ($unlockedMap) {
            $unlocked = isset($unlockedMap[$badge['id']]);
            return [
                'id' => (int) $badge['id'],
                'slug' => $badge['slug'],
                'name' => $badge['name'],
                'description' => $badge['description'],
                'icon' => $badge['icon'],
                'category' => $badge['category'],
                'unlocked' => $unlocked,
                'unlockedAt' => $unlockedMap[$badge['id']] ?? null,
            ];
        }, $allBadges);

        return $this->json(['badges' => $data]);
    }

    #[Route('/api/badges/mine', methods: ['GET'])]
    public function mine(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $conn = $this->em->getConnection();

        $rows = $conn->fetchAllAssociative(
            'SELECT b.*, ub.unlocked_at
             FROM user_badge ub
             JOIN badge b ON ub.badge_id = b.id
             WHERE ub.user_id = ?
             ORDER BY ub.unlocked_at DESC',
            [$user->getId()->toBinary()]
        );

        $data = array_map(fn(array $r) => [
            'id' => (int) $r['id'],
            'slug' => $r['slug'],
            'name' => $r['name'],
            'description' => $r['description'],
            'icon' => $r['icon'],
            'category' => $r['category'],
            'unlocked' => true,
            'unlockedAt' => $r['unlocked_at'],
        ], $rows);

        return $this->json(['badges' => $data]);
    }
}
