# NetRevision

Plateforme SaaS multi-formation de revision interactive pour les certifications IT.

**URL** : [https://netrevision.fr](https://netrevision.fr)

---

## Formations disponibles

| Formation | Chapitres | Programmes | Contenu |
|-----------|-----------|------------|---------|
| **Reseaux / CCNA** | 49 | 6 | Modele OSI, TCP/IP, VLAN, Routage, Subnetting, Securite, SDN, Wi-Fi 6, BGP, MPLS... |
| **Admin Systeme & DevOps** | 38 | 6 | Linux, Docker, Kubernetes, Terraform, CI/CD, Prometheus, ELK, SRE... |

**87 chapitres** au total, tous bilingues FR/EN.

---

## Stack technique

### Frontend
- **React 19** + **TypeScript 5.9**
- **Vite 7** (build)
- **Zustand** (state management — 10 stores)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- Design system custom dark/light avec CSS variables (zero Tailwind, zero CSS modules)

### Backend
- **Symfony 7.1** + **PHP 8.3**
- **Doctrine ORM** + **MySQL 8.0** (Docker)
- **LexikJWT** (authentification RS256 4096 bits)
- **NelmioCORS**
- **Symfony Mailer** (SMTP)

### Infrastructure
- **VPS** Ubuntu 24.04 (Nginx + PHP-FPM + Docker MySQL)
- **Cloudflare** (CDN, proxy DNS, SSL Full Strict)
- **Hebergement mutualise** (fallback IPv6, frontend statique)

---

## Architecture du projet

```
netrevision/
|-- src/                          # Frontend principal (React + TypeScript)
|   |-- main.tsx                  # Point d'entree
|   |-- App.tsx                   # Routes (~60 pages) + ProtectedRoute
|   |-- index.css                 # Variables CSS globales + theme dark/light
|   |-- components/               # 14 composants reutilisables
|   |   |-- Navbar.tsx            # Navigation fixe + dropdowns Outils/Jeux/Plus
|   |   |-- Footer.tsx            # Footer global
|   |   |-- FormationLayout.tsx   # Layout /:formation — validation + sync store + CSS vars
|   |   |-- FormationSwitcher.tsx # Toggle pill Reseaux/DevOps
|   |   |-- TerminalEmulator.tsx  # Terminal interactif (Cisco IOS + bash/docker/kubectl)
|   |   |-- Quiz.tsx              # Composant quiz reutilisable
|   |   |-- SearchModal.tsx       # Recherche globale
|   |   |-- SEO.tsx               # Meta tags dynamiques (react-helmet-async)
|   |   +-- ...
|   |-- pages/                    # 60+ pages
|   |-- data/                     # Donnees statiques FR
|   |   |-- chapters.ts ... chapters6.ts      # 49 chapitres Reseaux (6 programmes)
|   |   |-- chapters_en.ts ... chapters6_en.ts # Versions anglaises
|   |   |-- quizzes.ts ... quizzes6.ts        # QCM (10 questions/chapitre)
|   |   |-- finalExam.ts ... finalExam6.ts    # Examens finaux (50 questions/programme)
|   |   |-- megaExam.ts                       # Examen global (~100 exercices, 8 types)
|   |   |-- ciscoCommands.ts                  # Registre commandes Cisco IOS
|   |   |-- cliLabs.ts                        # Scenarios labs CLI guides
|   |   |-- glossaryTerms.ts                  # 149 termes reseau
|   |   |-- protocols.ts                      # 25+ protocoles (comparateur)
|   |   |-- miniGamesData.ts                  # Niveaux grille, ports, headers
|   |   |-- ctfChallenges.ts                  # 15-20 defis CTF
|   |   |-- blogArticles.ts                   # 116 articles blog
|   |   +-- devops/                           # Donnees DevOps (38 chapitres)
|   |       |-- chapters1.ts ... chapters6.ts
|   |       |-- quizzes1.ts ... quizzes6.ts
|   |       |-- finalExam1.ts ... finalExam6.ts
|   |       |-- glossaryTerms.ts, flashcardsData.ts, cliLabs.ts
|   |       +-- *_en.ts (versions anglaises)
|   |-- hooks/
|   |   +-- useTranslation.ts     # i18n custom + hooks formation-aware
|   |-- stores/                   # 10 stores Zustand
|   |   |-- authStore.ts          # Auth (JWT, login/logout, Google OAuth)
|   |   |-- progressStore.ts      # Progression par chapitre
|   |   |-- formationStore.ts     # Formation courante + registre dynamique
|   |   |-- langStore.ts          # Langue FR/EN
|   |   |-- themeStore.ts         # Dark/Light mode
|   |   +-- ...
|   |-- formations/               # Config par formation (SaaS)
|   |   |-- reseaux.ts            # Config Reseaux (tools, games, colors, programs...)
|   |   +-- devops.ts             # Config DevOps
|   +-- services/
|       +-- api.ts                # Client HTTP avec JWT auto
|
|-- backend/                      # API Symfony 7.1
|   |-- src/
|   |   |-- Entity/               # 7 entites Doctrine
|   |   |   |-- User.php          # UUID, email, password, OAuth, points, streak
|   |   |   |-- Progress.php      # Progression cours/quiz/examen par chapitre
|   |   |   |-- Chapter.php       # Chapitre (slug, formation, programme)
|   |   |   |-- Badge.php         # 28 badges
|   |   |   |-- UserBadge.php     # Relation user-badge
|   |   |   |-- Note.php          # Notes personnelles
|   |   |   +-- PasswordResetToken.php
|   |   |-- Controller/           # 7 controleurs REST
|   |   |   |-- AuthController.php       # Login, Register, Google OAuth
|   |   |   |-- ProgressController.php   # CRUD progression
|   |   |   |-- NoteController.php       # CRUD notes
|   |   |   |-- BadgeController.php      # Liste badges
|   |   |   |-- LeaderboardController.php # Top 50, rang
|   |   |   |-- StatsController.php      # Stats globales
|   |   |   +-- PasswordResetController.php
|   |   |-- Service/
|   |   |   |-- PointsService.php   # Calcul des points
|   |   |   |-- BadgeService.php    # Attribution auto des 28 badges
|   |   |   +-- EmailService.php    # 5 types d'emails (bienvenue, badge, recap...)
|   |   |-- Repository/
|   |   +-- Command/              # Commandes cron
|   |       |-- WeeklySummaryCommand.php
|   |       +-- InactivityReminderCommand.php
|   |-- config/
|   |   |-- jwt/                  # Cles RSA (gitignore)
|   |   +-- packages/             # security.yaml, doctrine.yaml, mailer.yaml
|   +-- .env.example              # Template de configuration
|
|-- frontend/                     # Copie miroir de src/ (nginx sert frontend/dist/)
|-- docker-compose.yml            # MySQL 8.0
|-- vite.config.ts
|-- tsconfig.json
+-- index.html                    # SPA entry point
```

---

## Fonctionnalites

### Apprentissage
- **87 chapitres** interactifs avec sections, code, tableaux, schemas ASCII
- **870+ questions** QCM (10 par chapitre) avec melange Fisher-Yates
- **6 examens finaux** par formation (50 questions, seuil 70%)
- **Examen global** (~100 exercices, 8 types de questions, ~2h)
- **Flashcards** avec revision espacee (algorithme SM-2)
- **Glossaire** interactif (149 termes reseaux, ~100 termes DevOps)
- **Fiches PDF** exportables
- **Videos YouTube** integrees (FR + EN)

### Simulateurs & Outils
- **Terminal CLI** interactif — mode Cisco IOS (5 modes, machine a etats) + mode DevOps (bash/docker/kubectl)
- **Labs CLI guides** avec objectifs et validation
- **Calculatrice subnetting** IP
- **Exercices subnetting** interactifs
- **Comparateur de protocoles** side-by-side
- **Generateur de plan d'adressage** VLSM
- **Visualiseur d'encapsulation** OSI (5 scenarios)
- **Schemas reseau** drag-and-drop

### Gamification
- **Systeme de points** (cours +10, quiz score*0.5, parfait +20 bonus, examen +100)
- **28 badges** attribues automatiquement
- **Leaderboard** top 50
- **Streak** de connexion quotidienne
- **15 niveaux XP** (Novice a Legende)
- **Mode Survie** (3 vies, difficulte progressive)
- **Mode Duel** vs IA
- **Mini-jeux** (Route the Packet, Match the Port, Build the Header)
- **CTF Challenges** (15-20 defis, 4 niveaux)
- **Defis hebdomadaires**
- **Paris de points** sur les quiz

### Social
- **Forum/commentaires** par chapitre
- **Quiz communautaires** (creer, jouer, parcourir)
- **Partage de progression**
- **Blog** avec 116 articles (SEO)

### Multi-formation SaaS
- **Architecture registre dynamique** : `Map<string, FormationConfig>` + `registerFormation()`
- **Routing** `/:formation/*` avec validation et sync automatique
- **Theme dynamique** : accent vert (reseaux) / bleu (devops) via CSS variables
- **Hooks formation-aware** : `useChapters()`, `useQuizzes()`, etc. retournent les donnees de la formation active

---

## Systeme de routing

### Routes publiques (sans authentification)
```
/                          Landing page (non-auth) | Redirect formation (auth)
/login, /register          Authentification
/blog, /blog/:slug         Articles blog (SEO)
/a-propos, /auteur         Pages statiques
/:formation                Grille des chapitres
/:formation/cours/:slug    Lecteur de cours
```

### Routes protegees (JWT requis)
```
/:formation/quiz/:slug     Quiz (10 questions)
/:formation/dashboard      Stats personnelles
/:formation/progression    Vue detaillee progression
/:formation/examens        Selection examen
/:formation/examen/:num    Examen final (50 questions)
/:formation/simulateur-cli Terminal interactif
/:formation/mini-jeux/*    Mini-jeux
/:formation/ctf/*          CTF Challenges
/leaderboard               Classement
/badges                    28 badges
/profil                    Profil utilisateur
```

---

## API Backend

### Authentification (public)
| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/api/register` | Inscription (email, mot de passe, prenom, nom) |
| POST | `/api/login` | Connexion — retourne JWT |
| POST | `/api/oauth/google/callback` | Login Google OAuth |
| POST | `/api/password/forgot` | Demande reset mot de passe |
| POST | `/api/password/reset` | Nouveau mot de passe (token) |

### Utilisateur (JWT requis)
| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/me` | Profil utilisateur |
| PUT | `/api/me/password` | Changer mot de passe |
| PUT | `/api/me/pseudo` | Changer pseudo |
| GET | `/api/progress` | Progression complete |
| POST | `/api/progress/:slug/course` | Marquer cours complete (+10 pts) |
| POST | `/api/progress/:slug/quiz` | Soumettre score quiz |
| POST | `/api/progress/:slug/exam` | Soumettre score examen |
| GET/PUT | `/api/notes/:slug` | Notes personnelles |
| GET | `/api/badges` | Tous les badges |
| GET | `/api/leaderboard` | Top 50 |

---

## Base de donnees

### Schema principal

**User** — UUID, email, password (nullable pour OAuth), firstName, lastName, pseudo, googleId, authProvider, totalPoints, loginStreak, roles JSON, newsletterOptIn

**Progress** — user_id FK, chapter_id FK, courseCompleted, quizScore, examScore, examPassed, flashcardsReviewed (UNIQUE user+chapter)

**Chapter** — slug UNIQUE, title, formation (reseaux/devops), program, orderIndex

**Badge** / **UserBadge** — 28 badges attribues automatiquement par BadgeService

**Note** — Notes personnelles par utilisateur et chapitre

---

## Theme & Design

Design dark/terminal inspire cybersecurite avec toggle dark/light mode.

### Conventions de style
- **Styling** : inline style objects + CSS variables uniquement (zero Tailwind, zero CSS modules)
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **border-radius** : aucun (esthetique angulaire)
- **Polices** : Space Grotesk (heading), Work Sans (body), JetBrains Mono (code)

### Theme Dark (defaut)
```css
--bg-primary: #080b1a
--bg-secondary: #0f1328
--accent: #00e5a0            /* vert cyan */
--text-primary: #e2e8f0
--border: #1e293b
```

### Theme Light
```css
--bg-primary: #f8fafc
--bg-secondary: #ffffff
--accent: #059669             /* emerald */
--text-primary: #0f172a
```

---

## Internationalisation (FR/EN)

- Solution custom legere via Zustand + hooks (pas de bibliotheque i18n)
- `useTranslation()` retourne `{ t(fr, en), lang }` pour les strings UI
- Hooks data formation-aware (`useChapters()`, `useQuizzes()`, etc.) retournent automatiquement les donnees dans la bonne langue ET la bonne formation
- Toggle FR/EN dans la Navbar, persiste en localStorage
- Backend reste en francais — seul le frontend change de langue

---

## SEO

- **react-helmet-async** : meta tags dynamiques par page (title, OG, Twitter, JSON-LD)
- **robots.txt** : autorise `/`, `/blog/*`, `/cours/` ; bloque `/api/` et crawlers LLM
- **sitemap.xml** : 160+ URLs publiques
- **JSON-LD** : WebSite + Organization + Article + BreadcrumbList + FAQPage
- **Google Analytics 4** + **Google Search Console** + **Bing Webmaster Tools**
- **Cloudflare CDN** avec cache optimise (no-cache sur index.html, 30d sur assets hashes)

---

## Installation locale

### Prerequisites
- Node.js 18+
- PHP 8.3+
- Composer
- Docker (pour MySQL)

### Frontend

```bash
git clone https://github.com/MorvinQUERNEL/NetRevision.git
cd NetRevision

npm install
npm run dev
```

### Backend

```bash
cp backend/.env.example backend/.env
# Editer backend/.env avec vos credentials

cd backend
composer install

# Generer les cles JWT
php bin/console lexik:jwt:generate-keypair

# Lancer MySQL
cd ..
docker compose up -d

# Executer les migrations
cd backend
php bin/console doctrine:migrations:migrate

# Lancer le serveur Symfony
symfony server:start
```

### Build production

```bash
npx tsc -b && npx vite build
# Output dans dist/
```

---

## Programmes detailles

### Reseaux / CCNA (49 chapitres)

| Programme | Chapitres | Theme |
|-----------|-----------|-------|
| P1 (1-8) | 8 | Fondamentaux : OSI, IPv4/IPv6, VLAN, Routage statique, Subnetting, DNS/DHCP |
| P2 (9-16) | 8 | Intermediaire : TCP/UDP, OSPF/RIP, ACL, NAT/PAT, VPN, SNMP, Depannage |
| P3 (17-24) | 8 | Automatisation : Python, Ansible, Cloud Networking, Kubernetes, SDN, HA |
| P4 (25-32) | 8 | Avance : QoS, IPv6 avance, MPLS, BGP, SD-WAN, Datacenter, Cybersecurite |
| P5 (33-41) | 9 | Specialisation : Wi-Fi 6, IoT, VoIP, FTP/Email, Load Balancing, WAN, Certification |
| P6 (42-49) | 8 | Expert : Design reseau, Security Infra, Cloud, Wireless Enterprise, Monitoring |

### Admin Systeme & DevOps (38 chapitres)

| Programme | Chapitres | Theme |
|-----------|-----------|-------|
| P1 (100-105) | 6 | Fondations Linux : Installation, Commandes avancees, Permissions, Systemd, Logs, Bash |
| P2 (106-112) | 7 | Reseaux, Git & Scripting : OSI/TCP-IP, DNS/HTTP, Reverse Proxy, Git, GitHub/GitLab, Python |
| P3 (113-118) | 6 | Conteneurs & Docker : Introduction, Dockerfile, Compose, Volumes/Reseaux, Securite, Production |
| P4 (119-124) | 6 | Kubernetes : Architecture, Pods/Deployments/Services, Ingress, Helm, Secrets, Scaling |
| P5 (125-130) | 6 | Cloud & IaC : Cloud Fondamentaux, AWS, Azure/GCP, Terraform, CloudFormation/Pulumi, Best Practices |
| P6 (131-137) | 7 | CI/CD, Monitoring & SRE : GitHub Actions, GitLab CI/Jenkins, Prometheus/Grafana, ELK, DevSecOps, Zero Trust, SRE |

---

## Gamification — Systeme de points

| Action | Points |
|--------|--------|
| Cours complete | +10 |
| Quiz | score * 0.5 |
| Quiz parfait (100%) | +20 bonus |
| Examen reussi (>= 70%) | +100 |
| Note creee | +5 |
| Badge debloque | +15 |

---

## Emails automatises

| Email | Declencheur | Description |
|-------|-------------|-------------|
| Bienvenue | Inscription | Email de bienvenue avec lien dashboard |
| Badge debloque | Badge obtenu | Notification nouveau(x) badge(s) |
| Resume hebdo | Cron lundi 8h | Stats de la semaine, rang, progression |
| Rappel inactivite | Cron (7j+ sans connexion) | Rappel avec encouragements |
| Reset mot de passe | Demande utilisateur | Lien de reinitialisation (token 1h) |

---

## Securite

- **JWT RS256** avec cles RSA 4096 bits (TTL 24h)
- **Firewall Symfony** : routes publiques explicites, tout le reste protege
- **Password hashing** : Argon2i (auto)
- **CORS** : origines whitelist
- **Google OAuth** : verification serveur des credentials
- **Cloudflare** : SSL Full Strict, Always HTTPS, security headers
- **Nginx** : X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

---

## Licence

Ce projet est sous licence proprietaire. Tous droits reserves.

---

**Developpe par** [Morvin Quernel](https://morvin-quernel.com)
