export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  relatedChapter?: string
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'access-list',
    term: 'Access List (ACL)',
    definition: 'Liste de regles sequentielles appliquees sur un routeur pour autoriser ou refuser le trafic reseau en fonction de criteres comme l\'adresse IP source, destination ou le port. Les ACL standard filtrent uniquement sur l\'adresse source, tandis que les ACL etendues offrent un filtrage plus granulaire.',
    category: 'Securite',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'acl-etendue',
    term: 'ACL Etendue',
    definition: 'Liste de controle d\'acces filtrant le trafic sur la base de l\'adresse IP source, destination, du protocole (TCP, UDP, ICMP) et des numeros de port. Elle est numerotee de 100 a 199 ou nommee et placee au plus pres de la source.',
    category: 'Securite',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'acl-standard',
    term: 'ACL Standard',
    definition: 'Liste de controle d\'acces filtrant uniquement sur l\'adresse IP source. Elle est numerotee de 1 a 99 et doit etre placee au plus pres de la destination pour eviter de bloquer du trafic legitime.',
    category: 'Securite',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'adresse-broadcast',
    term: 'Adresse Broadcast',
    definition: 'Adresse speciale permettant d\'envoyer un paquet a tous les hotes d\'un reseau donne. En IPv4, il s\'agit de la derniere adresse du sous-reseau, ou tous les bits de la partie hote sont a 1.',
    category: 'IP',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'adresse-ip',
    term: 'Adresse IP',
    definition: 'Identifiant logique unique attribue a chaque interface reseau sur un reseau IP. En IPv4 elle est codee sur 32 bits (4 octets) et en IPv6 sur 128 bits (16 octets).',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'adresse-mac',
    term: 'Adresse MAC',
    definition: 'Adresse physique unique de 48 bits (6 octets) gravee dans la carte reseau par le fabricant. Elle est utilisee pour la communication au niveau de la couche 2 (liaison de donnees) du modele OSI.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'ansible',
    term: 'Ansible',
    definition: 'Outil d\'automatisation open source agentless utilisant SSH pour configurer et gerer des equipements reseau a distance. Il utilise des playbooks ecrits en YAML pour decrire les taches a executer de maniere declarative.',
    category: 'Commandes',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ansible-galaxy',
    term: 'Ansible Galaxy',
    definition: 'Depot communautaire de roles et collections Ansible preconçus. Il permet de telecharger et partager des roles d\'automatisation reseau prets a l\'emploi pour differents constructeurs (Cisco, Juniper, Arista).',
    category: 'Commandes',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ansible-playbook',
    term: 'Ansible Playbook',
    definition: 'Fichier YAML decrivant un ensemble ordonne de taches (plays) a executer sur des hotes cibles. Chaque play associe un groupe d\'hotes a une liste de modules Ansible a appliquer.',
    category: 'Commandes',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ansible-role',
    term: 'Ansible Role',
    definition: 'Structure de repertoires standardisee pour organiser et reutiliser du code Ansible. Un role regroupe les taches, handlers, variables, templates et fichiers dans une arborescence conventionnelle, facilitant le partage via Ansible Galaxy.',
    category: 'Commandes',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'api-rest',
    term: 'API REST',
    definition: 'Interface de programmation basee sur le protocole HTTP permettant d\'interagir avec des equipements reseau de maniere programmatique. Les requetes GET, POST, PUT et DELETE sont utilisees pour lire et modifier les configurations.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'arp',
    term: 'ARP (Address Resolution Protocol)',
    definition: 'Protocole de couche 2 permettant de resoudre une adresse IP en adresse MAC sur un reseau local. L\'hote envoie une requete ARP en broadcast et recoit une reponse unicast contenant l\'adresse MAC correspondante.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'arp-spoofing',
    term: 'ARP Spoofing',
    definition: 'Attaque reseau consistant a envoyer de fausses reponses ARP pour associer l\'adresse MAC de l\'attaquant a l\'adresse IP d\'un autre hote, permettant l\'interception du trafic (attaque man-in-the-middle).',
    category: 'Securite',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'authentification-802-1x',
    term: 'Authentification 802.1X',
    definition: 'Norme IEEE de controle d\'acces reseau basee sur les ports. Elle impose une authentification via un serveur RADIUS avant d\'autoriser un equipement a communiquer sur le reseau, applicable au WiFi et au filaire.',
    category: 'Securite',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'autonomous-system',
    term: 'Autonomous System (AS)',
    definition: 'Ensemble de reseaux IP sous le controle d\'une seule entite administrative partageant une politique de routage commune. Chaque AS est identifie par un numero unique (ASN) attribue par un registre Internet regional.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'bande-passante',
    term: 'Bande passante',
    definition: 'Debit maximal theorique d\'un lien reseau, exprime en bits par seconde (bps). Elle represente la capacite de transmission du support physique et ne doit pas etre confondue avec le debit reel.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'bgp',
    term: 'BGP (Border Gateway Protocol)',
    definition: 'Protocole de routage externe (EGP) utilise pour echanger des informations de routage entre systemes autonomes sur Internet. Il fonctionne sur TCP port 179 et utilise un algorithme de selection de chemin base sur des attributs multiples.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'broadcast-domain',
    term: 'Broadcast Domain',
    definition: 'Zone logique du reseau dans laquelle tout hote peut atteindre les autres par un envoi en broadcast. Un routeur ou un VLAN delimite un domaine de broadcast.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'calico',
    term: 'Calico',
    definition: 'Plugin reseau (CNI) pour Kubernetes qui fournit la connectivite reseau et les politiques de securite entre les pods. Il utilise le protocole BGP pour distribuer les routes et supporte le routage de couche 3 sans encapsulation.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'cidr',
    term: 'CIDR (Classless Inter-Domain Routing)',
    definition: 'Methode d\'allocation d\'adresses IP et de routage remplacant le systeme de classes. La notation CIDR (ex: 192.168.1.0/24) utilise un prefixe de longueur variable pour definir la partie reseau d\'une adresse.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'cisco-dna-center',
    term: 'Cisco DNA Center',
    definition: 'Plateforme de gestion reseau intent-based de Cisco fournissant l\'automatisation, l\'assurance et l\'analytique. Elle centralise la configuration, le monitoring et le depannage des reseaux campus, WAN et sans fil.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'classe-ip',
    term: 'Classe IP',
    definition: 'Ancien systeme de classification des adresses IPv4 en cinq classes (A, B, C, D, E) basees sur les premiers bits de l\'adresse. Ce systeme a ete remplace par le CIDR mais reste utile pour comprendre les plages d\'adresses privees.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'cni',
    term: 'CNI (Container Network Interface)',
    definition: 'Specification standard pour les plugins reseau dans les environnements de conteneurs comme Kubernetes. Elle definit comment configurer les interfaces reseau des conteneurs et gerer la connectivite entre pods.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'collision-domain',
    term: 'Collision Domain',
    definition: 'Segment de reseau ou les trames emises par deux equipements peuvent entrer en collision. Chaque port d\'un switch constitue un domaine de collision distinct, tandis qu\'un hub partage un seul domaine de collision.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'commutateur',
    term: 'Commutateur (Switch)',
    definition: 'Equipement reseau de couche 2 qui transmet les trames Ethernet en se basant sur les adresses MAC. Il apprend dynamiquement les adresses MAC connectees a chaque port et reduit les domaines de collision.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'conteneur',
    term: 'Conteneur',
    definition: 'Unite d\'execution legere et isolee partageant le noyau du systeme hote. Les conteneurs (Docker, Podman) embarquent l\'application et ses dependances, offrant une portabilite et un deploiement rapide dans les environnements cloud.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'sdn-controller',
    term: 'Controleur SDN',
    definition: 'Element central d\'une architecture SDN jouant le role de cerveau du reseau. Il maintient une vue globale de la topologie et programme les equipements du plan de donnees via des protocoles comme OpenFlow ou des API proprietaires.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'couche-application',
    term: 'Couche Application (Couche 7)',
    definition: 'Couche superieure du modele OSI fournissant l\'interface entre les applications et le reseau. Elle inclut les protocoles HTTP, FTP, SMTP, DNS et DHCP utilises directement par les logiciels utilisateurs.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-liaison',
    term: 'Couche Liaison de donnees (Couche 2)',
    definition: 'Deuxieme couche du modele OSI responsable du transfert fiable de trames entre deux noeuds directement connectes. Elle gere l\'adressage MAC, la detection d\'erreurs (CRC) et le controle d\'acces au support.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-physique',
    term: 'Couche Physique (Couche 1)',
    definition: 'Premiere couche du modele OSI definissant les specifications electriques, mecaniques et fonctionnelles pour activer et maintenir un lien physique. Elle gere la transmission de bits bruts sur le support (cable, fibre, ondes).',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-reseau',
    term: 'Couche Reseau (Couche 3)',
    definition: 'Troisieme couche du modele OSI responsable de l\'adressage logique (IP) et du routage des paquets entre reseaux differents. Les routeurs operent principalement a cette couche.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-transport',
    term: 'Couche Transport (Couche 4)',
    definition: 'Quatrieme couche du modele OSI assurant le transport de bout en bout des donnees entre applications. Elle fournit le controle de flux, la segmentation et la fiabilite via TCP ou la rapidite via UDP.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'demarche-depannage',
    term: 'Demarche de depannage',
    definition: 'Methodologie structuree pour diagnostiquer les problemes reseau. Les approches courantes incluent le bottom-up (couche 1 vers 7), le top-down (couche 7 vers 1) et le divide-and-conquer (partir du milieu).',
    category: 'Commandes',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'dhcp',
    term: 'DHCP (Dynamic Host Configuration Protocol)',
    definition: 'Protocole permettant l\'attribution automatique d\'adresses IP et de parametres reseau (masque, passerelle, DNS) aux clients. Le processus DORA (Discover, Offer, Request, Acknowledge) se deroule en quatre etapes.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'dhcp-relay',
    term: 'DHCP Relay',
    definition: 'Fonctionnalite configuree sur un routeur permettant de relayer les requetes DHCP broadcast d\'un sous-reseau vers un serveur DHCP situe dans un autre sous-reseau. Configuree avec la commande ip helper-address.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'dns',
    term: 'DNS (Domain Name System)',
    definition: 'Systeme hierarchique de resolution de noms de domaine en adresses IP. Il utilise une architecture distribuee avec des serveurs racine, TLD et autoritaires, et fonctionne principalement sur le port UDP 53.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'docker-network',
    term: 'Docker Network',
    definition: 'Systeme de mise en reseau de Docker permettant aux conteneurs de communiquer entre eux et avec l\'exterieur. Les pilotes principaux sont bridge (reseau local), host (partage du reseau hote) et overlay (multi-hote).',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'domaine-collision',
    term: 'Domaine de collision',
    definition: 'Zone reseau ou les signaux de deux equipements peuvent entrer en conflit. Un hub cree un seul domaine de collision partage, tandis qu\'un switch isole chaque port dans son propre domaine de collision.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'dot1q',
    term: 'Dot1Q (802.1Q)',
    definition: 'Norme IEEE d\'encapsulation des trames Ethernet pour le marquage VLAN. Elle insere un tag de 4 octets dans l\'en-tete Ethernet contenant le VLAN ID (12 bits, soit 4094 VLANs possibles) et la priorite CoS.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'dual-stack',
    term: 'Dual Stack',
    definition: 'Technique de transition permettant a un equipement reseau de faire fonctionner simultanement IPv4 et IPv6 sur la meme interface. C\'est la methode la plus courante pour assurer la coexistence des deux protocoles durant la migration.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'eigrp',
    term: 'EIGRP (Enhanced Interior Gateway Routing Protocol)',
    definition: 'Protocole de routage proprietaire Cisco de type vecteur de distance avance. Il utilise l\'algorithme DUAL pour une convergence rapide et prend en compte la bande passante et le delai pour calculer la metrique composite.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'elk-stack',
    term: 'ELK Stack (Elasticsearch, Logstash, Kibana)',
    definition: 'Suite d\'outils open source pour la collecte, le stockage et la visualisation de logs et de metriques reseau. Logstash collecte les donnees, Elasticsearch les indexe et Kibana fournit les tableaux de bord.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'encapsulation',
    term: 'Encapsulation',
    definition: 'Processus par lequel chaque couche du modele OSI ajoute son propre en-tete aux donnees recues de la couche superieure. Les donnees deviennent successivement segment, paquet, trame puis bits lors de la descente dans les couches.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'dns-enregistrement',
    term: 'Enregistrement DNS',
    definition: 'Entree dans une zone DNS associant un nom a une valeur. Les types principaux sont A (nom vers IPv4), AAAA (nom vers IPv6), CNAME (alias), MX (serveur mail), NS (serveur de noms) et PTR (resolution inverse).',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'etherchannel',
    term: 'EtherChannel',
    definition: 'Technologie d\'agregation de liens permettant de combiner plusieurs liaisons physiques Ethernet en un seul lien logique. Les protocoles LACP (IEEE 802.3ad) et PAgP (Cisco) permettent la negociation automatique.',
    category: 'Switching',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'failover',
    term: 'Failover',
    definition: 'Mecanisme de basculement automatique vers un equipement ou un chemin de secours en cas de defaillance du systeme principal. Il est essentiel pour assurer la haute disponibilite des services reseau.',
    category: 'Services',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'fenetre-glissante',
    term: 'Fenetre glissante (Sliding Window)',
    definition: 'Mecanisme de controle de flux utilise par TCP permettant a l\'emetteur d\'envoyer plusieurs segments avant de recevoir un acquittement. La taille de la fenetre s\'adapte dynamiquement aux conditions du reseau.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'firewall',
    term: 'Firewall (Pare-feu)',
    definition: 'Dispositif de securite reseau filtrant le trafic entrant et sortant selon des regles predefinies. Il peut operer au niveau des couches 3-4 (filtrage de paquets) ou couche 7 (inspection applicative, pare-feu nouvelle generation).',
    category: 'Securite',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'ftp',
    term: 'FTP (File Transfer Protocol)',
    definition: 'Protocole de transfert de fichiers fonctionnant sur les ports TCP 20 (donnees) et 21 (controle). Il peut operer en mode actif ou passif et transmet les identifiants en clair, d\'ou la preference pour SFTP ou FTPS.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'gateway',
    term: 'Gateway (Passerelle)',
    definition: 'Equipement (generalement un routeur) servant de point de sortie d\'un reseau local vers d\'autres reseaux. La passerelle par defaut est l\'adresse IP du routeur que les hotes utilisent pour atteindre des reseaux distants.',
    category: 'Routage',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'grafana',
    term: 'Grafana',
    definition: 'Plateforme open source de visualisation et de monitoring permettant de creer des tableaux de bord a partir de sources de donnees multiples (Prometheus, InfluxDB, SNMP). Tres utilisee pour le monitoring reseau et les alertes.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'gre',
    term: 'GRE (Generic Routing Encapsulation)',
    definition: 'Protocole de tunneling developpe par Cisco encapsulant divers protocoles reseau dans des paquets IP point-a-point. Il ne fournit pas de chiffrement natif mais peut etre combine avec IPsec pour la securite.',
    category: 'Securite',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'haute-disponibilite',
    term: 'Haute disponibilite (HA)',
    definition: 'Architecture reseau concue pour minimiser les temps d\'arret en eliminant les points de defaillance uniques. Elle repose sur la redondance des equipements, des liens et des protocoles comme HSRP, VRRP ou le stacking.',
    category: 'Services',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'hsrp',
    term: 'HSRP (Hot Standby Router Protocol)',
    definition: 'Protocole proprietaire Cisco permettant a plusieurs routeurs de partager une adresse IP virtuelle commune. Un routeur actif gere le trafic tandis que les routeurs en standby prennent le relais en cas de panne.',
    category: 'Routage',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'http-https',
    term: 'HTTP / HTTPS',
    definition: 'Protocoles de la couche application pour le transfert de pages web. HTTP (port 80) transmet en clair, tandis que HTTPS (port 443) chiffre les echanges avec TLS, assurant la confidentialite et l\'integrite des donnees.',
    category: 'Services',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'hub',
    term: 'Hub (Concentrateur)',
    definition: 'Equipement reseau de couche 1 retransmettant les signaux recus sur tous ses ports sans filtrage. Il partage un seul domaine de collision entre tous les ports, ce qui le rend obsolete face au switch.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'iaas',
    term: 'IaaS (Infrastructure as a Service)',
    definition: 'Modele de service cloud fournissant des ressources d\'infrastructure virtualisees (serveurs, stockage, reseau) a la demande. Le fournisseur gere le materiel, le client gere le systeme d\'exploitation et les applications.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'icmp',
    term: 'ICMP (Internet Control Message Protocol)',
    definition: 'Protocole de couche 3 utilise pour le diagnostic et la signalisation d\'erreurs reseau. Il est a la base des commandes ping (echo request/reply) et traceroute (TTL exceeded). Il ne transporte pas de donnees applicatives.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'ids-ips',
    term: 'IDS / IPS',
    definition: 'Systemes de detection (IDS) et de prevention (IPS) d\'intrusions analysant le trafic reseau pour identifier des activites malveillantes. L\'IDS alerte uniquement, tandis que l\'IPS peut bloquer automatiquement le trafic suspect.',
    category: 'Securite',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'interface-loopback',
    term: 'Interface Loopback',
    definition: 'Interface virtuelle logique sur un routeur, toujours active tant que l\'equipement fonctionne. Elle est utilisee comme identifiant stable pour les protocoles de routage (OSPF router-id) et pour les tests de connectivite.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'inventaire-ansible',
    term: 'Inventaire Ansible',
    definition: 'Fichier (INI ou YAML) listant les equipements cibles et leurs variables de connexion pour Ansible. Il organise les hotes en groupes logiques et peut etre statique ou genere dynamiquement.',
    category: 'Commandes',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ipam',
    term: 'IPAM (IP Address Management)',
    definition: 'Outil ou systeme de gestion centralise des adresses IP dans un reseau. Il permet de planifier, suivre et administrer l\'attribution des adresses IP et des sous-reseaux pour eviter les conflits.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'ipsec',
    term: 'IPsec (Internet Protocol Security)',
    definition: 'Suite de protocoles securisant les communications IP par chiffrement et authentification. Elle comprend AH (integrite), ESP (confidentialite et integrite) et IKE (echange de cles). Utilisee principalement dans les VPN site-a-site.',
    category: 'Securite',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'ipv6',
    term: 'IPv6',
    definition: 'Version 6 du protocole Internet utilisant des adresses de 128 bits notees en hexadecimal (8 groupes de 4 chiffres). IPv6 resout la penurie d\'adresses IPv4 et simplifie la configuration avec l\'auto-configuration SLAAC.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'ipv6-link-local',
    term: 'IPv6 Link-Local',
    definition: 'Adresse IPv6 automatiquement generee sur chaque interface, dans la plage FE80::/10. Elle est utilisee pour la communication sur le lien local uniquement et n\'est jamais routee au-dela du segment reseau.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'jinja2',
    term: 'Jinja2',
    definition: 'Moteur de templates Python utilise avec Ansible et d\'autres outils d\'automatisation reseau pour generer dynamiquement des configurations d\'equipements a partir de variables et de structures de controle.',
    category: 'Commandes',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'kubernetes-ingress',
    term: 'Kubernetes Ingress',
    definition: 'Ressource Kubernetes gerant l\'acces externe aux services du cluster, generalement via HTTP/HTTPS. L\'Ingress Controller (Nginx, Traefik) implemente les regles de routage basees sur les noms d\'hotes et les chemins URL.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'kubernetes-service',
    term: 'Kubernetes Service',
    definition: 'Abstraction Kubernetes exposant un ensemble de pods via une adresse IP virtuelle stable (ClusterIP). Les types de services incluent ClusterIP, NodePort et LoadBalancer pour differents niveaux d\'exposition.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'latence',
    term: 'Latence',
    definition: 'Temps de transit d\'un paquet entre sa source et sa destination, mesure en millisecondes. Elle se compose du delai de propagation, de serialisation, de mise en file d\'attente et de traitement.',
    category: 'Transport',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'load-balancer',
    term: 'Load Balancer (Repartiteur de charge)',
    definition: 'Equipement ou service distribuant le trafic reseau entre plusieurs serveurs pour optimiser les performances et la disponibilite. Il peut operer en couche 4 (TCP/UDP) ou couche 7 (HTTP) et utilise divers algorithmes (round-robin, least connections).',
    category: 'Cloud',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'masque-sous-reseau',
    term: 'Masque de sous-reseau',
    definition: 'Valeur de 32 bits separant la partie reseau de la partie hote dans une adresse IPv4. Les bits a 1 identifient la partie reseau, les bits a 0 la partie hote. Exemple : 255.255.255.0 correspond a un /24.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'mib',
    term: 'MIB (Management Information Base)',
    definition: 'Base de donnees hierarchique structuree en arbre contenant les objets geres d\'un equipement reseau accessible via SNMP. Chaque objet est identifie par un OID (Object Identifier) unique.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'modele-osi',
    term: 'Modele OSI',
    definition: 'Modele de reference en 7 couches (physique, liaison, reseau, transport, session, presentation, application) definissant les fonctions de communication reseau. Il sert de cadre theorique pour comprendre les protocoles et le depannage.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'modele-tcp-ip',
    term: 'Modele TCP/IP',
    definition: 'Modele pratique en 4 couches (acces reseau, Internet, transport, application) utilise dans les reseaux reels. Contrairement au modele OSI a 7 couches, il fusionne les couches session, presentation et application en une seule.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'napalm',
    term: 'NAPALM (Network Automation and Programmability Abstraction Layer)',
    definition: 'Bibliotheque Python fournissant une interface unifiee pour interagir avec des equipements reseau multi-constructeurs. Elle permet de lire la configuration, l\'etat des interfaces et de deployer des changements de maniere normalisee.',
    category: 'Commandes',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'nat',
    term: 'NAT (Network Address Translation)',
    definition: 'Mecanisme de traduction d\'adresses IP permettant a plusieurs hotes d\'un reseau prive de partager une ou plusieurs adresses IP publiques. Le NAT statique fait une correspondance un-a-un, le NAT dynamique utilise un pool d\'adresses.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'nat-dynamique',
    term: 'NAT Dynamique',
    definition: 'Type de NAT associant dynamiquement une adresse IP interne a une adresse IP publique issue d\'un pool d\'adresses configure. Contrairement au PAT, chaque connexion interne necessite une adresse publique distincte du pool.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'nat-inside-outside',
    term: 'NAT Inside / Outside',
    definition: 'Concepts fondamentaux du NAT Cisco : l\'interface inside est connectee au reseau prive local, l\'interface outside est connectee au reseau public. Le NAT traduit les adresses between inside local et inside global.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'nat-statique',
    term: 'NAT Statique',
    definition: 'Traduction permanente un-a-un entre une adresse IP privee interne et une adresse IP publique. Utilisee principalement pour rendre des serveurs internes (web, mail) accessibles depuis Internet.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'netconf',
    term: 'NETCONF',
    definition: 'Protocole de gestion de configuration reseau base sur XML et utilisant SSH comme transport. Il supporte les operations de lecture, ecriture et validation de configuration, ainsi que le verrouillage pour eviter les conflits.',
    category: 'Commandes',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'netflow',
    term: 'NetFlow',
    definition: 'Protocole developpe par Cisco permettant la collecte et l\'analyse des flux de trafic reseau. Chaque flux est defini par un ensemble de 5 a 7 parametres (IP source/destination, ports, protocole) et permet le monitoring de la bande passante.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'netmiko',
    term: 'Netmiko',
    definition: 'Bibliotheque Python simplifiant les connexions SSH vers les equipements reseau multi-constructeurs. Elle fournit des methodes pour envoyer des commandes, gerer les prompts et recuperer les sorties de maniere programmatique.',
    category: 'Commandes',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'nslookup',
    term: 'nslookup / dig',
    definition: 'Outils en ligne de commande permettant d\'interroger les serveurs DNS pour resoudre des noms de domaine en adresses IP. La commande dig fournit des informations plus detaillees que nslookup sur les enregistrements DNS.',
    category: 'Commandes',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'openflow',
    term: 'OpenFlow',
    definition: 'Protocole de communication entre le plan de controle (controleur SDN) et le plan de donnees (commutateurs) dans une architecture SDN. Il permet au controleur de programmer les tables de flux des commutateurs de maniere centralisee.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'ospf',
    term: 'OSPF (Open Shortest Path First)',
    definition: 'Protocole de routage interne (IGP) a etat de liens utilisant l\'algorithme de Dijkstra pour calculer le plus court chemin. Il organise le reseau en aires et utilise le cout (base sur la bande passante) comme metrique.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'ospf-aire',
    term: 'OSPF Aire',
    definition: 'Subdivision logique d\'un domaine OSPF regroupant des routeurs et des reseaux. L\'aire 0 (backbone) est obligatoire et toutes les autres aires doivent y etre connectees. Cela reduit la taille de la base de donnees d\'etat de liens.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'paquet',
    term: 'Paquet',
    definition: 'Unite de donnees de la couche 3 (reseau) du modele OSI. Un paquet IP contient un en-tete (adresses IP source et destination, TTL, protocole) et une charge utile contenant le segment de couche 4.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'paramiko',
    term: 'Paramiko',
    definition: 'Bibliotheque Python implementant le protocole SSH pour les connexions securisees aux equipements reseau. Elle sert de base a Netmiko et permet l\'execution de commandes et le transfert de fichiers via SFTP.',
    category: 'Commandes',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'pat',
    term: 'PAT (Port Address Translation)',
    definition: 'Forme de NAT utilisant les numeros de port pour distinguer les connexions de plusieurs hotes internes partageant une seule adresse IP publique. Aussi appele NAT overload, c\'est le type de NAT le plus couramment deploye.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'ping',
    term: 'Ping',
    definition: 'Utilitaire reseau envoyant des messages ICMP Echo Request a un hote cible et mesurant le temps de reponse (RTT). Il permet de verifier la connectivite reseau et de diagnostiquer les problemes de joignabilite.',
    category: 'Commandes',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'pod-kubernetes',
    term: 'Pod (Kubernetes)',
    definition: 'Plus petite unite deployable dans Kubernetes, regroupant un ou plusieurs conteneurs partageant le meme espace reseau et stockage. Chaque pod recoit une adresse IP unique dans le cluster.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'port-security',
    term: 'Port Security',
    definition: 'Fonctionnalite de securite sur un switch Cisco limitant le nombre d\'adresses MAC autorisees sur un port. En cas de violation, le port peut etre desactive (shutdown), restreint (restrict) ou simplement protege (protect).',
    category: 'Securite',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'port-tcp-udp',
    term: 'Port TCP/UDP',
    definition: 'Numero logique (0-65535) identifiant une application ou un service sur un hote. Les ports 0-1023 sont reserves (well-known ports), les ports 1024-49151 sont enregistres et les ports 49152-65535 sont dynamiques.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'prometheus',
    term: 'Prometheus',
    definition: 'Systeme open source de monitoring et d\'alerte utilisant un modele de collecte en pull (scraping). Il stocke les metriques sous forme de series temporelles et utilise le langage PromQL pour les requetes.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'protocole-routage',
    term: 'Protocole de routage',
    definition: 'Protocole permettant aux routeurs d\'echanger automatiquement des informations sur les reseaux accessibles et de construire leurs tables de routage. Les categories principales sont les protocoles a vecteur de distance (RIP) et a etat de liens (OSPF).',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'qos',
    term: 'QoS (Quality of Service)',
    definition: 'Ensemble de techniques permettant de prioriser certains types de trafic sur le reseau. La QoS utilise la classification, le marquage (DSCP, CoS), la mise en file d\'attente et le lissage de trafic pour garantir les performances.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'radius',
    term: 'RADIUS',
    definition: 'Protocole d\'authentification, d\'autorisation et de comptabilisation (AAA) utilise pour centraliser le controle d\'acces reseau. Le serveur RADIUS authentifie les utilisateurs et equipements, notamment dans les reseaux WiFi 802.1X.',
    category: 'Securite',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'restconf',
    term: 'RESTCONF',
    definition: 'Protocole de gestion reseau base sur HTTP/HTTPS utilisant les modeles de donnees YANG. Il offre une alternative plus legere a NETCONF avec des operations CRUD standard (GET, POST, PUT, DELETE) et des formats JSON ou XML.',
    category: 'Commandes',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'rip',
    term: 'RIP (Routing Information Protocol)',
    definition: 'Protocole de routage interne a vecteur de distance utilisant le nombre de sauts comme metrique (maximum 15). RIPv1 ne supporte pas le VLSM ni le CIDR, contrairement a RIPv2 qui envoie le masque dans ses mises a jour.',
    category: 'Routage',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'routage-inter-vlan',
    term: 'Routage inter-VLAN',
    definition: 'Technique permettant la communication entre differents VLANs via un routeur ou un switch de couche 3. La methode router-on-a-stick utilise des sous-interfaces sur un seul lien trunk entre le routeur et le switch.',
    category: 'Routage',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'routage-statique',
    term: 'Routage statique',
    definition: 'Configuration manuelle des routes dans la table de routage d\'un routeur. Chaque route specifies le reseau de destination, le masque et le prochain saut ou l\'interface de sortie. Adapte aux petits reseaux ou aux routes par defaut.',
    category: 'Routage',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'route-par-defaut',
    term: 'Route par defaut',
    definition: 'Route de dernier recours (0.0.0.0/0) utilisee lorsqu\'aucune route plus specifique ne correspond a la destination d\'un paquet. Elle dirige generalement le trafic vers la passerelle de sortie du reseau.',
    category: 'Routage',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'routeur',
    term: 'Routeur',
    definition: 'Equipement de couche 3 interconnectant des reseaux differents et acheminant les paquets en se basant sur les adresses IP de destination et sa table de routage. Il segmente les domaines de broadcast.',
    category: 'Routage',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'python-scapy',
    term: 'Scapy',
    definition: 'Bibliotheque Python puissante permettant de creer, envoyer, capturer et analyser des paquets reseau de maniere programmatique. Elle supporte un grand nombre de protocoles et est utile pour les tests de securite et le prototypage.',
    category: 'Commandes',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'sdn',
    term: 'SDN (Software-Defined Networking)',
    definition: 'Architecture reseau separant le plan de controle du plan de donnees, centralisant l\'intelligence reseau dans un controleur logiciel. Cela permet une gestion programmatique et agile de l\'infrastructure reseau.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'show-ip-route',
    term: 'show ip route',
    definition: 'Commande Cisco IOS affichant la table de routage complete d\'un routeur, incluant les routes connectees (C), statiques (S), OSPF (O), EIGRP (D) et la route par defaut. Commande essentielle pour le depannage.',
    category: 'Commandes',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'slaac',
    term: 'SLAAC (Stateless Address Autoconfiguration)',
    definition: 'Mecanisme d\'auto-configuration sans etat specifique a IPv6 permettant aux hotes de generer automatiquement leur adresse IP a partir du prefixe reseau annonce par le routeur (Router Advertisement) et de leur adresse MAC.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'snmp',
    term: 'SNMP (Simple Network Management Protocol)',
    definition: 'Protocole de supervision reseau permettant de collecter des informations et de configurer des equipements a distance. SNMPv3 ajoute l\'authentification et le chiffrement. Les operations principales sont GET, SET et TRAP.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'snmp-community',
    term: 'SNMP Community String',
    definition: 'Chaine de caracteres faisant office de mot de passe pour l\'acces SNMP v1/v2c. La community "public" permet la lecture (read-only) et "private" l\'ecriture (read-write) par defaut. SNMPv3 remplace ce mecanisme par une authentification plus robuste.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'snmp-trap',
    term: 'SNMP Trap',
    definition: 'Notification asynchrone envoyee spontanement par un agent SNMP (equipement reseau) vers le serveur de management pour signaler un evenement important comme une panne d\'interface ou un depassement de seuil.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'snmpv3',
    term: 'SNMPv3',
    definition: 'Version securisee du protocole SNMP ajoutant l\'authentification (MD5, SHA) et le chiffrement (DES, AES) des communications. Elle introduit le modele USM (User-based Security Model) remplacant les community strings.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'sous-reseau',
    term: 'Sous-reseau (Subnet)',
    definition: 'Division logique d\'un reseau IP en segments plus petits en empruntant des bits a la partie hote pour creer la partie sous-reseau. Le subnetting optimise l\'utilisation des adresses et ameliore la securite par segmentation.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'spanning-tree',
    term: 'Spanning Tree Protocol (STP)',
    definition: 'Protocole de couche 2 (IEEE 802.1D) eliminant les boucles dans les topologies redondantes de switches en bloquant certains ports. Il elit un root bridge et calcule le chemin le plus court vers celui-ci.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'ssh',
    term: 'SSH (Secure Shell)',
    definition: 'Protocole de connexion securisee a distance (port TCP 22) remplacant Telnet. Il fournit le chiffrement des donnees, l\'authentification forte et l\'integrite, utilise pour l\'administration des equipements reseau.',
    category: 'Securite',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'ssl-tls',
    term: 'SSL / TLS',
    definition: 'Protocoles cryptographiques assurant la securite des communications sur Internet. TLS (successeur de SSL) fournit le chiffrement, l\'authentification du serveur et l\'integrite des donnees. Utilise par HTTPS, FTPS et d\'autres services.',
    category: 'Securite',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'stp-portfast',
    term: 'STP PortFast',
    definition: 'Fonctionnalite Cisco permettant a un port de switch de passer directement a l\'etat de transfert (forwarding) sans passer par les etapes STP habituelles. A configurer uniquement sur les ports d\'acces connectes a des hotes finaux.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'syslog',
    term: 'Syslog',
    definition: 'Protocole standard de journalisation permettant aux equipements reseau d\'envoyer des messages de log vers un serveur centralise (port UDP 514). Les messages sont classes par facilite et par niveau de severite (0 a 7).',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'table-arp',
    term: 'Table ARP',
    definition: 'Cache local stockant les correspondances entre adresses IP et adresses MAC apprises par le protocole ARP. Les entrees ont une duree de vie limitee et sont rafraichies automatiquement. Consultable avec la commande show arp ou arp -a.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'table-routage',
    term: 'Table de routage',
    definition: 'Structure de donnees dans un routeur contenant les chemins vers les reseaux de destination. Chaque entree specifie le reseau, le masque, le prochain saut et la metrique. La route la plus specifique (longest prefix match) est preferee.',
    category: 'Routage',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'tcp',
    term: 'TCP (Transmission Control Protocol)',
    definition: 'Protocole de transport oriente connexion (couche 4) garantissant la livraison fiable et ordonnee des donnees. Il utilise le three-way handshake (SYN, SYN-ACK, ACK) pour etablir la connexion et des numeros de sequence pour le controle.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'tcp-handshake',
    term: 'TCP Three-Way Handshake',
    definition: 'Processus en trois etapes pour etablir une connexion TCP : le client envoie un SYN, le serveur repond par SYN-ACK, puis le client confirme par ACK. Ce mecanisme synchronise les numeros de sequence des deux parties.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'telnet',
    term: 'Telnet',
    definition: 'Protocole d\'acces distant (port TCP 23) transmettant les donnees en texte clair, y compris les identifiants. Il est considere comme non securise et a ete remplace par SSH pour l\'administration des equipements reseau.',
    category: 'Commandes',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'terraform',
    term: 'Terraform',
    definition: 'Outil d\'Infrastructure as Code (IaC) permettant de definir et deployer des ressources reseau et cloud de maniere declarative. Les fichiers de configuration HCL decrivent l\'etat souhaite de l\'infrastructure.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'three-tier-architecture',
    term: 'Three-Tier Architecture',
    definition: 'Architecture reseau hierarchique en trois couches : acces (connexion des hotes), distribution (politique et agregation) et coeur (backbone haut debit). Ce modele Cisco facilite l\'evolutivite et le depannage.',
    category: 'Switching',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'traceroute',
    term: 'Traceroute',
    definition: 'Outil de diagnostic affichant le chemin emprunte par les paquets vers une destination en envoyant des paquets avec un TTL incrementalement augmente. Chaque routeur traversin renvoyant un message ICMP Time Exceeded.',
    category: 'Commandes',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'trame',
    term: 'Trame (Frame)',
    definition: 'Unite de donnees de la couche 2 (liaison de donnees) du modele OSI. Une trame Ethernet contient les adresses MAC source et destination, le champ EtherType, la charge utile et le FCS (controle d\'erreur).',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'trunk',
    term: 'Trunk',
    definition: 'Lien reseau transportant le trafic de plusieurs VLANs entre des switches ou entre un switch et un routeur. Le protocole 802.1Q ajoute un tag a chaque trame pour identifier son VLAN d\'appartenance.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'ttl',
    term: 'TTL (Time To Live)',
    definition: 'Champ de l\'en-tete IP decremente de 1 par chaque routeur traverse. Lorsqu\'il atteint 0, le paquet est detruit et un message ICMP Time Exceeded est renvoye. Il evite les boucles de routage infinies.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'udp',
    term: 'UDP (User Datagram Protocol)',
    definition: 'Protocole de transport non oriente connexion (couche 4) offrant un envoi rapide sans garantie de livraison ni d\'ordre. Il est utilise pour le streaming, la VoIP, le DNS et le DHCP ou la vitesse prime sur la fiabilite.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'vlan',
    term: 'VLAN (Virtual Local Area Network)',
    definition: 'Reseau local virtuel permettant de segmenter logiquement un switch physique en plusieurs domaines de broadcast independants. Les VLANs ameliorent la securite, les performances et la gestion du reseau.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'vlan-natif',
    term: 'VLAN Natif',
    definition: 'VLAN dont le trafic circule sans tag 802.1Q sur un lien trunk. Par defaut, il s\'agit du VLAN 1 sur les equipements Cisco. Il est recommande de le changer pour des raisons de securite.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'vlsm',
    term: 'VLSM (Variable Length Subnet Masking)',
    definition: 'Technique de subnetting permettant d\'utiliser des masques de sous-reseau de longueurs differentes dans un meme reseau. Elle optimise l\'utilisation des adresses IP en adaptant la taille des sous-reseaux aux besoins reels.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'vpc-cloud',
    term: 'VPC (Virtual Private Cloud)',
    definition: 'Reseau virtuel isole dans un environnement cloud public (AWS, Azure, GCP) permettant de deployer des ressources avec un controle complet sur l\'adressage IP, les sous-reseaux, les tables de routage et les regles de securite.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'vpn',
    term: 'VPN (Virtual Private Network)',
    definition: 'Tunnel chiffre cree sur un reseau public (Internet) pour interconnecter des reseaux prives de maniere securisee. Les types principaux sont le VPN site-a-site (IPsec) et le VPN d\'acces distant (SSL/TLS).',
    category: 'Securite',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'vpn-ssl',
    term: 'VPN SSL',
    definition: 'Type de VPN utilisant le protocole TLS/SSL pour creer un tunnel securise, generalement via un navigateur web (clientless) ou un client leger. Il est plus simple a deployer que l\'IPsec pour l\'acces distant des utilisateurs.',
    category: 'Securite',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'vrf',
    term: 'VRF (Virtual Routing and Forwarding)',
    definition: 'Technologie de virtualisation permettant a un routeur de maintenir plusieurs tables de routage independantes simultanement. Chaque VRF isole le trafic comme s\'il s\'agissait de routeurs physiques distincts.',
    category: 'Routage',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'vrrp',
    term: 'VRRP (Virtual Router Redundancy Protocol)',
    definition: 'Protocole standard (RFC 5798) de redondance de passerelle similaire a HSRP. Il permet a plusieurs routeurs de partager une adresse IP virtuelle, assurant la continuite du routage en cas de panne du routeur maitre.',
    category: 'Routage',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'vxlan',
    term: 'VXLAN (Virtual Extensible LAN)',
    definition: 'Protocole d\'encapsulation overlay de couche 2 sur couche 3 utilisant UDP (port 4789). Il etend les VLANs au-dela des limites du reseau physique avec un identifiant VNI de 24 bits (16 millions de segments), essentiel pour les datacenters.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'wep',
    term: 'WEP (Wired Equivalent Privacy)',
    definition: 'Ancien protocole de securite WiFi utilisant le chiffrement RC4 avec des cles de 64 ou 128 bits. Il est considere comme completement obsolete et vulnerable en raison de faiblesses cryptographiques majeures.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wifi-canal',
    term: 'WiFi Canal',
    definition: 'Frequence specifique sur laquelle un point d\'acces emet et recoit. En 2.4 GHz, les canaux 1, 6 et 11 sont les seuls non chevauchants. En 5 GHz, plus de canaux non chevauchants sont disponibles.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wifi-standard',
    term: 'WiFi Standards (802.11)',
    definition: 'Famille de normes IEEE pour les reseaux sans fil. Les principaux standards sont 802.11n (WiFi 4, 600 Mbps), 802.11ac (WiFi 5, 6.9 Gbps) et 802.11ax (WiFi 6, 9.6 Gbps). Chaque generation ameliore le debit et l\'efficacite.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wildcard-mask',
    term: 'Wildcard Mask',
    definition: 'Masque inverse utilise dans les ACL et la configuration OSPF de Cisco. Les bits a 0 indiquent une correspondance exacte et les bits a 1 indiquent un "je ne verifie pas". C\'est l\'inverse logique du masque de sous-reseau.',
    category: 'Securite',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'wireshark',
    term: 'Wireshark',
    definition: 'Analyseur de protocoles reseau open source permettant de capturer et d\'inspecter le trafic en temps reel. Il decode les en-tetes de chaque couche et supporte des filtres d\'affichage et de capture pour isoler le trafic pertinent.',
    category: 'Commandes',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'wlan-controller',
    term: 'WLAN Controller (WLC)',
    definition: 'Equipement centralisant la gestion de multiples points d\'acces WiFi legers (Lightweight AP). Il gere l\'attribution des canaux, la puissance d\'emission, le roaming et les politiques de securite de maniere centralisee.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wpa2',
    term: 'WPA2 (Wi-Fi Protected Access 2)',
    definition: 'Protocole de securite WiFi base sur la norme IEEE 802.11i utilisant le chiffrement AES-CCMP. Le mode WPA2-Personal utilise une cle pre-partagee (PSK), tandis que WPA2-Enterprise utilise un serveur RADIUS pour l\'authentification.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wpa3',
    term: 'WPA3',
    definition: 'Derniere generation de securite WiFi renforcant la protection avec le protocole SAE (Simultaneous Authentication of Equals) remplacant le PSK. Il offre un chiffrement individuel des sessions et une meilleure resistance aux attaques par dictionnaire.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'yang',
    term: 'YANG',
    definition: 'Langage de modelisation de donnees utilise pour decrire la configuration et l\'etat operationnel des equipements reseau. Il est utilise avec NETCONF et RESTCONF pour definir les structures de donnees de maniere standardisee.',
    category: 'Commandes',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'zabbix',
    term: 'Zabbix',
    definition: 'Plateforme open source de supervision reseau supportant SNMP, ICMP et agents dedies. Elle permet la collecte de metriques, la detection de problemes, l\'envoi d\'alertes et la visualisation via des tableaux de bord.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'zone-dmz',
    term: 'Zone DMZ (Demilitarized Zone)',
    definition: 'Sous-reseau isole place entre le reseau interne et Internet, hebergeant les serveurs accessibles depuis l\'exterieur (web, mail, DNS public). Le pare-feu filtre le trafic entre les trois zones pour limiter l\'exposition.',
    category: 'Securite',
    relatedChapter: 'acl-access-control'
  }
]
