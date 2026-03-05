<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(nullable: true)]
    private ?string $password = null;

    #[ORM\Column(length: 100)]
    private ?string $firstName = null;

    #[ORM\Column(length: 100)]
    private ?string $lastName = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $pseudo = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $avatarUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $googleId = null;

    #[ORM\Column(length: 20, options: ['default' => 'email'])]
    private string $authProvider = 'email';

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(options: ['default' => true])]
    private bool $isActive = true;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $totalPoints = 0;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $loginStreak = 0;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastLoginDate = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastLoginAt = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastInactivityEmailAt = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $newsletterOptIn = false;

    /** @var Collection<int, Progress> */
    #[ORM\OneToMany(targetEntity: Progress::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $progressRecords;

    /** @var Collection<int, UserBadge> */
    #[ORM\OneToMany(targetEntity: UserBadge::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $userBadges;

    /** @var Collection<int, Note> */
    #[ORM\OneToMany(targetEntity: Note::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $notes;

    public function __construct()
    {
        $this->progressRecords = new ArrayCollection();
        $this->userBadges = new ArrayCollection();
        $this->notes = new ArrayCollection();
    }

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

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void {}

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(?string $pseudo): static
    {
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }

    public function setAvatarUrl(?string $avatarUrl): static
    {
        $this->avatarUrl = $avatarUrl;
        return $this;
    }

    public function getGoogleId(): ?string
    {
        return $this->googleId;
    }

    public function setGoogleId(?string $googleId): static
    {
        $this->googleId = $googleId;
        return $this;
    }

    public function getAuthProvider(): string
    {
        return $this->authProvider;
    }

    public function setAuthProvider(string $authProvider): static
    {
        $this->authProvider = $authProvider;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;
        return $this;
    }

    public function getTotalPoints(): int
    {
        return $this->totalPoints;
    }

    public function setTotalPoints(int $totalPoints): static
    {
        $this->totalPoints = $totalPoints;
        return $this;
    }

    public function addPoints(int $points): static
    {
        $this->totalPoints += $points;
        return $this;
    }

    public function getLoginStreak(): int
    {
        return $this->loginStreak;
    }

    public function setLoginStreak(int $loginStreak): static
    {
        $this->loginStreak = $loginStreak;
        return $this;
    }

    public function getLastLoginDate(): ?\DateTimeImmutable
    {
        return $this->lastLoginDate;
    }

    public function setLastLoginDate(?\DateTimeImmutable $lastLoginDate): static
    {
        $this->lastLoginDate = $lastLoginDate;
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

    public function getLastLoginAt(): ?\DateTimeImmutable
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeImmutable $lastLoginAt): static
    {
        $this->lastLoginAt = $lastLoginAt;
        return $this;
    }

    public function getLastInactivityEmailAt(): ?\DateTimeImmutable
    {
        return $this->lastInactivityEmailAt;
    }

    public function setLastInactivityEmailAt(?\DateTimeImmutable $lastInactivityEmailAt): static
    {
        $this->lastInactivityEmailAt = $lastInactivityEmailAt;
        return $this;
    }

    public function getNewsletterOptIn(): bool
    {
        return $this->newsletterOptIn;
    }

    public function setNewsletterOptIn(bool $optIn): static
    {
        $this->newsletterOptIn = $optIn;
        return $this;
    }

    /** @return Collection<int, Progress> */
    public function getProgressRecords(): Collection
    {
        return $this->progressRecords;
    }

    /** @return Collection<int, UserBadge> */
    public function getUserBadges(): Collection
    {
        return $this->userBadges;
    }

    /** @return Collection<int, Note> */
    public function getNotes(): Collection
    {
        return $this->notes;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id?->toRfc4122(),
            'email' => $this->email,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'pseudo' => $this->pseudo,
            'avatarUrl' => $this->avatarUrl,
            'authProvider' => $this->authProvider,
            'totalPoints' => $this->totalPoints,
            'loginStreak' => $this->loginStreak,
            'createdAt' => $this->createdAt?->format('c'),
            'lastLoginAt' => $this->lastLoginAt?->format('c'),
            'newsletterOptIn' => $this->newsletterOptIn,
        ];
    }
}
