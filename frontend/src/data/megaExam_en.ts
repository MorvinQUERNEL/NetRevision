import type { MegaSection } from './megaExam'

// === Section A : Classic MCQ (30 questions) ===

const sectionA: MegaSection = {
  id: 'A',
  title: 'Classic MCQ',
  type: 'qcm',
  icon: 'CheckCircle2',
  color: '#00e5a0',
  exercises: [
    { type: 'qcm', id: 'mega_a1', question: 'Which OSI layer is responsible for flow control and end-to-end reliability?', options: ['Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 4 - Transport', 'Layer 7 - Application'], correct: 2, explanation: 'The Transport layer (4) provides flow control, reliability (TCP), and data segmentation.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a2', question: 'What subnet mask corresponds to a /20?', options: ['255.255.240.0', '255.255.248.0', '255.255.224.0', '255.255.252.0'], correct: 0, explanation: '/20 means 20 network bits, which is 255.255.240.0 (11111111.11111111.11110000.00000000).', topic: 'P1' },
    { type: 'qcm', id: 'mega_a3', question: 'Which protocol uses port 53?', options: ['HTTP', 'FTP', 'DNS', 'SMTP'], correct: 2, explanation: 'DNS (Domain Name System) uses port 53 on UDP (queries) and TCP (zone transfers).', topic: 'P1' },
    { type: 'qcm', id: 'mega_a4', question: 'Which IPv6 address is equivalent to 127.0.0.1 in IPv4?', options: ['fe80::1', '::1', 'ff02::1', '2001:db8::1'], correct: 1, explanation: '::1 is the IPv6 loopback address, equivalent to 127.0.0.1 in IPv4.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a5', question: 'How many collision domains does a 24-port switch create?', options: ['1', '12', '24', '48'], correct: 2, explanation: 'Each switch port creates a separate collision domain, so 24 ports = 24 collision domains.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a6', question: 'What is the main role of the ARP protocol?', options: ['Resolve a domain name to an IP', 'Resolve an IP address to a MAC address', 'Assign a dynamic IP address', 'Verify network connectivity'], correct: 1, explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on the local network.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a7', question: 'Which Cisco command displays the routing table?', options: ['show interfaces', 'show ip route', 'show running-config', 'show vlan brief'], correct: 1, explanation: 'The "show ip route" command displays the routing table with all known routes.', topic: 'P1' },
    { type: 'qcm', id: 'mega_a8', question: 'Which TCP mechanism ensures reliable data delivery?', options: ['Best effort', 'Acknowledgement (ACK)', 'TTL', 'Fragmentation'], correct: 1, explanation: 'TCP uses acknowledgements (ACKs) to confirm receipt of each segment and retransmit if needed.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a9', question: 'Which dynamic routing protocol uses the Dijkstra algorithm?', options: ['RIP', 'EIGRP', 'OSPF', 'BGP'], correct: 2, explanation: 'OSPF uses the SPF (Shortest Path First) Dijkstra algorithm to calculate the shortest path.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a10', question: 'A standard ACL filters traffic based on:', options: ['Source address only', 'Source and destination address', 'Source and destination port', 'Protocol and destination address'], correct: 0, explanation: 'Standard ACLs (1-99) filter only on the source IP address. Extended ACLs filter on more criteria.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a11', question: 'NAT overload (PAT) uses which element to differentiate connections?', options: ['MAC address', 'Port number', 'TTL', 'VLAN ID'], correct: 1, explanation: 'PAT (Port Address Translation) uses port numbers to differentiate multiple internal connections sharing the same public IP.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a12', question: 'Which Wi-Fi standard is also known as Wi-Fi 6?', options: ['802.11n', '802.11ac', '802.11ax', '802.11be'], correct: 2, explanation: '802.11ax is Wi-Fi 6, offering speeds up to 9.6 Gbps, OFDMA and BSS Coloring.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a13', question: 'Which VPN protocol creates a secure tunnel at Layer 3?', options: ['SSL', 'L2TP', 'IPsec', 'PPTP'], correct: 2, explanation: 'IPsec operates at Layer 3 (Network) and can encrypt and authenticate IP packets.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a14', question: 'Which SNMP version introduces data encryption?', options: ['SNMPv1', 'SNMPv2c', 'SNMPv3', 'None'], correct: 2, explanation: 'SNMPv3 adds authentication and encryption (USM and VACM models) to secure monitoring.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a15', question: 'When troubleshooting, which command verifies DNS resolution?', options: ['ping', 'traceroute', 'nslookup', 'arp -a'], correct: 2, explanation: 'nslookup (or dig) queries a DNS server to verify domain name resolution.', topic: 'P2' },
    { type: 'qcm', id: 'mega_a16', question: 'Which Python module is used to send SSH commands to network devices?', options: ['requests', 'paramiko', 'flask', 'json'], correct: 1, explanation: 'Paramiko is a Python library for SSH connections, used to automate network equipment.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a17', question: 'Ansible uses which format to define its playbooks?', options: ['JSON', 'XML', 'YAML', 'INI'], correct: 2, explanation: 'Ansible playbooks are written in YAML, a readable and structured format.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a18', question: 'In the cloud model, which service provides on-demand virtual machines?', options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'], correct: 2, explanation: 'IaaS (Infrastructure as a Service) provides VMs, storage and networking on-demand (e.g., AWS EC2, Azure VM).', topic: 'P3' },
    { type: 'qcm', id: 'mega_a19', question: 'In Kubernetes, a Pod contains:', options: ['Only a single container', 'One or more containers sharing the same network', 'A complete cluster', 'A single worker node'], correct: 1, explanation: 'A Pod is the minimum deployment unit in K8s, containing one or more containers sharing the same network namespace and IP.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a20', question: 'The OpenFlow protocol is associated with which technology?', options: ['MPLS', 'SD-WAN', 'SDN', 'QoS'], correct: 2, explanation: 'OpenFlow is the reference protocol for SDN (Software-Defined Networking), allowing the controller to program flows on switches.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a21', question: 'HSRP (Hot Standby Router Protocol) provides:', options: ['WAN load balancing', 'Default gateway redundancy', 'Inter-VLAN routing', 'QoS on trunk links'], correct: 1, explanation: 'HSRP provides a redundant virtual gateway with an active router and a standby that takes over in case of failure.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a22', question: 'Which monitoring solution uses SNMP and RRD graphs?', options: ['Wireshark', 'Cacti', 'Nmap', 'Ansible'], correct: 1, explanation: 'Cacti collects data via SNMP and stores it in RRDtool databases to generate network performance graphs.', topic: 'P3' },
    { type: 'qcm', id: 'mega_a23', question: 'Which IP header field is used to mark QoS priority (DiffServ)?', options: ['TTL', 'DSCP', 'Protocol', 'Checksum'], correct: 1, explanation: 'The DSCP (Differentiated Services Code Point) is a sub-field of the ToS field used to classify packets for QoS.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a24', question: 'Which IPv6 address type is used for multicast?', options: ['fe80::/10', 'ff00::/8', '2000::/3', '::1/128'], correct: 1, explanation: 'IPv6 multicast addresses start with ff00::/8. fe80::/10 = link-local, 2000::/3 = global unicast.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a25', question: 'MPLS switches packets based on:', options: ['Destination IP address', 'Source MAC address', 'A label inserted between L2 and L3', 'VLAN number'], correct: 2, explanation: 'MPLS inserts a 32-bit label between L2 and L3 headers to switch packets without analyzing the IP header.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a26', question: 'BGP uses which TCP port to establish sessions?', options: ['Port 80', 'Port 179', 'Port 520', 'Port 443'], correct: 1, explanation: 'BGP (Border Gateway Protocol) uses TCP port 179 to establish sessions between peers.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a27', question: 'In a Spine-Leaf architecture, each Leaf is connected to:', options: ['A single Spine', 'All Spines', 'Other Leafs', 'A border router only'], correct: 1, explanation: 'In Spine-Leaf, each Leaf switch is connected to ALL Spine switches, ensuring a consistent hop count.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a28', question: 'SD-WAN primarily replaces which traditional WAN technology?', options: ['Ethernet LAN', 'Private MPLS', 'Wi-Fi', 'Fiber optics'], correct: 1, explanation: 'SD-WAN uses public Internet links to replace or complement expensive private MPLS connections.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a29', question: 'VXLAN (Virtual Extensible LAN) extends network segments to:', options: ['4,096', '16 million', '65,536', '1,024'], correct: 1, explanation: 'VXLAN uses a 24-bit VNI (VXLAN Network Identifier), allowing ~16 million segments vs 4,096 for VLANs.', topic: 'P4' },
    { type: 'qcm', id: 'mega_a30', question: 'Which framework is used for penetration testing and vulnerability assessment?', options: ['Ansible', 'Metasploit', 'Docker', 'Terraform'], correct: 1, explanation: 'Metasploit is a penetration testing framework for detecting and exploiting network vulnerabilities.', topic: 'P4' },
    // P5 - Wireless
    { type: 'qcm', id: 'mega_a31', question: 'Which Wi-Fi standard introduces OFDMA and BSS Coloring?', options: ['802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6)', '802.11be (Wi-Fi 7)'], correct: 2, explanation: '802.11ax (Wi-Fi 6) introduces OFDMA for better spectrum sharing and BSS Coloring to reduce interference.', topic: 'P5' },
    { type: 'qcm', id: 'mega_a32', question: 'Which Wi-Fi security protocol uses SAE (Simultaneous Authentication of Equals)?', options: ['WEP', 'WPA', 'WPA2', 'WPA3'], correct: 3, explanation: 'WPA3 uses SAE (based on Dragonfly) which replaces the WPA2 PSK 4-way handshake, providing better protection against dictionary attacks.', topic: 'P5' },
    // P6 - Automation & Programmability
    { type: 'qcm', id: 'mega_a33', question: 'Which HTTP method is used to create a new resource via a REST API?', options: ['GET', 'POST', 'DELETE', 'PATCH'], correct: 1, explanation: 'POST is the standard HTTP method for creating a new resource in a RESTful API.', topic: 'P6' },
    { type: 'qcm', id: 'mega_a34', question: 'Which data format is most commonly used by modern REST APIs?', options: ['XML', 'JSON', 'YAML', 'CSV'], correct: 1, explanation: 'JSON (JavaScript Object Notation) is the standard format for REST APIs due to its lightweight nature and ease of parsing.', topic: 'P6' },
  ]
}

// === Section B : Multiple-answer MCQ (10 questions) ===

const sectionB: MegaSection = {
  id: 'B',
  title: 'Multiple-answer MCQ',
  type: 'multi',
  icon: 'CheckSquare',
  color: '#6366f1',
  exercises: [
    { type: 'multi', id: 'mega_b1', question: 'Which protocols operate at the Application layer of the OSI model? (3 answers)', options: ['HTTP', 'TCP', 'DNS', 'IP', 'FTP'], correct: [0, 2, 4], explanation: 'HTTP, DNS and FTP are Layer 7 (Application) protocols. TCP = Layer 4, IP = Layer 3.', topic: 'P1' },
    { type: 'multi', id: 'mega_b2', question: 'Which are valid private IP addresses? (3 answers)', options: ['10.0.0.1', '172.16.5.1', '8.8.8.8', '192.168.1.1', '200.0.0.1'], correct: [0, 1, 3], explanation: 'RFC 1918 private ranges are: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.', topic: 'P1' },
    { type: 'multi', id: 'mega_b3', question: 'Which elements are present in a TCP segment? (3 answers)', options: ['Source port', 'MAC address', 'Sequence number', 'TTL', 'Window size'], correct: [0, 2, 4], explanation: 'A TCP segment contains ports, sequence/ack numbers, window size, flags. MAC is L2, TTL is L3.', topic: 'P2' },
    { type: 'multi', id: 'mega_b4', question: 'Which NAT types exist? (3 answers)', options: ['Static NAT', 'Elastic NAT', 'Dynamic NAT', 'PAT (overload)', 'Broadcast NAT'], correct: [0, 2, 3], explanation: 'The 3 NAT types are: static (1:1), dynamic (IP pool), and PAT/overload (N:1 with ports).', topic: 'P2' },
    { type: 'multi', id: 'mega_b5', question: 'Which cloud services are PaaS? (2 answers)', options: ['AWS EC2', 'Heroku', 'Google App Engine', 'Azure Virtual Machines'], correct: [1, 2], explanation: 'Heroku and Google App Engine are PaaS. EC2 and Azure VM are IaaS.', topic: 'P3' },
    { type: 'multi', id: 'mega_b6', question: 'Which tools are used for network automation? (3 answers)', options: ['Ansible', 'Photoshop', 'Python', 'Terraform', 'Excel'], correct: [0, 2, 3], explanation: 'Ansible, Python and Terraform are automation and IaC tools for networks.', topic: 'P3' },
    { type: 'multi', id: 'mega_b7', question: 'Which QoS mechanisms help manage congestion? (2 answers)', options: ['WRED', 'ARP', 'Queue scheduling', 'DHCP'], correct: [0, 2], explanation: 'WRED (Weighted Random Early Detection) and queue scheduling manage congestion. ARP and DHCP are unrelated.', topic: 'P4' },
    { type: 'multi', id: 'mega_b8', question: 'Which routing protocols are link-state? (2 answers)', options: ['RIP', 'OSPF', 'IS-IS', 'EIGRP'], correct: [1, 2], explanation: 'OSPF and IS-IS are link-state protocols. RIP is distance-vector, EIGRP is hybrid.', topic: 'P2' },
    { type: 'multi', id: 'mega_b9', question: 'Which are common network attack types? (3 answers)', options: ['Man-in-the-Middle', 'Defragmentation', 'DDoS', 'ARP Spoofing', 'Subnetting'], correct: [0, 2, 3], explanation: 'MITM, DDoS and ARP Spoofing are network attacks. Defragmentation and subnetting are normal mechanisms.', topic: 'P4' },
    { type: 'multi', id: 'mega_b10', question: 'Which are valid STP port states? (3 answers)', options: ['Blocking', 'Learning', 'Routing', 'Forwarding', 'Switching'], correct: [0, 1, 3], explanation: 'STP states are: Blocking, Listening, Learning, Forwarding, Disabled. Routing and Switching are not STP states.', topic: 'P1' },
    // P5 - Wireless
    { type: 'multi', id: 'mega_b11', question: 'Which are valid Cisco access point (AP) deployment modes? (3 answers)', options: ['Local mode', 'FlexConnect mode', 'Monitor mode', 'Routing mode', 'NAT mode'], correct: [0, 1, 2], explanation: 'Cisco APs support Local (tunnel to WLC), FlexConnect (local switching), Monitor (intrusion detection) modes. Routing and NAT are not AP modes.', topic: 'P5' },
    { type: 'multi', id: 'mega_b12', question: 'Which frequency bands are used by Wi-Fi 6 (802.11ax)? (2 answers)', options: ['900 MHz', '2.4 GHz', '5 GHz', '60 GHz'], correct: [1, 2], explanation: 'Wi-Fi 6 (802.11ax) operates on 2.4 GHz and 5 GHz. Wi-Fi 6E adds 6 GHz. 60 GHz is used by 802.11ad.', topic: 'P5' },
    // P6 - Automation
    { type: 'multi', id: 'mega_b13', question: 'Which tools are configuration management systems? (3 answers)', options: ['Ansible', 'Puppet', 'Chef', 'Wireshark', 'Nmap'], correct: [0, 1, 2], explanation: 'Ansible, Puppet and Chef are configuration management (IaC) tools. Wireshark captures packets, Nmap scans ports.', topic: 'P6' },
    { type: 'multi', id: 'mega_b14', question: 'Which elements are part of the SDN architecture? (3 answers)', options: ['Application plane', 'Control plane', 'Data plane', 'Physical plane', 'Session plane'], correct: [0, 1, 2], explanation: 'SDN architecture has 3 layers: Application plane (apps), Control plane (controller), Data plane (switches/forwarding).', topic: 'P6' },
  ]
}

// === Section C : True / False (15 questions) ===

const sectionC: MegaSection = {
  id: 'C',
  title: 'True / False',
  type: 'truefalse',
  icon: 'ToggleLeft',
  color: '#10b981',
  exercises: [
    { type: 'truefalse', id: 'mega_c1', statement: 'A Layer 2 switch can route packets between VLANs without additional configuration.', correct: false, explanation: 'False. A L2 switch does not route. You need a L3 switch or router for inter-VLAN routing.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c2', statement: 'The broadcast address of a 10.0.0.0/8 network is 10.255.255.255.', correct: true, explanation: 'True. With a /8 mask, the 24 host bits are all set to 1, giving 10.255.255.255.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c3', statement: 'TCP uses a three-way handshake (SYN, SYN-ACK, ACK) to establish a connection.', correct: true, explanation: 'True. TCP connection establishment involves 3 steps: SYN from client, SYN-ACK from server, ACK from client.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c4', statement: 'UDP is faster than TCP because it does not guarantee data delivery.', correct: true, explanation: 'True. UDP does not use acknowledgments or retransmissions, making it faster but unreliable.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c5', statement: 'A /30 mask allows addressing 4 hosts.', correct: false, explanation: 'False. /30 gives 4 addresses, but only 2 are usable (1 network + 1 broadcast = 2 removed).', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c6', statement: 'OSPF uses cost (bandwidth) as its primary metric.', correct: true, explanation: 'True. OSPF calculates cost based on reference bandwidth divided by link bandwidth.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c7', statement: 'An extended ACL should be placed as close to the traffic source as possible.', correct: true, explanation: 'True. Extended ACLs are placed near the source to block traffic early and save bandwidth.', topic: 'P2' },
    { type: 'truefalse', id: 'mega_c8', statement: 'Ansible requires an agent to be installed on managed devices.', correct: false, explanation: 'False. Ansible is agentless: it connects via SSH (or NETCONF) without any agent on the target.', topic: 'P3' },
    { type: 'truefalse', id: 'mega_c9', statement: 'In Kubernetes, a ClusterIP Service is accessible from outside the cluster.', correct: false, explanation: 'False. ClusterIP is only accessible internally. For external access, use NodePort, LoadBalancer or Ingress.', topic: 'P3' },
    { type: 'truefalse', id: 'mega_c10', statement: 'BGP is the routing protocol used between autonomous systems on the Internet.', correct: true, explanation: 'True. BGP (Border Gateway Protocol) is the inter-AS routing protocol, fundamental to the Internet.', topic: 'P4' },
    { type: 'truefalse', id: 'mega_c11', statement: 'MPLS works exclusively with the IPv4 protocol.', correct: false, explanation: 'False. MPLS is protocol-independent — it can carry IPv4, IPv6, Ethernet and other protocols.', topic: 'P4' },
    { type: 'truefalse', id: 'mega_c12', statement: 'DHCP uses UDP port 67 (server) and 68 (client).', correct: true, explanation: 'True. DHCP server listens on UDP 67, the client on UDP 68.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c13', statement: 'SD-WAN centralizes WAN management through a software controller.', correct: true, explanation: 'True. SD-WAN uses a central controller to manage routing policies, QoS and security across the entire WAN.', topic: 'P4' },
    { type: 'truefalse', id: 'mega_c14', statement: 'An access port on a switch carries traffic from multiple VLANs.', correct: false, explanation: 'False. An access port belongs to only one VLAN. Only a trunk port carries multiple VLANs.', topic: 'P1' },
    { type: 'truefalse', id: 'mega_c15', statement: 'EtherChannel allows aggregating multiple physical links into a single logical link.', correct: true, explanation: 'True. EtherChannel combines 2 to 8 physical links into one logical link for increased bandwidth and redundancy.', topic: 'P1' },
    // P5 - Wireless
    { type: 'truefalse', id: 'mega_c16', statement: 'CAPWAP is the protocol used for communication between an access point (AP) and a WLC.', correct: true, explanation: 'True. CAPWAP (Control And Provisioning of Wireless Access Points) is the standard protocol between APs and the WLC controller.', topic: 'P5' },
    { type: 'truefalse', id: 'mega_c17', statement: 'A hidden SSID completely prevents detection of the Wi-Fi network.', correct: false, explanation: 'False. A hidden SSID is not broadcast in beacons, but it can be detected by sniffing tools during probe requests/responses.', topic: 'P5' },
    // P6 - Automation
    { type: 'truefalse', id: 'mega_c18', statement: 'Ansible uses a push model to apply configurations.', correct: true, explanation: 'True. Ansible pushes configurations to devices via SSH, unlike Puppet/Chef which use a pull model.', topic: 'P6' },
    { type: 'truefalse', id: 'mega_c19', statement: 'In SDN architecture, the controller is part of the data plane.', correct: false, explanation: 'False. The SDN controller is part of the control plane. The data plane consists of switches that forward traffic.', topic: 'P6' },
  ]
}

// === Section D : Short Answer (15 questions) ===

const sectionD: MegaSection = {
  id: 'D',
  title: 'Short Answer',
  type: 'short',
  icon: 'PenLine',
  color: '#f59e0b',
  exercises: [
    { type: 'short', id: 'mega_d1', question: 'What is the default port number for HTTP?', acceptedAnswers: ['80'], hint: 'A number between 1 and 1024', explanation: 'HTTP uses TCP port 80 by default.', topic: 'P1' },
    { type: 'short', id: 'mega_d2', question: 'What is the CIDR notation for 255.255.255.0?', acceptedAnswers: ['/24', '24'], hint: '/xx notation', explanation: '255.255.255.0 = 24 bits set to 1 = /24.', topic: 'P1' },
    { type: 'short', id: 'mega_d3', question: 'Which protocol resolves an IP address to a MAC address?', acceptedAnswers: ['arp', 'ARP'], hint: '3 letters', explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.', topic: 'P1' },
    { type: 'short', id: 'mega_d4', question: 'What TCP port is used by HTTPS?', acceptedAnswers: ['443'], hint: 'A well-known port', explanation: 'HTTPS uses TCP port 443 with TLS/SSL.', topic: 'P1' },
    { type: 'short', id: 'mega_d5', question: 'Which Cisco command enters global configuration mode?', acceptedAnswers: ['configure terminal', 'conf t', 'conf term'], hint: 'Two-word command', explanation: 'The "configure terminal" (or abbreviated "conf t") command enters global configuration mode.', topic: 'P1' },
    { type: 'short', id: 'mega_d6', question: 'What UDP port number does DHCP use on the server side?', acceptedAnswers: ['67'], hint: 'A number < 100', explanation: 'The DHCP server listens on UDP port 67.', topic: 'P1' },
    { type: 'short', id: 'mega_d7', question: 'Which routing protocol uses the "hop count" metric with a maximum of 15?', acceptedAnswers: ['rip', 'RIP'], hint: '3 letters', explanation: 'RIP (Routing Information Protocol) uses hop count (max 15, 16 = infinity).', topic: 'P2' },
    { type: 'short', id: 'mega_d8', question: 'What TCP port does SSH use?', acceptedAnswers: ['22'], hint: 'A port < 100', explanation: 'SSH uses TCP port 22 for secure connections.', topic: 'P2' },
    { type: 'short', id: 'mega_d9', question: 'What is the default VLAN ID on a Cisco switch?', acceptedAnswers: ['1', 'vlan 1', 'VLAN 1'], hint: 'A single digit', explanation: 'VLAN 1 is the default (native) VLAN on Cisco switches.', topic: 'P1' },
    { type: 'short', id: 'mega_d10', question: 'Which protocol automates network configuration by providing IP, mask, gateway and DNS?', acceptedAnswers: ['dhcp', 'DHCP'], hint: '4 letters', explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns network parameters.', topic: 'P1' },
    { type: 'short', id: 'mega_d11', question: 'How many usable host addresses are in a /28 network?', acceptedAnswers: ['14'], hint: '2^n - 2', explanation: '/28 = 4 host bits = 16 addresses, minus network and broadcast = 14 hosts.', topic: 'P1' },
    { type: 'short', id: 'mega_d12', question: 'What is the AS number reserved for private networks in BGP?', acceptedAnswers: ['64512', '64512-65534', '65535'], hint: 'A number > 64000', explanation: 'Private AS numbers range from 64512 to 65534 (16-bit). 64512 is the first.', topic: 'P4' },
    { type: 'short', id: 'mega_d13', question: 'What TCP port does FTP use for the control channel?', acceptedAnswers: ['21'], hint: 'A port < 25', explanation: 'FTP uses TCP port 21 for control and port 20 for data transfer.', topic: 'P1' },
    { type: 'short', id: 'mega_d14', question: 'Which Cisco command displays interfaces and their status?', acceptedAnswers: ['show ip interface brief', 'sh ip int brief', 'sh ip int br'], hint: 'Starts with show', explanation: '"show ip interface brief" displays a summary of all interfaces and their up/down status.', topic: 'P1' },
    { type: 'short', id: 'mega_d15', question: 'What type of cable is used to connect two identical devices (switch-to-switch)?', acceptedAnswers: ['crossover', 'cross-over', 'crossover cable'], hint: 'A type of Ethernet cable', explanation: 'A crossover cable is needed to connect two similar devices (though auto-MDIX often makes it unnecessary).', topic: 'P1' },
    // P5 - Wireless
    { type: 'short', id: 'mega_d16', question: 'What protocol is used for the data tunnel between a lightweight AP and a WLC?', acceptedAnswers: ['capwap', 'CAPWAP'], hint: '6 letters', explanation: 'CAPWAP (Control And Provisioning of Wireless Access Points) creates a tunnel between the AP and WLC for control and data.', topic: 'P5' },
    // P6 - Automation
    { type: 'short', id: 'mega_d17', question: 'What data format uses key-value pairs with curly braces {}?', acceptedAnswers: ['json', 'JSON'], hint: '4 letters', explanation: 'JSON (JavaScript Object Notation) uses key-value pairs enclosed in curly braces.', topic: 'P6' },
  ]
}

// === Section E : Matching (10 questions) ===

const sectionE: MegaSection = {
  id: 'E',
  title: 'Matching',
  type: 'matching',
  icon: 'Link2',
  color: '#8b5cf6',
  exercises: [
    { type: 'matching', id: 'mega_e1', instruction: 'Match each protocol to its default port.', pairs: [
      { left: 'HTTP', right: '80' },
      { left: 'HTTPS', right: '443' },
      { left: 'SSH', right: '22' },
      { left: 'DNS', right: '53' },
    ], explanation: 'HTTP=80, HTTPS=443, SSH=22, DNS=53 are the standard ports to know.', topic: 'P1' },
    { type: 'matching', id: 'mega_e2', instruction: 'Match each OSI layer to its PDU (Protocol Data Unit).', pairs: [
      { left: 'Layer 4 - Transport', right: 'Segment' },
      { left: 'Layer 3 - Network', right: 'Packet' },
      { left: 'Layer 2 - Data Link', right: 'Frame' },
      { left: 'Layer 1 - Physical', right: 'Bit' },
    ], explanation: 'Transport=Segment, Network=Packet, Data Link=Frame, Physical=Bit.', topic: 'P1' },
    { type: 'matching', id: 'mega_e3', instruction: 'Match each routing protocol to its type.', pairs: [
      { left: 'RIP', right: 'Distance-vector' },
      { left: 'OSPF', right: 'Link-state' },
      { left: 'EIGRP', right: 'Hybrid' },
      { left: 'BGP', right: 'Path-vector' },
    ], explanation: 'RIP=distance-vector, OSPF=link-state, EIGRP=hybrid (advanced distance-vector), BGP=path-vector.', topic: 'P2' },
    { type: 'matching', id: 'mega_e4', instruction: 'Match each cloud service to its model.', pairs: [
      { left: 'AWS EC2', right: 'IaaS' },
      { left: 'Google App Engine', right: 'PaaS' },
      { left: 'Gmail', right: 'SaaS' },
      { left: 'AWS Lambda', right: 'FaaS' },
    ], explanation: 'EC2=IaaS (VM), App Engine=PaaS (platform), Gmail=SaaS (software), Lambda=FaaS (functions).', topic: 'P3' },
    { type: 'matching', id: 'mega_e5', instruction: 'Match each WAN technology to its description.', pairs: [
      { left: 'MPLS', right: 'Label switching' },
      { left: 'SD-WAN', right: 'Software-driven WAN' },
      { left: 'VPN IPsec', right: 'Encrypted Layer 3 tunnel' },
      { left: 'Metro Ethernet', right: 'Metropolitan Ethernet extension' },
    ], explanation: 'MPLS=labels, SD-WAN=software controller, IPsec=L3 tunnel, Metro Ethernet=MAN extension.', topic: 'P4' },
    { type: 'matching', id: 'mega_e6', instruction: 'Match each Cisco command to its function.', pairs: [
      { left: 'show running-config', right: 'Display active config' },
      { left: 'show ip route', right: 'Display routing table' },
      { left: 'show vlan brief', right: 'List VLANs' },
      { left: 'show interfaces', right: 'Interface details' },
    ], explanation: 'running-config=active config, ip route=routes, vlan brief=VLANs, interfaces=port details.', topic: 'P1' },
    { type: 'matching', id: 'mega_e7', instruction: 'Match each network attack to its description.', pairs: [
      { left: 'ARP Spoofing', right: 'ARP table poisoning' },
      { left: 'DDoS', right: 'Flooding with massive traffic' },
      { left: 'Man-in-the-Middle', right: 'Communication interception' },
      { left: 'Phishing', right: 'Fake website deception' },
    ], explanation: 'ARP Spoofing=fake ARP replies, DDoS=flooding, MITM=interception, Phishing=fake site.', topic: 'P4' },
    { type: 'matching', id: 'mega_e8', instruction: 'Match each QoS mechanism to its role.', pairs: [
      { left: 'Classification', right: 'Identify traffic type' },
      { left: 'Marking (DSCP)', right: 'Mark packet priority' },
      { left: 'Queuing', right: 'Schedule queue processing' },
      { left: 'Policing', right: 'Limit ingress rate' },
    ], explanation: 'QoS flow: classify -> mark -> queue -> police/shape.', topic: 'P4' },
    { type: 'matching', id: 'mega_e9', instruction: 'Match each monitoring tool to its primary function.', pairs: [
      { left: 'Wireshark', right: 'Packet capture' },
      { left: 'Nagios', right: 'Alerts and monitoring' },
      { left: 'Nmap', right: 'Port scanning' },
      { left: 'Syslog', right: 'Centralized logging' },
    ], explanation: 'Wireshark=capture, Nagios=monitoring/alerts, Nmap=scanning, Syslog=centralized logs.', topic: 'P3' },
    { type: 'matching', id: 'mega_e10', instruction: 'Match each IPv6 address type to its range.', pairs: [
      { left: 'Link-local', right: 'fe80::/10' },
      { left: 'Global Unicast', right: '2000::/3' },
      { left: 'Multicast', right: 'ff00::/8' },
      { left: 'Loopback', right: '::1/128' },
    ], explanation: 'Link-local=fe80::/10, GUA=2000::/3, Multicast=ff00::/8, Loopback=::1/128.', topic: 'P4' },
    // P5 - Wireless
    { type: 'matching', id: 'mega_e11', instruction: 'Match each Wi-Fi standard to its commercial designation.', pairs: [
      { left: '802.11n', right: 'Wi-Fi 4' },
      { left: '802.11ac', right: 'Wi-Fi 5' },
      { left: '802.11ax', right: 'Wi-Fi 6' },
      { left: '802.11be', right: 'Wi-Fi 7' },
    ], explanation: '802.11n=Wi-Fi 4, 802.11ac=Wi-Fi 5, 802.11ax=Wi-Fi 6, 802.11be=Wi-Fi 7.', topic: 'P5' },
    // P6 - Automation
    { type: 'matching', id: 'mega_e12', instruction: 'Match each automation tool to its configuration language/format.', pairs: [
      { left: 'Ansible', right: 'YAML' },
      { left: 'Puppet', right: 'Puppet DSL' },
      { left: 'Chef', right: 'Ruby' },
      { left: 'Terraform', right: 'HCL' },
    ], explanation: 'Ansible=YAML (playbooks), Puppet=Puppet DSL (manifests), Chef=Ruby (recipes), Terraform=HCL (HashiCorp Configuration Language).', topic: 'P6' },
  ]
}

// === Section F : Ordering (8 questions) ===

const sectionF: MegaSection = {
  id: 'F',
  title: 'Ordering',
  type: 'ordering',
  icon: 'ArrowUpDown',
  color: '#ec4899',
  exercises: [
    { type: 'ordering', id: 'mega_f1', instruction: 'Put the OSI model layers in order (from 7 to 1).', items: ['Application', 'Presentation', 'Session', 'Transport', 'Network', 'Data Link', 'Physical'], explanation: 'OSI model top to bottom: Application (7) > Presentation (6) > Session (5) > Transport (4) > Network (3) > Data Link (2) > Physical (1).', topic: 'P1' },
    { type: 'ordering', id: 'mega_f2', instruction: 'Put the data encapsulation steps in order.', items: ['User data', 'Add Transport layer header (segment)', 'Add Network layer header (packet)', 'Add Data Link header + trailer (frame)', 'Convert to bits on physical media'], explanation: 'Encapsulation: Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).', topic: 'P1' },
    { type: 'ordering', id: 'mega_f3', instruction: 'Put the TCP three-way handshake steps in order.', items: ['Client sends SYN', 'Server responds with SYN-ACK', 'Client sends ACK'], explanation: 'Three-way handshake: 1) SYN (client), 2) SYN-ACK (server), 3) ACK (client). Connection is then established.', topic: 'P2' },
    { type: 'ordering', id: 'mega_f4', instruction: 'Put the DHCP steps (DORA) in order.', items: ['DHCP Discover (client broadcast)', 'DHCP Offer (server proposes an IP)', 'DHCP Request (client accepts the offer)', 'DHCP Acknowledgment (server confirms)'], explanation: 'DHCP DORA process: Discover -> Offer -> Request -> Acknowledgment.', topic: 'P1' },
    { type: 'ordering', id: 'mega_f5', instruction: 'Put the Cisco router boot process in order.', items: ['POST (Power-On Self Test)', 'Bootstrap loading', 'Locate and load IOS', 'Load configuration file'], explanation: 'Boot: POST (hardware test) -> Bootstrap -> IOS (from Flash/TFTP) -> Config (NVRAM/TFTP).', topic: 'P1' },
    { type: 'ordering', id: 'mega_f6', instruction: 'Put these route types in order of priority (increasing administrative distance).', items: ['Connected (0)', 'Static (1)', 'EIGRP (90)', 'OSPF (110)', 'RIP (120)'], explanation: 'Administrative distance: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120. Lower values are preferred.', topic: 'P2' },
    { type: 'ordering', id: 'mega_f7', instruction: 'Put the Ansible deployment steps in order.', items: ['Define the host inventory', 'Write the YAML playbook', 'Execute the playbook (ansible-playbook)', 'Verify the result on devices'], explanation: 'Ansible: inventory -> playbook -> execution -> verification. No agent to install.', topic: 'P3' },
    { type: 'ordering', id: 'mega_f8', instruction: 'Put the DNS resolution process steps in order.', items: ['Client queries the local resolver', 'Resolver contacts the root server', 'Root server redirects to the TLD (.com, .fr)', 'TLD redirects to the authoritative server', 'Authoritative server returns the IP address'], explanation: 'DNS: Client -> Resolver -> Root -> TLD -> Authoritative -> IP returned.', topic: 'P1' },
    // P5 - Wireless
    { type: 'ordering', id: 'mega_f9', instruction: 'Put the steps for a Wi-Fi client connecting to a WPA2-Enterprise network in order.', items: ['Client discovers the SSID (beacon/probe)', 'Open system authentication (802.11)', 'Association with the access point', '802.1X authentication (EAP) via the RADIUS server', 'Key derivation and 4-way handshake'], explanation: 'WPA2-Enterprise connection: Discovery -> Open auth -> Association -> 802.1X/EAP (RADIUS) -> 4-way handshake.', topic: 'P5' },
    // P6 - Automation
    { type: 'ordering', id: 'mega_f10', instruction: 'Put the steps of a REST API call to modify a network configuration in order.', items: ['Authentication (API token or credentials)', 'Build the HTTP request (method, URL, JSON body)', 'Send the request to the controller/device', 'Receive the response (HTTP code + body)', 'Verify the result (status 200/201)'], explanation: 'REST API: Auth -> Build request -> Send -> Receive response -> Verify status code.', topic: 'P6' },
  ]
}

// === Section G : Config Analysis (8 questions) ===

const sectionG: MegaSection = {
  id: 'G',
  title: 'Config Analysis',
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
 no shutdown`, question: 'How many usable hosts can the subnet on GigabitEthernet0/2 contain?', options: ['1', '2', '4', '6'], correct: 1, explanation: 'Mask 255.255.255.252 = /30, giving 4 addresses with 2 usable (1 network + 1 broadcast removed). Ideal for point-to-point links.', topic: 'P1' },
    { type: 'config', id: 'mega_g2', configSnippet: `access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 80
access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 443
access-list 100 deny ip any any`, question: 'What traffic does this ACL allow?', options: ['All traffic from 192.168.1.0', 'Only HTTP and HTTPS from 192.168.1.0/24', 'All web traffic to 192.168.1.0', 'Only ICMP traffic'], correct: 1, explanation: 'ACL 100 allows TCP port 80 (HTTP) and 443 (HTTPS) from 192.168.1.0/24 to any destination, and blocks everything else.', topic: 'P2' },
    { type: 'config', id: 'mega_g3', configSnippet: `vlan 10
 name SALES
vlan 20
 name ACCOUNTING
vlan 30
 name MANAGEMENT
!
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 10
!
interface FastEthernet0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30`, question: 'Interface FastEthernet0/1 carries traffic from which VLANs?', options: ['VLANs 10, 20 and 30', 'VLAN 10 only', 'All VLANs', 'VLAN 1 (default)'], correct: 1, explanation: 'Fa0/1 is in access mode on VLAN 10. It only carries VLAN 10 (SALES) traffic.', topic: 'P1' },
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
 ip nat inside`, question: 'What type of NAT is configured here?', options: ['Static NAT', 'Dynamic NAT with pool', 'PAT (overload)', 'Bidirectional 1:1 NAT'], correct: 2, explanation: 'The "overload" keyword indicates PAT (Port Address Translation): all hosts on 192.168.1.0/24 share the public IP 203.0.113.1.', topic: 'P2' },
    { type: 'config', id: 'mega_g5', configSnippet: `router ospf 1
 network 10.0.0.0 0.0.0.255 area 0
 network 172.16.0.0 0.0.255.255 area 1
 default-information originate`, question: 'What does the "default-information originate" command do?', options: ['It disables OSPF', 'It redistributes the default route into OSPF', 'It changes the backbone area', 'It sets the router-id'], correct: 1, explanation: '"default-information originate" injects the default route (0.0.0.0/0) into OSPF updates so neighbors can learn it.', topic: 'P2' },
    { type: 'config', id: 'mega_g6', configSnippet: `spanning-tree mode rapid-pvst
spanning-tree vlan 10 priority 4096
spanning-tree vlan 20 priority 4096
!
interface GigabitEthernet0/1
 switchport mode trunk
 spanning-tree guard root`, question: 'What role will this switch have for VLANs 10 and 20?', options: ['Designated Bridge', 'Root Bridge', 'Blocked port', 'Non-Root Bridge'], correct: 1, explanation: 'Priority 4096 is very low (default=32768), so this switch will become Root Bridge for VLANs 10 and 20.', topic: 'P1' },
    { type: 'config', id: 'mega_g7', configSnippet: `ip dhcp pool LAN_POOL
 network 192.168.50.0 255.255.255.0
 default-router 192.168.50.1
 dns-server 8.8.8.8 8.8.4.4
 lease 7
!
ip dhcp excluded-address 192.168.50.1 192.168.50.10`, question: 'What address range will DHCP distribute?', options: ['192.168.50.1 to 192.168.50.254', '192.168.50.11 to 192.168.50.254', '192.168.50.1 to 192.168.50.10', '192.168.50.0 to 192.168.50.255'], correct: 1, explanation: 'The pool covers 192.168.50.0/24 but addresses .1 to .10 are excluded. DHCP will distribute from .11 to .254 (.0 and .255 are network/broadcast).', topic: 'P1' },
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
 ip address 192.168.30.1 255.255.255.0`, question: 'What technique is being implemented here?', options: ['EtherChannel', 'Inter-VLAN routing (Router-on-a-Stick)', 'Port mirroring', 'HSRP'], correct: 1, explanation: 'Sub-interfaces with dot1Q encapsulation on a single physical interface = Router-on-a-Stick, a classic inter-VLAN routing technique.', topic: 'P1' },
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
 security web-auth`, question: 'What type of security is used for the GUEST WLAN?', options: ['WPA2-Enterprise (802.1X)', 'WPA2-Personal (PSK)', 'Web Authentication (captive portal)', 'Open (no security)'], correct: 2, explanation: 'The GUEST WLAN uses "security web-auth" which corresponds to a captive portal (Web Authentication). The CORPORATE WLAN uses 802.1X (dot1x).', topic: 'P5' },
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
        parents: interface GigabitEthernet0/1`, question: 'Which automation tool uses this configuration file?', options: ['Terraform', 'Puppet', 'Ansible', 'Chef'], correct: 2, explanation: 'The YAML syntax with "hosts", "tasks" and "ios_vlan"/"ios_config" modules is characteristic of an Ansible playbook.', topic: 'P6' },
  ]
}

// === Section H : Practical Scenarios (4 scenarios, ~16 sub-questions) ===

const sectionH: MegaSection = {
  id: 'H',
  title: 'Practical Scenarios',
  type: 'scenario',
  icon: 'Network',
  color: '#e11d48',
  exercises: [
    {
      type: 'scenario', id: 'mega_h1',
      scenario: 'A company has 3 departments (Sales, Accounting, IT) connected to a central switch. Each department must be isolated in its own VLAN. A router handles inter-VLAN communication through a single physical interface.',
      diagram: `
  [Sales PC]──── Fa0/1 ┐
  [Acct PC]──── Fa0/5  ├── [Switch] ── Trunk Gi0/24 ── [Router Gi0/0]
  [IT PC]────── Fa0/10 ┘                                   │.10 │.20 │.30
                                                      VLAN10 VLAN20 VLAN30`,
      subQuestions: [
        { question: 'What port mode must be configured on Fa0/1, Fa0/5 and Fa0/10?', options: ['Trunk mode', 'Access mode', 'Dynamic auto mode', 'Routed mode'], correct: 1, explanation: 'Ports connected to PCs must be in access mode, each assigned to its respective VLAN.' },
        { question: 'What type of link is needed between the switch and the router?', options: ['Access', 'Trunk', 'EtherChannel', 'PortChannel'], correct: 1, explanation: 'A trunk link is needed to carry frames from all 3 VLANs between the switch and the router.' },
        { question: 'What is this inter-VLAN routing architecture called?', options: ['Router-on-a-Stick', 'L3 Switch', 'Dual-homed router', 'Floating static route'], correct: 0, explanation: 'Router-on-a-Stick uses a single physical interface with sub-interfaces (one per VLAN).' },
        { question: 'If the Sales PC (VLAN 10) wants to communicate with the Accounting PC (VLAN 20), where does the traffic go?', options: ['Directly through the switch', 'Through the router (inter-VLAN routing)', 'Through the Internet', 'It is impossible'], correct: 1, explanation: 'Inter-VLAN traffic must go through the router, as VLANs are isolated broadcast domains.' },
      ],
      topic: 'P1'
    },
    {
      type: 'scenario', id: 'mega_h2',
      scenario: 'A network administrator must configure OSPF on 3 routers. R1 and R2 are in Area 0 (backbone), R2 and R3 are in Area 1. R1 is the exit point to the Internet with a default route.',
      diagram: `
  Internet ── [R1] ──── Area 0 ──── [R2] ──── Area 1 ──── [R3]
             .1  10.0.0.0/30  .2    .1  172.16.0.0/30  .2
                                     │
                              ABR (Area Border Router)`,
      subQuestions: [
        { question: 'Which router is the ABR (Area Border Router)?', options: ['R1', 'R2', 'R3', 'None'], correct: 1, explanation: 'R2 is the ABR because it has interfaces in two different areas (Area 0 and Area 1).' },
        { question: 'Which command on R1 redistributes the default route into OSPF?', options: ['redistribute static', 'default-information originate', 'network 0.0.0.0', 'ip route 0.0.0.0'], correct: 1, explanation: '"default-information originate" in the OSPF process redistributes the default route to all OSPF neighbors.' },
        { question: 'What type of LSA (Link-State Advertisement) does R2 send into Area 1 to describe Area 0 routes?', options: ['LSA Type 1', 'LSA Type 2', 'LSA Type 3 (Summary)', 'LSA Type 5'], correct: 2, explanation: 'ABRs generate LSA Type 3 (Summary) to propagate inter-area routes.' },
        { question: 'If R3 loses connectivity to R2, what happens to its OSPF routes?', options: ['Nothing, routes remain', 'Routes expire after the dead interval and are removed', 'R3 automatically switches to RIP', 'R3 reconnects via the Internet'], correct: 1, explanation: 'If Hello packets are no longer received, after the dead interval (40s by default), the adjacency drops and learned OSPF routes are removed.' },
      ],
      topic: 'P2'
    },
    {
      type: 'scenario', id: 'mega_h3',
      scenario: 'A company is migrating its on-premise infrastructure to the cloud. They use AWS with a VPC, EC2 instances in public and private subnets, a NAT Gateway, and a site-to-site VPN to the existing datacenter.',
      diagram: `
  Datacenter ══VPN══ [AWS VPC 10.0.0.0/16]
  on-premise          │
                ┌─────┴─────┐
          Public Subnet   Private Subnet
          10.0.1.0/24     10.0.2.0/24
          [EC2 Web]       [EC2 DB]
          (IGW)           (NAT GW)`,
      subQuestions: [
        { question: 'Which AWS component allows private subnet instances to access the Internet (updates) without being directly reachable?', options: ['Internet Gateway', 'NAT Gateway', 'VPN Gateway', 'Elastic IP'], correct: 1, explanation: 'The NAT Gateway allows private instances to initiate outbound connections to the Internet without accepting inbound connections.' },
        { question: 'Which AWS component provides direct Internet access to the public subnet?', options: ['NAT Gateway', 'VPN Gateway', 'Internet Gateway (IGW)', 'Direct Connect'], correct: 2, explanation: 'The Internet Gateway (IGW) is attached to the VPC and enables direct communication between public instances and the Internet.' },
        { question: 'What type of connection links the on-premise datacenter to the AWS VPC?', options: ['Site-to-site VPN (IPsec)', 'Direct Ethernet cable', 'Wi-Fi bridge', 'Public MPLS'], correct: 0, explanation: 'A site-to-site VPN (IPsec tunnel) securely connects the on-premise datacenter to the AWS VPC via the Internet.' },
      ],
      topic: 'P3'
    },
    {
      type: 'scenario', id: 'mega_h4',
      scenario: 'A telecom operator deploys an SD-WAN network to connect 50 branch offices. The central controller manages routing policies, QoS and security. Each site combines MPLS and Internet broadband links.',
      diagram: `
                    [SD-WAN Controller]
                     (Orchestrator)
                    /        |        \\
               Site A     Site B     Site C
              /     \\    /     \\    /     \\
          MPLS   Internet MPLS  Internet MPLS  Internet
              \\     /    \\     /    \\     /
               [Hub Datacenter / Cloud]`,
      subQuestions: [
        { question: 'What is the main advantage of SD-WAN over MPLS alone?', options: ['Lower latency', 'Reduced cost using Internet links', 'Guaranteed throughput', 'No encryption needed'], correct: 1, explanation: 'SD-WAN reduces costs by using Internet links (cheaper) to complement or replace MPLS, while maintaining quality through intelligent policies.' },
        { question: 'How does SD-WAN manage quality for critical applications?', options: ['It disables MPLS', 'It measures link metrics in real-time and routes dynamically', 'It uses only Internet', 'It increases physical bandwidth'], correct: 1, explanation: 'SD-WAN continuously measures latency, jitter and loss on each link, and dynamically routes traffic on the best path based on QoS policies.' },
        { question: 'The SD-WAN controller is equivalent to which component in SDN architecture?', options: ['Data plane', 'Centralized control plane', 'Management plane', 'Forwarding plane'], correct: 1, explanation: 'The SD-WAN controller centralizes the control plane, defining routing rules and policies applied on site equipment.' },
        { question: 'What technology is used to secure traffic on Internet links in SD-WAN?', options: ['HTTP', 'IPsec', 'Telnet', 'FTP'], correct: 1, explanation: 'SD-WAN uses IPsec tunnels to encrypt traffic going through the Internet, ensuring data confidentiality and integrity.' },
      ],
      topic: 'P4'
    },
    // P5 - Wireless
    {
      type: 'scenario', id: 'mega_h5',
      scenario: 'A university deploys a Wi-Fi network covering 3 buildings with a central WLC (Wireless LAN Controller). Two SSIDs are configured: "UNIV-STAFF" (WPA2-Enterprise, VLAN 100) for staff and "UNIV-GUEST" (captive portal, VLAN 200) for visitors. 30 APs in FlexConnect mode are distributed across the buildings.',
      diagram: `
  [Central WLC]
       │ CAPWAP
  ┌────┼────┐
  │    │    │
 [AP]  [AP]  [AP]  x30
  │         │
  ├── SSID: UNIV-STAFF (VLAN 100, 802.1X → RADIUS)
  └── SSID: UNIV-GUEST (VLAN 200, Web Auth)`,
      subQuestions: [
        { question: 'What protocol is used between the APs and the WLC for control and tunneling?', options: ['SNMP', 'CAPWAP', 'RADIUS', 'TACACS+'], correct: 1, explanation: 'CAPWAP (Control And Provisioning of Wireless Access Points) handles communication between lightweight APs and the WLC.' },
        { question: 'Why is FlexConnect mode chosen for the APs?', options: ['It is cheaper', 'It allows local traffic switching without going through the WLC', 'It does not require a WLC', 'It only supports 5 GHz'], correct: 1, explanation: 'FlexConnect allows APs to switch traffic locally, reducing latency and traffic to the WLC, ideal for remote sites.' },
        { question: 'What server is required for WPA2-Enterprise authentication of the UNIV-STAFF SSID?', options: ['DNS server', 'DHCP server', 'RADIUS server', 'FTP server'], correct: 2, explanation: 'WPA2-Enterprise uses 802.1X which requires a RADIUS server (e.g., Cisco ISE, FreeRADIUS) to authenticate users.' },
      ],
      topic: 'P5'
    },
    // P6 - Automation
    {
      type: 'scenario', id: 'mega_h6',
      scenario: 'A company adopts an SDN approach with Cisco DNA Center as the controller. The network team uses DNA Center REST APIs to automate device provisioning, policy management and monitoring. A CI/CD pipeline (Git + Ansible) deploys network configurations.',
      diagram: `
  [Git Repository] → [CI/CD Pipeline] → [Ansible]
                                            │
                                     REST API (HTTPS)
                                            │
                                    [DNA Center Controller]
                                     /        |        \\
                                [Switch]  [Router]  [AP/WLC]`,
      subQuestions: [
        { question: 'What is the role of DNA Center in this architecture?', options: ['Data plane (forwarding)', 'Centralized control plane (SDN controller)', 'File server', 'Firewall'], correct: 1, explanation: 'DNA Center is the SDN controller that centralizes management, policies and network automation through its control plane.' },
        { question: 'What data format is exchanged between Ansible and the DNA Center REST API?', options: ['XML', 'JSON', 'YAML', 'Binary'], correct: 1, explanation: 'DNA Center REST APIs exchange data in JSON. YAML is the format for Ansible playbooks, not API exchanges.' },
        { question: 'What is the main advantage of the CI/CD pipeline for network management?', options: ['Increases bandwidth', 'Enables versioned, tested and reproducible changes', 'Replaces the need for switches', 'Eliminates the need for security'], correct: 1, explanation: 'CI/CD applies DevOps principles to networking (NetDevOps): Git versioning, automated testing, reproducible and traceable deployments.' },
      ],
      topic: 'P6'
    },
  ]
}

// === Export ===

export const megaExamSections_en: MegaSection[] = [sectionA, sectionB, sectionC, sectionD, sectionE, sectionF, sectionG, sectionH]
