import type { Chapter } from './chapters'

export const chapters6: Chapter[] = [
  {
    id: 43,
    slug: 'impact-automatisation',
    title: 'Impact de l\'automatisation',
    subtitle: 'Avantages, cas d\'usage et culture NetOps',
    icon: 'Zap',
    color: '#06b6d4',
    duration: '35 min',
    level: 'Debutant',
    videoId: 'DqSz38h_rk0',
    sections: [
      {
        title: 'Gestion manuelle vs automatisee',
        content: `Historiquement, les reseaux d'entreprise etaient geres **manuellement** : un administrateur se connectait en CLI a chaque equipement, tapait les commandes de configuration une par une, puis passait au suivant. Cette approche a fonctionne pendant des decennies, mais elle atteint ses limites face a la croissance des infrastructures modernes.

### Comparaison directe

| Critere | Gestion manuelle | Gestion automatisee |
|---------|-----------------|---------------------|
| **Vitesse** | Minutes a heures par equipement | Secondes pour des centaines d'equipements |
| **Coherence** | Risque de divergence entre configs | Configuration identique garantie |
| **Erreur humaine** | Frequente (fautes de frappe, oublis) | Quasi nulle (scripts testes et valides) |
| **Scalabilite** | Limitee (1 admin = ~50-100 equipements) | Quasi illimitee |
| **Reproductibilite** | Difficile a reproduire exactement | 100% reproductible |
| **Audit** | Logs manuels, souvent incomplets | Logs automatiques, versionnement Git |
| **Cout a long terme** | Eleve (temps humain) | Reduit apres investissement initial |

### Le probleme concret

Imagine une entreprise avec 500 switches. Une nouvelle politique de securite exige de changer le mot de passe enable sur tous les equipements. En mode manuel :

\`\`\`
- Connexion SSH a chaque switch (500 fois)
- Taper les commandes (500 fois)
- Verifier que c'est applique (500 fois)
- Temps estime : 2-3 semaines pour 1 ingenieur
\`\`\`

En mode automatise :

\`\`\`python
# Script Ansible ou Python : 1 fichier, 1 execution
# Temps estime : 15 minutes (ecriture) + 5 minutes (execution)
\`\`\`

> **Point CCNA :** L'examen CCNA 200-301 teste votre comprehension des benefices de l'automatisation reseau. Retenez les mots cles : **coherence, scalabilite, reduction des erreurs humaines, rapidite de deploiement**.`
      },
      {
        title: 'Benefices de l\'automatisation reseau',
        content: `L'automatisation reseau apporte des avantages majeurs que tout ingenieur reseau doit connaitre. Le CCNA insiste particulierement sur cinq benefices cles.

### 1. Coherence (Consistency)

Quand un script deploie une configuration, il applique **exactement** les memes commandes sur chaque equipement. Plus de risque qu'un switch ait une ACL legerement differente d'un autre parce qu'un admin a oublie une ligne.

### 2. Rapidite (Speed)

Un playbook Ansible peut configurer 1000 equipements en parallele en quelques minutes. Un humain mettrait des semaines.

### 3. Scalabilite (Scale)

Ajouter 100 nouveaux switches au reseau ne change rien au processus : on met a jour l'inventaire et on relance le script. Le cout marginal de chaque nouvel equipement tend vers zero.

### 4. Reduction des erreurs humaines

Les erreurs de configuration representent **40 a 70%** des pannes reseau selon les etudes Cisco. L'automatisation elimine les fautes de frappe, les oublis de commandes et les incoherences.

### 5. Documentation vivante

Le code d'automatisation **EST** la documentation. Un playbook Ansible decrit exactement l'etat attendu du reseau. Combine avec Git, on obtient un historique complet de toutes les modifications.

### Tableau recapitulatif pour l'examen

| Benefice | Mot cle CCNA | Exemple |
|----------|-------------|---------|
| Coherence | Consistency | Meme config ACL sur 500 switches |
| Rapidite | Speed | Deploiement VLAN en 2 min au lieu de 3 jours |
| Scalabilite | Scalability | 10 ou 10 000 equipements, meme effort |
| Fiabilite | Reduced errors | Zero faute de frappe |
| Traceabilite | Version control | Git log de chaque changement |

> **Astuce examen :** Si une question demande "quel est le principal avantage de l'automatisation ?", la reponse est presque toujours **coherence et reduction des erreurs humaines**.`
      },
      {
        title: 'Cas d\'usage de l\'automatisation',
        content: `L'automatisation reseau couvre un large eventail de taches. Voici les cas d'usage les plus courants testes au CCNA.

### 1. Deploiement de configuration (Configuration Deployment)

C'est le cas d'usage le plus evident. On pousse des configurations vers les equipements de maniere automatique.

\`\`\`yaml
# Exemple Ansible : deployer un VLAN sur tous les switches
- name: Creer VLAN 100 sur tous les switches
  hosts: switches
  tasks:
    - name: Configurer VLAN 100
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 100
            name: SERVEURS
            state: active
\`\`\`

### 2. Verification de conformite (Compliance Checking)

On verifie automatiquement que les equipements respectent les politiques de securite de l'entreprise.

\`\`\`
Exemples de verifications :
- SSH active, Telnet desactive
- Mot de passe enable configure
- Banner de connexion presente
- NTP synchronise
- Logging envoye au serveur Syslog
\`\`\`

### 3. Collecte d'informations (Data Collection)

Scripts qui collectent l'etat du reseau : versions IOS, tables de routage, statuts des interfaces, inventaire materiel.

### 4. Monitoring et alertes

Surveillance continue avec des outils comme **Prometheus**, **Grafana**, **Nagios** ou **Zabbix**. Alertes automatiques en cas d'anomalie (interface down, CPU > 90%, memoire saturee).

### 5. Provisioning de nouveaux equipements (Zero-Touch Provisioning)

Un nouveau switch branche sur le reseau recoit automatiquement sa configuration via **ZTP** (Zero-Touch Provisioning) ou **PnP** (Plug and Play) de Cisco.

### 6. Gestion des changements (Change Management)

\`\`\`
Workflow automatise :
1. Ingenieur soumet un changement via Git (pull request)
2. Tests automatiques en lab virtuel (CI/CD)
3. Approbation par un pair (code review)
4. Deploiement automatique en production
5. Verification post-deploiement automatique
6. Rollback automatique si echec
\`\`\`

> **Point CCNA :** Le Zero-Touch Provisioning est un concept important. Il permet de deployer des equipements sans intervention manuelle sur site.`
      },
      {
        title: 'Culture DevOps et NetOps',
        content: `L'automatisation reseau s'inscrit dans un mouvement plus large : l'application des pratiques **DevOps** au monde du reseau, appele **NetOps** ou **NetDevOps**.

### DevOps : les principes

DevOps est une culture qui rapproche les equipes de developpement (Dev) et d'operations (Ops) pour livrer des logiciels plus rapidement et de maniere plus fiable. Ses principes fondamentaux :

- **Collaboration** entre equipes (plus de silos)
- **Automatisation** de tout ce qui peut l'etre
- **Integration continue (CI)** : tester automatiquement chaque modification
- **Deploiement continu (CD)** : deployer automatiquement apres validation
- **Infrastructure as Code (IaC)** : decrire l'infrastructure dans des fichiers versionnees

### NetOps : DevOps applique au reseau

NetOps adapte ces principes au monde du reseau :

| Principe DevOps | Application NetOps |
|----------------|-------------------|
| Code versionne | Configurations reseau dans Git |
| CI/CD | Tests automatiques des configs dans un lab virtuel |
| IaC | Playbooks Ansible, Terraform pour le reseau |
| Monitoring | Prometheus + Grafana pour les metriques reseau |
| ChatOps | Alertes et commandes via Slack/Teams/Webex |

### Le pipeline CI/CD pour le reseau

\`\`\`
[Git Push] → [Lint YAML/JSON] → [Test en lab virtuel]
    → [Validation manuelle] → [Deploy en production]
    → [Tests post-deploy] → [Rollback si erreur]
\`\`\`

**Outils de lab virtuel :**
- **Cisco CML** (Cisco Modeling Labs) : emulation d'equipements Cisco
- **GNS3** : simulateur open source
- **EVE-NG** : plateforme de lab virtuel
- **Containerlab** : lab base sur des conteneurs

### L'ingenieur reseau moderne

L'ingenieur reseau ne se contente plus de taper des commandes CLI. Il doit aussi :
- Ecrire des scripts (Python, Ansible)
- Utiliser Git pour versionner les configurations
- Comprendre les API REST
- Savoir lire et ecrire du JSON/YAML
- Automatiser les taches repetitives

> **Point CCNA :** Le CCNA 200-301 a ajoute une section entiere sur l'automatisation et la programmabilite. Cisco considere que ces competences sont desormais essentielles pour tout professionnel reseau.`
      },
      {
        title: 'Panorama des outils d\'automatisation',
        content: `Il existe de nombreux outils pour automatiser les reseaux. Voici un panorama des principaux, classes par categorie.

### Outils de gestion de configuration

| Outil | Type | Langage | Agent | Reseau |
|-------|------|---------|-------|--------|
| **Ansible** | Push, agentless | YAML | Non | Excellent |
| **Puppet** | Pull, agent | Ruby DSL | Oui | Moyen |
| **Chef** | Pull, agent | Ruby | Oui | Moyen |
| **SaltStack** | Push/Pull | YAML | Optionnel | Bon |

### Outils de scripting

| Outil | Usage |
|-------|-------|
| **Python + Netmiko** | Connexion SSH et envoi de commandes |
| **Python + NAPALM** | Abstraction multi-constructeur |
| **Python + Paramiko** | Connexion SSH bas niveau |
| **Python + Nornir** | Framework d'automatisation Python pur |

### Outils d'infrastructure as Code

| Outil | Usage |
|-------|-------|
| **Terraform** | Provisioning d'infrastructure (cloud, reseau) |
| **Pulumi** | IaC avec des langages de programmation |

### Plateformes de management

| Outil | Constructeur | Role |
|-------|-------------|------|
| **Cisco DNA Center** | Cisco | Controleur SDN, automatisation intent-based |
| **Cisco Meraki** | Cisco | Management cloud simplifie |
| **Cisco NSO** | Cisco | Orchestration multi-constructeur |

### Outils de monitoring

| Outil | Type | Protocoles |
|-------|------|-----------|
| **Prometheus + Grafana** | Metriques temps reel | SNMP, API, streaming telemetry |
| **Nagios / Zabbix** | Monitoring traditionnel | SNMP, ICMP, agents |
| **ELK Stack** | Analyse de logs | Syslog, NetFlow |

> **Pour l'examen CCNA :** Concentrez-vous sur **Ansible** (agentless, YAML, push model), **Python** (Netmiko, NAPALM), **Cisco DNA Center** et **Terraform**. Ce sont les outils les plus frequemment mentionnes.`
      }
    ]
  },
  {
    id: 44,
    slug: 'traditionnel-vs-controller',
    title: 'Traditionnel vs Controller-based',
    subtitle: 'Gestion par CLI vs controleur centralise',
    icon: 'Layers',
    color: '#06b6d4',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'x526o_-QTUg',
    sections: [
      {
        title: 'Architecture reseau traditionnelle',
        content: `Dans une architecture reseau **traditionnelle**, chaque equipement (routeur, switch, firewall) est configure **individuellement** via son interface en ligne de commandes (CLI). Chaque equipement possede son propre plan de controle et son propre plan de donnees.

### Les 3 plans d'un equipement reseau

| Plan | Role | Exemple |
|------|------|---------|
| **Management Plane** | Interface d'administration | SSH, Console, SNMP, GUI web |
| **Control Plane** | Decisions de routage/switching | OSPF, STP, ARP, table de routage |
| **Data Plane (Forwarding)** | Transmission des paquets | Forwarding des trames selon la table MAC/routage |

### Fonctionnement traditionnel

Dans le modele traditionnel, les trois plans coexistent **sur chaque equipement** :

\`\`\`
┌─────────────────────────────────┐
│        Equipement reseau        │
├─────────────────────────────────┤
│  Management Plane (SSH, SNMP)   │
├─────────────────────────────────┤
│  Control Plane (OSPF, STP)      │
├─────────────────────────────────┤
│  Data Plane (Forwarding)        │
└─────────────────────────────────┘
      x 500 equipements = 500 plans de controle distribues
\`\`\`

### Workflow d'administration

\`\`\`
1. Se connecter en SSH au switch-01
2. Taper les commandes de configuration
3. Sauvegarder (copy run start)
4. Se deconnecter
5. Se connecter en SSH au switch-02
6. Repeter les memes commandes...
7. Repeter pour chaque equipement
\`\`\`

### Avantages du modele traditionnel

- **Pas de point de defaillance central** : si un controleur tombe, le reseau continue
- **Controle granulaire** : chaque equipement peut etre configure specifiquement
- **Maturite** : technologies eprouvees depuis des decennies
- **Independance** : pas de dependance a un logiciel de management

### Inconvenients

- **Scalabilite limitee** : chaque equipement gere individuellement
- **Risque d'incoherence** : configurations divergentes entre equipements
- **Temps de deploiement** : modifications longues a propager
- **Depannage complexe** : correler les logs de centaines d'equipements

> **Point CCNA :** Le modele traditionnel repose sur un **control plane distribue** — chaque equipement prend ses propres decisions de routage independamment.`
      },
      {
        title: 'Architecture Controller-based',
        content: `L'architecture **controller-based** (ou **centralisee**) separe le plan de controle du plan de donnees. Un **controleur central** prend les decisions de routage et de politique, puis les pousse vers les equipements qui ne font que transmettre les paquets.

### Principe fondamental

\`\`\`
           ┌──────────────────────┐
           │    CONTROLEUR SDN    │
           │  (Control Plane      │
           │   centralise)        │
           └──────────┬───────────┘
                      │ API southbound
          ┌───────────┼───────────┐
          │           │           │
    ┌─────┴─────┐ ┌──┴──────┐ ┌─┴────────┐
    │ Switch 1  │ │ Switch 2│ │ Switch 3  │
    │ Data Plane│ │ Data P. │ │ Data P.   │
    │ seulement │ │ seulemt │ │ seulement │
    └───────────┘ └─────────┘ └───────────┘
\`\`\`

### Ce que fait le controleur

- **Centralise la configuration** de tous les equipements
- **Calcule les chemins** optimaux (routage centralise)
- **Applique les politiques** de securite uniformement
- **Fournit une vue globale** du reseau (topologie, etat, performances)
- **Expose des API** pour l'integration avec d'autres systemes

### Avantages

| Avantage | Description |
|----------|-------------|
| **Vue globale** | Le controleur voit tout le reseau en temps reel |
| **Coherence** | Politiques appliquees uniformement |
| **Agilite** | Changements deployes en minutes |
| **Programmabilite** | API REST pour automatiser |
| **Simplification** | Interface graphique centralisee |
| **Analytics** | Collecte et analyse centralisees |

### Inconvenients

- **Point de defaillance central** : si le controleur tombe, pas de nouvelles decisions (mais le data plane continue)
- **Cout** : licences logicielles souvent couteuses
- **Complexite initiale** : migration et formation
- **Dependance constructeur** : lock-in potentiel

> **Important pour le CCNA :** Dans une architecture controller-based, si le controleur tombe en panne, les equipements continuent a transmettre le trafic avec les dernieres regles recues. Le reseau ne s'arrete pas immediatement.`
      },
      {
        title: 'Cisco DNA Center et Meraki',
        content: `Cisco propose deux plateformes controller-based majeures : **DNA Center** pour les entreprises et **Meraki** pour la gestion cloud simplifiee.

### Cisco DNA Center (Catalyst Center)

DNA Center est la plateforme phare de Cisco pour l'**Intent-Based Networking (IBN)**. Elle gere le reseau campus (LAN, WLAN, WAN).

**Fonctionnalites principales :**

| Fonction | Description |
|----------|-------------|
| **Design** | Topologie reseau, sites hierarchiques, profils |
| **Policy** | Politiques d'acces basees sur les groupes (SGT) |
| **Provision** | Deploiement automatique des configurations |
| **Assurance** | Monitoring, analytics, IA predictive |
| **Platform** | API REST ouvertes pour integration |

**Workflow Intent-Based :**
\`\`\`
1. L'admin exprime une INTENTION : "Les employes du departement Finance
   ne doivent pas acceder aux serveurs RH"
2. DNA Center TRADUIT cette intention en configurations techniques
   (ACL, SGT, politiques de firewall)
3. DNA Center DEPLOIE ces configurations sur tous les equipements
4. DNA Center VERIFIE en continu que l'intention est respectee
\`\`\`

### Cisco Meraki

Meraki est une solution **100% cloud** pour la gestion reseau simplifiee.

| Critere | DNA Center | Meraki |
|---------|-----------|--------|
| **Deploiement** | On-premises (appliance) | Cloud (SaaS) |
| **Cible** | Grandes entreprises, campus | PME, sites distribues |
| **Complexite** | Elevee | Faible |
| **Personnalisation** | Tres avancee | Limitee mais simple |
| **Cout** | Licence + hardware | Licence cloud par equipement |
| **API** | REST completes | REST + webhooks |
| **Zero-Touch** | Cisco PnP | Meraki Auto-provisioning |

**Dashboard Meraki :**
\`\`\`
Meraki Dashboard (cloud)
├── Organisation
│   ├── Reseau Site Paris
│   │   ├── Switches MS
│   │   ├── Access Points MR
│   │   └── Firewall MX
│   ├── Reseau Site Lyon
│   └── Reseau Site Marseille
\`\`\`

> **Point CCNA :** Cisco DNA Center est le controleur SDN de reference pour l'examen. Retenez qu'il utilise des **API REST** (northbound) et **NETCONF/RESTCONF** (southbound) pour communiquer.`
      },
      {
        title: 'Comparaison detaillee : quand utiliser quoi',
        content: `Le choix entre architecture traditionnelle et controller-based depend du contexte. Voici un guide de decision.

### Tableau comparatif complet

| Critere | Traditionnel | Controller-based |
|---------|-------------|-----------------|
| **Taille du reseau** | < 50 equipements | > 50 equipements |
| **Equipe** | 1-2 admins CLI experts | Equipe avec competences API |
| **Budget** | Limite | Investissement possible |
| **Agilite requise** | Faible | Elevee |
| **Conformite/audit** | Manuelle | Automatisee |
| **Multi-constructeur** | Possible | Plus complexe (sauf NSO) |
| **Courbe d'apprentissage** | CLI Cisco classique | API, JSON, nouvelles interfaces |
| **Resilience** | Pas de SPOF | Controleur = SPOF potentiel |

### Scenarios d'utilisation

**Choisir le modele traditionnel quand :**
- Petit reseau stable avec peu de changements
- Budget limite ne permettant pas de controleur
- Equipe habituee au CLI sans formation API
- Environnement multi-constructeur sans orchestrateur

**Choisir le modele controller-based quand :**
- Reseau de plus de 50 equipements
- Changements frequents de configuration
- Besoin de conformite et d'audit automatises
- Deployement de nouveaux sites regulier
- Besoin d'analytics et de visibilite avancees

### L'approche hybride (la realite)

En pratique, la plupart des entreprises utilisent une **approche hybride** :

\`\`\`
┌────────────────────────────────────────────┐
│             Controleur SDN                 │
│    (DNA Center pour le campus LAN/WLAN)    │
└────────────────────┬───────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    Switches    Points Wi-Fi   WLC
    (manages)   (manages)     (manage)

    + Firewalls, routeurs WAN geres en CLI
    + Equipements non-Cisco geres par Ansible
\`\`\`

Le controleur gere le campus, tandis que certains equipements specialises (firewalls, routeurs WAN legacy) restent en gestion CLI ou sont automatises via Ansible.

> **Conseil CCNA :** L'examen ne vous demande pas de choisir l'un ou l'autre, mais de comprendre les **differences** et les **avantages** de chaque approche. Retenez surtout la separation control plane / data plane.`
      },
      {
        title: 'Plans de controle : distribue vs centralise',
        content: `La difference fondamentale entre les deux architectures se situe au niveau du **plan de controle**. C'est un concept central du CCNA.

### Plan de controle distribue (Traditionnel)

Chaque equipement execute ses propres protocoles de routage et prend ses propres decisions.

\`\`\`
Switch A (STP + OSPF)  ←→  Switch B (STP + OSPF)
         ↕                           ↕
Switch C (STP + OSPF)  ←→  Switch D (STP + OSPF)

Chaque switch calcule independamment :
- Son Root Bridge (STP)
- Ses routes (OSPF)
- Ses ports bloques/actifs
\`\`\`

**Protocoles du control plane distribue :**
- **STP/RSTP** : prevention des boucles (Layer 2)
- **OSPF/EIGRP** : routage dynamique (Layer 3)
- **ARP** : resolution adresse IP → MAC
- **HSRP/VRRP** : redondance de passerelle

### Plan de controle centralise (Controller-based)

Le controleur SDN concentre toute l'intelligence. Les equipements ne font qu'executer les instructions.

\`\`\`
         ┌────────────────────┐
         │   Controleur SDN   │
         │                    │
         │ - Calcule topologie│
         │ - Decide du routage│
         │ - Applique policies│
         └────────┬───────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
 Switch A     Switch B      Switch C
 (forward     (forward      (forward
  seulement)   seulement)    seulement)
\`\`\`

### Impact sur la resilience

| Scenario | Distribue | Centralise |
|----------|-----------|------------|
| **Panne d'un switch** | Les autres reconvergent automatiquement | Le controleur recalcule et repousse |
| **Panne du controleur** | N/A | Les switches gardent les dernieres regles |
| **Ajout d'un equipement** | Config manuelle + protocoles convergent | Le controleur detecte et configure |
| **Changement de politique** | Modifier chaque equipement | Modifier une fois sur le controleur |

### Termes importants pour l'examen

- **Underlay** : le reseau physique qui transporte les donnees
- **Overlay** : le reseau virtuel (tunnels VXLAN) construit par le controleur
- **Fabric** : combinaison underlay + overlay geree par le controleur
- **Intent** : l'intention business traduite en configuration technique

> **Astuce CCNA :** Une question classique : "Que se passe-t-il si le controleur SDN tombe ?" Reponse : les equipements continuent a transmettre le trafic avec les regles existantes, mais aucun nouveau changement ne peut etre fait tant que le controleur n'est pas restaure.`
      }
    ]
  },
  {
    id: 45,
    slug: 'architecture-sdn',
    title: 'Architecture SDN',
    subtitle: 'Plans separes, API northbound/southbound et controleurs',
    icon: 'Cpu',
    color: '#06b6d4',
    duration: '45 min',
    level: 'Avance',
    videoId: 'nwBCe-hpe48',
    sections: [
      {
        title: 'Concept du SDN',
        content: `Le **Software-Defined Networking (SDN)** est une approche architecturale qui **separe physiquement** le plan de controle du plan de donnees. Le plan de controle est centralise dans un logiciel (le controleur SDN), tandis que les equipements reseau ne conservent que le plan de donnees (forwarding).

### Les 3 plans dans le SDN

\`\`\`
┌─────────────────────────────────────────────┐
│           APPLICATION LAYER                 │
│   (Apps business, monitoring, securite)     │
│                                             │
│   ← Northbound API (REST) →                │
├─────────────────────────────────────────────┤
│           CONTROL LAYER                     │
│         (Controleur SDN)                    │
│   - Vue globale du reseau                   │
│   - Decisions de routage                    │
│   - Politiques de securite                  │
│                                             │
│   ← Southbound API (OpenFlow, NETCONF) →   │
├─────────────────────────────────────────────┤
│        INFRASTRUCTURE LAYER                 │
│   (Switches, routeurs = Data Plane)         │
│   - Transmission des paquets uniquement     │
└─────────────────────────────────────────────┘
\`\`\`

### Separation des plans : pourquoi ?

| Plan | Traditionnel | SDN |
|------|-------------|-----|
| **Management** | Sur chaque equipement (SSH/SNMP) | Centralise sur le controleur |
| **Control** | Sur chaque equipement (OSPF, STP) | Centralise sur le controleur |
| **Data** | Sur chaque equipement (forwarding) | Reste sur chaque equipement |

En separant le control plane, on obtient :
- Une **vue unifiee** de tout le reseau
- Des **decisions optimales** (le controleur voit tout)
- Une **programmabilite** via des API standard
- Une **abstraction** du hardware (les applications ne voient que l'API)

### SDN vs Automatisation traditionnelle

| Critere | Automatisation CLI | SDN |
|---------|-------------------|-----|
| **Interaction** | SSH + commandes CLI | API programmatiques |
| **Intelligence** | Dans chaque equipement | Dans le controleur |
| **Abstraction** | Faible (commandes specifiques) | Elevee (intentions) |
| **Temps reel** | Non (scripts executes periodiquement) | Oui (controleur reagit en continu) |

> **Definition CCNA :** Le SDN est defini par la separation du control plane et du data plane, avec un controleur centralise programmable via des API.`
      },
      {
        title: 'API Northbound',
        content: `L'API **northbound** est l'interface entre le **controleur SDN** et les **applications** qui l'utilisent. Elle permet aux applications business, aux outils de monitoring et aux scripts d'automatisation d'interagir avec le reseau.

### Position dans l'architecture

\`\`\`
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ App Securite │  │ App Monitoring│  │ Script Python│
  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
         │                 │                  │
         └────────────┬────┘──────────────────┘
                      │  ← API Northbound (REST)
              ┌───────┴────────┐
              │  Controleur SDN│
              └────────────────┘
\`\`\`

### Caracteristiques de l'API Northbound

| Caracteristique | Detail |
|----------------|--------|
| **Type** | REST API (HTTP/HTTPS) |
| **Format** | JSON (principalement) |
| **Authentification** | Token, OAuth, API Key |
| **Documentation** | Swagger/OpenAPI |
| **Direction** | Applications → Controleur |

### Exemples d'utilisation

**1. Recuperer la topologie du reseau :**
\`\`\`
GET https://dna-center.example.com/api/v1/topology/physical-topology
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...

Reponse :
{
  "response": {
    "nodes": [...],
    "links": [...]
  }
}
\`\`\`

**2. Creer un nouveau VLAN :**
\`\`\`
POST https://dna-center.example.com/api/v1/network-settings/vlan
Content-Type: application/json
{
  "vlanId": 100,
  "vlanName": "SERVEURS",
  "site": "Paris-HQ"
}
\`\`\`

**3. Verifier la conformite :**
\`\`\`
GET https://dna-center.example.com/api/v1/compliance
→ Liste des equipements conformes/non-conformes
\`\`\`

### API Northbound de Cisco DNA Center

Cisco DNA Center expose une API REST complete documentee sur **Cisco DevNet** (developer.cisco.com). Les categories principales :

- **Know Your Network** : topologie, equipements, clients
- **Site Design** : sites, profils, templates
- **Authentication** : tokens, RBAC
- **Policy** : politiques d'acces, QoS
- **Task** : statut des operations asynchrones

> **Point CCNA :** L'API Northbound utilise **REST** et communique en **JSON**. C'est l'interface que les developpeurs et les scripts d'automatisation utilisent pour programmer le reseau.`
      },
      {
        title: 'API Southbound',
        content: `L'API **southbound** est l'interface entre le **controleur SDN** et les **equipements reseau** (switches, routeurs). C'est par cette interface que le controleur pousse les configurations et collecte les informations du reseau.

### Position dans l'architecture

\`\`\`
              ┌────────────────┐
              │  Controleur SDN│
              └───────┬────────┘
                      │  ← API Southbound
         ┌────────────┼────────────┐
         │            │            │
    ┌────┴────┐  ┌────┴────┐  ┌───┴─────┐
    │ Switch  │  │ Routeur │  │   AP    │
    └─────────┘  └─────────┘  └─────────┘
\`\`\`

### Protocoles Southbound principaux

| Protocole | Type | Port | Format | Usage |
|-----------|------|------|--------|-------|
| **OpenFlow** | Programmation tables de flux | 6653 | Binaire | SDN pur (academique) |
| **NETCONF** | Configuration | 830 (SSH) | XML (YANG) | Config structuree Cisco |
| **RESTCONF** | Configuration | 443 (HTTPS) | JSON/XML (YANG) | Version REST de NETCONF |
| **CLI/SSH** | Configuration | 22 | Texte | Legacy, fallback |
| **SNMP** | Monitoring | 161/162 | MIB | Collecte de metriques |

### OpenFlow

OpenFlow est le premier protocole SDN standardise (ONF). Il permet au controleur de programmer directement les **tables de flux** (flow tables) des switches.

\`\`\`
Regle OpenFlow :
Match: src_ip=10.0.1.0/24, dst_port=80
Action: forward port 3, set DSCP 46
Priority: 100
\`\`\`

### NETCONF (Network Configuration Protocol)

NETCONF est un protocole de configuration base sur **SSH** et **XML**. Il utilise des modeles de donnees **YANG** pour decrire la structure des configurations.

\`\`\`xml
<!-- Exemple NETCONF : configurer une interface -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <edit-config>
    <target><running/></target>
    <config>
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
        <interface>
          <name>GigabitEthernet1</name>
          <description>Lien vers le serveur</description>
          <enabled>true</enabled>
        </interface>
      </interfaces>
    </config>
  </edit-config>
</rpc>
\`\`\`

### RESTCONF

RESTCONF est une version **REST** de NETCONF. Il utilise HTTP/HTTPS et supporte JSON en plus de XML.

\`\`\`
GET https://router.example.com/restconf/data/ietf-interfaces:interfaces
Accept: application/yang-data+json

PUT https://router.example.com/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet1
Content-Type: application/yang-data+json
{
  "ietf-interfaces:interface": {
    "name": "GigabitEthernet1",
    "description": "Lien vers le serveur",
    "enabled": true
  }
}
\`\`\`

> **Pour l'examen CCNA :** Retenez que **NETCONF** utilise SSH+XML, **RESTCONF** utilise HTTPS+JSON/XML, et les deux s'appuient sur des modeles de donnees **YANG**. OpenFlow est le protocole SDN historique mais moins utilise en entreprise.`
      },
      {
        title: 'Controleurs SDN et solutions Cisco',
        content: `Le controleur SDN est le cerveau de l'architecture. Il existe des solutions open source et proprietaires. Cisco propose plusieurs controleurs selon le contexte.

### Controleurs open source

| Controleur | Organisation | Langage | Usage |
|-----------|-------------|---------|-------|
| **OpenDaylight (ODL)** | Linux Foundation | Java | Reference open source, multi-protocole |
| **ONOS** | ONF | Java | Operateurs telecom |
| **Ryu** | NTT | Python | Recherche, education |
| **Floodlight** | Big Switch | Java | Simple, OpenFlow |

### Solutions Cisco

**Cisco ACI (Application Centric Infrastructure)** — Data Center

\`\`\`
┌─────────────────────────────────┐
│      APIC (Controleur ACI)      │
│  Application Policy Infrastr.   │
│  Controller                     │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
  Spine 1   Spine 2   Spine 3     ← Switches Nexus 9000
    │  ╲  ╱  │  ╲  ╱  │
  Leaf 1   Leaf 2   Leaf 3        ← Switches Nexus 9000
    │        │        │
 Serveurs  Serveurs  Serveurs
\`\`\`

- Architecture **Spine-Leaf** (topologie Clos)
- Politiques basees sur les **EPG** (Endpoint Groups)
- Protocole southbound : **OpFlex** (proprietaire Cisco)

**Cisco SD-Access** — Campus LAN/WLAN

- Controleur : **DNA Center**
- Fabric VXLAN avec plan de controle **LISP**
- Segmentation par **SGT** (Scalable Group Tags)
- Protocole southbound : NETCONF, RESTCONF, CLI

**Cisco SD-WAN (Viptela)** — WAN

- Controleur : **vManage** (management), **vSmart** (control), **vBond** (orchestration)
- Overlay : tunnels **IPsec** sur tout type de transport (MPLS, Internet, 4G/5G)
- Politique centralisee de routage et QoS

### Tableau recapitulatif Cisco

| Solution | Controleur | Domaine | Southbound |
|----------|-----------|---------|------------|
| **ACI** | APIC | Data Center | OpFlex |
| **SD-Access** | DNA Center | Campus LAN/WLAN | NETCONF, RESTCONF |
| **SD-WAN** | vManage/vSmart | WAN | OMP (Overlay Management Protocol) |

> **Astuce CCNA :** Pour l'examen, concentrez-vous sur **DNA Center** (SD-Access), **APIC** (ACI) et les concepts **SD-WAN**. Retenez les noms des controleurs et leurs domaines d'application.`
      },
      {
        title: 'SD-WAN : concepts et architecture',
        content: `Le **SD-WAN** (Software-Defined Wide Area Network) applique les principes du SDN au reseau WAN (liaisons entre sites distants). C'est un sujet de plus en plus present au CCNA.

### Probleme du WAN traditionnel

Le WAN classique repose sur des liaisons **MPLS** couteuses et rigides :

\`\`\`
WAN Traditionnel :
Site Paris ──── MPLS (cher, fiable) ──── Site Lyon

Problemes :
- Cout eleve des liaisons MPLS
- Ajout de site = delai de semaines
- Pas de flexibilite dans le routage
- Trafic cloud doit passer par le datacenter central
\`\`\`

### Solution SD-WAN

Le SD-WAN cree un **overlay intelligent** sur n'importe quel type de transport :

\`\`\`
SD-WAN :
                ┌──────── MPLS ────────┐
Site Paris ─────┼──────── Internet ────┼───── Site Lyon
                └──────── 4G/5G ───────┘

Le controleur choisit dynamiquement le meilleur
chemin selon les politiques et la qualite du lien.
\`\`\`

### Architecture Cisco SD-WAN (Viptela)

| Composant | Role | Plan |
|-----------|------|------|
| **vManage** | Interface de management, monitoring | Management |
| **vSmart** | Politiques, routage overlay, cles | Control |
| **vBond** | Orchestration, authentification initiale | Orchestration |
| **vEdge / cEdge** | Routeur sur chaque site | Data |

### Avantages du SD-WAN

| Avantage | Description |
|----------|-------------|
| **Cout reduit** | Utilise des liens Internet (moins cher que MPLS) |
| **Agilite** | Nouveau site en quelques heures (ZTP) |
| **Application-aware** | Routage par application (Teams sur MPLS, web sur Internet) |
| **Securite** | Chiffrement IPsec automatique entre tous les sites |
| **Visibilite** | Dashboard centralise avec metriques par application |
| **Direct Internet Access** | Trafic cloud sort localement (pas de backhaul) |

### Politique application-aware

\`\`\`
Politique SD-WAN :
- Microsoft Teams / Zoom → MPLS (priorite voix/video)
- SAP / ERP            → MPLS (donnees critiques)
- Navigation web       → Internet (best-effort)
- Backup / MAJ         → 4G (quand dispo, basse priorite)
\`\`\`

Le controleur surveille en permanence la qualite de chaque lien (latence, jitter, perte) et bascule automatiquement le trafic si un lien se degrade.

> **Point CCNA :** Le SD-WAN utilise un **overlay** chiffre sur des transports multiples. Le controleur applique des politiques **application-aware** pour choisir le meilleur chemin en temps reel. Retenez les composants : vManage, vSmart, vBond, vEdge.`
      }
    ]
  },
  {
    id: 46,
    slug: 'ai-ml-reseaux',
    title: 'AI et Machine Learning reseaux',
    subtitle: 'Intelligence artificielle, analytique predictive et IBN',
    icon: 'Brain',
    color: '#06b6d4',
    duration: '30 min',
    level: 'Intermediaire',
    videoId: 'SfOoRsUj9kQ',
    sections: [
      {
        title: 'AI et ML dans les reseaux : introduction',
        content: `L'**intelligence artificielle (AI)** et le **machine learning (ML)** transforment la gestion des reseaux. Au lieu de reagir aux problemes apres qu'ils surviennent, les reseaux modernes peuvent **predire** et **prevenir** les incidents automatiquement.

### Definitions cles

| Terme | Definition |
|-------|-----------|
| **AI (Artificial Intelligence)** | Systemes capables d'effectuer des taches qui necessitent normalement l'intelligence humaine |
| **ML (Machine Learning)** | Sous-ensemble de l'AI ou les systemes apprennent a partir de donnees sans etre explicitement programmes |
| **Deep Learning** | Sous-ensemble du ML utilisant des reseaux de neurones profonds |
| **Predictive Analytics** | Utilisation du ML pour predire des evenements futurs |

### Application au reseau

\`\`\`
Donnees reseau collectees en continu :
- Logs Syslog (millions d'evenements/jour)
- Metriques SNMP (CPU, memoire, bande passante)
- NetFlow (flux de trafic)
- Wireless (RSSI, interferences, roaming)
- Telemetrie streaming (temps reel)
         │
         ▼
┌─────────────────────────┐
│   Moteur AI/ML          │
│                         │
│ - Baseline automatique  │
│ - Detection d'anomalies │
│ - Correlation d'events  │
│ - Prediction de pannes  │
│ - Recommandations       │
└────────────┬────────────┘
             │
             ▼
    Actions automatiques ou
    recommandations a l'admin
\`\`\`

### Avant vs Apres l'AI dans le reseau

| Aspect | Avant (reactif) | Apres (proactif avec AI) |
|--------|-----------------|-------------------------|
| **Detection de probleme** | Plainte utilisateur | Anomalie detectee avant impact |
| **Diagnostic** | Analyse manuelle des logs | Correlation automatique |
| **Resolution** | Ingenieur cherche la cause | Cause racine identifiee en secondes |
| **Capacite** | Planification annuelle | Prediction dynamique |
| **Securite** | Regles statiques | Detection comportementale |

> **Point CCNA :** L'AI/ML dans le reseau vise a passer d'un modele **reactif** (on repare apres la panne) a un modele **proactif** (on previent avant la panne).`
      },
      {
        title: 'Analytique predictive et detection d\'anomalies',
        content: `L'analytique predictive utilise le machine learning pour analyser les donnees historiques du reseau et predire les problemes futurs.

### Comment ca fonctionne

**Etape 1 : Apprentissage de la baseline**
Le moteur ML observe le reseau pendant des semaines et apprend le comportement "normal" :
- Trafic typique par heure/jour/semaine
- Utilisation CPU/memoire habituelle
- Patterns de connexion Wi-Fi
- Temps de reponse DNS moyen

**Etape 2 : Detection des anomalies**
Toute deviation significative par rapport a la baseline declenche une alerte.

\`\`\`
Baseline apprise :
- Trafic moyen lundi 9h : 500 Mbps (± 50 Mbps)
- CPU switch core : 35% (± 10%)
- Connexions DNS/sec : 200 (± 30)

Anomalie detectee :
- Trafic lundi 9h : 850 Mbps → +70% au-dessus de la baseline
- CPU switch core : 85% → +143% au-dessus de la baseline
  → ALERTE : comportement anormal detecte
  → CORRELATION : probable boucle de broadcast ou attaque DDoS
\`\`\`

### Types d'anomalies detectees

| Type | Exemple | Action ML |
|------|---------|----------|
| **Securite** | Scan de ports inhabituel | Alerte + isolation potentielle |
| **Performance** | Latence DNS en hausse | Identifier le serveur DNS concerne |
| **Capacite** | Bande passante proche de la saturation | Recommander un upgrade |
| **Configuration** | Changement non autorise | Alerte + comparaison avec baseline |
| **Wireless** | Interferences sur un canal | Recommander un changement de canal |

### Correlation d'evenements

L'un des atouts majeurs de l'AI est la capacite a **correler** des evenements apparemment sans lien :

\`\`\`
Evenements isoles :
1. 09:15 - Augmentation du trafic broadcast sur VLAN 10
2. 09:16 - CPU du switch SW-CORE-01 a 92%
3. 09:17 - 15 utilisateurs signalent des lenteurs
4. 09:18 - Interface Gi0/1 du switch SW-ACC-03 en flapping

Correlation AI :
→ "Boucle STP probable sur SW-ACC-03 port Gi0/1
   provoquant une tempete de broadcast sur VLAN 10"
→ Recommandation : "Verifier le cablage et la config STP sur SW-ACC-03"
\`\`\`

> **Point CCNA :** L'analytique predictive repose sur l'apprentissage d'une **baseline** du comportement normal, puis la **detection d'anomalies** par deviation statistique.`
      },
      {
        title: 'Intent-Based Networking (IBN)',
        content: `L'**Intent-Based Networking** est le concept le plus avance de la gestion reseau moderne. Il combine SDN, automatisation et AI/ML pour creer un reseau qui se configure et se gere a partir d'**intentions business** exprimees en langage naturel.

### Principe de l'IBN

\`\`\`
┌──────────────────────────────────────────┐
│          INTENTION BUSINESS              │
│ "Les employes Finance ne doivent pas     │
│  acceder aux serveurs de developpement"  │
└─────────────────┬────────────────────────┘
                  │ Traduction
                  ▼
┌──────────────────────────────────────────┐
│      POLITIQUES RESEAU                   │
│ SGT Finance = 10, SGT Dev-Servers = 20   │
│ Deny SGT 10 → SGT 20                    │
└─────────────────┬────────────────────────┘
                  │ Activation
                  ▼
┌──────────────────────────────────────────┐
│   CONFIGURATION EQUIPEMENTS              │
│ ACL, SGT, firewalls, switchport config   │
│ → deploye automatiquement               │
└─────────────────┬────────────────────────┘
                  │ Verification
                  ▼
┌──────────────────────────────────────────┐
│      ASSURANCE CONTINUE                  │
│ AI verifie en permanence que             │
│ l'intention est respectee                │
└──────────────────────────────────────────┘
\`\`\`

### Les 4 piliers de l'IBN

| Pilier | Description | Outil Cisco |
|--------|-------------|-------------|
| **Translate** | Convertir l'intention en politiques | DNA Center Policy |
| **Activate** | Deployer les configs sur les equipements | DNA Center Provision |
| **Assure** | Verifier en continu le respect de l'intention | DNA Center Assurance |
| **Remediate** | Corriger automatiquement les ecarts | AI-driven actions |

### IBN dans Cisco DNA Center

DNA Center implemente l'IBN a travers plusieurs fonctionnalites :

**1. Policy (Translate + Activate)**
- Definition de groupes (SGT) : Employes, Invites, IoT, Serveurs
- Regles d'acces entre groupes (matrice de segmentation)
- Deploiement automatique sur tous les equipements du fabric

**2. Assurance (Assure)**
- Score de sante du reseau (0-10) par equipement, client, application
- Detection proactive des problemes avant impact utilisateur
- Guided Remediation : etapes suggereees pour resoudre un probleme

**3. AI Network Analytics**
- Baseline automatique du reseau
- Prediction de problemes (onboarding Wi-Fi lent, DHCP timeouts)
- Comparaison entre sites ("Site Paris a 3x plus de problemes DHCP que Lyon")

> **Definition CCNA :** L'IBN est un reseau qui traduit des intentions business en configurations techniques, les deploie automatiquement, et verifie en continu que le reseau se comporte conformement a ces intentions grace a l'AI.`
      },
      {
        title: 'Cisco AI Network Analytics',
        content: `**Cisco AI Network Analytics** est le moteur d'intelligence artificielle integre a Cisco DNA Center. Il analyse en continu les donnees du reseau pour fournir des insights actionnables.

### Fonctionnalites principales

**1. Baselining intelligent**
Le moteur ML cree automatiquement des baselines pour chaque metrique du reseau, en tenant compte des variations temporelles :
- Heure de la journee (trafic plus eleve en journee)
- Jour de la semaine (lundi ≠ dimanche)
- Saisonnalite (rentree scolaire, fetes)

**2. Detection d'anomalies multi-niveaux**

| Niveau | Ce qui est analyse | Exemple d'anomalie |
|--------|-------------------|-------------------|
| **Infra** | Equipements, interfaces | CPU anormal, interface flapping |
| **Client** | Connexions, authentification | Echecs DHCP en hausse, temps d'auth eleve |
| **Application** | Temps de reponse, throughput | Latence Microsoft 365 anormale |

**3. Comparaison entre sites (Peer Comparison)**
\`\`\`
Site Paris  : Onboarding Wi-Fi moyen = 2.1 secondes
Site Lyon   : Onboarding Wi-Fi moyen = 2.3 secondes
Site Nantes : Onboarding Wi-Fi moyen = 8.7 secondes ← ANOMALIE

→ "Site Nantes a un temps d'onboarding Wi-Fi 4x superieur
   a la moyenne des autres sites. Cause probable :
   serveur RADIUS distant avec latence elevee."
\`\`\`

**4. Guided Remediation**
Quand un probleme est detecte, DNA Center propose des etapes de resolution :
\`\`\`
Probleme detecte : 23% des clients Wi-Fi sur AP-SALLE-B03
echouent a obtenir une adresse DHCP.

Analyse AI :
1. Le serveur DHCP 10.1.1.5 repond avec un delai > 5s
2. Le pool DHCP du scope VLAN-WIFI est rempli a 95%
3. Le bail DHCP est configure a 8 heures (trop long pour un Wi-Fi invites)

Recommandations :
1. Verifier la connectivite vers 10.1.1.5
2. Etendre le pool DHCP ou reduire le bail a 1 heure
3. Verifier les interfaces VLAN sur le switch d'acces
\`\`\`

### ChatOps et automatisation

L'AI peut etre integree dans les workflows ChatOps :
- **Alertes Webex/Slack** : "Anomalie detectee sur le WLAN Guest — 15 clients impactes"
- **Rapports automatiques** : resume quotidien des incidents et tendances
- **Actions declenchees** : remediation automatique pour les problemes courants

> **Point CCNA :** Cisco AI Network Analytics est le composant **Assurance** de DNA Center. Il utilise le ML pour creer des baselines, detecter des anomalies et proposer des remediations guidees. Retenez les termes **baseline, anomaly detection, guided remediation**.`
      }
    ]
  },
  {
    id: 47,
    slug: 'apis-rest',
    title: 'APIs REST',
    subtitle: 'Principes REST, methodes HTTP, codes et authentification',
    icon: 'Code',
    color: '#06b6d4',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'SC4sEiBje1Q',
    sections: [
      {
        title: 'Qu\'est-ce qu\'une API ?',
        content: `Une **API** (Application Programming Interface) est un ensemble de regles et de protocoles qui permettent a deux logiciels de communiquer entre eux. Dans le contexte reseau, les API permettent aux scripts et aux applications d'interagir avec les equipements et les controleurs reseau.

### Analogie

Imagine un restaurant :
- Le **client** (toi) passe une commande
- Le **serveur** (API) transmet la commande en cuisine
- La **cuisine** (systeme backend) prepare le plat
- Le **serveur** (API) te ramene le resultat

Tu n'as pas besoin de savoir comment la cuisine fonctionne. Tu utilises le serveur (API) comme intermediaire.

### Types d'API dans le reseau

| Type | Description | Exemple |
|------|-------------|---------|
| **REST API** | API basee sur HTTP, la plus courante | Cisco DNA Center, Meraki |
| **NETCONF** | API basee sur SSH + XML | Configuration d'equipements Cisco IOS-XE |
| **RESTCONF** | API REST utilisant YANG models | Configuration structuree IOS-XE |
| **gRPC** | API haute performance (Google) | Telemetrie streaming |

### REST : l'API dominante

**REST** (Representational State Transfer) est un style architectural defini par Roy Fielding en 2000. Ce n'est pas un protocole mais un ensemble de **contraintes** :

| Contrainte | Description |
|-----------|-------------|
| **Client-Server** | Separation entre le client (qui demande) et le serveur (qui repond) |
| **Stateless** | Chaque requete contient toutes les informations necessaires. Le serveur ne garde pas d'etat entre les requetes |
| **Cacheable** | Les reponses peuvent etre mises en cache pour ameliorer les performances |
| **Uniform Interface** | Interface standardisee (URL + methodes HTTP) |
| **Layered System** | Le client ne sait pas s'il parle au serveur final ou a un intermediaire |

### URL et ressources

En REST, tout est une **ressource** identifiee par une **URL** :

\`\`\`
https://dna-center.example.com/api/v1/network-device
│       │                         │    │  │
│       │                         │    │  └─ Ressource (equipements)
│       │                         │    └─── Version de l'API
│       │                         └──────── Chemin de base
│       └────────────────────────────────── Serveur
└────────────────────────────────────────── Protocole (HTTPS)
\`\`\`

> **Point CCNA :** REST est **stateless** (sans etat) — chaque requete est independante. Le serveur ne se souvient pas des requetes precedentes. C'est la contrainte la plus importante a retenir.`
      },
      {
        title: 'Methodes HTTP et operations CRUD',
        content: `Les API REST utilisent les **methodes HTTP** standard pour effectuer des operations sur les ressources. Ces operations correspondent au modele **CRUD** (Create, Read, Update, Delete).

### Les methodes HTTP

| Methode | CRUD | Description | Idempotent |
|---------|------|-------------|------------|
| **GET** | Read | Recuperer une ressource | Oui |
| **POST** | Create | Creer une nouvelle ressource | Non |
| **PUT** | Update (complet) | Remplacer entierement une ressource | Oui |
| **PATCH** | Update (partiel) | Modifier partiellement une ressource | Non |
| **DELETE** | Delete | Supprimer une ressource | Oui |

**Idempotent** signifie que faire la meme requete plusieurs fois produit le meme resultat. GET, PUT et DELETE sont idempotents. POST ne l'est pas (chaque POST cree une nouvelle ressource).

### Exemples pratiques avec Cisco DNA Center

**GET — Recuperer la liste des equipements :**
\`\`\`
GET /api/v1/network-device
→ Retourne la liste de tous les equipements du reseau
\`\`\`

**GET — Recuperer un equipement specifique :**
\`\`\`
GET /api/v1/network-device/3923-abcd-1234
→ Retourne les details de l'equipement avec cet ID
\`\`\`

**POST — Ajouter un equipement :**
\`\`\`
POST /api/v1/network-device
Body: {
  "ipAddress": ["10.0.0.1"],
  "snmpVersion": "v2",
  "snmpROCommunity": "public",
  "type": "NETWORK_DEVICE"
}
→ Ajoute un nouvel equipement a l'inventaire
\`\`\`

**PUT — Modifier un equipement :**
\`\`\`
PUT /api/v1/network-device
Body: {
  "id": "3923-abcd-1234",
  "snmpROCommunity": "nouveau-community"
}
→ Met a jour la configuration SNMP de l'equipement
\`\`\`

**DELETE — Supprimer un equipement :**
\`\`\`
DELETE /api/v1/network-device/3923-abcd-1234
→ Supprime l'equipement de l'inventaire
\`\`\`

### Utilisation avec curl

\`\`\`bash
# GET - Recuperer des equipements
curl -X GET "https://dna-center/api/v1/network-device" \\
  -H "X-Auth-Token: eyJhbGciOi..." \\
  -H "Content-Type: application/json"

# POST - Creer une ressource
curl -X POST "https://dna-center/api/v1/template-programmer/project" \\
  -H "X-Auth-Token: eyJhbGciOi..." \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Mon-Projet", "description": "Templates VLAN"}'
\`\`\`

> **Astuce CCNA :** Retenez l'association **GET=lire, POST=creer, PUT=remplacer, PATCH=modifier, DELETE=supprimer**. C'est un classique des questions d'examen.`
      },
      {
        title: 'Codes de statut HTTP',
        content: `Chaque reponse HTTP contient un **code de statut** a 3 chiffres qui indique le resultat de la requete. Ces codes sont essentiels pour comprendre le comportement des API REST.

### Categories de codes

| Plage | Categorie | Signification |
|-------|-----------|---------------|
| **1xx** | Informational | Requete recue, traitement en cours |
| **2xx** | Success | Requete traitee avec succes |
| **3xx** | Redirection | Action supplementaire necessaire |
| **4xx** | Client Error | Erreur cote client |
| **5xx** | Server Error | Erreur cote serveur |

### Codes les plus importants pour le CCNA

**Succes (2xx) :**

| Code | Nom | Signification | Utilise avec |
|------|-----|---------------|-------------|
| **200** | OK | Requete reussie | GET, PUT, PATCH |
| **201** | Created | Ressource creee avec succes | POST |
| **204** | No Content | Succes, pas de contenu retourne | DELETE |

**Redirection (3xx) :**

| Code | Nom | Signification |
|------|-----|---------------|
| **301** | Moved Permanently | Ressource deplacee definitivement |
| **304** | Not Modified | Ressource non modifiee (cache valide) |

**Erreur client (4xx) :**

| Code | Nom | Signification |
|------|-----|---------------|
| **400** | Bad Request | Requete mal formee (JSON invalide, parametre manquant) |
| **401** | Unauthorized | Authentification requise ou token invalide |
| **403** | Forbidden | Authentifie mais pas autorise (droits insuffisants) |
| **404** | Not Found | Ressource inexistante (mauvaise URL) |
| **405** | Method Not Allowed | Methode HTTP non supportee pour cette URL |
| **429** | Too Many Requests | Rate limiting — trop de requetes |

**Erreur serveur (5xx) :**

| Code | Nom | Signification |
|------|-----|---------------|
| **500** | Internal Server Error | Erreur interne du serveur |
| **502** | Bad Gateway | Le serveur intermediaire a recu une reponse invalide |
| **503** | Service Unavailable | Serveur temporairement indisponible (maintenance) |

### Interpretation en pratique

\`\`\`bash
# Requete reussie
curl -s -o /dev/null -w "%{http_code}" https://api.example.com/devices
→ 200

# Token expire
curl -s -o /dev/null -w "%{http_code}" -H "Token: expire123" https://api.example.com/devices
→ 401

# Ressource inexistante
curl -s -o /dev/null -w "%{http_code}" https://api.example.com/devices/id-inexistant
→ 404
\`\`\`

> **Astuce CCNA :** Les codes les plus testes sont **200** (OK), **201** (Created), **401** (Unauthorized), **403** (Forbidden), **404** (Not Found). Retenez : 4xx = erreur client, 5xx = erreur serveur.`
      },
      {
        title: 'Structure JSON et payloads',
        content: `Les API REST utilisent principalement le format **JSON** (JavaScript Object Notation) pour echanger des donnees. C'est le format standard des payloads (corps de requete et de reponse).

### Structure JSON

JSON est compose de deux structures :
- **Objet** : collection de paires cle/valeur entre accolades \`{}\`
- **Tableau (Array)** : liste ordonnee de valeurs entre crochets \`[]\`

### Types de valeurs JSON

| Type | Exemple |
|------|---------|
| **String** | \`"hostname": "SW-CORE-01"\` |
| **Number** | \`"vlanId": 100\` |
| **Boolean** | \`"enabled": true\` |
| **Null** | \`"description": null\` |
| **Object** | \`"location": {"city": "Paris", "building": "HQ"}\` |
| **Array** | \`"ports": [1, 2, 3, 4]\` |

### Exemple de reponse API Cisco DNA Center

\`\`\`json
{
  "response": [
    {
      "id": "ab12-cd34-ef56",
      "hostname": "SW-CORE-01",
      "platformId": "C9300-48U",
      "softwareVersion": "17.6.3",
      "role": "DISTRIBUTION",
      "managementIpAddress": "10.0.1.1",
      "macAddress": "AA:BB:CC:DD:EE:01",
      "serialNumber": "FCW2345L6P7",
      "reachabilityStatus": "Reachable",
      "upTime": "45 days, 12:34:56",
      "interfaces": [
        {
          "name": "GigabitEthernet1/0/1",
          "status": "up",
          "speed": "1000000",
          "vlanId": 10
        },
        {
          "name": "GigabitEthernet1/0/2",
          "status": "down",
          "speed": "0",
          "vlanId": 20
        }
      ],
      "location": {
        "site": "Paris-HQ",
        "building": "Bat-A",
        "floor": "3eme"
      }
    }
  ],
  "version": "1.0"
}
\`\`\`

### Lecture du JSON

Pour acceder a des donnees specifiques, on utilise la notation par point ou par crochet :

\`\`\`
response[0].hostname           → "SW-CORE-01"
response[0].managementIpAddress → "10.0.1.1"
response[0].interfaces[0].name  → "GigabitEthernet1/0/1"
response[0].location.building   → "Bat-A"
\`\`\`

> **Point CCNA :** JSON est le format **par defaut** des API REST. Sachez lire un document JSON et extraire des informations specifiques (hostname, IP, statut). L'examen peut vous montrer un JSON et demander une valeur.`
      },
      {
        title: 'Authentification API',
        content: `Pour securiser l'acces aux API, plusieurs mecanismes d'authentification existent. Le CCNA couvre les plus courants.

### 1. API Key

Un token statique inclus dans chaque requete. Simple mais peu securise.

\`\`\`bash
curl -X GET "https://api.meraki.com/api/v1/organizations" \\
  -H "X-Cisco-Meraki-API-Key: abc123def456"
\`\`\`

| Avantage | Inconvenient |
|----------|-------------|
| Simple a implementer | Pas d'expiration par defaut |
| Pas de login necessaire | Si compromise, acces total |

### 2. Token-based (Bearer Token)

Le client s'authentifie d'abord (login/password) et recoit un **token temporaire** (JWT par exemple) utilise pour les requetes suivantes.

\`\`\`bash
# Etape 1 : Authentification → obtenir le token
curl -X POST "https://dna-center/api/system/v1/auth/token" \\
  -u "admin:mot-de-passe" \\
  -H "Content-Type: application/json"

Reponse :
{
  "Token": "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI..."
}

# Etape 2 : Utiliser le token pour les requetes
curl -X GET "https://dna-center/api/v1/network-device" \\
  -H "X-Auth-Token: eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI..."
\`\`\`

| Avantage | Inconvenient |
|----------|-------------|
| Token temporaire (expire) | Necessite un workflow login |
| Revocable | Plus complexe a implementer |
| Peut contenir des permissions (JWT) | Token a stocker cote client |

### 3. OAuth 2.0

Framework d'autorisation standard qui permet a une application d'acceder a des ressources au nom d'un utilisateur, sans partager son mot de passe.

\`\`\`
Flux OAuth simplifie :
1. L'application redirige l'utilisateur vers le serveur d'auth
2. L'utilisateur se connecte et autorise l'acces
3. Le serveur d'auth retourne un "authorization code"
4. L'application echange le code contre un "access token"
5. L'application utilise l'access token pour les requetes API
\`\`\`

### 4. Basic Authentication

Login et mot de passe encodes en Base64 dans l'en-tete HTTP. Simple mais peu securise (surtout sans HTTPS).

\`\`\`bash
# Base64 de "admin:password" = YWRtaW46cGFzc3dvcmQ=
curl -X GET "https://api.example.com/devices" \\
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ="
\`\`\`

### Tableau comparatif

| Methode | Securite | Complexite | Usage typique |
|---------|----------|-----------|---------------|
| **API Key** | Faible | Tres simple | Meraki, services simples |
| **Token (Bearer)** | Bonne | Moyenne | DNA Center, Cisco APIs |
| **OAuth 2.0** | Elevee | Complexe | Applications tierces |
| **Basic Auth** | Faible | Tres simple | Tests, developement |

### Outils pour tester les API

- **curl** : outil CLI universel (montre dans les exemples ci-dessus)
- **Postman** : interface graphique populaire pour tester les API REST
- **Python requests** : bibliotheque Python pour les scripts
- **Cisco DevNet Sandbox** : labs gratuits pour tester les API Cisco

> **Point CCNA :** Pour l'examen, retenez le workflow d'authentification par **token** (login → token → utilisation) et la difference entre **API Key** (statique) et **Bearer Token** (temporaire). Sachez reconnaitre une requete curl avec authentification.`
      }
    ]
  },
  {
    id: 48,
    slug: 'outils-gestion-config',
    title: 'Outils de gestion de config',
    subtitle: 'Ansible, Python, Terraform et Infrastructure as Code',
    icon: 'Settings',
    color: '#06b6d4',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'Cisg9bLhLkk',
    sections: [
      {
        title: 'Infrastructure as Code (IaC)',
        content: `L'**Infrastructure as Code** est le principe fondamental de la gestion de configuration moderne. Au lieu de configurer les equipements manuellement, on decrit l'etat souhaite dans des **fichiers de code** versionnees dans Git.

### Principe

\`\`\`
Approche traditionnelle :
Admin → SSH → Switch → taper les commandes → sauvegarder

Approche IaC :
Admin → Ecrire un fichier YAML/JSON → Git commit → Outil execute → Switch configure
\`\`\`

### Les deux modeles

| Modele | Description | Outils |
|--------|-------------|--------|
| **Imperatif** | Decrire **comment** faire (etape par etape) | Scripts Python, Bash |
| **Declaratif** | Decrire **quoi** obtenir (etat final) | Ansible, Terraform, Puppet |

**Exemple imperatif (Python) :**
\`\`\`python
# On dit COMMENT faire
conn = ConnectHandler(host='10.0.0.1', ...)
conn.send_command('configure terminal')
conn.send_command('vlan 100')
conn.send_command('name SERVEURS')
conn.send_command('exit')
\`\`\`

**Exemple declaratif (Ansible) :**
\`\`\`yaml
# On dit QUOI obtenir (l'etat final desire)
- name: VLAN 100 doit exister
  cisco.ios.ios_vlans:
    config:
      - vlan_id: 100
        name: SERVEURS
        state: active
\`\`\`

### Avantages de l'IaC

| Avantage | Description |
|----------|-------------|
| **Versionnement** | Git garde l'historique de toutes les modifications |
| **Reproductibilite** | Meme fichier = meme resultat, a chaque fois |
| **Collaboration** | Pull requests, code review avant deploiement |
| **Tests** | On peut tester en lab avant production |
| **Rollback** | Revenir a une version anterieure via Git |
| **Documentation** | Le code EST la documentation |

### Workflow IaC typique

\`\`\`
1. Ecrire/modifier le code (YAML, JSON, HCL)
2. Commit + Push sur Git (branche feature)
3. Pull Request → Code review par un pair
4. Tests automatiques en lab virtuel (CI)
5. Merge dans la branche main
6. Deploiement automatique en production (CD)
7. Verification post-deploiement
\`\`\`

> **Point CCNA :** L'IaC traite l'infrastructure reseau comme du code logiciel : versionnee, testee, reproductible. Le modele **declaratif** (Ansible) est prefere au modele imperatif car il garantit un **etat final** coherent.`
      },
      {
        title: 'Ansible pour l\'automatisation reseau',
        content: `**Ansible** est l'outil d'automatisation le plus utilise pour les reseaux. Il est **agentless** (pas de logiciel a installer sur les equipements), utilise **SSH** pour se connecter et des fichiers **YAML** pour decrire les taches.

### Pourquoi Ansible pour le reseau ?

| Caracteristique | Detail |
|----------------|--------|
| **Agentless** | Pas d'agent a installer sur les switches/routeurs |
| **SSH natif** | Utilise SSH, deja present sur tous les equipements |
| **YAML** | Syntaxe lisible par un humain |
| **Modules Cisco** | Collections dediees (cisco.ios, cisco.nxos, cisco.aci) |
| **Idempotent** | Relancer le playbook ne change rien si l'etat est deja bon |
| **Push model** | C'est Ansible qui pousse la config (pas de pull) |

### Structure d'un projet Ansible

\`\`\`
mon-projet-reseau/
├── inventory.yml          # Liste des equipements
├── playbook-vlans.yml     # Taches a executer
├── group_vars/
│   ├── switches.yml       # Variables pour les switches
│   └── routeurs.yml       # Variables pour les routeurs
└── roles/
    └── base-config/       # Role reutilisable
        └── tasks/
            └── main.yml
\`\`\`

### Fichier d'inventaire

\`\`\`yaml
# inventory.yml
all:
  children:
    switches:
      hosts:
        sw-core-01:
          ansible_host: 10.0.1.1
        sw-core-02:
          ansible_host: 10.0.1.2
        sw-access-01:
          ansible_host: 10.0.2.1
      vars:
        ansible_network_os: cisco.ios.ios
        ansible_connection: ansible.netcommon.network_cli
        ansible_user: admin
        ansible_password: secret123
\`\`\`

### Playbook : deployer des VLANs

\`\`\`yaml
# playbook-vlans.yml
---
- name: Deployer les VLANs sur tous les switches
  hosts: switches
  gather_facts: no
  tasks:
    - name: Creer VLAN 100 - Serveurs
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 100
            name: SERVEURS
            state: active

    - name: Creer VLAN 200 - Utilisateurs
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 200
            name: UTILISATEURS
            state: active

    - name: Sauvegarder la configuration
      cisco.ios.ios_config:
        save_when: modified
\`\`\`

### Execution

\`\`\`bash
# Lancer le playbook
ansible-playbook -i inventory.yml playbook-vlans.yml

# Mode check (dry-run, ne modifie rien)
ansible-playbook -i inventory.yml playbook-vlans.yml --check

# Limiter a un seul equipement
ansible-playbook -i inventory.yml playbook-vlans.yml --limit sw-core-01
\`\`\`

> **Point CCNA :** Ansible est l'outil d'automatisation reseau le plus cite au CCNA. Retenez : **agentless, SSH, YAML, push model, idempotent**. Un playbook est une liste de taches a executer sur un inventaire d'equipements.`
      },
      {
        title: 'Python pour l\'automatisation reseau',
        content: `**Python** est le langage de programmation de reference pour l'automatisation reseau. Trois bibliotheques sont particulierement importantes pour le CCNA.

### Netmiko

Netmiko est une bibliotheque Python qui simplifie la connexion SSH aux equipements reseau multi-constructeurs.

\`\`\`python
from netmiko import ConnectHandler

# Connexion a un switch Cisco
device = {
    "device_type": "cisco_ios",
    "host": "10.0.1.1",
    "username": "admin",
    "password": "secret123",
}

# Se connecter et envoyer une commande show
connection = ConnectHandler(**device)
output = connection.send_command("show ip interface brief")
print(output)

# Envoyer des commandes de configuration
config_commands = [
    "interface GigabitEthernet0/1",
    "description Lien vers serveur",
    "switchport mode access",
    "switchport access vlan 100",
    "no shutdown",
]
connection.send_config_set(config_commands)
connection.save_config()
connection.disconnect()
\`\`\`

### NAPALM (Network Automation and Programmability Abstraction Layer with Multivendor support)

NAPALM fournit une **abstraction multi-constructeur**. Le meme code fonctionne sur Cisco IOS, Juniper JunOS, Arista EOS, etc.

\`\`\`python
from napalm import get_network_driver

# Meme code pour Cisco, Juniper, Arista...
driver = get_network_driver("ios")
device = driver("10.0.1.1", "admin", "secret123")
device.open()

# Recuperer les faits de l'equipement
facts = device.get_facts()
print(f"Hostname: {facts['hostname']}")
print(f"OS: {facts['os_version']}")
print(f"Uptime: {facts['uptime']}")

# Recuperer les interfaces
interfaces = device.get_interfaces()
for name, details in interfaces.items():
    print(f"{name}: {'UP' if details['is_up'] else 'DOWN'}")

# Comparer et appliquer une configuration
device.load_merge_candidate(filename="new_config.txt")
diff = device.compare_config()
print(diff)  # Voir les changements avant d'appliquer
device.commit_config()  # Appliquer
device.close()
\`\`\`

### Paramiko

Paramiko est la bibliotheque SSH bas niveau sur laquelle Netmiko est construit. On l'utilise rarement directement, sauf pour des besoins specifiques.

\`\`\`python
import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("10.0.1.1", username="admin", password="secret123")

stdin, stdout, stderr = ssh.exec_command("show running-config")
print(stdout.read().decode())
ssh.close()
\`\`\`

### Comparaison des bibliotheques Python

| Bibliotheque | Niveau | Multi-constructeur | Use case |
|-------------|--------|-------------------|----------|
| **Paramiko** | Bas (SSH brut) | Manuel | Besoins specifiques SSH |
| **Netmiko** | Moyen (CLI simplifie) | Oui (via device_type) | Scripts CLI rapides |
| **NAPALM** | Haut (abstraction) | Oui (natif) | Abstraction, validation |
| **Nornir** | Framework complet | Via plugins | Projets complexes |

> **Point CCNA :** Python est le langage d'automatisation reseau par defaut. Retenez **Netmiko** (SSH simplifie) et **NAPALM** (abstraction multi-constructeur). Sachez lire un script Python simple d'automatisation reseau.`
      },
      {
        title: 'Terraform et Puppet/Chef',
        content: `Outre Ansible et Python, d'autres outils complètent l'ecosysteme de la gestion de configuration.

### Terraform (HashiCorp)

Terraform est un outil d'**Infrastructure as Code** declaratif specialise dans le **provisioning** d'infrastructure. Contrairement a Ansible qui configure des equipements existants, Terraform **cree et detruit** de l'infrastructure.

\`\`\`hcl
# main.tf - Creer un reseau sur AWS
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "VPC-Production"
  }
}

resource "aws_subnet" "serveurs" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "Subnet-Serveurs"
  }
}
\`\`\`

**Workflow Terraform :**
\`\`\`bash
terraform init      # Telecharger les providers
terraform plan      # Voir ce qui va changer (dry-run)
terraform apply     # Appliquer les changements
terraform destroy   # Supprimer l'infrastructure
\`\`\`

**Terraform gere un fichier d'etat** (\`terraform.tfstate\`) qui connait l'infrastructure actuelle. Il peut calculer les differences entre l'etat actuel et l'etat desire.

### Puppet

Puppet utilise un modele **agent-master** et un langage declaratif proprietaire (Ruby DSL).

\`\`\`puppet
# manifest.pp
node 'switch-01.example.com' {
  cisco_vlan { '100':
    ensure    => present,
    vlan_name => 'SERVEURS',
    state     => 'active',
  }
}
\`\`\`

### Chef

Chef utilise egalement un modele agent-master et des "recipes" ecrites en **Ruby**.

\`\`\`ruby
# recipe.rb
cisco_vlan '100' do
  vlan_name 'SERVEURS'
  action :create
end
\`\`\`

### Comparaison complete des outils

| Critere | Ansible | Terraform | Puppet | Chef |
|---------|---------|-----------|--------|------|
| **Modele** | Push (agentless) | Plan + Apply | Pull (agent) | Pull (agent) |
| **Langage** | YAML | HCL | Puppet DSL | Ruby |
| **Agent requis** | Non | Non | Oui | Oui |
| **Reseau** | Excellent | Moyen (cloud) | Moyen | Faible |
| **Cloud** | Bon | Excellent | Bon | Bon |
| **Courbe apprentissage** | Facile | Moyenne | Difficile | Difficile |
| **Communaute reseau** | Tres active | Croissante | Limitee | Limitee |
| **Idempotent** | Oui | Oui | Oui | Oui |
| **Etat** | Sans etat | Fichier d'etat | Base de donnees | Base de donnees |

### Quand utiliser quoi ?

| Besoin | Outil recommande |
|--------|-----------------|
| Configurer des switches/routeurs | **Ansible** |
| Provisionner du cloud (AWS, Azure) | **Terraform** |
| Scripts specifiques, collecte de donnees | **Python (Netmiko/NAPALM)** |
| Environnement Windows/Linux massif | **Puppet** |
| Pipelines CI/CD avec tests reseau | **Ansible + Python** |

> **Point CCNA :** Pour l'examen, la priorite est **Ansible** (agentless, YAML, reseau) et **Terraform** (IaC, cloud). Retenez que Puppet et Chef necessitent un **agent** installe sur les machines gerees, contrairement a Ansible.`
      },
      {
        title: 'Comparaison et choix d\'outils',
        content: `En pratique, les entreprises combinent plusieurs outils selon leurs besoins. Voici un guide pour comprendre comment ces outils s'articulent dans un environnement reseau reel.

### Stack d'automatisation type

\`\`\`
┌───────────────────────────────────────────┐
│          Orchestration / CI-CD            │
│    (Jenkins, GitLab CI, GitHub Actions)   │
└────────────────────┬──────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────┴────┐  ┌───┴────┐  ┌───┴──────┐
   │ Ansible │  │Terraform│  │  Python  │
   │ Config  │  │ Infra   │  │ Scripts  │
   │ reseau  │  │ cloud   │  │ custom   │
   └────┬────┘  └───┬────┘  └───┬──────┘
        │           │            │
        └───────────┼────────────┘
                    │
            Equipements reseau
            + Cloud (AWS, Azure)
\`\`\`

### Scenario reel : deploiement d'un nouveau site

\`\`\`
1. TERRAFORM cree l'infrastructure cloud :
   - VPN site-to-site vers le datacenter
   - Sous-reseaux dans le VPC AWS
   - Security Groups (firewall cloud)

2. ANSIBLE configure les equipements sur site :
   - VLANs sur les switches
   - Interfaces et routage sur le routeur
   - Politiques de securite sur le firewall
   - Wi-Fi sur le WLC

3. PYTHON (scripts custom) :
   - Verification post-deploiement
   - Tests de connectivite automatises
   - Generation de rapports
   - Integration avec le CMDB
\`\`\`

### Matrice de decision

| Question | Si oui → |
|----------|---------|
| Je dois configurer des switches/routeurs Cisco ? | **Ansible** |
| Je dois creer de l'infra cloud ? | **Terraform** |
| Je dois collecter et analyser des donnees reseau ? | **Python** |
| Je dois un outil simple, sans agent ? | **Ansible** |
| J'ai besoin de gerer un etat d'infrastructure ? | **Terraform** |
| J'ai des besoins tres specifiques ? | **Python** |
| Je veux tout-en-un pour le reseau ? | **Ansible + Python** |

### Bonnes pratiques IaC

1. **Tout dans Git** : aucune modification manuelle en production
2. **Branches** : une branche par changement, pull request obligatoire
3. **Tests** : tester en lab (CML, GNS3) avant la production
4. **Secrets** : utiliser un vault (Ansible Vault, HashiCorp Vault) pour les mots de passe
5. **Documentation** : le code est la doc, mais ajouter des commentaires clairs
6. **Idempotence** : s'assurer que relancer le script ne casse rien
7. **Rollback** : prevoir une procedure de retour en arriere

> **Pour l'examen CCNA :** L'important n'est pas de maitriser chaque outil en profondeur, mais de comprendre leurs **roles respectifs**, leurs **avantages** et quand les utiliser. Retenez surtout Ansible (agentless, YAML, reseau) et le concept d'**Infrastructure as Code**.`
      }
    ]
  },
  {
    id: 49,
    slug: 'json-interpretation',
    title: 'JSON : Lire et interpreter',
    subtitle: 'Syntaxe JSON, parsing Python et interpretation de reponses API',
    icon: 'FileJson',
    color: '#06b6d4',
    duration: '35 min',
    level: 'Debutant',
    videoId: 'T0DmHRdtqY0',
    sections: [
      {
        title: 'Syntaxe JSON',
        content: `**JSON** (JavaScript Object Notation) est un format de donnees textuel, lisible par l'humain et par les machines. C'est le format standard pour les API REST et un sujet explicite du CCNA 200-301.

### Regles de syntaxe

1. Les donnees sont organisees en **paires cle/valeur**
2. Les cles sont toujours des **strings entre guillemets doubles**
3. Les valeurs peuvent etre : string, number, boolean, null, object, array
4. Les objets sont entre **accolades** \`{}\`
5. Les tableaux sont entre **crochets** \`[]\`
6. Les elements sont separes par des **virgules**

### Objet JSON

Un objet est une collection non ordonnee de paires cle:valeur.

\`\`\`json
{
  "hostname": "SW-CORE-01",
  "ip": "10.0.1.1",
  "model": "C9300-48U",
  "ports": 48,
  "managed": true,
  "location": null
}
\`\`\`

### Tableau JSON (Array)

Un tableau est une liste ordonnee de valeurs.

\`\`\`json
{
  "vlans": [
    { "id": 10, "name": "DATA" },
    { "id": 20, "name": "VOIX" },
    { "id": 99, "name": "MANAGEMENT" }
  ]
}
\`\`\`

### Imbrication (Nested structures)

JSON permet d'imbriquer des objets et des tableaux a volonte :

\`\`\`json
{
  "device": {
    "hostname": "RTR-01",
    "interfaces": [
      {
        "name": "GigabitEthernet0/0",
        "ip": "10.0.1.1",
        "mask": "255.255.255.0",
        "status": "up",
        "neighbors": [
          {
            "hostname": "SW-CORE-01",
            "port": "Gi1/0/1"
          }
        ]
      },
      {
        "name": "GigabitEthernet0/1",
        "ip": "10.0.2.1",
        "mask": "255.255.255.0",
        "status": "up",
        "neighbors": []
      }
    ]
  }
}
\`\`\`

### Erreurs frequentes en JSON

| Erreur | Exemple incorrect | Correct |
|--------|------------------|---------|
| Guillemets simples | \`{'key': 'value'}\` | \`{"key": "value"}\` |
| Virgule finale | \`{"a": 1, "b": 2,}\` | \`{"a": 1, "b": 2}\` |
| Cle sans guillemets | \`{hostname: "SW1"}\` | \`{"hostname": "SW1"}\` |
| Commentaires | \`// ceci est un commentaire\` | Non supporte en JSON |

> **Point CCNA :** JSON utilise **uniquement des guillemets doubles** pour les strings. Les guillemets simples, les virgules finales et les commentaires ne sont **pas valides** en JSON.`
      },
      {
        title: 'JSON vs XML vs YAML',
        content: `Trois formats de donnees sont couramment utilises dans l'automatisation reseau. Le CCNA se concentre sur JSON mais il est utile de connaitre les differences.

### Le meme contenu dans 3 formats

**JSON :**
\`\`\`json
{
  "interface": {
    "name": "GigabitEthernet0/1",
    "ip": "10.0.1.1",
    "mask": "255.255.255.0",
    "enabled": true,
    "vlans": [10, 20, 30]
  }
}
\`\`\`

**XML :**
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
  <name>GigabitEthernet0/1</name>
  <ip>10.0.1.1</ip>
  <mask>255.255.255.0</mask>
  <enabled>true</enabled>
  <vlans>
    <vlan>10</vlan>
    <vlan>20</vlan>
    <vlan>30</vlan>
  </vlans>
</interface>
\`\`\`

**YAML :**
\`\`\`yaml
interface:
  name: GigabitEthernet0/1
  ip: 10.0.1.1
  mask: 255.255.255.0
  enabled: true
  vlans:
    - 10
    - 20
    - 30
\`\`\`

### Comparaison detaillee

| Critere | JSON | XML | YAML |
|---------|------|-----|------|
| **Lisibilite** | Bonne | Moyenne (verbeux) | Excellente |
| **Taille** | Compact | Le plus lourd | Le plus compact |
| **Types natifs** | string, number, bool, null, array, object | Tout est texte | string, int, float, bool, null, list, map |
| **Commentaires** | Non | Oui (\`<!-- -->\`) | Oui (\`#\`) |
| **Schema** | JSON Schema | XSD, DTD | Pas de standard |
| **Utilise par** | API REST, JavaScript | NETCONF, SOAP, legacy | Ansible, Kubernetes, Docker |
| **Parsing** | Natif en JS, simple partout | Bibliotheques XML | Bibliotheques YAML |

### Ou chaque format est utilise dans le reseau

| Contexte | Format |
|----------|--------|
| API REST (DNA Center, Meraki) | **JSON** |
| NETCONF (config d'equipements) | **XML** |
| RESTCONF (config d'equipements) | **JSON** ou XML |
| Ansible (playbooks) | **YAML** |
| Terraform | **HCL** (mais supporte JSON) |
| Kubernetes | **YAML** |
| Reponses SNMP | **MIB** (format specifique) |

### Conversions

Il est courant de convertir entre formats :

\`\`\`python
import json
import yaml

# JSON vers dictionnaire Python
data = json.loads('{"hostname": "SW1", "vlans": [10, 20]}')

# Dictionnaire Python vers YAML
print(yaml.dump(data))
# hostname: SW1
# vlans:
# - 10
# - 20

# Dictionnaire Python vers JSON
print(json.dumps(data, indent=2))
\`\`\`

> **Point CCNA :** JSON est le format par defaut des API REST. XML est utilise par NETCONF. YAML est utilise par Ansible. L'examen se concentre sur JSON mais peut mentionner XML dans le contexte NETCONF.`
      },
      {
        title: 'Parser du JSON avec Python',
        content: `Savoir lire et manipuler du JSON avec Python est une competence testee au CCNA 200-301. Le module \`json\` de Python rend cette tache simple.

### Charger du JSON

\`\`\`python
import json

# Depuis une chaine de caracteres (string)
json_string = '{"hostname": "SW-01", "ip": "10.0.1.1", "vlans": [10, 20, 30]}'
data = json.loads(json_string)
print(type(data))    # <class 'dict'>
print(data["hostname"])  # SW-01

# Depuis un fichier
with open("device.json", "r") as f:
    data = json.load(f)    # json.load (sans 's') pour les fichiers
\`\`\`

### Acceder aux donnees

\`\`\`python
# JSON d'exemple (reponse API DNA Center)
response = {
    "response": [
        {
            "hostname": "SW-CORE-01",
            "managementIpAddress": "10.0.1.1",
            "platformId": "C9300-48U",
            "softwareVersion": "17.6.3",
            "reachabilityStatus": "Reachable",
            "interfaces": [
                {"name": "Gi1/0/1", "status": "up", "vlanId": 10},
                {"name": "Gi1/0/2", "status": "down", "vlanId": 20}
            ]
        },
        {
            "hostname": "SW-CORE-02",
            "managementIpAddress": "10.0.1.2",
            "platformId": "C9300-48U",
            "softwareVersion": "17.6.3",
            "reachabilityStatus": "Reachable",
            "interfaces": [
                {"name": "Gi1/0/1", "status": "up", "vlanId": 10}
            ]
        }
    ]
}

# Acceder au premier equipement
device1 = response["response"][0]
print(device1["hostname"])           # SW-CORE-01
print(device1["managementIpAddress"])  # 10.0.1.1

# Acceder a une interface specifique
first_interface = device1["interfaces"][0]
print(first_interface["name"])       # Gi1/0/1
print(first_interface["status"])     # up

# Boucler sur tous les equipements
for device in response["response"]:
    print(f"{device['hostname']} - {device['managementIpAddress']} - {device['reachabilityStatus']}")
\`\`\`

**Resultat :**
\`\`\`
SW-CORE-01 - 10.0.1.1 - Reachable
SW-CORE-02 - 10.0.1.2 - Reachable
\`\`\`

### Ecrire du JSON

\`\`\`python
import json

# Dictionnaire Python vers string JSON
data = {
    "hostname": "NEW-SW-01",
    "vlans": [100, 200, 300],
    "location": {"site": "Paris", "building": "HQ"}
}

# Conversion avec indentation pour la lisibilite
json_output = json.dumps(data, indent=2)
print(json_output)

# Ecrire dans un fichier
with open("output.json", "w") as f:
    json.dump(data, f, indent=2)
\`\`\`

### Fonctions cles du module json

| Fonction | Direction | Source/Destination |
|----------|----------|-------------------|
| \`json.loads()\` | JSON string → Python dict | String en memoire |
| \`json.load()\` | JSON file → Python dict | Fichier |
| \`json.dumps()\` | Python dict → JSON string | String en memoire |
| \`json.dump()\` | Python dict → JSON file | Fichier |

> **Astuce CCNA :** Retenez la difference : \`loads\` / \`dumps\` (avec **s** = **s**tring) travaillent avec des chaines de caracteres. \`load\` / \`dump\` (sans s) travaillent avec des **fichiers**.`
      },
      {
        title: 'Interpreter les reponses JSON d\'API Cisco',
        content: `L'examen CCNA peut vous presenter une reponse JSON d'une API Cisco et vous demander d'en extraire des informations. Entrainons-nous avec des exemples reels.

### Exemple 1 : Liste d'equipements (DNA Center)

\`\`\`json
{
  "response": [
    {
      "id": "a1b2c3d4",
      "hostname": "RTR-PARIS-01",
      "type": "Cisco ISR 4331",
      "managementIpAddress": "10.1.0.1",
      "softwareVersion": "17.3.4",
      "role": "BORDER ROUTER",
      "upTime": "120 days",
      "reachabilityStatus": "Reachable",
      "errorCode": null
    },
    {
      "id": "e5f6g7h8",
      "hostname": "SW-PARIS-01",
      "type": "Cisco Catalyst 9300",
      "managementIpAddress": "10.1.0.10",
      "softwareVersion": "17.6.3",
      "role": "ACCESS",
      "upTime": "45 days",
      "reachabilityStatus": "Reachable",
      "errorCode": null
    }
  ],
  "version": "1.0"
}
\`\`\`

**Questions type examen :**
- Quel est le hostname du routeur ? → \`response[0].hostname\` = **RTR-PARIS-01**
- Quelle est la version IOS du switch ? → \`response[1].softwareVersion\` = **17.6.3**
- Combien d'equipements dans la reponse ? → \`len(response)\` = **2**
- Le routeur est-il joignable ? → \`response[0].reachabilityStatus\` = **Reachable**

### Exemple 2 : Interfaces d'un equipement

\`\`\`json
{
  "response": [
    {
      "interfaceType": "Physical",
      "portName": "GigabitEthernet1/0/1",
      "adminStatus": "UP",
      "status": "up",
      "speed": "1000000",
      "duplex": "FullDuplex",
      "ipv4Address": "10.0.1.1",
      "ipv4Mask": "255.255.255.0",
      "vlanId": "10",
      "description": "Lien vers serveur web"
    },
    {
      "interfaceType": "Physical",
      "portName": "GigabitEthernet1/0/2",
      "adminStatus": "UP",
      "status": "down",
      "speed": null,
      "duplex": null,
      "ipv4Address": null,
      "ipv4Mask": null,
      "vlanId": "20",
      "description": "Libre"
    }
  ]
}
\`\`\`

**Questions type examen :**
- Quel est le statut de Gi1/0/2 ? → **down** (adminStatus UP mais status down = cable debranche)
- Quelle est l'adresse IP de Gi1/0/1 ? → **10.0.1.1**
- Pourquoi speed est \`null\` sur Gi1/0/2 ? → L'interface est **down**, pas de vitesse negociee

### Exemple 3 : Script Python complet

\`\`\`python
import requests
import json

# Authentification DNA Center
auth_url = "https://dna-center/api/system/v1/auth/token"
auth_response = requests.post(auth_url, auth=("admin", "password"), verify=False)
token = auth_response.json()["Token"]

# Recuperer les equipements
headers = {
    "X-Auth-Token": token,
    "Content-Type": "application/json"
}
devices_url = "https://dna-center/api/v1/network-device"
response = requests.get(devices_url, headers=headers, verify=False)
devices = response.json()["response"]

# Afficher les equipements non joignables
for device in devices:
    if device["reachabilityStatus"] != "Reachable":
        print(f"ALERTE: {device['hostname']} ({device['managementIpAddress']}) - {device['reachabilityStatus']}")
\`\`\`

> **Conseil CCNA :** Entraiez-vous a lire du JSON et a naviguer dans les structures imbriquees. L'examen presente souvent un bloc JSON et demande d'identifier une valeur specifique.`
      },
      {
        title: 'L\'outil jq pour manipuler le JSON en CLI',
        content: `**jq** est un outil en ligne de commandes qui permet de filtrer, transformer et formater du JSON directement dans le terminal. C'est l'equivalent de \`grep\` et \`awk\` pour le JSON.

### Installation

\`\`\`bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# CentOS/RHEL
sudo yum install jq
\`\`\`

### Syntaxe de base

\`\`\`bash
# Formater (pretty-print) du JSON
echo '{"hostname":"SW1","ip":"10.0.1.1"}' | jq '.'

# Resultat :
{
  "hostname": "SW1",
  "ip": "10.0.1.1"
}
\`\`\`

### Extraire des valeurs

\`\`\`bash
# Fichier devices.json
cat devices.json | jq '.response[0].hostname'
# "SW-CORE-01"

# Sans les guillemets (raw output)
cat devices.json | jq -r '.response[0].hostname'
# SW-CORE-01

# Extraire l'IP de tous les equipements
cat devices.json | jq -r '.response[].managementIpAddress'
# 10.0.1.1
# 10.0.1.2
# 10.0.1.3
\`\`\`

### Filtrer les resultats

\`\`\`bash
# Equipements non joignables
cat devices.json | jq '.response[] | select(.reachabilityStatus != "Reachable")'

# Interfaces en status "down"
cat interfaces.json | jq '.response[] | select(.status == "down") | .portName'

# Equipements avec une version specifique
cat devices.json | jq '.response[] | select(.softwareVersion | startswith("17.6"))'
\`\`\`

### Construire un nouveau JSON

\`\`\`bash
# Creer un tableau simplifie [hostname, ip]
cat devices.json | jq '[.response[] | {host: .hostname, ip: .managementIpAddress}]'

# Resultat :
[
  { "host": "SW-CORE-01", "ip": "10.0.1.1" },
  { "host": "SW-CORE-02", "ip": "10.0.1.2" }
]
\`\`\`

### Combiner avec curl pour les API

\`\`\`bash
# Recuperer les equipements et filtrer en une commande
curl -s -X GET "https://dna-center/api/v1/network-device" \\
  -H "X-Auth-Token: $TOKEN" \\
  -H "Content-Type: application/json" | \\
  jq -r '.response[] | "\\(.hostname) - \\(.managementIpAddress) - \\(.reachabilityStatus)"'

# Resultat :
# SW-CORE-01 - 10.0.1.1 - Reachable
# SW-CORE-02 - 10.0.1.2 - Reachable
# RTR-WAN-01 - 10.0.0.1 - Unreachable
\`\`\`

### Commandes jq essentielles

| Commande | Description |
|----------|-------------|
| \`.\` | Objet racine |
| \`.key\` | Acceder a une cle |
| \`.[0]\` | Premier element d'un tableau |
| \`.[] \` | Iterer sur tous les elements |
| \`select(.key == "val")\` | Filtrer |
| \`{a: .x, b: .y}\` | Construire un nouvel objet |
| \`length\` | Nombre d'elements |
| \`keys\` | Liste des cles d'un objet |
| \`-r\` | Sortie brute (sans guillemets) |

> **Point CCNA :** jq n'est pas directement teste au CCNA, mais c'est un outil incontournable en pratique pour travailler avec les API REST. Si une question d'examen montre du JSON, les competences de lecture JSON acquises avec jq sont directement applicables.`
      }
    ]
  }
]
