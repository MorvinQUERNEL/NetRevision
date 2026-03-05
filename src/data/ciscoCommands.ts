// ============================================================
// Cisco IOS CLI Simulator - Command Engine
// ============================================================

// --- Types ---

export type CiscoMode = 'user' | 'privileged' | 'globalConfig' | 'interfaceConfig' | 'routerConfig'

export interface InterfaceState {
  name: string            // e.g. "GigabitEthernet0/0", "Serial0/0/0"
  shortName: string       // e.g. "Gi0/0", "Se0/0/0"
  ipAddress: string | null
  subnetMask: string | null
  isUp: boolean
  description: string | null
}

export interface RouteEntry {
  type: 'C' | 'S' | 'O'  // Connected, Static, OSPF
  network: string
  mask: string
  nextHop: string | null
  interface: string | null
  adminDistance: number
}

export interface OspfNetwork {
  network: string
  wildcard: string
  area: number
}

export interface OspfConfig {
  processId: number
  routerId: string | null
  networks: OspfNetwork[]
}

export interface AclEntry {
  action: 'permit' | 'deny'
  protocol: string          // 'ip', 'tcp', 'udp', 'icmp', 'any source'
  source: string
  sourceWildcard: string
  destination: string
  destinationWildcard: string
  port: string | null
}

export interface AccessList {
  number: number
  type: 'standard' | 'extended'
  entries: AclEntry[]
}

export interface AppliedAcl {
  interfaceName: string
  aclNumber: number
  direction: 'in' | 'out'
}

export interface DeviceState {
  hostname: string
  currentMode: CiscoMode
  currentInterface: string | null
  interfaces: InterfaceState[]
  routes: RouteEntry[]
  ospf: OspfConfig | null
  accessLists: AccessList[]
  appliedAcls: AppliedAcl[]
}

export interface CommandResult {
  output: string
  newState: DeviceState
}

// --- Helpers ---

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numToIp(num: number): string {
  return [num >>> 24, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.')
}

function isValidIp(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(p => { const n = Number(p); return !isNaN(n) && n >= 0 && n <= 255 })
}

function isValidMask(mask: string): boolean {
  if (!isValidIp(mask)) return false
  const num = ipToNum(mask)
  if (num === 0) return true
  const inverted = (~num) >>> 0
  return (inverted & (inverted + 1)) === 0
}

function maskToCidr(mask: string): number {
  const num = ipToNum(mask)
  let bits = 0
  let n = num
  while (n) { bits += n & 1; n >>>= 1 }
  return bits
}

function getNetworkAddress(ip: string, mask: string): string {
  return numToIp((ipToNum(ip) & ipToNum(mask)) >>> 0)
}

function padRight(str: string, len: number): string {
  return str + ' '.repeat(Math.max(0, len - str.length))
}

// --- Prompt builder ---

export function getPrompt(state: DeviceState): string {
  const h = state.hostname
  switch (state.currentMode) {
    case 'user': return `${h}>`
    case 'privileged': return `${h}#`
    case 'globalConfig': return `${h}(config)#`
    case 'interfaceConfig': return `${h}(config-if)#`
    case 'routerConfig': return `${h}(config-router)#`
  }
}

// --- Default state factory ---

export function createDefaultState(overrides?: Partial<DeviceState>): DeviceState {
  return {
    hostname: 'Router',
    currentMode: 'user',
    currentInterface: null,
    interfaces: [
      { name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
      { name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
      { name: 'Serial0/0/0', shortName: 'Se0/0/0', ipAddress: null, subnetMask: null, isUp: false, description: null },
      { name: 'Serial0/0/1', shortName: 'Se0/0/1', ipAddress: null, subnetMask: null, isUp: false, description: null },
      { name: 'Loopback0', shortName: 'Lo0', ipAddress: null, subnetMask: null, isUp: true, description: null },
    ],
    routes: [],
    ospf: null,
    accessLists: [],
    appliedAcls: [],
    ...overrides,
  }
}

// --- Command definitions ---

interface CommandDefinition {
  modes: CiscoMode[]
  regex: RegExp
  handler: (state: DeviceState, match: RegExpMatchArray) => CommandResult
}

function findInterface(state: DeviceState, name: string): InterfaceState | undefined {
  const lower = name.toLowerCase()
  return state.interfaces.find(i =>
    i.name.toLowerCase() === lower ||
    i.shortName.toLowerCase() === lower ||
    i.name.toLowerCase().startsWith(lower)
  )
}

function resolveInterfaceName(input: string): string | null {
  const lower = input.toLowerCase().replace(/\s+/g, '')
  const mappings: [string, string][] = [
    ['gigabitethernet', 'GigabitEthernet'],
    ['gi', 'GigabitEthernet'],
    ['serial', 'Serial'],
    ['se', 'Serial'],
    ['loopback', 'Loopback'],
    ['lo', 'Loopback'],
    ['fastethernet', 'FastEthernet'],
    ['fa', 'FastEthernet'],
  ]
  for (const [prefix, full] of mappings) {
    if (lower.startsWith(prefix)) {
      const rest = input.substring(prefix.length).replace(/^\s*/, '')
      return `${full}${rest}`
    }
  }
  return null
}

// Rebuild connected routes from interfaces
function rebuildConnectedRoutes(state: DeviceState): RouteEntry[] {
  const nonConnected = state.routes.filter(r => r.type !== 'C')
  const connected: RouteEntry[] = state.interfaces
    .filter(i => i.isUp && i.ipAddress && i.subnetMask)
    .map(i => ({
      type: 'C' as const,
      network: getNetworkAddress(i.ipAddress!, i.subnetMask!),
      mask: i.subnetMask!,
      nextHop: null,
      interface: i.name,
      adminDistance: 0,
    }))
  return [...connected, ...nonConnected]
}

// --- Show command output builders ---

function showRunningConfig(state: DeviceState): string {
  const lines: string[] = [
    '!',
    `hostname ${state.hostname}`,
    '!',
  ]

  for (const iface of state.interfaces) {
    lines.push(`interface ${iface.name}`)
    if (iface.description) lines.push(` description ${iface.description}`)
    if (iface.ipAddress && iface.subnetMask) {
      lines.push(` ip address ${iface.ipAddress} ${iface.subnetMask}`)
    } else {
      lines.push(` no ip address`)
    }
    // Check for applied ACLs
    for (const acl of state.appliedAcls) {
      if (acl.interfaceName === iface.name) {
        lines.push(` ip access-group ${acl.aclNumber} ${acl.direction}`)
      }
    }
    if (!iface.isUp && iface.name !== 'Loopback0') {
      lines.push(` shutdown`)
    }
    lines.push('!')
  }

  // Static routes
  for (const route of state.routes.filter(r => r.type === 'S')) {
    lines.push(`ip route ${route.network} ${route.mask} ${route.nextHop || route.interface}`)
  }

  // OSPF
  if (state.ospf) {
    lines.push(`router ospf ${state.ospf.processId}`)
    if (state.ospf.routerId) lines.push(` router-id ${state.ospf.routerId}`)
    for (const net of state.ospf.networks) {
      lines.push(` network ${net.network} ${net.wildcard} area ${net.area}`)
    }
    lines.push('!')
  }

  // Access lists
  for (const acl of state.accessLists) {
    for (const entry of acl.entries) {
      if (acl.type === 'standard') {
        lines.push(`access-list ${acl.number} ${entry.action} ${entry.source === '0.0.0.0' && entry.sourceWildcard === '255.255.255.255' ? 'any' : entry.source + ' ' + entry.sourceWildcard}`)
      } else {
        const src = entry.source === '0.0.0.0' && entry.sourceWildcard === '255.255.255.255' ? 'any' : `${entry.source} ${entry.sourceWildcard}`
        const dst = entry.destination === '0.0.0.0' && entry.destinationWildcard === '255.255.255.255' ? 'any' : `${entry.destination} ${entry.destinationWildcard}`
        const portStr = entry.port ? ` eq ${entry.port}` : ''
        lines.push(`access-list ${acl.number} ${entry.action} ${entry.protocol} ${src} ${dst}${portStr}`)
      }
    }
  }

  lines.push('!', 'end')
  return lines.join('\n')
}

function showIpRoute(state: DeviceState): string {
  const routes = rebuildConnectedRoutes(state)
  if (routes.length === 0) {
    return 'Gateway of last resort is not set'
  }
  const lines: string[] = [
    'Codes: C - connected, S - static, O - OSPF',
    '',
    'Gateway of last resort is not set',
    '',
  ]
  for (const r of routes) {
    const cidr = maskToCidr(r.mask)
    if (r.type === 'C') {
      lines.push(`C    ${r.network}/${cidr} is directly connected, ${r.interface}`)
    } else if (r.type === 'S') {
      lines.push(`S    ${r.network}/${cidr} [${r.adminDistance}/0] via ${r.nextHop || r.interface}`)
    } else if (r.type === 'O') {
      lines.push(`O    ${r.network}/${cidr} [110/${r.adminDistance}] via ${r.nextHop}, ${r.interface || ''}`)
    }
  }
  return lines.join('\n')
}

function showIpInterfaceBrief(state: DeviceState): string {
  const header = `${padRight('Interface', 25)}${padRight('IP-Address', 18)}${padRight('OK?', 6)}${padRight('Method', 9)}${padRight('Status', 23)}Protocol`
  const lines = [header]
  for (const iface of state.interfaces) {
    const status = iface.isUp ? 'up' : 'administratively down'
    const protocol = iface.isUp && iface.ipAddress ? 'up' : 'down'
    lines.push(
      `${padRight(iface.name, 25)}${padRight(iface.ipAddress || 'unassigned', 18)}${padRight('YES', 6)}${padRight('manual', 9)}${padRight(status, 23)}${protocol}`
    )
  }
  return lines.join('\n')
}

function showInterfaces(state: DeviceState): string {
  const lines: string[] = []
  for (const iface of state.interfaces) {
    const status = iface.isUp ? 'up' : 'administratively down'
    lines.push(`${iface.name} is ${status}, line protocol is ${iface.isUp && iface.ipAddress ? 'up' : 'down'}`)
    if (iface.description) lines.push(`  Description: ${iface.description}`)
    if (iface.ipAddress && iface.subnetMask) {
      lines.push(`  Internet address is ${iface.ipAddress}/${maskToCidr(iface.subnetMask)}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function showAccessLists(state: DeviceState): string {
  if (state.accessLists.length === 0) return ''
  const lines: string[] = []
  for (const acl of state.accessLists) {
    lines.push(`${acl.type === 'standard' ? 'Standard' : 'Extended'} IP access list ${acl.number}`)
    for (const entry of acl.entries) {
      if (acl.type === 'standard') {
        const src = entry.source === '0.0.0.0' && entry.sourceWildcard === '255.255.255.255' ? 'any' : `${entry.source} ${entry.sourceWildcard}`
        lines.push(`    ${entry.action} ${src}`)
      } else {
        const src = entry.source === '0.0.0.0' && entry.sourceWildcard === '255.255.255.255' ? 'any' : `${entry.source} ${entry.sourceWildcard}`
        const dst = entry.destination === '0.0.0.0' && entry.destinationWildcard === '255.255.255.255' ? 'any' : `${entry.destination} ${entry.destinationWildcard}`
        const portStr = entry.port ? ` eq ${entry.port}` : ''
        lines.push(`    ${entry.action} ${entry.protocol} ${src} ${dst}${portStr}`)
      }
    }
  }
  return lines.join('\n')
}

// --- Help text ---

function getHelpForMode(mode: CiscoMode): string {
  const common: Record<string, string> = {}
  const modeHelp: Record<CiscoMode, Record<string, string>> = {
    user: {
      'enable': 'Passer en mode privilegie',
      'show': 'Afficher les informations systeme',
      'exit': 'Quitter',
      'ping': 'Envoyer un echo ICMP',
    },
    privileged: {
      'configure terminal': 'Passer en mode de configuration globale',
      'show running-config': 'Afficher la configuration active',
      'show ip route': 'Afficher la table de routage',
      'show ip interface brief': 'Resume des interfaces',
      'show interfaces': 'Detail des interfaces',
      'show access-lists': 'Afficher les ACL',
      'disable': 'Revenir en mode utilisateur',
      'exit': 'Quitter',
    },
    globalConfig: {
      'hostname <name>': 'Changer le nom du routeur',
      'interface <type><slot>': 'Configurer une interface',
      'ip route <dest> <mask> <next-hop>': 'Ajouter une route statique',
      'router ospf <process-id>': 'Configurer OSPF',
      'access-list <num> ...': 'Creer une ACL',
      'no ip route <dest> <mask> <next-hop>': 'Supprimer une route statique',
      'exit': 'Revenir au mode privilegie',
      'end': 'Revenir au mode privilegie',
    },
    interfaceConfig: {
      'ip address <ip> <mask>': 'Configurer l\'adresse IP',
      'no shutdown': 'Activer l\'interface',
      'shutdown': 'Desactiver l\'interface',
      'description <text>': 'Ajouter une description',
      'ip access-group <num> <in|out>': 'Appliquer une ACL',
      'exit': 'Revenir en configuration globale',
      'end': 'Revenir au mode privilegie',
    },
    routerConfig: {
      'network <ip> <wildcard> area <id>': 'Annoncer un reseau OSPF',
      'router-id <ip>': 'Definir le router-id',
      'exit': 'Revenir en configuration globale',
      'end': 'Revenir au mode privilegie',
    },
  }

  const help = { ...common, ...modeHelp[mode] }
  const lines = Object.entries(help).map(([cmd, desc]) =>
    `  ${padRight(cmd, 38)}${desc}`
  )
  return lines.join('\n')
}

// --- Command registry ---

const commands: CommandDefinition[] = [
  // --- Mode transitions ---
  {
    modes: ['user'],
    regex: /^enable$/i,
    handler: (state) => ({
      output: '',
      newState: { ...state, currentMode: 'privileged' },
    }),
  },
  {
    modes: ['privileged'],
    regex: /^disable$/i,
    handler: (state) => ({
      output: '',
      newState: { ...state, currentMode: 'user' },
    }),
  },
  {
    modes: ['privileged'],
    regex: /^conf(?:igure)?\s+t(?:erminal)?$/i,
    handler: (state) => ({
      output: 'Enter configuration commands, one per line.  End with CNTL/Z.',
      newState: { ...state, currentMode: 'globalConfig' },
    }),
  },
  {
    modes: ['globalConfig'],
    regex: /^interface\s+(.+)$/i,
    handler: (state, match) => {
      const resolved = resolveInterfaceName(match[1])
      if (!resolved) {
        return { output: '% Invalid interface type', newState: state }
      }
      const iface = findInterface(state, resolved)
      if (!iface) {
        return { output: `% Invalid interface ${match[1]}`, newState: state }
      }
      return {
        output: '',
        newState: { ...state, currentMode: 'interfaceConfig', currentInterface: iface.name },
      }
    },
  },
  {
    modes: ['globalConfig'],
    regex: /^router\s+ospf\s+(\d+)$/i,
    handler: (state, match) => {
      const pid = parseInt(match[1])
      const newOspf = state.ospf && state.ospf.processId === pid
        ? state.ospf
        : { processId: pid, routerId: null, networks: [] }
      return {
        output: '',
        newState: { ...state, currentMode: 'routerConfig', ospf: newOspf },
      }
    },
  },
  // exit
  {
    modes: ['globalConfig'],
    regex: /^exit$/i,
    handler: (state) => ({
      output: '',
      newState: { ...state, currentMode: 'privileged' },
    }),
  },
  {
    modes: ['interfaceConfig', 'routerConfig'],
    regex: /^exit$/i,
    handler: (state) => ({
      output: '',
      newState: { ...state, currentMode: 'globalConfig', currentInterface: null },
    }),
  },
  {
    modes: ['user'],
    regex: /^exit$/i,
    handler: (state) => ({
      output: 'Connection closed.',
      newState: state,
    }),
  },
  {
    modes: ['privileged'],
    regex: /^exit$/i,
    handler: (state) => ({
      output: '',
      newState: { ...state, currentMode: 'user' },
    }),
  },
  // end (return to privileged from any config mode)
  {
    modes: ['globalConfig', 'interfaceConfig', 'routerConfig'],
    regex: /^end$/i,
    handler: (state) => ({
      output: '',
      newState: { ...state, currentMode: 'privileged', currentInterface: null },
    }),
  },

  // --- Show commands ---
  {
    modes: ['privileged', 'user'],
    regex: /^show\s+run(?:ning-config)?$/i,
    handler: (state) => ({
      output: showRunningConfig(state),
      newState: state,
    }),
  },
  {
    modes: ['privileged', 'user'],
    regex: /^show\s+ip\s+route$/i,
    handler: (state) => ({
      output: showIpRoute(state),
      newState: state,
    }),
  },
  {
    modes: ['privileged', 'user'],
    regex: /^show\s+ip\s+int(?:erface)?\s+br(?:ief)?$/i,
    handler: (state) => ({
      output: showIpInterfaceBrief(state),
      newState: state,
    }),
  },
  {
    modes: ['privileged', 'user'],
    regex: /^show\s+int(?:erfaces)?$/i,
    handler: (state) => ({
      output: showInterfaces(state),
      newState: state,
    }),
  },
  {
    modes: ['privileged', 'user'],
    regex: /^show\s+access-lists?$/i,
    handler: (state) => ({
      output: showAccessLists(state),
      newState: state,
    }),
  },

  // --- Configuration commands ---
  // hostname
  {
    modes: ['globalConfig'],
    regex: /^hostname\s+(\S+)$/i,
    handler: (state, match) => ({
      output: '',
      newState: { ...state, hostname: match[1] },
    }),
  },

  // ip address (interface config)
  {
    modes: ['interfaceConfig'],
    regex: /^ip\s+address\s+(\S+)\s+(\S+)$/i,
    handler: (state, match) => {
      const ip = match[1]
      const mask = match[2]
      if (!isValidIp(ip)) return { output: '% Invalid IP address', newState: state }
      if (!isValidMask(mask)) return { output: '% Invalid subnet mask', newState: state }

      const interfaces = state.interfaces.map(i =>
        i.name === state.currentInterface ? { ...i, ipAddress: ip, subnetMask: mask } : i
      )
      const newState = { ...state, interfaces }
      newState.routes = rebuildConnectedRoutes(newState)
      return { output: '', newState }
    },
  },

  // no shutdown
  {
    modes: ['interfaceConfig'],
    regex: /^no\s+shut(?:down)?$/i,
    handler: (state) => {
      const interfaces = state.interfaces.map(i =>
        i.name === state.currentInterface ? { ...i, isUp: true } : i
      )
      const newState = { ...state, interfaces }
      newState.routes = rebuildConnectedRoutes(newState)
      return {
        output: `%LINK-3-UPDOWN: Interface ${state.currentInterface}, changed state to up`,
        newState,
      }
    },
  },

  // shutdown
  {
    modes: ['interfaceConfig'],
    regex: /^shut(?:down)?$/i,
    handler: (state) => {
      const interfaces = state.interfaces.map(i =>
        i.name === state.currentInterface ? { ...i, isUp: false } : i
      )
      const newState = { ...state, interfaces }
      newState.routes = rebuildConnectedRoutes(newState)
      return {
        output: `%LINK-3-UPDOWN: Interface ${state.currentInterface}, changed state to administratively down`,
        newState,
      }
    },
  },

  // description
  {
    modes: ['interfaceConfig'],
    regex: /^description\s+(.+)$/i,
    handler: (state, match) => {
      const interfaces = state.interfaces.map(i =>
        i.name === state.currentInterface ? { ...i, description: match[1] } : i
      )
      return { output: '', newState: { ...state, interfaces } }
    },
  },

  // ip route (static)
  {
    modes: ['globalConfig'],
    regex: /^ip\s+route\s+(\S+)\s+(\S+)\s+(\S+)$/i,
    handler: (state, match) => {
      const [, dest, mask, nextHop] = match
      if (!isValidIp(dest)) return { output: '% Invalid destination', newState: state }
      if (!isValidMask(mask)) return { output: '% Invalid mask', newState: state }
      if (!isValidIp(nextHop)) return { output: '% Invalid next-hop', newState: state }

      const route: RouteEntry = {
        type: 'S', network: dest, mask, nextHop, interface: null, adminDistance: 1,
      }
      return { output: '', newState: { ...state, routes: [...state.routes, route] } }
    },
  },

  // no ip route
  {
    modes: ['globalConfig'],
    regex: /^no\s+ip\s+route\s+(\S+)\s+(\S+)\s+(\S+)$/i,
    handler: (state, match) => {
      const [, dest, mask, nextHop] = match
      const routes = state.routes.filter(r =>
        !(r.type === 'S' && r.network === dest && r.mask === mask && r.nextHop === nextHop)
      )
      return { output: '', newState: { ...state, routes } }
    },
  },

  // OSPF network
  {
    modes: ['routerConfig'],
    regex: /^network\s+(\S+)\s+(\S+)\s+area\s+(\d+)$/i,
    handler: (state, match) => {
      const [, network, wildcard, areaStr] = match
      if (!isValidIp(network)) return { output: '% Invalid network', newState: state }
      if (!isValidIp(wildcard)) return { output: '% Invalid wildcard mask', newState: state }
      const area = parseInt(areaStr)
      if (!state.ospf) return { output: '% OSPF not configured', newState: state }

      const newOspf = {
        ...state.ospf,
        networks: [...state.ospf.networks, { network, wildcard, area }],
      }
      return { output: '', newState: { ...state, ospf: newOspf } }
    },
  },

  // OSPF router-id
  {
    modes: ['routerConfig'],
    regex: /^router-id\s+(\S+)$/i,
    handler: (state, match) => {
      if (!state.ospf) return { output: '% OSPF not configured', newState: state }
      if (!isValidIp(match[1])) return { output: '% Invalid router-id', newState: state }
      return {
        output: '',
        newState: { ...state, ospf: { ...state.ospf, routerId: match[1] } },
      }
    },
  },

  // access-list (standard: 1-99)
  {
    modes: ['globalConfig'],
    regex: /^access-list\s+(\d+)\s+(permit|deny)\s+(.+)$/i,
    handler: (state, match) => {
      const num = parseInt(match[1])
      const action = match[2].toLowerCase() as 'permit' | 'deny'
      const rest = match[3].trim()

      const isStandard = num >= 1 && num <= 99
      const isExtended = num >= 100 && num <= 199

      if (!isStandard && !isExtended) {
        return { output: '% Invalid access-list number', newState: state }
      }

      let entry: AclEntry

      if (isStandard) {
        // Standard ACL: access-list <num> permit/deny <source> [wildcard] | any | host <ip>
        if (rest.toLowerCase() === 'any') {
          entry = { action, protocol: 'ip', source: '0.0.0.0', sourceWildcard: '255.255.255.255', destination: '0.0.0.0', destinationWildcard: '255.255.255.255', port: null }
        } else if (rest.toLowerCase().startsWith('host ')) {
          const hostIp = rest.substring(5).trim()
          entry = { action, protocol: 'ip', source: hostIp, sourceWildcard: '0.0.0.0', destination: '0.0.0.0', destinationWildcard: '255.255.255.255', port: null }
        } else {
          const parts = rest.split(/\s+/)
          const source = parts[0]
          const wildcard = parts[1] || '0.0.0.0'
          entry = { action, protocol: 'ip', source, sourceWildcard: wildcard, destination: '0.0.0.0', destinationWildcard: '255.255.255.255', port: null }
        }
      } else {
        // Extended ACL: access-list <num> permit/deny <protocol> <src> <src-wc|any> <dst> <dst-wc|any> [eq port]
        const parts = rest.split(/\s+/)
        const protocol = parts[0]?.toLowerCase() || 'ip'
        let srcIdx = 1
        let source = '0.0.0.0', sourceWild = '255.255.255.255'
        if (parts[srcIdx]?.toLowerCase() === 'any') {
          srcIdx++
        } else if (parts[srcIdx]?.toLowerCase() === 'host') {
          source = parts[srcIdx + 1] || '0.0.0.0'
          sourceWild = '0.0.0.0'
          srcIdx += 2
        } else {
          source = parts[srcIdx] || '0.0.0.0'
          sourceWild = parts[srcIdx + 1] || '0.0.0.0'
          srcIdx += 2
        }

        let destination = '0.0.0.0', destWild = '255.255.255.255'
        if (parts[srcIdx]?.toLowerCase() === 'any') {
          srcIdx++
        } else if (parts[srcIdx]?.toLowerCase() === 'host') {
          destination = parts[srcIdx + 1] || '0.0.0.0'
          destWild = '0.0.0.0'
          srcIdx += 2
        } else {
          destination = parts[srcIdx] || '0.0.0.0'
          destWild = parts[srcIdx + 1] || '0.0.0.0'
          srcIdx += 2
        }

        let port: string | null = null
        if (parts[srcIdx]?.toLowerCase() === 'eq') {
          port = parts[srcIdx + 1] || null
        }

        entry = { action, protocol, source, sourceWildcard: sourceWild, destination, destinationWildcard: destWild, port }
      }

      // Add entry to existing ACL or create new
      const existingIdx = state.accessLists.findIndex(a => a.number === num)
      let accessLists: AccessList[]
      if (existingIdx >= 0) {
        accessLists = state.accessLists.map((a, i) =>
          i === existingIdx ? { ...a, entries: [...a.entries, entry] } : a
        )
      } else {
        accessLists = [...state.accessLists, {
          number: num,
          type: isStandard ? 'standard' : 'extended',
          entries: [entry],
        }]
      }

      return { output: '', newState: { ...state, accessLists } }
    },
  },

  // ip access-group (apply ACL on interface)
  {
    modes: ['interfaceConfig'],
    regex: /^ip\s+access-group\s+(\d+)\s+(in|out)$/i,
    handler: (state, match) => {
      const aclNumber = parseInt(match[1])
      const direction = match[2].toLowerCase() as 'in' | 'out'
      if (!state.currentInterface) return { output: '% No interface selected', newState: state }

      // Remove existing ACL in same direction on same interface
      const filtered = state.appliedAcls.filter(a =>
        !(a.interfaceName === state.currentInterface && a.direction === direction)
      )
      const appliedAcls = [...filtered, { interfaceName: state.currentInterface, aclNumber, direction }]
      return { output: '', newState: { ...state, appliedAcls } }
    },
  },

  // ping (simplified)
  {
    modes: ['user', 'privileged'],
    regex: /^ping\s+(\S+)$/i,
    handler: (state, match) => {
      const target = match[1]
      if (!isValidIp(target)) return { output: `% Invalid IP address: ${target}`, newState: state }
      // Check if any interface is on the same network
      const targetNum = ipToNum(target)
      const reachable = state.interfaces.some(i => {
        if (!i.isUp || !i.ipAddress || !i.subnetMask) return false
        const maskNum = ipToNum(i.subnetMask)
        return (ipToNum(i.ipAddress) & maskNum) === (targetNum & maskNum)
      })
      // Also check routes
      const hasRoute = state.routes.some(r => {
        const maskNum = ipToNum(r.mask)
        return (ipToNum(r.network) & maskNum) === (targetNum & maskNum)
      })

      if (reachable || hasRoute) {
        return {
          output: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
          newState: state,
        }
      }
      return {
        output: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:\n.....\nSuccess rate is 0 percent (0/5)`,
        newState: state,
      }
    },
  },

  // ? help
  {
    modes: ['user', 'privileged', 'globalConfig', 'interfaceConfig', 'routerConfig'],
    regex: /^\?$/,
    handler: (state) => ({
      output: getHelpForMode(state.currentMode),
      newState: state,
    }),
  },
]

// --- Command processor ---

export function processCommand(input: string, state: DeviceState): CommandResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', newState: state }

  for (const cmd of commands) {
    if (!cmd.modes.includes(state.currentMode)) continue
    const match = trimmed.match(cmd.regex)
    if (match) {
      return cmd.handler(state, match)
    }
  }

  // No match found
  return {
    output: `% Invalid input detected at '^' marker.\n  ${trimmed}\n  ^`,
    newState: state,
  }
}
