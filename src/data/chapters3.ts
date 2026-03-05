import type { Chapter } from './chapters'

export const chapters3: Chapter[] = [
  {
    id: 22,
    slug: 'nat',
    title: 'NAT / PAT',
    subtitle: 'Traduction d\'adresses reseau et surcharge de ports',
    icon: 'Repeat',
    color: '#f59e0b',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'jq3SLuhIyPI',
    sections: [
      {
        title: 'Introduction au NAT',
        content: `Le **NAT** (Network Address Translation) est un mecanisme qui permet de traduire des adresses IP privees en adresses IP publiques (et inversement) lorsqu'un paquet traverse un routeur. Il a ete cree pour pallier la **penurie d'adresses IPv4** publiques.

### Pourquoi le NAT ?

Avec seulement **4,3 milliards** d'adresses IPv4 disponibles et des milliards d'appareils connectes, il est impossible d'attribuer une IP publique unique a chaque equipement. Le NAT permet a un reseau entier de partager une ou plusieurs adresses IP publiques.

### Terminologie NAT (essentielle pour le CCNA)

| Terme | Definition |
|-------|-----------|
| **Inside Local** | Adresse IP privee d'un hote sur le reseau interne (ex: 192.168.1.10) |
| **Inside Global** | Adresse IP publique representant l'hote interne vers l'exterieur (ex: 203.0.113.5) |
| **Outside Local** | Adresse IP de l'hote externe telle que vue depuis le reseau interne |
| **Outside Global** | Adresse IP publique reelle de l'hote externe (ex: 8.8.8.8) |

### Schema des zones NAT

\`\`\`
Reseau interne              Routeur NAT              Internet
(Inside)                                             (Outside)

PC1: 192.168.1.10  ──┐                         ┌── Serveur: 8.8.8.8
PC2: 192.168.1.11  ──┤── [NAT] ── 203.0.113.5 ─┤
PC3: 192.168.1.12  ──┘   inside    inside        └── Outside Global
                          local     global
\`\`\`

> **Astuce CCNA :** La question "Inside Local vs Inside Global" revient tres souvent a l'examen. Retenez : **Local = adresse vue depuis l'interieur**, **Global = adresse vue depuis l'exterieur**.`
      },
      {
        title: 'NAT statique et NAT dynamique',
        content: `### NAT statique (Static NAT)

Le NAT statique cree une correspondance **permanente et fixe** entre une adresse IP privee et une adresse IP publique. C'est un mapping 1:1.

**Cas d'usage :** Serveur web interne qui doit etre accessible depuis Internet.

\`\`\`
! Configuration NAT statique sur un routeur Cisco
Router(config)# ip nat inside source static 192.168.1.100 203.0.113.10

! Definir les interfaces inside et outside
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat inside

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat outside
\`\`\`

**Resultat :** Chaque fois qu'un paquet de 192.168.1.100 sort vers Internet, l'IP source est remplacee par 203.0.113.10. Chaque paquet entrant destine a 203.0.113.10 est redirige vers 192.168.1.100.

### NAT dynamique (Dynamic NAT)

Le NAT dynamique associe les adresses privees a un **pool d'adresses publiques** disponibles. L'attribution est temporaire et automatique.

\`\`\`
! Definir le pool d'adresses publiques
Router(config)# ip nat pool POOL-PUBLIC 203.0.113.10 203.0.113.20 netmask 255.255.255.0

! Definir les adresses internes autorisees (ACL)
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

! Associer l'ACL au pool NAT
Router(config)# ip nat inside source list 1 pool POOL-PUBLIC

! Definir les interfaces
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat inside
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat outside
\`\`\`

### Comparaison NAT statique vs dynamique

| Critere | NAT statique | NAT dynamique |
|---------|-------------|---------------|
| Mapping | 1 privee : 1 publique (fixe) | N privees : M publiques (temporaire) |
| Utilisation | Serveurs accessibles depuis Internet | Utilisateurs internes accedant a Internet |
| Nombre d'IP publiques | 1 par serveur | Pool partage |
| Persistance | Permanent | Expire apres timeout |

> **Point cle :** Si le pool d'adresses publiques est epuise en NAT dynamique, les nouveaux hotes ne peuvent pas sortir sur Internet tant qu'une adresse n'est pas liberee.`
      },
      {
        title: 'PAT (NAT Overload)',
        content: `### Qu'est-ce que le PAT ?

Le **PAT** (Port Address Translation), aussi appele **NAT Overload**, permet a **plusieurs adresses privees** de partager **une seule adresse publique** en utilisant des **numeros de port** differents pour distinguer les connexions.

C'est le type de NAT le plus utilise — c'est ce que fait ta box Internet a la maison.

### Fonctionnement du PAT

\`\`\`
PC1 (192.168.1.10:1025) ──┐
                           │                        Internet
PC2 (192.168.1.11:1026) ──┤── Routeur NAT ──── 203.0.113.5
                           │   192.168.1.10:1025 → 203.0.113.5:40001
PC3 (192.168.1.12:1027) ──┘   192.168.1.11:1026 → 203.0.113.5:40002
                               192.168.1.12:1027 → 203.0.113.5:40003
\`\`\`

Le routeur maintient une **table de traduction NAT** qui associe chaque couple (IP privee + port source) a un port unique sur l'IP publique.

### Configuration PAT sur Cisco

**Methode 1 : PAT avec l'IP de l'interface outside**
\`\`\`
! Utiliser l'adresse de l'interface de sortie
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload

Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat inside
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat outside
\`\`\`

**Methode 2 : PAT avec un pool d'adresses**
\`\`\`
Router(config)# ip nat pool PAT-POOL 203.0.113.5 203.0.113.5 netmask 255.255.255.0
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat inside source list 1 pool PAT-POOL overload
\`\`\`

Le mot-cle **overload** est ce qui active le PAT (traduction par port).

### Tableau recapitulatif des 3 types de NAT

| Type | Ratio | Ports utilises | Mot-cle Cisco |
|------|-------|---------------|---------------|
| **NAT statique** | 1:1 | Non | \`ip nat inside source static\` |
| **NAT dynamique** | N:M | Non | \`ip nat inside source list ... pool\` |
| **PAT (overload)** | N:1 | Oui | \`... overload\` |

> **A retenir pour le CCNA :** Le PAT est le type de NAT le plus courant. Le mot-cle \`overload\` dans la commande Cisco est ce qui distingue le PAT du NAT dynamique classique.`
      },
      {
        title: 'Verification et depannage NAT',
        content: `### Commandes de verification NAT

\`\`\`
! Voir la table de traduction NAT active
Router# show ip nat translations
Pro  Inside global      Inside local       Outside local      Outside global
tcp  203.0.113.5:40001  192.168.1.10:1025  8.8.8.8:443        8.8.8.8:443
tcp  203.0.113.5:40002  192.168.1.11:1026  142.250.179.67:80  142.250.179.67:80
---  203.0.113.10       192.168.1.100      ---                ---

! Voir les statistiques NAT
Router# show ip nat statistics
Total active translations: 3 (1 static, 2 dynamic; 2 extended)
Outside interfaces: GigabitEthernet0/1
Inside interfaces: GigabitEthernet0/0
Hits: 1542  Misses: 12
Expired translations: 45
Dynamic mappings:
-- Inside Source
  access-list 1 pool POOL-PUBLIC refcount 2
   pool POOL-PUBLIC: netmask 255.255.255.0
        start 203.0.113.10 end 203.0.113.20
        type generic, total addresses 11, allocated 2, misses 0

! Effacer toutes les traductions dynamiques
Router# clear ip nat translation *
\`\`\`

### Depannage NAT pas a pas

**1. Verifier les interfaces inside/outside**
\`\`\`
Router# show ip interface brief
! S'assurer que les interfaces sont UP et correctement assignees
Router# show running-config | include ip nat
ip nat inside
ip nat outside
\`\`\`

**2. Verifier l'ACL**
\`\`\`
Router# show access-lists
Standard IP access list 1
    10 permit 192.168.1.0, wildcard bits 0.0.0.255
\`\`\`

**3. Activer le debug NAT (temporairement)**
\`\`\`
Router# debug ip nat
! Generer du trafic puis observer
NAT: s=192.168.1.10->203.0.113.5, d=8.8.8.8 [12345]
! Desactiver le debug apres
Router# undebug all
\`\`\`

### Erreurs courantes

| Probleme | Cause probable | Solution |
|----------|---------------|----------|
| Pas de traduction | Interface inside/outside inversee | Verifier \`ip nat inside\` et \`ip nat outside\` |
| Pool epuise | Trop de connexions, pas assez d'IP publiques | Utiliser PAT (overload) |
| Trafic retour bloque | ACL bloquant le trafic retour | Verifier les ACL sur l'interface outside |
| Traduction statique inoperante | Conflit d'adresses | Verifier avec \`show ip nat translations\` |

> **Conseil examen :** A l'examen CCNA, les questions NAT portent souvent sur l'identification des adresses Inside Local, Inside Global, Outside Local et Outside Global dans un scenario donne. Entrainez-vous avec \`show ip nat translations\`.`
      },
      {
        title: 'NAT et IPv6 : NAT64 et considerations avancees',
        content: `### Limites du NAT

Malgre son utilite, le NAT presente des inconvenients :

- **Rompt le modele de bout en bout** d'IP (les hotes internes ne sont pas directement joignables)
- **Problemes avec certains protocoles** : FTP actif, SIP (VoIP), IPsec en mode transport
- **Pas de securite reelle** : le NAT n'est PAS un pare-feu (meme s'il masque les adresses internes)
- **Complexite de depannage** : les adresses changent en cours de route
- **Performance** : chaque paquet doit etre inspecte et modifie

### NAT et protocoles problematiques

Certains protocoles embarquent l'adresse IP dans le **payload** (donnees), pas seulement dans l'en-tete :

| Protocole | Probleme avec NAT | Solution |
|-----------|-------------------|----------|
| **FTP actif** | Adresse IP dans la commande PORT | ALG (Application Layer Gateway) |
| **SIP/VoIP** | Adresse IP dans le corps SDP | SIP ALG ou STUN/TURN |
| **IPsec** | Chiffrement empeche la modification | NAT-Traversal (NAT-T, UDP 4500) |

### NAT64 : transition IPv4/IPv6

NAT64 permet aux hotes **IPv6-only** de communiquer avec des serveurs **IPv4-only** :

\`\`\`
Hote IPv6          NAT64 Gateway          Serveur IPv4
2001:db8::10  ──>  Traduit IPv6↔IPv4  ──>  93.184.216.34
                   Prefixe: 64:ff9b::/96
\`\`\`

Le prefixe NAT64 \`64:ff9b::/96\` encode l'adresse IPv4 dans les 32 derniers bits de l'adresse IPv6 :
\`\`\`
93.184.216.34 → 64:ff9b::5db8:d822
(93=0x5d, 184=0xb8, 216=0xd8, 34=0x22)
\`\`\`

### Recapitulatif des bonnes pratiques NAT

1. **Privilegier le PAT** pour l'acces Internet des utilisateurs (economise les IP publiques)
2. **NAT statique** uniquement pour les serveurs devant etre accessibles depuis Internet
3. **Documenter** toutes les regles NAT (qui est traduit, vers quoi)
4. **Surveiller** la table NAT (\`show ip nat statistics\`) pour detecter l'epuisement du pool
5. **Planifier la migration IPv6** pour reduire la dependance au NAT

> **Vision CCNA :** Le NAT est un "mal necessaire" en IPv4. IPv6 elimine le besoin de NAT grace a son espace d'adressage immense. Cependant, NAT64 reste utile pendant la periode de transition.`
      }
    ]
  },
  {
    id: 23,
    slug: 'dhcp-relay',
    title: 'DHCP : Config et Relay',
    subtitle: 'Configuration serveur DHCP Cisco et agent relay',
    icon: 'Server',
    color: '#f59e0b',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'wo-DVmtfjPU',
    sections: [
      {
        title: 'Rappel du processus DORA',
        content: `### Le processus DHCP en 4 etapes

Le protocole DHCP (Dynamic Host Configuration Protocol) attribue automatiquement des parametres IP aux clients. Le processus se deroule en **4 messages** appeles **DORA** :

\`\`\`
Client                          Serveur DHCP
  |                                  |
  |--- DISCOVER (broadcast) -------->|  1. "Y a-t-il un serveur DHCP ?"
  |    Src: 0.0.0.0                  |     Dst: 255.255.255.255
  |                                  |
  |<-- OFFER ------------------------|  2. "Voici l'IP 192.168.1.50"
  |    Src: 192.168.1.1              |     Dst: 255.255.255.255
  |                                  |
  |--- REQUEST (broadcast) --------->|  3. "J'accepte cette IP"
  |    Src: 0.0.0.0                  |     Dst: 255.255.255.255
  |                                  |
  |<-- ACK --------------------------|  4. "Confirme, c'est a toi !"
  |    Src: 192.168.1.1              |     Dst: 255.255.255.255
\`\`\`

### Parametres fournis par DHCP

| Parametre | Description | Indispensable |
|-----------|-------------|---------------|
| **Adresse IP** | IP attribuee au client | Oui |
| **Masque** | Masque de sous-reseau | Oui |
| **Passerelle** | Default gateway (routeur) | Oui |
| **Serveur DNS** | Adresse du serveur DNS | Oui |
| **Bail (lease)** | Duree de validite de l'attribution | Oui |
| **Nom de domaine** | Domaine local (ex: entreprise.local) | Optionnel |
| **Serveur WINS** | Resolution NetBIOS (legacy) | Optionnel |

### Ports DHCP

- **Serveur DHCP** : UDP port **67**
- **Client DHCP** : UDP port **68**

### Renouvellement du bail

Le client tente de renouveler son bail **avant** son expiration :

\`\`\`
0%           50%              87.5%         100%
|------------|-----------------|-------------|
Obtention   Renouvellement    Rebind        Expiration
(DORA)      (unicast vers     (broadcast    (retour a DORA)
            le meme serveur)  vers tout
                              serveur DHCP)
\`\`\`

> **Astuce CCNA :** Le DISCOVER et le REQUEST sont envoyes en **broadcast** car le client n'a pas encore d'adresse IP. C'est pourquoi DHCP ne traverse pas les routeurs sans configuration speciale (relay agent).`
      },
      {
        title: 'Configuration serveur DHCP sur routeur Cisco',
        content: `### Configurer un pool DHCP

Un routeur Cisco peut servir de **serveur DHCP** pour les reseaux qu'il dessert :

\`\`\`
! Creer un pool DHCP pour le reseau LAN
Router(config)# ip dhcp pool LAN-POOL
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.1
Router(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
Router(dhcp-config)# domain-name entreprise.local
Router(dhcp-config)# lease 7
Router(dhcp-config)# exit
\`\`\`

### Exclure des adresses du pool

Il faut exclure les adresses statiques (serveurs, routeurs, imprimantes) :

\`\`\`
! Exclure les 10 premieres adresses (equipements reseau)
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10

! Exclure une adresse specifique (imprimante)
Router(config)# ip dhcp excluded-address 192.168.1.200
\`\`\`

### Configuration complete multi-VLAN

\`\`\`
! Exclure les adresses reservees
ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp excluded-address 192.168.20.1 192.168.20.10

! Pool pour le VLAN 10 (Utilisateurs)
ip dhcp pool VLAN10-USERS
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 10.0.0.53 8.8.8.8
 domain-name entreprise.local
 lease 1

! Pool pour le VLAN 20 (Serveurs)
ip dhcp pool VLAN20-SERVERS
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 10.0.0.53
 lease 7
\`\`\`

### Parametres du pool DHCP

| Commande | Description |
|----------|-------------|
| \`network\` | Reseau et masque du pool |
| \`default-router\` | Passerelle par defaut (option 3) |
| \`dns-server\` | Serveurs DNS (option 6) |
| \`domain-name\` | Nom de domaine (option 15) |
| \`lease\` | Duree du bail en jours (defaut: 1 jour) |
| \`lease 0 8\` | Bail de 8 heures |
| \`lease infinite\` | Bail permanent (deconseille) |

> **Bonne pratique :** Toujours exclure les premieres adresses du reseau pour les equipements a IP fixe (routeurs, switches, serveurs). Un bail de 1 jour est adapte pour un reseau d'utilisateurs, 7 jours pour des serveurs.`
      },
      {
        title: 'DHCP Relay Agent (ip helper-address)',
        content: `### Le probleme : DHCP et les broadcasts

Les messages DHCP Discover sont envoyes en **broadcast**. Or, les routeurs **ne transmettent pas les broadcasts** d'un reseau a un autre. Si le serveur DHCP est sur un reseau distant, les clients ne pourront jamais le contacter.

\`\`\`
VLAN 10 (192.168.10.0/24)        VLAN 20 (192.168.20.0/24)
+--------+                        +--------+
| Client | --- DISCOVER (broadcast) --X--> | Serveur |
| DHCP   |                        | DHCP   |
+--------+      Le broadcast      +--------+
                ne traverse pas    10.0.0.5
                le routeur !
\`\`\`

### La solution : DHCP Relay Agent

Le **DHCP Relay Agent** (RFC 3046) convertit le broadcast DHCP en **unicast** et le transmet au serveur DHCP distant.

\`\`\`
Client           Routeur (Relay)         Serveur DHCP
  |                    |                      |
  |-- DISCOVER ------->|                      |
  |   (broadcast)      |-- DISCOVER --------->|
  |                    |   (unicast vers      |
  |                    |    10.0.0.5)         |
  |                    |                      |
  |                    |<-- OFFER ------------|
  |<-- OFFER ---------|   (unicast)          |
  |   (broadcast)      |                      |
\`\`\`

### Configuration du Relay Agent

La commande \`ip helper-address\` se configure sur l'interface du routeur **cote client** (pas cote serveur) :

\`\`\`
! Sur le routeur, interface cote VLAN des clients
Router(config)# interface GigabitEthernet0/0.10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# ip helper-address 10.0.0.5

! Si plusieurs serveurs DHCP (redondance)
Router(config-subif)# ip helper-address 10.0.0.5
Router(config-subif)# ip helper-address 10.0.0.6
\`\`\`

### Ce que ip helper-address transmet

Par defaut, \`ip helper-address\` ne transmet pas seulement le DHCP. Elle transmet **8 types de broadcasts UDP** :

| Port UDP | Service |
|----------|---------|
| 37 | Time |
| 49 | TACACS |
| 53 | DNS |
| 67 | DHCP/BOOTP server |
| 68 | DHCP/BOOTP client |
| 69 | TFTP |
| 137 | NetBIOS Name Service |
| 138 | NetBIOS Datagram Service |

Pour limiter a DHCP uniquement :
\`\`\`
Router(config)# no ip forward-protocol udp 37
Router(config)# no ip forward-protocol udp 137
Router(config)# no ip forward-protocol udp 138
\`\`\`

> **Point cle CCNA :** \`ip helper-address\` se configure sur l'interface **du cote des clients DHCP**, pas du cote du serveur. C'est l'une des erreurs les plus courantes en lab.`
      },
      {
        title: 'DHCP Snooping et securite',
        content: `### Attaques DHCP

Sans protection, le protocole DHCP est vulnerable a plusieurs attaques :

**1. DHCP Spoofing (Rogue DHCP Server)**
Un attaquant installe un faux serveur DHCP qui distribue de mauvais parametres :
- Fausse passerelle → tout le trafic passe par l'attaquant (Man-in-the-Middle)
- Faux serveur DNS → redirection vers des sites de phishing

**2. DHCP Starvation**
L'attaquant envoie des milliers de DHCP Discover avec des MAC differentes pour **epuiser le pool** d'adresses, provoquant un deni de service.

### DHCP Snooping : la solution

Le **DHCP Snooping** est une fonctionnalite de securite des switches qui filtre les messages DHCP malveillants.

**Principe :**
- Les ports sont classes en **trusted** (vers le serveur DHCP legitime) et **untrusted** (vers les clients)
- Seuls les ports trusted peuvent envoyer des messages DHCP **OFFER** et **ACK**
- Le switch construit une **table de binding** (IP → MAC → VLAN → port)

### Configuration DHCP Snooping

\`\`\`
! Activer DHCP Snooping globalement
Switch(config)# ip dhcp snooping
Switch(config)# ip dhcp snooping vlan 10,20

! Definir le port vers le serveur DHCP comme trusted
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip dhcp snooping trust

! Les ports clients restent untrusted par defaut
! Limiter le nombre de requetes DHCP par port (anti-starvation)
Switch(config)# interface range GigabitEthernet0/2 - 24
Switch(config-if-range)# ip dhcp snooping limit rate 10
\`\`\`

### Table de binding DHCP Snooping

\`\`\`
Switch# show ip dhcp snooping binding
MacAddress         IpAddress       Lease(sec)  Type          VLAN  Interface
-----------        ----------      ---------   ----          ----  ---------
AA:BB:CC:11:22:33  192.168.10.50   86400       dhcp-snooping 10    Gi0/5
DD:EE:FF:44:55:66  192.168.10.51   86400       dhcp-snooping 10    Gi0/8
\`\`\`

Cette table est utilisee par d'autres mecanismes de securite :
- **Dynamic ARP Inspection (DAI)** : verifie les requetes ARP contre la table de binding
- **IP Source Guard** : verifie que l'IP source correspond a la table de binding

> **A retenir :** DHCP Snooping protege contre les faux serveurs DHCP et l'epuisement du pool. La table de binding qu'il construit sert de base a DAI et IP Source Guard. C'est une couche de securite fondamentale en entreprise.`
      },
      {
        title: 'Verification et depannage DHCP',
        content: `### Commandes de verification DHCP

\`\`\`
! Voir les baux DHCP actifs (cote serveur)
Router# show ip dhcp binding
Bindings from all pools not associated with VRF:
IP address       Client-ID/           Lease expiration     Type
                 Hardware address
192.168.10.50    AABB.CC11.2233       Feb 25 2026 08:00    Automatic
192.168.10.51    DDEE.FF44.5566       Feb 25 2026 09:30    Automatic

! Voir les statistiques du serveur DHCP
Router# show ip dhcp server statistics
Memory usage         42356
Address pools        2
Database agents      0
Automatic bindings   15
Manual bindings      0
Expired bindings     3
Malformed messages   0
Secure-arp entries   0

Message              Received
BOOTREQUEST          0
DHCPDISCOVER         18
DHCPREQUEST          15
DHCPDECLINE          0
DHCPRELEASE          3
DHCPINFORM           0

Message              Sent
BOOTREPLY            0
DHCPOFFER            18
DHCPACK              15
DHCPNAK              0

! Voir la configuration du pool
Router# show ip dhcp pool
Pool LAN-POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0
 Total addresses                : 254
 Leased addresses               : 15
 Pending event                  : none
 1 subnet is currently in the pool :
 Current index        IP address range        Leased addresses
 192.168.10.16        192.168.10.1 - 192.168.10.254   15

! Voir les conflits d'adresses
Router# show ip dhcp conflict
IP address    Detection method    Detection time
192.168.10.25 Ping               Feb 24 2026 14:30
\`\`\`

### Depannage DHCP cote client

\`\`\`
! Windows
ipconfig /all         ! Voir la config IP (serveur DHCP, bail, etc.)
ipconfig /release     ! Liberer le bail DHCP
ipconfig /renew       ! Demander un nouveau bail

! Linux
sudo dhclient -r eth0    ! Liberer le bail
sudo dhclient eth0       ! Obtenir un bail
cat /var/lib/dhcp/dhclient.leases   ! Voir les baux
\`\`\`

### Checklist de depannage DHCP

| Etape | Verification | Commande |
|-------|-------------|----------|
| 1 | Le service DHCP est-il actif ? | \`show running-config \\| section dhcp\` |
| 2 | Le pool a-t-il des adresses disponibles ? | \`show ip dhcp pool\` |
| 3 | Les exclusions sont-elles correctes ? | \`show running-config \\| include excluded\` |
| 4 | Le relay est-il configure (si distant) ? | \`show running-config interface\` |
| 5 | Y a-t-il des conflits d'adresses ? | \`show ip dhcp conflict\` |
| 6 | Le DHCP Snooping bloque-t-il ? | \`show ip dhcp snooping\` |
| 7 | Le trafic UDP 67/68 passe-t-il ? | Verifier les ACL |

### Debug DHCP

\`\`\`
Router# debug ip dhcp server events
! Observe les messages DORA en temps reel
DHCPD: Sending DHCPOFFER to 192.168.10.50
DHCPD: Sending DHCPACK to 192.168.10.50

Router# debug ip dhcp server packet
! Voir le detail des paquets DHCP
\`\`\`

> **Conseil pratique :** En cas de probleme DHCP, commencez toujours par verifier si le client recoit une adresse APIPA (169.254.x.x). Si oui, le DISCOVER n'atteint pas le serveur DHCP — verifiez le relay agent et les ACL.`
      }
    ]
  },
  {
    id: 24,
    slug: 'dns-reseau',
    title: 'DNS dans le reseau',
    subtitle: 'Hierarchie DNS, types d\'enregistrements et resolution',
    icon: 'Globe',
    color: '#f59e0b',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'qzWdzAvfBoo',
    sections: [
      {
        title: 'Hierarchie et architecture DNS',
        content: `### Le DNS : l'annuaire d'Internet

Le **DNS** (Domain Name System) traduit les noms de domaine lisibles par les humains (ex: \`google.fr\`) en adresses IP utilisables par les machines (ex: \`142.250.179.67\`). Sans DNS, il faudrait memoriser les adresses IP de chaque site.

### Architecture hierarchique du DNS

Le DNS est organise en **arbre inverse** avec une structure hierarchique :

\`\`\`
                    . (racine / root)
                    |
        +-----------+-----------+
        |           |           |
       .com        .fr        .org
        |           |           |
    google.com  netrevision.fr  wikipedia.org
        |           |
    www.google.com  www.netrevision.fr
    mail.google.com api.netrevision.fr
\`\`\`

### Les niveaux de la hierarchie

| Niveau | Nom | Description | Exemple |
|--------|-----|-------------|---------|
| **Racine (root)** | \`.\` | Sommet de l'arbre, 13 groupes de serveurs racine (a.root-servers.net a m.root-servers.net) | \`.\` |
| **TLD** | Top-Level Domain | Domaines de premier niveau, geres par des registres | \`.fr\`, \`.com\`, \`.org\`, \`.net\` |
| **SLD** | Second-Level Domain | Nom de domaine enregistre | \`netrevision.fr\`, \`google.com\` |
| **Sous-domaine** | Subdomain | Division supplementaire | \`www.\`, \`mail.\`, \`api.\` |

### FQDN (Fully Qualified Domain Name)

Un FQDN est le nom complet d'un hote dans la hierarchie DNS, termine par un point (racine) :

\`\`\`
www.netrevision.fr.
|   |              |
|   |              +-- Racine (root)
|   +-- SLD (netrevision) + TLD (.fr)
+-- Sous-domaine (www)
\`\`\`

### Types de serveurs DNS

| Type | Role |
|------|------|
| **Serveur racine** | Connait les serveurs TLD (13 groupes, repartis mondialement via Anycast) |
| **Serveur TLD** | Connait les serveurs autoritaires pour chaque domaine de son TLD |
| **Serveur autoritaire** | Possede les enregistrements definitifs d'un domaine |
| **Serveur recursif (resolver)** | Interroge les autres serveurs pour le compte du client (ex: 8.8.8.8) |
| **Serveur cache** | Stocke temporairement les reponses pour accelerer les requetes suivantes |

> **Point CCNA :** Les 13 serveurs racine ne sont pas 13 machines physiques — ils sont repliques sur plus de 1000 serveurs dans le monde grace a la technologie **Anycast**.`
      },
      {
        title: 'Types d\'enregistrements DNS',
        content: `### Les enregistrements DNS essentiels

Chaque zone DNS contient des **enregistrements** (Resource Records) qui definissent les correspondances et les services :

| Type | Nom complet | Description | Exemple |
|------|-------------|-------------|---------|
| **A** | Address | Associe un nom a une IPv4 | \`www IN A 203.0.113.10\` |
| **AAAA** | IPv6 Address | Associe un nom a une IPv6 | \`www IN AAAA 2001:db8::1\` |
| **CNAME** | Canonical Name | Alias vers un autre nom | \`blog IN CNAME www.netrevision.fr.\` |
| **MX** | Mail Exchange | Serveur de messagerie du domaine | \`@ IN MX 10 mail.netrevision.fr.\` |
| **NS** | Name Server | Serveur DNS autoritaire pour la zone | \`@ IN NS ns1.provider.com.\` |
| **PTR** | Pointer | Resolution inverse (IP → nom) | \`10 IN PTR www.netrevision.fr.\` |
| **SOA** | Start of Authority | Informations sur la zone (serveur primaire, serial, TTL) | Voir ci-dessous |
| **TXT** | Text | Texte libre (SPF, DKIM, verification) | \`@ IN TXT "v=spf1 include:..."\` |
| **SRV** | Service | Localise un service specifique (port, priorite) | Active Directory, SIP |

### L'enregistrement SOA (Start of Authority)

Le SOA est le premier enregistrement de chaque zone. Il contient les metadonnees de la zone :

\`\`\`
netrevision.fr.  IN  SOA  ns1.provider.com. admin.netrevision.fr. (
    2024022401  ; Serial (format: YYYYMMDDNN)
    3600        ; Refresh (1 heure)
    900         ; Retry (15 minutes)
    604800      ; Expire (1 semaine)
    86400       ; Minimum TTL (1 jour)
)
\`\`\`

### MX et priorite

Les enregistrements MX ont une **valeur de priorite** — plus le nombre est bas, plus le serveur est prioritaire :

\`\`\`
netrevision.fr.  IN  MX  10  mx1.hostinger.com.
netrevision.fr.  IN  MX  20  mx2.hostinger.com.
\`\`\`

Le courrier est d'abord envoye a mx1 (priorite 10). Si mx1 est indisponible, mx2 (priorite 20) prend le relais.

### PTR et resolution inverse

La resolution inverse associe une IP a un nom, en utilisant le domaine special \`in-addr.arpa\` :

\`\`\`
! Pour l'IP 203.0.113.10
10.113.0.203.in-addr.arpa.  IN  PTR  www.netrevision.fr.
\`\`\`

> **Astuce CCNA :** Connaissez les 8 types d'enregistrements principaux (A, AAAA, CNAME, MX, NS, PTR, SOA, TXT). L'examen demande souvent d'identifier le type d'enregistrement correspondant a un besoin donne.`
      },
      {
        title: 'Processus de resolution DNS',
        content: `### Resolution recursive vs iterative

Il existe deux modes de resolution DNS :

**Resolution recursive** : le resolver fait tout le travail pour le client
\`\`\`
Client → Resolver recursif → "Trouve-moi l'IP de www.netrevision.fr"
                           → Le resolver interroge racine, TLD, autoritaire
                           ← Retourne la reponse finale au client
\`\`\`

**Resolution iterative** : chaque serveur renvoie le client vers le serveur suivant
\`\`\`
Client → Serveur racine → "Je ne sais pas, demande au serveur .fr"
Client → Serveur .fr → "Je ne sais pas, demande a ns1.provider.com"
Client → ns1.provider.com → "L'IP est 203.0.113.10"
\`\`\`

En pratique, le **client utilise le mode recursif** (il demande a son resolver de tout faire), et le **resolver utilise le mode iteratif** pour interroger la chaine DNS.

### Les 8 etapes d'une resolution DNS complete

\`\`\`
1. Client → Resolver  :  "Quelle est l'IP de www.netrevision.fr ?"
2. Resolver → Cache    :  Pas en cache
3. Resolver → Root     :  "Qui gere .fr ?"
4. Root → Resolver     :  "Demande a ns1.nic.fr (serveur TLD .fr)"
5. Resolver → TLD .fr  :  "Qui gere netrevision.fr ?"
6. TLD → Resolver      :  "Demande a ns1.provider.com (autoritaire)"
7. Resolver → Autoritaire : "Quelle est l'IP de www.netrevision.fr ?"
8. Autoritaire → Resolver → Client : "203.0.113.10" (mise en cache)
\`\`\`

### Le cache DNS et le TTL

Chaque reponse DNS contient un **TTL** (Time To Live) qui indique combien de temps le resultat peut etre mis en cache :

| TTL | Duree | Usage typique |
|-----|-------|---------------|
| 300 | 5 minutes | Changements frequents, failover rapide |
| 3600 | 1 heure | Usage standard |
| 86400 | 1 jour | Enregistrements stables (MX, NS) |

### Commandes de verification DNS

\`\`\`bash
# Resolution simple
nslookup www.netrevision.fr
dig www.netrevision.fr

# Resolution detaillee avec parcours complet
dig +trace www.netrevision.fr

# Interroger un type specifique
dig MX netrevision.fr
dig NS netrevision.fr
dig AAAA www.netrevision.fr

# Resolution inverse
dig -x 203.0.113.10
nslookup 203.0.113.10

# Vider le cache DNS local
# Windows
ipconfig /flushdns
# macOS
sudo dscacheutil -flushcache
# Linux
sudo systemd-resolve --flush-caches
\`\`\`

> **Important pour le CCNA :** Comprenez la difference entre recursif et iteratif. Le client fait une requete recursive a son resolver local, qui effectue ensuite des requetes iteratives vers les serveurs racine, TLD et autoritaire.`
      },
      {
        title: 'Configuration DNS sur Cisco',
        content: `### Activer la resolution DNS sur un routeur Cisco

Par defaut, un routeur Cisco tente de resoudre les noms via DNS. Voici comment le configurer correctement :

\`\`\`
! Activer la resolution DNS (active par defaut)
Router(config)# ip domain-lookup

! Definir le ou les serveurs DNS
Router(config)# ip name-server 8.8.8.8
Router(config)# ip name-server 8.8.4.4

! Definir le nom de domaine par defaut
Router(config)# ip domain-name entreprise.local

! Definir le hostname du routeur
Router(config)# hostname R1-PARIS
\`\`\`

### Creer des entrees DNS statiques

\`\`\`
! Ajouter une correspondance nom/IP statique
Router(config)# ip host SERVEUR-WEB 192.168.10.100
Router(config)# ip host SERVEUR-MAIL 192.168.10.101
Router(config)# ip host SWITCH-CORE 192.168.10.1

! Verification
Router# ping SERVEUR-WEB
Translating "SERVEUR-WEB"...domain server (8.8.8.8) [OK]
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.10.100
!!!!!
\`\`\`

### Desactiver la resolution DNS

Sur un routeur de lab ou si vous ne voulez pas que Cisco tente de resoudre les fautes de frappe comme des noms DNS (ce qui cause un delai) :

\`\`\`
! Desactiver la resolution DNS
Router(config)# no ip domain-lookup
\`\`\`

### Commandes de verification

\`\`\`
! Voir la configuration DNS
Router# show hosts
Default domain is entreprise.local
Name/address lookup uses domain service
Name servers are 8.8.8.8, 8.8.4.4

Host                 Flags   Age  Type  Address(es)
SERVEUR-WEB          (perm, OK) 0   IP    192.168.10.100
SERVEUR-MAIL         (perm, OK) 0   IP    192.168.10.101

Router# show ip dns view
DNS View default parameters:
Domain lookup is enabled
Default domain name: entreprise.local
DNS Name-server: 8.8.8.8
DNS Name-server: 8.8.4.4
\`\`\`

### DNS et securite

| Menace | Description | Protection |
|--------|-------------|------------|
| **DNS Spoofing** | Fausses reponses DNS pour rediriger le trafic | DNSSEC (signatures cryptographiques) |
| **DNS Cache Poisoning** | Empoisonner le cache d'un resolver | DNSSEC, source port randomization |
| **DNS Tunneling** | Exfiltrer des donnees via des requetes DNS | Inspection DNS, limitation des requetes |
| **DDoS par amplification DNS** | Utiliser les serveurs DNS pour amplifier une attaque | Rate limiting, Response Rate Limiting (RRL) |

> **Conseil CCNA :** La commande \`no ip domain-lookup\` est quasi indispensable en lab — elle empeche le routeur de chercher a resoudre vos fautes de frappe comme des noms DNS, ce qui fait perdre beaucoup de temps.`
      }
    ]
  },
  {
    id: 25,
    slug: 'ntp',
    title: 'NTP (Network Time Protocol)',
    subtitle: 'Synchronisation horaire et configuration NTP',
    icon: 'Clock',
    color: '#f59e0b',
    duration: '30 min',
    level: 'Debutant',
    videoId: 'LmGoMpHl6M4',
    sections: [
      {
        title: 'Pourquoi la synchronisation horaire est critique',
        content: `### L'importance du temps en reseau

La synchronisation horaire est **critique** dans un reseau informatique. Sans horloge precise et synchronisee, de nombreux services dysfonctionnent :

### Consequences d'une mauvaise synchronisation

| Domaine | Impact |
|---------|--------|
| **Logs et audit** | Impossible de correler les evenements entre equipements si les timestamps ne correspondent pas |
| **Securite** | Les certificats TLS/SSL ont une date de validite — une horloge decalee peut les invalider |
| **Authentification** | Kerberos (Active Directory) tolere maximum **5 minutes** de decalage |
| **Sauvegardes** | Les planifications de backup echouent si l'horloge est incorrecte |
| **Forensics** | En cas d'incident de securite, des timestamps incorrects rendent l'investigation impossible |
| **Protocoles reseau** | OSPF, BGP et d'autres protocoles utilisent les timestamps pour la convergence |

### Scenario concret

\`\`\`
Attaque detectee sur le serveur web a 14:32:15
Le pare-feu a log un trafic suspect a 14:28:42
Le switch a enregistre un changement MAC a 14:35:01

→ Si les horloges sont synchronisees : chronologie claire de l'attaque
→ Si les horloges sont decalees : impossible de reconstituer la sequence
\`\`\`

### NTP : le standard de synchronisation

Le **NTP** (Network Time Protocol) est le protocole standard pour synchroniser les horloges des equipements reseau. Defini par la RFC 5905, il utilise le **port UDP 123**.

**Caracteristiques :**
- Precision de l'ordre de la **milliseconde** sur un LAN
- Precision de quelques dizaines de millisecondes sur Internet
- Hierarchie de serveurs organises en **strates** (stratum)
- Algorithmes de compensation de la latence reseau

> **A retenir :** NTP est un service fondamental et souvent sous-estime. Un reseau sans NTP rend le depannage, la securite et l'audit extremement difficiles. La configuration NTP fait partie du hardening de base de tout equipement.`
      },
      {
        title: 'Architecture NTP et niveaux stratum',
        content: `### Hierarchie des strates NTP

NTP utilise un systeme hierarchique de **strates** (stratum levels) numerotees de 0 a 15 :

\`\`\`
Stratum 0 : Horloges de reference (GPS, horloge atomique)
     |
Stratum 1 : Serveurs directement connectes a Stratum 0
     |       (time.google.com, pool.ntp.org)
Stratum 2 : Serveurs synchronises sur Stratum 1
     |       (serveur NTP de votre FAI)
Stratum 3 : Serveurs synchronises sur Stratum 2
     |       (serveur NTP de votre entreprise)
  ...
Stratum 15 : Dernier niveau utilisable
Stratum 16 : Non synchronise (invalide)
\`\`\`

### Regles des strates

| Stratum | Description |
|---------|-------------|
| **0** | Source de temps de reference (horloge atomique, GPS, CDMA). Ce n'est pas un serveur NTP mais un dispositif physique |
| **1** | Serveur directement connecte a une source stratum 0. Aussi appele "serveur de temps primaire" |
| **2-15** | Chaque niveau se synchronise sur le niveau au-dessus. Le numero de stratum = nombre de "sauts" depuis la source |
| **16** | Non synchronise — l'equipement ne peut pas servir de reference |

### Modes de fonctionnement NTP

| Mode | Description | Usage |
|------|-------------|-------|
| **Client/Server** | Le client interroge le serveur periodiquement | Le plus courant — equipements vers serveur NTP |
| **Peer (symetrique)** | Deux serveurs se synchronisent mutuellement | Entre serveurs NTP de meme stratum |
| **Broadcast/Multicast** | Le serveur diffuse l'heure periodiquement | Grands reseaux LAN (moins precis) |

### Serveurs NTP publics populaires

| Serveur | Description |
|---------|-------------|
| \`time.google.com\` | Serveurs Google (stratum 1) |
| \`pool.ntp.org\` | Pool mondial de serveurs NTP |
| \`fr.pool.ntp.org\` | Pool NTP francais |
| \`time.apple.com\` | Serveurs Apple |
| \`time.windows.com\` | Serveurs Microsoft |
| \`ntp.ubuntu.com\` | Serveurs Ubuntu/Canonical |

> **Astuce CCNA :** Plus le stratum est bas, plus la source est precise. Un serveur stratum 1 est excellent. Au-dela de stratum 3-4 en entreprise, la precision peut commencer a se degrader.`
      },
      {
        title: 'Configuration NTP sur Cisco',
        content: `### Configuration client NTP

\`\`\`
! Configurer un serveur NTP (mode client/server)
Router(config)# ntp server 216.239.35.0
Router(config)# ntp server 216.239.35.4

! Configurer avec la commande prefer (serveur prioritaire)
Router(config)# ntp server 216.239.35.0 prefer

! Configurer le fuseau horaire
Router(config)# clock timezone CET 1
Router(config)# clock summer-time CEST recurring
\`\`\`

### Configuration peer NTP

\`\`\`
! Mode peer (synchronisation mutuelle entre 2 routeurs)
R1(config)# ntp peer 10.0.0.2
R2(config)# ntp peer 10.0.0.1
\`\`\`

### Configurer un routeur comme serveur NTP interne

\`\`\`
! R1 se synchronise sur un serveur externe
R1(config)# ntp server 216.239.35.0

! Les autres equipements se synchronisent sur R1
SW1(config)# ntp server 10.0.0.1
SW2(config)# ntp server 10.0.0.1
R2(config)# ntp server 10.0.0.1
\`\`\`

### Architecture NTP typique en entreprise

\`\`\`
Internet
    |
[Serveur NTP public]  (Stratum 1)
    |
[Routeur principal]   (Stratum 2) ← ntp server pool.ntp.org
    |
    +-- [Switch Core]    (Stratum 3)
    +-- [Routeur Site2]  (Stratum 3)
    +-- [Pare-feu]       (Stratum 3)
         |
         +-- [Switch Access] (Stratum 4)
\`\`\`

### Commandes de verification NTP

\`\`\`
! Voir l'heure actuelle
Router# show clock
14:32:15.123 CET Mon Feb 24 2026

! Voir les associations NTP
Router# show ntp associations
  address         ref clock     st  when  poll  reach  delay  offset    disp
*~216.239.35.0    .GOOG.        1    45    64    377   12.5   -0.234    1.2
+~216.239.35.4    .GOOG.        1    12    64    377   15.3    0.456    0.8

! Legende :
! * = serveur selectionne (sys.peer)
! + = candidat acceptable
! ~ = mode client/server
! # = mode broadcast

! Voir le statut NTP
Router# show ntp status
Clock is synchronized, stratum 2, reference is 216.239.35.0
nominal freq is 250.0000 Hz, actual freq is 250.0001 Hz
clock offset is -0.234 msec, root delay is 12.5 msec
\`\`\`

> **Bonne pratique :** Configurez toujours **au moins 2 serveurs NTP** pour la redondance. Utilisez \`prefer\` sur le serveur principal. En entreprise, designez un ou deux routeurs comme serveurs NTP internes pour limiter le trafic NTP vers Internet.`
      },
      {
        title: 'NTP Authentication et securite',
        content: `### Pourquoi authentifier NTP ?

Sans authentification, un attaquant pourrait envoyer de fausses reponses NTP pour **modifier l'horloge** de vos equipements, ce qui pourrait :
- Invalider des certificats TLS
- Perturber les logs et l'audit
- Compromettre l'authentification Kerberos
- Fausser les mecanismes de replay protection

### Configuration de l'authentification NTP

\`\`\`
! Activer l'authentification NTP
Router(config)# ntp authenticate

! Definir une cle d'authentification
Router(config)# ntp authentication-key 1 md5 MonSecret123

! Definir cette cle comme cle de confiance
Router(config)# ntp trusted-key 1

! Associer la cle au serveur NTP
Router(config)# ntp server 10.0.0.1 key 1
\`\`\`

**Les deux extremites doivent avoir la meme configuration de cle :**

\`\`\`
! Sur le serveur NTP interne
NTP-Server(config)# ntp authenticate
NTP-Server(config)# ntp authentication-key 1 md5 MonSecret123
NTP-Server(config)# ntp trusted-key 1

! Sur le client NTP
Client(config)# ntp authenticate
Client(config)# ntp authentication-key 1 md5 MonSecret123
Client(config)# ntp trusted-key 1
Client(config)# ntp server 10.0.0.1 key 1
\`\`\`

### Configurer l'horloge manuellement (si pas de NTP)

\`\`\`
! Regler l'horloge manuellement
Router# clock set 14:30:00 24 February 2026

! Configurer le fuseau horaire (France)
Router(config)# clock timezone CET 1 0
Router(config)# clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00
\`\`\`

### Activer les timestamps dans les logs

Pour que NTP soit vraiment utile, il faut activer les **timestamps** sur les logs et les messages de debug :

\`\`\`
! Timestamps sur les logs (format datetime avec millisecondes)
Router(config)# service timestamps log datetime msec localtime show-timezone
Router(config)# service timestamps debug datetime msec localtime show-timezone
\`\`\`

**Resultat dans les logs :**
\`\`\`
*Feb 24 14:32:15.123 CET: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0, changed state to up
\`\`\`

### Recapitulatif des commandes NTP

| Commande | Description |
|----------|-------------|
| \`ntp server <ip>\` | Configurer un serveur NTP |
| \`ntp server <ip> prefer\` | Serveur NTP prioritaire |
| \`ntp peer <ip>\` | Configurer un peer NTP |
| \`ntp authenticate\` | Activer l'authentification |
| \`ntp authentication-key <n> md5 <secret>\` | Definir une cle |
| \`ntp trusted-key <n>\` | Declarer une cle de confiance |
| \`show clock\` | Voir l'heure actuelle |
| \`show ntp associations\` | Voir les serveurs NTP |
| \`show ntp status\` | Voir le statut de synchronisation |

> **A retenir pour le CCNA :** L'authentification NTP utilise MD5. Les commandes cles sont \`ntp authenticate\`, \`ntp authentication-key\` et \`ntp trusted-key\`. Les trois doivent etre configurees pour que l'authentification fonctionne.`
      }
    ]
  },
  {
    id: 26,
    slug: 'snmp',
    title: 'SNMP : Supervision reseau',
    subtitle: 'Protocole SNMP, MIBs, OIDs et configuration',
    icon: 'Activity',
    color: '#f59e0b',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'kgXKUX0wbR4',
    sections: [
      {
        title: 'Introduction a SNMP',
        content: `### Qu'est-ce que SNMP ?

Le **SNMP** (Simple Network Management Protocol) est le protocole standard pour **superviser et gerer** les equipements reseau. Il permet de collecter des informations (CPU, bande passante, statut des interfaces) et de modifier des configurations a distance.

### Architecture SNMP

\`\`\`
+------------------+                    +------------------+
| NMS              |  GET/SET/TRAP      | Agent SNMP       |
| (Network         | ←───────────────→  | (routeur, switch |
|  Management      |    UDP 161/162     |  serveur)        |
|  Station)        |                    |                  |
| Ex: Zabbix,      |                    | MIB locale       |
| PRTG, Nagios     |                    +------------------+
+------------------+
\`\`\`

### Composants SNMP

| Composant | Description |
|-----------|-------------|
| **NMS (Manager)** | Station de gestion qui interroge les agents et recoit les alertes |
| **Agent SNMP** | Logiciel sur l'equipement qui repond aux requetes et envoie des traps |
| **MIB** | Base de donnees hierarchique des objets gerables |
| **OID** | Identifiant unique d'un objet dans la MIB |
| **Community string** | Mot de passe (v1/v2c) pour l'acces SNMP |

### Ports SNMP

| Port | Protocole | Direction | Usage |
|------|-----------|-----------|-------|
| **UDP 161** | SNMP | Manager → Agent | Requetes GET/SET |
| **UDP 162** | SNMP Trap | Agent → Manager | Notifications/alertes |

### Versions SNMP

| Version | Securite | Authentification | Chiffrement |
|---------|----------|-----------------|-------------|
| **SNMPv1** | Faible | Community string en clair | Non |
| **SNMPv2c** | Faible | Community string en clair | Non |
| **SNMPv3** | Forte | Username + SHA/MD5 | AES/DES |

> **A retenir :** SNMPv1 et v2c utilisent des community strings transmises **en clair** sur le reseau. En production, il faut utiliser **SNMPv3** avec authentification et chiffrement.`
      },
      {
        title: 'MIB, OID et operations SNMP',
        content: `### La MIB (Management Information Base)

La MIB est une base de donnees **hierarchique en arbre** qui organise tous les objets gerables d'un equipement. Chaque objet est identifie par un **OID** (Object Identifier) unique.

\`\`\`
iso(1)
  └── org(3)
        └── dod(6)
              └── internet(1)
                    ├── mgmt(2)
                    │     └── mib-2(1)
                    │           ├── system(1)
                    │           │     ├── sysDescr(1)     = 1.3.6.1.2.1.1.1
                    │           │     ├── sysObjectID(2)  = 1.3.6.1.2.1.1.2
                    │           │     ├── sysUpTime(3)    = 1.3.6.1.2.1.1.3
                    │           │     ├── sysContact(4)   = 1.3.6.1.2.1.1.4
                    │           │     ├── sysName(5)      = 1.3.6.1.2.1.1.5
                    │           │     └── sysLocation(6)  = 1.3.6.1.2.1.1.6
                    │           ├── interfaces(2)
                    │           │     └── ifTable(2)
                    │           │           ├── ifDescr(2)
                    │           │           ├── ifOperStatus(8)
                    │           │           ├── ifInOctets(10)
                    │           │           └── ifOutOctets(16)
                    │           └── ip(4), tcp(6), udp(7)...
                    └── private(4)
                          └── enterprises(1)
                                ├── cisco(9)
                                └── microsoft(311)
\`\`\`

### OIDs courants

| OID | Nom | Description |
|-----|-----|-------------|
| 1.3.6.1.2.1.1.1.0 | sysDescr | Description du systeme |
| 1.3.6.1.2.1.1.3.0 | sysUpTime | Temps depuis le dernier redemarrage |
| 1.3.6.1.2.1.1.5.0 | sysName | Hostname de l'equipement |
| 1.3.6.1.2.1.2.2.1.8 | ifOperStatus | Statut operationnel d'une interface (1=up, 2=down) |
| 1.3.6.1.2.1.2.2.1.10 | ifInOctets | Octets entrants sur une interface |
| 1.3.6.1.2.1.2.2.1.16 | ifOutOctets | Octets sortants sur une interface |

### Operations SNMP (PDU)

| Operation | Direction | Description |
|-----------|-----------|-------------|
| **GET** | Manager → Agent | Lire la valeur d'un OID specifique |
| **GET-NEXT** | Manager → Agent | Lire la valeur suivante dans la MIB (parcourir) |
| **GET-BULK** | Manager → Agent | Lire plusieurs OIDs en une requete (v2c/v3) |
| **SET** | Manager → Agent | Modifier la valeur d'un OID |
| **TRAP** | Agent → Manager | Notification asynchrone (pas d'acquittement) |
| **INFORM** | Agent → Manager | Notification avec acquittement (v2c/v3) |

> **Point cle :** GET lit une valeur, SET la modifie, TRAP alerte. GET-BULK (v2c+) est une optimisation pour recuperer beaucoup de donnees en une seule requete au lieu de multiples GET-NEXT.`
      },
      {
        title: 'Configuration SNMP sur Cisco',
        content: `### Configuration SNMPv2c

\`\`\`
! Community string en lecture seule (monitoring)
Router(config)# snmp-server community PUBLIC-RO ro

! Community string en lecture/ecriture (attention : risque securite)
Router(config)# snmp-server community PRIVATE-RW rw

! Restreindre l'acces SNMP a une ACL
Router(config)# access-list 10 permit 10.0.0.50
Router(config)# snmp-server community PUBLIC-RO ro 10

! Configurer la destination des traps
Router(config)# snmp-server host 10.0.0.50 version 2c PUBLIC-RO

! Activer certains types de traps
Router(config)# snmp-server enable traps snmp linkdown linkup
Router(config)# snmp-server enable traps config
Router(config)# snmp-server enable traps syslog

! Informations systeme
Router(config)# snmp-server contact admin@entreprise.fr
Router(config)# snmp-server location "Datacenter Paris, Salle A, Rack 12"
\`\`\`

### Configuration SNMPv3 (recommande)

\`\`\`
! Creer un groupe SNMPv3 avec authentification et chiffrement
Router(config)# snmp-server group MONITORING v3 priv

! Creer un utilisateur SNMPv3
Router(config)# snmp-server user monuser MONITORING v3 auth sha AuthPass123 priv aes 128 PrivPass456

! Configurer la destination des traps en v3
Router(config)# snmp-server host 10.0.0.50 version 3 priv monuser

! Activer les traps
Router(config)# snmp-server enable traps
\`\`\`

### Niveaux de securite SNMPv3

| Niveau | Auth | Chiffrement | Commande |
|--------|------|-------------|----------|
| **noAuthNoPriv** | Non | Non | \`v3 noauth\` |
| **authNoPriv** | SHA ou MD5 | Non | \`v3 auth\` |
| **authPriv** | SHA ou MD5 | AES ou DES | \`v3 priv\` |

### Verification SNMP

\`\`\`
! Voir la configuration SNMP
Router# show snmp
Chassis: ABCDEF123456
0 SNMP packets input
    0 Bad SNMP version errors
    0 Unknown community name
    0 Illegal operation for community name supplied
0 SNMP packets output

! Voir les communautes configurees
Router# show snmp community

! Voir les groupes et utilisateurs v3
Router# show snmp group
Router# show snmp user

! Tester depuis le NMS (Linux)
$ snmpget -v2c -c PUBLIC-RO 192.168.1.1 1.3.6.1.2.1.1.5.0
SNMPv2-MIB::sysName.0 = STRING: R1-PARIS

$ snmpwalk -v2c -c PUBLIC-RO 192.168.1.1 1.3.6.1.2.1.2.2
! Liste toutes les interfaces
\`\`\`

> **Bonne pratique securite :** Ne jamais utiliser les community strings par defaut (\`public\`, \`private\`). Restreindre l'acces SNMP par ACL. Privilegier SNMPv3 avec authPriv (SHA + AES). Utiliser \`ro\` (read-only) sauf si la modification a distance est necessaire.`
      },
      {
        title: 'SNMP en pratique : cas d\'usage et outils',
        content: `### Outils de supervision SNMP

| Outil | Type | Licence | Points forts |
|-------|------|---------|-------------|
| **Zabbix** | Monitoring complet | Open source | Flexible, scalable, alerting avance |
| **PRTG** | Monitoring | Commercial (free tier) | Interface intuitive, facile a deployer |
| **Nagios/Icinga** | Monitoring | Open source | Robuste, extensible par plugins |
| **LibreNMS** | Monitoring reseau | Open source | Auto-decouverte, focus reseau |
| **Cacti** | Graphing | Open source | Graphiques RRDtool, historique |
| **Prometheus + SNMP Exporter** | Metriques | Open source | Moderne, cloud-native, PromQL |

### Cas d'usage courants

**1. Monitoring de la bande passante**
\`\`\`
OIDs : ifHCInOctets (1.3.6.1.2.1.31.1.1.1.6)
        ifHCOutOctets (1.3.6.1.2.1.31.1.1.1.10)

Formule bande passante (Mbps) :
  (delta_octets / delta_temps) * 8 / 1000000
\`\`\`

**2. Surveillance du CPU et de la memoire**
\`\`\`
OIDs Cisco :
  cpmCPUTotal5min  = 1.3.6.1.4.1.9.9.109.1.1.1.1.5
  ciscoMemoryPoolFree = 1.3.6.1.4.1.9.9.48.1.1.1.6
\`\`\`

**3. Detection des interfaces down**
\`\`\`
OID : ifOperStatus = 1.3.6.1.2.1.2.2.1.8
Valeurs : 1 = up, 2 = down, 3 = testing

Trap automatique : snmp-server enable traps snmp linkdown linkup
\`\`\`

**4. Inventaire automatique**
\`\`\`
sysDescr  → Description (modele, version IOS)
sysName   → Hostname
sysUpTime → Temps depuis le dernier reboot
\`\`\`

### SNMP Traps utiles

| Trap | Declencheur |
|------|-------------|
| **linkDown / linkUp** | Interface change d'etat |
| **coldStart / warmStart** | Equipement redemarrage |
| **authenticationFailure** | Tentative d'acces SNMP echouee |
| **bgpEstablished / bgpBackwardTransition** | Changement d'etat BGP |
| **envmon** | Temperature, alimentation, ventilateur |

### Comparaison Polling vs Traps

\`\`\`
Polling (pull) :
NMS → GET → Agent → Reponse → NMS
Avantage : donnees regulieres, controlees
Inconvenient : delai entre les polls, charge reseau

Traps (push) :
Agent → TRAP → NMS
Avantage : alerte immediate, pas de polling inutile
Inconvenient : UDP non fiable (INFORM resout ce probleme)

Bonne pratique : combiner les deux
- Polling toutes les 5 min pour les metriques de performance
- Traps pour les evenements critiques (interface down, reboot)
\`\`\`

> **Conseil CCNA :** SNMP est un pilier du monitoring reseau. Connaissez les differences entre v1/v2c/v3, les operations GET/SET/TRAP, et les concepts de MIB/OID. En entreprise, Zabbix et LibreNMS sont parmi les solutions les plus deployees.`
      }
    ]
  },
  {
    id: 27,
    slug: 'syslog',
    title: 'Syslog',
    subtitle: 'Journalisation centralisee et niveaux de severite',
    icon: 'FileText',
    color: '#f59e0b',
    duration: '30 min',
    level: 'Intermediaire',
    videoId: 'nDoF03ZZlUk',
    sections: [
      {
        title: 'Introduction a Syslog',
        content: `### Qu'est-ce que Syslog ?

**Syslog** (System Logging) est un protocole standard (RFC 5424) pour la **journalisation des evenements** reseau et systeme. Il permet de centraliser les logs de tous les equipements sur un serveur unique pour faciliter le monitoring, le depannage et l'audit de securite.

### Pourquoi centraliser les logs ?

| Logging local uniquement | Logging centralise (Syslog) |
|--------------------------|----------------------------|
| Logs perdus si l'equipement redemarrage | Logs conserves sur le serveur |
| Impossible de correler les evenements | Correlation entre equipements |
| Capacite de stockage limitee | Stockage illimite sur serveur |
| Pas de vue globale | Dashboard centralise |
| Difficulte d'audit | Audit et compliance facilites |

### Architecture Syslog

\`\`\`
+----------+
| Routeur  |──┐
+----------+  │
              │  UDP 514
+----------+  │  ┌──────────────┐     ┌─────────────┐
| Switch   |──┼──│ Serveur      │────→│ Interface   │
+----------+  │  │ Syslog       │     │ Web (Kibana,│
              │  │ (rsyslog,    │     │  Graylog)   │
+----------+  │  │  syslog-ng)  │     └─────────────┘
| Pare-feu |──┘  └──────────────┘
+----------+
\`\`\`

### Transport Syslog

| Methode | Port | Fiabilite | Usage |
|---------|------|-----------|-------|
| **UDP** | 514 | Non fiable (pas d'acquittement) | Le plus courant, faible overhead |
| **TCP** | 514 ou 6514 | Fiable (acquittement) | Quand la perte de logs est inacceptable |
| **TLS/TCP** | 6514 | Fiable + chiffre | Environnements sensibles (compliance) |

> **A retenir :** Syslog est le standard de journalisation reseau. Par defaut il utilise **UDP 514** (pas de garantie de livraison). Pour les environnements critiques, utilisez TCP ou TLS.`
      },
      {
        title: 'Niveaux de severite Syslog',
        content: `### Les 8 niveaux de severite (0-7)

Chaque message Syslog a un **niveau de severite** qui indique son importance :

| Niveau | Nom | Description | Mnemonique |
|--------|-----|-------------|------------|
| **0** | **Emergency** | Systeme inutilisable | Le systeme est completement plante |
| **1** | **Alert** | Action immediate requise | Un composant critique a echoue |
| **2** | **Critical** | Conditions critiques | Panne hardware, erreur majeure |
| **3** | **Error** | Conditions d'erreur | Erreur logicielle, echec d'operation |
| **4** | **Warning** | Avertissements | Quelque chose pourrait mal tourner |
| **5** | **Notice** | Normal mais significatif | Evenement important mais normal |
| **6** | **Informational** | Messages d'information | Operation normale, info de routine |
| **7** | **Debug** | Messages de debug | Tres verbeux, pour le depannage uniquement |

### Mnemonique pour retenir les niveaux

**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily

(Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debug)

### Facility codes

Les messages Syslog incluent aussi un **facility code** qui identifie la source du message :

| Code | Facility | Description |
|------|----------|-------------|
| 0 | kern | Messages du noyau |
| 1 | user | Programmes utilisateur |
| 4 | auth | Securite/authentification |
| 10 | authpriv | Securite/authentification (prive) |
| 16-23 | local0-local7 | Usage personnalise |

### Format d'un message Syslog

\`\`\`
<priority>timestamp hostname: %facility-severity-MNEMONIC: description

Exemple Cisco :
*Feb 24 14:32:15.123: %LINEPROTO-5-UPDOWN: Line protocol on Interface
  GigabitEthernet0/0, changed state to up

Decodage :
- LINEPROTO = facility (protocole de ligne)
- 5 = severity (Notice)
- UPDOWN = mnemonic (changement d'etat)
\`\`\`

### Priorite Syslog

La **priorite** est calculee : \`Priorite = (Facility * 8) + Severite\`

Exemple : local0 (16) + warning (4) = priorite 132

> **Astuce CCNA :** Les niveaux de severite 0-7 sont a connaitre par coeur. Retenez que **0 = le plus grave** (Emergency) et **7 = le moins grave** (Debug). Quand vous configurez \`logging trap 4\`, vous recevez les niveaux 0 a 4 (Warning et plus graves).`
      },
      {
        title: 'Configuration Syslog sur Cisco',
        content: `### Configuration du logging

\`\`\`
! Activer le logging (active par defaut)
Router(config)# logging on

! Envoyer les logs a un serveur Syslog distant
Router(config)# logging host 10.0.0.50

! Definir le niveau de severite envoye au serveur
! (envoie les niveaux 0 a 6 : tout sauf debug)
Router(config)# logging trap informational

! Definir le niveau pour la console
Router(config)# logging console warnings

! Definir le niveau pour le buffer local
Router(config)# logging buffered 32768 informational

! Desactiver le logging console (recommande en production)
Router(config)# no logging console

! Activer les timestamps detailles
Router(config)# service timestamps log datetime msec localtime show-timezone
Router(config)# service timestamps debug datetime msec localtime show-timezone

! Ajouter les numeros de sequence aux logs
Router(config)# service sequence-numbers

! Definir la facility (par defaut: local7)
Router(config)# logging facility local0

! Definir l'interface source pour les paquets Syslog
Router(config)# logging source-interface Loopback0
\`\`\`

### Destinations de logging Cisco

| Destination | Commande | Usage |
|-------------|----------|-------|
| **Console** | \`logging console <level>\` | Acces console physique (lent, deconseille en prod) |
| **Terminal (VTY)** | \`terminal monitor\` | Sessions Telnet/SSH (temporaire) |
| **Buffer** | \`logging buffered <size> <level>\` | Memoire RAM du routeur (taille limitee) |
| **Serveur Syslog** | \`logging host <ip>\` + \`logging trap <level>\` | Centralise, permanent |
| **SNMP** | \`snmp-server enable traps syslog\` | Envoyer les logs comme traps SNMP |

### Configuration complete recommandee

\`\`\`
! Configuration Syslog optimale pour la production
service timestamps log datetime msec localtime show-timezone
service timestamps debug datetime msec localtime show-timezone
service sequence-numbers

logging on
no logging console
logging buffered 65536 informational
logging host 10.0.0.50
logging host 10.0.0.51
logging trap informational
logging facility local0
logging source-interface Loopback0
\`\`\`

### Verification

\`\`\`
! Voir les logs du buffer local
Router# show logging
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited)
    Console logging: disabled
    Monitor logging: level debugging, 0 messages logged
    Buffer logging:  level informational, 156 messages logged
    Logging to 10.0.0.50 (port 514), 156 message lines logged
    Logging to 10.0.0.51 (port 514), 156 message lines logged

Log Buffer (65536 bytes):
*Feb 24 14:32:15.123 CET: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0, changed state to up
*Feb 24 14:35:22.456 CET: %SYS-5-CONFIG_I: Configured from console by admin on vty0
\`\`\`

> **Bonne pratique :** Envoyez les logs vers **deux serveurs Syslog** minimum pour la redondance. Utilisez \`logging source-interface Loopback0\` pour que les logs soient toujours envoyes depuis la meme IP (facilitent le filtrage).`
      },
      {
        title: 'Serveurs Syslog et analyse des logs',
        content: `### Solutions de serveur Syslog

| Solution | Type | Points forts |
|----------|------|-------------|
| **rsyslog** | Linux natif | Leger, present par defaut, filtrage avance |
| **syslog-ng** | Linux | Flexible, parsing avance, correlation |
| **Graylog** | Open source | Interface web, recherche, dashboards |
| **ELK Stack** | Open source | Elasticsearch + Logstash + Kibana, tres puissant |
| **Splunk** | Commercial | Leader du marche, analyse avancee, ML |
| **Kiwi Syslog** | Commercial | Simple, interface Windows, free edition |

### Stack ELK pour les logs reseau

\`\`\`
Equipements reseau (Syslog UDP 514)
        |
        v
  [Logstash]     ← Collecte, parse les messages Syslog
        |           Extrait : timestamp, hostname, severity, message
        v
  [Elasticsearch] ← Indexe et stocke les logs
        |            Recherche full-text ultra-rapide
        v
  [Kibana]        ← Visualisation, dashboards, alertes
                     Recherche interactive des logs
\`\`\`

### Analyse des logs : que chercher ?

| Categorie | Evenements a surveiller | Severite |
|-----------|------------------------|----------|
| **Securite** | Echecs d'authentification, changements de config | Alert/Error |
| **Disponibilite** | Interfaces down, protocoles de routage qui flapent | Warning/Error |
| **Performance** | CPU/memoire elevee, erreurs d'interface | Warning |
| **Changements** | Modifications de configuration, mises a jour | Notice |
| **Audit** | Connexions administratives, commandes executees | Informational |

### Configurer les logs d'audit sur Cisco

\`\`\`
! Logger toutes les commandes de configuration
Router(config)# archive
Router(config-archive)# log config
Router(config-archive-log-cfg)# logging enable
Router(config-archive-log-cfg)# notify syslog contenttype plaintext

! Resultat dans les logs :
*Feb 24 14:40:00 CET: %PARSER-5-CFGLOG_LOGGEDCMD: User:admin  logged command:interface GigabitEthernet0/0
\`\`\`

### Retention et rotation des logs

| Politique | Description | Recommandation |
|-----------|-------------|---------------|
| **Retention** | Duree de conservation des logs | 90 jours minimum (compliance) |
| **Rotation** | Archiver et compresser les anciens logs | Quotidien ou hebdomadaire |
| **Archivage** | Stockage longue duree | 1 an pour l'audit, disque dedie |

### Correlation de logs

La correlation de logs consiste a recouper les evenements de plusieurs equipements pour identifier un incident :

\`\`\`
14:32:15 [Routeur] %LINEPROTO-5-UPDOWN: Gi0/0 changed state to down
14:32:15 [Switch]  %LINK-3-UPDOWN: Interface Gi0/1 changed state to down
14:32:16 [OSPF]    %OSPF-5-ADJCHG: Neighbor 10.0.0.2 went DOWN
14:32:20 [Firewall] %ASA-4-411001: Line protocol on Interface down

→ Conclusion : perte du lien physique entre le routeur et le switch
→ Impact : adjacence OSPF perdue, recalcul des routes
\`\`\`

> **A retenir :** Syslog + NTP = la combinaison indispensable pour l'audit. Les timestamps synchronises permettent de correler les evenements entre equipements. En entreprise, ELK ou Graylog sont les solutions de choix pour centraliser et analyser les logs.`
      }
    ]
  },
  {
    id: 28,
    slug: 'qos-concepts',
    title: 'QoS : Concepts fondamentaux',
    subtitle: 'Classification, marquage et mecanismes de QoS',
    icon: 'Gauge',
    color: '#f59e0b',
    duration: '40 min',
    level: 'Avance',
    videoId: '5EAk6IrGYbU',
    sections: [
      {
        title: 'Pourquoi la QoS ?',
        content: `### Le probleme : la congestion reseau

Sans QoS, tous les paquets sont traites de la meme maniere (**best-effort**). Quand le reseau est congestione, les paquets sont drops aleatoirement — un appel VoIP est traite comme un telechargement de fichier.

### Impact de la congestion par type de trafic

| Type de trafic | Sensible a la latence | Sensible a la perte | Sensible a la gigue |
|---------------|----------------------|--------------------|--------------------|
| **VoIP** | Tres sensible (< 150ms) | Sensible (< 1%) | Tres sensible (< 30ms) |
| **Video conference** | Tres sensible | Sensible | Sensible |
| **Streaming video** | Peu sensible | Sensible | Peu sensible |
| **Navigation web** | Moderement | Tolerant | Tolerant |
| **Telechargement** | Pas sensible | Tolerant (TCP retransmet) | Pas sensible |
| **Email** | Pas sensible | Pas sensible | Pas sensible |

### Definitions cles

| Terme | Definition |
|-------|-----------|
| **Latence (delay)** | Temps de transit d'un paquet de la source a la destination |
| **Gigue (jitter)** | Variation de la latence entre les paquets successifs |
| **Perte (loss)** | Pourcentage de paquets perdus (drops) |
| **Bande passante** | Capacite maximale d'un lien (ex: 1 Gbps) |

### Seuils recommandes pour la VoIP (CCNA)

\`\`\`
Latence max    : 150 ms (one-way)
Gigue max      : 30 ms
Perte max      : 1%
Bande passante : 30-100 Kbps par appel (selon le codec)
\`\`\`

### Les 3 modeles de QoS

| Modele | Description | Scalabilite |
|--------|-------------|-------------|
| **Best-Effort** | Aucune QoS, tous les paquets sont egaux | N/A |
| **IntServ** (Integrated Services) | Reservation de ressources par flux (RSVP) | Faible (ne passe pas a l'echelle) |
| **DiffServ** (Differentiated Services) | Classification en classes de service, traitement par classe | Excellente (standard actuel) |

> **A retenir pour le CCNA :** Le modele **DiffServ** est le standard actuel de QoS. IntServ (RSVP) ne passe pas a l'echelle pour les grands reseaux. Best-effort est le comportement par defaut sans QoS.`
      },
      {
        title: 'Classification et marquage',
        content: `### Principe de la classification

La classification consiste a **identifier et categoriser** le trafic reseau pour lui appliquer un traitement QoS specifique.

### Methodes de classification

| Methode | Couche | Critere | Exemple |
|---------|--------|---------|---------|
| **ACL** | L3-L4 | IP source/dest, port, protocole | Trafic port 5060 = VoIP SIP |
| **NBAR** | L7 | Analyse applicative (DPI) | Identifier Zoom, Teams, YouTube |
| **CoS** | L2 | Champ 802.1p dans le tag VLAN | CoS 5 = Voix |
| **DSCP** | L3 | Champ dans l'en-tete IP | DSCP EF = Voix |

### DSCP (Differentiated Services Code Point)

Le DSCP utilise les **6 premiers bits** du champ ToS (Type of Service) de l'en-tete IPv4 pour marquer les paquets :

\`\`\`
En-tete IPv4 :
+--------+--------+--------+--------+
| Version| IHL    |   ToS / DSCP     |
+--------+--------+--------+--------+

ToS (8 bits) :
+---+---+---+---+---+---+---+---+
| DSCP (6 bits)         | ECN(2)|
+---+---+---+---+---+---+---+---+
\`\`\`

### Valeurs DSCP courantes

| DSCP | Valeur decimale | PHB | Type de trafic |
|------|----------------|-----|---------------|
| **EF** (Expedited Forwarding) | 46 | Prioritaire | VoIP (voix) |
| **AF41** | 34 | Assured Forwarding | Video conference |
| **AF31** | 26 | Assured Forwarding | Streaming video |
| **AF21** | 18 | Assured Forwarding | Donnees critiques |
| **AF11** | 10 | Assured Forwarding | Donnees standard |
| **CS6** | 48 | Class Selector | Controle reseau (OSPF, BGP) |
| **CS3** | 24 | Class Selector | Signalisation (SIP) |
| **CS0 / BE** | 0 | Best Effort | Trafic par defaut |

### CoS (Class of Service) - 802.1p

Le champ CoS est dans le **tag 802.1Q** (3 bits, valeurs 0-7) :

| CoS | Type de trafic |
|-----|---------------|
| 7 | Controle reseau |
| 6 | Controle internetwork |
| 5 | Voix (EF) |
| 4 | Video conferencing |
| 3 | Signalisation SIP |
| 2 | Donnees haute priorite |
| 1 | Donnees moyenne priorite |
| 0 | Best effort (defaut) |

### Trust boundaries

La **frontiere de confiance** (trust boundary) definit a partir de quel point le reseau fait confiance aux marquages QoS :

\`\`\`
PC → [Switch Access] → [Switch Distribution] → [Routeur]
      |                                          |
      Trust boundary                             Pas de re-marquage
      (re-marque si necessaire)                  (on fait confiance)
\`\`\`

> **Conseil CCNA :** Connaissez les valeurs DSCP EF (46) pour la voix et AF41 (34) pour la video. La frontiere de confiance se place le plus pres possible de la source du trafic, generalement au switch d'acces.`
      },
      {
        title: 'Mecanismes de mise en file d\'attente (Queuing)',
        content: `### Pourquoi le queuing ?

Quand un lien est congestione, les paquets doivent attendre. Les mecanismes de queuing determinent **l'ordre de traitement** des paquets en file d'attente.

### Types de queuing

**1. FIFO (First In, First Out)**
\`\`\`
Entree: [VoIP] [Web] [Email] [VoIP] [FTP]
         │       │      │       │      │
Queue:  ┌───────────────────────────────┐
        │ VoIP Web Email VoIP FTP       │→ Sortie (dans l'ordre)
        └───────────────────────────────┘
\`\`\`
- Pas de priorite — premier arrive, premier servi
- Comportement par defaut sans QoS
- Probleme : un gros transfert FTP peut bloquer les paquets VoIP

**2. WFQ (Weighted Fair Queuing)**
\`\`\`
Queue VoIP   (poids 60%) : [VoIP][VoIP]
Queue Web    (poids 30%) : [Web]
Queue Email  (poids 10%) : [Email][FTP]
\`\`\`
- Repartit la bande passante proportionnellement au poids
- Automatique, base sur les flux
- Ne garantit pas de traitement prioritaire strict

**3. CBWFQ (Class-Based Weighted Fair Queuing)**
\`\`\`
Classe "VOIX"     : 30% bande passante garantie
Classe "VIDEO"    : 20% bande passante garantie
Classe "DONNEES"  : 30% bande passante garantie
Classe "DEFAUT"   : 20% bande passante restante
\`\`\`
- Chaque classe a une bande passante garantie
- Base sur des class-maps (classification)
- Pas de priorite stricte

**4. LLQ (Low Latency Queuing)**
\`\`\`
Queue PRIORITE (VoIP) : traitement immediat, bande passante stricte
Queue CBWFQ 1 (Video) : 20% garanti
Queue CBWFQ 2 (Data)  : 30% garanti
Queue Default          : reste
\`\`\`
- **LLQ = CBWFQ + queue de priorite stricte**
- La queue prioritaire est toujours traitee en premier (ideal pour la VoIP)
- Avec policing sur la queue prioritaire pour eviter la famine

### Recapitulatif queuing

| Mecanisme | Priorite stricte | Bande passante garantie | Usage |
|-----------|-----------------|------------------------|-------|
| **FIFO** | Non | Non | Defaut sans QoS |
| **WFQ** | Non | Proportionnelle | Petits liens WAN |
| **CBWFQ** | Non | Oui, par classe | Trafic sans VoIP |
| **LLQ** | Oui (1 queue) | Oui, par classe | Production avec VoIP |

> **A retenir :** **LLQ** est le mecanisme recommande pour les reseaux avec VoIP. Il combine la queue de priorite stricte (pour la voix) et CBWFQ (pour les autres classes). C'est la reponse attendue a l'examen CCNA.`
      },
      {
        title: 'Policing, Shaping et configuration QoS',
        content: `### Policing vs Shaping

Les deux mecanismes limitent le debit, mais de maniere differente :

| Critere | Policing | Shaping |
|---------|----------|---------|
| **Action sur l'exces** | Drop ou re-marque les paquets | Bufferise les paquets (delai) |
| **Effet sur le trafic** | Debit irregulier (drops soudains) | Debit lisse (smooth) |
| **Direction** | Entrant ou sortant | Sortant uniquement |
| **Latence ajoutee** | Non | Oui (buffering) |
| **Utilisation** | Imposer un SLA, trafic entrant | Adapter au debit du lien suivant |

\`\`\`
Policing (drop l'exces) :          Shaping (bufferise l'exces) :
     ___                                ___________
    |   |                              |           |
    |   |___                           |           |___
____|       |____                ______|               |___

Debit irregulier                 Debit lisse
(pics coupes brutalement)        (paquets retardes)
\`\`\`

### Configuration QoS MQC (Modular QoS CLI)

Le MQC est la methode standard de configuration QoS sur Cisco. Il utilise 3 elements :

\`\`\`
1. class-map  → Classification (identifier le trafic)
2. policy-map → Politique (definir le traitement)
3. service-policy → Application (appliquer sur une interface)
\`\`\`

### Exemple : QoS pour VoIP + Video + Data

\`\`\`
! Etape 1 : Classification
class-map match-any VOIX
 match dscp ef
 match dscp cs5
class-map match-any VIDEO
 match dscp af41
class-map match-any DONNEES-CRITIQUES
 match dscp af21

! Etape 2 : Politique
policy-map QOS-WAN
 class VOIX
  priority 512              ! LLQ : 512 Kbps priorite stricte
 class VIDEO
  bandwidth 2048            ! CBWFQ : 2 Mbps garantis
 class DONNEES-CRITIQUES
  bandwidth 1024            ! CBWFQ : 1 Mbps garanti
 class class-default
  fair-queue                ! WFQ pour le reste

! Etape 3 : Application sur l'interface sortante
interface Serial0/0
 service-policy output QOS-WAN
\`\`\`

### Verification QoS

\`\`\`
! Voir la politique appliquee et les statistiques
Router# show policy-map interface Serial0/0

 Serial0/0
  Service-policy output: QOS-WAN
    Class-map: VOIX (match-any)
      123 packets, 15000 bytes
      30 second rate 4000 bps
      Match: dscp ef
      Priority: 512 kbps, burst bytes 12800

    Class-map: VIDEO (match-any)
      456 packets, 120000 bytes
      Match: dscp af41
      Bandwidth 2048 kbps

    Class-map: class-default (match-any)
      2345 packets, 567890 bytes
      Fair-queue
\`\`\`

> **Point CCNA :** Le MQC (class-map + policy-map + service-policy) est la methode standard de configuration QoS sur Cisco. Policing drop les paquets en exces, shaping les bufferise. Pour la VoIP, utilisez toujours LLQ avec une queue de priorite stricte.`
      }
    ]
  },
  {
    id: 29,
    slug: 'ssh-acces-distant',
    title: 'SSH : Acces distant securise',
    subtitle: 'Configuration SSH et securisation de l\'acces CLI',
    icon: 'Terminal',
    color: '#f59e0b',
    duration: '35 min',
    level: 'Debutant',
    videoId: 'h6VmoXx7Qj0',
    sections: [
      {
        title: 'Telnet vs SSH : pourquoi SSH est indispensable',
        content: `### Le probleme de Telnet

**Telnet** (port TCP 23) est l'ancien protocole d'acces distant aux equipements reseau. Son probleme majeur : **tout est transmis en clair**, y compris les mots de passe.

\`\`\`
Administrateur                     Routeur
     |                                |
     |--- Telnet (port 23) ---------->|
     |    username: admin             |  ← Visible en clair
     |    password: Cisco123          |  ← Visible en clair
     |    enable password: Secret!    |  ← Visible en clair
     |                                |
\`\`\`

Un attaquant avec un analyseur de paquets (Wireshark) peut **capturer tous les identifiants** en quelques secondes.

### SSH : la solution securisee

**SSH** (Secure Shell, port TCP 22) chiffre toute la communication entre le client et le serveur :

\`\`\`
Administrateur                     Routeur
     |                                |
     |--- SSH (port 22) ------------>|
     |    [session chiffree AES-256] |
     |    [tout est illisible pour   |
     |     un attaquant]             |
     |                                |
\`\`\`

### Comparaison Telnet vs SSH

| Critere | Telnet | SSH |
|---------|--------|-----|
| **Port** | TCP 23 | TCP 22 |
| **Chiffrement** | Aucun (texte clair) | AES, 3DES, ChaCha20 |
| **Authentification** | Mot de passe en clair | Cle publique/privee ou mot de passe chiffre |
| **Integrite** | Aucune | HMAC (hash des messages) |
| **Securite** | Nulle | Forte |
| **Usage en 2026** | A proscrire | Standard obligatoire |

### SSH version 1 vs version 2

| Critere | SSHv1 | SSHv2 |
|---------|-------|-------|
| **Algorithmes** | Faibles (DES, RC4) | Forts (AES-256, SHA-256) |
| **Vulnerabilites** | Connues, exploitables | Corrigees |
| **Support** | Obsolete | Standard actuel |
| **Recommandation** | Desactiver | Toujours utiliser |

> **Regle absolue :** Ne JAMAIS utiliser Telnet en production. SSH v2 est le seul protocole acceptable pour l'acces distant aux equipements reseau. Desactiver Telnet et SSHv1 fait partie du hardening de base.`
      },
      {
        title: 'Configuration SSH sur Cisco : etape par etape',
        content: `### Prerequisites pour SSH

Avant de configurer SSH, il faut :
1. Un **hostname** (pas le defaut "Router" ou "Switch")
2. Un **nom de domaine**
3. Une paire de **cles RSA**
4. Un **compte utilisateur local** ou un serveur AAA

### Configuration complete pas a pas

\`\`\`
! Etape 1 : Definir le hostname
Router(config)# hostname R1-PARIS

! Etape 2 : Definir le domaine
R1-PARIS(config)# ip domain-name entreprise.local

! Etape 3 : Generer les cles RSA (minimum 2048 bits)
R1-PARIS(config)# crypto key generate rsa modulus 2048
The name for the keys will be: R1-PARIS.entreprise.local
% The key modulus size is 2048 bits
% Generating 2048 bit RSA keys, keys will be non-exportable...
[OK] (elapsed time was 2 seconds)

! Etape 4 : Forcer SSH version 2
R1-PARIS(config)# ip ssh version 2

! Etape 5 : Configurer les parametres SSH
R1-PARIS(config)# ip ssh time-out 60
R1-PARIS(config)# ip ssh authentication-retries 3

! Etape 6 : Creer un utilisateur local
R1-PARIS(config)# username admin privilege 15 secret MonMotDePasse!

! Etape 7 : Configurer les lignes VTY
R1-PARIS(config)# line vty 0 4
R1-PARIS(config-line)# transport input ssh
R1-PARIS(config-line)# login local
R1-PARIS(config-line)# exec-timeout 5 0
R1-PARIS(config-line)# logging synchronous
R1-PARIS(config-line)# exit
\`\`\`

### Detail des commandes

| Commande | Description |
|----------|-------------|
| \`hostname\` | Nom unique du routeur (requis pour la cle RSA) |
| \`ip domain-name\` | Domaine utilise pour generer le nom de la cle |
| \`crypto key generate rsa modulus 2048\` | Genere la paire de cles RSA |
| \`ip ssh version 2\` | Force SSH v2 (desactive v1) |
| \`ip ssh time-out 60\` | Timeout de connexion SSH (secondes) |
| \`ip ssh authentication-retries 3\` | Nombre de tentatives avant deconnexion |
| \`transport input ssh\` | Autorise UNIQUEMENT SSH sur les lignes VTY |
| \`login local\` | Authentification via la base locale d'utilisateurs |
| \`exec-timeout 5 0\` | Deconnexion apres 5 min d'inactivite |

### Se connecter en SSH

\`\`\`bash
# Depuis un PC Linux/Mac
ssh admin@192.168.1.1

# Depuis un autre routeur Cisco
R2# ssh -l admin 192.168.1.1
\`\`\`

> **Astuce CCNA :** L'ordre des etapes est important. Sans hostname et domain-name, la commande \`crypto key generate rsa\` echoue. La taille de cle minimale recommandee est **2048 bits** (1024 est obsolete).`
      },
      {
        title: 'Securisation avancee de l\'acces SSH',
        content: `### Restreindre l'acces SSH par ACL

\`\`\`
! Creer une ACL pour autoriser uniquement le reseau d'administration
R1-PARIS(config)# access-list 10 permit 10.0.99.0 0.0.0.255
R1-PARIS(config)# access-list 10 deny any log

! Appliquer l'ACL sur les lignes VTY
R1-PARIS(config)# line vty 0 4
R1-PARIS(config-line)# access-class 10 in
\`\`\`

Seules les machines du reseau 10.0.99.0/24 pourront se connecter en SSH.

### Securiser la console

\`\`\`
! Securiser l'acces console
R1-PARIS(config)# line console 0
R1-PARIS(config-line)# login local
R1-PARIS(config-line)# exec-timeout 5 0
R1-PARIS(config-line)# logging synchronous
\`\`\`

### Chiffrer les mots de passe

\`\`\`
! Chiffrer les mots de passe dans la running-config
R1-PARIS(config)# service password-encryption

! Utiliser 'secret' au lieu de 'password' (hash SHA-256 vs Vigenere faible)
R1-PARIS(config)# enable secret MonEnablePassword!
! NE PAS utiliser : enable password (chiffrement faible type 7)
\`\`\`

### Banner de connexion

\`\`\`
! Banner affiche AVANT l'authentification
R1-PARIS(config)# banner motd #
*****************************************************
* ACCES RESTREINT - Utilisation autorisee uniquement *
* Toute tentative non autorisee sera poursuivie     *
*****************************************************
#

! Banner affiche APRES l'authentification
R1-PARIS(config)# banner login #
Bienvenue sur R1-PARIS. Toutes les sessions sont enregistrees.
#
\`\`\`

### Configuration SSH complete et securisee

\`\`\`
! Configuration de reference pour le hardening SSH
hostname R1-PARIS
ip domain-name entreprise.local
crypto key generate rsa modulus 2048
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3

username admin privilege 15 secret P@ssw0rdCompl3x!
service password-encryption
enable secret En@bleS3cret!

access-list 10 permit 10.0.99.0 0.0.0.255
access-list 10 deny any log

line console 0
 login local
 exec-timeout 5 0
 logging synchronous

line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0
 logging synchronous
 access-class 10 in

banner motd # ACCES RESTREINT - Autorisation requise #
\`\`\`

> **Checklist securite SSH :** 1) SSH v2 uniquement, 2) Cles RSA >= 2048 bits, 3) Telnet desactive, 4) ACL sur les VTY, 5) Timeout d'inactivite, 6) Mots de passe complexes avec \`secret\`, 7) Banner d'avertissement.`
      },
      {
        title: 'Verification et depannage SSH',
        content: `### Commandes de verification SSH

\`\`\`
! Voir la configuration SSH
R1-PARIS# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 60 secs; Authentication retries: 3
Minimum expected Diffie Hellman key size : 2048 bits
IOS Keys in SECSH format(ssh-rsa, base64 encoded):
ssh-rsa AAAAB3NzaC1yc2EAAA...

! Voir les sessions SSH actives
R1-PARIS# show ssh
Connection  Version  Mode  Encryption  Hmac        State        Username
0           2.0      IN    aes256-cbc  hmac-sha2-  Session      admin
                                       256         started

! Voir les cles RSA generees
R1-PARIS# show crypto key mypubkey rsa
% Key pair was generated at: 14:30:00 CET Feb 24 2026
Key name: R1-PARIS.entreprise.local
Key type: RSA KEYS
 Storage Device: private-config
 Usage: General Purpose Key
 Key is not exportable. Redundancy enabled.
 Key Data:
   30820122 300D0609 2A864886 F70D0101 ...

! Verifier les lignes VTY
R1-PARIS# show line vty 0 4
   Tty  Line  Typ   Tx/Rx    A Modem  Roty AccO AccI  Uses  Noise Overruns  Int
*  0/0/0  98  VTY    -        -   -      -    -   10    1      0    0/0       -
\`\`\`

### Depannage SSH courant

| Probleme | Cause probable | Solution |
|----------|---------------|----------|
| "SSH not enabled" | Pas de cles RSA generees | \`crypto key generate rsa modulus 2048\` |
| "Connection refused" | \`transport input\` mal configure | Verifier \`transport input ssh\` sur les VTY |
| "Access denied" | Mauvais username/password | Verifier \`username\` et \`login local\` |
| "Connection timed out" | ACL bloque le trafic | Verifier \`access-class\` et les ACL |
| SSH v1 refuse | Client tente SSHv1 | Le serveur force v2, normal |
| "Incompatible key" | Cle RSA trop petite | Regenerer avec modulus >= 2048 |

### Supprimer et regenerer les cles

\`\`\`
! Supprimer les cles RSA existantes
R1-PARIS(config)# crypto key zeroize rsa
% All RSA keys will be removed.
% All router certs issued using these keys will also be removed.
Do you really want to remove these keys? [yes/no]: yes

! Regenerer avec une taille plus grande
R1-PARIS(config)# crypto key generate rsa modulus 4096
\`\`\`

### Tester la connexion SSH

\`\`\`bash
# Depuis un PC Linux, forcer SSH v2
ssh -2 admin@192.168.1.1

# Mode verbose (debug client)
ssh -v admin@192.168.1.1

# Specifier l'algorithme de chiffrement
ssh -c aes256-cbc admin@192.168.1.1
\`\`\`

### Debug SSH cote routeur

\`\`\`
R1-PARIS# debug ip ssh
SSH0: starting SSH control process
SSH0: sent protocol version id SSH-2.0-Cisco-1.25
SSH0: protocol version id is - SSH-2.0-OpenSSH_8.9
SSH0: kex_derive_keys complete
SSH0: Session started for admin on vty0
\`\`\`

> **A retenir :** \`show ip ssh\` montre la configuration SSH globale. \`show ssh\` montre les sessions actives. Si SSH ne fonctionne pas, verifiez dans l'ordre : cles RSA, hostname/domain-name, version SSH, transport input, login local, et ACL.`
      }
    ]
  },
  {
    id: 30,
    slug: 'tftp-ftp',
    title: 'TFTP et FTP',
    subtitle: 'Transfert de fichiers reseau et sauvegarde IOS',
    icon: 'Download',
    color: '#f59e0b',
    duration: '30 min',
    level: 'Debutant',
    videoId: 'dUFeczdvMUw',
    sections: [
      {
        title: 'TFTP : Trivial File Transfer Protocol',
        content: `### Qu'est-ce que TFTP ?

**TFTP** (Trivial File Transfer Protocol) est un protocole de transfert de fichiers **simple et leger**, utilise principalement pour la gestion des equipements reseau.

### Caracteristiques de TFTP

| Caracteristique | Detail |
|----------------|--------|
| **Port** | UDP 69 |
| **Protocole de transport** | UDP (non fiable, mais TFTP gere sa propre fiabilite) |
| **Authentification** | Aucune |
| **Chiffrement** | Aucun |
| **Fonctionnalites** | Lecture et ecriture de fichiers uniquement |
| **Navigation** | Pas de listing de repertoire |
| **Taille max fichier** | ~32 Mo (limitation historique, etendue dans les implementations modernes) |

### Fonctionnement de TFTP

\`\`\`
Client TFTP                    Serveur TFTP (UDP 69)
     |                              |
     |--- RRQ (Read Request) ------>|  "Je veux le fichier ios.bin"
     |                              |
     |<-- DATA (bloc 1, 512 o) ----|  Premier bloc de donnees
     |--- ACK (bloc 1) ----------->|  "Bloc 1 recu"
     |                              |
     |<-- DATA (bloc 2, 512 o) ----|  Deuxieme bloc
     |--- ACK (bloc 2) ----------->|  "Bloc 2 recu"
     |                              |
     |<-- DATA (bloc N, < 512 o) --|  Dernier bloc (< 512 = fin)
     |--- ACK (bloc N) ----------->|  Transfert termine
\`\`\`

### Pourquoi TFTP est utilise en reseau

Malgre ses limitations, TFTP est tres utilise pour :

1. **Mise a jour du firmware IOS** sur les routeurs et switches Cisco
2. **Sauvegarde de la configuration** des equipements
3. **Boot reseau** (PXE) — les stations sans disque demarrent via TFTP
4. **Provisionnement** de telephones IP (configs et firmware)

### Serveurs TFTP courants

| Outil | Plateforme | Licence |
|-------|-----------|---------|
| **tftpd-hpa** | Linux | Open source (le plus utilise) |
| **SolarWinds TFTP** | Windows | Gratuit |
| **Tftpd64** | Windows | Open source |
| **TFTP integ au routeur** | Cisco IOS | Cisco peut servir de serveur TFTP |

> **A retenir :** TFTP est simple mais sans securite (pas d'auth, pas de chiffrement). Il est adapte aux reseaux internes de confiance pour les operations de maintenance des equipements reseau. Ne JAMAIS exposer TFTP sur Internet.`
      },
      {
        title: 'FTP : File Transfer Protocol',
        content: `### Qu'est-ce que FTP ?

**FTP** (File Transfer Protocol) est un protocole de transfert de fichiers **complet** avec authentification, navigation dans les repertoires et gestion des permissions.

### Ports et modes FTP

FTP utilise **deux connexions TCP** simultanees :

| Connexion | Port | Role |
|-----------|------|------|
| **Controle** | TCP 21 | Commandes et reponses (login, ls, cd, get, put) |
| **Donnees** | TCP 20 (actif) ou port dynamique (passif) | Transfert des fichiers |

### Mode actif vs Mode passif

**Mode actif (defaut FTP) :**
\`\`\`
Client                          Serveur
  |--- Connect TCP 21 ----------->|  Connexion controle
  |--- PORT 192.168.1.10,5000 --->|  "Connecte-toi sur mon port 5000"
  |<-- Connect TCP 20 → 5000 ----|  Serveur initie la connexion donnees
  |<-- Donnees ------------------|  Transfert
\`\`\`
Probleme : le serveur initie la connexion vers le client → **bloque par les firewalls** du client.

**Mode passif (PASV) :**
\`\`\`
Client                          Serveur
  |--- Connect TCP 21 ----------->|  Connexion controle
  |--- PASV ---------------------->|  "Donne-moi un port pour les donnees"
  |<-- 227 (192.168.1.1,50000) ---|  "Connecte-toi sur mon port 50000"
  |--- Connect → 50000 ---------->|  Client initie la connexion donnees
  |<-- Donnees ------------------|  Transfert
\`\`\`
Le client initie les deux connexions → **traverse les firewalls** plus facilement.

### Comparaison TFTP vs FTP

| Critere | TFTP | FTP |
|---------|------|-----|
| **Transport** | UDP 69 | TCP 21 (controle) + TCP 20 (donnees) |
| **Authentification** | Aucune | Username + password |
| **Chiffrement** | Non | Non (FTPS/SFTP pour le chiffrement) |
| **Navigation** | Non (pas de ls, cd) | Oui (ls, cd, mkdir, rmdir) |
| **Modes de transfert** | Octet (binaire) | ASCII, binaire |
| **Fiabilite** | Geree par TFTP (ACK par bloc) | TCP natif |
| **Complexite** | Tres simple | Complexe (2 connexions, modes actif/passif) |
| **Usage reseau** | Firmware, configs, PXE boot | Echanges de fichiers generaux |

### Variantes securisees de FTP

| Protocole | Securite | Port | Description |
|-----------|----------|------|-------------|
| **FTP** | Aucune | 21 | Protocole original, tout en clair |
| **FTPS** | TLS/SSL | 990 (implicite) ou 21 (explicite) | FTP + chiffrement TLS |
| **SFTP** | SSH | 22 | Transfert de fichiers via SSH (pas lie a FTP) |
| **SCP** | SSH | 22 | Copie securisee via SSH (plus simple que SFTP) |

> **Point CCNA :** Retenez que FTP utilise 2 connexions (controle TCP 21, donnees TCP 20), TFTP utilise 1 connexion (UDP 69). Le mode passif FTP est prefere car il traverse mieux les firewalls.`
      },
      {
        title: 'Operations TFTP/FTP sur Cisco IOS',
        content: `### Sauvegarder la configuration sur un serveur TFTP

\`\`\`
! Sauvegarder la running-config sur un serveur TFTP
Router# copy running-config tftp
Address or name of remote host []? 10.0.0.50
Destination filename [running-config]? R1-config-backup.txt
!!
1024 bytes copied in 0.512 secs (2000 bytes/sec)

! Sauvegarder la startup-config
Router# copy startup-config tftp:
Address or name of remote host []? 10.0.0.50
Destination filename [startup-config]? R1-startup-backup.txt
\`\`\`

### Restaurer une configuration depuis TFTP

\`\`\`
! Restaurer la running-config depuis TFTP
Router# copy tftp running-config
Address or name of remote host []? 10.0.0.50
Source filename []? R1-config-backup.txt
Destination filename [running-config]?
Accessing tftp://10.0.0.50/R1-config-backup.txt...
Loading R1-config-backup.txt from 10.0.0.50 (via GigabitEthernet0/0): !
[OK - 1024 bytes]
\`\`\`

### Mettre a jour l'IOS via TFTP

\`\`\`
! Verifier l'espace disponible en flash
Router# show flash:
System flash directory:
File  Length   Name/status
  1   33591768 c2900-universalk9-mz.SPA.156-3.M6.bin
[33591768 bytes used, 228278232 available, 261870000 total]

! Copier la nouvelle image IOS depuis TFTP
Router# copy tftp flash:
Address or name of remote host []? 10.0.0.50
Source filename []? c2900-universalk9-mz.SPA.157-3.M8.bin
Destination filename [c2900-universalk9-mz.SPA.157-3.M8.bin]?
Loading c2900-universalk9-mz.SPA.157-3.M8.bin from 10.0.0.50...
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
[OK - 34567890 bytes]

! Configurer la nouvelle image de boot
Router(config)# boot system flash:c2900-universalk9-mz.SPA.157-3.M8.bin

! Redemarrer pour utiliser la nouvelle image
Router# reload
\`\`\`

### Utiliser FTP au lieu de TFTP

\`\`\`
! Configurer les identifiants FTP
Router(config)# ip ftp username admin
Router(config)# ip ftp password FtpPass123

! Copier via FTP
Router# copy ftp: flash:
Address or name of remote host []? 10.0.0.50
Source filename []? ios-image.bin
Destination filename [ios-image.bin]?
Accessing ftp://admin:FtpPass123@10.0.0.50/ios-image.bin...
\`\`\`

### Syntaxe universelle de la commande copy

\`\`\`
Router# copy <source> <destination>

Sources/Destinations possibles :
  running-config    → Configuration active en RAM
  startup-config    → Configuration sauvegardee en NVRAM
  flash:            → Memoire flash (images IOS)
  tftp:             → Serveur TFTP distant
  ftp:              → Serveur FTP distant
  scp:              → Serveur SCP distant (securise)
\`\`\`

> **Bonne pratique :** Toujours sauvegarder la configuration ET l'image IOS actuelle AVANT toute mise a jour. Verifiez le hash MD5 de l'image apres transfert avec \`verify /md5 flash:image.bin\` pour confirmer l'integrite du fichier.`
      },
      {
        title: 'Bonnes pratiques et securite des transferts',
        content: `### Verifier l'integrite des fichiers transferes

\`\`\`
! Verifier le hash MD5 d'un fichier en flash
Router# verify /md5 flash:c2900-universalk9-mz.SPA.157-3.M8.bin
...Done!
verify /md5 (flash:c2900-universalk9-mz.SPA.157-3.M8.bin) = a1b2c3d4e5f6...

! Comparer avec le hash fourni par Cisco
! Si les hash correspondent → fichier integre
! Si different → fichier corrompu, ne pas utiliser !
\`\`\`

### Utiliser SCP pour les transferts securises

SCP (Secure Copy Protocol) utilise SSH pour chiffrer les transferts :

\`\`\`
! Activer le serveur SCP sur le routeur
Router(config)# ip scp server enable

! Copier un fichier vers le routeur via SCP (depuis un PC)
$ scp ios-image.bin admin@192.168.1.1:flash:ios-image.bin

! Copier depuis le routeur via SCP
$ scp admin@192.168.1.1:running-config backup.txt
\`\`\`

### Procedure de mise a jour IOS securisee

| Etape | Action | Commande |
|-------|--------|----------|
| 1 | Sauvegarder la config actuelle | \`copy running-config tftp:\` |
| 2 | Sauvegarder l'image IOS actuelle | \`copy flash: tftp:\` |
| 3 | Verifier l'espace flash disponible | \`show flash:\` |
| 4 | Transferer la nouvelle image | \`copy tftp: flash:\` |
| 5 | Verifier l'integrite (MD5) | \`verify /md5 flash:image.bin\` |
| 6 | Configurer le boot system | \`boot system flash:image.bin\` |
| 7 | Sauvegarder la startup-config | \`copy running-config startup-config\` |
| 8 | Redemarrer | \`reload\` |
| 9 | Verifier la version apres reboot | \`show version\` |

### Comparaison des protocoles de transfert

| Critere | TFTP | FTP | SCP | SFTP |
|---------|------|-----|-----|------|
| **Securite** | Aucune | Faible (auth en clair) | Forte (SSH) | Forte (SSH) |
| **Port** | UDP 69 | TCP 21+20 | TCP 22 | TCP 22 |
| **Authentification** | Non | Oui | Oui (SSH) | Oui (SSH) |
| **Chiffrement** | Non | Non | Oui (AES) | Oui (AES) |
| **Support Cisco** | Natif | Natif | Natif (avec SSH) | Limite |
| **Recommandation** | Lab uniquement | Reseau interne | Production | Production |

### Automatiser les sauvegardes

\`\`\`
! Sauvegarder automatiquement la config a chaque modification
Router(config)# archive
Router(config-archive)# path tftp://10.0.0.50/$h-$t
Router(config-archive)# write-memory
Router(config-archive)# time-period 1440
\`\`\`

- \`$h\` = hostname du routeur
- \`$t\` = timestamp
- \`time-period 1440\` = sauvegarde toutes les 1440 minutes (24h)

> **Conseil CCNA :** La commande \`copy\` est fondamentale. Retenez les combinaisons courantes : \`copy run start\` (sauvegarder), \`copy tftp flash\` (mise a jour IOS), \`copy run tftp\` (backup distant). En production, preferez SCP a TFTP pour la securite.`
      }
    ]
  },
  {
    id: 31,
    slug: 'fhrp-redondance',
    title: 'FHRP : Redondance premier saut',
    subtitle: 'HSRP, VRRP, GLBP et passerelle virtuelle',
    icon: 'Shuffle',
    color: '#f59e0b',
    duration: '40 min',
    level: 'Avance',
    videoId: '43WnpwQMolo',
    sections: [
      {
        title: 'Le besoin de redondance au premier saut',
        content: `### Le probleme du Single Point of Failure

Dans un reseau classique, les postes clients sont configures avec une **passerelle par defaut unique** (default gateway). Si ce routeur tombe en panne, tous les clients perdent l'acces aux autres reseaux et a Internet, meme s'il existe un deuxieme routeur.

\`\`\`
Situation SANS FHRP :

PC (gateway: 192.168.1.1)
     |
     +--- [R1: 192.168.1.1] ─── WAN ─── Internet
     |         X PANNE !
     +--- [R2: 192.168.1.2] ─── WAN ─── Internet
                ↑ existe mais le PC ne le connait pas !

→ Le PC est configure avec 192.168.1.1 comme gateway
→ R1 tombe : le PC ne peut plus sortir du reseau
→ R2 est fonctionnel mais le PC ne sait pas qu'il faut l'utiliser
\`\`\`

### La solution : FHRP

Les **FHRP** (First Hop Redundancy Protocols) creent une **passerelle virtuelle** partagee entre plusieurs routeurs physiques. Si le routeur actif tombe, un autre prend le relais de maniere transparente pour les clients.

\`\`\`
Situation AVEC FHRP :

PC (gateway: 192.168.1.254)  ← IP virtuelle
     |
     +--- [R1: 192.168.1.1] ── ACTIVE ── WAN
     |    (IP virtuelle: 192.168.1.254)
     +--- [R2: 192.168.1.2] ── STANDBY ── WAN
          (pret a prendre le relais)

→ R1 tombe : R2 reprend l'IP virtuelle 192.168.1.254
→ Le PC continue de fonctionner sans aucun changement
\`\`\`

### Les 3 protocoles FHRP

| Protocole | Editeur | Standard | Load Balancing |
|-----------|---------|----------|---------------|
| **HSRP** | Cisco (proprietaire) | Non | Non natif |
| **VRRP** | IETF (RFC 5798) | Oui | Non natif |
| **GLBP** | Cisco (proprietaire) | Non | Oui (natif) |

### Composants d'un FHRP

| Element | Description |
|---------|-------------|
| **IP virtuelle** | Adresse IP partagee, configuree comme gateway sur les clients |
| **MAC virtuelle** | Adresse MAC generee automatiquement, associee a l'IP virtuelle |
| **Routeur actif** | Celui qui repond actuellement pour l'IP virtuelle |
| **Routeur standby** | Celui qui est pret a prendre le relais en cas de panne |
| **Priorite** | Valeur determinant quel routeur devient actif |
| **Preemption** | Capacite a reprendre le role actif apres un retour de panne |

> **A retenir :** Les FHRP sont essentiels pour la haute disponibilite. Les clients n'ont besoin de connaitre que l'IP virtuelle — le basculement est totalement transparent.`
      },
      {
        title: 'HSRP : Hot Standby Router Protocol',
        content: `### Fonctionnement de HSRP

HSRP est un protocole **proprietaire Cisco** qui permet a deux ou plusieurs routeurs de partager une IP et une MAC virtuelles.

### Roles HSRP

| Role | Description |
|------|-------------|
| **Active** | Routeur qui repond pour l'IP virtuelle (forward le trafic) |
| **Standby** | Routeur pret a prendre le relais si l'Active tombe |
| **Others** | Routeurs supplementaires (ecoutent mais n'agissent pas immediatement) |

### Election du routeur Active

1. Le routeur avec la **priorite la plus haute** devient Active (defaut: 100, range: 0-255)
2. En cas d'egalite, le routeur avec l'**IP la plus haute** gagne

### Messages HSRP

HSRP utilise des messages **Hello** envoyes en multicast :
- Adresse multicast : **224.0.0.2** (HSRPv1) ou **224.0.0.102** (HSRPv2)
- Port : **UDP 1985**
- Hello timer : 3 secondes (defaut)
- Hold timer : 10 secondes (defaut, 3x le Hello timer)

### Configuration HSRP

\`\`\`
! === Routeur R1 (Active souhaite) ===
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# standby 1 ip 192.168.1.254
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R1(config-if)# standby 1 timers 1 3

! === Routeur R2 (Standby) ===
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.1.2 255.255.255.0
R2(config-if)# standby 1 ip 192.168.1.254
R2(config-if)# standby 1 priority 100
R2(config-if)# standby 1 preempt
\`\`\`

### Parametres HSRP

| Parametre | Defaut | Description |
|-----------|--------|-------------|
| **Priority** | 100 | Plus haute = Active (0-255) |
| **Preempt** | Desactive | Si active, reprend le role Active apres retour |
| **Hello timer** | 3 sec | Intervalle des messages Hello |
| **Hold timer** | 10 sec | Temps avant de declarer l'Active down |
| **Group number** | 0 | Identifiant du groupe HSRP (0-255 v1, 0-4095 v2) |

### MAC virtuelle HSRP

\`\`\`
HSRPv1 : 0000.0c07.acXX   (XX = numero de groupe en hexa)
HSRPv2 : 0000.0c9f.fXXX   (XXX = numero de groupe en hexa)

Exemple groupe 1 : 0000.0c07.ac01
Exemple groupe 10 : 0000.0c07.ac0a
\`\`\`

### Verification HSRP

\`\`\`
R1# show standby
GigabitEthernet0/0 - Group 1
  State is Active
    2 state changes, last state change 00:05:30
  Virtual IP address is 192.168.1.254
  Active virtual MAC address is 0000.0c07.ac01
  Local virtual MAC address is 0000.0c07.ac01
  Hello time 1 sec, hold time 3 sec
  Preemption enabled
  Active router is local
  Standby router is 192.168.1.2, priority 100
  Priority 110 (configured 110)

R1# show standby brief
                     P indicates configured to preempt.
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gi0/0       1    110 P Active   local           192.168.1.2     192.168.1.254
\`\`\`

> **Astuce CCNA :** HSRP est le protocole FHRP le plus teste a l'examen. Retenez : \`standby <group> ip <vip>\`, priorite par defaut 100, preempt desactive par defaut. La MAC virtuelle commence par \`0000.0c07.ac\`.`
      },
      {
        title: 'VRRP et GLBP : alternatives a HSRP',
        content: `### VRRP (Virtual Router Redundancy Protocol)

VRRP est le standard **ouvert IETF** (RFC 5798) equivalent a HSRP. Il est supporte par tous les constructeurs (Cisco, Juniper, HP, Arista...).

### Differences HSRP vs VRRP

| Critere | HSRP | VRRP |
|---------|------|------|
| **Standard** | Cisco proprietaire | IETF RFC 5798 |
| **Roles** | Active / Standby | Master / Backup |
| **Priorite defaut** | 100 | 100 |
| **Preempt defaut** | Desactive | **Active** |
| **Hello timer** | 3 sec | 1 sec |
| **Multicast** | 224.0.0.2 (v1), 224.0.0.102 (v2) | 224.0.0.18 |
| **MAC virtuelle** | 0000.0c07.acXX | 0000.5e00.01XX |
| **IP virtuelle** | Differente des IPs reelles | Peut etre l'IP reelle du Master |
| **Multi-vendeur** | Non | Oui |

### Configuration VRRP

\`\`\`
! Routeur R1 (Master)
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# vrrp 1 ip 192.168.1.254
R1(config-if)# vrrp 1 priority 110

! Routeur R2 (Backup)
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.1.2 255.255.255.0
R2(config-if)# vrrp 1 ip 192.168.1.254
R2(config-if)# vrrp 1 priority 100
\`\`\`

### GLBP (Gateway Load Balancing Protocol)

GLBP est un protocole **proprietaire Cisco** qui apporte le **load balancing natif** en plus de la redondance.

### Fonctionnement de GLBP

Contrairement a HSRP/VRRP ou un seul routeur forward le trafic, GLBP repartit la charge :

\`\`\`
GLBP : 1 IP virtuelle, PLUSIEURS MAC virtuelles

AVG (Active Virtual Gateway) : elu, distribue les MAC
AVF1 (Active Virtual Forwarder) : R1, MAC virtuelle 1
AVF2 (Active Virtual Forwarder) : R2, MAC virtuelle 2

PC1 demande l'ARP de 192.168.1.254 → recoit MAC-V1 → trafic vers R1
PC2 demande l'ARP de 192.168.1.254 → recoit MAC-V2 → trafic vers R2
PC3 demande l'ARP de 192.168.1.254 → recoit MAC-V1 → trafic vers R1
\`\`\`

### Configuration GLBP

\`\`\`
! Routeur R1
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# glbp 1 ip 192.168.1.254
R1(config-if)# glbp 1 priority 110
R1(config-if)# glbp 1 preempt
R1(config-if)# glbp 1 load-balancing round-robin

! Routeur R2
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.1.2 255.255.255.0
R2(config-if)# glbp 1 ip 192.168.1.254
R2(config-if)# glbp 1 priority 100
R2(config-if)# glbp 1 preempt
\`\`\`

### Tableau comparatif complet

| Critere | HSRP | VRRP | GLBP |
|---------|------|------|------|
| **Proprietaire** | Cisco | IETF (ouvert) | Cisco |
| **Load Balancing** | Non | Non | Oui |
| **Routeurs actifs** | 1 | 1 | Plusieurs (AVF) |
| **Multi-vendeur** | Non | Oui | Non |
| **Complexite** | Simple | Simple | Moderee |

> **Quand utiliser quoi ?** VRRP en multi-vendeur, HSRP en environnement 100% Cisco simple, GLBP quand on veut du load balancing natif. Pour le CCNA, HSRP est le plus important a maitriser.`
      },
      {
        title: 'HSRP avance et depannage FHRP',
        content: `### HSRP Interface Tracking

Le tracking permet de **baisser automatiquement la priorite** HSRP si un lien WAN tombe, forcant le basculement :

\`\`\`
! Si l'interface WAN tombe, baisser la priorite de 20
R1(config)# track 1 interface GigabitEthernet0/1 line-protocol
R1(config)# interface GigabitEthernet0/0
R1(config-if)# standby 1 track 1 decrement 20
\`\`\`

\`\`\`
Scenario :
1. R1 : priorite 110, R2 : priorite 100 → R1 est Active
2. Le lien WAN de R1 (Gi0/1) tombe
3. R1 : priorite 110 - 20 = 90 → inferieure a R2 (100)
4. Si preempt est active sur R2 → R2 devient Active
5. Le trafic bascule vers R2 qui a un lien WAN fonctionnel
\`\`\`

### HSRPv1 vs HSRPv2

| Critere | HSRPv1 | HSRPv2 |
|---------|--------|--------|
| **Groupes** | 0-255 | 0-4095 |
| **Multicast** | 224.0.0.2 | 224.0.0.102 |
| **MAC virtuelle** | 0000.0c07.acXX | 0000.0c9f.fXXX |
| **Timers** | Secondes | Millisecondes |
| **IPv6** | Non | Oui |

\`\`\`
! Activer HSRPv2
Router(config-if)# standby version 2
\`\`\`

### HSRP Multi-groupe (load sharing)

On peut partager la charge entre R1 et R2 en utilisant **deux groupes HSRP** et deux VLANs :

\`\`\`
! R1 est Active pour le groupe 1 (VLAN 10)
R1(config-if)# standby 1 ip 192.168.10.254
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt

! R1 est Standby pour le groupe 2 (VLAN 20)
R1(config-if)# standby 2 ip 192.168.20.254
R1(config-if)# standby 2 priority 90

! R2 est Standby pour le groupe 1 (VLAN 10)
R2(config-if)# standby 1 ip 192.168.10.254
R2(config-if)# standby 1 priority 90

! R2 est Active pour le groupe 2 (VLAN 20)
R2(config-if)# standby 2 ip 192.168.20.254
R2(config-if)# standby 2 priority 110
R2(config-if)# standby 2 preempt
\`\`\`

### Depannage FHRP

\`\`\`
! Verification HSRP
show standby
show standby brief
show standby Gi0/0 1

! Verification VRRP
show vrrp
show vrrp brief

! Verification GLBP
show glbp
show glbp brief

! Debug (temporaire)
debug standby events
debug standby packets
\`\`\`

### Erreurs courantes FHRP

| Probleme | Cause | Solution |
|----------|-------|----------|
| Les deux routeurs sont Active | Probleme de communication (ACL, VLAN) | Verifier la connectivite L2 entre les routeurs |
| Pas de failover | Preempt non configure | Ajouter \`standby X preempt\` |
| Failover trop lent | Timers par defaut (3/10 sec) | Reduire les timers (\`standby X timers 1 3\`) |
| Failover non necessaire | Pas de tracking sur le lien WAN | Configurer \`standby X track\` |

> **A retenir CCNA :** Le tracking est essentiel — sans lui, HSRP ne reagit qu'a la panne du routeur lui-meme, pas a la perte d'un lien WAN. Le multi-groupe HSRP permet le load sharing entre deux routeurs sans GLBP.`
      }
    ]
  },
  {
    id: 32,
    slug: 'acl-access-control',
    title: 'ACL : Access Control Lists',
    subtitle: 'Filtrage de trafic, wildcard masks et placement des ACL',
    icon: 'Lock',
    color: '#f59e0b',
    duration: '50 min',
    level: 'Intermediaire',
    videoId: 't_aFOhXUNBE',
    sections: [
      {
        title: 'Introduction aux ACL',
        content: `### Qu'est-ce qu'une ACL ?

Une **ACL** (Access Control List) est une liste ordonnee de regles qui determine si le trafic reseau doit etre **autorise (permit)** ou **refuse (deny)** en traversant un routeur.

### Pourquoi utiliser des ACL ?

| Usage | Exemple |
|-------|---------|
| **Filtrage de trafic** | Bloquer le trafic non autorise entre reseaux |
| **Securite** | Restreindre l'acces a certains services (SSH, SNMP) |
| **QoS** | Classifier le trafic pour le marquage QoS |
| **NAT** | Definir quel trafic doit etre traduit |
| **VPN** | Definir le trafic interessant pour le tunnel |
| **Acces VTY** | Restreindre l'acces SSH/Telnet au routeur |

### Types d'ACL

| Type | Numeros | Criteres de filtrage | Placement recommande |
|------|---------|---------------------|---------------------|
| **Standard** | 1-99, 1300-1999 | Adresse IP **source** uniquement | Proche de la **destination** |
| **Extended** | 100-199, 2000-2699 | Source, destination, protocole, port | Proche de la **source** |
| **Named** | Nom texte | Standard ou Extended | Selon le type |

### Principe de fonctionnement

Les ACL sont traitees **de haut en bas**, dans l'ordre :

\`\`\`
Paquet arrive → Regle 1 : match ? → OUI → permit/deny → FIN
                                    → NON
               Regle 2 : match ? → OUI → permit/deny → FIN
                                    → NON
               Regle 3 : match ? → OUI → permit/deny → FIN
                                    → NON
               *** Implicit Deny *** → DENY (par defaut)
\`\`\`

### Le deny implicite

**IMPORTANT :** A la fin de toute ACL, il y a un **deny implicite** (deny any) invisible. Si aucune regle ne correspond au paquet, il est **systematiquement refuse**.

\`\`\`
! Cette ACL autorise le reseau 10.0.0.0/8 mais BLOQUE tout le reste
access-list 10 permit 10.0.0.0 0.255.255.255
! (implicit deny any) ← invisible mais present !
\`\`\`

> **Point critique CCNA :** Le deny implicite est la cause #1 des problemes d'ACL. Si vous creez une ACL avec uniquement des "deny", TOUT sera bloque (meme le trafic que vous voulez autoriser). Ajoutez toujours une regle "permit" pour le trafic legitime.`
      },
      {
        title: 'Wildcard masks',
        content: `### Qu'est-ce qu'un wildcard mask ?

Le **wildcard mask** est l'inverse du masque de sous-reseau. Il indique quels bits de l'adresse IP doivent correspondre (**0**) et quels bits sont ignores (**1**).

### Wildcard = inverse du masque

\`\`\`
Masque sous-reseau : 255.255.255.0   → binaire: 11111111.11111111.11111111.00000000
Wildcard mask      : 0.0.0.255       → binaire: 00000000.00000000.00000000.11111111

Masque sous-reseau : 255.255.255.192 → binaire: 11111111.11111111.11111111.11000000
Wildcard mask      : 0.0.0.63        → binaire: 00000000.00000000.00000000.00111111
\`\`\`

**Formule rapide :** Wildcard = 255.255.255.255 - masque de sous-reseau

### Tableau de correspondance

| CIDR | Masque | Wildcard | Signification |
|------|--------|----------|---------------|
| /8 | 255.0.0.0 | 0.255.255.255 | Match le 1er octet |
| /16 | 255.255.0.0 | 0.0.255.255 | Match les 2 premiers octets |
| /24 | 255.255.255.0 | 0.0.0.255 | Match les 3 premiers octets |
| /25 | 255.255.255.128 | 0.0.0.127 | Match 25 bits |
| /26 | 255.255.255.192 | 0.0.0.63 | Match 26 bits |
| /27 | 255.255.255.224 | 0.0.0.31 | Match 27 bits |
| /28 | 255.255.255.240 | 0.0.0.15 | Match 28 bits |
| /30 | 255.255.255.252 | 0.0.0.3 | Match 30 bits |
| /32 | 255.255.255.255 | 0.0.0.0 | Match exact (1 hote) |

### Cas speciaux importants

\`\`\`
! Matcher une seule adresse (host)
access-list 10 permit 192.168.1.100 0.0.0.0
! Equivalent a :
access-list 10 permit host 192.168.1.100

! Matcher toutes les adresses (any)
access-list 10 permit 0.0.0.0 255.255.255.255
! Equivalent a :
access-list 10 permit any
\`\`\`

### Exemples pratiques

\`\`\`
! Matcher le reseau 192.168.1.0/24
access-list 10 permit 192.168.1.0 0.0.0.255

! Matcher le reseau 172.16.0.0/16
access-list 10 permit 172.16.0.0 0.0.255.255

! Matcher le sous-reseau 10.0.1.0/26 (64 adresses)
access-list 10 permit 10.0.1.0 0.0.0.63

! Matcher uniquement 10.0.0.5
access-list 10 permit host 10.0.0.5
\`\`\`

> **Astuce CCNA :** Les wildcards sont un sujet classique de l'examen. Retenez que le **0 = doit matcher** et le **1 = ignore**. Le raccourci \`host\` remplace le wildcard \`0.0.0.0\` et \`any\` remplace \`255.255.255.255\`.`
      },
      {
        title: 'ACL standard et ACL etendue',
        content: `### ACL standard (1-99)

L'ACL standard filtre uniquement sur l'**adresse IP source**. Elle est simple mais peu precise.

\`\`\`
! Syntaxe
access-list <numero> {permit|deny} <source> <wildcard>

! Exemples
! Autoriser le reseau 192.168.1.0/24
access-list 10 permit 192.168.1.0 0.0.0.255

! Refuser une machine specifique
access-list 10 deny host 10.0.0.100

! Autoriser tout le reste (sinon deny implicite)
access-list 10 permit any
\`\`\`

### ACL etendue (100-199)

L'ACL etendue filtre sur : **source, destination, protocole, port source/destination**. Beaucoup plus puissante et precise.

\`\`\`
! Syntaxe
access-list <numero> {permit|deny} <protocole> <source> <wildcard>
  <destination> <wildcard> [eq|gt|lt|range <port>]

! Exemples
! Autoriser le ping (ICMP) depuis 192.168.1.0/24 vers n'importe ou
access-list 100 permit icmp 192.168.1.0 0.0.0.255 any

! Autoriser HTTP (port 80) depuis 10.0.0.0/8 vers le serveur web
access-list 100 permit tcp 10.0.0.0 0.255.255.255 host 203.0.113.10 eq 80

! Autoriser HTTPS (port 443)
access-list 100 permit tcp 10.0.0.0 0.255.255.255 host 203.0.113.10 eq 443

! Autoriser DNS (port 53, UDP)
access-list 100 permit udp any any eq 53

! Refuser tout Telnet (port 23)
access-list 100 deny tcp any any eq 23

! Autoriser le reste
access-list 100 permit ip any any
\`\`\`

### ACL nommee (Named ACL)

Les ACL nommees sont plus lisibles et offrent la possibilite de **modifier** des lignes individuelles :

\`\`\`
! ACL nommee standard
ip access-list standard FILTRAGE-SSH
 permit 10.0.99.0 0.0.0.255
 deny any log

! ACL nommee etendue
ip access-list extended FILTRAGE-WEB
 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.100 eq 80
 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.100 eq 443
 deny ip any any log
\`\`\`

### Modifier une ACL nommee (avantage majeur)

\`\`\`
! Ajouter une ligne a une position specifique
ip access-list extended FILTRAGE-WEB
 15 permit tcp 192.168.2.0 0.0.0.255 host 10.0.0.100 eq 80

! Supprimer une ligne specifique
ip access-list extended FILTRAGE-WEB
 no 15
\`\`\`

### Protocoles et ports courants pour les ACL etendues

| Protocole | Mot-cle | Ports courants |
|-----------|---------|---------------|
| **TCP** | tcp | 20 (FTP-data), 21 (FTP), 22 (SSH), 23 (Telnet), 25 (SMTP), 80 (HTTP), 443 (HTTPS) |
| **UDP** | udp | 53 (DNS), 67/68 (DHCP), 69 (TFTP), 161 (SNMP), 514 (Syslog) |
| **ICMP** | icmp | echo, echo-reply, unreachable, time-exceeded |
| **IP** | ip | Tout protocole IP (englobe TCP, UDP, ICMP) |

> **Comparaison cle :** ACL standard = source uniquement, numeros 1-99. ACL etendue = source + destination + protocole + port, numeros 100-199. Les ACL nommees sont preferees car modifiables et lisibles.`
      },
      {
        title: 'Placement et application des ACL',
        content: `### Regles de placement des ACL

Le placement est **critique** pour l'efficacite et pour ne pas bloquer du trafic legitime :

\`\`\`
ACL Standard  → Placer PROCHE DE LA DESTINATION
               (car elle filtre uniquement sur la source)

ACL Etendue   → Placer PROCHE DE LA SOURCE
               (pour bloquer le trafic au plus tot)
\`\`\`

### Pourquoi ce placement ?

**ACL Standard proche de la destination :**
\`\`\`
R1 ──── R2 ──── R3 ──── Serveur
                 ↑
          ACL standard ici
          (sinon, bloquerait aussi l'acces
           a d'autres reseaux derriere R1/R2)
\`\`\`

**ACL Etendue proche de la source :**
\`\`\`
PC ──── R1 ──── R2 ──── Serveur
         ↑
    ACL etendue ici
    (bloque le trafic non desire immediatement,
     economise la bande passante)
\`\`\`

### Application d'une ACL sur une interface

\`\`\`
! Appliquer l'ACL en entree (in) ou en sortie (out)
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group 100 in
! ou
Router(config-if)# ip access-group 100 out
\`\`\`

### Direction in vs out

\`\`\`
                    Routeur
                 ┌──────────┐
    IN           │          │           OUT
 ─────────→      │  Route   │      ─────────→
 Paquet entre    │  Table   │      Paquet sort
 par cette       │          │      par cette
 interface       └──────────┘      interface
\`\`\`

- **IN** : le trafic est filtre **avant** le routage
- **OUT** : le trafic est filtre **apres** le routage

### Regles importantes

| Regle | Detail |
|-------|--------|
| **1 ACL par interface, par protocole, par direction** | Maximum 1 ACL IPv4 in + 1 ACL IPv4 out par interface |
| **Ordre des regles** | Du plus specifique au plus general |
| **Deny implicite** | Toujours present a la fin |
| **ACL ne filtre pas le trafic genere par le routeur** | Le trafic originating du routeur n'est PAS filtre par une ACL OUT |

### Application sur les lignes VTY

\`\`\`
! Restreindre l'acces SSH au routeur
access-list 10 permit 10.0.99.0 0.0.0.255
access-list 10 deny any log

line vty 0 4
 access-class 10 in
 transport input ssh
\`\`\`

Note : sur les VTY, la commande est \`access-class\` (pas \`ip access-group\`).

> **A retenir :** Standard = proche destination, Extended = proche source. \`ip access-group\` sur les interfaces, \`access-class\` sur les VTY. Une seule ACL par interface/direction/protocole. L'ordre des regles est crucial.`
      },
      {
        title: 'Verification, depannage et exemples complets',
        content: `### Commandes de verification ACL

\`\`\`
! Voir toutes les ACL configurees
Router# show access-lists
Standard IP access list 10
    10 permit 10.0.99.0, wildcard bits 0.0.0.255 (25 matches)
    20 deny   any log (3 matches)
Extended IP access list 100
    10 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.100 eq www (150 matches)
    20 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.100 eq 443 (89 matches)
    30 deny   ip any any log (12 matches)

! Voir les ACL appliquees sur une interface
Router# show ip interface GigabitEthernet0/0
  Outgoing access list is 100
  Inbound  access list is not set

! Voir dans la running-config
Router# show running-config | section access-list
Router# show running-config | section ip access-list
\`\`\`

### Scenario complet : ACL etendue en entreprise

\`\`\`
Contexte :
- VLAN 10 (Utilisateurs) : 192.168.10.0/24
- VLAN 20 (Serveurs) : 192.168.20.0/24
- Serveur Web : 192.168.20.10
- Serveur DNS : 192.168.20.53
- Les utilisateurs doivent acceder au web (HTTP/HTTPS) et au DNS
- Tout autre trafic vers les serveurs est interdit

! ACL etendue nommee
ip access-list extended PROTECT-SERVERS
 remark --- Autoriser HTTP/HTTPS vers le serveur web ---
 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 80
 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443
 remark --- Autoriser DNS ---
 permit udp 192.168.10.0 0.0.0.255 host 192.168.20.53 eq 53
 remark --- Autoriser ICMP pour le diagnostic ---
 permit icmp 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255
 remark --- Refuser et logger tout le reste ---
 deny ip any 192.168.20.0 0.0.0.255 log

! Appliquer sur l'interface vers le VLAN utilisateurs (IN)
interface GigabitEthernet0/0.10
 ip access-group PROTECT-SERVERS in
\`\`\`

### Erreurs courantes avec les ACL

| Erreur | Consequence | Solution |
|--------|-------------|----------|
| Oublier le deny implicite | Trafic bloque sans explication | Ajouter \`permit ip any any\` si necessaire |
| Mauvais wildcard mask | Filtre trop large ou trop restreint | Verifier avec le calcul 255.255.255.255 - masque |
| ACL dans la mauvaise direction | Trafic non filtre ou tout bloque | Verifier in/out par rapport au flux |
| ACL sur la mauvaise interface | Aucun effet | Identifier le chemin du trafic |
| Regles dans le mauvais ordre | Regle plus specifique jamais atteinte | Plus specifique en premier |
| Oublier le trafic retour | Connexions TCP cassees | Ajouter \`permit tcp any any established\` |

### Autoriser le trafic retour (established)

\`\`\`
! Autoriser le trafic retour des connexions TCP etablies
access-list 100 permit tcp any 192.168.10.0 0.0.0.255 established
\`\`\`

Le mot-cle \`established\` autorise les paquets TCP avec les flags **ACK** ou **RST** positionnes (trafic retour d'une connexion initiee par le reseau interne).

### Recapitulatif des commandes ACL

| Commande | Usage |
|----------|-------|
| \`access-list <n> permit/deny ...\` | Creer une ACL numerotee |
| \`ip access-list standard/extended <nom>\` | Creer une ACL nommee |
| \`ip access-group <n/nom> in/out\` | Appliquer sur une interface |
| \`access-class <n/nom> in\` | Appliquer sur les lignes VTY |
| \`show access-lists\` | Voir les ACL et les compteurs |
| \`show ip interface <if>\` | Voir les ACL appliquees |
| \`remark\` | Ajouter un commentaire dans l'ACL |

> **Conseil final CCNA :** Les ACL sont un sujet majeur de l'examen. Maitrisez les wildcards, le placement (standard=destination, extended=source), le deny implicite, et la difference in/out. Entrainez-vous a ecrire des ACL etendues nommees avec des scenarios concrets.`
      }
    ]
  },
]
