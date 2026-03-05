<?php

namespace App\Entity;

use App\Repository\FormationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FormationRepository::class)]
class Formation
{
    #[ORM\Id]
    #[ORM\Column(length: 50)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $nameEn = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descriptionEn = null;

    #[ORM\Column(length: 20, options: ['default' => '#00e5a0'])]
    private string $accentColor = '#00e5a0';

    #[ORM\Column(length: 50, options: ['default' => 'Network'])]
    private string $icon = 'Network';

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $orderIndex = 0;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $isActive = true;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    /** @var Collection<int, Program> */
    #[ORM\OneToMany(targetEntity: Program::class, mappedBy: 'formation', cascade: ['persist'], orphanRemoval: true)]
    #[ORM\OrderBy(['orderIndex' => 'ASC'])]
    private Collection $programs;

    public function __construct()
    {
        $this->programs = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?string { return $this->id; }
    public function setId(string $id): static { $this->id = $id; return $this; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getNameEn(): ?string { return $this->nameEn; }
    public function setNameEn(string $nameEn): static { $this->nameEn = $nameEn; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getDescriptionEn(): ?string { return $this->descriptionEn; }
    public function setDescriptionEn(?string $descriptionEn): static { $this->descriptionEn = $descriptionEn; return $this; }

    public function getAccentColor(): string { return $this->accentColor; }
    public function setAccentColor(string $accentColor): static { $this->accentColor = $accentColor; return $this; }

    public function getIcon(): string { return $this->icon; }
    public function setIcon(string $icon): static { $this->icon = $icon; return $this; }

    public function getOrderIndex(): int { return $this->orderIndex; }
    public function setOrderIndex(int $orderIndex): static { $this->orderIndex = $orderIndex; return $this; }

    public function getIsActive(): bool { return $this->isActive; }
    public function setIsActive(bool $isActive): static { $this->isActive = $isActive; return $this; }

    /** @return Collection<int, Program> */
    public function getPrograms(): Collection { return $this->programs; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'name' => $lang === 'en' ? $this->nameEn : $this->name,
            'description' => $lang === 'en' ? $this->descriptionEn : $this->description,
            'accentColor' => $this->accentColor,
            'icon' => $this->icon,
            'orderIndex' => $this->orderIndex,
            'isActive' => $this->isActive,
            'programs' => array_map(fn(Program $p) => $p->toArray($lang), $this->programs->toArray()),
        ];
    }
}
