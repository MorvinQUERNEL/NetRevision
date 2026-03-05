export const blogFaqs: Record<string, { question: string; answer: string }[]> = {
  'comprendre-modele-osi': [
    {
      question: "Qu'est-ce que le modèle OSI ?",
      answer:
        "Le modèle OSI (Open Systems Interconnection) est un cadre de référence en 7 couches qui décrit comment les données transitent dans un réseau. Il a été défini par l'ISO en 1984 pour standardiser les communications entre systèmes hétérogènes.",
    },
    {
      question: 'Quelles sont les 7 couches du modèle OSI dans l\'ordre ?',
      answer:
        "De bas en haut : 1) Physique, 2) Liaison de données, 3) Réseau, 4) Transport, 5) Session, 6) Présentation, 7) Application. Un moyen mnémotechnique courant est « Pour Le Réseau, Tout Se Passe Automatiquement ».",
    },
    {
      question: 'Quelle est la différence entre le modèle OSI et le modèle TCP/IP ?',
      answer:
        "Le modèle TCP/IP ne comporte que 4 couches (Accès réseau, Internet, Transport, Application) et correspond aux protocoles réellement utilisés sur Internet. Le modèle OSI, avec ses 7 couches, est plus théorique et sert principalement de référence pédagogique.",
    },
    {
      question: 'À quelle couche OSI travaille un switch ?',
      answer:
        "Un switch classique opère à la couche 2 (Liaison de données) en utilisant les adresses MAC pour transférer les trames. Certains switchs dits « Layer 3 » peuvent également effectuer du routage à la couche 3 (Réseau).",
    },
    {
      question: 'À quoi sert la couche Transport du modèle OSI ?',
      answer:
        "La couche 4 (Transport) assure la livraison fiable ou non fiable des données de bout en bout. Elle gère la segmentation, le contrôle de flux et la correction d'erreurs via des protocoles comme TCP (fiable) et UDP (non fiable mais plus rapide).",
    },
  ],

  'subnetting-methode': [
    {
      question: "Comment calculer un masque de sous-réseau ?",
      answer:
        "On part du nombre d'hôtes nécessaires par sous-réseau. On trouve la puissance de 2 supérieure ou égale, ce qui donne le nombre de bits hôtes. Le masque s'obtient en mettant les bits réseau à 1 et les bits hôtes à 0. Par exemple, pour 50 hôtes il faut 6 bits hôtes, soit un masque /26 (255.255.255.192).",
    },
    {
      question: 'Quelle est la différence entre VLSM et CIDR ?',
      answer:
        "Le VLSM (Variable Length Subnet Mask) permet d'utiliser des masques de taille différente au sein d'un même réseau, optimisant ainsi l'attribution des adresses. Le CIDR (Classless Inter-Domain Routing) est une notation (ex. /24) qui supprime les classes A, B, C traditionnelles et permet l'agrégation de routes.",
    },
    {
      question: "Combien d'adresses utilisables dans un réseau /24 ?",
      answer:
        "Un réseau /24 contient 256 adresses au total (2^8). On retire l'adresse réseau et l'adresse de broadcast, ce qui donne 254 adresses utilisables pour des hôtes.",
    },
    {
      question: 'Comment découper un réseau en sous-réseaux de taille égale ?',
      answer:
        "On détermine le nombre de sous-réseaux souhaités, puis on emprunte suffisamment de bits à la partie hôte. Par exemple, pour diviser un /24 en 4 sous-réseaux, on emprunte 2 bits, obtenant ainsi 4 sous-réseaux /26 de 64 adresses chacun.",
    },
    {
      question: "Qu'est-ce qu'une adresse de broadcast ?",
      answer:
        "L'adresse de broadcast est la dernière adresse d'un sous-réseau. Elle sert à envoyer un paquet à tous les hôtes du sous-réseau simultanément. Par exemple, dans le réseau 192.168.1.0/24, l'adresse de broadcast est 192.168.1.255.",
    },
  ],

  'configurer-vlan-cisco': [
    {
      question: "Comment créer un VLAN sur un switch Cisco ?",
      answer:
        "En mode de configuration globale, utilisez la commande « vlan <id> » suivie de « name <nom> ». Par exemple : « vlan 10 » puis « name COMPTABILITE ». Assignez ensuite les ports avec « switchport mode access » et « switchport access vlan 10 » sur chaque interface.",
    },
    {
      question: "Qu'est-ce qu'un trunk VLAN et quand l'utiliser ?",
      answer:
        "Un trunk (lien d'agrégation) est un port configuré pour transporter le trafic de plusieurs VLANs entre deux switchs ou entre un switch et un routeur. Il utilise le protocole 802.1Q pour étiqueter les trames avec l'identifiant VLAN correspondant.",
    },
    {
      question: 'Comment configurer un port trunk sur Cisco ?',
      answer:
        "Sur l'interface concernée, entrez « switchport mode trunk » puis « switchport trunk allowed vlan <liste> » pour limiter les VLANs autorisés. Par défaut, tous les VLANs sont autorisés sur un trunk. Le protocole d'encapsulation est 802.1Q sur les switchs modernes.",
    },
    {
      question: "Qu'est-ce que le VLAN natif et pourquoi est-il important ?",
      answer:
        "Le VLAN natif est le VLAN dont les trames ne sont pas étiquetées sur un lien trunk (par défaut le VLAN 1). Il est important de le changer pour des raisons de sécurité, car un attaquant pourrait exploiter le VLAN 1 pour du VLAN hopping.",
    },
    {
      question: 'Comment faire communiquer deux VLANs entre eux ?',
      answer:
        "Les VLANs étant isolés par défaut, il faut un routeur ou un switch Layer 3 pour assurer le routage inter-VLAN. La méthode « router-on-a-stick » utilise des sous-interfaces sur un routeur connecté en trunk au switch.",
    },
  ],

  'comprendre-tcp-udp': [
    {
      question: 'Quand utiliser TCP plutôt que UDP ?',
      answer:
        "TCP est préférable lorsque la fiabilité de la transmission est essentielle : navigation web (HTTP/HTTPS sur le port 443), transfert de fichiers (FTP), e-mail (SMTP). Il garantit la livraison ordonnée des données grâce à ses mécanismes d'acquittement et de retransmission.",
    },
    {
      question: 'Pourquoi UDP est-il plus rapide que TCP ?',
      answer:
        "UDP n'établit pas de connexion préalable (pas de handshake en 3 étapes) et n'attend pas d'acquittement pour chaque segment. Cette absence de contrôle réduit la latence, ce qui le rend idéal pour le streaming vidéo, les jeux en ligne et la VoIP.",
    },
    {
      question: "Qu'est-ce que le three-way handshake TCP ?",
      answer:
        "C'est le processus d'établissement de connexion TCP en trois étapes : le client envoie un segment SYN, le serveur répond avec un SYN-ACK, puis le client confirme avec un ACK. Ce mécanisme garantit que les deux parties sont prêtes à communiquer.",
    },
    {
      question: 'Quels protocoles utilisent UDP ?',
      answer:
        "Les protocoles courants utilisant UDP sont DNS (port 53), DHCP (ports 67/68), TFTP (port 69), SNMP (port 161) et RTP pour la voix/vidéo. Ces protocoles privilégient la rapidité ou tolèrent une perte occasionnelle de paquets.",
    },
  ],

  'routage-statique-dynamique': [
    {
      question: 'Quelle est la différence entre routage statique et dynamique ?',
      answer:
        "Le routage statique nécessite une configuration manuelle de chaque route par l'administrateur. Le routage dynamique utilise des protocoles (RIP, OSPF, BGP) qui échangent automatiquement les informations de routage et s'adaptent aux changements de topologie.",
    },
    {
      question: "Quand utiliser OSPF plutôt que RIP ?",
      answer:
        "OSPF est recommandé pour les réseaux de moyenne et grande taille, car il converge plus rapidement et n'est pas limité à 15 sauts comme RIP. OSPF utilise l'algorithme de Dijkstra (état de lien) et supporte le VLSM, ce qui en fait un choix bien plus efficace.",
    },
    {
      question: "À quoi sert le protocole BGP ?",
      answer:
        "BGP (Border Gateway Protocol) est le protocole de routage inter-domaines utilisé pour échanger des routes entre systèmes autonomes (AS) sur Internet. C'est le seul protocole capable de gérer la table de routage globale d'Internet, qui contient plus de 900 000 routes.",
    },
    {
      question: "Qu'est-ce que la distance administrative en routage ?",
      answer:
        "La distance administrative (AD) est une valeur de fiabilité attribuée à chaque source de routage. Plus elle est basse, plus la route est préférée. Par exemple : route directement connectée = 0, route statique = 1, OSPF = 110, RIP = 120.",
    },
    {
      question: 'Comment configurer une route statique sur un routeur Cisco ?',
      answer:
        "Utilisez la commande « ip route <réseau_destination> <masque> <next-hop ou interface> ». Par exemple : « ip route 192.168.2.0 255.255.255.0 10.0.0.2 ». Pour une route par défaut, utilisez « ip route 0.0.0.0 0.0.0.0 <next-hop> ».",
    },
  ],

  'dns-dhcp-fonctionnement': [
    {
      question: 'Comment fonctionne une requête DNS étape par étape ?',
      answer:
        "Le client interroge d'abord son cache local, puis le résolveur DNS récursif de son FAI. Si la réponse n'est pas en cache, le résolveur contacte successivement un serveur racine, un serveur TLD (.com, .fr) puis le serveur autoritaire du domaine pour obtenir l'adresse IP.",
    },
    {
      question: "Quelle est la différence entre un enregistrement A et un enregistrement CNAME ?",
      answer:
        "Un enregistrement A associe un nom de domaine directement à une adresse IPv4 (ex. exemple.fr → 93.184.216.34). Un CNAME (Canonical Name) crée un alias pointant vers un autre nom de domaine, utile pour rediriger www.exemple.fr vers exemple.fr.",
    },
    {
      question: 'Quel port utilise le protocole DNS ?',
      answer:
        "Le DNS utilise le port 53, en UDP pour les requêtes standard (réponses inférieures à 512 octets) et en TCP pour les transferts de zone entre serveurs et les réponses volumineuses. DNS over HTTPS (DoH) utilise le port 443.",
    },
    {
      question: "Qu'est-ce qu'un serveur DNS récursif ?",
      answer:
        "Un serveur DNS récursif (ou résolveur) prend en charge la résolution complète d'un nom de domaine pour le compte du client. Il effectue toutes les requêtes nécessaires auprès des serveurs racine, TLD et autoritaires, puis met en cache le résultat pour accélérer les futures demandes.",
    },
  ],

  'securiser-reseau-acl': [
    {
      question: "Qu'est-ce qu'une ACL en réseau ?",
      answer:
        "Une ACL (Access Control List) est un ensemble de règles configurées sur un routeur ou un switch pour filtrer le trafic réseau. Chaque règle autorise (permit) ou refuse (deny) des paquets selon des critères comme l'adresse IP source, l'adresse destination ou le protocole utilisé.",
    },
    {
      question: 'Quelle est la différence entre une ACL standard et une ACL étendue ?',
      answer:
        "Une ACL standard (numéros 1-99) filtre uniquement sur l'adresse IP source et se place près de la destination. Une ACL étendue (numéros 100-199) filtre sur la source, la destination, le protocole et les ports, et se place près de la source du trafic.",
    },
    {
      question: 'Comment appliquer une ACL sur une interface Cisco ?',
      answer:
        "Après avoir créé l'ACL en mode configuration globale, appliquez-la sur une interface avec « ip access-group <numéro> in|out ». Le mot-clé « in » filtre le trafic entrant et « out » le trafic sortant. Chaque interface ne peut avoir qu'une ACL par direction et par protocole.",
    },
    {
      question: "Pourquoi y a-t-il un « deny all » implicite à la fin de chaque ACL ?",
      answer:
        "Cisco applique une règle « deny any » implicite à la fin de toute ACL. Cela signifie que tout trafic ne correspondant à aucune règle explicite sera automatiquement refusé. Il faut donc toujours ajouter un « permit » pour le trafic légitime.",
    },
  ],

  'adressage-ipv4-guide': [
    {
      question: "Qu'est-ce qu'une adresse IPv4 et comment est-elle structurée ?",
      answer:
        "Une adresse IPv4 est un identifiant numérique de 32 bits attribué à chaque appareil sur un réseau IP. Elle est écrite en notation décimale pointée (ex. 192.168.1.1), composée de 4 octets séparés par des points. Chaque octet varie de 0 à 255.",
    },
    {
      question: 'Quelle est la différence entre une adresse IP publique et privée ?',
      answer:
        "Les adresses privées (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) sont utilisées sur les réseaux locaux et ne sont pas routables sur Internet. Les adresses publiques sont uniques au niveau mondial et permettent la communication sur Internet. Le NAT fait la traduction entre les deux.",
    },
    {
      question: "Qu'est-ce qu'un masque de sous-réseau ?",
      answer:
        "Le masque de sous-réseau détermine quelle partie d'une adresse IP identifie le réseau et quelle partie identifie l'hôte. Par exemple, un masque /24 (255.255.255.0) signifie que les 24 premiers bits définissent le réseau et les 8 derniers bits l'hôte, permettant 254 adresses utilisables.",
    },
    {
      question: 'Combien de classes existent en adressage IPv4 ?',
      answer:
        "L'adressage classful définit 5 classes : A (1.0.0.0 à 126.255.255.255, /8), B (128.0.0.0 à 191.255.255.255, /16), C (192.0.0.0 à 223.255.255.255, /24), D (multicast) et E (réservée). Aujourd'hui, le CIDR a remplacé ce système pour une utilisation plus flexible des adresses.",
    },
  ],

  'preparation-ccna-200-301': [
    {
      question: 'Combien de temps faut-il pour préparer le CCNA 200-301 ?',
      answer:
        "En général, il faut compter entre 3 et 6 mois de préparation sérieuse pour un débutant, à raison de 1 à 2 heures par jour. Les candidats ayant déjà une expérience réseau peuvent se préparer en 2 à 3 mois. La pratique régulière sur Packet Tracer ou GNS3 est indispensable.",
    },
    {
      question: "Quelles sont les meilleures ressources pour réviser le CCNA ?",
      answer:
        "Les ressources recommandées incluent le cours officiel Cisco Netacad (CCNA v7), le livre « OCG » (Official Cert Guide) de Wendell Odom, les vidéos de Jeremy's IT Lab sur YouTube et les exercices pratiques sur Packet Tracer. Complétez avec des examens blancs sur Boson ExSim.",
    },
    {
      question: "Quel est le prix de l'examen CCNA 200-301 ?",
      answer:
        "L'examen CCNA 200-301 coûte environ 330 USD (environ 310 EUR). Le voucher d'examen s'achète directement sur le site de Pearson VUE. Des réductions sont parfois disponibles via les Cisco Networking Academy ou lors de promotions Cisco.",
    },
    {
      question: 'Faut-il de l\'expérience pour passer le CCNA ?',
      answer:
        "Aucun prérequis formel n'est exigé par Cisco. Cependant, une compréhension de base des réseaux et au moins 6 mois de pratique sont fortement recommandés. Le CCNA couvre des sujets allant des fondamentaux réseau à la sécurité et l'automatisation.",
    },
    {
      question: 'Quelle est la durée de validité du CCNA ?',
      answer:
        "La certification CCNA est valide 3 ans. Pour la renouveler, vous pouvez repasser l'examen CCNA, passer un examen de niveau supérieur (CCNP) ou accumuler des crédits de formation continue (CE) via le programme Cisco Continuing Education.",
    },
  ],

  'ccna-sujets-examen': [
    {
      question: 'Quels sont les domaines couverts par l\'examen CCNA 200-301 ?',
      answer:
        "L'examen couvre 6 domaines : Fondamentaux des réseaux (20%), Accès réseau (20%), Connectivité IP (25%), Services IP (10%), Fondamentaux de la sécurité (15%) et Automatisation & Programmabilité (10%). La connectivité IP représente la plus grande part.",
    },
    {
      question: "Combien de questions comporte l'examen CCNA ?",
      answer:
        "L'examen CCNA 200-301 contient entre 100 et 120 questions à traiter en 120 minutes. Les types de questions incluent le QCM, le glisser-déposer et les simlets (simulations). Le score de passage est d'environ 825 sur 1000.",
    },
    {
      question: "L'automatisation et Python sont-ils importants pour le CCNA ?",
      answer:
        "Le domaine Automatisation & Programmabilité représente 10% de l'examen. Il couvre les bases des API REST, le format JSON, les concepts de gestion de configuration (Puppet, Ansible) et les contrôleurs SDN. Aucun code Python complexe n'est demandé, mais les concepts fondamentaux doivent être maîtrisés.",
    },
    {
      question: 'Quels sujets de sécurité sont abordés dans le CCNA ?',
      answer:
        "Le domaine sécurité (15%) couvre les menaces courantes, les ACL (listes de contrôle d'accès), la sécurité des ports (port security), le protocole AAA, les VPN IPsec, WPA2/WPA3 pour le Wi-Fi et les concepts fondamentaux de pare-feu.",
    },
  ],

  'commandes-cisco-essentielles': [
    {
      question: 'Quelles sont les commandes Cisco IOS indispensables ?',
      answer:
        "Les commandes essentielles sont : « show running-config » pour voir la configuration active, « show ip interface brief » pour l'état des interfaces, « show ip route » pour la table de routage, « show vlan brief » pour les VLANs et « copy running-config startup-config » pour sauvegarder.",
    },
    {
      question: 'Comment naviguer entre les modes de configuration Cisco IOS ?',
      answer:
        "Cisco IOS a plusieurs modes : User EXEC (>), Privileged EXEC (#) accessible avec « enable », Configuration globale (config)# avec « configure terminal », et les sous-modes (interface, router, line). « exit » remonte d'un niveau et « end » retourne directement en mode privilégié.",
    },
    {
      question: "Comment réinitialiser un mot de passe sur un routeur Cisco ?",
      answer:
        "Redémarrez le routeur et interrompez le boot avec Ctrl+Break pour entrer en mode ROMMON. Changez le registre de configuration avec « confreg 0x2142 » puis « reset ». Le routeur démarre sans charger la startup-config. Vous pouvez alors modifier le mot de passe et restaurer le registre à 0x2102.",
    },
    {
      question: 'Comment diagnostiquer un problème réseau avec les commandes show ?',
      answer:
        "Utilisez « show ip interface brief » pour vérifier l'état des interfaces (up/down), « show ip route » pour les routes, « ping » et « traceroute » pour la connectivité, « show running-config » pour la configuration et « show log » pour les événements récents.",
    },
  ],

  'erreurs-courantes-ccna': [
    {
      question: 'Quelles sont les erreurs les plus fréquentes à l\'examen CCNA ?',
      answer:
        "Les erreurs les plus courantes sont : mal gérer son temps (120 minutes pour 100-120 questions), négliger le subnetting, confondre les protocoles de routage, oublier les wildcards masks dans OSPF et ignorer les questions sur l'automatisation et la sécurité.",
    },
    {
      question: 'Comment bien gérer son temps pendant l\'examen CCNA ?',
      answer:
        "Consacrez environ 1 minute par question standard et marquez les questions difficiles pour y revenir. Traitez les simlets en dernier car ils prennent plus de temps. Ne restez jamais bloqué plus de 2 minutes sur une question à choix multiples.",
    },
    {
      question: 'Quels sujets sont souvent sous-estimés par les candidats CCNA ?',
      answer:
        "Les candidats négligent fréquemment le wireless (Wi-Fi), les ACL étendues, le protocole STP (Spanning Tree), les concepts IPv6 et le domaine automatisation/programmabilité. Ces sujets représentent ensemble une part significative de l'examen.",
    },
    {
      question: "Faut-il apprendre les commandes Cisco par cœur pour le CCNA ?",
      answer:
        "Il est essentiel de connaître les commandes de base : show running-config, show ip route, show vlan brief, show ip interface brief, et les commandes de configuration VLAN, OSPF et ACL. L'examen inclut des simlets où vous devez interpréter ou saisir des commandes.",
    },
  ],

  'labos-pratiques-ccna': [
    {
      question: 'Quels labos pratiquer pour préparer le CCNA ?',
      answer:
        "Les labos essentiels couvrent la configuration de VLANs et trunks, le routage statique et OSPF, les ACL standard et étendues, le NAT/PAT, la sécurité des ports (port security) et la configuration IPv6. Pratiquez sur Cisco Packet Tracer (gratuit) ou GNS3 pour des simulations plus réalistes.",
    },
    {
      question: 'Cisco Packet Tracer est-il suffisant pour le CCNA ?',
      answer:
        "Oui, Packet Tracer couvre la majorité des scénarios de l'examen CCNA. Il simule les commandes IOS de base, les VLANs, OSPF, ACL et le NAT. Pour des fonctionnalités avancées comme le BGP ou les VPN IPsec, GNS3 ou Cisco CML offrent une simulation plus complète.",
    },
    {
      question: 'Combien de temps consacrer aux labos pratiques ?',
      answer:
        "Consacrez au moins 40 à 50% de votre temps de préparation aux labos pratiques. La théorie seule ne suffit pas pour le CCNA, car l'examen inclut des simlets (simulations) qui testent la capacité à configurer et diagnostiquer des équipements en ligne de commande.",
    },
    {
      question: 'Comment structurer ses sessions de lab CCNA ?',
      answer:
        "Commencez par reproduire les topologies du cours, puis passez à des scénarios de dépannage (troubleshooting). Documentez chaque lab avec les commandes utilisées. Augmentez progressivement la complexité : un seul protocole d'abord, puis des combinaisons (OSPF + ACL + NAT).",
    },
  ],

  'automatisation-reseau-python': [
    {
      question: "Pourquoi utiliser Python pour l'automatisation réseau ?",
      answer:
        "Python est le langage le plus utilisé en automatisation réseau grâce à ses bibliothèques spécialisées (Netmiko, NAPALM, Paramiko) et sa syntaxe simple. Il permet de configurer des centaines d'équipements en quelques secondes, de collecter des données et de détecter des anomalies automatiquement.",
    },
    {
      question: 'Quelles bibliothèques Python utiliser pour configurer des routeurs Cisco ?',
      answer:
        "Netmiko est la bibliothèque la plus populaire pour se connecter en SSH aux équipements Cisco et exécuter des commandes. NAPALM offre une couche d'abstraction multi-constructeurs. Pour les API REST (Cisco DNA Center, Meraki), la bibliothèque requests est incontournable.",
    },
    {
      question: "Qu'est-ce qu'Ansible et comment l'utiliser pour le réseau ?",
      answer:
        "Ansible est un outil d'automatisation agentless qui utilise des fichiers YAML (playbooks) pour décrire les configurations souhaitées. Il dispose de modules réseau pour Cisco IOS, Juniper, Arista et autres, permettant de déployer des configurations de manière idempotente et reproductible.",
    },
    {
      question: 'Faut-il savoir programmer pour être ingénieur réseau aujourd\'hui ?',
      answer:
        "Les compétences en programmation deviennent de plus en plus attendues dans les métiers réseau. Cisco a d'ailleurs ajouté un domaine Automatisation au CCNA. Maîtriser les bases de Python, les API REST et le format JSON est désormais un atout majeur pour tout professionnel réseau.",
    },
    {
      question: "Comment débuter l'automatisation réseau avec Python ?",
      answer:
        "Commencez par apprendre les bases de Python (variables, boucles, fonctions), puis installez Netmiko pour vos premiers scripts de connexion SSH. Utilisez un lab virtuel (GNS3, CML) pour pratiquer sans risque. Le cours Cisco DevNet Associate est une excellente ressource structurée.",
    },
  ],

  'sd-wan-introduction': [
    {
      question: "Qu'est-ce que le SD-WAN et à quoi ça sert ?",
      answer:
        "Le SD-WAN (Software-Defined Wide Area Network) est une technologie qui virtualise la gestion du réseau étendu. Elle permet de combiner plusieurs types de connexions (MPLS, fibre, 4G/5G) et de router intelligemment le trafic selon les performances et la criticité des applications.",
    },
    {
      question: 'Quels sont les avantages du SD-WAN par rapport au MPLS ?',
      answer:
        "Le SD-WAN réduit les coûts en utilisant des connexions Internet standard au lieu du MPLS coûteux. Il offre une gestion centralisée, un déploiement rapide de nouveaux sites, une meilleure visibilité applicative et la capacité de basculer automatiquement entre les liens en cas de panne.",
    },
    {
      question: 'Quels sont les principaux fournisseurs de solutions SD-WAN ?',
      answer:
        "Les leaders du marché SD-WAN sont Cisco (Viptela/Meraki), VMware (VeloCloud), Fortinet, Palo Alto Networks (Prisma SD-WAN) et HPE (Aruba). Le choix dépend des besoins en sécurité intégrée, de l'écosystème existant et du budget.",
    },
    {
      question: 'Le SD-WAN remplace-t-il le MPLS ?',
      answer:
        "Le SD-WAN ne remplace pas totalement le MPLS mais le complète. De nombreuses entreprises adoptent une approche hybride où le MPLS est conservé pour les applications critiques tandis que le SD-WAN optimise l'utilisation des liens Internet pour le reste du trafic.",
    },
  ],

  'zero-trust-securite': [
    {
      question: "Qu'est-ce que le modèle Zero Trust en sécurité réseau ?",
      answer:
        "Le Zero Trust est un modèle de sécurité basé sur le principe « ne jamais faire confiance, toujours vérifier ». Contrairement au modèle périmétrique traditionnel, il impose une vérification de chaque utilisateur, appareil et flux réseau, qu'ils soient à l'intérieur ou à l'extérieur du réseau.",
    },
    {
      question: 'Quels sont les principes fondamentaux du Zero Trust ?',
      answer:
        "Les trois piliers du Zero Trust sont : la vérification explicite (authentification continue de chaque accès), le principe du moindre privilège (accès minimal nécessaire) et l'hypothèse de brèche (considérer que le réseau est déjà compromis et segmenter en conséquence).",
    },
    {
      question: 'Comment mettre en place une architecture Zero Trust ?',
      answer:
        "La mise en œuvre passe par plusieurs étapes : inventorier les actifs et les flux, déployer l'authentification multi-facteurs (MFA), segmenter le réseau en micro-périmètres, mettre en place du contrôle d'accès basé sur l'identité (IAM) et surveiller en continu avec un SIEM.",
    },
    {
      question: 'Quelle est la différence entre Zero Trust et un VPN ?',
      answer:
        "Un VPN accorde un accès large au réseau une fois authentifié, créant un tunnel de confiance. Le Zero Trust, via des solutions ZTNA (Zero Trust Network Access), n'accorde l'accès qu'aux applications spécifiques autorisées, avec une vérification continue de la posture de sécurité.",
    },
    {
      question: 'Le Zero Trust est-il adapté aux petites entreprises ?',
      answer:
        "Oui, le Zero Trust peut être adopté progressivement par les PME. Commencez par le MFA sur tous les comptes, la segmentation réseau de base et une politique de moindre privilège. Des solutions cloud comme Microsoft Entra ID ou Cloudflare Access rendent le ZTNA accessible sans infrastructure lourde.",
    },
  ],
};
