<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Flashcard
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Formation::class)]
    #[ORM\JoinColumn(name: 'formation_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Formation $formation = null;

    #[ORM\Column(type: 'text')]
    private ?string $question = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $questionEn = null;

    #[ORM\Column(type: 'text')]
    private ?string $answer = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $answerEn = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $category = null;

    #[ORM\Column(length: 20, options: ['default' => 'medium'])]
    private string $difficulty = 'medium';

    public function getId(): ?int { return $this->id; }

    public function getFormation(): ?Formation { return $this->formation; }
    public function setFormation(?Formation $formation): static { $this->formation = $formation; return $this; }

    public function getQuestion(): ?string { return $this->question; }
    public function setQuestion(string $question): static { $this->question = $question; return $this; }

    public function getQuestionEn(): ?string { return $this->questionEn; }
    public function setQuestionEn(?string $questionEn): static { $this->questionEn = $questionEn; return $this; }

    public function getAnswer(): ?string { return $this->answer; }
    public function setAnswer(string $answer): static { $this->answer = $answer; return $this; }

    public function getAnswerEn(): ?string { return $this->answerEn; }
    public function setAnswerEn(?string $answerEn): static { $this->answerEn = $answerEn; return $this; }

    public function getCategory(): ?string { return $this->category; }
    public function setCategory(?string $category): static { $this->category = $category; return $this; }

    public function getDifficulty(): string { return $this->difficulty; }
    public function setDifficulty(string $difficulty): static { $this->difficulty = $difficulty; return $this; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'question' => $lang === 'en' ? ($this->questionEn ?? $this->question) : $this->question,
            'answer' => $lang === 'en' ? ($this->answerEn ?? $this->answer) : $this->answer,
            'category' => $this->category,
            'difficulty' => $this->difficulty,
        ];
    }
}
