<?php

namespace App\Controller;

use App\Entity\Formation;
use App\Repository\FormationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class FormationController extends AbstractController
{
    public function __construct(
        private FormationRepository $formationRepo,
    ) {}

    #[Route('/api/formations', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $formations = $this->formationRepo->findAllActive();

        return $this->json([
            'formations' => array_map(fn(Formation $f) => $f->toArray($lang), $formations),
        ]);
    }

    #[Route('/api/formations/{id}', methods: ['GET'])]
    public function detail(string $id, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $formation = $this->formationRepo->find($id);

        if (!$formation || !$formation->getIsActive()) {
            return $this->json(['error' => 'Formation not found'], 404);
        }

        return $this->json([
            'formation' => $formation->toArray($lang),
        ]);
    }
}
