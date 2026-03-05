<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class QuizQuestion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Chapter::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Chapter $chapter = null;

    #[ORM\Column(type: 'text')]
    private ?string $question = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $questionEn = null;

    #[ORM\Column(type: 'json')]
    private array $options = [];

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $optionsEn = null;

    #[ORM\Column(type: 'integer')]
    private int $correctIndex = 0;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $explanation = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $explanationEn = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $orderIndex = 0;

    public function getId(): ?int { return $this->id; }

    public function getChapter(): ?Chapter { return $this->chapter; }
    public function setChapter(?Chapter $chapter): static { $this->chapter = $chapter; return $this; }

    public function getQuestion(): ?string { return $this->question; }
    public function setQuestion(string $question): static { $this->question = $question; return $this; }

    public function getQuestionEn(): ?string { return $this->questionEn; }
    public function setQuestionEn(?string $questionEn): static { $this->questionEn = $questionEn; return $this; }

    public function getOptions(): array { return $this->options; }
    public function setOptions(array $options): static { $this->options = $options; return $this; }

    public function getOptionsEn(): ?array { return $this->optionsEn; }
    public function setOptionsEn(?array $optionsEn): static { $this->optionsEn = $optionsEn; return $this; }

    public function getCorrectIndex(): int { return $this->correctIndex; }
    public function setCorrectIndex(int $correctIndex): static { $this->correctIndex = $correctIndex; return $this; }

    public function getExplanation(): ?string { return $this->explanation; }
    public function setExplanation(?string $explanation): static { $this->explanation = $explanation; return $this; }

    public function getExplanationEn(): ?string { return $this->explanationEn; }
    public function setExplanationEn(?string $explanationEn): static { $this->explanationEn = $explanationEn; return $this; }

    public function getOrderIndex(): int { return $this->orderIndex; }
    public function setOrderIndex(int $orderIndex): static { $this->orderIndex = $orderIndex; return $this; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'question' => $lang === 'en' ? ($this->questionEn ?? $this->question) : $this->question,
            'options' => $lang === 'en' ? ($this->optionsEn ?? $this->options) : $this->options,
            'correctIndex' => $this->correctIndex,
            'explanation' => $lang === 'en' ? ($this->explanationEn ?? $this->explanation) : $this->explanation,
        ];
    }
}
