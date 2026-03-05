<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\BadgeService;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpClient\HttpClient;

class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepo,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager,
        private BadgeService $badgeService,
        private EmailService $emailService,
    ) {}

    #[Route('/api/register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'], $data['password'], $data['firstName'], $data['lastName'])) {
            return $this->json(['error' => 'Champs requis: email, password, firstName, lastName'], 400);
        }

        $email = trim(strtolower($data['email']));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Email invalide'], 400);
        }

        if (strlen($data['password']) < 6) {
            return $this->json(['error' => 'Le mot de passe doit contenir au moins 6 caractères'], 400);
        }

        if ($this->userRepo->findOneBy(['email' => $email])) {
            return $this->json(['error' => 'Cet email est déjà utilisé'], 409);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName(trim($data['firstName']));
        $user->setLastName(trim($data['lastName']));
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setAuthProvider('email');

        if (!empty($data['pseudo'])) {
            $pseudo = trim($data['pseudo']);
            if (strlen($pseudo) >= 3 && strlen($pseudo) <= 30) {
                $user->setPseudo($pseudo);
            }
        }

        if (isset($data['newsletterOptIn'])) {
            $user->setNewsletterOptIn((bool)$data['newsletterOptIn']);
        }

        $this->em->persist($user);
        $this->em->flush();

        $this->emailService->sendWelcome($user);

        $token = $this->jwtManager->create($user);

        return $this->json([
            'token' => $token,
            'user' => $user->toArray(),
        ], 201);
    }

    #[Route('/api/login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'Email et mot de passe requis'], 400);
        }

        $user = $this->userRepo->findOneBy(['email' => trim(strtolower($data['email']))]);

        if (!$user || !$user->getPassword()) {
            return $this->json(['error' => 'Identifiants invalides'], 401);
        }

        if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Identifiants invalides'], 401);
        }

        if (!$user->isActive()) {
            return $this->json(['error' => 'Compte désactivé'], 403);
        }

        // Update login streak
        $this->updateLoginStreak($user);
        $user->setLastLoginAt(new \DateTimeImmutable());
        $this->em->flush();

        // Check for badges (first-login, streak)
        $this->badgeService->checkAndAward($user);

        $token = $this->jwtManager->create($user);

        return $this->json([
            'token' => $token,
            'user' => $user->toArray(),
        ]);
    }

    #[Route('/api/oauth/google/callback', methods: ['POST'])]
    public function googleCallback(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['credential'])) {
            return $this->json(['error' => 'Token Google requis'], 400);
        }

        // Verify Google token
        $googleData = $this->verifyGoogleToken($data['credential']);
        if (!$googleData) {
            return $this->json(['error' => 'Token Google invalide'], 401);
        }

        $email = strtolower($googleData['email']);
        $user = $this->userRepo->findOneBy(['email' => $email]);

        if (!$user) {
            // Create new user
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($googleData['given_name'] ?? 'Utilisateur');
            $user->setLastName($googleData['family_name'] ?? '');
            $user->setAvatarUrl($googleData['picture'] ?? null);
            $user->setGoogleId($googleData['sub']);
            $user->setAuthProvider('google');
            $this->em->persist($user);
            $this->em->flush();
            $this->emailService->sendWelcome($user);
        } else {
            // Update Google info
            $user->setGoogleId($googleData['sub']);
            if ($googleData['picture'] ?? null) {
                $user->setAvatarUrl($googleData['picture']);
            }
        }

        $this->updateLoginStreak($user);
        $user->setLastLoginAt(new \DateTimeImmutable());
        $this->em->flush();

        $this->badgeService->checkAndAward($user);

        $token = $this->jwtManager->create($user);

        return $this->json([
            'token' => $token,
            'user' => $user->toArray(),
        ]);
    }

    #[Route('/api/me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        return $this->json(['user' => $user->toArray()]);
    }

    #[Route('/api/me/password', methods: ['PUT'])]
    public function updatePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['currentPassword'], $data['newPassword'])) {
            return $this->json(['error' => 'Mot de passe actuel et nouveau requis'], 400);
        }

        if ($user->getAuthProvider() !== 'email') {
            return $this->json(['error' => 'Impossible de changer le mot de passe pour un compte Google'], 400);
        }

        if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
            return $this->json(['error' => 'Mot de passe actuel incorrect'], 401);
        }

        if (strlen($data['newPassword']) < 6) {
            return $this->json(['error' => 'Le nouveau mot de passe doit contenir au moins 6 caractères'], 400);
        }

        $user->setPassword($this->passwordHasher->hashPassword($user, $data['newPassword']));
        $this->em->flush();

        return $this->json(['message' => 'Mot de passe modifié']);
    }

    #[Route('/api/me/newsletter', methods: ['PUT'])]
    public function updateNewsletter(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);
        $user->setNewsletterOptIn((bool)($data['newsletterOptIn'] ?? false));
        $this->em->flush();
        return $this->json(['user' => $user->toArray()]);
    }

    #[Route('/api/me/pseudo', methods: ['PUT'])]
    public function updatePseudo(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['pseudo'])) {
            return $this->json(['error' => 'Pseudo requis'], 400);
        }

        $pseudo = trim($data['pseudo']);
        if (strlen($pseudo) < 3 || strlen($pseudo) > 30) {
            return $this->json(['error' => 'Le pseudo doit contenir entre 3 et 30 caractères'], 400);
        }

        $user->setPseudo($pseudo);
        $this->em->flush();

        return $this->json(['user' => $user->toArray()]);
    }

    private function updateLoginStreak(User $user): void
    {
        $lastLogin = $user->getLastLoginDate();
        $today = new \DateTimeImmutable('today');

        if (!$lastLogin) {
            $user->setLoginStreak(1);
        } else {
            $yesterday = new \DateTimeImmutable('yesterday');
            $lastLoginDay = $lastLogin->format('Y-m-d');

            if ($lastLoginDay === $today->format('Y-m-d')) {
                // Already logged in today, no change
                return;
            } elseif ($lastLoginDay === $yesterday->format('Y-m-d')) {
                $user->setLoginStreak($user->getLoginStreak() + 1);
            } else {
                $user->setLoginStreak(1);
            }
        }

        $user->setLastLoginDate($today);
    }

    private function verifyGoogleToken(string $credential): ?array
    {
        try {
            $client = HttpClient::create();
            $response = $client->request('GET', 'https://oauth2.googleapis.com/tokeninfo?id_token=' . $credential);

            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $data = $response->toArray();
            $clientId = $this->getParameter('app.google_client_id') ?? $_ENV['GOOGLE_CLIENT_ID'] ?? '';

            if ($data['aud'] !== $clientId) {
                return null;
            }

            return $data;
        } catch (\Exception) {
            return null;
        }
    }
}
