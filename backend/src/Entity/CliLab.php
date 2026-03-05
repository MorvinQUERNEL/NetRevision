<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class CliLab
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Formation::class)]
    #[ORM\JoinColumn(name: 'formation_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Formation $formation = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $titleEn = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descriptionEn = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $scenario = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $scenarioEn = null;

    #[ORM\Column(length: 20, options: ['default' => 'beginner'])]
    private string $difficulty = 'beginner';

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $orderIndex = 0;

    public function getId(): ?int { return $this->id; }

    public function getFormation(): ?Formation { return $this->formation; }
    public function setFormation(?Formation $formation): static { $this->formation = $formation; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }

    public function getTitleEn(): ?string { return $this->titleEn; }
    public function setTitleEn(?string $titleEn): static { $this->titleEn = $titleEn; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getDescriptionEn(): ?string { return $this->descriptionEn; }
    public function setDescriptionEn(?string $descriptionEn): static { $this->descriptionEn = $descriptionEn; return $this; }

    public function getScenario(): ?array { return $this->scenario; }
    public function setScenario(?array $scenario): static { $this->scenario = $scenario; return $this; }

    public function getScenarioEn(): ?array { return $this->scenarioEn; }
    public function setScenarioEn(?array $scenarioEn): static { $this->scenarioEn = $scenarioEn; return $this; }

    public function getDifficulty(): string { return $this->difficulty; }
    public function setDifficulty(string $difficulty): static { $this->difficulty = $difficulty; return $this; }

    public function getOrderIndex(): int { return $this->orderIndex; }
    public function setOrderIndex(int $orderIndex): static { $this->orderIndex = $orderIndex; return $this; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'title' => $lang === 'en' ? ($this->titleEn ?? $this->title) : $this->title,
            'description' => $lang === 'en' ? ($this->descriptionEn ?? $this->description) : $this->description,
            'scenario' => $lang === 'en' ? ($this->scenarioEn ?? $this->scenario) : $this->scenario,
            'difficulty' => $this->difficulty,
            'orderIndex' => $this->orderIndex,
        ];
    }
}
