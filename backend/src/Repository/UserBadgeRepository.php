<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Badge;
use App\Entity\UserBadge;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserBadgeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserBadge::class);
    }

    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('ub')
            ->join('ub.badge', 'b')
            ->where('ub.user = :user')
            ->setParameter('user', $user)
            ->orderBy('ub.unlockedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function userHasBadge(User $user, Badge $badge): bool
    {
        return (int) $this->createQueryBuilder('ub')
            ->select('COUNT(ub.id)')
            ->where('ub.user = :user')
            ->andWhere('ub.badge = :badge')
            ->setParameter('user', $user)
            ->setParameter('badge', $badge)
            ->getQuery()
            ->getSingleScalarResult() > 0;
    }

    public function countByUser(User $user): int
    {
        return (int) $this->createQueryBuilder('ub')
            ->select('COUNT(ub.id)')
            ->where('ub.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
