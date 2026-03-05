<?php

namespace App\Repository;

use App\Entity\Progress;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProgressRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Progress::class);
    }

    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('p')
            ->join('p.chapter', 'c')
            ->where('p.user = :user')
            ->setParameter('user', $user)
            ->orderBy('c.orderIndex', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByUserAndChapterSlug(User $user, string $chapterSlug): ?Progress
    {
        return $this->createQueryBuilder('p')
            ->join('p.chapter', 'c')
            ->where('p.user = :user')
            ->andWhere('c.slug = :slug')
            ->setParameter('user', $user)
            ->setParameter('slug', $chapterSlug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function countCompletedCourses(User $user): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.user = :user')
            ->andWhere('p.courseCompleted = true')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countCompletedQuizzes(User $user): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.user = :user')
            ->andWhere('p.quizScore IS NOT NULL')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countPerfectQuizzes(User $user): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.user = :user')
            ->andWhere('p.quizScore = 100')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countQuizzesToday(User $user): int
    {
        $today = new \DateTimeImmutable('today');
        $tomorrow = new \DateTimeImmutable('tomorrow');

        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.user = :user')
            ->andWhere('p.quizCompletedAt >= :today')
            ->andWhere('p.quizCompletedAt < :tomorrow')
            ->setParameter('user', $user)
            ->setParameter('today', $today)
            ->setParameter('tomorrow', $tomorrow)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function hasPassedExam(User $user): bool
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.user = :user')
            ->andWhere('p.examPassed = true')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult() > 0;
    }

    public function countAllCompletedQuizzes(): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.quizScore IS NOT NULL')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
