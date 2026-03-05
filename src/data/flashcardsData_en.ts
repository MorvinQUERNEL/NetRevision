import { Flashcard } from './flashcardsData'

export const flashcardData: Flashcard[] = [
  // OSI Layers
  { id: 'f1', category: 'OSI', front: 'OSI Model Layer 1', back: 'Physical Layer - bits, cables, electrical signals, hubs, repeaters' },
  { id: 'f2', category: 'OSI', front: 'OSI Model Layer 2', back: 'Data Link Layer - frames, MAC addresses, switches, bridges, ARP' },
  { id: 'f3', category: 'OSI', front: 'OSI Model Layer 3', back: 'Network Layer - packets, IP addresses, routers, ICMP' },
  { id: 'f4', category: 'OSI', front: 'OSI Model Layer 4', back: 'Transport Layer - segments, TCP/UDP, ports, reliability' },
  { id: 'f5', category: 'OSI', front: 'Layer 2 PDU', back: 'Frame' },
  { id: 'f6', category: 'OSI', front: 'Layer 3 PDU', back: 'Packet' },
  { id: 'f7', category: 'OSI', front: 'Layer 4 PDU', back: 'Segment (TCP) / Datagram (UDP)' },
  // Ports
  { id: 'f8', category: 'Ports', front: 'Port 80', back: 'HTTP - unencrypted web browsing' },
  { id: 'f9', category: 'Ports', front: 'Port 443', back: 'HTTPS - encrypted web browsing (TLS/SSL)' },
  { id: 'f10', category: 'Ports', front: 'Port 22', back: 'SSH - secure remote access' },
  { id: 'f11', category: 'Ports', front: 'Port 23', back: 'Telnet - unsecured remote access (obsolete)' },
  { id: 'f12', category: 'Ports', front: 'Port 53', back: 'DNS - domain name resolution (TCP and UDP)' },
  { id: 'f13', category: 'Ports', front: 'Ports 67/68', back: 'DHCP - server (67) and client (68)' },
  { id: 'f14', category: 'Ports', front: 'Port 25', back: 'SMTP - sending emails' },
  { id: 'f15', category: 'Ports', front: 'Port 21', back: 'FTP - file transfer (control)' },
  { id: 'f16', category: 'Ports', front: 'Port 69', back: 'TFTP - simplified file transfer (UDP)' },
  { id: 'f17', category: 'Ports', front: 'Port 161', back: 'SNMP - network monitoring' },
  { id: 'f18', category: 'Ports', front: 'Port 3389', back: 'RDP - Windows remote desktop' },
  // IPv4
  { id: 'f19', category: 'IP', front: 'Class A private address range', back: '10.0.0.0 - 10.255.255.255 (10.0.0.0/8)' },
  { id: 'f20', category: 'IP', front: 'Class B private address range', back: '172.16.0.0 - 172.31.255.255 (172.16.0.0/12)' },
  { id: 'f21', category: 'IP', front: 'Class C private address range', back: '192.168.0.0 - 192.168.255.255 (192.168.0.0/16)' },
  { id: 'f22', category: 'IP', front: 'APIPA address', back: '169.254.x.x - automatically assigned when DHCP fails' },
  { id: 'f23', category: 'IP', front: 'Loopback address', back: '127.0.0.1 - tests the local TCP/IP stack' },
  // Subnetting
  { id: 'f24', category: 'Subnetting', front: '/24 subnet mask', back: '255.255.255.0 - 254 usable hosts' },
  { id: 'f25', category: 'Subnetting', front: '/25 subnet mask', back: '255.255.255.128 - 126 usable hosts' },
  { id: 'f26', category: 'Subnetting', front: '/26 subnet mask', back: '255.255.255.192 - 62 usable hosts' },
  { id: 'f27', category: 'Subnetting', front: '/27 subnet mask', back: '255.255.255.224 - 30 usable hosts' },
  { id: 'f28', category: 'Subnetting', front: '/28 subnet mask', back: '255.255.255.240 - 14 usable hosts' },
  { id: 'f29', category: 'Subnetting', front: '/30 subnet mask', back: '255.255.255.252 - 2 hosts (point-to-point link)' },
  { id: 'f30', category: 'Subnetting', front: 'Host count formula', back: '2^(32-CIDR) - 2 usable hosts' },
  // VLAN/STP
  { id: 'f31', category: 'Switching', front: 'Native VLAN', back: 'Default VLAN on a trunk (untagged) - VLAN 1 by default' },
  { id: 'f32', category: 'Switching', front: '802.1Q protocol', back: 'VLAN trunking standard - adds a 4-byte tag to the frame' },
  { id: 'f33', category: 'Switching', front: 'STP - Root Bridge', back: 'Switch with the lowest Bridge ID (priority + MAC) - center of the spanning tree' },
  { id: 'f34', category: 'Switching', front: 'STP - port states', back: 'Blocking -> Listening -> Learning -> Forwarding (+ Disabled)' },
  { id: 'f35', category: 'Switching', front: 'RSTP (802.1w)', back: 'Rapid STP - convergence in a few seconds (vs 30-50s for classic STP)' },
  // Routing
  { id: 'f36', category: 'Routing', front: 'OSPF administrative distance', back: '110' },
  { id: 'f37', category: 'Routing', front: 'RIP administrative distance', back: '120' },
  { id: 'f38', category: 'Routing', front: 'Static route administrative distance', back: '1' },
  { id: 'f39', category: 'Routing', front: 'EIGRP administrative distance', back: '90' },
  { id: 'f40', category: 'Routing', front: 'Connected route administrative distance', back: '0 (most trusted)' },
  { id: 'f41', category: 'Routing', front: 'OSPF - default hello timer', back: '10 seconds (dead timer = 40s)' },
  { id: 'f42', category: 'Routing', front: 'RIP - maximum hop count', back: '15 (16 = unreachable)' },
  // Protocols
  { id: 'f43', category: 'Protocols', front: 'DHCP - DORA process', back: 'Discover -> Offer -> Request -> Acknowledge' },
  { id: 'f44', category: 'Protocols', front: 'ARP', back: 'Address Resolution Protocol - resolves an IP address to a MAC address' },
  { id: 'f45', category: 'Protocols', front: 'ICMP', back: 'Internet Control Message Protocol - ping, traceroute, error messages' },
  { id: 'f46', category: 'Protocols', front: 'DNS - A record', back: 'Maps a domain name to an IPv4 address' },
  { id: 'f47', category: 'Protocols', front: 'DNS - AAAA record', back: 'Maps a domain name to an IPv6 address' },
  { id: 'f48', category: 'Protocols', front: 'DNS - MX record', back: 'Mail Exchange - points to the domain\'s mail server' },
  // Security
  { id: 'f49', category: 'Security', front: 'CIA Triad', back: 'Confidentiality, Integrity, Availability' },
  { id: 'f50', category: 'Security', front: 'AAA Framework', back: 'Authentication, Authorization, Accounting' },
  { id: 'f51', category: 'Security', front: 'Stateful vs stateless firewall', back: 'Stateful: tracks connection state | Stateless: filters packet by packet without context' },
  { id: 'f52', category: 'Security', front: 'WPA2', back: 'WiFi Protected Access 2 - uses AES-CCMP, current secure standard' },
  { id: 'f53', category: 'Security', front: 'WPA3', back: 'Uses SAE (Simultaneous Authentication of Equals) - more secure than WPA2' },
  // TCP/UDP
  { id: 'f54', category: 'Transport', front: 'TCP - three-way handshake', back: 'SYN -> SYN-ACK -> ACK' },
  { id: 'f55', category: 'Transport', front: 'TCP vs UDP', back: 'TCP: reliable, connection-oriented | UDP: fast, connectionless, no guarantee' },
  { id: 'f56', category: 'Transport', front: 'Protocols using UDP', back: 'DNS (53), DHCP (67/68), TFTP (69), SNMP (161), VoIP/RTP' },
  // Cisco commands
  { id: 'f57', category: 'Commands', front: 'show ip interface brief', back: 'Displays a summary of all interfaces (IP, status, protocol)' },
  { id: 'f58', category: 'Commands', front: 'show running-config', back: 'Displays the active configuration in RAM' },
  { id: 'f59', category: 'Commands', front: 'show ip route', back: 'Displays the complete routing table' },
  { id: 'f60', category: 'Commands', front: 'show vlan brief', back: 'Displays the list of VLANs and assigned ports' },

  // === PROGRAM 2 — Advanced ===

  // ACL
  { id: 'f61', category: 'ACL', front: 'Standard vs extended ACL', back: 'Standard: filters by source IP (1-99) | Extended: filters by src/dst IP, port, protocol (100-199)' },
  { id: 'f62', category: 'ACL', front: 'Implicit rule at the end of an ACL', back: 'deny any — all traffic not explicitly permitted is blocked' },
  { id: 'f63', category: 'ACL', front: 'Standard ACL placement', back: 'As close as possible to the destination' },
  { id: 'f64', category: 'ACL', front: 'Extended ACL placement', back: 'As close as possible to the source' },
  { id: 'f65', category: 'ACL', front: 'Wildcard mask for /24', back: '0.0.0.255 — inverse of the subnet mask' },

  // NAT/PAT
  { id: 'f66', category: 'NAT', front: 'Static NAT', back: '1:1 translation between a private IP and a fixed public IP' },
  { id: 'f67', category: 'NAT', front: 'Dynamic NAT', back: 'N:N translation using a pool of public addresses' },
  { id: 'f68', category: 'NAT', front: 'PAT (Port Address Translation)', back: 'NAT overload — multiple private IPs share 1 single public IP via ports' },
  { id: 'f69', category: 'NAT', front: 'Inside local vs Inside global', back: 'Inside local: internal private IP | Inside global: public IP seen from the Internet' },

  // VPN
  { id: 'f70', category: 'VPN', front: 'Site-to-site vs remote access VPN', back: 'Site-to-site: connects 2 networks (e.g., HQ-branch) | Remote access: connects a remote user' },
  { id: 'f71', category: 'VPN', front: 'IPsec — 2 phases', back: 'Phase 1: IKE — establishes the secure tunnel | Phase 2: ESP/AH — encrypts the data' },
  { id: 'f72', category: 'VPN', front: 'ESP vs AH protocol', back: 'ESP: encryption + authentication | AH: authentication only (no encryption)' },
  { id: 'f73', category: 'VPN', front: 'GRE tunnel', back: 'Generic Routing Encapsulation — encapsulates any protocol in IP (no native encryption)' },

  // WiFi
  { id: 'f74', category: 'WiFi', front: 'WiFi frequency bands', back: '2.4 GHz (range, 3 non-overlapping channels) and 5 GHz (throughput, 23+ channels)' },
  { id: 'f75', category: 'WiFi', front: 'Non-overlapping channels on 2.4 GHz', back: '1, 6, 11 — the only ones to use to avoid interference' },
  { id: 'f76', category: 'WiFi', front: 'SSID', back: 'Service Set Identifier — WiFi network name broadcast by the AP' },
  { id: 'f77', category: 'WiFi', front: 'Infrastructure vs ad-hoc mode', back: 'Infrastructure: clients -> AP -> network | Ad-hoc: clients communicate directly with each other' },

  // Monitoring
  { id: 'f78', category: 'Monitoring', front: 'SNMP — 3 components', back: 'Manager (NMS), Agent (on the device), MIB (object database)' },
  { id: 'f79', category: 'Monitoring', front: 'SNMP trap vs polling', back: 'Trap: agent sends a spontaneous alert | Polling: manager queries periodically' },
  { id: 'f80', category: 'Monitoring', front: 'Syslog — severity levels', back: '0=Emergency, 1=Alert, 2=Critical, 3=Error, 4=Warning, 5=Notice, 6=Info, 7=Debug' },
  { id: 'f81', category: 'Monitoring', front: 'NetFlow', back: 'Cisco protocol to collect network flow statistics (src, dst, ports, bytes)' },

  // === PROGRAM 3 — Enterprise ===

  // Automation
  { id: 'f82', category: 'Automation', front: 'Netmiko (Python)', back: 'Python library to connect via SSH to network devices and send commands' },
  { id: 'f83', category: 'Automation', front: 'NAPALM (Python)', back: 'Network Automation and Programmability Abstraction Layer — unified multi-vendor API' },
  { id: 'f84', category: 'Automation', front: 'Ansible — playbook', back: 'YAML file describing automation tasks to execute on target hosts' },
  { id: 'f85', category: 'Automation', front: 'Ansible — agentless advantage', back: 'No need to install an agent on devices — uses SSH or REST API' },
  { id: 'f86', category: 'Automation', front: 'REST API vs NETCONF', back: 'REST: HTTP/JSON, simple | NETCONF: SSH/XML, transactional, config validation' },
  { id: 'f87', category: 'Automation', front: 'YANG', back: 'Data modeling language for network configurations (used with NETCONF/RESTCONF)' },

  // Cloud
  { id: 'f88', category: 'Cloud', front: 'IaaS vs PaaS vs SaaS', back: 'IaaS: infrastructure (VMs, storage) | PaaS: platform (runtime, DB) | SaaS: complete application' },
  { id: 'f89', category: 'Cloud', front: 'VPC (Virtual Private Cloud)', back: 'Isolated virtual network in the cloud with subnets, routing tables, and ACLs' },
  { id: 'f90', category: 'Cloud', front: 'Kubernetes — Pod', back: 'Smallest deployable unit — contains one or more containers sharing the same network' },
  { id: 'f91', category: 'Cloud', front: 'Kubernetes — Service', back: 'Abstraction that exposes a set of Pods via a stable IP and load balancing' },
  { id: 'f92', category: 'Cloud', front: 'CNI (Container Network Interface)', back: 'Network plugin for Kubernetes (Calico, Flannel, Cilium) — manages Pod networking' },

  // SDN
  { id: 'f93', category: 'SDN', front: 'SDN — 3 layers', back: 'Application (apps) -> Control (central controller) -> Infrastructure (switches/routers)' },
  { id: 'f94', category: 'SDN', front: 'OpenFlow', back: 'SDN protocol between the controller and switches — manages flow tables' },
  { id: 'f95', category: 'SDN', front: 'Cisco DNA Center', back: 'Cisco SDN controller for the campus — automation, assurance, segmentation' },
  { id: 'f96', category: 'SDN', front: 'Northbound vs Southbound API', back: 'Northbound: controller -> applications (REST) | Southbound: controller -> devices (OpenFlow, NETCONF)' },

  // High Availability
  { id: 'f97', category: 'High Availability', front: 'HSRP (Hot Standby Router Protocol)', back: 'Cisco gateway redundancy protocol — one active router, one standby, shared virtual IP' },
  { id: 'f98', category: 'High Availability', front: 'VRRP vs HSRP', back: 'VRRP: open standard (RFC 5798) | HSRP: Cisco proprietary — same virtual gateway principle' },
  { id: 'f99', category: 'High Availability', front: 'EtherChannel', back: 'Link aggregation — combines multiple physical links into one logical link (LACP or PAgP)' },
  { id: 'f100', category: 'High Availability', front: 'LACP vs PAgP', back: 'LACP: IEEE 802.3ad standard (open) | PAgP: Cisco proprietary' },

  // Monitoring (Program 3)
  { id: 'f101', category: 'Monitoring', front: 'Prometheus', back: 'Open-source monitoring system — metric collection via scraping, time-series storage' },
  { id: 'f102', category: 'Monitoring', front: 'Grafana', back: 'Visualization platform — dashboards and graphs for metrics (Prometheus, InfluxDB...)' },
  { id: 'f103', category: 'Monitoring', front: 'ELK Stack', back: 'Elasticsearch + Logstash + Kibana — log collection, indexing, and visualization' },

  // === PROGRAM 4 — Expert ===

  // QoS
  { id: 'f104', category: 'QoS', front: 'DSCP EF (Expedited Forwarding)', back: 'DSCP value 46 — maximum priority, reserved for VoIP (latency < 150ms)' },
  { id: 'f105', category: 'QoS', front: 'QoS — 3 models', back: 'Best Effort (no QoS) | IntServ (RSVP reservation) | DiffServ (DSCP classification, most used)' },
  { id: 'f106', category: 'QoS', front: 'Traffic shaping vs policing', back: 'Shaping: queues excess traffic | Policing: drops or remarks excess traffic' },
  { id: 'f107', category: 'QoS', front: 'LLQ queue', back: 'Low Latency Queuing — strict priority queue for voice + CBWFQ for the rest' },

  // IPv6
  { id: 'f108', category: 'IPv6', front: 'IPv6 address size', back: '128 bits (vs 32 bits for IPv4) — 8 groups of 4 hex separated by :' },
  { id: 'f109', category: 'IPv6', front: 'IPv6 link-local address', back: 'FE80::/10 — auto-configured, non-routable, used for communication on the local link' },
  { id: 'f110', category: 'IPv6', front: 'SLAAC', back: 'Stateless Address Autoconfiguration — host generates its IP via router prefix (RA) + EUI-64 or random' },
  { id: 'f111', category: 'IPv6', front: 'NDP (Neighbor Discovery Protocol)', back: 'Replaces ARP in IPv6 — uses ICMPv6 (NS/NA for address resolution, RS/RA for router discovery)' },
  { id: 'f112', category: 'IPv6', front: 'Dual-stack', back: 'Transition technique — the device runs IPv4 and IPv6 simultaneously' },

  // MPLS
  { id: 'f113', category: 'MPLS', front: 'MPLS — principle', back: 'Label switching (layer 2.5) instead of IP routing — faster, enables VPNs and traffic engineering' },
  { id: 'f114', category: 'MPLS', front: 'LSR vs LER', back: 'LSR: Label Switch Router (core, switches labels) | LER: Label Edge Router (edge, adds/removes labels)' },
  { id: 'f115', category: 'MPLS', front: 'MPLS VPN L3 vs L2', back: 'L3 VPN: routing between sites (VRF + MP-BGP) | L2 VPN: VLAN extension between sites (VPLS, pseudowire)' },
  { id: 'f116', category: 'MPLS', front: 'VRF (Virtual Routing and Forwarding)', back: 'Isolated virtual routing table — allows a router to manage multiple customers without mixing routes' },

  // BGP
  { id: 'f117', category: 'BGP', front: 'BGP — protocol type', back: 'Path-vector, inter-AS routing protocol (between autonomous systems), TCP port 179' },
  { id: 'f118', category: 'BGP', front: 'eBGP vs iBGP', back: 'eBGP: between different ASes (TTL=1) | iBGP: within the same AS (full-mesh or route reflector)' },
  { id: 'f119', category: 'BGP', front: 'BGP Route Reflector', back: 'iBGP route concentrator — avoids full-mesh by reflecting routes to clients' },
  { id: 'f120', category: 'BGP', front: 'BGP — AS_PATH attribute', back: 'List of traversed ASes — used to avoid loops and influence route selection (shorter = preferred)' },
  { id: 'f121', category: 'BGP', front: 'BGP Communities', back: 'Tags attached to routes to apply routing policies (e.g., no-export, local-pref)' },

  // Advanced Wireless
  { id: 'f122', category: 'Advanced WiFi', front: 'Wi-Fi 6 (802.11ax)', back: 'OFDMA + MU-MIMO + BSS Coloring + TWT — max throughput 9.6 Gbps, optimized for dense environments' },
  { id: 'f123', category: 'Advanced WiFi', front: 'OFDMA', back: 'Orthogonal Frequency Division Multiple Access — divides the channel into sub-channels to serve multiple clients simultaneously' },
  { id: 'f124', category: 'Advanced WiFi', front: 'WLC (Wireless LAN Controller)', back: 'Centralized controller that manages APs — configuration, roaming, security, load balancing' },
  { id: 'f125', category: 'Advanced WiFi', front: 'Roaming 802.11r (FT)', back: 'Fast Transition — pre-authentication between APs for seamless roaming (< 50ms)' },

  // Datacenter
  { id: 'f126', category: 'Datacenter', front: 'Spine-Leaf architecture', back: 'Datacenter topology: each leaf connects to every spine — predictable latency, scalable' },
  { id: 'f127', category: 'Datacenter', front: 'VXLAN', back: 'Virtual Extensible LAN — encapsulates L2 frames in UDP/IP to extend VLANs beyond a single site (16M segments)' },
  { id: 'f128', category: 'Datacenter', front: 'EVPN', back: 'Ethernet VPN — BGP control plane for VXLAN, replaces flood-and-learn with signaling' },
  { id: 'f129', category: 'Datacenter', front: 'Underlay vs Overlay', back: 'Underlay: physical network (IP/OSPF/BGP) | Overlay: virtual network on top (VXLAN, tunnels)' },

  // SD-WAN
  { id: 'f130', category: 'SD-WAN', front: 'SD-WAN — principle', back: 'Separation of control and data planes for WAN — centralized management, multi-transport (MPLS, Internet, 4G)' },
  { id: 'f131', category: 'SD-WAN', front: 'SD-WAN — advantages vs MPLS', back: 'Reduced cost (uses Internet), rapid deployment (zero-touch), dynamic best link selection' },
  { id: 'f132', category: 'SD-WAN', front: 'Cisco vManage', back: 'Cisco SD-WAN centralized orchestrator — configuration, monitoring, traffic policies' },

  // Cybersecurity
  { id: 'f133', category: 'Cybersecurity', front: 'IDS vs IPS', back: 'IDS: detects and alerts (passive) | IPS: detects and blocks (inline, active)' },
  { id: 'f134', category: 'Cybersecurity', front: 'SOC (Security Operations Center)', back: 'Security operations center — team that monitors, detects, and responds to incidents 24/7' },
  { id: 'f135', category: 'Cybersecurity', front: 'SIEM', back: 'Security Information and Event Management — collects and correlates logs to detect threats (Splunk, QRadar)' },
  { id: 'f136', category: 'Cybersecurity', front: 'Zero Trust', back: '"Never trust, always verify" security model — continuous authentication, microsegmentation' },
  { id: 'f137', category: 'Cybersecurity', front: 'Kill Chain (Lockheed Martin)', back: 'Reconnaissance -> Weaponization -> Delivery -> Exploitation -> Installation -> C2 -> Actions on Objectives' },
  { id: 'f138', category: 'Cybersecurity', front: 'Pentest — 5 phases', back: 'Reconnaissance -> Scanning -> Exploitation -> Post-exploitation -> Reporting' },
  { id: 'f139', category: 'Cybersecurity', front: 'OWASP Top 10', back: 'List of the 10 most critical web vulnerabilities (injection, XSS, broken auth, SSRF...)' },
  { id: 'f140', category: 'Cybersecurity', front: 'CVE', back: 'Common Vulnerabilities and Exposures — unique identifier for each known vulnerability (e.g., CVE-2024-1234)' },
]
