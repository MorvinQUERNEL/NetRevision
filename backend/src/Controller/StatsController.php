<?php

namespace App\Controller;

use App\Repository\ProgressRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class StatsController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepo,
        private ProgressRepository $progressRepo,
        private EntityManagerInterface $em,
    ) {}

    #[Route('/api/stats', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $formation = $request->query->get('formation');
        $conn = $this->em->getConnection();

        if ($formation) {
            $quizzesCompleted = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM progress p JOIN chapter c ON p.chapter_id = c.id WHERE p.quiz_score IS NOT NULL AND c.formation = ?',
                [$formation]
            );
            $chaptersCompleted = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM progress p JOIN chapter c ON p.chapter_id = c.id WHERE p.course_completed = 1 AND c.formation = ?',
                [$formation]
            );
        } else {
            $quizzesCompleted = $this->progressRepo->countAllCompletedQuizzes();
            $chaptersCompleted = (int) $conn->fetchOne(
                'SELECT COUNT(*) FROM progress WHERE course_completed = 1'
            );
        }

        return $this->json([
            'stats' => [
                'totalUsers' => $this->userRepo->countActiveUsers(),
                'totalQuizzesCompleted' => $quizzesCompleted,
                'totalChaptersCompleted' => $chaptersCompleted,
                'formation' => $formation,
            ],
        ]);
    }
}
