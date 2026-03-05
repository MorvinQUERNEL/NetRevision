<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findTopByPoints(int $limit = 50): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.isActive = true')
            ->orderBy('u.totalPoints', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function getUserRank(User $user): int
    {
        $result = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.totalPoints > :points')
            ->andWhere('u.isActive = true')
            ->setParameter('points', $user->getTotalPoints())
            ->getQuery()
            ->getSingleScalarResult();

        return (int) $result + 1;
    }

    public function countActiveUsers(): int
    {
        return (int) $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.isActive = true')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
