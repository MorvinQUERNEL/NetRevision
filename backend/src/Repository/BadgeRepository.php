<?php

namespace App\Repository;

use App\Entity\Badge;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class BadgeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Badge::class);
    }

    public function findBySlug(string $slug): ?Badge
    {
        return $this->findOneBy(['slug' => $slug]);
    }

    public function findAll(): array
    {
        return $this->createQueryBuilder('b')
            ->orderBy('b.category', 'ASC')
            ->addOrderBy('b.id', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
