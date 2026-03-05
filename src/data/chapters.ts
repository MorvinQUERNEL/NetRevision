export interface Section {
  title: string
  content: string
}

export interface Chapter {
  id: number
  slug: string
  title: string
  subtitle: string
  icon: string
  color: string
  duration: string
  level: string
  sections: Section[]
  videoId: string
}

export const chapters: Chapter[] = [
  {
    id: 1,
    slug: 'modele-osi',
    title: 'Le Modele OSI / TCP-IP',
    subtitle: 'Comprendre les 7 couches OSI et le modele TCP/IP utilise en pratique',
    icon: 'Layers',
    color: '#00e5a0',
    duration: '45 min',
    level: 'Debutant',
    videoId: '26jazyc7VNk',
    sections: [
      {
        title: 'Introduction au modele OSI',
        content: `Le modele **OSI** (Open Systems Interconnection) est un modele de reference cree en **1984** par l'**ISO** (International Organization for Standardization). Son objectif est de standardiser la communication entre systemes informatiques en decoupant le processus en **7 couches** distinctes.

### Pourquoi un modele en couches ?

Avant l'OSI, chaque constructeur utilisait ses propres protocoles proprietaires. Un ordinateur IBM ne pouvait pas communiquer avec un ordinateur DEC. Le modele OSI a ete concu pour :

- **Standardiser** les communications reseau entre constructeurs
- **Simplifier** la comprehension en decoupant un probleme complexe en sous-problemes
- **Permettre l'interoperabilite** entre equipements de differentes marques
- **Faciliter le depannage** en isolant les problemes par couche

### Le principe fondamental

Chaque couche a un role precis et ne communique qu'avec les couches **adjacentes** (celle du dessus et celle du dessous). Chaque couche fournit des **services** a la couche superieure et utilise les services de la couche inferieure.

> **Astuce CCNA :** Le modele OSI est un modele **theorique** de reference. En pratique, on utilise le modele **TCP/IP** (4 ou 5 couches). Mais le CCNA attend que vous connaissiez parfaitement les 7 couches OSI, leurs roles et les protocoles associes.

### Les 7 couches OSI

| Couche | Nom | Role principal | PDU |
|--------|-----|---------------|-----|
| 7 | Application | Interface utilisateur, services reseau | Donnees |
| 6 | Presentation | Formatage, chiffrement, compression | Donnees |
| 5 | Session | Gestion des sessions de communication | Donnees |
| 4 | Transport | Fiabilite, controle de flux, segmentation | Segment (TCP) / Datagramme (UDP) |
| 3 | Reseau | Adressage logique, routage | Paquet |
| 2 | Liaison de donnees | Adressage physique, acces au media | Trame |
| 1 | Physique | Transmission des bits sur le media | Bits |

### Moyen mnemotechnique

Pour retenir l'ordre des couches (de 7 a 1) : **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing (Application, Presentation, Session, Transport, Network, Data Link, Physical).

De 1 a 7 : **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.`
      },
      {
        title: 'Detail des 7 couches OSI',
        content: `### Couche 7 — Application

La couche Application est l'interface entre l'utilisateur (ou l'application) et le reseau. Elle ne designe **pas** les applications elles-memes (Chrome, Outlook...) mais les **protocoles** qu'elles utilisent.

**Protocoles courants :**
- **HTTP/HTTPS** (port 80/443) : navigation web
- **FTP** (port 20/21) : transfert de fichiers
- **SMTP** (port 25) : envoi d'emails
- **POP3** (port 110) / **IMAP** (port 143) : reception d'emails
- **DNS** (port 53) : resolution de noms
- **DHCP** (port 67/68) : attribution automatique d'adresses IP
- **SSH** (port 22) : acces distant securise
- **Telnet** (port 23) : acces distant non securise
- **SNMP** (port 161/162) : supervision reseau

### Couche 6 — Presentation

La couche Presentation s'occupe de la **mise en forme** des donnees pour qu'elles soient comprehensibles par la couche Application. Elle gere trois fonctions principales :

- **Formatage/Traduction** : conversion entre formats (ASCII, EBCDIC, Unicode)
- **Chiffrement/Dechiffrement** : SSL/TLS pour securiser les donnees
- **Compression/Decompression** : reduction de la taille des donnees

### Couche 5 — Session

La couche Session etablit, gere et termine les **sessions** de communication entre deux hotes. Elle gere :

- **L'ouverture et la fermeture** des sessions
- **La synchronisation** : points de reprise en cas de coupure
- **Le mode de dialogue** : simplex, half-duplex, full-duplex

### Couche 4 — Transport

La couche Transport assure le **transport fiable** (ou non) des donnees de bout en bout. Les deux protocoles principaux sont :

- **TCP** (Transmission Control Protocol) : fiable, oriente connexion, controle de flux
- **UDP** (User Datagram Protocol) : non fiable, sans connexion, rapide

Elle gere la **segmentation** des donnees et le **reassemblage**, ainsi que le **multiplexage** via les numeros de port.

### Couche 3 — Reseau

La couche Reseau gere l'**adressage logique** (adresses IP) et le **routage** des paquets entre reseaux differents. C'est la couche du **routeur**.

- **Protocole principal** : IP (IPv4, IPv6)
- **Protocoles de routage** : OSPF, EIGRP, BGP, RIP
- **Protocole utilitaire** : ICMP (ping, traceroute)

### Couche 2 — Liaison de donnees

La couche Liaison de donnees gere l'**adressage physique** (adresses MAC) et l'acces au support de transmission. C'est la couche du **switch**. Elle est divisee en deux sous-couches :

- **LLC** (Logical Link Control) : interface avec la couche 3
- **MAC** (Media Access Control) : adressage physique et acces au media

### Couche 1 — Physique

La couche Physique transmet les **bits bruts** sur le support physique (cable cuivre, fibre optique, ondes radio). Elle definit les caracteristiques electriques, mecaniques et fonctionnelles.

> **Astuce CCNA :** Retenez que les couches 5, 6 et 7 sont souvent regroupees en une seule couche "Application" dans le modele TCP/IP. Le CCNA vous demandera de savoir associer chaque protocole a sa couche OSI.`
      },
      {
        title: 'Le modele TCP/IP',
        content: `Le modele **TCP/IP** (aussi appele modele DoD — Department of Defense) est le modele **pratique** utilise sur Internet et dans la majorite des reseaux modernes. Il a ete developpe dans les annees **1970** par le **DARPA** (Defense Advanced Research Projects Agency).

### Les 4 couches du modele TCP/IP

| Couche TCP/IP | Couches OSI equivalentes | Protocoles |
|---------------|--------------------------|------------|
| 4 - Application | 7 + 6 + 5 (Application, Presentation, Session) | HTTP, FTP, DNS, DHCP, SSH, SMTP |
| 3 - Transport | 4 (Transport) | TCP, UDP |
| 2 - Internet | 3 (Reseau) | IPv4, IPv6, ICMP, ARP |
| 1 - Acces reseau | 2 + 1 (Liaison + Physique) | Ethernet, Wi-Fi, PPP |

### Comparaison OSI vs TCP/IP

| Critere | OSI | TCP/IP |
|---------|-----|--------|
| Nombre de couches | 7 | 4 |
| Type | Theorique, reference | Pratique, implemente |
| Developpeur | ISO (1984) | DARPA (1970s) |
| Approche | Modele avant les protocoles | Protocoles avant le modele |
| Utilisation | Enseignement, depannage | Internet, reseaux reels |

### Pourquoi TCP/IP a "gagne" ?

Le modele OSI est arrive **trop tard**. Quand l'ISO a finalise le modele OSI en 1984, TCP/IP etait deja largement deploye sur ARPANET (ancetre d'Internet). TCP/IP avait l'avantage d'etre :

- **Libre et ouvert** : pas de licence proprietaire
- **Deja implemente** : protocoles fonctionnels et testes
- **Flexible** : moins de couches = plus simple a implementer
- **Soutenu par le gouvernement americain** : adoption massive

### Le modele TCP/IP "etendu" (5 couches)

Cisco et de nombreux formateurs utilisent un modele **hybride** a 5 couches qui separe la couche Acces reseau en deux :

| Couche | Nom | Equivalent OSI |
|--------|-----|----------------|
| 5 | Application | Couches 5, 6, 7 |
| 4 | Transport | Couche 4 |
| 3 | Reseau (Internet) | Couche 3 |
| 2 | Liaison de donnees | Couche 2 |
| 1 | Physique | Couche 1 |

> **Astuce CCNA :** Cisco utilise souvent le modele a 5 couches dans ses cours. Le CCNA 200-301 vous demandera de connaitre les deux modeles (OSI 7 couches ET TCP/IP 4 couches) et de savoir faire la correspondance entre eux. Soyez capable de placer chaque protocole dans la bonne couche des deux modeles.`
      },
      {
        title: 'Encapsulation et decapsulation',
        content: `L'**encapsulation** est le processus par lequel chaque couche ajoute un **en-tete** (header) aux donnees recues de la couche superieure. La **decapsulation** est le processus inverse : chaque couche retire l'en-tete qui lui correspond.

### Le processus d'encapsulation (emission)

Quand un utilisateur envoie un email, voici ce qui se passe couche par couche :

\`\`\`
Couche 7 (Application)    : [Donnees de l'email]
Couche 4 (Transport)      : [En-tete TCP] + [Donnees]           = Segment
Couche 3 (Reseau)         : [En-tete IP] + [Segment]            = Paquet
Couche 2 (Liaison)        : [En-tete Ethernet] + [Paquet] + [FCS] = Trame
Couche 1 (Physique)       : Conversion en bits = 01101001...
\`\`\`

### Les noms des PDU (Protocol Data Unit)

Chaque couche donne un nom specifique a l'unite de donnees qu'elle manipule :

| Couche | PDU | Description |
|--------|-----|-------------|
| 7, 6, 5 | **Donnees** (Data) | Donnees brutes de l'application |
| 4 | **Segment** (TCP) ou **Datagramme** (UDP) | Donnees + en-tete de transport |
| 3 | **Paquet** (Packet) | Segment + en-tete IP |
| 2 | **Trame** (Frame) | Paquet + en-tete Ethernet + FCS |
| 1 | **Bits** | Suite de 0 et 1 sur le media physique |

### Le processus de decapsulation (reception)

A la reception, le processus est inverse. Chaque couche :

1. **Lit** l'en-tete qui lui correspond
2. **Traite** les informations de l'en-tete (verification, routage, etc.)
3. **Retire** l'en-tete
4. **Passe** les donnees restantes a la couche superieure

### Exemple concret : requete HTTP

\`\`\`
[PC Client] ---------------------------------------- [Serveur Web]

Emission (PC Client) :
  L7: GET /index.html HTTP/1.1
  L4: [Port src: 49152 | Port dst: 80] + Donnees HTTP     = Segment TCP
  L3: [IP src: 192.168.1.10 | IP dst: 93.184.216.34] + Segment = Paquet IP
  L2: [MAC src: AA:BB:CC:DD:EE:FF | MAC dst: 11:22:33:44:55:66] + Paquet + FCS = Trame
  L1: 01101001 01010110 ... = signal electrique sur le cable

Reception (Serveur Web) :
  L1: signal electrique = bits
  L2: Lit MAC dst (c'est bien pour moi), retire en-tete Ethernet = Paquet
  L3: Lit IP dst (c'est bien pour moi), retire en-tete IP = Segment
  L4: Lit port dst (80 = HTTP), retire en-tete TCP = Donnees
  L7: Traite la requete GET /index.html
\`\`\`

> **Astuce CCNA :** Retenez les noms des PDU : **D**onnees, **S**egment, **P**aquet, **T**rame, **B**its. Le CCNA peut vous demander "Comment s'appelle le PDU de la couche 2 ?" = Reponse : Trame (Frame). Le terme "Datagramme" est specifique a UDP, tandis que "Segment" est specifique a TCP.`
      },
      {
        title: 'Protocoles par couche et exercices pratiques',
        content: `### Tableau recapitulatif des protocoles par couche OSI

| Couche | Protocoles principaux | Equipements |
|--------|-----------------------|-------------|
| 7 - Application | HTTP, HTTPS, FTP, TFTP, DNS, DHCP, SMTP, POP3, IMAP, SSH, Telnet, SNMP, NTP, Syslog | -- |
| 6 - Presentation | SSL/TLS, JPEG, GIF, PNG, MPEG, ASCII | -- |
| 5 - Session | NetBIOS, PPTP, SCP, NFS | -- |
| 4 - Transport | TCP, UDP | -- |
| 3 - Reseau | IPv4, IPv6, ICMP, IGMP, OSPF, EIGRP, BGP, RIP | Routeur, Switch L3 |
| 2 - Liaison | Ethernet (802.3), Wi-Fi (802.11), ARP, STP, PPP | Switch L2, Bridge, AP |
| 1 - Physique | Signaux electriques, optiques, radio | Hub, Repeater, Cable, NIC |

### Protocoles et ports a connaitre pour le CCNA

\`\`\`
Port    Protocole    Transport    Description
20      FTP-Data     TCP          Transfert de donnees FTP
21      FTP-Control  TCP          Controle FTP
22      SSH          TCP          Acces distant securise
23      Telnet       TCP          Acces distant non securise
25      SMTP         TCP          Envoi d'emails
53      DNS          TCP/UDP      Resolution de noms
67/68   DHCP         UDP          Attribution IP (serveur/client)
69      TFTP         UDP          Transfert fichiers simplifie
80      HTTP         TCP          Navigation web
110     POP3         TCP          Reception emails
143     IMAP         TCP          Reception emails (synchronisee)
161/162 SNMP         UDP          Supervision reseau
443     HTTPS        TCP          Navigation web securisee
514     Syslog       UDP          Journalisation centralisee
\`\`\`

### Verification avec Cisco IOS

Sur un routeur ou switch Cisco, vous pouvez verifier la connectivite a differentes couches :

\`\`\`cisco
! Verification couche 1 (Physique)
Router# show interfaces status
Router# show interfaces FastEthernet0/0

! Verification couche 2 (Liaison)
Switch# show mac address-table

! Verification couche 3 (Reseau)
Router# show ip interface brief
Router# ping 192.168.1.1
Router# traceroute 10.0.0.1

! Verification couche 4 (Transport)
Router# show tcp brief
\`\`\`

### Points cles pour le CCNA

1. **OSI = 7 couches** (reference theorique), **TCP/IP = 4 couches** (modele pratique)
2. Les couches 5, 6, 7 OSI = couche Application TCP/IP
3. Chaque couche a un **PDU** specifique : Donnees, Segment, Paquet, Trame, Bits
4. L'encapsulation **ajoute** des en-tetes en descendant les couches
5. La decapsulation **retire** les en-tetes en remontant les couches
6. Les **routeurs** operent a la couche 3, les **switches** a la couche 2
7. **ARP** fait le lien entre couche 3 (IP) et couche 2 (MAC)
8. Connaissez les **ports** des protocoles principaux (surtout 20-23, 25, 53, 67/68, 80, 110, 143, 443)

> **Astuce CCNA :** Dans les questions CCNA, on vous demandera souvent "A quelle couche OSI fonctionne tel protocole/equipement ?" Creez des flashcards pour memoriser ces associations. Rappelez-vous que ARP est souvent considere comme couche 2 (meme s'il fait le lien entre L2 et L3).`
      }
    ]
  },
  {
    id: 2,
    slug: 'composants-reseau',
    title: 'Composants reseau : roles et fonctions',
    subtitle: 'Decouvrir les equipements fondamentaux qui composent un reseau informatique',
    icon: 'Server',
    color: '#00e5a0',
    duration: '35 min',
    level: 'Debutant',
    videoId: 'PzWK_S4wHJU',
    sections: [
      {
        title: 'Routeurs et switches',
        content: `Les **routeurs** et les **switches** sont les deux equipements fondamentaux de tout reseau informatique. Comprendre leur role respectif est essentiel pour le CCNA.

### Le routeur (Router)

Le routeur opere a la **couche 3** (Reseau) du modele OSI. Son role principal est de **router les paquets** entre differents reseaux (inter-network communication).

**Fonctions principales :**
- **Routage** : determiner le meilleur chemin pour acheminer un paquet vers sa destination
- **Segmentation des reseaux** : separer les domaines de broadcast
- **Interconnexion** : relier des reseaux differents (LAN a WAN, LAN a LAN)
- **Filtrage** : appliquer des ACL (Access Control Lists) pour securiser le trafic
- **NAT/PAT** : traduire les adresses IP privees en adresses publiques

**Types de routeurs Cisco :**

| Serie | Usage | Exemple |
|-------|-------|---------|
| ISR 1000 | Petites entreprises, succursales | ISR 1100 |
| ISR 4000 | Entreprises moyennes | ISR 4321, ISR 4431 |
| ASR 1000 | Agregation WAN, data center edge | ASR 1001-X |
| CSR 1000v | Routeur virtuel (cloud) | CSR 1000v |

\`\`\`cisco
! Commandes de base pour verifier un routeur
Router# show version
Router# show ip route
Router# show ip interface brief
Router# show running-config
\`\`\`

### Le switch (Commutateur)

Le switch opere a la **couche 2** (Liaison de donnees) du modele OSI. Son role est de **commuter les trames** au sein d'un meme reseau local (LAN).

**Fonctions principales :**
- **Commutation** : transmettre les trames vers le bon port en se basant sur les adresses MAC
- **Apprentissage MAC** : construire et maintenir une table d'adresses MAC
- **Filtrage** : ne transmettre une trame qu'au port concerne (contrairement au hub)
- **VLAN** : segmenter logiquement un reseau en plusieurs domaines de broadcast

**Switch Layer 2 vs Layer 3 :**

| Caracteristique | Switch L2 | Switch L3 |
|----------------|-----------|-----------|
| Couche OSI | Couche 2 | Couches 2 et 3 |
| Adressage | MAC uniquement | MAC + IP |
| Routage | Non | Oui (inter-VLAN) |
| Table | MAC address table | MAC table + table de routage |
| Exemple Cisco | Catalyst 2960 | Catalyst 3650, 3850, 9300 |

\`\`\`cisco
! Commandes de base pour verifier un switch
Switch# show mac address-table
Switch# show vlan brief
Switch# show interfaces status
Switch# show spanning-tree
\`\`\`

> **Astuce CCNA :** La difference entre un switch L2 et un switch L3 est une question classique du CCNA. Un switch L3 peut faire du **routage inter-VLAN** grace a des SVI (Switch Virtual Interfaces), ce qui elimine le besoin d'un routeur externe pour la communication entre VLANs.`
      },
      {
        title: 'Firewalls, IPS et IDS',
        content: `Les equipements de securite reseau sont essentiels pour proteger l'infrastructure. Le CCNA 200-301 attend que vous connaissiez les differences entre firewalls, IPS et IDS.

### Le firewall (Pare-feu)

Le firewall controle le trafic reseau en appliquant des **regles de securite**. Il decide quel trafic est autorise ou bloque entre differentes zones du reseau.

**Types de firewalls :**

| Type | Fonctionnement | Couche OSI | Exemple |
|------|---------------|------------|---------|
| **Packet filtering** | Filtre par IP, port, protocole | Couche 3-4 | ACL sur routeur |
| **Stateful** | Suit l'etat des connexions | Couche 3-4 | Cisco ASA |
| **Application (proxy)** | Inspecte le contenu applicatif | Couche 7 | Palo Alto |
| **NGFW** (Next-Gen) | Combine stateful + application + IPS | Couches 3-7 | Cisco Firepower |

**Cisco ASA (Adaptive Security Appliance)** est le firewall historique de Cisco. Il utilise des **niveaux de securite** (0-100) pour definir la confiance entre les interfaces :

- **Inside** (niveau 100) : reseau interne, le plus fiable
- **Outside** (niveau 0) : Internet, le moins fiable
- **DMZ** (niveau 50) : zone demilitarisee pour les serveurs publics

### IDS (Intrusion Detection System)

L'IDS est un systeme de **detection** d'intrusions. Il surveille le trafic reseau et **alerte** l'administrateur en cas d'activite suspecte.

**Caracteristiques :**
- **Passif** : il observe le trafic mais ne le bloque pas
- **Deploiement** : en mode "mirroring" (copie du trafic via SPAN port)
- **Alerte** : envoie des notifications (syslog, email, SNMP trap)
- **Pas d'impact** sur le flux reseau (pas de latence ajoutee)

### IPS (Intrusion Prevention System)

L'IPS est un systeme de **prevention** d'intrusions. Il fait la meme chose que l'IDS mais peut en plus **bloquer** le trafic malveillant.

**Caracteristiques :**
- **Actif** : il peut bloquer, modifier ou rejeter le trafic
- **Deploiement** : en mode "inline" (le trafic passe a travers l'IPS)
- **Reaction** : bloque automatiquement les menaces detectees
- **Impact** : peut ajouter de la latence (le trafic doit etre analyse en temps reel)

### Comparaison IDS vs IPS

| Critere | IDS | IPS |
|---------|-----|-----|
| Mode | Passif (detection) | Actif (prevention) |
| Position | Hors du flux (SPAN/mirror) | Dans le flux (inline) |
| Action | Alerte uniquement | Bloque + alerte |
| Latence | Aucune | Possible (analyse en temps reel) |
| Risque | Menaces non bloquees | Faux positifs = trafic legitime bloque |

\`\`\`
[Reseau] ---- [IDS] (copie du trafic via SPAN)
                |-- Alerte admin

[Reseau] ---- [IPS] ---- [Suite du reseau]
                |-- Bloque ou laisse passer
\`\`\`

> **Astuce CCNA :** La question "Quelle est la difference entre IDS et IPS ?" revient tres souvent au CCNA. Retenez : IDS = **Detection** (passif, alerte), IPS = **Prevention** (actif, bloque). L'IPS est deploye **inline**, l'IDS en **monitoring** (SPAN/mirror).`
      },
      {
        title: 'Points d\'acces Wi-Fi et controleurs',
        content: `Les reseaux sans fil sont devenus incontournables. Le CCNA 200-301 couvre les composants wireless fondamentaux : les **points d'acces** (AP) et les **controleurs** (WLC).

### Point d'acces (Access Point - AP)

Un point d'acces Wi-Fi permet aux appareils sans fil de se connecter au reseau filaire. Il fait le pont entre le reseau **wireless** (802.11) et le reseau **filaire** (802.3 Ethernet).

**Fonctions :**
- **Conversion** de trames 802.11 (Wi-Fi) en trames 802.3 (Ethernet) et inversement
- **Gestion des associations** des clients sans fil
- **Diffusion du SSID** (nom du reseau Wi-Fi)
- **Chiffrement** du trafic wireless (WPA2, WPA3)
- **Gestion des canaux** radio (2.4 GHz et 5 GHz)

**Modes de deploiement des AP :**

| Mode | Description | Gestion |
|------|-------------|---------|
| **Autonomous** | L'AP fonctionne independamment avec sa propre configuration | Configuration individuelle par AP |
| **Lightweight** | L'AP est gere par un WLC via le protocole CAPWAP | Configuration centralisee |
| **Cloud-managed** | L'AP est gere depuis le cloud (Cisco Meraki) | Dashboard cloud |

### Controleur WLC (Wireless LAN Controller)

Le WLC est un equipement qui **centralise la gestion** de tous les points d'acces lightweight du reseau. Il communique avec les AP via le protocole **CAPWAP** (Control and Provisioning of Wireless Access Points).

**Fonctions du WLC :**
- **Configuration centralisee** : un seul point pour configurer tous les AP
- **Gestion des canaux** : attribution automatique des canaux (RRM)
- **Equilibrage de charge** : repartition des clients entre les AP
- **Roaming** : passage transparent d'un AP a un autre
- **Securite** : politiques d'authentification centralisees (802.1X, RADIUS)
- **Mise a jour firmware** : deploiement centralise des mises a jour

### Architecture Split-MAC

Avec un WLC, le traitement Wi-Fi est partage entre l'AP et le controleur :

| Fonction | Geree par l'AP | Geree par le WLC |
|----------|----------------|------------------|
| Transmission/Reception radio | Oui | Non |
| Chiffrement/Dechiffrement | Oui | Non |
| Beacons et probe responses | Oui | Non |
| Authentification | Non | Oui |
| Association | Non | Oui |
| Attribution de VLAN | Non | Oui |
| Politique de securite | Non | Oui |

### CAPWAP (Control and Provisioning of Wireless Access Points)

CAPWAP est le protocole standard utilise entre les AP lightweight et le WLC :

- **Port UDP 5246** : tunnel de controle (gestion, configuration)
- **Port UDP 5247** : tunnel de donnees (trafic des clients)
- Les deux tunnels sont **chiffres** par DTLS (Datagram Transport Layer Security)

\`\`\`
[Client Wi-Fi] --wireless--> [AP Lightweight] ==CAPWAP==> [WLC]
                                                            |
                                                     [Reseau filaire]
\`\`\`

> **Astuce CCNA :** Le CCNA 200-301 insiste sur l'architecture **lightweight AP + WLC**. Retenez que CAPWAP utilise les ports **UDP 5246** (controle) et **5247** (donnees), et que le WLC gere l'authentification, l'association et les politiques de securite tandis que l'AP gere les fonctions radio en temps reel.`
      },
      {
        title: 'Endpoints, serveurs et autres equipements',
        content: `Au-dela des routeurs, switches et equipements de securite, un reseau est compose de nombreux autres dispositifs qu'il faut connaitre pour le CCNA.

### Endpoints (Terminaux)

Les endpoints sont les appareils situes aux **extremites** du reseau. Ce sont les sources et destinations finales du trafic.

**Types d'endpoints :**
- **Ordinateurs** (PC, laptops) : stations de travail des utilisateurs
- **Smartphones et tablettes** : connexion Wi-Fi
- **Imprimantes reseau** : accessibles via IP
- **Cameras IP** : surveillance, souvent alimentees en PoE
- **Telephones IP** : voix sur IP (VoIP), souvent en PoE
- **IoT** (Internet of Things) : capteurs, objets connectes

### Serveurs

Les serveurs fournissent des **services** aux clients du reseau :

| Type de serveur | Service | Port(s) |
|----------------|---------|---------|
| **Serveur Web** | Heberge des sites web | 80 (HTTP), 443 (HTTPS) |
| **Serveur DNS** | Resout les noms de domaine en IP | 53 |
| **Serveur DHCP** | Attribue des adresses IP automatiquement | 67/68 |
| **Serveur de fichiers** | Stockage centralise (NFS, SMB) | 445, 2049 |
| **Serveur email** | Envoi et reception d'emails | 25, 110, 143 |
| **Serveur RADIUS/TACACS+** | Authentification centralisee | 1812/1813, 49 |
| **Serveur Syslog** | Collecte des logs des equipements | 514 |
| **Serveur NTP** | Synchronisation horaire | 123 |
| **Serveur TFTP** | Transfert de fichiers (configs, IOS) | 69 |

### Hub vs Switch vs Routeur

| Caracteristique | Hub | Switch | Routeur |
|----------------|-----|--------|---------|
| Couche OSI | 1 (Physique) | 2 (Liaison) | 3 (Reseau) |
| Intelligence | Aucune | Adresses MAC | Adresses IP |
| Broadcast | Diffuse a tous les ports | Domaine de broadcast unique | Separe les domaines de broadcast |
| Collision | Un seul domaine de collision | Un domaine par port | Un domaine par interface |
| Usage actuel | Obsolete | Reseau local (LAN) | Interconnexion de reseaux |

### Autres equipements importants

**Repeater (Repeteur) :**
- Couche 1 -- amplifie et regenere le signal
- Etend la portee d'un segment reseau
- N'effectue aucun filtrage

**Bridge (Pont) :**
- Couche 2 -- connecte deux segments LAN
- Filtre le trafic par adresse MAC
- Ancetre du switch (2 ports seulement)

**Modem :**
- Convertit les signaux numeriques en analogiques (et inversement)
- Utilise pour les connexions DSL, cable, fibre (ONT)
- Fait le lien entre le reseau du FAI et le reseau local

**Load Balancer (Repartiteur de charge) :**
- Distribue le trafic entre plusieurs serveurs
- Ameliore la disponibilite et les performances
- Peut operer en couche 4 (TCP) ou couche 7 (HTTP)

### Commandes Cisco utiles

\`\`\`cisco
! Voir les voisins connectes (CDP - Cisco Discovery Protocol)
Switch# show cdp neighbors
Switch# show cdp neighbors detail

! Voir les voisins (LLDP - standard IEEE)
Switch# show lldp neighbors

! Voir les informations du materiel
Router# show version
Router# show inventory
\`\`\`

> **Astuce CCNA :** Le CCNA vous demandera de connaitre la couche OSI a laquelle opere chaque equipement. Retenez : Hub = couche 1, Switch = couche 2, Routeur = couche 3. Les switches L3 operent aux couches 2 ET 3. CDP est un protocole **proprietaire Cisco** (couche 2), tandis que LLDP est le **standard IEEE 802.1AB** equivalent.`
      }
    ]
  },
  {
    id: 3,
    slug: 'topologies-architectures',
    title: 'Topologies et architectures reseau',
    subtitle: 'Les differentes facons d\'organiser physiquement et logiquement un reseau',
    icon: 'Network',
    color: '#00e5a0',
    duration: '30 min',
    level: 'Debutant',
    videoId: '_88pXPp2CaU',
    sections: [
      {
        title: 'Topologies physiques',
        content: `La **topologie physique** d'un reseau decrit la disposition **reelle** des cables et equipements. C'est la facon dont les appareils sont physiquement connectes entre eux.

### Topologie en etoile (Star)

La topologie en **etoile** est la plus repandue dans les reseaux locaux modernes. Tous les appareils sont connectes a un equipement central (switch ou hub).

**Caracteristiques :**
- Un **equipement central** (switch) relie tous les hotes
- Si un cable tombe en panne, seul l'hote concerne est affecte
- Si l'equipement central tombe en panne, **tout le reseau est hors service**
- Facile a **ajouter** ou **retirer** des hotes
- **Cablage structure** : chaque hote a son propre cable vers le switch

### Topologie en bus (Bus)

La topologie en **bus** utilise un seul cable principal (backbone) auquel tous les appareils sont connectes.

**Caracteristiques :**
- Un seul cable partage par tous les hotes
- Des **terminateurs** aux deux extremites pour eviter les reflexions de signal
- Si le cable principal est coupe, le reseau est **completement coupe**
- **Collisions** frequentes (un seul domaine de collision)
- **Obsolete** dans les reseaux modernes

### Topologie en anneau (Ring)

La topologie en **anneau** connecte chaque appareil au suivant, formant une boucle fermee.

**Caracteristiques :**
- Les donnees circulent dans **un seul sens** (ou deux sens dans un double anneau)
- Chaque appareil **regenere** le signal (agit comme un repeteur)
- Utilise un **jeton** (token) pour controler l'acces au media (Token Ring)
- Si un lien tombe, le reseau est coupe (sauf en double anneau)
- Utilisee dans les reseaux **FDDI** (fibre) et les anciens reseaux **Token Ring**

### Topologie maillee (Mesh)

La topologie **maillee** connecte chaque appareil a tous les autres appareils.

**Full mesh vs Partial mesh :**

| Type | Description | Nombre de liens | Usage |
|------|-------------|-----------------|-------|
| **Full mesh** | Chaque noeud est connecte a tous les autres | n(n-1)/2 | WAN critique |
| **Partial mesh** | Certains noeuds ont des liens redondants | Variable | WAN courant |

**Formule Full Mesh :** Pour **n** equipements, il faut **n(n-1)/2** liens.
- 4 routeurs : 4 x 3 / 2 = **6 liens**
- 5 routeurs : 5 x 4 / 2 = **10 liens**
- 10 routeurs : 10 x 9 / 2 = **45 liens**

### Topologie hybride

La topologie **hybride** combine plusieurs topologies. C'est la realite de la plupart des reseaux d'entreprise :

- **Etoile etendue** (extended star) : plusieurs etoiles interconnectees
- **Star-mesh** : etoile en LAN + mesh partiel en WAN

> **Astuce CCNA :** La topologie en **etoile** est la plus courante en LAN (via des switches). La topologie **maillee partielle** (partial mesh) est la plus courante en WAN. Le CCNA peut vous demander de calculer le nombre de liens en full mesh avec la formule **n(n-1)/2**.`
      },
      {
        title: 'Architectures reseau d\'entreprise',
        content: `### Architecture 3-tier (trois niveaux)

L'architecture **3-tier** est le modele classique de Cisco pour les reseaux d'entreprise de grande taille. Elle est composee de trois couches hierarchiques :

| Couche | Role | Equipements | Caracteristiques |
|--------|------|-------------|-----------------|
| **Core** (Coeur) | Transport rapide | Switches L3 haut debit | Tres rapide, pas de filtrage, redondant |
| **Distribution** | Politiques, routage | Switches L3, routeurs | ACL, QoS, routage inter-VLAN, agregation |
| **Access** (Acces) | Connexion des hotes | Switches L2 | VLAN, PoE, port-security, 802.1X |

**Couche Core :**
- Commutation **tres rapide** (10/40/100 Gbps)
- **Pas de manipulation de paquets** (pas d'ACL, pas de QoS)
- **Redondance** totale (liens et equipements)
- Objectif : deplacer les donnees le plus vite possible

**Couche Distribution :**
- **Routage** entre VLANs et sous-reseaux
- **Filtrage** avec ACL (Access Control Lists)
- **QoS** (Quality of Service) : priorisation du trafic
- **Agregation** du trafic venant de la couche Access
- **Redondance** vers le Core

**Couche Access :**
- Connexion directe des **endpoints**
- **VLAN assignment** : attribution des VLANs aux ports
- **PoE** (Power over Ethernet) : alimentation des telephones IP et AP
- **Port security** : limitation des adresses MAC par port
- **802.1X** : authentification des hotes

### Architecture 2-tier (Collapsed Core)

Dans les reseaux de **taille moyenne**, on fusionne les couches Core et Distribution en une seule couche appelee **Collapsed Core** :

**Avantages :** Moins d'equipements, moins couteux, plus simple a gerer.
**Inconvenients :** Moins scalable, les switches Collapsed Core gerent routage + commutation rapide.

### Quand utiliser 2-tier vs 3-tier ?

| Critere | 2-tier (Collapsed Core) | 3-tier |
|---------|------------------------|--------|
| Taille du reseau | PME (< 500 users) | Grande entreprise (> 500 users) |
| Budget | Reduit | Important |
| Complexite | Faible | Elevee |
| Scalabilite | Limitee | Excellente |
| Redondance | Bonne | Maximale |

> **Astuce CCNA :** Cisco recommande l'architecture **3-tier** pour les grands campus et **2-tier (collapsed core)** pour les sites plus petits. Le CCNA attend que vous sachiez decrire le role de chaque couche et placer les fonctionnalites (ACL, QoS, PoE, VLAN) dans la bonne couche.`
      },
      {
        title: 'Architecture Spine-Leaf',
        content: `L'architecture **Spine-Leaf** est le modele moderne utilise dans les **data centers**. Elle remplace l'architecture 3-tier traditionnelle pour offrir de meilleures performances et une latence previsible.

### Principe

L'architecture Spine-Leaf est composee de deux couches seulement :

- **Spine** (colonne vertebrale) : switches de transit haute capacite
- **Leaf** (feuille) : switches d'acces connectes aux serveurs

**Regle fondamentale :** Chaque switch **Leaf** est connecte a **tous** les switches **Spine**, et inversement. Les switches Spine ne sont jamais connectes entre eux, et les switches Leaf ne sont jamais connectes entre eux.

### Avantages de l'architecture Spine-Leaf

| Avantage | Explication |
|----------|-------------|
| **Latence previsible** | Chaque paire de serveurs est toujours a **exactement 2 sauts** (Leaf - Spine - Leaf) |
| **Scalabilite horizontale** | Pour ajouter de la capacite, on ajoute des switches Spine ou Leaf |
| **Bande passante** | Utilisation de l'**ECMP** (Equal-Cost Multi-Path) pour repartir le trafic sur tous les liens |
| **Pas de STP** | La topologie n'a pas de boucles (pas besoin de Spanning Tree) |
| **Redondance** | Si un Spine tombe, le trafic passe par les autres Spines |

### Comparaison 3-tier vs Spine-Leaf

| Critere | 3-tier | Spine-Leaf |
|---------|--------|------------|
| Usage | Campus, entreprise | Data center |
| Nombre de couches | 3 (Core, Distribution, Access) | 2 (Spine, Leaf) |
| Latence | Variable (1-3+ sauts) | Fixe (2 sauts) |
| Spanning Tree | Oui (STP bloque des liens) | Non (ECMP sur tous les liens) |
| Scalabilite | Verticale (plus gros switches) | Horizontale (plus de switches) |
| Trafic | Nord-Sud (client vers serveur) | Est-Ouest (serveur vers serveur) |

### Trafic Nord-Sud vs Est-Ouest

Dans les data centers modernes, la majorite du trafic est **Est-Ouest** (entre serveurs) plutot que **Nord-Sud** (client vers serveur) :

- **Nord-Sud** : un client externe accede a un serveur dans le data center
- **Est-Ouest** : un serveur web communique avec un serveur de base de donnees, un serveur d'application communique avec un serveur de cache

L'architecture Spine-Leaf est optimisee pour le trafic **Est-Ouest** car chaque serveur peut atteindre n'importe quel autre serveur en exactement **2 sauts**.

### VXLAN dans l'architecture Spine-Leaf

Dans les data centers, on utilise souvent **VXLAN** (Virtual Extensible LAN) pour etendre les VLANs au-dela des limites physiques :

- VXLAN encapsule les trames L2 dans des paquets UDP/IP
- Permet d'avoir des VLANs qui s'etendent sur plusieurs switches Leaf
- Utilise des **VTEP** (VXLAN Tunnel Endpoints) sur chaque Leaf
- Supporte jusqu'a **16 millions** de segments (vs 4096 VLANs traditionnels)

> **Astuce CCNA :** L'architecture Spine-Leaf est un sujet relativement recent au CCNA 200-301. Retenez les avantages cles : latence **previsible** (2 sauts), scalabilite **horizontale**, utilisation de l'**ECMP** (pas de STP), et optimisee pour le trafic **Est-Ouest**. Vous n'aurez pas a configurer une architecture Spine-Leaf au CCNA, mais vous devez en comprendre le concept.`
      },
      {
        title: 'Topologies WAN et recapitulatif',
        content: `### Topologies WAN

Les reseaux WAN (Wide Area Network) connectent des sites geographiquement distants. Les topologies WAN les plus courantes sont :

### Point-a-point (Point-to-Point)

Le lien **point-a-point** connecte directement deux sites avec un lien dedie.

- **Avantages** : simple, fiable, bande passante garantie
- **Inconvenients** : couteux (une liaison par paire de sites)
- **Technologies** : lignes louees (leased lines), HDLC, PPP

### Hub-and-Spoke (Etoile WAN)

Un site central (**hub**) est connecte a tous les sites distants (**spokes**). Les spokes communiquent entre eux via le hub.

- **Avantages** : moins de liens que le full mesh, gestion centralisee
- **Inconvenients** : le hub est un point unique de defaillance (SPOF)
- **Usage** : siege + succursales

### Full Mesh WAN

Chaque site est connecte directement a tous les autres sites.

- **Avantages** : redondance maximale, chemins optimaux
- **Inconvenients** : cout eleve (n(n-1)/2 liens), complexe
- **Usage** : sites critiques (data centers, sieges regionaux)

### Partial Mesh WAN

Compromis entre hub-and-spoke et full mesh : certains sites ont des liens directs supplementaires.

- **Avantages** : bon compromis cout/redondance
- **Inconvenients** : necessite une planification soignee
- **Usage** : le plus courant en entreprise

### Technologies WAN courantes

| Technologie | Type | Debit | Usage |
|-------------|------|-------|-------|
| **MPLS** | Prive | 10 Mbps - 10 Gbps | WAN entreprise |
| **Metro Ethernet** | Prive | 10 Mbps - 100 Gbps | WAN metro |
| **Internet VPN** | Public (chiffre) | Variable | Succursales, teletravail |
| **SD-WAN** | Hybride | Variable | WAN moderne, multi-liens |
| **4G/5G** | Cellulaire | Variable | Backup, sites mobiles |
| **Leased Line** | Prive dedie | T1 (1.5M) - OC-48 (2.5G) | Liens critiques |
| **DSL** | Public | 1-100 Mbps | Petites succursales |

### Recapitulatif general des topologies

| Topologie | Type | Avantage principal | Inconvenient principal | Usage typique |
|-----------|------|-------------------|----------------------|---------------|
| **Etoile** | LAN | Simple, facile a gerer | SPOF central | LAN standard |
| **Bus** | LAN | Simple, economique | Fragile, obsolete | Legacy |
| **Anneau** | LAN | Pas de collision (token) | Si un lien casse = panne | Token Ring, FDDI |
| **Full Mesh** | LAN/WAN | Redondance maximale | Couteux | WAN critique |
| **Partial Mesh** | WAN | Bon compromis | Planification necessaire | WAN entreprise |
| **Hub-and-Spoke** | WAN | Economique | SPOF (hub) | Siege + succursales |
| **Spine-Leaf** | Data center | Latence fixe, scalable | Complexe | Data centers |

> **Astuce CCNA :** Pour le CCNA, vous devez savoir identifier chaque topologie a partir d'un schema, connaitre les avantages et inconvenients de chacune, et savoir calculer le nombre de liens en full mesh. Retenez aussi que **SD-WAN** est la tendance actuelle pour les WAN d'entreprise : il combine plusieurs types de liens (MPLS + Internet) avec une gestion centralisee.`
      }
    ]
  },
  {
    id: 4,
    slug: 'cablage-interfaces',
    title: 'Cablage et interfaces physiques',
    subtitle: 'Cables UTP, fibre optique, connecteurs et standards de cablage reseau',
    icon: 'Cable',
    color: '#00e5a0',
    duration: '35 min',
    level: 'Debutant',
    videoId: 'iPIlEGsZMu8',
    sections: [
      {
        title: 'Cables cuivre UTP et categories',
        content: `Le cablage en **cuivre** est le plus utilise dans les reseaux locaux (LAN). Le type le plus courant est le cable **UTP** (Unshielded Twisted Pair) -- paire torsadee non blindee.

### Structure d'un cable UTP

Un cable UTP contient **8 fils** organises en **4 paires torsadees**. La torsion reduit les **interferences electromagnetiques** (EMI) et la **diaphonie** (crosstalk) entre les paires.

**Standards de cablage (ordre des fils dans le connecteur RJ-45) :**

| Standard | Paire 1 | Paire 2 | Paire 3 | Paire 4 |
|----------|---------|---------|---------|---------|
| **T-568A** | Blanc-Vert/Vert | Blanc-Orange/Bleu | Blanc-Bleu/Orange | Blanc-Marron/Marron |
| **T-568B** | Blanc-Orange/Orange | Blanc-Vert/Bleu | Blanc-Bleu/Vert | Blanc-Marron/Marron |

### Categories de cables UTP

| Categorie | Debit max | Frequence | Usage | Distance max |
|-----------|-----------|-----------|-------|-------------|
| **Cat 3** | 10 Mbps | 16 MHz | 10BASE-T (obsolete) | 100 m |
| **Cat 5** | 100 Mbps | 100 MHz | 100BASE-TX | 100 m |
| **Cat 5e** | 1 Gbps | 100 MHz | 1000BASE-T | 100 m |
| **Cat 6** | 1 Gbps (10G sur 55m) | 250 MHz | 1000BASE-T, 10GBASE-T | 100 m (55m pour 10G) |
| **Cat 6a** | 10 Gbps | 500 MHz | 10GBASE-T | 100 m |
| **Cat 7** | 10 Gbps | 600 MHz | 10GBASE-T (blinde STP) | 100 m |
| **Cat 8** | 25/40 Gbps | 2000 MHz | Data center | 30 m |

### Distance maximale

La distance maximale pour un cable UTP (toutes categories) est de **100 metres**. Cette distance se decompose ainsi :
- **90 metres** de cablage horizontal (du panneau de brassage a la prise murale)
- **10 metres** de cordons de brassage (patch cables) aux deux extremites

### Types de cables UTP

**Cable droit (Straight-through) :**
- Les deux extremites utilisent le **meme standard** (T-568B et T-568B)
- Utilise pour connecter des appareils **differents** : PC vers Switch, Routeur vers Switch

**Cable croise (Crossover) :**
- Une extremite en **T-568A**, l'autre en **T-568B**
- Utilise pour connecter des appareils **identiques** : Switch vers Switch, PC vers PC

**Cable console (Rollover) :**
- Les fils sont dans l'**ordre inverse** d'une extremite a l'autre
- Utilise pour la **configuration initiale** des equipements Cisco (port Console)

| Type de connexion | Cable necessaire |
|-------------------|-----------------|
| PC vers Switch | Droit (straight-through) |
| PC vers Routeur | Croise (crossover) |
| PC vers PC | Croise (crossover) |
| Switch vers Switch | Croise (crossover) |
| Switch vers Routeur | Droit (straight-through) |
| Routeur vers Routeur | Croise (crossover) |
| PC vers Port Console | Rollover |

> **Astuce CCNA :** Avec la technologie **Auto-MDI/MDI-X** presente sur les equipements modernes, le type de cable (droit ou croise) n'a plus d'importance -- le switch detecte et ajuste automatiquement. Mais le CCNA attend que vous connaissiez la regle : appareils **differents** = cable **droit**, appareils **identiques** = cable **croise**.`
      },
      {
        title: 'Fibre optique',
        content: `La **fibre optique** transmet les donnees sous forme de **lumiere** a travers un coeur de verre ou de plastique. Elle offre des performances superieures au cuivre en termes de debit et de distance.

### Fibre monomode (SMF -- Single-Mode Fiber)

La fibre **monomode** a un coeur tres fin (**8-10 microns**) qui ne permet qu'un seul mode de propagation de la lumiere.

| Caracteristique | Detail |
|----------------|--------|
| Diametre du coeur | 8-10 um |
| Source lumineuse | Laser |
| Distance | Jusqu'a **100 km** et plus |
| Debit | 10 Gbps - 400 Gbps |
| Cout | Plus cher (laser + precision) |
| Usage | WAN, liaisons longue distance, backbone |
| Couleur de la gaine | **Jaune** |

### Fibre multimode (MMF -- Multi-Mode Fiber)

La fibre **multimode** a un coeur plus large (**50 ou 62.5 microns**) qui permet plusieurs modes de propagation de la lumiere.

| Caracteristique | Detail |
|----------------|--------|
| Diametre du coeur | 50 um ou 62.5 um |
| Source lumineuse | LED ou VCSEL |
| Distance | 300 m a 2 km selon le standard |
| Debit | 1 Gbps - 100 Gbps |
| Cout | Moins cher (LED + tolerances plus larges) |
| Usage | LAN, intra-batiment, data center |
| Couleur de la gaine | **Orange** (OM1/OM2) ou **Aqua** (OM3/OM4) |

### Categories de fibre multimode

| Type | Coeur | Bande passante | 10 GbE | 40/100 GbE |
|------|-------|---------------|--------|------------|
| **OM1** | 62.5 um | 200 MHz.km | 33 m | -- |
| **OM2** | 50 um | 500 MHz.km | 82 m | -- |
| **OM3** | 50 um | 2000 MHz.km | 300 m | 100 m |
| **OM4** | 50 um | 4700 MHz.km | 400 m | 150 m |
| **OM5** | 50 um | 28000 MHz.km | 400 m | 400 m |

### Comparaison SMF vs MMF

| Critere | SMF (Monomode) | MMF (Multimode) |
|---------|----------------|-----------------|
| Coeur | 8-10 um | 50-62.5 um |
| Distance | Longue (> 10 km) | Courte (< 2 km) |
| Debit | Tres eleve | Eleve |
| Cout | Plus cher | Moins cher |
| Source | Laser | LED/VCSEL |
| Couleur gaine | Jaune | Orange/Aqua |
| Usage | WAN, backbone | LAN, data center |

### Avantages de la fibre optique vs cuivre

- **Distance** : jusqu'a 100 km (vs 100 m pour UTP)
- **Debit** : jusqu'a 400 Gbps et plus
- **Immunite EMI** : insensible aux interferences electromagnetiques
- **Securite** : difficile a intercepter (pas de rayonnement electrique)
- **Pas de diaphonie** : pas d'interference entre fibres adjacentes

> **Astuce CCNA :** Retenez les couleurs : fibre monomode = **jaune**, fibre multimode OM1/OM2 = **orange**, OM3/OM4 = **aqua**. La monomode va **plus loin** mais coute **plus cher**. Pour le CCNA, sachez que la fibre monomode utilise un **laser** et la multimode une **LED** ou **VCSEL**.`
      },
      {
        title: 'Connecteurs et interfaces',
        content: `### Connecteurs fibre optique

| Connecteur | Type | Caracteristiques | Usage courant |
|-----------|------|-----------------|---------------|
| **SC** (Subscriber Connector) | Push-pull carre | Simple a connecter, verrouillage par clip | Data centers, reseaux FTTH |
| **LC** (Lucent Connector) | Push-pull petit | Compact (moitie de la taille du SC) | Switches, SFP/SFP+ |
| **ST** (Straight Tip) | Baionnette ronde | Verrouillage par rotation | Legacy, campus |
| **MT-RJ** | Push-pull | Deux fibres dans un seul connecteur | Petits equipements |
| **MPO/MPC** | Multi-fibre | 12 ou 24 fibres dans un seul connecteur | 40G/100G data center |

### Connecteurs cuivre

| Connecteur | Usage |
|-----------|-------|
| **RJ-45** | Cable UTP Ethernet (8 broches) -- le plus courant |
| **RJ-11** | Cable telephonique (4 ou 6 broches) |
| **DB-9 / RS-232** | Port serie (console legacy) |
| **USB Type-A/C** | Cable console USB moderne |

### Modules SFP (Small Form-factor Pluggable)

Les modules **SFP** sont des transceivers enfichables qui permettent de choisir le type de media (cuivre ou fibre) sur un meme port.

| Module | Debit | Media | Distance typique |
|--------|-------|-------|-----------------|
| **SFP** | 1 Gbps | Cuivre ou fibre | Variable |
| **SFP+** | 10 Gbps | Cuivre ou fibre | Variable |
| **QSFP+** | 40 Gbps | Fibre | Data center |
| **QSFP28** | 100 Gbps | Fibre | Data center |

**Types de SFP courants :**
- **SFP-SX** : 1G, fibre multimode, 550 m (850 nm)
- **SFP-LX** : 1G, fibre monomode, 10 km (1310 nm)
- **SFP-ZX** : 1G, fibre monomode, 80 km (1550 nm)
- **SFP+ SR** : 10G, fibre multimode, 300 m
- **SFP+ LR** : 10G, fibre monomode, 10 km

### Interfaces de routeurs et switches

| Interface | Debit | Media | Usage |
|-----------|-------|-------|-------|
| **FastEthernet (Fa)** | 100 Mbps | Cuivre UTP | Legacy |
| **GigabitEthernet (Gi)** | 1 Gbps | Cuivre ou fibre | Standard actuel |
| **TenGigabitEthernet (Te)** | 10 Gbps | Fibre (ou cuivre Cat6a) | Uplinks, serveurs |
| **Serial** | Variable | Cable serie (DCE/DTE) | WAN legacy |
| **Console** | -- | RJ-45 ou USB | Configuration initiale |

\`\`\`cisco
! Voir les interfaces disponibles sur un equipement
Router# show ip interface brief

! Voir le detail d'une interface
Router# show interfaces GigabitEthernet0/0

! Voir les modules SFP installes
Switch# show interfaces transceiver
\`\`\`

> **Astuce CCNA :** Le connecteur le plus courant en fibre pour les equipements Cisco modernes est le **LC** (utilise avec les modules SFP/SFP+). Retenez que le module **SX** = multimode courte distance, **LX** = monomode longue distance. Le CCNA peut vous demander quel type de SFP utiliser selon la distance et le debit requis.`
      },
      {
        title: 'PoE et recapitulatif cablage',
        content: `### PoE (Power over Ethernet)

**PoE** permet d'alimenter des equipements reseau via le **cable Ethernet** (UTP), eliminant le besoin d'une alimentation electrique separee.

### Standards PoE

| Standard | Nom | IEEE | Puissance max (PSE) | Puissance max (PD) | Paires utilisees |
|----------|-----|------|---------------------|--------------------|-|
| **PoE** | Type 1 | 802.3af | 15.4 W | 12.95 W | 2 paires |
| **PoE+** | Type 2 | 802.3at | 30 W | 25.5 W | 2 paires |
| **UPoE** | Type 3 | 802.3bt | 60 W | 51 W | 4 paires |
| **UPoE+** | Type 4 | 802.3bt | 100 W | 71.3 W | 4 paires |

### Terminologie PoE

- **PSE** (Power Sourcing Equipment) : l'equipement qui **fournit** l'alimentation (switch PoE)
- **PD** (Powered Device) : l'equipement qui **recoit** l'alimentation (telephone IP, AP, camera)

### Equipements typiques alimentes en PoE

| Equipement | Puissance typique | PoE minimum requis |
|-----------|-------------------|-------------------|
| Telephone IP | 7-15 W | PoE (802.3af) |
| Point d'acces Wi-Fi | 12-25 W | PoE+ (802.3at) |
| Camera IP | 8-30 W | PoE ou PoE+ |
| Ecran interactif | 40-60 W | UPoE (802.3bt) |

\`\`\`cisco
! Voir l'etat PoE sur un switch Cisco
Switch# show power inline

! Voir le detail PoE par interface
Switch# show power inline GigabitEthernet1/0/1

! Configurer la puissance max sur un port
Switch(config-if)# power inline auto max 15400
\`\`\`

### Recapitulatif general du cablage

| Critere | UTP Cuivre | Fibre Multimode | Fibre Monomode |
|---------|-----------|-----------------|----------------|
| Distance max | 100 m | 300 m - 2 km | 10 - 100+ km |
| Debit max | 10 Gbps (Cat 6a) | 100 Gbps (OM4) | 400+ Gbps |
| Immunite EMI | Faible | Totale | Totale |
| Cout | Faible | Moyen | Eleve |
| PoE | Oui | Non | Non |
| Connecteur | RJ-45 | LC, SC | LC, SC |
| Usage | LAN, acces | Intra-batiment, DC | WAN, backbone |

### Points cles pour le CCNA

1. **Cable droit** = appareils differents, **Cable croise** = appareils identiques (sauf Auto-MDI/MDI-X)
2. **Cat 5e** = 1 Gbps, **Cat 6** = 1-10 Gbps, **Cat 6a** = 10 Gbps sur 100 m
3. Distance UTP = **100 m** maximum
4. Fibre **monomode** = jaune, longue distance, laser
5. Fibre **multimode** = orange/aqua, courte distance, LED
6. **SFP** = 1G, **SFP+** = 10G, **QSFP+** = 40G
7. **PoE** (802.3af) = 15.4W, **PoE+** (802.3at) = 30W
8. Le connecteur fibre le plus courant sur les equipements modernes est le **LC**

> **Astuce CCNA :** Le PoE est un sujet important au CCNA 200-301. Retenez les standards et puissances : **802.3af = 15.4W** (telephones IP), **802.3at = 30W** (AP Wi-Fi). Le switch detecte automatiquement si l'appareil connecte est un PD valide avant de fournir du courant. Vous devez aussi savoir utiliser \`show power inline\` pour verifier l'etat PoE.`
      }
    ]
  },
  {
    id: 5,
    slug: 'switching-ethernet',
    title: 'Switching Ethernet et domaines de broadcast',
    subtitle: 'Comprendre le fonctionnement des switches, les trames Ethernet et les domaines de broadcast',
    icon: 'GitBranch',
    color: '#00e5a0',
    duration: '40 min',
    level: 'Debutant',
    videoId: 'q6RC5gZP4NU',
    sections: [
      {
        title: 'La trame Ethernet (802.3)',
        content: `**Ethernet** est le standard de reseau local (LAN) le plus utilise au monde. Defini par la norme **IEEE 802.3**, il opere aux **couches 1 et 2** du modele OSI.

### Structure d'une trame Ethernet

\`\`\`
| Preambule | SFD | MAC Dst | MAC Src | Type/Length | Donnees (Payload) | FCS |
| 7 octets  | 1   | 6       | 6       | 2           | 46-1500 octets    | 4   |
\`\`\`

| Champ | Taille | Description |
|-------|--------|-------------|
| **Preambule** | 7 octets | Synchronisation (alternance de 1 et 0 : 10101010...) |
| **SFD** (Start Frame Delimiter) | 1 octet | Indique le debut de la trame (10101011) |
| **MAC Destination** | 6 octets | Adresse MAC du destinataire |
| **MAC Source** | 6 octets | Adresse MAC de l'emetteur |
| **Type/Length** | 2 octets | Type du protocole de couche 3 (ex: 0x0800 = IPv4, 0x86DD = IPv6) |
| **Donnees (Payload)** | 46-1500 octets | Donnees transportees (paquet IP, ARP, etc.) |
| **FCS** (Frame Check Sequence) | 4 octets | Controle d'erreur CRC-32 |

### Taille d'une trame Ethernet

- **Taille minimale** : 64 octets (sans preambule ni SFD)
- **Taille maximale (MTU)** : 1518 octets (sans preambule ni SFD)
- **Jumbo Frame** : jusqu'a 9216 octets (utilise dans les data centers)

### Adresses MAC

Une adresse **MAC** (Media Access Control) est un identifiant unique de **48 bits** (6 octets) grave dans la carte reseau (NIC) par le fabricant.

**Format :** AA:BB:CC:DD:EE:FF ou AABB.CCDD.EEFF (format Cisco)

**Structure :**
- **OUI** (3 premiers octets) : identifie le fabricant (attribue par IEEE)
- **NIC** (3 derniers octets) : identifiant unique de l'interface

### Types d'adresses MAC

| Type | Adresse | Description |
|------|---------|-------------|
| **Unicast** | Adresse specifique | Un seul destinataire |
| **Broadcast** | FF:FF:FF:FF:FF:FF | Tous les hotes du meme domaine de broadcast |
| **Multicast** | 01:00:5E:xx:xx:xx | Un groupe d'hotes specifique |

> **Astuce CCNA :** Cisco utilise le format **AABB.CCDD.EEFF** (points toutes les 4 caracteres) pour les adresses MAC. Retenez que l'adresse broadcast est **FFFF.FFFF.FFFF**. Le champ Type de la trame Ethernet indique le protocole de couche 3 : **0x0800** = IPv4, **0x0806** = ARP, **0x86DD** = IPv6.`
      },
      {
        title: 'Fonctionnement du switch',
        content: `Le switch Ethernet est l'equipement central de tout LAN. Il prend ses decisions de commutation en se basant sur les **adresses MAC**.

### Les 3 actions du switch

**1. Apprentissage (Learn)**
Le switch lit l'adresse **MAC source** de la trame et l'associe au port sur lequel elle a ete recue. Il enregistre cette association dans sa **table MAC** (aussi appelee table CAM).

**2. Recherche (Lookup)**
Le switch cherche l'adresse **MAC destination** dans sa table MAC.

**3. Transfert (Forward)**

| Situation | Action | Description |
|-----------|--------|-------------|
| MAC dst trouvee dans la table | **Forward** | Envoie la trame uniquement sur le port correspondant |
| MAC dst **non** trouvee | **Flood** | Envoie la trame sur **tous les ports** sauf celui d'entree |
| MAC dst = broadcast (FFFF.FFFF.FFFF) | **Flood** | Envoie sur tous les ports sauf celui d'entree |
| MAC dst = meme port que src | **Filter** | La trame est ignoree (pas transmise) |

### La table MAC (table CAM)

\`\`\`cisco
! Voir la table MAC d'un switch
Switch# show mac address-table

Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.0001.0001    DYNAMIC     Fa0/1
   1    0002.0002.0002    DYNAMIC     Fa0/2
   1    0003.0003.0003    DYNAMIC     Fa0/3
\`\`\`

**Caracteristiques de la table MAC :**
- Les entrees **dynamiques** ont un **timer** par defaut de **300 secondes** (5 minutes)
- Les entrees **statiques** sont configurees manuellement et n'expirent pas

\`\`\`cisco
! Configurer une entree MAC statique
Switch(config)# mac address-table static 0001.0001.0001 vlan 1 interface Fa0/1

! Modifier le timer d'expiration
Switch(config)# mac address-table aging-time 600

! Effacer la table MAC
Switch# clear mac address-table dynamic
\`\`\`

### Methodes de commutation

| Methode | Description | Latence | Verification erreurs |
|---------|-------------|---------|---------------------|
| **Store-and-Forward** | Recoit toute la trame, verifie le FCS, puis transmet | Haute | Oui (CRC complet) |
| **Cut-Through** | Lit juste la MAC dst et transmet immediatement | Tres basse | Non |
| **Fragment-Free** | Lit les 64 premiers octets puis transmet | Basse | Partielle |

> **Astuce CCNA :** Les switches Cisco modernes (Catalyst) utilisent **Store-and-Forward** par defaut. Retenez que le timer par defaut de la table MAC est de **300 secondes** (5 minutes).`
      },
      {
        title: 'Domaines de broadcast et de collision',
        content: `### Domaine de collision

Un **domaine de collision** est une zone du reseau ou deux appareils peuvent entrer en **collision** s'ils emettent en meme temps.

| Equipement | Effet sur les domaines de collision |
|-----------|-------------------------------------|
| **Hub** | Un seul domaine de collision pour tous les ports |
| **Switch** | Chaque port est un **domaine de collision separe** |
| **Routeur** | Chaque interface est un domaine de collision separe |

### Domaine de broadcast

Un **domaine de broadcast** est une zone du reseau ou une trame de broadcast (MAC: FFFF.FFFF.FFFF) est recue par **tous les appareils**.

| Equipement | Effet sur les domaines de broadcast |
|-----------|--------------------------------------|
| **Hub** | Un seul domaine de broadcast |
| **Switch** | Un seul domaine de broadcast (tous les ports dans le meme VLAN) |
| **Routeur** | **Separe** les domaines de broadcast (un par interface) |

### Exemple pratique : compter les domaines

Regle simple :
- **Domaines de broadcast** = nombre d'interfaces du routeur qui connectent des reseaux
- **Domaines de collision** = nombre total de segments individuels (chaque port de switch = 1 segment)

Le **routeur** est le seul equipement qui separe les domaines de **broadcast**. Le **switch** separe les domaines de **collision** (chaque port = 1 domaine) mais pas les domaines de broadcast (sauf avec des VLANs).

### Half-duplex vs Full-duplex

| Mode | Description | Collisions | Usage |
|------|-------------|------------|-------|
| **Half-duplex** | Emission **OU** reception, pas les deux en meme temps | Possibles (CSMA/CD) | Hubs, Wi-Fi |
| **Full-duplex** | Emission **ET** reception simultanees | Impossibles | Switches modernes |

### CSMA/CD (Carrier Sense Multiple Access with Collision Detection)

CSMA/CD est le mecanisme utilise en **half-duplex** pour gerer les collisions :

1. **Carrier Sense** : l'appareil ecoute le media avant d'emettre
2. **Multiple Access** : plusieurs appareils partagent le meme media
3. **Collision Detection** : si collision detectee, arret + signal jam + attente aleatoire + reessai

En **full-duplex**, CSMA/CD est **desactive** car il n'y a pas de collision possible.

> **Astuce CCNA :** Compter les domaines de broadcast et de collision est un grand classique du CCNA. Retenez : le **routeur** est le seul equipement qui separe les domaines de **broadcast**. Le **switch** separe les domaines de **collision** (chaque port = 1 domaine) mais pas les domaines de broadcast (sauf avec des VLANs).`
      },
      {
        title: 'Standards Ethernet et ARP',
        content: `### Standards Ethernet

| Standard | Nom | Debit | Media | Distance max |
|----------|-----|-------|-------|-------------|
| **10BASE-T** | Ethernet | 10 Mbps | UTP Cat 3 | 100 m |
| **100BASE-TX** | Fast Ethernet | 100 Mbps | UTP Cat 5 | 100 m |
| **1000BASE-T** | Gigabit Ethernet | 1 Gbps | UTP Cat 5e/6 | 100 m |
| **10GBASE-T** | 10 Gigabit Ethernet | 10 Gbps | UTP Cat 6a | 100 m |
| **1000BASE-SX** | Gigabit Ethernet Fibre | 1 Gbps | MMF | 550 m |
| **1000BASE-LX** | Gigabit Ethernet Fibre | 1 Gbps | SMF | 5 km |
| **10GBASE-SR** | 10G Fibre | 10 Gbps | MMF | 300 m |
| **10GBASE-LR** | 10G Fibre | 10 Gbps | SMF | 10 km |

**Decodage des noms :** [Debit]BASE-[Type de media]
- **T** = Twisted pair (cuivre UTP)
- **SX/SR** = Short wavelength/reach (fibre multimode)
- **LX/LR** = Long wavelength/reach (fibre monomode)

### ARP (Address Resolution Protocol)

Le protocole **ARP** fait le lien entre la couche 3 (adresses IP) et la couche 2 (adresses MAC).

### Fonctionnement d'ARP

**Etape 1 : ARP Request (broadcast)**
- Le PC envoie une trame de **broadcast** (MAC dst: FFFF.FFFF.FFFF)
- "Qui a l'adresse IP 192.168.1.20 ? Repondez a 192.168.1.10"
- **Tous** les hotes du domaine de broadcast recoivent cette requete

**Etape 2 : ARP Reply (unicast)**
- Seul l'hote qui possede l'IP repond avec une trame **unicast**
- "192.168.1.20, c'est moi. Mon adresse MAC est 11:22:33:44:55:66"

### Cache ARP

\`\`\`cisco
! Voir le cache ARP sur un PC Windows
C:\\> arp -a

! Voir le cache ARP sur un equipement Cisco
Router# show arp
Router# show ip arp
\`\`\`

### ARP vers un hote distant

Quand PC1 veut communiquer avec un hote sur un **autre reseau** :
1. PC1 fait un ARP pour sa **passerelle par defaut** (le routeur)
2. PC1 cree la trame avec MAC dst = **MAC du routeur**
3. Le routeur route le paquet vers le bon reseau
4. Le routeur fait un ARP sur le reseau de destination

### Duplex mismatch

Si un cote est en **full-duplex** et l'autre en **half-duplex**, des symptomes apparaissent :
- **Late collisions** : indicateur principal
- **FCS/CRC errors** : trames corrompues
- **Performances degradees**

\`\`\`cisco
! Verifier speed et duplex
Switch# show interfaces Fa0/1 status

! Configurer identiquement les deux cotes
Switch(config-if)# speed 1000
Switch(config-if)# duplex full
\`\`\`

> **Astuce CCNA :** ARP est un protocole de **couche 2**. Les ARP Requests sont des **broadcasts**, les ARP Replies sont des **unicasts**. Si un PC veut joindre un hote distant, il fait l'ARP pour la **passerelle par defaut**, pas pour l'hote distant. Les **late collisions** indiquent un **duplex mismatch**.`
      }
    ]
  },
  {
    id: 6,
    slug: 'adressage-ipv4-subnetting',
    title: 'Adressage IPv4 et Subnetting',
    subtitle: 'Maitriser l\'adressage IP, les masques de sous-reseau, le CIDR et le calcul de subnetting',
    icon: 'Hash',
    color: '#00e5a0',
    duration: '50 min',
    level: 'Intermediaire',
    videoId: 'S_EfcLo2Wv0',
    sections: [
      {
        title: 'Format et structure d\'une adresse IPv4',
        content: `Une adresse **IPv4** est un identifiant logique de **32 bits** attribue a chaque interface reseau. Elle permet d'identifier de maniere unique un hote sur un reseau IP.

### Format de l'adresse IPv4

L'adresse IPv4 est representee en **notation decimale pointee** : 4 octets separes par des points.

\`\`\`
Binaire    : 11000000.10101000.00000001.00001010
Decimal    : 192.168.1.10
\`\`\`

Chaque octet va de **0 a 255** (8 bits = 2^8 = 256 valeurs possibles).

### Conversion binaire vers decimal

\`\`\`
Position :  128  64  32  16  8  4  2  1
Bits     :   1   1   0   0  0  0  0  0  = 128 + 64 = 192
Bits     :   1   0   1   0  1  0  0  0  = 128 + 32 + 8 = 168
Bits     :   0   0   0   0  0  0  0  1  = 1
Bits     :   0   0   0   0  1  0  1  0  = 8 + 2 = 10
\`\`\`

### Partie reseau et partie hote

Une adresse IPv4 est divisee en deux parties :
- **Partie reseau** (Network ID) : identifie le reseau
- **Partie hote** (Host ID) : identifie l'hote dans ce reseau

Le **masque de sous-reseau** (subnet mask) determine la limite entre ces deux parties :

\`\`\`
Adresse IP  : 192.168.1.10    = 11000000.10101000.00000001.00001010
Masque      : 255.255.255.0   = 11111111.11111111.11111111.00000000
                                 |------Reseau------|  |-Hote-|
Network ID  : 192.168.1.0
Host ID     : 0.0.0.10
\`\`\`

### Adresses speciales

| Adresse | Nom | Description |
|---------|-----|-------------|
| **Adresse reseau** | Network address | Tous les bits hote a 0 (ex: 192.168.1.**0**/24) |
| **Adresse de broadcast** | Broadcast address | Tous les bits hote a 1 (ex: 192.168.1.**255**/24) |
| **127.0.0.0/8** | Loopback | Test local (127.0.0.1 = localhost) |
| **0.0.0.0** | Default route | Route par defaut |
| **255.255.255.255** | Broadcast limite | Broadcast sur le reseau local |
| **169.254.0.0/16** | APIPA | Adresse auto-attribuee quand pas de DHCP |

> **Astuce CCNA :** La conversion binaire/decimal est **indispensable** pour le subnetting au CCNA. Apprenez par coeur les puissances de 2 : 128, 64, 32, 16, 8, 4, 2, 1. L'adresse reseau a tous les bits hote a **0**, l'adresse de broadcast a tous les bits hote a **1**. Ces deux adresses ne sont **pas attribuables** aux hotes.`
      },
      {
        title: 'Classes d\'adresses et adresses privees',
        content: `### Classes d'adresses IPv4

Historiquement, les adresses IPv4 etaient divisees en **5 classes** (A, B, C, D, E). Ce systeme est aujourd'hui remplace par le **CIDR**, mais reste important pour le CCNA.

| Classe | Plage 1er octet | Masque par defaut | Bits reseau | Hotes par reseau |
|--------|----------------|-------------------|-------------|------------------|
| **A** | 1-126 | 255.0.0.0 (/8) | 8 | 16,777,214 |
| **B** | 128-191 | 255.255.0.0 (/16) | 16 | 65,534 |
| **C** | 192-223 | 255.255.255.0 (/24) | 24 | 254 |
| **D** | 224-239 | -- | -- | Multicast |
| **E** | 240-255 | -- | -- | Experimental |

**Formule pour le nombre d'hotes :** 2^n - 2 (ou n = nombre de bits hote)
- On soustrait 2 pour l'adresse **reseau** et l'adresse **broadcast**

### Pourquoi 127 n'est pas dans la classe A ?

La plage **127.0.0.0/8** est reservee pour le **loopback**. L'adresse **127.0.0.1** est utilisee pour tester la pile TCP/IP locale (localhost).

### Adresses privees (RFC 1918)

Les adresses **privees** ne sont **pas routables** sur Internet. Elles necessitent du **NAT** pour acceder a Internet.

| Classe | Plage privee | Notation CIDR |
|--------|-------------|---------------|
| **A** | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 |
| **B** | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 |
| **C** | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 |

### Autres adresses speciales

| Plage | Usage |
|-------|-------|
| **169.254.0.0/16** | APIPA -- attribuee quand DHCP echoue |
| **100.64.0.0/10** | CGNAT -- utilise par les FAI |
| **198.51.100.0/24** | Documentation et exemples (RFC 5737) |

> **Astuce CCNA :** Apprenez par coeur les 3 plages d'adresses privees RFC 1918 : **10.0.0.0/8**, **172.16.0.0/12**, **192.168.0.0/16**. Attention au piege : **172.32.0.0** n'est PAS une adresse privee (la plage s'arrete a 172.31.255.255).`
      },
      {
        title: 'CIDR et masques de sous-reseau',
        content: `### CIDR (Classless Inter-Domain Routing)

Le **CIDR** a remplace le systeme de classes en 1993. Il permet d'attribuer des masques de sous-reseau de **n'importe quelle taille**.

**Notation CIDR :** 192.168.1.0**/24** -- le nombre apres le slash indique les bits a **1** dans le masque.

### Tableau des masques de sous-reseau

| Prefixe | Masque | Nombre d'hotes |
|---------|--------|---------------|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |
| /31 | 255.255.255.254 | 2 (point-a-point) |
| /32 | 255.255.255.255 | 1 (hote unique) |

### Valeurs cles du dernier octet du masque

\`\`\`
Bits empruntes :  1     2     3     4     5     6     7     8
Valeur masque  : 128   192   224   240   248   252   254   255
Taille du bloc : 128    64    32    16     8     4     2     1
\`\`\`

### Taille du bloc (Block Size)

La **taille du bloc** est le nombre par lequel les sous-reseaux se succedent :

**Taille du bloc = 256 - valeur du dernier octet significatif du masque**

Exemple : masque 255.255.255.224 => Taille du bloc = 256 - 224 = **32**
Les sous-reseaux commencent a : .0, .32, .64, .96, .128, .160, .192, .224

> **Astuce CCNA :** La **taille du bloc** est la methode la plus rapide pour le subnetting au CCNA. Apprenez la formule **256 - masque** et la table des valeurs cles (128, 192, 224, 240, 248, 252, 254, 255).`
      },
      {
        title: 'Subnetting : methode de calcul',
        content: `Le **subnetting** consiste a diviser un reseau en plusieurs **sous-reseaux** plus petits. C'est une competence essentielle pour le CCNA.

### Formules essentielles

\`\`\`
Nombre de sous-reseaux = 2^s    (s = nombre de bits empruntes)
Nombre d'hotes         = 2^h - 2 (h = nombre de bits hote restants)
\`\`\`

### Exemple complet : 192.168.1.0/24 en /27

**Donnees :**
- Reseau original : 192.168.1.0/24
- Nouveau masque : /27 (255.255.255.224)
- Bits empruntes : 27 - 24 = **3 bits**
- Bits hote restants : 32 - 27 = **5 bits**

**Calculs :**
- Nombre de sous-reseaux : 2^3 = **8 sous-reseaux**
- Nombre d'hotes par sous-reseau : 2^5 - 2 = **30 hotes**
- Taille du bloc : 256 - 224 = **32**

**Les 8 sous-reseaux :**

| Sous-reseau | Adresse reseau | Premiere IP | Derniere IP | Broadcast |
|-------------|----------------|-------------|-------------|-----------|
| 1 | 192.168.1.0/27 | 192.168.1.1 | 192.168.1.30 | 192.168.1.31 |
| 2 | 192.168.1.32/27 | 192.168.1.33 | 192.168.1.62 | 192.168.1.63 |
| 3 | 192.168.1.64/27 | 192.168.1.65 | 192.168.1.94 | 192.168.1.95 |
| 4 | 192.168.1.96/27 | 192.168.1.97 | 192.168.1.126 | 192.168.1.127 |
| 5 | 192.168.1.128/27 | 192.168.1.129 | 192.168.1.158 | 192.168.1.159 |
| 6 | 192.168.1.160/27 | 192.168.1.161 | 192.168.1.190 | 192.168.1.191 |
| 7 | 192.168.1.192/27 | 192.168.1.193 | 192.168.1.222 | 192.168.1.223 |
| 8 | 192.168.1.224/27 | 192.168.1.225 | 192.168.1.254 | 192.168.1.255 |

### Methode rapide avec la taille du bloc

1. Calculer la taille du bloc : 256 - 224 = **32**
2. Les sous-reseaux commencent tous les **32** : .0, .32, .64, .96, .128, .160, .192, .224
3. Le **broadcast** de chaque sous-reseau = adresse du sous-reseau suivant - 1
4. La **premiere IP valide** = adresse reseau + 1
5. La **derniere IP valide** = broadcast - 1

### Exercice : trouver le sous-reseau d'une IP

**Question :** A quel sous-reseau appartient l'hote **192.168.1.77/27** ?

**Methode :**
1. Taille du bloc : 256 - 224 = 32
2. 77 / 32 = 2.4 => arrondi = 2 => 2 x 32 = **64**
3. Sous-reseau : **192.168.1.64/27**
4. Broadcast : 96 - 1 = **192.168.1.95**
5. Plage d'hotes : 192.168.1.65 - 192.168.1.94

> **Astuce CCNA :** Pour trouver rapidement le sous-reseau d'une IP, divisez le dernier octet par la taille du bloc, arrondissez a l'entier inferieur, puis multipliez par la taille du bloc.`
      },
      {
        title: 'VLSM et recapitulatif',
        content: `### VLSM (Variable Length Subnet Mask)

Le **VLSM** permet d'utiliser des **masques de sous-reseau differents** au sein d'un meme reseau. Chaque sous-reseau a le masque adapte a sa taille.

### Methode VLSM

**Regle d'or :** Toujours commencer par le **plus grand** sous-reseau et terminer par le plus petit.

**Exemple :** Reseau 192.168.1.0/24 a diviser :
- LAN A : 100 hotes
- LAN B : 50 hotes
- LAN C : 25 hotes
- WAN : 2 hotes (lien point-a-point)

**Etape 1 : LAN A -- 100 hotes**
- 2^7 - 2 = 126 >= 100 => masque /25 (255.255.255.128)
- Sous-reseau : **192.168.1.0/25** (plage : .1 a .126, broadcast .127)

**Etape 2 : LAN B -- 50 hotes**
- 2^6 - 2 = 62 >= 50 => masque /26 (255.255.255.192)
- Prochain disponible : **192.168.1.128/26** (plage : .129 a .190, broadcast .191)

**Etape 3 : LAN C -- 25 hotes**
- 2^5 - 2 = 30 >= 25 => masque /27 (255.255.255.224)
- Prochain disponible : **192.168.1.192/27** (plage : .193 a .222, broadcast .223)

**Etape 4 : WAN -- 2 hotes**
- 2^2 - 2 = 2 >= 2 => masque /30 (255.255.255.252)
- Prochain disponible : **192.168.1.224/30** (plage : .225 a .226, broadcast .227)

**Resultat :**

| Sous-reseau | CIDR | Hotes max | Utilises |
|-------------|------|-----------|----------|
| 192.168.1.0/25 | /25 | 126 | 100 |
| 192.168.1.128/26 | /26 | 62 | 50 |
| 192.168.1.192/27 | /27 | 30 | 25 |
| 192.168.1.224/30 | /30 | 2 | 2 |

### Configuration Cisco IOS

\`\`\`cisco
! Configuration des interfaces avec subnetting
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.128
Router(config-if)# no shutdown

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.129 255.255.255.192
Router(config-if)# no shutdown

! Verification
Router# show ip interface brief
\`\`\`

### Recapitulatif subnetting pour le CCNA

| Concept | Description |
|---------|-------------|
| **Masque de sous-reseau** | Determine la frontiere reseau/hote |
| **CIDR** | Notation /xx pour le masque |
| **Taille du bloc** | 256 - valeur du dernier octet du masque |
| **Nombre de sous-reseaux** | 2^s (s = bits empruntes) |
| **Nombre d'hotes** | 2^h - 2 (h = bits hote restants) |
| **Adresse reseau** | Tous les bits hote a 0 |
| **Broadcast** | Tous les bits hote a 1 |
| **VLSM** | Masques differents par sous-reseau, du plus grand au plus petit |
| **/30** | Liens point-a-point (2 hotes) |
| **/32** | Hote unique (loopback, host route) |

> **Astuce CCNA :** Le subnetting et le VLSM sont les sujets les plus importants du CCNA pour le calcul. Entrainez-vous quotidiennement. Utilisez la methode de la **taille du bloc** pour aller vite. Pour le VLSM, n'oubliez jamais de commencer par le **plus grand** sous-reseau.`
      }
    ]
  },
  {
    id: 7,
    slug: 'tcp-vs-udp',
    title: 'TCP vs UDP en detail',
    subtitle: 'Comprendre les protocoles de transport TCP et UDP, leurs mecanismes et leurs cas d\'usage',
    icon: 'ArrowLeftRight',
    color: '#00e5a0',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'kiw1g6GrGJ0',
    sections: [
      {
        title: 'TCP : Transmission Control Protocol',
        content: `**TCP** (Transmission Control Protocol) est un protocole de couche 4 (Transport) **oriente connexion** et **fiable**. Il garantit que les donnees arrivent a destination dans le bon ordre et sans perte.

### Caracteristiques de TCP

| Caracteristique | Description |
|----------------|-------------|
| **Oriente connexion** | Etablit une connexion avant l'envoi de donnees (3-way handshake) |
| **Fiable** | Garantit la livraison des donnees (acquittements, retransmission) |
| **Ordonne** | Les segments sont remis dans l'ordre grace aux numeros de sequence |
| **Controle de flux** | Ajuste le debit en fonction de la capacite du recepteur (windowing) |
| **Controle de congestion** | Reduit le debit en cas de congestion du reseau |
| **Full-duplex** | Communication bidirectionnelle simultanee |

### En-tete TCP

\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Offset|  Res  |U|A|P|R|S|F|           Window Size            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

| Champ | Taille | Description |
|-------|--------|-------------|
| **Source Port** | 16 bits | Port de l'application emettrice |
| **Destination Port** | 16 bits | Port de l'application receptrice |
| **Sequence Number** | 32 bits | Numero de sequence du premier octet de donnees |
| **Acknowledgment Number** | 32 bits | Prochain numero de sequence attendu |
| **Flags** | 6 bits | URG, ACK, PSH, RST, SYN, FIN |
| **Window Size** | 16 bits | Taille de la fenetre de reception (controle de flux) |
| **Checksum** | 16 bits | Verification d'integrite |

### Les flags TCP

| Flag | Nom | Description |
|------|-----|-------------|
| **SYN** | Synchronize | Initie une connexion (3-way handshake) |
| **ACK** | Acknowledge | Acquitte la reception de donnees |
| **FIN** | Finish | Demande la fermeture de la connexion |
| **RST** | Reset | Reinitialisation brutale de la connexion |
| **PSH** | Push | Demande au recepteur de traiter les donnees immediatement |
| **URG** | Urgent | Indique des donnees urgentes a traiter en priorite |

### Taille de l'en-tete TCP

L'en-tete TCP fait au minimum **20 octets** (sans options) et jusqu'a **60 octets** (avec options comme MSS, Window Scaling, SACK).

> **Astuce CCNA :** Retenez que l'en-tete TCP fait **20 octets minimum** (vs 8 octets pour UDP). Les flags les plus importants pour le CCNA sont **SYN**, **ACK** et **FIN**. Le champ Window Size est crucial pour le controle de flux.`
      },
      {
        title: 'Le 3-way handshake TCP',
        content: `Le **3-way handshake** est le processus d'etablissement d'une connexion TCP. Il se deroule en 3 etapes avant tout echange de donnees.

### Les 3 etapes

\`\`\`
Client                                    Serveur
  |                                          |
  |  1. SYN (seq=100)                        |
  |  ──────────────────────────────────────> |
  |  "Je veux me connecter, mon seq = 100"   |
  |                                          |
  |  2. SYN-ACK (seq=300, ack=101)           |
  | <────────────────────────────────────── |
  |  "OK, mon seq = 300, j'attends ton 101"  |
  |                                          |
  |  3. ACK (seq=101, ack=301)               |
  |  ──────────────────────────────────────> |
  |  "Bien recu, j'attends ton 301"          |
  |                                          |
  |  === CONNEXION ETABLIE ===               |
  |  Echange de donnees...                   |
\`\`\`

**Etape 1 — SYN (Client → Serveur)**
- Le client envoie un segment avec le flag **SYN** active
- Il choisit un numero de sequence initial (ISN) aleatoire (ex: seq=100)
- L'etat de la connexion cote client passe a **SYN-SENT**

**Etape 2 — SYN-ACK (Serveur → Client)**
- Le serveur repond avec les flags **SYN + ACK**
- Il choisit son propre ISN (ex: seq=300)
- Il acquitte le SYN du client : **ack = seq_client + 1** (ack=101)
- L'etat cote serveur passe a **SYN-RECEIVED**

**Etape 3 — ACK (Client → Serveur)**
- Le client envoie un segment avec le flag **ACK**
- Il acquitte le SYN du serveur : **ack = seq_serveur + 1** (ack=301)
- La connexion est **ESTABLISHED** des deux cotes

### Fermeture de connexion TCP (4-way)

La fermeture est un processus en **4 etapes** (4-way teardown) :

\`\`\`
Client                                    Serveur
  |  1. FIN (seq=500)                        |
  |  ──────────────────────────────────────> |
  |  "Je n'ai plus de donnees a envoyer"     |
  |                                          |
  |  2. ACK (ack=501)                        |
  | <────────────────────────────────────── |
  |  "Bien recu"                             |
  |                                          |
  |  3. FIN (seq=700)                        |
  | <────────────────────────────────────── |
  |  "Moi non plus, je ferme"               |
  |                                          |
  |  4. ACK (ack=701)                        |
  |  ──────────────────────────────────────> |
  |  "OK, connexion fermee"                  |
\`\`\`

### RST (Reset)

Un **RST** est envoye pour **fermer brutalement** une connexion sans passer par le 4-way teardown. Cas d'utilisation :
- Le port destination n'est pas ouvert
- L'application a crashe
- Un firewall bloque la connexion
- Detection d'une anomalie

### Etats de connexion TCP

| Etat | Description |
|------|-------------|
| **LISTEN** | Le serveur attend une connexion sur un port |
| **SYN-SENT** | Le client a envoye un SYN |
| **SYN-RECEIVED** | Le serveur a recu un SYN et envoye un SYN-ACK |
| **ESTABLISHED** | La connexion est active |
| **FIN-WAIT-1/2** | En cours de fermeture (cote initiateur) |
| **CLOSE-WAIT** | En attente de fermeture (cote recepteur) |
| **TIME-WAIT** | Attente avant fermeture definitive (2 x MSL) |
| **CLOSED** | Connexion fermee |

> **Astuce CCNA :** Le 3-way handshake est un sujet **incontournable** au CCNA. Retenez l'ordre : **SYN → SYN-ACK → ACK**. Le numero d'acquittement (ACK) est toujours egal au numero de sequence recu **+ 1**. La fermeture utilise **FIN** et se fait en 4 etapes.`
      },
      {
        title: 'Controle de flux et windowing',
        content: `Le **controle de flux** est le mecanisme par lequel TCP s'assure que l'emetteur n'envoie pas plus de donnees que le recepteur ne peut en traiter.

### Le principe du windowing

La **fenetre** (window) est le nombre d'octets que le recepteur peut accepter **avant de devoir envoyer un acquittement**. Le recepteur annonce sa taille de fenetre dans chaque segment TCP.

### Fonctionnement

\`\`\`
Emetteur                                              Recepteur
  |                                                      |
  |  Window Size = 3000 octets                           |
  |                                                      |
  |  Segment 1 (seq=1, 1000 octets)                      |
  |  ──────────────────────────────────────────────────> |
  |  Segment 2 (seq=1001, 1000 octets)                   |
  |  ──────────────────────────────────────────────────> |
  |  Segment 3 (seq=2001, 1000 octets)                   |
  |  ──────────────────────────────────────────────────> |
  |                                                      |
  |  ACK (ack=3001, window=3000)                         |
  | <────────────────────────────────────────────────── |
  |  "J'ai tout recu, envoie a partir de 3001"          |
  |  "Ma fenetre est toujours de 3000"                   |
\`\`\`

### Window Scaling

La taille de fenetre dans l'en-tete TCP est codee sur **16 bits** (max 65535 octets). Pour les reseaux haut debit, c'est insuffisant. Le **Window Scaling** (RFC 7323) multiplie cette valeur par une puissance de 2 :

- Negocie lors du 3-way handshake (option TCP)
- Facteur d'echelle de 0 a 14
- Fenetre max : 65535 x 2^14 = **1 073 725 440 octets** (~1 Go)

### Sliding Window (Fenetre glissante)

La **fenetre glissante** permet a l'emetteur d'envoyer plusieurs segments sans attendre l'acquittement de chacun :

\`\`\`
[Envoyes et acquittes] [Envoyes, non acquittes] [Prets a envoyer] [Non prets]
|     1  2  3  4  5     |     6  7  8  9  10    |    11  12  13   |    14...
|  ← Deja confirmes →  | ← Fenetre active →    | ← Disponible → |
\`\`\`

A chaque ACK recu, la fenetre **glisse** vers la droite, permettant d'envoyer de nouveaux segments.

### Retransmission

Si un segment est perdu, TCP le detecte et le retransmet :

**1. Timeout (RTO - Retransmission Timeout)**
- Si l'ACK n'arrive pas dans le delai imparti, le segment est retransmis
- Le RTO est calcule dynamiquement en fonction du RTT (Round-Trip Time)

**2. Fast Retransmit (Retransmission rapide)**
- Si l'emetteur recoit **3 ACK dupliques** (meme numero d'ACK), il retransmet immediatement le segment manquant sans attendre le timeout

\`\`\`
Emetteur                                    Recepteur
  |  Seg 1 (seq=1)                              |
  |  ───────────────────────────────────────>   |  ACK 1001 ✓
  |  Seg 2 (seq=1001)  ← PERDU ! ✗             |
  |  ───────X                                   |
  |  Seg 3 (seq=2001)                           |
  |  ───────────────────────────────────────>   |  ACK 1001 (duplique)
  |  Seg 4 (seq=3001)                           |
  |  ───────────────────────────────────────>   |  ACK 1001 (duplique)
  |  Seg 5 (seq=4001)                           |
  |  ───────────────────────────────────────>   |  ACK 1001 (duplique)
  |                                              |
  |  3 ACK dupliques → Fast Retransmit !         |
  |  Seg 2 (seq=1001) RETRANSMIS                 |
  |  ───────────────────────────────────────>   |  ACK 5001 ✓
\`\`\`

### Controle de congestion

TCP ajuste aussi son debit en fonction de l'etat du **reseau** (pas seulement du recepteur) :

- **Slow Start** : commence avec une petite fenetre de congestion (cwnd) et double a chaque RTT
- **Congestion Avoidance** : apres un seuil, augmente lineairement
- **Fast Recovery** : apres une perte, reduit la fenetre de moitie (pas a 1)

> **Astuce CCNA :** Le CCNA 200-301 attend que vous compreniez le concept de **windowing** et de **controle de flux**. Retenez que le recepteur annonce sa fenetre dans chaque segment TCP, et que l'emetteur ne doit pas envoyer plus de donnees que la fenetre ne le permet. Le **Fast Retransmit** se declenche apres **3 ACK dupliques**.`
      },
      {
        title: 'UDP : User Datagram Protocol',
        content: `**UDP** (User Datagram Protocol) est un protocole de couche 4 (Transport) **sans connexion** et **non fiable**. Il est concu pour la rapidite et la simplicite.

### Caracteristiques d'UDP

| Caracteristique | Description |
|----------------|-------------|
| **Sans connexion** | Pas de handshake, envoie directement les donnees |
| **Non fiable** | Pas de garantie de livraison, pas d'acquittement |
| **Non ordonne** | Les datagrammes peuvent arriver dans le desordre |
| **Pas de controle de flux** | L'emetteur envoie a son rythme |
| **Rapide** | Overhead minimal (en-tete de 8 octets seulement) |
| **Supporte broadcast/multicast** | Peut envoyer a plusieurs destinataires |

### En-tete UDP

\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length              |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

L'en-tete UDP ne fait que **8 octets** (contre 20 minimum pour TCP) :

| Champ | Taille | Description |
|-------|--------|-------------|
| **Source Port** | 16 bits | Port de l'application emettrice |
| **Destination Port** | 16 bits | Port de l'application receptrice |
| **Length** | 16 bits | Taille totale du datagramme (en-tete + donnees) |
| **Checksum** | 16 bits | Verification d'integrite (optionnel en IPv4, obligatoire en IPv6) |

### Quand utiliser UDP ?

UDP est prefere quand la **vitesse** est plus importante que la **fiabilite** :

| Application | Pourquoi UDP ? |
|------------|----------------|
| **DNS** (port 53) | Requetes courtes, une question = une reponse |
| **DHCP** (port 67/68) | Discovery en broadcast, pas de connexion prealable |
| **TFTP** (port 69) | Transfert simple, fiabilite geree par l'application |
| **SNMP** (port 161/162) | Monitoring, perte d'un paquet n'est pas critique |
| **NTP** (port 123) | Synchronisation horaire, latence minimale requise |
| **Syslog** (port 514) | Journalisation, volume eleve, perte acceptable |
| **VoIP (RTP)** | Temps reel, retransmission inutile (audio en retard = inutile) |
| **Streaming video** | Temps reel, quelques pertes = artefacts acceptables |
| **Gaming** | Latence minimale, etat du jeu mis a jour en continu |

### Comparaison TCP vs UDP

| Critere | TCP | UDP |
|---------|-----|-----|
| Connexion | Oriente connexion (3-way handshake) | Sans connexion |
| Fiabilite | Fiable (ACK, retransmission) | Non fiable (best-effort) |
| Ordre | Ordonne (numeros de sequence) | Non ordonne |
| Controle de flux | Oui (windowing) | Non |
| Controle de congestion | Oui | Non |
| En-tete | 20-60 octets | 8 octets |
| Vitesse | Plus lent (overhead) | Plus rapide |
| Broadcast/Multicast | Non | Oui |
| Usage | Web, email, transfert fichiers | VoIP, streaming, DNS, DHCP |

> **Astuce CCNA :** Pour le CCNA, vous devez savoir quel protocole de transport utilise chaque service. Regle generale : si le service a besoin de **fiabilite** (web, email, FTP) → **TCP**. Si le service a besoin de **rapidite** ou utilise le **broadcast** → **UDP**. Exception notable : **DNS** utilise UDP pour les requetes normales mais **TCP** pour les transferts de zone (requetes > 512 octets).`
      },
      {
        title: 'Numeros de port et multiplexage',
        content: `### Le role des ports

Les **numeros de port** permettent a plusieurs applications de partager la meme connexion reseau sur un seul hote. C'est le **multiplexage** au niveau de la couche Transport.

### Types de ports

| Categorie | Plage | Description | Exemple |
|-----------|-------|-------------|---------|
| **Well-known** (Connus) | 0 - 1023 | Reserves aux services standards, attribues par l'IANA | HTTP (80), SSH (22), DNS (53) |
| **Registered** (Enregistres) | 1024 - 49151 | Attribues a des applications specifiques | MySQL (3306), RDP (3389) |
| **Dynamic/Ephemeral** (Dynamiques) | 49152 - 65535 | Utilises temporairement par le client | Port source aleatoire |

### Ports well-known a connaitre pour le CCNA

\`\`\`
Port(s)    Protocole    Transport    Description
───────    ─────────    ─────────    ───────────
20         FTP-Data     TCP          Transfert de donnees FTP
21         FTP-Control  TCP          Commandes FTP
22         SSH          TCP          Shell securise
23         Telnet       TCP          Shell non securise
25         SMTP         TCP          Envoi d'emails
53         DNS          TCP/UDP      Resolution de noms
67         DHCP Server  UDP          DHCP (serveur)
68         DHCP Client  UDP          DHCP (client)
69         TFTP         UDP          Transfert fichiers simple
80         HTTP         TCP          Web non securise
110        POP3         TCP          Reception emails (telecharge)
123        NTP          UDP          Synchronisation horaire
143        IMAP         TCP          Reception emails (synchronise)
161/162    SNMP         UDP          Supervision reseau
389        LDAP         TCP          Annuaire (Active Directory)
443        HTTPS        TCP          Web securise (TLS)
514        Syslog       UDP          Journalisation centralisee
3389       RDP          TCP          Bureau a distance Windows
\`\`\`

### Multiplexage et demultiplexage

Le **multiplexage** permet a plusieurs applications d'envoyer des donnees simultanement via une seule interface reseau :

\`\`\`
Application Web (port 80)  ──┐
Application Email (port 25) ──┤── [Couche Transport] ── [Couche Reseau] ── Carte reseau
Application SSH (port 22)   ──┘
\`\`\`

**Identification d'une connexion TCP :**
Une connexion TCP est identifiee de maniere unique par un **quadruplet** :
- IP source + Port source + IP destination + Port destination

Exemple : 192.168.1.10:**49152** → 93.184.216.34:**443**

Cela signifie qu'un meme serveur peut gerer **des milliers de connexions** simultanees sur le meme port (443), car chaque client a un port source et une IP source differents.

### Socket

Un **socket** est la combinaison d'une adresse IP et d'un numero de port : **192.168.1.10:443**

C'est l'adresse complete de la couche Transport, utilisee par les applications pour communiquer.

### Verification des ports

\`\`\`cisco
! Sur un PC Windows
C:\\> netstat -an
C:\\> netstat -an | findstr :443

! Sur un PC Linux/Mac
$ ss -tuln
$ netstat -tuln

! Sur un equipement Cisco
Router# show tcp brief
Router# show control-plane host open-ports
\`\`\`

### Recapitulatif TCP vs UDP pour le CCNA

| Service | Port | Transport | Mnemonique |
|---------|------|-----------|------------|
| FTP | 20/21 | TCP | **F**ichiers → fiable → TCP |
| SSH | 22 | TCP | **S**ecurise → fiable → TCP |
| Telnet | 23 | TCP | Shell → fiable → TCP |
| SMTP | 25 | TCP | Email envoi → fiable → TCP |
| DNS | 53 | TCP+UDP | Hybride (UDP normal, TCP transfert zone) |
| DHCP | 67/68 | UDP | Broadcast → UDP |
| TFTP | 69 | UDP | **T**rivial → simple → UDP |
| HTTP/S | 80/443 | TCP | Web → fiable → TCP |
| SNMP | 161/162 | UDP | Monitoring → tolerant pertes → UDP |
| Syslog | 514 | UDP | Logs → volume eleve → UDP |

> **Astuce CCNA :** Le CCNA vous demandera souvent "Quel port utilise tel protocole ?" ou "TCP ou UDP ?". Creez des flashcards pour les memoriser. Astuce : les protocoles **temps reel** (VoIP, streaming) et **broadcast** (DHCP, TFTP) utilisent **UDP**. Les protocoles ou la **fiabilite** est essentielle (web, email, transfert fichiers, shell distant) utilisent **TCP**.`
      }
    ]
  },
  {
    id: 8,
    slug: 'problemes-interfaces',
    title: 'Problemes d\'interfaces et diagnostic',
    subtitle: 'Diagnostiquer et resoudre les problemes d\'interfaces reseau avec Cisco IOS',
    icon: 'AlertTriangle',
    color: '#00e5a0',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: '',
    sections: [
      {
        title: 'Commande show interfaces',
        content: `La commande **show interfaces** est l'outil de diagnostic le plus puissant pour analyser l'etat et les performances d'une interface reseau sur un equipement Cisco.

### Syntaxe

\`\`\`cisco
! Afficher toutes les interfaces
Router# show interfaces

! Afficher une interface specifique
Router# show interfaces GigabitEthernet0/0
Switch# show interfaces FastEthernet0/1

! Version resumee
Router# show ip interface brief
\`\`\`

### Exemple de sortie show interfaces

\`\`\`cisco
Router# show interfaces GigabitEthernet0/0
GigabitEthernet0/0 is up, line protocol is up
  Hardware is iGbE, address is 0050.0F00.0001 (bia 0050.0F00.0001)
  Internet address is 192.168.1.1/24
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Keepalive set (10 sec)
  Full Duplex, 1000Mbps, media type is RJ45
  output flow-control is unsupported, input flow-control is unsupported
  ARP type: ARPA, ARP Timeout 04:00:00
  Last input 00:00:01, output 00:00:02, output hang never
  Last clearing of "show interface" counters 1d05h
  Input queue: 0/75/0/0 (size/max/drops/flushes)
  5 minute input rate 2000 bits/sec, 3 packets/sec
  5 minute output rate 1000 bits/sec, 1 packets/sec
     1523 packets input, 198456 bytes, 0 no buffer
     Received 45 broadcasts (0 IP multicasts)
     0 runts, 0 giants, 0 throttles
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     0 watchdog, 0 multicast, 0 pause input
     1245 packets output, 156789 bytes, 0 underruns
     0 output errors, 0 collisions, 0 interface resets
     0 unknown protocol drops
     0 babbles, 0 late collision, 0 deferred
     0 lost carrier, 0 no carrier, 0 pause output
     0 output buffer failures, 0 output buffers swapped out
\`\`\`

### Les champs importants a analyser

| Champ | Valeur ideale | Signification |
|-------|-------------|---------------|
| **is up/down** | up | Etat physique de l'interface (couche 1) |
| **line protocol is up/down** | up | Etat du protocole de ligne (couche 2) |
| **BW** | Bande passante configuree | Utilisee pour les calculs de metrique (OSPF, EIGRP) |
| **reliability** | 255/255 | 255 = 100% fiable. < 255 = probleme |
| **txload / rxload** | 1/255 | Charge de l'interface (1 = idle, 255 = saturation) |
| **Duplex** | Full Duplex | Half = potentiel probleme |
| **Speed** | 1000Mbps (ou plus) | Doit correspondre au cable et a l'equipement distant |
| **input/output errors** | 0 | Toute valeur > 0 indique un probleme |
| **CRC errors** | 0 | Erreurs de controle d'integrite |

### show ip interface brief

\`\`\`cisco
Router# show ip interface brief
Interface            IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0   192.168.1.1     YES manual up                    up
GigabitEthernet0/1   10.0.0.1        YES manual up                    up
Serial0/0/0          unassigned      YES unset  administratively down down
Loopback0            1.1.1.1         YES manual up                    up
\`\`\`

> **Astuce CCNA :** La commande \`show ip interface brief\` est la premiere commande a utiliser pour avoir une vue d'ensemble rapide de toutes les interfaces. Cherchez les interfaces qui ne sont pas **up/up**. Si Status = "administratively down", l'interface est desactivee (il faut faire \`no shutdown\`).`
      },
      {
        title: 'Etats des interfaces et diagnostic',
        content: `### Les combinaisons d'etats d'interface

L'etat d'une interface est defini par deux indicateurs :
- **Status** (Layer 1) : l'etat physique
- **Protocol** (Layer 2) : l'etat du protocole de liaison

| Status | Protocol | Signification | Cause probable |
|--------|----------|---------------|----------------|
| **up** | **up** | Fonctionnel | Tout va bien |
| **up** | **down** | Probleme L2 | Encapsulation mismatch, keepalive, clockrate manquant (serial) |
| **down** | **down** | Probleme L1 | Cable debranche, port distant eteint, defaut materiel |
| **administratively down** | **down** | Interface desactivee | Commande \`shutdown\` appliquee |

### Diagnostic methodique par couche

**Couche 1 — Physique (down/down)**

\`\`\`cisco
! Verifier l'etat physique
Switch# show interfaces status
Switch# show interfaces Gi0/1

! Solutions :
! - Verifier le cable (bien branche des deux cotes ?)
! - Verifier le SFP (compatible ? bien insere ?)
! - Tester avec un autre cable
! - Verifier que l'equipement distant est allume
! - Verifier speed/duplex
\`\`\`

**Couche 2 — Liaison (up/down)**

\`\`\`cisco
! Verifier l'encapsulation
Router# show interfaces Serial0/0/0
! Verifier : Encapsulation HDLC (ou PPP)

! Sur les liens serie, verifier le clockrate
Router(config-if)# clock rate 128000  ! Cote DCE seulement

! Verifier les keepalives
Router(config-if)# keepalive 10
\`\`\`

**Couche 3 — Reseau**

\`\`\`cisco
! Verifier la configuration IP
Router# show ip interface brief
Router# show ip interface GigabitEthernet0/0

! Verifier la connectivite
Router# ping 192.168.1.2
Router# traceroute 10.0.0.1

! Verifier la table de routage
Router# show ip route
\`\`\`

### Interface administratively down

Si une interface est en etat **administratively down**, elle a ete volontairement desactivee :

\`\`\`cisco
! Activer l'interface
Router(config)# interface GigabitEthernet0/0
Router(config-if)# no shutdown

! Desactiver l'interface
Router(config-if)# shutdown
\`\`\`

### err-disabled

L'etat **err-disabled** signifie que le switch a automatiquement desactive le port suite a une violation de securite :

\`\`\`cisco
! Causes possibles :
! - Port security violation
! - BPDU Guard violation
! - Boucle detectee (loopback)
! - Erreurs excessives

! Voir la raison
Switch# show interfaces status err-disabled

! Reactiver le port
Switch(config)# interface Fa0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown

! Ou configurer la recuperation automatique
Switch(config)# errdisable recovery cause psecure-violation
Switch(config)# errdisable recovery interval 300
\`\`\`

> **Astuce CCNA :** L'analyse de l'etat des interfaces est un sujet majeur du CCNA. Retenez les 4 combinaisons d'etat et leurs causes. La methode de diagnostic est toujours **bottom-up** : commencez par la couche 1 (cable, physique), puis couche 2 (encapsulation, duplex), puis couche 3 (IP, routage). N'oubliez pas \`no shutdown\` — c'est une erreur classique.`
      },
      {
        title: 'Problemes de speed/duplex et erreurs',
        content: `### Speed/Duplex Mismatch

Un **mismatch** de vitesse ou de duplex entre deux equipements connectes est l'un des problemes les plus courants et les plus insidieux en reseau.

### Comment detecter un duplex mismatch

\`\`\`cisco
! Verifier speed et duplex
Switch# show interfaces Fa0/1
  Full Duplex, 100Mbps, media type is 10/100BaseTX

Switch# show interfaces status
Port    Name      Status    Vlan    Duplex  Speed   Type
Fa0/1             connected 1       a-full  a-100   10/100BaseTX
Fa0/2             connected 1       full    100     10/100BaseTX
\`\`\`

**Notation :**
- **a-full / a-100** : auto-negotie (full duplex, 100 Mbps)
- **full / 100** : configure manuellement

### Scenarios de mismatch

| Cote A | Cote B | Resultat |
|--------|--------|----------|
| auto | auto | Negociation correcte (recommande) |
| 100/full | 100/full | OK (meme config manuelle) |
| auto | 100/full | **PROBLEME** : A negocie 100/half (pas full) |
| 1000/full | 100/full | **PROBLEME** : Mismatch de vitesse, interface down |

**Pourquoi auto + manual = probleme ?**
Quand un cote est en auto et l'autre en manual, l'auto-negotiation ne recoit pas de reponse de l'autre cote. Le cote auto :
- Detecte la **vitesse** correctement (par le signal electrique)
- Mais utilise le **duplex par defaut** : half-duplex pour 10/100, full-duplex pour 1000

### Symptomes d'un duplex mismatch

\`\`\`cisco
Switch# show interfaces Fa0/1
  ...
  0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
  0 output errors, 234 collisions, 15 interface resets
  0 babbles, 187 late collision, 45 deferred
\`\`\`

| Compteur | Signification | Lien avec duplex mismatch |
|----------|---------------|--------------------------|
| **Late collisions** | Collisions apres les premiers 64 octets | Indicateur principal de duplex mismatch |
| **FCS/CRC errors** | Trames corrompues | Le cote full-duplex envoie pendant que l'autre ecoute |
| **Runts** | Trames < 64 octets | Trames tronquees par les collisions |
| **Input errors** | Erreurs generiques en reception | Accumulation des erreurs ci-dessus |

### Autres types d'erreurs d'interface

| Erreur | Description | Cause probable |
|--------|-------------|----------------|
| **CRC errors** | Erreur de controle d'integrite (FCS) | Cable defectueux, EMI, duplex mismatch |
| **Runts** | Trames trop petites (< 64 octets) | Collision, carte reseau defectueuse |
| **Giants** | Trames trop grandes (> 1518 octets) | Probleme de carte reseau, jumbo frames mal configurees |
| **Input errors** | Total des erreurs en entree | Somme de CRC + runts + frame + overrun |
| **Output errors** | Erreurs en sortie | Buffer plein, interface saturee |
| **Collisions** | Nombre de collisions | Normal en half-duplex, anormal en full-duplex |
| **Late collisions** | Collisions tardives | **Duplex mismatch** ou cable trop long |
| **Frame errors** | Trames avec mauvais format | Probleme de carte reseau |
| **Overrun** | Buffer d'entree plein | Interface saturee, CPU surchargee |
| **Ignored** | Trames ignorees (buffer plein) | Manque de memoire buffer |

### Resolution des problemes

\`\`\`cisco
! 1. Verifier speed/duplex des deux cotes
Switch# show interfaces Fa0/1 status
Switch# show interfaces Fa0/2 status

! 2. Configurer identiquement les deux cotes
Switch(config-if)# speed 1000
Switch(config-if)# duplex full

! OU laisser en auto des deux cotes (recommande)
Switch(config-if)# speed auto
Switch(config-if)# duplex auto

! 3. Remettre les compteurs a zero pour surveiller
Switch# clear counters Fa0/1

! 4. Verifier apres quelques minutes
Switch# show interfaces Fa0/1
\`\`\`

> **Astuce CCNA :** Si vous voyez des **late collisions** sur une interface en **full-duplex**, c'est presque toujours un **duplex mismatch**. La meilleure pratique est de configurer les deux cotes en **auto** ou de configurer les deux cotes avec la **meme valeur manuelle**. Apres avoir resolu un probleme, pensez toujours a \`clear counters\` pour repartir de zero.`
      },
      {
        title: 'Troubleshooting methodique et commandes utiles',
        content: `### Methodologie de depannage

Le depannage reseau suit une approche **structuree**. Cisco recommande plusieurs methodes :

### Approche Bottom-Up (la plus courante)

Commencer par la **couche 1** et remonter :

\`\`\`
Couche 1 (Physique)
  └── Cable branche ? LED allumee ? show interfaces status
       └── Couche 2 (Liaison)
            └── MAC apprise ? show mac address-table
                 └── Couche 3 (Reseau)
                      └── IP configuree ? show ip interface brief
                           └── Couche 4 (Transport)
                                └── Port ouvert ? telnet/ping
                                     └── Couche 7 (Application)
                                          └── Service actif ?
\`\`\`

### Approche Top-Down

Commencer par la **couche 7** et descendre. Utile quand on sait que le reseau fonctionne mais qu'un service specifique ne repond pas.

### Approche Divide-and-Conquer

Commencer par la **couche 3** (ping). Si ca fonctionne, le probleme est au-dessus. Si ca ne fonctionne pas, le probleme est en dessous.

### Commandes de diagnostic essentielles

\`\`\`cisco
! === COUCHE 1 ===
! Etat physique des interfaces
Switch# show interfaces status
Switch# show interfaces Gi0/1
! PoE
Switch# show power inline

! === COUCHE 2 ===
! Table MAC
Switch# show mac address-table
Switch# show mac address-table interface Fa0/1
! VLAN
Switch# show vlan brief
! STP
Switch# show spanning-tree
! CDP/LLDP
Switch# show cdp neighbors
Switch# show lldp neighbors

! === COUCHE 3 ===
! Configuration IP
Router# show ip interface brief
! Table de routage
Router# show ip route
! Table ARP
Router# show arp
! Connectivite
Router# ping 192.168.1.1
Router# traceroute 10.0.0.1

! === GENERAL ===
! Configuration courante
Router# show running-config
Router# show running-config interface Gi0/0
! Logs
Router# show logging
! CPU et memoire
Router# show processes cpu
Router# show memory statistics
\`\`\`

### Scenarios de depannage courants

**Scenario 1 : Un PC ne peut pas pinger sa passerelle**
\`\`\`cisco
! 1. Verifier le cable (couche 1)
Switch# show interfaces Fa0/1 status  → connected ?

! 2. Verifier le VLAN (couche 2)
Switch# show vlan brief  → le port est dans le bon VLAN ?

! 3. Verifier l'IP (couche 3)
! Sur le PC : ipconfig /all → IP, masque, passerelle corrects ?
! Sur le routeur :
Router# show ip interface brief  → IP de la passerelle configuree ?
Router# show running-config interface Gi0/0  → no shutdown ?
\`\`\`

**Scenario 2 : Performances degradees entre deux switches**
\`\`\`cisco
! Verifier speed/duplex
Switch# show interfaces Gi0/1 status
! Chercher des erreurs
Switch# show interfaces Gi0/1 | include errors|collision|CRC
! Verifier la charge
Switch# show interfaces Gi0/1 | include load|rate
\`\`\`

**Scenario 3 : Interface en err-disabled**
\`\`\`cisco
! Identifier la cause
Switch# show interfaces status err-disabled
Switch# show port-security interface Fa0/1
Switch# show spanning-tree inconsistentports

! Corriger et reactiver
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
\`\`\`

### Checklist de depannage rapide

| Verification | Commande |
|-------------|----------|
| Interface up/up ? | \`show ip interface brief\` |
| Cable OK ? | \`show interfaces status\` |
| Bonne vitesse/duplex ? | \`show interfaces Gi0/1\` |
| Erreurs ? | \`show interfaces Gi0/1 \\| include error\` |
| Dans le bon VLAN ? | \`show vlan brief\` |
| IP correcte ? | \`show ip interface brief\` |
| Route existe ? | \`show ip route\` |
| ARP resolu ? | \`show arp\` |
| Voisin visible ? | \`show cdp neighbors\` |

> **Astuce CCNA :** Le CCNA 200-301 comporte de nombreuses questions de depannage basees sur des sorties de commandes. Vous devez savoir lire et interpreter les sorties de \`show interfaces\`, \`show ip interface brief\`, \`show ip route\`, \`show vlan brief\`, et \`show mac address-table\`. Entrainez-vous a identifier rapidement les anomalies dans ces sorties. L'approche **Divide-and-Conquer** (commencer par un ping) est souvent la plus efficace dans la pratique.`
      }
    ]
  },
  {
    id: 9,
    slug: 'introduction-ipv6',
    title: 'Introduction a IPv6',
    subtitle: 'Decouvrir le protocole IPv6, ses types d\'adresses et les differences avec IPv4',
    icon: 'Globe',
    color: '#00e5a0',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: '88qySp_fbZs',
    sections: [
      {
        title: 'Pourquoi IPv6 ?',
        content: `**IPv6** (Internet Protocol version 6) est le successeur d'**IPv4**. Il a ete developpe pour resoudre le probleme principal d'IPv4 : l'**epuisement des adresses**.

### Le probleme d'IPv4

IPv4 utilise des adresses de **32 bits**, ce qui donne environ **4.3 milliards** d'adresses possibles (2^32 = 4,294,967,296). Ce nombre semblait suffisant dans les annees 1980, mais l'explosion d'Internet, des smartphones et de l'IoT a rendu ces adresses insuffisantes.

**Solutions temporaires mises en place :**
- **NAT** (Network Address Translation) : partager une IP publique entre plusieurs appareils
- **CIDR** : allocation plus efficace des adresses
- **Adresses privees RFC 1918** : reutiliser les memes plages en interne

Mais ces solutions ne font que retarder l'inevitable. IPv6 est la solution definitive.

### Les avantages d'IPv6

| Avantage | Detail |
|----------|--------|
| **Espace d'adressage immense** | 128 bits = 2^128 = 340 undecillions d'adresses |
| **Plus de NAT** | Chaque appareil peut avoir sa propre adresse publique |
| **En-tete simplifie** | En-tete fixe de 40 octets (vs variable en IPv4) → routage plus rapide |
| **Auto-configuration** | SLAAC (Stateless Address Autoconfiguration) — pas besoin de DHCP |
| **Securite integree** | IPsec est natif (optionnel mais supporte par defaut) |
| **Pas de broadcast** | Remplace par le **multicast** et l'**anycast** |
| **Meilleur support multicast** | Adresses multicast obligatoires |
| **Flow Label** | Champ pour identifier les flux (QoS) |

### Format d'une adresse IPv6

Une adresse IPv6 fait **128 bits**, representee en **8 groupes de 4 chiffres hexadecimaux** separes par des deux-points :

\`\`\`
Complet  : 2001:0DB8:0000:0000:0000:0000:0000:0001
Simplifie: 2001:DB8::1
\`\`\`

### Regles de simplification

**Regle 1 : Supprimer les zeros en tete de chaque groupe**
\`\`\`
2001:0DB8:0000:0001:0000:0000:0000:0001
  → 2001:DB8:0:1:0:0:0:1
\`\`\`

**Regle 2 : Remplacer un ou plusieurs groupes consecutifs de zeros par "::"**
\`\`\`
2001:DB8:0:1:0:0:0:1
  → 2001:DB8:0:1::1
\`\`\`

**IMPORTANT :** On ne peut utiliser **"::" qu'une seule fois** dans une adresse. Sinon, on ne saurait pas combien de groupes de zeros sont remplaces a chaque endroit.

### Exemples de simplification

| Adresse complete | Adresse simplifiee |
|-----------------|--------------------|
| 2001:0DB8:0000:0000:0000:0000:0000:0001 | 2001:DB8::1 |
| FE80:0000:0000:0000:0001:0002:0003:0004 | FE80::1:2:3:4 |
| 2001:0DB8:ABCD:0000:0000:0000:0000:0000 | 2001:DB8:ABCD:: |
| 0000:0000:0000:0000:0000:0000:0000:0001 | ::1 (loopback) |
| 0000:0000:0000:0000:0000:0000:0000:0000 | :: (non specifiee) |

> **Astuce CCNA :** Le CCNA vous demandera de simplifier et d'etendre des adresses IPv6. Entrainez-vous dans les deux sens. Retenez que **"::"** ne peut apparaitre **qu'une seule fois**. Pour etendre, comptez les groupes presents et ajoutez des groupes de zeros pour arriver a 8 au total.`
      },
      {
        title: 'Types d\'adresses IPv6',
        content: `IPv6 definit plusieurs types d'adresses, chacune avec un role specifique. Les trois principaux sont : **unicast**, **multicast** et **anycast**.

### Global Unicast Address (GUA)

L'equivalent des adresses **publiques IPv4**. Les GUA sont routables sur Internet.

\`\`\`
Prefixe : 2000::/3 (commence par 2 ou 3)
Exemple : 2001:DB8:1234:5678:ABCD:EF01:2345:6789

Structure :
| Global Routing Prefix | Subnet ID | Interface ID |
| 48 bits (attribue par RIR/FAI) | 16 bits | 64 bits |
| Identifie le reseau | Sous-reseau | Identifie l'hote |
\`\`\`

**Decomposition :**
- **Global Routing Prefix** (48 bits) : attribue par le FAI ou le RIR
- **Subnet ID** (16 bits) : identifie le sous-reseau au sein de l'organisation (2^16 = 65536 sous-reseaux)
- **Interface ID** (64 bits) : identifie l'interface de l'hote

### Link-Local Address (LLA)

Adresses **locales au lien** — non routables, utilisees uniquement pour la communication sur le meme segment reseau.

\`\`\`
Prefixe : FE80::/10
Plage   : FE80:: a FEBF::
Exemple : FE80::1, FE80::A1:B2FF:FEC3:D4E5

Structure :
| FE80 (10 bits) | 54 bits de zeros | Interface ID (64 bits) |
\`\`\`

**Caracteristiques des LLA :**
- **Automatiquement generees** sur chaque interface IPv6
- **Non routables** : ne passent pas les routeurs
- **Obligatoires** : chaque interface IPv6 en a une
- **Utilisees pour** : NDP (Neighbor Discovery), OSPFv3 next-hop, routage (next-hop dans la table de routage)

### Adresses multicast

IPv6 n'a **pas de broadcast**. A la place, il utilise le **multicast** pour envoyer a un groupe d'hotes.

| Adresse | Scope | Description |
|---------|-------|-------------|
| **FF02::1** | Link-local | Tous les noeuds (equivalent du broadcast IPv4) |
| **FF02::2** | Link-local | Tous les routeurs |
| **FF02::5** | Link-local | Tous les routeurs OSPF |
| **FF02::6** | Link-local | Tous les routeurs DR OSPF |
| **FF02::9** | Link-local | Tous les routeurs RIPng |
| **FF02::A** | Link-local | Tous les routeurs EIGRP |
| **FF02::1:FFxx:xxxx** | Link-local | Solicited-node multicast (pour NDP) |

### Anycast

Une adresse **anycast** est attribuee a plusieurs interfaces. Le paquet est livre a l'interface **la plus proche** (au sens du routage).

- Meme format qu'une adresse unicast
- Utilisee pour les serveurs DNS racine, CDN, load balancing

### Loopback et adresse non specifiee

| Adresse | Usage |
|---------|-------|
| **::1** | Loopback (equivalent de 127.0.0.1 en IPv4) |
| **::** | Adresse non specifiee (equivalent de 0.0.0.0 en IPv4) |

### Unique Local Address (ULA)

L'equivalent des adresses **privees IPv4** (RFC 1918). Non routables sur Internet.

\`\`\`
Prefixe : FC00::/7 (en pratique FD00::/8)
Exemple : FD12:3456:789A::1
\`\`\`

### Resume des types d'adresses

| Type | Prefixe | Equivalent IPv4 | Routable Internet |
|------|---------|-----------------|-------------------|
| **GUA** | 2000::/3 | Adresse publique | Oui |
| **LLA** | FE80::/10 | APIPA (169.254.x.x) | Non |
| **ULA** | FC00::/7 | Privee (10.x, 172.16.x, 192.168.x) | Non |
| **Multicast** | FF00::/8 | Multicast (224.0.0.0/4) | Selon scope |
| **Loopback** | ::1 | 127.0.0.1 | Non |

> **Astuce CCNA :** Retenez les prefixes : **2000::/3** = GUA (publique), **FE80::/10** = Link-Local, **FF02::** = Multicast link-local. Les adresses Link-Local sont **obligatoires** sur chaque interface IPv6 et sont utilisees comme next-hop dans les tables de routage IPv6. Le multicast **FF02::1** remplace le broadcast IPv4.`
      },
      {
        title: 'EUI-64 et attribution d\'adresses',
        content: `### EUI-64 (Extended Unique Identifier)

**EUI-64** est une methode pour generer automatiquement l'**Interface ID** (64 bits) d'une adresse IPv6 a partir de l'adresse **MAC** (48 bits) de la carte reseau.

### Processus de generation EUI-64

1. Prendre l'adresse MAC (48 bits)
2. La couper en deux moities
3. Inserer **FF:FE** au milieu
4. Inverser le 7eme bit (bit U/L — Universal/Local)

**Exemple :**

\`\`\`
Adresse MAC : 00:1A:2B:3C:4D:5E

Etape 1 — Couper en deux :
  00:1A:2B | 3C:4D:5E

Etape 2 — Inserer FF:FE :
  00:1A:2B:FF:FE:3C:4D:5E

Etape 3 — Inverser le 7eme bit :
  00 en binaire = 0000 0000
  7eme bit (de gauche) = 0 → inverser → 1
  0000 0010 = 02

Resultat : 02:1A:2B:FF:FE:3C:4D:5E
En notation IPv6 : 021A:2BFF:FE3C:4D5E

Adresse complete (avec prefixe FE80::) :
  FE80::21A:2BFF:FE3C:4D5E
\`\`\`

### Pourquoi inverser le 7eme bit ?

Le 7eme bit est le bit **U/L** (Universal/Local) :
- **0** = adresse universelle (attribuee par le fabricant) → en EUI-64, on met a **1** pour indiquer "utilise en IPv6"
- **1** = adresse locale (modifiee localement)

En pratique, une MAC commencant par un octet **pair** aura son 7eme bit mis a 1 (l'octet augmente de 2).

### Methodes d'attribution des adresses IPv6

| Methode | Description | Serveur requis |
|---------|-------------|----------------|
| **Manuelle** | Configuration statique | Non |
| **SLAAC** | Auto-configuration sans etat | Non (routeur envoie le prefixe) |
| **DHCPv6 Stateful** | Comme DHCP en IPv4 | Oui (serveur DHCPv6) |
| **DHCPv6 Stateless** | SLAAC pour IP + DHCPv6 pour options (DNS) | Oui (serveur DHCPv6 leger) |

### SLAAC (Stateless Address Autoconfiguration)

SLAAC permet a un hote de **se configurer tout seul** sans serveur DHCP :

1. L'hote genere sa **LLA** (FE80::) automatiquement
2. L'hote envoie un **Router Solicitation** (RS) en multicast (FF02::2)
3. Le routeur repond avec un **Router Advertisement** (RA) contenant le **prefixe** reseau
4. L'hote combine le prefixe avec son Interface ID (EUI-64 ou aleatoire) pour creer sa GUA
5. L'hote effectue un **DAD** (Duplicate Address Detection) pour verifier l'unicite

\`\`\`
[PC]  ──RS (FF02::2)──>  [Routeur]
      "Quel est le prefixe reseau ?"

[PC]  <──RA──            [Routeur]
      "Le prefixe est 2001:DB8:1::/64"

[PC] genere : 2001:DB8:1::021A:2BFF:FE3C:4D5E /64
[PC] envoie DAD pour verifier que l'adresse est unique
\`\`\`

### Configuration Cisco IOS

\`\`\`cisco
! Activer IPv6 sur le routeur
Router(config)# ipv6 unicast-routing

! Configurer une adresse IPv6 manuellement
Router(config-if)# ipv6 address 2001:DB8:1::1/64

! Configurer une LLA manuellement
Router(config-if)# ipv6 address FE80::1 link-local

! Utiliser EUI-64 pour generer l'Interface ID
Router(config-if)# ipv6 address 2001:DB8:1::/64 eui-64

! Verifier
Router# show ipv6 interface brief
Router# show ipv6 interface GigabitEthernet0/0
\`\`\`

> **Astuce CCNA :** Le calcul EUI-64 est un sujet frequent au CCNA. Memorisez les etapes : couper la MAC, inserer **FFFE**, inverser le **7eme bit**. Attention au piege : le 7eme bit se compte a partir de la **gauche** (bit de poids fort du premier octet). Pour SLAAC, retenez que le routeur envoie le **prefixe** et l'hote genere le reste.`
      },
      {
        title: 'Comparaison IPv4 vs IPv6 et NDP',
        content: `### Comparaison detaillee IPv4 vs IPv6

| Critere | IPv4 | IPv6 |
|---------|------|------|
| **Taille adresse** | 32 bits | 128 bits |
| **Notation** | Decimale pointee (192.168.1.1) | Hexadecimale (2001:DB8::1) |
| **Nombre d'adresses** | ~4.3 milliards | ~3.4 x 10^38 |
| **En-tete** | Variable (20-60 octets) | Fixe (40 octets) |
| **Checksum** | Oui (dans l'en-tete) | Non (delegue aux couches sup.) |
| **Broadcast** | Oui | Non (remplace par multicast) |
| **Fragmentation** | Par les routeurs | Par la source uniquement |
| **ARP** | Oui | Non (remplace par NDP) |
| **DHCP** | Obligatoire ou manuel | SLAAC / DHCPv6 |
| **IPsec** | Optionnel | Integre (optionnel en pratique) |
| **NAT** | Necessaire | Pas necessaire |
| **Configuration auto** | APIPA (169.254.x.x) | SLAAC + LLA automatique |
| **Prefixe standard** | /24 courant | /64 standard |

### En-tete IPv6

L'en-tete IPv6 est **simplifie** par rapport a IPv4 :

\`\`\`
| Version | Traffic Class | Flow Label                   |
| Payload Length          | Next Header | Hop Limit      |
| Source Address (128 bits)                              |
| Destination Address (128 bits)                         |
\`\`\`

| Champ | Taille | Description |
|-------|--------|-------------|
| **Version** | 4 bits | Toujours 6 |
| **Traffic Class** | 8 bits | Equivalent du ToS IPv4 (QoS) |
| **Flow Label** | 20 bits | Identification des flux (nouveau en IPv6) |
| **Payload Length** | 16 bits | Taille des donnees (sans l'en-tete) |
| **Next Header** | 8 bits | Identifie le protocole suivant (TCP=6, UDP=17, ICMPv6=58) |
| **Hop Limit** | 8 bits | Equivalent du TTL IPv4 |

### NDP (Neighbor Discovery Protocol)

**NDP** remplace **ARP** en IPv6. Il utilise des messages **ICMPv6** pour decouvrir les voisins et les routeurs.

### Messages NDP

| Message | Type ICMPv6 | Description | Equivalent IPv4 |
|---------|-------------|-------------|-----------------|
| **RS** (Router Solicitation) | 133 | L'hote demande les parametres reseau | DHCP Discover |
| **RA** (Router Advertisement) | 134 | Le routeur annonce le prefixe et les options | DHCP Offer |
| **NS** (Neighbor Solicitation) | 135 | "Quelle est ta MAC ?" (resolution d'adresse) | ARP Request |
| **NA** (Neighbor Advertisement) | 136 | "Voici ma MAC" (reponse) | ARP Reply |
| **Redirect** | 137 | Le routeur indique un meilleur chemin | ICMP Redirect |

### DAD (Duplicate Address Detection)

Avant d'utiliser une adresse IPv6, un hote effectue un **DAD** pour verifier que l'adresse n'est pas deja utilisee :

1. L'hote envoie un **NS** (Neighbor Solicitation) pour sa propre adresse
2. Si personne ne repond → l'adresse est unique, l'hote peut l'utiliser
3. Si quelqu'un repond avec un **NA** → conflit d'adresse, l'hote ne peut pas l'utiliser

### Verification IPv6 avec Cisco IOS

\`\`\`cisco
! Voir les adresses IPv6 de toutes les interfaces
Router# show ipv6 interface brief

! Exemple de sortie :
GigabitEthernet0/0     [up/up]
    FE80::1                          ← Link-Local
    2001:DB8:1::1                    ← Global Unicast

! Voir les details d'une interface
Router# show ipv6 interface GigabitEthernet0/0

! Voir les voisins IPv6 (equivalent de show arp)
Router# show ipv6 neighbors

! Voir la table de routage IPv6
Router# show ipv6 route

! Ping en IPv6
Router# ping 2001:DB8:1::2
Router# ping FE80::2  ! Necessite de specifier l'interface
\`\`\`

### Coexistence IPv4/IPv6

Pendant la transition, plusieurs mecanismes permettent la coexistence :

| Mecanisme | Description |
|-----------|-------------|
| **Dual-Stack** | L'equipement utilise IPv4 ET IPv6 simultanement |
| **Tunneling** | Encapsuler IPv6 dans IPv4 (6to4, ISATAP, GRE) |
| **NAT64** | Traduire entre IPv4 et IPv6 |

> **Astuce CCNA :** Le CCNA 200-301 couvre IPv6 en profondeur. Retenez que **NDP remplace ARP** en IPv6, que le **broadcast n'existe pas** en IPv6 (remplace par multicast FF02::1), et que chaque interface a au minimum une adresse **Link-Local** (FE80::). Le mecanisme de transition le plus courant est le **Dual-Stack** (IPv4 + IPv6 sur le meme equipement). Sachez utiliser \`show ipv6 interface brief\` et \`show ipv6 route\`.`
      }
    ]
  },
  {
    id: 10,
    slug: 'verification-ip-os',
    title: 'Verification IP sur les OS',
    subtitle: 'Utiliser les commandes de diagnostic reseau sur Windows, Linux, macOS et Cisco IOS',
    icon: 'Terminal',
    color: '#00e5a0',
    duration: '30 min',
    level: 'Debutant',
    videoId: 'F83ZvOKj2BU',
    sections: [
      {
        title: 'Commandes Windows',
        content: `Windows dispose de plusieurs commandes en ligne de commande (CMD ou PowerShell) pour diagnostiquer les problemes reseau.

### ipconfig

La commande **ipconfig** affiche la configuration IP de toutes les interfaces reseau.

\`\`\`cmd
C:\\> ipconfig

Windows IP Configuration

Ethernet adapter Ethernet:
   Connection-specific DNS Suffix  . : home.local
   IPv4 Address. . . . . . . . . . . : 192.168.1.10
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

C:\\> ipconfig /all        ← Details complets (MAC, DHCP, DNS, etc.)
C:\\> ipconfig /release    ← Liberer l'adresse DHCP
C:\\> ipconfig /renew      ← Renouveler l'adresse DHCP
C:\\> ipconfig /flushdns   ← Vider le cache DNS
C:\\> ipconfig /displaydns ← Afficher le cache DNS
\`\`\`

**Informations cles de ipconfig /all :**
- **Physical Address** : adresse MAC
- **DHCP Enabled** : Yes/No
- **IPv4 Address** : adresse IP
- **Subnet Mask** : masque de sous-reseau
- **Default Gateway** : passerelle par defaut
- **DNS Servers** : serveurs DNS utilises
- **DHCP Server** : adresse du serveur DHCP

### ping

La commande **ping** teste la connectivite avec un hote distant en envoyant des paquets **ICMP Echo Request**.

\`\`\`cmd
C:\\> ping 192.168.1.1
C:\\> ping google.com        ← Test DNS + connectivite
C:\\> ping -t 192.168.1.1    ← Ping continu (Ctrl+C pour arreter)
C:\\> ping -n 10 192.168.1.1 ← Envoyer 10 paquets
C:\\> ping -l 1500 192.168.1.1  ← Taille du paquet (test MTU)
C:\\> ping 127.0.0.1         ← Test de la pile TCP/IP locale (loopback)
\`\`\`

**Interpretation :**
- **Reply from** : l'hote repond → connectivite OK
- **Request timed out** : pas de reponse → probleme de connectivite ou firewall
- **Destination host unreachable** : pas de route vers la destination

### tracert (traceroute)

La commande **tracert** affiche le chemin (routeurs traverses) pour atteindre une destination.

\`\`\`cmd
C:\\> tracert 8.8.8.8
C:\\> tracert -d 8.8.8.8     ← Sans resolution DNS (plus rapide)

Tracing route to dns.google [8.8.8.8]
  1    <1 ms    <1 ms    <1 ms  192.168.1.1      ← Passerelle locale
  2     5 ms     4 ms     5 ms  10.0.0.1          ← Routeur FAI
  3    12 ms    11 ms    12 ms  172.16.0.1        ← Noeud intermediaire
  4    15 ms    14 ms    15 ms  8.8.8.8           ← Destination
\`\`\`

### nslookup

La commande **nslookup** interroge les serveurs DNS pour resoudre un nom de domaine.

\`\`\`cmd
C:\\> nslookup google.com
Server:  dns.home.local
Address: 192.168.1.1

Non-authoritative answer:
Name:    google.com
Address: 142.250.179.110

C:\\> nslookup google.com 8.8.8.8  ← Utiliser un serveur DNS specifique
\`\`\`

### arp

La commande **arp** gere le cache ARP local.

\`\`\`cmd
C:\\> arp -a              ← Afficher le cache ARP
C:\\> arp -d              ← Vider le cache ARP
C:\\> arp -s 192.168.1.20 AA-BB-CC-DD-EE-FF  ← Entree statique
\`\`\`

### netstat

La commande **netstat** affiche les connexions reseau actives et les ports en ecoute.

\`\`\`cmd
C:\\> netstat -an          ← Toutes les connexions (numerique)
C:\\> netstat -ano         ← Avec le PID du processus
C:\\> netstat -an | findstr :443  ← Filtrer sur le port 443
\`\`\`

> **Astuce CCNA :** Pour le CCNA, retenez les commandes Windows les plus importantes : \`ipconfig /all\` (configuration IP), \`ping\` (connectivite), \`tracert\` (chemin), \`nslookup\` (DNS), \`arp -a\` (cache ARP). La sequence de test typique est : ping 127.0.0.1 → ping sa propre IP → ping la passerelle → ping une IP distante → ping un nom de domaine.`
      },
      {
        title: 'Commandes Linux et macOS',
        content: `Linux et macOS utilisent des commandes similaires pour le diagnostic reseau, bien que certaines varient.

### ifconfig / ip addr

\`\`\`bash
# Ancienne commande (encore disponible sur macOS)
$ ifconfig
$ ifconfig eth0

# Commande moderne (Linux)
$ ip addr
$ ip addr show eth0
$ ip -4 addr   # IPv4 uniquement
$ ip -6 addr   # IPv6 uniquement

# Configurer une IP temporairement
$ sudo ip addr add 192.168.1.10/24 dev eth0
$ sudo ip link set eth0 up
\`\`\`

**Sortie typique de ip addr :**
\`\`\`
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP
    link/ether 00:1a:2b:3c:4d:5e brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::21a:2bff:fe3c:4d5e/64 scope link
\`\`\`

### ping

\`\`\`bash
$ ping 192.168.1.1          # Ping continu par defaut (Ctrl+C pour arreter)
$ ping -c 5 192.168.1.1     # 5 paquets seulement
$ ping -s 1472 192.168.1.1  # Taille du payload (test MTU)
$ ping6 2001:DB8::1         # Ping IPv6
$ ping -I eth0 192.168.1.1  # Specifier l'interface source
\`\`\`

### traceroute

\`\`\`bash
# Linux
$ traceroute 8.8.8.8
$ traceroute -n 8.8.8.8     # Sans resolution DNS

# macOS
$ traceroute 8.8.8.8

# Traceroute IPv6
$ traceroute6 2001:4860:4860::8888
\`\`\`

**Difference avec Windows :** traceroute Linux utilise par defaut des paquets **UDP** (port croissant), tandis que tracert Windows utilise des paquets **ICMP Echo Request**.

### nslookup / dig / host

\`\`\`bash
# nslookup (disponible partout)
$ nslookup google.com
$ nslookup google.com 8.8.8.8

# dig (plus detaille, prefere sur Linux)
$ dig google.com
$ dig google.com +short        # Reponse courte
$ dig @8.8.8.8 google.com      # Serveur DNS specifique
$ dig google.com MX             # Enregistrements MX

# host (simple)
$ host google.com
\`\`\`

### arp et ip neighbor

\`\`\`bash
# Voir le cache ARP
$ arp -a                # macOS et Linux
$ ip neighbor show      # Linux moderne (equivalent de arp -a)

# Vider le cache ARP
$ sudo ip neighbor flush all   # Linux
$ sudo arp -d -a               # macOS
\`\`\`

### ss / netstat

\`\`\`bash
# ss (remplacement moderne de netstat sur Linux)
$ ss -tuln              # TCP + UDP, en ecoute, numerique
$ ss -tunap             # Avec le processus associe
$ ss -t state established  # Connexions TCP etablies

# netstat (legacy, disponible sur macOS)
$ netstat -an
$ netstat -tuln
\`\`\`

### Commandes supplementaires utiles

\`\`\`bash
# Table de routage
$ ip route              # Linux
$ netstat -rn           # macOS/Linux legacy
$ route -n              # Linux legacy

# DNS resolver
$ cat /etc/resolv.conf

# Interfaces reseau
$ nmcli device status   # NetworkManager (Linux desktop)
$ networksetup -listallhardwareports  # macOS
\`\`\`

> **Astuce CCNA :** Sur Linux, les commandes modernes sont \`ip addr\` (au lieu de \`ifconfig\`), \`ip route\` (au lieu de \`route\`), et \`ss\` (au lieu de \`netstat\`). Le CCNA attend que vous connaissiez les commandes de base sur les trois OS (Windows, Linux, macOS). La difference entre \`tracert\` (Windows, ICMP) et \`traceroute\` (Linux, UDP) est un piege classique.`
      },
      {
        title: 'Commandes Cisco IOS de verification',
        content: `Les commandes Cisco IOS de verification sont essentielles pour le diagnostic reseau au quotidien et au CCNA.

### show ip interface brief

La commande la plus utilisee — vue d'ensemble rapide de toutes les interfaces :

\`\`\`cisco
Router# show ip interface brief
Interface            IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0   192.168.1.1     YES manual up                    up
GigabitEthernet0/1   10.0.0.1        YES manual up                    up
Serial0/0/0          172.16.0.1      YES manual up                    up
Loopback0            1.1.1.1         YES manual up                    up
Vlan1                unassigned      YES unset  administratively down down
\`\`\`

### show ip route

Affiche la table de routage :

\`\`\`cisco
Router# show ip route
Codes: C - connected, S - static, R - RIP, O - OSPF, D - EIGRP
       B - BGP, L - local

Gateway of last resort is 10.0.0.254 to network 0.0.0.0

     10.0.0.0/8 is variably subnetted, 2 subnets
C       10.0.0.0/24 is directly connected, GigabitEthernet0/1
L       10.0.0.1/32 is directly connected, GigabitEthernet0/1
     192.168.1.0/24 is variably subnetted, 2 subnets
C       192.168.1.0/24 is directly connected, GigabitEthernet0/0
L       192.168.1.1/32 is directly connected, GigabitEthernet0/0
S    172.16.0.0/16 [1/0] via 10.0.0.2
S*   0.0.0.0/0 [1/0] via 10.0.0.254
\`\`\`

**Codes importants :**
- **C** : Connected — reseau directement connecte
- **L** : Local — adresse IP de l'interface elle-meme (/32)
- **S** : Static — route configuree manuellement
- **S*** : Static default route — route par defaut
- **O** : OSPF — route apprise par OSPF
- **D** : EIGRP — route apprise par EIGRP

### show arp / show ip arp

\`\`\`cisco
Router# show arp
Protocol  Address          Age (min)   Hardware Addr   Type   Interface
Internet  192.168.1.1             -    0050.0F00.0001  ARPA   Gi0/0
Internet  192.168.1.10            5    AAAA.AAAA.AAAA  ARPA   Gi0/0
Internet  192.168.1.20            3    BBBB.BBBB.BBBB  ARPA   Gi0/0
\`\`\`

- **Age "-"** : c'est l'interface du routeur lui-meme (pas de timer)
- **Age en minutes** : temps depuis la derniere mise a jour

### ping et traceroute

\`\`\`cisco
! Ping simple
Router# ping 192.168.1.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms

! Ping etendu (plus d'options)
Router# ping
Protocol [ip]:
Target IP address: 192.168.1.10
Repeat count [5]: 100
Datagram size [100]: 1500
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: 10.0.0.1

! Traceroute
Router# traceroute 192.168.1.10
\`\`\`

**Symboles du ping :**
- **!** : reponse recue (succes)
- **.** : timeout (pas de reponse)
- **U** : destination unreachable
- **Q** : source quench
- **M** : could not fragment

### show running-config

\`\`\`cisco
! Configuration complete
Router# show running-config

! Configuration d'une interface specifique
Router# show running-config interface GigabitEthernet0/0
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 duplex auto
 speed auto
 no shutdown
\`\`\`

> **Astuce CCNA :** Les commandes \`show\` sont le coeur du diagnostic Cisco. Memorisez : \`show ip interface brief\` (vue d'ensemble IP), \`show ip route\` (table de routage), \`show arp\` (table ARP), \`show running-config\` (configuration active). Pour le ping etendu, tapez juste \`ping\` sans argument pour acceder aux options avancees (choix de la source, taille, etc.).`
      },
      {
        title: 'Methodologie de test et recapitulatif',
        content: `### Sequence de test methodique

Pour diagnostiquer un probleme de connectivite, suivez cette sequence ordonnee (du local vers le distant) :

### Etape 1 : Tester la pile TCP/IP locale

\`\`\`cmd
C:\\> ping 127.0.0.1
\`\`\`
Si ca echoue : la pile TCP/IP du PC est cassee → reinstaller les drivers reseau.

### Etape 2 : Tester sa propre interface

\`\`\`cmd
C:\\> ping 192.168.1.10    (sa propre IP)
\`\`\`
Si ca echoue : probleme de configuration IP locale.

### Etape 3 : Tester la passerelle par defaut

\`\`\`cmd
C:\\> ping 192.168.1.1     (la passerelle/routeur)
\`\`\`
Si ca echoue : probleme de cable, VLAN, switch, ou la passerelle est down.

### Etape 4 : Tester un hote distant (par IP)

\`\`\`cmd
C:\\> ping 8.8.8.8         (serveur DNS Google)
\`\`\`
Si ca echoue : probleme de routage entre votre reseau et Internet.

### Etape 5 : Tester la resolution DNS

\`\`\`cmd
C:\\> ping google.com
\`\`\`
Si ca echoue mais que l'etape 4 fonctionne : probleme DNS (serveur DNS inaccessible ou mal configure).

### Tableau recapitulatif par etape

| Etape | Test | Echec = Probleme de... |
|-------|------|------------------------|
| 1 | ping 127.0.0.1 | Pile TCP/IP locale |
| 2 | ping sa propre IP | Configuration IP locale |
| 3 | ping passerelle | Cable, switch, VLAN, passerelle |
| 4 | ping IP distante | Routage, WAN, firewall |
| 5 | ping nom de domaine | DNS |

### Recapitulatif des commandes par OS

| Fonction | Windows | Linux | macOS | Cisco IOS |
|----------|---------|-------|-------|-----------|
| **Config IP** | ipconfig /all | ip addr | ifconfig | show ip interface brief |
| **Ping** | ping | ping | ping | ping |
| **Traceroute** | tracert | traceroute | traceroute | traceroute |
| **DNS** | nslookup | dig / nslookup | dig / nslookup | — |
| **ARP** | arp -a | ip neighbor | arp -a | show arp |
| **Ports** | netstat -an | ss -tuln | netstat -an | show tcp brief |
| **Routes** | route print | ip route | netstat -rn | show ip route |
| **Flush DNS** | ipconfig /flushdns | systemd-resolve --flush | sudo dscacheutil -flushcache | — |
| **Renouveler DHCP** | ipconfig /renew | sudo dhclient -r && dhclient | — | — |

### Commandes de diagnostic avancees sur Cisco IOS

\`\`\`cisco
! Voir les logs systeme
Router# show logging

! Activer le debug (attention en production !)
Router# debug ip icmp
Router# debug ip packet
Router# undebug all         ← Toujours desactiver apres !

! Voir les statistiques de l'interface
Router# show interfaces GigabitEthernet0/0 | include packets|errors|drops

! Voir les voisins CDP
Switch# show cdp neighbors detail

! Tester la connectivite depuis une interface specifique
Router# ping 10.0.0.1 source GigabitEthernet0/0
\`\`\`

### Points cles pour le CCNA

1. **Sequence de test** : loopback → propre IP → passerelle → IP distante → nom de domaine
2. **ipconfig** (Windows) vs **ip addr** (Linux) vs **ifconfig** (macOS/legacy)
3. **tracert** (Windows, ICMP) vs **traceroute** (Linux, UDP)
4. **arp -a** pour voir le cache ARP sur tous les OS
5. Sur Cisco : \`show ip interface brief\` est la premiere commande a connaitre
6. Le **ping etendu** Cisco permet de choisir la source, la taille et le nombre de paquets
7. Toujours verifier la **resolution DNS** separement de la connectivite IP

> **Astuce CCNA :** Le CCNA comporte de nombreuses questions de depannage. Retenez la sequence de test (du local vers le distant) et sachez interpreter les resultats. Si \`ping 8.8.8.8\` fonctionne mais pas \`ping google.com\`, le probleme est **DNS**, pas la connectivite. Si \`ping passerelle\` echoue, le probleme est **local** (cable, VLAN, configuration IP). Utilisez \`tracert\`/\`traceroute\` pour localiser ou le paquet s'arrete.`
      }
    ]
  },
  {
    id: 11,
    slug: 'virtualisation-fondamentaux',
    title: 'Fondamentaux de la virtualisation',
    subtitle: 'Comprendre les hyperviseurs, machines virtuelles, conteneurs et la virtualisation reseau',
    icon: 'Monitor',
    color: '#00e5a0',
    duration: '30 min',
    level: 'Debutant',
    videoId: 'YlrdJK6EbEM',
    sections: [
      {
        title: 'Introduction a la virtualisation',
        content: `La **virtualisation** est la technologie qui permet de creer des versions **virtuelles** (logicielles) de ressources materielles : serveurs, stockage, reseaux. Elle est devenue fondamentale dans les infrastructures IT modernes.

### Qu'est-ce que la virtualisation ?

Sans virtualisation, chaque serveur physique execute **un seul systeme d'exploitation** et **une seule application**. Cela entraine :
- **Sous-utilisation** : la plupart des serveurs n'utilisent que 10-15% de leur CPU
- **Cout eleve** : un serveur physique par application = beaucoup de materiel
- **Gaspillage energetique** : electricite et refroidissement pour des machines peu utilisees
- **Manque de flexibilite** : deployer un nouveau serveur prend des jours/semaines

Avec la virtualisation, un seul serveur physique peut executer **plusieurs machines virtuelles** (VM), chacune avec son propre OS et ses applications.

### Les benefices de la virtualisation

| Benefice | Description |
|----------|-------------|
| **Consolidation** | Plusieurs VM sur un seul serveur physique → moins de materiel |
| **Utilisation optimale** | CPU utilise a 60-80% au lieu de 10-15% |
| **Reduction des couts** | Moins de serveurs = moins d'espace, electricite, refroidissement |
| **Flexibilite** | Deployer une VM en quelques minutes (vs jours pour un serveur physique) |
| **Isolation** | Chaque VM est isolee — un crash dans une VM n'affecte pas les autres |
| **Portabilite** | Les VM peuvent etre deplacees entre serveurs physiques |
| **Snapshots** | Sauvegarder l'etat d'une VM a un instant T |
| **Haute disponibilite** | Migration en direct (live migration) sans interruption |
| **Test et dev** | Creer des environnements de test rapidement |

### Terminologie de base

| Terme | Definition |
|-------|-----------|
| **Hote (Host)** | Le serveur physique qui heberge les VM |
| **Invite (Guest)** | La machine virtuelle (VM) qui s'execute sur l'hote |
| **Hyperviseur** | Le logiciel qui cree et gere les VM |
| **VM (Virtual Machine)** | Instance virtuelle d'un ordinateur avec son propre OS |
| **vCPU** | CPU virtuel attribue a une VM |
| **vRAM** | Memoire virtuelle attribuee a une VM |
| **vNIC** | Carte reseau virtuelle d'une VM |
| **vDisk** | Disque virtuel d'une VM (fichier sur le stockage physique) |

### Virtualisation dans le contexte CCNA

Le CCNA 200-301 couvre la virtualisation sous l'angle **reseau** :
- Comment les VM communiquent entre elles et avec le reseau physique
- Les **virtual switches** (vSwitch) qui connectent les VM
- L'impact sur la conception reseau
- La **NFV** (Network Functions Virtualization)

> **Astuce CCNA :** Le CCNA ne vous demandera pas de configurer un hyperviseur, mais vous devez comprendre les **concepts** de virtualisation : hyperviseur Type 1 vs Type 2, avantages de la virtualisation, et comment les VM se connectent au reseau via des **vSwitches**. C'est un domaine relativement nouveau au CCNA 200-301.`
      },
      {
        title: 'Hyperviseurs Type 1 et Type 2',
        content: `L'**hyperviseur** est le logiciel qui cree une couche d'abstraction entre le materiel physique et les machines virtuelles. Il existe deux types d'hyperviseurs.

### Hyperviseur Type 1 (Bare-Metal)

L'hyperviseur Type 1 s'installe **directement sur le materiel** du serveur, sans systeme d'exploitation intermediaire. C'est la solution utilisee en **production** dans les data centers.

\`\`\`
[VM 1] [VM 2] [VM 3] [VM 4]
─────────────────────────────
    [Hyperviseur Type 1]
─────────────────────────────
    [Materiel physique]
\`\`\`

**Exemples d'hyperviseurs Type 1 :**

| Hyperviseur | Editeur | Usage |
|------------|---------|-------|
| **VMware ESXi** | VMware (Broadcom) | Data centers entreprise (leader du marche) |
| **Microsoft Hyper-V** | Microsoft | Environnements Windows Server |
| **KVM** | Open source (Red Hat) | Linux, cloud (utilise par AWS, Google Cloud) |
| **Citrix Hypervisor** (ex-XenServer) | Citrix | Data centers |

**Caracteristiques :**
- **Performances** : acces direct au materiel → performances optimales
- **Securite** : surface d'attaque reduite (pas d'OS general en dessous)
- **Scalabilite** : gere des centaines de VM par serveur
- **Fiabilite** : concu pour tourner 24/7 en production

### Hyperviseur Type 2 (Hosted)

L'hyperviseur Type 2 s'installe **sur un systeme d'exploitation existant** (Windows, macOS, Linux). C'est la solution utilisee pour le **test**, le **developpement** et l'**apprentissage**.

\`\`\`
[VM 1] [VM 2] [VM 3]
─────────────────────────
  [Hyperviseur Type 2]
─────────────────────────
  [Systeme d'exploitation hote (Windows, macOS)]
─────────────────────────
  [Materiel physique]
\`\`\`

**Exemples d'hyperviseurs Type 2 :**

| Hyperviseur | Editeur | Plateforme hote |
|------------|---------|-----------------|
| **VMware Workstation** | VMware | Windows, Linux |
| **VMware Fusion** | VMware | macOS |
| **Oracle VirtualBox** | Oracle | Windows, macOS, Linux (gratuit) |
| **Parallels Desktop** | Parallels | macOS |
| **QEMU** | Open source | Linux |

**Caracteristiques :**
- **Facilite d'installation** : s'installe comme une application normale
- **Performances** : overhead supplementaire (l'OS hote consomme des ressources)
- **Flexibilite** : ideal pour tester des OS, des labs reseau (GNS3, EVE-NG)
- **Pas pour la production** : performances insuffisantes pour des charges lourdes

### Comparaison Type 1 vs Type 2

| Critere | Type 1 (Bare-Metal) | Type 2 (Hosted) |
|---------|---------------------|-----------------|
| Installation | Sur le materiel directement | Sur un OS existant |
| Performances | Elevees (acces direct) | Moderees (overhead OS hote) |
| Usage | Production, data center | Test, dev, apprentissage |
| Exemples | ESXi, Hyper-V, KVM | VirtualBox, VMware Workstation |
| Securite | Plus securise | Moins securise (depend de l'OS hote) |
| Cout | Souvent payant (licences) | Souvent gratuit ou peu cher |
| Gestion | Console dediee (vCenter) | Interface graphique simple |

### Gestion des ressources

L'hyperviseur gere l'allocation des ressources physiques aux VM :

- **CPU** : chaque VM recoit un ou plusieurs vCPU. L'hyperviseur planifie leur execution sur les CPU physiques
- **Memoire** : chaque VM a une quantite de vRAM dediee. L'hyperviseur peut sur-allouer (overcommit)
- **Stockage** : les disques virtuels sont des fichiers sur le stockage physique (VMDK, VHD, QCOW2)
- **Reseau** : les vNIC sont connectees a des virtual switches

> **Astuce CCNA :** Pour le CCNA, retenez la difference principale : Type 1 = **directement sur le materiel** (production), Type 2 = **sur un OS hote** (test/dev). VMware ESXi et Microsoft Hyper-V sont les exemples Type 1 a connaitre. VirtualBox et VMware Workstation sont les exemples Type 2.`
      },
      {
        title: 'Virtual switches et connectivite reseau',
        content: `Les **virtual switches** (vSwitch) sont des switches logiciels qui permettent aux machines virtuelles de communiquer entre elles et avec le reseau physique.

### Qu'est-ce qu'un vSwitch ?

Un vSwitch fonctionne comme un switch physique Layer 2, mais entierement en logiciel. Il est integre dans l'hyperviseur.

\`\`\`
                    [Reseau physique]
                          |
                    [NIC physique]
                          |
                    [vSwitch]
                   /    |    \\
              [VM1]  [VM2]  [VM3]
              vNIC   vNIC   vNIC
\`\`\`

### Fonctionnalites du vSwitch

| Fonctionnalite | Description |
|----------------|-------------|
| **Commutation L2** | Forward les trames entre VM selon les adresses MAC |
| **VLAN tagging** | Support des VLANs (802.1Q) pour segmenter le trafic |
| **Port groups** | Groupes de ports avec des politiques communes |
| **Uplinks** | Liens vers les NIC physiques (vers le reseau externe) |
| **Traffic shaping** | Limitation de bande passante par VM |
| **Security policies** | Promiscuous mode, MAC changes, forged transmits |

### Types de vSwitch

| vSwitch | Editeur | Fonctionnalites |
|---------|---------|-----------------|
| **vSphere Standard Switch (vSS)** | VMware | Standard, gere par hote |
| **vSphere Distributed Switch (vDS)** | VMware | Gestion centralisee multi-hotes |
| **Open vSwitch (OVS)** | Open source | SDN-ready, OpenFlow support |
| **Hyper-V Virtual Switch** | Microsoft | Integre a Hyper-V |

### Modes de connectivite des VM

**1. Communication VM-to-VM (meme hote)**
Les VM sur le meme hote et le meme vSwitch communiquent **sans passer par le reseau physique**. Le trafic reste dans l'hyperviseur.

\`\`\`
[VM1] ←──vSwitch──→ [VM2]    (trafic interne, pas de NIC physique)
\`\`\`

**2. Communication VM-to-External**
Les VM communiquent avec le reseau physique via l'**uplink** du vSwitch (lie a une NIC physique).

\`\`\`
[VM1] ──→ [vSwitch] ──→ [NIC physique] ──→ [Switch physique] ──→ [Reseau]
\`\`\`

**3. Communication VM-to-VM (hotes differents)**
Les VM sur des hotes differents communiquent via le reseau physique.

\`\`\`
[VM1] ──→ [vSwitch] ──→ [NIC] ══> [Reseau physique] ══> [NIC] ──→ [vSwitch] ──→ [VM2]
  Hote A                                                                Hote B
\`\`\`

### VLANs avec les vSwitches

Les vSwitches supportent les **VLANs** pour segmenter le trafic des VM :

\`\`\`
[VM Web VLAN 10] ──┐
[VM App VLAN 20] ──┤── [vSwitch] ══trunk══> [Switch physique]
[VM DB  VLAN 30] ──┘        802.1Q tags
\`\`\`

Le lien entre le vSwitch et le switch physique est configure en **trunk** pour transporter plusieurs VLANs.

### Impact sur la conception reseau

La virtualisation change la conception reseau :

| Aspect | Avant (physique) | Apres (virtualise) |
|--------|-----------------|-------------------|
| **Visibilite** | Tout le trafic passe par les switches physiques | Le trafic VM-to-VM est invisible pour les switches physiques |
| **Securite** | Firewall physique entre serveurs | Firewall virtuel entre VM |
| **Monitoring** | SPAN/mirror sur switch physique | Monitoring au niveau du vSwitch |
| **Migration** | Deplacer un serveur = recabler | Live migration = pas de changement reseau |

> **Astuce CCNA :** Pour le CCNA, comprenez que les VM se connectent au reseau via des **vSwitches** dans l'hyperviseur, et que le lien entre le vSwitch et le switch physique est souvent un **trunk 802.1Q**. Le trafic entre deux VM sur le meme hote ne passe **jamais** par le switch physique — c'est un point important pour le monitoring et la securite.`
      },
      {
        title: 'Conteneurs, NFV et resume',
        content: `### Conteneurs vs Machines Virtuelles

Les **conteneurs** sont une alternative aux VM. Au lieu de virtualiser le **materiel complet** (CPU, RAM, stockage), les conteneurs virtualisent uniquement le **systeme d'exploitation**.

### Architecture comparee

\`\`\`
Machines Virtuelles :                  Conteneurs :
[App A] [App B] [App C]               [App A] [App B] [App C]
[Bins/Libs] [Bins/Libs] [Bins/Libs]    [Bins/Libs] [Bins/Libs] [Bins/Libs]
[Guest OS] [Guest OS] [Guest OS]       ─────────────────────────────
──────────────────────────────         [Container Engine (Docker)]
[Hyperviseur]                          ──────────────────────────────
──────────────────────────────         [Systeme d'exploitation hote]
[Materiel physique]                    ──────────────────────────────
                                       [Materiel physique]
\`\`\`

### Comparaison VM vs Conteneurs

| Critere | Machine Virtuelle | Conteneur |
|---------|-------------------|-----------|
| **Virtualise** | Materiel complet (hardware) | Systeme d'exploitation |
| **OS** | Chaque VM a son propre OS complet | Partage le noyau de l'OS hote |
| **Taille** | Gigaoctets (OS + apps) | Megaoctets (apps + deps seulement) |
| **Demarrage** | Minutes | Secondes |
| **Isolation** | Forte (OS separes) | Moderee (noyau partage) |
| **Performances** | Overhead hyperviseur | Quasi-natif |
| **Portabilite** | Fichier VM (VMDK, VHD) | Image Docker |
| **Densite** | ~10-50 VM par serveur | ~100-1000 conteneurs par serveur |
| **Usage** | Applications legacy, OS differents | Microservices, DevOps, CI/CD |

**Exemples de technologies de conteneurs :**
- **Docker** : la plateforme de conteneurs la plus populaire
- **Kubernetes** (K8s) : orchestration de conteneurs a grande echelle
- **Podman** : alternative open source a Docker

### NFV (Network Functions Virtualization)

La **NFV** consiste a virtualiser les **fonctions reseau** qui etaient traditionnellement executees sur du materiel dedie.

| Fonction reseau | Materiel dedie | Equivalent NFV |
|----------------|---------------|----------------|
| **Routeur** | Cisco ISR, ASR | CSR 1000v, VyOS |
| **Firewall** | Cisco ASA, Palo Alto | Cisco ASAv, pfSense VM |
| **Load Balancer** | F5 BIG-IP | F5 BIG-IP VE, HAProxy |
| **WAN Optimizer** | Cisco WAAS | Riverbed SteelHead VCX |
| **IDS/IPS** | Cisco Firepower | Snort VM, Suricata |

### Avantages de la NFV

| Avantage | Description |
|----------|-------------|
| **Reduction des couts** | Pas de materiel dedie → serveurs x86 standards |
| **Agilite** | Deployer une nouvelle fonction reseau en minutes |
| **Scalabilite** | Ajouter des instances a la demande |
| **Flexibilite** | Tester de nouvelles configurations sans risque |
| **Espace** | Moins de materiel physique dans le rack |

### VNF (Virtual Network Function)

Un **VNF** est une fonction reseau virtualisee (routeur virtuel, firewall virtuel, etc.). Plusieurs VNF peuvent etre chaines pour creer un service reseau complet :

\`\`\`
[Trafic entrant] → [vFirewall] → [vRouter] → [vLoad Balancer] → [Serveurs]
                    VNF 1         VNF 2       VNF 3

              ← Service Function Chaining (SFC) →
\`\`\`

### Resume du chapitre virtualisation

| Concept | Description | A retenir |
|---------|-------------|-----------|
| **Hyperviseur Type 1** | Sur le materiel directement | Production (ESXi, Hyper-V, KVM) |
| **Hyperviseur Type 2** | Sur un OS hote | Test/dev (VirtualBox, Workstation) |
| **VM** | Machine complete virtualisee | OS complet, isolation forte |
| **Conteneur** | Application isolee, OS partage | Leger, rapide, Docker/K8s |
| **vSwitch** | Switch logiciel dans l'hyperviseur | Connecte les VM au reseau |
| **NFV** | Fonctions reseau virtualisees | Routeur/firewall en VM |
| **VNF** | Instance d'une fonction reseau virtuelle | Ex: vFirewall, vRouter |

> **Astuce CCNA :** Pour le CCNA 200-301, retenez les differences cles : **VM = virtualise le hardware** (hyperviseur), **conteneur = virtualise l'OS** (Docker). Les hyperviseurs Type 1 sont pour la **production**, Type 2 pour le **test**. La **NFV** permet de remplacer du materiel reseau dedie par des VM sur des serveurs standards. Ces concepts sont evalues au CCNA mais de maniere conceptuelle — pas de configuration requise.`
      }
    ]
  }
]
