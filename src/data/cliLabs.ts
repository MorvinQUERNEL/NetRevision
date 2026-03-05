import { DeviceState } from './ciscoCommands'

// --- Types ---

export interface LabObjective {
  id: string
  description: string
  validate: (state: DeviceState) => boolean
}

export interface LabScenario {
  id: number
  slug: string
  title: string
  description: string
  difficulty: 'debutant' | 'intermediaire' | 'avance' | 'expert'
  chapterSlug: string
  points: number
  initialState: Partial<DeviceState>
  topology: string
  objectives: LabObjective[]
  hints: string[]
}

// --- Labs ---

export const cliLabs: LabScenario[] = [
  // ===== Ch5: Routage statique =====
  {
    id: 1,
    slug: 'route-statique-basique',
    title: 'Route statique basique',
    description: 'Configure une route statique pour atteindre le reseau 10.0.2.0/24 via le routeur voisin.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN local' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.1.1', subnetMask: '255.255.255.252', isUp: true, description: 'Lien vers R2' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [PC1] --- [R1] ---- [R2] --- [PC2]
  192.168.1.0/24  10.0.1.0/30  10.0.2.0/24
              .1  .1    .2  .1
    `,
    objectives: [
      {
        id: 'static-route',
        description: 'Ajouter la route statique vers 10.0.2.0/24 via 10.0.1.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '10.0.2.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.1.2'
        ),
      },
    ],
    hints: [
      'Utilisez la commande: ip route <destination> <masque> <next-hop>',
      'N\'oubliez pas de passer en mode configure terminal d\'abord',
      'La commande exacte: ip route 10.0.2.0 255.255.255.0 10.0.1.2',
    ],
  },

  {
    id: 2,
    slug: 'route-par-defaut',
    title: 'Route par defaut',
    description: 'Configure une route par defaut (gateway of last resort) pour envoyer tout le trafic inconnu vers le routeur FAI.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 15,
    initialState: {
      hostname: 'R-Entreprise',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.10.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '203.0.113.2', subnetMask: '255.255.255.252', isUp: true, description: 'Vers FAI' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- [R-Entreprise] ---- [FAI]
  192.168.10.0/24       203.0.113.0/30
                .1    .2         .1
    `,
    objectives: [
      {
        id: 'default-route',
        description: 'Configurer la route par defaut via 203.0.113.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '203.0.113.1'
        ),
      },
    ],
    hints: [
      'Une route par defaut utilise le reseau 0.0.0.0 avec le masque 0.0.0.0',
      'Commande: ip route 0.0.0.0 0.0.0.0 <next-hop>',
    ],
  },

  // ===== Ch6: Classes & Subnetting =====
  {
    id: 3,
    slug: 'config-ip-subnetting',
    title: 'Configuration IP avec subnetting',
    description: 'Configure les interfaces du routeur avec les bonnes adresses IP selon le plan de subnetting fourni.',
    difficulty: 'intermediaire',
    chapterSlug: 'adressage-ipv4-subnetting',
    points: 20,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [VLAN10] --- Gi0/0 [R1] Gi0/1 --- [VLAN20]
  172.16.10.0/24              172.16.20.0/24
    Passerelle: .1            Passerelle: .1
    `,
    objectives: [
      {
        id: 'gi00-ip',
        description: 'Configurer Gi0/0 avec IP 172.16.10.1/24',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/0')
          return !!(iface && iface.ipAddress === '172.16.10.1' && iface.subnetMask === '255.255.255.0')
        },
      },
      {
        id: 'gi00-up',
        description: 'Activer l\'interface Gi0/0 (no shutdown)',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/0')
          return !!(iface && iface.isUp)
        },
      },
      {
        id: 'gi01-ip',
        description: 'Configurer Gi0/1 avec IP 172.16.20.1/24',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/1')
          return !!(iface && iface.ipAddress === '172.16.20.1' && iface.subnetMask === '255.255.255.0')
        },
      },
      {
        id: 'gi01-up',
        description: 'Activer l\'interface Gi0/1 (no shutdown)',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/1')
          return !!(iface && iface.isUp)
        },
      },
    ],
    hints: [
      'Commencez par: enable → configure terminal → interface GigabitEthernet0/0',
      'Puis: ip address 172.16.10.1 255.255.255.0 → no shutdown',
      'Faites la meme chose pour Gi0/1 avec 172.16.20.1',
    ],
  },

  // ===== Ch10: Routage dynamique =====
  {
    id: 4,
    slug: 'ospf-basique',
    title: 'OSPF basique',
    description: 'Active OSPF sur le routeur et annonce les reseaux directement connectes.',
    difficulty: 'intermediaire',
    chapterSlug: 'ospfv2-single-area',
    points: 25,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Backbone' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '1.1.1.1', subnetMask: '255.255.255.255', isUp: true, description: 'Router-ID' },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Gi0/1 --- [R2] --- [R3]
  192.168.1.0/24   10.0.0.0/30
                .1         .1  .2
    OSPF Area 0
    `,
    objectives: [
      {
        id: 'ospf-process',
        description: 'Demarrer OSPF avec le process ID 1',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1,
      },
      {
        id: 'ospf-router-id',
        description: 'Configurer le router-id 1.1.1.1',
        validate: (state) => state.ospf !== null && state.ospf.routerId === '1.1.1.1',
      },
      {
        id: 'ospf-network-lan',
        description: 'Annoncer le reseau 192.168.1.0 en area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '192.168.1.0' && n.wildcard === '0.0.0.255' && n.area === 0
        ),
      },
      {
        id: 'ospf-network-backbone',
        description: 'Annoncer le reseau 10.0.0.0 en area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.wildcard === '0.0.0.3' && n.area === 0
        ),
      },
    ],
    hints: [
      'D\'abord: enable → configure terminal → router ospf 1',
      'Puis: router-id 1.1.1.1',
      'Pour le LAN: network 192.168.1.0 0.0.0.255 area 0',
      'Le wildcard pour /30 est 0.0.0.3',
    ],
  },

  {
    id: 5,
    slug: 'ospf-multi-area',
    title: 'OSPF multi-area',
    description: 'Configure OSPF avec des reseaux dans differentes areas.',
    difficulty: 'avance',
    chapterSlug: 'ospfv2-single-area',
    points: 30,
    initialState: {
      hostname: 'ABR1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Backbone Area 0' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.16.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 1 LAN' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '172.16.2.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 2 LAN' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '2.2.2.2', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
         Area 0          Area 1          Area 2
    [R1]---Gi0/0 [ABR1] Gi0/1---[LAN1]  Se0/0/0---[LAN2]
    10.0.0.0/30  172.16.1.0/24    172.16.2.0/24
    `,
    objectives: [
      {
        id: 'ospf-process',
        description: 'Demarrer OSPF process 1',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1,
      },
      {
        id: 'ospf-area0',
        description: 'Annoncer 10.0.0.0 dans Area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'ospf-area1',
        description: 'Annoncer 172.16.1.0 dans Area 1',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.1.0' && n.area === 1
        ),
      },
      {
        id: 'ospf-area2',
        description: 'Annoncer 172.16.2.0 dans Area 2',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.2.0' && n.area === 2
        ),
      },
    ],
    hints: [
      'Un ABR (Area Border Router) connecte plusieurs areas OSPF',
      'Chaque reseau doit etre annonce dans la bonne area',
      'Wildcard pour /24: 0.0.0.255, pour /30: 0.0.0.3',
    ],
  },

  // ===== Ch11: ACL =====
  {
    id: 6,
    slug: 'acl-standard',
    title: 'ACL standard',
    description: 'Cree une ACL standard pour bloquer le trafic du reseau 192.168.2.0/24 vers le serveur et autorise tout le reste.',
    difficulty: 'intermediaire',
    chapterSlug: 'acl-access-control',
    points: 25,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN Serveur' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '192.168.2.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN Utilisateurs' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Serveur] --- Gi0/0 [R1] Gi0/1 --- [PCs]
  192.168.1.0/24            192.168.2.0/24
    Bloquer 192.168.2.0/24 vers le serveur
    `,
    objectives: [
      {
        id: 'acl-deny',
        description: 'Creer ACL 10: deny le reseau 192.168.2.0 0.0.0.255',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'deny' && e.source === '192.168.2.0' && e.sourceWildcard === '0.0.0.255'
          )
        ),
      },
      {
        id: 'acl-permit',
        description: 'Ajouter permit any a l\'ACL 10',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'permit' && e.source === '0.0.0.0' && e.sourceWildcard === '255.255.255.255'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'Appliquer l\'ACL 10 en entree sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 10 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'ACL standard: access-list <num> deny/permit <source> <wildcard>',
      'N\'oubliez pas le "permit any" a la fin sinon tout est bloque',
      'Appliquer sur interface: ip access-group 10 in',
    ],
  },

  {
    id: 7,
    slug: 'acl-etendue',
    title: 'ACL etendue',
    description: 'Cree une ACL etendue pour bloquer le trafic HTTP (port 80) du reseau LAN vers le serveur web, mais autoriser tout le reste.',
    difficulty: 'avance',
    chapterSlug: 'acl-access-control',
    points: 30,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'Serveurs' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN PCs] --- Gi0/0 [R1] Gi0/1 --- [Serveur Web]
  192.168.1.0/24                  10.0.0.100
    Bloquer HTTP (port 80) du LAN vers 10.0.0.100
    `,
    objectives: [
      {
        id: 'acl-deny-http',
        description: 'Creer ACL 100: deny tcp du LAN vers host 10.0.0.100 eq 80',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '80'
          )
        ),
      },
      {
        id: 'acl-permit-rest',
        description: 'Ajouter permit ip any any a l\'ACL 100',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'permit' && e.protocol === 'ip' &&
            e.source === '0.0.0.0' && e.sourceWildcard === '255.255.255.255'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'Appliquer l\'ACL 100 en entree sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'ACL etendue: access-list 100 deny tcp <source> <wc> host <dest> eq 80',
      'Pour autoriser le reste: access-list 100 permit ip any any',
      'Appliquer le plus pres de la source: ip access-group 100 in sur Gi0/0',
    ],
  },

  // ===== Ch12: NAT =====
  {
    id: 8,
    slug: 'nat-route-statique',
    title: 'Preparation NAT (routage)',
    description: 'Prepare la configuration NAT en configurant les interfaces et une route par defaut vers le FAI. (Le NAT complet necessite des commandes avancees non simulees ici.)',
    difficulty: 'intermediaire',
    chapterSlug: 'nat',
    points: 20,
    initialState: {
      hostname: 'R-NAT',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN Prive] --- Gi0/0 [R-NAT] Gi0/1 --- [Internet]
  192.168.1.0/24                    80.0.0.2/30
    Gi0/0 = 192.168.1.1/24 (inside)
    Gi0/1 = 80.0.0.2/30 (outside)
    `,
    objectives: [
      {
        id: 'gi00-config',
        description: 'Configurer Gi0/0 avec 192.168.1.1/24 et l\'activer',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.1.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01-config',
        description: 'Configurer Gi0/1 avec 80.0.0.2/30 et l\'activer',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '80.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'default-route',
        description: 'Configurer une route par defaut vers 80.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '80.0.0.1'
        ),
      },
      {
        id: 'hostname',
        description: 'Changer le hostname en R-NAT',
        validate: (state) => state.hostname === 'R-NAT',
      },
    ],
    hints: [
      'Commencez par configurer les interfaces avec leurs IPs',
      'N\'oubliez pas no shutdown sur chaque interface',
      'Route par defaut: ip route 0.0.0.0 0.0.0.0 80.0.0.1',
      'Le hostname est deja R-NAT par defaut dans ce lab',
    ],
  },

  // ===== Bonus: Config complete =====
  {
    id: 9,
    slug: 'config-complete-entreprise',
    title: 'Configuration complete d\'entreprise',
    description: 'Configure entierement un routeur d\'entreprise : interfaces, routage statique, OSPF et ACL.',
    difficulty: 'avance',
    chapterSlug: 'routage-statique',
    points: 40,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-SIEGE] Gi0/1 --- [WAN vers filiales]
  10.10.0.0/16              172.16.0.0/30

    - Gi0/0: 10.10.0.1/16 (LAN)
    - Gi0/1: 172.16.0.1/30 (WAN)
    - Hostname: R-SIEGE
    - Route par defaut via 172.16.0.2
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Changer le hostname en R-SIEGE',
        validate: (state) => state.hostname === 'R-SIEGE',
      },
      {
        id: 'gi00',
        description: 'Configurer Gi0/0: 10.10.0.1/16, activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.10.0.1' && i.subnetMask === '255.255.0.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Configurer Gi0/1: 172.16.0.1/30, activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '172.16.0.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'default-route',
        description: 'Route par defaut via 172.16.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '172.16.0.2'
        ),
      },
    ],
    hints: [
      'Etape 1: hostname R-SIEGE',
      'Etape 2: interface Gi0/0 → ip address + no shutdown',
      'Etape 3: interface Gi0/1 → ip address + no shutdown',
      'Etape 4: ip route 0.0.0.0 0.0.0.0 172.16.0.2',
    ],
  },

  // ========== 10 LABS DEBUTANT ==========

  {
    id: 10,
    slug: 'hostname-basique',
    title: 'Changer le hostname',
    description: 'Change le hostname du routeur en R-PARIS.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 10,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [R-PARIS]
    Gi0/0: 192.168.1.1/24
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Changer le hostname en R-PARIS',
        validate: (state) => state.hostname === 'R-PARIS',
      },
    ],
    hints: [
      'Passez en mode privilegie: enable',
      'Puis en mode configuration: configure terminal',
      'Commande: hostname R-PARIS',
    ],
  },

  {
    id: 11,
    slug: 'activer-interface',
    title: 'Activer une interface',
    description: 'Active l\'interface GigabitEthernet0/0 qui est actuellement desactivee.',
    difficulty: 'debutant',
    chapterSlug: 'adressage-ipv4-subnetting',
    points: 10,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [PC] --- Gi0/0 [R1]
    10.0.0.0/24
    Interface Gi0/0 est shutdown
    `,
    objectives: [
      {
        id: 'gi00-up',
        description: 'Activer l\'interface Gi0/0 avec no shutdown',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/0')
          return !!(iface && iface.isUp)
        },
      },
    ],
    hints: [
      'enable → configure terminal → interface GigabitEthernet0/0',
      'Commande pour activer: no shutdown',
    ],
  },

  {
    id: 12,
    slug: 'configurer-ip-simple',
    title: 'Configurer une adresse IP',
    description: 'Assigne l\'adresse IP 192.168.10.1/24 a l\'interface Gi0/0 et active-la.',
    difficulty: 'debutant',
    chapterSlug: 'adressage-ipv4-subnetting',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1]
    192.168.10.0/24
    Passerelle: 192.168.10.1
    `,
    objectives: [
      {
        id: 'gi00-ip',
        description: 'Assigner l\'IP 192.168.10.1/24 a Gi0/0',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/0')
          return !!(iface && iface.ipAddress === '192.168.10.1' && iface.subnetMask === '255.255.255.0')
        },
      },
      {
        id: 'gi00-up',
        description: 'Activer Gi0/0',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'GigabitEthernet0/0')
          return !!(iface && iface.isUp)
        },
      },
    ],
    hints: [
      'interface GigabitEthernet0/0',
      'ip address 192.168.10.1 255.255.255.0',
      'no shutdown',
    ],
  },

  {
    id: 13,
    slug: 'loopback-config',
    title: 'Configurer une Loopback',
    description: 'Configure l\'interface Loopback0 avec l\'adresse 1.1.1.1/32 pour servir de router-id.',
    difficulty: 'debutant',
    chapterSlug: 'ospfv2-single-area',
    points: 10,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [R1] Lo0: 1.1.1.1/32
    Gi0/0: 10.0.0.1/24
    `,
    objectives: [
      {
        id: 'lo0-ip',
        description: 'Assigner 1.1.1.1/32 a Loopback0',
        validate: (state) => {
          const iface = state.interfaces.find(i => i.name === 'Loopback0')
          return !!(iface && iface.ipAddress === '1.1.1.1' && iface.subnetMask === '255.255.255.255')
        },
      },
    ],
    hints: [
      'interface Loopback0',
      'ip address 1.1.1.1 255.255.255.255',
      'Le masque /32 = 255.255.255.255',
    ],
  },

  {
    id: 14,
    slug: 'route-statique-serie',
    title: 'Route statique via Serial',
    description: 'Configure une route statique vers le reseau distant 172.16.0.0/16 via l\'interface Serie.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'WAN vers R2' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Se0/0/0 --- [R2] --- [172.16.0.0/16]
    192.168.1.0/24   10.0.0.0/30
                  .1           .1  .2
    `,
    objectives: [
      {
        id: 'static-route',
        description: 'Route statique vers 172.16.0.0/16 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '172.16.0.0' && r.mask === '255.255.0.0' && r.nextHop === '10.0.0.2'
        ),
      },
    ],
    hints: [
      'ip route 172.16.0.0 255.255.0.0 10.0.0.2',
      'Le masque /16 = 255.255.0.0',
    ],
  },

  {
    id: 15,
    slug: 'deux-routes-statiques',
    title: 'Deux routes statiques',
    description: 'Configure deux routes statiques pour atteindre les reseaux 10.1.0.0/24 et 10.2.0.0/24.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Vers R2' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- [R1] --- [R2] --- [10.1.0.0/24]
                             --- [10.2.0.0/24]
    R2: 10.0.0.2
    `,
    objectives: [
      {
        id: 'route1',
        description: 'Route vers 10.1.0.0/24 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '10.1.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.0.2'
        ),
      },
      {
        id: 'route2',
        description: 'Route vers 10.2.0.0/24 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '10.2.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.0.2'
        ),
      },
    ],
    hints: [
      'ip route 10.1.0.0 255.255.255.0 10.0.0.2',
      'ip route 10.2.0.0 255.255.255.0 10.0.0.2',
    ],
  },

  {
    id: 16,
    slug: 'config-deux-interfaces',
    title: 'Configurer deux interfaces',
    description: 'Configure les deux interfaces du routeur avec les bonnes adresses IP et active-les.',
    difficulty: 'debutant',
    chapterSlug: 'adressage-ipv4-subnetting',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN A] --- Gi0/0 [R1] Gi0/1 --- [LAN B]
    10.0.1.0/24              10.0.2.0/24
    Passerelle: .1           Passerelle: .1
    `,
    objectives: [
      {
        id: 'gi00-ip',
        description: 'Gi0/0 : 10.0.1.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.0.1.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01-ip',
        description: 'Gi0/1 : 10.0.2.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.0.2.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
    ],
    hints: [
      'interface GigabitEthernet0/0 → ip address 10.0.1.1 255.255.255.0 → no shutdown',
      'Puis faites pareil pour Gi0/1 avec 10.0.2.1',
    ],
  },

  {
    id: 17,
    slug: 'hostname-et-route',
    title: 'Hostname et route par defaut',
    description: 'Change le hostname en R-LYON et configure une route par defaut vers le FAI.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 15,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '80.10.0.2', subnetMask: '255.255.255.252', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [Router] Gi0/1 --- [FAI]
    192.168.1.0/24           80.10.0.0/30
                  .1       .2         .1
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-LYON',
        validate: (state) => state.hostname === 'R-LYON',
      },
      {
        id: 'default-route',
        description: 'Route par defaut via 80.10.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '80.10.0.1'
        ),
      },
    ],
    hints: [
      'hostname R-LYON',
      'ip route 0.0.0.0 0.0.0.0 80.10.0.1',
    ],
  },

  {
    id: 18,
    slug: 'ip-et-route-simple',
    title: 'IP + Route statique',
    description: 'Configure l\'interface Gi0/1 et ajoute une route statique vers le reseau distant.',
    difficulty: 'debutant',
    chapterSlug: 'routage-statique',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Gi0/1 --- [R2] --- [172.20.0.0/24]
    192.168.1.0/24     10.0.0.0/30
                    .1     .1  .2
    `,
    objectives: [
      {
        id: 'gi01-config',
        description: 'Gi0/1 : 10.0.0.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.0.0.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'route',
        description: 'Route vers 172.20.0.0/24 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '172.20.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.0.2'
        ),
      },
    ],
    hints: [
      'interface GigabitEthernet0/1 → ip address 10.0.0.1 255.255.255.252 → no shutdown',
      'ip route 172.20.0.0 255.255.255.0 10.0.0.2',
    ],
  },

  {
    id: 19,
    slug: 'acl-permit-basique',
    title: 'ACL permit basique',
    description: 'Cree une ACL standard qui autorise uniquement le reseau 10.0.0.0/8 et bloque tout le reste implicitement.',
    difficulty: 'debutant',
    chapterSlug: 'acl-access-control',
    points: 15,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'Serveurs' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Gi0/1 --- [Serveurs]
    Autoriser uniquement 10.0.0.0/8 sur Gi0/1 out
    `,
    objectives: [
      {
        id: 'acl-permit',
        description: 'ACL 1: permit 10.0.0.0 0.255.255.255',
        validate: (state) => state.accessLists.some(a =>
          a.number === 1 && a.entries.some(e =>
            e.action === 'permit' && e.source === '10.0.0.0' && e.sourceWildcard === '0.255.255.255'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'Appliquer ACL 1 en sortie sur Gi0/1',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/1' && a.aclNumber === 1 && a.direction === 'out'
        ),
      },
    ],
    hints: [
      'access-list 1 permit 10.0.0.0 0.255.255.255',
      'interface Gi0/1 → ip access-group 1 out',
      'Le deny implicite bloque tout le reste automatiquement',
    ],
  },

  // ========== 10 LABS INTERMEDIAIRE ==========

  {
    id: 20,
    slug: 'ospf-single-area',
    title: 'OSPF single area',
    description: 'Configure OSPF dans l\'area 0 pour annoncer le reseau LAN et le lien WAN.',
    difficulty: 'intermediaire',
    chapterSlug: 'ospfv2-single-area',
    points: 25,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.10.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '1.1.1.1', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Gi0/1 --- [R2]
    192.168.10.0/24    10.0.0.0/30
    OSPF Area 0
    `,
    objectives: [
      {
        id: 'ospf',
        description: 'Demarrer OSPF process 1',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1,
      },
      {
        id: 'rid',
        description: 'Router-ID 1.1.1.1',
        validate: (state) => state.ospf !== null && state.ospf.routerId === '1.1.1.1',
      },
      {
        id: 'net-lan',
        description: 'Annoncer 192.168.10.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '192.168.10.0' && n.wildcard === '0.0.0.255' && n.area === 0
        ),
      },
      {
        id: 'net-wan',
        description: 'Annoncer 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.wildcard === '0.0.0.3' && n.area === 0
        ),
      },
    ],
    hints: [
      'router ospf 1 → router-id 1.1.1.1',
      'network 192.168.10.0 0.0.0.255 area 0',
      'network 10.0.0.0 0.0.0.3 area 0',
    ],
  },

  {
    id: 21,
    slug: 'acl-deny-host',
    title: 'ACL deny host specifique',
    description: 'Bloque un host specifique (192.168.1.100) et autorise le reste du reseau.',
    difficulty: 'intermediaire',
    chapterSlug: 'acl-access-control',
    points: 25,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN 192.168.1.0/24] --- Gi0/0 [R1] Gi0/1 --- [WAN]
    Bloquer le host 192.168.1.100, autoriser le reste
    `,
    objectives: [
      {
        id: 'acl-deny',
        description: 'ACL 10: deny host 192.168.1.100',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'deny' && e.source === '192.168.1.100' && e.sourceWildcard === '0.0.0.0'
          )
        ),
      },
      {
        id: 'acl-permit',
        description: 'ACL 10: permit any',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'permit' && e.source === '0.0.0.0' && e.sourceWildcard === '255.255.255.255'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'Appliquer ACL 10 in sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 10 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'access-list 10 deny host 192.168.1.100',
      'access-list 10 permit any',
      'interface Gi0/0 → ip access-group 10 in',
    ],
  },

  {
    id: 22,
    slug: 'config-interface-serial',
    title: 'Configuration interfaces Serial',
    description: 'Configure les interfaces Serie pour un lien WAN point-a-point entre deux routeurs.',
    difficulty: 'intermediaire',
    chapterSlug: 'adressage-ipv4-subnetting',
    points: 20,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Se0/0/0 --- Se0/0/0 [R2]
    192.168.1.0/24      10.0.0.0/30
                      .1            .2
    `,
    objectives: [
      {
        id: 'se00-ip',
        description: 'Se0/0/0 : 10.0.0.1/30',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '10.0.0.1' && i.subnetMask === '255.255.255.252')
        },
      },
      {
        id: 'se00-up',
        description: 'Activer Se0/0/0',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.isUp)
        },
      },
    ],
    hints: [
      'interface Serial0/0/0',
      'ip address 10.0.0.1 255.255.255.252',
      'no shutdown',
    ],
  },

  {
    id: 23,
    slug: 'routage-inter-vlan-prep',
    title: 'Preparation routage inter-VLAN',
    description: 'Configure les interfaces du routeur pour le routage entre deux VLAN differents.',
    difficulty: 'intermediaire',
    chapterSlug: 'vlans-trunking',
    points: 25,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [VLAN 10] --- Gi0/0 [R1] Gi0/1 --- [VLAN 20]
    192.168.10.0/24              192.168.20.0/24
    Passerelle: .254             Passerelle: .254
    `,
    objectives: [
      {
        id: 'gi00',
        description: 'Gi0/0 : 192.168.10.254/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.10.254' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1 : 192.168.20.254/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '192.168.20.254' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
    ],
    hints: [
      'interface Gi0/0 → ip address 192.168.10.254 255.255.255.0 → no shutdown',
      'interface Gi0/1 → ip address 192.168.20.254 255.255.255.0 → no shutdown',
    ],
  },

  {
    id: 24,
    slug: 'nat-preparation-avancee',
    title: 'NAT : interfaces + routes',
    description: 'Prepare un routeur NAT complet : configure les interfaces inside/outside et les routes.',
    difficulty: 'intermediaire',
    chapterSlug: 'nat',
    points: 25,
    initialState: {
      hostname: 'R-NAT',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN Prive] --- Gi0/0 [R-NAT] Gi0/1 --- [FAI]
    10.10.0.0/16                      203.0.113.2/30
    inside                             outside
    Route defaut: 203.0.113.1
    `,
    objectives: [
      {
        id: 'gi00',
        description: 'Gi0/0 : 10.10.0.1/16 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.10.0.1' && i.subnetMask === '255.255.0.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1 : 203.0.113.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '203.0.113.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'default-route',
        description: 'Route par defaut via 203.0.113.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '203.0.113.1'
        ),
      },
    ],
    hints: [
      'Gi0/0: ip address 10.10.0.1 255.255.0.0',
      'Gi0/1: ip address 203.0.113.2 255.255.255.252',
      'ip route 0.0.0.0 0.0.0.0 203.0.113.1',
    ],
  },

  {
    id: 25,
    slug: 'ospf-router-id-config',
    title: 'OSPF avec router-id personnalise',
    description: 'Configure OSPF avec un router-id specifique et annonce tous les reseaux connectes.',
    difficulty: 'intermediaire',
    chapterSlug: 'ospfv2-single-area',
    points: 25,
    initialState: {
      hostname: 'R2',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '172.16.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN1' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.16.2.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN2' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '10.0.0.2', subnetMask: '255.255.255.252', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '2.2.2.2', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
    [LAN1] --- Gi0/0 [R2] Se0/0/0 --- [R1]
    [LAN2] --- Gi0/1      10.0.0.0/30
    172.16.1.0/24          172.16.2.0/24
    `,
    objectives: [
      {
        id: 'ospf',
        description: 'OSPF process 1',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1,
      },
      {
        id: 'rid',
        description: 'Router-ID 2.2.2.2',
        validate: (state) => state.ospf !== null && state.ospf.routerId === '2.2.2.2',
      },
      {
        id: 'net1',
        description: 'Annoncer 172.16.1.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.1.0' && n.area === 0
        ),
      },
      {
        id: 'net2',
        description: 'Annoncer 172.16.2.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.2.0' && n.area === 0
        ),
      },
      {
        id: 'net-wan',
        description: 'Annoncer 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.wildcard === '0.0.0.3' && n.area === 0
        ),
      },
    ],
    hints: [
      'router ospf 1 → router-id 2.2.2.2',
      'Wildcard /24 = 0.0.0.255, /30 = 0.0.0.3',
    ],
  },

  {
    id: 26,
    slug: 'acl-etendue-dns',
    title: 'ACL etendue : bloquer DNS',
    description: 'Bloque le trafic DNS (port 53 UDP) du LAN vers l\'exterieur, autorise le reste.',
    difficulty: 'intermediaire',
    chapterSlug: 'acl-access-control',
    points: 25,
    initialState: {
      hostname: 'R1',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R1] Gi0/1 --- [DNS externe]
    Bloquer UDP port 53 du LAN
    `,
    objectives: [
      {
        id: 'acl-deny-dns',
        description: 'ACL 101: deny udp LAN any eq 53',
        validate: (state) => state.accessLists.some(a =>
          a.number === 101 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'udp' && e.port === '53'
          )
        ),
      },
      {
        id: 'acl-permit',
        description: 'ACL 101: permit ip any any',
        validate: (state) => state.accessLists.some(a =>
          a.number === 101 && a.entries.some(e =>
            e.action === 'permit' && e.protocol === 'ip'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'Appliquer ACL 101 in sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 101 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'access-list 101 deny udp 192.168.1.0 0.0.0.255 any eq 53',
      'access-list 101 permit ip any any',
      'interface Gi0/0 → ip access-group 101 in',
    ],
  },

  {
    id: 27,
    slug: 'routage-statique-multiple',
    title: 'Routage statique multi-reseaux',
    description: 'Configure 3 routes statiques vers differents reseaux distants et une route par defaut.',
    difficulty: 'intermediaire',
    chapterSlug: 'routage-statique',
    points: 25,
    initialState: {
      hostname: 'R-Core',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Vers R2' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '10.0.1.1', subnetMask: '255.255.255.252', isUp: true, description: 'Vers R3' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- [R-Core] --- Gi0/1 [R2] → 172.16.0.0/24, 172.16.1.0/24
                       --- Se0/0 [R3] → 172.16.2.0/24
    Gi0/1 next-hop: 10.0.0.2 | Se0/0 next-hop: 10.0.1.2
    `,
    objectives: [
      {
        id: 'route1',
        description: 'Route 172.16.0.0/24 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '172.16.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.0.2'
        ),
      },
      {
        id: 'route2',
        description: 'Route 172.16.1.0/24 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '172.16.1.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.0.2'
        ),
      },
      {
        id: 'route3',
        description: 'Route 172.16.2.0/24 via 10.0.1.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '172.16.2.0' && r.mask === '255.255.255.0' && r.nextHop === '10.0.1.2'
        ),
      },
    ],
    hints: [
      'ip route 172.16.0.0 255.255.255.0 10.0.0.2',
      'ip route 172.16.1.0 255.255.255.0 10.0.0.2',
      'ip route 172.16.2.0 255.255.255.0 10.0.1.2',
    ],
  },

  {
    id: 28,
    slug: 'config-complete-basique',
    title: 'Config complete debutant+',
    description: 'Configure hostname, deux interfaces et une route par defaut sur un routeur de succursale.',
    difficulty: 'intermediaire',
    chapterSlug: 'routage-statique',
    points: 25,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-BRANCH] Gi0/1 --- [HQ]
    192.168.50.0/24          10.0.5.0/30
    Hostname: R-BRANCH
    Route defaut via 10.0.5.2
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-BRANCH',
        validate: (state) => state.hostname === 'R-BRANCH',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 192.168.50.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.50.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.0.5.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.0.5.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'default-route',
        description: 'Route par defaut via 10.0.5.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '10.0.5.2'
        ),
      },
    ],
    hints: [
      'hostname R-BRANCH',
      'Configurez les deux interfaces avec IP + no shutdown',
      'ip route 0.0.0.0 0.0.0.0 10.0.5.2',
    ],
  },

  {
    id: 29,
    slug: 'acl-etendue-https',
    title: 'ACL etendue : autoriser HTTPS seul',
    description: 'Bloque HTTP (80) mais autorise HTTPS (443) du LAN vers les serveurs.',
    difficulty: 'intermediaire',
    chapterSlug: 'acl-access-control',
    points: 25,
    initialState: {
      hostname: 'R-FW',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'DMZ' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-FW] Gi0/1 --- [Serveurs Web]
    Bloquer HTTP (80), autoriser HTTPS (443) et le reste
    `,
    objectives: [
      {
        id: 'deny-http',
        description: 'ACL 110: deny tcp any any eq 80',
        validate: (state) => state.accessLists.some(a =>
          a.number === 110 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '80'
          )
        ),
      },
      {
        id: 'permit-rest',
        description: 'ACL 110: permit ip any any',
        validate: (state) => state.accessLists.some(a =>
          a.number === 110 && a.entries.some(e =>
            e.action === 'permit' && e.protocol === 'ip'
          )
        ),
      },
      {
        id: 'apply',
        description: 'Appliquer ACL 110 in sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 110 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'access-list 110 deny tcp any any eq 80',
      'access-list 110 permit ip any any',
      'ip access-group 110 in sur Gi0/0',
    ],
  },

  // ========== 10 LABS AVANCE ==========

  {
    id: 30,
    slug: 'ospf-abr-3areas',
    title: 'OSPF ABR 3 areas',
    description: 'Configure un routeur ABR avec OSPF dans 3 areas differentes et un router-id personnalise.',
    difficulty: 'avance',
    chapterSlug: 'ospfv2-single-area',
    points: 35,
    initialState: {
      hostname: 'ABR',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Area 0' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.16.10.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 10' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '172.16.20.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 20' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '3.3.3.3', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
    Area 0: 10.0.0.0/30 (Gi0/0)
    Area 10: 172.16.10.0/24 (Gi0/1)
    Area 20: 172.16.20.0/24 (Se0/0/0)
    Router-ID: 3.3.3.3
    `,
    objectives: [
      {
        id: 'ospf',
        description: 'OSPF process 1 avec router-id 3.3.3.3',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '3.3.3.3',
      },
      {
        id: 'area0',
        description: 'Annoncer 10.0.0.0 dans Area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'area10',
        description: 'Annoncer 172.16.10.0 dans Area 10',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.10.0' && n.area === 10
        ),
      },
      {
        id: 'area20',
        description: 'Annoncer 172.16.20.0 dans Area 20',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.20.0' && n.area === 20
        ),
      },
    ],
    hints: [
      'router ospf 1 → router-id 3.3.3.3',
      'network 10.0.0.0 0.0.0.3 area 0',
      'network 172.16.10.0 0.0.0.255 area 10',
      'network 172.16.20.0 0.0.0.255 area 20',
    ],
  },

  {
    id: 31,
    slug: 'acl-double-filtrage',
    title: 'ACL double filtrage',
    description: 'Configure deux ACL etendues : une sur chaque interface pour filtrer le trafic dans les deux sens.',
    difficulty: 'avance',
    chapterSlug: 'acl-access-control',
    points: 35,
    initialState: {
      hostname: 'R-FW',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'DMZ' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-FW] Gi0/1 --- [DMZ Serveurs]
    ACL 100 sur Gi0/0 in : deny tcp port 23 (Telnet)
    ACL 101 sur Gi0/1 in : deny tcp port 22 (SSH retour)
    `,
    objectives: [
      {
        id: 'acl100-deny',
        description: 'ACL 100: deny tcp any any eq 23',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ),
      },
      {
        id: 'acl100-permit',
        description: 'ACL 100: permit ip any any',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'permit' && e.protocol === 'ip'
          )
        ),
      },
      {
        id: 'acl100-apply',
        description: 'ACL 100 in sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
      {
        id: 'acl101-deny',
        description: 'ACL 101: deny tcp any any eq 22',
        validate: (state) => state.accessLists.some(a =>
          a.number === 101 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '22'
          )
        ),
      },
      {
        id: 'acl101-apply',
        description: 'ACL 101 in sur Gi0/1',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/1' && a.aclNumber === 101 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'ACL 100: deny telnet, permit rest → Gi0/0 in',
      'ACL 101: deny SSH, permit rest → Gi0/1 in',
      'N\'oubliez pas permit ip any any dans chaque ACL',
    ],
  },

  {
    id: 32,
    slug: 'routeur-multisite',
    title: 'Routeur multi-sites',
    description: 'Configure un routeur central avec hostname, 3 interfaces et routes statiques vers 3 sites distants.',
    difficulty: 'avance',
    chapterSlug: 'routage-statique',
    points: 35,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Site A] --- Gi0/0 [R-HQ] Gi0/1 --- [Site B]
                        Se0/0/0 --- [Site C]
    Gi0/0: 10.1.0.1/24 | Gi0/1: 10.2.0.1/30 | Se0/0/0: 10.3.0.1/30
    Site B LAN: 192.168.0.0/24 via 10.2.0.2
    Site C LAN: 192.168.1.0/24 via 10.3.0.2
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-HQ',
        validate: (state) => state.hostname === 'R-HQ',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 10.1.0.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.1.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.2.0.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.2.0.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 10.3.0.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '10.3.0.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'routeB',
        description: 'Route 192.168.0.0/24 via 10.2.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '192.168.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.2.0.2'
        ),
      },
      {
        id: 'routeC',
        description: 'Route 192.168.1.0/24 via 10.3.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '192.168.1.0' && r.mask === '255.255.255.0' && r.nextHop === '10.3.0.2'
        ),
      },
    ],
    hints: [
      'hostname R-HQ puis configurez les 3 interfaces',
      'N\'oubliez pas no shutdown sur chaque interface',
      'Ajoutez les routes statiques vers chaque site distant',
    ],
  },

  {
    id: 33,
    slug: 'ospf-routes-statiques-combo',
    title: 'OSPF + routes statiques',
    description: 'Combine OSPF pour les reseaux internes et une route statique par defaut vers Internet.',
    difficulty: 'avance',
    chapterSlug: 'ospfv2-single-area',
    points: 35,
    initialState: {
      hostname: 'R-Edge',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Backbone' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '203.0.113.2', subnetMask: '255.255.255.252', isUp: true, description: 'FAI' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '4.4.4.4', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-Edge] Gi0/1 --- [Backbone OSPF]
                          Se0/0/0 --- [FAI]
    OSPF: LAN + Backbone area 0
    Route defaut: via 203.0.113.1
    `,
    objectives: [
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 4.4.4.4',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '4.4.4.4',
      },
      {
        id: 'ospf-lan',
        description: 'Annoncer 192.168.1.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '192.168.1.0' && n.wildcard === '0.0.0.255' && n.area === 0
        ),
      },
      {
        id: 'ospf-bb',
        description: 'Annoncer 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.wildcard === '0.0.0.3' && n.area === 0
        ),
      },
      {
        id: 'default-route',
        description: 'Route defaut via 203.0.113.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '203.0.113.1'
        ),
      },
    ],
    hints: [
      'router ospf 1 → router-id 4.4.4.4',
      'Annoncez les reseaux LAN et backbone dans OSPF',
      'La route vers le FAI reste statique',
    ],
  },

  {
    id: 34,
    slug: 'securite-acl-multi-protocole',
    title: 'ACL multi-protocoles',
    description: 'Cree une ACL etendue qui bloque Telnet (23) et HTTP (80) mais autorise HTTPS (443) et tout le reste.',
    difficulty: 'avance',
    chapterSlug: 'acl-access-control',
    points: 35,
    initialState: {
      hostname: 'R-SEC',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-SEC] Gi0/1 --- [Internet]
    Bloquer : Telnet (23), HTTP (80)
    Autoriser: tout le reste
    `,
    objectives: [
      {
        id: 'deny-telnet',
        description: 'ACL 120: deny tcp any any eq 23',
        validate: (state) => state.accessLists.some(a =>
          a.number === 120 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ),
      },
      {
        id: 'deny-http',
        description: 'ACL 120: deny tcp any any eq 80',
        validate: (state) => state.accessLists.some(a =>
          a.number === 120 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '80'
          )
        ),
      },
      {
        id: 'permit',
        description: 'ACL 120: permit ip any any',
        validate: (state) => state.accessLists.some(a =>
          a.number === 120 && a.entries.some(e =>
            e.action === 'permit' && e.protocol === 'ip'
          )
        ),
      },
      {
        id: 'apply',
        description: 'ACL 120 in sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 120 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'access-list 120 deny tcp any any eq 23',
      'access-list 120 deny tcp any any eq 80',
      'access-list 120 permit ip any any',
    ],
  },

  {
    id: 35,
    slug: 'config-datacenter',
    title: 'Configuration datacenter',
    description: 'Configure un routeur datacenter : hostname, toutes les interfaces, OSPF area 0 et route par defaut.',
    difficulty: 'avance',
    chapterSlug: 'ospfv2-single-area',
    points: 40,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Serveurs] --- Gi0/0 [R-DC] Gi0/1 --- [Core Network]
    Gi0/0: 10.100.0.1/24 | Gi0/1: 10.0.0.1/30
    Lo0: 5.5.5.5/32
    OSPF area 0 sur tous les reseaux
    Route defaut via 10.0.0.2
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-DC',
        validate: (state) => state.hostname === 'R-DC',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 10.100.0.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.100.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.0.0.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.0.0.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'lo0',
        description: 'Lo0: 5.5.5.5/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '5.5.5.5' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 5.5.5.5',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '5.5.5.5',
      },
      {
        id: 'ospf-net',
        description: 'Annoncer 10.100.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.100.0.0' && n.area === 0
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '10.0.0.2'
        ),
      },
    ],
    hints: [
      'hostname R-DC',
      'Configurez Gi0/0, Gi0/1 et Lo0 avec leurs IPs',
      'router ospf 1 → router-id 5.5.5.5',
      'ip route 0.0.0.0 0.0.0.0 10.0.0.2',
    ],
  },

  {
    id: 36,
    slug: 'ospf-redistribution-prep',
    title: 'OSPF + redistribution prep',
    description: 'Configure OSPF multi-area avec le backbone et une route statique a redistribuer.',
    difficulty: 'avance',
    chapterSlug: 'ospfv2-single-area',
    points: 35,
    initialState: {
      hostname: 'R-ASBR',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Area 0' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.16.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 1' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '203.0.113.2', subnetMask: '255.255.255.252', isUp: true, description: 'Externe' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '6.6.6.6', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
    [Core] --- Gi0/0 [R-ASBR] Gi0/1 --- [Area 1]
                     Se0/0/0 --- [Externe]
    OSPF: Area 0 + Area 1
    Route defaut externe via 203.0.113.1
    `,
    objectives: [
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 6.6.6.6',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '6.6.6.6',
      },
      {
        id: 'area0',
        description: 'Annoncer 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'area1',
        description: 'Annoncer 172.16.0.0 area 1',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.0.0' && n.area === 1
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 203.0.113.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '203.0.113.1'
        ),
      },
    ],
    hints: [
      'router ospf 1 → router-id 6.6.6.6',
      'network dans les bonnes areas',
      'ip route 0.0.0.0 0.0.0.0 203.0.113.1',
    ],
  },

  {
    id: 37,
    slug: 'routeur-perimetre',
    title: 'Routeur perimetre securise',
    description: 'Configure un routeur de perimetre avec interfaces, route par defaut et ACL de securite.',
    difficulty: 'avance',
    chapterSlug: 'concepts-securite',
    points: 40,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-PERIM] Gi0/1 --- [Internet]
    Gi0/0: 10.0.0.1/24 | Gi0/1: 198.51.100.2/30
    Hostname: R-PERIM
    ACL: bloquer Telnet depuis Internet
    Route defaut: 198.51.100.1
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-PERIM',
        validate: (state) => state.hostname === 'R-PERIM',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 10.0.0.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.0.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 198.51.100.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '198.51.100.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'default',
        description: 'Route defaut via 198.51.100.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '198.51.100.1'
        ),
      },
      {
        id: 'acl-deny',
        description: 'ACL 100: deny tcp any any eq 23',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'ACL 100 in sur Gi0/1',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/1' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'Commencez par hostname et interfaces',
      'ACL etendue 100: deny tcp any any eq 23 puis permit ip any any',
      'Appliquez l\'ACL en entree sur l\'interface WAN (Gi0/1)',
    ],
  },

  {
    id: 38,
    slug: 'ospf-loopback-routeid',
    title: 'OSPF avance avec Loopback',
    description: 'Configure Loopback, OSPF avec router-id specifique et annonce 4 reseaux dans 2 areas.',
    difficulty: 'avance',
    chapterSlug: 'ospfv2-single-area',
    points: 35,
    initialState: {
      hostname: 'R-ABR2',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Backbone' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.20.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN1 Area 5' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '172.20.2.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN2 Area 5' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Core] --- Gi0/0 [R-ABR2] Gi0/1 --- [LAN1]
                            Se0/0/0 --- [LAN2]
    Lo0: 7.7.7.7/32
    Area 0: Gi0/0 | Area 5: Gi0/1 + Se0/0/0
    `,
    objectives: [
      {
        id: 'lo0',
        description: 'Lo0: 7.7.7.7/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '7.7.7.7' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 7.7.7.7',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '7.7.7.7',
      },
      {
        id: 'area0',
        description: 'Annoncer 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'area5-1',
        description: 'Annoncer 172.20.1.0 area 5',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.20.1.0' && n.area === 5
        ),
      },
      {
        id: 'area5-2',
        description: 'Annoncer 172.20.2.0 area 5',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.20.2.0' && n.area === 5
        ),
      },
    ],
    hints: [
      'interface Loopback0 → ip address 7.7.7.7 255.255.255.255',
      'router ospf 1 → router-id 7.7.7.7',
      'Les deux LAN sont dans area 5, le backbone dans area 0',
    ],
  },

  {
    id: 39,
    slug: 'config-wan-complete',
    title: 'Configuration WAN complete',
    description: 'Configure un routeur WAN avec interfaces, OSPF, routes statiques et une ACL de protection.',
    difficulty: 'avance',
    chapterSlug: 'routage-statique',
    points: 40,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-WAN] Se0/0/0 --- [FAI]
    Gi0/0: 192.168.100.1/24
    Se0/0/0: 200.0.0.2/30
    Hostname: R-WAN
    Route defaut: 200.0.0.1
    ACL 100: deny tcp from outside eq 23, permit rest → Se0/0/0 in
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-WAN',
        validate: (state) => state.hostname === 'R-WAN',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 192.168.100.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.100.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 200.0.0.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '200.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'default',
        description: 'Route defaut via 200.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '200.0.0.1'
        ),
      },
      {
        id: 'acl',
        description: 'ACL 100: deny tcp any any eq 23',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'ACL 100 in sur Se0/0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'hostname R-WAN, puis interfaces + no shutdown',
      'ip route 0.0.0.0 0.0.0.0 200.0.0.1',
      'ACL 100: deny telnet, permit rest → appliquer in sur Se0/0/0',
    ],
  },

  // ========== 10 LABS EXPERT ==========

  {
    id: 40,
    slug: 'infra-complete-pme',
    title: 'Infrastructure PME complete',
    description: 'Configure entierement un routeur de PME : hostname, 3 interfaces, OSPF, route defaut et ACL anti-intrusion.',
    difficulty: 'expert',
    chapterSlug: 'ospfv2-single-area',
    points: 50,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-PME] Gi0/1 --- [DMZ]
                         Se0/0/0 --- [FAI]
    Gi0/0: 192.168.1.1/24 | Gi0/1: 10.0.1.1/24 | Se0/0/0: 80.0.0.2/30
    Lo0: 8.8.8.8/32 | OSPF area 0 (LAN+DMZ)
    Route defaut: 80.0.0.1
    ACL 100: deny tcp ext eq 23, deny tcp ext eq 80, permit rest → Se0/0/0 in
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-PME',
        validate: (state) => state.hostname === 'R-PME',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 192.168.1.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.1.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.0.1.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.0.1.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 80.0.0.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '80.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'lo0',
        description: 'Lo0: 8.8.8.8/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '8.8.8.8' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 8.8.8.8',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '8.8.8.8',
      },
      {
        id: 'ospf-lan',
        description: 'OSPF: 192.168.1.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '192.168.1.0' && n.area === 0
        ),
      },
      {
        id: 'ospf-dmz',
        description: 'OSPF: 10.0.1.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.1.0' && n.area === 0
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 80.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '80.0.0.1'
        ),
      },
      {
        id: 'acl-telnet',
        description: 'ACL 100: deny tcp any any eq 23',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'ACL 100 in sur Se0/0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'Commencez par hostname, puis toutes les interfaces',
      'OSPF : annoncez LAN et DMZ dans area 0',
      'ACL : deny telnet + permit rest sur Se0/0/0 in',
    ],
  },

  {
    id: 41,
    slug: 'ospf-multiarea-complet',
    title: 'OSPF multi-area expert',
    description: 'Configure OSPF sur un ABR connectant 4 areas differentes avec router-id et route par defaut.',
    difficulty: 'expert',
    chapterSlug: 'ospfv2-single-area',
    points: 50,
    initialState: {
      hostname: 'ABR-Central',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Area 0' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.16.10.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 10' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '172.16.20.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 20' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: '172.16.30.1', subnetMask: '255.255.255.0', isUp: true, description: 'Area 30' },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: '9.9.9.9', subnetMask: '255.255.255.255', isUp: true, description: null },
      ],
    },
    topology: `
    Area 0 (Gi0/0) | Area 10 (Gi0/1) | Area 20 (Se0/0/0) | Area 30 (Se0/0/1)
    Router-ID: 9.9.9.9
    Route defaut via 10.0.0.2
    `,
    objectives: [
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 9.9.9.9',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '9.9.9.9',
      },
      {
        id: 'area0',
        description: 'Annoncer 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'area10',
        description: 'Annoncer 172.16.10.0 area 10',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.10.0' && n.area === 10
        ),
      },
      {
        id: 'area20',
        description: 'Annoncer 172.16.20.0 area 20',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.20.0' && n.area === 20
        ),
      },
      {
        id: 'area30',
        description: 'Annoncer 172.16.30.0 area 30',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.30.0' && n.area === 30
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '10.0.0.2'
        ),
      },
    ],
    hints: [
      'router ospf 1 → router-id 9.9.9.9',
      'Chaque reseau dans sa propre area',
      'ip route 0.0.0.0 0.0.0.0 10.0.0.2',
    ],
  },

  {
    id: 42,
    slug: 'securite-multi-acl',
    title: 'Securite multi-ACL',
    description: 'Deploy 3 ACL sur differentes interfaces pour segmenter le trafic entre LAN, DMZ et WAN.',
    difficulty: 'expert',
    chapterSlug: 'acl-access-control',
    points: 50,
    initialState: {
      hostname: 'R-FW-PRO',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '10.0.0.1', subnetMask: '255.255.255.0', isUp: true, description: 'DMZ' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '203.0.113.2', subnetMask: '255.255.255.252', isUp: true, description: 'WAN' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-FW-PRO] Gi0/1 --- [DMZ]
                            Se0/0/0 --- [WAN]
    ACL 100 Gi0/0 in: deny tcp eq 23
    ACL 101 Gi0/1 in: deny tcp eq 22
    ACL 102 Se0/0/0 in: deny tcp eq 80
    Chaque ACL a permit ip any any
    `,
    objectives: [
      {
        id: 'acl100',
        description: 'ACL 100: deny tcp any any eq 23',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ),
      },
      {
        id: 'acl100-apply',
        description: 'ACL 100 in sur Gi0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
      {
        id: 'acl101',
        description: 'ACL 101: deny tcp any any eq 22',
        validate: (state) => state.accessLists.some(a =>
          a.number === 101 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '22'
          )
        ),
      },
      {
        id: 'acl101-apply',
        description: 'ACL 101 in sur Gi0/1',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/1' && a.aclNumber === 101 && a.direction === 'in'
        ),
      },
      {
        id: 'acl102',
        description: 'ACL 102: deny tcp any any eq 80',
        validate: (state) => state.accessLists.some(a =>
          a.number === 102 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '80'
          )
        ),
      },
      {
        id: 'acl102-apply',
        description: 'ACL 102 in sur Se0/0/0',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/0' && a.aclNumber === 102 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'Creez 3 ACL etendues (100, 101, 102)',
      'Chaque ACL bloque un port specifique + permit ip any any',
      'Appliquez chaque ACL in sur l\'interface correspondante',
    ],
  },

  {
    id: 43,
    slug: 'routeur-campus',
    title: 'Routeur campus universitaire',
    description: 'Configure un routeur de campus : hostname, toutes interfaces, loopback, OSPF multi-area, routes et ACL.',
    difficulty: 'expert',
    chapterSlug: 'ospfv2-single-area',
    points: 55,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Etudiants] --- Gi0/0 [R-CAMPUS] Gi0/1 --- [Admin]
                               Se0/0/0 --- [WAN FAI]
    Hostname: R-CAMPUS | Lo0: 10.10.10.10/32
    Gi0/0: 172.16.1.1/24 (Area 1) | Gi0/1: 172.16.2.1/24 (Area 2)
    Se0/0/0: 200.0.0.2/30 | Route defaut: 200.0.0.1
    ACL 100: deny tcp any any eq 80 sur Se0/0/0 in
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-CAMPUS',
        validate: (state) => state.hostname === 'R-CAMPUS',
      },
      {
        id: 'lo0',
        description: 'Lo0: 10.10.10.10/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '10.10.10.10' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 172.16.1.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '172.16.1.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 172.16.2.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '172.16.2.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 200.0.0.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '200.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 10.10.10.10',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '10.10.10.10',
      },
      {
        id: 'area1',
        description: 'OSPF: 172.16.1.0 area 1',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.1.0' && n.area === 1
        ),
      },
      {
        id: 'area2',
        description: 'OSPF: 172.16.2.0 area 2',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.2.0' && n.area === 2
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 200.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '200.0.0.1'
        ),
      },
      {
        id: 'acl',
        description: 'ACL 100: deny tcp eq 80 sur Se0/0/0 in',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '80'
          )
        ) && state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'hostname → interfaces → loopback → OSPF → routes → ACL',
      'Chaque LAN dans son area OSPF',
      'N\'oubliez pas permit ip any any dans l\'ACL',
    ],
  },

  {
    id: 44,
    slug: 'dual-homed-fai',
    title: 'Routeur dual-homed FAI',
    description: 'Configure un routeur connecte a deux FAI avec routes par defaut et ACL de protection.',
    difficulty: 'expert',
    chapterSlug: 'routage-statique',
    points: 50,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN] --- Gi0/0 [R-DUAL] Se0/0/0 --- [FAI-1]
                           Se0/0/1 --- [FAI-2]
    Hostname: R-DUAL
    Gi0/0: 192.168.0.1/24 | Se0/0/0: 100.0.0.2/30 | Se0/0/1: 200.0.0.2/30
    Route defaut principale: 100.0.0.1
    Route backup: 200.0.0.1 (vers 0.0.0.0/0)
    ACL 100: deny tcp eq 23 sur Se0/0/0 in
    ACL 101: deny tcp eq 23 sur Se0/0/1 in
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-DUAL',
        validate: (state) => state.hostname === 'R-DUAL',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 192.168.0.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 100.0.0.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '100.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'se01',
        description: 'Se0/0/1: 200.0.0.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/1')
          return !!(i && i.ipAddress === '200.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'route1',
        description: 'Route defaut via 100.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.nextHop === '100.0.0.1'
        ),
      },
      {
        id: 'route2',
        description: 'Route backup via 200.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.nextHop === '200.0.0.1'
        ),
      },
      {
        id: 'acl100',
        description: 'ACL 100 deny telnet sur Se0/0/0 in',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ) && state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/0' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
      {
        id: 'acl101',
        description: 'ACL 101 deny telnet sur Se0/0/1 in',
        validate: (state) => state.accessLists.some(a =>
          a.number === 101 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ) && state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/1' && a.aclNumber === 101 && a.direction === 'in'
        ),
      },
    ],
    hints: [
      'hostname R-DUAL, puis 3 interfaces avec IP + no shutdown',
      'Deux routes par defaut vers les deux FAI',
      'Une ACL anti-telnet sur chaque interface WAN',
    ],
  },

  {
    id: 45,
    slug: 'ospf-full-mesh',
    title: 'OSPF full mesh 3 areas',
    description: 'Configure OSPF complet avec loopback, 3 areas, 5 reseaux et route de secours.',
    difficulty: 'expert',
    chapterSlug: 'ospfv2-single-area',
    points: 55,
    initialState: {
      hostname: 'ABR-MAIN',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '10.0.0.1', subnetMask: '255.255.255.252', isUp: true, description: 'Core' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '172.16.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'Site A' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: '172.16.2.1', subnetMask: '255.255.255.0', isUp: true, description: 'Site B' },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: '172.16.3.1', subnetMask: '255.255.255.0', isUp: true, description: 'Site C' },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Core] --- Gi0/0 [ABR-MAIN] Gi0/1 --- [Site A]
                              Se0/0/0 --- [Site B]
                              Se0/0/1 --- [Site C]
    Lo0: 11.11.11.11/32
    Area 0: Core | Area 1: Site A | Area 2: Site B + Site C
    Route backup: 10.99.0.0/16 via 10.0.0.2
    `,
    objectives: [
      {
        id: 'lo0',
        description: 'Lo0: 11.11.11.11/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '11.11.11.11' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 11.11.11.11',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '11.11.11.11',
      },
      {
        id: 'area0',
        description: 'OSPF: 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'area1',
        description: 'OSPF: 172.16.1.0 area 1',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.1.0' && n.area === 1
        ),
      },
      {
        id: 'area2-b',
        description: 'OSPF: 172.16.2.0 area 2',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.2.0' && n.area === 2
        ),
      },
      {
        id: 'area2-c',
        description: 'OSPF: 172.16.3.0 area 2',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '172.16.3.0' && n.area === 2
        ),
      },
      {
        id: 'route-backup',
        description: 'Route 10.99.0.0/16 via 10.0.0.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '10.99.0.0' && r.mask === '255.255.0.0' && r.nextHop === '10.0.0.2'
        ),
      },
    ],
    hints: [
      'Configurez Lo0 puis OSPF avec router-id',
      'Area 0 pour le backbone, Area 1 pour Site A, Area 2 pour Sites B+C',
      'Route statique de backup pour le reseau 10.99.0.0/16',
    ],
  },

  {
    id: 46,
    slug: 'reseau-segmente',
    title: 'Reseau segmente complet',
    description: 'Configure un routeur central segmentant 3 zones (LAN, Serveurs, Guest) avec interfaces, routes et ACL.',
    difficulty: 'expert',
    chapterSlug: 'concepts-securite',
    points: 50,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [LAN Staff] --- Gi0/0 [R-ZONE] Gi0/1 --- [Serveurs]
                             Se0/0/0 --- [Guest WiFi]
    Hostname: R-ZONE
    Gi0/0: 192.168.10.1/24 | Gi0/1: 10.10.0.1/24 | Se0/0/0: 192.168.200.1/24
    ACL 10: deny Guest (192.168.200.0) vers Serveurs → Gi0/1 out
    Route defaut: 10.10.0.254
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-ZONE',
        validate: (state) => state.hostname === 'R-ZONE',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 192.168.10.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '192.168.10.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.10.0.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.10.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 192.168.200.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '192.168.200.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'acl-deny',
        description: 'ACL 10: deny 192.168.200.0 0.0.0.255',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'deny' && e.source === '192.168.200.0' && e.sourceWildcard === '0.0.0.255'
          )
        ),
      },
      {
        id: 'acl-permit',
        description: 'ACL 10: permit any',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'permit' && e.source === '0.0.0.0' && e.sourceWildcard === '255.255.255.255'
          )
        ),
      },
      {
        id: 'acl-apply',
        description: 'ACL 10 out sur Gi0/1',
        validate: (state) => state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/1' && a.aclNumber === 10 && a.direction === 'out'
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 10.10.0.254',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '10.10.0.254'
        ),
      },
    ],
    hints: [
      'hostname R-ZONE puis 3 interfaces',
      'ACL standard 10: deny guest, permit any → out sur Gi0/1',
      'Route defaut via le serveur gateway',
    ],
  },

  {
    id: 47,
    slug: 'backbone-isp',
    title: 'Configuration backbone ISP',
    description: 'Configure un routeur backbone ISP avec toutes les interfaces, OSPF area 0, loopback et routes clientes.',
    difficulty: 'expert',
    chapterSlug: 'ospfv2-single-area',
    points: 55,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [Client A] --- Gi0/0 [R-ISP] Gi0/1 --- [Client B]
                          Se0/0/0 --- [Peer ISP]
    Hostname: R-ISP | Lo0: 100.100.100.1/32
    Gi0/0: 203.0.113.1/30 | Gi0/1: 198.51.100.1/30
    Se0/0/0: 10.255.0.1/30
    OSPF area 0 (backbone complet)
    Routes clientes: 192.168.10.0/24 via 203.0.113.2, 192.168.20.0/24 via 198.51.100.2
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-ISP',
        validate: (state) => state.hostname === 'R-ISP',
      },
      {
        id: 'lo0',
        description: 'Lo0: 100.100.100.1/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '100.100.100.1' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 203.0.113.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '203.0.113.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 198.51.100.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '198.51.100.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 10.255.0.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '10.255.0.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 100.100.100.1',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '100.100.100.1',
      },
      {
        id: 'routeA',
        description: 'Route 192.168.10.0/24 via 203.0.113.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '192.168.10.0' && r.mask === '255.255.255.0' && r.nextHop === '203.0.113.2'
        ),
      },
      {
        id: 'routeB',
        description: 'Route 192.168.20.0/24 via 198.51.100.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '192.168.20.0' && r.mask === '255.255.255.0' && r.nextHop === '198.51.100.2'
        ),
      },
    ],
    hints: [
      'hostname R-ISP, Lo0, puis les 3 interfaces physiques',
      'OSPF avec router-id = Lo0 IP',
      'Routes statiques vers les reseaux clients',
    ],
  },

  {
    id: 48,
    slug: 'entreprise-multisite-expert',
    title: 'Entreprise multisite expert',
    description: 'Defi ultime : hostname, 4 interfaces, loopback, OSPF 2 areas, 2 routes statiques et 2 ACL.',
    difficulty: 'expert',
    chapterSlug: 'ospfv2-single-area',
    points: 60,
    initialState: {
      hostname: 'Router',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    [HQ LAN] --- Gi0/0 [R-CORE] Gi0/1 --- [Serveurs]
                          Se0/0/0 --- [Site Lyon]
                          Se0/0/1 --- [FAI]
    Hostname: R-CORE | Lo0: 1.1.1.1/32
    Gi0/0: 10.0.0.1/24 | Gi0/1: 10.0.1.1/24 | Se0/0/0: 10.0.2.1/30 | Se0/0/1: 80.0.0.2/30
    OSPF area 0: Gi0/0, Gi0/1 | area 1: Se0/0/0
    Route: 172.16.0.0/16 via 10.0.2.2 | Defaut: 80.0.0.1
    ACL 100: deny tcp eq 23 Se0/0/1 in | ACL 10: deny 10.0.1.0 Gi0/0 out
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-CORE',
        validate: (state) => state.hostname === 'R-CORE',
      },
      {
        id: 'lo0',
        description: 'Lo0: 1.1.1.1/32',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Loopback0')
          return !!(i && i.ipAddress === '1.1.1.1' && i.subnetMask === '255.255.255.255')
        },
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 10.0.0.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.0.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.0.1.1/24 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.0.1.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'se00',
        description: 'Se0/0/0: 10.0.2.1/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/0')
          return !!(i && i.ipAddress === '10.0.2.1' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'se01',
        description: 'Se0/0/1: 80.0.0.2/30 activee',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'Serial0/0/1')
          return !!(i && i.ipAddress === '80.0.0.2' && i.subnetMask === '255.255.255.252' && i.isUp)
        },
      },
      {
        id: 'ospf',
        description: 'OSPF process 1 router-id 1.1.1.1',
        validate: (state) => state.ospf !== null && state.ospf.processId === 1 && state.ospf.routerId === '1.1.1.1',
      },
      {
        id: 'ospf-a0',
        description: 'OSPF: 10.0.0.0 area 0',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.0.0' && n.area === 0
        ),
      },
      {
        id: 'ospf-a1',
        description: 'OSPF: 10.0.2.0 area 1',
        validate: (state) => state.ospf !== null && state.ospf.networks.some(n =>
          n.network === '10.0.2.0' && n.area === 1
        ),
      },
      {
        id: 'route-lyon',
        description: 'Route 172.16.0.0/16 via 10.0.2.2',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '172.16.0.0' && r.mask === '255.255.0.0' && r.nextHop === '10.0.2.2'
        ),
      },
      {
        id: 'default',
        description: 'Route defaut via 80.0.0.1',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '0.0.0.0' && r.mask === '0.0.0.0' && r.nextHop === '80.0.0.1'
        ),
      },
      {
        id: 'acl100',
        description: 'ACL 100 deny telnet sur Se0/0/1 in',
        validate: (state) => state.accessLists.some(a =>
          a.number === 100 && a.entries.some(e =>
            e.action === 'deny' && e.protocol === 'tcp' && e.port === '23'
          )
        ) && state.appliedAcls.some(a =>
          a.interfaceName === 'Serial0/0/1' && a.aclNumber === 100 && a.direction === 'in'
        ),
      },
      {
        id: 'acl10',
        description: 'ACL 10 deny serveurs sur Gi0/0 out',
        validate: (state) => state.accessLists.some(a =>
          a.number === 10 && a.entries.some(e =>
            e.action === 'deny' && e.source === '10.0.1.0' && e.sourceWildcard === '0.0.0.255'
          )
        ) && state.appliedAcls.some(a =>
          a.interfaceName === 'GigabitEthernet0/0' && a.aclNumber === 10 && a.direction === 'out'
        ),
      },
    ],
    hints: [
      'C\'est le defi ultime ! hostname → interfaces → Lo0 → OSPF → routes → ACL',
      'N\'oubliez pas permit any/permit ip any any dans les ACL',
      'Prenez votre temps et verifiez chaque objectif',
    ],
  },

  {
    id: 49,
    slug: 'migration-reseau',
    title: 'Migration reseau',
    description: 'Scenario de migration : reconfigurez le hostname, changez les IPs des interfaces et ajoutez de nouvelles routes.',
    difficulty: 'expert',
    chapterSlug: 'adressage-ipv4-subnetting',
    points: 50,
    initialState: {
      hostname: 'R-OLD',
      interfaces: [
        { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, description: 'ancien LAN' },
        { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: '192.168.2.1', subnetMask: '255.255.255.0', isUp: true, description: 'ancien DMZ' },
        { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
        { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
      ],
    },
    topology: `
    Migration du reseau ancien vers nouveau plan d'adressage
    Hostname: R-OLD → R-NEW
    Gi0/0: 192.168.1.1 → 10.10.0.1/24
    Gi0/1: 192.168.2.1 → 10.20.0.1/24
    Nouvelles routes: 10.30.0.0/24 via 10.10.0.254
                      10.40.0.0/24 via 10.20.0.254
    `,
    objectives: [
      {
        id: 'hostname',
        description: 'Hostname: R-NEW',
        validate: (state) => state.hostname === 'R-NEW',
      },
      {
        id: 'gi00',
        description: 'Gi0/0: 10.10.0.1/24',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/0')
          return !!(i && i.ipAddress === '10.10.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'gi01',
        description: 'Gi0/1: 10.20.0.1/24',
        validate: (state) => {
          const i = state.interfaces.find(x => x.name === 'GigabitEthernet0/1')
          return !!(i && i.ipAddress === '10.20.0.1' && i.subnetMask === '255.255.255.0' && i.isUp)
        },
      },
      {
        id: 'route1',
        description: 'Route 10.30.0.0/24 via 10.10.0.254',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '10.30.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.10.0.254'
        ),
      },
      {
        id: 'route2',
        description: 'Route 10.40.0.0/24 via 10.20.0.254',
        validate: (state) => state.routes.some(r =>
          r.type === 'S' && r.network === '10.40.0.0' && r.mask === '255.255.255.0' && r.nextHop === '10.20.0.254'
        ),
      },
    ],
    hints: [
      'hostname R-NEW pour changer le nom',
      'Reconfigurez chaque interface avec la nouvelle IP (ip address ecrase l\'ancienne)',
      'Ajoutez les routes statiques vers les nouveaux reseaux',
    ],
  },
]
