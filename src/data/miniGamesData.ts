export interface GridLevel {
  id: number
  name: string
  width: number
  height: number
  start: { x: number; y: number }
  end: { x: number; y: number }
  obstacles: { x: number; y: number; type: 'firewall' | 'broken_link' | 'loop' }[]
  routers: { x: number; y: number }[]
  optimalMoves: number
}

export interface PortMatch {
  service: string
  port: number
  protocol: string
  description: string
}

export interface HeaderField {
  name: string
  position: number
  size: string
  description: string
  category: 'TCP' | 'IP' | 'Ethernet'
}

// ─── Route the Packet: 10 levels ────────────────────────────────────────────

export const gridLevels: GridLevel[] = [
  {
    id: 1,
    name: 'Premier saut',
    width: 6,
    height: 6,
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    obstacles: [
      { x: 2, y: 1, type: 'firewall' },
      { x: 3, y: 3, type: 'broken_link' },
    ],
    routers: [{ x: 3, y: 1 }],
    optimalMoves: 12,
  },
  {
    id: 2,
    name: 'Contournement',
    width: 6,
    height: 6,
    start: { x: 0, y: 2 },
    end: { x: 5, y: 2 },
    obstacles: [
      { x: 2, y: 1, type: 'firewall' },
      { x: 2, y: 2, type: 'firewall' },
      { x: 2, y: 3, type: 'firewall' },
      { x: 4, y: 0, type: 'broken_link' },
    ],
    routers: [{ x: 3, y: 4 }, { x: 1, y: 0 }],
    optimalMoves: 14,
  },
  {
    id: 3,
    name: 'Boucle evitee',
    width: 7,
    height: 7,
    start: { x: 0, y: 0 },
    end: { x: 6, y: 6 },
    obstacles: [
      { x: 1, y: 1, type: 'loop' },
      { x: 3, y: 2, type: 'firewall' },
      { x: 3, y: 3, type: 'firewall' },
      { x: 5, y: 4, type: 'broken_link' },
      { x: 2, y: 5, type: 'loop' },
    ],
    routers: [{ x: 4, y: 1 }, { x: 1, y: 4 }],
    optimalMoves: 16,
  },
  {
    id: 4,
    name: 'Pare-feu central',
    width: 7,
    height: 7,
    start: { x: 0, y: 3 },
    end: { x: 6, y: 3 },
    obstacles: [
      { x: 3, y: 1, type: 'firewall' },
      { x: 3, y: 2, type: 'firewall' },
      { x: 3, y: 3, type: 'firewall' },
      { x: 3, y: 4, type: 'firewall' },
      { x: 3, y: 5, type: 'firewall' },
      { x: 5, y: 1, type: 'broken_link' },
    ],
    routers: [{ x: 1, y: 0 }, { x: 5, y: 6 }],
    optimalMoves: 16,
  },
  {
    id: 5,
    name: 'Labyrinthe reseau',
    width: 8,
    height: 8,
    start: { x: 0, y: 0 },
    end: { x: 7, y: 7 },
    obstacles: [
      { x: 1, y: 0, type: 'firewall' },
      { x: 1, y: 1, type: 'firewall' },
      { x: 1, y: 2, type: 'firewall' },
      { x: 3, y: 2, type: 'broken_link' },
      { x: 3, y: 4, type: 'firewall' },
      { x: 3, y: 5, type: 'firewall' },
      { x: 5, y: 3, type: 'loop' },
      { x: 5, y: 6, type: 'broken_link' },
      { x: 6, y: 1, type: 'firewall' },
    ],
    routers: [{ x: 2, y: 0 }, { x: 4, y: 3 }, { x: 6, y: 5 }],
    optimalMoves: 20,
  },
  {
    id: 6,
    name: 'Double pare-feu',
    width: 9,
    height: 8,
    start: { x: 0, y: 4 },
    end: { x: 8, y: 4 },
    obstacles: [
      { x: 2, y: 2, type: 'firewall' },
      { x: 2, y: 3, type: 'firewall' },
      { x: 2, y: 4, type: 'firewall' },
      { x: 2, y: 5, type: 'firewall' },
      { x: 6, y: 2, type: 'firewall' },
      { x: 6, y: 3, type: 'firewall' },
      { x: 6, y: 4, type: 'firewall' },
      { x: 6, y: 5, type: 'firewall' },
      { x: 4, y: 1, type: 'loop' },
      { x: 4, y: 6, type: 'broken_link' },
    ],
    routers: [{ x: 1, y: 1 }, { x: 4, y: 0 }, { x: 7, y: 7 }],
    optimalMoves: 22,
  },
  {
    id: 7,
    name: 'Topologie etoile',
    width: 9,
    height: 9,
    start: { x: 0, y: 0 },
    end: { x: 8, y: 8 },
    obstacles: [
      { x: 4, y: 3, type: 'firewall' },
      { x: 4, y: 4, type: 'firewall' },
      { x: 4, y: 5, type: 'firewall' },
      { x: 3, y: 4, type: 'firewall' },
      { x: 5, y: 4, type: 'firewall' },
      { x: 1, y: 3, type: 'broken_link' },
      { x: 7, y: 5, type: 'broken_link' },
      { x: 2, y: 7, type: 'loop' },
      { x: 6, y: 1, type: 'loop' },
    ],
    routers: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
    optimalMoves: 24,
  },
  {
    id: 8,
    name: 'Corridor etroit',
    width: 10,
    height: 10,
    start: { x: 0, y: 0 },
    end: { x: 9, y: 9 },
    obstacles: [
      { x: 1, y: 2, type: 'firewall' },
      { x: 2, y: 2, type: 'firewall' },
      { x: 3, y: 2, type: 'firewall' },
      { x: 4, y: 2, type: 'firewall' },
      { x: 5, y: 4, type: 'firewall' },
      { x: 6, y: 4, type: 'firewall' },
      { x: 7, y: 4, type: 'firewall' },
      { x: 8, y: 4, type: 'firewall' },
      { x: 2, y: 6, type: 'firewall' },
      { x: 3, y: 6, type: 'firewall' },
      { x: 4, y: 6, type: 'firewall' },
      { x: 3, y: 8, type: 'loop' },
      { x: 7, y: 7, type: 'broken_link' },
      { x: 6, y: 8, type: 'loop' },
    ],
    routers: [{ x: 5, y: 1 }, { x: 9, y: 3 }, { x: 1, y: 5 }, { x: 8, y: 7 }],
    optimalMoves: 28,
  },
  {
    id: 9,
    name: 'Reseau complexe',
    width: 11,
    height: 11,
    start: { x: 0, y: 5 },
    end: { x: 10, y: 5 },
    obstacles: [
      { x: 2, y: 3, type: 'firewall' },
      { x: 2, y: 4, type: 'firewall' },
      { x: 2, y: 5, type: 'firewall' },
      { x: 2, y: 6, type: 'firewall' },
      { x: 2, y: 7, type: 'firewall' },
      { x: 5, y: 1, type: 'broken_link' },
      { x: 5, y: 2, type: 'firewall' },
      { x: 5, y: 8, type: 'firewall' },
      { x: 5, y: 9, type: 'broken_link' },
      { x: 8, y: 3, type: 'firewall' },
      { x: 8, y: 4, type: 'firewall' },
      { x: 8, y: 5, type: 'firewall' },
      { x: 8, y: 6, type: 'firewall' },
      { x: 8, y: 7, type: 'firewall' },
      { x: 4, y: 4, type: 'loop' },
      { x: 6, y: 6, type: 'loop' },
    ],
    routers: [{ x: 1, y: 1 }, { x: 4, y: 0 }, { x: 6, y: 10 }, { x: 9, y: 9 }, { x: 7, y: 1 }],
    optimalMoves: 30,
  },
  {
    id: 10,
    name: 'Datacenter ultime',
    width: 12,
    height: 12,
    start: { x: 0, y: 0 },
    end: { x: 11, y: 11 },
    obstacles: [
      { x: 2, y: 1, type: 'firewall' },
      { x: 2, y: 2, type: 'firewall' },
      { x: 2, y: 3, type: 'firewall' },
      { x: 4, y: 3, type: 'broken_link' },
      { x: 4, y: 5, type: 'firewall' },
      { x: 4, y: 6, type: 'firewall' },
      { x: 4, y: 7, type: 'firewall' },
      { x: 6, y: 1, type: 'loop' },
      { x: 6, y: 8, type: 'firewall' },
      { x: 6, y: 9, type: 'firewall' },
      { x: 8, y: 3, type: 'firewall' },
      { x: 8, y: 4, type: 'firewall' },
      { x: 8, y: 5, type: 'firewall' },
      { x: 8, y: 6, type: 'broken_link' },
      { x: 10, y: 7, type: 'firewall' },
      { x: 10, y: 8, type: 'firewall' },
      { x: 10, y: 9, type: 'firewall' },
      { x: 3, y: 9, type: 'loop' },
      { x: 7, y: 11, type: 'broken_link' },
      { x: 9, y: 1, type: 'loop' },
    ],
    routers: [
      { x: 1, y: 4 }, { x: 3, y: 0 }, { x: 5, y: 4 },
      { x: 7, y: 7 }, { x: 9, y: 10 }, { x: 11, y: 5 },
    ],
    optimalMoves: 34,
  },
]

// ─── Match the Port: 24 pairs ──────────────────────────────────────────────

export const portMatches: PortMatch[] = [
  { service: 'HTTP', port: 80, protocol: 'TCP', description: 'Navigation web non chiffree' },
  { service: 'HTTPS', port: 443, protocol: 'TCP', description: 'Navigation web chiffree (TLS/SSL)' },
  { service: 'SSH', port: 22, protocol: 'TCP', description: 'Acces distant securise' },
  { service: 'FTP', port: 21, protocol: 'TCP', description: 'Transfert de fichiers (controle)' },
  { service: 'FTP-Data', port: 20, protocol: 'TCP', description: 'Transfert de fichiers (donnees)' },
  { service: 'SMTP', port: 25, protocol: 'TCP', description: 'Envoi d\'emails' },
  { service: 'POP3', port: 110, protocol: 'TCP', description: 'Reception d\'emails (telecharge)' },
  { service: 'IMAP', port: 143, protocol: 'TCP', description: 'Reception d\'emails (synchronise)' },
  { service: 'DNS', port: 53, protocol: 'TCP/UDP', description: 'Resolution de noms de domaine' },
  { service: 'DHCP-Serveur', port: 67, protocol: 'UDP', description: 'Attribution dynamique d\'adresses IP (serveur)' },
  { service: 'DHCP-Client', port: 68, protocol: 'UDP', description: 'Attribution dynamique d\'adresses IP (client)' },
  { service: 'TFTP', port: 69, protocol: 'UDP', description: 'Transfert de fichiers simplifie' },
  { service: 'SNMP', port: 161, protocol: 'UDP', description: 'Supervision reseau' },
  { service: 'SNMP-Trap', port: 162, protocol: 'UDP', description: 'Alertes de supervision reseau' },
  { service: 'Telnet', port: 23, protocol: 'TCP', description: 'Acces distant non securise' },
  { service: 'RDP', port: 3389, protocol: 'TCP', description: 'Bureau a distance Windows' },
  { service: 'MySQL', port: 3306, protocol: 'TCP', description: 'Base de donnees MySQL' },
  { service: 'LDAP', port: 389, protocol: 'TCP', description: 'Annuaire d\'authentification' },
  { service: 'NTP', port: 123, protocol: 'UDP', description: 'Synchronisation de l\'horloge' },
  { service: 'SYSLOG', port: 514, protocol: 'UDP', description: 'Journalisation centralisee' },
  { service: 'BGP', port: 179, protocol: 'TCP', description: 'Routage inter-AS (Internet)' },
  { service: 'OSPF', port: 89, protocol: 'IP', description: 'Routage interne (protocole 89)' },
  { service: 'RADIUS', port: 1812, protocol: 'UDP', description: 'Authentification reseau (AAA)' },
  { service: 'TACACS+', port: 49, protocol: 'TCP', description: 'Authentification equipements Cisco' },
]

// ─── Build the Header: 3 rounds ─────────────────────────────────────────────

export const headerFields: HeaderField[] = [
  // TCP header (10 fields)
  { name: 'Port Source', position: 0, size: '16 bits', description: 'Port de l\'application emettrice', category: 'TCP' },
  { name: 'Port Destination', position: 1, size: '16 bits', description: 'Port de l\'application receptrice', category: 'TCP' },
  { name: 'Numero de sequence', position: 2, size: '32 bits', description: 'Position du premier octet de donnees', category: 'TCP' },
  { name: 'Numero d\'acquittement', position: 3, size: '32 bits', description: 'Prochain octet attendu', category: 'TCP' },
  { name: 'Data Offset', position: 4, size: '4 bits', description: 'Taille de l\'en-tete TCP', category: 'TCP' },
  { name: 'Reserve', position: 5, size: '3 bits', description: 'Reserve pour usage futur', category: 'TCP' },
  { name: 'Flags', position: 6, size: '9 bits', description: 'SYN, ACK, FIN, RST, PSH, URG...', category: 'TCP' },
  { name: 'Taille de fenetre', position: 7, size: '16 bits', description: 'Controle de flux (window size)', category: 'TCP' },
  { name: 'Checksum', position: 8, size: '16 bits', description: 'Verification d\'integrite', category: 'TCP' },
  { name: 'Pointeur urgent', position: 9, size: '16 bits', description: 'Position des donnees urgentes', category: 'TCP' },

  // IP header (12 fields)
  { name: 'Version', position: 0, size: '4 bits', description: 'Version du protocole (4 ou 6)', category: 'IP' },
  { name: 'IHL', position: 1, size: '4 bits', description: 'Longueur de l\'en-tete (Internet Header Length)', category: 'IP' },
  { name: 'DSCP / ECN', position: 2, size: '8 bits', description: 'Qualite de service et notification de congestion', category: 'IP' },
  { name: 'Longueur totale', position: 3, size: '16 bits', description: 'Taille totale du paquet en octets', category: 'IP' },
  { name: 'Identification', position: 4, size: '16 bits', description: 'Identifiant unique du paquet', category: 'IP' },
  { name: 'Flags', position: 5, size: '3 bits', description: 'Controle de la fragmentation', category: 'IP' },
  { name: 'Fragment Offset', position: 6, size: '13 bits', description: 'Position du fragment dans le paquet', category: 'IP' },
  { name: 'TTL', position: 7, size: '8 bits', description: 'Duree de vie du paquet (Time To Live)', category: 'IP' },
  { name: 'Protocole', position: 8, size: '8 bits', description: 'Protocole encapsule (TCP=6, UDP=17)', category: 'IP' },
  { name: 'Checksum en-tete', position: 9, size: '16 bits', description: 'Verification d\'integrite de l\'en-tete', category: 'IP' },
  { name: 'Adresse source', position: 10, size: '32 bits', description: 'Adresse IP de l\'emetteur', category: 'IP' },
  { name: 'Adresse destination', position: 11, size: '32 bits', description: 'Adresse IP du destinataire', category: 'IP' },

  // Ethernet frame (7 fields)
  { name: 'Preambule', position: 0, size: '7 octets', description: 'Synchronisation de l\'horloge (101010...)', category: 'Ethernet' },
  { name: 'SFD', position: 1, size: '1 octet', description: 'Start Frame Delimiter (10101011)', category: 'Ethernet' },
  { name: 'MAC Destination', position: 2, size: '6 octets', description: 'Adresse MAC du destinataire', category: 'Ethernet' },
  { name: 'MAC Source', position: 3, size: '6 octets', description: 'Adresse MAC de l\'emetteur', category: 'Ethernet' },
  { name: 'EtherType', position: 4, size: '2 octets', description: 'Type de protocole encapsule (0x0800=IPv4)', category: 'Ethernet' },
  { name: 'Donnees / Payload', position: 5, size: '46-1500 octets', description: 'Charge utile (donnees transportees)', category: 'Ethernet' },
  { name: 'FCS', position: 6, size: '4 octets', description: 'Frame Check Sequence (CRC-32)', category: 'Ethernet' },
]
