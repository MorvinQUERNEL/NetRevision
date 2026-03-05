// ─── CTF Challenges — Network Capture The Flag (English) ─────────────────────

import type { CTFChallenge, CTFArtifact, CTFHint } from './ctfChallenges'

export const ctfChallenges: CTFChallenge[] = [
  // ─── DIFFICULTY 1 (50 pts) ─────────────────────────────────────────────────

  {
    id: 'acl-oubliee',
    title: 'Forgotten ACL',
    description: 'Find the network not protected by an ACL in the router configuration.',
    category: 'network-config',
    difficulty: 1,
    points: 50,
    scenario: `You are a network administrator at a small business. After a security audit, you are informed that one of the internal networks is not protected by an Access Control List (ACL). Your mission: analyze the main router configuration and identify the vulnerable network.

The router manages four subnets:
- 192.168.10.0/24 — Accounting
- 192.168.20.0/24 — Development
- 192.168.30.0/24 — Management
- 192.168.40.0/24 — Guests

Examine the configuration and find the network without ACL protection.`,
    artifacts: [
      {
        name: 'router-config.txt',
        type: 'config',
        content: `Router#show running-config
!
hostname RTR-PRINCIPAL
!
interface GigabitEthernet0/0
 description LAN-Comptabilite
 ip address 192.168.10.1 255.255.255.0
 ip access-group ACL-COMPTA in
 no shutdown
!
interface GigabitEthernet0/1
 description LAN-Developpement
 ip address 192.168.20.1 255.255.255.0
 ip access-group ACL-DEV in
 no shutdown
!
interface GigabitEthernet0/2
 description LAN-Direction
 ip address 192.168.30.1 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/3
 description LAN-Invites
 ip address 192.168.40.1 255.255.255.0
 ip access-group ACL-GUEST in
 no shutdown
!
ip access-list extended ACL-COMPTA
 permit tcp 192.168.10.0 0.0.0.255 any eq 80
 permit tcp 192.168.10.0 0.0.0.255 any eq 443
 permit udp 192.168.10.0 0.0.0.255 any eq 53
 deny ip any any log
!
ip access-list extended ACL-DEV
 permit ip 192.168.20.0 0.0.0.255 any
 deny ip any any log
!
ip access-list extended ACL-GUEST
 permit tcp 192.168.40.0 0.0.0.255 any eq 80
 permit tcp 192.168.40.0 0.0.0.255 any eq 443
 deny ip any any log
!
end`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Compare the interfaces — which one is missing an "ip access-group" line?' },
      { id: 2, cost: 20, text: 'Look more closely at interface GigabitEthernet0/2.' },
      { id: 3, cost: 30, text: 'The 192.168.30.0/24 network (Management) has no ACL applied.' },
    ],
    flag: 'NR{192.168.30.0}',
    flagHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  },

  {
    id: 'port-mystere',
    title: 'Mystery Port',
    description: 'Identify the suspicious open port on the server from the netstat output.',
    category: 'protocol-analysis',
    difficulty: 1,
    points: 50,
    scenario: `A web server in your company seems to be behaving abnormally. Logs show unusual network consumption at night. You run a netstat command to list active connections.

Among the open ports, only one is clearly suspicious and should not be present on a standard web server. Identify that port.`,
    artifacts: [
      {
        name: 'netstat-output.txt',
        type: 'log',
        content: `$ netstat -tlnp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1024/sshd
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2048/nginx
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      2048/nginx
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      3072/mysqld
tcp        0      0 0.0.0.0:4444            0.0.0.0:*               LISTEN      6666/nc
tcp        0      0 127.0.0.1:9000          0.0.0.0:*               LISTEN      4096/php-fpm`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Which services are normal on a web server? SSH, HTTP, HTTPS, MySQL, PHP-FPM...' },
      { id: 2, cost: 20, text: 'The program "nc" (netcat) is often used to create backdoors.' },
      { id: 3, cost: 30, text: 'Port 4444 is opened by netcat — it is a classic reverse shell port.' },
    ],
    flag: 'NR{4444}',
    flagHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
  },

  {
    id: 'vlan-perdu',
    title: 'Lost VLAN',
    description: 'Find the misconfigured VLAN in the switch configuration.',
    category: 'network-config',
    difficulty: 1,
    points: 50,
    scenario: `Users in the Marketing department are complaining about no longer having network access. The previous technician modified the switch configuration last night. You need to find the error in the VLAN configuration.

The planned VLANs are:
- VLAN 10 — Administration (Fa0/1-5)
- VLAN 20 — Marketing (Fa0/6-10)
- VLAN 30 — Technical (Fa0/11-15)

Examine the configuration and find the incorrectly assigned VLAN number.`,
    artifacts: [
      {
        name: 'switch-config.txt',
        type: 'config',
        content: `Switch#show running-config
!
hostname SW-ETAGE1
!
vlan 10
 name Administration
vlan 20
 name Marketing
vlan 30
 name Technique
!
interface range FastEthernet0/1-5
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
!
interface range FastEthernet0/6-10
 switchport mode access
 switchport access vlan 99
 spanning-tree portfast
!
interface range FastEthernet0/11-15
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
!
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
!
end`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Ports Fa0/6-10 should be in the Marketing VLAN...' },
      { id: 2, cost: 20, text: 'The Marketing ports are assigned to VLAN 99 instead of VLAN 20.' },
      { id: 3, cost: 30, text: 'VLAN 99 does not exist in the configuration — the Marketing VLAN is 20.' },
    ],
    flag: 'NR{vlan99}',
    flagHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
  },

  {
    id: 'ping-impossible',
    title: 'Impossible Ping',
    description: 'Analyze the routing table to understand why the ping fails.',
    category: 'forensics',
    difficulty: 1,
    points: 50,
    scenario: `An administrator reports that they cannot reach server 10.0.50.10 from their workstation (192.168.1.100). Connectivity to other networks works correctly. You need to analyze the router's routing table to find the cause of the problem.

Find the destination network that is causing the issue.`,
    artifacts: [
      {
        name: 'routing-table.txt',
        type: 'log',
        content: `Router#show ip route
Codes: C - connected, S - static, R - RIP, O - OSPF

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
S    10.0.10.0/24 [1/0] via 172.16.0.2
S    10.0.20.0/24 [1/0] via 172.16.0.2
S    10.0.30.0/24 [1/0] via 172.16.0.2
S    10.0.40.0/24 [1/0] via 172.16.0.2
S    10.0.50.0/24 [1/0] via 172.16.0.254
C    172.16.0.0/24 is directly connected, GigabitEthernet0/1
S*   0.0.0.0/0 [1/0] via 203.0.113.1`,
      },
      {
        name: 'ping-result.txt',
        type: 'log',
        content: `Router#ping 10.0.50.10

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.50.10, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)

Router#ping 10.0.10.10

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.10.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Compare the next-hop of the 10.0.50.0/24 route with the other routes.' },
      { id: 2, cost: 20, text: 'Routes 10.0.10-40 point to 172.16.0.2, but 10.0.50.0 points to 172.16.0.254.' },
      { id: 3, cost: 30, text: 'The next-hop 172.16.0.254 is probably incorrect — no router exists at that address.' },
    ],
    flag: 'NR{172.16.0.254}',
    flagHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
  },

  // ─── DIFFICULTY 2 (100 pts) ────────────────────────────────────────────────

  {
    id: 'mot-de-passe-en-clair',
    title: 'Plaintext Password',
    description: 'Find the unencrypted password in the router configuration.',
    category: 'security',
    difficulty: 2,
    points: 100,
    scenario: `During a security audit, you discover that a production router contains a password stored in plaintext. This is a major security flaw: anyone who accesses the configuration can read this password directly.

Analyze the configuration and find the unencrypted password.`,
    artifacts: [
      {
        name: 'router-security-config.txt',
        type: 'config',
        content: `Router#show running-config
!
hostname RTR-PROD-01
!
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
!
username admin privilege 15 secret 5 $1$Aw2x$B4q3c5GhTwkCvLwZ6N8R41
username backup privilege 7 password 0 Sup3rS3cur3!2026
username monitor privilege 1 secret 5 $1$kP3q$R7YmNW4eLs2vX8JdFhG5K1
!
line con 0
 password 7 0822455D0A16
 login local
!
line vty 0 4
 password 7 045802150C2E
 login local
 transport input ssh
!
service password-encryption
!
ip ssh version 2
!
banner motd ^C
*** AUTHORIZED ACCESS ONLY ***
*** All activities are monitored and logged ***
^C
!
end`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for lines with "password 0" — the 0 means plaintext.' },
      { id: 2, cost: 20, text: 'The "backup" account uses "password 0" instead of "secret 5" (hashed).' },
      { id: 3, cost: 30, text: 'The plaintext password is "Sup3rS3cur3!2026" for the backup user.' },
    ],
    flag: 'NR{Sup3rS3cur3!2026}',
    flagHash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  },

  {
    id: 'route-piratee',
    title: 'Hijacked Route',
    description: 'Detect the fraudulent route injection in the OSPF table.',
    category: 'forensics',
    difficulty: 2,
    points: 100,
    scenario: `Your SOC team has detected suspicious traffic to an unauthorized external IP address. You suspect a route injection in the OSPF protocol. An attacker may have injected a fraudulent route to divert traffic.

Analyze the OSPF database and routing table to find the route injected by the attacker. The company network exclusively uses the 10.0.0.0/8 and 172.16.0.0/12 ranges.`,
    artifacts: [
      {
        name: 'ospf-database.txt',
        type: 'log',
        content: `Router#show ip ospf database

            OSPF Router with ID (10.0.0.1) (Process ID 1)

                Router Link States (Area 0)

Link ID         ADV Router      Age   Seq#       Checksum Link count
10.0.0.1        10.0.0.1        342   0x80000015 0x00A1B2 4
10.0.0.2        10.0.0.2        512   0x80000012 0x00C3D4 3
10.0.0.3        10.0.0.3        128   0x80000008 0x00E5F6 3

                Type-5 AS External Link States

Link ID         ADV Router      Age   Seq#       Checksum Tag
0.0.0.0         10.0.0.1        342   0x80000003 0x00F1E2 0
185.192.69.0    10.0.0.3        45    0x80000001 0x003C4D 666
172.16.100.0    10.0.0.2        512   0x80000007 0x00A2B3 0`,
      },
      {
        name: 'routing-table.txt',
        type: 'log',
        content: `Router#show ip route ospf
Codes: O - OSPF, OE1 - OSPF external type 1, OE2 - OSPF external type 2

O     10.0.1.0/24 [110/2] via 10.0.0.2, 00:08:32, Gi0/1
O     10.0.2.0/24 [110/2] via 10.0.0.3, 00:02:08, Gi0/2
O     172.16.100.0/24 [110/20] via 10.0.0.2, 00:08:32, Gi0/1
OE2   185.192.69.0/24 [110/20] via 10.0.0.3, 00:00:45, Gi0/2
O*E2  0.0.0.0/0 [110/1] via 10.0.0.1, 00:05:42, Gi0/0`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for an external route (Type-5) with a network outside the internal ranges.' },
      { id: 2, cost: 20, text: 'The 185.192.69.0/24 route is advertised by 10.0.0.3 with a suspicious tag (666).' },
      { id: 3, cost: 30, text: 'The 185.192.69.0 network does not belong to the company — it is an OSPF injection.' },
    ],
    flag: 'NR{185.192.69.0}',
    flagHash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
  },

  {
    id: 'trame-suspecte',
    title: 'Suspicious Frame',
    description: 'Find the anomaly in the Ethernet frame captures.',
    category: 'protocol-analysis',
    difficulty: 2,
    points: 100,
    scenario: `The intrusion detection system has flagged abnormal Ethernet frames on the main network segment. You need to analyze the captures to identify the suspicious frame.

Examine the source and destination MAC addresses, frame types, and sizes to find the anomaly.`,
    artifacts: [
      {
        name: 'frame-capture.txt',
        type: 'capture',
        content: `Frame Capture - Port Gi0/1 (SPAN)
====================================

Frame #1  14:23:05.001
  Src MAC: 00:1A:2B:3C:4D:5E  Dst MAC: 00:1A:2B:3C:4D:6F
  Type: 0x0800 (IPv4)  Length: 64 bytes
  Info: 192.168.1.10 -> 192.168.1.1 (ICMP Echo)

Frame #2  14:23:05.015
  Src MAC: 00:1A:2B:3C:4D:6F  Dst MAC: 00:1A:2B:3C:4D:5E
  Type: 0x0800 (IPv4)  Length: 64 bytes
  Info: 192.168.1.1 -> 192.168.1.10 (ICMP Reply)

Frame #3  14:23:05.102
  Src MAC: 00:1A:2B:3C:4D:5E  Dst MAC: FF:FF:FF:FF:FF:FF
  Type: 0x0806 (ARP)  Length: 42 bytes
  Info: Who has 192.168.1.1? Tell 192.168.1.10

Frame #4  14:23:05.203
  Src MAC: 00:1A:2B:3C:4D:5E  Dst MAC: 00:1A:2B:3C:4D:6F
  Type: 0x0800 (IPv4)  Length: 1518 bytes
  Info: 192.168.1.10 -> 192.168.1.1 (TCP 443)

Frame #5  14:23:05.305
  Src MAC: AA:BB:CC:DD:EE:FF  Dst MAC: FF:FF:FF:FF:FF:FF
  Type: 0x0806 (ARP)  Length: 42 bytes
  Info: Who has 192.168.1.1? Tell 192.168.1.10
  ** Src MAC does not match ARP sender **

Frame #6  14:23:05.410
  Src MAC: 00:1A:2B:3C:4D:6F  Dst MAC: 00:1A:2B:3C:4D:5E
  Type: 0x0800 (IPv4)  Length: 128 bytes
  Info: 192.168.1.1 -> 192.168.1.10 (TCP 443 ACK)`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Compare the source MAC addresses of each ARP frame with the associated IP address.' },
      { id: 2, cost: 20, text: 'Frame #5 has a source MAC (AA:BB:CC:DD:EE:FF) that does not match 192.168.1.10.' },
      { id: 3, cost: 30, text: 'The MAC AA:BB:CC:DD:EE:FF is suspicious — it is an ARP spoofing attempt (Frame #5).' },
    ],
    flag: 'NR{AA:BB:CC:DD:EE:FF}',
    flagHash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
  },

  {
    id: 'firewall-troue',
    title: 'Leaky Firewall',
    description: 'Identify the firewall rule that allows unwanted access.',
    category: 'security',
    difficulty: 2,
    points: 100,
    scenario: `The CISO asks you to verify the firewall rules after an external scan revealed an accessible service from the Internet that should not be. The firewall is supposed to block all incoming traffic except HTTP (80), HTTPS (443), and SSH (22) from a specific administration IP.

Find the number of the faulty rule.`,
    artifacts: [
      {
        name: 'firewall-rules.txt',
        type: 'config',
        content: `# Firewall Rules - FW-EDGE-01
# Format: ID | Action | Proto | Source | Dest | Port | Comment
#========================================================================
 1  | ACCEPT | TCP  | 203.0.113.50/32  | ANY      | 22   | SSH Admin
 2  | ACCEPT | TCP  | ANY              | ANY      | 80   | HTTP Public
 3  | ACCEPT | TCP  | ANY              | ANY      | 443  | HTTPS Public
 4  | ACCEPT | TCP  | 10.0.0.0/8       | ANY      | ANY  | Internal LAN
 5  | ACCEPT | TCP  | ANY              | ANY      | 3389 | RDP - TEMP maintenance
 6  | ACCEPT | UDP  | ANY              | ANY      | 53   | DNS Outbound
 7  | ACCEPT | TCP  | 10.0.0.0/8       | ANY      | 3306 | MySQL Internal
 8  | DROP   | ANY  | ANY              | ANY      | ANY  | Default Deny`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for a rule that allows a sensitive port from any source.' },
      { id: 2, cost: 20, text: 'Rule 5 allows RDP (port 3389) from ANY — accessible from the Internet.' },
      { id: 3, cost: 30, text: 'Rule number 5 is the faulty one: RDP open to the whole world, marked "TEMP".' },
    ],
    flag: 'NR{regle5_rdp3389}',
    flagHash: 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
  },

  // ─── DIFFICULTY 3 (200 pts) ────────────────────────────────────────────────

  {
    id: 'man-in-the-middle',
    title: 'Man in the Middle',
    description: 'Detect an ARP spoofing attack from the ARP table.',
    category: 'security',
    difficulty: 3,
    points: 200,
    scenario: `Users are reporting slowdowns and invalid SSL certificates when accessing internal sites. You suspect a Man-in-the-Middle attack via ARP spoofing. An attacker is impersonating the default gateway (10.0.1.1) by sending fake ARP replies.

Analyze the ARP tables from multiple workstations and the switch logs to identify the attacker's IP address.`,
    artifacts: [
      {
        name: 'arp-tables.txt',
        type: 'log',
        content: `=== Workstation PC-COMPTA (10.0.1.50) ===
$ arp -a
? (10.0.1.1) at 08:00:27:ab:cd:ef [ether] on eth0
? (10.0.1.100) at 00:1a:2b:3c:4d:5e [ether] on eth0
? (10.0.1.200) at 00:1a:2b:3c:4d:6f [ether] on eth0

=== Workstation PC-DEV (10.0.1.100) ===
$ arp -a
? (10.0.1.1) at 08:00:27:ab:cd:ef [ether] on eth0
? (10.0.1.50) at 00:1a:2b:3c:4d:7a [ether] on eth0
? (10.0.1.200) at 00:1a:2b:3c:4d:6f [ether] on eth0

=== Workstation PC-ADMIN (10.0.1.200) ===
$ arp -a
? (10.0.1.1) at 08:00:27:ab:cd:ef [ether] on eth0
? (10.0.1.50) at 00:1a:2b:3c:4d:7a [ether] on eth0
? (10.0.1.100) at 00:1a:2b:3c:4d:5e [ether] on eth0`,
      },
      {
        name: 'switch-mac-table.txt',
        type: 'log',
        content: `Switch#show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
 1      00:1a:2b:3c:4d:5e  DYNAMIC   Fa0/3
 1      00:1a:2b:3c:4d:6f  DYNAMIC   Fa0/5
 1      00:1a:2b:3c:4d:7a  DYNAMIC   Fa0/1
 1      08:00:27:ab:cd:ef  DYNAMIC   Fa0/10
 1      aa:bb:cc:11:22:33  DYNAMIC   Fa0/24

Switch#show interfaces Fa0/24
FastEthernet0/24 is up, line protocol is up
  Description: -- non configure --
  Hardware is Fast Ethernet, address is cc:dd:ee:ff:00:11

Switch#show ip interface brief
Interface       IP-Address   OK? Method Status Protocol
Vlan1           10.0.1.254   YES manual up     up

=== Real MAC of the gateway (10.0.1.1 = Router Gi0/0) ===
Router#show interfaces GigabitEthernet0/0
  Hardware is GigabitEthernet, address is aa:bb:cc:11:22:33
  Internet address is 10.0.1.1/24`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Compare the MAC associated with 10.0.1.1 in the ARP tables with the real MAC of the router.' },
      { id: 2, cost: 20, text: 'The workstations see 08:00:27:ab:cd:ef for 10.0.1.1, but the real router MAC is aa:bb:cc:11:22:33.' },
      { id: 3, cost: 30, text: 'The machine on Fa0/10 (MAC 08:00:27:ab:cd:ef) is spoofing the gateway identity.' },
    ],
    flag: 'NR{08:00:27:ab:cd:ef}',
    flagHash: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
  },

  {
    id: 'fuite-dns',
    title: 'DNS Leak',
    description: 'Detect a data exfiltration hidden in DNS queries.',
    category: 'forensics',
    difficulty: 3,
    points: 200,
    scenario: `The SIEM has generated an alert for an abnormal volume of DNS queries to an unknown domain. You suspect that malware is exfiltrating data by encoding information in the subdomains of DNS queries.

Analyze the DNS logs and find the domain used for exfiltration.`,
    artifacts: [
      {
        name: 'dns-query-log.txt',
        type: 'log',
        content: `# DNS Query Log - 2026-02-22 - Resolver 10.0.1.53
# Format: Timestamp | Client IP | Query Type | Query Name

14:00:01 | 10.0.1.50  | A     | www.google.com
14:00:02 | 10.0.1.100 | A     | mail.office365.com
14:00:03 | 10.0.1.50  | AAAA  | www.google.com
14:00:05 | 10.0.1.200 | A     | updates.microsoft.com
14:00:10 | 10.0.1.42  | TXT   | dXNlcm5hbWU6YWRtaW4.data.evil-c2.net
14:00:11 | 10.0.1.42  | TXT   | cGFzc3dvcmQ6UEBzc3cwcmQ.data.evil-c2.net
14:00:12 | 10.0.1.42  | TXT   | c2VydmVyOjEwLjAuMS4x.data.evil-c2.net
14:00:13 | 10.0.1.42  | TXT   | ZGF0YWJhc2U6cHJvZHVjdGlvbg.data.evil-c2.net
14:00:14 | 10.0.1.42  | TXT   | ZXhmaWx0cmF0aW9uX2RvbmU.data.evil-c2.net
14:00:15 | 10.0.1.100 | A     | slack.com
14:00:16 | 10.0.1.50  | A     | github.com
14:00:20 | 10.0.1.200 | A     | cdn.cloudflare.com
14:00:25 | 10.0.1.42  | A     | check.evil-c2.net
14:00:30 | 10.0.1.100 | MX    | gmail.com`,
      },
      {
        name: 'decoded-subdomains.txt',
        type: 'log',
        content: `# Base64 decoded subdomains from evil-c2.net queries:
# dXNlcm5hbWU6YWRtaW4       -> username:admin
# cGFzc3dvcmQ6UEBzc3cwcmQ   -> password:P@ssw0rd
# c2VydmVyOjEwLjAuMS4x       -> server:10.0.1.1
# ZGF0YWJhc2U6cHJvZHVjdGlvbg -> database:production
# ZXhmaWx0cmF0aW9uX2RvbmU   -> exfiltration_done`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for DNS queries with abnormally long or encoded subdomains.' },
      { id: 2, cost: 20, text: 'The TXT queries to *.data.evil-c2.net contain Base64 in the subdomains.' },
      { id: 3, cost: 30, text: 'The C2 domain is evil-c2.net — workstation 10.0.1.42 is exfiltrating credentials.' },
    ],
    flag: 'NR{evil-c2.net}',
    flagHash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
  },

  {
    id: 'bgp-hijack',
    title: 'BGP Hijack',
    description: 'Detect a BGP prefix hijack from routing information.',
    category: 'protocol-analysis',
    difficulty: 3,
    points: 200,
    scenario: `Your ISP alerts you: users in certain regions can no longer access your services hosted on prefix 198.51.100.0/24 (AS 65001). A malicious competitor could be illegitimately announcing your prefix.

Analyze the BGP information to identify the rogue AS that is hijacking your prefix.`,
    artifacts: [
      {
        name: 'bgp-looking-glass.txt',
        type: 'log',
        content: `=== BGP Looking Glass - Route Server EU ===

BGP routing table entry for 198.51.100.0/24
Paths: (3 available, best #1)

  Path #1 (BEST)
    AS Path: 64500 64510 65001
    Next Hop: 203.0.113.1
    Origin: IGP
    Community: 64500:100
    Last update: 2026-02-22 08:00:00 (stable since 365 days)

  Path #2
    AS Path: 64500 64520 65001
    Next Hop: 203.0.113.2
    Origin: IGP
    Community: 64500:200
    Last update: 2026-02-22 08:00:00 (stable since 340 days)

  Path #3 (SUSPICIOUS)
    AS Path: 64500 64530 65099
    Next Hop: 203.0.113.3
    Origin: IGP
    Community: 64530:999
    Last update: 2026-02-22 13:45:00 (since 15 minutes)

=== BGP routing table entry for 198.51.100.0/25 ===
Paths: (1 available, best #1)

  Path #1
    AS Path: 64500 64530 65099
    Next Hop: 203.0.113.3
    Origin: IGP
    Community: 64530:999
    Last update: 2026-02-22 13:45:00 (since 15 minutes)

=== Registered owner of 198.51.100.0/24 ===
ARIN WHOIS: NetRevision Corp, AS 65001`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for an AS that announces your prefix but is not AS 65001.' },
      { id: 2, cost: 20, text: 'AS 65099 announces 198.51.100.0/24 AND a more specific /25 to capture traffic.' },
      { id: 3, cost: 30, text: 'AS 65099 is the hijacker — it uses a more specific prefix (/25) to divert BGP traffic.' },
    ],
    flag: 'NR{AS65099}',
    flagHash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
  },

  {
    id: 'tunnel-cache',
    title: 'Hidden Tunnel',
    description: 'Find an unauthorized VPN tunnel in the interface configuration.',
    category: 'security',
    difficulty: 3,
    points: 200,
    scenario: `A disgruntled employee has configured an unauthorized VPN tunnel on a router to exfiltrate data to an external server. The network team has only approved two GRE tunnels to the company's remote sites (172.16.0.0/12).

Analyze the interface configuration to find the illegitimate tunnel and its destination address.`,
    artifacts: [
      {
        name: 'interface-config.txt',
        type: 'config',
        content: `Router#show running-config | section interface
!
interface GigabitEthernet0/0
 description WAN - Internet
 ip address 203.0.113.10 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/1
 description LAN - Interne
 ip address 10.0.1.1 255.255.255.0
 no shutdown
!
interface Tunnel0
 description VPN Site Lille
 ip address 172.16.255.1 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 198.51.100.1
 tunnel mode gre ip
 ip ospf 1 area 0
!
interface Tunnel1
 description VPN Site Lyon
 ip address 172.16.255.5 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 198.51.100.5
 tunnel mode gre ip
 ip ospf 1 area 0
!
interface Tunnel2
 description Monitoring backup link
 ip address 192.168.255.1 255.255.255.252
 tunnel source GigabitEthernet0/0
 tunnel destination 45.33.32.156
 tunnel mode gre ip
 keepalive 10 3
!`,
      },
      {
        name: 'approved-tunnels.txt',
        type: 'log',
        content: `=== Approved VPN Tunnels - Network Registry ===
Review date: 2026-01-15

Tunnel 0: Lille Site
  - Destination: 198.51.100.1
  - Purpose: Remote site interconnection Lille
  - Owner: Jean Dupont (Network)

Tunnel 1: Lyon Site
  - Destination: 198.51.100.5
  - Purpose: Remote site interconnection Lyon
  - Owner: Marie Martin (Network)

No other tunnels are authorized.`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Compare the configured tunnels with the list of approved tunnels.' },
      { id: 2, cost: 20, text: 'Tunnel2 does not appear in the approved tunnel registry.' },
      { id: 3, cost: 30, text: 'Tunnel2 points to 45.33.32.156 — an unauthorized external IP, disguised as "Monitoring backup link".' },
    ],
    flag: 'NR{45.33.32.156}',
    flagHash: 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
  },

  // ─── DIFFICULTY 4 (500 pts) ────────────────────────────────────────────────

  {
    id: 'ransomware-reseau',
    title: 'Network Ransomware',
    description: 'Trace the lateral movement of a ransomware through the firewall logs.',
    category: 'forensics',
    difficulty: 4,
    points: 500,
    scenario: `A ransomware hit your corporate network this morning. The incident response team has isolated the affected segments, but you need to reconstruct the infection chain to identify patient zero.

The network is segmented into 4 VLANs:
- 10.10.10.0/24 — User workstations
- 10.10.20.0/24 — Application servers
- 10.10.30.0/24 — Database servers
- 10.10.40.0/24 — DMZ

Analyze the internal firewall logs to identify the IP address of the first compromised workstation (patient zero).`,
    artifacts: [
      {
        name: 'firewall-logs.txt',
        type: 'log',
        content: `# Firewall Internal Logs - 2026-02-22
# Format: Timestamp | Action | Proto | Src IP:Port -> Dst IP:Port | Bytes | Rule

03:14:15 | ALLOW | TCP | 10.10.10.42:49152 -> 185.143.223.1:443   | 2048  | OUT-HTTPS
03:14:16 | ALLOW | TCP | 185.143.223.1:443  -> 10.10.10.42:49152  | 65536 | IN-ESTABLISHED
03:15:00 | ALLOW | TCP | 10.10.10.42:49200 -> 10.10.10.43:445     | 512   | INTERNAL-SMB
03:15:01 | ALLOW | TCP | 10.10.10.42:49201 -> 10.10.10.44:445     | 512   | INTERNAL-SMB
03:15:02 | ALLOW | TCP | 10.10.10.42:49202 -> 10.10.10.45:445     | 512   | INTERNAL-SMB
03:15:03 | ALLOW | TCP | 10.10.10.42:49203 -> 10.10.10.46:445     | 512   | INTERNAL-SMB
03:15:10 | ALLOW | TCP | 10.10.10.42:49210 -> 10.10.20.10:445     | 512   | CROSS-VLAN-SMB
03:15:11 | ALLOW | TCP | 10.10.10.42:49211 -> 10.10.20.11:445     | 512   | CROSS-VLAN-SMB
03:15:12 | ALLOW | TCP | 10.10.10.42:49212 -> 10.10.20.12:445     | 512   | CROSS-VLAN-SMB
03:16:00 | ALLOW | TCP | 10.10.10.43:50000 -> 10.10.10.47:445     | 512   | INTERNAL-SMB
03:16:01 | ALLOW | TCP | 10.10.10.43:50001 -> 10.10.10.48:445     | 512   | INTERNAL-SMB
03:16:05 | ALLOW | TCP | 10.10.10.44:50100 -> 10.10.20.13:445     | 512   | CROSS-VLAN-SMB
03:16:30 | ALLOW | TCP | 10.10.20.10:51000 -> 10.10.30.5:1433     | 2048  | DB-ACCESS
03:16:31 | ALLOW | TCP | 10.10.20.10:51001 -> 10.10.30.6:1433     | 2048  | DB-ACCESS
03:17:00 | ALLOW | TCP | 10.10.10.42:49300 -> 185.143.223.1:443   | 32768 | OUT-HTTPS
03:17:01 | ALLOW | TCP | 10.10.10.43:49301 -> 185.143.223.1:443   | 32768 | OUT-HTTPS
03:17:02 | ALLOW | TCP | 10.10.10.44:49302 -> 185.143.223.1:443   | 32768 | OUT-HTTPS`,
      },
      {
        name: 'ids-alerts.txt',
        type: 'log',
        content: `# IDS Alerts - 2026-02-22
# Suricata Fast Log

03:14:15 [**] ET MALWARE Known Ransomware C2 Communication [**]
  SRC: 10.10.10.42 -> DST: 185.143.223.1
  Classification: A Network Trojan was detected
  Priority: 1

03:15:00 [**] ET EXPLOIT MS17-010 EternalBlue SMB Exploit Attempt [**]
  SRC: 10.10.10.42 -> DST: 10.10.10.43
  Classification: Attempted Admin Privilege Gain
  Priority: 1

03:15:01 [**] ET EXPLOIT MS17-010 EternalBlue SMB Exploit Attempt [**]
  SRC: 10.10.10.42 -> DST: 10.10.10.44
  Classification: Attempted Admin Privilege Gain
  Priority: 1

03:16:00 [**] ET EXPLOIT MS17-010 EternalBlue SMB Exploit Attempt [**]
  SRC: 10.10.10.43 -> DST: 10.10.10.47
  Classification: Attempted Admin Privilege Gain
  Priority: 1

03:17:00 [**] ET MALWARE Ransomware Data Exfiltration [**]
  SRC: 10.10.10.42 -> DST: 185.143.223.1
  Classification: Data Exfiltration Detected
  Priority: 1`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for the first suspicious outbound connection in the logs.' },
      { id: 2, cost: 20, text: 'At 03:14:15, workstation 10.10.10.42 contacts the C2 — this is the first event.' },
      { id: 3, cost: 30, text: 'Patient zero is 10.10.10.42: first C2 contact, then SMB propagation to other workstations.' },
    ],
    flag: 'NR{10.10.10.42}',
    flagHash: 'a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
  },

  {
    id: 'zero-day-snmp',
    title: 'SNMP Zero Day',
    description: 'Find the exploitation of the SNMP community string in the logs.',
    category: 'security',
    difficulty: 4,
    points: 500,
    scenario: `The monitoring team has detected unauthorized modifications to a router's configuration. The only authorized SSH accesses are traced and none match the modifications. You suspect exploitation via SNMP.

The router should be using SNMPv3 with authentication, but an old SNMPv2 profile might still be active. Analyze the SNMP configuration and logs to find the exploited community string.`,
    artifacts: [
      {
        name: 'snmp-config.txt',
        type: 'config',
        content: `Router#show running-config | section snmp
!
snmp-server group ADMIN-GROUP v3 priv
snmp-server user admin-monitor ADMIN-GROUP v3 auth sha Str0ngP@ss priv aes 256 Pr1v@teKey
!
! Legacy config - to be removed (ticket #4521)
snmp-server community N3tR3v!SNMP_rw RW
snmp-server community public RO
!
snmp-server host 10.0.1.50 version 3 priv admin-monitor
snmp-server enable traps
!
snmp-server contact admin@netrevision.local
snmp-server location Datacenter-Paris-Rack42
!`,
      },
      {
        name: 'snmp-traffic-log.txt',
        type: 'log',
        content: `# SNMP Traffic Capture - 2026-02-22
# Format: Timestamp | Src IP | SNMP Version | Community/User | Operation | OID

02:00:01 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.1.1.0 (sysDescr)
02:05:00 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.2.2.1.10 (ifInOctets)
02:10:00 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.1.3.0 (sysUpTime)
...
04:32:10 | 10.0.1.200  | v2c    | public        | GET    | 1.3.6.1.2.1.1.1.0 (sysDescr)
04:32:15 | 10.0.1.200  | v2c    | public        | WALK   | 1.3.6.1.2.1.2.2 (interfaces)
04:33:00 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.4.1.9.2.1.55 (writeNet)
04:33:05 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.4.1.9.9.41.1 (syslogConfig)
04:33:10 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.4.1.9.2.1.54 (hostConfig)
04:34:00 | 10.0.1.200  | v2c    | N3tR3v!SNMP_rw | SET   | 1.3.6.1.2.1.1.5.0 (sysName)
04:34:30 | 10.0.1.50   | v3     | admin-monitor | GET    | 1.3.6.1.2.1.1.3.0 (sysUpTime)`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Look for SNMP SET operations — they modify the router configuration.' },
      { id: 2, cost: 20, text: 'Workstation 10.0.1.200 uses SNMPv2c with an RW community to perform SETs.' },
      { id: 3, cost: 30, text: 'The exploited community string is "N3tR3v!SNMP_rw" — a legacy v2c RW never removed.' },
    ],
    flag: 'NR{N3tR3v!SNMP_rw}',
    flagHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
  },

  {
    id: 'exfiltration-icmp',
    title: 'ICMP Exfiltration',
    description: 'Detect hidden data in ICMP payloads.',
    category: 'protocol-analysis',
    difficulty: 4,
    points: 500,
    scenario: `The firewall blocks all outbound traffic except ICMP (ping) and DNS. A SOC analyst noticed that pings from workstation 10.0.5.77 have unusual sizes. You suspect that malware is using the ICMP protocol to exfiltrate data by hiding it in packet payloads.

Analyze the network capture and decode the hidden message in the ICMP payloads to find the stolen password.`,
    artifacts: [
      {
        name: 'icmp-capture.txt',
        type: 'capture',
        content: `# ICMP Packet Capture - 2026-02-22
# Filtered: src 10.0.5.77, ICMP Echo Request only
# Format: Timestamp | Src -> Dst | Type | Size | Payload (hex + ASCII)

14:30:01 | 10.0.5.77 -> 8.8.8.8 | Echo Request | 64 bytes
  Payload: 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70  abcdefghijklmnop
  (Standard padding - normal ping)

14:30:02 | 10.0.5.77 -> 8.8.8.8 | Echo Request | 64 bytes
  Payload: 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70  abcdefghijklmnop
  (Standard padding - normal ping)

14:31:00 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 63 72 65 64 73 3a 72 6f 6f  SECRET:creds:roo
          74 3a 54 6f 70 53 33 63 72 33 74 50 40 73 73 21   t:TopS3cr3tP@ss!

14:31:01 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 64 62 5f 68 6f 73 74 3a 31  SECRET:db_host:1
          30 2e 30 2e 33 30 2e 35 3a 33 33 30 36 00 00 00   0.0.30.5:3306...

14:31:02 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 61 70 69 5f 6b 65 79 3a 41  SECRET:api_key:A
          4b 2d 78 39 38 37 36 35 34 33 32 31 00 00 00 00   K-x987654321....

14:31:30 | 10.0.5.77 -> 8.8.8.8 | Echo Request | 64 bytes
  Payload: 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70  abcdefghijklmnop
  (Standard padding - normal ping)

14:32:00 | 10.0.5.77 -> 1.2.3.4 | Echo Request | 128 bytes
  Payload: 53 45 43 52 45 54 3a 65 6e 64 3a 66 6c 61 67 3d  SECRET:end:flag=
          54 6f 70 53 33 63 72 33 74 50 40 73 73 21 00 00   TopS3cr3tP@ss!..`,
      },
      {
        name: 'normal-ping-baseline.txt',
        type: 'log',
        content: `# Baseline ICMP - Standard workstation
# Normal ping size: 64 bytes
# Normal payload: repeating pattern "abcdefghijklmnop"
# Normal destinations: DNS servers (8.8.8.8, 1.1.1.1), gateway

# Anomalies detected for 10.0.5.77:
# - Pings to 1.2.3.4 (unknown destination)
# - Payload size: 128 bytes (double the normal)
# - Non-standard payload content (ASCII readable data)
# - Pattern: "SECRET:" prefix in payload`,
      },
    ],
    hints: [
      { id: 1, cost: 10, text: 'Normal pings are 64 bytes with a standard payload. Look for different packets.' },
      { id: 2, cost: 20, text: 'The 128-byte pings to 1.2.3.4 contain readable ASCII data prefixed with "SECRET:".' },
      { id: 3, cost: 30, text: 'The payload contains "creds:root:TopS3cr3tP@ss!" — this is the password exfiltrated via ICMP.' },
    ],
    flag: 'NR{TopS3cr3tP@ss!}',
    flagHash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
  },
]
