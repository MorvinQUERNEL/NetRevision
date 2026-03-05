<?php

namespace App\Service;

use App\Entity\User;

class PointsService
{
    public const COURSE_COMPLETED = 10;
    public const QUIZ_MULTIPLIER = 0.5;
    public const PERFECT_QUIZ_BONUS = 20;
    public const EXAM_PASSED = 100;
    public const NOTE_CREATED = 5;

    public function awardCourseCompleted(User $user): void
    {
        $user->addPoints(self::COURSE_COMPLETED);
    }

    public function awardQuizCompleted(User $user, int $score): void
    {
        $points = (int) round($score * self::QUIZ_MULTIPLIER);
        $user->addPoints($points);

        if ($score === 100) {
            $user->addPoints(self::PERFECT_QUIZ_BONUS);
        }
    }

    public function awardExamPassed(User $user): void
    {
        $user->addPoints(self::EXAM_PASSED);
    }

    public function awardNoteCreated(User $user): void
    {
        $user->addPoints(self::NOTE_CREATED);
    }
}
