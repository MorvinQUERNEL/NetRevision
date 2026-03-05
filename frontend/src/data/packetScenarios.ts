export interface HeaderField {
  name: string
  value: string
  color: string
}

export interface OsiLayerStep {
  layer: number
  layerName: string
  pduName: string
  headerName: string
  headerFields: HeaderField[]
  explanation: string
  icon: string
}

export interface PacketScenario {
  id: string
  title: string
  description: string
  sourceDevice: string
  destinationDevice: string
  protocol: string
  encapsulationSteps: OsiLayerStep[]
  decapsulationSteps: OsiLayerStep[]
}

const LAYER_COLORS = {
  application: '#6366f1',
  presentation: '#8b5cf6',
  session: '#a855f7',
  transport: '#00e5a0',
  network: '#f59e0b',
  dataLink: '#e11d48',
  physical: '#94a3b8',
}

export const packetScenarios: PacketScenario[] = [
  /* ================================================================== */
  /*  1. Requete HTTP                                                    */
  /* ================================================================== */
  {
    id: 'http-request',
    title: 'Requete HTTP',
    description:
      'Un navigateur web envoie une requete HTTP GET vers un serveur web pour charger une page. Le paquet traverse toutes les couches du modele OSI.',
    sourceDevice: 'Navigateur Web (PC Client)',
    destinationDevice: 'Serveur Web Apache',
    protocol: 'HTTP',
    encapsulationSteps: [
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'En-tete HTTP',
        headerFields: [
          { name: 'Methode', value: 'GET', color: LAYER_COLORS.application },
          { name: 'URL', value: '/index.html', color: LAYER_COLORS.application },
          { name: 'Host', value: 'www.example.com', color: LAYER_COLORS.application },
          { name: 'User-Agent', value: 'Mozilla/5.0', color: LAYER_COLORS.application },
          { name: 'Accept', value: 'text/html', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le navigateur cree une requete HTTP GET. Cette couche genere les donnees applicatives qui seront transmises au serveur distant. Le protocole HTTP definit la methode, l\'URL cible et les en-tetes de la requete.',
        icon: 'Globe',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Encodage / Formatage',
        headerFields: [
          { name: 'Encodage', value: 'UTF-8', color: LAYER_COLORS.presentation },
          { name: 'Compression', value: 'gzip', color: LAYER_COLORS.presentation },
          { name: 'Format', value: 'text/html', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'La couche Presentation s\'assure que les donnees sont dans un format comprehensible par le destinataire. Elle gere l\'encodage des caracteres (UTF-8), la compression eventuelle (gzip) et le format MIME.',
        icon: 'FileText',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Gestion de session',
        headerFields: [
          { name: 'Session ID', value: 'SID-48A3F2', color: LAYER_COLORS.session },
          { name: 'Etat', value: 'Etablissement', color: LAYER_COLORS.session },
          { name: 'Mode', value: 'Half-duplex', color: LAYER_COLORS.session },
        ],
        explanation:
          'La couche Session gere l\'ouverture, le maintien et la fermeture de la session de communication entre le client et le serveur. Elle controle le dialogue et la synchronisation des echanges.',
        icon: 'Link',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete TCP',
        headerFields: [
          { name: 'Port source', value: '49152', color: LAYER_COLORS.transport },
          { name: 'Port destination', value: '80', color: LAYER_COLORS.transport },
          { name: 'Numero de sequence', value: '1001', color: LAYER_COLORS.transport },
          { name: 'Numero ACK', value: '0', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Taille fenetre', value: '65535', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xA3F2', color: LAYER_COLORS.transport },
        ],
        explanation:
          'TCP encapsule les donnees dans un segment. Le port source est aleatoire (ephemere), le port destination est 80 (HTTP). Le flag SYN indique le debut du three-way handshake. La taille de fenetre controle le flux.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'IP source', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'IP destination', value: '93.184.216.34', color: LAYER_COLORS.network },
          { name: 'TTL', value: '128', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'Longueur totale', value: '512 octets', color: LAYER_COLORS.network },
          { name: 'Identification', value: '0x1A2B', color: LAYER_COLORS.network },
        ],
        explanation:
          'La couche Reseau ajoute l\'en-tete IP avec les adresses logiques source et destination. Le champ TTL (Time To Live) empeche les boucles de routage. Le champ Protocole indique que le segment superieur est TCP (valeur 6).',
        icon: 'Network',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: 'DD:EE:FF:44:55:66', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xC4D5E6F7', color: LAYER_COLORS.dataLink },
          { name: 'Preambule', value: '7 octets + SFD', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La couche Liaison encapsule le paquet IP dans une trame Ethernet. Les adresses MAC identifient les interfaces physiques sur le reseau local. Le FCS (Frame Check Sequence) permet de detecter les erreurs de transmission. L\'EtherType 0x0800 indique IPv4.',
        icon: 'Cable',
      },
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'Manchester', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat6', color: LAYER_COLORS.physical },
          { name: 'Debit', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connecteur', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'La couche Physique convertit la trame en signaux electriques transmis sur le cable Ethernet. L\'encodage Manchester assure la synchronisation de l\'horloge. Le cable Cat6 supporte un debit de 1 Gbps avec un connecteur RJ-45.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'Manchester', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat6', color: LAYER_COLORS.physical },
          { name: 'Debit', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connecteur', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Le serveur recoit les signaux electriques sur son interface reseau. La carte reseau demodule le signal et reconstitue le flux binaire (bits) a partir des impulsions electriques recues sur le cable.',
        icon: 'Cpu',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: 'DD:EE:FF:44:55:66', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xC4D5E6F7 (valide)', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La couche Liaison verifie l\'adresse MAC destination (c\'est bien la sienne). Le FCS est recalcule et compare pour verifier l\'integrite de la trame. L\'en-tete Ethernet est retire et le paquet IP est extrait.',
        icon: 'Cable',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'IP source', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'IP destination', value: '93.184.216.34', color: LAYER_COLORS.network },
          { name: 'TTL', value: '128', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '6 (TCP)', color: LAYER_COLORS.network },
        ],
        explanation:
          'La couche Reseau verifie que l\'adresse IP destination correspond au serveur. Le champ Protocole (6) indique que les donnees doivent etre transmises a TCP. L\'en-tete IP est retire et le segment TCP est extrait.',
        icon: 'Network',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete TCP',
        headerFields: [
          { name: 'Port source', value: '49152', color: LAYER_COLORS.transport },
          { name: 'Port destination', value: '80', color: LAYER_COLORS.transport },
          { name: 'Numero de sequence', value: '1001', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xA3F2 (valide)', color: LAYER_COLORS.transport },
        ],
        explanation:
          'TCP verifie le checksum pour valider l\'integrite du segment. Le port destination 80 identifie le service HTTP. Le numero de sequence est enregistre pour le suivi de la connexion. L\'en-tete TCP est retire.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Gestion de session',
        headerFields: [
          { name: 'Session ID', value: 'SID-48A3F2', color: LAYER_COLORS.session },
          { name: 'Etat', value: 'Active', color: LAYER_COLORS.session },
        ],
        explanation:
          'La couche Session identifie la session de communication et s\'assure que les donnees sont correctement associees a la bonne session en cours entre le client et le serveur.',
        icon: 'Link',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Decodage / Formatage',
        headerFields: [
          { name: 'Decodage', value: 'UTF-8', color: LAYER_COLORS.presentation },
          { name: 'Decompression', value: 'gzip -> texte', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'La couche Presentation decode les donnees (UTF-8), les decompresse si necessaire (gzip) et les convertit dans un format utilisable par la couche Application.',
        icon: 'FileText',
      },
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Requete HTTP recue',
        headerFields: [
          { name: 'Methode', value: 'GET', color: LAYER_COLORS.application },
          { name: 'URL', value: '/index.html', color: LAYER_COLORS.application },
          { name: 'Host', value: 'www.example.com', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le serveur web Apache recoit la requete HTTP GET complete. Il traite la demande, localise le fichier /index.html et prepare la reponse HTTP qui suivra le processus d\'encapsulation inverse.',
        icon: 'Globe',
      },
    ],
  },

  /* ================================================================== */
  /*  2. Ping ICMP                                                       */
  /* ================================================================== */
  {
    id: 'icmp-ping',
    title: 'Ping ICMP',
    description:
      'Un PC envoie une requete ICMP Echo Request vers un autre PC pour tester la connectivite reseau. ICMP n\'utilise pas la couche Transport.',
    sourceDevice: 'PC Administrateur',
    destinationDevice: 'PC Cible (192.168.1.50)',
    protocol: 'ICMP',
    encapsulationSteps: [
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Commande Ping',
        headerFields: [
          { name: 'Commande', value: 'ping 192.168.1.50', color: LAYER_COLORS.application },
          { name: 'Nombre', value: '4 requetes', color: LAYER_COLORS.application },
          { name: 'Taille', value: '32 octets', color: LAYER_COLORS.application },
        ],
        explanation:
          'L\'utilisateur lance la commande ping depuis le terminal. L\'application genere une requete ICMP Echo Request avec un payload de 32 octets. Ping est un outil de diagnostic de la couche Application.',
        icon: 'Terminal',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Formatage ICMP',
        headerFields: [
          { name: 'Format', value: 'Binaire brut', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'Pour ICMP, la couche Presentation est transparente. Les donnees sont deja au format binaire et ne necessitent ni encodage ni compression specifique.',
        icon: 'FileText',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session ICMP',
        headerFields: [
          { name: 'Type', value: 'Sans session', color: LAYER_COLORS.session },
        ],
        explanation:
          'ICMP est un protocole sans connexion : il ne necessite pas d\'etablissement de session. Chaque requete Echo est independante.',
        icon: 'Link',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP + ICMP',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'IP source', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'IP destination', value: '192.168.1.50', color: LAYER_COLORS.network },
          { name: 'TTL', value: '64', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '1 (ICMP)', color: LAYER_COLORS.network },
          { name: 'Type ICMP', value: '8 (Echo Request)', color: LAYER_COLORS.network },
          { name: 'Code ICMP', value: '0', color: LAYER_COLORS.network },
          { name: 'Identifiant', value: '0x0001', color: LAYER_COLORS.network },
          { name: 'Sequence', value: '1', color: LAYER_COLORS.network },
        ],
        explanation:
          'ICMP est encapsule directement dans IP sans passer par la couche Transport (pas de TCP ni UDP). Le champ Protocole IP vaut 1 pour ICMP. Le type 8 indique un Echo Request et le numero de sequence permet d\'associer requete et reponse.',
        icon: 'Network',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: '11:22:33:AA:BB:CC', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xD1E2F3A4', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La trame Ethernet encapsule le paquet IP. L\'adresse MAC destination a ete resolue par ARP avant l\'envoi du ping. Sur le meme reseau local, c\'est l\'adresse MAC directe de la cible.',
        icon: 'Cable',
      },
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: '4B/5B + NRZI', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat5e', color: LAYER_COLORS.physical },
          { name: 'Debit', value: '100 Mbps', color: LAYER_COLORS.physical },
          { name: 'Connecteur', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Les bits de la trame sont convertis en signaux electriques sur le cable Cat5e. L\'encodage 4B/5B garantit suffisamment de transitions pour la synchronisation a 100 Mbps (Fast Ethernet).',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: '4B/5B + NRZI', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat5e', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Le PC cible recoit les signaux electriques et les reconvertit en bits. La carte reseau synchronise son horloge avec le preambule de la trame pour lire correctement les donnees.',
        icon: 'Cpu',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: '11:22:33:AA:BB:CC', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xD1E2F3A4 (valide)', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La couche Liaison verifie que la MAC destination correspond a sa propre adresse. Le FCS est valide, la trame est acceptee. L\'en-tete Ethernet est retire pour extraire le paquet IP.',
        icon: 'Cable',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP + ICMP',
        headerFields: [
          { name: 'IP destination', value: '192.168.1.50 (moi)', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '1 (ICMP)', color: LAYER_COLORS.network },
          { name: 'Type ICMP', value: '8 (Echo Request)', color: LAYER_COLORS.network },
          { name: 'Sequence', value: '1', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'IP destination correspond a ce PC. Le champ Protocole 1 indique ICMP. Le type 8 est un Echo Request : le PC doit repondre avec un Echo Reply (type 0). Le numero de sequence est note pour la reponse.',
        icon: 'Network',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session ICMP',
        headerFields: [
          { name: 'Type', value: 'Reponse directe', color: LAYER_COLORS.session },
        ],
        explanation:
          'Pas de gestion de session pour ICMP. Le systeme d\'exploitation prepare directement la reponse Echo Reply.',
        icon: 'Link',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Decodage',
        headerFields: [
          { name: 'Format', value: 'Binaire brut', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'Les donnees ICMP sont au format binaire brut et ne necessitent pas de transformation par la couche Presentation.',
        icon: 'FileText',
      },
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Resultat Ping',
        headerFields: [
          { name: 'Resultat', value: 'Echo Request recu', color: LAYER_COLORS.application },
          { name: 'Action', value: 'Preparer Echo Reply', color: LAYER_COLORS.application },
          { name: 'Latence', value: '< 1 ms (LAN)', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le PC cible a recu le ping avec succes. Le systeme prepare automatiquement un ICMP Echo Reply (type 0, code 0) qui sera encapsule et renvoye a l\'expediteur pour confirmer la connectivite.',
        icon: 'Terminal',
      },
    ],
  },

  /* ================================================================== */
  /*  3. Requete DNS                                                     */
  /* ================================================================== */
  {
    id: 'dns-query',
    title: 'Requete DNS',
    description:
      'Un PC envoie une requete DNS pour resoudre le nom de domaine "www.example.com" en adresse IP. DNS utilise UDP pour les requetes standard.',
    sourceDevice: 'PC Client',
    destinationDevice: 'Serveur DNS (8.8.8.8)',
    protocol: 'DNS',
    encapsulationSteps: [
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'En-tete DNS',
        headerFields: [
          { name: 'Transaction ID', value: '0x1A2B', color: LAYER_COLORS.application },
          { name: 'Type', value: 'Requete (QR=0)', color: LAYER_COLORS.application },
          { name: 'Nom demande', value: 'www.example.com', color: LAYER_COLORS.application },
          { name: 'Type enregistrement', value: 'A (IPv4)', color: LAYER_COLORS.application },
          { name: 'Classe', value: 'IN (Internet)', color: LAYER_COLORS.application },
          { name: 'Recursion', value: 'Demandee (RD=1)', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le client DNS cree une requete pour resoudre le nom "www.example.com" en adresse IPv4. Le type A demande un enregistrement d\'adresse. Le flag RD (Recursion Desired) demande au serveur de faire une resolution recursive.',
        icon: 'Search',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Encodage DNS',
        headerFields: [
          { name: 'Format', value: 'Binaire DNS (RFC 1035)', color: LAYER_COLORS.presentation },
          { name: 'Encodage nom', value: 'Labels (3www7example3com0)', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'Le nom de domaine est encode au format DNS : chaque label est precede de sa longueur en octets. "www.example.com" devient "3www7example3com0" en notation binaire.',
        icon: 'FileText',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session DNS',
        headerFields: [
          { name: 'Type', value: 'Transaction unique', color: LAYER_COLORS.session },
          { name: 'ID Transaction', value: '0x1A2B', color: LAYER_COLORS.session },
        ],
        explanation:
          'DNS utilise un identifiant de transaction pour associer chaque requete a sa reponse. Ce mecanisme remplace l\'etablissement formel d\'une session.',
        icon: 'Link',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete UDP',
        headerFields: [
          { name: 'Port source', value: '51234', color: LAYER_COLORS.transport },
          { name: 'Port destination', value: '53', color: LAYER_COLORS.transport },
          { name: 'Longueur', value: '45 octets', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xB7C8', color: LAYER_COLORS.transport },
        ],
        explanation:
          'DNS utilise UDP (port 53) pour les requetes standard car la rapidite est prioritaire sur la fiabilite. UDP n\'etablit pas de connexion : pas de three-way handshake, pas de retransmission automatique. Le datagramme est plus leger que TCP.',
        icon: 'Zap',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'IP source', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'IP destination', value: '8.8.8.8', color: LAYER_COLORS.network },
          { name: 'TTL', value: '64', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '17 (UDP)', color: LAYER_COLORS.network },
          { name: 'DSCP', value: '0 (Best Effort)', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'en-tete IP cible le serveur DNS public de Google (8.8.8.8). Le champ Protocole vaut 17, indiquant UDP. Le TTL de 64 est typique pour un systeme Linux. Comme le serveur est hors du reseau local, le paquet sera route via la passerelle par defaut.',
        icon: 'Network',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: 'FF:EE:DD:99:88:77', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xE5F6A7B8', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La MAC destination est celle de la passerelle par defaut (routeur), pas celle du serveur DNS distant. Le PC utilise ARP pour resoudre l\'adresse MAC du routeur. Le routeur relaiera le paquet vers Internet.',
        icon: 'Cable',
      },
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat5e', color: LAYER_COLORS.physical },
          { name: 'Debit', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connecteur', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Les bits sont convertis en signaux electriques avec l\'encodage PAM-5 (Pulse Amplitude Modulation a 5 niveaux), utilise pour le Gigabit Ethernet sur cable cuivre Cat5e.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Optique (fibre)', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: '64B/66B', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Fibre optique monomode', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Le serveur DNS de Google recoit les signaux optiques via fibre monomode. Les photodetecteurs convertissent les impulsions lumineuses en signaux electriques puis en bits.',
        icon: 'Cpu',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC destination', value: 'Adresse locale serveur', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: 'Valide', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'Apres plusieurs sauts de routeurs, la trame finale a une MAC destination correspondant au serveur DNS. Le FCS est verifie, la trame est acceptee et l\'en-tete Ethernet est retire.',
        icon: 'Cable',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'IP destination', value: '8.8.8.8 (moi)', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '17 (UDP)', color: LAYER_COLORS.network },
          { name: 'TTL restant', value: '52', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'adresse IP destination correspond au serveur. Le TTL a diminue a chaque routeur traverse (64 -> 52 = 12 sauts). Le champ Protocole 17 indique que le contenu doit etre transmis a UDP.',
        icon: 'Network',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete UDP',
        headerFields: [
          { name: 'Port destination', value: '53 (DNS)', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xB7C8 (valide)', color: LAYER_COLORS.transport },
        ],
        explanation:
          'Le port destination 53 identifie le service DNS. Le checksum est verifie. UDP transmet directement les donnees au processus DNS du serveur sans garantie de livraison.',
        icon: 'Zap',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Transaction DNS',
        headerFields: [
          { name: 'ID Transaction', value: '0x1A2B', color: LAYER_COLORS.session },
        ],
        explanation:
          'L\'identifiant de transaction permet au serveur DNS de tracer la requete et d\'associer sa reponse au bon client demandeur.',
        icon: 'Link',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Decodage DNS',
        headerFields: [
          { name: 'Decodage nom', value: '3www7example3com0 -> www.example.com', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'Le serveur decode le nom de domaine depuis le format binaire DNS vers sa representation textuelle pour effectuer la recherche dans sa base de donnees.',
        icon: 'FileText',
      },
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Requete DNS recue',
        headerFields: [
          { name: 'Nom demande', value: 'www.example.com', color: LAYER_COLORS.application },
          { name: 'Type', value: 'A (IPv4)', color: LAYER_COLORS.application },
          { name: 'Reponse', value: '93.184.216.34', color: LAYER_COLORS.application },
          { name: 'TTL reponse', value: '3600 s', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le serveur DNS trouve l\'enregistrement A pour "www.example.com" et prepare la reponse avec l\'adresse IP 93.184.216.34. Le TTL de 3600 secondes indique combien de temps le client peut mettre en cache cette reponse.',
        icon: 'Search',
      },
    ],
  },

  /* ================================================================== */
  /*  4. Transfert FTP                                                   */
  /* ================================================================== */
  {
    id: 'ftp-transfer',
    title: 'Transfert FTP',
    description:
      'Un PC se connecte a un serveur FTP pour telecharger un fichier. FTP utilise TCP pour garantir l\'integrite du transfert de fichiers.',
    sourceDevice: 'PC Client (FileZilla)',
    destinationDevice: 'Serveur FTP',
    protocol: 'FTP',
    encapsulationSteps: [
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Commande FTP',
        headerFields: [
          { name: 'Commande', value: 'RETR rapport.pdf', color: LAYER_COLORS.application },
          { name: 'Mode', value: 'Passif (PASV)', color: LAYER_COLORS.application },
          { name: 'Type', value: 'Binaire (TYPE I)', color: LAYER_COLORS.application },
          { name: 'Utilisateur', value: 'admin', color: LAYER_COLORS.application },
          { name: 'Canal', value: 'Commande (port 21)', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le client FTP envoie la commande RETR pour telecharger "rapport.pdf". FTP utilise deux canaux : le canal de commande (port 21) pour les instructions et un canal de donnees (port negocie en mode PASV) pour le transfert effectif du fichier.',
        icon: 'Download',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Encodage FTP',
        headerFields: [
          { name: 'Encodage commandes', value: 'ASCII (NVT)', color: LAYER_COLORS.presentation },
          { name: 'Encodage donnees', value: 'Binaire (TYPE I)', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'Les commandes FTP sont en ASCII (Network Virtual Terminal). Le transfert en mode binaire (TYPE I) preserve les octets exacts du fichier sans modification, indispensable pour les fichiers PDF.',
        icon: 'FileText',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session FTP',
        headerFields: [
          { name: 'Session', value: 'Authentifiee', color: LAYER_COLORS.session },
          { name: 'Canal commande', value: 'Actif', color: LAYER_COLORS.session },
          { name: 'Canal donnees', value: 'En cours d\'ouverture', color: LAYER_COLORS.session },
        ],
        explanation:
          'FTP maintient une session authentifiee avec deux connexions TCP simultanees. La couche Session gere la coordination entre le canal de commande et le canal de donnees pour le transfert.',
        icon: 'Link',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete TCP',
        headerFields: [
          { name: 'Port source', value: '52100', color: LAYER_COLORS.transport },
          { name: 'Port destination', value: '21', color: LAYER_COLORS.transport },
          { name: 'Numero de sequence', value: '3001', color: LAYER_COLORS.transport },
          { name: 'Numero ACK', value: '2501', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'PSH, ACK', color: LAYER_COLORS.transport },
          { name: 'Taille fenetre', value: '131072', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xC9D0', color: LAYER_COLORS.transport },
        ],
        explanation:
          'TCP garantit la livraison fiable de chaque octet du fichier. Le flag PSH (Push) indique que les donnees doivent etre transmises immediatement a l\'application. La fenetre glissante de 128 Ko optimise le debit du transfert.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'IP source', value: '10.0.0.5', color: LAYER_COLORS.network },
          { name: 'IP destination', value: '203.0.113.10', color: LAYER_COLORS.network },
          { name: 'TTL', value: '128', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'DF', value: 'Don\'t Fragment (1)', color: LAYER_COLORS.network },
          { name: 'Longueur totale', value: '1500 octets', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'en-tete IP route le paquet vers le serveur FTP distant. Le flag DF (Don\'t Fragment) est active : si le paquet est trop gros pour un lien, un message ICMP "Fragmentation Needed" sera retourne. La MTU standard de 1500 octets est utilisee.',
        icon: 'Network',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'CC:DD:EE:33:44:55', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: '00:1A:2B:3C:4D:5E', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'VLAN Tag', value: '802.1Q VLAN 10', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xF1A2B3C4', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La trame inclut un tag 802.1Q pour le VLAN 10. La MAC destination est celle du routeur/passerelle pour atteindre le serveur FTP sur un reseau distant. Le FCS assure l\'integrite de la trame sur le lien local.',
        icon: 'Cable',
      },
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat6a', color: LAYER_COLORS.physical },
          { name: 'Debit', value: '10 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connecteur', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Le transfert utilise un cable Cat6a capable de supporter 10 Gbps. L\'encodage PAM-5 sur les 4 paires torsadees permet d\'atteindre ce debit. La trame entiere est transmise en quelques microsecondes.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat6a', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Le serveur FTP recoit les signaux electriques sur son interface reseau 10 Gbps. Le preambule permet la synchronisation et le SFD (Start Frame Delimiter) signale le debut de la trame.',
        icon: 'Cpu',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC destination', value: 'Adresse locale serveur', color: LAYER_COLORS.dataLink },
          { name: 'VLAN', value: 'Tag retire par le switch', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: 'Valide', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'Le tag VLAN a ete retire par le switch de sortie. La MAC destination correspond a l\'interface du serveur FTP. Le FCS est verifie avec succes et l\'en-tete Ethernet est retire.',
        icon: 'Cable',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'IP destination', value: '203.0.113.10 (moi)', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'TTL restant', value: '120', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'adresse IP destination correspond au serveur FTP. Le champ Protocole 6 dirige les donnees vers TCP. Le paquet a traverse 8 routeurs (TTL passe de 128 a 120).',
        icon: 'Network',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete TCP',
        headerFields: [
          { name: 'Port destination', value: '21 (FTP)', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'PSH, ACK', color: LAYER_COLORS.transport },
          { name: 'Sequence', value: '3001', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xC9D0 (valide)', color: LAYER_COLORS.transport },
        ],
        explanation:
          'TCP verifie le checksum et le numero de sequence pour garantir l\'ordre correct. Le flag PSH indique que les donnees doivent etre transmises immediatement au service FTP. Un ACK sera envoye en retour.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session FTP',
        headerFields: [
          { name: 'Session', value: 'Authentifiee (admin)', color: LAYER_COLORS.session },
          { name: 'Canal', value: 'Commande', color: LAYER_COLORS.session },
        ],
        explanation:
          'La session FTP est identifiee comme appartenant a l\'utilisateur "admin". La commande est acheminee vers le bon canal (commande sur le port 21).',
        icon: 'Link',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Decodage FTP',
        headerFields: [
          { name: 'Decodage', value: 'ASCII -> commande FTP', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'La commande FTP est decodee depuis le format NVT ASCII en texte lisible par le serveur FTP pour etre interpretee.',
        icon: 'FileText',
      },
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Commande FTP recue',
        headerFields: [
          { name: 'Commande', value: 'RETR rapport.pdf', color: LAYER_COLORS.application },
          { name: 'Reponse', value: '150 Ouverture canal donnees', color: LAYER_COLORS.application },
          { name: 'Fichier', value: 'rapport.pdf (2.4 Mo)', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le serveur FTP recoit la commande RETR et repond avec le code 150 (ouverture du canal de donnees). Le fichier "rapport.pdf" de 2.4 Mo va etre transmis via le canal de donnees negocie en mode PASV.',
        icon: 'Download',
      },
    ],
  },

  /* ================================================================== */
  /*  5. Connexion SSH                                                   */
  /* ================================================================== */
  {
    id: 'ssh-connection',
    title: 'Connexion SSH',
    description:
      'Un administrateur se connecte a un serveur distant via SSH pour une administration securisee. SSH chiffre l\'ensemble de la communication.',
    sourceDevice: 'PC Admin (Terminal)',
    destinationDevice: 'Serveur Linux (10.0.1.1)',
    protocol: 'SSH',
    encapsulationSteps: [
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Protocole SSH',
        headerFields: [
          { name: 'Version', value: 'SSH-2.0', color: LAYER_COLORS.application },
          { name: 'Commande', value: 'ssh admin@10.0.1.1', color: LAYER_COLORS.application },
          { name: 'Methode auth', value: 'Cle publique RSA-4096', color: LAYER_COLORS.application },
          { name: 'Shell', value: '/bin/bash', color: LAYER_COLORS.application },
          { name: 'Terminal', value: 'xterm-256color', color: LAYER_COLORS.application },
        ],
        explanation:
          'L\'administrateur initie une connexion SSH v2 avec authentification par cle publique RSA-4096 bits. SSH offre un acces distant securise au shell du serveur. Le protocole negocie les algorithmes de chiffrement et de hachage.',
        icon: 'Terminal',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Chiffrement SSH',
        headerFields: [
          { name: 'Chiffrement', value: 'AES-256-GCM', color: LAYER_COLORS.presentation },
          { name: 'Echange cles', value: 'Diffie-Hellman (curve25519)', color: LAYER_COLORS.presentation },
          { name: 'MAC', value: 'HMAC-SHA2-256', color: LAYER_COLORS.presentation },
          { name: 'Compression', value: 'zlib@openssh.com', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'SSH chiffre les donnees avec AES-256-GCM, un algorithme symetrique tres robuste. L\'echange de cles utilise Diffie-Hellman sur courbe elliptique (curve25519). Le HMAC garantit l\'integrite de chaque paquet.',
        icon: 'Lock',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session SSH',
        headerFields: [
          { name: 'Session ID', value: 'SHA256:Kx7j...9bR2', color: LAYER_COLORS.session },
          { name: 'Canaux', value: 'session (0)', color: LAYER_COLORS.session },
          { name: 'Keep-alive', value: '60 secondes', color: LAYER_COLORS.session },
        ],
        explanation:
          'SSH etablit une session chiffree identifiee par un hash unique. Les canaux multiplexes permettent de gerer plusieurs flux (shell, tunnels, transferts SFTP) sur une seule connexion TCP.',
        icon: 'Link',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete TCP',
        headerFields: [
          { name: 'Port source', value: '54321', color: LAYER_COLORS.transport },
          { name: 'Port destination', value: '22', color: LAYER_COLORS.transport },
          { name: 'Numero de sequence', value: '5001', color: LAYER_COLORS.transport },
          { name: 'Numero ACK', value: '0', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Taille fenetre', value: '65535', color: LAYER_COLORS.transport },
          { name: 'Options', value: 'MSS=1460, SACK, Timestamps', color: LAYER_COLORS.transport },
        ],
        explanation:
          'SSH utilise TCP (port 22) pour garantir la livraison fiable et ordonnee de chaque octet. Le SYN initie le three-way handshake. Les options TCP incluent MSS (Maximum Segment Size), SACK (Selective ACK) et les timestamps pour le calcul RTT.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'IP source', value: '10.0.0.100', color: LAYER_COLORS.network },
          { name: 'IP destination', value: '10.0.1.1', color: LAYER_COLORS.network },
          { name: 'TTL', value: '64', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'DSCP', value: 'CS6 (48) - Network Control', color: LAYER_COLORS.network },
          { name: 'ECN', value: 'ECT(0)', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'en-tete IP route le paquet entre deux sous-reseaux (10.0.0.0/24 vers 10.0.1.0/24). Le DSCP CS6 marque le trafic SSH comme prioritaire (administration reseau). L\'ECN (Explicit Congestion Notification) est active pour eviter les pertes de paquets.',
        icon: 'Network',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC source', value: 'EE:FF:00:AA:BB:CC', color: LAYER_COLORS.dataLink },
          { name: 'MAC destination', value: '00:11:22:33:44:55', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'VLAN Tag', value: '802.1Q VLAN 100 (Admin)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xA1B2C3D4', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La trame est etiquetee VLAN 100 (reseau d\'administration). La MAC destination est celle du routeur inter-VLAN qui reliera les deux sous-reseaux. La separation en VLANs isole le trafic d\'administration du trafic utilisateur.',
        icon: 'Cable',
      },
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat6', color: LAYER_COLORS.physical },
          { name: 'Debit', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connecteur', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Les bits chiffres sont transmis comme signaux electriques sur le cable Cat6. Le chiffrement SSH est transparent pour la couche physique : elle transmet les bits sans distinguer donnees en clair et donnees chiffrees.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1,
        layerName: 'Physique',
        pduName: 'Bits',
        headerName: 'Signal physique',
        headerFields: [
          { name: 'Type de signal', value: 'Electrique', color: LAYER_COLORS.physical },
          { name: 'Encodage', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Cable Ethernet Cat6', color: LAYER_COLORS.physical },
        ],
        explanation:
          'Le serveur Linux recoit les signaux electriques sur son interface reseau. La carte reseau demodule les signaux PAM-5 en un flux de bits numeriques pour la couche superieure.',
        icon: 'Cpu',
      },
      {
        layer: 2,
        layerName: 'Liaison de donnees',
        pduName: 'Trame',
        headerName: 'En-tete Ethernet',
        headerFields: [
          { name: 'MAC destination', value: 'Adresse locale serveur', color: LAYER_COLORS.dataLink },
          { name: 'VLAN', value: 'VLAN 100 (Admin)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xA1B2C3D4 (valide)', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'La couche Liaison verifie la MAC destination et le FCS. Le tag VLAN 100 confirme que le trafic provient du reseau d\'administration autorise. L\'en-tete Ethernet est retire.',
        icon: 'Cable',
      },
      {
        layer: 3,
        layerName: 'Reseau',
        pduName: 'Paquet',
        headerName: 'En-tete IP',
        headerFields: [
          { name: 'IP destination', value: '10.0.1.1 (moi)', color: LAYER_COLORS.network },
          { name: 'Protocole', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'TTL restant', value: '63', color: LAYER_COLORS.network },
          { name: 'DSCP', value: 'CS6 (prioritaire)', color: LAYER_COLORS.network },
        ],
        explanation:
          'L\'IP destination correspond au serveur. Le paquet a traverse 1 routeur (TTL 64 -> 63). Le DSCP CS6 indique au serveur que ce trafic est prioritaire. Le champ Protocole 6 redirige vers TCP.',
        icon: 'Network',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'En-tete TCP',
        headerFields: [
          { name: 'Port destination', value: '22 (SSH)', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Sequence', value: '5001', color: LAYER_COLORS.transport },
          { name: 'Options', value: 'MSS=1460, SACK, Timestamps', color: LAYER_COLORS.transport },
        ],
        explanation:
          'Le port 22 identifie le service SSH (sshd). Le flag SYN indique une demande de connexion : le serveur doit repondre avec SYN-ACK pour continuer le three-way handshake. Les options TCP sont enregistrees pour la connexion.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Donnees',
        headerName: 'Session SSH',
        headerFields: [
          { name: 'Etat', value: 'Negociation en cours', color: LAYER_COLORS.session },
          { name: 'Phase', value: 'Echange version SSH', color: LAYER_COLORS.session },
        ],
        explanation:
          'Le demon SSH (sshd) commence la negociation de session. La premiere etape est l\'echange de versions du protocole SSH, suivi de la negociation des algorithmes cryptographiques.',
        icon: 'Link',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Donnees',
        headerName: 'Negociation crypto',
        headerFields: [
          { name: 'Chiffrement propose', value: 'AES-256-GCM', color: LAYER_COLORS.presentation },
          { name: 'Echange cles', value: 'curve25519-sha256', color: LAYER_COLORS.presentation },
          { name: 'Cle hote', value: 'ssh-ed25519', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'Le serveur examine les algorithmes proposes par le client et selectionne les plus securises supportes par les deux parties. Le chiffrement AES-256-GCM et la courbe elliptique curve25519 sont choisis.',
        icon: 'Lock',
      },
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Donnees',
        headerName: 'Service SSH pret',
        headerFields: [
          { name: 'Service', value: 'sshd (OpenSSH 9.6)', color: LAYER_COLORS.application },
          { name: 'Auth requise', value: 'publickey (RSA-4096)', color: LAYER_COLORS.application },
          { name: 'Banniere', value: 'Bienvenue sur le serveur', color: LAYER_COLORS.application },
          { name: 'Shell pret', value: '/bin/bash', color: LAYER_COLORS.application },
        ],
        explanation:
          'Le demon SSH (OpenSSH 9.6) est pret a authentifier l\'administrateur. Apres verification de la cle publique RSA-4096, une session shell interactive /bin/bash sera ouverte. Toutes les commandes seront chiffrees de bout en bout.',
        icon: 'Terminal',
      },
    ],
  },
]
