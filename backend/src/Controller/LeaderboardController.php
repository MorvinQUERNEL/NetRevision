<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class LeaderboardController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepo,
        private EntityManagerInterface $em,
    ) {}

    #[Route('/api/leaderboard', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $users = $this->userRepo->findTopByPoints(50);

        $leaderboard = array_map(fn(User $u, int $i) => [
            'rank' => $i + 1,
            'id' => $u->getId()?->toRfc4122(),
            'firstName' => $u->getFirstName(),
            'lastName' => $u->getLastName(),
            'pseudo' => $u->getPseudo(),
            'avatarUrl' => $u->getAvatarUrl(),
            'totalPoints' => $u->getTotalPoints(),
        ], $users, array_keys($users));

        return $this->json(['leaderboard' => $leaderboard]);
    }

    #[Route('/api/leaderboard/{formation}', methods: ['GET'], requirements: ['formation' => '[a-z]+'])]
    public function byFormation(string $formation): JsonResponse
    {
        $conn = $this->em->getConnection();

        // Calculate points per formation by counting completed chapters/quizzes in that formation
        $rows = $conn->fetchAllAssociative(
            'SELECT u.id, u.first_name, u.last_name, u.pseudo, u.avatar_url,
                    (SUM(CASE WHEN p.course_completed = 1 THEN 10 ELSE 0 END)
                     + SUM(CASE WHEN p.quiz_score IS NOT NULL THEN GREATEST(ROUND(p.quiz_score * 0.5), 0) ELSE 0 END)
                     + SUM(CASE WHEN p.exam_passed = 1 THEN 50 ELSE 0 END)
                    ) as formation_points
             FROM progress p
             JOIN chapter c ON p.chapter_id = c.id
             JOIN user u ON p.user_id = u.id
             WHERE c.formation = ?
             GROUP BY u.id
             ORDER BY formation_points DESC
             LIMIT 50',
            [$formation]
        );

        $leaderboard = array_map(fn(array $row, int $i) => [
            'rank' => $i + 1,
            'id' => $row['id'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'pseudo' => $row['pseudo'],
            'avatarUrl' => $row['avatar_url'],
            'totalPoints' => (int) $row['formation_points'],
        ], $rows, array_keys($rows));

        return $this->json(['leaderboard' => $leaderboard, 'formation' => $formation]);
    }

    #[Route('/api/leaderboard/me', methods: ['GET'])]
    public function myRank(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $rank = $this->userRepo->getUserRank($user);

        return $this->json([
            'rank' => $rank,
            'totalPoints' => $user->getTotalPoints(),
            'totalUsers' => $this->userRepo->countActiveUsers(),
        ]);
    }
}
