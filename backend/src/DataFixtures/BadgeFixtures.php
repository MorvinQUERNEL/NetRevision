<?php

namespace App\DataFixtures;

use App\Entity\Badge;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class BadgeFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $badges = [
            [
                'slug' => 'first-login',
                'name' => 'Premier pas',
                'description' => 'Se connecter pour la première fois',
                'icon' => 'LogIn',
                'category' => 'milestone',
                'conditionKey' => 'first-login',
            ],
            [
                'slug' => 'first-course',
                'name' => 'Apprenti',
                'description' => 'Compléter son premier cours',
                'icon' => 'BookOpen',
                'category' => 'learning',
                'conditionKey' => 'first-course',
            ],
            [
                'slug' => 'first-quiz',
                'name' => 'Testeur',
                'description' => 'Compléter son premier quiz',
                'icon' => 'ClipboardCheck',
                'category' => 'learning',
                'conditionKey' => 'first-quiz',
            ],
            [
                'slug' => 'perfect-quiz',
                'name' => 'Perfectionniste',
                'description' => 'Obtenir 100% à un quiz',
                'icon' => 'Star',
                'category' => 'achievement',
                'conditionKey' => 'perfect-quiz',
            ],
            [
                'slug' => 'five-chapters',
                'name' => 'Mi-parcours',
                'description' => 'Compléter 5 chapitres',
                'icon' => 'Flag',
                'category' => 'milestone',
                'conditionKey' => 'five-chapters',
            ],
            [
                'slug' => 'all-chapters',
                'name' => 'Diplômé',
                'description' => 'Compléter tous les chapitres',
                'icon' => 'GraduationCap',
                'category' => 'milestone',
                'conditionKey' => 'all-chapters',
            ],
            [
                'slug' => 'all-quizzes',
                'name' => 'Maître des quiz',
                'description' => 'Réussir tous les quiz',
                'icon' => 'Trophy',
                'category' => 'achievement',
                'conditionKey' => 'all-quizzes',
            ],
            [
                'slug' => 'exam-passed',
                'name' => 'Certifié',
                'description' => 'Réussir l\'examen final',
                'icon' => 'Award',
                'category' => 'achievement',
                'conditionKey' => 'exam-passed',
            ],
            [
                'slug' => 'speed-demon',
                'name' => 'Rapide',
                'description' => 'Compléter 3 quiz en une journée',
                'icon' => 'Zap',
                'category' => 'challenge',
                'conditionKey' => 'speed-demon',
            ],
            [
                'slug' => 'note-taker',
                'name' => 'Studieux',
                'description' => 'Créer 5 notes personnelles',
                'icon' => 'PenTool',
                'category' => 'engagement',
                'conditionKey' => 'note-taker',
            ],
            [
                'slug' => 'top-10',
                'name' => 'Élite',
                'description' => 'Être dans le top 10 du leaderboard',
                'icon' => 'Crown',
                'category' => 'social',
                'conditionKey' => 'top-10',
            ],
            [
                'slug' => 'streak-3',
                'name' => 'Régulier',
                'description' => 'Se connecter 3 jours consécutifs',
                'icon' => 'Flame',
                'category' => 'engagement',
                'conditionKey' => 'streak-3',
            ],

            // --- 16 nouveaux badges ---

            [
                'slug' => 'ten-chapters',
                'name' => 'Explorateur',
                'description' => 'Compléter 10 chapitres',
                'icon' => 'Map',
                'category' => 'milestone',
                'conditionKey' => 'ten-chapters',
            ],
            [
                'slug' => 'twenty-chapters',
                'name' => 'Marathonien',
                'description' => 'Compléter 20 chapitres',
                'icon' => 'MapPin',
                'category' => 'milestone',
                'conditionKey' => 'twenty-chapters',
            ],
            [
                'slug' => 'half-quizzes',
                'name' => 'Demi-tour',
                'description' => 'Réussir 16 quiz',
                'icon' => 'Target',
                'category' => 'learning',
                'conditionKey' => 'half-quizzes',
            ],
            [
                'slug' => 'five-perfect',
                'name' => 'Série parfaite',
                'description' => 'Obtenir 5 scores parfaits à 100%',
                'icon' => 'Sparkles',
                'category' => 'challenge',
                'conditionKey' => 'five-perfect',
            ],
            [
                'slug' => 'all-exams',
                'name' => 'Quadruple certifié',
                'description' => 'Réussir les 4 examens finaux',
                'icon' => 'ShieldCheck',
                'category' => 'achievement',
                'conditionKey' => 'all-exams',
            ],
            [
                'slug' => 'exam-ace',
                'name' => 'Excellence',
                'description' => 'Obtenir 90%+ à un examen',
                'icon' => 'Medal',
                'category' => 'achievement',
                'conditionKey' => 'exam-ace',
            ],
            [
                'slug' => 'flashcard-fan',
                'name' => 'Réviseur assidu',
                'description' => 'Réviser les flashcards de 10 chapitres',
                'icon' => 'Layers',
                'category' => 'learning',
                'conditionKey' => 'flashcard-fan',
            ],
            [
                'slug' => 'flashcard-master',
                'name' => 'Maître des fiches',
                'description' => 'Réviser les flashcards des 32 chapitres',
                'icon' => 'Brain',
                'category' => 'achievement',
                'conditionKey' => 'flashcard-master',
            ],
            [
                'slug' => 'points-100',
                'name' => 'Centurion',
                'description' => 'Atteindre 100 points',
                'icon' => 'Coins',
                'category' => 'milestone',
                'conditionKey' => 'points-100',
            ],
            [
                'slug' => 'points-500',
                'name' => 'Demi-millier',
                'description' => 'Atteindre 500 points',
                'icon' => 'Gem',
                'category' => 'milestone',
                'conditionKey' => 'points-500',
            ],
            [
                'slug' => 'points-1000',
                'name' => 'Légendaire',
                'description' => 'Atteindre 1000 points',
                'icon' => 'Diamond',
                'category' => 'milestone',
                'conditionKey' => 'points-1000',
            ],
            [
                'slug' => 'streak-7',
                'name' => 'Semaine parfaite',
                'description' => '7 jours de connexion consécutifs',
                'icon' => 'CalendarCheck',
                'category' => 'engagement',
                'conditionKey' => 'streak-7',
            ],
            [
                'slug' => 'streak-30',
                'name' => 'Incassable',
                'description' => '30 jours de connexion consécutifs',
                'icon' => 'Shield',
                'category' => 'engagement',
                'conditionKey' => 'streak-30',
            ],
            [
                'slug' => 'note-master',
                'name' => 'Encyclopédiste',
                'description' => 'Créer 15 notes personnelles',
                'icon' => 'FileText',
                'category' => 'engagement',
                'conditionKey' => 'note-master',
            ],
            [
                'slug' => 'top-3',
                'name' => 'Podium',
                'description' => 'Être dans le top 3 du classement',
                'icon' => 'Medal',
                'category' => 'social',
                'conditionKey' => 'top-3',
            ],
            [
                'slug' => 'completionist',
                'name' => 'Complétionniste',
                'description' => 'Terminer tous les cours, quiz et examens',
                'icon' => 'CheckCircle',
                'category' => 'achievement',
                'conditionKey' => 'completionist',
            ],
        ];

        foreach ($badges as $data) {
            $badge = new Badge();
            $badge->setSlug($data['slug']);
            $badge->setName($data['name']);
            $badge->setDescription($data['description']);
            $badge->setIcon($data['icon']);
            $badge->setCategory($data['category']);
            $badge->setConditionKey($data['conditionKey']);
            $manager->persist($badge);
        }

        $manager->flush();
    }
}
