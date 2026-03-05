<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class GlossaryTerm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Formation::class)]
    #[ORM\JoinColumn(name: 'formation_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Formation $formation = null;

    #[ORM\Column(length: 255)]
    private ?string $term = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $termEn = null;

    #[ORM\Column(type: 'text')]
    private ?string $definition = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $definitionEn = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $category = null;

    public function getId(): ?int { return $this->id; }

    public function getFormation(): ?Formation { return $this->formation; }
    public function setFormation(?Formation $formation): static { $this->formation = $formation; return $this; }

    public function getTerm(): ?string { return $this->term; }
    public function setTerm(string $term): static { $this->term = $term; return $this; }

    public function getTermEn(): ?string { return $this->termEn; }
    public function setTermEn(?string $termEn): static { $this->termEn = $termEn; return $this; }

    public function getDefinition(): ?string { return $this->definition; }
    public function setDefinition(string $definition): static { $this->definition = $definition; return $this; }

    public function getDefinitionEn(): ?string { return $this->definitionEn; }
    public function setDefinitionEn(?string $definitionEn): static { $this->definitionEn = $definitionEn; return $this; }

    public function getCategory(): ?string { return $this->category; }
    public function setCategory(?string $category): static { $this->category = $category; return $this; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'term' => $lang === 'en' ? ($this->termEn ?? $this->term) : $this->term,
            'definition' => $lang === 'en' ? ($this->definitionEn ?? $this->definition) : $this->definition,
            'category' => $this->category,
        ];
    }
}
