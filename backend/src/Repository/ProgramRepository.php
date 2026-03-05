<?php

namespace App\Repository;

use App\Entity\Program;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProgramRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Program::class);
    }

    public function findByFormation(string $formationId): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.formation = :fid')
            ->setParameter('fid', $formationId)
            ->orderBy('p.orderIndex', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
