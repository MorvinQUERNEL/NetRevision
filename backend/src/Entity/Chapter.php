<?php

namespace App\Entity;

use App\Repository\ChapterRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChapterRepository::class)]
class Chapter
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $subtitle = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $icon = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $color = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $duration = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $level = null;

    #[ORM\Column(name: 'video_id', length: 50, nullable: true)]
    private ?string $videoId = null;

    #[ORM\Column(name: 'video_id_en', length: 50, nullable: true)]
    private ?string $videoIdEn = null;

    #[ORM\Column(type: 'integer')]
    private int $orderIndex = 0;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $program = null;

    #[ORM\Column(length: 20, options: ['default' => 'reseaux'])]
    private string $formation = 'reseaux';

    #[ORM\ManyToOne(targetEntity: Program::class)]
    #[ORM\JoinColumn(name: 'program_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Program $programEntity = null;

    /** @var Collection<int, Progress> */
    #[ORM\OneToMany(targetEntity: Progress::class, mappedBy: 'chapter')]
    private Collection $progressRecords;

    public function __construct()
    {
        $this->progressRecords = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(string $slug): static { $this->slug = $slug; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }

    public function getSubtitle(): ?string { return $this->subtitle; }
    public function setSubtitle(?string $subtitle): static { $this->subtitle = $subtitle; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getIcon(): ?string { return $this->icon; }
    public function setIcon(?string $icon): static { $this->icon = $icon; return $this; }

    public function getColor(): ?string { return $this->color; }
    public function setColor(?string $color): static { $this->color = $color; return $this; }

    public function getDuration(): ?string { return $this->duration; }
    public function setDuration(?string $duration): static { $this->duration = $duration; return $this; }

    public function getLevel(): ?string { return $this->level; }
    public function setLevel(?string $level): static { $this->level = $level; return $this; }

    public function getVideoId(): ?string { return $this->videoId; }
    public function setVideoId(?string $videoId): static { $this->videoId = $videoId; return $this; }

    public function getVideoIdEn(): ?string { return $this->videoIdEn; }
    public function setVideoIdEn(?string $videoIdEn): static { $this->videoIdEn = $videoIdEn; return $this; }

    public function getOrderIndex(): int { return $this->orderIndex; }
    public function setOrderIndex(int $orderIndex): static { $this->orderIndex = $orderIndex; return $this; }

    public function getProgram(): ?string { return $this->program; }
    public function setProgram(?string $program): static { $this->program = $program; return $this; }

    public function getFormation(): string { return $this->formation; }
    public function setFormation(string $formation): static { $this->formation = $formation; return $this; }

    public function getProgramEntity(): ?Program { return $this->programEntity; }
    public function setProgramEntity(?Program $programEntity): static { $this->programEntity = $programEntity; return $this; }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'duration' => $this->duration,
            'level' => $this->level,
            'videoId' => $this->videoId,
            'videoIdEn' => $this->videoIdEn,
            'orderIndex' => $this->orderIndex,
            'program' => $this->program,
            'formation' => $this->formation,
            'programId' => $this->programEntity?->getId(),
        ];
    }
}
