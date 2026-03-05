import type { Chapter } from './chapters'

export const chapters4: Chapter[] = [
  {
    id: 33,
    slug: 'concepts-securite',
    title: 'Concepts cles de securite',
    subtitle: 'Menaces, vulnerabilites, CIA, defense-in-depth et dispositifs de securite',
    icon: 'Shield',
    color: '#e11d48',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'J3IJQc6DRyU',
    sections: [
      {
        title: 'Menaces courantes en cybersecurite',
        content: `La premiere etape pour securiser un reseau est de connaitre les **menaces** qui le ciblent. Une menace est tout evenement ou acteur susceptible d'exploiter une vulnerabilite pour causer un dommage.

### Malware (logiciels malveillants)

| Type | Description | Propagation |
|------|-------------|-------------|
| **Virus** | S'attache a un fichier legitime, s'execute quand le fichier est ouvert | Fichier hote (email, USB) |
| **Ver (Worm)** | Se propage automatiquement sans fichier hote | Reseau (exploite des failles) |
| **Trojan (Cheval de Troie)** | Se fait passer pour un logiciel legitime | Telechargement, email |
| **Ransomware** | Chiffre les donnees et demande une rancon | Email, exploit kit, RDP |
| **Spyware** | Collecte des informations a l'insu de l'utilisateur | Bundle logiciel, drive-by download |
| **Rootkit** | Se cache au niveau OS/firmware pour maintenir un acces persistant | Exploit + escalade de privileges |
| **Botnet** | Reseau de machines compromises controlees a distance (C2) | Ver, trojan |

### Phishing et ingenierie sociale

Le **phishing** est la methode d'attaque la plus repandue. Elle exploite le facteur humain :

- **Phishing classique** : email de masse imitant une entite de confiance (banque, fournisseur)
- **Spear phishing** : email cible visant une personne specifique avec des informations personnalisees
- **Whaling** : spear phishing visant les dirigeants (CEO, CFO)
- **Vishing** : phishing par telephone (voice phishing)
- **Smishing** : phishing par SMS
- **Pretexting** : creation d'un faux scenario pour soutirer des informations
- **Tailgating** : entrer physiquement dans un batiment en suivant un employe autorise

### Autres attaques majeures

**DDoS (Distributed Denial of Service)** : submerger un service avec un volume massif de trafic provenant de multiples sources (souvent un botnet).

\`\`\`
Types de DDoS :
- Volumetrique   : UDP flood, DNS amplification (saturer la bande passante)
- Protocole      : SYN flood, Ping of Death (epuiser les ressources)
- Applicatif     : HTTP flood, Slowloris (cibler la couche 7)
\`\`\`

**Spoofing** : usurper l'identite d'un equipement ou d'un utilisateur (IP spoofing, MAC spoofing, ARP spoofing, DNS spoofing).

**Man-in-the-Middle (MITM)** : l'attaquant s'intercale entre deux parties pour intercepter ou modifier les communications.

**Attaques par mot de passe** : brute force, dictionnaire, credential stuffing, password spraying, rainbow tables.

> **Point CCNA :** L'examen CCNA 200-301 attend que vous sachiez identifier les types de menaces et leurs mecanismes. Le phishing et les malwares sont les sujets les plus frequemment testes.`
      },
      {
        title: 'Vulnerabilites et surface d\'attaque',
        content: `Une **vulnerabilite** est une faiblesse dans un systeme, un logiciel ou un processus qui peut etre exploitee par une menace. La **surface d'attaque** represente l'ensemble des points d'entree potentiels.

### Types de vulnerabilites

| Categorie | Exemples | Impact |
|-----------|----------|--------|
| **Logicielles** | Buffer overflow, injection SQL, XSS, bugs non corriges | Execution de code, fuite de donnees |
| **Materielles** | Firmware obsolete, ports physiques non proteges, Meltdown/Spectre | Acces physique, escalade de privileges |
| **Configuration** | Mots de passe par defaut, services inutiles actifs, ACL trop permissives | Acces non autorise |
| **Humaines** | Manque de formation, negligence, ingenierie sociale | Compromission de comptes |
| **Reseau** | Protocoles non chiffres (Telnet, HTTP, FTP), absence de segmentation | Interception, mouvement lateral |

### Gestion des vulnerabilites

Le cycle de gestion des vulnerabilites suit un processus continu :

\`\`\`
1. Decouverte    → Scanner les systemes (Nessus, Qualys, OpenVAS)
2. Evaluation    → Prioriser par severite (CVSS score)
3. Remediation   → Patcher, reconfigurer ou isoler
4. Verification  → Rescan pour confirmer la correction
5. Reporting     → Documenter et suivre les metriques
\`\`\`

### CVSS (Common Vulnerability Scoring System)

Le **CVSS** attribue un score de 0 a 10 a chaque vulnerabilite :

| Score | Severite | Action |
|-------|----------|--------|
| 0.0 | Aucune | Informationnel |
| 0.1 - 3.9 | **Faible** | Correction planifiee |
| 4.0 - 6.9 | **Moyenne** | Correction dans le mois |
| 7.0 - 8.9 | **Haute** | Correction prioritaire |
| 9.0 - 10.0 | **Critique** | Correction immediate |

### CVE (Common Vulnerabilities and Exposures)

Chaque vulnerabilite connue recoit un identifiant **CVE** unique (ex: CVE-2024-12345). La base CVE est maintenue par MITRE et consultable sur **cve.org** ou **nvd.nist.gov**.

### Zero-day

Un **zero-day** est une vulnerabilite inconnue du vendeur et donc sans correctif disponible. C'est le type de vulnerabilite le plus dangereux car aucune defense specifique n'existe encore.

### Bonnes pratiques de reduction de la surface d'attaque

- Desactiver les services et ports inutiles
- Appliquer le **principe du moindre privilege** (least privilege)
- Segmenter le reseau (VLANs, zones de securite)
- Maintenir les systemes a jour (patch management)
- Durcir les configurations (hardening) selon les benchmarks CIS

> **Astuce CCNA :** Retenez que la gestion des vulnerabilites est un processus continu, pas un evenement ponctuel. L'examen peut poser des questions sur la difference entre menace, vulnerabilite et exploit.`
      },
      {
        title: 'La triade CIA et les principes de securite',
        content: `La **triade CIA** (Confidentiality, Integrity, Availability) est le fondement de toute politique de securite informatique. Chaque mesure de securite vise a proteger un ou plusieurs de ces trois piliers.

### Confidentialite (Confidentiality)

Garantir que les informations ne sont accessibles qu'aux personnes **autorisees**.

| Mecanisme | Description | Exemple |
|-----------|-------------|---------|
| **Chiffrement** | Rendre les donnees illisibles sans la cle | AES-256, RSA, TLS |
| **Controle d'acces** | Restreindre l'acces par identite | ACL, RBAC, 802.1X |
| **Classification** | Categoriser les donnees par sensibilite | Public, Interne, Confidentiel, Secret |
| **Masquage** | Remplacer les donnees sensibles | Tokenisation, anonymisation |

### Integrite (Integrity)

Garantir que les donnees n'ont pas ete **modifiees** de maniere non autorisee.

| Mecanisme | Description | Exemple |
|-----------|-------------|---------|
| **Hachage** | Empreinte unique des donnees | MD5, SHA-256, SHA-512 |
| **Signatures numeriques** | Garantie d'authenticite + integrite | RSA, DSA, ECDSA |
| **Controle de version** | Historique des modifications | Git, journalisation |
| **Checksums** | Verification d'integrite des fichiers/paquets | CRC, MD5sum |

### Disponibilite (Availability)

Garantir que les ressources sont **accessibles** quand necessaire.

| Mecanisme | Description | Exemple |
|-----------|-------------|---------|
| **Redondance** | Dupliquer les composants critiques | HSRP, clustering, RAID |
| **Sauvegarde** | Copies regulieres des donnees | Backup incremental, snapshot |
| **Plan de reprise** | Procedures de recuperation | DRP, BCP |
| **Protection DDoS** | Absorber les attaques volumetriques | CDN, scrubbing center |

### Au-dela de la CIA : AAA et non-repudiation

- **Authentification** : prouver l'identite (mot de passe, certificat, biometrie)
- **Autorisation** : definir ce que l'utilisateur peut faire (ACL, roles)
- **Accounting** : tracer ce que l'utilisateur a fait (logs, audit trail)
- **Non-repudiation** : empecher un utilisateur de nier une action (signatures numeriques, logs horodates)

### Principe du moindre privilege

Chaque utilisateur, processus ou systeme ne doit avoir que les droits **strictement necessaires** a l'accomplissement de sa tache. C'est un principe fondamental du Zero Trust.

\`\`\`
Exemple Cisco IOS :
! Au lieu de donner privilege 15 a tous :
username technicien privilege 7 secret MonMotDePasse
! privilege 7 = acces limite aux commandes de monitoring
! privilege 15 = acces total (admin)
\`\`\`

> **Point CCNA :** La triade CIA est un sujet incontournable de l'examen. Vous devez pouvoir associer chaque mecanisme de securite au pilier qu'il protege. Par exemple : le chiffrement protege la confidentialite, le hachage protege l'integrite, la redondance protege la disponibilite.`
      },
      {
        title: 'Defense-in-depth et programme de securite',
        content: `La **defense en profondeur** (defense-in-depth) est une strategie qui consiste a deployer **plusieurs couches de securite** successives. Si une couche est compromise, les suivantes continuent a proteger le systeme.

### Les couches de la defense en profondeur

\`\`\`
Couche 7 : Donnees          → Chiffrement, DLP, classification
Couche 6 : Application      → WAF, code securise, patching
Couche 5 : Hote             → Antivirus, EDR, hardening OS
Couche 4 : Reseau interne   → Segmentation, IDS/IPS, NAC
Couche 3 : Perimetre        → Firewall, DMZ, proxy
Couche 2 : Physique         → Controle d'acces physique, cameras
Couche 1 : Politiques       → Procedures, formation, gouvernance
\`\`\`

### Elements d'un programme de securite

Un programme de securite d'entreprise repose sur plusieurs composants :

| Element | Description |
|---------|-------------|
| **Politique de securite** | Document de haut niveau definissant les objectifs et les regles |
| **Standards** | Regles obligatoires et specifiques (ex: longueur minimum des mots de passe) |
| **Procedures** | Etapes detaillees pour implementer les standards |
| **Guidelines** | Recommandations (non obligatoires) |
| **Baselines** | Configuration de reference securisee (ex: CIS Benchmark) |

### Frameworks de securite

| Framework | Organisation | Usage |
|-----------|-------------|-------|
| **NIST CSF** | NIST (USA) | Framework general (Identify, Protect, Detect, Respond, Recover) |
| **ISO 27001** | ISO | Systeme de management de la securite (SMSI) |
| **CIS Controls** | CIS | 18 controles prioritaires pratiques |
| **MITRE ATT&CK** | MITRE | Matrice des techniques d'attaque |
| **COBIT** | ISACA | Gouvernance IT |

### Le modele NIST Cybersecurity Framework

\`\`\`
1. IDENTIFY    → Inventaire des actifs, evaluation des risques
2. PROTECT     → Controles d'acces, formation, chiffrement
3. DETECT      → Monitoring, IDS, SIEM, analyse des logs
4. RESPOND     → Plan d'incident, containment, communication
5. RECOVER     → Restauration, amelioration continue
\`\`\`

### Formation et sensibilisation

Le facteur humain est le **maillon le plus faible** de la chaine de securite. Un programme de securite efficace inclut :

- Formation reguliere des employes (phishing simule, bonnes pratiques)
- Campagnes de sensibilisation (affiches, newsletters, quiz)
- Tests periodiques (simulation de phishing, exercices incident response)
- Politique d'utilisation acceptable (AUP)

### Gestion des risques

\`\`\`
Risque = Menace x Vulnerabilite x Impact

4 strategies de traitement du risque :
- Eviter    : eliminer l'activite a risque
- Attenuer  : reduire la probabilite ou l'impact (controles)
- Transferer : assurance, sous-traitance
- Accepter  : risque residuel juge acceptable
\`\`\`

> **A retenir :** La defense en profondeur est le principe directeur de l'architecture de securite. Aucune mesure unique ne suffit — c'est la combinaison de multiples couches qui assure une protection robuste.`
      },
      {
        title: 'Firewalls : types et fonctionnement',
        content: `Le **firewall** (pare-feu) est le dispositif de securite reseau le plus fondamental. Il filtre le trafic entre des zones de confiance differentes selon des regles predefinies.

### Types de firewalls

| Type | Couche OSI | Fonctionnement | Exemple |
|------|-----------|----------------|---------|
| **Packet Filtering (stateless)** | L3-L4 | Filtre chaque paquet individuellement selon IP src/dst, port, protocole | ACL Cisco |
| **Stateful Inspection** | L3-L4 | Maintient une table des connexions actives, autorise les reponses | ASA, iptables |
| **Application Layer (proxy)** | L7 | Inspecte le contenu applicatif, agit comme intermediaire | Squid, Blue Coat |
| **NGFW (Next-Gen Firewall)** | L3-L7 | Stateful + DPI + IPS + identification d'applications | Cisco Firepower, Palo Alto, Fortinet |

### Firewall Stateless vs Stateful

**Stateless (filtrage de paquets)** :
- Examine chaque paquet **independamment**
- Ne connait pas le concept de "connexion"
- Necessite des regles explicites pour le trafic retour
- Rapide mais peu intelligent

\`\`\`
! Exemple ACL stateless sur un routeur Cisco
access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 80
access-list 100 permit tcp any eq 80 192.168.1.0 0.0.0.255 established
access-list 100 deny ip any any
!
interface GigabitEthernet0/0
 ip access-group 100 in
\`\`\`

**Stateful (inspection a etat)** :
- Maintient une **table de connexions** (state table)
- Le trafic retour est automatiquement autorise si la connexion est dans la table
- Detecte les paquets hors contexte (ex: ACK sans SYN prealable)
- Plus securise, standard actuel

\`\`\`
! Exemple Cisco ASA (stateful par defaut)
access-list OUTSIDE_IN extended permit tcp any host 203.0.113.10 eq 443
access-group OUTSIDE_IN in interface outside
! Le trafic retour (du serveur vers les clients) est autorise automatiquement
\`\`\`

### NGFW (Next-Generation Firewall)

Un NGFW combine les fonctions d'un firewall stateful avec :

- **DPI** (Deep Packet Inspection) : inspection du contenu au-dela des en-tetes
- **IPS integre** : detection et blocage des exploits en temps reel
- **Application Awareness** : identification des applications (YouTube, Teams, BitTorrent) independamment du port
- **User Identity** : politiques basees sur l'utilisateur (integration AD)
- **SSL/TLS Decryption** : dechiffrement du trafic HTTPS pour inspection
- **Threat Intelligence** : bases de signatures mises a jour en continu
- **Sandboxing** : execution de fichiers suspects dans un environnement isole

### Zones de securite et DMZ

\`\`\`
                    Internet
                       |
                  [Firewall externe]
                       |
                    ── DMZ ──
                  (serveurs publics :
                  Web, Mail, DNS)
                       |
                  [Firewall interne]
                       |
                 Reseau interne
              (postes, serveurs prives)
\`\`\`

- **DMZ** (zone demilitarisee) : zone intermediaire entre Internet et le reseau interne
- Le firewall externe autorise le trafic Internet vers la DMZ
- Le firewall interne protege le reseau interne de la DMZ

> **Point CCNA :** Vous devez connaitre la difference entre stateless et stateful, et comprendre ce qu'un NGFW apporte de plus. L'examen peut aussi poser des questions sur la DMZ et les zones de securite.`
      },
      {
        title: 'IDS vs IPS : detection et prevention d\'intrusions',
        content: `Les systemes de **detection** (IDS) et de **prevention** (IPS) d'intrusions analysent le trafic reseau pour identifier les activites malveillantes.

### IDS (Intrusion Detection System)

L'IDS est un systeme **passif** : il detecte et alerte mais **ne bloque pas** le trafic.

\`\`\`
Flux reseau :
[Source] ──────────────────────→ [Destination]
              │ (copie du trafic)
              ↓
           [IDS] → Alerte !
\`\`\`

- Deploye en mode **tap** ou **SPAN** (port mirroring)
- Analyse une copie du trafic (pas inline)
- Genere des alertes envoyees au SIEM/SOC
- Aucun impact sur le trafic en cas de faux positif

### IPS (Intrusion Prevention System)

L'IPS est un systeme **actif** : il detecte et **bloque** le trafic malveillant en temps reel.

\`\`\`
Flux reseau :
[Source] ────→ [IPS] ────→ [Destination]
               (inline)
               ↓ Drop si malveillant
\`\`\`

- Deploye **inline** (dans le chemin du trafic)
- Peut dropper, resetter ou modifier les paquets malveillants
- Risque de faux positifs bloquant du trafic legitime
- Impact potentiel sur la latence

### Comparaison IDS vs IPS

| Critere | IDS | IPS |
|---------|-----|-----|
| Mode | Passif (tap/SPAN) | Actif (inline) |
| Action | Alerte seulement | Alerte + blocage |
| Impact trafic | Aucun | Possible (latence, faux positif) |
| Risque faux positif | Faible (pas de blocage) | Eleve (blocage potentiel de trafic legitime) |
| Position | Hors du chemin | Dans le chemin |
| Temps reel | Detection en temps reel, reponse differee | Detection et reponse en temps reel |

### Methodes de detection

| Methode | Description | Avantage | Inconvenient |
|---------|-------------|----------|-------------|
| **Signature-based** | Compare le trafic a une base de signatures connues | Precis pour les menaces connues | Ne detecte pas les zero-day |
| **Anomaly-based** | Etablit un profil de trafic "normal" et detecte les ecarts | Detecte les menaces inconnues | Taux de faux positifs eleve |
| **Policy-based** | Compare le trafic a des politiques definies par l'admin | Controle granulaire | Configuration complexe |
| **Heuristic-based** | Analyse le comportement des fichiers/processus | Detecte les variantes de malware | Peut etre contourne |

### Cisco Firepower et Snort

**Snort** est le moteur IDS/IPS open source le plus utilise au monde. Cisco l'a integre dans sa solution **Firepower Threat Defense (FTD)**.

\`\`\`
Exemple de regle Snort :
alert tcp any any -> 192.168.1.0/24 80 (
  msg:"Tentative SQL Injection";
  content:"' OR 1=1";
  sid:1000001;
  rev:1;
)
\`\`\`

### HIDS vs NIDS

| Type | Emplacement | Surveille |
|------|-------------|-----------|
| **NIDS** (Network-based) | Sur le reseau (tap, SPAN) | Trafic reseau |
| **HIDS** (Host-based) | Sur le serveur/poste | Fichiers, logs, processus |

> **A retenir :** L'IDS detecte et alerte (passif), l'IPS detecte et bloque (actif). L'examen CCNA demande de connaitre cette difference fondamentale et les methodes de detection (signature vs anomaly).`
      },
      {
        title: 'Terminologie et concepts complementaires',
        content: `Ce chapitre couvre les termes et concepts de securite frequemment rencontres dans l'examen CCNA 200-301.

### Terminologie essentielle

| Terme | Definition |
|-------|------------|
| **Threat** (Menace) | Source potentielle d'un incident de securite |
| **Vulnerability** (Vulnerabilite) | Faiblesse exploitable dans un systeme |
| **Exploit** | Code ou technique qui tire parti d'une vulnerabilite |
| **Risk** (Risque) | Probabilite qu'une menace exploite une vulnerabilite |
| **Attack Vector** | Chemin utilise par l'attaquant pour atteindre la cible |
| **Payload** | Code malveillant delivre par un exploit |
| **Threat Actor** | Individu ou groupe a l'origine de la menace |
| **APT** (Advanced Persistent Threat) | Attaque sophistiquee, ciblee, sur une longue duree |
| **Indicator of Compromise (IoC)** | Artefact prouvant une compromission (IP, hash, domaine) |

### Types de Threat Actors

| Type | Motivation | Ressources | Exemple |
|------|-----------|------------|---------|
| **Script Kiddie** | Amusement, reputation | Faibles (outils publics) | Ado avec Kali Linux |
| **Hacktiviste** | Ideologie, activisme | Moyennes | Anonymous |
| **Cybercriminel** | Financiere | Elevees | Groupes ransomware |
| **Nation-State** | Espionnage, sabotage | Tres elevees | APT28, Lazarus |
| **Insider Threat** | Variable (vengeance, negligence) | Acces interne | Employe mecontent |

### Cryptographie : les bases

| Concept | Description |
|---------|-------------|
| **Chiffrement symetrique** | Meme cle pour chiffrer et dechiffrer (AES, DES, 3DES) |
| **Chiffrement asymetrique** | Paire de cles publique/privee (RSA, ECDSA) |
| **Hachage** | Fonction a sens unique, empreinte fixe (SHA-256, MD5) |
| **PKI** | Infrastructure a cles publiques (CA, certificats X.509) |
| **TLS/SSL** | Protocole de chiffrement des communications (HTTPS) |

### Chiffrement symetrique vs asymetrique

| Critere | Symetrique | Asymetrique |
|---------|-----------|-------------|
| Cles | 1 cle partagee | 2 cles (publique + privee) |
| Vitesse | Rapide | Lent (x1000) |
| Usage | Chiffrement en masse (donnees) | Echange de cles, signatures |
| Exemples | AES-128, AES-256, 3DES | RSA-2048, ECDHE |
| Distribution | Probleme : comment partager la cle ? | Cle publique diffusable librement |

### Authentification multi-facteurs (MFA)

La MFA combine au moins 2 des 3 facteurs suivants :

\`\`\`
Facteur 1 : Quelque chose que vous SAVEZ     → Mot de passe, PIN
Facteur 2 : Quelque chose que vous AVEZ       → Token, smartphone, smart card
Facteur 3 : Quelque chose que vous ETES        → Empreinte digitale, iris, voix
\`\`\`

### NAT et PAT comme mesure de securite

Le **NAT** (Network Address Translation) masque les adresses IP internes, offrant une couche d'obscurite (mais ce n'est pas un vrai mecanisme de securite) :

\`\`\`
! NAT masque les adresses internes
ip nat inside source list 1 interface GigabitEthernet0/1 overload
! Les hotes internes ne sont pas directement accessibles depuis Internet
\`\`\`

### Protocoles securises vs non securises

| Non securise | Securise | Port |
|-------------|----------|------|
| Telnet (23) | **SSH** (22) | 22 |
| HTTP (80) | **HTTPS** (443) | 443 |
| FTP (21) | **SFTP/SCP** (22) | 22 |
| SNMP v1/v2c | **SNMPv3** | 161 |
| TFTP (69) | **SCP** (22) | 22 |
| Syslog (UDP 514) | **Syslog over TLS** (6514) | 6514 |

> **Point CCNA :** L'examen insiste sur l'utilisation de protocoles securises. Toujours preferer SSH a Telnet, HTTPS a HTTP, SNMPv3 a SNMPv2c. Retenez aussi les 3 facteurs d'authentification pour la MFA.`
      }
    ]
  },
  {
    id: 34,
    slug: 'securite-layer2',
    title: 'Securite Layer 2',
    subtitle: 'DHCP snooping, DAI, port security, 802.1X et protection contre le VLAN hopping',
    icon: 'Lock',
    color: '#e11d48',
    duration: '45 min',
    level: 'Avance',
    videoId: '4hSf2G5257M',
    sections: [
      {
        title: 'DHCP Snooping',
        content: `Le **DHCP Snooping** est une fonctionnalite de securite Layer 2 qui filtre les messages DHCP non autorises. Il protege contre les attaques **DHCP spoofing** (rogue DHCP server) et **DHCP starvation**.

### Principe de fonctionnement

Le switch classe ses ports en deux categories :

| Type de port | Description | Messages DHCP autorises |
|-------------|-------------|------------------------|
| **Trusted** (fiable) | Connecte au serveur DHCP legitime ou a un equipement reseau | Tous les messages (OFFER, ACK, NAK) |
| **Untrusted** (non fiable) | Connecte aux clients finaux | Seulement DISCOVER et REQUEST |

Si un message **DHCP OFFER** ou **DHCP ACK** est recu sur un port **untrusted**, le switch le **droppe** immediatement. Cela empeche un attaquant de deployer un serveur DHCP pirate.

### Table de binding DHCP Snooping

Le switch construit une **table de binding** qui associe :
- Adresse **MAC** du client
- Adresse **IP** attribuee par le DHCP
- **VLAN** du client
- **Port** du switch
- **Duree** du bail

Cette table est utilisee par **DAI** (Dynamic ARP Inspection) et **IP Source Guard** pour valider le trafic.

### Configuration Cisco IOS

\`\`\`
! 1. Activer le DHCP Snooping globalement
ip dhcp snooping
!
! 2. Activer sur les VLANs concernes
ip dhcp snooping vlan 10,20,30
!
! 3. Configurer le port connecte au serveur DHCP comme trusted
interface GigabitEthernet0/1
 ip dhcp snooping trust
!
! 4. Tous les autres ports sont untrusted par defaut
! Optionnel : limiter le debit DHCP sur les ports untrusted
interface range GigabitEthernet0/2 - 24
 ip dhcp snooping limit rate 15
!
! 5. Optionnel : activer la verification de l'adresse MAC source
ip dhcp snooping verify mac-address
\`\`\`

### Commandes de verification

\`\`\`
show ip dhcp snooping
show ip dhcp snooping binding
show ip dhcp snooping statistics
\`\`\`

### Protection contre les attaques

**DHCP Starvation** : l'attaquant envoie des milliers de DHCP DISCOVER avec des MAC differentes pour epuiser le pool DHCP. La commande \`ip dhcp snooping limit rate\` limite le nombre de requetes par seconde sur un port.

**Rogue DHCP Server** : l'attaquant installe un faux serveur DHCP qui distribue de fausses informations (gateway, DNS). Seul le port trusted peut envoyer des OFFER/ACK.

> **Point CCNA :** Le DHCP Snooping est un prerequis pour DAI et IP Source Guard. Retenez que par defaut, tous les ports sont untrusted. Le port du serveur DHCP et les uplinks doivent etre configures en trusted.`
      },
      {
        title: 'Dynamic ARP Inspection (DAI)',
        content: `**Dynamic ARP Inspection (DAI)** protege contre les attaques d'**ARP spoofing** (ARP poisoning). Il valide les paquets ARP en les comparant a la table de binding du DHCP Snooping.

### Rappel : attaque ARP Spoofing

ARP est un protocole **sans authentification**. N'importe qui peut envoyer de fausses reponses ARP :

\`\`\`
Situation normale :
PC-A demande "Qui a 10.0.0.1 ?" → Le routeur repond avec sa vraie MAC

Attaque ARP Spoofing :
PC-A demande "Qui a 10.0.0.1 ?" → L'ATTAQUANT repond avec SA MAC
→ PC-A envoie tout son trafic a l'attaquant au lieu du routeur (MITM)
\`\`\`

### Fonctionnement de DAI

DAI intercepte **tous les paquets ARP** sur les ports untrusted et les valide :

1. Le switch recoit un paquet ARP sur un port untrusted
2. Il compare l'adresse **IP source** et l'adresse **MAC source** du paquet ARP avec la **table de binding DHCP Snooping**
3. Si la correspondance existe → le paquet est **transmis**
4. Si la correspondance n'existe pas → le paquet est **droppe**

### Ports trusted vs untrusted (DAI)

| Type | Comportement | Usage |
|------|-------------|-------|
| **Trusted** | Les paquets ARP ne sont PAS inspectes | Uplinks vers d'autres switches, routeur |
| **Untrusted** | Tous les paquets ARP sont valides | Ports d'acces (clients) |

### Configuration Cisco IOS

\`\`\`
! Prerequis : DHCP Snooping doit etre actif
ip dhcp snooping
ip dhcp snooping vlan 10,20
!
! 1. Activer DAI sur les VLANs concernes
ip arp inspection vlan 10,20
!
! 2. Configurer les uplinks comme trusted
interface GigabitEthernet0/1
 ip arp inspection trust
!
! 3. Optionnel : validation supplementaire
ip arp inspection validate src-mac dst-mac ip
! src-mac : verifie que MAC source Ethernet = MAC source ARP
! dst-mac : verifie que MAC destination Ethernet = MAC cible ARP
! ip      : verifie que l'IP source n'est pas 0.0.0.0 ni broadcast
!
! 4. Limiter le debit ARP sur les ports untrusted (anti-DoS)
interface range GigabitEthernet0/2 - 24
 ip arp inspection limit rate 30
\`\`\`

### ACL ARP statiques (sans DHCP Snooping)

Pour les hotes avec des adresses IP statiques (serveurs), on cree des **ARP ACLs** manuelles :

\`\`\`
arp access-list SERVEURS-STATIQUES
 permit ip host 10.0.0.100 mac host 0050.7966.1234
 permit ip host 10.0.0.101 mac host 0050.7966.5678
!
ip arp inspection filter SERVEURS-STATIQUES vlan 10
\`\`\`

### Commandes de verification

\`\`\`
show ip arp inspection vlan 10
show ip arp inspection statistics
show ip arp inspection interfaces
\`\`\`

> **A retenir :** DAI depend de la table de binding du DHCP Snooping. Pour les hotes statiques, utilisez des ARP ACLs. Configurez les uplinks en trusted pour eviter de bloquer le trafic ARP legitime entre switches.`
      },
      {
        title: 'Port Security',
        content: `**Port Security** est une fonctionnalite de securite Layer 2 qui limite le nombre d'adresses MAC autorisees sur un port de switch. Elle protege contre les attaques de **MAC flooding** et le branchement d'equipements non autorises.

### Rappel : attaque MAC Flooding

L'attaquant inonde le switch avec des milliers d'adresses MAC aleatoires pour remplir sa **table CAM** (Content Addressable Memory). Quand la table est pleine, le switch se comporte comme un **hub** et envoie tout le trafic sur tous les ports → l'attaquant voit tout.

### Fonctionnement de Port Security

Le switch surveille les adresses MAC apprises sur chaque port securise. Si le nombre depasse la limite configuree ou si une adresse non autorisee est detectee, une **violation** est declenchee.

### Configuration de base

\`\`\`
! 1. Le port DOIT etre en mode access (pas trunk)
interface GigabitEthernet0/5
 switchport mode access
 switchport access vlan 10
!
! 2. Activer port security
 switchport port-security
!
! 3. Definir le nombre maximum d'adresses MAC (defaut = 1)
 switchport port-security maximum 2
!
! 4. Choisir le mode de violation
 switchport port-security violation shutdown
!
! 5. Optionnel : definir une adresse MAC statique
 switchport port-security mac-address 0050.7966.abcd
\`\`\`

### Modes de violation

| Mode | Trafic | Port | Log/SNMP | Compteur violation |
|------|--------|------|----------|-------------------|
| **Shutdown** (defaut) | Bloque tout | err-disabled | Oui | Oui |
| **Restrict** | Bloque la MAC non autorisee | Reste up | Oui | Oui |
| **Protect** | Bloque la MAC non autorisee | Reste up | Non | Non |

**Shutdown** est le mode le plus securise : le port passe en etat **err-disabled** et doit etre reactive manuellement.

### Recuperation d'un port en err-disabled

\`\`\`
! Methode manuelle
interface GigabitEthernet0/5
 shutdown
 no shutdown
!
! Methode automatique (recuperation apres un delai)
errdisable recovery cause psecure-violation
errdisable recovery interval 300
! Le port se reactivera automatiquement apres 300 secondes
\`\`\`

### Sticky MAC addresses

Le mode **sticky** permet au switch d'apprendre dynamiquement les adresses MAC et de les **sauvegarder dans la running-config** :

\`\`\`
interface GigabitEthernet0/5
 switchport mode access
 switchport port-security
 switchport port-security maximum 3
 switchport port-security violation restrict
 switchport port-security mac-address sticky
!
! Apres que les 3 premieres MAC sont apprises, elles sont ajoutees :
! switchport port-security mac-address sticky 0050.7966.1111
! switchport port-security mac-address sticky 0050.7966.2222
! switchport port-security mac-address sticky 0050.7966.3333
!
! IMPORTANT : faire 'copy running-config startup-config' pour persister
\`\`\`

### Commandes de verification

\`\`\`
show port-security
show port-security interface GigabitEthernet0/5
show port-security address
show interfaces status err-disabled
\`\`\`

### Sortie typique de show port-security interface

\`\`\`
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Shutdown
Maximum MAC Addresses      : 2
Total MAC Addresses        : 1
Sticky MAC Addresses       : 1
Security Violation Count   : 0
\`\`\`

> **Point CCNA :** Port Security est un sujet tres frequemment teste au CCNA. Retenez les 3 modes de violation (shutdown, restrict, protect), le fonctionnement du sticky MAC, et la procedure de recuperation d'un port err-disabled.`
      },
      {
        title: '802.1X : authentification port-based',
        content: `**802.1X** est un standard IEEE pour le **controle d'acces reseau base sur les ports** (port-based NAC). Il empeche un equipement de communiquer sur le reseau tant qu'il n'est pas authentifie.

### Architecture 802.1X

Le modele 802.1X implique trois acteurs :

\`\`\`
[Supplicant]  ←─ EAP ─→  [Authenticator]  ←─ RADIUS ─→  [Authentication Server]
  (client)                   (switch/AP)                     (RADIUS : ISE, FreeRADIUS)
\`\`\`

| Composant | Role | Exemple |
|-----------|------|---------|
| **Supplicant** | Client qui demande l'acces | PC avec client 802.1X (Windows natif, AnyConnect) |
| **Authenticator** | Intermediaire qui controle le port | Switch Cisco, access point WiFi |
| **Authentication Server** | Verifie les credentials | Cisco ISE, FreeRADIUS, Microsoft NPS |

### Fonctionnement detaille

1. Le client se connecte au port du switch
2. Le port est en etat **"non autorise"** : seul le trafic EAP (802.1X) est permis
3. Le switch envoie un **EAP-Request/Identity** au client
4. Le client repond avec son identite (username)
5. Le switch relaye la requete au serveur RADIUS
6. Le serveur RADIUS challenge le client (methode EAP choisie)
7. Le client repond au challenge
8. Si l'authentification reussit → le serveur envoie un **RADIUS Access-Accept**
9. Le switch passe le port en etat **"autorise"** → le client peut communiquer
10. Le serveur peut aussi attribuer dynamiquement un **VLAN** et des **ACL**

### Methodes EAP courantes

| Methode | Certificat client | Certificat serveur | Securite | Usage |
|---------|------------------|--------------------|----------|-------|
| **EAP-TLS** | Oui | Oui | Tres haute | Enterprise (meilleure pratique) |
| **PEAP (EAP-MSCHAPv2)** | Non | Oui | Haute | La plus deployee en entreprise |
| **EAP-TTLS** | Non | Oui | Haute | Alternative a PEAP |
| **EAP-FAST** | Non (PAC) | Optionnel | Moyenne-haute | Cisco proprietaire |
| **MAB** | Non (MAC) | Non | Faible | Imprimantes, telephones IP |

### Configuration Cisco IOS

\`\`\`
! 1. Activer AAA et 802.1X globalement
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
!
! 2. Activer 802.1X globalement
dot1x system-auth-control
!
! 3. Definir le serveur RADIUS
radius server ISE-PRIMARY
 address ipv4 10.0.0.50 auth-port 1812 acct-port 1813
 key SharedSecret123
!
! 4. Configurer le port en mode 802.1X
interface GigabitEthernet0/5
 switchport mode access
 switchport access vlan 10
 authentication port-control auto
 dot1x pae authenticator
!
! 5. Optionnel : VLAN guest pour les non-authentifies
 authentication event no-response action authorize vlan 99
!
! 6. Optionnel : MAB fallback (pour imprimantes, etc.)
 mab
 authentication order dot1x mab
 authentication priority dot1x mab
\`\`\`

### Etats du port 802.1X

| Etat | Description |
|------|-------------|
| **Force-authorized** | Le port est toujours autorise (pas de 802.1X) |
| **Force-unauthorized** | Le port est toujours bloque |
| **Auto** | Le port utilise 802.1X pour authentifier le client |

### Commandes de verification

\`\`\`
show dot1x all
show authentication sessions
show authentication sessions interface Gi0/5
show aaa servers
\`\`\`

> **A retenir :** 802.1X est le standard pour le controle d'acces reseau en entreprise. Le switch (authenticator) est un simple relais entre le client (supplicant) et le serveur RADIUS. PEAP est la methode EAP la plus deployee, EAP-TLS la plus securisee.`
      },
      {
        title: 'VLAN Hopping et attaques Layer 2',
        content: `Le **VLAN hopping** est une attaque qui permet a un attaquant d'envoyer du trafic vers un VLAN auquel il n'est pas autorise a acceder. Il existe deux techniques principales.

### Attaque 1 : Switch Spoofing

L'attaquant configure son interface en mode trunk (via DTP) pour recevoir le trafic de tous les VLANs :

\`\`\`
Fonctionnement :
1. Le port du switch est en mode "dynamic auto" ou "dynamic desirable"
2. L'attaquant envoie des trames DTP pour negocier un trunk
3. Le trunk est etabli → l'attaquant recoit le trafic de tous les VLANs
\`\`\`

**Protection :**

\`\`\`
! Desactiver DTP sur tous les ports d'acces
interface range GigabitEthernet0/1 - 24
 switchport mode access
 switchport nonegotiate
!
! Les ports trunk doivent etre configures manuellement
interface GigabitEthernet0/48
 switchport mode trunk
 switchport nonegotiate
 switchport trunk allowed vlan 10,20,30
\`\`\`

### Attaque 2 : Double Tagging (Double Encapsulation)

L'attaquant envoie une trame avec **deux tags 802.1Q**. Le premier switch retire le tag externe (natif VLAN) et transmet la trame avec le tag interne vers le VLAN cible.

\`\`\`
Conditions requises :
- L'attaquant est sur le native VLAN du trunk
- Le switch retire le premier tag et forward avec le second

[Attaquant VLAN 1] → Trame [Tag VLAN 1 | Tag VLAN 20 | Data]
                           Switch retire le premier tag ↓
                     → Trame [Tag VLAN 20 | Data]
                           Forwarding vers VLAN 20 ↓
                     → Le paquet atteint le VLAN 20 !
\`\`\`

**Limitations** : l'attaque est **unidirectionnelle** (pas de retour possible).

**Protection :**

\`\`\`
! 1. Ne JAMAIS utiliser le VLAN 1 comme native VLAN
switchport trunk native vlan 999
!
! 2. Taguer le native VLAN sur les trunks
vlan dot1q tag native
!
! 3. Ne pas placer d'utilisateurs dans le native VLAN
! Le VLAN 999 ne doit etre attribue a aucun port d'acces
\`\`\`

### Storm Control

Le **storm control** protege contre les tempetes de broadcast, multicast et unicast inconnu qui peuvent saturer le reseau :

\`\`\`
interface GigabitEthernet0/5
 storm-control broadcast level 20.00
 storm-control multicast level 15.00
 storm-control unicast level 10.00
 storm-control action shutdown
!
! Le port sera desactive si le trafic broadcast depasse 20%
! de la bande passante du port
\`\`\`

### STP et BPDU Guard

**BPDU Guard** protege contre les attaques STP en desactivant un port qui recoit des BPDU (un poste ne devrait jamais en envoyer) :

\`\`\`
! Activer BPDU Guard sur les ports d'acces
interface range GigabitEthernet0/1 - 24
 spanning-tree bpduguard enable
!
! Ou globalement sur tous les ports PortFast
spanning-tree portfast bpduguard default
\`\`\`

**Root Guard** empeche un port de devenir root port, protegeant la topologie STP :

\`\`\`
interface GigabitEthernet0/48
 spanning-tree guard root
\`\`\`

> **Point CCNA :** Le VLAN hopping est un sujet classique de l'examen. Retenez les deux techniques (switch spoofing et double tagging) et surtout les protections : \`switchport nonegotiate\`, native VLAN dedie, et \`vlan dot1q tag native\`.`
      },
      {
        title: 'Best practices de securite Layer 2',
        content: `Ce chapitre recapitule les **bonnes pratiques** de securisation de la couche 2, essentielles pour le CCNA et en environnement de production.

### Checklist de securisation d'un switch

\`\`\`
! ============================================
! SECURISATION COMPLETE D'UN SWITCH CISCO
! ============================================
!
! 1. SECURISER L'ACCES MANAGEMENT
enable secret StrongP@ssw0rd!
username admin privilege 15 secret AdminP@ss!
!
line console 0
 login local
 exec-timeout 5 0
 logging synchronous
!
line vty 0 15
 login local
 transport input ssh
 exec-timeout 10 0
!
! Desactiver Telnet, utiliser SSH uniquement
ip ssh version 2
crypto key generate rsa modulus 2048
!
! 2. DESACTIVER LES PORTS NON UTILISES
interface range GigabitEthernet0/10 - 24
 shutdown
 switchport access vlan 999
 description *** PORT DESACTIVE ***
!
! 3. SECURISER LES PORTS D'ACCES
interface range GigabitEthernet0/1 - 9
 switchport mode access
 switchport nonegotiate
 spanning-tree portfast
 spanning-tree bpduguard enable
!
! 4. SECURISER LES TRUNKS
interface GigabitEthernet0/48
 switchport mode trunk
 switchport nonegotiate
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,30
!
! 5. ACTIVER DHCP SNOOPING
ip dhcp snooping
ip dhcp snooping vlan 10,20,30
interface GigabitEthernet0/48
 ip dhcp snooping trust
!
! 6. ACTIVER DAI
ip arp inspection vlan 10,20,30
interface GigabitEthernet0/48
 ip arp inspection trust
!
! 7. ACTIVER PORT SECURITY
interface range GigabitEthernet0/1 - 9
 switchport port-security
 switchport port-security maximum 3
 switchport port-security violation restrict
 switchport port-security mac-address sticky
!
! 8. ACTIVER STORM CONTROL
interface range GigabitEthernet0/1 - 9
 storm-control broadcast level 20.00
 storm-control action shutdown
\`\`\`

### Tableau recapitulatif des protections Layer 2

| Attaque | Protection | Commande cle |
|---------|-----------|-------------|
| Rogue DHCP Server | DHCP Snooping | \`ip dhcp snooping\` |
| DHCP Starvation | DHCP Snooping + Port Security | \`limit rate\` + \`port-security\` |
| ARP Spoofing | DAI (Dynamic ARP Inspection) | \`ip arp inspection\` |
| MAC Flooding | Port Security | \`switchport port-security\` |
| Switch Spoofing (DTP) | Desactiver DTP | \`switchport nonegotiate\` |
| Double Tagging | Native VLAN dedie | \`native vlan 999\` |
| STP Manipulation | BPDU Guard + Root Guard | \`bpduguard enable\` |
| Broadcast Storm | Storm Control | \`storm-control broadcast\` |
| Acces non autorise | 802.1X | \`dot1x system-auth-control\` |

### IP Source Guard

**IP Source Guard** va plus loin que DAI en validant aussi les paquets **IP** (pas seulement ARP) avec la table de binding DHCP Snooping :

\`\`\`
interface GigabitEthernet0/5
 ip verify source
! Valide que l'IP source du paquet correspond a la table DHCP binding
\`\`\`

### Private VLANs (PVLAN)

Les PVLANs ajoutent une isolation **entre les ports d'un meme VLAN** :

| Type | Communication |
|------|--------------|
| **Promiscuous** | Peut communiquer avec tous (gateway, serveur) |
| **Isolated** | Ne peut communiquer qu'avec le port promiscuous |
| **Community** | Peut communiquer avec son community group et le promiscuous |

### Bonnes pratiques generales

1. **Ne jamais utiliser le VLAN 1** pour le trafic utilisateur
2. **Desactiver les ports inutilises** et les placer dans un VLAN "parking"
3. **Toujours configurer les ports en mode access** sur les ports utilisateur
4. **Limiter les VLANs autorises** sur les trunks (\`allowed vlan\`)
5. **Activer la journalisation** des violations de securite
6. **Documenter** la politique de securite et les configurations
7. **Auditer regulierement** les configurations des switches

> **A retenir :** La securite Layer 2 repose sur la combinaison de plusieurs mecanismes : DHCP Snooping + DAI + Port Security + 802.1X + desactivation de DTP. Aucune mesure seule ne suffit — c'est la defense en profondeur appliquee au switch.`
      }
    ]
  },
  {
    id: 35,
    slug: 'vpn-ipsec',
    title: 'VPN IPsec',
    subtitle: 'Types de VPN, framework IPsec, IKE, tunnels GRE et GRE over IPsec',
    icon: 'Eye',
    color: '#e11d48',
    duration: '40 min',
    level: 'Avance',
    videoId: 'Z7LwU6H5IGE',
    sections: [
      {
        title: 'Introduction aux VPN',
        content: `Un **VPN** (Virtual Private Network) cree un **tunnel chiffre** a travers un reseau non securise (Internet) pour connecter des sites distants ou des utilisateurs nomades de maniere securisee.

### Pourquoi utiliser un VPN ?

| Sans VPN | Avec VPN |
|----------|---------|
| Donnees en clair sur Internet | Donnees chiffrees de bout en bout |
| Pas d'authentification du site distant | Authentification mutuelle des extremites |
| Vulnerable aux interceptions (MITM) | Protection contre l'ecoute et la modification |
| Impossible de connecter des sites prives via Internet | Extension du reseau prive a travers Internet |

### Types de VPN

| Type | Description | Usage |
|------|-------------|-------|
| **Site-to-Site** | Connecte deux reseaux (LAN) a travers Internet | Interconnexion de sites d'entreprise |
| **Remote Access** | Connecte un utilisateur individuel au reseau d'entreprise | Teletravail, deplacement |
| **SSL/TLS VPN** | VPN accessible via un navigateur web (HTTPS) | Acces simplifie sans client lourd |
| **Client-based VPN** | Logiciel installe sur le poste client (AnyConnect, OpenVPN) | Teletravail avec acces complet |
| **Clientless VPN** | Acces via portail web sans logiciel supplementaire | Acces limite (webmail, fichiers) |

### VPN Site-to-Site

\`\`\`
      Site A (Paris)                         Site B (Lyon)
   ┌──────────────┐                     ┌──────────────┐
   │ LAN 10.1.0.0 │                     │ LAN 10.2.0.0 │
   │              │                     │              │
   │   Routeur R1 ├───── Tunnel IPsec ──┤   Routeur R2 │
   │  (82.1.1.1)  │     (Internet)      │  (83.2.2.2)  │
   └──────────────┘                     └──────────────┘
\`\`\`

Le tunnel est **transparent** pour les utilisateurs : le PC a Paris communique avec le serveur a Lyon comme s'ils etaient sur le meme reseau.

### VPN Remote Access

\`\`\`
   Utilisateur nomade                    Entreprise
   ┌──────────────┐                ┌───────────────────┐
   │  PC portable  │               │  Concentrateur VPN │
   │  + AnyConnect ├── Tunnel ─────┤  (ASA / Firepower) │
   │  (4G/WiFi)   │  (Internet)   │  LAN 10.0.0.0      │
   └──────────────┘                └───────────────────┘
\`\`\`

### SSL VPN vs IPsec VPN

| Critere | IPsec VPN | SSL/TLS VPN |
|---------|-----------|-------------|
| Couche OSI | Couche 3 (reseau) | Couche 4-7 (transport/application) |
| Client requis | Oui (software ou hardware) | Non (navigateur) ou leger |
| Port | UDP 500/4500, protocole 50/51 | TCP 443 (HTTPS) |
| NAT traversal | Necessite NAT-T (encapsulation UDP) | Fonctionne nativement a travers NAT |
| Acces | Reseau complet (full tunnel) | Granulaire (par application) |
| Performance | Meilleure (moins d'overhead) | Bonne |
| Facilite deploiement | Plus complexe | Plus simple (rien a installer) |

### Cisco AnyConnect

**Cisco AnyConnect Secure Mobility Client** est la solution VPN remote access de Cisco. Il supporte :
- **IPsec (IKEv2)** pour les performances
- **SSL/TLS** pour la compatibilite
- **DTLS** (Datagram TLS) pour les applications temps reel

> **Point CCNA :** L'examen CCNA teste les concepts des VPN mais pas la configuration detaillee d'AnyConnect. Retenez la difference entre site-to-site et remote access, et entre IPsec et SSL VPN.`
      },
      {
        title: 'Framework IPsec',
        content: `**IPsec** (IP Security) est un **framework** de protocoles qui fournit la confidentialite, l'integrite et l'authentification au niveau de la couche 3 (IP). Ce n'est pas un seul protocole mais un ensemble de standards.

### Les services de securite IPsec

| Service | Description | Assure par |
|---------|-------------|-----------|
| **Confidentialite** | Chiffrement des donnees | ESP (DES, 3DES, AES) |
| **Integrite** | Detection des modifications | AH ou ESP (HMAC-SHA, HMAC-MD5) |
| **Authentification** | Verification de l'identite du pair | IKE (PSK, certificats, RSA) |
| **Anti-replay** | Protection contre la re-emission de paquets | Numero de sequence dans AH/ESP |

### AH vs ESP

| Critere | AH (Authentication Header) | ESP (Encapsulating Security Payload) |
|---------|--------------------------|--------------------------------------|
| Protocole IP | 51 | 50 |
| Confidentialite | Non (pas de chiffrement) | **Oui** (chiffrement) |
| Integrite | Oui (tout le paquet, y compris l'en-tete IP) | Oui (payload uniquement) |
| Authentification | Oui | Oui |
| Compatible NAT | **Non** (protege l'en-tete IP) | Oui (avec NAT-T, encapsulation UDP 4500) |

**En pratique, on utilise presque toujours ESP** car il fournit le chiffrement et fonctionne avec le NAT.

### Mode Transport vs Mode Tunnel

| Critere | Mode Transport | Mode Tunnel |
|---------|---------------|-------------|
| Protection | Payload uniquement | **Paquet IP entier** |
| En-tete IP | Original preserve | Nouvel en-tete IP ajoute |
| Usage | Host-to-host (rare) | **Site-to-site, remote access** (standard) |
| Overhead | Moins (pas de nouvel en-tete) | Plus (nouvel en-tete IP) |

\`\`\`
Mode Transport :
[IP Header original] [ESP Header] [Payload chiffre] [ESP Trailer]

Mode Tunnel :
[Nouvel IP Header] [ESP Header] [IP Header original + Payload chiffre] [ESP Trailer]
\`\`\`

### Algorithmes IPsec

**Chiffrement (confidentialite)** :

| Algorithme | Taille cle | Securite | Recommandation |
|-----------|-----------|----------|---------------|
| DES | 56 bits | **Obsolete** | Ne pas utiliser |
| 3DES | 168 bits | Faible | Deprecie |
| **AES-128** | 128 bits | Bonne | Acceptable |
| **AES-256** | 256 bits | **Excellente** | Recommande |

**Hachage (integrite)** :

| Algorithme | Taille hash | Recommandation |
|-----------|------------|---------------|
| MD5 | 128 bits | Deprecie |
| SHA-1 | 160 bits | Deprecie |
| **SHA-256** | 256 bits | Recommande |
| **SHA-512** | 512 bits | Haute securite |

**Echange de cles** :

| Methode | Description |
|---------|-------------|
| **DH Group 14** | Diffie-Hellman 2048 bits (minimum recommande) |
| **DH Group 19** | ECDH 256 bits (equivalent DH 3072) |
| **DH Group 21** | ECDH 521 bits (haute securite) |

> **A retenir :** IPsec = AH (integrite sans chiffrement) + ESP (chiffrement + integrite). ESP en mode tunnel est le mode standard pour les VPN. Privilegiez AES-256 + SHA-256 + DH Group 14 minimum.`
      },
      {
        title: 'IKE : Internet Key Exchange',
        content: `**IKE** (Internet Key Exchange) est le protocole qui negocie les parametres de securite et echange les cles de chiffrement pour etablir les **Security Associations (SA)** IPsec.

### Versions d'IKE

| Critere | IKEv1 | IKEv2 |
|---------|-------|-------|
| Messages pour etablir le tunnel | 9 (main mode) ou 6 (aggressive mode) | **4 messages** |
| NAT-T | Extension optionnelle | Integre nativement |
| Multi-homing | Non | Oui (MOBIKE) |
| EAP | Non | Oui |
| Fiabilite | Pas de retransmission | Retransmission integree |
| Port | UDP 500 (et 4500 pour NAT-T) | UDP 500 (et 4500 pour NAT-T) |

### IKE Phase 1 : le tunnel de management

La Phase 1 etablit un **canal securise** (IKE SA) entre les deux pairs pour proteger les negociations de la Phase 2.

**Ce qui est negocie en Phase 1 :**

| Parametre | Options |
|-----------|---------|
| **Algorithme de chiffrement** | AES-128, AES-256, 3DES |
| **Algorithme de hachage** | SHA-256, SHA-512, MD5 |
| **Methode d'authentification** | PSK (Pre-Shared Key), certificats RSA |
| **Groupe Diffie-Hellman** | Group 14, 19, 21 |
| **Duree de vie (lifetime)** | Duree en secondes (defaut: 86400 = 24h) |

**Modes IKEv1 Phase 1 :**
- **Main Mode** : 6 messages, plus securise (identite protegee)
- **Aggressive Mode** : 3 messages, plus rapide mais identite exposee en clair

### IKE Phase 2 : le tunnel de donnees

La Phase 2 negocie les **IPsec SA** qui protegeront le trafic reel. Elle utilise le canal securise de la Phase 1.

**Ce qui est negocie en Phase 2 :**

| Parametre | Description |
|-----------|-------------|
| **Protocole** | ESP (ou AH) |
| **Algorithme de chiffrement** | AES-256, AES-128 |
| **Algorithme d'integrite** | SHA-256, SHA-512 |
| **Mode** | Tunnel (standard) ou Transport |
| **Duree de vie** | Secondes ou volume (defaut: 3600s = 1h) |
| **PFS (Perfect Forward Secrecy)** | Nouveau DH pour chaque rekey |
| **Trafic interessant** | ACL definissant le trafic a proteger |

### Deroulement complet

\`\`\`
Phase 1 (IKE SA) :
R1 ←→ R2 : Negociation des parametres (ISAKMP)
R1 ←→ R2 : Echange Diffie-Hellman (cle partagee)
R1 ←→ R2 : Authentification mutuelle (PSK ou certificat)
→ Tunnel de management etabli

Phase 2 (IPsec SA) :
R1 ←→ R2 : Negociation ESP/AH + chiffrement + hash (via Phase 1)
R1 ←→ R2 : Generation des cles de session
→ Tunnel de donnees operationnel

Trafic :
[PC-A] → [R1] → [Trafic chiffre ESP] → [R2] → [PC-B]
\`\`\`

### Configuration IKEv1 sur Cisco IOS (conceptuel)

\`\`\`
! Phase 1 - ISAKMP Policy
crypto isakmp policy 10
 encryption aes 256
 hash sha256
 authentication pre-share
 group 14
 lifetime 86400
!
crypto isakmp key SecretKey123 address 83.2.2.2
!
! Phase 2 - Transform Set
crypto ipsec transform-set MY-TRANSFORM esp-aes 256 esp-sha256-hmac
 mode tunnel
!
! Trafic interessant (ACL)
access-list 101 permit ip 10.1.0.0 0.0.0.255 10.2.0.0 0.0.0.255
!
! Crypto Map
crypto map MY-VPN 10 ipsec-isakmp
 set peer 83.2.2.2
 set transform-set MY-TRANSFORM
 match address 101
!
interface GigabitEthernet0/0
 crypto map MY-VPN
\`\`\`

> **Point CCNA :** Vous devez comprendre le role des deux phases IKE. Phase 1 = canal de management securise (ISAKMP SA). Phase 2 = tunnel de donnees (IPsec SA). IKEv2 est plus efficace (4 messages au lieu de 9).`
      },
      {
        title: 'Tunnels GRE et GRE over IPsec',
        content: `**GRE** (Generic Routing Encapsulation) est un protocole de tunneling simple qui encapsule pratiquement n'importe quel protocole dans un tunnel point-a-point. Combine avec IPsec, il offre a la fois flexibilite et securite.

### GRE seul

| Caracteristique | Detail |
|----------------|--------|
| Protocole IP | 47 |
| Chiffrement | **Non** |
| Multicast/Broadcast | **Oui** (contrairement a IPsec seul) |
| Protocoles de routage | **Oui** (OSPF, EIGRP, BGP via le tunnel) |
| Overhead | 24 octets (4 GRE + 20 IP externe) |

### Pourquoi GRE est utile

IPsec seul ne supporte **pas** le multicast ni le broadcast. Or, les protocoles de routage dynamique (OSPF, EIGRP) utilisent le multicast pour decouvrir les voisins. GRE resout ce probleme.

\`\`\`
IPsec seul :
- Chiffre le trafic unicast ✓
- Ne supporte PAS le multicast ✗
- Pas de routage dynamique a travers le tunnel ✗

GRE seul :
- Encapsule tout type de trafic (unicast, multicast, broadcast) ✓
- Supporte le routage dynamique ✓
- PAS de chiffrement ✗

GRE over IPsec :
- Encapsule tout type de trafic ✓
- Supporte le routage dynamique ✓
- Chiffrement complet ✓ (meilleure solution)
\`\`\`

### Configuration d'un tunnel GRE

\`\`\`
! Sur le routeur R1 (Paris)
interface Tunnel0
 ip address 172.16.0.1 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 83.2.2.2
 tunnel mode gre ip
!
! Route statique via le tunnel
ip route 10.2.0.0 255.255.0.0 172.16.0.2
!
! Ou routage dynamique
router ospf 1
 network 172.16.0.0 0.0.0.3 area 0
 network 10.1.0.0 0.0.255.255 area 0
\`\`\`

\`\`\`
! Sur le routeur R2 (Lyon)
interface Tunnel0
 ip address 172.16.0.2 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 82.1.1.1
 tunnel mode gre ip
!
router ospf 1
 network 172.16.0.0 0.0.0.3 area 0
 network 10.2.0.0 0.0.255.255 area 0
\`\`\`

### GRE over IPsec

Pour combiner GRE et IPsec, on protege le tunnel GRE avec une crypto map ou un profil IPsec :

\`\`\`
! L'ACL match le trafic GRE (protocole 47)
access-list 101 permit gre host 82.1.1.1 host 83.2.2.2
!
! Le transform-set et la crypto map protegent le trafic GRE
crypto ipsec transform-set GRE-IPSEC esp-aes 256 esp-sha256-hmac
 mode transport
! Note : mode transport car on chiffre le paquet GRE, pas besoin
! d'un second en-tete IP (le GRE a deja son en-tete IP externe)
!
crypto map VPN-MAP 10 ipsec-isakmp
 set peer 83.2.2.2
 set transform-set GRE-IPSEC
 match address 101
!
interface GigabitEthernet0/0
 crypto map VPN-MAP
\`\`\`

### Structure du paquet GRE over IPsec

\`\`\`
[IP externe] [ESP Header] [GRE Header] [IP interne] [Payload] [ESP Trailer]
 82.1.1.1    chiffrement   tunnel GRE    10.1.0.0     donnees
 → 83.2.2.2
\`\`\`

### Verification

\`\`\`
show interface Tunnel0
show crypto isakmp sa
show crypto ipsec sa
show ip route
ping 172.16.0.2 source 172.16.0.1
\`\`\`

> **A retenir :** GRE over IPsec est la solution standard pour les VPN site-to-site avec routage dynamique. GRE apporte le support du multicast, IPsec apporte le chiffrement. C'est complementaire.`
      },
      {
        title: 'DMVPN et comparaison des solutions VPN',
        content: `**DMVPN** (Dynamic Multipoint VPN) est une evolution majeure de GRE over IPsec qui simplifie les topologies VPN a grande echelle. C'est un concept important pour le CCNA.

### Probleme du GRE over IPsec classique

Avec GRE over IPsec, chaque paire de sites necessite un tunnel **dedie** :
- 3 sites = 3 tunnels
- 10 sites = 45 tunnels
- 50 sites = 1225 tunnels !

DMVPN resout ce probleme avec des tunnels **dynamiques**.

### Architecture DMVPN

| Composant | Description |
|-----------|-------------|
| **Hub** | Site central (siege) avec tunnel mGRE permanent |
| **Spoke** | Site distant avec tunnel vers le hub |
| **mGRE** | Multipoint GRE : un seul tunnel vers multiples destinations |
| **NHRP** | Next Hop Resolution Protocol : resolution d'adresse publique des spokes |

### Fonctionnement

\`\`\`
Phase 1 : Hub-and-Spoke
- Tous les spokes se connectent au hub
- Le trafic spoke-to-spoke passe par le hub

Phase 2 : Spoke-to-Spoke (dynamique)
- Spoke A veut joindre Spoke B
- Spoke A demande au hub l'adresse de Spoke B (NHRP)
- Un tunnel direct Spoke A ↔ Spoke B est cree dynamiquement
- Le trafic passe directement (pas via le hub)

      [Spoke A] ←── tunnel dynamique ──→ [Spoke B]
          ↑                                  ↑
          └───── tunnels permanents ──── [Hub] ────┘
\`\`\`

### Avantages de DMVPN

- **Configuration simplifiee** : une seule interface tunnel sur le hub quel que soit le nombre de spokes
- **Tunnels spoke-to-spoke dynamiques** : pas de configuration par paire
- **Zero-Touch pour les spokes** : le spoke n'a besoin de connaitre que l'adresse du hub
- **Routage dynamique** : OSPF, EIGRP, BGP fonctionnent a travers DMVPN
- **Scalabilite** : supporte des centaines de sites

### Comparaison des solutions VPN

| Critere | GRE over IPsec | DMVPN | SD-WAN | SSL VPN |
|---------|----------------|-------|--------|---------|
| Type | Site-to-Site | Site-to-Site | Site-to-Site | Remote Access |
| Topologie | Point-to-Point | Hub-Spoke + Spoke-to-Spoke | Full mesh dynamique | Client-to-Site |
| Scalabilite | Faible | Bonne | Excellente | Bonne |
| Routage dynamique | Oui | Oui | Oui (OMP) | Non |
| Multipath | Non | Non (ou limite) | Oui (multi-transport) | Non |
| Application awareness | Non | Non | **Oui** | Non |
| Complexite | Moyenne | Moyenne | Haute (mais simplifiee par GUI) | Faible |
| Chiffrement | IPsec | IPsec | IPsec | TLS |

### Recapitulatif des protocoles et ports VPN

| Protocole/Port | Usage |
|---------------|-------|
| **UDP 500** | IKE (negociation Phase 1 et 2) |
| **UDP 4500** | NAT-Traversal (IKE + ESP encapsule dans UDP) |
| **IP Protocol 50** | ESP (Encapsulating Security Payload) |
| **IP Protocol 51** | AH (Authentication Header) |
| **IP Protocol 47** | GRE (tunnel) |
| **TCP 443** | SSL/TLS VPN |

### Quand utiliser quoi ?

| Scenario | Solution recommandee |
|----------|---------------------|
| 2-3 sites avec routage dynamique | GRE over IPsec |
| 10+ sites en hub-and-spoke | DMVPN Phase 2 ou 3 |
| 50+ sites avec multi-transport | SD-WAN |
| Teletravail | SSL VPN (AnyConnect) ou IPsec VPN |
| Acces ponctuel sans client | Clientless SSL VPN |
| Haute securite gouvernementale | IPsec IKEv2 avec certificats |

> **Point CCNA :** L'examen CCNA ne demande pas de configurer DMVPN en detail, mais vous devez comprendre son fonctionnement (mGRE + NHRP), ses avantages par rapport a GRE over IPsec, et savoir quand chaque type de VPN est adapte.`
      },
      {
        title: 'Resume et points cles pour l\'examen',
        content: `Ce chapitre recapitule les concepts VPN et IPsec essentiels pour l'examen CCNA 200-301.

### Tableau recapitulatif IPsec

| Composant | Role | Detail |
|-----------|------|--------|
| **IKE Phase 1** | Canal de management | Negocie : chiffrement, hash, auth, DH group, lifetime |
| **IKE Phase 2** | Tunnel de donnees | Negocie : ESP/AH, chiffrement, integrite, mode, PFS |
| **ESP** | Chiffrement + integrite | Protocole IP 50, mode tunnel (standard) |
| **AH** | Integrite seulement | Protocole IP 51, incompatible NAT |
| **DH** | Echange de cles | Genere un secret partage sans l'envoyer |
| **SA** | Association de securite | Ensemble de parametres cryptographiques |

### Les 5 etapes d'un VPN IPsec

\`\`\`
Etape 1 : Le trafic "interessant" est detecte (ACL match)
Etape 2 : IKE Phase 1 — Tunnel de management (ISAKMP SA)
Etape 3 : IKE Phase 2 — Tunnel de donnees (IPsec SA)
Etape 4 : Transfert des donnees chiffrees via le tunnel
Etape 5 : Terminaison — le tunnel est demonte apres expiration
\`\`\`

### Erreurs courantes de configuration

| Probleme | Cause | Verification |
|---------|-------|-------------|
| Phase 1 echoue | PSK differente, parametres non correspondants | \`show crypto isakmp sa\` → QM_IDLE = OK, MM_NO_STATE = erreur |
| Phase 2 echoue | Transform set incompatible, ACL miroir incorrecte | \`show crypto ipsec sa\` → compteurs encaps/decaps |
| Trafic ne passe pas | ACL crypto ne match pas, routage incorrect | \`show crypto ipsec sa\` → compteurs a 0 |
| NAT interfere | ESP bloque par NAT | Activer NAT-T (UDP 4500) |
| MTU trop grande | Fragmentation due a l'overhead IPsec | Ajuster \`ip mtu 1400\` sur l'interface tunnel |

### Points frequemment testes au CCNA

1. **Difference IDS vs IPS** : passif vs actif
2. **AH vs ESP** : ESP chiffre, AH non ; ESP compatible NAT, AH non
3. **Mode Transport vs Tunnel** : tunnel protege le paquet entier
4. **Site-to-Site vs Remote Access** : reseau-a-reseau vs utilisateur-a-reseau
5. **GRE** : supporte le multicast, pas de chiffrement
6. **GRE over IPsec** : combine les avantages des deux
7. **IKE Phase 1 vs Phase 2** : management vs donnees

### Commandes de verification essentielles

\`\`\`
! Verifier IKE Phase 1
show crypto isakmp sa
! Etat QM_IDLE = Phase 1 OK

! Verifier IPsec Phase 2
show crypto ipsec sa
! Compteurs encaps/decaps qui incrementent = trafic chiffre

! Verifier le tunnel GRE
show interface Tunnel0
! Line protocol up = tunnel operationnel

! Debug (attention en production !)
debug crypto isakmp
debug crypto ipsec
\`\`\`

### Schema mental : choisir sa solution VPN

\`\`\`
Besoin d'un VPN ?
├── Utilisateur individuel → Remote Access VPN
│   ├── Client installe → AnyConnect (IPsec/SSL)
│   └── Pas de client → Clientless SSL VPN (navigateur)
└── Site a site → Site-to-Site VPN
    ├── 2-5 sites → GRE over IPsec
    ├── 10-100 sites → DMVPN
    └── 100+ sites, multi-transport → SD-WAN
\`\`\`

> **A retenir :** IPsec est le framework de securite standard pour les VPN. Comprenez les deux phases IKE, la difference entre AH et ESP, et le role de GRE dans le support du multicast. Ces concepts sont au coeur de l'examen CCNA 200-301.`
      }
    ]
  },
  {
    id: 36,
    slug: 'aaa-controle-acces',
    title: 'AAA et controle d\'acces',
    subtitle: 'Modele AAA, RADIUS vs TACACS+, configuration locale et RBAC',
    icon: 'KeyRound',
    color: '#e11d48',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'ebU-LQPtEis',
    sections: [
      {
        title: 'Le modele AAA',
        content: `Le modele **AAA** (Authentication, Authorization, Accounting) est le cadre de reference pour le **controle d'acces** en reseau. Il repond a trois questions fondamentales : **Qui etes-vous ?**, **Qu'avez-vous le droit de faire ?**, et **Qu'avez-vous fait ?**

### Authentication (Authentification)

L'authentification verifie l'**identite** de l'utilisateur ou de l'equipement. C'est la premiere etape de tout acces.

| Methode | Description | Securite |
|---------|-------------|----------|
| **Mot de passe local** | Stocke sur l'equipement (username/password) | Faible (pas de centralisation) |
| **RADIUS** | Serveur centralise d'authentification | Haute |
| **TACACS+** | Serveur centralise (Cisco) | Haute |
| **Certificats** | Authentification basee sur PKI | Tres haute |
| **802.1X** | Port-based avec EAP | Tres haute |
| **MFA** | Multi-facteurs (2+ facteurs) | Tres haute |

### Authorization (Autorisation)

L'autorisation determine **ce que l'utilisateur a le droit de faire** apres authentification. Elle controle l'acces aux ressources et aux commandes.

\`\`\`
Exemples d'autorisation :
- Administrateur reseau → acces a toutes les commandes IOS (privilege 15)
- Technicien NOC       → acces en lecture seule (show commands, privilege 7)
- Utilisateur WiFi     → acces Internet seulement (VLAN guest)
- Invite               → portail captif, acces limite (time-limited)
\`\`\`

### Accounting (Comptabilisation/Traçabilite)

L'accounting enregistre **ce que l'utilisateur a fait** : quand il s'est connecte, quelles commandes il a executees, combien de donnees il a transmises.

| Type d'accounting | Ce qui est enregistre |
|-------------------|---------------------|
| **Network accounting** | Duree de session, volume de donnees, IP |
| **Command accounting** | Chaque commande CLI executee |
| **Connection accounting** | Sessions Telnet, SSH, HTTPS |
| **System accounting** | Evenements systeme (reload, config change) |
| **EXEC accounting** | Sessions EXEC (console, VTY) |

### Pourquoi AAA est critique

\`\`\`
Sans AAA :
- Mot de passe unique partage (enable password)
- Aucune trace de qui a fait quoi
- Impossible de differencier les niveaux d'acces
- Audit de securite impossible

Avec AAA :
- Chaque utilisateur a ses propres credentials
- Chaque action est tracee et horodatee
- Acces granulaire par role (RBAC)
- Conformite reglementaire (SOX, HIPAA, PCI-DSS)
\`\`\`

### AAA local vs AAA serveur

| Critere | AAA Local | AAA Serveur (RADIUS/TACACS+) |
|---------|----------|------------------------------|
| Base de comptes | Sur chaque equipement | Centralisee (1 serveur) |
| Scalabilite | Faible (N configs x M users) | Excellente (1 base pour tout) |
| Gestion des changements | Modifier chaque equipement | Modifier 1 seule fois |
| Fallback | Toujours disponible | Necessite un fallback local |
| Cout | Gratuit | Licence serveur (ISE) |

> **Point CCNA :** L'examen attend que vous compreniez les trois composantes d'AAA et la difference entre authentification locale et centralisee. Retenez : Authentication = identite, Authorization = permissions, Accounting = traçabilite.`
      },
      {
        title: 'RADIUS vs TACACS+',
        content: `**RADIUS** et **TACACS+** sont les deux principaux protocoles de communication entre les equipements reseau (NAS) et le serveur AAA. Comprendre leurs differences est essentiel pour le CCNA.

### RADIUS (Remote Authentication Dial-In User Service)

RADIUS est un standard ouvert (RFC 2865/2866) tres largement deploye :

| Caracteristique | Detail |
|----------------|--------|
| **Standard** | IETF (RFC 2865, 2866) |
| **Transport** | **UDP** (ports 1812/1813 ou 1645/1646) |
| **Chiffrement** | Mot de passe uniquement (pas le paquet entier) |
| **AAA** | Authentication + Authorization **combinees** |
| **Accounting** | Protocole separe (port 1813) |
| **Support** | Multi-vendeur (standard ouvert) |
| **Usage principal** | Acces reseau (WiFi 802.1X, VPN, NAC) |

### TACACS+ (Terminal Access Controller Access-Control System Plus)

TACACS+ est un protocole **proprietaire Cisco** :

| Caracteristique | Detail |
|----------------|--------|
| **Standard** | Proprietaire Cisco |
| **Transport** | **TCP** (port 49) |
| **Chiffrement** | **Paquet entier** chiffre |
| **AAA** | Authentication, Authorization et Accounting **separes** |
| **Accounting** | Integre (meme protocole) |
| **Support** | Principalement Cisco (mais supporte par d'autres) |
| **Usage principal** | Administration des equipements (CLI) |

### Tableau comparatif detaille

| Critere | RADIUS | TACACS+ |
|---------|--------|---------|
| **Transport** | UDP (1812/1813) | TCP (49) |
| **Chiffrement** | Mot de passe seulement | **Paquet entier** |
| **Separation AAA** | AuthN + AuthZ combinees | AuthN, AuthZ, AccT **separes** |
| **Controle des commandes** | Non | **Oui** (autorisation par commande) |
| **Multivendeur** | **Oui** (standard IETF) | Principalement Cisco |
| **Fiabilite transport** | Non (UDP) | **Oui** (TCP) |
| **Overhead** | Plus leger | Plus lourd |
| **Usage typique** | Acces reseau (WiFi, VPN) | **Administration equipement (CLI)** |

### Pourquoi cette difference est importante

**RADIUS** est ideal pour l'**acces reseau** :
- Un utilisateur WiFi s'authentifie → RADIUS repond Accept/Reject
- Pas besoin de controler des commandes CLI
- Standard ouvert = compatible avec tous les equipements

**TACACS+** est ideal pour l'**administration des equipements** :
- Un administrateur se connecte en SSH au routeur
- TACACS+ peut autoriser/refuser **chaque commande individuellement**
- La separation AuthN/AuthZ permet des politiques granulaires

\`\`\`
Exemple TACACS+ - autorisation par commande :
Technicien L1 :
  permit : show *
  permit : ping *
  deny   : configure terminal
  deny   : reload

Administrateur L3 :
  permit : *  (toutes les commandes)
\`\`\`

### Architecture type en entreprise

\`\`\`
                      [Cisco ISE / ACS]
                     /        |        \\
                TACACS+    TACACS+    RADIUS
                  /          |           \\
            [Routeur]    [Switch]    [WiFi Controller]
            (admin CLI)  (admin CLI)  (acces utilisateur)
\`\`\`

- **TACACS+** pour l'administration CLI des routeurs et switches
- **RADIUS** pour l'acces reseau des utilisateurs (WiFi, VPN, NAC)

### Serveurs AAA courants

| Serveur | Vendeur | RADIUS | TACACS+ |
|---------|---------|--------|---------|
| **Cisco ISE** | Cisco | Oui | Oui |
| **FreeRADIUS** | Open source | Oui | Non |
| **Microsoft NPS** | Microsoft | Oui | Non |
| **Cisco ACS** | Cisco (EOL) | Oui | Oui |
| **ClearPass** | HPE Aruba | Oui | Oui |

> **A retenir :** RADIUS = UDP, chiffrement partiel, AAA combine, standard ouvert, ideal pour l'acces reseau. TACACS+ = TCP, chiffrement total, AAA separe, controle par commande, ideal pour l'administration. C'est l'une des comparaisons les plus testees au CCNA.`
      },
      {
        title: 'Configuration AAA locale sur Cisco IOS',
        content: `La configuration **AAA locale** stocke les comptes utilisateurs directement sur l'equipement. C'est la premiere etape avant de passer a un serveur centralisee, et c'est aussi le **fallback** si le serveur RADIUS/TACACS+ est injoignable.

### Etape 1 : Activer le modele AAA

\`\`\`
! Activer AAA (OBLIGATOIRE avant toute config AAA)
aaa new-model
!
! ATTENTION : cette commande change immediatement le comportement
! d'authentification. Assurez-vous d'avoir un acces console !
\`\`\`

**Important :** \`aaa new-model\` desactive les anciens mecanismes (login/password sur les lignes VTY). Si vous perdez l'acces, utilisez la console physique pour recuperer.

### Etape 2 : Creer les comptes locaux

\`\`\`
! Creer des utilisateurs avec differents niveaux de privilege
username admin privilege 15 secret StrongP@ss123!
username technicien privilege 7 secret TechP@ss456!
username readonly privilege 1 secret ReadOnly789!
!
! privilege 15 = acces total (enable)
! privilege 7  = commandes de monitoring personnalisees
! privilege 1  = acces minimal (show basic)
! 'secret' = hash automatique (Type 9 scrypt), preferer a 'password'
\`\`\`

### Etape 3 : Configurer l'authentification

\`\`\`
! Methode d'authentification pour le login
aaa authentication login default local
! 'default' = s'applique a toutes les lignes (console, VTY)
! 'local' = utilise la base de comptes locale
!
! Methode d'authentification pour le mode enable
aaa authentication enable default enable
!
! Liste nommee pour la console (plus granulaire)
aaa authentication login CONSOLE-AUTH local
line console 0
 login authentication CONSOLE-AUTH
!
! Liste pour les VTY
aaa authentication login VTY-AUTH local
line vty 0 15
 login authentication VTY-AUTH
 transport input ssh
\`\`\`

### Etape 4 : Configurer l'autorisation

\`\`\`
! Autorisation des commandes EXEC (shell)
aaa authorization exec default local
!
! Autorisation des commandes par niveau de privilege
aaa authorization commands 1 default local
aaa authorization commands 7 default local
aaa authorization commands 15 default local
\`\`\`

### Etape 5 : Configurer l'accounting

\`\`\`
! Tracer les sessions EXEC (connexion/deconnexion)
aaa accounting exec default start-stop local
!
! Tracer les commandes executees
aaa accounting commands 15 default start-stop local
!
! start-stop = enregistre le debut ET la fin de chaque action
\`\`\`

### Configuration complete avec fallback RADIUS

\`\`\`
! Scenario reel : RADIUS principal + fallback local
aaa new-model
!
! Definir le serveur RADIUS
radius server ISE-01
 address ipv4 10.0.0.50 auth-port 1812 acct-port 1813
 key CiscoISE_Secret!
!
radius server ISE-02
 address ipv4 10.0.0.51 auth-port 1812 acct-port 1813
 key CiscoISE_Secret!
!
aaa group server radius ISE-SERVERS
 server name ISE-01
 server name ISE-02
!
! Authentication : essayer RADIUS d'abord, puis local si RADIUS indisponible
aaa authentication login default group ISE-SERVERS local
!
! Authorization et accounting via RADIUS
aaa authorization exec default group ISE-SERVERS local
aaa accounting exec default start-stop group ISE-SERVERS
aaa accounting commands 15 default start-stop group ISE-SERVERS
!
! Fallback : toujours avoir un compte local d'urgence
username emergency privilege 15 secret EmergAccess2024!
\`\`\`

### Commandes de verification

\`\`\`
show aaa method-lists all
show aaa sessions
show aaa servers
show running-config | section aaa
show privilege
\`\`\`

> **Point CCNA :** \`aaa new-model\` est la commande fondamentale qui active le framework AAA. Apres cette commande, l'authentification passe par les method lists. Toujours prevoir un fallback local en cas d'indisponibilite du serveur RADIUS/TACACS+.`
      },
      {
        title: 'Configuration TACACS+ et RADIUS sur Cisco IOS',
        content: `Ce chapitre couvre la configuration pratique des serveurs **TACACS+** et **RADIUS** sur des equipements Cisco IOS. Ces configurations sont au programme du CCNA.

### Configuration TACACS+

\`\`\`
! 1. Activer AAA
aaa new-model
!
! 2. Definir le serveur TACACS+
tacacs server ACS-PRIMARY
 address ipv4 10.0.0.50
 key TacacsSecret123!
 timeout 5
!
tacacs server ACS-SECONDARY
 address ipv4 10.0.0.51
 key TacacsSecret123!
 timeout 5
!
! 3. Creer un groupe de serveurs
aaa group server tacacs+ TACACS-SERVERS
 server name ACS-PRIMARY
 server name ACS-SECONDARY
!
! 4. Configurer l'authentification
! Premier essai : TACACS+, fallback : local
aaa authentication login default group TACACS-SERVERS local
aaa authentication login CONSOLE local
!
! 5. Configurer l'autorisation (TACACS+ permet le controle par commande)
aaa authorization exec default group TACACS-SERVERS local
aaa authorization commands 1 default group TACACS-SERVERS local
aaa authorization commands 15 default group TACACS-SERVERS local
!
! 6. Configurer l'accounting
aaa accounting exec default start-stop group TACACS-SERVERS
aaa accounting commands 1 default start-stop group TACACS-SERVERS
aaa accounting commands 15 default start-stop group TACACS-SERVERS
!
! 7. Appliquer aux lignes
line console 0
 login authentication CONSOLE
line vty 0 15
 login authentication default
 transport input ssh
\`\`\`

### Configuration RADIUS

\`\`\`
! 1. Activer AAA
aaa new-model
!
! 2. Definir le serveur RADIUS
radius server ISE-PRIMARY
 address ipv4 10.0.0.50 auth-port 1812 acct-port 1813
 key RadiusSecret456!
 timeout 5
 retransmit 3
!
radius server ISE-SECONDARY
 address ipv4 10.0.0.51 auth-port 1812 acct-port 1813
 key RadiusSecret456!
!
! 3. Creer un groupe de serveurs
aaa group server radius RADIUS-SERVERS
 server name ISE-PRIMARY
 server name ISE-SECONDARY
!
! 4. Authentication pour l'acces reseau (802.1X)
aaa authentication dot1x default group RADIUS-SERVERS
!
! 5. Authentication pour le login admin (fallback local)
aaa authentication login default group RADIUS-SERVERS local
!
! 6. Authorization reseau (attribution dynamique de VLAN, ACL)
aaa authorization network default group RADIUS-SERVERS
!
! 7. Accounting
aaa accounting dot1x default start-stop group RADIUS-SERVERS
aaa accounting network default start-stop group RADIUS-SERVERS
!
! 8. Configurer 802.1X (si utilise pour NAC)
dot1x system-auth-control
!
interface GigabitEthernet0/5
 switchport mode access
 authentication port-control auto
 dot1x pae authenticator
\`\`\`

### Method Lists : comprendre la logique

Une **method list** definit l'ordre des methodes d'authentification :

\`\`\`
aaa authentication login default group TACACS-SERVERS group RADIUS-SERVERS local
!
! Sequence :
! 1. Essayer TACACS+ → si le serveur repond (accept ou reject) → STOP
! 2. Si TACACS+ ne repond pas (timeout) → essayer RADIUS
! 3. Si RADIUS ne repond pas → utiliser la base locale
!
! IMPORTANT : si le serveur REPOND "reject", on ne passe PAS au suivant !
! Le fallback ne se declenche que si le serveur est INJOIGNABLE.
\`\`\`

### Difference entre 'local' et 'local-case'

| Methode | Comportement |
|---------|-------------|
| **local** | Username insensible a la casse |
| **local-case** | Username sensible a la casse (plus securise) |

### Deadtime et tests

\`\`\`
! Si un serveur ne repond pas, le marquer comme mort pendant 10 minutes
! (evite de tester un serveur HS a chaque authentification)
radius-server deadtime 10
!
! Test periodique pour verifier si le serveur est revenu
radius server ISE-PRIMARY
 automate-tester username probe-user
\`\`\`

### Commandes de verification

\`\`\`
! Verifier les serveurs configures et leur etat
show aaa servers
!
! Verifier les methodes d'authentification
show aaa method-lists all
!
! Tester l'authentification
test aaa group TACACS-SERVERS admin StrongP@ss server
!
! Debug (attention en production)
debug aaa authentication
debug aaa authorization
debug tacacs
debug radius
\`\`\`

> **A retenir :** La cle partagee (key) doit etre identique sur l'equipement et le serveur. Le fallback local est indispensable — sans lui, vous perdez l'acces si tous les serveurs AAA sont injoignables. L'ordre des methodes dans la method list est critique.`
      },
      {
        title: 'Niveaux de privilege et RBAC',
        content: `Le controle d'acces sur les equipements Cisco repose sur les **niveaux de privilege** (0 a 15) et, dans les versions modernes d'IOS, sur le **RBAC** (Role-Based Access Control) via les parser views.

### Niveaux de privilege Cisco IOS

Cisco IOS definit **16 niveaux de privilege** (0 a 15) :

| Niveau | Description | Commandes accessibles |
|--------|-------------|----------------------|
| **0** | Aucun acces utile | \`logout\`, \`enable\`, \`help\` |
| **1** | User EXEC (defaut) | \`show\` basiques, \`ping\`, \`traceroute\` |
| 2-14 | Personnalisables | Definis par l'administrateur |
| **15** | Privileged EXEC (admin) | Toutes les commandes |

### Personnaliser les niveaux de privilege

\`\`\`
! Attribuer des commandes au niveau 7 (technicien NOC)
privilege exec level 7 show running-config
privilege exec level 7 show interfaces
privilege exec level 7 show ip route
privilege exec level 7 show ip interface brief
privilege exec level 7 show vlan
privilege exec level 7 ping
privilege exec level 7 traceroute
!
! Interdire les commandes de configuration au niveau 7
! (pas besoin de deny explicite, elles sont au niveau 15 par defaut)
!
! Creer un utilisateur avec le niveau 7
username technicien privilege 7 secret TechP@ss!
!
! L'utilisateur technicien aura acces aux show, ping, traceroute
! mais PAS a configure terminal, reload, etc.
\`\`\`

### Limitation des niveaux de privilege

Les niveaux de privilege ont des **limitations** :
- Pas assez granulaires (seulement 16 niveaux)
- Difficile a gerer a grande echelle
- Un niveau donne acces a TOUTES les commandes de ce niveau et en dessous
- Pas de possibilite de "deny" explicite pour une commande specifique

### RBAC avec les Parser Views

Les **parser views** (ou CLI views) offrent un controle **beaucoup plus granulaire** :

\`\`\`
! 1. Activer le modele AAA (prerequis)
aaa new-model
!
! 2. Creer une view pour les techniciens NOC
enable secret AdminP@ss  ! Necessaire pour entrer dans la root view
!
! En mode root view (privilege 15) :
enable view
! Mot de passe enable requis
!
parser view NOC-VIEW
 secret NOC-Secret!
 commands exec include show
 commands exec include ping
 commands exec include traceroute
 commands exec exclude show running-config
!
! 3. Creer une view pour les administrateurs reseau
parser view NETADMIN-VIEW
 secret NetAdmin-Secret!
 commands exec include all show
 commands exec include configure terminal
 commands configure include all interface
 commands configure include all router
 commands exec exclude reload
!
! 4. Creer une superview (combine plusieurs views)
parser view SENIOR-ADMIN superview
 secret SeniorAdmin!
 view NOC-VIEW
 view NETADMIN-VIEW
\`\`\`

### Acceder a une view

\`\`\`
! Se connecter avec une view specifique
enable view NOC-VIEW
Password: ********
!
! Verifier la view active
show parser view
\`\`\`

### RBAC avec TACACS+ (meilleure approche)

En entreprise, le **RBAC est gere cote serveur** (Cisco ISE / TACACS+), pas sur chaque equipement :

\`\`\`
Sur le serveur TACACS+ (Cisco ISE) :
┌─────────────────────────────────────────────┐
│ Role : NOC-L1                               │
│ - permit : show *                           │
│ - permit : ping *                           │
│ - permit : traceroute *                     │
│ - deny   : configure *                      │
│ - deny   : reload                           │
├─────────────────────────────────────────────┤
│ Role : Network-Admin                        │
│ - permit : show *                           │
│ - permit : configure terminal               │
│ - permit : interface *                      │
│ - deny   : reload                           │
│ - deny   : write erase                      │
├─────────────────────────────────────────────┤
│ Role : Senior-Admin                         │
│ - permit : * (toutes les commandes)         │
└─────────────────────────────────────────────┘

Sur le routeur/switch :
aaa authorization commands 1 default group TACACS-SERVERS local
aaa authorization commands 15 default group TACACS-SERVERS local
! Chaque commande tapee est envoyee au serveur TACACS+
! qui autorise ou refuse selon le role de l'utilisateur
\`\`\`

### Comparaison des approches RBAC

| Approche | Granularite | Scalabilite | Gestion |
|----------|------------|-------------|---------|
| Niveaux de privilege (0-15) | Faible | Faible | Sur chaque equipement |
| Parser Views | Moyenne | Moyenne | Sur chaque equipement |
| **TACACS+ server-based** | **Elevee** | **Excellente** | **Centralisee** |

> **Point CCNA :** Retenez les niveaux 0, 1 et 15. Sachez que les parser views offrent un controle plus fin. En entreprise, le RBAC est gere cote serveur TACACS+ pour la centralisation. L'examen peut poser des questions sur \`privilege exec level\` et le concept de parser view.`
      },
      {
        title: 'Bonnes pratiques et resume AAA',
        content: `Ce chapitre recapitule les bonnes pratiques AAA et les points essentiels a retenir pour l'examen CCNA 200-301.

### Checklist de securisation AAA

\`\`\`
! ============================================
! CONFIGURATION AAA COMPLETE - BEST PRACTICES
! ============================================
!
! 1. TOUJOURS AVOIR UN COMPTE LOCAL D'URGENCE
username emergency privilege 15 secret EmergencyAccess2024!
!
! 2. ACTIVER AAA
aaa new-model
!
! 3. CONFIGURER LES SERVEURS (TACACS+ pour admin, RADIUS pour reseau)
tacacs server ISE-TACACS
 address ipv4 10.0.0.50
 key TacacsKey!
!
radius server ISE-RADIUS
 address ipv4 10.0.0.50 auth-port 1812 acct-port 1813
 key RadiusKey!
!
! 4. GROUPES DE SERVEURS
aaa group server tacacs+ ADMIN-SERVERS
 server name ISE-TACACS
aaa group server radius NETWORK-SERVERS
 server name ISE-RADIUS
!
! 5. AUTHENTIFICATION avec fallback
aaa authentication login default group ADMIN-SERVERS local
aaa authentication login CONSOLE local
aaa authentication enable default group ADMIN-SERVERS enable
aaa authentication dot1x default group NETWORK-SERVERS
!
! 6. AUTORISATION
aaa authorization exec default group ADMIN-SERVERS local
aaa authorization commands 15 default group ADMIN-SERVERS local
aaa authorization network default group NETWORK-SERVERS
!
! 7. ACCOUNTING (traçabilite)
aaa accounting exec default start-stop group ADMIN-SERVERS
aaa accounting commands 15 default start-stop group ADMIN-SERVERS
aaa accounting network default start-stop group NETWORK-SERVERS
!
! 8. SECURISER LES LIGNES
line console 0
 login authentication CONSOLE
 exec-timeout 5 0
 logging synchronous
!
line vty 0 15
 login authentication default
 transport input ssh
 exec-timeout 10 0
!
! 9. SSH UNIQUEMENT (pas de Telnet)
ip ssh version 2
crypto key generate rsa modulus 2048
!
! 10. BANNIERE D'AVERTISSEMENT LEGAL
banner motd ^
*********************************************
* ACCES RESERVE AUX PERSONNES AUTORISEES    *
* Toutes les activites sont enregistrees.   *
* Tout acces non autorise sera poursuivi.   *
*********************************************
^
\`\`\`

### Erreurs courantes a eviter

| Erreur | Consequence | Solution |
|--------|------------|---------|
| Pas de compte local d'urgence | Perte d'acces si serveur AAA down | Toujours configurer \`username emergency\` |
| \`aaa new-model\` sans method list | Authentification par defaut bloquee | Definir les method lists avant ou en meme temps |
| Cle partagee differente | Timeout d'authentification (reject silencieux) | Verifier la cle sur equipement ET serveur |
| Pas de fallback local | Perte d'acces total si serveur HS | Ajouter \`local\` a la fin de chaque method list |
| Timeout trop long | Attente excessive avant fallback | \`timeout 5\` sur les serveurs |
| Pas d'accounting | Pas de traçabilite pour l'audit | Activer \`start-stop\` accounting |

### Tableau recapitulatif AAA

| Composant | Question | RADIUS | TACACS+ | Local |
|-----------|----------|--------|---------|-------|
| **Authentication** | Qui etes-vous ? | Oui | Oui | Oui |
| **Authorization** | Que pouvez-vous faire ? | Oui (combine avec AuthN) | Oui (separe, par commande) | Oui (privilege level) |
| **Accounting** | Qu'avez-vous fait ? | Oui (port separe) | Oui (meme session TCP) | Limite |

### Points cles RADIUS vs TACACS+ (revision)

\`\`\`
RADIUS :
  ✓ UDP 1812/1813
  ✓ Standard ouvert (IETF)
  ✓ Chiffrement du mot de passe seulement
  ✓ AuthN + AuthZ combinees
  ✓ Ideal pour : WiFi 802.1X, VPN, NAC

TACACS+ :
  ✓ TCP 49
  ✓ Proprietaire Cisco
  ✓ Chiffrement du paquet ENTIER
  ✓ AuthN, AuthZ, Accounting SEPARES
  ✓ Autorisation par commande CLI
  ✓ Ideal pour : Administration equipement
\`\`\`

### Schema decisionnel AAA

\`\`\`
Quel controle d'acces utiliser ?
│
├── Acces reseau (utilisateur final) ?
│   ├── WiFi → 802.1X + RADIUS
│   ├── VPN → RADIUS (ou TACACS+ si Cisco-only)
│   └── Filaire NAC → 802.1X + RADIUS
│
├── Administration equipement ?
│   ├── Controle par commande requis → TACACS+
│   ├── Multi-vendeur → RADIUS
│   └── Cisco-only → TACACS+ (recommande)
│
└── Petit reseau sans serveur AAA ?
    └── AAA local (username + privilege levels)
\`\`\`

### Commandes de verification essentielles

\`\`\`
! Voir la configuration AAA active
show running-config | section aaa
!
! Verifier l'etat des serveurs AAA
show aaa servers
!
! Voir les sessions actives
show aaa sessions
!
! Voir les method lists configurees
show aaa method-lists all
!
! Tester la connectivite au serveur
test aaa group ADMIN-SERVERS admin TestPassword server
!
! Verifier le niveau de privilege actuel
show privilege
\`\`\`

> **A retenir :** Le modele AAA est le pilier du controle d'acces en reseau. RADIUS pour l'acces reseau, TACACS+ pour l'administration CLI. Toujours prevoir un fallback local. L'accounting est souvent neglige mais essentiel pour l'audit et la conformite. Ces concepts sont au coeur de l'examen CCNA 200-301.`
      }
    ]
  }
]
