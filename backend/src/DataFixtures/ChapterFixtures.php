<?php

namespace App\DataFixtures;

use App\Entity\Chapter;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ChapterFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $chapters = [
            // Programme 1 - Fondamentaux
            ['slug' => 'modele-osi', 'title' => 'Le Modèle OSI', 'description' => 'Comprendre les 7 couches de communication réseau', 'orderIndex' => 1, 'program' => 'fondamentaux'],
            ['slug' => 'modele-tcp-ip', 'title' => 'Le Modèle TCP/IP', 'description' => 'Architecture TCP/IP et comparaison avec OSI', 'orderIndex' => 2, 'program' => 'fondamentaux'],
            ['slug' => 'adressage-ipv4', 'title' => 'Adressage IPv4', 'description' => 'Classes, masques et sous-réseaux', 'orderIndex' => 3, 'program' => 'fondamentaux'],
            ['slug' => 'subnetting', 'title' => 'Subnetting', 'description' => 'Découpage en sous-réseaux et CIDR', 'orderIndex' => 4, 'program' => 'fondamentaux'],
            ['slug' => 'ethernet-switching', 'title' => 'Ethernet & Switching', 'description' => 'Trames Ethernet et commutation', 'orderIndex' => 5, 'program' => 'fondamentaux'],
            ['slug' => 'vlan-trunk', 'title' => 'VLAN & Trunk', 'description' => 'Segmentation réseau et liens trunk', 'orderIndex' => 6, 'program' => 'fondamentaux'],
            ['slug' => 'routage-statique', 'title' => 'Routage Statique', 'description' => 'Configuration des routes statiques', 'orderIndex' => 7, 'program' => 'fondamentaux'],
            ['slug' => 'dns-dhcp', 'title' => 'DNS & DHCP', 'description' => 'Services de résolution de noms et attribution IP', 'orderIndex' => 8, 'program' => 'fondamentaux'],
            // Programme 2 - Avancé
            ['slug' => 'tcp-udp', 'title' => 'TCP & UDP en détail', 'description' => 'Protocoles de transport approfondis', 'orderIndex' => 9, 'program' => 'avance'],
            ['slug' => 'routage-dynamique', 'title' => 'Routage Dynamique', 'description' => 'OSPF, RIP et protocoles de routage', 'orderIndex' => 10, 'program' => 'avance'],
            ['slug' => 'acl', 'title' => 'Listes de Contrôle d\'Accès', 'description' => 'ACL standard et étendues', 'orderIndex' => 11, 'program' => 'avance'],
            ['slug' => 'nat-pat', 'title' => 'NAT & PAT', 'description' => 'Traduction d\'adresses réseau', 'orderIndex' => 12, 'program' => 'avance'],
            ['slug' => 'securite-reseau', 'title' => 'Sécurité Réseau', 'description' => 'Pare-feu, IDS/IPS et bonnes pratiques', 'orderIndex' => 13, 'program' => 'avance'],
            ['slug' => 'wifi', 'title' => 'WiFi & Sans-fil', 'description' => 'Standards 802.11 et sécurité WiFi', 'orderIndex' => 14, 'program' => 'avance'],
            ['slug' => 'vpn-ipsec', 'title' => 'VPN & IPsec', 'description' => 'Tunnels VPN et protocoles de chiffrement', 'orderIndex' => 15, 'program' => 'avance'],
            ['slug' => 'depannage', 'title' => 'Dépannage Réseau', 'description' => 'Méthodologie et outils de diagnostic', 'orderIndex' => 16, 'program' => 'avance'],
            // Programme 3 - Entreprise
            ['slug' => 'automatisation-python', 'title' => 'Automatisation Python', 'description' => 'Scripts Python pour automatiser la gestion réseau avec Netmiko, Paramiko et NAPALM', 'orderIndex' => 17, 'program' => 'entreprise'],
            ['slug' => 'ansible-reseau', 'title' => 'Ansible pour Réseaux', 'description' => 'Automatisation et gestion de configuration réseau avec Ansible', 'orderIndex' => 18, 'program' => 'entreprise'],
            ['slug' => 'cloud-networking', 'title' => 'Cloud Networking', 'description' => 'Architecture réseau cloud : VPC, sous-réseaux, passerelles et interconnexions', 'orderIndex' => 19, 'program' => 'entreprise'],
            ['slug' => 'kubernetes-networking', 'title' => 'Kubernetes & Réseaux', 'description' => 'Modèle réseau Kubernetes : pods, services, CNI et service mesh', 'orderIndex' => 20, 'program' => 'entreprise'],
            ['slug' => 'sdn-programmabilite', 'title' => 'SDN & Programmabilité', 'description' => 'Software Defined Networking, OpenFlow, NETCONF/RESTCONF et APIs réseau', 'orderIndex' => 21, 'program' => 'entreprise'],
            ['slug' => 'haute-disponibilite', 'title' => 'Haute Disponibilité', 'description' => 'HSRP, VRRP, GLBP, load balancing et architectures redondantes', 'orderIndex' => 22, 'program' => 'entreprise'],
            ['slug' => 'securite-avancee', 'title' => 'Sécurité Avancée', 'description' => 'NGFW, IDS/IPS, Zero Trust, micro-segmentation et durcissement', 'orderIndex' => 23, 'program' => 'entreprise'],
            ['slug' => 'monitoring-observabilite', 'title' => 'Monitoring & Observabilité', 'description' => 'SNMPv3, Prometheus, Grafana, ELK Stack et supervision réseau', 'orderIndex' => 24, 'program' => 'entreprise'],
        ];

        foreach ($chapters as $data) {
            $chapter = new Chapter();
            $chapter->setSlug($data['slug']);
            $chapter->setTitle($data['title']);
            $chapter->setDescription($data['description']);
            $chapter->setOrderIndex($data['orderIndex']);
            $chapter->setProgram($data['program']);
            $manager->persist($chapter);
        }

        $manager->flush();
    }
}
