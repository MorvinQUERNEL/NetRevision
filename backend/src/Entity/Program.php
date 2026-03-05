<?php

namespace App\Entity;

use App\Repository\ProgramRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProgramRepository::class)]
class Program
{
    #[ORM\Id]
    #[ORM\Column(length: 50)]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Formation::class, inversedBy: 'programs')]
    #[ORM\JoinColumn(name: 'formation_id', referencedColumnName: 'id', nullable: false)]
    private ?Formation $formation = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $nameEn = null;

    #[ORM\Column(length: 20, options: ['default' => '#00e5a0'])]
    private string $color = '#00e5a0';

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descriptionEn = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $orderIndex = 0;

    public function getId(): ?string { return $this->id; }
    public function setId(string $id): static { $this->id = $id; return $this; }

    public function getFormation(): ?Formation { return $this->formation; }
    public function setFormation(?Formation $formation): static { $this->formation = $formation; return $this; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getNameEn(): ?string { return $this->nameEn; }
    public function setNameEn(string $nameEn): static { $this->nameEn = $nameEn; return $this; }

    public function getColor(): string { return $this->color; }
    public function setColor(string $color): static { $this->color = $color; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getDescriptionEn(): ?string { return $this->descriptionEn; }
    public function setDescriptionEn(?string $descriptionEn): static { $this->descriptionEn = $descriptionEn; return $this; }

    public function getOrderIndex(): int { return $this->orderIndex; }
    public function setOrderIndex(int $orderIndex): static { $this->orderIndex = $orderIndex; return $this; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'formationId' => $this->formation?->getId(),
            'name' => $lang === 'en' ? $this->nameEn : $this->name,
            'color' => $this->color,
            'description' => $lang === 'en' ? $this->descriptionEn : $this->description,
            'orderIndex' => $this->orderIndex,
        ];
    }
}
