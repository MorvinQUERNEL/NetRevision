// === Types ===

export type ExerciseType = 'qcm' | 'multi' | 'truefalse' | 'short' | 'matching' | 'ordering' | 'config' | 'scenario'

export interface QcmExercise { type: 'qcm'; id: string; question: string; options: string[]; correct: number; explanation: string; topic: string }
export interface MultiExercise { type: 'multi'; id: string; question: string; options: string[]; correct: number[]; explanation: string; topic: string }
export interface TrueFalseExercise { type: 'truefalse'; id: string; statement: string; correct: boolean; explanation: string; topic: string }
export interface ShortExercise { type: 'short'; id: string; question: string; acceptedAnswers: string[]; hint?: string; explanation: string; topic: string }
export interface MatchingExercise { type: 'matching'; id: string; instruction: string; pairs: { left: string; right: string }[]; explanation: string; topic: string }
export interface OrderingExercise { type: 'ordering'; id: string; instruction: string; items: string[]; explanation: string; topic: string }
export interface ConfigExercise { type: 'config'; id: string; configSnippet: string; question: string; options: string[]; correct: number; explanation: string; topic: string }
export interface ScenarioExercise { type: 'scenario'; id: string; scenario: string; diagram?: string; subQuestions: { question: string; options: string[]; correct: number; explanation: string }[]; topic: string }

export type MegaExercise = QcmExercise | MultiExercise | TrueFalseExercise | ShortExercise | MatchingExercise | OrderingExercise | ConfigExercise | ScenarioExercise

export interface MegaSection {
  id: string
  title: string
  type: ExerciseType
  icon: string
  color: string
  exercises: MegaExercise[]
}

// === Section A : QCM classique (30 questions) ===

const sectionA: MegaSection = {
  id: 'A',
  title: 'QCM classique',
  type: 'qcm',
  icon: 'CheckCircle2',
  color: '#00e5a0',
  exercises: [
    // P1 - OSI / IP
    { type: 'qcm', id: 'mega_a1', question: 'Quelle couche OSI est responsable du controle de flux et de la fiabilite de bout en bout ?', options: ['Couche 2 - Liaison', 'Couche 3 - Reseau', 'Couche 4 - Transport', 'Couche 7 - Application'], correct: 2, explanation: 'La couche Transport (4) assure le controle de flux, la fiabilite (TCP) et la segmentation des donnees.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a2', question: 'Quel masque de sous-reseau correspond a un /20 ?', options: ['255.255.240.0', '255.255.248.0', '255.255.224.0', '255.255.252.0'], correct: 0, explanation: '/20 signifie 20 bits reseau, soit 255.255.240.0 (11111111.11111111.11110000.00000000).', topic: 'P1' },
    { type: 'qcm', id: 'mega_a3', question: 'Quel protocole utilise le port 53 ?', options: ['HTTP', 'FTP', 'DNS', 'SMTP'], correct: 2, explanation: 'DNS (Domain Name System) utilise le port 53 en UDP (requetes) et TCP (transferts de zone).', topic: 'P1' },
    { type: 'qcm', id: 'mega_a4', question: 'Quelle adresse IPv6 est equivalente a 127.0.0.1 en IPv4 ?', options: ['fe80::1', '::1', 'ff02::1', '2001:db8::1'], correct: 1, explanation: '::1 est l\'adresse de loopback IPv6, equivalente a 127.0.0.1 en IPv4.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a5', question: 'Combien de domaines de collision un switch 24 ports cree-t-il ?', options: ['1', '12', '24', '48'], correct: 2, explanation: 'Chaque port d\'un switch cree un domaine de collision separe, donc 24 ports = 24 domaines.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a6', question: 'Quel est le role principal du protocole ARP ?', options: ['Resoudre un nom de domaine en IP', 'Resoudre une adresse IP en adresse MAC', 'Attribuer une adresse IP dynamique', 'Verifier la connectivite reseau'], correct: 1, explanation: 'ARP (Address Resolution Protocol) permet de trouver l\'adresse MAC correspondant a une adresse IP sur le reseau local.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a7', question: 'Quelle commande Cisco affiche la table de routage ?', options: ['show interfaces', 'show ip route', 'show running-config', 'show vlan brief'], correct: 1, explanation: 'La commande show ip route affiche la table de routage avec toutes les routes connues du routeur.', topic: 'P1' },
    // P2 - TCP/UDP, Routage dynamique, ACL, NAT
    { type: 'qcm', id: 'mega_a8', question: 'Quel mecanisme TCP garantit la livraison fiable des donnees ?', options: ['Best effort', 'Acknowledgement (ACK)', 'TTL', 'Fragmentation'], correct: 1, explanation: 'TCP utilise des acquittements (ACK) pour confirmer la reception de chaque segment et retransmettre si necessaire.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a9', question: 'Quel protocole de routage dynamique utilise l\'algorithme de Dijkstra ?', options: ['RIP', 'EIGRP', 'OSPF', 'BGP'], correct: 2, explanation: 'OSPF utilise l\'algorithme SPF (Shortest Path First) de Dijkstra pour calculer le chemin le plus court.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a10', question: 'Une ACL standard filtre le trafic en fonction de :', options: ['L\'adresse source uniquement', 'L\'adresse source et destination', 'Le port source et destination', 'Le protocole et l\'adresse destination'], correct: 0, explanation: 'Les ACL standard (1-99) filtrent uniquement sur l\'adresse IP source. Les ACL etendues filtrent sur plus de criteres.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a11', question: 'Le NAT overload (PAT) utilise quel element pour differencier les connexions ?', options: ['L\'adresse MAC', 'Le numero de port', 'Le TTL', 'Le VLAN ID'], correct: 1, explanation: 'Le PAT (Port Address Translation) utilise les numeros de port pour differencier plusieurs connexions internes partageant la meme IP publique.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a12', question: 'Quel standard Wi-Fi est aussi connu sous le nom Wi-Fi 6 ?', options: ['802.11n', '802.11ac', '802.11ax', '802.11be'], correct: 2, explanation: '802.11ax est Wi-Fi 6, offrant des debits jusqu\'a 9.6 Gbps, OFDMA et BSS Coloring.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a13', question: 'Quel protocole VPN cree un tunnel securise au niveau de la couche 3 ?', options: ['SSL', 'L2TP', 'IPsec', 'PPTP'], correct: 2, explanation: 'IPsec opere a la couche 3 (Reseau) et peut chiffrer et authentifier les paquets IP.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a14', question: 'Quelle version de SNMP introduit le chiffrement des donnees ?', options: ['SNMPv1', 'SNMPv2c', 'SNMPv3', 'Aucune'], correct: 2, explanation: 'SNMPv3 ajoute l\'authentification et le chiffrement (modeles USM et VACM) pour securiser la supervision.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a15', question: 'Lors du depannage reseau, quelle commande verifie la resolution DNS ?', options: ['ping', 'traceroute', 'nslookup', 'arp -a'], correct: 2, explanation: 'nslookup (ou dig) interroge un serveur DNS pour verifier la resolution de noms de domaine.', topic: 'P2' },
    // P3 - Python, Ansible, Cloud, SDN
    { type: 'qcm', id: 'mega_a16', question: 'Quel module Python est utilise pour envoyer des commandes SSH a un equipement reseau ?', options: ['requests', 'paramiko', 'flask', 'json'], correct: 1, explanation: 'Paramiko est une bibliotheque Python pour les connexions SSH, utilisee pour automatiser les equipements reseau.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a17', question: 'Ansible utilise quel format pour definir ses playbooks ?', options: ['JSON', 'XML', 'YAML', 'INI'], correct: 2, explanation: 'Les playbooks Ansible sont ecrits en YAML, un format lisible et structure.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a18', question: 'Dans le modele cloud, quel service fournit des machines virtuelles a la demande ?', options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'], correct: 2, explanation: 'IaaS (Infrastructure as a Service) fournit des VM, stockage et reseau a la demande (ex: AWS EC2, Azure VM).', topic: 'P3' },
    { type: 'qcm', id: 'mega_a19', question: 'Dans Kubernetes, un Pod contient :', options: ['Un seul conteneur obligatoirement', 'Un ou plusieurs conteneurs partageant le meme reseau', 'Un cluster complet', 'Un seul noeud worker'], correct: 1, explanation: 'Un Pod est l\'unite de deploiement minimale dans K8s, contenant un ou plusieurs conteneurs partageant le meme espace reseau et IP.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a20', question: 'Le protocole OpenFlow est associe a quelle technologie ?', options: ['MPLS', 'SD-WAN', 'SDN', 'QoS'], correct: 2, explanation: 'OpenFlow est le protocole de reference pour le SDN (Software-Defined Networking), permettant au controleur de programmer les flux sur les switches.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a21', question: 'HSRP (Hot Standby Router Protocol) assure :', options: ['Le load balancing WAN', 'La redondance de passerelle par defaut', 'Le routage inter-VLAN', 'La QoS sur les liens trunk'], correct: 1, explanation: 'HSRP fournit une passerelle virtuelle redondante avec un routeur actif et un standby qui prend le relais en cas de panne.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a22', question: 'Quelle solution de monitoring utilise le protocole SNMP et des graphiques RRD ?', options: ['Wireshark', 'Cacti', 'Nmap', 'Ansible'], correct: 1, explanation: 'Cacti collecte les donnees via SNMP et les stocke dans des bases RRDtool pour generer des graphiques de performance reseau.', topic: 'P3' },
    // P4 - QoS, IPv6, MPLS, BGP, Datacenter, SD-WAN
    { type: 'qcm', id: 'mega_a23', question: 'Quel champ de l\'en-tete IP est utilise pour marquer la priorite QoS (DiffServ) ?', options: ['TTL', 'DSCP', 'Protocol', 'Checksum'], correct: 1, explanation: 'Le champ DSCP (Differentiated Services Code Point) est un sous-champ du champ ToS utilise pour classer les paquets en QoS.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a24', question: 'Quel type d\'adresse IPv6 est utilise pour le multicast ?', options: ['fe80::/10', 'ff00::/8', '2000::/3', '::1/128'], correct: 1, explanation: 'Les adresses multicast IPv6 commencent par ff00::/8. fe80::/10 = link-local, 2000::/3 = global unicast.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a25', question: 'MPLS commute les paquets en se basant sur :', options: ['L\'adresse IP destination', 'L\'adresse MAC source', 'Un label insere entre L2 et L3', 'Le numero de VLAN'], correct: 2, explanation: 'MPLS insere un label de 32 bits entre les en-tetes L2 et L3 pour commuter les paquets sans analyser l\'en-tete IP.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a26', question: 'BGP utilise quel port TCP pour etablir ses sessions ?', options: ['Port 80', 'Port 179', 'Port 520', 'Port 443'], correct: 1, explanation: 'BGP (Border Gateway Protocol) utilise le port TCP 179 pour etablir des sessions entre voisins.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a27', question: 'Dans une architecture Spine-Leaf, chaque Leaf est connecte a :', options: ['Un seul Spine', 'Tous les Spines', 'Les autres Leafs', 'Un routeur de bordure uniquement'], correct: 1, explanation: 'Dans Spine-Leaf, chaque switch Leaf est connecte a TOUS les switches Spine, garantissant un nombre de sauts constant.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a28', question: 'SD-WAN remplace principalement quelle technologie WAN traditionnelle ?', options: ['Ethernet LAN', 'MPLS prive', 'Wi-Fi', 'Fibre optique'], correct: 1, explanation: 'SD-WAN utilise des liens Internet publics pour remplacer ou completer les liaisons MPLS privees couteuses.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a29', question: 'VXLAN (Virtual Extensible LAN) etend le nombre de segments reseau a :', options: ['4 096', '16 millions', '65 536', '1 024'], correct: 1, explanation: 'VXLAN utilise un VNI (VXLAN Network Identifier) de 24 bits, permettant ~16 millions de segments contre 4 096 pour les VLANs.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a30', question: 'Quel framework est utilise pour les tests d\'intrusion et l\'evaluation de vulnerabilites ?', options: ['Ansible', 'Metasploit', 'Docker', 'Terraform'], correct: 1, explanation: 'Metasploit est un framework de test d\'intrusion permettant de detecter et exploiter des vulnerabilites reseau.', topic: 'P4' },
    // P5 - Wireless
    { type: 'qcm', id: 'mega_a31', question: 'Quel standard Wi-Fi introduit OFDMA et BSS Coloring ?', options: ['802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6)', '802.11be (Wi-Fi 7)'], correct: 2, explanation: '802.11ax (Wi-Fi 6) introduit OFDMA pour un meilleur partage du spectre et BSS Coloring pour reduire les interferences.', topic: 'P5' },
    { type: 'qcm', id: 'mega_a32', question: 'Quel protocole de securite Wi-Fi utilise SAE (Simultaneous Authentication of Equals) ?', options: ['WEP', 'WPA', 'WPA2', 'WPA3'], correct: 3, explanation: 'WPA3 utilise SAE (base sur Dragonfly) qui remplace le PSK 4-way handshake de WPA2, offrant une meilleure protection contre les attaques par dictionnaire.', topic: 'P5' },
    // P6 - Automation & Programmabilite
    { type: 'qcm', id: 'mega_a33', question: 'Quelle methode HTTP est utilisee pour creer une nouvelle ressource via une API REST ?', options: ['GET', 'POST', 'DELETE', 'PATCH'], correct: 1, explanation: 'POST est la methode HTTP standard pour creer une nouvelle ressource dans une API RESTful.', topic: 'P6' },
    { type: 'qcm', id: 'mega_a34', question: 'Quel format de donnees est le plus couramment utilise par les API REST modernes ?', options: ['XML', 'JSON', 'YAML', 'CSV'], correct: 1, explanation: 'JSON (JavaScript Object Notation) est le format standard des API REST grace a sa legerete et sa facilite de parsing.', topic: 'P6' },
  ]
}

// === Section B : QCM multi-reponses (10 questions) ===

const sectionB: MegaSection = {
  id: 'B',
  title: 'QCM multi-reponses',
  type: 'multi',
  icon: 'CheckSquare',
  color: '#6366f1',
  exercises: [
    { type: 'multi', id: 'mega_b1', question: 'Quels protocoles fonctionnent a la couche Application du modele OSI ? (3 reponses)', options: ['HTTP', 'TCP', 'DNS', 'IP', 'FTP'], correct: [0, 2, 4], explanation: 'HTTP, DNS et FTP sont des protocoles de couche 7 (Application). TCP = couche 4, IP = couche 3.', topic: 'P1' },
    { type: 'multi', id: 'mega_b2', question: 'Quelles sont des adresses IP privees valides ? (3 reponses)', options: ['10.0.0.1', '172.16.5.1', '8.8.8.8', '192.168.1.1', '200.0.0.1'], correct: [0, 1, 3], explanation: 'Les plages privees RFC 1918 sont : 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.', topic: 'P1' },
    { type: 'multi', id: 'mega_b3', question: 'Quels elements sont presents dans un segment TCP ? (3 reponses)', options: ['Port source', 'Adresse MAC', 'Numero de sequence', 'TTL', 'Fenetre de reception'], correct: [0, 2, 4], explanation: 'Un segment TCP contient les ports, numeros de sequence/acquittement, fenetre, flags. MAC est en L2, TTL en L3.', topic: 'P2' },
    { type: 'multi', id: 'mega_b4', question: 'Quels types de NAT existent ? (3 reponses)', options: ['NAT statique', 'NAT elastique', 'NAT dynamique', 'PAT (overload)', 'NAT broadcast'], correct: [0, 2, 3], explanation: 'Les 3 types de NAT sont : statique (1:1), dynamique (pool d\'IPs) et PAT/overload (N:1 avec ports).', topic: 'P2' },
    { type: 'multi', id: 'mega_b5', question: 'Quels services cloud sont de type PaaS ? (2 reponses)', options: ['AWS EC2', 'Heroku', 'Google App Engine', 'Azure Virtual Machines'], correct: [1, 2], explanation: 'Heroku et Google App Engine sont des PaaS. EC2 et Azure VM sont des IaaS.', topic: 'P3' },
    { type: 'multi', id: 'mega_b6', question: 'Quels outils sont utilises pour l\'automatisation reseau ? (3 reponses)', options: ['Ansible', 'Photoshop', 'Python', 'Terraform', 'Excel'], correct: [0, 2, 3], explanation: 'Ansible, Python et Terraform sont des outils d\'automatisation et d\'IaC pour les reseaux.', topic: 'P3' },
    { type: 'multi', id: 'mega_b7', question: 'Quels mecanismes QoS permettent de gerer la congestion ? (2 reponses)', options: ['WRED', 'ARP', 'Queue scheduling', 'DHCP'], correct: [0, 2], explanation: 'WRED (Weighted Random Early Detection) et le scheduling des files d\'attente gerent la congestion. ARP et DHCP n\'y sont pas lies.', topic: 'P4' },
    { type: 'multi', id: 'mega_b8', question: 'Quels protocoles de routage sont de type link-state ? (2 reponses)', options: ['RIP', 'OSPF', 'IS-IS', 'EIGRP'], correct: [1, 2], explanation: 'OSPF et IS-IS sont des protocoles a etat de lien. RIP est distance-vector, EIGRP est hybride.', topic: 'P2' },
    { type: 'multi', id: 'mega_b9', question: 'Quels sont des types d\'attaques reseau courants ? (3 reponses)', options: ['Man-in-the-Middle', 'Defragmentation', 'DDoS', 'ARP Spoofing', 'Subnetting'], correct: [0, 2, 3], explanation: 'MITM, DDoS et ARP Spoofing sont des attaques reseau. La defragmentation et le subnetting sont des mecanismes normaux.', topic: 'P4' },
    { type: 'multi', id: 'mega_b10', question: 'Quels sont les etats STP d\'un port ? (3 reponses)', options: ['Blocking', 'Learning', 'Routing', 'Forwarding', 'Switching'], correct: [0, 1, 3], explanation: 'Les etats STP sont : Blocking, Listening, Learning, Forwarding, Disabled. Routing et Switching ne sont pas des etats STP.', topic: 'P1' },
    // P5 - Wireless
    { type: 'multi', id: 'mega_b11', question: 'Quels sont des modes de deploiement d\'un point d\'acces (AP) Cisco ? (3 reponses)', options: ['Local mode', 'FlexConnect mode', 'Monitor mode', 'Routing mode', 'NAT mode'], correct: [0, 1, 2], explanation: 'Les AP Cisco supportent les modes Local (tunnel vers WLC), FlexConnect (commutation locale), Monitor (detection d\'intrusion). Routing et NAT ne sont pas des modes AP.', topic: 'P5' },
    { type: 'multi', id: 'mega_b12', question: 'Quelles bandes de frequences sont utilisees par le Wi-Fi 6 (802.11ax) ? (2 reponses)', options: ['900 MHz', '2.4 GHz', '5 GHz', '60 GHz'], correct: [1, 2], explanation: 'Wi-Fi 6 (802.11ax) fonctionne sur 2.4 GHz et 5 GHz. Wi-Fi 6E ajoute le 6 GHz. 60 GHz est utilise par 802.11ad.', topic: 'P5' },
    // P6 - Automation
    { type: 'multi', id: 'mega_b13', question: 'Quels outils sont des systemes de gestion de configuration ? (3 reponses)', options: ['Ansible', 'Puppet', 'Chef', 'Wireshark', 'Nmap'], correct: [0, 1, 2], explanation: 'Ansible, Puppet et Chef sont des outils de gestion de configuration (IaC). Wireshark capture des paquets, Nmap scanne les ports.', topic: 'P6' },
    { type: 'multi', id: 'mega_b14', question: 'Quels elements font partie de l\'architecture SDN ? (3 reponses)', options: ['Application plane', 'Control plane', 'Data plane', 'Physical plane', 'Session plane'], correct: [0, 1, 2], explanation: 'L\'architecture SDN comporte 3 couches : Application plane (apps), Control plane (controleur), Data plane (switches/forwarding).', topic: 'P6' },
  ]
}

// === Section C : Vrai / Faux (15 questions) ===

const sectionC: MegaSection = {
  id: 'C',
  title: 'Vrai / Faux',
  type: 'truefalse',
  icon: 'ToggleLeft',
  color: '#10b981',
  exercises: [
    { type: 'truefalse', id: 'mega_c1', statement: 'Un switch de couche 2 peut router des paquets entre VLANs sans configuration supplementaire.', correct: false, explanation: 'Faux. Un switch L2 ne route pas. Il faut un switch L3 ou un routeur pour le routage inter-VLAN.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c2', statement: 'L\'adresse de broadcast d\'un reseau 10.0.0.0/8 est 10.255.255.255.', correct: true, explanation: 'Vrai. Avec un masque /8, les 24 bits hotes sont tous a 1, donnant 10.255.255.255.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c3', statement: 'TCP utilise un three-way handshake (SYN, SYN-ACK, ACK) pour etablir une connexion.', correct: true, explanation: 'Vrai. L\'etablissement TCP se fait en 3 etapes : SYN du client, SYN-ACK du serveur, ACK du client.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c4', statement: 'UDP est plus rapide que TCP car il ne garantit pas la livraison des donnees.', correct: true, explanation: 'Vrai. UDP n\'utilise pas d\'acquittements ni de retransmissions, ce qui le rend plus rapide mais non fiable.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c5', statement: 'Un masque /30 permet d\'adresser 4 hotes.', correct: false, explanation: 'Faux. /30 donne 4 adresses, mais seulement 2 sont utilisables (1 reseau + 1 broadcast = 2 retirees).', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c6', statement: 'OSPF utilise le cout (bandwidth) comme metrique principale.', correct: true, explanation: 'Vrai. OSPF calcule le cout en fonction de la bande passante de reference divisee par la bande passante du lien.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c7', statement: 'Une ACL etendue doit etre placee au plus pres de la source du trafic.', correct: true, explanation: 'Vrai. Les ACL etendues sont placees pres de la source pour bloquer le trafic le plus tot possible et economiser la bande passante.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c8', statement: 'Ansible necessite l\'installation d\'un agent sur les equipements geres.', correct: false, explanation: 'Faux. Ansible est agentless : il se connecte via SSH (ou NETCONF) sans agent installe sur la cible.', topic: 'P3' },
    { type: 'truefalse', id: 'mega_c9', statement: 'Dans Kubernetes, un Service de type ClusterIP est accessible depuis l\'exterieur du cluster.', correct: false, explanation: 'Faux. ClusterIP n\'est accessible qu\'en interne. Pour l\'externe, il faut NodePort, LoadBalancer ou Ingress.', topic: 'P3' },
    { type: 'truefalse', id: 'mega_c10', statement: 'Le protocole BGP est le protocole de routage utilise entre les systemes autonomes sur Internet.', correct: true, explanation: 'Vrai. BGP (Border Gateway Protocol) est le protocole de routage inter-AS, fondamental pour Internet.', topic: 'P4' },
    { type: 'truefalse', id: 'mega_c11', statement: 'MPLS fonctionne exclusivement avec le protocole IPv4.', correct: false, explanation: 'Faux. MPLS est independant du protocole — il peut transporter IPv4, IPv6, Ethernet et d\'autres protocoles.', topic: 'P4' },
    { type: 'truefalse', id: 'mega_c12', statement: 'Le DHCP utilise le port UDP 67 (serveur) et 68 (client).', correct: true, explanation: 'Vrai. DHCP serveur ecoute sur UDP 67, le client sur UDP 68.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c13', statement: 'SD-WAN centralise la gestion du reseau WAN via un controleur logiciel.', correct: true, explanation: 'Vrai. SD-WAN utilise un controleur central pour gerer les politiques de routage, QoS et securite sur l\'ensemble du WAN.', topic: 'P4' },
    { type: 'truefalse', id: 'mega_c14', statement: 'Un port en mode access sur un switch transporte le trafic de plusieurs VLANs.', correct: false, explanation: 'Faux. Un port access n\'appartient qu\'a un seul VLAN. Seul un port trunk transporte plusieurs VLANs.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c15', statement: 'EtherChannel permet d\'aggreger plusieurs liens physiques en un seul lien logique.', correct: true, explanation: 'Vrai. EtherChannel combine 2 a 8 liens physiques en un seul lien logique pour augmenter la bande passante et la redondance.', topic: 'P1' },
    // P5 - Wireless
    { type: 'truefalse', id: 'mega_c16', statement: 'Le protocole CAPWAP est utilise pour la communication entre un point d\'acces (AP) et un WLC.', correct: true, explanation: 'Vrai. CAPWAP (Control And Provisioning of Wireless Access Points) est le protocole standard entre les AP et le controleur WLC.', topic: 'P5' },
    { type: 'truefalse', id: 'mega_c17', statement: 'Un SSID cache empeche completement la detection du reseau Wi-Fi.', correct: false, explanation: 'Faux. Un SSID cache n\'est pas diffuse dans les beacons, mais il peut etre detecte par des outils de sniffing lors des probe requests/responses.', topic: 'P5' },
    // P6 - Automation
    { type: 'truefalse', id: 'mega_c18', statement: 'Ansible utilise un modele push pour appliquer les configurations.', correct: true, explanation: 'Vrai. Ansible pousse (push) les configurations vers les equipements via SSH, contrairement a Puppet/Chef qui utilisent un modele pull.', topic: 'P6' },
    { type: 'truefalse', id: 'mega_c19', statement: 'Dans l\'architecture SDN, le controleur fait partie du data plane.', correct: false, explanation: 'Faux. Le controleur SDN fait partie du control plane. Le data plane est constitue des switches qui acheminent le trafic.', topic: 'P6' },
  ]
}

// === Section D : Reponse courte (15 questions) ===

const sectionD: MegaSection = {
  id: 'D',
  title: 'Reponse courte',
  type: 'short',
  icon: 'PenLine',
  color: '#f59e0b',
  exercises: [
    { type: 'short', id: 'mega_d1', question: 'Quel est le numero de port par defaut de HTTP ?', acceptedAnswers: ['80'], hint: 'Un nombre entre 1 et 1024', explanation: 'HTTP utilise le port TCP 80 par defaut.', topic: 'P1' },
    { type: 'short', id: 'mega_d2', question: 'Quel est le masque en notation CIDR pour 255.255.255.0 ?', acceptedAnswers: ['/24', '24'], hint: 'Notation /xx', explanation: '255.255.255.0 = 24 bits a 1 = /24.', topic: 'P1' },
    { type: 'short', id: 'mega_d3', question: 'Quel protocole resout une adresse IP en adresse MAC ?', acceptedAnswers: ['arp', 'ARP'], hint: '3 lettres', explanation: 'ARP (Address Resolution Protocol) mappe les adresses IP vers les adresses MAC.', topic: 'P1' },
    { type: 'short', id: 'mega_d4', question: 'Quel port TCP est utilise par HTTPS ?', acceptedAnswers: ['443'], hint: 'Un port bien connu', explanation: 'HTTPS utilise le port TCP 443 avec TLS/SSL.', topic: 'P1' },
    { type: 'short', id: 'mega_d5', question: 'Quelle commande Cisco entre en mode de configuration globale ?', acceptedAnswers: ['configure terminal', 'conf t', 'conf term'], hint: 'Commande en 2 mots', explanation: 'La commande "configure terminal" (ou abrevia "conf t") entre en mode de configuration globale.', topic: 'P1' },
    { type: 'short', id: 'mega_d6', question: 'Quel numero de port UDP utilise DHCP cote serveur ?', acceptedAnswers: ['67'], hint: 'Un nombre < 100', explanation: 'Le serveur DHCP ecoute sur le port UDP 67.', topic: 'P1' },
    { type: 'short', id: 'mega_d7', question: 'Quel protocole de routage utilise la metrique "hop count" avec un maximum de 15 ?', acceptedAnswers: ['rip', 'RIP'], hint: '3 lettres', explanation: 'RIP (Routing Information Protocol) utilise le nombre de sauts (max 15, 16 = infini).', topic: 'P2' },
    { type: 'short', id: 'mega_d8', question: 'Quel port TCP utilise SSH ?', acceptedAnswers: ['22'], hint: 'Un port < 100', explanation: 'SSH utilise le port TCP 22 pour les connexions securisees.', topic: 'P2' },
    { type: 'short', id: 'mega_d9', question: 'Quel est l\'identifiant de VLAN par defaut sur un switch Cisco ?', acceptedAnswers: ['1', 'vlan 1', 'VLAN 1'], hint: 'Un chiffre', explanation: 'Le VLAN 1 est le VLAN par defaut (natif) sur les switches Cisco.', topic: 'P1' },
    { type: 'short', id: 'mega_d10', question: 'Quel protocole automatise la configuration reseau en fournissant IP, masque, passerelle et DNS ?', acceptedAnswers: ['dhcp', 'DHCP'], hint: '4 lettres', explanation: 'DHCP (Dynamic Host Configuration Protocol) attribue automatiquement les parametres reseau.', topic: 'P1' },
    { type: 'short', id: 'mega_d11', question: 'Combien d\'adresses hotes utilisables contient un reseau /28 ?', acceptedAnswers: ['14'], hint: '2^n - 2', explanation: '/28 = 4 bits hotes = 16 adresses, moins reseau et broadcast = 14 hotes.', topic: 'P1' },
    { type: 'short', id: 'mega_d12', question: 'Quel est le numero d\'AS reserve pour les reseaux prives dans BGP ?', acceptedAnswers: ['64512', '64512-65534', '65535'], hint: 'Un nombre > 64000', explanation: 'Les AS prives vont de 64512 a 65534 (16 bits). 64512 est le premier.', topic: 'P4' },
    { type: 'short', id: 'mega_d13', question: 'Quel port TCP utilise FTP pour le canal de controle ?', acceptedAnswers: ['21'], hint: 'Un port < 25', explanation: 'FTP utilise le port TCP 21 pour le controle et le port 20 pour le transfert de donnees.', topic: 'P1' },
    { type: 'short', id: 'mega_d14', question: 'Quelle commande Cisco affiche les interfaces et leur statut ?', acceptedAnswers: ['show ip interface brief', 'sh ip int brief', 'sh ip int br'], hint: 'Commence par show', explanation: 'La commande "show ip interface brief" affiche un resume de toutes les interfaces et leur statut up/down.', topic: 'P1' },
    { type: 'short', id: 'mega_d15', question: 'Quel type de cable est utilise pour connecter deux equipements identiques (switch-switch) ?', acceptedAnswers: ['croise', 'crossover', 'cable croise'], hint: 'Un type de cable Ethernet', explanation: 'Un cable croise (crossover) est necessaire pour connecter deux equipements similaires (bien que l\'auto-MDIX le rende souvent inutile).', topic: 'P1' },
    // P5 - Wireless
    { type: 'short', id: 'mega_d16', question: 'Quel protocole est utilise pour le tunnel de donnees entre un AP lightweight et un WLC ?', acceptedAnswers: ['capwap', 'CAPWAP'], hint: '6 lettres', explanation: 'CAPWAP (Control And Provisioning of Wireless Access Points) cree un tunnel entre l\'AP et le WLC pour le controle et les donnees.', topic: 'P5' },
    // P6 - Automation
    { type: 'short', id: 'mega_d17', question: 'Quel format de donnees utilise des paires cle-valeur avec des accolades {} ?', acceptedAnswers: ['json', 'JSON'], hint: '4 lettres', explanation: 'JSON (JavaScript Object Notation) utilise des paires cle-valeur encadrees par des accolades.', topic: 'P6' },
  ]
}

// === Section E : Association / Matching (10 questions) ===

const sectionE: MegaSection = {
  id: 'E',
  title: 'Association',
  type: 'matching',
  icon: 'Link2',
  color: '#8b5cf6',
  exercises: [
    { type: 'matching', id: 'mega_e1', instruction: 'Associez chaque protocole a son port par defaut.', pairs: [
      { left: 'HTTP', right: '80' },
      { left: 'HTTPS', right: '443' },
      { left: 'SSH', right: '22' },
      { left: 'DNS', right: '53' },
    ], explanation: 'HTTP=80, HTTPS=443, SSH=22, DNS=53 sont les ports standards a connaitre.', topic: 'P1' },
    { type: 'matching', id: 'mega_e2', instruction: 'Associez chaque couche OSI a son PDU (unite de donnees).', pairs: [
      { left: 'Couche 4 - Transport', right: 'Segment' },
      { left: 'Couche 3 - Reseau', right: 'Paquet' },
      { left: 'Couche 2 - Liaison', right: 'Trame' },
      { left: 'Couche 1 - Physique', right: 'Bit' },
    ], explanation: 'Transport=Segment, Reseau=Paquet, Liaison=Trame, Physique=Bit.', topic: 'P1' },
    { type: 'matching', id: 'mega_e3', instruction: 'Associez chaque protocole de routage a son type.', pairs: [
      { left: 'RIP', right: 'Distance-vector' },
      { left: 'OSPF', right: 'Link-state' },
      { left: 'EIGRP', right: 'Hybride' },
      { left: 'BGP', right: 'Path-vector' },
    ], explanation: 'RIP=distance-vector, OSPF=link-state, EIGRP=hybride (advanced distance-vector), BGP=path-vector.', topic: 'P2' },
    { type: 'matching', id: 'mega_e4', instruction: 'Associez chaque service cloud a son modele.', pairs: [
      { left: 'AWS EC2', right: 'IaaS' },
      { left: 'Google App Engine', right: 'PaaS' },
      { left: 'Gmail', right: 'SaaS' },
      { left: 'AWS Lambda', right: 'FaaS' },
    ], explanation: 'EC2=IaaS (VM), App Engine=PaaS (plateforme), Gmail=SaaS (logiciel), Lambda=FaaS (fonctions).', topic: 'P3' },
    { type: 'matching', id: 'mega_e5', instruction: 'Associez chaque technologie WAN a sa description.', pairs: [
      { left: 'MPLS', right: 'Commutation par labels' },
      { left: 'SD-WAN', right: 'Pilotage logiciel du WAN' },
      { left: 'VPN IPsec', right: 'Tunnel chiffre couche 3' },
      { left: 'Metro Ethernet', right: 'Extension Ethernet metropolitaine' },
    ], explanation: 'MPLS=labels, SD-WAN=controleur logiciel, IPsec=tunnel L3, Metro Ethernet=extension MAN.', topic: 'P4' },
    { type: 'matching', id: 'mega_e6', instruction: 'Associez chaque commande Cisco a sa fonction.', pairs: [
      { left: 'show running-config', right: 'Afficher la config active' },
      { left: 'show ip route', right: 'Afficher la table de routage' },
      { left: 'show vlan brief', right: 'Lister les VLANs' },
      { left: 'show interfaces', right: 'Details des interfaces' },
    ], explanation: 'running-config=config active, ip route=routes, vlan brief=VLANs, interfaces=details ports.', topic: 'P1' },
    { type: 'matching', id: 'mega_e7', instruction: 'Associez chaque attaque reseau a sa description.', pairs: [
      { left: 'ARP Spoofing', right: 'Falsification de tables ARP' },
      { left: 'DDoS', right: 'Saturation par trafic massif' },
      { left: 'Man-in-the-Middle', right: 'Interception de communications' },
      { left: 'Phishing', right: 'Hameconnage par faux site' },
    ], explanation: 'ARP Spoofing=fausses reponses ARP, DDoS=inondation, MITM=interception, Phishing=faux site.', topic: 'P4' },
    { type: 'matching', id: 'mega_e8', instruction: 'Associez chaque mecanisme QoS a son role.', pairs: [
      { left: 'Classification', right: 'Identifier le type de trafic' },
      { left: 'Marking (DSCP)', right: 'Marquer la priorite du paquet' },
      { left: 'Queuing', right: 'Ordonnancer les files d\'attente' },
      { left: 'Policing', right: 'Limiter le debit d\'entree' },
    ], explanation: 'La QoS suit le flux : classifier -> marquer -> mettre en file -> controler le debit.', topic: 'P4' },
    { type: 'matching', id: 'mega_e9', instruction: 'Associez chaque outil de supervision a sa fonction principale.', pairs: [
      { left: 'Wireshark', right: 'Capture de paquets' },
      { left: 'Nagios', right: 'Alertes et monitoring' },
      { left: 'Nmap', right: 'Scan de ports' },
      { left: 'Syslog', right: 'Centralisation des logs' },
    ], explanation: 'Wireshark=capture, Nagios=monitoring/alertes, Nmap=scan, Syslog=logs centralises.', topic: 'P3' },
    { type: 'matching', id: 'mega_e10', instruction: 'Associez chaque type d\'adresse IPv6 a sa plage.', pairs: [
      { left: 'Link-local', right: 'fe80::/10' },
      { left: 'Global Unicast', right: '2000::/3' },
      { left: 'Multicast', right: 'ff00::/8' },
      { left: 'Loopback', right: '::1/128' },
    ], explanation: 'Link-local=fe80::/10, GUA=2000::/3, Multicast=ff00::/8, Loopback=::1/128.', topic: 'P4' },
    // P5 - Wireless
    { type: 'matching', id: 'mega_e11', instruction: 'Associez chaque standard Wi-Fi a sa designation commerciale.', pairs: [
      { left: '802.11n', right: 'Wi-Fi 4' },
      { left: '802.11ac', right: 'Wi-Fi 5' },
      { left: '802.11ax', right: 'Wi-Fi 6' },
      { left: '802.11be', right: 'Wi-Fi 7' },
    ], explanation: '802.11n=Wi-Fi 4, 802.11ac=Wi-Fi 5, 802.11ax=Wi-Fi 6, 802.11be=Wi-Fi 7.', topic: 'P5' },
    // P6 - Automation
    { type: 'matching', id: 'mega_e12', instruction: 'Associez chaque outil d\'automatisation a son langage/format de configuration.', pairs: [
      { left: 'Ansible', right: 'YAML' },
      { left: 'Puppet', right: 'Puppet DSL' },
      { left: 'Chef', right: 'Ruby' },
      { left: 'Terraform', right: 'HCL' },
    ], explanation: 'Ansible=YAML (playbooks), Puppet=Puppet DSL (manifests), Chef=Ruby (recipes), Terraform=HCL (HashiCorp Configuration Language).', topic: 'P6' },
  ]
}

// === Section F : Ordonnancement (8 questions) ===

const sectionF: MegaSection = {
  id: 'F',
  title: 'Ordonnancement',
  type: 'ordering',
  icon: 'ArrowUpDown',
  color: '#ec4899',
  exercises: [
    { type: 'ordering', id: 'mega_f1', instruction: 'Remettez dans l\'ordre les couches du modele OSI (de la 7 a la 1).', items: ['Application', 'Presentation', 'Session', 'Transport', 'Reseau', 'Liaison de donnees', 'Physique'], explanation: 'Le modele OSI de haut en bas : Application (7) > Presentation (6) > Session (5) > Transport (4) > Reseau (3) > Liaison (2) > Physique (1).', topic: 'P1' },
    { type: 'ordering', id: 'mega_f2', instruction: 'Remettez dans l\'ordre les etapes d\'encapsulation des donnees.', items: ['Donnees utilisateur', 'Ajout en-tete couche Transport (segment)', 'Ajout en-tete couche Reseau (paquet)', 'Ajout en-tete + trailer couche Liaison (trame)', 'Conversion en bits sur le media physique'], explanation: 'Encapsulation : Donnees -> Segment (L4) -> Paquet (L3) -> Trame (L2) -> Bits (L1).', topic: 'P1' },
    { type: 'ordering', id: 'mega_f3', instruction: 'Remettez dans l\'ordre les etapes du three-way handshake TCP.', items: ['Client envoie SYN', 'Serveur repond SYN-ACK', 'Client envoie ACK'], explanation: 'Le three-way handshake : 1) SYN (client), 2) SYN-ACK (serveur), 3) ACK (client). La connexion est alors etablie.', topic: 'P2' },
    { type: 'ordering', id: 'mega_f4', instruction: 'Remettez dans l\'ordre les etapes DHCP (DORA).', items: ['DHCP Discover (client broadcast)', 'DHCP Offer (serveur propose une IP)', 'DHCP Request (client accepte l\'offre)', 'DHCP Acknowledgment (serveur confirme)'], explanation: 'Le processus DHCP DORA : Discover -> Offer -> Request -> Acknowledgment.', topic: 'P1' },
    { type: 'ordering', id: 'mega_f5', instruction: 'Remettez dans l\'ordre le processus de boot d\'un routeur Cisco.', items: ['POST (Power-On Self Test)', 'Chargement du bootstrap', 'Localisation et chargement de l\'IOS', 'Chargement du fichier de configuration'], explanation: 'Boot : POST (test materiel) -> Bootstrap -> IOS (depuis Flash/TFTP) -> Config (NVRAM/TFTP).', topic: 'P1' },
    { type: 'ordering', id: 'mega_f6', instruction: 'Remettez dans l\'ordre de priorite les types de routes (administrative distance croissante).', items: ['Connectee (0)', 'Statique (1)', 'EIGRP (90)', 'OSPF (110)', 'RIP (120)'], explanation: 'Distance administrative : Connectee=0, Statique=1, EIGRP=90, OSPF=110, RIP=120. Plus la valeur est basse, plus la route est preferee.', topic: 'P2' },
    { type: 'ordering', id: 'mega_f7', instruction: 'Remettez dans l\'ordre les etapes de deploiement avec Ansible.', items: ['Definir l\'inventaire des hotes', 'Ecrire le playbook YAML', 'Executer le playbook (ansible-playbook)', 'Verifier le resultat sur les equipements'], explanation: 'Ansible : inventaire -> playbook -> execution -> verification. Pas d\'agent a installer.', topic: 'P3' },
    { type: 'ordering', id: 'mega_f8', instruction: 'Remettez dans l\'ordre les etapes du processus de resolution DNS.', items: ['Le client interroge le resolveur local', 'Le resolveur contacte le serveur racine', 'Le serveur racine redirige vers le TLD (.com, .fr)', 'Le TLD redirige vers le serveur autoritaire', 'Le serveur autoritaire renvoie l\'adresse IP'], explanation: 'DNS : Client -> Resolveur -> Racine -> TLD -> Autoritaire -> IP retournee.', topic: 'P1' },
    // P5 - Wireless
    { type: 'ordering', id: 'mega_f9', instruction: 'Remettez dans l\'ordre les etapes de connexion d\'un client Wi-Fi a un reseau WPA2-Enterprise.', items: ['Le client decouvre le SSID (beacon/probe)', 'Authentification open system (802.11)', 'Association au point d\'acces', 'Authentification 802.1X (EAP) via le serveur RADIUS', 'Derivation des cles et 4-way handshake'], explanation: 'Connexion WPA2-Enterprise : Decouverte -> Auth open -> Association -> 802.1X/EAP (RADIUS) -> 4-way handshake.', topic: 'P5' },
    // P6 - Automation
    { type: 'ordering', id: 'mega_f10', instruction: 'Remettez dans l\'ordre les etapes d\'un appel API REST pour modifier une configuration reseau.', items: ['Authentification (token API ou credentials)', 'Construction de la requete HTTP (methode, URL, body JSON)', 'Envoi de la requete au controleur/equipement', 'Reception de la reponse (code HTTP + body)', 'Verification du resultat (status 200/201)'], explanation: 'API REST : Auth -> Construction requete -> Envoi -> Reception reponse -> Verification du status code.', topic: 'P6' },
  ]
}

// === Section G : Analyse de config (8 questions) ===

const sectionG: MegaSection = {
  id: 'G',
  title: 'Analyse de config',
  type: 'config',
  icon: 'FileCode',
  color: '#14b8a6',
  exercises: [
    { type: 'config', id: 'mega_g1', configSnippet: `interface GigabitEthernet0/1
 ip address 192.168.10.1 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/2
 ip address 10.0.0.1 255.255.255.252
 no shutdown`, question: 'Combien d\'hotes utilisables le sous-reseau sur GigabitEthernet0/2 peut-il contenir ?', options: ['1', '2', '4', '6'], correct: 1, explanation: 'Le masque 255.255.255.252 = /30, soit 4 adresses dont 2 utilisables (1 reseau + 1 broadcast retirees). Ideal pour les liens point-a-point.', topic: 'P1' },
    { type: 'config', id: 'mega_g2', configSnippet: `access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 80
access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 443
access-list 100 deny ip any any`, question: 'Quel trafic cette ACL autorise-t-elle ?', options: ['Tout le trafic du reseau 192.168.1.0', 'Uniquement HTTP et HTTPS depuis 192.168.1.0/24', 'Tout le trafic web vers 192.168.1.0', 'Uniquement le trafic ICMP'], correct: 1, explanation: 'L\'ACL 100 autorise TCP port 80 (HTTP) et 443 (HTTPS) depuis 192.168.1.0/24 vers toute destination, et bloque tout le reste.', topic: 'P2' },
    { type: 'config', id: 'mega_g3', configSnippet: `vlan 10
 name VENTES
vlan 20
 name COMPTA
vlan 30
 name DIRECTION
!
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 10
!
interface FastEthernet0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30`, question: 'L\'interface FastEthernet0/1 transporte le trafic de quels VLANs ?', options: ['VLANs 10, 20 et 30', 'VLAN 10 uniquement', 'Tous les VLANs', 'VLAN 1 (par defaut)'], correct: 1, explanation: 'Fa0/1 est en mode access sur le VLAN 10. Elle ne transporte que le trafic du VLAN 10 (VENTES).', topic: 'P1' },
    { type: 'config', id: 'mega_g4', configSnippet: `ip nat inside source list 1 interface GigabitEthernet0/0 overload
!
access-list 1 permit 192.168.1.0 0.0.0.255
!
interface GigabitEthernet0/0
 ip address 203.0.113.1 255.255.255.0
 ip nat outside
!
interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.0
 ip nat inside`, question: 'Quel type de NAT est configure ici ?', options: ['NAT statique', 'NAT dynamique avec pool', 'PAT (overload)', 'NAT 1:1 bidirectionnel'], correct: 2, explanation: 'Le mot-cle "overload" indique du PAT (Port Address Translation) : tous les hotes du reseau 192.168.1.0/24 partagent l\'IP publique 203.0.113.1.', topic: 'P2' },
    { type: 'config', id: 'mega_g5', configSnippet: `router ospf 1
 network 10.0.0.0 0.0.0.255 area 0
 network 172.16.0.0 0.0.255.255 area 1
 default-information originate`, question: 'Que fait la commande "default-information originate" ?', options: ['Elle desactive OSPF', 'Elle redistribue la route par defaut dans OSPF', 'Elle change l\'aire backbone', 'Elle definit le router-id'], correct: 1, explanation: '"default-information originate" injecte la route par defaut (0.0.0.0/0) dans les mises a jour OSPF pour que les voisins l\'apprennent.', topic: 'P2' },
    { type: 'config', id: 'mega_g6', configSnippet: `spanning-tree mode rapid-pvst
spanning-tree vlan 10 priority 4096
spanning-tree vlan 20 priority 4096
!
interface GigabitEthernet0/1
 switchport mode trunk
 spanning-tree guard root`, question: 'Quel role aura ce switch pour les VLANs 10 et 20 ?', options: ['Designated Bridge', 'Root Bridge', 'Blocked port', 'Non-Root Bridge'], correct: 1, explanation: 'La priorite 4096 est tres basse (defaut=32768), ce switch deviendra Root Bridge pour les VLANs 10 et 20.', topic: 'P1' },
    { type: 'config', id: 'mega_g7', configSnippet: `ip dhcp pool LAN_POOL
 network 192.168.50.0 255.255.255.0
 default-router 192.168.50.1
 dns-server 8.8.8.8 8.8.4.4
 lease 7
!
ip dhcp excluded-address 192.168.50.1 192.168.50.10`, question: 'Quelle plage d\'adresses sera distribuee par DHCP ?', options: ['192.168.50.1 a 192.168.50.254', '192.168.50.11 a 192.168.50.254', '192.168.50.1 a 192.168.50.10', '192.168.50.0 a 192.168.50.255'], correct: 1, explanation: 'Le pool couvre 192.168.50.0/24 mais les adresses .1 a .10 sont exclues. DHCP distribuera de .11 a .254 (la .0 et .255 sont reseau/broadcast).', topic: 'P1' },
    { type: 'config', id: 'mega_g8', configSnippet: `interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
!
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
!
interface GigabitEthernet0/0.30
 encapsulation dot1Q 30
 ip address 192.168.30.1 255.255.255.0`, question: 'Quelle technique est mise en oeuvre ici ?', options: ['EtherChannel', 'Routage inter-VLAN (Router-on-a-Stick)', 'Port mirroring', 'HSRP'], correct: 1, explanation: 'Les sous-interfaces avec encapsulation dot1Q sur une seule interface physique = Router-on-a-Stick, technique classique de routage inter-VLAN.', topic: 'P1' },
    // P5 - Wireless
    { type: 'config', id: 'mega_g9', configSnippet: `wlan CORPORATE 1 CORPORATE
 client vlan 100
 no shutdown
 security wpa wpa2
 security wpa wpa2 ciphers aes
 security dot1x authentication-list ISE_AUTH
!
wlan GUEST 2 GUEST
 client vlan 200
 no shutdown
 security wpa wpa2
 security wpa wpa2 ciphers aes
 security web-auth`, question: 'Quel type de securite est utilise pour le WLAN GUEST ?', options: ['WPA2-Enterprise (802.1X)', 'WPA2-Personal (PSK)', 'Web Authentication (portail captif)', 'Open (pas de securite)'], correct: 2, explanation: 'Le WLAN GUEST utilise "security web-auth" qui correspond a un portail captif (Web Authentication). Le WLAN CORPORATE utilise 802.1X (dot1x).', topic: 'P5' },
    // P6 - Automation
    { type: 'config', id: 'mega_g10', configSnippet: `---
- name: Configure VLAN on switches
  hosts: switches
  gather_facts: no
  tasks:
    - name: Create VLAN 100
      ios_vlan:
        vlan_id: 100
        name: SERVERS
        state: present
    - name: Assign interface to VLAN
      ios_config:
        lines:
          - switchport mode access
          - switchport access vlan 100
        parents: interface GigabitEthernet0/1`, question: 'Quel outil d\'automatisation utilise ce fichier de configuration ?', options: ['Terraform', 'Puppet', 'Ansible', 'Chef'], correct: 2, explanation: 'La syntaxe YAML avec "hosts", "tasks" et les modules "ios_vlan"/"ios_config" est caracteristique d\'un playbook Ansible.', topic: 'P6' },
  ]
}

// === Section H : Scenarios pratiques (4 scenarios, ~16 sous-questions) ===

const sectionH: MegaSection = {
  id: 'H',
  title: 'Scenarios pratiques',
  type: 'scenario',
  icon: 'Network',
  color: '#e11d48',
  exercises: [
    {
      type: 'scenario', id: 'mega_h1',
      scenario: 'Une entreprise dispose de 3 departements (Ventes, Compta, IT) connectes a un switch central. Chaque departement doit etre isole dans son propre VLAN. Un routeur assure la communication inter-VLAN via une seule interface physique.',
      diagram: `
  [PC Ventes]──── Fa0/1 ┐
  [PC Compta]──── Fa0/5 ├── [Switch] ── Trunk Gi0/24 ── [Routeur Gi0/0]
  [PC IT]──────── Fa0/10┘                                   │.10 │.20 │.30
                                                      VLAN10 VLAN20 VLAN30`,
      subQuestions: [
        { question: 'Quel mode de port doit etre configure sur Fa0/1, Fa0/5 et Fa0/10 ?', options: ['Mode trunk', 'Mode access', 'Mode dynamic auto', 'Mode routed'], correct: 1, explanation: 'Les ports connectes aux PCs doivent etre en mode access, chacun assigne a son VLAN respectif.' },
        { question: 'Quel type de lien est necessaire entre le switch et le routeur ?', options: ['Access', 'Trunk', 'EtherChannel', 'PortChannel'], correct: 1, explanation: 'Un lien trunk est necessaire pour transporter les trames des 3 VLANs entre le switch et le routeur.' },
        { question: 'Comment s\'appelle cette architecture de routage inter-VLAN ?', options: ['Router-on-a-Stick', 'L3 Switch', 'Dual-homed router', 'Floating static route'], correct: 0, explanation: 'Router-on-a-Stick utilise une seule interface physique avec des sous-interfaces (une par VLAN).' },
        { question: 'Si le PC Ventes (VLAN 10) veut communiquer avec le PC Compta (VLAN 20), par ou passe le trafic ?', options: ['Directement via le switch', 'Via le routeur (inter-VLAN routing)', 'Via Internet', 'C\'est impossible'], correct: 1, explanation: 'Le trafic inter-VLAN doit passer par le routeur, car les VLANs sont des domaines de broadcast isoles.' },
      ],
      topic: 'P1'
    },
    {
      type: 'scenario', id: 'mega_h2',
      scenario: 'Un administrateur reseau doit configurer OSPF sur 3 routeurs. R1 et R2 sont dans l\'Area 0 (backbone), R2 et R3 sont dans l\'Area 1. R1 est le point de sortie vers Internet avec une route par defaut.',
      diagram: `
  Internet ── [R1] ──── Area 0 ──── [R2] ──── Area 1 ──── [R3]
             .1  10.0.0.0/30  .2    .1  172.16.0.0/30  .2
                                     │
                              ABR (Area Border Router)`,
      subQuestions: [
        { question: 'Quel routeur est considere comme ABR (Area Border Router) ?', options: ['R1', 'R2', 'R3', 'Aucun'], correct: 1, explanation: 'R2 est l\'ABR car il a des interfaces dans deux aires differentes (Area 0 et Area 1).' },
        { question: 'Quelle commande sur R1 permet de redistribuer la route par defaut dans OSPF ?', options: ['redistribute static', 'default-information originate', 'network 0.0.0.0', 'ip route 0.0.0.0'], correct: 1, explanation: '"default-information originate" dans le processus OSPF redistribue la route par defaut vers tous les voisins OSPF.' },
        { question: 'Quel type de LSA (Link-State Advertisement) R2 envoie-t-il dans l\'Area 1 pour decrire les routes de l\'Area 0 ?', options: ['LSA Type 1', 'LSA Type 2', 'LSA Type 3 (Summary)', 'LSA Type 5'], correct: 2, explanation: 'Les ABR generent des LSA Type 3 (Summary) pour propager les routes inter-aires.' },
        { question: 'Si R3 perd la connectivite vers R2, que se passe-t-il pour ses routes OSPF ?', options: ['Rien, les routes restent', 'Les routes expirent apres le dead interval et sont supprimees', 'R3 bascule automatiquement sur RIP', 'R3 se reconnecte via Internet'], correct: 1, explanation: 'Si les Hello packets ne sont plus recus, apres le dead interval (40s par defaut), le voisinage tombe et les routes OSPF apprises sont supprimees.' },
      ],
      topic: 'P2'
    },
    {
      type: 'scenario', id: 'mega_h3',
      scenario: 'Une entreprise migre son infrastructure on-premise vers le cloud. Elle utilise AWS avec un VPC, des instances EC2 dans des sous-reseaux publics et prives, un NAT Gateway, et un VPN site-to-site vers le datacenter existant.',
      diagram: `
  Datacenter ══VPN══ [AWS VPC 10.0.0.0/16]
  on-premise          │
                ┌─────┴─────┐
          Subnet Public   Subnet Prive
          10.0.1.0/24     10.0.2.0/24
          [EC2 Web]       [EC2 DB]
          (IGW)           (NAT GW)`,
      subQuestions: [
        { question: 'Quel composant AWS permet aux instances du sous-reseau prive d\'acceder a Internet (mises a jour) sans etre directement accessibles ?', options: ['Internet Gateway', 'NAT Gateway', 'VPN Gateway', 'Elastic IP'], correct: 1, explanation: 'Le NAT Gateway permet aux instances privees d\'initier des connexions sortantes vers Internet sans accepter de connexions entrantes.' },
        { question: 'Quel composant AWS fournit l\'acces Internet direct au sous-reseau public ?', options: ['NAT Gateway', 'VPN Gateway', 'Internet Gateway (IGW)', 'Direct Connect'], correct: 2, explanation: 'L\'Internet Gateway (IGW) est attache au VPC et permet la communication directe entre les instances publiques et Internet.' },
        { question: 'Quel type de connexion relie le datacenter on-premise au VPC AWS ?', options: ['VPN site-to-site (IPsec)', 'Cable Ethernet direct', 'Wi-Fi bridge', 'MPLS public'], correct: 0, explanation: 'Un VPN site-to-site (tunnel IPsec) connecte le datacenter on-premise au VPC AWS de maniere securisee via Internet.' },
      ],
      topic: 'P3'
    },
    {
      type: 'scenario', id: 'mega_h4',
      scenario: 'Un operateur telecom deploie un reseau SD-WAN pour connecter 50 succursales. Le controleur central gere les politiques de routage, QoS et securite. Les liens de chaque site combinent MPLS et Internet broadband.',
      diagram: `
                    [Controleur SD-WAN]
                     (Orchestrateur)
                    /        |        \\
               Site A     Site B     Site C
              /     \\    /     \\    /     \\
          MPLS   Internet MPLS  Internet MPLS  Internet
              \\     /    \\     /    \\     /
               [Hub Datacenter / Cloud]`,
      subQuestions: [
        { question: 'Quel est l\'avantage principal du SD-WAN par rapport au MPLS seul ?', options: ['Latence plus basse', 'Cout reduit en utilisant des liens Internet', 'Debit garanti', 'Pas besoin de chiffrement'], correct: 1, explanation: 'SD-WAN reduit les couts en utilisant des liens Internet (moins chers) en complement ou remplacement du MPLS, tout en maintenant la qualite via des politiques intelligentes.' },
        { question: 'Comment le SD-WAN gere-t-il la qualite des applications critiques ?', options: ['Il desactive MPLS', 'Il mesure les metriques des liens en temps reel et route dynamiquement', 'Il utilise uniquement Internet', 'Il augmente la bande passante physique'], correct: 1, explanation: 'Le SD-WAN mesure en continu la latence, la gigue et la perte sur chaque lien, et route dynamiquement le trafic sur le meilleur chemin selon les politiques QoS.' },
        { question: 'Le controleur SD-WAN est equivalent a quel composant dans l\'architecture SDN ?', options: ['Data plane', 'Control plane centralise', 'Management plane', 'Forwarding plane'], correct: 1, explanation: 'Le controleur SD-WAN centralise le control plane, definissant les regles de routage et politiques appliquees sur les equipements des sites.' },
        { question: 'Quelle technologie est utilisee pour securiser le trafic sur les liens Internet dans SD-WAN ?', options: ['HTTP', 'IPsec', 'Telnet', 'FTP'], correct: 1, explanation: 'SD-WAN utilise des tunnels IPsec pour chiffrer le trafic passant par Internet, assurant la confidentialite et l\'integrite des donnees.' },
      ],
      topic: 'P4'
    },
    // P5 - Wireless
    {
      type: 'scenario', id: 'mega_h5',
      scenario: 'Une universite deploie un reseau Wi-Fi pour couvrir 3 batiments avec un WLC (Wireless LAN Controller) central. Deux SSIDs sont configures : "UNIV-STAFF" (WPA2-Enterprise, VLAN 100) pour le personnel et "UNIV-GUEST" (portail captif, VLAN 200) pour les visiteurs. 30 AP en mode FlexConnect sont repartis dans les batiments.',
      diagram: `
  [WLC Central]
       │ CAPWAP
  ┌────┼────┐
  │    │    │
 [AP]  [AP]  [AP]  x30
  │         │
  ├── SSID: UNIV-STAFF (VLAN 100, 802.1X → RADIUS)
  └── SSID: UNIV-GUEST (VLAN 200, Web Auth)`,
      subQuestions: [
        { question: 'Quel protocole est utilise entre les AP et le WLC pour le controle et le tunneling ?', options: ['SNMP', 'CAPWAP', 'RADIUS', 'TACACS+'], correct: 1, explanation: 'CAPWAP (Control And Provisioning of Wireless Access Points) gere la communication entre les AP lightweight et le WLC.' },
        { question: 'Pourquoi le mode FlexConnect est-il choisi pour les AP ?', options: ['Il est moins cher', 'Il permet la commutation locale du trafic sans repasser par le WLC', 'Il ne necessite pas de WLC', 'Il supporte uniquement le 5 GHz'], correct: 1, explanation: 'FlexConnect permet aux AP de commuter le trafic localement, reduisant la latence et le trafic vers le WLC, ideal pour les sites distants.' },
        { question: 'Quel serveur est necessaire pour l\'authentification WPA2-Enterprise du SSID UNIV-STAFF ?', options: ['Serveur DNS', 'Serveur DHCP', 'Serveur RADIUS', 'Serveur FTP'], correct: 2, explanation: 'WPA2-Enterprise utilise 802.1X qui necessite un serveur RADIUS (ex: Cisco ISE, FreeRADIUS) pour authentifier les utilisateurs.' },
      ],
      topic: 'P5'
    },
    // P6 - Automation
    {
      type: 'scenario', id: 'mega_h6',
      scenario: 'Une entreprise adopte une approche SDN avec Cisco DNA Center comme controleur. L\'equipe reseau utilise les API REST de DNA Center pour automatiser le provisionnement des equipements, la gestion des politiques et la supervision. Un pipeline CI/CD (Git + Ansible) deploie les configurations reseau.',
      diagram: `
  [Git Repository] → [CI/CD Pipeline] → [Ansible]
                                            │
                                     API REST (HTTPS)
                                            │
                                    [DNA Center Controller]
                                     /        |        \\
                                [Switch]  [Router]  [AP/WLC]`,
      subQuestions: [
        { question: 'Quel est le role de DNA Center dans cette architecture ?', options: ['Data plane (forwarding)', 'Control plane centralise (SDN controller)', 'Serveur de fichiers', 'Firewall'], correct: 1, explanation: 'DNA Center est le controleur SDN qui centralise la gestion, les politiques et l\'automatisation du reseau via son control plane.' },
        { question: 'Quel format de donnees est echange entre Ansible et l\'API REST de DNA Center ?', options: ['XML', 'JSON', 'YAML', 'Binary'], correct: 1, explanation: 'Les API REST de DNA Center echangent des donnees en JSON. YAML est le format des playbooks Ansible, pas des echanges API.' },
        { question: 'Quel avantage principal apporte le pipeline CI/CD pour la gestion reseau ?', options: ['Augmente la bande passante', 'Permet des changements versionnes, testes et reproductibles', 'Remplace le besoin de switches', 'Elimine le besoin de securite'], correct: 1, explanation: 'Le CI/CD applique les principes DevOps au reseau (NetDevOps) : versionning Git, tests automatises, deploiements reproductibles et tracables.' },
      ],
      topic: 'P6'
    },
  ]
}

// === Export ===

export const megaExamSections: MegaSection[] = [sectionA, sectionB, sectionC, sectionD, sectionE, sectionF, sectionG, sectionH]
