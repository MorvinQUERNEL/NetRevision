export interface ArticleSection {
  title: string
  content: string
}

export interface BlogArticle {
  id: number
  slug: string
  title: string
  description: string
  category: 'tutoriel' | 'certification' | 'avance'
  tags: string[]
  author: string
  publishDate: string
  readTime: string
  relatedChapters: string[]
  sections: ArticleSection[]
}

// ============================================================
// ARTICLE 1 — Comprendre le Modele OSI en 7 couches
// ============================================================
const article1: BlogArticle = {
  id: 1,
  slug: 'comprendre-modele-osi',
  title: 'Comprendre le Modele OSI en 7 couches',
  description: 'Decouvrez le modele OSI couche par couche : role, PDU, encapsulation et exemples concrets pour maitriser les bases du reseau informatique.',
  category: 'tutoriel',
  tags: ['OSI', 'modele OSI', 'couches reseau', 'encapsulation'],
  author: 'NetRevision',
  publishDate: '2026-02-15',
  readTime: '10 min',
  relatedChapters: ['modele-osi'],
  sections: [
    {
      title: 'Pourquoi le modele OSI est incontournable',
      content:
        "Le modele OSI (Open Systems Interconnection) est un cadre de reference publie par l'ISO en 1984. Son objectif est de standardiser les communications entre systemes informatiques en decoupant le processus en sept couches distinctes. Chaque couche remplit un role precis et communique uniquement avec la couche immediatement superieure et la couche immediatement inferieure.\n\nPour un etudiant en reseaux, comprendre le modele OSI est fondamental. Il permet de diagnostiquer les pannes en isolant le probleme a une couche specifique. Par exemple, si un cable est debranche, le probleme se situe a la couche 1. Si un PC n'obtient pas d'adresse IP, le probleme est probablement a la couche 3. Ce raisonnement par couche est la base du depannage reseau professionnel.\n\nLe modele OSI est egalement un outil de communication universel entre techniciens. Quand un ingenieur dit qu'il y a un probleme de couche 2, tous les professionnels comprennent immediatement qu'il s'agit d'un probleme de commutation ou d'adressage MAC. Cette terminologie commune accelere la resolution des incidents."
    },
    {
      title: 'Couches basses : Physique, Liaison et Reseau',
      content:
        "La couche 1 (Physique) gere la transmission brute des bits sur le support physique. Elle definit les caracteristiques electriques, optiques ou radio du signal. Les equipements associes sont les cables (cuivre, fibre optique), les connecteurs (RJ45, SC, LC), les hubs et les repeteurs. L'unite de donnees a ce niveau est le bit. Les normes comme IEEE 802.3 (Ethernet) ou IEEE 802.11 (Wi-Fi) definissent les specifications physiques.\n\nLa couche 2 (Liaison de donnees) assure la communication fiable entre deux noeuds directement connectes. Elle se decompose en deux sous-couches : LLC (Logical Link Control) et MAC (Media Access Control). C'est a ce niveau qu'interviennent les adresses MAC, composees de 48 bits notes en hexadecimal (ex : AA:BB:CC:DD:EE:FF). L'unite de donnees est la trame (frame). Les switchs operent principalement a cette couche en utilisant leur table d'adresses MAC pour acheminer les trames vers le bon port.\n\nLa couche 3 (Reseau) est responsable du routage des paquets entre reseaux differents. C'est ici qu'interviennent les adresses IP (IPv4 et IPv6). L'unite de donnees est le paquet. Les routeurs sont les equipements emblematiques de cette couche. Ils consultent leur table de routage pour determiner le meilleur chemin vers la destination. Les protocoles de routage comme OSPF ou BGP operent a ce niveau, tout comme le protocole ICMP utilise par la commande ping."
    },
    {
      title: 'Couches intermediaires : Transport',
      content:
        "La couche 4 (Transport) est une couche charniere qui assure la communication de bout en bout entre les applications. Elle est responsable de la segmentation des donnees, du controle de flux et de la fiabilite de la transmission. L'unite de donnees est le segment (pour TCP) ou le datagramme (pour UDP).\n\nLe protocole TCP (Transmission Control Protocol) fonctionne en mode connecte. Avant tout echange de donnees, il etablit une connexion via le mecanisme du three-way handshake : SYN, SYN-ACK, ACK. TCP garantit la livraison des donnees grace aux numeros de sequence et aux acquittements. En cas de perte, les segments sont retransmis. Ce protocole est utilise par HTTP, FTP, SMTP et SSH.\n\nLe protocole UDP (User Datagram Protocol) fonctionne en mode non connecte. Il n'etablit pas de connexion prealable et ne garantit pas la livraison. En contrepartie, il est plus rapide et genere moins de surcharge reseau. UDP est privilegie pour le streaming video, la VoIP, le DNS et les jeux en ligne ou la vitesse prime sur la fiabilite.\n\nLes numeros de port permettent de multiplexer les communications. Les ports 0 a 1023 sont dits bien connus (well-known) et sont reserves aux services standards : HTTP (80), HTTPS (443), DNS (53), SSH (22), FTP (21)."
    },
    {
      title: 'Couches hautes : Session, Presentation et Application',
      content:
        "La couche 5 (Session) gere l'ouverture, le maintien et la fermeture des sessions de communication entre applications. Elle permet la synchronisation des echanges et la reprise apres interruption. Un exemple concret est une session NetBIOS ou une session RPC. Dans la pratique moderne, cette couche est souvent fusionnee avec la couche application dans le modele TCP/IP.\n\nLa couche 6 (Presentation) est responsable de la traduction, du chiffrement et de la compression des donnees. Elle convertit les donnees du format reseau vers un format comprehensible par l'application. Le chiffrement SSL/TLS est souvent associe a cette couche. La conversion de formats de caracteres (ASCII, Unicode) et la compression de donnees relevent egalement de ce niveau.\n\nLa couche 7 (Application) est la couche la plus proche de l'utilisateur. Elle fournit les interfaces et protocoles directement utilises par les applications. On y trouve HTTP et HTTPS pour le web, SMTP et POP3 pour le courrier electronique, FTP pour le transfert de fichiers, DNS pour la resolution de noms et DHCP pour l'attribution automatique d'adresses IP. Attention : la couche application du modele OSI ne designe pas l'application elle-meme (comme un navigateur), mais les protocoles qu'elle utilise."
    },
    {
      title: 'Encapsulation et desencapsulation',
      content:
        "L'encapsulation est le processus par lequel chaque couche ajoute son en-tete (header) aux donnees recues de la couche superieure. A l'emission, les donnees descendent de la couche 7 vers la couche 1 en accumulant des en-tetes successifs. A la reception, le processus inverse, appele desencapsulation, retire les en-tetes couche par couche en remontant vers l'application.\n\nVoici la denomination des unites de donnees protocolaires (PDU) a chaque couche : couches 5 a 7, on parle de donnees (data) ; couche 4, de segments TCP ou datagrammes UDP ; couche 3, de paquets ; couche 2, de trames ; couche 1, de bits.\n\nPrenons un exemple concret : lorsque vous accedez a un site web, votre navigateur genere une requete HTTP (couche 7). TCP ajoute un en-tete avec les ports source et destination (couche 4). IP ajoute les adresses IP source et destination (couche 3). Ethernet ajoute les adresses MAC source et destination ainsi qu'un FCS pour le controle d'erreurs (couche 2). Enfin, la trame est convertie en signal electrique ou optique (couche 1).\n\nCe mecanisme d'encapsulation est essentiel a comprendre car il explique comment des technologies completement differentes (Wi-Fi, Ethernet, fibre) peuvent coexister sur un meme reseau : chaque couche est independante et interchangeable."
    },
    {
      title: 'OSI vs TCP/IP : quel modele utiliser',
      content:
        "Le modele TCP/IP, egalement appele modele DoD (Department of Defense), est le modele pratique utilise sur Internet. Il ne comporte que quatre couches : Acces reseau (couches 1 et 2 OSI), Internet (couche 3), Transport (couche 4) et Application (couches 5 a 7).\n\nDans la pratique professionnelle et pour la certification CCNA, les deux modeles sont utilises. Le modele OSI sert de reference theorique pour le depannage et la communication entre professionnels. Le modele TCP/IP reflete la realite des protocoles implementes sur les reseaux modernes.\n\nUn moyen mnemonique pour retenir les sept couches OSI de bas en haut : \"Pour Le Reseau, Tout Se Presente Agreablement\" (Physique, Liaison, Reseau, Transport, Session, Presentation, Application). Pour les retenir de haut en bas : \"All People Seem To Need Data Processing\".\n\nEn resume, le modele OSI est votre meilleur outil conceptuel pour comprendre et depanner un reseau. Chaque probleme reseau peut etre rattache a une couche specifique. Maitriser ce modele, c'est disposer d'une methode de diagnostic systematique applicable a toute situation."
    }
  ]
}

// ============================================================
// ARTICLE 2 — Guide complet de l'adressage IPv4
// ============================================================
const article2: BlogArticle = {
  id: 2,
  slug: 'adressage-ipv4-guide',
  title: "Guide complet de l'adressage IPv4",
  description: "Maitriser l'adressage IPv4 : structure des adresses IP, classes A, B et C, adresses privees et publiques, notation CIDR et masques de sous-reseau.",
  category: 'tutoriel',
  tags: ['IPv4', 'adressage IP', 'classes IP', 'CIDR'],
  author: 'NetRevision',
  publishDate: '2026-02-15',
  readTime: '9 min',
  relatedChapters: ['ipv4-ipv6', 'classes-subnetting'],
  sections: [
    {
      title: "Structure d'une adresse IPv4",
      content:
        "Une adresse IPv4 est un identifiant numerique de 32 bits attribue a chaque interface reseau. Elle est notee en notation decimale pointee, c'est-a-dire sous la forme de quatre octets separes par des points. Chaque octet peut prendre une valeur comprise entre 0 et 255. Par exemple, l'adresse 192.168.1.10 se decompose en binaire : 11000000.10101000.00000001.00001010.\n\nUne adresse IPv4 se compose de deux parties : la partie reseau (network) et la partie hote (host). La partie reseau identifie le sous-reseau auquel appartient la machine, tandis que la partie hote identifie la machine au sein de ce reseau. C'est le masque de sous-reseau qui determine la frontiere entre ces deux parties.\n\nLe masque de sous-reseau est egalement un nombre de 32 bits. Les bits a 1 designent la partie reseau, les bits a 0 designent la partie hote. Par exemple, le masque 255.255.255.0 en binaire est 11111111.11111111.11111111.00000000, ce qui signifie que les 24 premiers bits sont la partie reseau et les 8 derniers bits sont la partie hote. Ce masque peut aussi s'ecrire /24 en notation CIDR."
    },
    {
      title: 'Les classes A, B et C',
      content:
        "Historiquement, l'adressage IPv4 reposait sur un systeme de classes. Bien que ce systeme soit largement remplace par le CIDR dans les reseaux modernes, il reste fondamental pour comprendre l'architecture IP et est encore presente dans les examens de certification.\n\nLa classe A couvre les adresses de 1.0.0.0 a 126.255.255.255. Le masque par defaut est 255.0.0.0 (/8). Le premier octet identifie le reseau, les trois suivants identifient l'hote. Cela donne 126 reseaux possibles, chacun pouvant contenir jusqu'a 16 777 214 hotes. La classe A est reservee aux tres grandes organisations.\n\nLa classe B couvre les adresses de 128.0.0.0 a 191.255.255.255. Le masque par defaut est 255.255.0.0 (/16). Les deux premiers octets identifient le reseau. Chaque reseau de classe B peut accueillir jusqu'a 65 534 hotes. Cette classe est utilisee par les entreprises de taille moyenne et les universites.\n\nLa classe C couvre les adresses de 192.0.0.0 a 223.255.255.255. Le masque par defaut est 255.255.255.0 (/24). Les trois premiers octets identifient le reseau, le dernier octet identifie l'hote. Chaque reseau de classe C accepte jusqu'a 254 hotes. C'est la classe la plus courante dans les petites entreprises.\n\nLa classe D (224.0.0.0 a 239.255.255.255) est reservee au multicast. La classe E (240.0.0.0 a 255.255.255.255) est reservee a la recherche. L'adresse 127.0.0.1 est l'adresse de loopback, utilisee pour tester la pile TCP/IP locale."
    },
    {
      title: 'Adresses privees et adresses publiques',
      content:
        "Toutes les adresses IPv4 ne sont pas routables sur Internet. La RFC 1918 definit trois plages d'adresses privees reservees aux reseaux internes. Ces adresses ne sont jamais routees sur Internet et peuvent etre reutilisees librement par n'importe quelle organisation.\n\nLes plages privees sont les suivantes : en classe A, 10.0.0.0 a 10.255.255.255 (10.0.0.0/8) offrant plus de 16 millions d'adresses ; en classe B, 172.16.0.0 a 172.31.255.255 (172.16.0.0/12) offrant environ un million d'adresses ; en classe C, 192.168.0.0 a 192.168.255.255 (192.168.0.0/16) offrant environ 65 000 adresses.\n\nPour qu'un appareil utilisant une adresse privee puisse communiquer sur Internet, un mecanisme de traduction d'adresses est necessaire : le NAT (Network Address Translation). Le routeur de bordure traduit l'adresse privee en adresse publique lors de la sortie vers Internet, et effectue la traduction inverse pour les reponses.\n\nLes adresses publiques sont attribuees par les registres Internet regionaux (RIR) : RIPE NCC pour l'Europe, ARIN pour l'Amerique du Nord, APNIC pour l'Asie-Pacifique. L'epuisement des adresses IPv4 publiques, officiellement annonce en 2011, a ete un facteur majeur de l'adoption progressive d'IPv6."
    },
    {
      title: 'Adresses speciales a connaitre',
      content:
        "Plusieurs adresses ou plages ont un role particulier dans l'adressage IPv4. L'adresse reseau est la premiere adresse d'un sous-reseau, ou tous les bits de la partie hote sont a 0. Par exemple, dans le reseau 192.168.1.0/24, l'adresse reseau est 192.168.1.0. Cette adresse identifie le reseau lui-meme et ne peut pas etre attribuee a un hote.\n\nL'adresse de broadcast est la derniere adresse d'un sous-reseau, ou tous les bits de la partie hote sont a 1. Dans notre exemple, c'est 192.168.1.255. Un paquet envoye a cette adresse est recu par toutes les machines du sous-reseau. L'adresse de broadcast limitee 255.255.255.255 envoie a toutes les machines du reseau local.\n\nL'adresse APIPA (Automatic Private IP Addressing) dans la plage 169.254.0.0/16 est automatiquement attribuee par le systeme d'exploitation lorsqu'un client DHCP ne parvient pas a obtenir une adresse. Si vous voyez une adresse en 169.254.x.x sur un poste, cela indique un probleme de communication avec le serveur DHCP.\n\nL'adresse 0.0.0.0 a plusieurs significations selon le contexte : elle peut designer l'absence d'adresse, la route par defaut dans une table de routage, ou l'ecoute sur toutes les interfaces d'un serveur."
    },
    {
      title: 'La notation CIDR',
      content:
        "La notation CIDR (Classless Inter-Domain Routing), introduite en 1993, a remplace le systeme de classes rigide. Elle permet de definir des masques de sous-reseau de longueur variable (VLSM), offrant une granularite beaucoup plus fine dans l'allocation des adresses.\n\nEn notation CIDR, le masque est exprime par un prefixe indiquant le nombre de bits a 1. Par exemple, /24 signifie que les 24 premiers bits sont la partie reseau, laissant 8 bits pour la partie hote (soit 254 adresses utilisables). Un masque /25 divise un reseau /24 en deux sous-reseaux de 126 hotes chacun. Un masque /26 cree quatre sous-reseaux de 62 hotes.\n\nLa formule pour calculer le nombre d'hotes utilisables est : 2^n - 2, ou n est le nombre de bits de la partie hote. On soustrait 2 pour exclure l'adresse reseau et l'adresse de broadcast. Ainsi, un /24 offre 2^8 - 2 = 254 hotes, un /28 offre 2^4 - 2 = 14 hotes.\n\nLe CIDR permet egalement l'agregation de routes, appelee supernetting. Quatre reseaux /24 consecutifs (par exemple 10.1.0.0/24 a 10.1.3.0/24) peuvent etre resumes en une seule route 10.1.0.0/22. Cette technique reduit la taille des tables de routage et ameliore les performances des routeurs."
    }
  ]
}

// ============================================================
// ARTICLE 3 — Maitriser le subnetting
// ============================================================
const article3: BlogArticle = {
  id: 3,
  slug: 'subnetting-methode',
  title: 'Maitriser le subnetting : methode pas a pas',
  description: 'Apprenez le subnetting IPv4 avec une methode claire et des exemples pratiques. Calcul de sous-reseaux, nombre magique et exercices corriges.',
  category: 'tutoriel',
  tags: ['subnetting', 'sous-reseaux', 'masque', 'CIDR', 'calcul IP'],
  author: 'NetRevision',
  publishDate: '2026-02-15',
  readTime: '12 min',
  relatedChapters: ['classes-subnetting'],
  sections: [
    {
      title: 'Pourquoi decouper un reseau en sous-reseaux',
      content:
        "Le subnetting, ou decoupage en sous-reseaux, consiste a diviser un reseau IP en segments plus petits. Cette technique repond a plusieurs besoins concrets dans l'administration reseau.\n\nPremierement, le subnetting permet de reduire la taille des domaines de broadcast. Dans un reseau /24 avec 200 machines, chaque broadcast atteint les 200 postes. En decoupant en quatre sous-reseaux /26, chaque broadcast ne touche que 62 machines maximum, ce qui reduit le trafic inutile et ameliore les performances globales.\n\nDeuxiemement, le subnetting ameliore la securite. En separant les departements (comptabilite, developpement, direction) dans des sous-reseaux distincts, on peut appliquer des regles de filtrage entre eux via des ACL sur le routeur. Les postes d'un departement ne voient pas directement le trafic des autres.\n\nTroisiemement, le subnetting optimise l'utilisation des adresses IP. Attribuer un reseau /24 entier a un lien point-a-point entre deux routeurs gaspille 252 adresses. Un sous-reseau /30 suffit parfaitement avec ses 2 adresses utilisables."
    },
    {
      title: 'La methode du nombre magique',
      content:
        "La methode du nombre magique (magic number) est la technique la plus rapide pour calculer les sous-reseaux sans passer par le binaire a chaque fois. Le principe est simple : le nombre magique est la difference entre 256 et la valeur de l'octet significatif du masque.\n\nPrenons un exemple avec le masque 255.255.255.192 (/26). L'octet significatif (celui qui n'est ni 255 ni 0) est 192. Le nombre magique est donc 256 - 192 = 64. Cela signifie que les sous-reseaux se succedent par pas de 64 dans le dernier octet.\n\nPour le reseau 192.168.1.0/26, les sous-reseaux sont : 192.168.1.0 (premiere adresse utilisable : .1, derniere : .62, broadcast : .63), puis 192.168.1.64 (.65 a .126, broadcast .127), puis 192.168.1.128 (.129 a .190, broadcast .191), et enfin 192.168.1.192 (.193 a .254, broadcast .255). On obtient bien quatre sous-reseaux de 62 hotes chacun.\n\nAutre exemple avec le masque 255.255.240.0 (/20). L'octet significatif est le troisieme : 240. Le nombre magique est 256 - 240 = 16. Les sous-reseaux avancent par pas de 16 dans le troisieme octet : 10.0.0.0, 10.0.16.0, 10.0.32.0, 10.0.48.0, et ainsi de suite. Chaque sous-reseau contient 2^12 - 2 = 4094 adresses hotes."
    },
    {
      title: 'Exercice pratique : decouper un reseau en sous-reseaux',
      content:
        "Enonce : une entreprise dispose du reseau 172.16.0.0/16 et a besoin de quatre sous-reseaux pouvant accueillir chacun au moins 500 hotes. Trouvez le masque et les plages d'adresses.\n\nEtape 1 : determiner le nombre de bits hotes necessaires. Il faut au moins 500 hotes par sous-reseau. On cherche n tel que 2^n - 2 >= 500. Avec n = 9, on obtient 2^9 - 2 = 510 hotes. C'est suffisant.\n\nEtape 2 : calculer le masque. Si on reserve 9 bits pour les hotes, il reste 32 - 9 = 23 bits pour le reseau. Le masque est donc /23, soit 255.255.254.0.\n\nEtape 3 : verifier qu'on a assez de sous-reseaux. Le reseau initial est en /16. On passe a /23, ce qui emprunte 23 - 16 = 7 bits pour les sous-reseaux. On dispose donc de 2^7 = 128 sous-reseaux possibles, bien plus que les 4 necessaires.\n\nEtape 4 : calculer les plages. Le nombre magique dans le deuxieme octet significatif est 256 - 254 = 2. Les quatre premiers sous-reseaux sont : 172.16.0.0/23 (hotes .0.1 a .1.254), 172.16.2.0/23 (hotes .2.1 a .3.254), 172.16.4.0/23 (hotes .4.1 a .5.254), 172.16.6.0/23 (hotes .6.1 a .7.254). Chacun offre bien 510 adresses hotes utilisables."
    },
    {
      title: 'VLSM : adapter le masque a chaque besoin',
      content:
        "Le VLSM (Variable Length Subnet Mask) est une evolution du subnetting classique qui permet d'utiliser des masques differents au sein d'un meme reseau. Sans VLSM, tous les sous-reseaux ont la meme taille, ce qui entraine un gaspillage d'adresses. Avec le VLSM, chaque sous-reseau est dimensionne au plus juste.\n\nMethode VLSM : on commence toujours par le plus grand sous-reseau et on descend vers le plus petit. Prenons le reseau 192.168.10.0/24 avec les besoins suivants : LAN A (100 hotes), LAN B (50 hotes), LAN C (25 hotes), et deux liens WAN point-a-point (2 hotes chacun).\n\nPour le LAN A (100 hotes) : il faut 7 bits hotes (2^7 - 2 = 126). Masque : /25. Sous-reseau : 192.168.10.0/25 (plage : .1 a .126). Pour le LAN B (50 hotes) : il faut 6 bits (2^6 - 2 = 62). Masque : /26. Sous-reseau : 192.168.10.128/26 (plage : .129 a .190).\n\nPour le LAN C (25 hotes) : il faut 5 bits (2^5 - 2 = 30). Masque : /27. Sous-reseau : 192.168.10.192/27 (plage : .193 a .222). Pour les liens WAN : il faut 2 bits (2^2 - 2 = 2). Masque : /30. Premier lien : 192.168.10.224/30, second lien : 192.168.10.228/30.\n\nGrace au VLSM, nous avons attribue cinq sous-reseaux de tailles differentes dans un seul /24, sans gaspillage. Chaque segment est dimensionne au plus proche de son besoin reel."
    },
    {
      title: 'Determiner le sous-reseau d\'une adresse',
      content:
        "Un exercice classique des certifications consiste a determiner le sous-reseau auquel appartient une adresse donnee. Voici la methode systematique.\n\nExemple : a quel sous-reseau appartient l'adresse 10.45.67.200/21 ? Etape 1 : identifier l'octet significatif. Le masque /21 donne 255.255.248.0. L'octet significatif est le troisieme (248). Etape 2 : calculer le nombre magique. 256 - 248 = 8. Les sous-reseaux avancent par pas de 8 dans le troisieme octet. Etape 3 : trouver le multiple de 8 immediatement inferieur ou egal a 67. C'est 64 (8 x 8 = 64). L'adresse reseau est donc 10.45.64.0/21.\n\nVerification : le sous-reseau suivant commence a 10.45.72.0. L'adresse 10.45.67.200 est bien comprise entre 10.45.64.0 et 10.45.71.255 (broadcast). C'est correct.\n\nCette competence est indispensable pour configurer correctement les interfaces des routeurs, creer des routes statiques et rediger des ACL. Un masque incorrect d'un seul bit peut rendre un sous-reseau entier inaccessible.\n\nPour aller plus vite lors d'un examen, memorisez les puissances de 2 : /25 = 128, /26 = 64, /27 = 32, /28 = 16, /29 = 8, /30 = 4. Ces valeurs correspondent directement au nombre magique pour le dernier octet."
    },
    {
      title: 'Erreurs courantes et conseils pour la certification',
      content:
        "L'erreur la plus frequente en subnetting est d'oublier de soustraire 2 au calcul du nombre d'hotes. La formule correcte est 2^n - 2, car l'adresse reseau et l'adresse de broadcast ne sont pas attribuables a des hotes. Seule exception : les liens point-a-point en /31 (RFC 3021) ou les deux adresses sont utilisees, ce qui est une pratique courante chez les operateurs.\n\nUne autre erreur classique est de confondre le masque et le masque inverse (wildcard mask). Le masque 255.255.255.0 correspond au wildcard 0.0.0.255. Les wildcards sont utilises dans les ACL et les configurations OSPF sur les routeurs Cisco. Pour convertir, il suffit de soustraire chaque octet du masque a 255.\n\nPour la certification CCNA, vous devez etre capable de realiser un calcul de subnetting en moins de deux minutes. La pratique reguliere est la cle. Entrainez-vous quotidiennement sur des exercices varies : trouver le sous-reseau d'une adresse, calculer le nombre d'hotes, concevoir un plan d'adressage VLSM.\n\nEnfin, n'oubliez pas que le subnetting est la base de nombreux autres sujets : le routage (chaque reseau dans la table de routage est un sous-reseau), les VLAN (chaque VLAN est generalement associe a un sous-reseau), et les ACL (qui filtrent sur des adresses et masques). Maitriser le subnetting, c'est debloquer la comprehension de tout le reste."
    }
  ]
}

// ============================================================
// ARTICLE 4 — Configurer les VLAN sur un switch Cisco
// ============================================================
const article4: BlogArticle = {
  id: 4,
  slug: 'configurer-vlan-cisco',
  title: 'Configurer les VLAN sur un switch Cisco',
  description: 'Apprenez a configurer les VLAN, les ports trunk et le VTP sur un switch Cisco. Commandes CLI, exemples concrets et bonnes pratiques.',
  category: 'tutoriel',
  tags: ['VLAN', 'trunk', 'Cisco', 'switch', 'configuration'],
  author: 'NetRevision',
  publishDate: '2026-02-15',
  readTime: '11 min',
  relatedChapters: ['vlan-trunk-stp'],
  sections: [
    {
      title: 'Qu\'est-ce qu\'un VLAN et pourquoi l\'utiliser',
      content:
        "Un VLAN (Virtual Local Area Network) est un reseau local virtuel qui permet de segmenter logiquement un switch physique en plusieurs domaines de broadcast independants. Sans VLAN, toutes les machines connectees a un switch appartiennent au meme domaine de broadcast et recoivent toutes les trames de broadcast emises par n'importe quel poste.\n\nLes VLAN repondent a trois besoins fondamentaux. La segmentation du trafic : en separant les departements (VLAN 10 pour la comptabilite, VLAN 20 pour le developpement, VLAN 30 pour la direction), on reduit le volume de broadcast et on ameliore les performances. La securite : les machines de VLAN differents ne peuvent pas communiquer directement sans passer par un routeur, ce qui permet d'appliquer des regles de filtrage. La flexibilite : un employe qui change de bureau peut rester dans son VLAN sans recablage, il suffit de reconfigurer le port du switch.\n\nPar defaut, tous les ports d'un switch Cisco appartiennent au VLAN 1. Le VLAN 1 est aussi le VLAN natif et le VLAN de gestion par defaut. Pour des raisons de securite, il est recommande de ne pas utiliser le VLAN 1 pour le trafic utilisateur et de creer des VLAN dedies."
    },
    {
      title: 'Creer des VLAN et assigner les ports',
      content:
        "Sur un switch Cisco, la creation d'un VLAN et l'affectation des ports se font en mode de configuration globale et en mode de configuration d'interface. Voici les commandes essentielles.\n\nPour creer un VLAN : entrez en mode de configuration globale avec \"configure terminal\", puis tapez \"vlan 10\" pour creer le VLAN 10. Vous pouvez lui donner un nom avec \"name COMPTABILITE\". Repetez pour chaque VLAN necessaire : \"vlan 20\" puis \"name DEVELOPPEMENT\", \"vlan 30\" puis \"name DIRECTION\".\n\nPour affecter un port a un VLAN, accedez a l'interface : \"interface fastEthernet 0/1\". Configurez le port en mode acces avec \"switchport mode access\", puis assignez-le au VLAN souhaite avec \"switchport access vlan 10\". Ce port ne transportera desormais que le trafic du VLAN 10.\n\nPour affecter une plage de ports d'un coup, utilisez la commande \"interface range fastEthernet 0/1 - 8\" puis appliquez les memes commandes. Les ports 1 a 8 seront tous dans le VLAN specifie.\n\nVerifiez votre configuration avec \"show vlan brief\" qui affiche un tableau recapitulatif de tous les VLAN et des ports associes. La commande \"show interfaces switchport\" donne le detail de la configuration de chaque port (mode, VLAN, trunk, etc.)."
    },
    {
      title: 'Configurer les liens trunk',
      content:
        "Un lien trunk (ou lien d'agregation) est un lien entre deux switchs (ou entre un switch et un routeur) qui transporte le trafic de plusieurs VLAN simultanement. Sans trunk, il faudrait un cable physique par VLAN entre chaque paire de switchs, ce qui serait impraticable.\n\nLe trunk fonctionne en ajoutant une etiquette (tag) a chaque trame pour identifier son VLAN d'origine. Le protocole de trunking standard est IEEE 802.1Q. Il insere un champ de 4 octets dans l'en-tete Ethernet contenant notamment l'identifiant de VLAN (12 bits, permettant 4094 VLAN). L'ancien protocole proprietaire Cisco ISL (Inter-Switch Link) est considere comme obsolete.\n\nPour configurer un port en trunk : \"interface gigabitEthernet 0/1\", puis \"switchport trunk encapsulation dot1q\" (sur les switchs qui supportent plusieurs encapsulations), puis \"switchport mode trunk\". Pour securiser le trunk, specifiez les VLAN autorises : \"switchport trunk allowed vlan 10,20,30\". Cela empeche le trafic de VLAN non souhaites de traverser le lien.\n\nLe VLAN natif est le VLAN dont les trames ne sont pas etiquetees sur un trunk 802.1Q. Par defaut, c'est le VLAN 1. Pour des raisons de securite, il est recommande de changer le VLAN natif : \"switchport trunk native vlan 99\" (ou 99 est un VLAN inutilise). Assurez-vous que le VLAN natif est identique des deux cotes du trunk, sinon vous aurez des erreurs de natif VLAN mismatch."
    },
    {
      title: 'Le routage inter-VLAN (Router on a Stick)',
      content:
        "Les machines de VLAN differents ne peuvent pas communiquer entre elles sans un equipement de couche 3 (routeur ou switch multicouche). La methode la plus courante avec un routeur classique est le \"Router on a Stick\" : un seul lien physique entre le switch et le routeur transporte tous les VLAN grace au trunking.\n\nSur le routeur, on cree des sous-interfaces pour chaque VLAN. Par exemple, pour le VLAN 10 : \"interface gigabitEthernet 0/0.10\", puis \"encapsulation dot1q 10\", puis \"ip address 192.168.10.1 255.255.255.0\". Pour le VLAN 20 : \"interface gigabitEthernet 0/0.20\", puis \"encapsulation dot1q 20\", puis \"ip address 192.168.20.1 255.255.255.0\".\n\nL'interface physique principale doit etre activee avec \"no shutdown\" mais ne recoit generalement pas d'adresse IP. Chaque sous-interface sert de passerelle par defaut pour les machines de son VLAN. Le routeur route alors naturellement le trafic entre les sous-interfaces, c'est-a-dire entre les VLAN.\n\nCote switch, le port connecte au routeur doit etre configure en trunk : \"switchport mode trunk\". Cette architecture fonctionne bien pour les petits et moyens reseaux. Pour les reseaux plus importants, on privilegie les switchs multicouches (layer 3 switch) qui effectuent le routage inter-VLAN directement dans le materiel, avec des performances bien superieures."
    },
    {
      title: 'VTP : propager les VLAN automatiquement',
      content:
        "Le VTP (VLAN Trunking Protocol) est un protocole proprietaire Cisco qui permet de propager automatiquement la configuration des VLAN a travers tous les switchs d'un meme domaine VTP. Au lieu de creer manuellement les VLAN sur chaque switch, vous les creez sur un seul et VTP les propage via les liens trunk.\n\nVTP fonctionne avec trois modes. Le mode serveur (par defaut) permet de creer, modifier et supprimer des VLAN. Les modifications sont propagees a tous les switchs du domaine. Le mode client recoit et applique les modifications du serveur mais ne permet pas de les modifier localement. Le mode transparent ne participe pas a la synchronisation VTP mais transmet les annonces VTP aux autres switchs. Il permet de creer des VLAN locaux.\n\nConfiguration VTP : \"vtp domain ENTREPRISE\" pour definir le domaine, \"vtp mode server\" ou \"vtp mode client\" pour le mode, et optionnellement \"vtp password MonMotDePasse\" pour securiser les echanges. La commande \"show vtp status\" affiche la configuration courante et le numero de revision.\n\nAttention au piege du numero de revision VTP. Si vous connectez un switch avec un numero de revision superieur a celui du serveur, il peut ecraser la base de VLAN de tout le reseau. Pour reinitialiser le compteur de revision, passez le switch en mode transparent puis revenez au mode souhaite. En production, de nombreux administrateurs preferent utiliser le mode transparent ou la version VTPv3 qui offre un mecanisme de protection contre ce risque."
    },
    {
      title: 'Bonnes pratiques et securite des VLAN',
      content:
        "Pour securiser vos VLAN, appliquez les recommandations suivantes. Desactivez tous les ports inutilises avec \"shutdown\" et placez-les dans un VLAN \"parking\" non route (par exemple VLAN 999). Cela empeche un intrus de brancher un appareil et d'acceder au reseau.\n\nActivez la securite de port (port security) pour limiter le nombre d'adresses MAC autorisees par port : \"switchport port-security\", \"switchport port-security maximum 2\", \"switchport port-security violation shutdown\". Si une troisieme adresse MAC est detectee, le port se desactive automatiquement.\n\nDesactivez DTP (Dynamic Trunking Protocol) sur les ports d'acces avec \"switchport nonegotiate\". DTP peut permettre a un attaquant de negocier un trunk et ainsi acceder a tous les VLAN. Configurez explicitement chaque port en \"switchport mode access\" pour les utilisateurs et \"switchport mode trunk\" pour les liens inter-switchs.\n\nDocumentez votre plan de VLAN. Etablissez une convention de nommage claire et un tableau de correspondance VLAN-sous-reseau. Par exemple : VLAN 10 = Comptabilite = 192.168.10.0/24, VLAN 20 = Developpement = 192.168.20.0/24. Cette documentation est essentielle pour le depannage et la maintenabilite du reseau.\n\nEnfin, pensez au Spanning Tree Protocol (STP) qui evite les boucles de couche 2. Chaque VLAN peut avoir sa propre instance STP (PVST+ chez Cisco). Configurez les priorites de bridge pour maitriser l'election du root bridge et assurer un chemin optimal dans chaque VLAN."
    }
  ]
}

// ============================================================
// ARTICLE 5 — Routage statique vs dynamique
// ============================================================
const article5: BlogArticle = {
  id: 5,
  slug: 'routage-statique-dynamique',
  title: 'Routage statique vs dynamique : quand utiliser quoi',
  description: 'Comparez le routage statique et le routage dynamique (RIP, OSPF, BGP). Avantages, inconvenients et configurations Cisco pour chaque approche.',
  category: 'tutoriel',
  tags: ['routage', 'OSPF', 'RIP', 'route statique', 'protocole routage'],
  author: 'NetRevision',
  publishDate: '2026-02-17',
  readTime: '10 min',
  relatedChapters: ['routage-statique', 'routage-dynamique'],
  sections: [
    {
      title: 'Le role fondamental du routage',
      content:
        "Le routage est le processus par lequel un routeur determine le meilleur chemin pour acheminer un paquet vers sa destination. Chaque routeur maintient une table de routage qui associe des reseaux de destination a des interfaces de sortie ou des adresses de prochain saut (next-hop).\n\nLorsqu'un paquet arrive sur un routeur, celui-ci examine l'adresse IP de destination et consulte sa table de routage. Il recherche la correspondance la plus precise (longest prefix match). Par exemple, si la table contient les routes 10.0.0.0/8 et 10.1.0.0/16, un paquet destine a 10.1.5.10 sera envoye via la route /16 car elle est plus specifique.\n\nIl existe trois facons de remplir la table de routage : les reseaux directement connectes (appris automatiquement lorsqu'une interface est configuree et active), les routes statiques (configurees manuellement par l'administrateur) et les routes dynamiques (apprises via des protocoles de routage). La commande \"show ip route\" sur un routeur Cisco affiche la table de routage avec un code pour chaque type : C pour connecte, S pour statique, R pour RIP, O pour OSPF, B pour BGP."
    },
    {
      title: 'Le routage statique en detail',
      content:
        "Le routage statique consiste a definir manuellement les routes sur chaque routeur. La syntaxe Cisco est : \"ip route [reseau-destination] [masque] [next-hop ou interface-sortie]\". Par exemple : \"ip route 192.168.2.0 255.255.255.0 10.0.0.2\" indique que pour atteindre le reseau 192.168.2.0/24, le routeur doit envoyer les paquets au prochain saut 10.0.0.2.\n\nLa route par defaut (default route) est un cas particulier de route statique : \"ip route 0.0.0.0 0.0.0.0 10.0.0.1\". Elle sert de route de dernier recours quand aucune autre entree de la table ne correspond. C'est l'equivalent de la passerelle par defaut pour un PC. On la configure typiquement sur les routeurs de bordure pointant vers le FAI.\n\nAvantages du routage statique : il ne consomme aucune bande passante (pas d'echanges entre routeurs), il est simple a comprendre et a securiser (pas d'injection de routes malveillantes), il offre un controle total a l'administrateur sur les chemins empruntes par le trafic.\n\nInconvenients : il ne s'adapte pas aux changements de topologie. Si un lien tombe, le trafic sera perdu jusqu'a ce qu'un administrateur modifie la configuration. Il devient ingerable a grande echelle : dans un reseau de 50 routeurs, chaque ajout de sous-reseau necessite une modification sur potentiellement tous les routeurs. Le routage statique est donc adapte aux petits reseaux, aux liens de secours (routes flottantes) et aux connexions vers un FAI."
    },
    {
      title: 'RIP : le routage dynamique a vecteur de distance',
      content:
        "RIP (Routing Information Protocol) est le protocole de routage dynamique le plus simple. Il utilise l'algorithme a vecteur de distance : chaque routeur envoie periodiquement sa table de routage complete a ses voisins directs (toutes les 30 secondes). La metrique utilisee est le nombre de sauts (hop count), c'est-a-dire le nombre de routeurs a traverser pour atteindre la destination.\n\nRIPv1, la premiere version, ne supporte pas le VLSM (pas de masques dans les mises a jour) et envoie ses mises a jour en broadcast. RIPv2 corrige ces limitations : il inclut le masque de sous-reseau dans les mises a jour, utilise le multicast (224.0.0.9) et supporte l'authentification.\n\nConfiguration RIPv2 sur un routeur Cisco : \"router rip\", puis \"version 2\", puis \"network 192.168.1.0\" pour chaque reseau directement connecte a annoncer. La commande \"no auto-summary\" est essentielle pour desactiver le resume automatique des routes aux frontieres de classes.\n\nLa limitation majeure de RIP est sa metrique : le nombre de sauts maximum est 15 (16 = inaccessible). RIP ne tient pas compte de la bande passante des liens. Un chemin de 3 sauts via des liens a 10 Mbps sera prefere a un chemin de 4 sauts via des liens a 10 Gbps. De plus, la convergence est lente : apres un changement de topologie, il peut s'ecouler plusieurs minutes avant que tous les routeurs aient une vision coherente du reseau. Pour ces raisons, RIP est rarement utilise en production aujourd'hui, mais il reste un excellent outil pedagogique."
    },
    {
      title: 'OSPF : le protocole a etat de lien',
      content:
        "OSPF (Open Shortest Path First) est le protocole de routage dynamique le plus deploye dans les reseaux d'entreprise. Contrairement a RIP, OSPF utilise l'algorithme a etat de lien de Dijkstra. Chaque routeur construit une carte complete de la topologie du reseau et calcule le chemin le plus court vers chaque destination.\n\nOSPF echange des LSA (Link State Advertisements) qui decrivent les liens de chaque routeur. Ces LSA sont stockes dans la LSDB (Link State Database), identique sur tous les routeurs d'une meme zone. La metrique OSPF est le cout, calcule a partir de la bande passante des interfaces : cout = bande passante de reference / bande passante de l'interface. Par defaut, la reference est 100 Mbps.\n\nOSPF utilise le concept de zones (areas) pour limiter la taille de la LSDB et reduire le trafic de routage. Toutes les zones doivent etre connectees a la zone backbone (area 0). Les routeurs de bordure de zone (ABR) connectent les zones non-backbone a l'area 0.\n\nConfiguration de base sur Cisco : \"router ospf 1\" (ou 1 est le process ID, local au routeur), puis \"network 192.168.1.0 0.0.0.255 area 0\" pour chaque reseau. Notez l'utilisation du wildcard mask et non du masque de sous-reseau. La commande \"show ip ospf neighbor\" permet de verifier les adjacences, et \"show ip ospf database\" affiche la LSDB.\n\nLa convergence OSPF est rapide : en cas de panne d'un lien, le routeur detecteur envoie immediatement un LSA de mise a jour a tous les routeurs de la zone. La nouvelle route est calculee en quelques secondes."
    },
    {
      title: 'BGP : le routage entre systemes autonomes',
      content:
        "BGP (Border Gateway Protocol) est le protocole de routage qui fait fonctionner Internet. Alors que RIP et OSPF sont des protocoles IGP (Interior Gateway Protocol) utilises a l'interieur d'une organisation, BGP est un protocole EGP (Exterior Gateway Protocol) utilise entre les systemes autonomes (AS).\n\nUn systeme autonome est un ensemble de reseaux administres par une meme entite et partageant une politique de routage commune. Chaque AS est identifie par un numero (ASN). BGP echange des informations de joignabilite entre AS : il annonce les prefixes IP qu'un AS sait atteindre, avec le chemin d'AS a traverser (AS-PATH).\n\nBGP utilise TCP (port 179) pour ses communications, contrairement a OSPF et RIP qui utilisent leurs propres mecanismes de transport. La session BGP entre deux routeurs est appelee peering. On distingue eBGP (External BGP, entre AS differents) et iBGP (Internal BGP, au sein du meme AS).\n\nLa selection de route BGP ne repose pas sur une simple metrique mais sur un processus de decision multi-criteres : poids local, LOCAL_PREF, routes auto-generees, AS-PATH le plus court, origine, MED, eBGP vs iBGP, et d'autres encore. Cette richesse de criteres permet aux operateurs de definir des politiques de routage complexes.\n\nBGP n'est pas au programme detaille du CCNA, mais comprendre son role est essentiel pour apprehender l'architecture d'Internet. En tant qu'administrateur, vous interagirez avec BGP lors de la configuration de la connexion de votre reseau a un ou plusieurs fournisseurs d'acces."
    },
    {
      title: 'Comment choisir entre statique et dynamique',
      content:
        "Le choix entre routage statique et dynamique depend de la taille du reseau, de sa complexite et des exigences de disponibilite.\n\nUtilisez le routage statique pour les petits reseaux (2-3 routeurs) ou la topologie change rarement, pour les connexions stub (un seul chemin de sortie, comme un site distant connecte au siege par un seul lien), pour la route par defaut vers le FAI et pour les routes flottantes (routes de secours avec une distance administrative superieure).\n\nUtilisez OSPF pour les reseaux d'entreprise de taille moyenne a grande qui necessitent une convergence rapide et une adaptation automatique aux changements de topologie. OSPF est le choix standard pour les reseaux internes multi-sites. Utilisez BGP uniquement si vous avez plusieurs connexions a Internet (multihoming) ou si vous etes un fournisseur de services.\n\nUne approche hybride est courante en pratique : OSPF pour le routage interne, des routes statiques pour la sortie vers Internet et des routes flottantes comme plan de secours. Par exemple, une route statique vers le FAI principal avec une distance administrative de 1 et une route statique vers le FAI secondaire avec une distance administrative de 10. Si le lien principal tombe, la route secondaire prend automatiquement le relais.\n\nLa distance administrative (AD) determine la priorite entre les sources de routage : connecte = 0, statique = 1, OSPF = 110, RIP = 120. Plus la valeur est basse, plus la source est fiable. Si un meme reseau est appris par OSPF et par une route statique, la route statique sera preferee."
    }
  ]
}

// ============================================================
// ARTICLE 6 — TCP vs UDP
// ============================================================
const article6: BlogArticle = {
  id: 6,
  slug: 'comprendre-tcp-udp',
  title: "TCP vs UDP : differences et cas d'usage",
  description: "Comprenez les differences entre TCP et UDP : handshake, fiabilite, ports, controle de flux. Guide complet pour la couche transport du modele OSI.",
  category: 'tutoriel',
  tags: ['TCP', 'UDP', 'transport', 'handshake', 'ports'],
  author: 'NetRevision',
  publishDate: '2026-02-17',
  readTime: '9 min',
  relatedChapters: ['tcp-udp'],
  sections: [
    {
      title: 'La couche transport : role et enjeux',
      content:
        "La couche transport (couche 4 du modele OSI) assure la communication logique entre les processus applicatifs s'executant sur des hotes differents. Alors que la couche reseau (couche 3) achemine les paquets entre machines, la couche transport achemine les donnees entre applications grace aux numeros de port.\n\nUn numero de port est un entier sur 16 bits (de 0 a 65535) qui identifie un processus ou un service sur une machine. Lorsqu'un navigateur se connecte a un serveur web, le serveur ecoute sur le port 80 (HTTP) ou 443 (HTTPS). Le navigateur utilise un port source ephemere (generalement entre 49152 et 65535) alloue dynamiquement par le systeme d'exploitation.\n\nLe couple (adresse IP source, port source, adresse IP destination, port destination, protocole) forme un quintuplet qui identifie de maniere unique chaque flux de communication. C'est ce mecanisme qui permet a un meme PC d'avoir simultanement plusieurs onglets de navigateur ouverts vers le meme serveur web : chaque connexion utilise un port source different.\n\nLes deux protocoles de transport principaux sont TCP et UDP. Ils repondent a des besoins differents et le choix de l'un ou l'autre depend des exigences de l'application en termes de fiabilite, de latence et de surcharge."
    },
    {
      title: 'TCP : le protocole fiable et connecte',
      content:
        "TCP (Transmission Control Protocol) est un protocole connecte qui garantit la livraison ordonnee et sans erreur des donnees. Avant tout transfert, TCP etablit une connexion via le mecanisme du three-way handshake en trois etapes.\n\nPremiere etape : le client envoie un segment avec le flag SYN (Synchronize) active et un numero de sequence initial (ISN). Deuxieme etape : le serveur repond avec un segment SYN-ACK contenant son propre ISN et l'acquittement du SYN du client. Troisieme etape : le client envoie un ACK confirmant la reception du SYN du serveur. La connexion est alors etablie et les donnees peuvent circuler dans les deux sens (full-duplex).\n\nTCP utilise les numeros de sequence pour ordonner les segments et detecter les pertes. Chaque octet envoye est numerote. Le recepteur envoie des acquittements (ACK) indiquant le prochain octet attendu. Si un ACK n'est pas recu dans un delai imparti (timeout), l'emetteur retransmet le segment manquant.\n\nLe controle de flux TCP utilise le mecanisme de fenetre glissante (sliding window). Le recepteur annonce la taille de sa fenetre de reception, indiquant combien de donnees il peut accepter avant d'etre sature. L'emetteur ne doit pas envoyer plus de donnees que la fenetre le permet, ce qui evite la saturation du recepteur.\n\nLa fermeture de connexion se fait par un four-way handshake : FIN, ACK, FIN, ACK. Chaque partie ferme independamment son sens de communication."
    },
    {
      title: 'UDP : la rapidite avant tout',
      content:
        "UDP (User Datagram Protocol) est un protocole non connecte et non fiable. Il n'etablit pas de connexion prealable, ne garantit pas la livraison, ne reordonne pas les datagrammes et ne controle pas le flux. En contrepartie, son en-tete est minimal (8 octets contre 20 pour TCP), il n'ajoute aucun delai d'etablissement de connexion et n'impose aucune surcharge de retransmission.\n\nL'en-tete UDP contient uniquement quatre champs : port source (16 bits), port destination (16 bits), longueur (16 bits) et checksum (16 bits, optionnel en IPv4, obligatoire en IPv6). Cette simplicite fait d'UDP un protocole extremement efficace pour les applications qui privilegient la vitesse.\n\nUDP est le choix naturel pour les applications temps reel : la VoIP (protocole SIP, RTP), le streaming video, les jeux en ligne. Dans ces cas, recevoir un paquet en retard est pire que de le perdre. Si un echantillon audio de 20 ms est perdu, le codec de la VoIP peut le masquer par interpolation. Mais recevoir cet echantillon 500 ms plus tard (apres retransmission TCP) provoquerait un decalage inacceptable.\n\nDNS utilise egalement UDP (port 53) pour les requetes standards. Une requete DNS tient generalement dans un seul datagramme, donc l'overhead d'une connexion TCP serait disproportionne. Cependant, les transferts de zone DNS (AXFR) et les reponses depassant 512 octets utilisent TCP.\n\nDHCP fonctionne aussi sur UDP (ports 67 et 68) car au moment de la requete DHCP, le client n'a pas encore d'adresse IP et ne peut donc pas etablir une connexion TCP."
    },
    {
      title: 'Les ports essentiels a connaitre',
      content:
        "Les ports sont repartis en trois plages. Les ports bien connus (well-known ports, 0 a 1023) sont reserves aux services standards et necessitent generalement des privileges administrateur pour etre utilises. Les ports enregistres (registered ports, 1024 a 49151) sont attribues par l'IANA a des applications specifiques. Les ports dynamiques ou ephemeres (49152 a 65535) sont utilises par les clients.\n\nVoici les ports TCP essentiels : FTP Data sur le port 20, FTP Control sur le port 21, SSH sur le port 22, Telnet sur le port 23, SMTP sur le port 25, HTTP sur le port 80, POP3 sur le port 110, IMAP sur le port 143, HTTPS sur le port 443, et RDP (Remote Desktop) sur le port 3389.\n\nLes ports UDP essentiels : DNS sur le port 53 (aussi TCP), DHCP serveur sur le port 67 et client sur le port 68, TFTP sur le port 69, SNMP sur le port 161, et NTP sur le port 123.\n\nCertains services utilisent a la fois TCP et UDP. DNS est le cas le plus courant : requetes simples en UDP, transferts de zone et reponses volumineuses en TCP. Les numeros de port TCP et UDP sont independants : TCP 53 et UDP 53 sont deux services differents (meme s'ils correspondent tous deux a DNS).\n\nConseils pour la certification : memorisez les ports les plus courants. Une question classique consiste a identifier quel protocole utilise tel port ou quel port est associe a tel service. Pensez aussi a la securite : les ports ouverts inutilement sont des vecteurs d'attaque."
    },
    {
      title: 'Comparaison detaillee TCP vs UDP',
      content:
        "Voici une comparaison structuree des deux protocoles. En termes de fiabilite, TCP garantit la livraison grace aux acquittements et aux retransmissions, tandis qu'UDP ne fournit aucune garantie. TCP livre les donnees dans l'ordre grace aux numeros de sequence, UDP ne reordonne pas les datagrammes.\n\nEn termes de connexion, TCP est connecte (three-way handshake avant le transfert), UDP est non connecte (envoi immediat). TCP maintient un etat de connexion sur les deux extremites, consommant de la memoire. UDP est stateless, ce qui le rend plus leger pour le serveur.\n\nEn termes de performances, TCP ajoute un overhead significatif : en-tete de 20 octets minimum, delai d'etablissement de connexion, mecanismes de retransmission et de controle de congestion. UDP a un en-tete de 8 octets seulement et n'introduit aucun delai supplementaire.\n\nEn termes de controle de flux, TCP adapte automatiquement le debit grace a la fenetre glissante et les algorithmes de controle de congestion (slow start, congestion avoidance). UDP n'a aucun mecanisme de controle : l'application envoie a la vitesse qu'elle souhaite, quitte a saturer le reseau.\n\nPour choisir entre TCP et UDP, posez-vous la question : l'application a-t-elle besoin que chaque octet arrive sans erreur et dans l'ordre ? Si oui, utilisez TCP (transfert de fichiers, email, web). L'application est-elle sensible a la latence et tolere-t-elle des pertes occasionnelles ? Si oui, UDP est preferable (temps reel, streaming, gaming)."
    },
    {
      title: 'Depannage de la couche transport',
      content:
        "Le depannage de la couche transport repose sur des outils qui analysent les connexions TCP/UDP et les ports en ecoute. La commande \"netstat -an\" (ou \"ss -tuln\" sous Linux) affiche les ports en ecoute et les connexions etablies. Si un service ne repond pas, verifiez d'abord qu'il ecoute bien sur le bon port.\n\nL'outil Wireshark est indispensable pour analyser le trafic au niveau segment. Vous pouvez observer le three-way handshake, les retransmissions TCP, les resets (RST) et les problemes de fenetre. Un RST (Reset) indique une connexion refusee : soit le port n'est pas en ecoute, soit un pare-feu bloque la connexion.\n\nSur un routeur ou switch Cisco, la commande \"show ip nat translations\" permet de verifier que la traduction NAT fonctionne correctement pour les ports. \"debug ip tcp transactions\" affiche en temps reel les evenements TCP, utile pour identifier les connexions qui echouent.\n\nProblemes courants a la couche transport : un pare-feu bloque un port necessaire (verifiez les ACL et les regles du firewall), une application ecoute sur la mauvaise interface (127.0.0.1 vs 0.0.0.0), le NAT ne traduit pas correctement les ports (verifiez les regles PAT), ou la congestion reseau provoque des retransmissions excessives (verifiez la bande passante et la charge du lien).\n\nUn test simple pour verifier la connectivite TCP vers un port specifique est la commande \"telnet [adresse] [port]\" ou \"Test-NetConnection\" sous PowerShell. Si la connexion s'etablit, le service est joignable. Sinon, le probleme peut etre reseau (couche 3), filtrage (ACL, firewall) ou applicatif (service arrete)."
    }
  ]
}

// ============================================================
// ARTICLE 7 — DNS et DHCP
// ============================================================
const article7: BlogArticle = {
  id: 7,
  slug: 'dns-dhcp-fonctionnement',
  title: 'DNS et DHCP : comment ca marche',
  description: 'Comprendre le fonctionnement de DNS et DHCP : resolution de noms, types d\'enregistrements, processus DORA et configuration pratique.',
  category: 'tutoriel',
  tags: ['DNS', 'DHCP', 'resolution', 'serveur', 'adresse IP'],
  author: 'NetRevision',
  publishDate: '2026-02-17',
  readTime: '10 min',
  relatedChapters: ['dns-dhcp'],
  sections: [
    {
      title: 'DNS : le systeme de noms de domaine',
      content:
        "Le DNS (Domain Name System) est le service qui traduit les noms de domaine lisibles par les humains (comme www.example.com) en adresses IP exploitables par les machines (comme 93.184.216.34). Sans DNS, il faudrait memoriser l'adresse IP de chaque site web que l'on souhaite visiter.\n\nLe DNS repose sur une architecture hierarchique et distribuee. Au sommet se trouvent les serveurs racine (root servers), identifies par des lettres de A a M. En dessous viennent les serveurs TLD (Top-Level Domain) qui gerent les extensions comme .com, .fr, .org. Puis les serveurs autoritaires qui contiennent les enregistrements des domaines specifiques.\n\nLorsque vous tapez www.example.com dans votre navigateur, votre machine interroge d'abord son cache DNS local. Si l'adresse n'y est pas, elle envoie une requete au serveur DNS recursif configure (generalement celui de votre FAI ou un service comme 8.8.8.8 de Google). Ce serveur recursif va alors interroger successivement les serveurs racine, TLD et autoritaires pour obtenir la reponse. Il met ensuite le resultat en cache pour une duree definie par le TTL (Time To Live).\n\nCette architecture distribuee est l'un des systemes les plus robustes d'Internet. Meme si plusieurs serveurs racine tombent en panne, le systeme continue de fonctionner grace a la redondance et au cache."
    },
    {
      title: 'Les types d\'enregistrements DNS',
      content:
        "Chaque zone DNS contient plusieurs types d'enregistrements (Resource Records) qui servent des roles differents.\n\nL'enregistrement A (Address) associe un nom de domaine a une adresse IPv4. Exemple : www.example.com A 93.184.216.34. C'est le type le plus courant. L'enregistrement AAAA (quad-A) est l'equivalent pour IPv6 : www.example.com AAAA 2606:2800:220:1:248:1893:25c8:1946.\n\nL'enregistrement CNAME (Canonical Name) cree un alias vers un autre nom de domaine. Exemple : blog.example.com CNAME www.example.com. Le client resout d'abord le CNAME, puis l'enregistrement A associe. Attention : un CNAME ne peut pas coexister avec d'autres enregistrements pour le meme nom.\n\nL'enregistrement MX (Mail Exchanger) indique les serveurs de messagerie responsables de la reception des emails pour un domaine. Exemple : example.com MX 10 mail1.example.com et example.com MX 20 mail2.example.com. Le nombre (priorite) determine l'ordre de preference : le serveur avec la priorite la plus basse est contacte en premier.\n\nL'enregistrement NS (Name Server) identifie les serveurs DNS autoritaires pour une zone. L'enregistrement PTR (Pointer) effectue la resolution inverse : d'une adresse IP vers un nom (utilise dans la zone in-addr.arpa). L'enregistrement SOA (Start of Authority) contient les parametres de la zone : serveur principal, email de l'administrateur, numero de serie, intervalles de rafraichissement.\n\nL'enregistrement TXT sert a stocker du texte arbitraire, souvent utilise pour la verification de domaine (SPF, DKIM, DMARC pour l'anti-spam)."
    },
    {
      title: 'Le processus de resolution DNS en detail',
      content:
        "Detaillons le processus complet de resolution pour www.example.com depuis un poste client.\n\nEtape 1 : le client verifie son cache DNS local. Sous Windows, la commande \"ipconfig /displaydns\" affiche le cache. Si une entree valide existe (TTL non expire), la resolution est terminee sans aucune requete reseau.\n\nEtape 2 : le client consulte le fichier hosts local (/etc/hosts sous Linux, C:\\Windows\\System32\\drivers\\etc\\hosts sous Windows). Ce fichier permet de forcer des correspondances nom-IP en local, utile pour le developpement ou le blocage de sites.\n\nEtape 3 : le client envoie une requete recursive a son serveur DNS configure. Cette requete demande au serveur de fournir la reponse finale, et non une simple redirection. Le serveur DNS recursif prend en charge la totalite de la resolution.\n\nEtape 4 : le serveur recursif interroge un serveur racine avec une requete iterative. Le serveur racine repond avec l'adresse des serveurs TLD pour .com. Etape 5 : le serveur recursif interroge le serveur TLD .com, qui repond avec l'adresse des serveurs autoritaires pour example.com. Etape 6 : le serveur recursif interroge le serveur autoritaire pour example.com, qui renvoie l'adresse IP associee a www.\n\nLe serveur recursif met en cache chaque reponse et transmet le resultat final au client. Pour depanner, les commandes \"nslookup\" et \"dig\" permettent de tester la resolution DNS manuellement. \"dig www.example.com +trace\" affiche chaque etape de la resolution, ce qui est tres utile pour localiser un probleme."
    },
    {
      title: 'DHCP : attribution automatique des adresses IP',
      content:
        "Le DHCP (Dynamic Host Configuration Protocol) automatise la configuration reseau des postes clients. Sans DHCP, chaque machine devrait etre configuree manuellement avec une adresse IP, un masque, une passerelle et des serveurs DNS. Dans un reseau de centaines de postes, cette gestion manuelle serait un cauchemar.\n\nDHCP fonctionne en mode client-serveur. Le serveur DHCP gere un pool d'adresses (scope) et attribue temporairement une adresse a chaque client qui en fait la demande. L'attribution est un bail (lease) d'une duree configurable (par defaut 8 jours sur un serveur Windows, 24 heures sur un routeur Cisco).\n\nOutre l'adresse IP, le serveur DHCP peut fournir de nombreux parametres : le masque de sous-reseau, la passerelle par defaut (option 3), les serveurs DNS (option 6), le nom de domaine (option 15), le serveur NTP (option 42), et bien d'autres. Ces options sont definies dans la RFC 2132.\n\nIl est possible de reservir une adresse specifique pour un client en se basant sur son adresse MAC. Cette fonctionnalite, appelee reservation DHCP, est utile pour les serveurs ou les imprimantes qui ont besoin d'une adresse fixe mais dont on souhaite centraliser la gestion.\n\nSur un routeur Cisco, la configuration d'un pool DHCP se fait ainsi : \"ip dhcp pool LAN\", \"network 192.168.1.0 255.255.255.0\", \"default-router 192.168.1.1\", \"dns-server 8.8.8.8\", \"lease 7\" (bail de 7 jours). Pour exclure des adresses du pool (reservees aux equipements statiques) : \"ip dhcp excluded-address 192.168.1.1 192.168.1.10\"."
    },
    {
      title: 'Le processus DORA du DHCP',
      content:
        "L'obtention d'une adresse DHCP suit le processus DORA, un acronyme pour les quatre messages echanges entre le client et le serveur.\n\nD - Discover : le client, qui n'a pas encore d'adresse IP, envoie un message DHCP Discover en broadcast (destination 255.255.255.255, port UDP 67). L'adresse source est 0.0.0.0 car le client n'a pas d'adresse. Ce message atteint tous les serveurs DHCP presents sur le segment reseau.\n\nO - Offer : chaque serveur DHCP qui recoit le Discover repond avec un message DHCP Offer contenant une proposition d'adresse IP, le masque, la passerelle, les serveurs DNS, et la duree du bail. Le serveur reserve temporairement l'adresse proposee pour eviter de la proposer a un autre client.\n\nR - Request : le client choisit une offre (generalement la premiere recue) et envoie un message DHCP Request en broadcast pour informer tous les serveurs de son choix. Les serveurs non retenus liberent l'adresse qu'ils avaient proposee.\n\nA - Acknowledge : le serveur retenu confirme l'attribution avec un message DHCP Acknowledge. Le client peut alors configurer son interface avec les parametres recus et commencer a communiquer sur le reseau.\n\nA mi-bail, le client tente de renouveler son adresse en envoyant un DHCP Request directement au serveur (unicast). Si le serveur accepte, il repond par un ACK et le bail est prolonge. Si le serveur ne repond pas, le client reessaie a 87.5 % du bail en broadcast. Si le bail expire sans renouvellement, le client doit recommencer le processus DORA complet."
    },
    {
      title: 'DHCP Relay et depannage',
      content:
        "Les messages DHCP Discover etant envoyes en broadcast, ils ne traversent pas les routeurs par defaut. Comment un client dans un sous-reseau distant peut-il alors atteindre le serveur DHCP situe dans un autre sous-reseau ?\n\nLa solution est le DHCP Relay Agent (ou IP Helper). Sur le routeur qui fait office de passerelle pour le sous-reseau des clients, on configure l'adresse du serveur DHCP : \"interface gigabitEthernet 0/0\" puis \"ip helper-address 10.0.0.100\" (ou 10.0.0.100 est l'adresse du serveur DHCP). Le routeur intercepte les broadcasts DHCP et les retransmet en unicast au serveur DHCP. Il ajoute dans le champ GIADDR (Gateway IP Address) l'adresse de son interface, ce qui permet au serveur DHCP de determiner dans quel pool piocher l'adresse.\n\nPour depanner DHCP, suivez cette demarche systematique. Verifiez la connectivite physique (couche 1) : le cable est-il branche, le lien est-il actif ? Verifiez que le serveur DHCP est operationnel et que le pool contient des adresses disponibles. Sur Windows, \"ipconfig /all\" affiche la configuration DHCP du poste, \"ipconfig /release\" libere le bail et \"ipconfig /renew\" force une nouvelle demande.\n\nSur un routeur Cisco, \"show ip dhcp binding\" affiche les baux actifs, \"show ip dhcp pool\" montre les statistiques du pool (adresses utilisees/disponibles), et \"debug ip dhcp server events\" affiche les echanges DHCP en temps reel.\n\nLes problemes DHCP les plus frequents sont : un serveur DHCP pirate (rogue DHCP) qui distribue de mauvaises adresses (solution : DHCP Snooping sur le switch), un pool epuise (pas assez d'adresses pour le nombre de clients), ou un ip helper-address manquant sur le routeur lorsque le serveur est dans un autre sous-reseau."
    }
  ]
}

// ============================================================
// ARTICLE 8 — Securiser un reseau avec les ACL
// ============================================================
const article8: BlogArticle = {
  id: 8,
  slug: 'securiser-reseau-acl',
  title: 'Securiser un reseau avec les ACL',
  description: 'Apprenez a configurer les ACL standard et etendues sur un routeur Cisco. Wildcard masks, regles de filtrage et bonnes pratiques de securite reseau.',
  category: 'tutoriel',
  tags: ['ACL', 'securite', 'access list', 'Cisco', 'filtrage'],
  author: 'NetRevision',
  publishDate: '2026-02-17',
  readTime: '11 min',
  relatedChapters: ['acl-access-control', 'securite-avancee'],
  sections: [
    {
      title: 'Qu\'est-ce qu\'une ACL et pourquoi l\'utiliser',
      content:
        "Une ACL (Access Control List) est un ensemble ordonne de regles appliquees sur un routeur ou un switch de couche 3 pour filtrer le trafic reseau. Chaque regle (ACE, Access Control Entry) definit une condition de correspondance et une action : permit (autoriser) ou deny (refuser).\n\nLes ACL repondent a plusieurs besoins. Le filtrage de securite : empecher un reseau d'acceder a un autre, bloquer certains protocoles ou ports, proteger les equipements d'administration. Le controle du trafic : limiter l'acces a Internet depuis certains VLAN, autoriser uniquement le trafic necessaire. Et des usages indirects : selection du trafic pour le NAT, identification des routes dans les route-maps, classification QoS.\n\nLe fonctionnement d'une ACL est sequentiel : lorsqu'un paquet arrive, le routeur compare le paquet a chaque regle dans l'ordre, de la premiere a la derniere. Des qu'une correspondance est trouvee, l'action associee (permit ou deny) est executee et les regles suivantes ne sont pas evaluees. Si aucune regle ne correspond, le paquet est rejete par la regle implicite \"deny any\" presente a la fin de toute ACL.\n\nCette regle implicite est un piege classique : si votre ACL ne contient que des regles deny, tout le trafic sera bloque, meme celui qui ne correspond a aucune regle explicite. Il faut toujours terminer une ACL par un \"permit\" pour le trafic que l'on souhaite autoriser."
    },
    {
      title: 'ACL standard : filtrage par adresse source',
      content:
        "Les ACL standard filtrent le trafic uniquement sur l'adresse IP source du paquet. Elles sont identifiees par un numero compris entre 1 et 99 (ou 1300 a 1999 pour l'etendue). Leur simplicite les rend rapides a configurer mais limitees en precision.\n\nSyntaxe : \"access-list [numero] [permit|deny] [adresse-source] [wildcard-mask]\". Exemple : \"access-list 10 permit 192.168.1.0 0.0.0.255\" autorise tout le trafic provenant du reseau 192.168.1.0/24. \"access-list 10 deny host 192.168.1.100\" bloque specifiquement l'hote 192.168.1.100 (le mot-cle \"host\" est equivalent au wildcard 0.0.0.0).\n\nLe wildcard mask (masque inverse) definit quels bits de l'adresse doivent correspondre. Un bit a 0 dans le wildcard signifie que le bit correspondant de l'adresse doit correspondre exactement. Un bit a 1 signifie que le bit peut prendre n'importe quelle valeur. Ainsi, le wildcard 0.0.0.255 verifie les trois premiers octets et ignore le dernier. Le wildcard 0.0.0.0 verifie tous les bits (un seul hote). Le mot-cle \"any\" est equivalent au wildcard 255.255.255.255 (toutes les adresses).\n\nUne fois l'ACL creee, elle doit etre appliquee a une interface dans une direction : \"interface gigabitEthernet 0/0\" puis \"ip access-group 10 in\" (filtrage du trafic entrant) ou \"ip access-group 10 out\" (filtrage du trafic sortant). La regle d'or pour les ACL standard est de les placer au plus pres de la destination, car elles ne filtrent que l'adresse source et pourraient bloquer du trafic legitime si elles sont placees trop tot dans le chemin."
    },
    {
      title: 'ACL etendues : filtrage precis',
      content:
        "Les ACL etendues offrent un filtrage beaucoup plus granulaire que les ACL standard. Elles peuvent filtrer sur l'adresse source, l'adresse destination, le protocole (TCP, UDP, ICMP, IP), les ports source et destination, et meme certains flags TCP.\n\nLeur numerotation va de 100 a 199 (ou 2000 a 2699). Syntaxe : \"access-list [numero] [permit|deny] [protocole] [source] [wildcard-source] [operateur port-source] [destination] [wildcard-destination] [operateur port-destination]\".\n\nExemples concrets. Pour autoriser l'acces HTTP vers un serveur web : \"access-list 110 permit tcp any host 10.0.0.100 eq 80\". Pour bloquer le ping (ICMP) depuis un reseau specifique : \"access-list 110 deny icmp 192.168.1.0 0.0.0.255 any\". Pour autoriser SSH vers les routeurs : \"access-list 110 permit tcp 172.16.0.0 0.0.255.255 host 10.0.0.1 eq 22\".\n\nLes operateurs disponibles pour les ports sont : eq (egal), neq (different), gt (superieur), lt (inferieur), range (plage). Exemple avec range : \"access-list 110 permit tcp any host 10.0.0.100 range 80 443\" autorise le trafic HTTP et HTTPS.\n\nLa regle d'or pour les ACL etendues est de les placer au plus pres de la source du trafic a filtrer. Comme elles identifient precisement le trafic cible, elles peuvent le bloquer sans affecter le reste du trafic, evitant ainsi de consommer inutilement de la bande passante sur les liens intermediaires."
    },
    {
      title: 'ACL nommees et bonnes pratiques',
      content:
        "Les ACL nommees remplacent le numero par un nom significatif, ce qui ameliore la lisibilite et la maintenance. Syntaxe : \"ip access-list [standard|extended] [nom]\", puis ajout des regles dans le mode de configuration de l'ACL.\n\nExemple : \"ip access-list extended FILTRAGE_WEB\", puis \"permit tcp 192.168.10.0 0.0.0.255 any eq 80\", \"permit tcp 192.168.10.0 0.0.0.255 any eq 443\", \"deny ip any any log\". L'avantage majeur des ACL nommees est la possibilite de modifier une regle specifique sans supprimer toute l'ACL. Vous pouvez inserer ou supprimer des lignes grace aux numeros de sequence.\n\nBonnes pratiques de conception des ACL. Premierement, placez les regles les plus specifiques en premier et les plus generales en dernier. Le routeur s'arrete a la premiere correspondance, donc l'ordre est crucial. Deuxiemement, documentez chaque ACL avec des commentaires : \"remark Autorise le trafic web vers le serveur DMZ\". Troisiemement, utilisez le mot-cle \"log\" a la fin des regles critiques pour generer un journal des correspondances.\n\nQuatriemement, adoptez une approche de liste blanche (deny all sauf ce qui est explicitement autorise) pour les zones sensibles comme la DMZ, et une approche de liste noire (permit all sauf ce qui est explicitement bloque) pour le trafic interne. Cinquiemement, testez toujours vos ACL avant de les appliquer en production. Une erreur de wildcard mask peut bloquer tout le trafic ou, pire, ne rien filtrer du tout."
    },
    {
      title: 'Exercice pratique : securiser un reseau a trois zones',
      content:
        "Scenario : un reseau comprend trois zones : LAN interne (192.168.10.0/24), DMZ avec un serveur web (172.16.0.0/24) et Internet. Le routeur possede trois interfaces : Gi0/0 vers le LAN, Gi0/1 vers la DMZ et Gi0/2 vers Internet. Objectif : autoriser le LAN a tout acceder, la DMZ uniquement accessible en HTTP/HTTPS, et bloquer les acces depuis Internet vers le LAN.\n\nACL pour l'interface vers Internet (Gi0/2, direction in) : \"ip access-list extended INTERNET_IN\". Regles : \"permit tcp any host 172.16.0.10 eq 80\" (acces HTTP au serveur web), \"permit tcp any host 172.16.0.10 eq 443\" (acces HTTPS), \"permit tcp any any established\" (autoriser les reponses aux connexions initiees depuis le LAN, grace au flag ACK), \"deny ip any any log\" (bloquer et journaliser tout le reste).\n\nACL pour l'interface vers la DMZ (Gi0/1, direction in) : \"ip access-list extended DMZ_IN\". Regles : \"permit tcp host 172.16.0.10 any eq 53\" (le serveur peut faire des requetes DNS), \"permit udp host 172.16.0.10 any eq 53\", \"permit tcp host 172.16.0.10 eq 80 any established\" (reponses HTTP), \"deny ip any 192.168.10.0 0.0.0.255\" (bloquer tout acces de la DMZ vers le LAN), \"permit ip any any\" (autoriser le reste).\n\nApplication : \"interface Gi0/2\" puis \"ip access-group INTERNET_IN in\", et \"interface Gi0/1\" puis \"ip access-group DMZ_IN in\". Verifiez avec \"show access-lists\" pour voir les compteurs de correspondances."
    },
    {
      title: 'Depannage des ACL',
      content:
        "Le depannage des ACL est une competence essentielle car une ACL mal configuree peut couper l'acces a des services ou, inversement, laisser passer du trafic non souhaite.\n\nPremier reflexe : verifier la configuration avec \"show access-lists\" qui affiche toutes les ACL avec leurs compteurs de hit. Si une regle a zero correspondance alors que du trafic devrait la declencher, soit le trafic ne passe pas par cette interface, soit la regle est mal ecrite. La commande \"show ip interface [interface]\" confirme quelle ACL est appliquee et dans quelle direction.\n\nErreurs courantes a verifier. L'ordre des regles : si un \"deny any\" est place avant une regle permit specifique, cette derniere ne sera jamais atteinte. Le wildcard mask incorrect : 0.0.0.255 et 0.0.255.255 ne filtrent pas du tout la meme chose. Oubli de la regle \"permit\" de fin : sans elle, le \"deny any\" implicite bloque tout le trafic non explicitement autorise.\n\nDirection d'application erronee : \"in\" filtre le trafic entrant dans l'interface (avant le routage), \"out\" filtre le trafic sortant (apres le routage). Se tromper de direction est une erreur frequente qui rend l'ACL totalement inefficace.\n\nOubli du trafic de retour : si vous autorisez le trafic sortant vers un serveur web mais pas le trafic de retour, les reponses seront bloquees. Utilisez le mot-cle \"established\" pour les ACL etendues TCP, ou mieux, passez aux ACL reflexives ou aux zones-based firewalls pour un suivi d'etat.\n\nPour tester une ACL sans risque, ajoutez le mot-cle \"log\" a vos regles. Cela genere un message syslog a chaque correspondance, ce qui permet de voir en temps reel quel trafic est affecte. Retirez le \"log\" apres le depannage car il consomme des ressources CPU sur le routeur."
    }
  ]
}

// ============================================================
// ARTICLE 9 — Preparation CCNA 200-301
// ============================================================
const article9: BlogArticle = {
  id: 9,
  slug: 'preparation-ccna-200-301',
  title: 'Preparer le CCNA 200-301 : guide complet',
  description: 'Guide complet pour preparer et reussir la certification CCNA 200-301. Structure de l\'examen, plan de revision, ressources et conseils pratiques.',
  category: 'certification',
  tags: ['CCNA', 'certification', 'Cisco', '200-301', 'examen'],
  author: 'NetRevision',
  publishDate: '2026-02-18',
  readTime: '12 min',
  relatedChapters: ['modele-osi', 'ipv4-ipv6', 'routage-dynamique'],
  sections: [
    {
      title: 'Presentation de l\'examen CCNA 200-301',
      content:
        "La certification CCNA (Cisco Certified Network Associate) est la certification reseau la plus reconnue au monde. Depuis fevrier 2020, Cisco a fusionne toutes les specialisations en un seul examen : le CCNA 200-301. Cet examen couvre un large spectre de technologies reseau, de la couche physique jusqu'a l'automatisation.\n\nL'examen dure 120 minutes et comprend entre 100 et 120 questions. Les types de questions incluent des QCM classiques, des questions a reponses multiples, des exercices de drag-and-drop et des simulations de configuration sur des equipements Cisco. Le score de reussite n'est pas fixe : Cisco utilise un systeme de notation dynamique sur une echelle de 300 a 1000, avec un seuil generalement situe autour de 825.\n\nLe cout de l'examen est de 330 dollars (environ 300 euros). Il se passe dans un centre de test Pearson VUE. La certification est valable 3 ans, apres quoi il faut la renouveler en passant un examen de recertification ou en obtenant une certification de niveau superieur (CCNP).\n\nLa CCNA est souvent exigee pour les postes de technicien reseau, administrateur reseau junior, ou ingenieur support. Elle prouve que vous maitrisez les fondamentaux des reseaux et que vous pouvez configurer, depanner et securiser des equipements Cisco."
    },
    {
      title: 'Les domaines de l\'examen et leur poids',
      content:
        "L'examen CCNA 200-301 est divise en six domaines, chacun avec un pourcentage de questions associe.\n\nNetwork Fundamentals (20%) : modele OSI et TCP/IP, types de reseaux (LAN, WAN, WLAN), topologies, cablage, IPv4 et IPv6. C'est la base absolue. Si vous ne maitrisez pas ce domaine, le reste sera incomprehensible.\n\nNetwork Access (20%) : configuration des interfaces, VLAN, trunking, EtherChannel, STP (Spanning Tree Protocol), decouverte de voisins (CDP, LLDP), architectures Wi-Fi. Ce domaine est tres pratique et necessite de savoir configurer des switches.\n\nIP Connectivity (25%) : routage statique et dynamique, OSPF (single-area), First Hop Redundancy Protocols. C'est le domaine le plus important en termes de poids. Vous devez savoir configurer des routes, comprendre les tables de routage et maitriser OSPF.\n\nIP Services (10%) : NAT/PAT, DHCP, DNS, SNMP, Syslog, NTP, QoS. Ce domaine couvre les services essentiels qui accompagnent le routage et la commutation.\n\nSecurity Fundamentals (15%) : concepts de securite, ACL, VPN, AAA, pare-feu, securite des ports, DHCP snooping, ARP inspection. La securite est de plus en plus presente dans l'examen.\n\nAutomation and Programmability (10%) : APIs REST, JSON, outils de gestion de configuration (Ansible, Puppet, Chef), SDN, controleurs. C'est le domaine le plus recent et souvent le moins prepare par les candidats."
    },
    {
      title: 'Plan de revision en 12 semaines',
      content:
        "Un plan structure est essentiel pour reussir. Voici un planning de 12 semaines avec 10 a 15 heures d'etude par semaine.\n\nSemaines 1-2 : Network Fundamentals. Etudiez le modele OSI, TCP/IP, les types de reseaux, le cablage, IPv4 (adressage, subnetting, VLSM) et les bases d'IPv6. Faites beaucoup d'exercices de subnetting jusqu'a ce que ce soit automatique.\n\nSemaines 3-4 : Network Access. Configurez des VLAN, des trunks, EtherChannel et STP sur Packet Tracer ou GNS3. Pratiquez sur de vrais equipements si possible. Comprenez le fonctionnement de STP en profondeur (election du root bridge, etats des ports).\n\nSemaines 5-7 : IP Connectivity. C'est le coeur de l'examen. Maitrisez le routage statique, puis plongez dans OSPF : voisinage, election DR/BDR, types de LSA, configuration single-area. Pratiquez intensivement sur simulateur.\n\nSemaines 8-9 : IP Services et Security. Configurez NAT/PAT, DHCP sur routeur, les ACL standard et etendues. Comprenez les principes de securite : menaces, VPN, AAA. Ne negligez pas la QoS : comprenez les concepts de marquage, mise en file et politique.\n\nSemaines 10-11 : Automation et revision. Etudiez les APIs REST, le format JSON, les concepts SDN et les outils d'automatisation. Revisez tous les domaines en parallele. Identifiez vos points faibles.\n\nSemaine 12 : Examens blancs intensifs. Passez au moins 3 examens blancs complets en conditions reelles (120 minutes, sans aide). Analysez chaque erreur en profondeur."
    },
    {
      title: 'Ressources recommandees',
      content:
        "Pour la theorie, le livre officiel Cisco Press \"CCNA 200-301 Official Cert Guide\" en deux volumes (Wendell Odom) est la reference incontournable. Il couvre exhaustivement tous les sujets de l'examen. Completez avec les videos de formation en ligne : CBT Nuggets, INE, ou les cours gratuits de David Bombal sur YouTube.\n\nPour la pratique, Cisco Packet Tracer est gratuit et suffisant pour la majorite des labos CCNA. GNS3 ou EVE-NG sont plus realistes mais plus complexes a mettre en place. L'ideal est d'avoir acces a de vrais equipements Cisco (meme anciens : des 2960 pour le switching et des 2901 pour le routage).\n\nPour les examens blancs, Boson ExSim est considere comme le meilleur simulateur d'examen pour le CCNA. Les questions sont proches du niveau de l'examen reel. Pearson propose aussi des examens pratiques avec le livre officiel.\n\nNetRevision vous offre 32 chapitres de cours, 520+ questions QCM et un simulateur CLI Cisco pour completer votre preparation. Utilisez-le comme outil de revision quotidien pour renforcer vos connaissances."
    },
    {
      title: 'Conseils pour le jour de l\'examen',
      content:
        "Arrivez 15 minutes en avance au centre Pearson VUE. Apportez deux pieces d'identite avec photo. Vous ne pouvez rien emmener dans la salle d'examen : pas de telephone, pas de montre, pas de notes. On vous fournira un tableau blanc et un marqueur effacable.\n\nGestion du temps : avec 100 a 120 questions en 120 minutes, vous avez environ 1 minute par question. Ne restez pas bloque sur une question difficile. Marquez-la pour revision et avancez. Vous pourrez y revenir a la fin (sauf pour les simulations qui apparaissent dans un ordre fixe).\n\nPour les simulations Cisco, lisez attentivement les consignes. Verifiez votre configuration avec les commandes show avant de valider. Les erreurs de syntaxe courantes qui coutent des points : oublier le masque wildcard dans une ACL, confondre le masque de sous-reseau et le wildcard, oublier de sauvegarder la configuration.\n\nNe changez pas vos reponses sauf si vous etes absolument certain d'une erreur. Votre premiere intuition est souvent la bonne. Eliminez les reponses manifestement fausses pour augmenter vos chances sur les questions ou vous hesitez."
    }
  ]
}

// ============================================================
// ARTICLE 10 — Sujets cles CCNA
// ============================================================
const article10: BlogArticle = {
  id: 10,
  slug: 'ccna-sujets-examen',
  title: 'Les sujets cles de l\'examen CCNA',
  description: 'Analyse detaillee des 6 domaines de l\'examen CCNA 200-301 : fondamentaux, acces reseau, connectivite IP, services, securite et automatisation.',
  category: 'certification',
  tags: ['CCNA', 'examen', 'sujets', 'certification Cisco'],
  author: 'NetRevision',
  publishDate: '2026-02-18',
  readTime: '10 min',
  relatedChapters: ['modele-osi', 'vlan-trunk-stp', 'routage-dynamique', 'securite-avancee'],
  sections: [
    {
      title: 'Network Fundamentals (20%)',
      content:
        "Ce domaine couvre les concepts fondamentaux des reseaux. Vous devez comprendre le modele OSI et TCP/IP, savoir expliquer le role de chaque couche et identifier les protocoles associes. Les questions portent sur les types de reseaux (LAN, WAN, MAN, WLAN, SAN), les topologies (etoile, maillage, bus, anneau) et les composants physiques (cables UTP, fibre optique, connecteurs RJ-45).\n\nL'adressage IPv4 est un sujet majeur : classes d'adresses, adresses privees (RFC 1918), subnetting, VLSM et CIDR. Vous devez pouvoir calculer rapidement un masque de sous-reseau, determiner la plage d'hotes d'un reseau et identifier l'adresse de broadcast. IPv6 est egalement present : format d'adresse, types (unicast, multicast, anycast), EUI-64, et coexistence IPv4/IPv6 (dual-stack, tunneling).\n\nLes comparaisons sont frequentes : TCP vs UDP, half-duplex vs full-duplex, unicast vs multicast vs broadcast. Maitrisez les ports TCP/UDP courants : HTTP (80), HTTPS (443), FTP (20/21), SSH (22), Telnet (23), DNS (53), DHCP (67/68), SMTP (25), SNMP (161)."
    },
    {
      title: 'Network Access (20%) et IP Connectivity (25%)',
      content:
        "Network Access teste vos competences en commutation. Vous devez savoir configurer des VLAN, des trunks (802.1Q), le protocole VTP et EtherChannel (LACP, PAgP). STP est un sujet cle : comprendre l'election du root bridge, les etats des ports (blocking, listening, learning, forwarding), les variantes (RSTP 802.1w, PVST+) et le PortFast.\n\nLe Wi-Fi fait partie de ce domaine : standards 802.11 (a/b/g/n/ac/ax), frequences (2.4 GHz, 5 GHz), modes de securite (WPA2, WPA3), types d'AP (autonomous, lightweight), controleurs WLC et le protocole CAPWAP.\n\nIP Connectivity est le domaine le plus lourd (25%). Le routage statique est la base : configuration de routes statiques, routes par defaut, routes flottantes. OSPF single-area represente une part importante : voisinage (hello, dead timers), election DR/BDR, cout des liens, redistribution de route par defaut.\n\nLes First Hop Redundancy Protocols (HSRP principalement) sont a connaitre : IP virtuelle, election du routeur actif et standby, preemption. Vous devez aussi comprendre les tables de routage : routes connectees, statiques, apprises par protocole, administrative distance et metrique."
    },
    {
      title: 'IP Services (10%) et Security (15%)',
      content:
        "IP Services couvre les services complementaires au routage. Le NAT est incontournable : NAT statique, dynamique et PAT (overload). Vous devez savoir configurer et depanner le NAT sur un routeur Cisco. DHCP serveur sur routeur et DHCP relay (ip helper-address) sont aussi testes.\n\nDNS en tant que concept (resolution de noms, enregistrements A, AAAA, CNAME, MX) fait partie du programme. NTP (synchronisation horaire), Syslog (niveaux de severite 0 a 7) et SNMP (versions 2c et 3, communautes, traps) sont regulierement presents dans les questions.\n\nLa QoS n'est testee qu'au niveau conceptuel : comprendre le besoin de QoS, les mecanismes de marquage (DSCP, CoS), la classification et les modeles (IntServ, DiffServ). Pas de configuration detaillee attendue.\n\nSecurity Fundamentals couvre les menaces courantes (phishing, DDoS, man-in-the-middle, malware), les mecanismes de defense (pare-feu, IPS/IDS), et la configuration pratique : ACL standard et etendues, port-security, DHCP snooping, Dynamic ARP Inspection (DAI). Les VPN site-to-site et remote access sont a connaitre conceptuellement. AAA (Authentication, Authorization, Accounting) avec RADIUS et TACACS+ est un sujet recurrent."
    },
    {
      title: 'Automation and Programmability (10%)',
      content:
        "Ce domaine est relativement nouveau et deroute souvent les candidats habitues aux reseaux traditionnels. Il couvre le SDN (Software-Defined Networking) : architecture, separation du plan de controle et du plan de donnees, controleurs (Cisco DNA Center, ACI).\n\nLes APIs REST sont fondamentales : methodes HTTP (GET, POST, PUT, DELETE), codes de reponse (200, 201, 400, 401, 404), format JSON. Vous devez savoir lire un payload JSON et identifier les paires cle-valeur. YANG et RESTCONF/NETCONF sont mentionnes mais a un niveau conceptuel.\n\nLes outils de gestion de configuration sont au programme : Ansible (agentless, playbooks YAML, modules reseau), Puppet (agent-based, manifests), Chef (agent-based, recipes). Comprenez les differences et les cas d'usage de chacun.\n\nCisco DNA Center est presente comme la plateforme d'automatisation de Cisco : intent-based networking, provisioning, assurance, analyse. Meme si les questions restent theoriques, il faut comprendre les avantages de l'automatisation par rapport a la configuration manuelle : reproductibilite, reduction des erreurs, gain de temps, conformite."
    }
  ]
}

// ============================================================
// ARTICLE 11 — Commandes Cisco essentielles
// ============================================================
const article11: BlogArticle = {
  id: 11,
  slug: 'commandes-cisco-essentielles',
  title: 'Les 50 commandes Cisco essentielles',
  description: 'Reference des 50 commandes Cisco IOS les plus utilisees : navigation, show, configuration interfaces, routage, VLAN, securite et depannage.',
  category: 'certification',
  tags: ['Cisco IOS', 'commandes', 'CLI', 'show', 'configure'],
  author: 'NetRevision',
  publishDate: '2026-02-18',
  readTime: '15 min',
  relatedChapters: ['routage-statique', 'vlan-trunk-stp', 'acl-access-control'],
  sections: [
    {
      title: 'Navigation et modes IOS',
      content:
        "Cisco IOS utilise plusieurs modes de commande, chacun avec un prompt distinctif et des permissions differentes.\n\nMode utilisateur (Router>) : acces limite, commandes de base comme ping et show version. Pour passer au mode privilegie : \"enable\".\n\nMode privilegie (Router#) : acces complet aux commandes show et aux outils de diagnostic. Pour entrer en configuration : \"configure terminal\" (raccourci : \"conf t\"). Pour revenir : \"disable\" ou \"exit\".\n\nMode configuration globale (Router(config)#) : modification de la configuration. Pour configurer une interface : \"interface gigabitEthernet 0/0\". Pour une sous-interface : \"interface gi0/0.10\".\n\nCommandes de navigation essentielles : \"enable\" pour passer en mode privilegie, \"configure terminal\" pour la configuration globale, \"exit\" pour remonter d'un niveau, \"end\" (ou Ctrl+Z) pour revenir directement au mode privilegie, \"hostname [nom]\" pour nommer l'equipement, \"no [commande]\" pour annuler une commande.\n\nRaccourcis utiles : Tab pour l'auto-completion, \"?\" pour l'aide contextuelle, les fleches haut/bas pour l'historique, Ctrl+A pour debut de ligne, Ctrl+E pour fin de ligne."
    },
    {
      title: 'Commandes show indispensables',
      content:
        "Les commandes show sont vos meilleurs outils de diagnostic. Voici les plus importantes.\n\n\"show running-config\" : affiche la configuration active en memoire. C'est LA commande que vous utiliserez le plus souvent. Ajoutez des filtres : \"show run | include interface\" ou \"show run | section router ospf\".\n\n\"show startup-config\" : affiche la configuration sauvegardee en NVRAM. Comparez avec le running-config pour voir les changements non sauvegardes.\n\n\"show ip interface brief\" : resume de toutes les interfaces avec leur adresse IP et leur statut (up/up, down/down, administratively down). Indispensable pour un diagnostic rapide.\n\n\"show interfaces [interface]\" : details complets d'une interface : MTU, bande passante, compteurs d'erreurs, adresse MAC. \"show interfaces status\" sur un switch affiche VLAN, duplex et vitesse de chaque port.\n\n\"show ip route\" : table de routage complete. Identifiez les routes connectees (C), statiques (S), OSPF (O), et la route par defaut (S*). \"show ip protocols\" affiche les protocoles de routage actifs et leurs parametres.\n\n\"show vlan brief\" : liste des VLAN et des ports associes sur un switch. \"show interfaces trunk\" affiche les ports trunk actifs et les VLAN autorises.\n\n\"show ip ospf neighbor\" : voisins OSPF avec leur etat, priorite et adresse. \"show ip ospf interface\" detaille les parametres OSPF par interface."
    },
    {
      title: 'Configuration interfaces et routage',
      content:
        "Configuration d'une interface : \"interface gigabitEthernet 0/0\", \"ip address 192.168.1.1 255.255.255.0\", \"no shutdown\" (active l'interface). \"description Lien vers le LAN\" ajoute un commentaire.\n\nRoute statique : \"ip route [reseau] [masque] [next-hop ou interface]\". Exemples : \"ip route 10.0.0.0 255.0.0.0 192.168.1.2\" (via next-hop), \"ip route 0.0.0.0 0.0.0.0 192.168.1.1\" (route par defaut). Route flottante : ajoutez une distance administrative plus elevee : \"ip route 10.0.0.0 255.0.0.0 192.168.2.2 10\".\n\nOSPF : \"router ospf 1\" (process ID), \"network 192.168.1.0 0.0.0.255 area 0\" (annonce un reseau dans l'area 0), \"passive-interface gi0/0\" (desactive OSPF sur une interface sans supprimer l'annonce), \"default-information originate\" (redistribue la route par defaut).\n\nDHCP serveur : \"ip dhcp pool LAN\", \"network 192.168.1.0 255.255.255.0\", \"default-router 192.168.1.1\", \"dns-server 8.8.8.8\". Exclusions : \"ip dhcp excluded-address 192.168.1.1 192.168.1.10\".\n\nNAT PAT : \"access-list 1 permit 192.168.1.0 0.0.0.255\", \"ip nat inside source list 1 interface gi0/1 overload\", puis \"ip nat inside\" sur l'interface LAN et \"ip nat outside\" sur l'interface WAN."
    },
    {
      title: 'VLAN, securite et sauvegarde',
      content:
        "VLAN : \"vlan 10\", \"name COMPTABILITE\" (creation), \"interface gi0/1\", \"switchport mode access\", \"switchport access vlan 10\" (assignation). Trunk : \"interface gi0/24\", \"switchport mode trunk\", \"switchport trunk allowed vlan 10,20,30\".\n\nEtherChannel : \"interface range gi0/1-2\", \"channel-group 1 mode active\" (LACP). Verification : \"show etherchannel summary\".\n\nSTP : \"spanning-tree vlan 10 root primary\" (force ce switch comme root bridge pour VLAN 10), \"spanning-tree portfast\" (sur port access, skip listening/learning).\n\nACL standard : \"access-list 10 permit 192.168.1.0 0.0.0.255\", \"access-list 10 deny any\". Application : \"interface gi0/0\", \"ip access-group 10 in\".\n\nACL etendue : \"access-list 110 permit tcp 192.168.1.0 0.0.0.255 any eq 80\". Nommee : \"ip access-list extended FILTRAGE\", \"permit tcp any host 10.0.0.100 eq 443\".\n\nPort-security : \"interface gi0/1\", \"switchport port-security\", \"switchport port-security maximum 2\", \"switchport port-security violation shutdown\".\n\nSauvegarde : \"copy running-config startup-config\" (raccourci : \"wr\" ou \"write memory\"). \"copy running-config tftp://[serveur]/backup.cfg\" pour un backup distant. \"reload\" redemarre l'equipement."
    }
  ]
}

// ============================================================
// ARTICLE 12 — Labos pratiques CCNA
// ============================================================
const article12: BlogArticle = {
  id: 12,
  slug: 'labos-pratiques-ccna',
  title: 'Labos pratiques pour le CCNA',
  description: 'Scenarios de labos pratiques pour la preparation au CCNA : configuration VLAN, routage OSPF, ACL, NAT/PAT et DHCP sur Cisco Packet Tracer.',
  category: 'certification',
  tags: ['labo', 'pratique', 'CCNA', 'Packet Tracer', 'GNS3'],
  author: 'NetRevision',
  publishDate: '2026-02-18',
  readTime: '10 min',
  relatedChapters: ['vlan-trunk-stp', 'routage-statique', 'nat-pat'],
  sections: [
    {
      title: 'Pourquoi la pratique est indispensable',
      content:
        "Le CCNA ne se prepare pas uniquement avec de la theorie. L'examen inclut des simulations ou vous devez configurer des equipements Cisco en temps reel. Sans pratique reguliere, vous ne pourrez pas repondre a ces questions dans le temps imparti.\n\nCisco Packet Tracer est l'outil gratuit officiel de Cisco pour la simulation reseau. Il suffit de creer un compte Cisco NetAcad pour le telecharger. Packet Tracer simule fideles des switches, routeurs et PC, avec une interface CLI proche de l'IOS reel. Ses limites : pas tous les protocoles sont supportes et les performances peuvent etre approximatives.\n\nGNS3 et EVE-NG sont des alternatives plus avancees qui utilisent de vraies images IOS (necessitent une licence ou un acces a des images). Ils offrent un realisme superieur et supportent plus de fonctionnalites, mais sont plus complexes a configurer.\n\nL'ideal est de pratiquer au moins 30 minutes par jour sur simulateur. Refaites chaque labo plusieurs fois jusqu'a pouvoir le realiser sans consulter la documentation. Chronometrez-vous : lors de l'examen, chaque seconde compte."
    },
    {
      title: 'Labo 1 : configuration VLAN et trunk',
      content:
        "Topologie : 2 switches (SW1, SW2) connectes par un lien trunk, 4 PC repartis dans 2 VLAN (VLAN 10 Marketing, VLAN 20 Direction).\n\nObjectifs : creer les VLAN sur les deux switches, assigner les ports aux VLAN, configurer le trunk entre les switches, verifier la connectivite intra-VLAN et l'isolation inter-VLAN.\n\nEtapes sur SW1 : \"enable\", \"configure terminal\", \"vlan 10\", \"name MARKETING\", \"vlan 20\", \"name DIRECTION\", \"interface range fa0/1-2\", \"switchport mode access\", \"switchport access vlan 10\", \"interface range fa0/3-4\", \"switchport mode access\", \"switchport access vlan 20\", \"interface gi0/1\", \"switchport mode trunk\", \"switchport trunk allowed vlan 10,20\".\n\nRepetez la configuration des VLAN sur SW2 et configurez le trunk. Verification : \"show vlan brief\" doit montrer les VLAN et leurs ports, \"show interfaces trunk\" doit afficher le lien trunk actif. Les PC du meme VLAN doivent pouvoir se pinguer, les PC de VLAN differents ne doivent pas communiquer (pas de routage inter-VLAN configure)."
    },
    {
      title: 'Labo 2 : routage OSPF multi-routeurs',
      content:
        "Topologie : 3 routeurs (R1, R2, R3) interconnectes en triangle, chacun avec un reseau LAN.\n\nR1 : LAN 192.168.1.0/24, liens 10.0.12.0/30 (vers R2) et 10.0.13.0/30 (vers R3). R2 : LAN 192.168.2.0/24, liens 10.0.12.0/30 et 10.0.23.0/30 (vers R3). R3 : LAN 192.168.3.0/24, liens 10.0.13.0/30 et 10.0.23.0/30.\n\nConfiguration sur R1 : \"interface gi0/0\", \"ip address 192.168.1.1 255.255.255.0\", \"no shutdown\", \"interface gi0/1\", \"ip address 10.0.12.1 255.255.255.252\", \"no shutdown\", \"interface gi0/2\", \"ip address 10.0.13.1 255.255.255.252\", \"no shutdown\", \"router ospf 1\", \"router-id 1.1.1.1\", \"network 192.168.1.0 0.0.0.255 area 0\", \"network 10.0.12.0 0.0.0.3 area 0\", \"network 10.0.13.0 0.0.0.3 area 0\", \"passive-interface gi0/0\".\n\nRepetez pour R2 et R3 avec les adresses correspondantes. Verification : \"show ip ospf neighbor\" doit montrer les voisins en etat FULL, \"show ip route\" doit contenir des routes OSPF (marquees O), un ping de 192.168.1.0 vers 192.168.3.0 doit fonctionner."
    },
    {
      title: 'Labo 3 : NAT/PAT et ACL',
      content:
        "Topologie : un routeur (R1) connectant un LAN interne (192.168.1.0/24) a Internet (interface WAN avec IP publique 203.0.113.1/24).\n\nObjectif 1 — NAT PAT : permettre a tous les PC du LAN d'acceder a Internet via l'adresse publique du routeur. Configuration : \"access-list 1 permit 192.168.1.0 0.0.0.255\", \"ip nat inside source list 1 interface gi0/1 overload\", \"interface gi0/0\" (LAN), \"ip nat inside\", \"interface gi0/1\" (WAN), \"ip nat outside\". Verification : \"show ip nat translations\" doit afficher les traductions actives apres un ping vers l'exterieur.\n\nObjectif 2 — ACL etendue : bloquer l'acces HTTP externe vers le LAN tout en autorisant le reste. \"ip access-list extended SECURITE_WAN\", \"deny tcp any 192.168.1.0 0.0.0.255 eq 80\", \"permit ip any any\", \"interface gi0/1\", \"ip access-group SECURITE_WAN in\".\n\nObjectif 3 — ACL standard : bloquer un hote specifique (192.168.1.100) de l'acces a Internet. \"access-list 10 deny host 192.168.1.100\", \"access-list 10 permit 192.168.1.0 0.0.0.255\". Modifiez la regle NAT pour utiliser l'ACL 10. Verification : 192.168.1.100 ne doit plus pouvoir pinguer l'exterieur, les autres hotes oui."
    }
  ]
}

// ============================================================
// ARTICLE 13 — Erreurs courantes CCNA
// ============================================================
const article13: BlogArticle = {
  id: 13,
  slug: 'erreurs-courantes-ccna',
  title: 'Les 10 erreurs courantes au CCNA',
  description: 'Les 10 erreurs les plus frequentes des candidats au CCNA et comment les eviter : subnetting, OSPF, ACL, configuration et gestion du temps.',
  category: 'certification',
  tags: ['CCNA', 'erreurs', 'conseils', 'examen', 'pieges'],
  author: 'NetRevision',
  publishDate: '2026-02-18',
  readTime: '8 min',
  relatedChapters: ['classes-subnetting', 'routage-dynamique'],
  sections: [
    {
      title: 'Erreurs 1 a 4 : les bases mal maitrisees',
      content:
        "Erreur 1 : confondre masque de sous-reseau et wildcard mask. Le masque de sous-reseau 255.255.255.0 correspond au wildcard 0.0.0.255. Le wildcard est l'inverse bit a bit du masque. Cette confusion est fatale dans les ACL et les commandes OSPF network. Astuce : soustrayez chaque octet du masque de 255 pour obtenir le wildcard.\n\nErreur 2 : ne pas maitriser le subnetting mental. Le jour de l'examen, vous n'aurez pas de calculatrice. Vous devez pouvoir determiner en 30 secondes : le nombre d'hotes d'un /26 (62), l'adresse de broadcast de 172.16.10.64/26 (172.16.10.127), le prochain sous-reseau apres 192.168.1.0/28 (192.168.1.16). Entrainez-vous quotidiennement.\n\nErreur 3 : oublier le \"no shutdown\" sur les interfaces. Sur les routeurs Cisco, toutes les interfaces sont \"administratively down\" par defaut. Si votre ping ne fonctionne pas, verifiez d'abord que l'interface est activee avec \"show ip interface brief\".\n\nErreur 4 : ne pas sauvegarder la configuration. \"copy running-config startup-config\" (ou \"wr\") est obligatoire pour que la configuration survive a un redemarrage. Combien de candidats perdent des points en simulation parce qu'ils oublient de sauvegarder ?"
    },
    {
      title: 'Erreurs 5 a 7 : routage et OSPF',
      content:
        "Erreur 5 : mal comprendre l'administrative distance (AD). Quand plusieurs protocoles proposent une route vers le meme reseau, le routeur choisit celle avec l'AD la plus basse : routes connectees (0), statiques (1), OSPF (110), RIP (120). Si votre route statique n'apparait pas dans la table de routage, verifiez qu'il n'y a pas une route connectee ou OSPF plus specifique.\n\nErreur 6 : problemes de voisinage OSPF. Les voisins OSPF ne se forment pas si les hello/dead timers ne correspondent pas (par defaut 10/40 sur broadcast), si les area IDs different, si les masques de sous-reseau des interfaces ne correspondent pas, ou si une ACL bloque le multicast 224.0.0.5/224.0.0.6. Verifiez systematiquement avec \"show ip ospf interface\" et \"show ip ospf neighbor\".\n\nErreur 7 : oublier le \"passive-interface\" en OSPF. Les interfaces LAN (vers les PC) n'ont pas besoin d'envoyer des paquets OSPF. Sans passive-interface, vous gaspillez de la bande passante et exposez potentiellement les informations de routage. Inversement, n'activez jamais passive-interface sur un lien entre routeurs, sinon le voisinage ne se formera jamais."
    },
    {
      title: 'Erreurs 8 a 10 : examen et strategie',
      content:
        "Erreur 8 : mal placer les ACL. Rappel : ACL standard au plus pres de la destination, ACL etendue au plus pres de la source. Appliquer une ACL standard trop tot dans le chemin peut bloquer du trafic legitime vers d'autres destinations. Et n'oubliez pas de specifier la direction (in ou out) lors de l'application sur l'interface.\n\nErreur 9 : negliger le domaine Automation. Beaucoup de candidats traditionnel negligent ce domaine qui vaut 10%. C'est 10% de points potentiellement perdus. Les questions sont souvent theoriques et plus faciles que le routage ou le switching. Investir quelques heures sur les APIs REST, JSON et Ansible peut faire la difference entre un echec et une reussite.\n\nErreur 10 : mauvaise gestion du temps. Passer 5 minutes sur une question de subnetting qui vaut autant qu'une question simple de theorie est une erreur strategique. Si vous bloquez, marquez la question et avancez. Les simulations prennent plus de temps : reservez-leur 3 a 5 minutes chacune. Gardez au moins 10 minutes a la fin pour reviser les questions marquees.\n\nBonus : ne negligez pas votre condition physique le jour J. Dormez bien la veille, mangez equilibre, arrivez en avance. Le stress et la fatigue sont des ennemis redoutables lors d'un examen de 2 heures qui demande une concentration intense."
    }
  ]
}

// ============================================================
// ARTICLE 14 — Automatisation reseau Python
// ============================================================
const article14: BlogArticle = {
  id: 14,
  slug: 'automatisation-reseau-python',
  title: 'Automatiser son reseau avec Python',
  description: 'Introduction a l\'automatisation reseau avec Python : bibliotheques Netmiko, NAPALM et Paramiko, exemples de scripts et cas d\'usage pratiques.',
  category: 'avance',
  tags: ['Python', 'automatisation', 'netmiko', 'napalm', 'scripting'],
  author: 'NetRevision',
  publishDate: '2026-02-19',
  readTime: '10 min',
  relatedChapters: ['automatisation-python'],
  sections: [
    {
      title: 'Pourquoi automatiser son reseau',
      content:
        "La gestion manuelle d'un reseau atteint ses limites des que l'infrastructure depasse quelques dizaines d'equipements. Configurer un changement de VLAN sur 200 switches un par un prend des heures et multiplie les risques d'erreur humaine. L'automatisation reseau resout ces problemes : elle est reproductible (le meme script produit toujours le meme resultat), rapide (des centaines de modifications en minutes), auditable (chaque action est tracee) et fiable (pas de faute de frappe).\n\nPython s'est impose comme le langage de reference pour l'automatisation reseau grace a sa syntaxe lisible, sa riche ecosysteme de bibliotheques et son adoption massive par l'industrie. Cisco, Juniper, Arista et la majorite des constructeurs fournissent des API Python pour leurs equipements.\n\nLes trois bibliotheques principales sont Paramiko (acces SSH bas niveau), Netmiko (surcouche de Paramiko specifique au reseau) et NAPALM (abstraction multi-constructeur). Chacune a ses forces et ses cas d'usage."
    },
    {
      title: 'Netmiko : la bibliotheque incontournable',
      content:
        "Netmiko est la bibliotheque la plus utilisee pour l'automatisation reseau en Python. Creee par Kirk Byers, elle supporte plus de 50 types d'equipements (Cisco IOS, NX-OS, ASA, Juniper, Arista, HP, etc.) et simplifie enormement les connexions SSH.\n\nInstallation : \"pip install netmiko\". Un script type se decompose en trois etapes : connexion a l'equipement, envoi de commandes et fermeture de la connexion.\n\nExemple pour collecter la configuration d'un routeur Cisco : importez ConnectHandler depuis netmiko, definissez un dictionnaire avec device_type, host, username et password, creez la connexion avec ConnectHandler, puis utilisez send_command pour executer des commandes show et send_config_set pour envoyer une liste de commandes de configuration.\n\nNetmiko gere automatiquement les prompts Cisco (enable, confirm), le timing des commandes longues et la detection du type d'equipement. Pour configurer plusieurs equipements, il suffit de boucler sur une liste de dictionnaires. Pour les operations en parallele, combinez Netmiko avec le module concurrent.futures de Python."
    },
    {
      title: 'NAPALM et Paramiko',
      content:
        "NAPALM (Network Automation and Programmability Abstraction Layer with Multivendor support) offre une interface unifiee pour interagir avec des equipements de constructeurs differents. Son avantage principal est l'abstraction : le meme code fonctionne sur Cisco IOS, Juniper JUNOS ou Arista EOS.\n\nNAPALM se distingue par ses fonctions de gestion de configuration : get_config (recuperer la configuration), load_merge_candidate (preparer une modification), compare_config (afficher les differences avant application), commit_config (appliquer) et rollback (annuler). Ce workflow transactionnel est ideal pour les environnements de production.\n\nParamiko est la base SSH sur laquelle Netmiko est construite. On l'utilise rarement directement pour l'automatisation reseau, mais il est utile pour des cas specifiques : transfert de fichiers SCP, tunnels SSH, ou interactions avec des equipements non supportes par Netmiko.\n\nPour choisir : Netmiko pour les taches quotidiennes et les scripts rapides, NAPALM pour la gestion de configuration multi-constructeur en production, Paramiko uniquement quand les deux autres ne suffisent pas."
    },
    {
      title: 'Cas d\'usage et bonnes pratiques',
      content:
        "Les cas d'usage les plus courants de l'automatisation reseau sont : l'audit de configuration (verifier la conformite de centaines d'equipements), le deploiement de changements (appliquer un changement de politique ACL sur tout le parc), la collecte d'inventaire (extraire versions IOS, numeros de serie, interfaces), le backup automatique (sauvegarder les configurations chaque nuit) et le depannage assiste (collecter des show commands sur tous les equipements concernes).\n\nBonnes pratiques : ne stockez jamais les mots de passe en dur dans vos scripts. Utilisez des variables d'environnement, un fichier de credentials chiffre ou un gestionnaire de secrets (HashiCorp Vault). Ajoutez de la gestion d'erreurs avec try/except pour capturer les echecs de connexion. Loguez toutes les actions dans un fichier de log.\n\nTestez toujours vos scripts sur un environnement de lab avant la production. Commencez par des scripts en lecture seule (commandes show) avant de passer aux modifications. Versionnez vos scripts avec Git et documentez-les. Implementez un mecanisme de dry-run qui affiche les changements prevus sans les appliquer."
    }
  ]
}

// ============================================================
// ARTICLE 15 — Introduction au SD-WAN
// ============================================================
const article15: BlogArticle = {
  id: 15,
  slug: 'sd-wan-introduction',
  title: 'Introduction au SD-WAN',
  description: 'Comprendre le SD-WAN : architecture, avantages par rapport au WAN traditionnel, composants, cas d\'usage et principaux fournisseurs.',
  category: 'avance',
  tags: ['SD-WAN', 'WAN', 'reseau etendu', 'cloud', 'architecture'],
  author: 'NetRevision',
  publishDate: '2026-02-19',
  readTime: '9 min',
  relatedChapters: ['sd-wan'],
  sections: [
    {
      title: 'Les limites du WAN traditionnel',
      content:
        "Le WAN traditionnel repose sur des liens MPLS (Multiprotocol Label Switching) fournis par les operateurs telecoms. MPLS offre une qualite de service garantie, une faible latence et une fiabilite elevee, mais a un cout considerable. Pour une entreprise multi-sites, la facture MPLS peut representer une part significative du budget IT.\n\nAvec l'adoption massive du cloud (SaaS, IaaS), le modele hub-and-spoke du WAN traditionnel montre ses limites. Tout le trafic des sites distants doit transiter par le datacenter central avant d'atteindre Internet ou le cloud. Un utilisateur a Lyon qui accede a Office 365 voit son trafic passer par Paris avant de revenir vers le cloud Microsoft, ajoutant de la latence inutile.\n\nDe plus, la gestion du WAN traditionnel est complexe : chaque routeur de site doit etre configure individuellement, les changements de politique necessitent des interventions manuelles sur chaque equipement, et l'ajout d'un nouveau site prend des semaines (delai de provisioning MPLS)."
    },
    {
      title: 'Qu\'est-ce que le SD-WAN',
      content:
        "Le SD-WAN (Software-Defined Wide Area Network) est une approche qui applique les principes du SDN au reseau etendu. Il separe le plan de controle (intelligence, politiques) du plan de donnees (transport des paquets), et centralise la gestion via un orchestrateur logiciel.\n\nLe SD-WAN permet d'utiliser plusieurs types de liens simultanement : MPLS, Internet haut debit, 4G/5G. Il choisit dynamiquement le meilleur chemin pour chaque application en fonction de criteres de performance (latence, jitter, perte de paquets). Le trafic critique (voix, video) peut utiliser MPLS tandis que le trafic web standard passe par Internet.\n\nLes composants principaux sont : l'orchestrateur central (gestion, politiques, monitoring), le controleur (plan de controle, distribution de la configuration) et les edges (equipements dans les sites, execution des politiques). L'orchestrateur offre une interface graphique centralisee pour configurer et superviser l'ensemble du WAN."
    },
    {
      title: 'Avantages et cas d\'usage',
      content:
        "Reduction des couts : en completant ou remplacant MPLS par des liens Internet, les entreprises reduisent leur facture WAN de 30 a 60%. Le SD-WAN ne necessite pas de supprimer MPLS completement ; il permet une approche hybride.\n\nAgilite : l'ajout d'un nouveau site prend des heures au lieu de semaines. L'equipement SD-WAN est pre-configure et s'active automatiquement en se connectant a l'orchestrateur (zero-touch provisioning). Les changements de politique sont deployables en quelques clics depuis la console centrale.\n\nPerformance applicative : le routage intelligent par application dirige le trafic sur le meilleur lien disponible. Le local breakout permet aux sites distants d'acceder directement a Internet et au cloud sans passer par le datacenter central, reduisant la latence pour les applications SaaS.\n\nSecurite : le SD-WAN integre le chiffrement IPsec sur tous les liens, la segmentation du trafic et peut s'integrer aux solutions de securite cloud (SASE : Secure Access Service Edge). Certaines solutions incluent un pare-feu integre, un filtrage URL et une detection d'intrusion.\n\nCas d'usage typiques : entreprises multi-sites (retail, banque, sante), migration vers le cloud, remplacement de MPLS, connexion de sites temporaires (chantiers, evenements), backup automatique en cas de panne d'un lien."
    },
    {
      title: 'Principaux fournisseurs et tendances',
      content:
        "Le marche du SD-WAN est domine par plusieurs acteurs. Cisco Viptela (integre dans Cisco SD-WAN) est le leader avec une forte integration a l'ecosysteme Cisco (DNA Center, Meraki). VMware SD-WAN (ex-VeloCloud) est populaire dans les environnements VMware. Fortinet SD-WAN se distingue par son integration native avec les fonctionnalites de securite FortiGate. Silver Peak (racheté par Aruba/HPE) est reconnu pour ses capacites d'optimisation WAN. Versa Networks offre une approche SASE complete.\n\nLa tendance majeure est la convergence SD-WAN et securite cloud sous le concept SASE (Secure Access Service Edge), defini par Gartner. SASE combine SD-WAN avec des services de securite cloud : CASB (Cloud Access Security Broker), SWG (Secure Web Gateway), ZTNA (Zero Trust Network Access) et FWaaS (Firewall as a Service).\n\nPour les professionnels reseau, le SD-WAN est une competence de plus en plus demandee. Cisco propose la certification SD-WAN dans le parcours CCNP Enterprise. Comprendre les principes du SD-WAN est essentiel pour evoluer vers des roles d'architecte reseau ou d'ingenieur cloud networking."
    }
  ]
}

// ============================================================
// ARTICLE 16 — Zero Trust
// ============================================================
const article16: BlogArticle = {
  id: 16,
  slug: 'zero-trust-securite',
  title: 'Zero Trust : la securite reseau moderne',
  description: 'Comprendre le modele Zero Trust : principes, microsegmentation, acces base sur l\'identite, implementation et differences avec la securite perimetrique.',
  category: 'avance',
  tags: ['Zero Trust', 'securite', 'microsegmentation', 'IAM', 'ZTNA'],
  author: 'NetRevision',
  publishDate: '2026-02-19',
  readTime: '9 min',
  relatedChapters: ['securite-avancee', 'vpn-tunneling'],
  sections: [
    {
      title: 'La fin du perimetre de securite',
      content:
        "Le modele de securite traditionnel repose sur un perimetre : un pare-feu separe le reseau interne (de confiance) du reseau externe (non fiable). Tout ce qui est a l'interieur du pare-feu est considere comme sur, tout ce qui est a l'exterieur est potentiellement dangereux.\n\nCe modele a fonctionne pendant des decennies, mais il est devenu obsolete face aux realites actuelles. Le teletravail a dissous le perimetre physique : les employes se connectent depuis chez eux, des cafes, des aeroports. Le cloud a delocalise les applications : les donnees ne sont plus uniquement dans le datacenter de l'entreprise mais chez AWS, Azure, Google Cloud. Les menaces internes representent 30% des incidents de securite : un employe malveillant ou un poste compromis a un acces direct aux ressources internes.\n\nLe concept de Zero Trust, formalise par Forrester Research en 2010 et popularise par Google avec son projet BeyondCorp, part d'un principe simple et radical : ne jamais faire confiance, toujours verifier. Aucun utilisateur, aucun appareil, aucun flux reseau n'est considere comme fiable par defaut, qu'il soit a l'interieur ou a l'exterieur du reseau."
    },
    {
      title: 'Les principes fondamentaux du Zero Trust',
      content:
        "Le Zero Trust repose sur plusieurs principes cles. Premierement, la verification explicite : chaque demande d'acces est authentifiee et autorisee en fonction de l'identite de l'utilisateur, de l'etat de l'appareil, de la localisation, du comportement et du contexte. L'authentification multifacteur (MFA) est obligatoire pour tous les utilisateurs.\n\nDeuxiemement, le principe du moindre privilege : chaque utilisateur et chaque application n'obtient que les permissions strictement necessaires a sa fonction. Un comptable n'a pas acces aux serveurs de developpement, un developpeur n'a pas acces aux donnees financieres. Les permissions sont revues regulierement et revoquees des qu'elles ne sont plus necessaires.\n\nTroisiemement, l'hypothese de compromission : on part du principe que le reseau est deja compromis. Cela pousse a implementer du chiffrement partout (y compris sur le trafic interne), de la microsegmentation pour limiter les mouvements lateraux, et une surveillance continue pour detecter les anomalies.\n\nQuatriemement, la verification continue : l'authentification ne se fait pas qu'a la connexion initiale. Le systeme reevalue en permanence le niveau de confiance en fonction du comportement de l'utilisateur. Un acces depuis un nouveau pays, a une heure inhabituelle, declenche une verification supplementaire."
    },
    {
      title: 'Microsegmentation et ZTNA',
      content:
        "La microsegmentation est un pilier technique du Zero Trust. Au lieu d'avoir un seul grand reseau plat ou tous les systemes peuvent communiquer, on cree des segments granulaires avec des politiques de securite specifiques entre chaque segment.\n\nContrairement a la segmentation traditionnelle par VLAN (qui reste assez grossiere), la microsegmentation peut operer au niveau de la charge de travail individuelle. Chaque serveur, chaque conteneur, chaque application possede ses propres regles de communication. Un serveur web ne peut communiquer qu'avec le serveur d'applications sur le port 8080, le serveur d'applications ne peut communiquer qu'avec la base de donnees sur le port 5432.\n\nZTNA (Zero Trust Network Access) remplace le VPN traditionnel. Au lieu de donner acces a tout le reseau (comme un VPN classique), ZTNA n'autorise l'acces qu'aux applications specifiques dont l'utilisateur a besoin. L'utilisateur ne voit meme pas le reste du reseau. Si son poste est compromis, l'attaquant ne peut pas scanner le reseau interne ni se deplacer lateralement.\n\nLes solutions ZTNA populaires incluent Zscaler Private Access, Cloudflare Access, Palo Alto Prisma Access et Cisco Duo. Elles fonctionnent generalement avec un agent sur le poste client qui etablit un tunnel chiffre vers un point de presence cloud, ou l'authentification et l'autorisation sont verifiees avant chaque acces."
    },
    {
      title: 'Implementer le Zero Trust progressivement',
      content:
        "L'implementation du Zero Trust ne se fait pas du jour au lendemain. C'est un parcours progressif qui peut s'etaler sur plusieurs annees. Voici une approche en etapes.\n\nEtape 1 — Inventaire et visibilite : identifiez tous les utilisateurs, appareils, applications et flux de donnees de votre reseau. Vous ne pouvez pas proteger ce que vous ne connaissez pas. Deployez des outils de decouverte et de cartographie reseau.\n\nEtape 2 — Identite forte : implementez l'authentification multifacteur (MFA) pour tous les utilisateurs, un annuaire centralise (Azure AD, Okta), et une gestion des identites privilegiees (PAM) pour les comptes administrateurs.\n\nEtape 3 — Securite des postes : deployez un EDR (Endpoint Detection and Response), verifiez la conformite des postes avant d'accorder l'acces (patches a jour, antivirus actif, chiffrement du disque). Les postes non conformes sont mis en quarantaine.\n\nEtape 4 — Microsegmentation : commencez par les actifs les plus critiques (bases de donnees, serveurs de fichiers sensibles). Implementez progressivement des regles de communication entre segments. Surveillez avant de bloquer pour identifier les flux legitimes.\n\nEtape 5 — Surveillance et reponse : deployez un SIEM (Security Information and Event Management) pour correler les evenements de securite, un SOAR pour automatiser la reponse aux incidents, et des outils d'analyse comportementale (UEBA) pour detecter les anomalies.\n\nLe Zero Trust n'est pas un produit a acheter mais une strategie globale qui necessite un changement de mentalite. L'investissement en vaut la peine : les entreprises qui adoptent le Zero Trust reduisent significativement leur surface d'attaque et leur temps de detection des intrusions."
    }
  ]
}

// ============================================================
// EXPORT — All 16 articles
// ============================================================
export const blogArticles: BlogArticle[] = [
  article1,
  article2,
  article3,
  article4,
  article5,
  article6,
  article7,
  article8,
  article9,
  article10,
  article11,
  article12,
  article13,
  article14,
  article15,
  article16
]
