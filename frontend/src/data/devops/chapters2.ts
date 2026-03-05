import type { Chapter } from '../chapters'

export const chapters: Chapter[] = [
  {
    id: 106,
    slug: 'osi-tcpip-devops',
    title: 'Modele OSI & TCP/IP pour DevOps',
    subtitle: 'Comprendre les couches reseau essentielles pour diagnostiquer et deployer des services',
    icon: 'Network',
    color: '#8b5cf6',
    duration: '30 min',
    level: 'Debutant',
    videoId: '26jazyc7VNk',
    sections: [
      {
        title: 'Le modele OSI en 7 couches',
        content: `Le modele OSI (Open Systems Interconnection) est un cadre de reference universel pour comprendre comment les donnees circulent sur un reseau. En tant que DevOps, cette comprehension est essentielle pour diagnostiquer les problemes de connectivite entre vos services.

### Les 7 couches OSI

| # | Couche | Role | Protocoles / Exemples | Pertinence DevOps |
|---|--------|------|----------------------|-------------------|
| 7 | **Application** | Interface utilisateur | HTTP, HTTPS, DNS, SMTP, SSH | APIs, reverse proxy, monitoring |
| 6 | **Presentation** | Encodage, chiffrement | SSL/TLS, JPEG, JSON, XML | Certificats TLS, serialisation |
| 5 | **Session** | Gestion des sessions | NetBIOS, RPC, WebSocket | Connexions persistantes |
| 4 | **Transport** | Fiabilite bout en bout | TCP, UDP | Ports, load balancing, healthchecks |
| 3 | **Reseau** | Routage, adressage logique | IP, ICMP, ARP | Subnets, VPC, routage cloud |
| 2 | **Liaison** | Adressage physique, trames | Ethernet, Wi-Fi, VLAN | Bridges Docker, interfaces reseau |
| 1 | **Physique** | Transmission binaire | Cables, fibre, ondes radio | Datacenter, infra physique |

### Mnemonique pour retenir les couches

De bas en haut : **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way

De haut en bas : **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing

### Encapsulation des donnees

Quand une application envoie des donnees, chaque couche ajoute un en-tete (header) :

\`\`\`
Application  →  Donnees
Transport    →  [En-tete TCP/UDP] + Donnees        = Segment
Reseau       →  [En-tete IP] + Segment              = Paquet
Liaison      →  [En-tete Ethernet] + Paquet + [FCS]  = Trame
Physique     →  Bits sur le medium
\`\`\`

> **En pratique DevOps :** Quand un conteneur Docker ne peut pas joindre un autre service, vous devez identifier a quelle couche se situe le probleme : DNS (couche 7), routage IP (couche 3), ou interface reseau (couche 2).`
      },
      {
        title: 'Le modele TCP/IP en 4 couches',
        content: `Le modele TCP/IP est le modele pratique utilise sur Internet. Il simplifie le modele OSI en 4 couches et correspond a la realite des protocoles deployes.

### Correspondance OSI vs TCP/IP

| Couches OSI | Couche TCP/IP | Protocoles |
|-------------|---------------|------------|
| 7 - Application | **Application** | HTTP, HTTPS, DNS, SSH, FTP, SMTP |
| 6 - Presentation | **Application** | TLS, SSL, encodage |
| 5 - Session | **Application** | Gestion sessions |
| 4 - Transport | **Transport** | TCP, UDP |
| 3 - Reseau | **Internet** | IPv4, IPv6, ICMP, ARP |
| 2 - Liaison | **Acces reseau** | Ethernet, Wi-Fi, PPP |
| 1 - Physique | **Acces reseau** | Cables, signaux |

### TCP vs UDP — Comparaison

| Caracteristique | TCP | UDP |
|----------------|-----|-----|
| **Connexion** | Oriente connexion (3-way handshake) | Sans connexion |
| **Fiabilite** | Garantie (ACK, retransmission) | Aucune garantie |
| **Ordre** | Donnees ordonnees | Pas d'ordre garanti |
| **Vitesse** | Plus lent (overhead) | Plus rapide |
| **Usage** | HTTP, SSH, FTP, SMTP, BDD | DNS, DHCP, VoIP, streaming |

### Visualiser les couches avec les outils Linux

\`\`\`bash
# Couche Application — tester une connexion HTTP
curl -v https://example.com

# Couche Transport — verifier les ports ouverts
ss -tlnp
netstat -tlnp

# Couche Internet — verifier le routage IP
ip route show
traceroute 8.8.8.8

# Couche Acces reseau — voir les interfaces
ip link show
ip addr show
\`\`\`

### Le 3-way handshake TCP

\`\`\`
Client                     Serveur
  │                           │
  │──── SYN ────────────────→ │   1. Client initie la connexion
  │                           │
  │←─── SYN-ACK ─────────────│   2. Serveur accepte
  │                           │
  │──── ACK ────────────────→ │   3. Connexion etablie
  │                           │
  │←───── Donnees ───────────→│   4. Echange de donnees
\`\`\`

> **Point cle :** En DevOps, 90% des problemes se situent aux couches Application (mauvaise config) et Internet (mauvais routage/firewall).`
      },
      {
        title: 'Diagnostic reseau par couche',
        content: `Une approche methodique du diagnostic reseau consiste a tester chaque couche du modele, de bas en haut ou de haut en bas.

### Methode Bottom-Up (recommandee)

| Etape | Couche | Commande | Ce qu'on verifie |
|-------|--------|----------|-----------------|
| 1 | Physique/Liaison | \`ip link show\` | Interface UP ? Carrier OK ? |
| 2 | Internet | \`ping 8.8.8.8\` | Connectivite IP ? |
| 3 | Internet | \`ip route show\` | Route par defaut ? |
| 4 | Transport | \`ss -tlnp\` | Service ecoute sur le bon port ? |
| 5 | Application | \`curl http://localhost:8080\` | Service repond ? |

### Commandes essentielles de diagnostic

\`\`\`bash
# 1. Verifier l'interface reseau
ip link show eth0
# Doit afficher "state UP"

# 2. Verifier l'adresse IP
ip addr show eth0
# Doit afficher une adresse IP valide

# 3. Tester la connectivite locale
ping -c 3 192.168.1.1    # Passerelle par defaut

# 4. Tester la connectivite externe
ping -c 3 8.8.8.8         # DNS Google (couche 3)
ping -c 3 google.com      # Test DNS + couche 3

# 5. Tracer la route
traceroute 8.8.8.8
mtr 8.8.8.8               # traceroute ameliore (interactif)

# 6. Verifier la resolution DNS
dig google.com
nslookup google.com

# 7. Tester un port specifique
nc -zv 192.168.1.100 443   # Test connexion TCP port 443

# 8. Capturer le trafic reseau
sudo tcpdump -i eth0 port 80 -n
sudo tcpdump -i docker0 -n      # Trafic Docker
\`\`\`

### Cas pratique Docker

\`\`\`bash
# Un conteneur ne peut pas joindre un autre conteneur ?

# 1. Verifier que les conteneurs sont sur le meme reseau
docker network ls
docker network inspect bridge

# 2. Verifier la resolution DNS interne Docker
docker exec mon-conteneur nslookup autre-conteneur

# 3. Tester la connectivite
docker exec mon-conteneur ping autre-conteneur

# 4. Verifier les ports exposes
docker port mon-conteneur
\`\`\`

> **Reflexe DevOps :** Toujours commencer par \`ping\` (couche 3), puis \`curl\` (couche 7). Si ping marche mais pas curl, le probleme est au niveau application (port, firewall, config service).`
      },
      {
        title: 'Protocoles cles pour le DevOps',
        content: `Certains protocoles sont utilises quotidiennement en DevOps. Voici les plus importants classes par couche.

### Couche Application

| Protocole | Port | Usage DevOps |
|-----------|------|-------------|
| **HTTP** | 80 | Serveurs web, APIs REST |
| **HTTPS** | 443 | HTTP securise (TLS), standard en production |
| **SSH** | 22 | Administration serveur, tunnels, SCP/SFTP |
| **DNS** | 53 | Resolution de noms, service discovery |
| **SMTP** | 25/587 | Envoi d'emails (alerting, notifications) |
| **NTP** | 123 | Synchronisation horaire (critique pour les logs) |
| **SNMP** | 161 | Monitoring equipements reseau |
| **LDAP** | 389/636 | Authentification centralisee |

### Ports a connaitre absolument

\`\`\`bash
# Ports standards DevOps
22    → SSH
80    → HTTP
443   → HTTPS
3306  → MySQL
5432  → PostgreSQL
6379  → Redis
8080  → Proxy / serveur dev
9090  → Prometheus
3000  → Grafana
5601  → Kibana
9200  → Elasticsearch
2375  → Docker API (non securise)
2376  → Docker API (TLS)
6443  → Kubernetes API
\`\`\`

### Verifier les ports en ecoute

\`\`\`bash
# Lister tous les ports TCP en ecoute
ss -tlnp

# Filtrer un port specifique
ss -tlnp | grep :8080

# Verifier quel processus utilise un port
sudo lsof -i :80
\`\`\`

> **Bonne pratique :** En production, seuls les ports strictement necessaires doivent etre ouverts. Utilisez un firewall (\`ufw\` ou \`firewalld\`) pour bloquer tout le reste.`
      },
      {
        title: 'Analyse de trafic avec tcpdump',
        content: `L'analyse de trafic reseau est une competence essentielle pour diagnostiquer des problemes complexes en production. \`tcpdump\` est l'outil en ligne de commande de reference.

### tcpdump — Capture en ligne de commande

\`\`\`bash
# Capturer tout le trafic sur eth0
sudo tcpdump -i eth0

# Capturer uniquement le trafic HTTP (port 80)
sudo tcpdump -i eth0 port 80 -n

# Capturer le trafic vers une IP specifique
sudo tcpdump -i eth0 host 192.168.1.100 -n

# Capturer uniquement les paquets TCP SYN (debut de connexion)
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0' -n

# Sauvegarder la capture dans un fichier (lisible par Wireshark)
sudo tcpdump -i eth0 -w capture.pcap -c 1000

# Capturer le trafic DNS
sudo tcpdump -i eth0 port 53 -n

# Capturer le trafic Docker
sudo tcpdump -i docker0 -n
\`\`\`

### Filtres tcpdump courants

| Filtre | Description |
|--------|-------------|
| \`host 10.0.0.1\` | Trafic vers/depuis cette IP |
| \`src 10.0.0.1\` | Trafic depuis cette IP source |
| \`dst 10.0.0.1\` | Trafic vers cette IP destination |
| \`port 443\` | Trafic sur le port 443 |
| \`tcp\` | Uniquement les paquets TCP |
| \`udp\` | Uniquement les paquets UDP |
| \`icmp\` | Uniquement les paquets ICMP (ping) |
| \`not port 22\` | Exclure le trafic SSH |

### Cas d'usage DevOps

\`\`\`bash
# Debugger un probleme de connexion entre deux services
sudo tcpdump -i eth0 host 10.0.1.50 and port 5432 -n
# → Voir si les paquets TCP arrivent au serveur PostgreSQL

# Verifier que le load balancer distribue le trafic
sudo tcpdump -i eth0 port 80 -n -c 20
# → Observer les IP sources

# Capturer le handshake TLS
sudo tcpdump -i eth0 port 443 -n -c 10
# → Voir le ClientHello et ServerHello
\`\`\`

> **Conseil :** En production, utilisez toujours \`-c\` (limite de paquets) ou \`-w\` (ecriture fichier) avec tcpdump pour eviter de surcharger le terminal ou le disque.`
      }
    ]
  },
  {
    id: 107,
    slug: 'ip-cidr-nat-dhcp',
    title: 'IP, CIDR, NAT & DHCP',
    subtitle: 'Maitriser l\'adressage IP, le calcul CIDR, la translation d\'adresses et l\'attribution automatique',
    icon: 'Globe',
    color: '#8b5cf6',
    duration: '30 min',
    level: 'Debutant',
    videoId: '',
    sections: [
      {
        title: 'Adressage IPv4 et classes d\'adresses',
        content: `L'adresse IPv4 est un identifiant unique de 32 bits attribue a chaque interface reseau. Elle est ecrite en notation decimale pointee (ex: 192.168.1.100).

### Classes d'adresses (historique)

| Classe | Plage | Masque par defaut | Nb reseaux | Nb hotes/reseau |
|--------|-------|-------------------|------------|-----------------|
| **A** | 1.0.0.0 - 126.255.255.255 | /8 (255.0.0.0) | 126 | 16 777 214 |
| **B** | 128.0.0.0 - 191.255.255.255 | /16 (255.255.0.0) | 16 384 | 65 534 |
| **C** | 192.0.0.0 - 223.255.255.255 | /24 (255.255.255.0) | 2 097 152 | 254 |
| **D** | 224.0.0.0 - 239.255.255.255 | — | Multicast | — |
| **E** | 240.0.0.0 - 255.255.255.255 | — | Reserve | — |

### Adresses privees (RFC 1918)

Ces plages sont reservees pour les reseaux internes et ne sont pas routables sur Internet :

| Classe | Plage privee | Usage courant |
|--------|-------------|---------------|
| A | **10.0.0.0/8** | Cloud (AWS VPC, GCP), grands reseaux |
| B | **172.16.0.0/12** | Docker (172.17.0.0/16 par defaut) |
| C | **192.168.0.0/16** | Reseaux domestiques, labs |

### Adresses speciales

\`\`\`
127.0.0.1       → Loopback (localhost)
0.0.0.0         → Toutes les interfaces (bind)
255.255.255.255 → Broadcast global
169.254.x.x     → APIPA (pas de DHCP)
\`\`\`

### Verifier son adresse IP

\`\`\`bash
# Adresse IP locale
ip addr show
hostname -I

# Adresse IP publique
curl ifconfig.me
curl icanhazip.com

# Adresses dans les conteneurs Docker
docker exec mon-conteneur ip addr show
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mon-conteneur
\`\`\``
      },
      {
        title: 'Notation CIDR et calcul de sous-reseaux',
        content: `Le CIDR (Classless Inter-Domain Routing) remplace le systeme de classes par une notation flexible : **IP/prefixe**. Le prefixe indique le nombre de bits reserves a la partie reseau.

### Notation CIDR courante

| CIDR | Masque | Nb adresses | Nb hotes utilisables | Usage typique |
|------|--------|-------------|---------------------|---------------|
| /32 | 255.255.255.255 | 1 | 1 | Adresse unique (loopback, host route) |
| /30 | 255.255.255.252 | 4 | 2 | Liaison point a point |
| /28 | 255.255.255.240 | 16 | 14 | Petit sous-reseau |
| /24 | 255.255.255.0 | 256 | 254 | Sous-reseau standard |
| /20 | 255.255.240.0 | 4 096 | 4 094 | Sous-reseau cloud moyen |
| /16 | 255.255.0.0 | 65 536 | 65 534 | Grand reseau / VPC |
| /8 | 255.0.0.0 | 16 777 216 | 16 777 214 | Mega-reseau |

### Calcul rapide

**Formule :** Nombre d'adresses = 2^(32 - prefixe)

\`\`\`
/24 → 2^(32-24) = 2^8 = 256 adresses (254 hotes)
/28 → 2^(32-28) = 2^4 = 16 adresses (14 hotes)
/20 → 2^(32-20) = 2^12 = 4096 adresses (4094 hotes)
\`\`\`

### Exemple concret : decouper 10.0.0.0/16

\`\`\`
10.0.0.0/16  →  Reseau principal (65 534 hotes)
  ├── 10.0.1.0/24   →  Sous-reseau Web (254 hotes)
  ├── 10.0.2.0/24   →  Sous-reseau API (254 hotes)
  ├── 10.0.3.0/24   →  Sous-reseau BDD (254 hotes)
  └── 10.0.10.0/24  →  Sous-reseau Management (254 hotes)
\`\`\`

### Calculer avec ipcalc

\`\`\`bash
# Installer ipcalc
sudo apt install ipcalc -y

# Calculer les details d'un sous-reseau
ipcalc 192.168.1.0/24
# Address:   192.168.1.0
# Netmask:   255.255.255.0
# Network:   192.168.1.0/24
# Broadcast: 192.168.1.255
# HostMin:   192.168.1.1
# HostMax:   192.168.1.254
# Hosts/Net: 254

# Decouper un reseau en sous-reseaux
ipcalc 10.0.0.0/16 -s 200 200 50 50
\`\`\`

> **En cloud (AWS/GCP/Azure) :** Les VPC utilisent typiquement un /16 (10.0.0.0/16) decoupe en sous-reseaux /24 par zone de disponibilite. Planifiez votre adressage AVANT de deployer.`
      },
      {
        title: 'NAT — Network Address Translation',
        content: `Le NAT permet a plusieurs machines avec des adresses IP privees de partager une seule adresse IP publique pour acceder a Internet. C'est un mecanisme fondamental dans toute infrastructure.

### Types de NAT

| Type | Description | Cas d'usage |
|------|-------------|-------------|
| **SNAT** (Source NAT) | Modifie l'IP source | Acces Internet depuis un reseau prive |
| **DNAT** (Destination NAT) | Modifie l'IP destination | Redirection de port (port forwarding) |
| **PAT** (Port Address Translation) | NAT avec traduction de ports | Plusieurs machines → 1 IP publique |
| **Masquerade** | SNAT dynamique | Interface avec IP dynamique |

### NAT dans Linux (iptables)

\`\`\`bash
# Activer le forwarding IP (prerequis)
echo 1 > /proc/sys/net/ipv4/ip_forward
# Permanent :
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p

# SNAT — Permettre au reseau 10.0.0.0/24 d'acceder a Internet
sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE

# DNAT — Rediriger le port 8080 externe vers le port 80 interne
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.0.0.10:80

# Lister les regles NAT
sudo iptables -t nat -L -n -v
\`\`\`

### NAT dans Docker

Docker utilise le NAT automatiquement :

\`\`\`bash
# Quand vous exposez un port
docker run -d -p 8080:80 nginx
# Docker cree une regle DNAT : hote:8080 → conteneur:80

# Voir les regles NAT creees par Docker
sudo iptables -t nat -L -n | grep DOCKER

# Les conteneurs accedent a Internet via MASQUERADE
# Docker cree automatiquement les regles sur l'interface docker0
\`\`\`

### NAT dans le cloud (AWS)

\`\`\`
VPC 10.0.0.0/16
├── Sous-reseau public 10.0.1.0/24   → Internet Gateway (IP publique directe)
└── Sous-reseau prive 10.0.2.0/24    → NAT Gateway (SNAT vers Internet)
\`\`\`

> **Point cle :** Le NAT est partout en DevOps — Docker, Kubernetes, cloud. Comprendre SNAT vs DNAT aide a debugger les problemes de connectivite entre services.`
      },
      {
        title: 'DHCP — Attribution automatique d\'adresses',
        content: `Le DHCP (Dynamic Host Configuration Protocol) attribue automatiquement une adresse IP, un masque, une passerelle et des serveurs DNS aux machines d'un reseau.

### Processus DORA

Le DHCP fonctionne en 4 etapes (mnemonique **DORA**) :

| Etape | Message | Direction | Description |
|-------|---------|-----------|-------------|
| **D** | DHCP Discover | Client → Broadcast | "Y a-t-il un serveur DHCP ?" |
| **O** | DHCP Offer | Serveur → Client | "Voici une IP disponible" |
| **R** | DHCP Request | Client → Broadcast | "J'accepte cette IP" |
| **A** | DHCP Acknowledge | Serveur → Client | "IP confirmee, voici ta config" |

### Configuration d'un serveur DHCP (isc-dhcp-server)

\`\`\`bash
# Installation
sudo apt install isc-dhcp-server -y

# Configuration /etc/dhcp/dhcpd.conf
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option domain-name-servers 8.8.8.8, 1.1.1.1;
    option domain-name "lab.local";
    default-lease-time 3600;
    max-lease-time 7200;
}

# Reservation statique (IP fixe par adresse MAC)
host serveur-web {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.1.10;
}
\`\`\`

\`\`\`bash
# Demarrer le serveur DHCP
sudo systemctl start isc-dhcp-server
sudo systemctl enable isc-dhcp-server

# Verifier les baux actifs
cat /var/lib/dhcp/dhcpd.leases
\`\`\`

### DHCP cote client

\`\`\`bash
# Demander une nouvelle adresse DHCP
sudo dhclient -v eth0

# Liberer l'adresse actuelle
sudo dhclient -r eth0

# Voir le bail actuel
cat /var/lib/dhcp/dhclient.leases
\`\`\`

### DHCP dans Docker et Kubernetes

- **Docker** : chaque conteneur recoit une IP automatiquement du sous-reseau du bridge Docker (par defaut 172.17.0.0/16). Ce n'est pas du DHCP classique mais un mecanisme IPAM integre
- **Kubernetes** : les Pods recoivent des IP via le plugin CNI (Calico, Flannel, Cilium), pas via DHCP

> **Bonne pratique :** En production, utilisez des **reservations DHCP** (IP fixe par MAC) pour les serveurs critiques, et le DHCP dynamique uniquement pour les postes de travail.`
      },
      {
        title: 'IPv6 — Les bases pour le DevOps',
        content: `IPv6 est le successeur d'IPv4, avec un espace d'adressage de 128 bits (contre 32 bits). Bien que de nombreuses infrastructures fonctionnent encore en IPv4, IPv6 est de plus en plus present, notamment dans le cloud et les CDN.

### Format d'une adresse IPv6

\`\`\`
Complet   : 2001:0db8:0000:0000:0000:0000:0000:0001
Simplifie : 2001:db8::1

Regles de simplification :
- Supprimer les zeros en tete de chaque groupe : 0db8 → db8
- Remplacer les groupes consecutifs de zeros par :: (une seule fois)
\`\`\`

### Types d'adresses IPv6

| Type | Prefixe | Equivalent IPv4 | Usage |
|------|---------|-----------------|-------|
| **Link-local** | fe80::/10 | 169.254.x.x (APIPA) | Communication locale (auto-configure) |
| **Unicast global** | 2000::/3 | IP publique | Adresse routable sur Internet |
| **Unique local** | fd00::/8 | 10.0.0.0/8 (RFC1918) | Reseau prive |
| **Loopback** | ::1 | 127.0.0.1 | Localhost |
| **Multicast** | ff00::/8 | 224.0.0.0/4 | Diffusion de groupe |

### IPv6 sur Linux

\`\`\`bash
# Voir les adresses IPv6
ip -6 addr show

# Ping en IPv6
ping6 ::1
ping6 fe80::1%eth0    # Link-local necessite l'interface

# Route IPv6
ip -6 route show

# Desactiver IPv6 (si non utilise)
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
\`\`\`

### Double pile (Dual Stack)

La plupart des serveurs modernes fonctionnent en **dual stack** (IPv4 + IPv6 simultanement) :

\`\`\`nginx
# Nginx — ecouter en IPv4 et IPv6
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com;
}
\`\`\`

\`\`\`bash
# Docker — activer IPv6
# Dans /etc/docker/daemon.json
{
    "ipv6": true,
    "fixed-cidr-v6": "fd00:dead:beef::/48"
}

# Redemarrer Docker
sudo systemctl restart docker
\`\`\`

> **Realite DevOps :** IPv6 est obligatoire pour certains services cloud (AWS ELB, Cloudflare). Meme si votre infra interne est en IPv4, vos reverse proxies et load balancers doivent souvent gerer l'IPv6.`
      }
    ]
  },
  {
    id: 108,
    slug: 'dns-http-firewall',
    title: 'DNS, HTTP/HTTPS & Firewall',
    subtitle: 'Configurer la resolution de noms, securiser le trafic web et proteger vos services avec un firewall',
    icon: 'Shield',
    color: '#8b5cf6',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'ByTtN3pgnP0',
    sections: [
      {
        title: 'DNS — Fonctionnement et configuration',
        content: `Le DNS (Domain Name System) traduit les noms de domaine en adresses IP. C'est un service critique : sans DNS, aucun service ne peut etre atteint par son nom.

### Hierarchie DNS

\`\`\`
.                          ← Racine (root)
├── .com                   ← TLD (Top-Level Domain)
│   ├── google.com         ← Domaine
│   │   ├── www.google.com ← Sous-domaine
│   │   └── mail.google.com
│   └── example.com
├── .fr
│   └── netrevision.fr
└── .io
    └── kubernetes.io
\`\`\`

### Types d'enregistrements DNS

| Type | Role | Exemple |
|------|------|---------|
| **A** | Nom → IPv4 | \`netrevision.fr → 46.202.168.181\` |
| **AAAA** | Nom → IPv6 | \`netrevision.fr → 2a06:98c1:...\` |
| **CNAME** | Alias vers un autre nom | \`www → netrevision.fr\` |
| **MX** | Serveur mail | \`netrevision.fr → mx1.hostinger.com\` |
| **TXT** | Texte libre (SPF, DKIM) | \`v=spf1 include:...\` |
| **NS** | Serveurs DNS autoritaires | \`danica.ns.cloudflare.com\` |
| **SOA** | Autorite sur la zone | Infos administrateur |
| **SRV** | Service (port + priorite) | \`_sip._tcp.example.com\` |
| **PTR** | IP → Nom (reverse DNS) | \`181.168.202.46 → netrevision.fr\` |

### Outils de diagnostic DNS

\`\`\`bash
# Requete DNS simple
dig netrevision.fr
dig netrevision.fr A        # Enregistrement A
dig netrevision.fr MX       # Serveurs mail
dig netrevision.fr TXT      # Enregistrements TXT

# Requete vers un serveur DNS specifique
dig @8.8.8.8 netrevision.fr

# Requete detaillee (trace la resolution complete)
dig +trace netrevision.fr

# nslookup (plus simple)
nslookup netrevision.fr

# host (le plus simple)
host netrevision.fr
\`\`\`

### Configuration DNS locale

\`\`\`bash
# Serveurs DNS utilises par le systeme
cat /etc/resolv.conf
# nameserver 8.8.8.8
# nameserver 1.1.1.1

# Fichier hosts — resolution locale prioritaire
cat /etc/hosts
# 127.0.0.1  localhost
# 10.0.0.50  api.local
# 10.0.0.51  db.local
\`\`\`

> **En DevOps :** Le fichier \`/etc/hosts\` est utile pour des tests locaux, mais en production on utilise un DNS interne (CoreDNS dans Kubernetes, Consul chez HashiCorp) pour la decouverte de services.`
      },
      {
        title: 'DNS interne et Service Discovery',
        content: `En environnement DevOps, le DNS interne est crucial pour la communication entre services. Chaque outil d'orchestration a son propre mecanisme de resolution.

### DNS dans Docker

\`\`\`bash
# Les conteneurs sur un reseau user-defined ont un DNS integre
docker network create mon-reseau
docker run -d --name api --network mon-reseau nginx
docker run -d --name web --network mon-reseau alpine sleep 3600

# Le conteneur "web" peut joindre "api" par son nom
docker exec web ping api
# → api resolu en 172.18.0.2

# ATTENTION : le reseau "bridge" par defaut n'a PAS de DNS integre !
# Utilisez TOUJOURS un reseau user-defined en production
\`\`\`

### DNS dans Docker Compose

\`\`\`yaml
# docker-compose.yml
services:
  api:
    image: node:20
    # Accessible via le nom "api" par les autres services
  db:
    image: mysql:8
    # Accessible via le nom "db"
  nginx:
    image: nginx
    depends_on:
      - api
    # nginx peut faire proxy_pass http://api:3000
\`\`\`

### DNS dans Kubernetes (CoreDNS)

\`\`\`bash
# Chaque Service Kubernetes est accessible via DNS
# Format : <service>.<namespace>.svc.cluster.local

# Exemple :
kubectl get svc -n production
# NAME       TYPE        CLUSTER-IP    PORT(S)
# api-svc    ClusterIP   10.96.10.50   80/TCP

# Depuis un Pod, on peut joindre :
# api-svc                          (meme namespace)
# api-svc.production               (namespace different)
# api-svc.production.svc.cluster.local  (FQDN complet)
\`\`\`

### Consul (HashiCorp) — Service Discovery

\`\`\`bash
# Consul fournit un DNS sur le port 8600
dig @127.0.0.1 -p 8600 api.service.consul

# Enregistrer un service
curl -X PUT http://localhost:8500/v1/agent/service/register -d '{
    "Name": "api",
    "Port": 3000,
    "Check": {
        "HTTP": "http://localhost:3000/health",
        "Interval": "10s"
    }
}'
\`\`\`

> **Bonne pratique :** Ne jamais coder des adresses IP en dur dans vos configs. Utilisez toujours des noms DNS — cela permet de changer l'IP sans modifier la configuration.`
      },
      {
        title: 'HTTP/HTTPS et certificats TLS',
        content: `HTTP (HyperText Transfer Protocol) est le protocole de communication du web. HTTPS est sa version securisee avec chiffrement TLS.

### Methodes HTTP

| Methode | Usage | Idempotent | Corps |
|---------|-------|-----------|-------|
| **GET** | Recuperer une ressource | Oui | Non |
| **POST** | Creer une ressource | Non | Oui |
| **PUT** | Remplacer une ressource | Oui | Oui |
| **PATCH** | Modifier partiellement | Non | Oui |
| **DELETE** | Supprimer une ressource | Oui | Non |
| **HEAD** | Comme GET sans le corps | Oui | Non |
| **OPTIONS** | Methodes autorisees (CORS) | Oui | Non |

### Codes de reponse HTTP

| Code | Categorie | Exemples |
|------|-----------|----------|
| **2xx** | Succes | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Moved Permanently, 302 Found, 304 Not Modified |
| **4xx** | Erreur client | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| **5xx** | Erreur serveur | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

### Tester avec curl

\`\`\`bash
# GET simple
curl https://api.example.com/users

# POST avec JSON
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John", "email": "john@example.com"}'

# Avec authentification Bearer
curl -H "Authorization: Bearer eyJhbG..." https://api.example.com/me

# Voir les headers de reponse
curl -I https://netrevision.fr

# Verbose (voir tout le handshake TLS)
curl -v https://netrevision.fr
\`\`\`

### HTTPS et certificats TLS

\`\`\`bash
# Generer un certificat Let's Encrypt avec certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com

# Renouvellement automatique
sudo certbot renew --dry-run

# Verifier un certificat TLS
echo | openssl s_client -connect netrevision.fr:443 2>/dev/null | openssl x509 -noout -dates
\`\`\`

> **Standard DevOps :** Tout service en production DOIT etre en HTTPS. Utilisez Let's Encrypt (gratuit) ou un certificat cloud (AWS ACM, Cloudflare). Jamais de HTTP en production.`
      },
      {
        title: 'Firewall Linux — UFW et firewalld',
        content: `Le firewall filtre le trafic reseau entrant et sortant. En DevOps, il protege vos serveurs en n'autorisant que les ports necessaires.

### UFW (Uncomplicated Firewall) — Ubuntu/Debian

\`\`\`bash
# Installer et activer
sudo apt install ufw -y
sudo ufw enable

# Politique par defaut : bloquer tout en entree, autoriser en sortie
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autoriser des services
sudo ufw allow ssh          # Port 22
sudo ufw allow http         # Port 80
sudo ufw allow https        # Port 443
sudo ufw allow 8080/tcp     # Port specifique

# Autoriser depuis une IP specifique
sudo ufw allow from 10.0.0.0/24 to any port 3306

# Supprimer une regle
sudo ufw delete allow 8080/tcp

# Voir le statut
sudo ufw status verbose
sudo ufw status numbered
\`\`\`

### firewalld — RHEL/CentOS/AlmaLinux

\`\`\`bash
# Demarrer firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Zones : public (defaut), internal, trusted, dmz...
sudo firewall-cmd --get-active-zones

# Ajouter un service
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent

# Ajouter un port
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent

# Appliquer les changements
sudo firewall-cmd --reload

# Lister les regles
sudo firewall-cmd --zone=public --list-all
\`\`\`

### iptables — Le firewall bas niveau

\`\`\`bash
# Voir les regles actuelles
sudo iptables -L -n -v

# Autoriser SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Autoriser HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Bloquer tout le reste en entree
sudo iptables -A INPUT -j DROP

# Sauvegarder les regles
sudo iptables-save > /etc/iptables/rules.v4
\`\`\`

> **ATTENTION :** Ne jamais bloquer le port SSH avant d'avoir confirme que votre regle d'autorisation fonctionne, sinon vous perdez l'acces au serveur.`
      },
      {
        title: 'Securite reseau en production',
        content: `La securisation d'un serveur de production necessite une approche en couches (defense in depth). Voici les mesures essentielles.

### Checklist securite serveur

\`\`\`bash
# 1. Mettre a jour le systeme
sudo apt update && sudo apt upgrade -y

# 2. Desactiver le login root SSH
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# 3. Utiliser uniquement les cles SSH (pas de mot de passe)
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 4. Installer fail2ban (protection brute force)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban

# 5. Configurer le firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
\`\`\`

### Configuration fail2ban

\`\`\`ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port    = http,https
logpath = /var/log/nginx/error.log
\`\`\`

\`\`\`bash
# Verifier les IPs bannies
sudo fail2ban-client status sshd

# Debannir une IP
sudo fail2ban-client set sshd unbanip 1.2.3.4
\`\`\`

### Headers de securite HTTP (Nginx)

\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
\`\`\`

### Principes fondamentaux

1. **Principe du moindre privilege** : chaque service n'a acces qu'a ce dont il a besoin
2. **Defense en profondeur** : firewall + fail2ban + TLS + headers + mises a jour
3. **Logs et monitoring** : surveiller les acces anormaux en permanence
4. **Mises a jour regulieres** : patcher les vulnerabilites rapidement

> **Regle d'or :** Un serveur de production ne doit exposer que les ports 22 (SSH), 80 (HTTP) et 443 (HTTPS). Tout le reste doit etre bloque par le firewall.`
      }
    ]
  },
  {
    id: 109,
    slug: 'reverse-proxy-loadbalancing',
    title: 'Reverse Proxy & Load Balancing',
    subtitle: 'Deployer Nginx et Traefik comme reverse proxy et repartir la charge entre vos services',
    icon: 'Server',
    color: '#8b5cf6',
    duration: '30 min',
    level: 'Intermediaire',
    videoId: 'inVviPzjIVU',
    sections: [
      {
        title: 'Proxy vs Reverse Proxy',
        content: `Comprendre la difference entre un proxy (forward proxy) et un reverse proxy est essentiel pour concevoir une architecture web moderne.

### Forward Proxy (Proxy classique)

Un proxy classique se place **devant les clients** et fait les requetes a leur place :

\`\`\`
Clients → [Forward Proxy] → Internet → Serveur Web
\`\`\`

- Le serveur web ne voit que l'IP du proxy, pas celle du client
- Usage : controle d'acces, cache, filtrage web en entreprise

### Reverse Proxy

Un reverse proxy se place **devant les serveurs** et recoit les requetes des clients :

\`\`\`
Client → Internet → [Reverse Proxy] → Serveur(s) Backend
\`\`\`

- Le client ne voit que l'IP du reverse proxy, pas celle du backend
- C'est le modele standard en production web

### Avantages du Reverse Proxy

| Avantage | Description |
|----------|-------------|
| **Terminaison TLS** | Le reverse proxy gere le certificat SSL, le backend reste en HTTP |
| **Load Balancing** | Repartition du trafic entre plusieurs backends |
| **Cache** | Mise en cache des reponses statiques |
| **Compression** | gzip/brotli applique au niveau du proxy |
| **Securite** | Protection du backend (IP cachee, WAF, rate limiting) |
| **Routage** | Rediriger /api vers le backend, / vers le frontend |

### Architecture typique

\`\`\`
Internet
    │
[Cloudflare CDN]          ← Cache global, DDoS protection
    │
[Nginx Reverse Proxy]     ← TLS, routage, rate limiting
    │
    ├── /           → Frontend (React/Vue, fichiers statiques)
    ├── /api/       → Backend API (Node.js, PHP, Python)
    ├── /ws         → WebSocket server
    └── /grafana    → Monitoring (Grafana)
\`\`\`

> **En production :** Quasiment toutes les architectures web modernes utilisent un reverse proxy. C'est la premiere couche apres le CDN.`
      },
      {
        title: 'Nginx comme Reverse Proxy',
        content: `Nginx est le reverse proxy le plus utilise au monde. Sa configuration est declarative et performante.

### Configuration de base

\`\`\`nginx
# /etc/nginx/sites-available/monapp.conf

server {
    listen 80;
    server_name monapp.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name monapp.example.com;

    ssl_certificate /etc/letsencrypt/live/monapp.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monapp.example.com/privkey.pem;

    # Frontend (fichiers statiques)
    location / {
        root /var/www/monapp/dist;
        try_files $uri /index.html;
    }

    # Reverse proxy vers le backend API
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Reverse proxy WebSocket
    location /ws {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
\`\`\`

### Headers importants du reverse proxy

| Header | Role |
|--------|------|
| \`X-Real-IP\` | IP reelle du client |
| \`X-Forwarded-For\` | Chaine d'IPs (client, proxies intermediaires) |
| \`X-Forwarded-Proto\` | Protocole original (http ou https) |
| \`Host\` | Nom de domaine original |

### Commandes Nginx essentielles

\`\`\`bash
# Tester la configuration
sudo nginx -t

# Recharger la configuration (sans interruption)
sudo nginx -s reload

# Voir les logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Activer un site
sudo ln -s /etc/nginx/sites-available/monapp.conf /etc/nginx/sites-enabled/
sudo nginx -s reload
\`\`\`

### Optimisations de performance

\`\`\`nginx
# Compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Cache des fichiers statiques
location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
\`\`\`

> **Astuce :** Utilisez \`nginx -t\` avant chaque \`nginx -s reload\` pour eviter de casser la configuration en production.`
      },
      {
        title: 'Traefik — Reverse Proxy Cloud-Native',
        content: `Traefik est un reverse proxy moderne concu pour les environnements Docker et Kubernetes. Il decouvre automatiquement les services via des labels.

### Traefik vs Nginx

| Critere | Nginx | Traefik |
|---------|-------|---------|
| Configuration | Fichiers statiques | Auto-decouverte (labels Docker) |
| Certificats TLS | Certbot manuel | Let's Encrypt automatique |
| Docker natif | Fichiers manuels | Labels sur conteneurs |
| Kubernetes | Ingress controller | Ingress controller natif |
| Dashboard | Non (sauf Nginx Plus) | Dashboard integre |
| Performance brute | Superieure | Legerement inferieure |

### Traefik avec Docker Compose

\`\`\`yaml
# docker-compose.yml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/acme.json

  api:
    image: mon-api:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(\`api.example.com\`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
      - "traefik.http.services.api.loadbalancer.server.port=3000"

  frontend:
    image: mon-frontend:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(\`www.example.com\`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
\`\`\`

### Middlewares Traefik

\`\`\`yaml
# Redirection HTTP → HTTPS
labels:
  - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
  - "traefik.http.routers.web.middlewares=redirect-https"

# Rate limiting
labels:
  - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"
\`\`\`

> **Choix DevOps :** Utilisez Traefik si vous etes dans un environnement full Docker/Kubernetes. Gardez Nginx pour les serveurs classiques ou quand vous avez besoin de performance brute.`
      },
      {
        title: 'Load Balancing — Repartition de charge',
        content: `Le load balancing distribue le trafic entre plusieurs instances d'un service pour assurer la disponibilite et la performance.

### Algorithmes de load balancing

| Algorithme | Description | Cas d'usage |
|------------|-------------|-------------|
| **Round Robin** | Chaque serveur a tour de role | Serveurs identiques |
| **Weighted Round Robin** | Round robin avec poids | Serveurs de puissance differente |
| **Least Connections** | Serveur avec le moins de connexions actives | Requetes de duree variable |
| **IP Hash** | Meme client → meme serveur (session affinity) | Sessions serveur |
| **Random** | Serveur aleatoire | Simple et efficace |

### Load Balancing avec Nginx

\`\`\`nginx
# Definir le groupe de serveurs backend
upstream api_backend {
    # Round Robin (par defaut)
    server 10.0.0.10:3000;
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}

# Weighted Round Robin
upstream api_weighted {
    server 10.0.0.10:3000 weight=5;
    server 10.0.0.11:3000 weight=3;
    server 10.0.0.12:3000 weight=1;
}

# Least Connections
upstream api_least {
    least_conn;
    server 10.0.0.10:3000;
    server 10.0.0.11:3000;
}

# IP Hash (sticky sessions)
upstream api_sticky {
    ip_hash;
    server 10.0.0.10:3000;
    server 10.0.0.11:3000;
}

# Utiliser l'upstream
server {
    listen 443 ssl;
    server_name api.example.com;

    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
    }
}
\`\`\`

### Health Checks et serveur backup

\`\`\`nginx
upstream api_backend {
    server 10.0.0.10:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.11:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:3000 backup;
}
\`\`\`

### Load Balancing dans le cloud

| Cloud | Service | Type |
|-------|---------|------|
| **AWS** | ALB (Application LB) | Couche 7 (HTTP) |
| **AWS** | NLB (Network LB) | Couche 4 (TCP/UDP) |
| **GCP** | Cloud Load Balancing | Global, couche 4 et 7 |
| **Azure** | Azure Load Balancer | Couche 4 |
| **Azure** | Application Gateway | Couche 7 |

> **Bonne pratique :** Utilisez \`least_conn\` pour les APIs avec des temps de reponse variables, et \`ip_hash\` uniquement si votre application utilise des sessions serveur (a eviter avec des APIs stateless).`
      },
      {
        title: 'Architecture complete avec reverse proxy',
        content: `Voici comment assembler tous les elements dans une architecture de production.

### Architecture multi-services avec Docker Compose

\`\`\`yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api1
      - api2
      - frontend
    restart: always

  frontend:
    image: mon-frontend:latest
    deploy:
      replicas: 2

  api1:
    image: mon-api:latest
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis

  api2:
    image: mon-api:latest
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis

  db:
    image: mysql:8
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine

volumes:
  db_data:
\`\`\`

### Configuration Nginx associee

\`\`\`nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        least_conn;
        server api1:3000;
        server api2:3000;
    }

    server {
        listen 80;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name example.com;

        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;

        location / {
            proxy_pass http://frontend;
        }

        location /api/ {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /health {
            access_log off;
            return 200 "OK";
        }
    }
}
\`\`\`

### Tester le load balancing

\`\`\`bash
# Envoyer plusieurs requetes et observer la distribution
for i in {1..10}; do
    curl -s https://api.example.com/health | head -1
done

# Verifier les logs de chaque backend
docker logs api1 --tail 5
docker logs api2 --tail 5

# Tester la haute disponibilite
docker stop api1
curl https://api.example.com/health  # Doit repondre via api2
docker start api1
\`\`\`

> **Architecture recommandee :** CDN (Cloudflare) → Reverse Proxy (Nginx/Traefik) → Load Balancer (upstream) → Backends (API) → Base de donnees (avec replicas).`
      }
    ]
  },
  {
    id: 110,
    slug: 'git-fondamentaux',
    title: 'Git Fondamentaux & Branching',
    subtitle: 'Maitriser les commandes Git essentielles, le branching et la gestion de l\'historique',
    icon: 'GitBranch',
    color: '#8b5cf6',
    duration: '30 min',
    level: 'Debutant',
    videoId: 'rP3T0Ee6pLU',
    sections: [
      {
        title: 'Introduction a Git',
        content: `Git est le systeme de controle de version le plus utilise au monde. Cree par Linus Torvalds en 2005, il est devenu indispensable dans tout workflow DevOps.

### Pourquoi Git ?

| Avantage | Description |
|----------|-------------|
| **Distribue** | Chaque developpeur a une copie complete du depot |
| **Performance** | Operations locales ultra-rapides |
| **Branching** | Creation de branches instantanee et legere |
| **Integrite** | Chaque commit est identifie par un hash SHA-1 |
| **Collaboration** | Merge, rebase, pull requests |

### Installation et configuration

\`\`\`bash
# Ubuntu/Debian
sudo apt install git -y

# macOS
brew install git

# Configuration initiale (obligatoire)
git config --global user.name "Morvin Quernel"
git config --global user.email "morvin@example.com"
git config --global core.editor "nano"
git config --global init.defaultBranch main

# Voir la configuration
git config --list
\`\`\`

### Les 3 zones de Git

\`\`\`
Working Directory    →    Staging Area    →    Repository
(fichiers modifies)       (git add)            (git commit)
        │                      │                     │
   Modifications          Index/Stage           Historique
   non suivies            pret a commit         permanent
\`\`\`

### Initialiser un depot

\`\`\`bash
# Creer un nouveau depot
mkdir mon-projet && cd mon-projet
git init

# Cloner un depot existant
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git     # Via SSH (recommande)
\`\`\`

> **Bonne pratique DevOps :** Toujours utiliser SSH pour les depots distants (pas HTTPS avec mot de passe). Configurez une cle SSH sur votre compte GitHub/GitLab.`
      },
      {
        title: 'Commandes de base',
        content: `Les commandes Git de base sont utilisees des dizaines de fois par jour. Voici les essentielles avec des exemples concrets.

### Workflow quotidien

\`\`\`bash
# 1. Voir l'etat du depot
git status
git status -s            # Version courte

# 2. Ajouter des fichiers au staging
git add fichier.txt      # Un fichier specifique
git add src/             # Un dossier entier
git add .                # Tous les fichiers modifies
git add -p               # Ajouter interactivement (par morceaux)

# 3. Committer
git commit -m "feat: ajout du systeme de login"
git commit -am "fix: correction du bug d'affichage"

# 4. Voir l'historique
git log                    # Historique complet
git log --oneline          # Une ligne par commit
git log --oneline -10      # Les 10 derniers
git log --graph --oneline  # Graphe des branches

# 5. Voir les differences
git diff                   # Modifications non staged
git diff --staged          # Modifications staged
git diff main..feature     # Differences entre deux branches
\`\`\`

### Annuler des modifications

\`\`\`bash
# Annuler les modifs d'un fichier (avant staging)
git restore fichier.txt

# Retirer du staging (sans perdre les modifs)
git restore --staged fichier.txt

# Annuler le dernier commit (garder les modifs)
git reset --soft HEAD~1

# Creer un commit inverse (safe pour les branches partagees)
git revert HEAD
\`\`\`

### Fichier .gitignore

\`\`\`bash
# .gitignore
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
.idea/
.vscode/
__pycache__/
*.pyc
coverage/
\`\`\`

### Stash — Mettre de cote des modifications

\`\`\`bash
# Sauvegarder les modifications en cours
git stash
git stash save "travail en cours sur le login"

# Lister les stashs
git stash list

# Restaurer le dernier stash
git stash pop          # Restaure et supprime du stash
git stash apply        # Restaure sans supprimer

# Supprimer un stash
git stash drop stash@{0}
\`\`\`

> **Convention de commits :** Utilisez les Conventional Commits : \`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`, \`test:\`, \`chore:\`. Cela facilite la generation de changelogs.`
      },
      {
        title: 'Branching et merging',
        content: `Le branching est la fonctionnalite la plus puissante de Git. Il permet de travailler sur plusieurs fonctionnalites en parallele.

### Commandes de branches

\`\`\`bash
# Lister les branches
git branch              # Branches locales
git branch -r           # Branches distantes
git branch -a           # Toutes les branches

# Creer une branche
git branch feature/login

# Changer de branche
git switch feature/login         # Syntaxe moderne (recommandee)

# Creer et changer en une commande
git switch -c feature/login

# Supprimer une branche
git branch -d feature/login      # Suppression safe (verif merge)
git branch -D feature/login      # Suppression forcee
\`\`\`

### Fusionner des branches (Merge)

\`\`\`bash
# Fusionner feature dans main
git switch main
git merge feature/login

# Merge avec un commit de merge (pas de fast-forward)
git merge --no-ff feature/login

# Annuler un merge en cours (conflit)
git merge --abort
\`\`\`

### Resoudre les conflits de merge

\`\`\`bash
# Quand un conflit survient, Git marque les fichiers :
<<<<<<< HEAD
contenu de la branche actuelle
=======
contenu de la branche a fusionner
>>>>>>> feature/login

# 1. Editer le fichier pour garder le bon contenu
# 2. Supprimer les marqueurs <<<<<<<, =======, >>>>>>>
# 3. Ajouter et committer
git add fichier-conflit.txt
git commit -m "fix: resolution du conflit de merge"
\`\`\`

### Rebase vs Merge

| Critere | Merge | Rebase |
|---------|-------|--------|
| Historique | Preservee (branches visibles) | Lineaire (plus propre) |
| Securite | Safe (pas de reecriture) | Reecrit l'historique |
| Usage | Branches partagees | Branches locales/personnelles |

\`\`\`bash
# Rebase : rejouer les commits sur la branche cible
git switch feature/login
git rebase main

# Merge : creer un commit de fusion
git switch main
git merge feature/login
\`\`\`

> **Regle d'or :** Ne jamais faire de rebase sur une branche partagee (main, develop). Le rebase est reserve aux branches personnelles avant de fusionner.`
      },
      {
        title: 'Travailler avec un depot distant',
        content: `La collaboration avec Git passe par les depots distants (remote). GitHub, GitLab et Bitbucket sont les plus courants.

### Gerer les remotes

\`\`\`bash
# Voir les remotes configures
git remote -v

# Ajouter un remote
git remote add origin git@github.com:user/repo.git

# Changer l'URL d'un remote
git remote set-url origin git@github.com:user/nouveau-repo.git
\`\`\`

### Push et Pull

\`\`\`bash
# Pousser une branche vers le remote
git push origin main
git push -u origin main           # -u : definir l'upstream (premiere fois)
git push                          # Apres -u, plus besoin de specifier

# Pousser une nouvelle branche
git push -u origin feature/login

# Recuperer les modifications distantes
git fetch origin                  # Telecharge sans fusionner
git pull origin main              # Fetch + merge
git pull --rebase origin main     # Historique plus propre
\`\`\`

### Workflow de collaboration typique

\`\`\`bash
# 1. Mettre a jour main
git switch main
git pull origin main

# 2. Creer une branche feature
git switch -c feature/nouvelle-fonctionnalite

# 3. Travailler et committer
git add .
git commit -m "feat: implementation du dashboard"

# 4. Mettre a jour par rapport a main
git fetch origin
git rebase origin/main

# 5. Pousser la branche
git push -u origin feature/nouvelle-fonctionnalite

# 6. Creer une Pull Request sur GitHub/GitLab

# 7. Apres merge, nettoyer
git switch main
git pull origin main
git branch -d feature/nouvelle-fonctionnalite
\`\`\`

### Tags (versions)

\`\`\`bash
# Creer un tag annote
git tag -a v1.0.0 -m "Version 1.0.0"

# Lister les tags
git tag

# Pousser les tags
git push origin v1.0.0
git push origin --tags

# Checkout un tag
git checkout v1.0.0
\`\`\`

> **Convention de versionning :** Utilisez le Semantic Versioning : \`vMAJOR.MINOR.PATCH\`. MAJOR (breaking changes), MINOR (nouvelles features), PATCH (bugfixes).`
      },
      {
        title: 'Commandes Git avancees',
        content: `Ces commandes avancees sont utiles pour nettoyer l'historique, debugger et gerer des situations complexes.

### Cherry-pick — Appliquer un commit specifique

\`\`\`bash
# Appliquer un commit d'une autre branche
git cherry-pick abc1234

# Cherry-pick sans committer
git cherry-pick --no-commit abc1234

# Cherry-pick plusieurs commits
git cherry-pick abc1234 def5678
\`\`\`

### Bisect — Trouver le commit qui a introduit un bug

\`\`\`bash
# Demarrer la recherche
git bisect start
git bisect bad              # Commit actuel est bugge
git bisect good v1.0.0      # Commit ou tout fonctionnait

# Git navigue automatiquement entre les commits
# Tester et indiquer :
git bisect good    # ou
git bisect bad

# Git trouve le commit coupable !
git bisect reset
\`\`\`

### Reflog — L'historique de toutes les actions

\`\`\`bash
# Voir le reflog (toutes les actions sur HEAD)
git reflog

# Restaurer un etat precedent (meme apres un reset --hard)
git reset --hard HEAD@{3}
\`\`\`

### Blame — Qui a ecrit cette ligne ?

\`\`\`bash
# Voir l'auteur de chaque ligne
git blame src/app.ts

# Blame sur une plage de lignes
git blame -L 10,20 src/app.ts
\`\`\`

### Hooks Git

Les hooks sont des scripts executes automatiquement lors d'actions Git :

| Hook | Declencheur | Usage |
|------|-------------|-------|
| \`pre-commit\` | Avant le commit | Linting, formatage |
| \`commit-msg\` | Apres le message | Validation du format |
| \`pre-push\` | Avant le push | Tests unitaires |
| \`post-merge\` | Apres un merge | npm install automatique |

\`\`\`bash
# Exemple : pre-commit hook (lint avant commit)
# .git/hooks/pre-commit
#!/bin/bash
npm run lint
if [ $? -ne 0 ]; then
    echo "Lint failed. Commit avorte."
    exit 1
fi
\`\`\`

> **Outil recommande :** Utilisez **Husky** (Node.js) ou **pre-commit** (Python) pour gerer les hooks Git en equipe.`
      }
    ]
  },
  {
    id: 111,
    slug: 'github-gitlab-workflows',
    title: 'GitHub/GitLab Workflows & GitFlow',
    subtitle: 'Maitriser les Pull Requests, les pipelines CI/CD et les strategies de branching en equipe',
    icon: 'Github',
    color: '#8b5cf6',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'MVDMp3ILX-g',
    sections: [
      {
        title: 'GitHub — Pull Requests et collaboration',
        content: `GitHub est la plateforme de collaboration Git la plus populaire. Les Pull Requests (PR) sont au coeur du workflow de developpement.

### Workflow Pull Request

\`\`\`
1. Fork ou clone le depot
2. Creer une branche feature
3. Coder + committer
4. Pousser la branche
5. Creer une Pull Request
6. Code review par les pairs
7. Corrections si necessaire
8. Merge dans main
\`\`\`

### Creer une Pull Request avec GitHub CLI

\`\`\`bash
# Installer GitHub CLI
sudo apt install gh -y

# Se connecter
gh auth login

# Creer une PR depuis la branche courante
gh pr create --title "feat: ajout du dashboard" --body "Description detaillee..."

# Lister les PRs ouvertes
gh pr list

# Voir une PR
gh pr view 42

# Merger une PR
gh pr merge 42 --squash

# Review une PR
gh pr review 42 --approve
\`\`\`

### Proteger la branche main

| Regle | Description |
|-------|-------------|
| **Require PR** | Pas de push direct sur main |
| **Require reviews** | Au moins 1-2 approbations |
| **Require status checks** | CI/CD doit passer |
| **Require linear history** | Squash ou rebase only |
| **Require signed commits** | Commits GPG signes |

### Templates utiles

\`\`\`markdown
# .github/pull_request_template.md
## Description
<!-- Qu'est-ce que cette PR change ? -->

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change

## Tests
- [ ] Tests unitaires passes
- [ ] Tests manuels effectues
\`\`\`

> **Bonne pratique :** Chaque PR doit etre petite (< 400 lignes), focalisee sur une seule fonctionnalite, et accompagnee d'une description claire.`
      },
      {
        title: 'GitHub Actions — CI/CD',
        content: `GitHub Actions est le systeme CI/CD integre a GitHub. Il permet d'automatiser les tests, le build et le deploiement.

### Structure d'un workflow

\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout du code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Installation des dependances
        run: npm ci

      - name: Linting
        run: npm run lint

      - name: Tests unitaires
        run: npm test

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app
            git pull origin main
            npm ci --production
            pm2 restart all
\`\`\`

### Concepts cles

| Concept | Description |
|---------|-------------|
| **Workflow** | Pipeline complet (fichier YAML) |
| **Job** | Groupe d'etapes (s'execute sur un runner) |
| **Step** | Action individuelle dans un job |
| **Action** | Bloc reutilisable (marketplace) |
| **Runner** | Machine qui execute le job |
| **Secret** | Variable sensible (mot de passe, cle SSH) |
| **Artifact** | Fichier produit par un job (build, rapport) |

### Workflow Docker Build + Push

\`\`\`yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_TOKEN }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            user/app:latest
            user/app:\${{ github.ref_name }}
\`\`\`

> **Astuce :** Utilisez \`npm ci\` au lieu de \`npm install\` dans les pipelines CI — c'est plus rapide et respecte exactement le \`package-lock.json\`.`
      },
      {
        title: 'GitLab CI/CD',
        content: `GitLab CI/CD est le concurrent direct de GitHub Actions. Le fichier de configuration est \`.gitlab-ci.yml\` a la racine du projet.

### Pipeline basique

\`\`\`yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "20"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm run lint
    - npm test
  artifacts:
    reports:
      junit: test-results.xml

build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_staging:
  stage: deploy
  script:
    - rsync -avz dist/ user@staging:/app/dist/
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  script:
    - rsync -avz dist/ user@prod:/app/dist/
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
\`\`\`

### Comparaison GitHub Actions vs GitLab CI

| Critere | GitHub Actions | GitLab CI |
|---------|---------------|-----------|
| Fichier config | \`.github/workflows/*.yml\` | \`.gitlab-ci.yml\` |
| Runners | GitHub-hosted ou self-hosted | GitLab-hosted ou self-hosted |
| Marketplace | Actions marketplace | Templates CI |
| Variables/Secrets | Settings → Secrets | Settings → CI/CD → Variables |
| Container Registry | ghcr.io | registry.gitlab.com |
| Pages | GitHub Pages | GitLab Pages |

### Pipeline Docker avec GitLab

\`\`\`yaml
docker_build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
  only:
    - tags
\`\`\`

> **Choix pratique :** GitHub Actions est plus populaire pour l'open source. GitLab CI est souvent prefere en entreprise car GitLab offre une plateforme tout-en-un (code, CI/CD, registry, monitoring).`
      },
      {
        title: 'GitFlow — Strategie de branching',
        content: `GitFlow est une strategie de branching structuree, ideale pour les projets avec des releases planifiees.

### Branches GitFlow

| Branche | Duree de vie | Role |
|---------|-------------|------|
| **main** | Permanente | Code en production (chaque commit = une release) |
| **develop** | Permanente | Integration continue des features |
| **feature/*** | Temporaire | Developpement d'une fonctionnalite |
| **release/*** | Temporaire | Preparation d'une release (tests, bugfixes) |
| **hotfix/*** | Temporaire | Correction urgente en production |

### Schema GitFlow

\`\`\`
main     ──●──────────────●──────────────●──────→
            \\              \\    merge     /
hotfix   ──  \\              ●──→        /
              \\                        /
release  ──    \\           ●────●────●/
                \\         /
develop  ──●────●──●──●──●────●──●──●──●──→
             \\      /  \\      /
feature  ──   ●──●──    ●──●──
\`\`\`

### Commandes GitFlow

\`\`\`bash
# Installer git-flow
sudo apt install git-flow -y

# Initialiser GitFlow
git flow init

# Demarrer une feature
git flow feature start nouvelle-page
# → Cree et switch sur feature/nouvelle-page depuis develop

# Terminer une feature
git flow feature finish nouvelle-page
# → Merge dans develop, supprime la branche

# Demarrer une release
git flow release start 1.2.0
# → Cree release/1.2.0 depuis develop

# Terminer une release
git flow release finish 1.2.0
# → Merge dans main ET develop, cree un tag v1.2.0

# Hotfix (correction urgente)
git flow hotfix start fix-login
git flow hotfix finish fix-login
# → Merge dans main ET develop
\`\`\`

> **Alternative moderne :** Pour les projets web avec deploiement continu, le **Trunk-Based Development** (une seule branche main + feature branches courtes) est souvent prefere a GitFlow.`
      },
      {
        title: 'Trunk-Based Development et strategies alternatives',
        content: `GitFlow n'est pas la seule strategie. Selon votre contexte, d'autres approches peuvent etre plus adaptees.

### Trunk-Based Development

Le TBD est la strategie recommandee par Google, Facebook et les equipes DevOps modernes :

\`\`\`
main     ──●──●──●──●──●──●──●──●──●──→ (deployee en continu)
             \\  /  \\  /       \\  /
feature  ──   ●     ●         ●      (branches courtes : 1-2 jours max)
\`\`\`

| Principe | Description |
|----------|-------------|
| **Une seule branche principale** | \`main\` est toujours deployable |
| **Branches courtes** | Features mergees en 1-2 jours maximum |
| **CI obligatoire** | Tests automatiques a chaque commit |
| **Feature flags** | Fonctionnalites cachees derriere des flags |
| **Deploiement continu** | Chaque merge dans main declenche un deploiement |

### GitHub Flow

Version simplifiee, tres populaire pour les projets open source :

\`\`\`bash
# GitHub Flow en pratique
git switch -c feature/dark-mode
# ... coder ...
git push -u origin feature/dark-mode
gh pr create --title "feat: dark mode"
# ... review ...
gh pr merge --squash
\`\`\`

### Comparaison des strategies

| Critere | GitFlow | GitHub Flow | Trunk-Based |
|---------|---------|-------------|-------------|
| Complexite | Elevee | Faible | Moyenne |
| Branches | 5 types | 2 (main + feature) | 1 + features courtes |
| Releases | Planifiees | Continues | Continues |
| Equipe | Moyenne/grande | Petite/moyenne | Toute taille |
| CI/CD | Recommande | Necessaire | Obligatoire |
| Adapte pour | Logiciel versionne | Web apps | Web apps + equipes DevOps |

### Feature Flags

Les feature flags permettent de merger du code inacheve dans main sans l'activer :

\`\`\`javascript
const FEATURES = {
  DARK_MODE: process.env.FEATURE_DARK_MODE === 'true',
  NEW_DASHBOARD: process.env.FEATURE_NEW_DASHBOARD === 'true',
};

if (FEATURES.DARK_MODE) {
  // Nouveau code du dark mode
} else {
  // Ancien code
}
\`\`\`

\`\`\`bash
# Activer une feature en production
FEATURE_DARK_MODE=true npm start

# Services de feature flags : LaunchDarkly, Unleash, Flagsmith
\`\`\`

> **Recommandation :** Pour une equipe DevOps moderne avec du deploiement continu, le **Trunk-Based Development** ou le **GitHub Flow** sont les meilleures options. Reservez GitFlow aux projets avec des releases versionnees.`
      }
    ]
  },
  {
    id: 112,
    slug: 'python-devops',
    title: 'Python pour le DevOps',
    subtitle: 'Automatiser les taches systeme, manipuler des APIs et ecrire des scripts d\'infrastructure avec Python',
    icon: 'Code',
    color: '#8b5cf6',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: '',
    sections: [
      {
        title: 'Python — L\'outil incontournable du DevOps',
        content: `Python est le langage de choix en DevOps grace a sa simplicite, sa lisibilite et son ecosysteme riche en bibliotheques d'automatisation.

### Pourquoi Python en DevOps ?

| Avantage | Description |
|----------|-------------|
| **Lisible** | Syntaxe claire, facile a maintenir en equipe |
| **Ecosysteme** | Bibliotheques pour tout (HTTP, SSH, cloud, parsing) |
| **Multi-plateforme** | Fonctionne sur Linux, macOS, Windows |
| **Adoption** | Ansible, SaltStack, AWS CLI ecrits en Python |
| **Scripting** | Remplace avantageusement Bash pour les scripts complexes |

### Installation et gestion des versions

\`\`\`bash
# Verifier la version installee
python3 --version

# Installer Python 3 (Ubuntu)
sudo apt install python3 python3-pip python3-venv -y

# Installer une version specifique avec pyenv
curl https://pyenv.run | bash
pyenv install 3.12.0
pyenv global 3.12.0
\`\`\`

### Environnements virtuels (indispensable)

\`\`\`bash
# Creer un environnement virtuel
python3 -m venv venv

# Activer l'environnement
source venv/bin/activate

# Installer des paquets
pip install requests paramiko boto3

# Sauvegarder les dependances
pip freeze > requirements.txt

# Installer depuis requirements.txt
pip install -r requirements.txt

# Desactiver l'environnement
deactivate
\`\`\`

### Structure d'un projet Python DevOps

\`\`\`
mon-projet-devops/
├── venv/                  # Environnement virtuel (ne pas versionner)
├── scripts/
│   ├── deploy.py          # Script de deploiement
│   ├── backup.py          # Script de sauvegarde
│   └── monitor.py         # Script de monitoring
├── lib/
│   ├── __init__.py
│   ├── ssh_utils.py
│   └── api_client.py
├── tests/
│   └── test_deploy.py
├── requirements.txt
└── .gitignore
\`\`\`

> **Regle :** Toujours utiliser un environnement virtuel pour isoler les dependances. Ne jamais installer de paquets Python avec \`pip install\` en global.`
      },
      {
        title: 'Manipulation de fichiers et systeme',
        content: `Python excelle dans la manipulation de fichiers, de processus systeme et de configurations — des taches quotidiennes en DevOps.

### Manipuler des fichiers

\`\`\`python
import os
import shutil
from pathlib import Path

# Lire un fichier
with open('/etc/hostname', 'r') as f:
    hostname = f.read().strip()
    print(f"Hostname: {hostname}")

# Ecrire un fichier
with open('/tmp/config.txt', 'w') as f:
    f.write("server_name=production\\n")
    f.write("port=8080\\n")

# Lire un fichier JSON
import json
with open('config.json', 'r') as f:
    config = json.load(f)
print(config['database']['host'])

# Lire un fichier YAML
import yaml   # pip install pyyaml
with open('docker-compose.yml', 'r') as f:
    compose = yaml.safe_load(f)
print(compose['services'])

# Parcourir un repertoire
for fichier in Path('/var/log').glob('*.log'):
    taille = fichier.stat().st_size / 1024
    print(f"{fichier.name}: {taille:.1f} KB")

# Copier / deplacer / supprimer
shutil.copy('source.txt', 'dest.txt')
shutil.copytree('src/', 'backup/')
os.remove('fichier_temporaire.txt')
\`\`\`

### Executer des commandes systeme

\`\`\`python
import subprocess

# Executer une commande simple
result = subprocess.run(['ls', '-la', '/var/log'], capture_output=True, text=True)
print(result.stdout)

# Verifier le code de retour
result = subprocess.run(['systemctl', 'is-active', 'nginx'],
                       capture_output=True, text=True)
if result.returncode == 0:
    print("Nginx est actif")
else:
    print("Nginx est inactif !")

# Executer avec un timeout
try:
    result = subprocess.run(['ping', '-c', '3', '8.8.8.8'],
                          capture_output=True, text=True, timeout=10)
    print(result.stdout)
except subprocess.TimeoutExpired:
    print("Timeout ! Le serveur ne repond pas.")
\`\`\`

### Variables d'environnement

\`\`\`python
import os

# Lire une variable d'environnement
db_host = os.environ.get('DB_HOST', 'localhost')
db_port = int(os.environ.get('DB_PORT', '3306'))

# Verifier qu'une variable existe
if 'API_KEY' not in os.environ:
    raise ValueError("La variable API_KEY est requise !")

api_key = os.environ['API_KEY']
\`\`\`

> **Conseil :** Preferez \`subprocess.run()\` pour executer des commandes systeme — c'est plus sur, plus flexible et permet de capturer la sortie.`
      },
      {
        title: 'Requetes HTTP et API REST',
        content: `L'interaction avec des APIs REST est une tache frequente en DevOps : monitoring, deploiement, alerting, gestion cloud.

### La bibliotheque requests

\`\`\`python
import requests

# GET — Recuperer des donnees
response = requests.get('https://api.github.com/users/octocat')
if response.status_code == 200:
    user = response.json()
    print(f"Nom: {user['name']}")
    print(f"Repos: {user['public_repos']}")

# POST — Envoyer des donnees
data = {
    'title': 'Bug report',
    'body': 'Description du bug...',
    'labels': ['bug']
}
headers = {'Authorization': 'token ghp_xxxxx'}
response = requests.post(
    'https://api.github.com/repos/user/repo/issues',
    json=data,
    headers=headers
)

# PUT — Mettre a jour
requests.put('https://api.example.com/config/1',
             json={'key': 'value'},
             headers={'Authorization': 'Bearer token'})

# DELETE — Supprimer
requests.delete('https://api.example.com/resource/42',
                headers={'Authorization': 'Bearer token'})
\`\`\`

### Gestion des erreurs et retry

\`\`\`python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configuration des retries automatiques
session = requests.Session()
retry = Retry(total=3, backoff_factor=1,
              status_forcelist=[500, 502, 503, 504])
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

try:
    response = session.get('https://api.example.com/health', timeout=5)
    response.raise_for_status()
    print("Service OK")
except requests.exceptions.ConnectionError:
    print("Impossible de se connecter")
except requests.exceptions.Timeout:
    print("Timeout !")
except requests.exceptions.HTTPError as e:
    print(f"Erreur HTTP: {e}")
\`\`\`

### Exemple pratique : script de monitoring

\`\`\`python
#!/usr/bin/env python3
"""Verifie la sante de plusieurs services."""
import requests
from datetime import datetime

SERVICES = [
    {'name': 'API', 'url': 'https://api.example.com/health'},
    {'name': 'Frontend', 'url': 'https://example.com'},
    {'name': 'Grafana', 'url': 'http://localhost:3000/api/health'},
]

WEBHOOK_URL = 'https://hooks.slack.com/services/xxx/yyy/zzz'

def check_services():
    results = []
    for service in SERVICES:
        try:
            r = requests.get(service['url'], timeout=5)
            status = 'UP' if r.status_code == 200 else f'DOWN ({r.status_code})'
        except Exception as e:
            status = f'DOWN ({str(e)[:50]})'
        results.append({'name': service['name'], 'status': status})
    return results

if __name__ == '__main__':
    results = check_services()
    failures = [r for r in results if not r['status'].startswith('UP')]
    if failures:
        msg = f"ALERTE — {len(failures)} service(s) DOWN"
        requests.post(WEBHOOK_URL, json={'text': msg})
    for r in results:
        print(f"[{datetime.now():%H:%M:%S}] {r['name']}: {r['status']}")
\`\`\`

> **Bonne pratique :** Toujours definir un \`timeout\` sur les requetes HTTP. Sans timeout, un script peut rester bloque indefiniment.`
      },
      {
        title: 'Connexion SSH avec Paramiko',
        content: `Paramiko est la bibliotheque Python de reference pour les connexions SSH. Elle permet d'executer des commandes a distance et de transferer des fichiers.

### Connexion par cle SSH (recommandee)

\`\`\`python
import paramiko
from pathlib import Path

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# Connexion avec une cle privee
key = paramiko.RSAKey.from_private_key_file(
    str(Path.home() / '.ssh' / 'id_rsa'))
ssh.connect('192.168.1.100', username='admin', pkey=key)

# Executer plusieurs commandes
commands = [
    'sudo apt update',
    'sudo apt upgrade -y',
    'sudo systemctl restart nginx',
]

for cmd in commands:
    print(f">>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    exit_code = stdout.channel.recv_exit_status()
    output = stdout.read().decode()
    errors = stderr.read().decode()
    if exit_code != 0:
        print(f"ERREUR (code {exit_code}): {errors}")
        break
    print(output)

ssh.close()
\`\`\`

### Transfert de fichiers avec SFTP

\`\`\`python
# Ouvrir une session SFTP
sftp = ssh.open_sftp()

# Upload un fichier
sftp.put('local/deploy.sh', '/home/admin/deploy.sh')

# Download un fichier
sftp.get('/var/log/nginx/access.log', 'logs/access.log')

# Lister un repertoire distant
for entry in sftp.listdir('/var/log/'):
    print(entry)

sftp.close()
\`\`\`

### Script de deploiement complet

\`\`\`python
#!/usr/bin/env python3
"""Script de deploiement automatise via SSH."""
import paramiko
import sys

SERVERS = [
    {'host': '10.0.0.10', 'name': 'web-1'},
    {'host': '10.0.0.11', 'name': 'web-2'},
]
USER = 'deploy'
KEY_PATH = '/home/deploy/.ssh/id_rsa'
APP_DIR = '/app'

def deploy(server):
    print(f"\\n--- Deploiement sur {server['name']} ---")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(server['host'], username=USER, pkey=key)

    commands = [
        f'cd {APP_DIR} && git pull origin main',
        f'cd {APP_DIR} && npm ci --production',
        f'cd {APP_DIR} && npm run build',
        'sudo systemctl restart mon-app',
    ]

    for cmd in commands:
        print(f"  > {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_code = stdout.channel.recv_exit_status()
        if exit_code != 0:
            print(f"  ECHEC: {stderr.read().decode()}")
            ssh.close()
            return False
    ssh.close()
    print(f"  OK — {server['name']} deploye")
    return True

if __name__ == '__main__':
    results = [deploy(s) for s in SERVERS]
    if all(results):
        print("\\nDeploiement reussi sur tous les serveurs !")
    else:
        print("\\nERREUR: certains serveurs ont echoue")
        sys.exit(1)
\`\`\`

> **Alternative :** Pour des deploiements plus complexes, utilisez Ansible (ecrit en Python) qui gere nativement SSH, l'inventaire et l'idempotence.`
      },
      {
        title: 'Automatisation cloud avec Boto3 (AWS)',
        content: `Boto3 est le SDK Python officiel pour AWS. Il permet de gerer toutes les ressources cloud par script.

### Installation et configuration

\`\`\`bash
pip install boto3

# Configuration des credentials AWS
aws configure
# AWS Access Key ID: AKIAXXXXXXXXXXXXXXXX
# AWS Secret Access Key: xxxxxxxx
# Default region: eu-west-3

# Ou via variables d'environnement
export AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
export AWS_SECRET_ACCESS_KEY=xxxxxxxx
export AWS_DEFAULT_REGION=eu-west-3
\`\`\`

### Gerer des instances EC2

\`\`\`python
import boto3

ec2 = boto3.resource('ec2', region_name='eu-west-3')
client = boto3.client('ec2', region_name='eu-west-3')

# Lister toutes les instances
for instance in ec2.instances.all():
    print(f"{instance.id} | {instance.instance_type} | "
          f"{instance.state['Name']} | {instance.public_ip_address}")

# Lancer une instance
instances = ec2.create_instances(
    ImageId='ami-0c55b159cbfafe1f0',
    InstanceType='t3.micro',
    MinCount=1, MaxCount=1,
    KeyName='ma-cle-ssh',
    TagSpecifications=[{
        'ResourceType': 'instance',
        'Tags': [{'Key': 'Name', 'Value': 'web-server'}]
    }]
)
print(f"Instance creee: {instances[0].id}")

# Arreter / demarrer
client.stop_instances(InstanceIds=['i-xxxxxxxxx'])
client.start_instances(InstanceIds=['i-xxxxxxxxx'])
\`\`\`

### Gerer S3 (stockage objet)

\`\`\`python
import boto3
from datetime import datetime

s3 = boto3.client('s3')

# Lister les buckets
for bucket in s3.list_buckets()['Buckets']:
    print(f"{bucket['Name']} — cree le {bucket['CreationDate']}")

# Upload un fichier
s3.upload_file(
    'backup.sql.gz',
    'mon-bucket-backups',
    f"db/backup-{datetime.now():%Y%m%d-%H%M%S}.sql.gz"
)

# Download un fichier
s3.download_file('mon-bucket-backups', 'db/latest.sql.gz', 'restore.sql.gz')

# Lister les objets
response = s3.list_objects_v2(Bucket='mon-bucket-backups', Prefix='db/')
for obj in response.get('Contents', []):
    print(f"{obj['Key']} — {obj['Size'] / 1024:.1f} KB")
\`\`\`

### Script de backup automatise

\`\`\`python
#!/usr/bin/env python3
"""Backup : dump MySQL puis compression puis upload S3."""
import subprocess
import boto3
import os
from datetime import datetime

DB_NAME = os.environ.get('DB_NAME', 'production')
DB_USER = os.environ.get('DB_USER', 'backup_user')
DB_PASS = os.environ.get('DB_PASS')
S3_BUCKET = 'mon-bucket-backups'

timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
dump_file = f'/tmp/{DB_NAME}-{timestamp}.sql'
gz_file = f'{dump_file}.gz'

# 1. Dump MySQL
subprocess.run([
    'mysqldump', '-u', DB_USER, f'-p{DB_PASS}',
    DB_NAME, '--single-transaction', '--quick'
], stdout=open(dump_file, 'w'), check=True)

# 2. Compression
subprocess.run(['gzip', dump_file], check=True)

# 3. Upload S3
s3 = boto3.client('s3')
s3_key = f'backups/{DB_NAME}/{os.path.basename(gz_file)}'
s3.upload_file(gz_file, S3_BUCKET, s3_key)

# 4. Nettoyage
os.remove(gz_file)
print(f"Backup termine: s3://{S3_BUCKET}/{s3_key}")
\`\`\`

> **Bonne pratique :** Ne jamais stocker des credentials AWS dans le code. Utilisez les variables d'environnement, \`~/.aws/credentials\`, ou mieux : les roles IAM (sur EC2, ECS, Lambda).`
      }
    ]
  }
]
