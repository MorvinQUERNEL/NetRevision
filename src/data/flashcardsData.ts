export interface Flashcard {
  id: string
  category: string
  front: string
  back: string
}

export const flashcardData: Flashcard[] = [
  // OSI Layers
  { id: 'f1', category: 'OSI', front: 'Couche 1 du modele OSI', back: 'Couche Physique - bits, cables, signaux electriques, hubs, repeteurs' },
  { id: 'f2', category: 'OSI', front: 'Couche 2 du modele OSI', back: 'Couche Liaison - trames, adresses MAC, switches, bridges, ARP' },
  { id: 'f3', category: 'OSI', front: 'Couche 3 du modele OSI', back: 'Couche Reseau - paquets, adresses IP, routeurs, ICMP' },
  { id: 'f4', category: 'OSI', front: 'Couche 4 du modele OSI', back: 'Couche Transport - segments, TCP/UDP, ports, fiabilite' },
  { id: 'f5', category: 'OSI', front: 'PDU de la couche 2', back: 'Trame (Frame)' },
  { id: 'f6', category: 'OSI', front: 'PDU de la couche 3', back: 'Paquet (Packet)' },
  { id: 'f7', category: 'OSI', front: 'PDU de la couche 4', back: 'Segment (TCP) / Datagramme (UDP)' },
  // Ports
  { id: 'f8', category: 'Ports', front: 'Port 80', back: 'HTTP - navigation web non chiffree' },
  { id: 'f9', category: 'Ports', front: 'Port 443', back: 'HTTPS - navigation web chiffree (TLS/SSL)' },
  { id: 'f10', category: 'Ports', front: 'Port 22', back: 'SSH - acces distant securise' },
  { id: 'f11', category: 'Ports', front: 'Port 23', back: 'Telnet - acces distant non securise (obsolete)' },
  { id: 'f12', category: 'Ports', front: 'Port 53', back: 'DNS - resolution de noms de domaine (TCP et UDP)' },
  { id: 'f13', category: 'Ports', front: 'Ports 67/68', back: 'DHCP - serveur (67) et client (68)' },
  { id: 'f14', category: 'Ports', front: 'Port 25', back: 'SMTP - envoi d\'emails' },
  { id: 'f15', category: 'Ports', front: 'Port 21', back: 'FTP - transfert de fichiers (controle)' },
  { id: 'f16', category: 'Ports', front: 'Port 69', back: 'TFTP - transfert de fichiers simplifie (UDP)' },
  { id: 'f17', category: 'Ports', front: 'Port 161', back: 'SNMP - supervision reseau' },
  { id: 'f18', category: 'Ports', front: 'Port 3389', back: 'RDP - bureau a distance Windows' },
  // IPv4
  { id: 'f19', category: 'IP', front: 'Plage des adresses privees classe A', back: '10.0.0.0 - 10.255.255.255 (10.0.0.0/8)' },
  { id: 'f20', category: 'IP', front: 'Plage des adresses privees classe B', back: '172.16.0.0 - 172.31.255.255 (172.16.0.0/12)' },
  { id: 'f21', category: 'IP', front: 'Plage des adresses privees classe C', back: '192.168.0.0 - 192.168.255.255 (192.168.0.0/16)' },
  { id: 'f22', category: 'IP', front: 'Adresse APIPA', back: '169.254.x.x - attribuee automatiquement quand DHCP echoue' },
  { id: 'f23', category: 'IP', front: 'Adresse de loopback', back: '127.0.0.1 - teste la pile TCP/IP locale' },
  // Subnetting
  { id: 'f24', category: 'Subnetting', front: 'Masque /24', back: '255.255.255.0 → 254 hotes utilisables' },
  { id: 'f25', category: 'Subnetting', front: 'Masque /25', back: '255.255.255.128 → 126 hotes utilisables' },
  { id: 'f26', category: 'Subnetting', front: 'Masque /26', back: '255.255.255.192 → 62 hotes utilisables' },
  { id: 'f27', category: 'Subnetting', front: 'Masque /27', back: '255.255.255.224 → 30 hotes utilisables' },
  { id: 'f28', category: 'Subnetting', front: 'Masque /28', back: '255.255.255.240 → 14 hotes utilisables' },
  { id: 'f29', category: 'Subnetting', front: 'Masque /30', back: '255.255.255.252 → 2 hotes (lien point-a-point)' },
  { id: 'f30', category: 'Subnetting', front: 'Formule nombre d\'hotes', back: '2^(32-CIDR) - 2 hotes utilisables' },
  // VLAN/STP
  { id: 'f31', category: 'Switching', front: 'VLAN natif', back: 'VLAN par defaut sur un trunk (non tague) - VLAN 1 par defaut' },
  { id: 'f32', category: 'Switching', front: 'Protocole 802.1Q', back: 'Standard de trunking VLAN - ajoute un tag de 4 octets dans la trame' },
  { id: 'f33', category: 'Switching', front: 'STP - Root Bridge', back: 'Switch avec le Bridge ID le plus bas (priorite + MAC) - centre du spanning tree' },
  { id: 'f34', category: 'Switching', front: 'STP - etats de port', back: 'Blocking → Listening → Learning → Forwarding (+ Disabled)' },
  { id: 'f35', category: 'Switching', front: 'RSTP (802.1w)', back: 'Rapid STP - convergence en quelques secondes (vs 30-50s pour STP classique)' },
  // Routing
  { id: 'f36', category: 'Routage', front: 'Distance administrative OSPF', back: '110' },
  { id: 'f37', category: 'Routage', front: 'Distance administrative RIP', back: '120' },
  { id: 'f38', category: 'Routage', front: 'Distance administrative route statique', back: '1' },
  { id: 'f39', category: 'Routage', front: 'Distance administrative EIGRP', back: '90' },
  { id: 'f40', category: 'Routage', front: 'Distance administrative route connectee', back: '0 (la plus fiable)' },
  { id: 'f41', category: 'Routage', front: 'OSPF - hello timer par defaut', back: '10 secondes (dead timer = 40s)' },
  { id: 'f42', category: 'Routage', front: 'RIP - nombre de sauts maximum', back: '15 (16 = inatteignable)' },
  // Protocols
  { id: 'f43', category: 'Protocoles', front: 'DHCP - processus DORA', back: 'Discover → Offer → Request → Acknowledge' },
  { id: 'f44', category: 'Protocoles', front: 'ARP', back: 'Address Resolution Protocol - resout une adresse IP en adresse MAC' },
  { id: 'f45', category: 'Protocoles', front: 'ICMP', back: 'Internet Control Message Protocol - ping, traceroute, messages d\'erreur' },
  { id: 'f46', category: 'Protocoles', front: 'DNS - enregistrement A', back: 'Associe un nom de domaine a une adresse IPv4' },
  { id: 'f47', category: 'Protocoles', front: 'DNS - enregistrement AAAA', back: 'Associe un nom de domaine a une adresse IPv6' },
  { id: 'f48', category: 'Protocoles', front: 'DNS - enregistrement MX', back: 'Mail Exchange - pointe vers le serveur mail du domaine' },
  // Security
  { id: 'f49', category: 'Securite', front: 'Triade CIA', back: 'Confidentialite, Integrite, Disponibilite (Availability)' },
  { id: 'f50', category: 'Securite', front: 'Framework AAA', back: 'Authentication, Authorization, Accounting' },
  { id: 'f51', category: 'Securite', front: 'Firewall stateful vs stateless', back: 'Stateful : suit l\'etat des connexions | Stateless : filtre paquet par paquet sans contexte' },
  { id: 'f52', category: 'Securite', front: 'WPA2', back: 'WiFi Protected Access 2 - utilise AES-CCMP, standard actuel securise' },
  { id: 'f53', category: 'Securite', front: 'WPA3', back: 'Utilise SAE (Simultaneous Authentication of Equals) - plus securise que WPA2' },
  // TCP/UDP
  { id: 'f54', category: 'Transport', front: 'TCP - three-way handshake', back: 'SYN → SYN-ACK → ACK' },
  { id: 'f55', category: 'Transport', front: 'TCP vs UDP', back: 'TCP : fiable, oriente connexion | UDP : rapide, sans connexion, pas de garantie' },
  { id: 'f56', category: 'Transport', front: 'Protocoles utilisant UDP', back: 'DNS (53), DHCP (67/68), TFTP (69), SNMP (161), VoIP/RTP' },
  // Cisco commands
  { id: 'f57', category: 'Commandes', front: 'show ip interface brief', back: 'Affiche un resume de toutes les interfaces (IP, statut, protocole)' },
  { id: 'f58', category: 'Commandes', front: 'show running-config', back: 'Affiche la configuration active en memoire RAM' },
  { id: 'f59', category: 'Commandes', front: 'show ip route', back: 'Affiche la table de routage complete' },
  { id: 'f60', category: 'Commandes', front: 'show vlan brief', back: 'Affiche la liste des VLANs et les ports assignes' },

  // === PROGRAMME 2 — Avance ===

  // ACL
  { id: 'f61', category: 'ACL', front: 'ACL standard vs etendue', back: 'Standard : filtre par IP source (1-99) | Etendue : filtre par IP src/dst, port, protocole (100-199)' },
  { id: 'f62', category: 'ACL', front: 'Regle implicite a la fin d\'une ACL', back: 'deny any — tout trafic non explicitement autorise est bloque' },
  { id: 'f63', category: 'ACL', front: 'Placement d\'une ACL standard', back: 'Le plus pres possible de la destination' },
  { id: 'f64', category: 'ACL', front: 'Placement d\'une ACL etendue', back: 'Le plus pres possible de la source' },
  { id: 'f65', category: 'ACL', front: 'Wildcard mask pour /24', back: '0.0.0.255 — inverse du masque de sous-reseau' },

  // NAT/PAT
  { id: 'f66', category: 'NAT', front: 'NAT statique', back: 'Traduction 1:1 entre une IP privee et une IP publique fixe' },
  { id: 'f67', category: 'NAT', front: 'NAT dynamique', back: 'Traduction N:N utilisant un pool d\'adresses publiques' },
  { id: 'f68', category: 'NAT', front: 'PAT (Port Address Translation)', back: 'NAT overload — plusieurs IP privees partagent 1 seule IP publique via les ports' },
  { id: 'f69', category: 'NAT', front: 'Inside local vs Inside global', back: 'Inside local : IP privee interne | Inside global : IP publique vue depuis Internet' },

  // VPN
  { id: 'f70', category: 'VPN', front: 'VPN site-to-site vs remote access', back: 'Site-to-site : relie 2 reseaux (ex: siege-filiale) | Remote access : connecte un utilisateur distant' },
  { id: 'f71', category: 'VPN', front: 'IPsec — 2 phases', back: 'Phase 1 : IKE — etablit le tunnel securise | Phase 2 : ESP/AH — chiffre les donnees' },
  { id: 'f72', category: 'VPN', front: 'Protocole ESP vs AH', back: 'ESP : chiffrement + authentification | AH : authentification uniquement (pas de chiffrement)' },
  { id: 'f73', category: 'VPN', front: 'GRE tunnel', back: 'Generic Routing Encapsulation — encapsule n\'importe quel protocole dans IP (pas de chiffrement natif)' },

  // WiFi
  { id: 'f74', category: 'WiFi', front: 'Bandes de frequences WiFi', back: '2.4 GHz (portee, 3 canaux non-chevauchants) et 5 GHz (debit, 23+ canaux)' },
  { id: 'f75', category: 'WiFi', front: 'Canaux non-chevauchants en 2.4 GHz', back: '1, 6, 11 — les seuls a utiliser pour eviter les interferences' },
  { id: 'f76', category: 'WiFi', front: 'SSID', back: 'Service Set Identifier — nom du reseau WiFi diffuse par l\'AP' },
  { id: 'f77', category: 'WiFi', front: 'Mode infrastructure vs ad-hoc', back: 'Infrastructure : clients → AP → reseau | Ad-hoc : clients communiquent directement entre eux' },

  // Supervision
  { id: 'f78', category: 'Supervision', front: 'SNMP — 3 composants', back: 'Manager (NMS), Agent (sur l\'equipement), MIB (base de donnees des objets)' },
  { id: 'f79', category: 'Supervision', front: 'SNMP trap vs polling', back: 'Trap : l\'agent envoie une alerte spontanee | Polling : le manager interroge periodiquement' },
  { id: 'f80', category: 'Supervision', front: 'Syslog — niveaux de severite', back: '0=Emergency, 1=Alert, 2=Critical, 3=Error, 4=Warning, 5=Notice, 6=Info, 7=Debug' },
  { id: 'f81', category: 'Supervision', front: 'NetFlow', back: 'Protocole Cisco pour collecter les statistiques de flux reseau (src, dst, ports, octets)' },

  // === PROGRAMME 3 — Entreprise ===

  // Automatisation
  { id: 'f82', category: 'Automatisation', front: 'Netmiko (Python)', back: 'Librairie Python pour se connecter en SSH aux equipements reseau et envoyer des commandes' },
  { id: 'f83', category: 'Automatisation', front: 'NAPALM (Python)', back: 'Network Automation and Programmability Abstraction Layer — API unifiee multi-constructeur' },
  { id: 'f84', category: 'Automatisation', front: 'Ansible — playbook', back: 'Fichier YAML decrivant les taches d\'automatisation a executer sur les hotes cibles' },
  { id: 'f85', category: 'Automatisation', front: 'Ansible — avantage agentless', back: 'Pas besoin d\'installer un agent sur les equipements — utilise SSH ou API REST' },
  { id: 'f86', category: 'Automatisation', front: 'API REST vs NETCONF', back: 'REST : HTTP/JSON, simple | NETCONF : SSH/XML, transactionnel, validation de config' },
  { id: 'f87', category: 'Automatisation', front: 'YANG', back: 'Langage de modelisation de donnees pour les configurations reseau (utilise avec NETCONF/RESTCONF)' },

  // Cloud
  { id: 'f88', category: 'Cloud', front: 'IaaS vs PaaS vs SaaS', back: 'IaaS : infra (VM, stockage) | PaaS : plateforme (runtime, DB) | SaaS : application complete' },
  { id: 'f89', category: 'Cloud', front: 'VPC (Virtual Private Cloud)', back: 'Reseau virtuel isole dans le cloud avec sous-reseaux, tables de routage et ACL' },
  { id: 'f90', category: 'Cloud', front: 'Kubernetes — Pod', back: 'Plus petite unite deployable — contient un ou plusieurs conteneurs partageant le meme reseau' },
  { id: 'f91', category: 'Cloud', front: 'Kubernetes — Service', back: 'Abstraction qui expose un ensemble de Pods via une IP stable et du load balancing' },
  { id: 'f92', category: 'Cloud', front: 'CNI (Container Network Interface)', back: 'Plugin reseau pour Kubernetes (Calico, Flannel, Cilium) — gere le reseau des Pods' },

  // SDN
  { id: 'f93', category: 'SDN', front: 'SDN — 3 couches', back: 'Application (apps) → Controle (controleur central) → Infrastructure (switches/routeurs)' },
  { id: 'f94', category: 'SDN', front: 'OpenFlow', back: 'Protocole SDN entre le controleur et les switches — gere les tables de flux' },
  { id: 'f95', category: 'SDN', front: 'Cisco DNA Center', back: 'Controleur SDN de Cisco pour le campus — automatisation, assurance, segmentation' },
  { id: 'f96', category: 'SDN', front: 'API Northbound vs Southbound', back: 'Northbound : controleur → applications (REST) | Southbound : controleur → equipements (OpenFlow, NETCONF)' },

  // Haute disponibilite
  { id: 'f97', category: 'Haute Dispo', front: 'HSRP (Hot Standby Router Protocol)', back: 'Protocole Cisco de redondance de passerelle — un routeur actif, un standby, IP virtuelle partagee' },
  { id: 'f98', category: 'Haute Dispo', front: 'VRRP vs HSRP', back: 'VRRP : standard ouvert (RFC 5798) | HSRP : proprietaire Cisco — meme principe de gateway virtuelle' },
  { id: 'f99', category: 'Haute Dispo', front: 'EtherChannel', back: 'Agregation de liens — combine plusieurs liens physiques en un seul lien logique (LACP ou PAgP)' },
  { id: 'f100', category: 'Haute Dispo', front: 'LACP vs PAgP', back: 'LACP : standard IEEE 802.3ad (ouvert) | PAgP : proprietaire Cisco' },

  // Monitoring
  { id: 'f101', category: 'Monitoring', front: 'Prometheus', back: 'Systeme de monitoring open-source — collecte de metriques par scraping, stockage time-series' },
  { id: 'f102', category: 'Monitoring', front: 'Grafana', back: 'Plateforme de visualisation — dashboards et graphiques pour les metriques (Prometheus, InfluxDB...)' },
  { id: 'f103', category: 'Monitoring', front: 'ELK Stack', back: 'Elasticsearch + Logstash + Kibana — collecte, indexation et visualisation de logs' },

  // === PROGRAMME 4 — Expert ===

  // QoS
  { id: 'f104', category: 'QoS', front: 'DSCP EF (Expedited Forwarding)', back: 'Valeur DSCP 46 — priorite maximale, reserve a la VoIP (latence < 150ms)' },
  { id: 'f105', category: 'QoS', front: 'QoS — 3 modeles', back: 'Best Effort (aucune QoS) | IntServ (reservation RSVP) | DiffServ (classification DSCP, le plus utilise)' },
  { id: 'f106', category: 'QoS', front: 'Traffic shaping vs policing', back: 'Shaping : met en file d\'attente le trafic excessif | Policing : drop ou remarque le trafic excessif' },
  { id: 'f107', category: 'QoS', front: 'File d\'attente LLQ', back: 'Low Latency Queuing — file stricte prioritaire pour la voix + CBWFQ pour le reste' },

  // IPv6
  { id: 'f108', category: 'IPv6', front: 'Taille d\'une adresse IPv6', back: '128 bits (vs 32 bits pour IPv4) — 8 groupes de 4 hex separes par :' },
  { id: 'f109', category: 'IPv6', front: 'Adresse link-local IPv6', back: 'FE80::/10 — auto-configuree, non routable, utilisee pour la communication sur le lien local' },
  { id: 'f110', category: 'IPv6', front: 'SLAAC', back: 'Stateless Address Autoconfiguration — l\'hote genere son IP via le prefixe du routeur (RA) + EUI-64 ou aleatoire' },
  { id: 'f111', category: 'IPv6', front: 'NDP (Neighbor Discovery Protocol)', back: 'Remplace ARP en IPv6 — utilise ICMPv6 (NS/NA pour resolution d\'adresse, RS/RA pour decouverte routeur)' },
  { id: 'f112', category: 'IPv6', front: 'Dual-stack', back: 'Technique de transition — l\'equipement execute IPv4 et IPv6 simultanement' },

  // MPLS
  { id: 'f113', category: 'MPLS', front: 'MPLS — principe', back: 'Commutation par labels (couche 2.5) au lieu du routage IP — plus rapide, permet les VPN et le traffic engineering' },
  { id: 'f114', category: 'MPLS', front: 'LSR vs LER', back: 'LSR : Label Switch Router (coeur, commute les labels) | LER : Label Edge Router (bordure, ajoute/retire les labels)' },
  { id: 'f115', category: 'MPLS', front: 'MPLS VPN L3 vs L2', back: 'L3 VPN : routage entre sites (VRF + MP-BGP) | L2 VPN : extension de VLAN entre sites (VPLS, pseudowire)' },
  { id: 'f116', category: 'MPLS', front: 'VRF (Virtual Routing and Forwarding)', back: 'Table de routage virtuelle isolee — permet a un routeur de gerer plusieurs clients sans melange de routes' },

  // BGP
  { id: 'f117', category: 'BGP', front: 'BGP — type de protocole', back: 'Path-vector, protocole de routage inter-AS (entre systemes autonomes), port TCP 179' },
  { id: 'f118', category: 'BGP', front: 'eBGP vs iBGP', back: 'eBGP : entre AS differents (TTL=1) | iBGP : au sein du meme AS (full-mesh ou route reflector)' },
  { id: 'f119', category: 'BGP', front: 'BGP Route Reflector', back: 'Concentrateur de routes iBGP — evite le full-mesh en refletant les routes aux clients' },
  { id: 'f120', category: 'BGP', front: 'BGP — attribut AS_PATH', back: 'Liste des AS traverses — utilise pour eviter les boucles et influencer le choix de route (plus court = prefere)' },
  { id: 'f121', category: 'BGP', front: 'BGP Communities', back: 'Tags attaches aux routes pour appliquer des politiques de routage (ex: no-export, local-pref)' },

  // Wireless avance
  { id: 'f122', category: 'WiFi Avance', front: 'Wi-Fi 6 (802.11ax)', back: 'OFDMA + MU-MIMO + BSS Coloring + TWT — debit max 9.6 Gbps, optimise pour les environnements denses' },
  { id: 'f123', category: 'WiFi Avance', front: 'OFDMA', back: 'Orthogonal Frequency Division Multiple Access — divise le canal en sous-canaux pour servir plusieurs clients simultanement' },
  { id: 'f124', category: 'WiFi Avance', front: 'WLC (Wireless LAN Controller)', back: 'Controleur centralise qui gere les AP — configuration, roaming, securite, load balancing' },
  { id: 'f125', category: 'WiFi Avance', front: 'Roaming 802.11r (FT)', back: 'Fast Transition — pre-authentification entre AP pour un roaming sans coupure (< 50ms)' },

  // Datacenter
  { id: 'f126', category: 'Datacenter', front: 'Architecture Spine-Leaf', back: 'Topologie datacenter : chaque leaf se connecte a chaque spine — latence previsible, scalable' },
  { id: 'f127', category: 'Datacenter', front: 'VXLAN', back: 'Virtual Extensible LAN — encapsule les trames L2 dans UDP/IP pour etendre les VLAN au-dela d\'un site (16M segments)' },
  { id: 'f128', category: 'Datacenter', front: 'EVPN', back: 'Ethernet VPN — plan de controle BGP pour VXLAN, remplace le flood-and-learn par du signaling' },
  { id: 'f129', category: 'Datacenter', front: 'Underlay vs Overlay', back: 'Underlay : reseau physique (IP/OSPF/BGP) | Overlay : reseau virtuel par-dessus (VXLAN, tunnels)' },

  // SD-WAN
  { id: 'f130', category: 'SD-WAN', front: 'SD-WAN — principe', back: 'Separation du plan de controle et de donnees pour le WAN — gestion centralisee, multi-transport (MPLS, Internet, 4G)' },
  { id: 'f131', category: 'SD-WAN', front: 'SD-WAN — avantages vs MPLS', back: 'Cout reduit (utilise Internet), deploiement rapide (zero-touch), choix dynamique du meilleur lien' },
  { id: 'f132', category: 'SD-WAN', front: 'Cisco vManage', back: 'Orchestrateur centralisee SD-WAN Cisco — configuration, monitoring, politiques de trafic' },

  // Cybersecurite
  { id: 'f133', category: 'Cybersecurite', front: 'IDS vs IPS', back: 'IDS : detecte et alerte (passif) | IPS : detecte et bloque (inline, actif)' },
  { id: 'f134', category: 'Cybersecurite', front: 'SOC (Security Operations Center)', back: 'Centre operationnel de securite — equipe qui surveille, detecte et repond aux incidents 24/7' },
  { id: 'f135', category: 'Cybersecurite', front: 'SIEM', back: 'Security Information and Event Management — collecte et correle les logs pour detecter les menaces (Splunk, QRadar)' },
  { id: 'f136', category: 'Cybersecurite', front: 'Zero Trust', back: 'Modele de securite "ne jamais faire confiance, toujours verifier" — authentification continue, microsegmentation' },
  { id: 'f137', category: 'Cybersecurite', front: 'Kill Chain (Lockheed Martin)', back: 'Reconnaissance → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives' },
  { id: 'f138', category: 'Cybersecurite', front: 'Pentest — 5 phases', back: 'Reconnaissance → Scanning → Exploitation → Post-exploitation → Reporting' },
  { id: 'f139', category: 'Cybersecurite', front: 'OWASP Top 10', back: 'Liste des 10 vulnerabilites web les plus critiques (injection, XSS, broken auth, SSRF...)' },
  { id: 'f140', category: 'Cybersecurite', front: 'CVE', back: 'Common Vulnerabilities and Exposures — identifiant unique pour chaque vulnerabilite connue (ex: CVE-2024-1234)' },
]
