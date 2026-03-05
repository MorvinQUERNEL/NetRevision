import type { Chapter } from './chapters'

export const chapters2: Chapter[] = [
  {
    id: 12,
    slug: 'vlans-trunking',
    title: 'VLANs et Trunking 802.1Q',
    subtitle: 'Segmentation logique du reseau et transport multi-VLAN',
    icon: 'Network',
    color: '#6366f1',
    duration: '50 min',
    level: 'Intermediaire',
    videoId: 'yxJDsl2K1Fk',
    sections: [
      {
        title: 'Concept des VLANs',
        content: `Un **VLAN** (Virtual Local Area Network) est un reseau local virtuel qui permet de segmenter logiquement un reseau physique en plusieurs domaines de broadcast independants. Contrairement a une segmentation physique (un switch par departement), les VLANs permettent de regrouper des machines sur un meme switch ou reparties sur plusieurs switches, selon des criteres logiques (departement, fonction, securite).

### Pourquoi utiliser des VLANs ?

- **Reduction des domaines de broadcast** : chaque VLAN forme son propre domaine de broadcast, limitant le trafic inutile
- **Securite** : les machines d'un VLAN ne peuvent pas communiquer directement avec celles d'un autre VLAN sans routage
- **Flexibilite** : un utilisateur peut changer de bureau sans changer de VLAN (reconfiguration logicielle)
- **Performance** : moins de broadcast = moins de charge sur les machines et le reseau
- **Organisation** : regroupement par fonction (compta, RH, IT) plutot que par localisation physique

### Plages de VLANs

| Plage | Type | Usage |
|-------|------|-------|
| **1** | VLAN par defaut | Tous les ports sont dans le VLAN 1 a l'initialisation. Ne pas l'utiliser en production |
| **2-1001** | VLANs standard | VLANs utilisateur, stockes dans la flash (vlan.dat) |
| **1002-1005** | VLANs reserves | Token Ring et FDDI (obsolete, ne pas toucher) |
| **1006-4094** | VLANs etendus | Necessitent VTP mode transparent ou VTPv3, stockes en running-config |

### Types de VLANs

- **VLAN de donnees** : transporte le trafic utilisateur (ex : VLAN 10 Comptabilite, VLAN 20 RH)
- **VLAN voix (Voice VLAN)** : dedie au trafic VoIP, avec priorite QoS (CoS 5 par defaut)
- **VLAN de management** : utilise pour administrer les switches (SSH, Telnet, SNMP). On lui attribue une SVI (Switch Virtual Interface)
- **VLAN natif** : VLAN dont le trafic transite **non tague** sur un trunk (par defaut VLAN 1)

> **Conseil CCNA** : Sur l'examen, on vous demandera souvent de distinguer VLAN de donnees, VLAN voix et VLAN natif. Le VLAN natif est un piege classique : il doit etre identique des deux cotes d'un trunk, sinon vous aurez un "native VLAN mismatch".`
      },
      {
        title: 'Ports Access et Trunk',
        content: `### Port Access

Un port en mode **access** appartient a un seul VLAN. Il connecte generalement un equipement terminal (PC, imprimante, telephone IP). Les trames qui transitent sur un port access ne portent **aucun tag VLAN** : le switch ajoute le tag en interne a la reception et le retire a l'emission.

\`\`\`
Switch(config)# interface FastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
\`\`\`

Pour un telephone IP avec un PC derriere (double VLAN) :
\`\`\`
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# switchport voice vlan 50
\`\`\`

### Port Trunk

Un port en mode **trunk** transporte le trafic de **plusieurs VLANs** simultanement. Il est utilise entre switches, entre un switch et un routeur, ou vers un serveur multi-VLAN. Chaque trame est **taguee** avec l'identifiant du VLAN auquel elle appartient (sauf le VLAN natif).

\`\`\`
Switch(config)# interface GigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30,99
Switch(config-if)# switchport trunk native vlan 99
\`\`\`

### Comparaison Access vs Trunk

| Critere | Port Access | Port Trunk |
|---------|------------|------------|
| VLANs transportes | 1 seul | Plusieurs |
| Tag 802.1Q | Non (ajoute/retire par le switch) | Oui (sauf VLAN natif) |
| Equipement connecte | PC, imprimante, telephone | Switch, routeur, serveur |
| Commande | \`switchport mode access\` | \`switchport mode trunk\` |

### Verification

\`\`\`
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show interfaces fa0/1 switchport
\`\`\`

> **Astuce CCNA** : La commande \`show vlan brief\` affiche les VLANs et les ports access associes. Les ports trunk n'apparaissent PAS dans cette commande. Utilisez \`show interfaces trunk\` pour les voir.`
      },
      {
        title: 'Trunking 802.1Q en detail',
        content: `### Le protocole 802.1Q (Dot1Q)

IEEE 802.1Q est le standard de trunking qui insere un **tag de 4 octets** dans l'en-tete de la trame Ethernet pour identifier le VLAN d'appartenance.

### Structure du tag 802.1Q

\`\`\`
Trame Ethernet standard :
| Dest MAC (6) | Src MAC (6) | EtherType (2) | Data | FCS (4) |

Trame avec tag 802.1Q :
| Dest MAC (6) | Src MAC (6) | Tag 802.1Q (4) | EtherType (2) | Data | FCS (4) |
\`\`\`

Le tag 802.1Q de 4 octets se decompose ainsi :

| Champ | Taille | Description |
|-------|--------|-------------|
| **TPID** (Tag Protocol Identifier) | 16 bits | Valeur fixe \`0x8100\` — identifie la trame comme taguee 802.1Q |
| **PCP** (Priority Code Point) | 3 bits | Priorite CoS (0 a 7), utilise pour la QoS. VoIP utilise typiquement CoS 5 |
| **DEI** (Drop Eligible Indicator) | 1 bit | Indique si la trame peut etre supprimee en cas de congestion |
| **VID** (VLAN Identifier) | 12 bits | Identifiant du VLAN (0 a 4095). 0 = priorite seule, 4095 = reserve |

### Le VLAN natif

Le VLAN natif est le seul VLAN dont les trames ne sont **pas taguees** sur un lien trunk. Par defaut, c'est le VLAN 1.

**Regles importantes :**
- Le VLAN natif **doit etre identique** des deux cotes du trunk
- Si les VLANs natifs different, CDP affiche un message "Native VLAN mismatch"
- Les trames non taguees recues sur un trunk sont placees dans le VLAN natif

**Bonne pratique securite :**
\`\`\`
! Changer le VLAN natif (ne pas laisser VLAN 1)
Switch(config-if)# switchport trunk native vlan 99

! Taguer meme le VLAN natif (prevention VLAN hopping)
Switch(config)# vlan dot1q tag native
\`\`\`

### Ancien protocole : ISL (Inter-Switch Link)

ISL etait le protocole de trunking **proprietaire Cisco**. Il **encapsulait** entierement la trame (ajout d'un en-tete de 26 octets + trailer de 4 octets). ISL est **obsolete** et n'est plus supporte sur les switches modernes. Le CCNA 200-301 se concentre exclusivement sur 802.1Q.

> **Point examen** : Retenez que 802.1Q modifie la trame originale (insertion du tag) tandis qu'ISL l'encapsulait. Le TPID \`0x8100\` est une valeur frequemment demandee a l'examen.`
      },
      {
        title: 'DTP et negociation de trunk',
        content: `### DTP — Dynamic Trunking Protocol

DTP est un protocole **proprietaire Cisco** qui permet a deux switches de negocier automatiquement si un lien doit etre en mode access ou trunk.

### Modes DTP

| Mode | Comportement | Commande |
|------|-------------|----------|
| **Access** | Force le port en access, refuse le trunk | \`switchport mode access\` |
| **Trunk** | Force le port en trunk, envoie des trames DTP | \`switchport mode trunk\` |
| **Dynamic Auto** | Attend passivement une demande de trunk. Devient trunk si l'autre cote est trunk ou desirable | \`switchport mode dynamic auto\` |
| **Dynamic Desirable** | Initie activement la negociation trunk. Devient trunk si l'autre cote est trunk, desirable ou auto | \`switchport mode dynamic desirable\` |

### Matrice de negociation DTP

| | Access | Trunk | Dynamic Auto | Dynamic Desirable |
|---|--------|-------|-------------|-------------------|
| **Access** | Access | - | Access | Access |
| **Trunk** | - | Trunk | Trunk | Trunk |
| **Dynamic Auto** | Access | Trunk | Access | Trunk |
| **Dynamic Desirable** | Access | Trunk | Trunk | Trunk |

> **Note** : Le tiret (-) indique un conflit de configuration qui peut causer des problemes.

### Desactiver DTP (bonne pratique)

En production, il est **fortement recommande** de desactiver DTP pour eviter des failles de securite (attaque VLAN hopping via DTP spoofing) :

\`\`\`
! Sur un port access
Switch(config-if)# switchport mode access
Switch(config-if)# switchport nonegotiate

! Sur un port trunk
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport nonegotiate
\`\`\`

La commande \`switchport nonegotiate\` empeche le port d'envoyer des trames DTP.

### Verification

\`\`\`
Switch# show dtp interface fa0/1
Switch# show interfaces fa0/1 switchport
\`\`\`

La sortie \`show interfaces switchport\` affiche :
- **Administrative Mode** : le mode configure
- **Operational Mode** : le mode effectif apres negociation
- **Negotiation of Trunking** : On ou Off (nonegotiate)

> **Conseil securite CCNA** : Toujours configurer explicitement les ports en \`access\` ou \`trunk\` et ajouter \`nonegotiate\`. Ne jamais laisser un port en mode \`dynamic auto\` (mode par defaut sur de nombreux switches) car un attaquant pourrait negocier un trunk et acceder a tous les VLANs.`
      },
      {
        title: 'Configuration complete et verification',
        content: `### Scenario pratique

Vous avez deux switches (SW1 et SW2) relies par un trunk. Trois VLANs sont necessaires : VLAN 10 (Compta), VLAN 20 (IT), VLAN 99 (Management).

### Etape 1 : Creer les VLANs (sur chaque switch)

\`\`\`
SW1(config)# vlan 10
SW1(config-vlan)# name Comptabilite
SW1(config-vlan)# exit
SW1(config)# vlan 20
SW1(config-vlan)# name IT
SW1(config-vlan)# exit
SW1(config)# vlan 99
SW1(config-vlan)# name Management
SW1(config-vlan)# exit
\`\`\`

### Etape 2 : Configurer les ports access

\`\`\`
! Ports pour la comptabilite
SW1(config)# interface range fa0/1-10
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 10
SW1(config-if-range)# switchport nonegotiate
SW1(config-if-range)# exit

! Ports pour l'IT
SW1(config)# interface range fa0/11-20
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 20
SW1(config-if-range)# switchport nonegotiate
\`\`\`

### Etape 3 : Configurer le trunk entre les switches

\`\`\`
SW1(config)# interface gi0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,99
SW1(config-if)# switchport nonegotiate
\`\`\`

### Etape 4 : Configurer la SVI de management

\`\`\`
SW1(config)# interface vlan 99
SW1(config-if)# ip address 192.168.99.1 255.255.255.0
SW1(config-if)# no shutdown
SW1(config)# ip default-gateway 192.168.99.254
\`\`\`

### Commandes de verification essentielles

\`\`\`
! Voir tous les VLANs et leurs ports
SW1# show vlan brief

! Voir les interfaces trunk
SW1# show interfaces trunk

! Detail d'un port specifique
SW1# show interfaces fa0/1 switchport

! Voir la configuration du VLAN
SW1# show running-config | section vlan
\`\`\`

### Exemple de sortie show vlan brief

\`\`\`
VLAN Name                  Status    Ports
---- -------------------- --------- ----------------------------
1    default              active    Fa0/21, Fa0/22, Fa0/23, Fa0/24
10   Comptabilite         active    Fa0/1, Fa0/2, ..., Fa0/10
20   IT                   active    Fa0/11, Fa0/12, ..., Fa0/20
99   Management           active
\`\`\`

> **Rappel** : Le trunk (Gi0/1) n'apparait pas dans \`show vlan brief\`. C'est normal et c'est un piege classique a l'examen CCNA.`
      }
    ]
  },
  {
    id: 13,
    slug: 'spanning-tree',
    title: 'Spanning Tree Protocol (RPVST+)',
    subtitle: 'Prevention des boucles et convergence rapide',
    icon: 'GitBranch',
    color: '#6366f1',
    duration: '50 min',
    level: 'Intermediaire',
    videoId: 'ykDDrQ_PF-E',
    sections: [
      {
        title: 'Pourquoi STP est indispensable',
        content: `### Le probleme : les boucles de couche 2

Dans un reseau d'entreprise, la **redondance** est essentielle. On connecte les switches entre eux par plusieurs chemins pour eviter qu'une panne de lien coupe la communication. Mais cette redondance physique cree un probleme majeur : les **boucles de commutation**.

### Consequences d'une boucle sans STP

1. **Broadcast storm** : une trame broadcast (ex : ARP request) est transmise sur tous les ports sauf celui de reception. Si une boucle existe, la trame revient et est retransmise indefiniment. En quelques secondes, le reseau est sature a 100%.

2. **Instabilite de la table MAC** : un switch voit la meme adresse MAC source arriver sur differents ports (via les differents chemins de la boucle). Sa table MAC oscille constamment, empechant une commutation correcte.

3. **Duplication de trames** : les trames unicast peuvent etre recues en double, triple, etc., causant des erreurs applicatives.

### Illustration d'une boucle

\`\`\`
    SW1 ----Lien A---- SW2
     |                   |
     |                   |
    Lien C            Lien B
     |                   |
     |                   |
    SW3 ----Lien D---- SW3
\`\`\`

Un broadcast envoye par un PC sur SW1 :
- SW1 le transmet a SW2 (via Lien A) et a SW3 (via Lien C)
- SW2 le retransmet a SW3 (via Lien B)
- SW3 le retransmet a SW1 (via Lien C ou D)
- Le cycle recommence indefiniment

### La solution : STP (IEEE 802.1D)

Le **Spanning Tree Protocol** resout ce probleme en creant une **topologie logique sans boucle** au-dessus de la topologie physique redondante. Il bloque certains ports de maniere a ce qu'il n'existe qu'un seul chemin actif entre deux points du reseau, tout en conservant les liens de secours en reserve.

STP a ete invente par **Radia Perlman** en 1985 et normalise en IEEE 802.1D.

> **Point CCNA** : STP fonctionne a la **couche 2**. Il utilise des trames speciales appelees BPDU (Bridge Protocol Data Unit) envoyees en multicast a l'adresse \`01:80:C2:00:00:00\`.`
      },
      {
        title: 'Fonctionnement de STP',
        content: `### Etape 1 : Election du Root Bridge

Tous les switches participent a une election pour designer un **Root Bridge** (pont racine). C'est le switch de reference autour duquel la topologie sans boucle sera construite.

**Critere d'election** : le switch avec le **Bridge ID** le plus bas gagne.

Le Bridge ID se compose de :
| Champ | Taille | Description |
|-------|--------|-------------|
| **Bridge Priority** | 4 bits | Priorite (0 a 61440, par pas de 4096). Defaut : 32768 |
| **Extended System ID** | 12 bits | Numero du VLAN (permet un root bridge different par VLAN) |
| **MAC Address** | 48 bits | Adresse MAC du switch (departage si priorites egales) |

Pour forcer un switch comme Root Bridge :
\`\`\`
! Methode 1 : Definir la priorite manuellement
SW1(config)# spanning-tree vlan 10 priority 4096

! Methode 2 : Macro automatique (recommande)
SW1(config)# spanning-tree vlan 10 root primary
! Configure la priorite a 24576 (ou 4096 de moins que le root actuel)

SW2(config)# spanning-tree vlan 10 root secondary
! Configure la priorite a 28672 (root de secours)
\`\`\`

### Etape 2 : Election des roles de ports

Chaque port de chaque switch se voit attribuer un role :

| Role | Description | Etat |
|------|-------------|------|
| **Root Port (RP)** | Le port qui offre le meilleur chemin vers le Root Bridge. Un seul par switch non-root | Forwarding |
| **Designated Port (DP)** | Le port qui offre le meilleur chemin vers le Root Bridge sur un segment donne. Un par segment | Forwarding |
| **Blocked Port** | Tous les autres ports. Ils ne transmettent pas de trafic utilisateur | Blocking |

### Calcul du cout du chemin (Path Cost)

| Debit du lien | Cout STP (802.1D) | Cout RSTP (802.1w) |
|---------------|-------------------|---------------------|
| 10 Mbps | 100 | 2 000 000 |
| 100 Mbps | 19 | 200 000 |
| 1 Gbps | 4 | 20 000 |
| 10 Gbps | 2 | 2 000 |

Le **Root Path Cost** d'un port est la somme des couts de tous les liens entre ce port et le Root Bridge.

> **Regle de departage** : si deux ports ont le meme cout, on compare le Bridge ID du voisin, puis le Port ID (priorite + numero).`
      },
      {
        title: 'BPDU et convergence STP classique',
        content: `### BPDU — Bridge Protocol Data Unit

Les switches echangent des **BPDU** pour partager les informations de topologie. Il en existe deux types :

- **Configuration BPDU** : envoye par le Root Bridge toutes les 2 secondes (Hello Timer), puis relayes par les switches. Contient le Root Bridge ID, le cout du chemin, le Bridge ID de l'emetteur, l'age du BPDU.
- **TCN BPDU** (Topology Change Notification) : envoye par un switch quand il detecte un changement de topologie (port qui tombe ou qui remonte).

### Timers STP

| Timer | Valeur par defaut | Role |
|-------|-------------------|------|
| **Hello Timer** | 2 secondes | Intervalle entre les BPDU du Root Bridge |
| **Forward Delay** | 15 secondes | Duree des etats Listening et Learning |
| **Max Age** | 20 secondes | Duree maximale de validite d'un BPDU. Passe ce delai, un port bloque commence la transition |

### Etats des ports STP (802.1D)

Quand un port transite de Blocking a Forwarding, il passe par plusieurs etats :

| Etat | Duree | Envoie des trames ? | Apprend les MAC ? | Recoit les BPDU ? |
|------|-------|--------------------|--------------------|-------------------|
| **Disabled** | - | Non | Non | Non |
| **Blocking** | Max Age (20s) | Non | Non | Oui |
| **Listening** | Forward Delay (15s) | Non | Non | Oui |
| **Learning** | Forward Delay (15s) | Non | **Oui** | Oui |
| **Forwarding** | - | **Oui** | **Oui** | Oui |

### Temps de convergence

Le temps de convergence de STP 802.1D est de :
\`\`\`
Max Age (20s) + Listening (15s) + Learning (15s) = 50 secondes
\`\`\`

Pendant ces **50 secondes**, le port ne transmet aucun trafic utilisateur. C'est beaucoup trop lent pour les reseaux modernes, ce qui a motive le developpement de RSTP.

### Changement de topologie

Quand un switch detecte qu'un port en Forwarding tombe :
1. Il envoie un **TCN BPDU** vers le Root Bridge via son Root Port
2. Chaque switch intermediaire acquitte avec un TCA (Topology Change Acknowledgment)
3. Le Root Bridge envoie des BPDU avec le flag TC (Topology Change) pendant Max Age + Forward Delay
4. Tous les switches reduisent leur timer d'expiration MAC a Forward Delay (15s) au lieu de 300s

> **Point examen** : Le timer de convergence de 50 secondes est une valeur classique demandee au CCNA. Retenez aussi que seul le Root Bridge genere les Configuration BPDU.`
      },
      {
        title: 'RSTP et RPVST+',
        content: `### RSTP — Rapid Spanning Tree Protocol (IEEE 802.1w)

RSTP est une evolution majeure de STP qui reduit le temps de convergence de **50 secondes a quelques secondes** (typiquement 1 a 3 secondes).

### Nouveaux roles de ports RSTP

| Role | Equivalent STP | Description |
|------|---------------|-------------|
| **Root Port** | Root Port | Meilleur chemin vers le Root Bridge |
| **Designated Port** | Designated Port | Meilleur port sur un segment |
| **Alternate Port** | Blocked Port | Chemin alternatif vers le Root Bridge (remplace immediatement le Root Port en cas de panne) |
| **Backup Port** | Blocked Port | Chemin de secours vers le meme segment (rare, deux ports du meme switch sur le meme segment) |

### Etats des ports RSTP (simplifies)

| Etat RSTP | Equivalent STP | Apprend MAC | Transmet trafic |
|-----------|----------------|-------------|-----------------|
| **Discarding** | Disabled / Blocking / Listening | Non | Non |
| **Learning** | Learning | Oui | Non |
| **Forwarding** | Forwarding | Oui | Oui |

### Mecanismes de convergence rapide

1. **Proposal/Agreement** : un switch qui detecte un lien actif envoie un Proposal a son voisin. Si le voisin accepte (Agreement), le port passe directement en Forwarding sans attendre les timers. Ce mecanisme fonctionne uniquement sur les liens **point-a-point** (full-duplex).

2. **Alternate Port** : le port Alternate est pre-calcule. Si le Root Port tombe, l'Alternate Port prend le relais **immediatement** sans aucun timer.

3. **Edge Port** : un port connecte a un equipement terminal (PC, serveur) est declare Edge Port. Il passe directement en Forwarding sans attendre STP. Equivalent de PortFast dans l'implementation Cisco.

### RPVST+ (Rapid Per-VLAN Spanning Tree Plus)

C'est l'implementation **Cisco** de RSTP, avec une instance STP separee par VLAN. Avantages :
- Load balancing possible en designant des Root Bridges differents par VLAN
- Un changement de topologie dans un VLAN n'affecte pas les autres

\`\`\`
! Activer RPVST+ (recommande par Cisco)
Switch(config)# spanning-tree mode rapid-pvst

! Verifier le mode actif
Switch# show spanning-tree summary
\`\`\`

### Comparaison des variantes STP

| Protocole | Standard | Instance par VLAN | Convergence |
|-----------|----------|-------------------|-------------|
| **STP** | 802.1D | Non (CST) | ~50 secondes |
| **PVST+** | Cisco | Oui | ~50 secondes |
| **RSTP** | 802.1w | Non | ~1-3 secondes |
| **RPVST+** | Cisco | Oui | ~1-3 secondes |
| **MST** | 802.1s | Par groupe de VLANs | ~1-3 secondes |

> **Conseil CCNA** : RPVST+ est le mode par defaut sur les switches Cisco modernes et c'est celui que vous devez maitriser pour l'examen 200-301. MST (Multiple Spanning Tree) est hors programme.`
      },
      {
        title: 'PortFast, BPDU Guard et bonnes pratiques',
        content: `### PortFast

PortFast permet a un port de passer **directement de Blocking a Forwarding** sans passer par les etats Listening et Learning (gain de 30 secondes). Il est destine aux ports connectes a des equipements terminaux (PC, imprimante, serveur).

\`\`\`
! Activer PortFast sur un port specifique
Switch(config)# interface fa0/1
Switch(config-if)# spanning-tree portfast

! Activer PortFast sur tous les ports access par defaut
Switch(config)# spanning-tree portfast default
\`\`\`

**Attention** : Ne **jamais** activer PortFast sur un port connecte a un autre switch. Si un BPDU est recu sur un port PortFast, le port revient au fonctionnement STP normal (perd l'avantage PortFast).

### BPDU Guard

BPDU Guard desactive (err-disable) un port si un BPDU est recu dessus. C'est une protection essentielle : si quelqu'un connecte un switch non autorise sur un port access avec PortFast, le port se desactive immediatement.

\`\`\`
! Activer BPDU Guard sur un port
Switch(config-if)# spanning-tree bpduguard enable

! Activer BPDU Guard sur tous les ports PortFast
Switch(config)# spanning-tree portfast bpduguard default
\`\`\`

### Recuperer un port en err-disable

\`\`\`
! Voir les ports en err-disable
Switch# show interfaces status err-disabled

! Reactiver manuellement
Switch(config)# interface fa0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown

! Reactivation automatique (optionnel)
Switch(config)# errdisable recovery cause bpduguard
Switch(config)# errdisable recovery interval 300
\`\`\`

### Autres protections STP

| Fonction | Role | Commande |
|----------|------|----------|
| **BPDU Filter** | Empeche l'envoi et la reception de BPDU sur un port | \`spanning-tree bpdufilter enable\` |
| **Root Guard** | Empeche un port de devenir Root Port (bloque les BPDU superieurs) | \`spanning-tree guard root\` |
| **Loop Guard** | Detecte les boucles unidirectionnelles (perte de BPDU) | \`spanning-tree guard loop\` |

### Commandes de verification STP

\`\`\`
! Vue globale STP pour un VLAN
Switch# show spanning-tree vlan 10

! Resume de toutes les instances
Switch# show spanning-tree summary

! Detail d'une interface
Switch# show spanning-tree interface gi0/1 detail

! Voir le Root Bridge
Switch# show spanning-tree root
\`\`\`

### Resume des bonnes pratiques

1. Utiliser **RPVST+** (\`spanning-tree mode rapid-pvst\`)
2. Definir un **Root Bridge** deterministe (\`root primary\` / \`root secondary\`)
3. Activer **PortFast** sur tous les ports access
4. Activer **BPDU Guard** sur tous les ports PortFast
5. Configurer **Root Guard** sur les ports ou aucun switch externe ne devrait devenir root
6. Desactiver les ports inutilises (\`shutdown\`) et les placer dans un VLAN inutilise

> **Astuce examen** : PortFast + BPDU Guard est la combinaison la plus souvent testee au CCNA. Retenez que PortFast accelere la convergence pour les hotes, et BPDU Guard protege contre les switches non autorises.`
      }
    ]
  },
  {
    id: 14,
    slug: 'inter-vlan-routing',
    title: 'Inter-VLAN Routing',
    subtitle: 'Communication entre VLANs via routeur ou switch L3',
    icon: 'Split',
    color: '#6366f1',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'RL1k9Oyn5QI',
    sections: [
      {
        title: 'Pourquoi le routage inter-VLAN ?',
        content: `### Le probleme

Les VLANs segmentent le reseau en domaines de broadcast isoles. C'est leur objectif principal : la **separation**. Mais dans la realite, les utilisateurs de differents VLANs ont besoin de communiquer. Le VLAN Comptabilite doit pouvoir acceder au serveur de fichiers du VLAN IT, et tous les VLANs doivent acceder a Internet.

### Le principe fondamental

Un switch de couche 2 ne peut **pas** router le trafic entre les VLANs. Pour qu'un paquet passe d'un VLAN a un autre, il doit traverser un equipement de **couche 3** : un routeur ou un switch multicouche (Layer 3 switch).

### Les trois methodes de routage inter-VLAN

| Methode | Equipement | Avantage | Inconvenient |
|---------|-----------|----------|-------------|
| **Routeur avec interfaces separees** | Routeur + switch | Simple a comprendre | 1 interface physique par VLAN, ne scale pas |
| **Router-on-a-stick** | Routeur + switch (trunk) | 1 seul lien physique, economique | Goulot d'etranglement sur le lien, latence |
| **Switch Layer 3 (SVI)** | Switch multicouche | Performance, tout en interne, wire-speed | Cout plus eleve |

### Methode 1 : Interfaces physiques separees (legacy)

Chaque VLAN est connecte a une interface physique du routeur. Cette methode est **obsolete** car elle necessite autant d'interfaces routeur que de VLANs et autant de cables physiques.

\`\`\`
VLAN 10 (Fa0/0) ---- [Routeur] ---- VLAN 20 (Fa0/1)
\`\`\`

Cette methode n'est plus utilisee en production ni testee au CCNA 200-301, mais il est utile de la connaitre pour comprendre l'evolution.

> **A retenir** : Le routage inter-VLAN necessite toujours un equipement de couche 3. Sans routeur ni switch L3, les VLANs sont **completement isoles**.`
      },
      {
        title: 'Router-on-a-Stick',
        content: `### Principe

Le **Router-on-a-Stick** (ROAS) utilise un seul lien physique entre le routeur et le switch, configure en **trunk 802.1Q**. Le routeur cree des **sous-interfaces** (subinterfaces) logiques, une par VLAN, chacune avec son propre encapsulation 802.1Q et son adresse IP.

\`\`\`
                    Trunk 802.1Q
PC VLAN 10 ---[Switch]=========[Routeur]
PC VLAN 20 ---[Switch]    Gi0/0.10 (VLAN 10)
PC VLAN 30 ---[Switch]    Gi0/0.20 (VLAN 20)
                          Gi0/0.30 (VLAN 30)
\`\`\`

### Configuration du switch

\`\`\`
! Configurer le port vers le routeur en trunk
Switch(config)# interface gi0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# switchport trunk native vlan 99
\`\`\`

### Configuration du routeur

\`\`\`
! Activer l'interface physique
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# no shutdown

! Sous-interface pour VLAN 10
Router(config)# interface GigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0

! Sous-interface pour VLAN 20
Router(config)# interface GigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0

! Sous-interface pour VLAN 30
Router(config)# interface GigabitEthernet 0/0.30
Router(config-subif)# encapsulation dot1Q 30
Router(config-subif)# ip address 192.168.30.1 255.255.255.0

! Sous-interface pour le VLAN natif (optionnel)
Router(config)# interface GigabitEthernet 0/0.99
Router(config-subif)# encapsulation dot1Q 99 native
Router(config-subif)# ip address 192.168.99.1 255.255.255.0
\`\`\`

### Points importants

- Le numero de sous-interface (ex: \`.10\`) n'a pas besoin de correspondre au VLAN, mais c'est une **bonne pratique** pour la lisibilite
- La commande \`encapsulation dot1Q <vlan-id>\` est **obligatoire** sur chaque sous-interface
- L'interface physique (Gi0/0) ne doit **pas** avoir d'adresse IP
- Chaque sous-interface sert de **passerelle par defaut** pour son VLAN

> **Limite** : Tout le trafic inter-VLAN passe par un seul lien physique. Si le reseau est charge, ce lien devient un goulot d'etranglement. C'est pourquoi les switches L3 sont preferes en production.`
      },
      {
        title: 'Switch Layer 3 et SVI',
        content: `### Principe

Un **switch multicouche** (Layer 3 switch) combine les fonctions de commutation (couche 2) et de routage (couche 3) dans un meme equipement. Le routage inter-VLAN est effectue en **materiel** (ASICs) a vitesse de commutation (wire-speed), sans goulot d'etranglement.

### SVI — Switch Virtual Interface

Une SVI est une **interface logique** associee a un VLAN sur un switch L3. Elle sert de passerelle par defaut pour les machines du VLAN et permet le routage entre VLANs.

### Configuration du switch L3

\`\`\`
! Activer le routage IP (desactive par defaut sur les switches)
Switch(config)# ip routing

! Creer les VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name Comptabilite
Switch(config)# vlan 20
Switch(config-vlan)# name IT
Switch(config)# vlan 30
Switch(config-vlan)# name Direction

! Creer les SVI (interfaces VLAN)
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 30
Switch(config-if)# ip address 192.168.30.1 255.255.255.0
Switch(config-if)# no shutdown

! Configurer les ports access
Switch(config)# interface range gi1/0/1-10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10

Switch(config)# interface range gi1/0/11-20
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
\`\`\`

### Port route sur un switch L3

Un switch L3 peut aussi avoir des **ports routes** (routed ports) qui fonctionnent comme des interfaces de routeur, sans appartenir a un VLAN :

\`\`\`
Switch(config)# interface gi1/0/24
Switch(config-if)# no switchport
Switch(config-if)# ip address 10.0.0.1 255.255.255.252
\`\`\`

### Verification

\`\`\`
Switch# show ip route
Switch# show ip interface brief
Switch# show interfaces vlan 10
\`\`\`

> **Point CCNA** : La commande \`ip routing\` est indispensable sur un switch L3. Sans elle, le switch ne route pas entre les VLANs, meme si les SVI sont configurees. C'est un oubli frequent a l'examen.`
      },
      {
        title: 'Comparaison et choix de la methode',
        content: `### Tableau comparatif detaille

| Critere | Router-on-a-Stick | Switch Layer 3 (SVI) |
|---------|-------------------|---------------------|
| **Equipement** | Routeur + switch L2 | Switch multicouche seul |
| **Performance** | Limitee par la bande passante du trunk | Wire-speed (routage materiel) |
| **Cout** | Moins cher (switch L2 basique) | Plus cher (switch L3 type Catalyst 3650+) |
| **Complexite** | Sous-interfaces a configurer | SVI simples a configurer |
| **Scalabilite** | Faible (10-20 VLANs max) | Excellente (centaines de VLANs) |
| **Point de defaillance** | Lien trunk unique | Redondance integree (VSS, StackWise) |
| **Cas d'usage** | Petit reseau, lab, formation | Reseau de production, campus |

### Quand utiliser quoi ?

**Router-on-a-Stick** :
- Petit reseau (PME < 50 utilisateurs)
- Budget limite
- Deja un routeur disponible
- Environnement de lab ou formation

**Switch Layer 3** :
- Reseau d'entreprise (> 50 utilisateurs)
- Besoin de haute performance
- Nombreux VLANs
- Besoin de fonctionnalites avancees (ACL L3, OSPF, HSRP)

### Depannage du routage inter-VLAN

Checklist en cas de probleme :

1. **Les VLANs existent-ils ?** → \`show vlan brief\`
2. **Le trunk est-il up ?** → \`show interfaces trunk\`
3. **Les VLANs sont-ils autorises sur le trunk ?** → \`show interfaces trunk\` (colonne Allowed)
4. **Les sous-interfaces ont-elles la bonne encapsulation ?** → \`show interfaces gi0/0.10\`
5. **Les adresses IP sont-elles correctes ?** → \`show ip interface brief\`
6. **Le routage IP est-il active ?** (Switch L3) → \`show ip route\`
7. **Les passerelles par defaut sont-elles configurees sur les PCs ?**

\`\`\`
! Verification rapide sur le routeur
Router# show ip interface brief
Router# show vlans

! Verification sur le switch L3
Switch# show ip route
Switch# show ip interface brief
Switch# show interfaces vlan 10
\`\`\`

> **Piege CCNA** : Si le trafic intra-VLAN fonctionne mais pas le trafic inter-VLAN, verifiez en priorite : (1) \`ip routing\` sur le switch L3, (2) l'encapsulation dot1Q sur les sous-interfaces du ROAS, (3) les passerelles par defaut sur les hotes.`
      }
    ]
  },
  {
    id: 15,
    slug: 'cdp-lldp',
    title: 'CDP et LLDP',
    subtitle: 'Decouverte des voisins et cartographie reseau',
    icon: 'Radio',
    color: '#6366f1',
    duration: '30 min',
    level: 'Debutant',
    videoId: 'jcNKLI7-Eu4',
    sections: [
      {
        title: 'Introduction aux protocoles de decouverte',
        content: `### A quoi servent les protocoles de decouverte ?

Les protocoles de decouverte de voisins permettent a un equipement reseau de **detecter automatiquement** les appareils directement connectes a lui et de collecter des informations sur eux (nom, modele, adresse IP, interfaces connectees, etc.).

### Utilite pratique

- **Cartographie du reseau** : identifier rapidement la topologie physique sans documentation
- **Depannage** : verifier qu'un equipement est bien connecte au bon port
- **Inventaire** : connaitre les modeles et versions d'IOS des equipements voisins
- **Verification du cablage** : confirmer que l'interface locale est bien reliee a l'interface distante attendue

### Les deux protocoles principaux

| Protocole | Type | Standard | Couche |
|-----------|------|----------|--------|
| **CDP** (Cisco Discovery Protocol) | Proprietaire Cisco | - | Couche 2 |
| **LLDP** (Link Layer Discovery Protocol) | Standard ouvert | IEEE 802.1AB | Couche 2 |

### Fonctionnement general

Les deux protocoles fonctionnent de maniere similaire :
1. Chaque equipement envoie periodiquement des **annonces** (advertisements) en **multicast** sur chaque interface active
2. Ces annonces contiennent des informations sur l'equipement emetteur
3. Les equipements voisins recoivent ces annonces et les stockent dans une **table de voisinage**
4. Les annonces ne sont **pas relayees** : seuls les voisins directs (a 1 saut) sont decouverts

> **Important** : CDP et LLDP fonctionnent a la **couche 2** (liaison de donnees). Ils n'ont pas besoin d'adresses IP pour fonctionner. Ils peuvent decouvrir des voisins meme si aucune adresse IP n'est configuree sur les interfaces.`
      },
      {
        title: 'CDP — Cisco Discovery Protocol',
        content: `### Caracteristiques

- **Proprietaire Cisco** : fonctionne uniquement entre equipements Cisco (routeurs, switches, telephones IP Cisco, points d'acces Cisco)
- **Active par defaut** sur tous les equipements Cisco
- **Timer** : envoie des annonces toutes les **60 secondes**
- **Holdtime** : les informations expirent apres **180 secondes** (3 annonces manquees)
- **Adresse multicast** : \`01:00:0C:CC:CC:CC\`
- **Version** : CDPv2 (par defaut sur les switches modernes)

### Informations echangees par CDP

| Information | Description |
|------------|-------------|
| **Device ID** | Nom d'hote (hostname) du voisin |
| **Local Interface** | Interface locale connectee au voisin |
| **Port ID** | Interface du voisin connectee a nous |
| **Platform** | Modele materiel (ex: WS-C2960-24TT) |
| **Capabilities** | Fonctions supportees (R=Router, S=Switch, T=Trans Bridge, H=Host) |
| **IP Address** | Adresse(s) IP de management du voisin |
| **IOS Version** | Version du logiciel (ex: 15.0(2)SE) |
| **Native VLAN** | VLAN natif du trunk (CDPv2) |
| **Duplex** | Half ou Full duplex (CDPv2) |
| **VTP Domain** | Nom du domaine VTP (CDPv2) |

### Commandes CDP

\`\`\`
! Voir tous les voisins (resume)
Switch# show cdp neighbors

! Voir les details complets de chaque voisin
Switch# show cdp neighbors detail

! Voir les informations d'un voisin specifique
Switch# show cdp entry SW2

! Voir l'etat CDP sur toutes les interfaces
Switch# show cdp interface

! Voir les timers et compteurs CDP
Switch# show cdp
\`\`\`

### Exemple de sortie show cdp neighbors

\`\`\`
Device ID    Local Intrfce   Holdtme   Capability   Platform    Port ID
SW2          Gig 0/1         155       S I          WS-C2960    Gig 0/1
R1           Gig 0/2         131       R S I        ISR4321     Gig 0/0/0
Phone1       Fas 0/5         167       H P          IP Phone    Port 1
\`\`\`

### Gestion de CDP

\`\`\`
! Desactiver CDP globalement
Switch(config)# no cdp run

! Reactiver CDP globalement
Switch(config)# cdp run

! Desactiver CDP sur une interface specifique
Switch(config)# interface gi0/1
Switch(config-if)# no cdp enable

! Modifier les timers
Switch(config)# cdp timer 30
Switch(config)# cdp holdtime 120
\`\`\`

> **Securite** : CDP revele des informations sensibles (modele, version IOS, adresses IP). En production, desactivez CDP sur les interfaces connectees a des reseaux non fiables (Internet, DMZ, ports utilisateurs) et gardez-le uniquement sur les liens entre equipements internes.`
      },
      {
        title: 'LLDP — Link Layer Discovery Protocol',
        content: `### Caracteristiques

- **Standard IEEE 802.1AB** : fonctionne entre equipements de **tous les fabricants** (Cisco, Juniper, HP, Aruba, etc.)
- **Desactive par defaut** sur les equipements Cisco (doit etre active manuellement)
- **Timer** : envoie des annonces toutes les **30 secondes**
- **Holdtime** : les informations expirent apres **120 secondes** (4 annonces manquees)
- **Adresse multicast** : \`01:80:C2:00:00:0E\`
- **Reinit delay** : delai de 2 secondes avant d'envoyer sur une interface nouvellement activee

### Informations echangees par LLDP (TLV)

LLDP utilise un format **TLV** (Type-Length-Value) pour structurer les informations :

| TLV | Description | Obligatoire |
|-----|-------------|-------------|
| **Chassis ID** | Identifiant unique de l'equipement (MAC ou nom) | Oui |
| **Port ID** | Identifiant du port emetteur | Oui |
| **TTL** | Duree de validite de l'annonce | Oui |
| **System Name** | Nom d'hote | Non |
| **System Description** | Description (modele, version OS) | Non |
| **Management Address** | Adresse IP de management | Non |
| **Port Description** | Description du port | Non |
| **System Capabilities** | Fonctions supportees (bridge, router, telephone, etc.) | Non |

### LLDP-MED (Media Endpoint Discovery)

Extension de LLDP specifique aux equipements multimedia (telephones IP, cameras). LLDP-MED permet :
- La decouverte automatique du VLAN voix
- La negociation de la politique QoS
- La localisation geographique (pour les appels d'urgence E911)
- La detection de la puissance PoE

### Commandes LLDP sur Cisco

\`\`\`
! Activer LLDP globalement (obligatoire car desactive par defaut)
Switch(config)# lldp run

! Voir les voisins LLDP (resume)
Switch# show lldp neighbors

! Voir les details complets
Switch# show lldp neighbors detail

! Voir l'etat LLDP
Switch# show lldp

! Desactiver LLDP sur une interface
Switch(config-if)# no lldp transmit
Switch(config-if)# no lldp receive

! Modifier les timers
Switch(config)# lldp timer 15
Switch(config)# lldp holdtime 60
\`\`\`

### Exemple de sortie show lldp neighbors

\`\`\`
Capability codes:
  (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device
  (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other

Device ID          Local Intf     Hold-time  Capability  Port ID
JuniperSW1         Gi0/1          120        B,R         ge-0/0/0
HPSwitch3           Gi0/2          90         B           A1
\`\`\`

> **Point CCNA** : La difference cle entre CDP et LLDP est que CDP est **proprietaire Cisco** (active par defaut) et LLDP est **standard IEEE** (desactive par defaut sur Cisco). Dans un environnement multi-constructeur, LLDP est indispensable.`
      },
      {
        title: 'Comparaison CDP vs LLDP et securite',
        content: `### Tableau comparatif CDP vs LLDP

| Critere | CDP | LLDP |
|---------|-----|------|
| **Standard** | Proprietaire Cisco | IEEE 802.1AB |
| **Compatibilite** | Cisco uniquement | Multi-constructeur |
| **Actif par defaut (Cisco)** | Oui | Non |
| **Timer d'annonce** | 60 secondes | 30 secondes |
| **Holdtime** | 180 secondes | 120 secondes |
| **Adresse multicast** | 01:00:0C:CC:CC:CC | 01:80:C2:00:00:0E |
| **Version** | CDPv1, CDPv2 | LLDP, LLDP-MED |
| **Format des donnees** | Champs fixes + TLV | TLV uniquement |
| **Support Voice VLAN** | Oui (CDPv2) | Oui (LLDP-MED) |
| **Couche OSI** | Couche 2 | Couche 2 |

### Coexistence CDP et LLDP

CDP et LLDP peuvent fonctionner **simultanement** sur un meme equipement Cisco. C'est meme recommande dans les environnements mixtes :

\`\`\`
Switch(config)# cdp run
Switch(config)# lldp run
\`\`\`

Le switch enverra alors les deux types d'annonces et recevra les informations des deux protocoles.

### Implications de securite

CDP et LLDP sont des **risques de securite** car ils divulguent des informations sensibles :

| Information exposee | Risque |
|--------------------|--------|
| Modele de l'equipement | Permet de cibler des vulnerabilites connues |
| Version IOS/OS | Identification d'exploits specifiques a la version |
| Adresse IP de management | Cible pour attaques SSH/Telnet brute force |
| Topologie reseau | Cartographie facilitee pour l'attaquant |
| VLAN natif | Potentiel pour attaque VLAN hopping |

### Bonnes pratiques securite

\`\`\`
! Desactiver CDP/LLDP sur les ports utilisateurs
Switch(config)# interface range fa0/1-24
Switch(config-if-range)# no cdp enable
Switch(config-if-range)# no lldp transmit
Switch(config-if-range)# no lldp receive

! Garder CDP/LLDP uniquement sur les uplinks (vers les switches/routeurs)
Switch(config)# interface gi0/1
Switch(config-if)# cdp enable
Switch(config-if)# lldp transmit
Switch(config-if)# lldp receive
\`\`\`

### Cas d'usage specifiques

**Telephones IP Cisco** : CDP (ou LLDP-MED) est necessaire pour que le telephone decouvre automatiquement son VLAN voix et les parametres QoS. Ne desactivez pas CDP/LLDP sur les ports ou des telephones sont connectes.

**Points d'acces Wi-Fi** : CDP/LLDP est utile pour le provisionnement automatique et la detection PoE. Les controllers WLC utilisent CDP pour decouvrir les AP.

> **Conseil examen CCNA** : Les questions CDP/LLDP portent souvent sur la lecture de la sortie \`show cdp neighbors\` ou \`show lldp neighbors detail\`. Entrainez-vous a identifier le Device ID, l'interface locale, le Port ID distant et les capabilities.`
      }
    ]
  },
  {
    id: 16,
    slug: 'etherchannel-lacp',
    title: 'EtherChannel (LACP)',
    subtitle: 'Agregation de liens pour performance et redondance',
    icon: 'Link',
    color: '#6366f1',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'clpDi5yPiQ8',
    sections: [
      {
        title: 'Concept de l\'agregation de liens',
        content: `### Le probleme

Quand la bande passante entre deux switches est insuffisante, la solution evidente serait d'ajouter des liens physiques. Mais STP bloquera tous les liens sauf un pour eviter les boucles ! Vous avez donc 4 cables Gigabit mais seulement 1 Gbps de bande passante effective.

### La solution : EtherChannel

**EtherChannel** (aussi appele Port Channel ou Link Aggregation) regroupe plusieurs liens physiques en un seul **lien logique**. STP voit ce groupe comme un seul lien et ne bloque aucun des liens membres.

\`\`\`
Sans EtherChannel :                  Avec EtherChannel :
SW1 ---Gi0/1--- SW2 (active)        SW1 ===Po1=== SW2 (4 Gbps logique)
SW1 ---Gi0/2--- SW2 (STP blocked)        Gi0/1 ─┤
SW1 ---Gi0/3--- SW2 (STP blocked)        Gi0/2 ─┤ Port-Channel 1
SW1 ---Gi0/4--- SW2 (STP blocked)        Gi0/3 ─┤
Bande passante : 1 Gbps              Gi0/4 ─┘
                                     Bande passante : 4 Gbps
\`\`\`

### Avantages

- **Bande passante agregee** : la capacite totale est la somme des liens individuels (ex : 4 x 1 Gbps = 4 Gbps)
- **Redondance** : si un lien physique tombe, les autres continuent de fonctionner. Le Port-Channel reste actif tant qu'au moins un lien est up
- **Pas de boucle STP** : STP considere le Port-Channel comme un seul lien
- **Convergence rapide** : pas de recalcul STP quand un seul lien membre tombe

### Limites et regles

- Maximum **8 liens physiques** par EtherChannel
- Tous les liens membres doivent avoir les **memes caracteristiques** : vitesse, duplex, VLAN, mode trunk/access, VLAN natif, allowed VLANs
- Si les parametres different entre les membres, l'EtherChannel ne se formera pas
- Le numero de Port-Channel va de 1 a 48 (varie selon le modele)

> **Analogie** : EtherChannel, c'est comme elargir une autoroute. Au lieu d'une voie a 1 Gbps, vous avez 4 voies a 1 Gbps chacune, soit 4 Gbps au total, avec la securite que si une voie est bloquee, les 3 autres prennent le relais.`
      },
      {
        title: 'LACP vs PAgP',
        content: `### Deux protocoles de negociation

Pour former un EtherChannel de maniere dynamique et securisee, les switches utilisent un protocole de negociation :

| Protocole | Type | Standard |
|-----------|------|----------|
| **LACP** (Link Aggregation Control Protocol) | Standard ouvert | IEEE 802.3ad (puis 802.1AX) |
| **PAgP** (Port Aggregation Protocol) | Proprietaire Cisco | - |

### LACP — Link Aggregation Control Protocol

LACP est le protocole **standard** (multi-constructeur) pour la negociation d'EtherChannel.

| Mode | Comportement |
|------|-------------|
| **Active** | Initie activement la negociation LACP en envoyant des LACPDU |
| **Passive** | Attend passivement les LACPDU mais repond si sollicite |

**Matrice de formation :**
| | Active | Passive |
|---|--------|---------|
| **Active** | EtherChannel forme | EtherChannel forme |
| **Passive** | EtherChannel forme | PAS d'EtherChannel |

### PAgP — Port Aggregation Protocol

PAgP est le protocole **proprietaire Cisco** pour la negociation d'EtherChannel.

| Mode | Comportement |
|------|-------------|
| **Desirable** | Initie activement la negociation PAgP |
| **Auto** | Attend passivement mais repond si sollicite |

**Matrice de formation :**
| | Desirable | Auto |
|---|-----------|------|
| **Desirable** | EtherChannel forme | EtherChannel forme |
| **Auto** | EtherChannel forme | PAS d'EtherChannel |

### Mode statique (On)

Le mode **On** force la creation de l'EtherChannel **sans protocole de negociation**. Les deux cotes doivent etre configures en mode On. C'est risque car il n'y a aucune verification de coherence.

**Regles de compatibilite des modes :**
| | On | LACP Active | LACP Passive | PAgP Desirable | PAgP Auto |
|---|---|---|---|---|---|
| **On** | Oui | Non | Non | Non | Non |
| **LACP Active** | Non | Oui | Oui | Non | Non |
| **LACP Passive** | Non | Oui | Non | Non | Non |
| **PAgP Desirable** | Non | Non | Non | Oui | Oui |
| **PAgP Auto** | Non | Non | Non | Oui | Non |

> **Recommandation CCNA** : Utilisez toujours **LACP** (standard, multi-constructeur). Configurez au moins un cote en **active** pour garantir la formation. PAgP n'est utile que dans un environnement 100% Cisco. Evitez le mode On en production.`
      },
      {
        title: 'Configuration EtherChannel',
        content: `### Configuration avec LACP (recommande)

\`\`\`
! Sur SW1
SW1(config)# interface range gi0/1-4
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit

! Configurer le Port-Channel comme trunk
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20,30
SW1(config-if)# switchport trunk native vlan 99

! Sur SW2
SW2(config)# interface range gi0/1-4
SW2(config-if-range)# channel-group 1 mode passive
SW2(config-if-range)# exit

SW2(config)# interface port-channel 1
SW2(config-if)# switchport mode trunk
SW2(config-if)# switchport trunk allowed vlan 10,20,30
SW2(config-if)# switchport trunk native vlan 99
\`\`\`

### Configuration avec PAgP

\`\`\`
SW1(config)# interface range gi0/1-4
SW1(config-if-range)# channel-group 1 mode desirable

SW2(config)# interface range gi0/1-4
SW2(config-if-range)# channel-group 1 mode auto
\`\`\`

### Configuration statique (mode On)

\`\`\`
SW1(config)# interface range gi0/1-4
SW1(config-if-range)# channel-group 1 mode on

SW2(config)# interface range gi0/1-4
SW2(config-if-range)# channel-group 1 mode on
\`\`\`

### EtherChannel Layer 3

Sur un switch L3, on peut configurer un EtherChannel avec une adresse IP (port route) :

\`\`\`
SW1(config)# interface range gi0/1-4
SW1(config-if-range)# no switchport
SW1(config-if-range)# channel-group 1 mode active

SW1(config)# interface port-channel 1
SW1(config-if)# no switchport
SW1(config-if)# ip address 10.0.0.1 255.255.255.252
\`\`\`

### Points importants de configuration

- Configurez d'abord le **channel-group** sur les interfaces physiques, puis configurez le **port-channel** logique
- Les parametres du port-channel s'appliquent a tous les membres
- Si vous modifiez un parametre sur une interface membre (ex: speed), il doit etre identique sur tous les membres sinon l'EtherChannel se dissout

> **Piege CCNA** : Si vous configurez le trunk sur les interfaces physiques AVANT de creer le channel-group, les parametres seront herites par le port-channel. Mais la bonne pratique est de configurer le port-channel APRES la creation du channel-group.`
      },
      {
        title: 'Load balancing et verification',
        content: `### Load Balancing EtherChannel

Le trafic est reparti sur les liens membres selon une methode de **load balancing** (hachage). Le switch ne fait pas du round-robin (trame par trame) car cela causerait des problemes de reordonnancement. Il utilise un **algorithme de hash** sur un ou plusieurs champs de la trame/paquet.

### Methodes de load balancing

| Methode | Commande | Description |
|---------|----------|-------------|
| **src-mac** | \`port-channel load-balance src-mac\` | Hash sur l'adresse MAC source |
| **dst-mac** | \`port-channel load-balance dst-mac\` | Hash sur l'adresse MAC destination |
| **src-dst-mac** | \`port-channel load-balance src-dst-mac\` | Hash sur les 2 adresses MAC |
| **src-ip** | \`port-channel load-balance src-ip\` | Hash sur l'IP source |
| **dst-ip** | \`port-channel load-balance dst-ip\` | Hash sur l'IP destination |
| **src-dst-ip** | \`port-channel load-balance src-dst-ip\` | Hash sur les 2 adresses IP |

\`\`\`
! Changer la methode (configuration globale)
Switch(config)# port-channel load-balance src-dst-ip

! Verifier la methode active
Switch# show etherchannel load-balance
\`\`\`

**Choix de la methode :**
- **src-dst-ip** est generalement le meilleur choix car il offre la meilleure distribution dans la plupart des scenarios
- Si un seul serveur est la destination de tout le trafic, \`dst-ip\` sera inefficace (tout ira sur le meme lien). Utilisez \`src-ip\` dans ce cas.

### Commandes de verification

\`\`\`
! Vue d'ensemble de tous les EtherChannels
Switch# show etherchannel summary

! Detail d'un EtherChannel specifique
Switch# show etherchannel 1 detail

! Voir le protocole utilise
Switch# show etherchannel protocol

! Voir les compteurs de trafic par membre
Switch# show etherchannel 1 port-channel
\`\`\`

### Exemple de sortie show etherchannel summary

\`\`\`
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer 3     S - Layer 2
        U - in use      f - failed to allocate aggregator

Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)       LACP       Gi0/1(P) Gi0/2(P) Gi0/3(P) Gi0/4(P)
\`\`\`

**Lecture** : \`SU\` = Layer 2, in Use. \`P\` = bundled (membre actif). Un port \`D\` serait down, \`s\` serait suspendu.

### Depannage EtherChannel

| Probleme | Cause possible | Verification |
|----------|---------------|-------------|
| EtherChannel ne se forme pas | Modes incompatibles (passive/passive, auto/auto) | \`show etherchannel summary\` |
| Membre suspendu (s) | Parametres differents (speed, duplex, VLAN) | \`show interfaces status\` |
| Faible performance | Mauvais load balancing | \`show etherchannel load-balance\` |
| Boucle STP sur le channel | Un cote en mode On, l'autre en LACP | Verifier les modes des deux cotes |

> **Conseil CCNA** : A l'examen, on vous demande souvent d'analyser la sortie de \`show etherchannel summary\`. Memorisez les flags : P = bundled (OK), D = down, s = suspended, I = standalone. Si un port est en (I), il ne fait pas partie du bundle.`
      }
    ]
  },
  {
    id: 17,
    slug: 'table-routage',
    title: 'La table de routage en detail',
    subtitle: 'Structure, types de routes et selection du meilleur chemin',
    icon: 'Map',
    color: '#6366f1',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'ceI0U__y7Ak',
    sections: [
      {
        title: 'Structure de la table de routage',
        content: `### Qu'est-ce que la table de routage ?

La table de routage est une **base de donnees** maintenue par le routeur qui contient toutes les routes connues vers les reseaux de destination. Quand un paquet arrive, le routeur consulte cette table pour determiner par quelle interface et vers quel prochain saut (next-hop) envoyer le paquet.

### Comment afficher la table de routage

\`\`\`
Router# show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile,
       B - BGP, D - EIGRP, EX - EIGRP external, O - OSPF,
       IA - OSPF inter area, N1 - OSPF NSSA external type 1,
       N2 - OSPF NSSA external type 2, E1 - OSPF external type 1,
       E2 - OSPF external type 2, i - IS-IS, su - IS-IS summary,
       L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area,
       * - candidate default, U - per-user static route, o - ODR,
       P - periodic downloaded static route

Gateway of last resort is 10.0.0.1 to network 0.0.0.0

     10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C       10.0.0.0/30 is directly connected, GigabitEthernet0/0
L       10.0.0.2/32 is directly connected, GigabitEthernet0/0
     192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
C       192.168.1.0/24 is directly connected, GigabitEthernet0/1
L       192.168.1.1/32 is directly connected, GigabitEthernet0/1
S    192.168.2.0/24 [1/0] via 10.0.0.1
O    192.168.3.0/24 [110/20] via 10.0.0.1, 00:05:23, GigabitEthernet0/0
S*   0.0.0.0/0 [1/0] via 10.0.0.1
\`\`\`

### Anatomie d'une entree de route

Prenons la route : \`O 192.168.3.0/24 [110/20] via 10.0.0.1, 00:05:23, Gi0/0\`

| Element | Signification |
|---------|--------------|
| **O** | Code de la source de la route (OSPF) |
| **192.168.3.0/24** | Reseau de destination avec son masque CIDR |
| **[110/20]** | [Distance administrative / Metrique] |
| **via 10.0.0.1** | Adresse IP du prochain saut (next-hop) |
| **00:05:23** | Age de la route (depuis combien de temps elle est connue) |
| **Gi0/0** | Interface de sortie |

### Gateway of Last Resort

La ligne "Gateway of last resort" indique la **route par defaut** du routeur. Si aucune route specifique ne correspond a la destination, le paquet est envoye vers cette passerelle.

> **Point CCNA** : Savoir lire et interpreter la sortie de \`show ip route\` est une competence fondamentale testee a l'examen. Chaque element a son importance.`
      },
      {
        title: 'Types de routes',
        content: `### Routes directement connectees (C et L)

Quand une interface est configuree avec une adresse IP et activee (\`no shutdown\`), le routeur ajoute automatiquement deux entrees :

- **C (Connected)** : route vers le reseau auquel l'interface appartient (ex: \`192.168.1.0/24\`)
- **L (Local)** : route vers l'adresse IP exacte de l'interface avec un masque /32 (ex: \`192.168.1.1/32\`)

\`\`\`
C    192.168.1.0/24 is directly connected, GigabitEthernet0/1
L    192.168.1.1/32 is directly connected, GigabitEthernet0/1
\`\`\`

### Routes statiques (S)

Configurees manuellement par l'administrateur :

\`\`\`
S    192.168.2.0/24 [1/0] via 10.0.0.1
S*   0.0.0.0/0 [1/0] via 10.0.0.1        ← route par defaut (* = candidate default)
\`\`\`

### Routes dynamiques

Apprises automatiquement par les protocoles de routage :

| Code | Protocole | Type |
|------|-----------|------|
| **R** | RIP | Distance vector |
| **D** | EIGRP | Hybrid (advanced distance vector) |
| **O** | OSPF | Link-state |
| **O IA** | OSPF Inter-Area | Routes entre zones OSPF |
| **O E1/E2** | OSPF External | Routes redistribuees dans OSPF |
| **B** | BGP | Path vector (EGP) |
| **i** | IS-IS | Link-state |

### Tableau recapitulatif des types de routes

| Type | Source | Fiabilite | Configuration |
|------|--------|-----------|---------------|
| **Connected (C)** | Interface active | Absolue | Automatique |
| **Local (L)** | Interface active | Absolue | Automatique |
| **Static (S)** | Admin | Haute | Manuelle |
| **OSPF (O)** | Protocole | Moyenne | Automatique |
| **EIGRP (D)** | Protocole | Moyenne | Automatique |
| **RIP (R)** | Protocole | Basse | Automatique |
| **BGP (B)** | Protocole | Variable | Automatique |

> **Conseil CCNA** : Les routes Connected et Local sont toujours les plus fiables car elles correspondent a des reseaux directement accessibles. Elles ne peuvent pas disparaitre tant que l'interface est up.`
      },
      {
        title: 'Distance administrative et metrique',
        content: `### Distance administrative (AD)

La distance administrative est une valeur qui represente la **fiabilite** d'une source de route. Plus la valeur est basse, plus la source est consideree comme fiable. Quand un routeur connait plusieurs routes vers la meme destination via des protocoles differents, il choisit celle avec l'AD la plus basse.

### Tableau des distances administratives par defaut

| Source de route | Distance administrative |
|----------------|----------------------|
| Connected (C) | **0** |
| Static (S) | **1** |
| eBGP | **20** |
| EIGRP interne (D) | **90** |
| IGRP | **100** |
| OSPF (O) | **110** |
| IS-IS | **115** |
| RIP (R) | **120** |
| EIGRP externe (EX) | **170** |
| iBGP | **200** |
| Unknown / inaccessible | **255** (route ignoree) |

### La metrique

La metrique est utilisee pour choisir entre **plusieurs routes apprises par le meme protocole**. Chaque protocole a sa propre methode de calcul :

| Protocole | Metrique basee sur |
|-----------|--------------------|
| **RIP** | Nombre de sauts (max 15, 16 = inaccessible) |
| **OSPF** | Cout (base sur la bande passante : 10^8 / bandwidth) |
| **EIGRP** | Composite (bande passante, delai, fiabilite, charge) |
| **BGP** | Attributs multiples (AS-Path, MED, Local Preference, etc.) |

### Exemple de selection de route

Un routeur connait 3 routes vers 192.168.10.0/24 :
\`\`\`
O    192.168.10.0/24 [110/20] via 10.0.0.1     ← OSPF, AD=110
D    192.168.10.0/24 [90/2170112] via 10.0.0.2  ← EIGRP, AD=90
R    192.168.10.0/24 [120/3] via 10.0.0.3       ← RIP, AD=120
\`\`\`

Le routeur choisit la route **EIGRP** car elle a l'AD la plus basse (90). Les routes OSPF et RIP sont conservees en memoire comme backup : si la route EIGRP disparait, la route OSPF (AD 110) prend le relais.

### Modifier la distance administrative

On peut modifier l'AD d'une route statique pour creer une **route flottante** (floating static route) :
\`\`\`
! Route statique avec AD modifiee a 200
Router(config)# ip route 192.168.10.0 255.255.255.0 10.0.0.5 200
\`\`\`

Cette route ne sera utilisee que si aucune route avec une AD inferieure n'existe (backup).

> **Moyen mnemotechnique** : "Connected 0, Static 1, EIGRP 90, OSPF 110, RIP 120". Ces 5 valeurs sont les plus demandees au CCNA. Retenez-les par coeur.`
      },
      {
        title: 'Longest Prefix Match',
        content: `### Le principe du Longest Prefix Match

Quand un routeur doit acheminer un paquet, il peut y avoir **plusieurs routes qui correspondent** a l'adresse de destination. Le routeur utilise la regle du **Longest Prefix Match** (correspondance au prefixe le plus long) : il choisit la route dont le masque est le plus specifique (le plus long).

### Exemple concret

La table de routage contient :
\`\`\`
S    10.0.0.0/8 via 192.168.1.1
S    10.1.0.0/16 via 192.168.1.2
S    10.1.1.0/24 via 192.168.1.3
S    10.1.1.128/25 via 192.168.1.4
\`\`\`

Un paquet arrive pour la destination **10.1.1.200** :

| Route | Masque | Correspond ? | Prefixe |
|-------|--------|-------------|---------|
| 10.0.0.0/8 | 255.0.0.0 | Oui (10.x.x.x) | /8 |
| 10.1.0.0/16 | 255.255.0.0 | Oui (10.1.x.x) | /16 |
| 10.1.1.0/24 | 255.255.255.0 | Oui (10.1.1.x) | /24 |
| 10.1.1.128/25 | 255.255.255.128 | Oui (10.1.1.128-255) | **/25** |

Le routeur choisit **10.1.1.128/25** car /25 est le prefixe le plus long (le plus specifique). Le paquet est envoye vers 192.168.1.4.

### Ordre de decision du routeur

Le processus complet de selection d'une route est :

1. **Longest Prefix Match** : choisir la route avec le masque le plus long
2. **Distance administrative** : si plusieurs routes ont le meme masque mais des sources differentes, choisir l'AD la plus basse
3. **Metrique** : si meme masque ET meme protocole, choisir la metrique la plus basse
4. **Load balancing** : si meme masque, meme protocole ET meme metrique, partager le trafic (equal-cost load balancing)

### Importance de la route par defaut

La route par defaut \`0.0.0.0/0\` a le prefixe le plus court possible (/0). Elle ne sera donc utilisee que si **aucune autre route** ne correspond. C'est bien le comportement souhaite : c'est la route de "dernier recours".

\`\`\`
! La route par defaut matche TOUTE destination mais avec le plus petit prefixe
S*   0.0.0.0/0 [1/0] via 10.0.0.1
\`\`\`

### Routes Local (/32)

Les routes Local avec un masque /32 sont les plus specifiques possible. Elles correspondent a une seule adresse IP : l'adresse de l'interface du routeur lui-meme. Cela permet au routeur de reconnaitre le trafic qui lui est destine.

> **Astuce examen** : Le Longest Prefix Match est un concept FONDAMENTAL du routage IP. A l'examen, on vous donnera une table de routage et une IP de destination, et vous devrez determiner quelle route sera utilisee. Regardez toujours le masque en premier, pas l'AD ni la metrique.`
      },
      {
        title: 'Analyse pratique de show ip route',
        content: `### Exercice d'analyse

Voici une table de routage complete a analyser :

\`\`\`
Router# show ip route
Codes: L - local, C - connected, S - static, O - OSPF

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

     10.0.0.0/8 is variably subnetted, 4 subnets, 3 masks
C       10.10.0.0/30 is directly connected, Serial0/0/0
L       10.10.0.2/32 is directly connected, Serial0/0/0
C       10.20.0.0/30 is directly connected, Serial0/0/1
L       10.20.0.1/32 is directly connected, Serial0/0/1
     172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C       172.16.1.0/24 is directly connected, GigabitEthernet0/0
L       172.16.1.1/32 is directly connected, GigabitEthernet0/0
O    172.16.2.0/24 [110/65] via 10.10.0.1, 01:23:45, Serial0/0/0
O    172.16.3.0/24 [110/65] via 10.20.0.2, 00:45:12, Serial0/0/1
S    192.168.0.0/16 [1/0] via 10.10.0.1
O    192.168.5.0/24 [110/129] via 10.10.0.1, 00:30:00, Serial0/0/0
                    [110/129] via 10.20.0.2, 00:30:00, Serial0/0/1
S*   0.0.0.0/0 [1/0] via 203.0.113.1
\`\`\`

### Questions d'analyse

**Q1 : Un paquet arrive pour 192.168.5.50. Quelle route est utilisee ?**
- La route \`O 192.168.5.0/24\` (/24) est plus specifique que \`S 192.168.0.0/16\` (/16)
- Longest Prefix Match → la route OSPF est choisie
- Deux next-hops avec la meme metrique [110/129] → **load balancing** sur les deux liens

**Q2 : Un paquet arrive pour 192.168.10.5. Quelle route ?**
- Pas de route /24 specifique. \`S 192.168.0.0/16\` correspond → via 10.10.0.1

**Q3 : Un paquet arrive pour 8.8.8.8. Quelle route ?**
- Aucune route specifique ne correspond → route par defaut \`0.0.0.0/0\` → via 203.0.113.1

**Q4 : Combien d'interfaces actives a ce routeur ?**
- 3 : Serial0/0/0, Serial0/0/1, GigabitEthernet0/0 (les interfaces avec des routes C/L)

### Commandes de verification complementaires

\`\`\`
! Route specifique pour une destination
Router# show ip route 192.168.5.50
Routing entry for 192.168.5.0/24
  Known via "ospf 1", distance 110, metric 129, type intra area
  Last update from 10.10.0.1 on Serial0/0/0, 00:30:00 ago
  Routing Descriptor Blocks:
  * 10.10.0.1, from 10.10.0.1, 00:30:00 ago, via Serial0/0/0
      Route metric is 129, traffic share count is 1
    10.20.0.2, from 10.20.0.2, 00:30:00 ago, via Serial0/0/1
      Route metric is 129, traffic share count is 1

! Filtrer par protocole
Router# show ip route ospf
Router# show ip route static
Router# show ip route connected
\`\`\`

> **Methode examen** : Face a une question \`show ip route\`, procedez toujours dans cet ordre : (1) trouvez toutes les routes qui matchent la destination, (2) selectionnez celle avec le prefixe le plus long, (3) en cas d'egalite de prefixe, comparez l'AD, (4) en cas d'egalite d'AD, comparez la metrique.`
      }
    ]
  },
  {
    id: 18,
    slug: 'routage-statique',
    title: 'Routage statique',
    subtitle: 'Configuration manuelle des routes et route par defaut',
    icon: 'Navigation',
    color: '#6366f1',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'BKs14dKMRHo',
    sections: [
      {
        title: 'Principes du routage statique',
        content: `### Definition

Une **route statique** est une route configuree manuellement par l'administrateur dans la table de routage d'un routeur. Contrairement aux routes dynamiques (apprises par OSPF, EIGRP, etc.), les routes statiques ne changent pas automatiquement : elles restent en place tant que l'administrateur ne les modifie pas ou que l'interface de sortie reste active.

### Syntaxe de la commande ip route

\`\`\`
Router(config)# ip route <reseau> <masque> <next-hop | interface> [distance]
\`\`\`

| Parametre | Description |
|-----------|-------------|
| **reseau** | Adresse du reseau de destination |
| **masque** | Masque de sous-reseau en notation decimale |
| **next-hop** | Adresse IP du prochain routeur (passerelle) |
| **interface** | Interface de sortie locale |
| **distance** | Distance administrative (optionnel, defaut = 1) |

### Exemples de configuration

\`\`\`
! Route vers un reseau specifique via un next-hop
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2

! Route vers un reseau specifique via une interface de sortie
Router(config)# ip route 192.168.2.0 255.255.255.0 Serial0/0/0

! Route vers un reseau via next-hop ET interface (fully specified)
Router(config)# ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/0 10.0.0.2
\`\`\`

### Avantages et inconvenients

| Avantages | Inconvenients |
|-----------|--------------|
| Simple a configurer | Ne s'adapte pas aux changements de topologie |
| Pas de consommation CPU/RAM pour les protocoles | Gestion lourde sur les grands reseaux |
| Plus securise (pas d'echange de routes) | Risque d'erreur humaine |
| Controle total de l'administrateur | Pas de load balancing automatique |
| Pas de trafic de routage sur le reseau | Necessite une connaissance complete de la topologie |

### Quand utiliser le routage statique ?

- **Stub networks** : reseaux avec une seule voie de sortie
- **Route par defaut** : vers Internet ou un routeur de bordure
- **Routes flottantes** : backup d'une route dynamique
- **Petits reseaux** : moins de 5 routeurs
- **Liaisons point-a-point** : liens WAN dedies

> **Conseil CCNA** : Le routage statique est toujours pertinent en complement du routage dynamique. Meme dans un reseau OSPF, on utilise souvent une route statique par defaut pour la sortie Internet.`
      },
      {
        title: 'Next-hop vs interface de sortie',
        content: `### Route avec next-hop IP

\`\`\`
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
\`\`\`

Le routeur sait qu'il doit envoyer les paquets au routeur **10.0.0.2**. Mais il doit effectuer une **recherche recursive** (recursive lookup) pour determiner par quelle interface atteindre 10.0.0.2.

**Processus :**
1. Le paquet arrive pour 192.168.2.50
2. La table de routage indique : via 10.0.0.2
3. Le routeur cherche la route vers 10.0.0.2 → trouve que 10.0.0.0/30 est sur Serial0/0/0
4. Le paquet sort par Serial0/0/0

### Route avec interface de sortie

\`\`\`
Router(config)# ip route 192.168.2.0 255.255.255.0 Serial0/0/0
\`\`\`

Le routeur envoie directement les paquets par l'interface Serial0/0/0 sans recherche recursive.

**Attention sur les reseaux multi-acces (Ethernet) :** Si l'interface de sortie est Ethernet (multi-acces), le routeur traitera la destination comme **directement connectee** et enverra une requete ARP pour chaque adresse de destination. Cela peut saturer la table ARP et le CPU.

### Route fully specified

\`\`\`
Router(config)# ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/0 10.0.0.2
\`\`\`

C'est la **meilleure pratique** sur les reseaux multi-acces (Ethernet) : on specifie a la fois l'interface de sortie ET le next-hop. Pas de recherche recursive, pas de requetes ARP inutiles.

### Comparaison des trois methodes

| Methode | Avantage | Inconvenient | Recommandation |
|---------|----------|-------------|----------------|
| Next-hop seul | Simple, fonctionne partout | Recherche recursive (leger overhead) | OK pour les liens point-a-point |
| Interface seule | Pas de recursive lookup | Probleme ARP sur Ethernet (Proxy ARP) | Uniquement sur liens serie |
| Fully specified | Optimal, pas d'ARP, pas de recursion | Plus long a taper | **Recommande** sur Ethernet |

### La recherche recursive (recursive lookup)

\`\`\`
! Table de routage
S    192.168.2.0/24 via 10.0.0.2        ← Route vers destination
C    10.0.0.0/30 via Serial0/0/0        ← Route vers le next-hop

! Processus pour un paquet vers 192.168.2.50 :
! 1. Match 192.168.2.0/24 → next-hop 10.0.0.2
! 2. Match 10.0.0.0/30 → interface Serial0/0/0
! 3. Envoie par Serial0/0/0 vers 10.0.0.2
\`\`\`

> **Point CCNA** : Sur un lien serie (point-a-point), specifier l'interface de sortie seule est acceptable. Sur un lien Ethernet (multi-acces), utilisez toujours un next-hop (ou fully specified) pour eviter les problemes de Proxy ARP.`
      },
      {
        title: 'Route par defaut et routes flottantes',
        content: `### Route par defaut (Default Route)

La route par defaut est une route statique qui correspond a **toutes les destinations**. Elle utilise le reseau 0.0.0.0 avec le masque 0.0.0.0 (ou /0 en CIDR). C'est la route de "dernier recours" : elle est utilisee uniquement si aucune route plus specifique ne correspond.

\`\`\`
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
\`\`\`

Dans la table de routage, elle apparait avec un asterisque (*) :
\`\`\`
S*   0.0.0.0/0 [1/0] via 203.0.113.1
Gateway of last resort is 203.0.113.1 to network 0.0.0.0
\`\`\`

### Cas d'usage de la route par defaut

- **Sortie Internet** : tout le trafic non local est envoye vers le FAI
- **Stub router** : un routeur de site distant envoie tout vers le routeur central
- **Simplification** : evite de configurer des dizaines de routes specifiques

### Routes flottantes (Floating Static Routes)

Une route flottante est une route statique avec une **distance administrative modifiee** (superieure a celle de la route principale). Elle sert de **backup** : elle n'est pas installee dans la table de routage tant que la route principale existe.

\`\`\`
! Route principale via OSPF (AD = 110)
O    192.168.2.0/24 [110/20] via 10.0.0.1

! Route flottante statique (AD = 200, inactive tant qu'OSPF fonctionne)
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.1.1 200
\`\`\`

**Scenario typique :**
\`\`\`
                 Lien principal (fibre)
                 OSPF AD=110
   R1 ========================== R2
    |                            |
    +------- Lien backup -------+
             Route statique AD=200
             (via ADSL ou 4G)
\`\`\`

- En fonctionnement normal : OSPF apprend la route avec AD=110 → route statique (AD=200) ignoree
- Si le lien principal tombe : la route OSPF disparait → route statique (AD=200) s'installe automatiquement
- Quand le lien principal revient : OSPF reapprend la route (AD=110) → route statique (AD=200) se retire

### Routes statiques recapitulatives (Summary Routes)

On peut resumer plusieurs sous-reseaux en une seule route statique :

\`\`\`
! Au lieu de 4 routes specifiques :
! ip route 192.168.0.0 255.255.255.0 10.0.0.1
! ip route 192.168.1.0 255.255.255.0 10.0.0.1
! ip route 192.168.2.0 255.255.255.0 10.0.0.1
! ip route 192.168.3.0 255.255.255.0 10.0.0.1

! Une seule route resumee :
Router(config)# ip route 192.168.0.0 255.255.252.0 10.0.0.1
\`\`\`

> **Astuce CCNA** : Les routes flottantes sont un concept frequemment teste. Retenez que l'AD par defaut d'une route statique est 1. Pour creer un backup d'une route OSPF (AD=110), configurez l'AD de la route flottante a une valeur superieure a 110 (ex: 200).`
      },
      {
        title: 'Routes statiques IPv6',
        content: `### Syntaxe IPv6

\`\`\`
Router(config)# ipv6 route <prefix/length> <next-hop | interface> [distance]
\`\`\`

### Types de routes statiques IPv6

\`\`\`
! Route avec next-hop link-local (necessite l'interface de sortie)
Router(config)# ipv6 route 2001:db8:2::/64 GigabitEthernet0/0 fe80::2

! Route avec next-hop global unicast
Router(config)# ipv6 route 2001:db8:2::/64 2001:db8:1::2

! Route avec interface de sortie (liens point-a-point uniquement)
Router(config)# ipv6 route 2001:db8:2::/64 Serial0/0/0

! Route par defaut IPv6
Router(config)# ipv6 route ::/0 2001:db8:1::1
\`\`\`

### Particularite des adresses link-local comme next-hop

En IPv6, les adresses link-local (\`fe80::/10\`) sont couramment utilisees comme next-hop. Mais comme elles ne sont pas globalement uniques (la meme adresse peut exister sur plusieurs interfaces), il faut **obligatoirement specifier l'interface de sortie** :

\`\`\`
! CORRECT : next-hop link-local + interface
Router(config)# ipv6 route 2001:db8:2::/64 GigabitEthernet0/0 fe80::2

! INCORRECT : next-hop link-local seul (le routeur ne sait pas par ou sortir)
Router(config)# ipv6 route 2001:db8:2::/64 fe80::2
\`\`\`

### Activer le routage IPv6

N'oubliez pas d'activer le routage IPv6 unicast globalement :
\`\`\`
Router(config)# ipv6 unicast-routing
\`\`\`

Sans cette commande, le routeur ne routera pas les paquets IPv6 meme si les routes sont configurees.

### Verification

\`\`\`
Router# show ipv6 route
Router# show ipv6 route static
Router# show ipv6 route ::/0
\`\`\`

### Comparaison routage statique IPv4 vs IPv6

| Aspect | IPv4 | IPv6 |
|--------|------|------|
| Commande | \`ip route\` | \`ipv6 route\` |
| Notation | Reseau + masque decimal | Prefix/length |
| Next-hop link-local | N/A | Necessite l'interface de sortie |
| Route par defaut | \`0.0.0.0 0.0.0.0\` | \`::/0\` |
| Activation routage | Active par defaut | \`ipv6 unicast-routing\` requis |

> **Piege CCNA** : La commande \`ipv6 unicast-routing\` est obligatoire pour router en IPv6. C'est un oubli tres courant a l'examen. En IPv4, le routage est active des qu'une interface a une IP. En IPv6, il faut explicitement l'activer.`
      },
      {
        title: 'Verification et depannage du routage statique',
        content: `### Commandes de verification essentielles

\`\`\`
! Afficher la table de routage complete
Router# show ip route

! Afficher uniquement les routes statiques
Router# show ip route static

! Tester l'accessibilite d'une destination
Router# ping 192.168.2.1

! Tracer le chemin vers une destination
Router# traceroute 192.168.2.1

! Verifier l'etat des interfaces
Router# show ip interface brief

! Verifier la configuration en cours
Router# show running-config | section ip route
\`\`\`

### Checklist de depannage

**1. La route est-elle dans la table de routage ?**
\`\`\`
Router# show ip route 192.168.2.0
% Network not in table
\`\`\`
Si la route n'apparait pas, verifiez que l'interface de sortie est **up/up** et que le next-hop est accessible.

**2. L'interface est-elle active ?**
\`\`\`
Router# show ip interface brief
Interface           IP-Address      OK? Method Status    Protocol
GigabitEthernet0/0  10.0.0.1        YES manual up        up
Serial0/0/0         10.0.1.1        YES manual up        down
\`\`\`
Un status "down" empeche la route statique d'etre installee.

**3. Le next-hop est-il accessible ?**
\`\`\`
Router# ping 10.0.0.2
!!!!!
Success rate is 100 percent
\`\`\`

**4. Le routage est-il bidirectionnel ?**
Le probleme le plus courant : la route aller est configuree mais pas la route **retour**. Si R1 peut atteindre le reseau de R2, mais R2 n'a pas de route vers le reseau de R1, les reponses ne reviendront jamais.

### Erreurs courantes

| Erreur | Symptome | Solution |
|--------|----------|----------|
| Masque incorrect | Route trop large ou trop etroite | Verifier le masque avec \`show ip route\` |
| Next-hop injoignable | Route absente de la table | Verifier la connectivite vers le next-hop |
| Interface down | Route absente de la table | \`show ip interface brief\`, verifier le cable |
| Route retour manquante | Ping aller OK mais pas de reponse | Configurer la route retour sur le routeur distant |
| Typo dans l'adresse | Trafic mal route | Comparer avec le plan d'adressage |

### Scenario de depannage complet

\`\`\`
! Etape 1 : Verifier la table de routage
Router# show ip route

! Etape 2 : Ping le next-hop
Router# ping 10.0.0.2

! Etape 3 : Ping la destination finale
Router# ping 192.168.2.1

! Etape 4 : Traceroute pour voir ou ca bloque
Router# traceroute 192.168.2.1

! Etape 5 : Verifier sur le routeur distant
! (la route retour existe-t-elle ?)
\`\`\`

> **Methode CCNA** : Face a un probleme de routage statique, verifiez toujours dans cet ordre : (1) les interfaces sont-elles up/up, (2) le next-hop est-il joignable, (3) la route est-elle dans la table, (4) la route retour existe-t-elle. 90% des problemes de routage statique viennent d'une route retour manquante.`
      }
    ]
  },
  {
    id: 19,
    slug: 'ipv6-configuration',
    title: 'Configuration et verification IPv6',
    subtitle: 'Adressage IPv6, SLAAC, DHCPv6 et verification',
    icon: 'Globe',
    color: '#6366f1',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'syfg-vNgTIo',
    sections: [
      {
        title: 'Configuration des adresses IPv6 sur les interfaces',
        content: `### Rappel des types d'adresses IPv6

| Type | Prefixe | Portee | Usage |
|------|---------|--------|-------|
| **GUA** (Global Unicast Address) | 2000::/3 | Internet | Equivalent IP publique IPv4 |
| **Link-Local** | fe80::/10 | Lien local uniquement | Communication avec les voisins directs |
| **Unique Local (ULA)** | fc00::/7 | Site prive | Equivalent IP privee IPv4 |
| **Loopback** | ::1/128 | Machine locale | Equivalent 127.0.0.1 |
| **Multicast** | ff00::/8 | Groupe de destinataires | Remplace le broadcast IPv4 |

### Configuration manuelle d'une GUA

\`\`\`
Router(config)# ipv6 unicast-routing
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ipv6 address 2001:db8:acad:1::1/64
Router(config-if)# no shutdown
\`\`\`

### Adresse Link-Local

L'adresse link-local est generee **automatiquement** (EUI-64) des qu'IPv6 est active sur une interface. Mais on peut la configurer manuellement pour la rendre plus lisible :

\`\`\`
! Link-local automatique (basee sur EUI-64 de la MAC)
! Resultat : fe80::a00:27ff:fe12:3456

! Link-local manuelle (recommande pour les routeurs)
Router(config-if)# ipv6 address fe80::1 link-local
\`\`\`

**Bonne pratique** : Configurer des adresses link-local simples sur les routeurs (fe80::1, fe80::2, etc.) car elles sont utilisees comme next-hop dans les protocoles de routage.

### Methode EUI-64

EUI-64 genere automatiquement les 64 bits d'identifiant d'interface a partir de l'adresse MAC (48 bits) :

\`\`\`
Adresse MAC : AA:BB:CC:DD:EE:FF

Etape 1 : Inserer FF:FE au milieu
AA:BB:CC:FF:FE:DD:EE:FF

Etape 2 : Inverser le 7eme bit (bit U/L)
AA → binaire : 10101010 → inverser bit 7 → 10101000 → A8

Resultat : A8BB:CCFF:FEDD:EEFF
Adresse complete : 2001:db8:acad:1:a8bb:ccff:fedd:eeff/64
\`\`\`

\`\`\`
! Configurer avec EUI-64
Router(config-if)# ipv6 address 2001:db8:acad:1::/64 eui-64
\`\`\`

### Multiple adresses IPv6 par interface

Contrairement a IPv4, une interface IPv6 peut (et a generalement) **plusieurs adresses** :
- Une ou plusieurs GUA
- Une adresse link-local (obligatoire)
- Des adresses multicast (ff02::1 all-nodes, ff02::2 all-routers, solicited-node)

> **Point CCNA** : Chaque interface IPv6 active possede au minimum une adresse link-local. La commande \`ipv6 unicast-routing\` est requise sur les routeurs mais pas sur les hotes. N'oubliez pas cette commande a l'examen.`
      },
      {
        title: 'SLAAC — Stateless Address Autoconfiguration',
        content: `### Principe de SLAAC

SLAAC (RFC 4862) permet a un hote IPv6 de **s'auto-configurer** sans aucun serveur DHCP. L'hote utilise les messages **Router Advertisement (RA)** envoyes par le routeur local pour obtenir le prefixe reseau, puis genere lui-meme son identifiant d'interface.

### Le processus SLAAC

\`\`\`
1. L'hote envoie un Router Solicitation (RS) en multicast (ff02::2)
   "Y a-t-il un routeur sur ce lien ?"

2. Le routeur repond avec un Router Advertisement (RA)
   "Voici le prefixe : 2001:db8:acad:1::/64, la passerelle est fe80::1"

3. L'hote genere son adresse :
   Prefixe du RA + identifiant d'interface (EUI-64 ou aleatoire)
   = 2001:db8:acad:1:a8bb:ccff:fedd:eeff/64

4. L'hote effectue un DAD (Duplicate Address Detection)
   pour verifier que l'adresse n'est pas deja utilisee
\`\`\`

### Les flags du Router Advertisement

Le routeur controle le comportement des hotes via des flags dans le RA :

| Flag | Nom | Valeur | Comportement de l'hote |
|------|-----|--------|----------------------|
| **A** | Autonomous | 1 (defaut) | L'hote utilise le prefixe pour SLAAC |
| **O** | Other Config | 0 (defaut) | 0 = pas de DHCPv6, 1 = DHCPv6 pour DNS, etc. |
| **M** | Managed Config | 0 (defaut) | 0 = SLAAC, 1 = DHCPv6 pour l'adresse |

### Combinaisons des flags

| A | O | M | Methode | Description |
|---|---|---|---------|-------------|
| 1 | 0 | 0 | **SLAAC seul** | L'hote genere tout (adresse + prefixe du RA). Pas de DNS |
| 1 | 1 | 0 | **SLAAC + DHCPv6 stateless** | Adresse par SLAAC, DNS/domaine par DHCPv6 |
| 0 | 0 | 1 | **DHCPv6 stateful** | Tout par DHCPv6 (comme DHCP en IPv4) |

### Configuration sur le routeur

\`\`\`
! SLAAC seul (comportement par defaut)
Router(config-if)# ipv6 address 2001:db8:acad:1::1/64
! Les RA sont envoyes automatiquement

! SLAAC + DHCPv6 stateless (flag O)
Router(config-if)# ipv6 nd other-config-flag

! DHCPv6 stateful (flag M)
Router(config-if)# ipv6 nd managed-config-flag
\`\`\`

### DAD — Duplicate Address Detection

Avant d'utiliser une adresse, l'hote envoie un **Neighbor Solicitation (NS)** vers l'adresse solicited-node correspondante. Si un **Neighbor Advertisement (NA)** est recu en reponse, l'adresse est deja prise et ne sera pas utilisee.

> **Astuce CCNA** : SLAAC est une fonctionnalite unique a IPv6 qui n'a pas d'equivalent en IPv4. Elle simplifie enormement le deploiement reseau. Retenez les combinaisons de flags A/O/M car elles sont frequemment testees.`
      },
      {
        title: 'DHCPv6 stateless et stateful',
        content: `### DHCPv6 Stateless

En mode stateless, le serveur DHCPv6 fournit des informations complementaires (DNS, NTP, domaine) mais **ne distribue pas d'adresses IP**. L'hote obtient son adresse via SLAAC.

**Configuration du routeur comme serveur DHCPv6 stateless :**

\`\`\`
! Creer le pool DHCPv6
Router(config)# ipv6 dhcp pool STATELESS-POOL
Router(config-dhcpv6)# dns-server 2001:4860:4860::8888
Router(config-dhcpv6)# dns-server 2001:4860:4860::8844
Router(config-dhcpv6)# domain-name netrevision.fr
Router(config-dhcpv6)# exit

! Appliquer sur l'interface
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ipv6 dhcp server STATELESS-POOL
Router(config-if)# ipv6 nd other-config-flag
\`\`\`

### DHCPv6 Stateful

En mode stateful, le serveur DHCPv6 distribue les **adresses IPv6** et toutes les autres informations, comme DHCP en IPv4. Le serveur maintient un etat (binding table) des adresses attribuees.

**Configuration du routeur comme serveur DHCPv6 stateful :**

\`\`\`
! Creer le pool DHCPv6 avec plage d'adresses
Router(config)# ipv6 dhcp pool STATEFUL-POOL
Router(config-dhcpv6)# address prefix 2001:db8:acad:1::/64
Router(config-dhcpv6)# dns-server 2001:4860:4860::8888
Router(config-dhcpv6)# domain-name netrevision.fr
Router(config-dhcpv6)# exit

! Appliquer sur l'interface
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ipv6 dhcp server STATEFUL-POOL
Router(config-if)# ipv6 nd managed-config-flag
Router(config-if)# ipv6 nd prefix default no-autoconfig
\`\`\`

### DHCPv6 Relay

Si le serveur DHCPv6 est sur un autre reseau :
\`\`\`
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ipv6 dhcp relay destination 2001:db8:acad:99::10
\`\`\`

### Comparaison des methodes d'attribution IPv6

| Critere | SLAAC seul | SLAAC + DHCPv6 stateless | DHCPv6 stateful |
|---------|-----------|-------------------------|----------------|
| Adresse IP | SLAAC | SLAAC | DHCPv6 |
| Passerelle | RA | RA | RA |
| DNS | Non fourni | DHCPv6 | DHCPv6 |
| Suivi des attributions | Non | Non | Oui |
| Controle des adresses | Non | Non | Oui |
| Complexite | Faible | Moyenne | Elevee |

### Verification

\`\`\`
! Voir les pools DHCPv6
Router# show ipv6 dhcp pool

! Voir les bindings (stateful uniquement)
Router# show ipv6 dhcp binding

! Voir les interfaces DHCPv6
Router# show ipv6 dhcp interface
\`\`\`

> **Conseil CCNA** : Retenez que la **passerelle par defaut** en IPv6 est TOUJOURS fournie par les Router Advertisements (RA), jamais par DHCPv6. C'est une difference fondamentale avec IPv4 ou DHCP fournit aussi la passerelle.`
      },
      {
        title: 'Verification et depannage IPv6',
        content: `### Commandes de verification IPv6

\`\`\`
! Voir les adresses IPv6 de toutes les interfaces
Router# show ipv6 interface brief
GigabitEthernet0/0     [up/up]
    FE80::1                          ← Link-local
    2001:DB8:ACAD:1::1               ← GUA
GigabitEthernet0/1     [up/up]
    FE80::1
    2001:DB8:ACAD:2::1

! Detail complet d'une interface IPv6
Router# show ipv6 interface GigabitEthernet 0/0
GigabitEthernet0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  No Virtual link-local address(es):
  Global unicast address(es):
    2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64
  Joined group address(es):
    FF02::1         ← All-nodes
    FF02::2         ← All-routers
    FF02::1:FF00:1  ← Solicited-node

! Table de routage IPv6
Router# show ipv6 route
C   2001:DB8:ACAD:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
L   2001:DB8:ACAD:1::1/128 [0/0]
     via GigabitEthernet0/0, receive
S   ::/0 [1/0]
     via 2001:DB8:ACAD:99::1

! Voir les voisins IPv6 (equivalent de show arp en IPv4)
Router# show ipv6 neighbors
\`\`\`

### Tests de connectivite

\`\`\`
! Ping IPv6 (GUA)
Router# ping 2001:db8:acad:2::1

! Ping IPv6 link-local (necessite l'interface)
Router# ping fe80::2
Output Interface: GigabitEthernet0/0

! Traceroute IPv6
Router# traceroute 2001:db8:acad:2::1
\`\`\`

### Neighbor Discovery Protocol (NDP)

NDP remplace ARP en IPv6. Il utilise des messages ICMPv6 :

| Message | Type ICMPv6 | Role |
|---------|-------------|------|
| **Router Solicitation (RS)** | 133 | Hote demande les infos du routeur |
| **Router Advertisement (RA)** | 134 | Routeur annonce prefixe, flags, etc. |
| **Neighbor Solicitation (NS)** | 135 | Equivalent ARP Request (qui a cette IP ?) |
| **Neighbor Advertisement (NA)** | 136 | Equivalent ARP Reply (c'est moi !) |
| **Redirect** | 137 | Informe d'un meilleur next-hop |

### Checklist de depannage IPv6

| Etape | Commande | Verification |
|-------|----------|-------------|
| 1 | \`show ipv6 interface brief\` | Les interfaces sont-elles up/up ? |
| 2 | \`show ipv6 interface gi0/0\` | L'adresse IPv6 est-elle correcte ? |
| 3 | \`ping fe80::X\` | Le voisin direct est-il joignable ? |
| 4 | \`show ipv6 route\` | La route vers la destination existe-t-elle ? |
| 5 | \`show ipv6 neighbors\` | Le mapping IPv6-MAC fonctionne-t-il ? |
| 6 | \`show running-config\` | \`ipv6 unicast-routing\` est-il present ? |

### Erreurs frequentes IPv6

- Oubli de \`ipv6 unicast-routing\` sur le routeur
- Oubli de \`no shutdown\` sur l'interface
- Prefixe incorrect dans la configuration d'adresse
- Pas de route retour sur le routeur distant
- Confusion entre link-local et GUA dans les configurations de next-hop

> **Rappel important** : En IPv6, il n'y a **pas de broadcast**. Les fonctions de broadcast (ARP, DHCP discover) sont remplacees par le **multicast** (ff02::1 pour all-nodes, ff02::2 pour all-routers) et le **solicited-node multicast** (ff02::1:ffXX:XXXX) pour la resolution d'adresses.`
      }
    ]
  },
  {
    id: 20,
    slug: 'ospfv2-single-area',
    title: 'OSPFv2 Single Area',
    subtitle: 'Protocole OSPF, adjacences, DR/BDR et configuration',
    icon: 'Route',
    color: '#6366f1',
    duration: '55 min',
    level: 'Avance',
    videoId: 'HwlDrWXIbF0',
    sections: [
      {
        title: 'Concepts fondamentaux OSPF',
        content: `### Qu'est-ce qu'OSPF ?

**OSPF** (Open Shortest Path First) est un protocole de routage dynamique de type **link-state** (etat de liens), standardise en RFC 2328 (OSPFv2 pour IPv4) et RFC 5340 (OSPFv3 pour IPv6). C'est le protocole IGP (Interior Gateway Protocol) le plus deploye dans les reseaux d'entreprise.

### Pourquoi OSPF ?

| Caracteristique | Detail |
|----------------|--------|
| **Type** | Link-state (chaque routeur connait la topologie complete) |
| **Algorithme** | SPF / Dijkstra (calcul du plus court chemin) |
| **Metrique** | Cout base sur la bande passante |
| **Convergence** | Rapide (quelques secondes) |
| **Scalabilite** | Excellente (design hierarchique avec zones) |
| **Standard** | Ouvert (RFC 2328), multi-constructeur |
| **AD** | 110 |
| **Transport** | IP protocol 89 (pas TCP ni UDP) |
| **Multicast** | 224.0.0.5 (AllSPFRouters) et 224.0.0.6 (AllDRRouters) |

### Concepts cles

**Zone (Area)** : OSPF divise le reseau en zones logiques. Toutes les zones doivent etre connectees a la **zone 0** (backbone area). Dans le cadre du CCNA 200-301, on etudie uniquement la configuration **single-area** (tous les routeurs dans la zone 0).

**LSDB (Link-State Database)** : Base de donnees topologique identique sur tous les routeurs d'une meme zone. Chaque routeur connait l'integralite du reseau.

**LSA (Link-State Advertisement)** : Messages echanges entre routeurs OSPF pour decrire l'etat de leurs liens (interfaces connectees, voisins, couts).

**SPF Tree** : A partir de la LSDB, chaque routeur calcule son propre arbre du plus court chemin (SPF tree) avec l'algorithme de Dijkstra, en se placant comme racine.

### Le cout OSPF

La formule par defaut est :
\`\`\`
Cout = Reference bandwidth / Interface bandwidth
Cout = 10^8 / bandwidth (en bps)
\`\`\`

| Interface | Bande passante | Cout OSPF (defaut) |
|-----------|---------------|-------------------|
| Serial (T1) | 1.544 Mbps | 64 |
| FastEthernet | 100 Mbps | 1 |
| GigabitEthernet | 1 Gbps | 1 |
| 10 GigabitEthernet | 10 Gbps | 1 |

**Probleme** : Fast Ethernet, Gigabit et 10 Gigabit ont tous un cout de 1 ! Pour differencier, on modifie la reference :
\`\`\`
Router(config-router)# auto-cost reference-bandwidth 10000
! 10000 Mbps = 10 Gbps → GigE = 10, FastE = 100, 10GE = 1
\`\`\`

> **Conseil CCNA** : La reference bandwidth doit etre identique sur **tous** les routeurs OSPF du reseau pour un calcul de cout coherent. La valeur 10000 est recommandee pour les reseaux modernes.`
      },
      {
        title: 'Router ID et adjacences OSPF',
        content: `### Router ID (RID)

Chaque routeur OSPF a un identifiant unique de 32 bits au format d'adresse IPv4 (meme si ce n'est pas une adresse IP). Le Router ID est determine selon cet ordre de priorite :

1. **Configuration manuelle** (commande \`router-id\`) — recommande
2. **Plus haute adresse IP de loopback** active
3. **Plus haute adresse IP d'interface physique** active

\`\`\`
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
\`\`\`

**Important** : Si le Router ID est modifie, il faut recharger le processus OSPF :
\`\`\`
Router# clear ip ospf process
Reset ALL OSPF processes? [no]: yes
\`\`\`

### Processus d'adjacence OSPF

Les routeurs OSPF passent par plusieurs etats avant de devenir voisins complets :

| Etat | Description |
|------|-------------|
| **Down** | Aucun Hello recu du voisin |
| **Init** | Hello recu mais notre Router ID n'est pas dans le Hello du voisin |
| **2-Way** | Hello recu avec notre Router ID dedans. Adjacence bidirectionnelle etablie. Election DR/BDR a cette etape |
| **ExStart** | Negociation du master/slave pour l'echange de DBD |
| **Exchange** | Echange des DBD (Database Description) — resume de la LSDB |
| **Loading** | Echange des LSR/LSU/LSAck pour synchroniser les LSDB |
| **Full** | LSDB synchronisees. Adjacence complete |

### Les 5 types de paquets OSPF

| Type | Nom | Role |
|------|-----|------|
| **1** | **Hello** | Decouverte et maintien des voisins. Envoye toutes les 10s (reseaux broadcast) ou 30s (NBMA) |
| **2** | **DBD** (Database Description) | Resume de la LSDB — liste des LSA connus |
| **3** | **LSR** (Link-State Request) | Demande d'un LSA specifique manquant |
| **4** | **LSU** (Link-State Update) | Envoi des LSA demandes |
| **5** | **LSAck** (Link-State Acknowledgment) | Acquittement de reception d'un LSU |

### Conditions pour former une adjacence

Deux routeurs OSPF ne deviendront voisins que si ces parametres correspondent :

| Parametre | Doit etre identique |
|-----------|-------------------|
| **Zone (Area ID)** | Oui |
| **Hello / Dead interval** | Oui |
| **Type de reseau** | Oui |
| **Masque de sous-reseau** | Oui (sauf point-to-point) |
| **Authentification** | Oui (type et mot de passe) |
| **Stub area flag** | Oui |
| **MTU** | Oui (bloque a ExStart si different) |

> **Point examen** : Les conditions d'adjacence OSPF sont un classique du CCNA. Si deux routeurs restent bloques en **Init** ou **ExStart**, verifiez les timers Hello/Dead, le masque, le MTU et la zone.`
      },
      {
        title: 'Election DR/BDR',
        content: `### Pourquoi un DR et un BDR ?

Sur un reseau **multi-acces** (Ethernet), si N routeurs sont connectes au meme segment, chacun devrait former une adjacence complete avec tous les autres, soit N*(N-1)/2 adjacences. Avec 10 routeurs, cela fait 45 adjacences, ce qui genere enormement de trafic OSPF.

### La solution : DR et BDR

OSPF elit un **Designated Router (DR)** et un **Backup Designated Router (BDR)** sur chaque segment multi-acces. Les autres routeurs sont appeles **DROther**.

- Les **DROther** forment une adjacence **Full** uniquement avec le DR et le BDR
- Entre DROther, l'adjacence reste en etat **2-Way** (pas d'echange de LSDB)
- Le DR collecte et redistribue les LSA pour tout le segment

\`\`\`
Sans DR : N*(N-1)/2 adjacences = 45 pour 10 routeurs
Avec DR : N-1 adjacences avec le DR + N-1 avec le BDR = 18 pour 10 routeurs
\`\`\`

### Processus d'election

L'election se fait a l'etat **2-Way** selon ces criteres :

1. **Priorite OSPF** la plus haute gagne (defaut = 1, plage 0-255)
   - Priorite 0 = le routeur ne participe **jamais** a l'election
2. **Router ID** le plus haut (en cas d'egalite de priorite)

**Regles importantes :**
- L'election est **non-preemptive** : un nouveau routeur avec une meilleure priorite NE remplacera PAS le DR actuel
- Si le DR tombe, le BDR devient DR et une nouvelle election a lieu pour le BDR
- Le DR et BDR sont elus **par segment** (pas globalement)

### Configuration de la priorite

\`\`\`
! Forcer un routeur comme DR (priorite haute)
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ip ospf priority 255

! Empecher un routeur de devenir DR
Router(config-if)# ip ospf priority 0
\`\`\`

### Adresses multicast

| Adresse | Nom | Qui ecoute |
|---------|-----|-----------|
| **224.0.0.5** | AllSPFRouters | Tous les routeurs OSPF |
| **224.0.0.6** | AllDRRouters | Uniquement le DR et le BDR |

- Les DROther envoient les LSU vers **224.0.0.6** (le DR/BDR)
- Le DR redistribue les LSU vers **224.0.0.5** (tous les routeurs)

### Types de reseaux OSPF

| Type | Exemple | DR/BDR ? | Hello | Dead |
|------|---------|----------|-------|------|
| **Broadcast** | Ethernet | Oui | 10s | 40s |
| **Point-to-Point** | Serial, tunnel | Non | 10s | 40s |
| **NBMA** | Frame Relay | Oui | 30s | 120s |
| **Point-to-Multipoint** | NBMA partiel | Non | 30s | 120s |

> **Astuce CCNA** : Sur un reseau Ethernet, si vous voulez supprimer l'election DR/BDR (par exemple entre deux routeurs seulement), changez le type de reseau en point-to-point : \`ip ospf network point-to-point\`. Cela accelere aussi la convergence.`
      },
      {
        title: 'Configuration OSPFv2 Single-Area',
        content: `### Configuration de base

\`\`\`
! Activer OSPF (le numero de processus est local, pas besoin d'etre identique)
Router(config)# router ospf 1

! Definir le Router ID (bonne pratique)
Router(config-router)# router-id 1.1.1.1

! Annoncer les reseaux (methode classique avec wildcard mask)
Router(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.3 area 0

! Definir une interface passive (pas d'envoi de Hello)
Router(config-router)# passive-interface GigabitEthernet 0/1
\`\`\`

### Le wildcard mask

Le wildcard mask est l'**inverse** du masque de sous-reseau :
\`\`\`
Masque :   255.255.255.0   → Wildcard : 0.0.0.255
Masque :   255.255.255.252 → Wildcard : 0.0.0.3
Masque :   255.255.0.0     → Wildcard : 0.0.255.255
\`\`\`

**Calcul** : 255.255.255.255 - masque = wildcard

### Methode alternative : commande interface

\`\`\`
! Activer OSPF directement sur l'interface (plus simple)
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ip ospf 1 area 0

Router(config)# interface GigabitEthernet 0/1
Router(config-if)# ip ospf 1 area 0
\`\`\`

Cette methode est plus precise et evite les erreurs de wildcard mask.

### Configuration complete — Scenario

\`\`\`
                 10.0.0.0/30         10.0.0.4/30
R1 (1.1.1.1) ============ R2 (2.2.2.2) ============ R3 (3.3.3.3)
 |  .1            .2  |  .5              .6  |
 |                     |                      |
 192.168.1.0/24       192.168.2.0/24         192.168.3.0/24
\`\`\`

**R1 :**
\`\`\`
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.0.0.0 0.0.0.3 area 0
R1(config-router)# passive-interface GigabitEthernet 0/1
R1(config-router)# auto-cost reference-bandwidth 10000
\`\`\`

**R2 :**
\`\`\`
R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 192.168.2.0 0.0.0.255 area 0
R2(config-router)# network 10.0.0.0 0.0.0.3 area 0
R2(config-router)# network 10.0.0.4 0.0.0.3 area 0
R2(config-router)# passive-interface GigabitEthernet 0/1
R2(config-router)# auto-cost reference-bandwidth 10000
\`\`\`

### Redistribuer une route par defaut dans OSPF

\`\`\`
! Configurer la route par defaut
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Redistribuer dans OSPF
R1(config)# router ospf 1
R1(config-router)# default-information originate
\`\`\`

Les autres routeurs recevront une route \`O*E2 0.0.0.0/0\`.

> **Point CCNA** : La difference entre \`network\` avec wildcard et \`ip ospf\` sur l'interface : les deux font la meme chose, mais la methode interface est plus precise. Le wildcard mask ne filtre pas les reseaux — il filtre les **interfaces** dont l'IP correspond au pattern.`
      },
      {
        title: 'Verification et depannage OSPF',
        content: `### Commandes de verification essentielles

\`\`\`
! Voir les voisins OSPF et leur etat
Router# show ip ospf neighbor
Neighbor ID     Pri   State         Dead Time   Address         Interface
2.2.2.2           1   FULL/DR       00:00:33    10.0.0.2        Gi0/0
3.3.3.3           1   FULL/BDR      00:00:37    10.0.0.6        Gi0/1

! Voir les informations du processus OSPF
Router# show ip ospf
Routing Process "ospf 1" with ID 1.1.1.1
 Reference bandwidth unit is 10000 mbps
 Number of areas in this router is 1. 1 normal 0 stub 0 nssa

! Voir les interfaces participant a OSPF
Router# show ip ospf interface brief
Interface    PID   Area   IP Address/Mask    Cost  State Nbrs F/C
Gi0/0        1     0      10.0.0.1/30        10    DR    1/1
Gi0/1        1     0      192.168.1.1/24     10    DR    0/0

! Detail d'une interface OSPF
Router# show ip ospf interface GigabitEthernet 0/0
GigabitEthernet0/0 is up, line protocol is up
  Internet Address 10.0.0.1/30, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 10
  Transmit Delay is 1 sec, State DR, Priority 1
  Designated Router (ID) 1.1.1.1, Interface address 10.0.0.1
  Backup Designated Router (ID) 2.2.2.2, Interface address 10.0.0.2
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5

! Voir la LSDB
Router# show ip ospf database

! Voir les routes OSPF dans la table de routage
Router# show ip route ospf
\`\`\`

### Analyse de show ip ospf neighbor

| Champ | Signification |
|-------|--------------|
| **Neighbor ID** | Router ID du voisin |
| **Pri** | Priorite OSPF du voisin |
| **State** | FULL/DR, FULL/BDR, FULL/- (point-to-point), 2WAY/DROTHER |
| **Dead Time** | Temps restant avant de considerer le voisin comme mort |
| **Address** | Adresse IP du voisin |
| **Interface** | Interface locale connectee au voisin |

### Problemes courants et solutions

| Probleme | Symptome | Cause probable | Solution |
|----------|----------|---------------|----------|
| Pas de voisin | \`show ip ospf neighbor\` vide | Pas de Hello recu | Verifier connectivite L2, ACL |
| Bloque en Init | State = INIT | Hello du voisin recu mais sans notre RID | Verifier timers, masque, zone |
| Bloque en ExStart | State = EXSTART | MTU mismatch | \`ip ospf mtu-ignore\` ou corriger MTU |
| Voisin en 2-Way | State = 2WAY/DROTHER | Normal entre DROther | Ce n'est pas un probleme |
| Routes manquantes | Route pas dans la table | Interface pas annoncee ou passive | Verifier \`network\` ou \`ip ospf\` |
| Cout incorrect | Chemin sous-optimal | Reference bandwidth differente | \`auto-cost reference-bandwidth\` identique partout |

### Modifier le cout OSPF

\`\`\`
! Methode 1 : Sur l'interface
Router(config-if)# ip ospf cost 50

! Methode 2 : Modifier la bandwidth (affecte aussi d'autres protocoles)
Router(config-if)# bandwidth 100000
\`\`\`

### Authentification OSPF

\`\`\`
! Authentification MD5 sur l'interface
Router(config-if)# ip ospf message-digest-key 1 md5 MonSecret
Router(config-if)# ip ospf authentication message-digest
\`\`\`

> **Methode depannage CCNA** : (1) \`show ip ospf neighbor\` — les voisins sont-ils FULL ? (2) \`show ip ospf interface brief\` — les bonnes interfaces participent-elles ? (3) \`show ip route ospf\` — les routes sont-elles apprises ? (4) \`show ip ospf\` — la reference bandwidth est-elle correcte ? Suivez cet ordre pour systematiser votre diagnostic.`
      },
      {
        title: 'Optimisations et bonnes pratiques OSPF',
        content: `### Interfaces passives

Une interface passive **ne recoit ni n'envoie de paquets Hello** OSPF. Le reseau de cette interface est quand meme annonce dans OSPF. Utilisez passive-interface sur les interfaces LAN (vers les utilisateurs) pour eviter d'envoyer des Hello inutiles et de former des adjacences non desirees.

\`\`\`
! Rendre une interface passive
Router(config-router)# passive-interface GigabitEthernet 0/1

! Rendre TOUTES les interfaces passives par defaut
Router(config-router)# passive-interface default
! Puis reactiver les interfaces qui doivent former des adjacences
Router(config-router)# no passive-interface GigabitEthernet 0/0
Router(config-router)# no passive-interface Serial 0/0/0
\`\`\`

### Timers Hello et Dead

Les timers doivent etre **identiques** entre voisins :
\`\`\`
Router(config-if)# ip ospf hello-interval 5
Router(config-if)# ip ospf dead-interval 20
\`\`\`

**Regles par defaut** :
- Dead interval = 4 x Hello interval
- Broadcast : Hello 10s, Dead 40s
- NBMA : Hello 30s, Dead 120s

### Propagation de la route par defaut

\`\`\`
! Sur le routeur connecte a Internet
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
Router(config)# router ospf 1
Router(config-router)# default-information originate

! Option "always" : annonce la route meme si elle n'est pas dans la table
Router(config-router)# default-information originate always
\`\`\`

### Changer le type de reseau

\`\`\`
! Passer un lien Ethernet en point-to-point (supprime l'election DR/BDR)
Router(config-if)# ip ospf network point-to-point
\`\`\`

Utile quand seulement 2 routeurs sont connectes sur un segment Ethernet. Avantages : pas d'election DR/BDR, convergence plus rapide.

### Resume des bonnes pratiques OSPF

| Pratique | Pourquoi |
|----------|---------|
| Configurer un Router ID explicite | Stabilite, pas de changement si une interface tombe |
| Utiliser passive-interface default | Securite, pas de Hello sur les ports LAN |
| Definir auto-cost reference-bandwidth | Coherence des couts sur tous les routeurs |
| Configurer des loopback | Stabilite du Router ID et des routes |
| Authentifier les paquets OSPF (MD5) | Securite, empeche l'injection de fausses routes |
| Utiliser ip ospf sur l'interface | Plus precis que network + wildcard |
| Documenter le plan d'adressage OSPF | Facilite le depannage |

### OSPFv3 pour IPv6 (apercu)

OSPFv3 est la version d'OSPF pour IPv6. Les concepts sont identiques mais la configuration differe :
\`\`\`
Router(config)# ipv6 router ospf 1
Router(config-rtr)# router-id 1.1.1.1

Router(config)# interface GigabitEthernet 0/0
Router(config-if)# ipv6 ospf 1 area 0
\`\`\`

OSPFv3 utilise les adresses link-local comme next-hop et les adresses multicast FF02::5 (AllSPFRouters) et FF02::6 (AllDRRouters).

> **Pour l'examen CCNA 200-301** : Maitrisez OSPFv2 single-area en configuration et verification. Sachez configurer OSPF, verifier les adjacences, analyser les routes, et depanner les problemes courants. OSPFv3 et le multi-area ne sont demandes qu'en theorie.`
      }
    ]
  },
  {
    id: 21,
    slug: 'routage-dynamique-concepts',
    title: 'Concepts de routage dynamique',
    subtitle: 'IGP, EGP, distance vector, link-state et comparaison des protocoles',
    icon: 'Compass',
    color: '#6366f1',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'QqFUf-o6wVE',
    sections: [
      {
        title: 'Introduction au routage dynamique',
        content: `### Pourquoi le routage dynamique ?

Le routage statique fonctionne bien pour les petits reseaux, mais il presente des limites majeures quand le reseau grandit :
- **Scalabilite** : configurer et maintenir des centaines de routes statiques est impraticable
- **Adaptabilite** : si un lien tombe, les routes statiques ne s'adaptent pas automatiquement (sauf les routes flottantes)
- **Complexite** : chaque modification de topologie necessite une intervention manuelle sur chaque routeur

Le routage dynamique resout ces problemes : les routeurs echangent automatiquement des informations sur les reseaux qu'ils connaissent et calculent les meilleurs chemins. Si un lien tombe, les routeurs recalculent automatiquement les routes.

### Fonctionnement general

1. **Decouverte** : les routeurs decouvrent leurs voisins via des messages periodiques
2. **Echange** : les routeurs partagent les informations de routage (reseaux connus, metriques)
3. **Calcul** : chaque routeur calcule le meilleur chemin vers chaque destination
4. **Installation** : les meilleures routes sont placees dans la table de routage
5. **Maintenance** : les routeurs continuent d'echanger des informations pour detecter les changements

### Classification des protocoles

Les protocoles de routage se classifient selon deux axes :

**Par portee :**
| Type | Signification | Usage | Exemples |
|------|--------------|-------|----------|
| **IGP** (Interior Gateway Protocol) | Protocole de routage **interne** | Routage au sein d'un **systeme autonome** (AS) | RIP, OSPF, EIGRP, IS-IS |
| **EGP** (Exterior Gateway Protocol) | Protocole de routage **externe** | Routage **entre** systemes autonomes | BGP |

**Par algorithme :**
| Type | Fonctionnement | Exemples |
|------|---------------|----------|
| **Distance Vector** | Echange de la table de routage avec les voisins directs | RIP, EIGRP |
| **Link-State** | Echange de l'etat des liens, chaque routeur calcule la topologie complete | OSPF, IS-IS |
| **Path Vector** | Echange du chemin complet (liste des AS traverses) | BGP |

> **Analogie** : Un protocole distance vector est comme demander son chemin a chaque personne rencontree ("tourner a droite dans 2 km"). Un protocole link-state est comme avoir une carte complete du reseau et calculer soi-meme le meilleur itineraire.`
      },
      {
        title: 'Distance Vector vs Link-State',
        content: `### Protocoles Distance Vector

**Principe** : Chaque routeur n'a qu'une vision **partielle** du reseau. Il connait uniquement ses voisins directs et la distance (metrique) vers chaque destination, telle que rapportee par ses voisins. Le routeur fait confiance a ses voisins pour le calcul des routes.

**Fonctionnement** :
1. Chaque routeur envoie sa **table de routage complete** a ses voisins directs
2. Les voisins comparent avec leur propre table et mettent a jour si une meilleure route est decouverte
3. Ce processus se repete periodiquement (ex : toutes les 30 secondes pour RIP)

**Algorithme** : Bellman-Ford

**Avantages** :
- Simple a configurer et a comprendre
- Faible utilisation CPU et memoire
- Adapte aux petits reseaux

**Inconvenients** :
- **Convergence lente** : les mises a jour periodiques prennent du temps a se propager
- **Boucles de routage** : possibles (count-to-infinity problem)
- **Bande passante** : envoi de la table de routage complete a chaque mise a jour
- Scalabilite limitee

**Mecanismes anti-boucle** :
| Mecanisme | Description |
|-----------|-------------|
| **Maximum hop count** | RIP limite a 15 sauts (16 = infini = inaccessible) |
| **Split horizon** | Ne pas annoncer une route sur l'interface par laquelle on l'a apprise |
| **Route poisoning** | Annoncer une route defaillante avec une metrique infinie |
| **Poison reverse** | Repondre a un route poison en confirmant la metrique infinie |
| **Hold-down timers** | Ignorer les mises a jour pour une route defaillante pendant un delai |

### Protocoles Link-State

**Principe** : Chaque routeur a une vision **complete** du reseau. Il echange l'etat de ses propres liens (pas sa table de routage) avec tous les routeurs de la zone. Chaque routeur construit independamment la meme base de donnees topologique (LSDB) et calcule ses propres routes.

**Fonctionnement** :
1. Chaque routeur decouvre ses voisins et l'etat de ses liens
2. Il genere un **LSA** (Link-State Advertisement) decrivant ses liens
3. Le LSA est **inonde** (flood) a tous les routeurs de la zone
4. Chaque routeur construit une **LSDB** identique
5. Chaque routeur execute l'algorithme **SPF/Dijkstra** pour calculer les meilleurs chemins

**Algorithme** : Dijkstra (Shortest Path First)

**Avantages** :
- **Convergence rapide** : les changements sont immediatement propages
- **Pas de boucles** : chaque routeur calcule ses propres routes a partir de la LSDB complete
- **Mises a jour incrementales** : seuls les changements sont envoyes (pas toute la table)
- Excellente scalabilite (design hierarchique avec zones)

**Inconvenients** :
- Plus complexe a configurer
- Utilisation CPU et memoire plus elevee (calcul SPF, stockage LSDB)
- Design reseau plus exigeant (planification des zones)

### Tableau comparatif

| Critere | Distance Vector | Link-State |
|---------|----------------|------------|
| **Connaissance du reseau** | Voisins directs seulement | Topologie complete de la zone |
| **Mises a jour** | Table complete, periodiques | Incrementales, declenchees par changements |
| **Algorithme** | Bellman-Ford | Dijkstra (SPF) |
| **Convergence** | Lente | Rapide |
| **Boucles** | Possibles (mecanismes anti-boucle) | Impossibles (vue complete) |
| **CPU/RAM** | Faible | Plus eleve |
| **Scalabilite** | Limitee | Excellente |
| **Exemples** | RIP, (EIGRP) | OSPF, IS-IS |

> **Note** : EIGRP est souvent classe comme "Advanced Distance Vector" ou "Hybrid" car il utilise des concepts des deux approches (voisinage comme link-state, mais algorithme DUAL qui est distance vector).`
      },
      {
        title: 'RIP et EIGRP en bref',
        content: `### RIP — Routing Information Protocol

RIP est le protocole de routage le plus ancien et le plus simple. Il existe en deux versions :

| Caracteristique | RIPv1 | RIPv2 |
|----------------|-------|-------|
| **Type** | Distance vector | Distance vector |
| **Metrique** | Nombre de sauts (hop count) | Nombre de sauts |
| **Max sauts** | 15 (16 = inaccessible) | 15 |
| **Mises a jour** | Broadcast (255.255.255.255) toutes les 30s | Multicast (224.0.0.9) toutes les 30s |
| **Subnetting** | Non (classful) | Oui (VLSM, CIDR) |
| **Authentification** | Non | Oui (plain text, MD5) |
| **AD** | 120 | 120 |

**Configuration RIPv2 :**
\`\`\`
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# network 192.168.1.0
Router(config-router)# network 10.0.0.0
Router(config-router)# no auto-summary
Router(config-router)# passive-interface GigabitEthernet 0/1
\`\`\`

**Limites de RIP :**
- Metrique basique (hop count) qui ne tient pas compte de la bande passante
- Limite a 15 sauts → reseaux de petite taille uniquement
- Convergence tres lente (minutes)
- RIP n'est quasiment plus utilise en production

### EIGRP — Enhanced Interior Gateway Routing Protocol

EIGRP est un protocole **proprietaire Cisco** (ouvert depuis 2013 en RFC 7868 mais rarement implemente par d'autres constructeurs). C'est un protocole "advanced distance vector" tres performant.

| Caracteristique | Detail |
|----------------|--------|
| **Type** | Advanced Distance Vector (Hybrid) |
| **Algorithme** | DUAL (Diffusing Update Algorithm) |
| **Metrique** | Composite : bande passante + delai (par defaut). Fiabilite et charge optionnels |
| **AD** | 90 (interne), 170 (externe) |
| **Mises a jour** | Multicast 224.0.0.10, incrementales et declenchees |
| **Convergence** | Tres rapide (< 1 seconde avec feasible successor) |
| **VLSM/CIDR** | Oui |
| **Load balancing** | Equal-cost ET unequal-cost (unique a EIGRP) |
| **Transport** | IP protocol 88 |

**Concepts cles EIGRP :**
- **Successor** : le meilleur chemin vers une destination (installe dans la table de routage)
- **Feasible Successor (FS)** : un chemin de backup pre-calcule qui garantit l'absence de boucle
- Si le Successor tombe, le Feasible Successor prend le relais **immediatement** (pas de recalcul)

**Configuration EIGRP :**
\`\`\`
Router(config)# router eigrp 100
Router(config-router)# network 192.168.1.0 0.0.0.255
Router(config-router)# network 10.0.0.0 0.0.0.3
Router(config-router)# no auto-summary
Router(config-router)# passive-interface GigabitEthernet 0/1
\`\`\`

> **Pour le CCNA 200-301** : RIP et EIGRP ne sont pas au programme de la configuration, mais vous devez connaitre leurs caracteristiques generales pour les comparer avec OSPF. Retenez les metriques, les AD et les differences fondamentales.`
      },
      {
        title: 'BGP en introduction',
        content: `### Qu'est-ce que BGP ?

**BGP** (Border Gateway Protocol) est le protocole de routage **d'Internet**. C'est le seul protocole EGP (Exterior Gateway Protocol) utilise en production. Il est responsable du routage entre les **systemes autonomes** (AS - Autonomous Systems).

### Systeme autonome (AS)

Un AS est un ensemble de reseaux sous le controle d'une seule entite administrative (un FAI, une grande entreprise, une universite) qui partage une meme politique de routage. Chaque AS est identifie par un numero unique (ASN) attribue par les RIR (Regional Internet Registries).

\`\`\`
    AS 64500              AS 64501              AS 64502
  (Entreprise A)         (FAI Orange)          (Google)
 ┌──────────┐          ┌──────────┐          ┌──────────┐
 │  OSPF    │          │  IS-IS   │          │  OSPF    │
 │ interne  │──BGP──── │ interne  │──BGP──── │ interne  │
 │          │  eBGP    │          │  eBGP    │          │
 └──────────┘          └──────────┘          └──────────┘
\`\`\`

### Types de BGP

| Type | Description | AD |
|------|-------------|-----|
| **eBGP** (external BGP) | Entre routeurs de **differents** AS | 20 |
| **iBGP** (internal BGP) | Entre routeurs du **meme** AS | 200 |

### Caracteristiques de BGP

| Caracteristique | Detail |
|----------------|--------|
| **Type** | Path Vector |
| **Transport** | TCP port 179 |
| **Metrique** | Attributs multiples (AS-Path, Next-Hop, Local Preference, MED, etc.) |
| **Mises a jour** | Incrementales, declenchees par changements |
| **Convergence** | Lente (intentionnellement, pour la stabilite d'Internet) |
| **Nombre de routes** | La table de routage Internet complete compte plus de 1 million de routes (en 2024) |

### L'attribut AS-Path

BGP utilise le **chemin d'AS** (AS-Path) pour eviter les boucles et selectionner les routes. Chaque fois qu'une route traverse un AS, le numero de cet AS est ajoute au chemin.

\`\`\`
Route vers 203.0.113.0/24 :
  via AS 64501 64502     ← 2 AS traverses
  via AS 64503 64504 64502  ← 3 AS traverses (chemin plus long)
BGP prefere le chemin le plus court (moins d'AS).
\`\`\`

### BGP et le CCNA

Le CCNA 200-301 ne demande pas de configurer BGP, mais vous devez connaitre :
- BGP est le protocole de routage d'Internet (EGP)
- Il utilise TCP port 179
- L'AD d'eBGP est 20, iBGP est 200
- Il utilise l'AS-Path pour la selection de route et la prevention de boucles
- Il est utilise entre FAI et entre grandes entreprises et leurs FAI

> **Astuce CCNA** : BGP est le "protocole des FAI". Si une question mentionne "routage entre systemes autonomes", "routage Internet" ou "EGP", la reponse est BGP. Pour le routage interne (IGP), pensez OSPF ou EIGRP.`
      },
      {
        title: 'Comparaison des protocoles et distance administrative',
        content: `### Tableau comparatif complet

| Critere | RIPv2 | EIGRP | OSPF | IS-IS | BGP |
|---------|-------|-------|------|-------|-----|
| **Type** | IGP | IGP | IGP | IGP | EGP |
| **Algorithme** | Distance Vector | Advanced DV | Link-State | Link-State | Path Vector |
| **AD** | 120 | 90 (int) / 170 (ext) | 110 | 115 | 20 (ext) / 200 (int) |
| **Metrique** | Hop count | Composite (BW + delay) | Cout (BW) | Cout | Attributs |
| **Convergence** | Lente (min) | Tres rapide (<1s) | Rapide (s) | Rapide (s) | Lente (min) |
| **Scalabilite** | Faible (15 hops) | Bonne | Excellente | Excellente | Internet |
| **VLSM/CIDR** | Oui | Oui | Oui | Oui | Oui |
| **Standard** | RFC 2453 | Cisco (RFC 7868) | RFC 2328 | ISO 10589 | RFC 4271 |
| **Transport** | UDP 520 | IP 88 | IP 89 | Directement sur L2 | TCP 179 |
| **Multicast** | 224.0.0.9 | 224.0.0.10 | 224.0.0.5/6 | - | Unicast TCP |
| **Load balancing** | Equal-cost | Equal + Unequal | Equal-cost | Equal-cost | - |

### Tableau des distances administratives (a memoriser)

| Rang | Source | AD | Commentaire |
|------|--------|-----|------------|
| 1 | Connected | **0** | Toujours prefere |
| 2 | Static | **1** | Configurable |
| 3 | eBGP | **20** | BGP entre AS differents |
| 4 | EIGRP interne | **90** | Protocole Cisco |
| 5 | IGRP | **100** | Obsolete |
| 6 | OSPF | **110** | Standard le plus utilise |
| 7 | IS-IS | **115** | Surtout chez les FAI |
| 8 | RIP | **120** | Obsolete en production |
| 9 | EIGRP externe | **170** | Routes redistribuees |
| 10 | iBGP | **200** | BGP dans le meme AS |
| 11 | Inconnu | **255** | Route ignoree |

### Quand utiliser quel protocole ?

| Scenario | Protocole recommande | Justification |
|----------|---------------------|--------------|
| Petit reseau (< 15 routeurs) | OSPF ou EIGRP (si Cisco) | Simple, performant |
| Reseau d'entreprise moyen | OSPF | Standard, multi-constructeur |
| Grand campus / datacenter | OSPF multi-area ou IS-IS | Scalabilite, hierarchie |
| Environnement 100% Cisco | EIGRP ou OSPF | EIGRP converge plus vite |
| Connexion a un FAI | BGP | Seul protocole EGP |
| Routage Internet (entre FAI) | BGP | Concu pour ca |
| Lab de formation | RIPv2 | Simple a comprendre |

### Redistribution entre protocoles

Quand un reseau utilise plusieurs protocoles de routage, il faut **redistribuer** les routes d'un protocole vers l'autre. C'est une operation avancee (hors CCNA 200-301) mais le concept est important :

\`\`\`
! Redistribuer les routes OSPF dans EIGRP
Router(config)# router eigrp 100
Router(config-router)# redistribute ospf 1 metric 100000 100 255 1 1500

! Redistribuer les routes EIGRP dans OSPF
Router(config)# router ospf 1
Router(config-router)# redistribute eigrp 100 subnets
\`\`\`

### Resume pour le CCNA 200-301

Pour l'examen, vous devez :
1. **Configurer** : OSPFv2 single-area (configuration et verification)
2. **Connaitre** : les caracteristiques de RIP, EIGRP, OSPF, BGP (type, metrique, AD, convergence)
3. **Comparer** : distance vector vs link-state, IGP vs EGP
4. **Memoriser** : les distances administratives des protocoles principaux
5. **Comprendre** : le processus de selection de route (longest prefix match → AD → metrique)

> **Conseil final** : La question "Quel protocole choisir ?" revient souvent au CCNA. Regle simple : OSPF pour l'interne (standard), BGP pour l'externe (entre AS). EIGRP si l'environnement est 100% Cisco. RIP seulement en lab ou pour la compatibilite legacy.`
      }
    ]
  }
]
