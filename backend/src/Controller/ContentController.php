<?php

namespace App\Controller;

use App\Repository\ChapterRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ContentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ChapterRepository $chapterRepo,
    ) {}

    #[Route('/api/formations/{formationId}/chapters', methods: ['GET'])]
    public function chapters(string $formationId, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        $rows = $conn->fetchAllAssociative(
            'SELECT c.*, p.name as program_name, p.name_en as program_name_en, p.color as program_color
             FROM chapter c
             LEFT JOIN program p ON c.program_id = p.id
             WHERE c.formation = ?
             ORDER BY c.order_index ASC',
            [$formationId]
        );

        $chapters = array_map(fn(array $row) => [
            'id' => (int) $row['id'],
            'slug' => $row['slug'],
            'title' => $row['title'],
            'subtitle' => $row['subtitle'] ?? null,
            'description' => $row['description'],
            'icon' => $row['icon'] ?? null,
            'color' => $row['color'] ?? null,
            'duration' => $row['duration'] ?? null,
            'level' => $row['level'] ?? null,
            'videoId' => $lang === 'en' ? ($row['video_id_en'] ?? $row['video_id']) : $row['video_id'],
            'orderIndex' => (int) $row['order_index'],
            'program' => $row['program'],
            'programId' => $row['program_id'],
            'programName' => $lang === 'en' ? ($row['program_name_en'] ?? $row['program_name']) : $row['program_name'],
            'programColor' => $row['program_color'] ?? null,
        ], $rows);

        return $this->json(['chapters' => $chapters]);
    }

    #[Route('/api/formations/{formationId}/chapters/{slug}', methods: ['GET'])]
    public function chapterDetail(string $formationId, string $slug, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        $chapter = $conn->fetchAssociative(
            'SELECT c.* FROM chapter c WHERE c.formation = ? AND c.slug = ?',
            [$formationId, $slug]
        );

        if (!$chapter) {
            return $this->json(['error' => 'Chapter not found'], 404);
        }

        // Fetch sections
        $sections = $conn->fetchAllAssociative(
            'SELECT * FROM chapter_section WHERE chapter_id = ? ORDER BY order_index ASC',
            [(int) $chapter['id']]
        );

        $sectionData = array_map(fn(array $s) => [
            'id' => (int) $s['id'],
            'title' => $lang === 'en' ? ($s['title_en'] ?? $s['title']) : $s['title'],
            'content' => $lang === 'en' ? ($s['content_en'] ?? $s['content']) : $s['content'],
            'orderIndex' => (int) $s['order_index'],
        ], $sections);

        return $this->json([
            'chapter' => [
                'id' => (int) $chapter['id'],
                'slug' => $chapter['slug'],
                'title' => $chapter['title'],
                'subtitle' => $chapter['subtitle'] ?? null,
                'description' => $chapter['description'],
                'videoId' => $lang === 'en' ? ($chapter['video_id_en'] ?? $chapter['video_id']) : $chapter['video_id'],
                'sections' => $sectionData,
            ],
        ]);
    }

    #[Route('/api/formations/{formationId}/quizzes/{slug}', methods: ['GET'])]
    public function quiz(string $formationId, string $slug, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        $chapter = $conn->fetchAssociative(
            'SELECT id FROM chapter WHERE formation = ? AND slug = ?',
            [$formationId, $slug]
        );

        if (!$chapter) {
            return $this->json(['error' => 'Chapter not found'], 404);
        }

        $questions = $conn->fetchAllAssociative(
            'SELECT * FROM quiz_question WHERE chapter_id = ? ORDER BY order_index ASC',
            [(int) $chapter['id']]
        );

        $data = array_map(fn(array $q) => [
            'id' => (int) $q['id'],
            'question' => $lang === 'en' ? ($q['question_en'] ?? $q['question']) : $q['question'],
            'options' => json_decode($lang === 'en' ? ($q['options_en'] ?? $q['options']) : $q['options'], true),
            'correctIndex' => (int) $q['correct_index'],
            'explanation' => $lang === 'en' ? ($q['explanation_en'] ?? $q['explanation']) : $q['explanation'],
        ], $questions);

        return $this->json(['questions' => $data]);
    }

    #[Route('/api/formations/{formationId}/exams/{programNum}', methods: ['GET'])]
    public function exam(string $formationId, int $programNum, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        // Get program by order index
        $program = $conn->fetchAssociative(
            'SELECT id FROM program WHERE formation_id = ? AND order_index = ?',
            [$formationId, $programNum - 1]
        );

        if (!$program) {
            return $this->json(['error' => 'Program not found'], 404);
        }

        $questions = $conn->fetchAllAssociative(
            'SELECT * FROM exam_question WHERE program_id = ? ORDER BY order_index ASC',
            [$program['id']]
        );

        $data = array_map(fn(array $q) => [
            'id' => (int) $q['id'],
            'question' => $lang === 'en' ? ($q['question_en'] ?? $q['question']) : $q['question'],
            'options' => json_decode($lang === 'en' ? ($q['options_en'] ?? $q['options']) : $q['options'], true),
            'correctIndex' => (int) $q['correct_index'],
            'explanation' => $lang === 'en' ? ($q['explanation_en'] ?? $q['explanation']) : $q['explanation'],
        ], $questions);

        return $this->json(['questions' => $data]);
    }

    #[Route('/api/formations/{formationId}/glossary', methods: ['GET'])]
    public function glossary(string $formationId, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        $terms = $conn->fetchAllAssociative(
            'SELECT * FROM glossary_term WHERE formation_id = ? ORDER BY term ASC',
            [$formationId]
        );

        $data = array_map(fn(array $t) => [
            'id' => (int) $t['id'],
            'term' => $lang === 'en' ? ($t['term_en'] ?? $t['term']) : $t['term'],
            'definition' => $lang === 'en' ? ($t['definition_en'] ?? $t['definition']) : $t['definition'],
            'category' => $t['category'],
        ], $terms);

        return $this->json(['terms' => $data]);
    }

    #[Route('/api/formations/{formationId}/flashcards', methods: ['GET'])]
    public function flashcards(string $formationId, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        $cards = $conn->fetchAllAssociative(
            'SELECT * FROM flashcard WHERE formation_id = ?',
            [$formationId]
        );

        $data = array_map(fn(array $c) => [
            'id' => (int) $c['id'],
            'question' => $lang === 'en' ? ($c['question_en'] ?? $c['question']) : $c['question'],
            'answer' => $lang === 'en' ? ($c['answer_en'] ?? $c['answer']) : $c['answer'],
            'category' => $c['category'],
            'difficulty' => $c['difficulty'],
        ], $cards);

        return $this->json(['flashcards' => $data]);
    }

    #[Route('/api/formations/{formationId}/cli-labs', methods: ['GET'])]
    public function cliLabs(string $formationId, Request $request): JsonResponse
    {
        $lang = $request->query->get('lang', 'fr');
        $conn = $this->em->getConnection();

        $labs = $conn->fetchAllAssociative(
            'SELECT * FROM cli_lab WHERE formation_id = ? ORDER BY order_index ASC',
            [$formationId]
        );

        $data = array_map(fn(array $l) => [
            'id' => (int) $l['id'],
            'title' => $lang === 'en' ? ($l['title_en'] ?? $l['title']) : $l['title'],
            'description' => $lang === 'en' ? ($l['description_en'] ?? $l['description']) : $l['description'],
            'scenario' => json_decode($lang === 'en' ? ($l['scenario_en'] ?? $l['scenario']) : $l['scenario'], true),
            'difficulty' => $l['difficulty'],
            'orderIndex' => (int) $l['order_index'],
        ], $labs);

        return $this->json(['labs' => $data]);
    }
}
