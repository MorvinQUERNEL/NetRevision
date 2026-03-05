<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class ChapterSection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Chapter::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Chapter $chapter = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $titleEn = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $content = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $contentEn = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $orderIndex = 0;

    public function getId(): ?int { return $this->id; }

    public function getChapter(): ?Chapter { return $this->chapter; }
    public function setChapter(?Chapter $chapter): static { $this->chapter = $chapter; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(?string $title): static { $this->title = $title; return $this; }

    public function getTitleEn(): ?string { return $this->titleEn; }
    public function setTitleEn(?string $titleEn): static { $this->titleEn = $titleEn; return $this; }

    public function getContent(): ?string { return $this->content; }
    public function setContent(?string $content): static { $this->content = $content; return $this; }

    public function getContentEn(): ?string { return $this->contentEn; }
    public function setContentEn(?string $contentEn): static { $this->contentEn = $contentEn; return $this; }

    public function getOrderIndex(): int { return $this->orderIndex; }
    public function setOrderIndex(int $orderIndex): static { $this->orderIndex = $orderIndex; return $this; }

    public function toArray(string $lang = 'fr'): array
    {
        return [
            'id' => $this->id,
            'title' => $lang === 'en' ? ($this->titleEn ?? $this->title) : $this->title,
            'content' => $lang === 'en' ? ($this->contentEn ?? $this->content) : $this->content,
            'orderIndex' => $this->orderIndex,
        ];
    }
}
