import type { GlossaryTerm } from './glossaryTerms'

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'access-list',
    term: 'Access List (ACL)',
    definition: 'A set of sequential rules applied on a router to permit or deny network traffic based on criteria such as source IP address, destination IP address, or port number. Standard ACLs filter only on the source address, while extended ACLs offer more granular filtering.',
    category: 'Security',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'acl-etendue',
    term: 'Extended ACL',
    definition: 'An access control list that filters traffic based on source IP address, destination IP address, protocol (TCP, UDP, ICMP), and port numbers. It is numbered from 100 to 199 or named, and should be placed as close to the source as possible.',
    category: 'Security',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'acl-standard',
    term: 'Standard ACL',
    definition: 'An access control list that filters traffic based only on the source IP address. It is numbered from 1 to 99 and should be placed as close to the destination as possible to avoid blocking legitimate traffic.',
    category: 'Security',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'adresse-broadcast',
    term: 'Broadcast Address',
    definition: 'A special address used to send a packet to all hosts on a given network. In IPv4, it is the last address in the subnet, where all host bits are set to 1.',
    category: 'IP',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'adresse-ip',
    term: 'IP Address',
    definition: 'A unique logical identifier assigned to each network interface on an IP network. In IPv4, it is encoded on 32 bits (4 octets), and in IPv6, on 128 bits (16 octets).',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'adresse-mac',
    term: 'MAC Address',
    definition: 'A unique 48-bit (6 octet) physical address burned into the network interface card by the manufacturer. It is used for communication at Layer 2 (Data Link) of the OSI model.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'ansible',
    term: 'Ansible',
    definition: 'An open-source agentless automation tool that uses SSH to configure and manage network devices remotely. It uses playbooks written in YAML to describe tasks to be executed in a declarative manner.',
    category: 'Commands',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ansible-galaxy',
    term: 'Ansible Galaxy',
    definition: 'A community repository of pre-built Ansible roles and collections. It allows downloading and sharing ready-to-use network automation roles for various vendors (Cisco, Juniper, Arista).',
    category: 'Commands',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ansible-playbook',
    term: 'Ansible Playbook',
    definition: 'A YAML file describing an ordered set of tasks (plays) to be executed on target hosts. Each play associates a group of hosts with a list of Ansible modules to apply.',
    category: 'Commands',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ansible-role',
    term: 'Ansible Role',
    definition: 'A standardized directory structure for organizing and reusing Ansible code. A role groups tasks, handlers, variables, templates, and files in a conventional directory tree, facilitating sharing via Ansible Galaxy.',
    category: 'Commands',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'api-rest',
    term: 'REST API',
    definition: 'An HTTP-based programming interface that allows interacting with network devices programmatically. GET, POST, PUT, and DELETE requests are used to read and modify configurations.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'arp',
    term: 'ARP (Address Resolution Protocol)',
    definition: 'A Layer 2 protocol used to resolve an IP address to a MAC address on a local network. The host sends an ARP request via broadcast and receives a unicast reply containing the corresponding MAC address.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'arp-spoofing',
    term: 'ARP Spoofing',
    definition: 'A network attack that involves sending fake ARP replies to associate the attacker\'s MAC address with another host\'s IP address, enabling traffic interception (man-in-the-middle attack).',
    category: 'Security',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'authentification-802-1x',
    term: '802.1X Authentication',
    definition: 'An IEEE standard for port-based network access control. It requires authentication via a RADIUS server before allowing a device to communicate on the network, applicable to both WiFi and wired connections.',
    category: 'Security',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'autonomous-system',
    term: 'Autonomous System (AS)',
    definition: 'A collection of IP networks under the control of a single administrative entity sharing a common routing policy. Each AS is identified by a unique number (ASN) assigned by a regional Internet registry.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'bande-passante',
    term: 'Bandwidth',
    definition: 'The maximum theoretical throughput of a network link, expressed in bits per second (bps). It represents the transmission capacity of the physical medium and should not be confused with actual throughput.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'bgp',
    term: 'BGP (Border Gateway Protocol)',
    definition: 'An external routing protocol (EGP) used to exchange routing information between autonomous systems on the Internet. It operates on TCP port 179 and uses a path selection algorithm based on multiple attributes.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'broadcast-domain',
    term: 'Broadcast Domain',
    definition: 'A logical area of the network in which any host can reach all others via a broadcast. A router or a VLAN delimits a broadcast domain.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'calico',
    term: 'Calico',
    definition: 'A network plugin (CNI) for Kubernetes that provides network connectivity and security policies between pods. It uses the BGP protocol to distribute routes and supports Layer 3 routing without encapsulation.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'cidr',
    term: 'CIDR (Classless Inter-Domain Routing)',
    definition: 'A method of IP address allocation and routing that replaces the classful system. CIDR notation (e.g., 192.168.1.0/24) uses a variable-length prefix to define the network portion of an address.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'cisco-dna-center',
    term: 'Cisco DNA Center',
    definition: 'Cisco\'s intent-based network management platform providing automation, assurance, and analytics. It centralizes configuration, monitoring, and troubleshooting of campus, WAN, and wireless networks.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'classe-ip',
    term: 'IP Class',
    definition: 'A legacy system for classifying IPv4 addresses into five classes (A, B, C, D, E) based on the first bits of the address. This system has been replaced by CIDR but remains useful for understanding private address ranges.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'cni',
    term: 'CNI (Container Network Interface)',
    definition: 'A standard specification for network plugins in container environments like Kubernetes. It defines how to configure container network interfaces and manage connectivity between pods.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'collision-domain',
    term: 'Collision Domain',
    definition: 'A network segment where frames sent by two devices can collide. Each port on a switch constitutes a separate collision domain, while a hub shares a single collision domain.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'commutateur',
    term: 'Switch',
    definition: 'A Layer 2 network device that forwards Ethernet frames based on MAC addresses. It dynamically learns MAC addresses connected to each port and reduces collision domains.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'conteneur',
    term: 'Container',
    definition: 'A lightweight, isolated execution unit sharing the host system kernel. Containers (Docker, Podman) package the application and its dependencies, offering portability and rapid deployment in cloud environments.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'sdn-controller',
    term: 'SDN Controller',
    definition: 'The central element of an SDN architecture acting as the brain of the network. It maintains a global view of the topology and programs data plane devices via protocols like OpenFlow or proprietary APIs.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'couche-application',
    term: 'Application Layer (Layer 7)',
    definition: 'The top layer of the OSI model providing the interface between applications and the network. It includes protocols such as HTTP, FTP, SMTP, DNS, and DHCP used directly by user software.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-liaison',
    term: 'Data Link Layer (Layer 2)',
    definition: 'The second layer of the OSI model responsible for reliable frame transfer between two directly connected nodes. It handles MAC addressing, error detection (CRC), and media access control.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-physique',
    term: 'Physical Layer (Layer 1)',
    definition: 'The first layer of the OSI model defining the electrical, mechanical, and functional specifications for activating and maintaining a physical link. It manages the transmission of raw bits over the medium (cable, fiber, radio waves).',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-reseau',
    term: 'Network Layer (Layer 3)',
    definition: 'The third layer of the OSI model responsible for logical addressing (IP) and routing packets between different networks. Routers primarily operate at this layer.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'couche-transport',
    term: 'Transport Layer (Layer 4)',
    definition: 'The fourth layer of the OSI model providing end-to-end data transport between applications. It provides flow control, segmentation, and reliability via TCP or speed via UDP.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'demarche-depannage',
    term: 'Troubleshooting Methodology',
    definition: 'A structured methodology for diagnosing network problems. Common approaches include bottom-up (Layer 1 to 7), top-down (Layer 7 to 1), and divide-and-conquer (starting from the middle).',
    category: 'Commands',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'dhcp',
    term: 'DHCP (Dynamic Host Configuration Protocol)',
    definition: 'A protocol that enables automatic assignment of IP addresses and network parameters (subnet mask, gateway, DNS) to clients. The DORA process (Discover, Offer, Request, Acknowledge) takes place in four steps.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'dhcp-relay',
    term: 'DHCP Relay',
    definition: 'A feature configured on a router that relays DHCP broadcast requests from one subnet to a DHCP server located in another subnet. Configured with the ip helper-address command.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'dns',
    term: 'DNS (Domain Name System)',
    definition: 'A hierarchical name resolution system that translates domain names into IP addresses. It uses a distributed architecture with root, TLD, and authoritative servers, and primarily operates on UDP port 53.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'docker-network',
    term: 'Docker Network',
    definition: 'Docker\'s networking system allowing containers to communicate with each other and the outside world. The main drivers are bridge (local network), host (sharing the host network), and overlay (multi-host).',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'domaine-collision',
    term: 'Collision Domain',
    definition: 'A network area where signals from two devices can conflict. A hub creates a single shared collision domain, while a switch isolates each port in its own collision domain.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'dot1q',
    term: 'Dot1Q (802.1Q)',
    definition: 'An IEEE standard for Ethernet frame encapsulation for VLAN tagging. It inserts a 4-byte tag into the Ethernet header containing the VLAN ID (12 bits, supporting 4094 possible VLANs) and the CoS priority.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'dual-stack',
    term: 'Dual Stack',
    definition: 'A transition technique that allows a network device to run both IPv4 and IPv6 simultaneously on the same interface. It is the most common method for ensuring coexistence of both protocols during migration.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'eigrp',
    term: 'EIGRP (Enhanced Interior Gateway Routing Protocol)',
    definition: 'A Cisco proprietary advanced distance-vector routing protocol. It uses the DUAL algorithm for rapid convergence and considers bandwidth and delay to calculate the composite metric.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'elk-stack',
    term: 'ELK Stack (Elasticsearch, Logstash, Kibana)',
    definition: 'An open-source tool suite for collecting, storing, and visualizing network logs and metrics. Logstash collects data, Elasticsearch indexes it, and Kibana provides dashboards.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'encapsulation',
    term: 'Encapsulation',
    definition: 'The process by which each OSI layer adds its own header to data received from the layer above. Data successively becomes a segment, packet, frame, then bits as it travels down through the layers.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'dns-enregistrement',
    term: 'DNS Record',
    definition: 'An entry in a DNS zone associating a name with a value. The main types are A (name to IPv4), AAAA (name to IPv6), CNAME (alias), MX (mail server), NS (name server), and PTR (reverse lookup).',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'etherchannel',
    term: 'EtherChannel',
    definition: 'A link aggregation technology that combines multiple physical Ethernet links into a single logical link. The LACP (IEEE 802.3ad) and PAgP (Cisco) protocols allow automatic negotiation.',
    category: 'Switching',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'failover',
    term: 'Failover',
    definition: 'An automatic switchover mechanism to a backup device or path in case of primary system failure. It is essential for ensuring high availability of network services.',
    category: 'Services',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'fenetre-glissante',
    term: 'Sliding Window',
    definition: 'A flow control mechanism used by TCP that allows the sender to transmit multiple segments before receiving an acknowledgment. The window size dynamically adapts to network conditions.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'firewall',
    term: 'Firewall',
    definition: 'A network security device that filters incoming and outgoing traffic according to predefined rules. It can operate at Layers 3-4 (packet filtering) or Layer 7 (application inspection, next-generation firewall).',
    category: 'Security',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'ftp',
    term: 'FTP (File Transfer Protocol)',
    definition: 'A file transfer protocol operating on TCP ports 20 (data) and 21 (control). It can operate in active or passive mode and transmits credentials in clear text, hence the preference for SFTP or FTPS.',
    category: 'Services',
    relatedChapter: 'dns-dhcp'
  },
  {
    id: 'gateway',
    term: 'Gateway',
    definition: 'A device (usually a router) serving as the exit point from a local network to other networks. The default gateway is the IP address of the router that hosts use to reach remote networks.',
    category: 'Routing',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'grafana',
    term: 'Grafana',
    definition: 'An open-source visualization and monitoring platform for creating dashboards from multiple data sources (Prometheus, InfluxDB, SNMP). Widely used for network monitoring and alerting.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'gre',
    term: 'GRE (Generic Routing Encapsulation)',
    definition: 'A tunneling protocol developed by Cisco that encapsulates various network protocols within point-to-point IP packets. It does not provide native encryption but can be combined with IPsec for security.',
    category: 'Security',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'haute-disponibilite',
    term: 'High Availability (HA)',
    definition: 'A network architecture designed to minimize downtime by eliminating single points of failure. It relies on redundancy of devices, links, and protocols such as HSRP, VRRP, or stacking.',
    category: 'Services',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'hsrp',
    term: 'HSRP (Hot Standby Router Protocol)',
    definition: 'A Cisco proprietary protocol that allows multiple routers to share a common virtual IP address. An active router handles traffic while standby routers take over in case of failure.',
    category: 'Routing',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'http-https',
    term: 'HTTP / HTTPS',
    definition: 'Application layer protocols for transferring web pages. HTTP (port 80) transmits in clear text, while HTTPS (port 443) encrypts exchanges with TLS, ensuring data confidentiality and integrity.',
    category: 'Services',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'hub',
    term: 'Hub',
    definition: 'A Layer 1 network device that retransmits signals received on all its ports without filtering. It shares a single collision domain among all ports, making it obsolete compared to the switch.',
    category: 'Switching',
    relatedChapter: 'broadcast-collision'
  },
  {
    id: 'iaas',
    term: 'IaaS (Infrastructure as a Service)',
    definition: 'A cloud service model providing virtualized infrastructure resources (servers, storage, networking) on demand. The provider manages the hardware; the customer manages the operating system and applications.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'icmp',
    term: 'ICMP (Internet Control Message Protocol)',
    definition: 'A Layer 3 protocol used for network diagnostics and error signaling. It is the basis for ping (echo request/reply) and traceroute (TTL exceeded) commands. It does not carry application data.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'ids-ips',
    term: 'IDS / IPS',
    definition: 'Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS) that analyze network traffic to identify malicious activities. IDS only alerts, while IPS can automatically block suspicious traffic.',
    category: 'Security',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'interface-loopback',
    term: 'Loopback Interface',
    definition: 'A virtual logical interface on a router that is always active as long as the device is running. It is used as a stable identifier for routing protocols (OSPF router-id) and for connectivity testing.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'inventaire-ansible',
    term: 'Ansible Inventory',
    definition: 'A file (INI or YAML) listing target devices and their connection variables for Ansible. It organizes hosts into logical groups and can be static or dynamically generated.',
    category: 'Commands',
    relatedChapter: 'ansible-reseau'
  },
  {
    id: 'ipam',
    term: 'IPAM (IP Address Management)',
    definition: 'A tool or system for centralized IP address management in a network. It allows planning, tracking, and administering IP address and subnet allocation to avoid conflicts.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'ipsec',
    term: 'IPsec (Internet Protocol Security)',
    definition: 'A protocol suite that secures IP communications through encryption and authentication. It includes AH (integrity), ESP (confidentiality and integrity), and IKE (key exchange). Primarily used in site-to-site VPNs.',
    category: 'Security',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'ipv6',
    term: 'IPv6',
    definition: 'Version 6 of the Internet Protocol using 128-bit addresses written in hexadecimal (8 groups of 4 digits). IPv6 solves IPv4 address exhaustion and simplifies configuration with SLAAC auto-configuration.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'ipv6-link-local',
    term: 'IPv6 Link-Local',
    definition: 'An IPv6 address automatically generated on each interface, within the FE80::/10 range. It is used for communication on the local link only and is never routed beyond the network segment.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'jinja2',
    term: 'Jinja2',
    definition: 'A Python template engine used with Ansible and other network automation tools to dynamically generate device configurations from variables and control structures.',
    category: 'Commands',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'kubernetes-ingress',
    term: 'Kubernetes Ingress',
    definition: 'A Kubernetes resource managing external access to cluster services, typically via HTTP/HTTPS. The Ingress Controller (Nginx, Traefik) implements routing rules based on hostnames and URL paths.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'kubernetes-service',
    term: 'Kubernetes Service',
    definition: 'A Kubernetes abstraction exposing a set of pods via a stable virtual IP address (ClusterIP). Service types include ClusterIP, NodePort, and LoadBalancer for different levels of exposure.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'latence',
    term: 'Latency',
    definition: 'The transit time of a packet between its source and destination, measured in milliseconds. It consists of propagation delay, serialization delay, queuing delay, and processing delay.',
    category: 'Transport',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'load-balancer',
    term: 'Load Balancer',
    definition: 'A device or service that distributes network traffic across multiple servers to optimize performance and availability. It can operate at Layer 4 (TCP/UDP) or Layer 7 (HTTP) and uses various algorithms (round-robin, least connections).',
    category: 'Cloud',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'masque-sous-reseau',
    term: 'Subnet Mask',
    definition: 'A 32-bit value that separates the network portion from the host portion in an IPv4 address. Bits set to 1 identify the network portion, bits set to 0 identify the host portion. Example: 255.255.255.0 corresponds to a /24.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'mib',
    term: 'MIB (Management Information Base)',
    definition: 'A hierarchical tree-structured database containing the managed objects of a network device accessible via SNMP. Each object is identified by a unique OID (Object Identifier).',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'modele-osi',
    term: 'OSI Model',
    definition: 'A 7-layer reference model (Physical, Data Link, Network, Transport, Session, Presentation, Application) defining network communication functions. It serves as a theoretical framework for understanding protocols and troubleshooting.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'modele-tcp-ip',
    term: 'TCP/IP Model',
    definition: 'A practical 4-layer model (Network Access, Internet, Transport, Application) used in real networks. Unlike the 7-layer OSI model, it merges the Session, Presentation, and Application layers into a single layer.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'napalm',
    term: 'NAPALM (Network Automation and Programmability Abstraction Layer)',
    definition: 'A Python library providing a unified interface for interacting with multi-vendor network devices. It allows reading configuration, interface status, and deploying changes in a standardized manner.',
    category: 'Commands',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'nat',
    term: 'NAT (Network Address Translation)',
    definition: 'An IP address translation mechanism that allows multiple hosts on a private network to share one or more public IP addresses. Static NAT provides a one-to-one mapping, while dynamic NAT uses an address pool.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'nat-dynamique',
    term: 'Dynamic NAT',
    definition: 'A type of NAT that dynamically associates an internal IP address with a public IP address from a configured address pool. Unlike PAT, each internal connection requires a separate public address from the pool.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'nat-inside-outside',
    term: 'NAT Inside / Outside',
    definition: 'Fundamental NAT concepts in Cisco: the inside interface is connected to the local private network, the outside interface is connected to the public network. NAT translates addresses between inside local and inside global.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'nat-statique',
    term: 'Static NAT',
    definition: 'A permanent one-to-one translation between an internal private IP address and a public IP address. Primarily used to make internal servers (web, mail) accessible from the Internet.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'netconf',
    term: 'NETCONF',
    definition: 'An XML-based network configuration management protocol that uses SSH as transport. It supports read, write, and configuration validation operations, as well as locking to prevent conflicts.',
    category: 'Commands',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'netflow',
    term: 'NetFlow',
    definition: 'A protocol developed by Cisco for collecting and analyzing network traffic flows. Each flow is defined by a set of 5 to 7 parameters (source/destination IP, ports, protocol) and enables bandwidth monitoring.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'netmiko',
    term: 'Netmiko',
    definition: 'A Python library that simplifies SSH connections to multi-vendor network devices. It provides methods for sending commands, handling prompts, and retrieving output programmatically.',
    category: 'Commands',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'nslookup',
    term: 'nslookup / dig',
    definition: 'Command-line tools for querying DNS servers to resolve domain names into IP addresses. The dig command provides more detailed information than nslookup about DNS records.',
    category: 'Commands',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'openflow',
    term: 'OpenFlow',
    definition: 'A communication protocol between the control plane (SDN controller) and data plane (switches) in an SDN architecture. It allows the controller to program switch flow tables in a centralized manner.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'ospf',
    term: 'OSPF (Open Shortest Path First)',
    definition: 'An interior gateway routing protocol (IGP) using a link-state algorithm (Dijkstra) to calculate the shortest path. It organizes the network into areas and uses cost (based on bandwidth) as its metric.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'ospf-aire',
    term: 'OSPF Area',
    definition: 'A logical subdivision of an OSPF domain grouping routers and networks. Area 0 (backbone) is mandatory and all other areas must be connected to it. This reduces the size of the link-state database.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'paquet',
    term: 'Packet',
    definition: 'A Layer 3 (Network) data unit of the OSI model. An IP packet contains a header (source and destination IP addresses, TTL, protocol) and a payload containing the Layer 4 segment.',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'paramiko',
    term: 'Paramiko',
    definition: 'A Python library implementing the SSH protocol for secure connections to network devices. It serves as the foundation for Netmiko and allows command execution and file transfer via SFTP.',
    category: 'Commands',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'pat',
    term: 'PAT (Port Address Translation)',
    definition: 'A form of NAT that uses port numbers to distinguish connections from multiple internal hosts sharing a single public IP address. Also called NAT overload, it is the most commonly deployed type of NAT.',
    category: 'Services',
    relatedChapter: 'nat-pat'
  },
  {
    id: 'ping',
    term: 'Ping',
    definition: 'A network utility that sends ICMP Echo Request messages to a target host and measures the response time (RTT). It allows verifying network connectivity and diagnosing reachability problems.',
    category: 'Commands',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'pod-kubernetes',
    term: 'Pod (Kubernetes)',
    definition: 'The smallest deployable unit in Kubernetes, grouping one or more containers sharing the same network space and storage. Each pod receives a unique IP address within the cluster.',
    category: 'Cloud',
    relatedChapter: 'kubernetes-networking'
  },
  {
    id: 'port-security',
    term: 'Port Security',
    definition: 'A security feature on a Cisco switch that limits the number of MAC addresses allowed on a port. In case of violation, the port can be shut down (shutdown), restricted (restrict), or simply protected (protect).',
    category: 'Security',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'port-tcp-udp',
    term: 'TCP/UDP Port',
    definition: 'A logical number (0-65535) identifying an application or service on a host. Ports 0-1023 are reserved (well-known ports), ports 1024-49151 are registered, and ports 49152-65535 are dynamic.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'prometheus',
    term: 'Prometheus',
    definition: 'An open-source monitoring and alerting system using a pull-based collection model (scraping). It stores metrics as time series and uses the PromQL query language.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'protocole-routage',
    term: 'Routing Protocol',
    definition: 'A protocol that allows routers to automatically exchange information about reachable networks and build their routing tables. The main categories are distance-vector protocols (RIP) and link-state protocols (OSPF).',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'qos',
    term: 'QoS (Quality of Service)',
    definition: 'A set of techniques for prioritizing certain types of network traffic. QoS uses classification, marking (DSCP, CoS), queuing, and traffic shaping to guarantee performance.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'radius',
    term: 'RADIUS',
    definition: 'An Authentication, Authorization, and Accounting (AAA) protocol used to centralize network access control. The RADIUS server authenticates users and devices, particularly in 802.1X WiFi networks.',
    category: 'Security',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'restconf',
    term: 'RESTCONF',
    definition: 'An HTTP/HTTPS-based network management protocol using YANG data models. It offers a lighter alternative to NETCONF with standard CRUD operations (GET, POST, PUT, DELETE) and JSON or XML formats.',
    category: 'Commands',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'rip',
    term: 'RIP (Routing Information Protocol)',
    definition: 'An interior distance-vector routing protocol using hop count as its metric (maximum 15). RIPv1 does not support VLSM or CIDR, unlike RIPv2 which includes the subnet mask in its updates.',
    category: 'Routing',
    relatedChapter: 'routage-dynamique'
  },
  {
    id: 'routage-inter-vlan',
    term: 'Inter-VLAN Routing',
    definition: 'A technique enabling communication between different VLANs via a router or a Layer 3 switch. The router-on-a-stick method uses sub-interfaces on a single trunk link between the router and the switch.',
    category: 'Routing',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'routage-statique',
    term: 'Static Routing',
    definition: 'Manual configuration of routes in a router\'s routing table. Each route specifies the destination network, subnet mask, and next hop or exit interface. Suited for small networks or default routes.',
    category: 'Routing',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'route-par-defaut',
    term: 'Default Route',
    definition: 'A route of last resort (0.0.0.0/0) used when no more specific route matches a packet\'s destination. It typically directs traffic toward the network\'s exit gateway.',
    category: 'Routing',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'routeur',
    term: 'Router',
    definition: 'A Layer 3 device that interconnects different networks and forwards packets based on destination IP addresses and its routing table. It segments broadcast domains.',
    category: 'Routing',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'python-scapy',
    term: 'Scapy',
    definition: 'A powerful Python library for creating, sending, capturing, and analyzing network packets programmatically. It supports a large number of protocols and is useful for security testing and prototyping.',
    category: 'Commands',
    relatedChapter: 'automatisation-python'
  },
  {
    id: 'sdn',
    term: 'SDN (Software-Defined Networking)',
    definition: 'A network architecture that separates the control plane from the data plane, centralizing network intelligence in a software controller. This enables programmatic and agile management of network infrastructure.',
    category: 'Cloud',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'show-ip-route',
    term: 'show ip route',
    definition: 'A Cisco IOS command that displays a router\'s complete routing table, including connected (C), static (S), OSPF (O), EIGRP (D) routes, and the default route. An essential troubleshooting command.',
    category: 'Commands',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'slaac',
    term: 'SLAAC (Stateless Address Autoconfiguration)',
    definition: 'An IPv6-specific stateless auto-configuration mechanism that allows hosts to automatically generate their IP address from the network prefix announced by the router (Router Advertisement) and their MAC address.',
    category: 'IP',
    relatedChapter: 'ipv4-ipv6'
  },
  {
    id: 'snmp',
    term: 'SNMP (Simple Network Management Protocol)',
    definition: 'A network monitoring protocol for collecting information and configuring devices remotely. SNMPv3 adds authentication and encryption. The main operations are GET, SET, and TRAP.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'snmp-community',
    term: 'SNMP Community String',
    definition: 'A character string acting as a password for SNMP v1/v2c access. The "public" community allows read-only access and "private" allows read-write access by default. SNMPv3 replaces this mechanism with more robust authentication.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'snmp-trap',
    term: 'SNMP Trap',
    definition: 'An asynchronous notification sent spontaneously by an SNMP agent (network device) to the management server to signal an important event such as an interface failure or a threshold breach.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'snmpv3',
    term: 'SNMPv3',
    definition: 'The secure version of the SNMP protocol adding authentication (MD5, SHA) and encryption (DES, AES) of communications. It introduces the USM (User-based Security Model) replacing community strings.',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'sous-reseau',
    term: 'Subnet',
    definition: 'A logical division of an IP network into smaller segments by borrowing bits from the host portion to create the subnet portion. Subnetting optimizes address usage and improves security through segmentation.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'spanning-tree',
    term: 'Spanning Tree Protocol (STP)',
    definition: 'A Layer 2 protocol (IEEE 802.1D) that eliminates loops in redundant switch topologies by blocking certain ports. It elects a root bridge and calculates the shortest path to it.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'ssh',
    term: 'SSH (Secure Shell)',
    definition: 'A secure remote connection protocol (TCP port 22) replacing Telnet. It provides data encryption, strong authentication, and integrity, used for administering network devices.',
    category: 'Security',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'ssl-tls',
    term: 'SSL / TLS',
    definition: 'Cryptographic protocols ensuring the security of Internet communications. TLS (successor to SSL) provides encryption, server authentication, and data integrity. Used by HTTPS, FTPS, and other services.',
    category: 'Security',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'stp-portfast',
    term: 'STP PortFast',
    definition: 'A Cisco feature that allows a switch port to immediately transition to the forwarding state without going through the usual STP stages. Should only be configured on access ports connected to end hosts.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'syslog',
    term: 'Syslog',
    definition: 'A standard logging protocol that allows network devices to send log messages to a centralized server (UDP port 514). Messages are classified by facility and severity level (0 to 7).',
    category: 'Services',
    relatedChapter: 'supervision-snmp'
  },
  {
    id: 'table-arp',
    term: 'ARP Table',
    definition: 'A local cache storing mappings between IP addresses and MAC addresses learned by the ARP protocol. Entries have a limited lifetime and are automatically refreshed. Viewable with the show arp or arp -a command.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'table-routage',
    term: 'Routing Table',
    definition: 'A data structure in a router containing paths to destination networks. Each entry specifies the network, mask, next hop, and metric. The most specific route (longest prefix match) is preferred.',
    category: 'Routing',
    relatedChapter: 'routage-statique'
  },
  {
    id: 'tcp',
    term: 'TCP (Transmission Control Protocol)',
    definition: 'A connection-oriented transport protocol (Layer 4) guaranteeing reliable and ordered data delivery. It uses the three-way handshake (SYN, SYN-ACK, ACK) to establish connections and sequence numbers for control.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'tcp-handshake',
    term: 'TCP Three-Way Handshake',
    definition: 'A three-step process to establish a TCP connection: the client sends a SYN, the server responds with SYN-ACK, then the client confirms with ACK. This mechanism synchronizes sequence numbers between both parties.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'telnet',
    term: 'Telnet',
    definition: 'A remote access protocol (TCP port 23) that transmits data in clear text, including credentials. It is considered insecure and has been replaced by SSH for network device administration.',
    category: 'Commands',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'terraform',
    term: 'Terraform',
    definition: 'An Infrastructure as Code (IaC) tool for defining and deploying network and cloud resources declaratively. HCL configuration files describe the desired state of the infrastructure.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'three-tier-architecture',
    term: 'Three-Tier Architecture',
    definition: 'A hierarchical three-layer network architecture: access (host connectivity), distribution (policy and aggregation), and core (high-speed backbone). This Cisco model facilitates scalability and troubleshooting.',
    category: 'Switching',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'traceroute',
    term: 'Traceroute',
    definition: 'A diagnostic tool that displays the path taken by packets to a destination by sending packets with incrementally increasing TTL values. Each traversed router returns an ICMP Time Exceeded message.',
    category: 'Commands',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'trame',
    term: 'Frame',
    definition: 'A Layer 2 (Data Link) data unit of the OSI model. An Ethernet frame contains source and destination MAC addresses, the EtherType field, the payload, and the FCS (error check).',
    category: 'OSI',
    relatedChapter: 'modele-osi'
  },
  {
    id: 'trunk',
    term: 'Trunk',
    definition: 'A network link carrying traffic from multiple VLANs between switches or between a switch and a router. The 802.1Q protocol adds a tag to each frame to identify its VLAN membership.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'ttl',
    term: 'TTL (Time To Live)',
    definition: 'A field in the IP header that is decremented by 1 at each router traversed. When it reaches 0, the packet is discarded and an ICMP Time Exceeded message is sent back. It prevents infinite routing loops.',
    category: 'IP',
    relatedChapter: 'ping-icmp-arp'
  },
  {
    id: 'udp',
    term: 'UDP (User Datagram Protocol)',
    definition: 'A connectionless transport protocol (Layer 4) offering fast delivery without guarantees of delivery or ordering. It is used for streaming, VoIP, DNS, and DHCP where speed takes priority over reliability.',
    category: 'Transport',
    relatedChapter: 'tcp-udp'
  },
  {
    id: 'vlan',
    term: 'VLAN (Virtual Local Area Network)',
    definition: 'A virtual local area network that logically segments a physical switch into multiple independent broadcast domains. VLANs improve security, performance, and network management.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'vlan-natif',
    term: 'Native VLAN',
    definition: 'The VLAN whose traffic travels untagged (without 802.1Q tag) on a trunk link. By default, it is VLAN 1 on Cisco devices. It is recommended to change it for security reasons.',
    category: 'Switching',
    relatedChapter: 'vlan-trunk-stp'
  },
  {
    id: 'vlsm',
    term: 'VLSM (Variable Length Subnet Masking)',
    definition: 'A subnetting technique that allows using subnet masks of different lengths within the same network. It optimizes IP address usage by adapting subnet sizes to actual requirements.',
    category: 'IP',
    relatedChapter: 'classes-subnetting'
  },
  {
    id: 'vpc-cloud',
    term: 'VPC (Virtual Private Cloud)',
    definition: 'An isolated virtual network in a public cloud environment (AWS, Azure, GCP) allowing resource deployment with full control over IP addressing, subnets, routing tables, and security rules.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'vpn',
    term: 'VPN (Virtual Private Network)',
    definition: 'An encrypted tunnel created over a public network (Internet) to securely interconnect private networks. The main types are site-to-site VPN (IPsec) and remote access VPN (SSL/TLS).',
    category: 'Security',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'vpn-ssl',
    term: 'SSL VPN',
    definition: 'A type of VPN that uses the TLS/SSL protocol to create a secure tunnel, typically via a web browser (clientless) or a lightweight client. It is simpler to deploy than IPsec for remote user access.',
    category: 'Security',
    relatedChapter: 'vpn-tunneling'
  },
  {
    id: 'vrf',
    term: 'VRF (Virtual Routing and Forwarding)',
    definition: 'A virtualization technology that allows a router to maintain multiple independent routing tables simultaneously. Each VRF isolates traffic as if they were separate physical routers.',
    category: 'Routing',
    relatedChapter: 'securite-avancee'
  },
  {
    id: 'vrrp',
    term: 'VRRP (Virtual Router Redundancy Protocol)',
    definition: 'A standard protocol (RFC 5798) for gateway redundancy similar to HSRP. It allows multiple routers to share a virtual IP address, ensuring routing continuity in case of master router failure.',
    category: 'Routing',
    relatedChapter: 'haute-disponibilite'
  },
  {
    id: 'vxlan',
    term: 'VXLAN (Virtual Extensible LAN)',
    definition: 'A Layer 2 over Layer 3 overlay encapsulation protocol using UDP (port 4789). It extends VLANs beyond physical network boundaries with a 24-bit VNI identifier (16 million segments), essential for data centers.',
    category: 'Cloud',
    relatedChapter: 'cloud-networking'
  },
  {
    id: 'wep',
    term: 'WEP (Wired Equivalent Privacy)',
    definition: 'A legacy WiFi security protocol using RC4 encryption with 64 or 128-bit keys. It is considered completely obsolete and vulnerable due to major cryptographic weaknesses.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wifi-canal',
    term: 'WiFi Channel',
    definition: 'A specific frequency on which an access point transmits and receives. In the 2.4 GHz band, channels 1, 6, and 11 are the only non-overlapping ones. In the 5 GHz band, more non-overlapping channels are available.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wifi-standard',
    term: 'WiFi Standards (802.11)',
    definition: 'A family of IEEE standards for wireless networks. The main standards are 802.11n (WiFi 4, 600 Mbps), 802.11ac (WiFi 5, 6.9 Gbps), and 802.11ax (WiFi 6, 9.6 Gbps). Each generation improves throughput and efficiency.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wildcard-mask',
    term: 'Wildcard Mask',
    definition: 'An inverse mask used in Cisco ACLs and OSPF configuration. Bits set to 0 indicate an exact match, and bits set to 1 indicate "don\'t check." It is the logical inverse of the subnet mask.',
    category: 'Security',
    relatedChapter: 'acl-access-control'
  },
  {
    id: 'wireshark',
    term: 'Wireshark',
    definition: 'An open-source network protocol analyzer for capturing and inspecting traffic in real time. It decodes headers at each layer and supports display and capture filters to isolate relevant traffic.',
    category: 'Commands',
    relatedChapter: 'depannage-reseau'
  },
  {
    id: 'wlan-controller',
    term: 'WLAN Controller (WLC)',
    definition: 'A device that centralizes management of multiple lightweight WiFi access points (Lightweight AP). It manages channel assignment, transmit power, roaming, and security policies centrally.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wpa2',
    term: 'WPA2 (Wi-Fi Protected Access 2)',
    definition: 'A WiFi security protocol based on the IEEE 802.11i standard using AES-CCMP encryption. WPA2-Personal uses a pre-shared key (PSK), while WPA2-Enterprise uses a RADIUS server for authentication.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'wpa3',
    term: 'WPA3',
    definition: 'The latest generation of WiFi security strengthening protection with the SAE (Simultaneous Authentication of Equals) protocol replacing PSK. It offers individual session encryption and better resistance to dictionary attacks.',
    category: 'WiFi',
    relatedChapter: 'securite-wifi'
  },
  {
    id: 'yang',
    term: 'YANG',
    definition: 'A data modeling language used to describe the configuration and operational state of network devices. It is used with NETCONF and RESTCONF to define data structures in a standardized manner.',
    category: 'Commands',
    relatedChapter: 'sdn-programmabilite'
  },
  {
    id: 'zabbix',
    term: 'Zabbix',
    definition: 'An open-source network monitoring platform supporting SNMP, ICMP, and dedicated agents. It enables metric collection, problem detection, alert sending, and visualization via dashboards.',
    category: 'Services',
    relatedChapter: 'monitoring-observabilite'
  },
  {
    id: 'zone-dmz',
    term: 'DMZ (Demilitarized Zone)',
    definition: 'An isolated subnet placed between the internal network and the Internet, hosting servers accessible from the outside (web, mail, public DNS). The firewall filters traffic between the three zones to limit exposure.',
    category: 'Security',
    relatedChapter: 'acl-access-control'
  }
]
