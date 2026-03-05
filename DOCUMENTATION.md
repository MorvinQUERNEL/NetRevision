# NetRevision - Documentation Technique & Plan d'Ameliorations

> Plateforme interactive de revision des fondamentaux reseaux
> URL: https://revision.quernel-cloud.com
> Version: 1.0 | Quernel Intelligence

---

## Table des matieres

1. [Presentation du projet](#1-presentation-du-projet)
2. [Architecture technique](#2-architecture-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Pages et routes](#4-pages-et-routes)
5. [Composants](#5-composants)
6. [Donnees et contenu](#6-donnees-et-contenu)
7. [Systeme de progression](#7-systeme-de-progression)
8. [Theme et design](#8-theme-et-design)
9. [Deploiement](#9-deploiement)
10. [Contenu actuel vs competences requises](#10-contenu-actuel-vs-competences-requises)
11. [Plan d'ameliorations](#11-plan-dameliorations)
12. [Roadmap](#12-roadmap)

---

## 1. Presentation du projet

**NetRevision** est une application web educative destinee aux etudiants francophones souhaitant maitriser les fondamentaux des reseaux informatiques. Elle propose des cours interactifs, des quiz QCM avec melange aleatoire des reponses, un suivi de progression sauvegarde localement, et un examen final de 50 questions.

### Fonctionnalites principales

| Fonctionnalite | Description |
|---|---|
| 8 chapitres de cours | Du modele OSI au DNS/DHCP, contenu structure par sections |
| 80 questions QCM | 10 questions par chapitre avec explications detaillees |
| Examen final | 50 questions couvrant les 8 chapitres, seuil de reussite 70% |
| Melange des reponses | Ordre aleatoire des options a chaque passage (Fisher-Yates) |
| Progression sauvegardee | LocalStorage persistant : sections lues, scores quiz, chapitres completes |
| Videos YouTube FR | Une video explicative en francais par chapitre |
| Animation generative | Canvas interactif avec particules reseau sur la page d'accueil |
| Design "Circuit Logic" | Theme sombre technique avec typographie mono/sans-serif |
| Responsive | Adapte mobile, tablette et desktop |

---

## 2. Architecture technique

### Stack technologique

| Technologie | Version | Role |
|---|---|---|
| React | 19.2.0 | Framework UI |
| TypeScript | 5.9.3 | Typage statique |
| Vite | 7.3.1 | Bundler et serveur de developpement |
| React Router DOM | 7.13.0 | Routage SPA |
| Framer Motion | 12.34.1 | Animations |
| Lucide React | 0.574.0 | Icones SVG |

### Commandes

```bash
npm run dev      # Serveur de developpement (HMR)
npm run build    # Compilation TypeScript + build Vite (dist/)
npm run preview  # Serveur de previsualisation du build
npm run lint     # Linting ESLint
```

### Configuration TypeScript

- **Target**: ES2022 (app), ES2023 (node)
- **Mode strict** active : noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch
- **JSX**: react-jsx
- **Module**: ESNext avec resolution "bundler"

---

## 3. Structure du projet

```
revision-reseaux/
├── index.html                  # Point d'entree HTML + Google Fonts
├── package.json                # Dependances et scripts
├── vite.config.ts              # Configuration Vite + plugin React
├── tsconfig.json               # Config TS racine (references)
├── tsconfig.app.json           # Config TS application
├── tsconfig.node.json          # Config TS build tooling
├── eslint.config.js            # ESLint 9 flat config
├── .gitignore                  # dist/, node_modules/
│
├── src/
│   ├── main.tsx                # Point d'entree React (BrowserRouter)
│   ├── App.tsx                 # Shell principal + routes
│   ├── index.css               # Variables CSS, theme global, grid overlay
│   ├── App.css                 # (non utilise)
│   │
│   ├── components/
│   │   ├── Navbar.tsx          # Barre de navigation fixe (56px)
│   │   ├── ChapterCard.tsx     # Carte de chapitre (accueil)
│   │   ├── Quiz.tsx            # Composant quiz reutilisable
│   │   └── NetworkCanvas.tsx   # Animation canvas generative
│   │
│   ├── pages/
│   │   ├── Home.tsx            # Page d'accueil (hero, features, chapitres, CTA examen)
│   │   ├── Course.tsx          # Lecteur de cours (sidebar + contenu)
│   │   ├── QuizPage.tsx        # Wrapper quiz par chapitre
│   │   ├── Progress.tsx        # Tableau de bord progression
│   │   └── FinalExam.tsx       # Examen final 50 questions
│   │
│   ├── data/
│   │   ├── chapters.ts         # 8 chapitres (913 lignes) - contenu cours
│   │   ├── quizzes.ts          # 80 questions QCM (10/chapitre)
│   │   └── finalExam.ts        # 50 questions examen final
│   │
│   └── utils/
│       └── progress.ts         # Gestion progression (LocalStorage)
│
├── public/
│   └── vite.svg
│
└── dist/                       # Build de production (genere)
    ├── index.html
    └── assets/
        ├── index-[hash].js
        └── index-[hash].css
```

---

## 4. Pages et routes

| Route | Composant | Description |
|---|---|---|
| `/` | Home.tsx | Accueil : hero avec NetworkCanvas, stats, features, grille chapitres, CTA examen, footer |
| `/cours/:slug` | Course.tsx | Lecteur de cours avec sidebar de navigation, rendu markdown, video YouTube, boutons prev/next |
| `/quiz/:slug` | QuizPage.tsx | Quiz QCM du chapitre (10 questions), delegue au composant Quiz |
| `/examen` | FinalExam.tsx | Examen final : ecran d'accueil → quiz 50 questions → resultats par chapitre |
| `/progression` | Progress.tsx | Dashboard : % completion, chapitres termines, moyenne quiz, detail par chapitre |

### Slugs des chapitres

| ID | Slug | Titre |
|---|---|---|
| 1 | `modele-osi` | Modele OSI |
| 2 | `ipv4-ipv6` | IPv4 et IPv6 |
| 3 | `vlan-trunk-vtp-stp` | VLAN, Trunk, VTP & STP |
| 4 | `broadcast` | Broadcast & Collision Domains |
| 5 | `routage-statique` | Routage Statique |
| 6 | `classes-subnetting` | Classes & Subnetting |
| 7 | `ping-icmp-arp` | Ping, ICMP & ARP |
| 8 | `dns-dhcp` | DNS & DHCP |

---

## 5. Composants

### Navbar.tsx (165 lignes)
- Barre fixe en haut (height: 56px, z-index: 1000)
- Logo terminal : carre vert `N` + `net`**`revision`** en monospace
- Navigation desktop : pilule avec indicateur actif vert (Accueil, Cours, Examen, Progression)
- Menu mobile : hamburger avec AnimatePresence (breakpoint 768px)
- Fond semi-transparent avec backdrop-filter blur

### ChapterCard.tsx (138 lignes)
- Carte avec accent strip gauche (3px, couleur du chapitre)
- Numero monospace (01, 02...), icone, titre, sous-titre
- Meta : duree et niveau de difficulte
- Indicateur de completion (checkmark)
- Hover : ombre et bordure coloree

### Quiz.tsx (318 lignes)
- Composant reutilisable pour les quiz de chapitre
- **Melange aleatoire** des reponses a chaque passage (Fisher-Yates)
- Barre de progression avec compteur (01/10)
- Boutons A/B/C/D avec highlight correct/incorrect
- Section explication apres validation
- Ecran de resultats avec score et bouton recommencer
- Regeneration du melange au restart

### NetworkCanvas.tsx (141 lignes)
- Animation Canvas API sur la page d'accueil (hero)
- 80 particules avec simulation physique (velocite, damping)
- Connexions entre particules proches (distance < 120px)
- Interaction souris : repulsion subtile (rayon 150px)
- Boucle requestAnimationFrame, responsive au resize
- Couleur accent (#00e5a0) pour noeuds et connexions

---

## 6. Donnees et contenu

### Structure d'un chapitre (chapters.ts)

```typescript
interface Chapter {
  id: number
  slug: string
  title: string
  subtitle: string
  icon: string          // Nom d'icone Lucide
  color: string         // Couleur hex du chapitre
  duration: string      // "45 min"
  level: string         // "Debutant" | "Intermediaire" | "Avance"
  videoId: string       // ID YouTube (video FR)
  sections: {
    title: string
    content: string     // Contenu markdown-like
  }[]
}
```

### Videos YouTube (toutes en francais)

| Ch | Video ID | Chaine |
|---|---|---|
| 1 - OSI | `26jazyc7VNk` | Cookie connecte |
| 2 - IPv4/IPv6 | `Oc7Ts8tVjyE` | Cookie connecte |
| 3 - VLAN | `CEE9WeUpGV4` | Dirtech IT |
| 4 - Broadcast | `q6RC5gZP4NU` | TechJunos |
| 5 - Routage | `7dwOSOIMB-E` | MOG ACADEMY |
| 6 - Subnetting | `S_EfcLo2Wv0` | WayToLearnX |
| 7 - ICMP/ARP | `F83ZvOKj2BU` | IT-Connect |
| 8 - DNS/DHCP | `Y02JLg7g44Y` | Formip |

### Structure d'une question quiz

```typescript
interface QuizQuestion {
  id: string
  question: string
  options: string[]     // Toujours 4 options
  correct: number       // Index de la bonne reponse (0-3)
  explanation: string
}
```

### Statistiques du contenu

| Metrique | Valeur |
|---|---|
| Chapitres | 8 |
| Sections de cours | 35+ |
| Questions quiz (par chapitre) | 80 (10 x 8) |
| Questions examen final | 50 |
| **Total questions** | **130** |
| Lignes de donnees (chapters.ts) | ~913 |

### Distribution de l'examen final

| Sujet | Questions | IDs |
|---|---|---|
| OSI | 6 | Q1-6 |
| IPv4/IPv6 | 7 | Q7-13 |
| VLAN/STP | 7 | Q14-20 |
| Broadcast | 6 | Q21-26 |
| Routage | 6 | Q27-32 |
| Subnetting | 7 | Q33-39 |
| ICMP/ARP | 6 | Q40-45 |
| DNS/DHCP | 5 | Q46-50 |

---

## 7. Systeme de progression

### Stockage (LocalStorage)

- **Cle** : `netrevision_progress`
- **Persistance** : locale au navigateur, pas de backend

### Interface UserProgress

```typescript
interface UserProgress {
  completedChapters: number[]                    // IDs des chapitres termines
  completedSections: Record<number, number[]>    // ChapterID -> indices de sections lues
  quizScores: Record<number, number>             // ChapterID -> meilleur score (%)
}
```

### Fonctions utilitaires (progress.ts)

| Fonction | Description |
|---|---|
| `getProgress()` | Recupere la progression depuis localStorage (fallback vide) |
| `saveProgress(p)` | Persiste l'objet UserProgress |
| `markSectionRead(chId, secIdx)` | Marque une section comme lue (sans doublons) |
| `markChapterComplete(chId)` | Marque un chapitre comme termine |
| `saveQuizScore(chId, score)` | Sauvegarde le score quiz (garde le meilleur via Math.max) |

### Logique de l'examen final
- Score sauvegarde sous la cle `99` dans quizScores
- Seuil de reussite : 70% (35/50)
- Chronometre integre (temps d'examen affiche dans les resultats)
- Detail par chapitre avec barres de progression colorees

---

## 8. Theme et design

### Identite visuelle : "Circuit Logic"

Theme sombre a esthetique technique/terminal, inspire des 6 skills de design :
- **frontend-design** : Anti-AI-slop, pas d'Inter, pas de violet degrade, coins carres
- **theme-factory** : Palette "Circuit Logic"
- **canvas-design** : Grille overlay, indicateurs carres
- **algorithmic-art** : Animation particules generative
- **brand-guidelines** : Logo terminal, numerotation monospace
- **web-artifacts-builder** : Architecture composants

### Palette de couleurs (variables CSS)

```css
/* Fonds */
--bg-primary: #080b1a          /* Fond principal (deep navy) */
--bg-secondary: #0f1328        /* Surface secondaire */
--bg-tertiary: #161b35         /* Surface tertiaire */
--bg-elevated: #1a2040         /* Surface elevee */

/* Accents */
--accent: #00e5a0              /* Vert principal (cyan-green) */
--accent-hover: #00ffb3        /* Vert hover */
--accent-glow: rgba(0,229,160,0.1)  /* Glow subtil */
--accent-secondary: #3b82f6    /* Bleu signal */
--accent-warm: #f59e0b         /* Ambre chaud */

/* Texte */
--text-primary: #e2e8f0        /* Texte principal */
--text-secondary: #94a3b8      /* Texte secondaire */
--text-muted: #475569          /* Texte attenue */

/* Bordures */
--border: #1e293b
--border-active: #2d3a52

/* Etats */
--success: #10b981             /* Vert succes */
--error: #ef4444               /* Rouge erreur */
--warning: #f59e0b             /* Orange attention */
```

### Typographie

| Usage | Police | Poids |
|---|---|---|
| Titres (--font-heading) | Space Grotesk | 600-700 |
| Corps (--font-body) | Work Sans | 300-600 |
| Code/Mono (--font-mono) | JetBrains Mono | 400-600 |

### Elements visuels distinctifs

- **Grille de fond** : motif 60x60px, lignes 1px, opacite 15%
- **Coins carres** : border-radius: 0 partout (anti-rounded)
- **Commentaires de section** : `// programme`, `// fonctionnalites` (style code)
- **Scrollbar** : 5px de large, couleur --border
- **Blocs de code** : bordure gauche accent 3px, fond sombre
- **Barre de progression** : hauteur 2-3px, tres fine

### Breakpoints responsive

| Breakpoint | Adaptations |
|---|---|
| <= 768px | Navigation hamburger, sidebar cours masquee, hero simplifie, grilles 1 colonne |
| 769px - 1024px | Features 2 colonnes |
| > 1024px | Layout complet desktop |

---

## 9. Deploiement

### Infrastructure

| Element | Detail |
|---|---|
| VPS | 46.202.168.181 |
| OS | Linux |
| Serveur web | Nginx |
| Repertoire | /clients/revision-reseaux/ |
| Domaine | revision.quernel-cloud.com |
| SSL | HTTPS actif |
| SPA routing | Nginx configuré pour rediriger vers index.html |

### Processus de deploiement

```bash
# 1. Build local
npm run build

# 2. Upload vers le VPS
sshpass -p 'PASSWORD' scp -o StrictHostKeyChecking=no -r dist/* \
  root@46.202.168.181:/clients/revision-reseaux/
```

### Configuration Nginx (SPA)

Le serveur Nginx est configure pour supporter le routing SPA (Single Page Application) :
toute URL qui ne correspond pas a un fichier statique est redirigee vers `index.html`,
permettant a React Router de gerer la navigation cote client.

---

## 10. Contenu actuel vs competences requises

Apres recherche approfondie des competences attendues d'un developpeur/ingenieur reseau
(CCNA, CCNP, CompTIA Network+, formations francaises TSSR/ERIS), voici la comparaison
entre ce que couvre actuellement le site et ce qui manque.

### Ce que le site couvre deja (8 chapitres)

| Domaine | Couverture | Profondeur |
|---|---|---|
| Modele OSI (7 couches) | Complet | Bonne |
| IPv4 / IPv6 (adressage) | Complet | Bonne |
| VLAN, Trunk, VTP, STP | Complet | Bonne |
| Broadcast & Collision Domains | Complet | Correcte |
| Routage statique | Complet | Correcte |
| Classes IP & Subnetting | Complet | Bonne |
| Ping, ICMP, ARP | Complet | Correcte |
| DNS & DHCP | Complet | Correcte |

### Competences manquantes identifiees

Basee sur l'analyse des certifications CCNA 200-301 v1.1, CCNP ENCOR, CompTIA Network+ N10-009,
et les exigences du marche en 2025-2026, voici les domaines NON couverts par le site :

#### Priorite HAUTE (fondamentaux manquants)

| Domaine | Justification |
|---|---|
| **TCP vs UDP en profondeur** | Three-way handshake, flow control, windowing, ports principaux |
| **Routage dynamique (OSPF, EIGRP, RIP, BGP)** | Le site ne couvre que le routage statique, or OSPF = 25% du CCNA |
| **ACL (Access Control Lists)** | Standard, extended, named ACLs, wildcard masks - fondamental securite |
| **NAT/PAT en detail** | Static NAT, Dynamic NAT, PAT/Overload - essentiel pour la pratique |
| **Securite reseau fondamentale** | Firewalls, port security, DHCP snooping, DAI, 802.1X |
| **WiFi / Reseaux sans fil** | 802.11 a/b/g/n/ac/ax, securite WPA2/WPA3, architecture WLAN |
| **Topologies et architectures reseau** | Star, mesh, spine-leaf, 3-tier, design LAN/WAN |
| **Cablage et couche physique** | Cat5e/6/6a, fibre SM/MM, connecteurs, PoE, normes TIA/EIA |

#### Priorite MOYENNE (competences intermediaires)

| Domaine | Justification |
|---|---|
| **VPN (IPsec, SSL/TLS)** | Site-to-site et remote access VPN, IKE Phase 1/2 |
| **QoS (Quality of Service)** | DiffServ, DSCP, queuing (CBWFQ, LLQ) |
| **EtherChannel / Link Aggregation** | LACP, PAgP, load balancing |
| **NTP & Syslog** | Synchronisation temps, niveaux de severite syslog |
| **SNMP** | Versions v1/v2c/v3, MIB, OID, traps |
| **Modele TCP/IP vs OSI** | Comparaison et mapping des couches |
| **IPv6 en profondeur** | SLAAC, DHCPv6, EUI-64, transition dual-stack/tunneling |

#### Priorite BASSE (competences avancees / specialisees)

| Domaine | Justification |
|---|---|
| **Automatisation reseau (Python, Ansible)** | Netmiko, NAPALM, playbooks YAML - tendance forte 2025+ |
| **SDN & Programmabilite** | APIs REST, NETCONF/RESTCONF, YANG, SDN controllers |
| **Cloud Networking** | AWS VPC, Azure VNet, security groups, hybrid cloud |
| **Linux pour le reseau** | ip, ss, iptables, tcpdump, configuration interfaces |
| **Wireshark & analyse de paquets** | Capture, filtres, analyse protocoles |
| **Depannage structure** | Methodologie bottom-up/top-down, scenarios pratiques |
| **Monitoring (Zabbix, Nagios)** | SNMP monitoring, NetFlow, alerting |
| **NFV & SD-WAN** | Virtualisation fonctions reseau, SD-WAN architecture |

---

## 11. Plan d'ameliorations

### A. Nouveaux chapitres de cours (contenu)

#### A.1 - TCP & UDP en profondeur
- Three-way handshake (SYN, SYN-ACK, ACK)
- Four-way termination (FIN, ACK)
- Flow control et windowing TCP
- Comparaison TCP vs UDP (fiabilite vs rapidite)
- Ports principaux (80, 443, 22, 53, 67/68, 25, 110, 143, 3389...)
- Segments et en-tetes TCP/UDP
- Quiz : 10 questions

#### A.2 - Routage dynamique (OSPF & RIP)
- Protocoles distance-vector vs link-state
- RIP : hop count, max 15 hops, RIPv1 vs RIPv2
- OSPF : algorithme SPF/Dijkstra, aires, DR/BDR, cout
- Table de routage : distance administrative, metrique
- Redistribution et route summarization
- Commandes Cisco : show ip route, show ip ospf neighbor
- Quiz : 10 questions

#### A.3 - ACL (Access Control Lists)
- ACL standard (source IP, numeros 1-99)
- ACL etendue (source/dest IP, protocole, port, numeros 100-199)
- ACL nommees
- Wildcard masks (inverse des masques de sous-reseau)
- Regles de placement (standard pres de la destination, etendue pres de la source)
- Deny implicite en fin d'ACL
- Quiz : 10 questions

#### A.4 - NAT & PAT
- NAT statique (mapping un-pour-un)
- NAT dynamique (pool d'adresses publiques)
- PAT / NAT overload (une seule IP publique pour tout le reseau)
- Inside local, inside global, outside local, outside global
- Configuration et verification sur routeur Cisco
- NAT64 (transition IPv6)
- Quiz : 10 questions

#### A.5 - Securite reseau
- Triade CIA (Confidentialite, Integrite, Disponibilite)
- Firewalls stateless vs stateful, NGFW
- Port security (sticky MAC, modes violation)
- DHCP snooping, Dynamic ARP Inspection
- 802.1X port-based authentication
- Types d'attaques : DoS, man-in-the-middle, ARP spoofing, VLAN hopping
- Quiz : 10 questions

#### A.6 - WiFi & reseaux sans fil
- Standards 802.11 : a/b/g/n (WiFi 4) / ac (WiFi 5) / ax (WiFi 6)
- Bandes de frequence : 2.4 GHz vs 5 GHz vs 6 GHz
- Securite : WEP (obsolete), WPA, WPA2, WPA3
- Architecture : BSS, ESS, AP autonome vs lightweight + WLC
- MIMO, MU-MIMO, OFDMA, beamforming
- Quiz : 10 questions

#### A.7 - VPN (IPsec & SSL)
- Types de VPN : site-to-site, remote access
- IPsec : tunnel mode vs transport mode, AH vs ESP, IKE Phase 1/2
- SSL/TLS VPN : clientless vs full-tunnel
- GRE over IPsec
- Comparaison IPsec vs SSL VPN
- Quiz : 10 questions

#### A.8 - Depannage & outils reseau
- Methodologie structuree : identifier → collecter → analyser → tester → documenter
- Approches OSI : bottom-up, top-down, divide-and-conquer
- Outils : ping, traceroute, nslookup/dig, ipconfig/ifconfig, netstat/ss, arp, nmap
- Wireshark : capture et filtres basiques
- Scenarios de depannage courants
- Quiz : 10 questions

### B. Ameliorations fonctionnelles

#### B.1 - Calculatrice de sous-reseaux interactive
- Interface ou l'etudiant entre une adresse IP et un masque CIDR
- Calcul automatique : adresse reseau, broadcast, plage d'hotes, nombre de sous-reseaux
- Mode exercice : "Decoupe ce /22 en sous-reseaux pour 50, 100 et 200 hotes"
- Verification pas-a-pas avec explications binaires
- Conversion binaire ↔ decimal integree

#### B.2 - Flashcards / Fiches de revision
- Mode revision rapide par chapitre
- Recto : question ou terme technique
- Verso : definition ou reponse
- Systeme de repetition espacee (facile / moyen / difficile)
- Couverture : ports, acronymes, commandes Cisco, comparaisons protocoles

#### B.3 - Mode examen chronometrer
- Timer configurable (30, 45, 60 minutes)
- Compte a rebours visible
- Soumission automatique a la fin du temps
- Simulation conditions d'examen (pas de retour en arriere possible)
- Statistiques : temps moyen par question

#### B.4 - Simulateur de commandes Cisco
- Terminal interactif dans le navigateur
- Commandes de base : show ip interface brief, show vlan, show ip route, ping, traceroute
- Configuration : ip address, no shutdown, vlan, switchport, router ospf
- Feedback immediat : succes ou erreur avec explication
- Scenarios guides : "Configure un VLAN 10 et attribue les ports Fa0/1-10"

#### B.5 - Schemas interactifs
- Diagrammes de topologie reseau cliquables
- Animation du parcours d'un paquet a travers les couches OSI
- Visualisation du processus DHCP DORA
- Schema interactif de la resolution DNS
- Tableau de routage visuel

#### B.6 - Systeme de badges et gamification
- Badges deblocables :
  - "Premier pas" : terminer le premier chapitre
  - "Subnetting Master" : 100% au quiz subnetting
  - "Perfectionniste" : 100% a l'examen final
  - "Speed Runner" : examen final en moins de 15 min
  - "Encyclopedie" : toutes les sections lues
- Streak de jours consecutifs d'etude
- Classement (si backend ajoute plus tard)

#### B.7 - Mode sombre / clair
- Toggle theme dans la navbar
- Theme clair alternatif avec les memes proportions
- Preference sauvegardee en localStorage
- Respect du prefers-color-scheme systeme

#### B.8 - Export et partage de resultats
- Export PDF du rapport d'examen final
- Capture d'ecran du score partageable
- QR code vers le site pour partager avec des camarades

#### B.9 - Recherche globale
- Barre de recherche dans la navbar
- Recherche full-text dans le contenu des cours
- Suggestions en temps reel
- Navigation directe vers la section trouvee

#### B.10 - Mode hors-ligne (PWA)
- Service Worker pour le cache des ressources
- Manifest.json pour l'installation sur mobile
- Fonctionnement complet sans internet apres premier chargement
- Synchronisation de la progression au retour en ligne

### C. Ameliorations techniques

#### C.1 - Code splitting
- Lazy loading des pages avec React.lazy() et Suspense
- Chunks separes par route pour reduire le bundle initial (~1MB actuellement)
- Preloading des routes probables (cours suivant, quiz)

#### C.2 - Backend et authentification
- API REST (Node.js / Express ou Fastify)
- Base de donnees (PostgreSQL ou SQLite)
- Authentification (email/mot de passe ou OAuth Google)
- Synchronisation de la progression entre appareils
- Administration du contenu (CMS leger)

#### C.3 - Tests automatises
- Tests unitaires (Vitest) pour les utilitaires (progress.ts, shuffle)
- Tests de composants (React Testing Library)
- Tests E2E (Playwright) pour les parcours critiques
- CI/CD avec GitHub Actions

#### C.4 - SEO et meta tags
- React Helmet pour les meta tags dynamiques
- Open Graph tags pour le partage social
- Sitemap.xml genere
- Schema.org structured data (Course, Quiz)

#### C.5 - Accessibilite (a11y)
- Audit WCAG 2.1 AA
- Navigation clavier complete
- Labels ARIA sur les elements interactifs
- Contraste suffisant verifie
- Support lecteurs d'ecran

#### C.6 - Analytics
- Integration Plausible ou Umami (respectueux de la vie privee)
- Tracking des chapitres les plus consultes
- Taux de reussite par quiz
- Points de decrochage identifies
- Temps moyen par section

---

## 12. Roadmap

### Phase 1 - Enrichissement du contenu (priorite haute)

| # | Amelioration | Effort | Impact |
|---|---|---|---|
| 1 | Chapitre TCP & UDP | Moyen | Eleve |
| 2 | Chapitre Routage dynamique (OSPF/RIP) | Moyen | Eleve |
| 3 | Chapitre ACL | Moyen | Eleve |
| 4 | Chapitre NAT/PAT | Moyen | Eleve |
| 5 | Chapitre Securite reseau | Moyen | Eleve |
| 6 | Chapitre WiFi | Moyen | Eleve |
| 7 | Mise a jour examen final (ajouter les nouveaux sujets) | Faible | Eleve |
| 8 | Calculatrice de sous-reseaux | Moyen | Eleve |

**Objectif** : passer de 8 a 14 chapitres, de 130 a 210+ questions

### Phase 2 - Fonctionnalites interactives (priorite moyenne)

| # | Amelioration | Effort | Impact |
|---|---|---|---|
| 9 | Flashcards / fiches de revision | Moyen | Moyen |
| 10 | Schemas interactifs | Eleve | Eleve |
| 11 | Mode examen chronometre configurable | Faible | Moyen |
| 12 | Systeme de badges | Moyen | Moyen |
| 13 | Recherche globale | Moyen | Moyen |
| 14 | Mode sombre / clair | Faible | Faible |

### Phase 3 - Ameliorations techniques (priorite basse)

| # | Amelioration | Effort | Impact |
|---|---|---|---|
| 15 | Code splitting (lazy loading) | Faible | Moyen |
| 16 | PWA (mode hors-ligne) | Moyen | Moyen |
| 17 | Tests automatises | Eleve | Moyen |
| 18 | SEO et meta tags | Faible | Moyen |
| 19 | Accessibilite WCAG | Moyen | Moyen |
| 20 | Analytics | Faible | Moyen |

### Phase 4 - Fonctionnalites avancees (long terme)

| # | Amelioration | Effort | Impact |
|---|---|---|---|
| 21 | Chapitre VPN (IPsec/SSL) | Moyen | Moyen |
| 22 | Chapitre Depannage & outils | Moyen | Moyen |
| 23 | Simulateur de commandes Cisco | Eleve | Eleve |
| 24 | Backend + authentification | Eleve | Eleve |
| 25 | Export PDF des resultats | Moyen | Faible |

---

## Annexe : Sources de la recherche competences

La liste des ameliorations est basee sur l'analyse des programmes suivants :

- **CCNA 200-301 v1.1** (mise a jour aout 2025) : 6 domaines - Network Fundamentals (20%), Network Access (20%), IP Connectivity (25%), IP Services (10%), Security Fundamentals (15%), Automation & Programmability (10%)
- **CCNP ENCOR 350-401 v1.2** : Architecture dual-stack, virtualisation, infrastructure, assurance reseau, securite, automatisation
- **CompTIA Network+ N10-009** : 5 domaines - Networking Concepts, Network Implementation, Network Operations, Network Security, Network Troubleshooting
- **Titre Professionnel TSSR** (Technicien Superieur Systemes et Reseaux) - Bac+2, RNCP
- **Titre Professionnel Administrateur Systemes et Reseaux** - Bac+3
- **Expert Reseaux Infrastructures et Securite (ERIS)** - Bac+5, RNCP Niveau 7

---

*Documentation generee le 17 fevrier 2026 - Quernel Intelligence*
