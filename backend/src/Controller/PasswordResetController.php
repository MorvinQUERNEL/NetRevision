<?php

namespace App\Controller;

use App\Entity\PasswordResetToken;
use App\Repository\PasswordResetTokenRepository;
use App\Repository\UserRepository;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class PasswordResetController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepo,
        private PasswordResetTokenRepository $tokenRepo,
        private UserPasswordHasherInterface $passwordHasher,
        private EmailService $emailService,
    ) {}

    #[Route('/api/password/forgot', methods: ['POST'])]
    public function forgot(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'])) {
            return $this->json(['error' => 'Email requis'], 400);
        }

        $email = trim(strtolower($data['email']));
        $user = $this->userRepo->findOneBy(['email' => $email]);

        // Always return 200 for security (don't reveal if email exists)
        if ($user && $user->getAuthProvider() === 'email') {
            $token = new PasswordResetToken();
            $token->setUser($user);
            $this->em->persist($token);
            $this->em->flush();

            $this->emailService->sendPasswordReset($user, $token->getToken());
        }

        return $this->json(['message' => 'Si cet email existe, un lien de réinitialisation a été envoyé.']);
    }

    #[Route('/api/password/reset', methods: ['POST'])]
    public function reset(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['token'], $data['password'])) {
            return $this->json(['error' => 'Token et nouveau mot de passe requis'], 400);
        }

        if (strlen($data['password']) < 6) {
            return $this->json(['error' => 'Le mot de passe doit contenir au moins 6 caractères'], 400);
        }

        $token = $this->tokenRepo->findValidByToken($data['token']);

        if (!$token) {
            return $this->json(['error' => 'Lien invalide ou expiré'], 400);
        }

        $user = $token->getUser();
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $token->setUsed(true);

        $this->em->flush();

        return $this->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }
}
