<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

class EmailService
{
    private const SITE_URL = 'https://netrevision.fr';
    private const SITE_NAME = 'NetRevision';
    private const SITE_DOMAIN = 'netrevision.fr';
    private const SITE_TAGLINE = 'Plateforme de révision CCNA';

    public function __construct(
        private MailerInterface $mailer,
        private string $mailerFrom,
    ) {}

    // =========================================================================
    // PUBLIC EMAIL METHODS
    // =========================================================================

    public function sendWelcome(User $user): void
    {
        $content = $this->sectionLabel('BIENVENUE')
            . $this->heading("Bonjour {$user->getFirstName()},")
            . $this->paragraph("Bienvenue sur <strong style=\"color:#00e5a0\">" . self::SITE_NAME . "</strong> ! Votre compte a été créé avec succès.")
            . $this->paragraph("Vous avez maintenant accès à une plateforme complète pour maîtriser les réseaux informatiques et préparer votre certification CCNA.")
            . $this->button('Accéder au Dashboard', self::SITE_URL . '/dashboard')
            . $this->divider()
            . $this->sectionLabel('CE QUI VOUS ATTEND')
            . $this->featureList([
                '49 chapitres de cours complets (6 programmes)',
                'Quiz interactifs avec scoring',
                '4 examens blancs + 1 examen global (300+ questions)',
                'Simulateur CLI Cisco interactif',
                'Exercices de subnetting',
                'Mini-jeux, CTF, mode survie et mode duel',
                'Système de badges, classement et défis',
            ]);

        $this->send(
            $user->getEmail(),
            'Bienvenue sur ' . self::SITE_NAME,
            $content,
            "Bienvenue {$user->getFirstName()} ! Votre compte " . self::SITE_NAME . " est prêt."
        );
    }

    public function sendBadgeUnlocked(User $user, array $badgeInfos): void
    {
        if (empty($badgeInfos)) {
            return;
        }

        $badgesHtml = '';
        foreach ($badgeInfos as $badge) {
            $badgesHtml .= '
                <tr>
                    <td style="padding:14px 16px; background:#161b35; border:1px solid #1e293b; border-left:3px solid #00e5a0;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                            <td width="48" style="vertical-align:middle;">
                                <div style="width:42px; height:42px; background:#080b1a; border:2px solid #00e5a0; text-align:center; line-height:42px; font-size:18px; color:#00e5a0; font-weight:bold; font-family:\'Courier New\',monospace;">&#9733;</div>
                            </td>
                            <td style="padding-left:14px; vertical-align:middle;">
                                <div style="color:#e2e8f0; font-weight:700; font-size:16px; font-family:\'Space Grotesk\',Arial,Helvetica,sans-serif; letter-spacing:-0.2px;">' . htmlspecialchars($badge['name']) . '</div>
                                <div style="color:#94a3b8; font-size:13px; font-family:Arial,Helvetica,sans-serif; margin-top:3px; line-height:1.4;">' . htmlspecialchars($badge['description']) . '</div>
                            </td>
                        </tr></table>
                    </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>';
        }

        $count = count($badgeInfos);
        $plural = $count > 1 ? 's' : '';

        $content = $this->sectionLabel("BADGE{$plural} DÉBLOQUÉ{$plural}")
            . $this->heading("Félicitations {$user->getFirstName()} !")
            . $this->paragraph("Vous avez débloqué <strong style=\"color:#00e5a0\">{$count} nouveau{$plural} badge{$plural}</strong> :")
            . '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0;">' . $badgesHtml . '</table>'
            . $this->paragraph("Votre total : <strong style=\"color:#00e5a0; font-family:'Courier New',monospace; font-size:18px;\">{$user->getTotalPoints()} pts</strong>")
            . $this->button('Voir mes badges', self::SITE_URL . '/badges');

        $this->send(
            $user->getEmail(),
            "{$count} nouveau{$plural} badge{$plural} débloqué{$plural} !",
            $content,
            "Bravo {$user->getFirstName()} ! {$count} badge{$plural} débloqué{$plural} sur " . self::SITE_NAME
        );
    }

    public function sendWeeklySummary(User $user, array $stats): void
    {
        $coursesWeek = (int)($stats['coursesThisWeek'] ?? 0);
        $quizzesWeek = (int)($stats['quizzesThisWeek'] ?? 0);
        $badgesWeek = (int)($stats['badgesThisWeek'] ?? 0);
        $rank = (int)($stats['rank'] ?? 0);

        $content = $this->sectionLabel('RÉSUMÉ HEBDOMADAIRE')
            . $this->heading("Votre semaine, {$user->getFirstName()}")
            . $this->paragraph("Voici un récapitulatif de votre activité cette semaine sur " . self::SITE_NAME . ".")
            . $this->statsGrid([
                ['value' => $coursesWeek, 'label' => 'Cours', 'color' => '#00e5a0'],
                ['value' => $quizzesWeek, 'label' => 'Quiz', 'color' => '#3b82f6'],
                ['value' => $badgesWeek, 'label' => 'Badges', 'color' => '#f59e0b'],
                ['value' => '#' . $rank, 'label' => 'Classement', 'color' => '#a855f7'],
            ])
            . $this->divider()
            . $this->sectionLabel('VOS STATS GLOBALES')
            . $this->paragraph(
                "Total points : <strong style=\"color:#00e5a0; font-family:'Courier New',monospace;\">"
                . (int)($stats['totalPoints'] ?? 0) . " pts</strong>"
                . " &bull; Cours terminés : <strong style=\"color:#e2e8f0;\">" . (int)($stats['totalCourses'] ?? 0) . "</strong>"
                . " &bull; Badges : <strong style=\"color:#e2e8f0;\">" . (int)($stats['totalBadges'] ?? 0) . "</strong>"
            )
            . $this->button('Continuer ma progression', self::SITE_URL . '/progression');

        $this->send(
            $user->getEmail(),
            'Votre résumé hebdo — ' . self::SITE_NAME,
            $content,
            "{$coursesWeek} cours, {$quizzesWeek} quiz cette semaine. Continuez comme ça !"
        );
    }

    public function sendInactivityReminder(User $user): void
    {
        $content = $this->sectionLabel('ON VOUS ATTEND')
            . $this->heading("Hey {$user->getFirstName()}, vous nous manquez !")
            . $this->paragraph("Cela fait un moment que vous ne vous êtes pas connecté à <strong style=\"color:#00e5a0;\">" . self::SITE_NAME . "</strong>. Vos cours et quiz vous attendent !")
            . $this->paragraph("Votre progression actuelle : <strong style=\"color:#00e5a0; font-family:'Courier New',monospace;\">{$user->getTotalPoints()} pts</strong>")
            . $this->paragraph("N'oubliez pas : la régularité est la clé de l'apprentissage. Revenez pour maintenir votre série de connexion !")
            . $this->button('Reprendre mes cours', self::SITE_URL . '/dashboard');

        $this->send(
            $user->getEmail(),
            'Vos cours vous attendent — ' . self::SITE_NAME,
            $content,
            "{$user->getFirstName()}, vos cours CCNA vous attendent sur " . self::SITE_NAME . " !"
        );
    }

    /**
     * Envoie le récap quotidien personnalisé à un utilisateur.
     */
    public function sendDailyRecap(User $user, array $data): void
    {
        $firstName = htmlspecialchars($data['firstName'] ?? $user->getFirstName());
        $streak = (int) ($data['streak'] ?? 0);

        // --- Greeting avec streak ---
        $streakText = $streak > 0
            ? "Streak de {$streak} jour" . ($streak > 1 ? 's' : '') . " !"
            : "C'est le moment de commencer une série !";

        $content = $this->sectionLabel('RÉCAP QUOTIDIEN')
            . $this->heading("Bonjour {$firstName} !")
            . $this->paragraph("<strong style=\"color:#f59e0b; font-family:'Courier New',monospace;\">{$streakText}</strong>")
            . $this->divider();

        // --- Chapitres à revoir (top 3) ---
        $content .= $this->sectionLabel('CHAPITRES À REVOIR');

        $weakChapters = $data['weakChapters'] ?? [];
        if (!empty($weakChapters)) {
            $chaptersHtml = '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:12px 0;">';
            foreach ($weakChapters as $chapter) {
                $title = htmlspecialchars($chapter['chapter_title']);
                $score = (int) $chapter['quiz_score'];
                $scoreColor = $score >= 80 ? '#00e5a0' : ($score >= 50 ? '#f59e0b' : '#ef4444');
                $chaptersHtml .= '
                    <tr>
                        <td style="padding:12px 16px; background:#161b35; border:1px solid #1e293b; border-left:3px solid ' . $scoreColor . ';">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                                <td style="vertical-align:middle;">
                                    <span style="color:#e2e8f0; font-size:14px; font-family:Arial,Helvetica,sans-serif; line-height:1.4;">' . $title . '</span>
                                </td>
                                <td width="80" style="text-align:right; vertical-align:middle;">
                                    <div style="display:inline-block; padding:4px 10px; background:#080b1a; border:1px solid ' . $scoreColor . ';">
                                        <span style="font-family:\'Courier New\',monospace; font-size:15px; font-weight:bold; color:' . $scoreColor . ';">' . $score . '%</span>
                                    </div>
                                </td>
                            </tr></table>
                        </td>
                    </tr>
                    <tr><td style="height:6px;"></td></tr>';
            }
            $chaptersHtml .= '</table>';
            $content .= $chaptersHtml;
        } else {
            $content .= $this->paragraph('Aucun chapitre à revoir — vous êtes au top !');
        }

        $content .= $this->divider();

        // --- Objectif du jour ---
        $content .= $this->sectionLabel('OBJECTIF DU JOUR');
        $content .= $this->highlightBox(htmlspecialchars($data['dailyGoal'] ?? 'Réviser un chapitre et obtenir 80%+'));

        $content .= $this->divider();

        // --- Stats de la semaine ---
        $coursesWeek = (int) ($data['coursesThisWeek'] ?? 0);
        $quizzesWeek = (int) ($data['quizzesThisWeek'] ?? 0);

        $content .= $this->sectionLabel('CETTE SEMAINE');
        $content .= $this->statsGrid([
            ['value' => $coursesWeek, 'label' => 'Cours', 'color' => '#00e5a0'],
            ['value' => $quizzesWeek, 'label' => 'Quiz', 'color' => '#3b82f6'],
        ]);

        // --- Stat motivante ---
        $totalQuestions = (int) ($data['totalQuestionsAnswered'] ?? 0);
        $rank = (int) ($data['rankPosition'] ?? 0);

        $content .= $this->paragraph(
            "<span style=\"color:#94a3b8;\">Vous avez répondu à </span>"
            . "<strong style=\"color:#00e5a0; font-family:'Courier New',monospace;\">{$totalQuestions} quiz</strong>"
            . "<span style=\"color:#94a3b8;\"> au total &bull; Classement : </span>"
            . "<strong style=\"color:#f59e0b; font-family:'Courier New',monospace;\">#{$rank}</strong>"
        );

        // --- Bouton CTA ---
        $content .= $this->button('Commencer la révision', self::SITE_URL . '/dashboard');

        $this->send(
            $user->getEmail(),
            'Votre récap du jour — ' . self::SITE_NAME,
            $content,
            "Bonjour {$firstName} ! Streak {$streak}j — {$coursesWeek} cours, {$quizzesWeek} quiz cette semaine."
        );
    }

    public function sendPasswordReset(User $user, string $token): void
    {
        $resetUrl = self::SITE_URL . '/reset-password?token=' . urlencode($token);

        $content = $this->sectionLabel('RÉINITIALISATION')
            . $this->heading("Réinitialisation du mot de passe")
            . $this->paragraph("Bonjour {$user->getFirstName()},")
            . $this->paragraph("Vous avez demandé la réinitialisation de votre mot de passe sur <strong style=\"color:#00e5a0;\">" . self::SITE_NAME . "</strong>. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.")
            . $this->button('Réinitialiser mon mot de passe', $resetUrl)
            . $this->divider()
            . $this->paragraph("<span style=\"color:#475569; font-size:13px;\">Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</span>");

        $this->send(
            $user->getEmail(),
            'Réinitialisation de votre mot de passe — ' . self::SITE_NAME,
            $content,
            "Réinitialisez votre mot de passe " . self::SITE_NAME . ". Ce lien expire dans 1 heure."
        );
    }

    // =========================================================================
    // CORE SEND METHOD
    // =========================================================================

    private function send(string $to, string $subject, string $htmlContent, string $preheader = ''): void
    {
        $fullHtml = $this->wrapInTemplate($subject, $htmlContent, $preheader);

        $email = (new Email())
            ->from(new Address($this->mailerFrom, self::SITE_NAME))
            ->to($to)
            ->subject($subject)
            ->html($fullHtml);

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            error_log('Email send failed: ' . $e->getMessage());
        }
    }

    // =========================================================================
    // HTML TEMPLATE
    // =========================================================================

    private function wrapInTemplate(string $title, string $content, string $preheader = ''): string
    {
        $preheaderHtml = '';
        if ($preheader !== '') {
            $preheaderHtml = '<div style="display:none;font-size:1px;color:#080b1a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">'
                . htmlspecialchars($preheader)
                . str_repeat('&nbsp;&zwnj;', 30)
                . '</div>';
        }

        return '<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>' . htmlspecialchars($title) . '</title>
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <!--<![endif]-->
    <style>
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; }
            .content-cell { padding: 24px 20px !important; }
            .header-cell { padding: 20px !important; }
            .footer-cell { padding: 20px !important; }
            .stat-cell { display: block !important; width: 100% !important; margin-bottom: 8px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#080b1a; font-family:Arial,Helvetica,sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    ' . $preheaderHtml . '
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#080b1a; padding:32px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%; background-color:#0f1328; border:1px solid #1e293b;">

                    <!-- PROGRAMME COLORS BAR -->
                    <tr>
                        <td style="font-size:0; line-height:0; height:4px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout:fixed;"><tr>
                                <td style="height:4px; background:#00e5a0;" width="16.66%"></td>
                                <td style="height:4px; background:#6366f1;" width="16.66%"></td>
                                <td style="height:4px; background:#f59e0b;" width="16.66%"></td>
                                <td style="height:4px; background:#e11d48;" width="16.66%"></td>
                                <td style="height:4px; background:#8b5cf6;" width="16.66%"></td>
                                <td style="height:4px; background:#06b6d4;" width="16.7%"></td>
                            </tr></table>
                        </td>
                    </tr>

                    <!-- HEADER -->
                    <tr>
                        <td class="header-cell" style="padding:28px 32px; border-bottom:1px solid #1e293b;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                                <td width="44">
                                    <div style="width:40px; height:40px; background-color:#00e5a0; text-align:center; line-height:40px; font-family:\'Courier New\',Courier,monospace; font-size:15px; font-weight:bold; color:#080b1a; letter-spacing:-0.5px;">NR</div>
                                </td>
                                <td style="padding-left:14px; vertical-align:middle;">
                                    <div style="font-size:20px; font-weight:700; color:#e2e8f0; font-family:\'Space Grotesk\',Arial,Helvetica,sans-serif; letter-spacing:-0.3px; line-height:1;">' . self::SITE_NAME . '</div>
                                    <div style="font-size:11px; color:#475569; font-family:\'Courier New\',monospace; margin-top:3px; letter-spacing:1px; text-transform:uppercase;">' . self::SITE_TAGLINE . '</div>
                                </td>
                                <td style="text-align:right; vertical-align:middle;">
                                    <a href="' . self::SITE_URL . '" style="display:inline-block; padding:6px 14px; border:1px solid #1e293b; font-size:11px; color:#94a3b8; font-family:\'Courier New\',monospace; text-decoration:none; letter-spacing:0.5px;">OUVRIR &rarr;</a>
                                </td>
                            </tr></table>
                        </td>
                    </tr>

                    <!-- CONTENT -->
                    <tr>
                        <td class="content-cell" style="padding:36px 32px;">
                            ' . $content . '
                        </td>
                    </tr>

                    <!-- FOOTER SEPARATOR -->
                    <tr>
                        <td style="padding:0 32px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #1e293b;"></td></tr></table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td class="footer-cell" style="padding:24px 32px 20px;">
                            <!-- Navigation -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
                                <tr>
                                    <td style="text-align:center;">
                                        <a href="' . self::SITE_URL . '/dashboard" style="display:inline-block; padding:6px 12px; margin:0 2px; border:1px solid #1e293b; font-size:11px; color:#94a3b8; font-family:\'Courier New\',monospace; text-decoration:none; letter-spacing:0.5px;">Dashboard</a>
                                        <a href="' . self::SITE_URL . '/progression" style="display:inline-block; padding:6px 12px; margin:0 2px; border:1px solid #1e293b; font-size:11px; color:#94a3b8; font-family:\'Courier New\',monospace; text-decoration:none; letter-spacing:0.5px;">Progression</a>
                                        <a href="' . self::SITE_URL . '/badges" style="display:inline-block; padding:6px 12px; margin:0 2px; border:1px solid #1e293b; font-size:11px; color:#94a3b8; font-family:\'Courier New\',monospace; text-decoration:none; letter-spacing:0.5px;">Badges</a>
                                        <a href="' . self::SITE_URL . '/leaderboard" style="display:inline-block; padding:6px 12px; margin:0 2px; border:1px solid #1e293b; font-size:11px; color:#94a3b8; font-family:\'Courier New\',monospace; text-decoration:none; letter-spacing:0.5px;">Classement</a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Brand -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="margin:0 0 6px; font-family:\'Space Grotesk\',Arial,Helvetica,sans-serif; font-size:14px; font-weight:700; color:#e2e8f0;">
                                            <a href="' . self::SITE_URL . '" style="color:#e2e8f0; text-decoration:none;">' . self::SITE_NAME . '</a>
                                        </p>
                                        <p style="margin:0 0 12px; font-size:12px; color:#475569; font-family:Arial,Helvetica,sans-serif;">
                                            Plateforme gratuite de r&eacute;vision CCNA &mdash; 49 chapitres, quiz, examens, simulateur CLI
                                        </p>
                                        <p style="margin:0; font-size:11px; color:#334155; font-family:\'Courier New\',monospace;">
                                            &copy; ' . date('Y') . ' ' . self::SITE_DOMAIN . '
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- BOTTOM ACCENT -->
                    <tr>
                        <td style="height:2px; background:#00e5a0; font-size:0; line-height:0;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
    }

    // =========================================================================
    // HTML BUILDER HELPERS (shared across all emails)
    // =========================================================================

    private function sectionLabel(string $label): string
    {
        return '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 10px;">
            <tr>
                <td>
                    <span style="font-family:\'Courier New\',Courier,monospace; font-size:11px; color:#00e5a0; text-transform:uppercase; letter-spacing:2px;">&gt; ' . htmlspecialchars($label) . '</span>
                    <div style="margin-top:6px; height:1px; background:linear-gradient(to right, #00e5a0, transparent); font-size:0; line-height:0;">
                        <table cellpadding="0" cellspacing="0" border="0" width="60"><tr><td style="height:1px; background:#00e5a0;"></td></tr></table>
                    </div>
                </td>
            </tr>
        </table>';
    }

    private function heading(string $text): string
    {
        return '<h1 style="margin:0 0 18px 0; font-size:26px; font-weight:700; color:#e2e8f0; font-family:\'Space Grotesk\',Arial,Helvetica,sans-serif; line-height:1.3; letter-spacing:-0.3px;">' . $text . '</h1>';
    }

    private function paragraph(string $html): string
    {
        return '<p style="margin:0 0 14px 0; font-size:15px; color:#94a3b8; font-family:Arial,Helvetica,sans-serif; line-height:1.7;">' . $html . '</p>';
    }

    private function button(string $label, string $url): string
    {
        return '<table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr>
            <td style="background-color:#00e5a0; padding:14px 32px; border-bottom:3px solid #00c98a;">
                <a href="' . htmlspecialchars($url) . '" style="color:#080b1a; font-family:\'Space Grotesk\',Arial,Helvetica,sans-serif; font-size:14px; font-weight:700; text-decoration:none; text-transform:uppercase; letter-spacing:1.5px;">' . htmlspecialchars($label) . ' &rarr;</a>
            </td>
        </tr></table>';
    }

    private function divider(): string
    {
        return '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;"><tr>
            <td style="font-size:0; line-height:0;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                    <td style="border-top:1px solid #1e293b;"></td>
                </tr></table>
            </td>
        </tr></table>';
    }

    private function featureList(array $items): string
    {
        $html = '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:16px 0;">';
        foreach ($items as $item) {
            $html .= '<tr>
                <td width="28" style="padding:6px 0; vertical-align:top;">
                    <div style="width:20px; height:20px; background:#161b35; border:1px solid #00e5a0; text-align:center; line-height:20px;">
                        <span style="color:#00e5a0; font-family:\'Courier New\',monospace; font-size:11px;">&#10003;</span>
                    </div>
                </td>
                <td style="padding:6px 0 6px 10px; vertical-align:middle;">
                    <span style="color:#e2e8f0; font-size:14px; font-family:Arial,Helvetica,sans-serif; line-height:1.4;">' . htmlspecialchars($item) . '</span>
                </td>
            </tr>';
        }
        $html .= '</table>';
        return $html;
    }

    /**
     * Grille de stats (2 ou 4 colonnes).
     * @param array $items [{value, label, color}, ...]
     */
    private function statsGrid(array $items): string
    {
        $count = count($items);
        $width = $count <= 2 ? '50%' : '25%';

        $html = '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0;"><tr>';
        foreach ($items as $i => $item) {
            $val = is_int($item['value']) ? (string) $item['value'] : $item['value'];
            $spacing = $i < $count - 1 ? 'padding-right:6px;' : '';
            $html .= '
                <td width="' . $width . '" style="' . $spacing . '">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td style="height:3px; background:' . $item['color'] . '; font-size:0; line-height:0;">&nbsp;</td></tr>
                        <tr>
                            <td style="padding:16px 12px; background:#161b35; border:1px solid #1e293b; border-top:none; text-align:center;">
                                <div style="font-family:\'Courier New\',monospace; font-size:30px; font-weight:bold; color:' . $item['color'] . '; line-height:1;">' . htmlspecialchars($val) . '</div>
                                <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-family:\'Courier New\',monospace; margin-top:8px;">' . htmlspecialchars($item['label']) . '</div>
                            </td>
                        </tr>
                    </table>
                </td>';
        }
        $html .= '</tr></table>';
        return $html;
    }

    /**
     * Bloc mis en avant avec bordure accent à gauche.
     */
    private function highlightBox(string $text): string
    {
        return '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:12px 0;">
            <tr>
                <td style="padding:16px 20px; background:#161b35; border-left:3px solid #00e5a0; border:1px solid #1e293b; border-left:3px solid #00e5a0;">
                    <table cellpadding="0" cellspacing="0" border="0"><tr>
                        <td width="24" style="vertical-align:top;">
                            <span style="color:#00e5a0; font-family:\'Courier New\',monospace; font-size:14px; font-weight:bold;">&gt;</span>
                        </td>
                        <td style="vertical-align:top;">
                            <span style="color:#e2e8f0; font-size:15px; font-family:Arial,Helvetica,sans-serif; line-height:1.5;">' . $text . '</span>
                        </td>
                    </tr></table>
                </td>
            </tr>
        </table>';
    }
}
