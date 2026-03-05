<?php

namespace App\Repository;

use App\Entity\Formation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class FormationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Formation::class);
    }

    public function findAllActive(): array
    {
        return $this->createQueryBuilder('f')
            ->where('f.isActive = true')
            ->orderBy('f.orderIndex', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
