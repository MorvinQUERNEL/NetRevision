<?php

namespace App\Repository;

use App\Entity\Chapter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ChapterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chapter::class);
    }

    public function findBySlug(string $slug): ?Chapter
    {
        return $this->findOneBy(['slug' => $slug]);
    }

    public function findAllOrdered(): array
    {
        return $this->createQueryBuilder('c')
            ->orderBy('c.orderIndex', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByFormation(string $formation): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.formation = :formation')
            ->setParameter('formation', $formation)
            ->orderBy('c.orderIndex', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
