<?php

namespace App\Entity;

use App\Repository\ProgressRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProgressRepository::class)]
#[ORM\Table(name: 'progress')]
#[ORM\UniqueConstraint(name: 'user_chapter_unique', columns: ['user_id', 'chapter_id'])]
#[ORM\HasLifecycleCallbacks]
class Progress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'progressRecords')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Chapter::class, inversedBy: 'progressRecords')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Chapter $chapter = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $courseCompleted = false;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $quizScore = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $quizCompletedAt = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $examScore = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $examPassed = false;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $examCompletedAt = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $flashcardsReviewed = 0;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getChapter(): ?Chapter
    {
        return $this->chapter;
    }

    public function setChapter(?Chapter $chapter): static
    {
        $this->chapter = $chapter;
        return $this;
    }

    public function isCourseCompleted(): bool
    {
        return $this->courseCompleted;
    }

    public function setCourseCompleted(bool $courseCompleted): static
    {
        $this->courseCompleted = $courseCompleted;
        return $this;
    }

    public function getQuizScore(): ?int
    {
        return $this->quizScore;
    }

    public function setQuizScore(?int $quizScore): static
    {
        $this->quizScore = $quizScore;
        return $this;
    }

    public function getQuizCompletedAt(): ?\DateTimeImmutable
    {
        return $this->quizCompletedAt;
    }

    public function setQuizCompletedAt(?\DateTimeImmutable $quizCompletedAt): static
    {
        $this->quizCompletedAt = $quizCompletedAt;
        return $this;
    }

    public function getExamScore(): ?int
    {
        return $this->examScore;
    }

    public function setExamScore(?int $examScore): static
    {
        $this->examScore = $examScore;
        return $this;
    }

    public function isExamPassed(): bool
    {
        return $this->examPassed;
    }

    public function setExamPassed(bool $examPassed): static
    {
        $this->examPassed = $examPassed;
        return $this;
    }

    public function getExamCompletedAt(): ?\DateTimeImmutable
    {
        return $this->examCompletedAt;
    }

    public function setExamCompletedAt(?\DateTimeImmutable $examCompletedAt): static
    {
        $this->examCompletedAt = $examCompletedAt;
        return $this;
    }

    public function getFlashcardsReviewed(): int
    {
        return $this->flashcardsReviewed;
    }

    public function setFlashcardsReviewed(int $flashcardsReviewed): static
    {
        $this->flashcardsReviewed = $flashcardsReviewed;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'chapterSlug' => $this->chapter?->getSlug(),
            'chapterTitle' => $this->chapter?->getTitle(),
            'courseCompleted' => $this->courseCompleted,
            'quizScore' => $this->quizScore,
            'quizCompletedAt' => $this->quizCompletedAt?->format('c'),
            'examScore' => $this->examScore,
            'examPassed' => $this->examPassed,
            'examCompletedAt' => $this->examCompletedAt?->format('c'),
            'flashcardsReviewed' => $this->flashcardsReviewed,
            'updatedAt' => $this->updatedAt?->format('c'),
        ];
    }
}
