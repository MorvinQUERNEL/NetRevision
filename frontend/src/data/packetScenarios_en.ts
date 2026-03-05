import { PacketScenario } from './packetScenarios'

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
  /*  1. HTTP Request                                                    */
  /* ================================================================== */
  {
    id: 'http-request',
    title: 'HTTP Request',
    description:
      'A web browser sends an HTTP GET request to a web server to load a page. The packet traverses all layers of the OSI model.',
    sourceDevice: 'Web Browser (Client PC)',
    destinationDevice: 'Apache Web Server',
    protocol: 'HTTP',
    encapsulationSteps: [
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Data',
        headerName: 'HTTP Header',
        headerFields: [
          { name: 'Method', value: 'GET', color: LAYER_COLORS.application },
          { name: 'URL', value: '/index.html', color: LAYER_COLORS.application },
          { name: 'Host', value: 'www.example.com', color: LAYER_COLORS.application },
          { name: 'User-Agent', value: 'Mozilla/5.0', color: LAYER_COLORS.application },
          { name: 'Accept', value: 'text/html', color: LAYER_COLORS.application },
        ],
        explanation:
          'The browser creates an HTTP GET request. This layer generates the application data that will be transmitted to the remote server. The HTTP protocol defines the method, target URL, and request headers.',
        icon: 'Globe',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Data',
        headerName: 'Encoding / Formatting',
        headerFields: [
          { name: 'Encoding', value: 'UTF-8', color: LAYER_COLORS.presentation },
          { name: 'Compression', value: 'gzip', color: LAYER_COLORS.presentation },
          { name: 'Format', value: 'text/html', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'The Presentation layer ensures data is in a format understandable by the recipient. It handles character encoding (UTF-8), optional compression (gzip), and MIME format.',
        icon: 'FileText',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Data',
        headerName: 'Session Management',
        headerFields: [
          { name: 'Session ID', value: 'SID-48A3F2', color: LAYER_COLORS.session },
          { name: 'State', value: 'Establishment', color: LAYER_COLORS.session },
          { name: 'Mode', value: 'Half-duplex', color: LAYER_COLORS.session },
        ],
        explanation:
          'The Session layer manages opening, maintaining, and closing the communication session between the client and server. It controls dialog and synchronization of exchanges.',
        icon: 'Link',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'TCP Header',
        headerFields: [
          { name: 'Source Port', value: '49152', color: LAYER_COLORS.transport },
          { name: 'Destination Port', value: '80', color: LAYER_COLORS.transport },
          { name: 'Sequence Number', value: '1001', color: LAYER_COLORS.transport },
          { name: 'ACK Number', value: '0', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Window Size', value: '65535', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xA3F2', color: LAYER_COLORS.transport },
        ],
        explanation:
          'TCP encapsulates the data into a segment. The source port is random (ephemeral), the destination port is 80 (HTTP). The SYN flag indicates the start of the three-way handshake. The window size controls the flow.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 3,
        layerName: 'Network',
        pduName: 'Packet',
        headerName: 'IP Header',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'Source IP', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'Destination IP', value: '93.184.216.34', color: LAYER_COLORS.network },
          { name: 'TTL', value: '128', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'Total Length', value: '512 bytes', color: LAYER_COLORS.network },
          { name: 'Identification', value: '0x1A2B', color: LAYER_COLORS.network },
        ],
        explanation:
          'The Network layer adds the IP header with source and destination logical addresses. The TTL (Time To Live) field prevents routing loops. The Protocol field indicates the upper segment is TCP (value 6).',
        icon: 'Network',
      },
      {
        layer: 2,
        layerName: 'Data Link',
        pduName: 'Frame',
        headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: 'DD:EE:FF:44:55:66', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xC4D5E6F7', color: LAYER_COLORS.dataLink },
          { name: 'Preamble', value: '7 bytes + SFD', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'The Data Link layer encapsulates the IP packet into an Ethernet frame. MAC addresses identify physical interfaces on the local network. The FCS (Frame Check Sequence) detects transmission errors. EtherType 0x0800 indicates IPv4.',
        icon: 'Cable',
      },
      {
        layer: 1,
        layerName: 'Physical',
        pduName: 'Bits',
        headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'Manchester', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat6 Cable', color: LAYER_COLORS.physical },
          { name: 'Speed', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connector', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'The Physical layer converts the frame into electrical signals transmitted over the Ethernet cable. Manchester encoding ensures clock synchronization. The Cat6 cable supports 1 Gbps throughput with an RJ-45 connector.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1,
        layerName: 'Physical',
        pduName: 'Bits',
        headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'Manchester', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat6 Cable', color: LAYER_COLORS.physical },
          { name: 'Speed', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connector', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation:
          'The server receives electrical signals on its network interface. The NIC demodulates the signal and reconstructs the binary stream (bits) from electrical pulses received on the cable.',
        icon: 'Cpu',
      },
      {
        layer: 2,
        layerName: 'Data Link',
        pduName: 'Frame',
        headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: 'DD:EE:FF:44:55:66', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xC4D5E6F7 (valid)', color: LAYER_COLORS.dataLink },
        ],
        explanation:
          'The Data Link layer verifies the destination MAC address (it matches its own). The FCS is recalculated and compared to verify frame integrity. The Ethernet header is removed and the IP packet is extracted.',
        icon: 'Cable',
      },
      {
        layer: 3,
        layerName: 'Network',
        pduName: 'Packet',
        headerName: 'IP Header',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'Source IP', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'Destination IP', value: '93.184.216.34', color: LAYER_COLORS.network },
          { name: 'TTL', value: '128', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '6 (TCP)', color: LAYER_COLORS.network },
        ],
        explanation:
          'The Network layer verifies that the destination IP address matches the server. The Protocol field (6) indicates that data must be passed to TCP. The IP header is removed and the TCP segment is extracted.',
        icon: 'Network',
      },
      {
        layer: 4,
        layerName: 'Transport',
        pduName: 'Segment',
        headerName: 'TCP Header',
        headerFields: [
          { name: 'Source Port', value: '49152', color: LAYER_COLORS.transport },
          { name: 'Destination Port', value: '80', color: LAYER_COLORS.transport },
          { name: 'Sequence Number', value: '1001', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xA3F2 (valid)', color: LAYER_COLORS.transport },
        ],
        explanation:
          'TCP verifies the checksum to validate segment integrity. Destination port 80 identifies the HTTP service. The sequence number is recorded for connection tracking. The TCP header is removed.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 5,
        layerName: 'Session',
        pduName: 'Data',
        headerName: 'Session Management',
        headerFields: [
          { name: 'Session ID', value: 'SID-48A3F2', color: LAYER_COLORS.session },
          { name: 'State', value: 'Active', color: LAYER_COLORS.session },
        ],
        explanation:
          'The Session layer identifies the communication session and ensures that data is correctly associated with the right ongoing session between the client and server.',
        icon: 'Link',
      },
      {
        layer: 6,
        layerName: 'Presentation',
        pduName: 'Data',
        headerName: 'Decoding / Formatting',
        headerFields: [
          { name: 'Decoding', value: 'UTF-8', color: LAYER_COLORS.presentation },
          { name: 'Decompression', value: 'gzip -> text', color: LAYER_COLORS.presentation },
        ],
        explanation:
          'The Presentation layer decodes the data (UTF-8), decompresses it if necessary (gzip), and converts it into a format usable by the Application layer.',
        icon: 'FileText',
      },
      {
        layer: 7,
        layerName: 'Application',
        pduName: 'Data',
        headerName: 'HTTP Request Received',
        headerFields: [
          { name: 'Method', value: 'GET', color: LAYER_COLORS.application },
          { name: 'URL', value: '/index.html', color: LAYER_COLORS.application },
          { name: 'Host', value: 'www.example.com', color: LAYER_COLORS.application },
        ],
        explanation:
          'The Apache web server receives the complete HTTP GET request. It processes the request, locates the /index.html file, and prepares the HTTP response that will follow the reverse encapsulation process.',
        icon: 'Globe',
      },
    ],
  },

  /* ================================================================== */
  /*  2. ICMP Ping                                                       */
  /* ================================================================== */
  {
    id: 'icmp-ping',
    title: 'ICMP Ping',
    description:
      'A PC sends an ICMP Echo Request to another PC to test network connectivity. ICMP does not use the Transport layer.',
    sourceDevice: 'Administrator PC',
    destinationDevice: 'Target PC (192.168.1.50)',
    protocol: 'ICMP',
    encapsulationSteps: [
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'Ping Command',
        headerFields: [
          { name: 'Command', value: 'ping 192.168.1.50', color: LAYER_COLORS.application },
          { name: 'Count', value: '4 requests', color: LAYER_COLORS.application },
          { name: 'Size', value: '32 bytes', color: LAYER_COLORS.application },
        ],
        explanation: 'The user launches the ping command from the terminal. The application generates an ICMP Echo Request with a 32-byte payload. Ping is a diagnostic tool at the Application layer.',
        icon: 'Terminal',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'ICMP Formatting',
        headerFields: [{ name: 'Format', value: 'Raw binary', color: LAYER_COLORS.presentation }],
        explanation: 'For ICMP, the Presentation layer is transparent. The data is already in binary format and requires no specific encoding or compression.',
        icon: 'FileText',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'ICMP Session',
        headerFields: [{ name: 'Type', value: 'Sessionless', color: LAYER_COLORS.session }],
        explanation: 'ICMP is a connectionless protocol: it does not require session establishment. Each Echo request is independent.',
        icon: 'Link',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP + ICMP Header',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'Source IP', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'Destination IP', value: '192.168.1.50', color: LAYER_COLORS.network },
          { name: 'TTL', value: '64', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '1 (ICMP)', color: LAYER_COLORS.network },
          { name: 'ICMP Type', value: '8 (Echo Request)', color: LAYER_COLORS.network },
          { name: 'ICMP Code', value: '0', color: LAYER_COLORS.network },
          { name: 'Identifier', value: '0x0001', color: LAYER_COLORS.network },
          { name: 'Sequence', value: '1', color: LAYER_COLORS.network },
        ],
        explanation: 'ICMP is encapsulated directly in IP without going through the Transport layer (no TCP or UDP). The IP Protocol field is 1 for ICMP. Type 8 indicates an Echo Request and the sequence number matches request to response.',
        icon: 'Network',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: '11:22:33:AA:BB:CC', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xD1E2F3A4', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The Ethernet frame encapsulates the IP packet. The destination MAC address was resolved by ARP before sending the ping. On the same local network, it is the direct MAC address of the target.',
        icon: 'Cable',
      },
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: '4B/5B + NRZI', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat5e Cable', color: LAYER_COLORS.physical },
          { name: 'Speed', value: '100 Mbps', color: LAYER_COLORS.physical },
          { name: 'Connector', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation: 'The frame bits are converted to electrical signals on the Cat5e cable. 4B/5B encoding ensures enough transitions for synchronization at 100 Mbps (Fast Ethernet).',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: '4B/5B + NRZI', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat5e Cable', color: LAYER_COLORS.physical },
        ],
        explanation: 'The target PC receives the electrical signals and converts them back to bits. The NIC synchronizes its clock with the frame preamble to read the data correctly.',
        icon: 'Cpu',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: '11:22:33:AA:BB:CC', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xD1E2F3A4 (valid)', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The Data Link layer verifies that the destination MAC matches its own address. The FCS is valid, the frame is accepted. The Ethernet header is removed to extract the IP packet.',
        icon: 'Cable',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP + ICMP Header',
        headerFields: [
          { name: 'Destination IP', value: '192.168.1.50 (me)', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '1 (ICMP)', color: LAYER_COLORS.network },
          { name: 'ICMP Type', value: '8 (Echo Request)', color: LAYER_COLORS.network },
          { name: 'Sequence', value: '1', color: LAYER_COLORS.network },
        ],
        explanation: 'The destination IP matches this PC. Protocol field 1 indicates ICMP. Type 8 is an Echo Request: the PC must respond with an Echo Reply (type 0). The sequence number is noted for the response.',
        icon: 'Network',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'ICMP Session',
        headerFields: [{ name: 'Type', value: 'Direct response', color: LAYER_COLORS.session }],
        explanation: 'No session management for ICMP. The operating system directly prepares the Echo Reply response.',
        icon: 'Link',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'Decoding',
        headerFields: [{ name: 'Format', value: 'Raw binary', color: LAYER_COLORS.presentation }],
        explanation: 'ICMP data is in raw binary format and does not require transformation by the Presentation layer.',
        icon: 'FileText',
      },
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'Ping Result',
        headerFields: [
          { name: 'Result', value: 'Echo Request received', color: LAYER_COLORS.application },
          { name: 'Action', value: 'Prepare Echo Reply', color: LAYER_COLORS.application },
          { name: 'Latency', value: '< 1 ms (LAN)', color: LAYER_COLORS.application },
        ],
        explanation: 'The target PC has successfully received the ping. The system automatically prepares an ICMP Echo Reply (type 0, code 0) that will be encapsulated and sent back to the sender to confirm connectivity.',
        icon: 'Terminal',
      },
    ],
  },

  /* ================================================================== */
  /*  3. DNS Query                                                       */
  /* ================================================================== */
  {
    id: 'dns-query',
    title: 'DNS Query',
    description:
      'A PC sends a DNS query to resolve the domain name "www.example.com" to an IP address. DNS uses UDP for standard queries.',
    sourceDevice: 'Client PC',
    destinationDevice: 'DNS Server (8.8.8.8)',
    protocol: 'DNS',
    encapsulationSteps: [
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'DNS Header',
        headerFields: [
          { name: 'Transaction ID', value: '0x1A2B', color: LAYER_COLORS.application },
          { name: 'Type', value: 'Query (QR=0)', color: LAYER_COLORS.application },
          { name: 'Queried Name', value: 'www.example.com', color: LAYER_COLORS.application },
          { name: 'Record Type', value: 'A (IPv4)', color: LAYER_COLORS.application },
          { name: 'Class', value: 'IN (Internet)', color: LAYER_COLORS.application },
          { name: 'Recursion', value: 'Desired (RD=1)', color: LAYER_COLORS.application },
        ],
        explanation: 'The DNS client creates a query to resolve "www.example.com" to an IPv4 address. Type A requests an address record. The RD (Recursion Desired) flag asks the server to perform recursive resolution.',
        icon: 'Search',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'DNS Encoding',
        headerFields: [
          { name: 'Format', value: 'DNS Binary (RFC 1035)', color: LAYER_COLORS.presentation },
          { name: 'Name Encoding', value: 'Labels (3www7example3com0)', color: LAYER_COLORS.presentation },
        ],
        explanation: 'The domain name is encoded in DNS format: each label is preceded by its length in bytes. "www.example.com" becomes "3www7example3com0" in binary notation.',
        icon: 'FileText',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'DNS Session',
        headerFields: [
          { name: 'Type', value: 'Single transaction', color: LAYER_COLORS.session },
          { name: 'Transaction ID', value: '0x1A2B', color: LAYER_COLORS.session },
        ],
        explanation: 'DNS uses a transaction identifier to associate each query with its response. This mechanism replaces formal session establishment.',
        icon: 'Link',
      },
      {
        layer: 4, layerName: 'Transport', pduName: 'Segment', headerName: 'UDP Header',
        headerFields: [
          { name: 'Source Port', value: '51234', color: LAYER_COLORS.transport },
          { name: 'Destination Port', value: '53', color: LAYER_COLORS.transport },
          { name: 'Length', value: '45 bytes', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xB7C8', color: LAYER_COLORS.transport },
        ],
        explanation: 'DNS uses UDP (port 53) for standard queries because speed is prioritized over reliability. UDP does not establish a connection: no three-way handshake, no automatic retransmission. The datagram is lighter than TCP.',
        icon: 'Zap',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP Header',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'Source IP', value: '192.168.1.10', color: LAYER_COLORS.network },
          { name: 'Destination IP', value: '8.8.8.8', color: LAYER_COLORS.network },
          { name: 'TTL', value: '64', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '17 (UDP)', color: LAYER_COLORS.network },
          { name: 'DSCP', value: '0 (Best Effort)', color: LAYER_COLORS.network },
        ],
        explanation: 'The IP header targets Google\'s public DNS server (8.8.8.8). The Protocol field is 17, indicating UDP. A TTL of 64 is typical for a Linux system. Since the server is outside the local network, the packet will be routed via the default gateway.',
        icon: 'Network',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'AA:BB:CC:11:22:33', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: 'FF:EE:DD:99:88:77', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xE5F6A7B8', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The destination MAC is that of the default gateway (router), not the remote DNS server. The PC uses ARP to resolve the router\'s MAC address. The router will relay the packet to the Internet.',
        icon: 'Cable',
      },
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat5e Cable', color: LAYER_COLORS.physical },
          { name: 'Speed', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connector', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation: 'The bits are converted to electrical signals with PAM-5 encoding (5-level Pulse Amplitude Modulation), used for Gigabit Ethernet over copper Cat5e cable.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Optical (fiber)', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: '64B/66B', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Single-mode fiber optic', color: LAYER_COLORS.physical },
        ],
        explanation: 'Google\'s DNS server receives optical signals via single-mode fiber. Photodetectors convert light pulses into electrical signals then into bits.',
        icon: 'Cpu',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Destination MAC', value: 'Server local address', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: 'Valid', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'After multiple router hops, the final frame has a destination MAC matching the DNS server. The FCS is verified, the frame is accepted, and the Ethernet header is removed.',
        icon: 'Cable',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP Header',
        headerFields: [
          { name: 'Destination IP', value: '8.8.8.8 (me)', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '17 (UDP)', color: LAYER_COLORS.network },
          { name: 'Remaining TTL', value: '52', color: LAYER_COLORS.network },
        ],
        explanation: 'The destination IP address matches the server. The TTL decreased at each router traversed (64 -> 52 = 12 hops). Protocol field 17 indicates content must be passed to UDP.',
        icon: 'Network',
      },
      {
        layer: 4, layerName: 'Transport', pduName: 'Segment', headerName: 'UDP Header',
        headerFields: [
          { name: 'Destination Port', value: '53 (DNS)', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xB7C8 (valid)', color: LAYER_COLORS.transport },
        ],
        explanation: 'Destination port 53 identifies the DNS service. The checksum is verified. UDP passes the data directly to the server\'s DNS process without delivery guarantee.',
        icon: 'Zap',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'DNS Transaction',
        headerFields: [{ name: 'Transaction ID', value: '0x1A2B', color: LAYER_COLORS.session }],
        explanation: 'The transaction identifier allows the DNS server to trace the query and associate its response with the correct requesting client.',
        icon: 'Link',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'DNS Decoding',
        headerFields: [{ name: 'Name Decoding', value: '3www7example3com0 -> www.example.com', color: LAYER_COLORS.presentation }],
        explanation: 'The server decodes the domain name from DNS binary format to its textual representation to perform the lookup in its database.',
        icon: 'FileText',
      },
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'DNS Query Received',
        headerFields: [
          { name: 'Queried Name', value: 'www.example.com', color: LAYER_COLORS.application },
          { name: 'Type', value: 'A (IPv4)', color: LAYER_COLORS.application },
          { name: 'Answer', value: '93.184.216.34', color: LAYER_COLORS.application },
          { name: 'Response TTL', value: '3600 s', color: LAYER_COLORS.application },
        ],
        explanation: 'The DNS server finds the A record for "www.example.com" and prepares the response with IP address 93.184.216.34. The TTL of 3600 seconds indicates how long the client can cache this response.',
        icon: 'Search',
      },
    ],
  },

  /* ================================================================== */
  /*  4. FTP Transfer                                                    */
  /* ================================================================== */
  {
    id: 'ftp-transfer',
    title: 'FTP Transfer',
    description:
      'A PC connects to an FTP server to download a file. FTP uses TCP to ensure file transfer integrity.',
    sourceDevice: 'Client PC (FileZilla)',
    destinationDevice: 'FTP Server',
    protocol: 'FTP',
    encapsulationSteps: [
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'FTP Command',
        headerFields: [
          { name: 'Command', value: 'RETR report.pdf', color: LAYER_COLORS.application },
          { name: 'Mode', value: 'Passive (PASV)', color: LAYER_COLORS.application },
          { name: 'Type', value: 'Binary (TYPE I)', color: LAYER_COLORS.application },
          { name: 'User', value: 'admin', color: LAYER_COLORS.application },
          { name: 'Channel', value: 'Command (port 21)', color: LAYER_COLORS.application },
        ],
        explanation: 'The FTP client sends the RETR command to download "report.pdf". FTP uses two channels: the command channel (port 21) for instructions and a data channel (port negotiated in PASV mode) for the actual file transfer.',
        icon: 'Download',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'FTP Encoding',
        headerFields: [
          { name: 'Command Encoding', value: 'ASCII (NVT)', color: LAYER_COLORS.presentation },
          { name: 'Data Encoding', value: 'Binary (TYPE I)', color: LAYER_COLORS.presentation },
        ],
        explanation: 'FTP commands are in ASCII (Network Virtual Terminal). Binary transfer mode (TYPE I) preserves the exact bytes of the file without modification, essential for PDF files.',
        icon: 'FileText',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'FTP Session',
        headerFields: [
          { name: 'Session', value: 'Authenticated', color: LAYER_COLORS.session },
          { name: 'Command Channel', value: 'Active', color: LAYER_COLORS.session },
          { name: 'Data Channel', value: 'Opening', color: LAYER_COLORS.session },
        ],
        explanation: 'FTP maintains an authenticated session with two simultaneous TCP connections. The Session layer manages coordination between the command channel and the data channel for the transfer.',
        icon: 'Link',
      },
      {
        layer: 4, layerName: 'Transport', pduName: 'Segment', headerName: 'TCP Header',
        headerFields: [
          { name: 'Source Port', value: '52100', color: LAYER_COLORS.transport },
          { name: 'Destination Port', value: '21', color: LAYER_COLORS.transport },
          { name: 'Sequence Number', value: '3001', color: LAYER_COLORS.transport },
          { name: 'ACK Number', value: '2501', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'PSH, ACK', color: LAYER_COLORS.transport },
          { name: 'Window Size', value: '131072', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xC9D0', color: LAYER_COLORS.transport },
        ],
        explanation: 'TCP guarantees reliable delivery of every file byte. The PSH (Push) flag indicates data should be immediately passed to the application. The 128 KB sliding window optimizes transfer throughput.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP Header',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'Source IP', value: '10.0.0.5', color: LAYER_COLORS.network },
          { name: 'Destination IP', value: '203.0.113.10', color: LAYER_COLORS.network },
          { name: 'TTL', value: '128', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'DF', value: 'Don\'t Fragment (1)', color: LAYER_COLORS.network },
          { name: 'Total Length', value: '1500 bytes', color: LAYER_COLORS.network },
        ],
        explanation: 'The IP header routes the packet to the remote FTP server. The DF (Don\'t Fragment) flag is set: if the packet is too large for a link, an ICMP "Fragmentation Needed" message will be returned. Standard MTU of 1500 bytes is used.',
        icon: 'Network',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'CC:DD:EE:33:44:55', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: '00:1A:2B:3C:4D:5E', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'VLAN Tag', value: '802.1Q VLAN 10', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xF1A2B3C4', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The frame includes an 802.1Q tag for VLAN 10. The destination MAC is that of the router/gateway to reach the FTP server on a remote network. The FCS ensures frame integrity on the local link.',
        icon: 'Cable',
      },
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat6a Cable', color: LAYER_COLORS.physical },
          { name: 'Speed', value: '10 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connector', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation: 'The transfer uses a Cat6a cable capable of supporting 10 Gbps. PAM-5 encoding on all 4 twisted pairs achieves this throughput. The entire frame is transmitted in microseconds.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat6a Cable', color: LAYER_COLORS.physical },
        ],
        explanation: 'The FTP server receives electrical signals on its 10 Gbps network interface. The preamble enables synchronization and the SFD (Start Frame Delimiter) signals the frame start.',
        icon: 'Cpu',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Destination MAC', value: 'Server local address', color: LAYER_COLORS.dataLink },
          { name: 'VLAN', value: 'Tag removed by switch', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: 'Valid', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The VLAN tag was removed by the egress switch. The destination MAC matches the FTP server\'s interface. The FCS is verified successfully and the Ethernet header is removed.',
        icon: 'Cable',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP Header',
        headerFields: [
          { name: 'Destination IP', value: '203.0.113.10 (me)', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'Remaining TTL', value: '120', color: LAYER_COLORS.network },
        ],
        explanation: 'The destination IP address matches the FTP server. Protocol field 6 directs data to TCP. The packet traversed 8 routers (TTL went from 128 to 120).',
        icon: 'Network',
      },
      {
        layer: 4, layerName: 'Transport', pduName: 'Segment', headerName: 'TCP Header',
        headerFields: [
          { name: 'Destination Port', value: '21 (FTP)', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'PSH, ACK', color: LAYER_COLORS.transport },
          { name: 'Sequence', value: '3001', color: LAYER_COLORS.transport },
          { name: 'Checksum', value: '0xC9D0 (valid)', color: LAYER_COLORS.transport },
        ],
        explanation: 'TCP verifies the checksum and sequence number to guarantee correct order. The PSH flag indicates data must be immediately passed to the FTP service. An ACK will be sent in return.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'FTP Session',
        headerFields: [
          { name: 'Session', value: 'Authenticated (admin)', color: LAYER_COLORS.session },
          { name: 'Channel', value: 'Command', color: LAYER_COLORS.session },
        ],
        explanation: 'The FTP session is identified as belonging to user "admin". The command is routed to the correct channel (command on port 21).',
        icon: 'Link',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'FTP Decoding',
        headerFields: [{ name: 'Decoding', value: 'ASCII -> FTP command', color: LAYER_COLORS.presentation }],
        explanation: 'The FTP command is decoded from NVT ASCII format into readable text by the FTP server for interpretation.',
        icon: 'FileText',
      },
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'FTP Command Received',
        headerFields: [
          { name: 'Command', value: 'RETR report.pdf', color: LAYER_COLORS.application },
          { name: 'Response', value: '150 Opening data channel', color: LAYER_COLORS.application },
          { name: 'File', value: 'report.pdf (2.4 MB)', color: LAYER_COLORS.application },
        ],
        explanation: 'The FTP server receives the RETR command and responds with code 150 (opening data channel). The file "report.pdf" of 2.4 MB will be transmitted via the data channel negotiated in PASV mode.',
        icon: 'Download',
      },
    ],
  },

  /* ================================================================== */
  /*  5. SSH Connection                                                  */
  /* ================================================================== */
  {
    id: 'ssh-connection',
    title: 'SSH Connection',
    description:
      'An administrator connects to a remote server via SSH for secure administration. SSH encrypts the entire communication.',
    sourceDevice: 'Admin PC (Terminal)',
    destinationDevice: 'Linux Server (10.0.1.1)',
    protocol: 'SSH',
    encapsulationSteps: [
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'SSH Protocol',
        headerFields: [
          { name: 'Version', value: 'SSH-2.0', color: LAYER_COLORS.application },
          { name: 'Command', value: 'ssh admin@10.0.1.1', color: LAYER_COLORS.application },
          { name: 'Auth Method', value: 'Public key RSA-4096', color: LAYER_COLORS.application },
          { name: 'Shell', value: '/bin/bash', color: LAYER_COLORS.application },
          { name: 'Terminal', value: 'xterm-256color', color: LAYER_COLORS.application },
        ],
        explanation: 'The administrator initiates an SSH v2 connection with RSA-4096 public key authentication. SSH provides secure remote shell access. The protocol negotiates encryption and hashing algorithms.',
        icon: 'Terminal',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'SSH Encryption',
        headerFields: [
          { name: 'Encryption', value: 'AES-256-GCM', color: LAYER_COLORS.presentation },
          { name: 'Key Exchange', value: 'Diffie-Hellman (curve25519)', color: LAYER_COLORS.presentation },
          { name: 'MAC', value: 'HMAC-SHA2-256', color: LAYER_COLORS.presentation },
          { name: 'Compression', value: 'zlib@openssh.com', color: LAYER_COLORS.presentation },
        ],
        explanation: 'SSH encrypts data with AES-256-GCM, a very robust symmetric algorithm. Key exchange uses Diffie-Hellman on elliptic curve (curve25519). HMAC ensures the integrity of each packet.',
        icon: 'Lock',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'SSH Session',
        headerFields: [
          { name: 'Session ID', value: 'SHA256:Kx7j...9bR2', color: LAYER_COLORS.session },
          { name: 'Channels', value: 'session (0)', color: LAYER_COLORS.session },
          { name: 'Keep-alive', value: '60 seconds', color: LAYER_COLORS.session },
        ],
        explanation: 'SSH establishes an encrypted session identified by a unique hash. Multiplexed channels manage multiple streams (shell, tunnels, SFTP transfers) over a single TCP connection.',
        icon: 'Link',
      },
      {
        layer: 4, layerName: 'Transport', pduName: 'Segment', headerName: 'TCP Header',
        headerFields: [
          { name: 'Source Port', value: '54321', color: LAYER_COLORS.transport },
          { name: 'Destination Port', value: '22', color: LAYER_COLORS.transport },
          { name: 'Sequence Number', value: '5001', color: LAYER_COLORS.transport },
          { name: 'ACK Number', value: '0', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Window Size', value: '65535', color: LAYER_COLORS.transport },
          { name: 'Options', value: 'MSS=1460, SACK, Timestamps', color: LAYER_COLORS.transport },
        ],
        explanation: 'SSH uses TCP (port 22) to guarantee reliable and ordered delivery of every byte. SYN initiates the three-way handshake. TCP options include MSS (Maximum Segment Size), SACK (Selective ACK), and timestamps for RTT calculation.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP Header',
        headerFields: [
          { name: 'Version', value: 'IPv4', color: LAYER_COLORS.network },
          { name: 'Source IP', value: '10.0.0.100', color: LAYER_COLORS.network },
          { name: 'Destination IP', value: '10.0.1.1', color: LAYER_COLORS.network },
          { name: 'TTL', value: '64', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'DSCP', value: 'CS6 (48) - Network Control', color: LAYER_COLORS.network },
          { name: 'ECN', value: 'ECT(0)', color: LAYER_COLORS.network },
        ],
        explanation: 'The IP header routes the packet between two subnets (10.0.0.0/24 to 10.0.1.0/24). DSCP CS6 marks SSH traffic as priority (network administration). ECN (Explicit Congestion Notification) is enabled to avoid packet loss.',
        icon: 'Network',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Source MAC', value: 'EE:FF:00:AA:BB:CC', color: LAYER_COLORS.dataLink },
          { name: 'Destination MAC', value: '00:11:22:33:44:55', color: LAYER_COLORS.dataLink },
          { name: 'EtherType', value: '0x0800 (IPv4)', color: LAYER_COLORS.dataLink },
          { name: 'VLAN Tag', value: '802.1Q VLAN 100 (Admin)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xA1B2C3D4', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The frame is tagged VLAN 100 (administration network). The destination MAC is that of the inter-VLAN router connecting the two subnets. VLAN separation isolates administration traffic from user traffic.',
        icon: 'Cable',
      },
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat6 Cable', color: LAYER_COLORS.physical },
          { name: 'Speed', value: '1 Gbps', color: LAYER_COLORS.physical },
          { name: 'Connector', value: 'RJ-45', color: LAYER_COLORS.physical },
        ],
        explanation: 'The encrypted bits are transmitted as electrical signals on the Cat6 cable. SSH encryption is transparent to the physical layer: it transmits bits without distinguishing plaintext from encrypted data.',
        icon: 'Cpu',
      },
    ],
    decapsulationSteps: [
      {
        layer: 1, layerName: 'Physical', pduName: 'Bits', headerName: 'Physical Signal',
        headerFields: [
          { name: 'Signal Type', value: 'Electrical', color: LAYER_COLORS.physical },
          { name: 'Encoding', value: 'PAM-5', color: LAYER_COLORS.physical },
          { name: 'Medium', value: 'Ethernet Cat6 Cable', color: LAYER_COLORS.physical },
        ],
        explanation: 'The Linux server receives electrical signals on its network interface. The NIC demodulates PAM-5 signals into a stream of digital bits for the upper layer.',
        icon: 'Cpu',
      },
      {
        layer: 2, layerName: 'Data Link', pduName: 'Frame', headerName: 'Ethernet Header',
        headerFields: [
          { name: 'Destination MAC', value: 'Server local address', color: LAYER_COLORS.dataLink },
          { name: 'VLAN', value: 'VLAN 100 (Admin)', color: LAYER_COLORS.dataLink },
          { name: 'FCS', value: '0xA1B2C3D4 (valid)', color: LAYER_COLORS.dataLink },
        ],
        explanation: 'The Data Link layer verifies the destination MAC and FCS. The VLAN 100 tag confirms traffic comes from the authorized administration network. The Ethernet header is removed.',
        icon: 'Cable',
      },
      {
        layer: 3, layerName: 'Network', pduName: 'Packet', headerName: 'IP Header',
        headerFields: [
          { name: 'Destination IP', value: '10.0.1.1 (me)', color: LAYER_COLORS.network },
          { name: 'Protocol', value: '6 (TCP)', color: LAYER_COLORS.network },
          { name: 'Remaining TTL', value: '63', color: LAYER_COLORS.network },
          { name: 'DSCP', value: 'CS6 (priority)', color: LAYER_COLORS.network },
        ],
        explanation: 'The destination IP matches the server. The packet traversed 1 router (TTL 64 -> 63). DSCP CS6 indicates this traffic is priority. Protocol field 6 redirects to TCP.',
        icon: 'Network',
      },
      {
        layer: 4, layerName: 'Transport', pduName: 'Segment', headerName: 'TCP Header',
        headerFields: [
          { name: 'Destination Port', value: '22 (SSH)', color: LAYER_COLORS.transport },
          { name: 'Flags', value: 'SYN', color: LAYER_COLORS.transport },
          { name: 'Sequence', value: '5001', color: LAYER_COLORS.transport },
          { name: 'Options', value: 'MSS=1460, SACK, Timestamps', color: LAYER_COLORS.transport },
        ],
        explanation: 'Port 22 identifies the SSH service (sshd). The SYN flag indicates a connection request: the server must respond with SYN-ACK to continue the three-way handshake. TCP options are recorded for the connection.',
        icon: 'ArrowLeftRight',
      },
      {
        layer: 5, layerName: 'Session', pduName: 'Data', headerName: 'SSH Session',
        headerFields: [
          { name: 'State', value: 'Negotiation in progress', color: LAYER_COLORS.session },
          { name: 'Phase', value: 'SSH version exchange', color: LAYER_COLORS.session },
        ],
        explanation: 'The SSH daemon (sshd) begins session negotiation. The first step is the SSH protocol version exchange, followed by cryptographic algorithm negotiation.',
        icon: 'Link',
      },
      {
        layer: 6, layerName: 'Presentation', pduName: 'Data', headerName: 'Crypto Negotiation',
        headerFields: [
          { name: 'Proposed Encryption', value: 'AES-256-GCM', color: LAYER_COLORS.presentation },
          { name: 'Key Exchange', value: 'curve25519-sha256', color: LAYER_COLORS.presentation },
          { name: 'Host Key', value: 'ssh-ed25519', color: LAYER_COLORS.presentation },
        ],
        explanation: 'The server examines the algorithms proposed by the client and selects the most secure ones supported by both parties. AES-256-GCM encryption and the curve25519 elliptic curve are chosen.',
        icon: 'Lock',
      },
      {
        layer: 7, layerName: 'Application', pduName: 'Data', headerName: 'SSH Service Ready',
        headerFields: [
          { name: 'Service', value: 'sshd (OpenSSH 9.6)', color: LAYER_COLORS.application },
          { name: 'Auth Required', value: 'publickey (RSA-4096)', color: LAYER_COLORS.application },
          { name: 'Banner', value: 'Welcome to the server', color: LAYER_COLORS.application },
          { name: 'Shell Ready', value: '/bin/bash', color: LAYER_COLORS.application },
        ],
        explanation: 'The SSH daemon (OpenSSH 9.6) is ready to authenticate the administrator. After RSA-4096 public key verification, an interactive /bin/bash shell session will be opened. All commands will be encrypted end-to-end.',
        icon: 'Terminal',
      },
    ],
  },
]
