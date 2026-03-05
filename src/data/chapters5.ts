import type { Chapter } from './chapters'

export const chapters5: Chapter[] = [
  {
    id: 37,
    slug: 'principes-wifi',
    title: 'Principes fondamentaux du Wi-Fi',
    subtitle: 'Standards 802.11, frequences, canaux et mecanismes radio',
    icon: 'Wifi',
    color: '#8b5cf6',
    duration: '45 min',
    level: 'Debutant',
    videoId: '2DP98pTprr4',
    sections: [
      {
        title: 'Introduction au Wi-Fi et standards 802.11',
        content: `Le **Wi-Fi** (Wireless Fidelity) est une technologie de reseau local sans fil basee sur la famille de normes **IEEE 802.11**. Depuis sa premiere version en 1997, le Wi-Fi a evolue considerablement en termes de debit, portee et fiabilite.

### Evolution des standards 802.11

| Standard | Nom commercial | Annee | Frequence | Debit max | Largeur canal |
|----------|---------------|-------|-----------|-----------|---------------|
| 802.11a | — | 1999 | 5 GHz | 54 Mbps | 20 MHz |
| 802.11b | — | 1999 | 2.4 GHz | 11 Mbps | 22 MHz |
| 802.11g | — | 2003 | 2.4 GHz | 54 Mbps | 20 MHz |
| 802.11n | **Wi-Fi 4** | 2009 | 2.4 / 5 GHz | 600 Mbps | 20 / 40 MHz |
| 802.11ac | **Wi-Fi 5** | 2013 | 5 GHz | 6.93 Gbps | 20 / 40 / 80 / 160 MHz |
| 802.11ax | **Wi-Fi 6/6E** | 2020 | 2.4 / 5 / 6 GHz | 9.6 Gbps | 20 / 40 / 80 / 160 MHz |

### Points cles pour le CCNA

- **Wi-Fi 4 (802.11n)** est le premier standard a supporter le **MIMO** (Multiple Input Multiple Output) avec jusqu'a 4 flux spatiaux et les deux bandes de frequences
- **Wi-Fi 5 (802.11ac)** introduit le **MU-MIMO** (Multi-User MIMO) en downlink, les canaux de 80 et 160 MHz, et le **beamforming** obligatoire
- **Wi-Fi 6 (802.11ax)** apporte l'**OFDMA** (Orthogonal Frequency-Division Multiple Access) qui permet de servir plusieurs clients simultanement sur un meme canal, ainsi que le **BSS Coloring** pour reduire les interferences entre AP voisins
- **Wi-Fi 6E** etend le Wi-Fi 6 a la **bande 6 GHz** (5.925 - 7.125 GHz), offrant jusqu'a 14 canaux supplementaires de 80 MHz

> **Astuce CCNA :** Retenez la correspondance entre les numeros de standard et les noms commerciaux. L'examen utilise les deux notations. Wi-Fi 4 = 802.11n, Wi-Fi 5 = 802.11ac, Wi-Fi 6 = 802.11ax.`
      },
      {
        title: 'Bandes de frequences et canaux',
        content: `### Les trois bandes de frequences Wi-Fi

**Bande 2.4 GHz (2.400 - 2.4835 GHz)**
- **14 canaux** disponibles (13 en Europe, 11 en Amerique du Nord)
- Chaque canal occupe **22 MHz** de largeur
- Seulement **3 canaux non chevauchants** : **1, 6 et 11**
- Meilleure **portee** et **penetration** des murs
- Plus sujette aux **interferences** (micro-ondes, Bluetooth, ZigBee)

**Bande 5 GHz (5.150 - 5.825 GHz)**
- **25 canaux** non chevauchants (en 20 MHz)
- Moins d'interferences, plus de canaux disponibles
- Portee plus courte, moins bonne penetration des obstacles
- Certains canaux necessitent le **DFS** (Dynamic Frequency Selection) pour eviter les radars

**Bande 6 GHz (5.925 - 7.125 GHz)** — Wi-Fi 6E
- Jusqu'a **59 canaux** de 20 MHz ou **14 canaux** de 80 MHz
- Aucune cohabitation avec les anciens standards → environnement "propre"
- Portee encore plus courte que le 5 GHz

### Largeur de canal et impact

| Largeur | Debit | Canaux disponibles (5 GHz) | Usage |
|---------|-------|-----------------------------|-------|
| 20 MHz | Standard | 25 | Haute densite, entreprise |
| 40 MHz | x2 | 12 | Usage general |
| 80 MHz | x4 | 6 | Haut debit |
| 160 MHz | x8 | 2 | Tres haut debit, peu pratique |

> **Conseil pratique :** En environnement dense (bureaux, amphitheatres), privilegiez des canaux de **20 MHz** pour maximiser le nombre de canaux non chevauchants. En environnement residentiel, des canaux de **40 ou 80 MHz** sont acceptables.

### Planification des canaux en 2.4 GHz

\`\`\`
Canal 1         Canal 6         Canal 11
[-----22MHz-----]
                [-----22MHz-----]
                                [-----22MHz-----]
\`\`\`

Les canaux 1, 6 et 11 sont espaces de 25 MHz, ce qui evite tout chevauchement. Utiliser des canaux intermediaires (2, 3, 4, 5, etc.) provoque des **interferences de canal adjacent** (CCI - Co-Channel Interference).`
      },
      {
        title: 'CSMA/CA et acces au medium',
        content: `### Le probleme de l'acces partage

En Wi-Fi, toutes les stations partagent le meme **medium radio** (l'air). Contrairement a Ethernet qui utilise **CSMA/CD** (Collision Detection), le Wi-Fi ne peut pas detecter les collisions pendant la transmission car une station ne peut pas emettre et ecouter simultanement sur le meme canal.

### CSMA/CA — Carrier Sense Multiple Access / Collision Avoidance

Le Wi-Fi utilise donc **CSMA/CA** qui **evite** les collisions plutot que de les detecter :

1. **Carrier Sense** : la station ecoute le medium
2. Si le medium est **libre** → attente d'un delai **DIFS** (DCF Interframe Spacing)
3. **Backoff aleatoire** : attente d'un temps aleatoire supplementaire
4. Si le medium est toujours libre → **transmission**
5. Attente de l'**ACK** de l'AP (acknowledgment)
6. Si pas d'ACK → **retransmission** avec backoff double

\`\`\`
Station A veut emettre :

[Ecoute] → Medium libre ? → [DIFS] → [Backoff aleatoire] → [Transmission] → [SIFS] → [ACK]
                                                                                       ↑
                                                                                  Recu de l'AP
\`\`\`

### Le probleme du noeud cache (Hidden Node)

Deux stations peuvent ne pas se "voir" mutuellement tout en etant toutes les deux a portee de l'AP. Elles ne detectent pas la transmission de l'autre → collision a l'AP.

**Solution : RTS/CTS** (Request to Send / Clear to Send) :
1. La station envoie un **RTS** a l'AP
2. L'AP repond avec un **CTS** (recu par toutes les stations)
3. Les autres stations savent qu'elles doivent attendre
4. La station transmet ses donnees

> **A retenir pour le CCNA :** CSMA/CA est le mecanisme d'acces au medium en Wi-Fi. Il fonctionne en mode **half-duplex** — une seule station peut emettre a la fois sur un canal donne. C'est pourquoi plus il y a de clients sur un AP, plus les performances se degradent.

### Comparaison CSMA/CD vs CSMA/CA

| Critere | CSMA/CD (Ethernet) | CSMA/CA (Wi-Fi) |
|---------|--------------------|-----------------|
| Detection collision | Oui (pendant TX) | Non |
| Evitement collision | Non | Oui (backoff) |
| ACK obligatoire | Non | Oui |
| Duplex | Full-duplex | Half-duplex |
| Environnement | Filaire | Sans fil |`
      },
      {
        title: 'Topologies wireless : BSS, ESS et IBSS',
        content: `### BSS — Basic Service Set

Un **BSS** est la cellule de base du Wi-Fi. Il se compose d'un **AP** (Access Point) et de l'ensemble des clients qui y sont associes. Chaque BSS est identifie par un **BSSID** qui correspond generalement a l'adresse MAC de l'interface radio de l'AP.

\`\`\`
        [AP]  ← BSSID: AA:BB:CC:DD:EE:FF
       / | \\
      /  |  \\
   [PC] [Tel] [Tab]

   BSS = 1 AP + ses clients
   SSID = "MonReseau" (nom visible)
   BSSID = MAC de l'AP
\`\`\`

### ESS — Extended Service Set

Un **ESS** est un ensemble de **plusieurs BSS** relies par un systeme de distribution (DS), generalement un reseau Ethernet. Tous les BSS d'un ESS partagent le meme **SSID**, ce qui permet aux clients de se deplacer d'un AP a l'autre (roaming).

\`\`\`
   [AP1]----[Switch]----[AP2]----[Switch]----[AP3]
   BSS1                  BSS2                 BSS3

   SSID: "Entreprise-WiFi" (identique sur les 3 AP)
   BSSID: different pour chaque AP
\`\`\`

Le **roaming** (itinerance) permet a un client de changer de BSS de maniere transparente. Le client detecte que le signal de l'AP actuel faiblit et s'associe a un AP avec un meilleur signal.

### IBSS — Independent Basic Service Set (Ad-hoc)

Un **IBSS** est un reseau Wi-Fi **sans AP** ou les stations communiquent directement entre elles. Ce mode est rarement utilise en entreprise.

\`\`\`
   [PC1] ←→ [PC2]
     ↕         ↕
   [PC3] ←→ [PC4]

   Pas d'AP, communication directe
\`\`\`

### SSID — Service Set Identifier

Le **SSID** est le nom du reseau Wi-Fi visible par les clients. Caracteristiques :
- Chaine de **0 a 32 caracteres**
- Peut etre **diffuse** (visible dans la liste des reseaux) ou **masque** (hidden SSID)
- Masquer le SSID n'est **PAS** une mesure de securite efficace — il est toujours visible dans les trames Probe Response

> **Bonne pratique :** Utilisez des SSID explicites en entreprise (ex: "Corp-WiFi", "Guest-WiFi") et ne comptez jamais sur le masquage du SSID comme seule protection.`
      },
      {
        title: 'Fondamentaux RF : signal, interference et couverture',
        content: `### Puissance du signal et unites

La puissance d'un signal Wi-Fi se mesure en **dBm** (decibels par rapport a un milliwatt). C'est une echelle **logarithmique** :

| dBm | Qualite | Description |
|-----|---------|-------------|
| -30 dBm | Excellent | Tres proche de l'AP |
| -50 dBm | Tres bon | Signal fort |
| -67 dBm | Bon | Minimum pour VoIP et streaming |
| -70 dBm | Acceptable | Navigation web, email |
| -80 dBm | Faible | Connexion instable |
| -90 dBm | Inutilisable | Deconnexions frequentes |

### Regles des 3 dB et 10 dB

- **+3 dB** = puissance **doublee**
- **-3 dB** = puissance **divisee par 2**
- **+10 dB** = puissance **multipliee par 10**
- **-10 dB** = puissance **divisee par 10**

**Exemple :** Un AP emet a 20 dBm (100 mW). Avec une antenne de gain +3 dBi, la puissance effective est de 23 dBm (200 mW).

### Sources d'interference

| Source | Bande affectee | Impact |
|--------|---------------|--------|
| **Micro-ondes** | 2.4 GHz | Fort (meme frequence) |
| **Bluetooth** | 2.4 GHz | Modere (frequency hopping) |
| **Autres AP Wi-Fi** | 2.4 / 5 GHz | Co-channel et adjacent channel |
| **Murs en beton** | Toutes | Attenuation forte du signal |
| **Surfaces metalliques** | Toutes | Reflexion et attenuation |
| **Eau (corps humain)** | Toutes | Absorption du signal |

### SNR — Signal to Noise Ratio

Le **SNR** (rapport signal/bruit) mesure la difference entre le signal utile et le bruit ambiant. Plus le SNR est eleve, meilleure est la qualite de la connexion.

\`\`\`
SNR = Signal (dBm) - Bruit (dBm)

Exemple : Signal = -60 dBm, Bruit = -90 dBm
SNR = -60 - (-90) = 30 dB → Tres bon
\`\`\`

| SNR | Qualite |
|-----|---------|
| > 40 dB | Excellent |
| 25-40 dB | Tres bon |
| 15-25 dB | Acceptable |
| < 15 dB | Mauvais |

> **Astuce CCNA :** L'examen peut vous demander de calculer un SNR ou d'interpreter des valeurs de puissance en dBm. Retenez que -67 dBm est le seuil minimum recommande pour la VoIP.`
      },
      {
        title: 'Types d\'antennes Wi-Fi',
        content: `### Antennes omnidirectionnelles

Une antenne **omnidirectionnelle** diffuse le signal dans toutes les directions sur le plan horizontal (360 degres), comme une ampoule qui eclaire dans toutes les directions.

**Caracteristiques :**
- Diagramme de rayonnement en forme de **donut** (tore)
- Gain typique : **2 a 5 dBi**
- Couverture uniforme autour de l'antenne
- Utilisee dans la majorite des **AP d'interieur**

\`\`\`
Vue de dessus (plan horizontal) :
        N
    ----+----
   /    |    \\
  |     |     |   Signal egal
  |   [AP]    |   dans toutes
  |     |     |   les directions
   \\    |    /
    ----+----
        S
\`\`\`

### Antennes directionnelles

Une antenne **directionnelle** concentre le signal dans une direction specifique, comme une lampe torche.

**Types courants :**

| Type | Angle | Gain | Usage |
|------|-------|------|-------|
| **Patch (panneau)** | 60-90° | 6-10 dBi | Couloirs, zones ciblees |
| **Yagi** | 30-60° | 10-14 dBi | Liaisons point-a-point courtes |
| **Parabolique** | 5-15° | 20-30 dBi | Liaisons point-a-point longue distance |

### EIRP — Effective Isotropic Radiated Power

L'**EIRP** est la puissance reellement rayonnee, tenant compte de la puissance de l'emetteur, du gain de l'antenne et des pertes dans les cables :

\`\`\`
EIRP (dBm) = Puissance TX (dBm) + Gain antenne (dBi) - Pertes cable (dB)

Exemple :
  Puissance TX = 20 dBm
  Gain antenne = 6 dBi
  Pertes cable = 2 dB
  EIRP = 20 + 6 - 2 = 24 dBm
\`\`\`

### Choix de l'antenne selon le scenario

| Scenario | Antenne recommandee | Justification |
|----------|-------------------|---------------|
| Bureau open space | Omnidirectionnelle | Couverture 360° |
| Couloir etroit | Directionnelle (patch) | Signal concentre le long du couloir |
| Entrepot vaste | Omnidirectionnelle haute puissance | Grande zone a couvrir |
| Liaison batiment a batiment | Directionnelle (Yagi/Parabolique) | Signal concentre entre 2 points |
| Stade / auditorium | Directionnelle sectorielle | Couverture d'une zone precise |

> **A retenir :** Le gain d'une antenne directionnelle ne signifie pas plus de puissance totale. Il **concentre** la puissance dans une direction, au detriment des autres directions. C'est comme passer d'une ampoule a une lampe torche : meme energie, mais focalisee.`
      }
    ]
  },
  {
    id: 38,
    slug: 'architectures-wireless',
    title: 'Architectures wireless Cisco',
    subtitle: 'Autonomous, CAPWAP, FlexConnect et controleurs WLC',
    icon: 'Radio',
    color: '#8b5cf6',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: '8M08eB1jgwc',
    sections: [
      {
        title: 'Vue d\'ensemble des architectures wireless',
        content: `En reseau d'entreprise, le Wi-Fi peut etre deploye selon differentes architectures. Chacune offre un compromis entre **simplicite**, **centralisation** et **scalabilite**.

### Les 3 grandes architectures

| Architecture | Gestion | Scalabilite | Cout initial |
|-------------|---------|-------------|--------------|
| **Autonomous AP** | Locale (par AP) | Faible | Faible |
| **Cloud-based** | Cloud | Moyenne | Moyen (abonnement) |
| **Controller-based (CAPWAP)** | Centralisee (WLC) | Elevee | Eleve |

### Architecture Autonomous (Standalone)

Chaque AP fonctionne **independamment**. Il gere lui-meme :
- La configuration SSID et securite
- L'association des clients
- Le routage/bridging du trafic
- Les politiques QoS

\`\`\`
[AP1]---[Switch]---[Routeur]---Internet
[AP2]---[Switch]
[AP3]---[Switch]

Chaque AP est configure individuellement
\`\`\`

**Avantages :** Simple pour les petits reseaux (< 5 AP), pas de point de defaillance unique.

**Inconvenients :** Ingerable au-dela de quelques AP. Chaque AP doit etre configure manuellement. Pas de vue globale du reseau, pas de roaming optimise.

### Architecture Cloud-based (ex: Cisco Meraki)

Les AP sont geres depuis une **plateforme cloud**. La configuration, le monitoring et les mises a jour se font via un **dashboard web**.

**Avantages :** Gestion centralisee sans infrastructure sur site, mises a jour automatiques, visibilite globale, deploiement rapide.

**Inconvenients :** Dependance a Internet pour la gestion, abonnement recurrent (licence par AP), le trafic de donnees ne transite PAS par le cloud (traitement local).

> **A retenir :** Avec Cisco Meraki, seul le **trafic de management** passe par le cloud. Le trafic des utilisateurs est traite **localement** par les AP. Si Internet tombe, les AP continuent de fonctionner avec leur derniere configuration.`
      },
      {
        title: 'Architecture Split-MAC et CAPWAP',
        content: `### Le concept Split-MAC

Dans une architecture **Split-MAC** (ou Lightweight), les fonctions du Wi-Fi sont **reparties** entre l'AP et un controleur centralise (WLC — Wireless LAN Controller) :

| Fonction | AP (temps reel) | WLC (gestion) |
|----------|----------------|---------------|
| Transmission/reception radio | Oui | Non |
| Chiffrement/dechiffrement trafic | Oui | Non |
| Envoi de beacons et probe responses | Oui | Non |
| Association/authentification clients | Non | Oui |
| Gestion SSID et securite | Non | Oui |
| Attribution de canaux | Non | Oui |
| Gestion de puissance TX | Non | Oui |
| Roaming entre AP | Non | Oui |
| QoS et politiques | Non | Oui |

### CAPWAP — Control and Provisioning of Wireless Access Points

**CAPWAP** (RFC 5415) est le protocole standard qui relie les AP au WLC. Il cree **deux tunnels** entre chaque AP et le controleur :

| Tunnel | Port UDP | Contenu | Chiffrement |
|--------|----------|---------|-------------|
| **Control** | **5246** | Management, config, firmware | **DTLS obligatoire** |
| **Data** | **5247** | Trafic des clients (802.11) | DTLS optionnel |

\`\`\`
[AP1] ===== Tunnel CAPWAP Control (UDP 5246) =====> [WLC]
      ===== Tunnel CAPWAP Data (UDP 5247)    =====>

[AP2] ===== Tunnel CAPWAP Control (UDP 5246) =====> [WLC]
      ===== Tunnel CAPWAP Data (UDP 5247)    =====>

[AP3] ===== Tunnel CAPWAP Control (UDP 5246) =====> [WLC]
      ===== Tunnel CAPWAP Data (UDP 5247)    =====>
\`\`\`

### Processus de decouverte et join d'un AP

Quand un AP Lightweight demarre, il doit trouver un WLC. Le processus suit ces etapes :

1. **L'AP obtient une adresse IP** (DHCP ou statique)
2. **Decouverte du WLC** par plusieurs methodes (dans l'ordre) :
   - Option DHCP 43 (adresse IP du WLC)
   - DNS : resolution de \`CISCO-CAPWAP-CONTROLLER.domaine.local\`
   - Broadcast sur le sous-reseau local
   - WLC configure en dur (statiquement) sur l'AP
3. L'AP envoie des **Discovery Requests** aux WLC trouves
4. Les WLC repondent avec des **Discovery Responses**
5. L'AP choisit le WLC (priorite, charge, precedent)
6. **Join Request/Response** → tunnel CAPWAP etabli
7. Le WLC envoie la **configuration** et le **firmware** a l'AP

> **Point CCNA important :** Les ports UDP **5246** (control) et **5247** (data) doivent etre autorises sur tous les firewalls et ACL entre les AP et le WLC. Si ces ports sont bloques, les AP ne pourront pas joindre le controleur.`
      },
      {
        title: 'Le Wireless LAN Controller (WLC)',
        content: `### Role du WLC

Le **WLC** (Wireless LAN Controller) est le cerveau de l'infrastructure wireless en architecture Split-MAC. Il centralise la gestion de tous les AP et offre une vue unifiee du reseau sans fil.

### Fonctions principales du WLC

- **Gestion centralisee** : configuration SSID, securite, VLAN, QoS
- **RRM** (Radio Resource Management) : ajustement automatique des canaux et de la puissance
- **Roaming** : gestion du handoff entre AP (Layer 2 et Layer 3)
- **Securite** : detection de rogue AP, IDS/IPS wireless
- **Load balancing** : repartition des clients entre AP
- **Guest access** : portail captif pour les visiteurs
- **Firmware management** : mise a jour centralisee des AP

### Modeles de WLC Cisco

| Modele | Type | Nb AP max | Usage |
|--------|------|-----------|-------|
| **Cisco 3504** | Appliance physique | 150 | PME |
| **Cisco 5520** | Appliance physique | 1500 | Entreprise |
| **Cisco 8540** | Appliance physique | 6000 | Grande entreprise |
| **vWLC** | Virtuel (VM) | 200 | Lab / petits sites |
| **Catalyst 9800** | Physique/VM/Cloud | 6000+ | Nouvelle generation |
| **Embedded WLC** | Integre dans un switch Catalyst | 100 | PME |

### Haute disponibilite du WLC

Pour eviter un point de defaillance unique, les WLC supportent plusieurs modes de HA :

- **SSO** (Stateful Switchover) : un WLC actif + un WLC standby synchronise en temps reel. Basculement en moins de 1 seconde, les clients ne sont pas deconnectes
- **N+1** : plusieurs WLC, chacun est le backup de l'autre. En cas de panne, les AP rejoignent un WLC de secours (les clients sont brievement deconnectes)

\`\`\`
Architecture SSO :

[AP1]--+                    +--[WLC Actif]
[AP2]--+----- Reseau -------+
[AP3]--+                    +--[WLC Standby]

Les deux WLC partagent la meme IP virtuelle
Basculement transparent pour les clients
\`\`\`

> **A retenir :** Le Cisco Catalyst 9800 est la plateforme WLC de nouvelle generation recommandee par Cisco. Il fonctionne sur IOS-XE et est disponible en version physique (appliance), virtuelle (VM) et cloud (AWS/Azure).`
      },
      {
        title: 'FlexConnect : le meilleur des deux mondes',
        content: `### Pourquoi FlexConnect ?

Dans une architecture CAPWAP classique, **tout le trafic client** transite via le tunnel CAPWAP Data jusqu'au WLC avant d'etre route. Cela pose probleme pour les sites distants connectes par un WAN a bande passante limitee.

**FlexConnect** (anciennement H-REAP) permet aux AP de **commuter le trafic localement** au niveau du site distant, tout en restant geres par un WLC centralise.

### Modes de fonctionnement FlexConnect

| Mode | Trafic donnees | Trafic management | Scenario |
|------|---------------|-------------------|----------|
| **Central Switching** | Via WLC (tunnel CAPWAP) | Via WLC | Defaut, comme un AP classique |
| **Local Switching** | Local (switch directement) | Via WLC | Sites distants, trafic local |

\`\`\`
Architecture classique CAPWAP :
[Site distant]                          [Site central]
  [AP]--Tunnel CAPWAP Data--------→ [WLC]→[Serveurs]
  [Client navigue sur Internet]      ↓
                                  [Internet]
  Le trafic fait un aller-retour inutile via le WAN !

Architecture FlexConnect (Local Switching) :
[Site distant]                          [Site central]
  [AP]--Tunnel CAPWAP Control------→ [WLC] (management uniquement)
  [Client]→[AP]→[Switch local]→[Internet local]
  Le trafic est commute localement !
\`\`\`

### Comportement en cas de perte de connexion avec le WLC

C'est l'un des grands avantages de FlexConnect : si le lien WAN vers le WLC tombe, l'AP continue de fonctionner en mode **Standalone** :

| Fonctionnalite | WLC accessible | WLC inaccessible |
|---------------|----------------|-------------------|
| Clients deja connectes | Maintenus | Maintenus |
| Nouveaux clients (Open/WPA-PSK) | Oui | Oui |
| Nouveaux clients (WPA-Enterprise) | Oui | Non (pas de RADIUS) |
| Roaming | Oui | Limite (local) |
| Configuration SSID | Via WLC | Derniere config en cache |

### Configuration typique FlexConnect

\`\`\`
Sur le WLC (GUI ou CLI) :
1. Definir le mode de l'AP : FlexConnect
2. Pour chaque WLAN :
   - Activer "FlexConnect Local Switching"
   - Mapper le VLAN local (ex: VLAN 10 du site distant)
3. Configurer le FlexConnect Group (optionnel) :
   - RADIUS server local pour l'authentification
   - ACL locales
\`\`\`

> **Astuce CCNA :** FlexConnect est la solution recommandee par Cisco pour les **sites distants** (branch offices) qui ont un nombre limite d'AP et un lien WAN vers le datacenter central ou se trouve le WLC. Le trafic est traite localement, seul le management transite sur le WAN.`
      },
      {
        title: 'Comparaison des architectures et cas d\'usage',
        content: `### Tableau comparatif complet

| Critere | Autonomous | Cloud (Meraki) | CAPWAP (WLC) | FlexConnect |
|---------|-----------|----------------|--------------|-------------|
| Gestion | Par AP | Dashboard cloud | WLC centralise | WLC centralise |
| Trafic donnees | Local | Local | Via WLC | Local ou via WLC |
| Scalabilite | < 5 AP | < 500 AP | < 6000 AP | < 100 AP/site |
| Cout | Faible | Licence/AP/an | WLC + licence | WLC + licence |
| Resilience WAN | N/A | Oui (cache local) | Non | Oui (mode standalone) |
| RRM automatique | Non | Oui | Oui | Oui |
| Roaming optimise | Non | Oui | Oui | Partiel |
| Guest portal | Manuel par AP | Oui (cloud) | Oui (WLC) | Oui (WLC) |

### Cas d'usage recommandes

**Autonomous AP :**
- Tres petits sites (cafe, petit commerce)
- Budget tres limite
- Pas besoin de roaming ou de gestion centralisee

**Cloud-based (Meraki) :**
- Entreprise multi-sites sans equipe IT locale
- Deploiement rapide requis
- Budget operationnel (OPEX) prefere au capital (CAPEX)

**CAPWAP avec WLC :**
- Campus d'entreprise avec de nombreux AP
- Besoin de roaming rapide (VoIP, video)
- Securite avancee (802.1X, NAC, IDS wireless)
- Equipe IT dediee pour gerer le WLC

**FlexConnect :**
- Sites distants (bureaux regionaux, agences)
- Lien WAN vers le datacenter central
- Besoin de resilience si le WAN tombe

### La tendance Cisco DNA Center / Catalyst Center

Cisco evolue vers une gestion **intent-based** (IBN) avec **Cisco Catalyst Center** (anciennement DNA Center). Cette plateforme centralise la gestion du reseau filaire ET wireless :

- **Assurance** : monitoring proactif, IA pour la detection d'anomalies
- **Automation** : templates de configuration, provisioning zero-touch
- **Policy** : segmentation basee sur les identites (SD-Access)
- **Analytics** : dashboards, rapports, tendances

> **Pour le CCNA :** Retenez les concepts cles de chaque architecture et leurs cas d'usage. L'examen attend que vous sachiez recommander la bonne architecture selon un scenario donne. CAPWAP avec ses deux tunnels (UDP 5246/5247) est un sujet particulierement important.`
      }
    ]
  },
  {
    id: 39,
    slug: 'infrastructure-wlan',
    title: 'Infrastructure physique WLAN',
    subtitle: 'Types d\'AP, placement, PoE et modes de fonctionnement',
    icon: 'Router',
    color: '#8b5cf6',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'IQakg45Fe5Q',
    sections: [
      {
        title: 'Types de points d\'acces (AP)',
        content: `### AP d'interieur (Indoor)

Les AP d'interieur sont concus pour etre installes dans des bureaux, salles de reunion, couloirs et autres espaces fermes.

**Caracteristiques :**
- Boitier compact, design discret (souvent monte au plafond)
- Antennes **internes** omnidirectionnelles
- Alimentation par **PoE** (Power over Ethernet) via le cable reseau
- Temperature de fonctionnement : 0 a 40°C typiquement
- Exemples Cisco : Catalyst 9120, 9130, 9136

| Modele Cisco | Wi-Fi | Bandes | Usage |
|-------------|-------|--------|-------|
| Catalyst 9115 | Wi-Fi 6 | 2.4 + 5 GHz | Bureaux standard |
| Catalyst 9120 | Wi-Fi 6 | 2.4 + 5 GHz | Haute densite |
| Catalyst 9130 | Wi-Fi 6 | 2.4 + 5 GHz | Entreprise avancee |
| Catalyst 9136 | Wi-Fi 6E | 2.4 + 5 + 6 GHz | Nouvelle generation |

### AP d'exterieur (Outdoor)

Les AP d'exterieur sont renforcis pour resister aux conditions climatiques (pluie, vent, temperatures extremes).

**Caracteristiques :**
- Boitier **IP67** ou **IP68** (etanche a la poussiere et a l'eau)
- Antennes **externes** (souvent directionnelles ou sectorielles)
- Plage de temperature etendue : -40 a +65°C
- Protection contre la foudre (surge protection)
- Exemples Cisco : Catalyst 9124, Aironet 1560

### AP Mesh

Les AP **Mesh** forment un reseau maille ou les AP communiquent entre eux par liaison radio, sans avoir besoin de cablage Ethernet pour chaque AP.

\`\`\`
[Switch]
   |
  [AP Root]  ← Connecte au reseau filaire
   / \\
  /   \\
[AP Mesh] [AP Mesh]  ← Relies par radio (backhaul wireless)
  |
[AP Mesh]
\`\`\`

**Composants :**
- **RAP** (Root AP) : connecte au reseau filaire, point d'ancrage
- **MAP** (Mesh AP) : connecte par radio au RAP ou a un autre MAP

**Usage :** Zones difficiles a cabler (entrepots, parcs, zones de construction temporaires, villes).

> **A retenir :** Pour le CCNA, sachez distinguer les trois types d'AP (indoor, outdoor, mesh) et leurs cas d'usage. Les AP indoor avec PoE sont les plus courants en entreprise.`
      },
      {
        title: 'Placement des AP et site survey',
        content: `### L'importance du placement

Un mauvais placement des AP entraine :
- **Zones mortes** (pas de couverture)
- **Interferences co-canal** (trop d'AP sur le meme canal)
- **Performances degradees** (trop de clients par AP)
- **Roaming inefficace** (transitions brutales)

### Le site survey (etude de site)

Un **site survey** est une etude prealable du lieu pour planifier le deploiement optimal des AP. Il existe trois types :

| Type | Methode | Quand |
|------|---------|-------|
| **Predictive** | Logiciel de simulation (plan du batiment + materiaux) | Avant installation |
| **Active** | Mesures sur site avec un client Wi-Fi connecte | Pendant/apres installation |
| **Passive** | Capture des signaux sans connexion | Diagnostic, verification |

### Facteurs de placement

**Densite de clients :**
- Bureau standard : 1 AP pour **20-30 utilisateurs**
- Haute densite (amphitheatre, salle de conference) : 1 AP pour **10-15 utilisateurs**
- Tres haute densite (stade) : solutions specifiques

**Couverture vs capacite :**

\`\`\`
Approche couverture (peu d'AP, haute puissance) :
[AP]                          [AP]
 |  Grande zone de couverture  |
 |  Peu de clients par zone    |
 |  → Bonne pour les entrepots |

Approche capacite (beaucoup d'AP, faible puissance) :
[AP]  [AP]  [AP]  [AP]  [AP]
 |  Petites cellules  |
 |  Beaucoup de clients par zone |
 |  → Bonne pour les bureaux denses |
\`\`\`

### Regle du chevauchement

Les cellules de couverture adjacentes doivent se **chevaucher** d'environ **15 a 20%** pour garantir un roaming fluide sans interruption.

\`\`\`
        [AP1]         [AP2]         [AP3]
     /       \\     /       \\     /       \\
    /         \\   /         \\   /         \\
   |           | X |         | X |         |
    \\         / \\ /         / \\ /         /
     \\       /   \\         /   \\       /

             15-20%      15-20%
           chevauchement
\`\`\`

### Hauteur de montage

- **AP au plafond** (recommande) : 2.5 a 4 metres, antenne omnidirectionnelle vers le bas
- **AP mural** : adapte pour les couloirs, orientation vers la zone a couvrir
- **Eviter** : placer l'AP pres de surfaces metalliques, de micro-ondes, ou dans des armoires fermees

> **Conseil CCNA :** L'examen peut poser des questions sur les bonnes pratiques de placement. Retenez le chevauchement de 15-20%, la difference entre approche couverture et capacite, et l'importance du site survey.`
      },
      {
        title: 'PoE — Power over Ethernet pour les AP',
        content: `### Principe du PoE

Le **PoE** (Power over Ethernet) permet d'alimenter les AP directement via le cable Ethernet, eliminant le besoin d'une prise electrique dediee pres de chaque AP.

\`\`\`
[Switch PoE]---cable Ethernet---[AP]
     |                            |
  Donnees + Alimentation      Pas besoin de
  sur le meme cable           prise electrique
\`\`\`

### Standards PoE IEEE

| Standard | Nom | Puissance max (PSE) | Puissance max (PD) | Paires utilisees |
|----------|-----|---------------------|---------------------|-----------------|
| 802.3af | **PoE** | 15.4 W | 12.95 W | 2 paires |
| 802.3at | **PoE+** | 30 W | 25.5 W | 2 paires |
| 802.3bt | **PoE++** (Type 3) | 60 W | 51 W | 4 paires |
| 802.3bt | **PoE++** (Type 4) | 100 W | 71.3 W | 4 paires |

**PSE** = Power Sourcing Equipment (le switch qui fournit l'electricite)
**PD** = Powered Device (l'AP qui recoit l'electricite)

### Quel standard PoE pour quel AP ?

| Type d'AP | PoE requis | Justification |
|-----------|-----------|---------------|
| AP basique (Wi-Fi 5, 2 radios) | **802.3af** (PoE) | Consommation < 13 W |
| AP standard (Wi-Fi 6, 2 radios) | **802.3at** (PoE+) | Consommation 15-25 W |
| AP haute performance (Wi-Fi 6, 3 radios) | **802.3at** (PoE+) | Consommation ~25 W |
| AP Wi-Fi 6E (3 bandes) | **802.3bt** (PoE++) | Consommation > 25 W |

### Negociation PoE

1. Le switch detecte la presence d'un PD via une tension test
2. Le switch determine la **classe** de puissance du PD
3. Le switch alloue la puissance demandee
4. Si le budget PoE total du switch est atteint, les nouveaux PD sont refuses

### Budget PoE du switch

\`\`\`
Switch Cisco Catalyst 9300-48P :
- 48 ports PoE+
- Budget PoE total : 790 W
- Si chaque AP consomme 25 W → max 31 AP alimentes
- Toujours prevoir une marge de 20%
\`\`\`

**Verification sur un switch Cisco :**
\`\`\`
Switch# show power inline
Interface   Admin  Oper     Power    Device        Class
Gi1/0/1     auto   on       15.4 W   AIR-AP2802I   3
Gi1/0/2     auto   on       25.5 W   C9120AXI      4
Gi1/0/3     auto   off      0.0 W    n/a           n/a
Available: 790.0 W  Used: 40.9 W  Remaining: 749.1 W
\`\`\`

> **Astuce CCNA :** Retenez les 3 standards principaux (802.3af = 15.4W, 802.3at = 30W, 802.3bt = 60/100W) et le fait que les AP Wi-Fi 6 necessitent generalement du PoE+ (802.3at) au minimum.`
      },
      {
        title: 'Modes de fonctionnement des AP',
        content: `Dans une architecture controller-based (CAPWAP), un AP Lightweight peut etre configure dans differents **modes de fonctionnement** selon son role dans le reseau.

### Les principaux modes d'AP

| Mode | Fonction | Sert les clients ? |
|------|----------|-------------------|
| **Local** | Mode par defaut, fournit le Wi-Fi | Oui |
| **FlexConnect** | Mode site distant, switching local | Oui |
| **Monitor** | Detection de rogue AP et IDS | Non |
| **Sniffer** | Capture de paquets Wi-Fi | Non |
| **Bridge** | Liaison point-a-point ou mesh | Non (bridge) |
| **SE-Connect** | Analyse spectrale (Spectrum Expert) | Non |

### Mode Local (defaut)

C'est le mode standard. L'AP :
- Fournit le service Wi-Fi aux clients
- Envoie le trafic au WLC via le tunnel CAPWAP Data
- Scanne periodiquement les autres canaux (off-channel scanning) pour detecter les rogue AP, environ 50ms toutes les 16 secondes

\`\`\`
[Client]→[AP mode Local]===CAPWAP===>[WLC]→[Reseau]
\`\`\`

### Mode Monitor

L'AP ne fournit **aucun service Wi-Fi**. Il est entierement dedie a la **surveillance** :
- Detection de **rogue AP** (AP non autorises)
- Detection d'**attaques** wireless (deauthentication, evil twin)
- **Localisation** des appareils (avec plusieurs AP Monitor)

\`\`\`
[AP Monitor] ← Ecoute TOUS les canaux en continu
     |           Ne fournit aucun SSID
     |           Remonte les alertes au WLC
     ↓
   [WLC] → Alerte : rogue AP detecte sur canal 6 !
\`\`\`

### Mode Sniffer

L'AP capture **tous les paquets Wi-Fi** sur un canal specifique et les renvoie a un analyseur de paquets (ex: Wireshark) pour analyse detaillee.

\`\`\`
[AP Sniffer]--capture canal 36-->[WLC]-->[Wireshark]
\`\`\`

### Mode Bridge

L'AP etablit une **liaison radio point-a-point** ou **point-a-multipoint** entre deux ou plusieurs sites. Utilise pour connecter des batiments sans cable.

\`\`\`
Batiment A              Batiment B
[Switch]--[AP Bridge] )))))) [AP Bridge]--[Switch]
\`\`\`

### Mode SE-Connect

L'AP effectue une **analyse spectrale** complete de l'environnement RF. Il detecte les sources d'interference non-Wi-Fi (micro-ondes, cameras sans fil, Bluetooth, etc.) via le logiciel Cisco Spectrum Expert ou CleanAir.

### Changer le mode d'un AP

\`\`\`
Sur le WLC (CLI) :
(Cisco Controller) > config ap mode monitor AP-NOM
(Cisco Controller) > config ap mode local AP-NOM
(Cisco Controller) > config ap mode flexconnect AP-NOM

Sur le WLC (GUI) :
Wireless > Access Points > Cliquer sur l'AP > General > AP Mode
\`\`\`

> **A retenir :** Le mode **Local** est le mode par defaut (l'AP fournit le Wi-Fi). Le mode **Monitor** est utilise pour la securite (detection de rogue AP). Le mode **FlexConnect** est utilise pour les sites distants. Ce sont les trois modes les plus importants pour le CCNA.`
      },
      {
        title: 'Antennes : types, patterns et selection',
        content: `### Rappel des types d'antennes

Les AP peuvent utiliser des antennes **internes** (integrees dans le boitier) ou **externes** (connectees via un port RP-TNC ou RP-SMA).

### Patterns de rayonnement detailles

**Antenne omnidirectionnelle (Dipole) :**

\`\`\`
Vue laterale :          Vue de dessus :
      |
   /     \\                +---------+
  /       \\              /           \\
 |  [AP]   |            |    [AP]     |
  \\       /              \\           /
   \\_____/                +---------+
      |
Zone aveugle              Signal 360°
au-dessus et              sur le plan
en-dessous                horizontal
\`\`\`

Le signal est faible directement au-dessus et en-dessous de l'antenne. C'est pourquoi un AP au plafond couvre bien le meme etage mais pas les etages adjacents.

**Antenne patch (directionnelle) :**

\`\`\`
Vue de dessus :

    [AP/Patch]→→→→→→→
         →→→→→→→
           →→→→→
             →→→
               →

Signal concentre dans une direction
Angle typique : 60-90°
\`\`\`

### Gain et couverture

Le **gain** d'une antenne (mesure en **dBi**) ne cree pas d'energie supplementaire. Il **redistribue** l'energie dans une direction privilegiee :

| Gain | Antenne type | Effet sur la couverture |
|------|-------------|------------------------|
| 2 dBi | Omnidirectionnelle basique | Cellule ronde, portee standard |
| 5 dBi | Omnidirectionnelle haute | Cellule aplatie (plus loin horizontalement, moins verticalement) |
| 8 dBi | Patch directionnelle | Cellule en cone, bonne portee dans une direction |
| 14 dBi | Yagi directionnelle | Faisceau etroit, longue portee |

### Diversity et MIMO

**Antenna Diversity :** L'AP utilise deux antennes et choisit celle avec le meilleur signal recu. Cela reduit les effets du **multipath fading** (reflexions du signal qui s'annulent).

**MIMO (Multiple Input Multiple Output) :**
Les AP modernes utilisent **plusieurs antennes** simultanement pour augmenter le debit :

\`\`\`
AP Wi-Fi 6 typique : 4x4:4 MIMO
  4 antennes TX
  4 antennes RX
  4 flux spatiaux simultanees

  [Ant1]→→→→→ flux 1 →→→→→[Ant1]
  [Ant2]→→→→→ flux 2 →→→→→[Ant2]  Client
  [Ant3]→→→→→ flux 3 →→→→→[Ant3]
  [Ant4]→→→→→ flux 4 →→→→→[Ant4]

  AP                        Client
\`\`\`

**MU-MIMO (Multi-User MIMO) :**
Introduit avec Wi-Fi 5, permet a l'AP d'envoyer des flux **a plusieurs clients simultanement** au lieu d'un seul.

> **Pour le CCNA :** Retenez que les antennes omnidirectionnelles sont utilisees pour les AP d'interieur classiques, les antennes directionnelles pour les cas specifiques (couloirs, exterieur, liaisons). Le MIMO augmente le debit en multipliant les flux spatiaux.`
      }
    ]
  },
  {
    id: 40,
    slug: 'securite-wireless',
    title: 'Protocoles de securite wireless',
    subtitle: 'WEP, WPA, WPA2, WPA3, 802.1X et bonnes pratiques',
    icon: 'Shield',
    color: '#8b5cf6',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'CWALplWwOKk',
    sections: [
      {
        title: 'Evolution de la securite Wi-Fi',
        content: `### Pourquoi la securite Wi-Fi est critique

Contrairement aux reseaux filaires, le signal Wi-Fi se propage dans l'air et peut etre intercepte par n'importe qui a portee. Sans securite adequate, un attaquant peut :
- **Ecouter** le trafic (sniffing)
- **Se connecter** au reseau (acces non autorise)
- **Injecter** des paquets malveillants
- **Usurper** un AP (evil twin, rogue AP)

### Chronologie des protocoles de securite

| Protocole | Annee | Chiffrement | Etat actuel |
|-----------|-------|-------------|-------------|
| **Open** | 1997 | Aucun | Obsolete (sauf guest avec portail captif) |
| **WEP** | 1999 | RC4 (40/104 bits) | **Casse, ne jamais utiliser** |
| **WPA** | 2003 | TKIP (RC4 ameliore) | Obsolete, deprecie |
| **WPA2** | 2004 | **AES-CCMP** | Standard actuel minimum |
| **WPA3** | 2018 | **AES-GCMP** / SAE | Recommande, derniere generation |

### Open (pas de securite)

Aucune authentification, aucun chiffrement. Tout le trafic est en clair. Utilise uniquement avec un **portail captif** pour les reseaux guest (hotels, cafes) ou le portail force une authentification web avant d'accorder l'acces Internet.

### WEP — Wired Equivalent Privacy (NE JAMAIS UTILISER)

Le WEP a ete le premier protocole de securite Wi-Fi. Il utilise l'algorithme **RC4** avec des cles de 40 ou 104 bits.

**Pourquoi le WEP est casse :**
- Le vecteur d'initialisation (IV) ne fait que **24 bits** → se repete apres ~5000 paquets
- La cle est **statique** (ne change jamais)
- Des outils comme **aircrack-ng** cassent une cle WEP en quelques minutes
- Pas d'authentification mutuelle

\`\`\`
Attaque WEP simplifiee :
1. Capture de paquets avec IVs
2. Apres ~40 000 IVs → analyse statistique
3. Cle WEP recuperee en moins de 5 minutes
\`\`\`

> **Point CCNA critique :** Le WEP est **totalement compromis** et ne doit **jamais** etre utilise, meme en dernier recours. Si vous voyez WEP dans un scenario d'examen, c'est toujours la mauvaise reponse pour une question de securite.`
      },
      {
        title: 'WPA et WPA2 : TKIP vs AES-CCMP',
        content: `### WPA — Wi-Fi Protected Access

Le WPA a ete cree comme solution temporaire en attendant WPA2. Il utilise **TKIP** (Temporal Key Integrity Protocol) base sur RC4 mais avec des ameliorations significatives :

- **Cle par paquet** : chaque paquet utilise une cle differente
- **IV etendu** a 48 bits (vs 24 bits pour WEP)
- **MIC** (Message Integrity Check) : verification d'integrite pour prevenir la falsification
- **Compteur de sequence** : protection contre le rejeu

**Limites du WPA/TKIP :**
- Toujours base sur RC4 (algorithme affaibli)
- Vulnerabilites connues (attaque Beck-Tews)
- **Deprecie** par la Wi-Fi Alliance depuis 2012

### WPA2 — Le standard actuel

WPA2 est la certification de la norme **IEEE 802.11i** complete. Il utilise **AES-CCMP** comme chiffrement par defaut.

**AES-CCMP :**
- **AES** (Advanced Encryption Standard) : algorithme de chiffrement par blocs, cles de 128 bits
- **CCMP** (Counter Mode with Cipher Block Chaining Message Authentication Code Protocol) : fournit chiffrement + integrite + authentification

| Composant | WPA (TKIP) | WPA2 (AES-CCMP) |
|-----------|------------|------------------|
| Algorithme | RC4 | **AES** |
| Taille de cle | 128 bits | **128 bits** |
| Integrite | MIC (Michael) | **CBC-MAC** |
| IV | 48 bits | **48 bits (PN)** |
| Overhead en-tete | 20 octets | **16 octets** |
| Securite | Correcte | **Forte** |

### Le 4-Way Handshake

WPA et WPA2 utilisent un processus en 4 etapes pour generer les cles de session :

\`\`\`
Client (Supplicant)          AP (Authenticator)
       |                            |
       |<-- Message 1: ANonce ------|  AP envoie un nonce aleatoire
       |                            |
       |--- Message 2: SNonce ----->|  Client envoie son nonce + MIC
       |    (+ MIC)                 |
       |                            |  Les deux calculent la PTK
       |<-- Message 3: GTK ---------|  AP envoie la cle de groupe + MIC
       |    (+ MIC)                 |
       |                            |
       |--- Message 4: ACK -------->|  Client confirme
       |                            |

PTK = Pairwise Transient Key (cle unicast unique par client)
GTK = Group Temporal Key (cle broadcast/multicast partagee)
\`\`\`

> **A retenir :** WPA2 avec AES-CCMP est le **minimum requis** en entreprise. Le 4-Way Handshake est un sujet potentiel du CCNA. La PTK est unique par client, la GTK est partagee entre tous les clients du meme SSID.`
      },
      {
        title: 'WPA3 : la nouvelle generation',
        content: `### Ameliorations de WPA3

WPA3 a ete introduit en 2018 pour corriger les faiblesses de WPA2 et renforcer la securite globale des reseaux sans fil.

### WPA3-Personal : SAE remplace PSK

Le principal changement en mode Personal est le remplacement du **Pre-Shared Key (PSK)** par **SAE** (Simultaneous Authentication of Equals) :

| Critere | WPA2-Personal (PSK) | WPA3-Personal (SAE) |
|---------|---------------------|---------------------|
| Echange de cles | 4-Way Handshake | **Dragonfly Handshake** |
| Protection offline | Non | **Oui** |
| Forward secrecy | Non | **Oui** |
| Mot de passe faible | Vulnerable | **Protege** |

**Forward Secrecy :** Meme si un attaquant capture le trafic et decouvre le mot de passe plus tard, il ne peut **pas** dechiffrer le trafic deja capture. Chaque session utilise des cles uniques et ephemeres.

**Protection contre les attaques dictionnaire offline :** Avec WPA2-PSK, un attaquant peut capturer le 4-Way Handshake et tester des millions de mots de passe hors ligne. Avec SAE, chaque tentative necessite une interaction avec l'AP → les attaques offline sont impossibles.

### WPA3-Enterprise : 192 bits

WPA3-Enterprise ajoute un **mode optionnel 192 bits** (CNSA - Commercial National Security Algorithm Suite) :
- Chiffrement AES-256-GCMP
- Authentification basee sur des certificats EAP-TLS
- HMAC-SHA-384 pour l'integrite
- Destine aux environnements gouvernementaux et haute securite

### OWE — Opportunistic Wireless Encryption

WPA3 introduit aussi **OWE** (Enhanced Open) pour les reseaux ouverts (sans mot de passe) :
- Les reseaux "Open" classiques n'ont **aucun chiffrement**
- OWE fournit un **chiffrement individuel** sans mot de passe
- Chaque client negocie une cle unique avec l'AP via Diffie-Hellman
- L'utilisateur ne voit aucune difference (pas de mot de passe demande)

\`\`\`
Reseau ouvert classique :
[Client]→→→ trafic en CLAIR →→→[AP]  ← Sniffable !

Reseau OWE (Enhanced Open) :
[Client]→→→ trafic CHIFFRE →→→[AP]  ← Protege contre le sniffing
                                        (pas de mot de passe demande)
\`\`\`

### Mode de transition WPA3

Pour faciliter la migration, il existe un **mode de transition** ou l'AP accepte simultanement les clients WPA2 et WPA3 sur le meme SSID.

> **Astuce CCNA :** Retenez que WPA3-Personal utilise **SAE** (pas PSK), offre la **forward secrecy** et protege contre les attaques dictionnaire offline. WPA3-Enterprise peut utiliser un chiffrement **192 bits**. OWE chiffre les reseaux ouverts.`
      },
      {
        title: 'Personal vs Enterprise : les deux modes',
        content: `### Mode Personal (PSK / SAE)

Le mode **Personal** utilise un **mot de passe partage** (Pre-Shared Key) pour l'authentification. Tous les utilisateurs utilisent le meme mot de passe.

**Fonctionnement :**
1. L'administrateur configure un mot de passe sur l'AP/WLC
2. Les utilisateurs entrent ce mot de passe pour se connecter
3. La cle de session est derivee du mot de passe + nonces

**Avantages :** Simple a deployer, pas d'infrastructure supplementaire.

**Inconvenients :**
- Tous les utilisateurs partagent le meme mot de passe
- Si un employe quitte → il faut changer le mot de passe pour tous
- Pas de traçabilite individuelle (qui se connecte ?)
- Vulnerable aux attaques dictionnaire (WPA2-PSK)

**Usage :** Reseaux domestiques, petites entreprises (< 10 utilisateurs), reseaux guest.

### Mode Enterprise (802.1X/EAP)

Le mode **Enterprise** utilise un **serveur d'authentification RADIUS** et le framework **802.1X** pour authentifier individuellement chaque utilisateur.

**Les 3 composants de 802.1X :**

| Composant | Role | Exemple |
|-----------|------|---------|
| **Supplicant** | Client qui demande l'acces | PC, smartphone |
| **Authenticator** | Intermediaire, transmet les requetes | AP / WLC |
| **Authentication Server** | Verifie les identifiants | Serveur RADIUS (ISE, FreeRADIUS) |

\`\`\`
[Supplicant]←→[Authenticator (AP)]←→[Auth Server (RADIUS)]
   Client           AP/WLC              Cisco ISE
     |                 |                    |
     |--- EAP Identity -->                  |
     |                 |--- RADIUS Access-Request -->
     |                 |<-- RADIUS Challenge ---|
     |<-- EAP Challenge ---|                    |
     |--- EAP Response --->                     |
     |                 |--- RADIUS Access-Request -->
     |                 |<-- RADIUS Accept -------|
     |<-- EAP Success ----|                      |
     |                                           |
     Connexion autorisee !
\`\`\`

### Methodes EAP courantes

| Methode EAP | Authentification | Certificat serveur | Certificat client | Securite |
|-------------|-----------------|-------------------|-------------------|----------|
| **EAP-TLS** | Certificats mutuels | Oui | Oui | Tres forte |
| **PEAP** | Login/MDP dans tunnel TLS | Oui | Non | Forte |
| **EAP-TTLS** | Login/MDP dans tunnel TLS | Oui | Non | Forte |
| **EAP-FAST** | PAC (Protected Access Credential) | Optionnel | Non | Forte |

> **A retenir pour le CCNA :** Le mode Enterprise avec 802.1X est **obligatoire** en entreprise pour la traçabilite et la securite. PEAP est la methode EAP la plus deployee car elle ne necessite pas de certificat client. EAP-TLS est la plus securisee mais la plus complexe a deployer.`
      },
      {
        title: 'Integration RADIUS et Cisco ISE',
        content: `### Le protocole RADIUS

**RADIUS** (Remote Authentication Dial-In User Service) est le protocole standard pour l'authentification centralisee. En wireless Enterprise, il connecte l'AP/WLC au serveur d'authentification.

**Ports RADIUS :**
| Port UDP | Usage |
|----------|-------|
| **1812** | Authentification (standard) |
| **1813** | Accounting (standard) |
| **1645** | Authentification (ancien) |
| **1646** | Accounting (ancien) |

### Flux d'authentification complet

\`\`\`
1. Le client s'associe a l'AP sur le SSID Enterprise
2. L'AP/WLC bloque tout trafic sauf 802.1X
3. Echange EAP entre le client et le serveur RADIUS :
   - Le serveur RADIUS verifie les identifiants
     (Active Directory, LDAP, base locale)
   - Si valide → RADIUS Access-Accept
   - Si invalide → RADIUS Access-Reject
4. L'AP/WLC autorise le client sur le reseau
5. Attribution dynamique de VLAN (optionnel)
\`\`\`

### Attribution dynamique de VLAN

Avec RADIUS, chaque utilisateur peut etre place dans un VLAN different selon son role :

| Utilisateur | Groupe | VLAN attribue | Reseau |
|------------|--------|---------------|--------|
| jean.dupont | Employes | VLAN 10 | 10.10.10.0/24 |
| stagiaire01 | Stagiaires | VLAN 20 | 10.10.20.0/24 |
| admin.reseau | IT | VLAN 99 | 10.10.99.0/24 |

Les attributs RADIUS renvoyes :
\`\`\`
Tunnel-Type = VLAN (13)
Tunnel-Medium-Type = IEEE-802 (6)
Tunnel-Private-Group-Id = 10    ← Numero du VLAN
\`\`\`

### Cisco ISE (Identity Services Engine)

**Cisco ISE** est la solution RADIUS de Cisco. Elle offre bien plus que l'authentification simple :

- **Authentification** : 802.1X, MAB (MAC Authentication Bypass), portail web
- **Autorisation** : politiques basees sur l'identite, le type de device, la posture
- **Accounting** : journalisation de toutes les connexions
- **Profiling** : identification automatique des types d'appareils (IoT, BYOD, imprimantes)
- **Posture** : verification de la conformite du poste (antivirus a jour, OS patche)
- **Guest** : portail captif personnalisable pour les visiteurs

### Configuration RADIUS sur le WLC

\`\`\`
Sur le WLC (GUI) :
1. Security > AAA > RADIUS > Authentication
2. Ajouter le serveur RADIUS :
   - IP : 10.10.99.10
   - Port : 1812
   - Shared Secret : MonSecretRADIUS
3. Dans le WLAN :
   - Security > Layer 2 : WPA2 + 802.1X
   - Security > AAA Servers : selectionner le serveur RADIUS
\`\`\`

> **Point CCNA :** RADIUS utilise UDP (ports 1812/1813). Le shared secret entre le WLC et le serveur RADIUS doit etre identique des deux cotes. Cisco ISE est la solution RADIUS recommandee par Cisco.`
      },
      {
        title: 'Menaces wireless et bonnes pratiques',
        content: `### Principales menaces Wi-Fi

**Rogue AP (AP non autorise) :**
Un employe branche un AP personnel sur le reseau de l'entreprise, creant une porte d'entree non securisee.

\`\`\`
[Reseau entreprise]---[Switch]---[Rogue AP]))))[Attaquant]
                                     ↑
                          AP personnel non autorise
                          Pas de securite configuree
\`\`\`

**Detection :** AP en mode Monitor, Cisco wIPS (wireless Intrusion Prevention System), CleanAir.

**Evil Twin (jumeau malveillant) :**
L'attaquant cree un AP avec le **meme SSID** que le reseau legitime mais avec un signal plus fort. Les clients se connectent au faux AP.

\`\`\`
[AP Legitime] "Corp-WiFi" signal -60 dBm
[Evil Twin]   "Corp-WiFi" signal -40 dBm  ← Signal plus fort !
                                              Les clients s'y connectent
\`\`\`

**Attaque de deauthentication :**
L'attaquant envoie des trames de **deauthentication** forgees pour deconnecter les clients de l'AP legitime, puis les forcer a se reconnecter sur l'evil twin.

\`\`\`
[Attaquant] → Trame deauth (forge) → [Client]
[Client] se deconnecte → cherche un AP → [Evil Twin]
\`\`\`

**Protection :** WPA3 et **802.11w** (Management Frame Protection) chiffrent les trames de management, empechant la forge de trames deauth.

### Bonnes pratiques de securite wireless

**1. Chiffrement :**
- Utiliser **WPA2-AES minimum**, WPA3 si supporte
- **Ne jamais** utiliser WEP ou WPA-TKIP
- Activer **802.11w** (PMF - Protected Management Frames)

**2. Authentification :**
- Mode **Enterprise (802.1X)** pour les employes
- Mode **Personal** uniquement pour les petits reseaux ou le guest
- Mots de passe forts (> 12 caracteres, complexite)

**3. Segmentation :**
- Separer les SSID : employes, invites, IoT
- Chaque SSID dans un **VLAN dedie**
- ACL entre les VLANs

**4. Surveillance :**
- Deployer des AP en mode **Monitor** ou activer **wIPS**
- Alertes en cas de rogue AP ou evil twin
- Audit regulier des reseaux detectes

**5. Configuration :**
- Ne **pas** se fier au masquage du SSID (facilement contournable)
- Desactiver les protocoles anciens si possible (802.11b)
- Reduire la puissance TX au minimum necessaire
- Mettre a jour le firmware des AP regulierement

| Mesure | Impact securite | Difficulte de deploiement |
|--------|----------------|--------------------------|
| WPA3 | Tres fort | Moyen (compatibilite clients) |
| 802.1X Enterprise | Fort | Moyen (serveur RADIUS) |
| PMF (802.11w) | Fort | Faible (activation) |
| Segmentation VLAN | Fort | Faible |
| wIPS / Monitor AP | Moyen | Faible |
| Masquage SSID | Tres faible | Faible (inutile) |
| Filtrage MAC | Tres faible | Moyen (facilement contournable) |

> **Conseil CCNA :** Le masquage du SSID et le filtrage d'adresses MAC ne sont **PAS** des mesures de securite efficaces. Le SSID est visible dans les Probe Responses et les adresses MAC sont facilement usurpables. Concentrez-vous sur le chiffrement fort (WPA2/WPA3) et l'authentification 802.1X.`
      }
    ]
  },
  {
    id: 41,
    slug: 'configuration-wlan-gui',
    title: 'Configuration WLAN via GUI (WLC)',
    subtitle: 'Creation de WLAN, securite, VLAN, QoS et monitoring',
    icon: 'Settings',
    color: '#8b5cf6',
    duration: '45 min',
    level: 'Avance',
    videoId: 'qF_H0khpYSE',
    sections: [
      {
        title: 'Setup initial du WLC',
        content: `### Premiere connexion au WLC

Lors du premier demarrage d'un WLC Cisco (ex: 3504, 5520, ou Catalyst 9800), un assistant de configuration initial se lance via la **console** (cable serie) ou un **navigateur web** apres attribution d'une IP sur le port de management.

### Parametres de configuration initiale

| Parametre | Description | Exemple |
|-----------|-------------|---------|
| **System Name** | Nom du controleur | WLC-HQ-01 |
| **Management IP** | IP de gestion du WLC | 10.10.99.2/24 |
| **Default Gateway** | Passerelle par defaut | 10.10.99.1 |
| **Management VLAN** | VLAN de management | VLAN 99 |
| **AP Manager IP** | IP pour la communication avec les AP | 10.10.99.3 |
| **Virtual IP** | IP virtuelle pour le portail web (guest) | 1.1.1.1 |
| **Mobility Domain** | Nom du domaine de mobilite | ENTERPRISE |
| **Admin username/password** | Compte administrateur | admin / MotDePasse! |
| **NTP Server** | Serveur de temps | 10.10.99.10 |

### Interfaces du WLC

Un WLC utilise des **interfaces logiques** mappees sur des VLANs physiques :

\`\`\`
WLC - Interfaces :
┌──────────────────────────────────┐
│ Management (VLAN 99)             │ ← Gestion du WLC et des AP
│ IP: 10.10.99.2/24               │
├──────────────────────────────────┤
│ AP-Manager (VLAN 99)            │ ← Communication CAPWAP avec AP
│ IP: 10.10.99.3/24               │
├──────────────────────────────────┤
│ Employes (VLAN 10)              │ ← Trafic WLAN "Corp-WiFi"
│ IP: 10.10.10.2/24               │
├──────────────────────────────────┤
│ Guest (VLAN 20)                 │ ← Trafic WLAN "Guest-WiFi"
│ IP: 10.10.20.2/24               │
├──────────────────────────────────┤
│ Virtual (1.1.1.1)              │ ← Portail captif, DHCP relay
└──────────────────────────────────┘
\`\`\`

### Creation d'une interface dynamique (via GUI)

\`\`\`
1. Controller > Interfaces > New
2. Interface Name : Employes
3. VLAN ID : 10
4. IP Address : 10.10.10.2 / 255.255.255.0
5. Gateway : 10.10.10.1
6. DHCP Server : 10.10.10.1 (ou IP du serveur DHCP)
7. Apply
\`\`\`

> **Important :** Le port physique du WLC (ou le port-channel) doit etre configure en **trunk** sur le switch, autorisant tous les VLANs necessaires (99, 10, 20, etc.). Le VLAN natif du trunk doit correspondre au VLAN management.`
      },
      {
        title: 'Creation d\'un WLAN (SSID)',
        content: `### Etapes de creation d'un WLAN via GUI

Sur le WLC, accedez a **WLANs > Create New** :

### Etape 1 : Informations generales

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Profile Name** | Nom interne du WLAN | Corp-WiFi-Profile |
| **SSID** | Nom visible par les clients | Corp-WiFi |
| **WLAN ID** | Identifiant unique (1-512) | 1 |
| **Status** | Actif ou desactive | Enabled |

### Etape 2 : Onglet General

\`\`\`
WLANs > Edit WLAN "Corp-WiFi"

General :
- Profile Name : Corp-WiFi-Profile
- SSID : Corp-WiFi
- Status : Enabled
- Interface/Group : Employes (VLAN 10)  ← Mappage VLAN !
- Broadcast SSID : Enabled (visible)
\`\`\`

### Etape 3 : Onglet Security

**Layer 2 Security :**
\`\`\`
Security > Layer 2 :
- Layer 2 Security : WPA+WPA2
- WPA2 Policy : Enabled
- WPA2 Encryption : AES
- Auth Key Management :
  - PSK (Personal) → entrer la cle partagee
  OU
  - 802.1X (Enterprise) → utiliser le serveur RADIUS
\`\`\`

**Pour WPA2-Personal :**
\`\`\`
Security > Layer 2 :
- WPA2 Policy : Enabled
- WPA2 Encryption : AES
- Auth Key Mgmt : PSK
- PSK Format : ASCII
- Pre-Shared Key : MonMotDePasseComplexe2024!
\`\`\`

**Pour WPA2-Enterprise :**
\`\`\`
Security > Layer 2 :
- WPA2 Policy : Enabled
- WPA2 Encryption : AES
- Auth Key Mgmt : 802.1X

Security > AAA Servers :
- Authentication Server : ISE-01 (10.10.99.10)
- Accounting Server : ISE-01 (10.10.99.10)
\`\`\`

### Etape 4 : Onglet Advanced

\`\`\`
Advanced :
- Allow AAA Override : Enabled (pour attribution dynamique de VLAN)
- P2P Blocking : Enabled (isoler les clients entre eux)
- Client Exclusion : Enabled, 60 sec (bloquer apres echecs)
- DHCP Required : Enabled (forcer l'obtention d'une IP DHCP)
- MFP Client Protection : Required (Protection Management Frames)
\`\`\`

> **A retenir :** La creation d'un WLAN implique toujours ces elements : un SSID, une politique de securite (WPA2 minimum), un mappage vers une interface (VLAN), et optionnellement des parametres avances (QoS, restrictions). Le mappage WLAN → VLAN est fondamental : il determine dans quel reseau les clients seront places.`
      },
      {
        title: 'Politiques de securite et VLAN mapping',
        content: `### Resume des configurations de securite

| Scenario | Layer 2 | Auth Key Mgmt | Serveur | VLAN |
|----------|---------|---------------|---------|------|
| **Employes** | WPA2-AES | 802.1X | RADIUS (ISE) | Dynamique (RADIUS) |
| **Invites** | Open + Web Auth | N/A | Portail captif | VLAN Guest (20) |
| **IoT** | WPA2-AES | PSK | N/A | VLAN IoT (30) |
| **VoIP Wi-Fi** | WPA2-AES | 802.1X | RADIUS | VLAN Voix (50) |

### Configuration du reseau Guest avec portail captif

\`\`\`
1. Creer l'interface : Guest (VLAN 20, IP 10.10.20.2/24)

2. Creer le WLAN :
   WLANs > Create New :
   - SSID : Guest-WiFi
   - Interface : Guest (VLAN 20)

3. Securite Layer 2 :
   - Layer 2 Security : None (Open)

4. Securite Layer 3 :
   - Layer 3 Security : Web Policy
   - Web Auth Type : Internal (portail du WLC)
                  OU External (redirection vers un portail externe)
   - Preauthentication ACL : permettre DNS et DHCP

5. Advanced :
   - Session Timeout : 3600 (1 heure)
   - Client Exclusion : Enabled
\`\`\`

### Mappage VLAN dynamique avec RADIUS

Quand un utilisateur s'authentifie en 802.1X, le serveur RADIUS peut renvoyer un VLAN specifique dans sa reponse **Access-Accept** :

\`\`\`
Flux :
[Client] → Authentification 802.1X → [WLC] → RADIUS Request → [ISE]
                                                                  |
                                              Verifie l'identite  |
                                              dans Active Directory
                                                                  |
[Client] ← VLAN 10 attribue ← [WLC] ← Access-Accept + VLAN=10 ←[ISE]

Attributs RADIUS :
  Tunnel-Type = VLAN
  Tunnel-Medium-Type = 802
  Tunnel-Private-Group-Id = 10
\`\`\`

**Configuration sur le WLC :**
\`\`\`
WLANs > Edit > Advanced :
- Allow AAA Override : Enabled  ← INDISPENSABLE !
  (permet au RADIUS d'overrider le VLAN par defaut du WLAN)
\`\`\`

### ACL sur le WLC

Les ACL du WLC filtrent le trafic des clients wireless :

\`\`\`
Security > Access Control Lists > New :
- ACL Name : ACL-Guest
- Rules :
  1. Permit UDP any any eq 53      ← DNS
  2. Permit UDP any any eq 67      ← DHCP
  3. Permit TCP any any eq 80      ← HTTP
  4. Permit TCP any any eq 443     ← HTTPS
  5. Deny IP any 10.10.0.0/16      ← Bloquer le reseau interne
  6. Permit IP any any              ← Autoriser Internet

Appliquer au WLAN :
WLANs > Edit "Guest-WiFi" > Advanced :
- Override Interface ACL : ACL-Guest
\`\`\`

> **Point CCNA :** L'option **AAA Override** est essentielle pour l'attribution dynamique de VLAN. Sans cette option activee sur le WLAN, le WLC ignore les attributs VLAN renvoyes par RADIUS et place tous les clients dans le VLAN par defaut du WLAN.`
      },
      {
        title: 'QoS et RF Profiles',
        content: `### QoS sur le WLC

La QoS (Quality of Service) sur le WLC permet de prioriser certains types de trafic wireless, particulierement important pour la **VoIP** et la **videoconference**.

### Profils QoS du WLC

| Profil QoS | WMM UP | DSCP max | Usage |
|------------|--------|----------|-------|
| **Platinum** | 6-7 | EF (46) | VoIP |
| **Gold** | 4-5 | AF41 (34) | Video |
| **Silver** | 0-3 | Best Effort (0) | Donnees (defaut) |
| **Bronze** | 1 | CS1 (8) | Trafic basse priorite |

**WMM** (Wi-Fi Multimedia) est l'implementation de la QoS au niveau Wi-Fi, basee sur 802.11e. Elle definit 4 categories d'acces :

| Categorie WMM | Priorite | Exemples |
|---------------|----------|----------|
| **Voice (AC_VO)** | Tres haute | VoIP, telephonie |
| **Video (AC_VI)** | Haute | Videoconference, streaming |
| **Best Effort (AC_BE)** | Normale | Navigation web, email |
| **Background (AC_BK)** | Basse | Telechargements, backups |

### Configuration QoS par WLAN

\`\`\`
WLANs > Edit "VoIP-WiFi" :
QoS :
- Quality of Service : Platinum (VoIP)
- WMM Policy : Required  ← Les clients DOIVENT supporter WMM
- Call Admission Control (CAC) :
  - Voice : Enabled, max bandwidth 75%
  - Video : Enabled, max bandwidth 50%
\`\`\`

Le **CAC** (Call Admission Control) limite le nombre d'appels simultanes sur un AP pour garantir la qualite. Si la bande passante reservee est atteinte, les nouveaux appels sont refuses plutot que de degrader les appels en cours.

### RF Profiles (Radio Frequency)

Les RF Profiles permettent de personnaliser les parametres radio par groupe d'AP :

\`\`\`
Wireless > RF Profiles > Create New :
- Name : RF-HighDensity
- Band : 5 GHz
- Min/Max Data Rate :
  - Disable rates below 12 Mbps (force les clients lents a se deconnecter)
- Max Clients : 50 per AP radio
- TPC (Transmit Power Control) :
  - Min Power : -10 dBm
  - Max Power : 14 dBm
- DCA (Dynamic Channel Assignment) :
  - Channel Width : 20 MHz (haute densite)
  - Avoid foreign AP interference : Enabled
\`\`\`

### Parametres RRM importants

| Parametre | Description | Impact |
|-----------|-------------|--------|
| **TPC** | Ajuste automatiquement la puissance TX | Reduit les interferences |
| **DCA** | Choisit automatiquement le meilleur canal | Evite les chevauchements |
| **Coverage Hole Detection** | Detecte les zones sans couverture | Augmente la puissance si besoin |
| **Band Select** | Oriente les clients dual-band vers 5 GHz | Decharge la bande 2.4 GHz |

> **A retenir :** Le WLC gere automatiquement les canaux (DCA) et la puissance (TPC) des AP via le RRM. En haute densite, configurez des canaux de 20 MHz, desactivez les debits bas et limitez le nombre de clients par radio.`
      },
      {
        title: 'AP Groups et gestion des AP',
        content: `### AP Groups : pourquoi ?

Par defaut, tous les AP du WLC diffusent **tous les WLAN** configures. Les **AP Groups** permettent de specifier quels WLAN sont diffuses par quels AP, et sur quelle interface (VLAN).

### Cas d'usage typique

\`\`\`
Sans AP Groups :
Etage 1 : [AP1] diffuse Corp-WiFi (VLAN 10) + Guest (VLAN 20) + VoIP (VLAN 50)
Etage 2 : [AP2] diffuse Corp-WiFi (VLAN 10) + Guest (VLAN 20) + VoIP (VLAN 50)
Entrepot : [AP3] diffuse Corp-WiFi (VLAN 10) + Guest (VLAN 20) + VoIP (VLAN 50)
  → L'entrepot n'a pas besoin de Guest ni de VoIP !

Avec AP Groups :
Groupe "Bureaux" (AP1, AP2) :
  - Corp-WiFi → Interface Employes (VLAN 10)
  - Guest-WiFi → Interface Guest (VLAN 20)
  - VoIP-WiFi → Interface Voice (VLAN 50)

Groupe "Entrepot" (AP3) :
  - Corp-WiFi → Interface Entrepot (VLAN 11)
  ← Pas de Guest ni VoIP
\`\`\`

### Configuration des AP Groups

\`\`\`
WLANs > Advanced > AP Groups > Create New :
- AP Group Name : Bureaux
- Description : AP des etages 1 et 2

Onglet "APs" :
- Ajouter AP1, AP2

Onglet "WLANs" :
- WLAN "Corp-WiFi" → Interface : Employes (VLAN 10)
- WLAN "Guest-WiFi" → Interface : Guest (VLAN 20)
- WLAN "VoIP-WiFi" → Interface : Voice (VLAN 50)
\`\`\`

### Gestion des AP depuis le WLC

**Dashboard de l'AP :**
\`\`\`
Wireless > Access Points > All APs :

| AP Name | Model | IP | Status | Clients | Channel (2.4/5) | Power |
|---------|-------|----|--------|---------|-----------------|-------|
| AP-ETG1-01 | 9120 | 10.10.99.11 | Registered | 23 | 1 / 36 | 17/14 |
| AP-ETG1-02 | 9120 | 10.10.99.12 | Registered | 18 | 6 / 44 | 17/14 |
| AP-ETG2-01 | 9130 | 10.10.99.13 | Registered | 31 | 11 / 52 | 14/11 |
\`\`\`

**Actions possibles sur chaque AP :**
- Changer le **mode** (Local, Monitor, FlexConnect)
- Modifier le **nom** de l'AP
- Forcer un **canal** ou une **puissance** specifique
- Redemarrer l'AP a distance (**reboot**)
- Telecharger les **logs** de l'AP
- Configurer les **antennes** (gain, type)

### Firmware Management

Le WLC gere automatiquement le firmware des AP :
1. On uploade la nouvelle image sur le WLC
2. Le WLC distribue l'image a tous les AP via CAPWAP
3. Les AP se mettent a jour et rebootent
4. Le processus est **pre-image download** : le firmware est transfere avant le reboot pour minimiser le temps d'indisponibilite

> **Astuce pratique :** Nommez vos AP selon une convention claire : \`AP-BATIMENT-ETAGE-NUMERO\` (ex: AP-HQ-2F-03). Cela facilite grandement le troubleshooting et la gestion au quotidien.`
      },
      {
        title: 'Monitoring et troubleshooting WLC',
        content: `### Dashboard du WLC

Le dashboard principal offre une vue d'ensemble en temps reel :

\`\`\`
┌─────────────────────────────────────────────┐
│ WLC Dashboard                                │
├──────────────┬──────────────────────────────┤
│ AP Summary   │ Total: 45  Online: 43        │
│              │ Offline: 2  (⚠ AP-ENT-01,   │
│              │            AP-EXT-03)        │
├──────────────┼──────────────────────────────┤
│ Client Count │ Total: 312                    │
│              │ 2.4 GHz: 87  5 GHz: 225      │
├──────────────┼──────────────────────────────┤
│ Top WLANs    │ Corp-WiFi: 245 clients       │
│              │ Guest: 52 clients             │
│              │ VoIP: 15 clients              │
├──────────────┼──────────────────────────────┤
│ Rogue APs    │ Detected: 3  Contained: 1    │
├──────────────┼──────────────────────────────┤
│ Interference │ 2.4 GHz: Medium              │
│              │ 5 GHz: Low                    │
└──────────────┴──────────────────────────────┘
\`\`\`

### Monitoring des clients

\`\`\`
Monitor > Clients :

| MAC Address | IP | Username | AP | WLAN | RSSI | SNR | Data Rate |
|-------------|----|---------|----|------|------|-----|-----------|
| AA:BB:CC:01 | 10.10.10.51 | jean.dupont | AP-2F-01 | Corp-WiFi | -55 dBm | 35 dB | 866 Mbps |
| AA:BB:CC:02 | 10.10.10.52 | marie.martin | AP-2F-02 | Corp-WiFi | -72 dBm | 18 dB | 54 Mbps |
\`\`\`

**Informations par client :**
- Adresse MAC et IP
- Nom d'utilisateur (si 802.1X)
- AP associe et WLAN
- RSSI (force du signal) et SNR
- Debit de donnees
- Historique de roaming (quels AP visites)
- Statistiques de trafic

### Commandes CLI de diagnostic (WLC classique)

\`\`\`
! Voir les AP enregistres
(Cisco Controller) > show ap summary

! Detail d'un AP specifique
(Cisco Controller) > show ap config general AP-ETG1-01

! Voir les clients connectes
(Cisco Controller) > show client summary

! Detail d'un client par MAC
(Cisco Controller) > show client detail AA:BB:CC:DD:EE:FF

! Voir les rogue AP detectes
(Cisco Controller) > show rogue ap summary

! Voir la configuration des WLAN
(Cisco Controller) > show wlan summary

! Voir les interfaces (VLANs)
(Cisco Controller) > show interface summary

! Debug d'association client
(Cisco Controller) > debug client AA:BB:CC:DD:EE:FF
\`\`\`

### Problemes courants et solutions

| Probleme | Cause probable | Verification | Solution |
|----------|---------------|--------------|----------|
| AP ne rejoint pas le WLC | Ports CAPWAP bloques | Verifier ACL/firewall | Ouvrir UDP 5246/5247 |
| Client ne s'authentifie pas | RADIUS injoignable | \`show radius summary\` | Verifier IP/secret RADIUS |
| Debit tres bas | Interference, signal faible | \`show client detail\` RSSI | Ajuster placement/puissance |
| Deconnexions frequentes | Roaming agressif, signal faible | Client roaming history | Verifier chevauchement AP |
| Pas d'IP DHCP | Mauvais VLAN, DHCP down | \`show interface detail\` | Verifier mapping VLAN |

### Alertes et notifications

Le WLC peut envoyer des alertes via :
- **SNMP Traps** : vers un NMS (Nagios, Zabbix, PRTG)
- **Syslog** : vers un serveur syslog centralise
- **Email** : pour les evenements critiques (AP down, rogue AP)

\`\`\`
Management > SNMP > Trap Receivers :
- IP : 10.10.99.50
- Community : public

Management > Logs > Config :
- Syslog Server : 10.10.99.50
- Syslog Level : Notifications (5)
\`\`\`

> **Pour le CCNA :** Sachez lire les informations de base du dashboard WLC et interpreter les indicateurs cles : nombre d'AP, nombre de clients, RSSI, rogue AP. La commande \`show client detail\` est tres utile pour diagnostiquer les problemes d'un client specifique.`
      }
    ]
  },
  {
    id: 42,
    slug: 'gestion-acces-equipements',
    title: 'Gestion et acces aux equipements',
    subtitle: 'Console, SSH, mots de passe, IOS et maintenance',
    icon: 'Terminal',
    color: '#8b5cf6',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'gD9QlBpFs1E',
    sections: [
      {
        title: 'Acces console et connexion physique',
        content: `### Le port console

Le **port console** est le moyen d'acces **direct** a un equipement Cisco (routeur, switch, WLC). C'est la methode utilisee pour la configuration initiale et le depannage quand l'acces reseau est indisponible.

### Types de ports console

| Port | Connecteur | Cable | Usage |
|------|-----------|-------|-------|
| **Console RJ-45** | RJ-45 | Cable rollover (bleu) | Equipements classiques |
| **Console Mini-USB** | Mini-USB Type B | Cable USB standard | Equipements recents |
| **Console USB Type-C** | USB-C | Cable USB-C | Equipements derniere generation |

### Configuration du terminal

Pour se connecter au port console, on utilise un **emulateur de terminal** (PuTTY, SecureCRT, Tera Term, minicom) avec les parametres suivants :

\`\`\`
Parametres serie par defaut Cisco :
- Vitesse (Baud rate) : 9600
- Data bits : 8
- Parity : None
- Stop bits : 1
- Flow control : None

Abreviation : 9600/8-N-1
\`\`\`

### Securiser la ligne console

Par defaut, la ligne console n'a **aucun mot de passe**. Toute personne ayant un acces physique peut se connecter.

\`\`\`
Router(config)# line console 0
Router(config-line)# password MonPasswordConsole
Router(config-line)# login
Router(config-line)# exec-timeout 5 0
Router(config-line)# logging synchronous
\`\`\`

**Explications :**
- \`password\` : definit le mot de passe de la ligne console
- \`login\` : active la demande de mot de passe a la connexion
- \`exec-timeout 5 0\` : deconnexion automatique apres 5 minutes d'inactivite
- \`logging synchronous\` : empeche les messages syslog de couper la saisie

### Banniere de connexion (MOTD)

La **banniere MOTD** (Message Of The Day) s'affiche avant la connexion. Elle est souvent utilisee pour afficher un **avertissement legal** :

\`\`\`
Router(config)# banner motd #
*********************************************
*  Acces reserve au personnel autorise.     *
*  Toute tentative d'acces non autorise     *
*  sera poursuivie conformement a la loi.   *
*********************************************
#
\`\`\`

Le caractere **#** est le **delimiteur** — il marque le debut et la fin du message. On peut utiliser n'importe quel caractere qui n'apparait pas dans le texte.

> **Conseil CCNA :** La banniere MOTD ne doit **jamais** contenir le mot "Bienvenue" ou toute formulation accueillante. En cas de poursuites judiciaires, un message de bienvenue pourrait etre interprete comme une invitation a se connecter. Utilisez toujours un avertissement restrictif.`
      },
      {
        title: 'Configuration SSH et acces distant',
        content: `### Pourquoi SSH plutot que Telnet ?

| Critere | Telnet (port 23) | SSH (port 22) |
|---------|------------------|---------------|
| Chiffrement | **Aucun** (texte en clair) | **AES/3DES** chiffre |
| Authentification | Mot de passe en clair | Cle publique ou mot de passe chiffre |
| Integrite | Aucune | HMAC |
| Securite | **A proscrire** | **Recommande** |

**Telnet transmet tout en clair**, y compris les mots de passe. Un simple sniff du reseau avec Wireshark permet de recuperer les identifiants. **SSH est obligatoire** en environnement de production.

### Configuration SSH pas a pas

\`\`\`
! 1. Configurer un nom d'hote (obligatoire pour SSH)
Router(config)# hostname R1

! 2. Configurer un nom de domaine (obligatoire pour generer les cles)
R1(config)# ip domain-name entreprise.local

! 3. Generer les cles RSA (taille minimum 2048 bits recommande)
R1(config)# crypto key generate rsa modulus 2048

! 4. Configurer la version SSH (toujours version 2)
R1(config)# ip ssh version 2

! 5. Configurer le timeout et les tentatives
R1(config)# ip ssh time-out 60
R1(config)# ip ssh authentication-retries 3

! 6. Creer un utilisateur local
R1(config)# username admin privilege 15 secret MonMotDePasse!

! 7. Configurer les lignes VTY pour SSH uniquement
R1(config)# line vty 0 15
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# exec-timeout 10 0

! 8. Verifier la configuration SSH
R1# show ip ssh
R1# show ssh
\`\`\`

### Les lignes VTY

Les lignes **VTY** (Virtual TeleTYpe) sont les lignes d'acces distant. Un equipement Cisco possede generalement **16 lignes VTY** (0 a 15), permettant jusqu'a 16 connexions simultanees.

\`\`\`
R1(config)# line vty 0 4       ← Les 5 premieres lignes
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# access-class SSH-ONLY in  ← ACL pour restreindre les IPs

R1(config)# ip access-list standard SSH-ONLY
R1(config-std-nacl)# permit 10.10.99.0 0.0.0.255   ← Seul le reseau admin
R1(config-std-nacl)# deny any log
\`\`\`

### Connexion SSH depuis un client

\`\`\`bash
# Depuis un PC Linux/Mac :
ssh admin@10.10.99.1

# Depuis un routeur Cisco vers un autre :
R1# ssh -l admin 10.10.99.2

# Depuis PuTTY (Windows) :
Host : 10.10.99.1
Port : 22
Connection type : SSH
\`\`\`

> **A retenir :** Pour configurer SSH, il faut obligatoirement : un **hostname**, un **domain name**, des **cles RSA** (minimum 1024 bits, recommande 2048), et \`transport input ssh\` sur les lignes VTY. N'oubliez pas \`login local\` pour utiliser les comptes locaux.`
      },
      {
        title: 'Mots de passe et niveaux de privilege',
        content: `### Les differents mots de passe Cisco

| Type | Commande | Chiffrement | Usage |
|------|---------|-------------|-------|
| **enable password** | \`enable password xxx\` | **Aucun** (texte clair dans la config) | Obsolete |
| **enable secret** | \`enable secret xxx\` | **MD5 ou SHA-256** (type 5/8/9) | Acces mode privilegie |
| **line password** | \`password xxx\` (sous line) | Aucun (sauf service password-encryption) | Acces console/VTY |
| **username secret** | \`username xxx secret yyy\` | **MD5/SHA-256** | Authentification locale |

### Enable password vs Enable secret

\`\`\`
! MAUVAIS : le mot de passe est visible en clair dans show running-config
Router(config)# enable password MonPassword
→ enable password MonPassword     ← Visible !

! BON : le mot de passe est hashe
Router(config)# enable secret MonPassword
→ enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0    ← Hashe !
\`\`\`

**Regle :** Si les deux sont configures, \`enable secret\` a **toujours la priorite**.

### Service password-encryption

Cette commande chiffre (faiblement, type 7) tous les mots de passe en clair dans la configuration :

\`\`\`
Router(config)# service password-encryption

! Avant :
line console 0
 password MonPassword            ← En clair

! Apres :
line console 0
 password 7 0822455D0A1606141B    ← Chiffre type 7
\`\`\`

**Attention :** Le chiffrement type 7 est **reversible** — des outils en ligne le dechiffrent instantanement. Ce n'est pas une vraie protection, juste un masquage visuel. Utilisez toujours \`secret\` plutot que \`password\` quand c'est possible.

### Niveaux de privilege (Privilege Levels)

IOS definit **16 niveaux de privilege** (0 a 15) qui controlent les commandes accessibles :

| Niveau | Acces | Commandes |
|--------|-------|-----------|
| **0** | Tres restreint | \`logout\`, \`enable\`, \`disable\`, \`help\`, \`exit\` |
| **1** | User EXEC (defaut) | \`show\` (limites), \`ping\`, \`traceroute\` |
| **2-14** | Personnalisables | Commandes definies par l'admin |
| **15** | Privileged EXEC (enable) | **Toutes les commandes** |

\`\`\`
! Creer un utilisateur avec privilege 15 (acces complet)
Router(config)# username admin privilege 15 secret AdminPass!

! Creer un utilisateur avec privilege 1 (lecture seule)
Router(config)# username viewer privilege 1 secret ViewPass!

! Attribuer une commande a un niveau personnalise
Router(config)# privilege exec level 5 show running-config
Router(config)# username technicien privilege 5 secret TechPass!
\`\`\`

### Mode EXEC utilisateur vs Mode EXEC privilegie

\`\`\`
Router>                    ← Mode User EXEC (niveau 1)
                              Commandes limitees (show, ping)
                              Prompt : hostname>

Router> enable             ← Passe en mode Privileged EXEC
Password: ****

Router#                    ← Mode Privileged EXEC (niveau 15)
                              Toutes les commandes (config, debug)
                              Prompt : hostname#

Router# configure terminal ← Passe en mode Configuration
Router(config)#            ← Mode Configuration Globale
\`\`\`

> **Astuce CCNA :** Retenez les 3 niveaux principaux : **0** (minimal), **1** (user exec, prompt >), **15** (privileged exec, prompt #). Le \`enable secret\` protege l'acces au niveau 15. Toujours utiliser \`secret\` plutot que \`password\` pour le hashage.`
      },
      {
        title: 'Systeme de fichiers IOS et gestion de configuration',
        content: `### Les configurations d'un equipement Cisco

Un equipement Cisco maintient **deux configurations** distinctes :

| Configuration | Stockage | Volatile | Commande pour voir |
|--------------|----------|----------|-------------------|
| **Running-config** | **RAM** | Oui (perdue au reboot) | \`show running-config\` |
| **Startup-config** | **NVRAM** | Non (persistante) | \`show startup-config\` |

\`\`\`
                    ┌─────────────────┐
                    │    NVRAM        │
                    │ startup-config  │  ← Configuration sauvegardee
                    └────────┬────────┘
                             │ copy startup-config running-config
                             │ (au demarrage automatiquement)
                             ↓
                    ┌─────────────────┐
                    │      RAM        │
                    │ running-config  │  ← Configuration active
                    └────────┬────────┘
                             │
                    Modifications en temps reel
                    (commandes config)
\`\`\`

### Sauvegarder la configuration

\`\`\`
! Methode 1 : Sauvegarder la running-config dans la NVRAM
Router# copy running-config startup-config
Destination filename [startup-config]? ← Entree
Building configuration...
[OK]

! Abreviation courante :
Router# copy run start
Router# wr             ← Raccourci historique (write memory)

! Methode 2 : Sauvegarder sur un serveur TFTP
Router# copy running-config tftp:
Address or name of remote host? 10.10.99.50
Destination filename [router-confg]? R1-backup-2024.cfg
\`\`\`

### Systeme de fichiers IOS

\`\`\`
Router# show file systems

File Systems:
  Size(b)   Free(b)   Type    Flags  Prefixes
  256487424 188823552  disk    rw     flash:     ← Stockage principal (IOS image)
  262136    249783     nvram   rw     nvram:     ← Startup-config
  -         -          opaque  rw     system:    ← Running-config (RAM)
  -         -          network rw     tftp:      ← Serveur TFTP
  -         -          network rw     ftp:       ← Serveur FTP

Router# dir flash:
Directory of flash:/
  1  -rwx  108820736  c2900-universalk9-mz.SPA.157-3.M.bin
  2  -rwx  1456       startup-config

Router# dir nvram:
Directory of nvram:/
  1  -rwx  1456       startup-config
\`\`\`

### Commandes essentielles de gestion de fichiers

\`\`\`
! Copier la config sur TFTP (backup)
Router# copy running-config tftp://10.10.99.50/R1-config.cfg

! Restaurer depuis TFTP
Router# copy tftp://10.10.99.50/R1-config.cfg running-config

! Effacer la startup-config (retour usine)
Router# erase startup-config
Router# reload

! Copier une image IOS depuis TFTP
Router# copy tftp://10.10.99.50/c2900-image.bin flash:
\`\`\`

> **A retenir :** Toute modification de configuration est d'abord en **RAM** (running-config). Si l'equipement redemarre sans \`copy run start\`, les modifications sont **perdues**. C'est une erreur classique en lab et en production.`
      },
      {
        title: 'Show version et informations systeme',
        content: `### La commande show version

\`show version\` est l'une des commandes les plus importantes. Elle affiche les informations essentielles de l'equipement :

\`\`\`
Router# show version

Cisco IOS Software, ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M),
  Version 17.6.3, RELEASE SOFTWARE (fc4)

ROM: IOS-XE ROMMON

Router uptime is 45 days, 12 hours, 30 minutes
System returned to ROM by power-on
System image file is "bootflash:packages.conf"

cisco ISR4331/K9 (1RU) processor with 1795072K/6147K bytes of memory.
Processor board ID FGL1234567X
3 Gigabit Ethernet interfaces
32768K bytes of non-volatile configuration memory.
4194304K bytes of physical memory.
3207167K bytes of flash memory at bootflash:.

Configuration register is 0x2102
\`\`\`

### Informations cles a retenir

| Information | Ligne | Usage |
|-------------|-------|-------|
| **Version IOS** | \`Version 17.6.3\` | Compatibilite, vulnerabilites |
| **Uptime** | \`uptime is 45 days...\` | Depuis quand tourne l'equipement |
| **Raison du dernier reboot** | \`returned to ROM by power-on\` | Diagnostic (crash ? coupure ?) |
| **Image IOS** | \`System image file\` | Quel fichier IOS est charge |
| **Modele** | \`cisco ISR4331/K9\` | Modele hardware |
| **Numero de serie** | \`FGL1234567X\` | Identification unique |
| **RAM** | \`1795072K bytes of memory\` | Memoire disponible |
| **Flash** | \`3207167K bytes of flash\` | Espace stockage |
| **Config register** | \`0x2102\` | Mode de demarrage |

### Le Configuration Register

Le **configuration register** (config-register) est une valeur hexadecimale de 16 bits qui controle le comportement au demarrage :

| Valeur | Comportement |
|--------|-------------|
| **0x2102** | Normal — charge l'IOS depuis flash et la startup-config depuis NVRAM |
| **0x2142** | **Ignore la startup-config** — utilise pour le **password recovery** |
| **0x2101** | Charge le mini-IOS depuis la ROM (mode maintenance) |
| **0x2100** | Demarre en mode ROMMON (mode maintenance bas niveau) |

\`\`\`
! Voir le config-register actuel
Router# show version | include Configuration register

! Modifier le config-register
Router(config)# config-register 0x2102
\`\`\`

### Autres commandes systeme utiles

\`\`\`
! Utilisation memoire RAM
Router# show processes memory

! Utilisation CPU
Router# show processes cpu

! Historique des redemarrages
Router# show reload

! Informations hardware detaillees
Router# show inventory

! Voir les interfaces et leur etat
Router# show ip interface brief

! Voir les logs systeme
Router# show logging
\`\`\`

> **Point CCNA :** \`show version\` est une commande incontournable. Sachez localiser la version IOS, le modele, l'uptime, et le configuration register dans la sortie de cette commande. Le config-register **0x2102** est la valeur normale, **0x2142** est utilise pour le password recovery.`
      },
      {
        title: 'Sequence de boot IOS et password recovery',
        content: `### Sequence de demarrage d'un equipement Cisco

Quand un routeur ou switch Cisco est mis sous tension, il suit une sequence de demarrage precise :

\`\`\`
1. POST (Power-On Self Test)
   └→ Verification du hardware (CPU, RAM, interfaces)

2. Chargement du bootstrap (ROM)
   └→ Programme minimal pour trouver et charger l'IOS

3. Lecture du Configuration Register
   └→ Determine comment demarrer (normal, recovery, ROMMON)

4. Recherche de l'image IOS (dans cet ordre) :
   a) Commande boot system dans la startup-config
   b) Premier fichier .bin dans flash:
   c) Chargement depuis TFTP (si configure)
   d) Mini-IOS en ROM (dernier recours)

5. Chargement de l'IOS en RAM
   └→ Decompression et execution

6. Chargement de la configuration :
   a) startup-config depuis NVRAM
   b) Si pas de startup-config → mode Setup (assistant)
\`\`\`

### Configurer l'ordre de boot

\`\`\`
! Specifier quelle image charger en priorite
Router(config)# boot system flash:c2900-universalk9-mz.SPA.157-3.M.bin

! Image de secours sur TFTP
Router(config)# boot system tftp://10.10.99.50/c2900-backup.bin

! Sauvegarder pour que ce soit pris en compte au prochain boot
Router# copy run start
\`\`\`

### Password Recovery — Procedure de recuperation

Si vous avez perdu le mot de passe **enable secret**, voici la procedure pour le reinitialiser. Cette procedure necessite un **acces physique** au port console.

\`\`\`
Etape 1 : Redemarrer l'equipement et interrompre le boot
          (Ctrl+Break ou Ctrl+C pendant les 60 premieres secondes)
          → Acces au mode ROMMON

rommon 1 >

Etape 2 : Modifier le config-register pour ignorer la startup-config
rommon 1 > confreg 0x2142
rommon 2 > reset
          → L'equipement redemarre sans charger la startup-config

Etape 3 : Copier la startup-config en running-config
Router> enable           ← Pas de mot de passe demande !
Router# copy startup-config running-config

Etape 4 : Modifier le mot de passe
Router(config)# enable secret NouveauMotDePasse!

Etape 5 : Restaurer le config-register normal
Router(config)# config-register 0x2102

Etape 6 : Sauvegarder et redemarrer
Router# copy running-config startup-config
Router# reload
\`\`\`

### Recapitulatif des memoires

| Memoire | Type | Contenu | Volatile |
|---------|------|---------|----------|
| **ROM** | Read-Only | Bootstrap, POST, mini-IOS | Non |
| **Flash** | Stockage | Image IOS (.bin) | Non |
| **NVRAM** | Non-volatile | startup-config, config-register | Non |
| **RAM** | Volatile | running-config, tables de routage, ARP, buffers | **Oui** |

\`\`\`
                ┌──────┐
                │ ROM  │ → POST + Bootstrap
                └──┬───┘
                   ↓
                ┌──────┐
                │Flash │ → Image IOS (fichier .bin)
                └──┬───┘
                   ↓ Chargement en RAM
                ┌──────┐     ┌───────┐
                │ RAM  │ ←── │ NVRAM │ → startup-config
                └──────┘     └───────┘
                   ↑
            running-config
            tables ARP, routage
            buffers, file d'attente
\`\`\`

> **Essentiel CCNA :** La procedure de password recovery est un classique de l'examen. Retenez : interrompre le boot → config-register 0x2142 → reset → copier startup en running → changer le mot de passe → config-register 0x2102 → sauvegarder. L'acces physique est **obligatoire**, ce qui est une mesure de securite en soi.`
      }
    ]
  }
]
