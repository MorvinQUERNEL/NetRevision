// ─── CTF Challenges — Capture The Flag Réseau ──────────────────────────────

export interface CTFArtifact {
  name: string
  type: 'config' | 'log' | 'capture' | 'diagram'
  content: string
}

export interface CTFHint {
  id: number
  cost: number
  text: string
}

export interface CTFChallenge {
  id: string
  title: string
  description: string
  category: 'network-config' | 'security' | 'forensics' | 'protocol-analysis'
  difficulty: 1 | 2 | 3 | 4
  points: number
  scenario: string
  artifacts: CTFArtifact[]
  hints: CTFHint[]
  flag: string
  flagHash: string
}

export const ctfChallenges: CTFChallenge[] = [
  // ─── DIFFICULTY 1 (50 pts) ─────────────────────────────────────────────────

  {
    id: 'acl-oubliee',
    title: 'ACL Oubliée',
    description: 'Trouvez le réseau non protégé par une ACL dans la configuration du routeur.',
    category: 'network-config',
    difficulty: 1,
    points: 50,
    scenario: `Vous êtes administrateur réseau dans une PME. Après un audit de sécurité, on vous signale qu'un des réseaux internes n'est pas protégé par une Access Control List (ACL). Votre mission : analyser la configuration du routeur principal et identifier le réseau vulnérable.

Le routeur gère quatre sous-réseaux :
- 192.168.10.0/24 — Comptabilité
- 192.168.20.0/24 — Développement
- 192.168.30.0/24 — Direction
- 192.168.40.0/24 — Invités

Examinez la configuration et trouvez le réseau sans protection ACL.`,
    artifacts: [
      {
        name: 'router-config.txt',
        type: 'config',
        content: `Router#show running-config
!
hostname RTR-PRINCIPAL
!
interface GigabitEthernet0/0
 description LAN-Comptabilite
 ip address 192.168.10.1 255.255.255.0
 ip access-group ACL-COMPTA in
 no shutdown
!
interface GigabitEthernet0/1
 description LAN-Developpement
 ip address 192.168.20.1 255.255.255.0
 ip access-group ACL-DEV in
 no shutdown
!
interface GigabitEthernet0/2
 description LAN-Direction
 ip address 192.168.30.1 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/3
 description LAN-Invites
 ip address 192.168.40.1 255.255.255.0
 ip access-group ACL-GUEST in
 no shutdown
!
ip access-list extended ACL-COMPTA
 permit tcp 192.168.10.0 0.0.0.255 any eq 80
 permit tcp 192.168.10.0 0.0.0.255 any eq 443
 permit udp 192.168.10.0 0.0.0.255 any eq 53
 deny ip any any log
!
ip access-list extended ACL-DEV
 permit ip 192.168.20.0 0.0.0.255 any
 deny ip any any log
!
ip access-list extended ACL-GUEST
 permit tcp 192.168.40.0 0.0.0.255 any eq 80
 permit tcp 192.168.40.0 0.0.0.255 any eq 443
 deny ip any any log
!
end`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Comparez les interfaces — laquelle manque une ligne « ip access-group » ?' },
      { id: 2, cost: 20, text: 'Regardez l\'interface GigabitEthernet0/2 de plus près.' },
      { id: 3, cost: 30, text: 'Le réseau 192.168.30.0/24 (Direction) n\'a aucune ACL appliquée.' },
    ],
    flag: 'NR{192.168.30.0}',
    flagHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  },

  {
    id: 'port-mystere',
    title: 'Port Mystère',
    description: 'Identifiez le port suspect ouvert sur le serveur à partir de la sortie netstat.',
    category: 'protocol-analysis',
    difficulty: 1,
    points: 50,
    scenario: `Un serveur web de votre entreprise semble avoir un comportement anormal. Les logs montrent une consommation réseau inhabituelle la nuit. Vous lancez une commande netstat pour lister les connexions actives.

Parmi les ports ouverts, un seul est clairement suspect et ne devrait pas être présent sur un serveur web standard. Identifiez ce port.`,
    artifacts: [
      {
        name: 'netstat-output.txt',
        type: 'log',
        content: `$ netstat -tlnp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1024/sshd
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2048/nginx
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      2048/nginx
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      3072/mysqld
tcp        0      0 0.0.0.0:4444            0.0.0.0:*               LISTEN      6666/nc
tcp        0      0 127.0.0.1:9000          0.0.0.0:*               LISTEN      4096/php-fpm`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Quels services sont normaux sur un serveur web ? SSH, HTTP, HTTPS, MySQL, PHP-FPM...' },
      { id: 2, cost: 20, text: 'Le programme « nc » (netcat) est souvent utilisé pour créer des backdoors.' },
      { id: 3, cost: 30, text: 'Le port 4444 est ouvert par netcat — c\'est un port classique de reverse shell.' },
    ],
    flag: 'NR{4444}',
    flagHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
  },

  {
    id: 'vlan-perdu',
    title: 'VLAN Perdu',
    description: 'Trouvez le VLAN mal configuré dans la configuration du switch.',
    category: 'network-config',
    difficulty: 1,
    points: 50,
    scenario: `Les utilisateurs du département Marketing se plaignent de ne plus avoir accès au réseau. Le technicien précédent a modifié la configuration du switch hier soir. Vous devez trouver l'erreur dans la configuration VLAN.

Les VLANs prévus sont :
- VLAN 10 — Administration (Fa0/1-5)
- VLAN 20 — Marketing (Fa0/6-10)
- VLAN 30 — Technique (Fa0/11-15)

Examinez la configuration et trouvez le numéro du VLAN mal assigné.`,
    artifacts: [
      {
        name: 'switch-config.txt',
        type: 'config',
        content: `Switch#show running-config
!
hostname SW-ETAGE1
!
vlan 10
 name Administration
vlan 20
 name Marketing
vlan 30
 name Technique
!
interface range FastEthernet0/1-5
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
!
interface range FastEthernet0/6-10
 switchport mode access
 switchport access vlan 99
 spanning-tree portfast
!
interface range FastEthernet0/11-15
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
!
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
!
end`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Les ports Fa0/6-10 devraient être dans le VLAN Marketing...' },
      { id: 2, cost: 20, text: 'Les ports du Marketing sont assignés au VLAN 99 au lieu du VLAN 20.' },
      { id: 3, cost: 30, text: 'Le VLAN 99 n\'existe pas dans la configuration — le VLAN Marketing est le 20.' },
    ],
    flag: 'NR{vlan99}',
    flagHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
  },

  {
    id: 'ping-impossible',
    title: 'Ping Impossible',
    description: 'Analysez la table de routage pour comprendre pourquoi le ping échoue.',
    category: 'forensics',
    difficulty: 1,
    points: 50,
    scenario: `Un administrateur signale qu'il ne peut pas joindre le serveur 10.0.50.10 depuis son poste (192.168.1.100). La connectivité vers les autres réseaux fonctionne correctement. Vous devez analyser la table de routage du routeur pour trouver la cause du problème.

Trouvez le réseau de destination qui pose problème.`,
    artifacts: [
      {
        name: 'routing-table.txt',
        type: 'log',
        content: `Router#show ip route
Codes: C - connected, S - static, R - RIP, O - OSPF

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
S    10.0.10.0/24 [1/0] via 172.16.0.2
S    10.0.20.0/24 [1/0] via 172.16.0.2
S    10.0.30.0/24 [1/0] via 172.16.0.2
S    10.0.40.0/24 [1/0] via 172.16.0.2
S    10.0.50.0/24 [1/0] via 172.16.0.254
C    172.16.0.0/24 is directly connected, GigabitEthernet0/1
S*   0.0.0.0/0 [1/0] via 203.0.113.1`,
      },
      {
        name: 'ping-result.txt',
        type: 'log',
        content: `Router#ping 10.0.50.10

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.50.10, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)

Router#ping 10.0.10.10

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.10.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Comparez le next-hop de la route 10.0.50.0/24 avec les autres routes.' },
      { id: 2, cost: 20, text: 'Les routes 10.0.10-40 pointent vers 172.16.0.2, mais 10.0.50.0 pointe vers 172.16.0.254.' },
      { id: 3, cost: 30, text: 'Le next-hop 172.16.0.254 est probablement incorrect — aucun routeur n\'existe à cette adresse.' },
    ],
    flag: 'NR{172.16.0.254}',
    flagHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
  },

  // ─── DIFFICULTY 2 (100 pts) ────────────────────────────────────────────────

  {
    id: 'mot-de-passe-en-clair',
    title: 'Mot de Passe en Clair',
    description: 'Trouvez le mot de passe non chiffré dans la configuration du routeur.',
    category: 'security',
    difficulty: 2,
    points: 100,
    scenario: `Lors d'un audit de sécurité, vous découvrez qu'un routeur de production contient un mot de passe stocké en clair. C'est une faille de sécurité majeure : quiconque accède à la configuration peut lire ce mot de passe directement.

Analysez la configuration et trouvez le mot de passe non chiffré.`,
    artifacts: [
      {
        name: 'router-security-config.txt',
        type: 'config',
        content: `Router#show running-config
!
hostname RTR-PROD-01
!
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
!
username admin privilege 15 secret 5 $1$Aw2x$B4q3c5GhTwkCvLwZ6N8R41
username backup privilege 7 password 0 Sup3rS3cur3!2026
username monitor privilege 1 secret 5 $1$kP3q$R7YmNW4eLs2vX8JdFhG5K1
!
line con 0
 password 7 0822455D0A16
 login local
!
line vty 0 4
 password 7 045802150C2E
 login local
 transport input ssh
!
service password-encryption
!
ip ssh version 2
!
banner motd ^C
*** AUTHORIZED ACCESS ONLY ***
*** All activities are monitored and logged ***
^C
!
end`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez les lignes avec « password 0 » — le 0 signifie texte en clair.' },
      { id: 2, cost: 20, text: 'Le compte « backup » utilise « password 0 » au lieu de « secret 5 » (hashé).' },
      { id: 3, cost: 30, text: 'Le mot de passe en clair est « Sup3rS3cur3!2026 » pour l\'utilisateur backup.' },
    ],
    flag: 'NR{Sup3rS3cur3!2026}',
    flagHash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  },

  {
    id: 'route-piratee',
    title: 'Route Piratée',
    description: 'Détectez l\'injection de route frauduleuse dans la table OSPF.',
    category: 'forensics',
    difficulty: 2,
    points: 100,
    scenario: `Votre équipe SOC a détecté un trafic suspect vers une adresse IP externe non autorisée. Vous suspectez une injection de route dans le protocole OSPF. Un attaquant a peut-être injecté une route frauduleuse pour détourner le trafic.

Analysez la base de données OSPF et la table de routage pour trouver la route injectée par l'attaquant. Le réseau de l'entreprise utilise exclusivement les plages 10.0.0.0/8 et 172.16.0.0/12.`,
    artifacts: [
      {
        name: 'ospf-database.txt',
        type: 'log',
        content: `Router#show ip ospf database

            OSPF Router with ID (10.0.0.1) (Process ID 1)

                Router Link States (Area 0)

Link ID         ADV Router      Age   Seq#       Checksum Link count
10.0.0.1        10.0.0.1        342   0x80000015 0x00A1B2 4
10.0.0.2        10.0.0.2        512   0x80000012 0x00C3D4 3
10.0.0.3        10.0.0.3        128   0x80000008 0x00E5F6 3

                Type-5 AS External Link States

Link ID         ADV Router      Age   Seq#       Checksum Tag
0.0.0.0         10.0.0.1        342   0x80000003 0x00F1E2 0
185.192.69.0    10.0.0.3        45    0x80000001 0x003C4D 666
172.16.100.0    10.0.0.2        512   0x80000007 0x00A2B3 0`,
      },
      {
        name: 'routing-table.txt',
        type: 'log',
        content: `Router#show ip route ospf
Codes: O - OSPF, OE1 - OSPF external type 1, OE2 - OSPF external type 2

O     10.0.1.0/24 [110/2] via 10.0.0.2, 00:08:32, Gi0/1
O     10.0.2.0/24 [110/2] via 10.0.0.3, 00:02:08, Gi0/2
O     172.16.100.0/24 [110/20] via 10.0.0.2, 00:08:32, Gi0/1
OE2   185.192.69.0/24 [110/20] via 10.0.0.3, 00:00:45, Gi0/2
O*E2  0.0.0.0/0 [110/1] via 10.0.0.1, 00:05:42, Gi0/0`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez une route externe (Type-5) avec un réseau hors des plages internes.' },
      { id: 2, cost: 20, text: 'La route 185.192.69.0/24 est annoncée par 10.0.0.3 avec un tag suspect (666).' },
      { id: 3, cost: 30, text: 'Le réseau 185.192.69.0 n\'appartient pas à l\'entreprise — c\'est une injection OSPF.' },
    ],
    flag: 'NR{185.192.69.0}',
    flagHash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
  },

  {
    id: 'trame-suspecte',
    title: 'Trame Suspecte',
    description: 'Trouvez l\'anomalie dans les captures de trames Ethernet.',
    category: 'protocol-analysis',
    difficulty: 2,
    points: 100,
    scenario: `Le système de détection d'intrusion a relevé des trames Ethernet anormales sur le segment réseau principal. Vous devez analyser les captures pour identifier la trame suspecte.

Examinez les adresses MAC source et destination, les types de trames et les tailles pour trouver l'anomalie.`,
    artifacts: [
      {
        name: 'frame-capture.txt',
        type: 'capture',
        content: `Frame Capture - Port Gi0/1 (SPAN)
====================================

Frame #1  14:23:05.001
  Src MAC: 00:1A:2B:3C:4D:5E  Dst MAC: 00:1A:2B:3C:4D:6F
  Type: 0x0800 (IPv4)  Length: 64 bytes
  Info: 192.168.1.10 -> 192.168.1.1 (ICMP Echo)

Frame #2  14:23:05.015
  Src MAC: 00:1A:2B:3C:4D:6F  Dst MAC: 00:1A:2B:3C:4D:5E
  Type: 0x0800 (IPv4)  Length: 64 bytes
  Info: 192.168.1.1 -> 192.168.1.10 (ICMP Reply)

Frame #3  14:23:05.102
  Src MAC: 00:1A:2B:3C:4D:5E  Dst MAC: FF:FF:FF:FF:FF:FF
  Type: 0x0806 (ARP)  Length: 42 bytes
  Info: Who has 192.168.1.1? Tell 192.168.1.10

Frame #4  14:23:05.203
  Src MAC: 00:1A:2B:3C:4D:5E  Dst MAC: 00:1A:2B:3C:4D:6F
  Type: 0x0800 (IPv4)  Length: 1518 bytes
  Info: 192.168.1.10 -> 192.168.1.1 (TCP 443)

Frame #5  14:23:05.305
  Src MAC: AA:BB:CC:DD:EE:FF  Dst MAC: FF:FF:FF:FF:FF:FF
  Type: 0x0806 (ARP)  Length: 42 bytes
  Info: Who has 192.168.1.1? Tell 192.168.1.10
  ** Src MAC does not match ARP sender **

Frame #6  14:23:05.410
  Src MAC: 00:1A:2B:3C:4D:6F  Dst MAC: 00:1A:2B:3C:4D:5E
  Type: 0x0800 (IPv4)  Length: 128 bytes
  Info: 192.168.1.1 -> 192.168.1.10 (TCP 443 ACK)`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Comparez les adresses MAC source de chaque trame ARP avec l\'adresse IP associée.' },
      { id: 2, cost: 20, text: 'La Frame #5 a une MAC source (AA:BB:CC:DD:EE:FF) qui ne correspond pas à 192.168.1.10.' },
      { id: 3, cost: 30, text: 'La MAC AA:BB:CC:DD:EE:FF est suspecte — c\'est une tentative d\'ARP spoofing (Frame #5).' },
    ],
    flag: 'NR{AA:BB:CC:DD:EE:FF}',
    flagHash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
  },

  {
    id: 'firewall-troue',
    title: 'Firewall Troué',
    description: 'Identifiez la règle de pare-feu qui autorise un accès non souhaité.',
    category: 'security',
    difficulty: 2,
    points: 100,
    scenario: `Le RSSI vous demande de vérifier les règles du pare-feu après qu'un scan externe a révélé un service accessible depuis Internet qui ne devrait pas l'être. Le pare-feu est censé bloquer tout trafic entrant sauf HTTP (80), HTTPS (443) et SSH (22) depuis une IP d'administration spécifique.

Trouvez le numéro de la règle fautive.`,
    artifacts: [
      {
        name: 'firewall-rules.txt',
        type: 'config',
        content: `# Firewall Rules - FW-EDGE-01
# Format: ID | Action | Proto | Source | Dest | Port | Comment
#========================================================================
 1  | ACCEPT | TCP  | 203.0.113.50/32  | ANY      | 22   | SSH Admin
 2  | ACCEPT | TCP  | ANY              | ANY      | 80   | HTTP Public
 3  | ACCEPT | TCP  | ANY              | ANY      | 443  | HTTPS Public
 4  | ACCEPT | TCP  | 10.0.0.0/8       | ANY      | ANY  | Internal LAN
 5  | ACCEPT | TCP  | ANY              | ANY      | 3389 | RDP - TEMP maintenance
 6  | ACCEPT | UDP  | ANY              | ANY      | 53   | DNS Outbound
 7  | ACCEPT | TCP  | 10.0.0.0/8       | ANY      | 3306 | MySQL Internal
 8  | DROP   | ANY  | ANY              | ANY      | ANY  | Default Deny`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez une règle qui autorise un port sensible depuis n\'importe quelle source.' },
      { id: 2, cost: 20, text: 'La règle 5 autorise le RDP (port 3389) depuis ANY — accessible depuis Internet.' },
      { id: 3, cost: 30, text: 'La règle numéro 5 est la fautive : RDP ouvert au monde entier, marquée "TEMP".' },
    ],
    flag: 'NR{regle5_rdp3389}',
    flagHash: 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
  },

  // ─── DIFFICULTY 3 (200 pts) ────────────────────────────────────────────────

  {
    id: 'man-in-the-middle',
    title: 'Man in the Middle',
    description: 'Détectez une attaque ARP spoofing à partir de la table ARP.',
    category: 'security',
    difficulty: 3,
    points: 200,
    scenario: `Des utilisateurs signalent des lenteurs et des certificats SSL invalides lorsqu'ils accèdent à des sites internes. Vous suspectez une attaque Man-in-the-Middle par ARP spoofing. Un attaquant se fait passer pour la passerelle par défaut (10.0.1.1) en envoyant de fausses réponses ARP.

Analysez la table ARP de plusieurs postes et les logs du switch pour identifier l'adresse IP de l'attaquant.`,
    artifacts: [
      {
        name: 'arp-tables.txt',
        type: 'log',
        content: `=== Poste PC-COMPTA (10.0.1.50) ===
$ arp -a
? (10.0.1.1) at 08:00:27:ab:cd:ef [ether] on eth0
? (10.0.1.100) at 00:1a:2b:3c:4d:5e [ether] on eth0
? (10.0.1.200) at 00:1a:2b:3c:4d:6f [ether] on eth0

=== Poste PC-DEV (10.0.1.100) ===
$ arp -a
? (10.0.1.1) at 08:00:27:ab:cd:ef [ether] on eth0
? (10.0.1.50) at 00:1a:2b:3c:4d:7a [ether] on eth0
? (10.0.1.200) at 00:1a:2b:3c:4d:6f [ether] on eth0

=== Poste PC-ADMIN (10.0.1.200) ===
$ arp -a
? (10.0.1.1) at 08:00:27:ab:cd:ef [ether] on eth0
? (10.0.1.50) at 00:1a:2b:3c:4d:7a [ether] on eth0
? (10.0.1.100) at 00:1a:2b:3c:4d:5e [ether] on eth0`,
      },
      {
        name: 'switch-mac-table.txt',
        type: 'log',
        content: `Switch#show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 1      00:1a:2b:3c:4d:5e  DYNAMIC   Fa0/3
 1      00:1a:2b:3c:4d:6f  DYNAMIC   Fa0/5
 1      00:1a:2b:3c:4d:7a  DYNAMIC   Fa0/1
 1      08:00:27:ab:cd:ef  DYNAMIC   Fa0/10
 1      aa:bb:cc:11:22:33  DYNAMIC   Fa0/24

Switch#show interfaces Fa0/24
FastEthernet0/24 is up, line protocol is up
  Description: -- non configure --
  Hardware is Fast Ethernet, address is cc:dd:ee:ff:00:11

Switch#show ip interface brief
Interface       IP-Address   OK? Method Status Protocol
Vlan1           10.0.1.254   YES manual up     up

=== Vraie MAC de la passerelle (10.0.1.1 = Routeur Gi0/0) ===
Router#show interfaces GigabitEthernet0/0
  Hardware is GigabitEthernet, address is aa:bb:cc:11:22:33
  Internet address is 10.0.1.1/24`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Comparez la MAC associée à 10.0.1.1 dans les tables ARP avec la vraie MAC du routeur.' },
      { id: 2, cost: 20, text: 'Les postes voient 08:00:27:ab:cd:ef pour 10.0.1.1, mais la vraie MAC du routeur est aa:bb:cc:11:22:33.' },
      { id: 3, cost: 30, text: 'La machine sur Fa0/10 (MAC 08:00:27:ab:cd:ef) usurpe l\'identité de la passerelle.' },
    ],
    flag: 'NR{08:00:27:ab:cd:ef}',
    flagHash: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
  },

  {
    id: 'fuite-dns',
    title: 'Fuite DNS',
    description: 'Détectez une exfiltration de données cachée dans les requêtes DNS.',
    category: 'forensics',
    difficulty: 3,
    points: 200,
    scenario: `Le SIEM a généré une alerte pour un volume anormal de requêtes DNS vers un domaine inconnu. Vous suspectez qu'un malware exfiltre des données en encodant les informations dans les sous-domaines des requêtes DNS.

Analysez les logs DNS et trouvez le domaine utilisé pour l'exfiltration.`,
    artifacts: [
      {
        name: 'dns-query-log.txt',
        type: 'log',
        content: `# DNS Query Log - 2026-02-22 - Resolver 10.0.1.53
# Format: Timestamp | Client IP | Query Type | Query Name

14:00:01 | 10.0.1.50  | A     | www.google.com
14:00:02 | 10.0.1.100 | A     | mail.office365.com
14:00:03 | 10.0.1.50  | AAAA  | www.google.com
14:00:05 | 10.0.1.200 | A     | updates.microsoft.com
14:00:10 | 10.0.1.42  | TXT   | dXNlcm5hbWU6YWRtaW4.data.evil-c2.net
14:00:11 | 10.0.1.42  | TXT   | cGFzc3dvcmQ6UEBzc3cwcmQ.data.evil-c2.net
14:00:12 | 10.0.1.42  | TXT   | c2VydmVyOjEwLjAuMS4x.data.evil-c2.net
14:00:13 | 10.0.1.42  | TXT   | ZGF0YWJhc2U6cHJvZHVjdGlvbg.data.evil-c2.net
14:00:14 | 10.0.1.42  | TXT   | ZXhmaWx0cmF0aW9uX2RvbmU.data.evil-c2.net
14:00:15 | 10.0.1.100 | A     | slack.com
14:00:16 | 10.0.1.50  | A     | github.com
14:00:20 | 10.0.1.200 | A     | cdn.cloudflare.com
14:00:25 | 10.0.1.42  | A     | check.evil-c2.net
14:00:30 | 10.0.1.100 | MX    | gmail.com`,
      },
      {
        name: 'decoded-subdomains.txt',
        type: 'log',
        content: `# Base64 decoded subdomains from evil-c2.net queries:
# dXNlcm5hbWU6YWRtaW4       -> username:admin
# cGFzc3dvcmQ6UEBzc3cwcmQ   -> password:P@ssw0rd
# c2VydmVyOjEwLjAuMS4x       -> server:10.0.1.1
# ZGF0YWJhc2U6cHJvZHVjdGlvbg -> database:production
# ZXhmaWx0cmF0aW9uX2RvbmU   -> exfiltration_done`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez des requêtes DNS avec des sous-domaines anormalement longs ou encodés.' },
      { id: 2, cost: 20, text: 'Les requêtes TXT vers *.data.evil-c2.net contiennent du Base64 dans les sous-domaines.' },
      { id: 3, cost: 30, text: 'Le domaine C2 est evil-c2.net — le poste 10.0.1.42 exfiltre des identifiants.' },
    ],
    flag: 'NR{evil-c2.net}',
    flagHash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
  },

  {
    id: 'bgp-hijack',
    title: 'BGP Hijack',
    description: 'Détectez un détournement de préfixe BGP à partir des informations de routage.',
    category: 'protocol-analysis',
    difficulty: 3,
    points: 200,
    scenario: `Votre opérateur vous alerte : des utilisateurs dans certaines régions n'arrivent plus à accéder à vos services hébergés sur le préfixe 198.51.100.0/24 (AS 65001). Un concurrent malveillant pourrait annoncer votre préfixe de manière illégitime.

Analysez les informations BGP pour identifier l'AS pirate qui détourne votre préfixe.`,
    artifacts: [
      {
        name: 'bgp-looking-glass.txt',
        type: 'log',
        content: `=== BGP Looking Glass - Route Server EU ===

BGP routing table entry for 198.51.100.0/24
Paths: (3 available, best #1)

  Path #1 (BEST)
    AS Path: 64500 64510 65001
    Next Hop: 203.0.113.1
    Origin: IGP
    Community: 64500:100
    Last update: 2026-02-22 08:00:00 (stable since 365 days)

  Path #2
    AS Path: 64500 64520 65001
    Next Hop: 203.0.113.2
    Origin: IGP
    Community: 64500:200
    Last update: 2026-02-22 08:00:00 (stable since 340 days)

  Path #3 (SUSPICIOUS)
    AS Path: 64500 64530 65099
    Next Hop: 203.0.113.3
    Origin: IGP
    Community: 64530:999
    Last update: 2026-02-22 13:45:00 (since 15 minutes)

=== BGP routing table entry for 198.51.100.0/25 ===
Paths: (1 available, best #1)

  Path #1
    AS Path: 64500 64530 65099
    Next Hop: 203.0.113.3
    Origin: IGP
    Community: 64530:999
    Last update: 2026-02-22 13:45:00 (since 15 minutes)

=== Registered owner of 198.51.100.0/24 ===
ARIN WHOIS: NetRevision Corp, AS 65001`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez un AS qui annonce votre préfixe mais qui n\'est pas AS 65001.' },
      { id: 2, cost: 20, text: 'L\'AS 65099 annonce 198.51.100.0/24 ET un /25 plus spécifique pour capter le trafic.' },
      { id: 3, cost: 30, text: 'L\'AS 65099 est le pirate — il utilise un préfixe plus spécifique (/25) pour détourner le trafic BGP.' },
    ],
    flag: 'NR{AS65099}',
    flagHash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
  },

  {
    id: 'tunnel-cache',
    title: 'Tunnel Caché',
    description: 'Trouvez un tunnel VPN non autorisé dans la configuration des interfaces.',
    category: 'security',
    difficulty: 3,
    points: 200,
    scenario: `Un employé mécontent a configuré un tunnel VPN non autorisé sur un routeur pour exfiltrer des données vers un serveur externe. L'équipe réseau n'a approuvé que deux tunnels GRE vers les sites distants de l'entreprise (172.16.0.0/12).

Analysez la configuration des interfaces pour trouver le tunnel illégitime et son adresse de destination.`,
    artifacts: [
      {
        name: 'interface-config.txt',
        type: 'config',
        content: `Router#show running-config | section interface
!
interface GigabitEthernet0/0
 description WAN - Internet
 ip address 203.0.113.10 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/1
 description LAN - Interne
 ip address 10.0.1.1 255.255.255.0
 no shutdown
!
interface Tunnel0
 description VPN Site Lille
 ip address 172.16.255.1 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 198.51.100.1
 tunnel mode gre ip
 ip ospf 1 area 0
!
interface Tunnel1
 description VPN Site Lyon
 ip address 172.16.255.5 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 198.51.100.5
 tunnel mode gre ip
 ip ospf 1 area 0
!
interface Tunnel2
 description Monitoring backup link
 ip address 192.168.255.1 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 45.33.32.156
 tunnel mode gre ip
 keepalive 10 3
!`,
      },
      {
        name: 'approved-tunnels.txt',
        type: 'log',
        content: `=== Tunnels VPN Approuvés - Registre Réseau ===
Date de révision : 2026-01-15

Tunnel 0 : Site Lille
  - Destination : 198.51.100.1
  - Objet : Interconnexion site distant Lille
  - Responsable : Jean Dupont (Réseau)

Tunnel 1 : Site Lyon
  - Destination : 198.51.100.5
  - Objet : Interconnexion site distant Lyon
  - Responsable : Marie Martin (Réseau)

Aucun autre tunnel n'est autorisé.`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Comparez les tunnels configurés avec la liste des tunnels approuvés.' },
      { id: 2, cost: 20, text: 'Le Tunnel2 n\'apparaît pas dans le registre des tunnels approuvés.' },
      { id: 3, cost: 30, text: 'Le Tunnel2 pointe vers 45.33.32.156 — une IP externe non autorisée, déguisé en "Monitoring backup link".' },
    ],
    flag: 'NR{45.33.32.156}',
    flagHash: 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
  },

  // ─── DIFFICULTY 4 (500 pts) ────────────────────────────────────────────────

  {
    id: 'ransomware-reseau',
    title: 'Ransomware Réseau',
    description: 'Retracez le mouvement latéral d\'un ransomware à travers les logs du pare-feu.',
    category: 'forensics',
    difficulty: 4,
    points: 500,
    scenario: `Un ransomware a frappé votre réseau d'entreprise ce matin. L'équipe de réponse à incident a isolé les segments touchés, mais vous devez reconstituer la chaîne d'infection pour identifier le patient zéro.

Le réseau est segmenté en 4 VLANs :
- 10.10.10.0/24 — Postes utilisateurs
- 10.10.20.0/24 — Serveurs applicatifs
- 10.10.30.0/24 — Serveurs bases de données
- 10.10.40.0/24 — DMZ

Analysez les logs du pare-feu interne pour identifier l'adresse IP du premier poste compromis (patient zéro).`,
    artifacts: [
      {
        name: 'firewall-logs.txt',
        type: 'log',
        content: `# Firewall Internal Logs - 2026-02-22
# Format: Timestamp | Action | Proto | Src IP:Port -> Dst IP:Port | Bytes | Rule

03:14:15 | ALLOW | TCP | 10.10.10.42:49152 -> 185.143.223.1:443   | 2048  | OUT-HTTPS
03:14:16 | ALLOW | TCP | 185.143.223.1:443  -> 10.10.10.42:49152  | 65536 | IN-ESTABLISHED
03:15:00 | ALLOW | TCP | 10.10.10.42:49200 -> 10.10.10.43:445     | 512   | INTERNAL-SMB
03:15:01 | ALLOW | TCP | 10.10.10.42:49201 -> 10.10.10.44:445     | 512   | INTERNAL-SMB
03:15:02 | ALLOW | TCP | 10.10.10.42:49202 -> 10.10.10.45:445     | 512   | INTERNAL-SMB
03:15:03 | ALLOW | TCP | 10.10.10.42:49203 -> 10.10.10.46:445     | 512   | INTERNAL-SMB
03:15:10 | ALLOW | TCP | 10.10.10.42:49210 -> 10.10.20.10:445     | 512   | CROSS-VLAN-SMB
03:15:11 | ALLOW | TCP | 10.10.10.42:49211 -> 10.10.20.11:445     | 512   | CROSS-VLAN-SMB
03:15:12 | ALLOW | TCP | 10.10.10.42:49212 -> 10.10.20.12:445     | 512   | CROSS-VLAN-SMB
03:16:00 | ALLOW | TCP | 10.10.10.43:50000 -> 10.10.10.47:445     | 512   | INTERNAL-SMB
03:16:01 | ALLOW | TCP | 10.10.10.43:50001 -> 10.10.10.48:445     | 512   | INTERNAL-SMB
03:16:05 | ALLOW | TCP | 10.10.10.44:50100 -> 10.10.20.13:445     | 512   | CROSS-VLAN-SMB
03:16:30 | ALLOW | TCP | 10.10.20.10:51000 -> 10.10.30.5:1433     | 2048  | DB-ACCESS
03:16:31 | ALLOW | TCP | 10.10.20.10:51001 -> 10.10.30.6:1433     | 2048  | DB-ACCESS
03:17:00 | ALLOW | TCP | 10.10.10.42:49300 -> 185.143.223.1:443   | 32768 | OUT-HTTPS
03:17:01 | ALLOW | TCP | 10.10.10.43:49301 -> 185.143.223.1:443   | 32768 | OUT-HTTPS
03:17:02 | ALLOW | TCP | 10.10.10.44:49302 -> 185.143.223.1:443   | 32768 | OUT-HTTPS`,
      },
      {
        name: 'ids-alerts.txt',
        type: 'log',
        content: `# IDS Alerts - 2026-02-22
# Suricata Fast Log

03:14:15 [**] ET MALWARE Known Ransomware C2 Communication [**]
  SRC: 10.10.10.42 -> DST: 185.143.223.1
  Classification: A Network Trojan was detected
  Priority: 1

03:15:00 [**] ET EXPLOIT MS17-010 EternalBlue SMB Exploit Attempt [**]
  SRC: 10.10.10.42 -> DST: 10.10.10.43
  Classification: Attempted Admin Privilege Gain
  Priority: 1

03:15:01 [**] ET EXPLOIT MS17-010 EternalBlue SMB Exploit Attempt [**]
  SRC: 10.10.10.42 -> DST: 10.10.10.44
  Classification: Attempted Admin Privilege Gain
  Priority: 1

03:16:00 [**] ET EXPLOIT MS17-010 EternalBlue SMB Exploit Attempt [**]
  SRC: 10.10.10.43 -> DST: 10.10.10.47
  Classification: Attempted Admin Privilege Gain
  Priority: 1

03:17:00 [**] ET MALWARE Ransomware Data Exfiltration [**]
  SRC: 10.10.10.42 -> DST: 185.143.223.1
  Classification: Data Exfiltration Detected
  Priority: 1`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez la première connexion suspecte vers l\'extérieur dans les logs.' },
      { id: 2, cost: 20, text: 'À 03:14:15, le poste 10.10.10.42 contacte le C2 — c\'est le premier événement.' },
      { id: 3, cost: 30, text: 'Le patient zéro est 10.10.10.42 : premier contact C2, puis propagation SMB vers d\'autres postes.' },
    ],
    flag: 'NR{10.10.10.42}',
    flagHash: 'a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
  },

  {
    id: 'zero-day-snmp',
    title: 'Zero Day SNMP',
    description: 'Trouvez l\'exploitation de la community string SNMP dans les logs.',
    category: 'security',
    difficulty: 4,
    points: 500,
    scenario: `L'équipe de monitoring a détecté des modifications non autorisées sur la configuration d'un routeur. Les seuls accès SSH autorisés sont traçés et aucun ne correspond aux modifications. Vous suspectez une exploitation via SNMP.

Le routeur devrait utiliser SNMPv3 avec authentification, mais un ancien profil SNMPv2 pourrait toujours être actif. Analysez la configuration SNMP et les logs pour trouver la community string exploitée.`,
    artifacts: [
      {
        name: 'snmp-config.txt',
        type: 'config',
        content: `Router#show running-config | section snmp
!
snmp-server group ADMIN-GROUP v3 priv
snmp-server user admin-monitor ADMIN-GROUP v3 auth sha Str0ngP@ss priv aes 256 Pr1v@teKey
!
! Legacy config - to be removed (ticket #4521)
snmp-server community N3tR3v!SNMP_rw RW
snmp-server community public RO
!
snmp-server host 10.0.1.50 version 3 priv admin-monitor
snmp-server enable traps
!
snmp-server contact admin@netrevision.local
snmp-server location Datacenter-Paris-Rack42
!`,
      },
      {
        name: 'snmp-traffic-log.txt',
        type: 'log',
        content: `# SNMP Traffic Capture - 2026-02-22
# Format: Timestamp | Src IP | SNMP Version | Community/User | Operation | OID

02:00:01 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.1.1.0 (sysDescr)
02:05:00 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.2.2.1.10 (ifInOctets)
02:10:00 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.1.3.0 (sysUpTime)
...
04:32:10 | 10.0.1.200  | v2c    | public        | GET    | 1.3.6.1.2.1.1.1.0 (sysDescr)
04:32:15 | 10.0.1.200  | v2c    | public        | WALK   | 1.3.6.1.2.1.2.2 (interfaces)
04:33:00 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.4.1.9.2.1.55 (writeNet)
04:33:05 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.4.1.9.9.41.1 (syslogConfig)
04:33:10 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.4.1.9.2.1.54 (hostConfig)
04:34:00 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.2.1.1.5.0 (sysName)
04:34:30 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.1.3.0 (sysUpTime)`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Cherchez des opérations SNMP SET — elles modifient la configuration du routeur.' },
      { id: 2, cost: 20, text: 'Le poste 10.0.1.200 utilise SNMPv2c avec une community RW pour effectuer des SET.' },
      { id: 3, cost: 30, text: 'La community string exploitée est « N3tR3v!SNMP_rw » — un legacy v2c RW jamais supprimé.' },
    ],
    flag: 'NR{N3tR3v!SNMP_rw}',
    flagHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
  },

  {
    id: 'exfiltration-icmp',
    title: 'Exfiltration ICMP',
    description: 'Détectez des données cachées dans les payloads ICMP.',
    category: 'protocol-analysis',
    difficulty: 4,
    points: 500,
    scenario: `Le pare-feu bloque tout le trafic sortant sauf ICMP (ping) et DNS. Un analyste SOC a remarqué que les pings depuis le poste 10.0.5.77 ont des tailles inhabituelles. Vous suspectez qu'un malware utilise le protocole ICMP pour exfiltrer des données en les cachant dans le payload des paquets.

Analysez la capture réseau et décodez le message caché dans les payloads ICMP pour trouver le mot de passe volé.`,
    artifacts: [
      {
        name: 'icmp-capture.txt',
        type: 'capture',
        content: `# ICMP Packet Capture - 2026-02-22
# Filtered: src 10.0.5.77, ICMP Echo Request only
# Format: Timestamp | Src -> Dst | Type | Size | Payload (hex + ASCII)

14:30:01 | 10.0.5.77 -> 8.8.8.8 | Echo Request | 64 bytes
  Payload: 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70  abcdefghijklmnop
  (Standard padding - normal ping)

14:30:02 | 10.0.5.77 -> 8.8.8.8 | Echo Request | 64 bytes
  Payload: 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70  abcdefghijklmnop
  (Standard padding - normal ping)

14:31:00 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 63 72 65 64 73 3a 72 6f 6f  SECRET:creds:roo
          74 3a 54 6f 70 53 33 63 72 33 74 50 40 73 73 21   t:TopS3cr3tP@ss!

14:31:01 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 64 62 5f 68 6f 73 74 3a 31  SECRET:db_host:1
          30 2e 30 2e 33 30 2e 35 3a 33 33 30 36 00 00 00   0.0.30.5:3306...

14:31:02 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 61 70 69 5f 6b 65 79 3a 41  SECRET:api_key:A
          4b 2d 78 39 38 37 36 35 34 33 32 31 00 00 00 00   K-x987654321....

14:31:30 | 10.0.5.77 -> 8.8.8.8 | Echo Request | 64 bytes
  Payload: 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70  abcdefghijklmnop
  (Standard padding - normal ping)

14:32:00 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 65 6e 64 3a 66 6c 61 67 3d  SECRET:end:flag=
          54 6f 70 53 33 63 72 33 74 50 40 73 73 21 00 00   TopS3cr3tP@ss!..`,
      },
      {
        name: 'normal-ping-baseline.txt',
        type: 'log',
        content: `# Baseline ICMP - Poste standard
# Normal ping size: 64 bytes
# Normal payload: repeating pattern "abcdefghijklmnop"
# Normal destinations: DNS servers (8.8.8.8, 1.1.1.1), gateway

# Anomalies detected for 10.0.5.77:
# - Pings to 1.2.3.4 (unknown destination)
# - Payload size: 128 bytes (double the normal)
# - Non-standard payload content (ASCII readable data)
# - Pattern: "SECRET:" prefix in payload`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Les pings normaux font 64 octets avec un payload standard. Cherchez les paquets différents.' },
      { id: 2, cost: 20, text: 'Les pings vers 1.2.3.4 de 128 octets contiennent des données ASCII lisibles préfixées par « SECRET: ».' },
      { id: 3, cost: 30, text: 'Le payload contient "creds:root:TopS3cr3tP@ss!" — c\'est le mot de passe exfiltré via ICMP.' },
    ],
    flag: 'NR{TopS3cr3tP@ss!}',
    flagHash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
  },
]
