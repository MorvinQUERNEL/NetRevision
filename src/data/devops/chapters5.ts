import type { Chapter } from '../chapters'

export const chapters: Chapter[] = [
  {
    id: 125,
    slug: 'cloud-fondamentaux',
    title: 'Fondamentaux du Cloud',
    subtitle: 'Comprendre le cloud computing, ses modeles de service et de deploiement',
    icon: 'Cloud',
    color: '#3b82f6',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'y8daXUShj54',
    sections: [
      {
        title: 'Cloud computing definition',
        content: `Le **cloud computing** est un modele de fourniture de ressources informatiques (serveurs, stockage, bases de donnees, reseau, logiciels) a la demande via Internet, avec une facturation a l'usage.

### Definition officielle du NIST

Le **NIST** (National Institute of Standards and Technology) definit le cloud computing selon **5 caracteristiques essentielles** :

| Caracteristique | Description |
|-----------------|-------------|
| **Self-service a la demande** | L'utilisateur provisionne des ressources sans interaction humaine avec le fournisseur |
| **Acces reseau universel** | Les services sont accessibles via Internet depuis n'importe quel appareil |
| **Mutualisation des ressources** | Les ressources physiques sont partagees entre plusieurs clients (multi-tenant) |
| **Elasticite rapide** | Les ressources peuvent etre augmentees ou reduites rapidement, souvent automatiquement |
| **Service mesure** | L'utilisation est mesuree et facturee selon la consommation reelle |

### Avant le cloud : le modele on-premise

\`\`\`
On-premise (traditionnel)           Cloud
─────────────────────────           ─────
Achat de serveurs physiques         Location de ressources virtuelles
Salle serveur / datacenter          Datacenters du fournisseur
Investissement initial eleve        Paiement a l'usage (OpEx)
  (CapEx)
Delai de provisionnement :          Provisionnement en minutes
  semaines/mois
Maintenance materielle a charge     Maintenance geree par le provider
Capacite fixe (sur/sous-dim.)      Elasticite automatique
\`\`\`

### CapEx vs OpEx

- **CapEx** (Capital Expenditure) : achat de materiel, immobilise sur plusieurs annees. Modele on-premise
- **OpEx** (Operational Expenditure) : depenses d'exploitation, paiement mensuel/horaire. Modele cloud

Le cloud transforme les depenses d'investissement (CapEx) en depenses operationnelles (OpEx), ce qui offre une plus grande flexibilite financiere.

### Economies d'echelle

Les cloud providers operent a une echelle massive. AWS possede des millions de serveurs repartis dans des dizaines de regions. Cette echelle leur permet de :

- Negocier des prix inferieurs sur le materiel
- Optimiser la consommation energetique
- Mutualiser les couts d'infrastructure entre des milliers de clients
- Investir massivement en R&D (hardware custom, refroidissement avance)

> **Chiffre cle :** Selon Gartner, les depenses mondiales en cloud public ont depasse **500 milliards de dollars** en 2023. D'ici 2027, plus de 70% des workloads d'entreprise seront sur le cloud. Comprendre le cloud est donc une competence essentielle pour tout professionnel IT.`
      },
      {
        title: 'Modeles de service (IaaS/PaaS/SaaS)',
        content: `Le cloud computing se decline en trois modeles de service principaux, chacun offrant un niveau d'abstraction different.

### Les trois modeles

\`\`\`
Responsabilite du client ←────────────────────────→ Responsabilite du provider

┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ On-Prem │  │  IaaS   │  │  PaaS   │  │  SaaS   │
├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤
│ App     │  │ App     │  │ App     │  │ ░░░░░░░ │
│ Runtime │  │ Runtime │  │ ░░░░░░░ │  │ ░░░░░░░ │
│ OS      │  │ OS      │  │ ░░░░░░░ │  │ ░░░░░░░ │
│ VM      │  │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │
│ Serveur │  │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │
│ Stockage│  │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │
│ Reseau  │  │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
  Tout a      VM + infra    Tout sauf    Tout gere
  votre       gere par le   l'app        par le
  charge      provider                   provider

░ = gere par le provider
\`\`\`

### IaaS (Infrastructure as a Service)

Le provider fournit l'infrastructure de base : **serveurs virtuels, stockage, reseau**. Vous gerez tout le reste (OS, runtime, application).

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| VMs | EC2 | Virtual Machines | Compute Engine |
| Stockage | S3, EBS | Blob Storage | Cloud Storage |
| Reseau | VPC | VNet | VPC |

\`\`\`bash
# Exemple : lancer une VM sur AWS
aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --instance-type t3.medium \\
  --key-name my-key \\
  --security-group-ids sg-12345
\`\`\`

### PaaS (Platform as a Service)

Le provider gere l'infrastructure **et** la plateforme d'execution. Vous ne deployez que votre **code applicatif**.

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| App hosting | Elastic Beanstalk | App Service | App Engine |
| Conteneurs | ECS, Fargate | Container Apps | Cloud Run |
| Functions | Lambda | Functions | Cloud Functions |
| BDD geree | RDS, Aurora | SQL Database | Cloud SQL |

\`\`\`bash
# Exemple : deployer sur Heroku (PaaS)
git push heroku main
# Le PaaS gere tout : build, runtime, scaling, SSL, etc.
\`\`\`

### SaaS (Software as a Service)

Le provider fournit une **application complete** accessible via un navigateur. L'utilisateur n'a rien a gerer.

- **Exemples** : Gmail, Slack, Salesforce, Microsoft 365, Dropbox
- **Modele** : abonnement mensuel/annuel par utilisateur

> **A retenir :** Plus vous montez dans l'abstraction (IaaS → PaaS → SaaS), moins vous avez de controle mais plus vous gagnez en rapidite de mise en oeuvre. Le choix depend de vos besoins en personnalisation, de vos competences internes et de votre budget.`
      },
      {
        title: 'Modeles de deploiement',
        content: `Le cloud computing propose quatre modeles de deploiement qui definissent **ou** et **comment** l'infrastructure est hebergee.

### Cloud Public

L'infrastructure est entierement detenue et operee par le fournisseur cloud. Les ressources sont partagees entre plusieurs organisations (multi-tenant).

\`\`\`
Cloud Public
┌─────────────────────────────────────┐
│  Fournisseur Cloud (AWS/Azure/GCP)  │
│                                     │
│  ┌─────────┐  ┌─────────┐         │
│  │Client A │  │Client B │  ...     │
│  │(votre   │  │(autre   │          │
│  │ appli)  │  │ client) │          │
│  └─────────┘  └─────────┘         │
│                                     │
│  Infrastructure partagee            │
│  Facturation a l'usage              │
└─────────────────────────────────────┘
\`\`\`

**Avantages** : aucun investissement initial, elasticite, couverture mondiale
**Inconvenients** : moins de controle, latence reseau, conformite reglementaire

### Cloud Prive

L'infrastructure est dediee a une seule organisation, hebergee on-premise ou chez un hebergeur.

\`\`\`
Cloud Prive
┌─────────────────────────────────────┐
│  Votre datacenter / hebergeur      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Votre organisation       │   │
│  │                              │   │
│  │  OpenStack / VMware /        │   │
│  │  Kubernetes on-premise       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Infrastructure dediee              │
│  Controle total                     │
└─────────────────────────────────────┘
\`\`\`

**Avantages** : controle total, securite, conformite (sante, finance, defense)
**Inconvenients** : cout eleve, maintenance a charge, scalabilite limitee

### Cloud Hybride

Combine cloud public et cloud prive, avec une interconnexion entre les deux.

\`\`\`
Cloud Hybride
┌──────────────┐     VPN / Direct Connect     ┌──────────────┐
│ Cloud Prive  │◄────────────────────────────►│ Cloud Public  │
│              │                               │              │
│ Donnees      │                               │ Workloads    │
│ sensibles    │                               │ scalables    │
│ Legacy apps  │                               │ Web apps     │
└──────────────┘                               └──────────────┘
\`\`\`

**Cas d'usage** :
- Donnees sensibles on-premise, applications web sur le cloud public
- Migration progressive vers le cloud (lift & shift)
- Cloud bursting : debordement de charge vers le cloud public

### Multi-Cloud

Utilisation de plusieurs fournisseurs cloud simultanement (ex: AWS + Azure + GCP).

**Avantages** :
- Evite le vendor lock-in
- Best-of-breed : choisir le meilleur service de chaque provider
- Resilience : si un provider tombe, l'autre prend le relais

**Inconvenients** :
- Complexite operationnelle accrue
- Competences a maintenir sur plusieurs plateformes
- Transfert de donnees inter-cloud couteux

> **Tendance actuelle :** La majorite des grandes entreprises adoptent une strategie **hybride** ou **multi-cloud**. Selon une etude Flexera 2024, 87% des entreprises ont une strategie multi-cloud. Les outils comme **Terraform** et **Kubernetes** facilitent cette approche en fournissant une couche d'abstraction au-dessus des providers.`
      },
      {
        title: 'Avantages et inconvenients',
        content: `Comprendre les avantages et les inconvenients du cloud computing est essentiel pour prendre des decisions eclairees lors de la conception d'une architecture.

### Avantages du Cloud

**1. Elasticite et scalabilite**

\`\`\`
Charge ponctuelle (Black Friday, lancement produit) :

On-premise :  ████████████████████  (surprovisionne 364 jours/an)
Cloud :       ████ → ████████████████████ → ████  (scale up/down)
\`\`\`

Le cloud permet de scaler en minutes, pas en semaines. Vous ne payez que ce que vous consommez.

**2. Agilite et time-to-market**

- Provisionnement en minutes au lieu de semaines
- Experimentation a faible cout (tester, echouer, iterer rapidement)
- Acces a des services avances (ML, IoT, Big Data) sans expertise materielle

**3. Disponibilite et resilience**

- Regions multiples a travers le monde
- SLA eleves (99.99% pour de nombreux services)
- Backup et disaster recovery integres

**4. Securite**

Contrairement aux idees recues, les cloud providers investissent massivement en securite :
- Certifications : ISO 27001, SOC 2, PCI DSS, HIPAA
- Chiffrement natif (au repos et en transit)
- Equipes de securite dediees 24/7
- Mises a jour automatiques

**5. Innovation continue**

Les cloud providers ajoutent des centaines de services et fonctionnalites chaque annee. Vous beneficiez automatiquement des dernieres innovations sans investissement supplementaire.

### Inconvenients du Cloud

**1. Dependance au fournisseur (vendor lock-in)**

\`\`\`
Services proprietaires qui creent du lock-in :
- AWS Lambda → code couple a l'API AWS
- Azure Cosmos DB → API et SDK specifiques
- GCP BigQuery → syntaxe SQL etendue proprietaire
\`\`\`

**2. Couts imprevisibles**

- Facturation complexe (CPU, RAM, stockage, reseau, requetes...)
- Le trafic sortant (egress) est souvent couteux
- Les couts peuvent exploser sans monitoring

**3. Latence reseau**

- Les donnees transitent par Internet (latence vs on-premise)
- Pour les applications temps reel ultra-sensibles, le cloud peut ne pas convenir

**4. Conformite reglementaire**

- Certaines reglementations imposent la localisation des donnees (RGPD, souverainete)
- Les secteurs reglementes (sante, defense) ont des contraintes strictes

**5. Complexite operationnelle**

- L'etendue des services disponibles peut etre ecrasante
- Necessite des competences cloud specifiques
- La gestion multi-cloud ajoute de la complexite

### Quand choisir le Cloud vs On-Premise

| Critere | Cloud | On-Premise |
|---------|-------|------------|
| Charge variable | Ideal (elasticite) | Surdimensionnement necessaire |
| Budget initial | Faible (OpEx) | Eleve (CapEx) |
| Conformite stricte | Verifier par region | Controle total |
| Equipe IT reduite | Ideal (services geres) | Risque (tout a maintenir) |
| Applications legacy | Migration complexe | Adapter l'existant |

> **Conseil pratique :** La migration vers le cloud n'est pas un choix binaire. Commencez par les workloads les plus adaptes (applications web stateless, environnements de dev/test) et gardez les systemes critiques on-premise si necessaire. Utilisez un modele hybride comme transition.`
      },
      {
        title: 'Comparaison des fournisseurs',
        content: `Les trois principaux fournisseurs de cloud public sont **AWS** (Amazon), **Azure** (Microsoft) et **GCP** (Google). Chacun a ses forces et ses cas d'usage privilegies.

### Parts de marche (2024)

\`\`\`
AWS      ──────────────────────────────  31%
Azure    ─────────────────────           25%
GCP      ────────────                    11%
Alibaba  ─────                           5%
Autres   ─────────────────               28%
\`\`\`

### Comparaison des services cles

| Categorie | AWS | Azure | GCP |
|-----------|-----|-------|-----|
| **Compute** | EC2, Lambda | VMs, Functions | Compute Engine, Cloud Functions |
| **Containers** | EKS, ECS, Fargate | AKS, Container Apps | GKE, Cloud Run |
| **Stockage objet** | S3 | Blob Storage | Cloud Storage |
| **BDD relationnelle** | RDS, Aurora | SQL Database | Cloud SQL, Spanner |
| **BDD NoSQL** | DynamoDB | Cosmos DB | Firestore, Bigtable |
| **Messaging** | SQS, SNS | Service Bus | Pub/Sub |
| **CDN** | CloudFront | CDN | Cloud CDN |
| **DNS** | Route 53 | DNS | Cloud DNS |
| **IAM** | IAM | Entra ID (AAD) | Cloud IAM |
| **IaC** | CloudFormation | ARM/Bicep | Deployment Manager |

### Forces par fournisseur

**AWS — Leader historique**
- Catalogue le plus complet (+200 services)
- Le plus mature et le plus adopte
- Ecosysteme de partenaires et de certifications le plus large
- Fort sur : EC2, S3, Lambda, DynamoDB, EKS

**Azure — Integration Microsoft**
- Integration native avec l'ecosysteme Microsoft (Active Directory, Office 365, .NET)
- Fort sur les environnements entreprise et hybrides
- Azure DevOps : plateforme CI/CD integree
- Fort sur : VMs Windows, AKS, SQL Database, Azure AD

**GCP — Innovation data/ML**
- Infrastructure reseau mondiale (backbone fibre Google)
- Leader sur les technologies data et ML (BigQuery, TensorFlow, Vertex AI)
- Kubernetes natif (Google a cree K8s, GKE est le service K8s le plus avance)
- Fort sur : GKE, BigQuery, Pub/Sub, Spanner

### Criteres de choix

\`\`\`yaml
# Grille de decision simplifiee
ecosystem_microsoft:     Azure   # Active Directory, O365, .NET
kubernetes_natif:        GCP     # GKE est le meilleur K8s manage
catalogue_plus_large:    AWS     # 200+ services
data_ml:                 GCP     # BigQuery, Vertex AI
startup_credits:         Tous    # Programmes de credits gratuits
equipe_existante:        Celui que l'equipe connait deja
\`\`\`

### Certifications professionnelles

| Niveau | AWS | Azure | GCP |
|--------|-----|-------|-----|
| Fondamental | Cloud Practitioner | AZ-900 | Cloud Digital Leader |
| Associe | Solutions Architect | AZ-104 | Associate Cloud Engineer |
| Professionnel | DevOps Engineer | AZ-400 | Professional Cloud DevOps |

> **Conseil :** Ne choisissez pas un cloud provider uniquement sur les fonctionnalites. Prenez en compte les competences de votre equipe, l'ecosysteme existant (Microsoft shop → Azure), les couts pour votre profil d'utilisation, et la presence geographique des regions.`
      }
    ]
  },
  {
    id: 126,
    slug: 'aws-services',
    title: 'AWS - Services Essentiels',
    subtitle: 'Decouvrir les services fondamentaux d\'Amazon Web Services',
    icon: 'Cloud',
    color: '#3b82f6',
    duration: '50 min',
    level: 'Intermediaire',
    videoId: 'lUMhs2rA2Sc',
    sections: [
      {
        title: 'EC2 et compute',
        content: `**Amazon EC2** (Elastic Compute Cloud) est le service de calcul fondamental d'AWS. Il permet de lancer des serveurs virtuels (instances) a la demande.

### Types d'instances

AWS propose des dizaines de types d'instances, organises en familles selon leur usage :

| Famille | Prefix | Usage | Exemple |
|---------|--------|-------|---------|
| **General Purpose** | t3, m5, m6i | Workloads equilibres (web, API) | t3.medium (2 vCPU, 4 Go) |
| **Compute Optimized** | c5, c6i | CPU-intensif (calcul, encoding) | c5.2xlarge (8 vCPU, 16 Go) |
| **Memory Optimized** | r5, r6i, x2 | RAM-intensif (BDD, cache) | r5.xlarge (4 vCPU, 32 Go) |
| **Storage Optimized** | i3, d2 | I/O-intensif (data warehousing) | i3.large (2 vCPU, 15.25 Go) |
| **GPU** | p4, g5 | ML, rendu graphique | p4d.24xlarge (8 GPU A100) |

### Modeles de tarification

\`\`\`
On-Demand          : Paiement a l'heure/seconde, pas d'engagement
Reserved (RI)      : 1 ou 3 ans, jusqu'a -72% vs On-Demand
Savings Plans      : Engagement en $/h, flexible sur les instances
Spot Instances     : Jusqu'a -90%, mais peut etre interrompu a tout moment
\`\`\`

### Lancer une instance EC2

\`\`\`bash
# Via AWS CLI
aws ec2 run-instances \\
  --image-id ami-0c55b159cbfafe1f0 \\
  --instance-type t3.micro \\
  --key-name my-key-pair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-0123456789abcdef0 \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server}]'

# Verifier l'etat
aws ec2 describe-instances --instance-ids i-1234567890abcdef0
\`\`\`

### Autres services compute AWS

| Service | Description | Cas d'usage |
|---------|-------------|-------------|
| **Lambda** | Serverless (Functions as a Service) | API events, traitement ponctuel |
| **ECS** | Orchestration Docker geree | Conteneurs sans K8s |
| **EKS** | Kubernetes manage | Orchestration K8s |
| **Fargate** | Serverless pour conteneurs | Conteneurs sans gerer les noeuds |
| **Lightsail** | VPS simplifie | Petits projets, devs debutants |

> **Bonne pratique :** Utilisez les instances \`t3\` (burstable) pour les workloads a trafic variable (dev, staging, petites API). Pour la production a charge stable, preferez les \`m5\`/\`m6i\` et combinez avec des Reserved Instances ou Savings Plans pour reduire les couts de 40 a 70%.`
      },
      {
        title: 'S3 et stockage',
        content: `**Amazon S3** (Simple Storage Service) est le service de stockage objet d'AWS. Il offre une durabilite de 99.999999999% (11 neuf) et une disponibilite de 99.99%.

### Concepts S3

\`\`\`
S3
├── Bucket (conteneur global, nom unique au monde)
│   ├── Object (fichier + metadonnees)
│   │   ├── Key : images/photo.jpg (chemin)
│   │   ├── Value : contenu du fichier (jusqu'a 5 To)
│   │   ├── Metadata : Content-Type, tags, etc.
│   │   └── Version ID (si versioning active)
│   ├── Object ...
│   └── Object ...
└── Bucket ...
\`\`\`

### Classes de stockage

| Classe | Durabilite | Disponibilite | Cout (Go/mois) | Usage |
|--------|------------|---------------|----------------|-------|
| **Standard** | 11x9 | 99.99% | ~$0.023 | Acces frequent |
| **Intelligent-Tiering** | 11x9 | 99.9% | Auto | Acces impredictible |
| **Standard-IA** | 11x9 | 99.9% | ~$0.0125 | Acces peu frequent |
| **One Zone-IA** | 11x9 | 99.5% | ~$0.01 | Donnees reproductibles |
| **Glacier Instant** | 11x9 | 99.9% | ~$0.004 | Archives, acces instantane |
| **Glacier Deep** | 11x9 | 99.99% | ~$0.00099 | Archives longue duree (12h) |

### Operations S3

\`\`\`bash
# Creer un bucket
aws s3 mb s3://my-unique-bucket-name

# Uploader un fichier
aws s3 cp fichier.txt s3://my-bucket/dossier/fichier.txt

# Synchroniser un repertoire (comme rsync)
aws s3 sync ./dist/ s3://my-bucket/website/ --delete

# Lister les objets
aws s3 ls s3://my-bucket/ --recursive

# Telecharger
aws s3 cp s3://my-bucket/fichier.txt ./local/
\`\`\`

### S3 pour l'hebergement de sites statiques

\`\`\`bash
# Activer le website hosting
aws s3 website s3://my-bucket/ \\
  --index-document index.html \\
  --error-document error.html
\`\`\`

### Autres services de stockage AWS

| Service | Type | Usage |
|---------|------|-------|
| **EBS** | Block storage (disques) | Volumes pour EC2 |
| **EFS** | Systeme de fichiers partage (NFS) | Partage entre instances |
| **FSx** | File systems geres (Windows, Lustre) | Workloads Windows, HPC |

### Lifecycle policies

\`\`\`json
{
  "Rules": [
    {
      "ID": "archive-old-logs",
      "Status": "Enabled",
      "Filter": { "Prefix": "logs/" },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 365 }
    }
  ]
}
\`\`\`

> **Bonne pratique :** Activez toujours le **versioning** sur les buckets critiques et configurez des **lifecycle policies** pour deplacer automatiquement les anciens objets vers des classes de stockage moins cheres. Utilisez \`S3 Intelligent-Tiering\` si vous ne connaissez pas le profil d'acces de vos donnees.`
      },
      {
        title: 'VPC et networking',
        content: `**Amazon VPC** (Virtual Private Cloud) est le service de reseau virtuel d'AWS. Il vous permet de creer un reseau isole dans le cloud avec un controle total sur l'adressage IP, les sous-reseaux, les tables de routage et les passerelles.

### Architecture VPC

\`\`\`
┌─────────────────────────────────── VPC (10.0.0.0/16) ──────────────────────┐
│                                                                             │
│  ┌──────── AZ eu-west-1a ────────┐  ┌──────── AZ eu-west-1b ────────┐    │
│  │                                │  │                                │    │
│  │  ┌── Public Subnet ──────┐   │  │  ┌── Public Subnet ──────┐   │    │
│  │  │  10.0.1.0/24          │   │  │  │  10.0.3.0/24          │   │    │
│  │  │  NAT Gateway          │   │  │  │  ALB                  │   │    │
│  │  │  Bastion Host         │   │  │  │                       │   │    │
│  │  └───────────────────────┘   │  │  └───────────────────────┘   │    │
│  │                                │  │                                │    │
│  │  ┌── Private Subnet ─────┐   │  │  ┌── Private Subnet ─────┐   │    │
│  │  │  10.0.2.0/24          │   │  │  │  10.0.4.0/24          │   │    │
│  │  │  App Servers (EC2)    │   │  │  │  App Servers (EC2)    │   │    │
│  │  │  RDS (primary)        │   │  │  │  RDS (standby)        │   │    │
│  │  └───────────────────────┘   │  │  └───────────────────────┘   │    │
│  └────────────────────────────────┘  └────────────────────────────────┘    │
│                                                                             │
│  Internet Gateway (IGW) ←── Acces Internet pour les subnets publics        │
└─────────────────────────────────────────────────────────────────────────────┘
\`\`\`

### Composants cles

| Composant | Role |
|-----------|------|
| **VPC** | Reseau virtuel isole (CIDR: ex. 10.0.0.0/16 = 65536 IPs) |
| **Subnet** | Sous-reseau dans une AZ. Public (avec route vers IGW) ou Prive |
| **Internet Gateway (IGW)** | Permet l'acces Internet pour les subnets publics |
| **NAT Gateway** | Permet aux instances privees d'acceder a Internet (sortant uniquement) |
| **Route Table** | Regles de routage pour chaque subnet |
| **Security Group** | Firewall stateful au niveau de l'instance |
| **NACL** | Firewall stateless au niveau du subnet |

### Security Groups vs NACLs

\`\`\`
Security Group (instance)          NACL (subnet)
──────────────────────────         ─────────────
Stateful (reponse auto)            Stateless (regles in + out)
Allow only (pas de deny)           Allow + Deny
Evalue toutes les regles            Evalue dans l'ordre (premiere match)
Au niveau de l'ENI                  Au niveau du subnet
\`\`\`

### Creer un VPC avec AWS CLI

\`\`\`bash
# Creer le VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Creer un subnet public
aws ec2 create-subnet \\
  --vpc-id vpc-xxx \\
  --cidr-block 10.0.1.0/24 \\
  --availability-zone eu-west-1a

# Creer un Internet Gateway et l'attacher
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx

# Creer une table de routage avec route vers Internet
aws ec2 create-route \\
  --route-table-id rtb-xxx \\
  --destination-cidr-block 0.0.0.0/0 \\
  --gateway-id igw-xxx
\`\`\`

> **Bonne pratique :** Placez toujours vos bases de donnees et serveurs applicatifs dans des **subnets prives** (sans route vers Internet). Utilisez un **NAT Gateway** pour l'acces Internet sortant et un **Application Load Balancer** (ALB) dans un subnet public pour recevoir le trafic entrant.`
      },
      {
        title: 'IAM et securite',
        content: `**AWS IAM** (Identity and Access Management) est le service de gestion des identites et des acces. Il controle **qui** peut faire **quoi** sur **quelles** ressources AWS.

### Concepts IAM

\`\`\`
IAM
├── Users        → Identites individuelles (personnes)
├── Groups       → Regroupement d'utilisateurs
├── Roles        → Identites temporaires (pour services/apps)
├── Policies     → Documents JSON definissant les permissions
└── MFA          → Authentification multi-facteurs
\`\`\`

### Structure d'une Policy IAM

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnly",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}
\`\`\`

| Element | Description |
|---------|-------------|
| **Effect** | Allow ou Deny |
| **Action** | Les operations autorisees (s3:GetObject, ec2:RunInstances...) |
| **Resource** | Les ARN des ressources concernees |
| **Condition** | Conditions optionnelles (IP source, MFA, heure...) |

### Principe du moindre privilege

\`\`\`
MAUVAIS :
{
  "Effect": "Allow",
  "Action": "*",              ← Acces complet a TOUT AWS
  "Resource": "*"
}

BON :
{
  "Effect": "Allow",
  "Action": "s3:GetObject",   ← Uniquement lecture S3
  "Resource": "arn:aws:s3:::my-bucket/*"  ← Uniquement ce bucket
}
\`\`\`

### IAM Roles pour les services

Les **Roles** sont essentiels pour donner des permissions aux services AWS (EC2, Lambda, EKS) sans stocker de credentials :

\`\`\`bash
# Creer un role pour une instance EC2
aws iam create-role \\
  --role-name EC2-S3-ReadOnly \\
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }]
  }'

# Attacher une policy au role
aws iam attach-role-policy \\
  --role-name EC2-S3-ReadOnly \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
\`\`\`

### Bonnes pratiques IAM

- **Jamais** utiliser le compte root pour les operations quotidiennes
- Activer le **MFA** sur tous les comptes, surtout le root
- Utiliser des **Roles** (pas des access keys) pour les services
- Appliquer le principe du **moindre privilege**
- Utiliser des **Policies gerees** par AWS quand possible
- Faire tourner (rotater) les **access keys** regulierement
- Activer **CloudTrail** pour auditer toutes les actions API

> **Regle d'or :** Ne partagez jamais des credentials AWS (access key + secret key) en dur dans le code, les variables d'environnement ou les fichiers de configuration committes dans Git. Utilisez des **IAM Roles** pour EC2/Lambda/EKS et **AWS SSO** pour les utilisateurs humains.`
      },
      {
        title: 'RDS et bases de donnees',
        content: `**Amazon RDS** (Relational Database Service) est un service de bases de donnees relationnelles gerees. AWS s'occupe des taches d'administration : provisionnement, patching, backups, replicas, failover.

### Moteurs supportes par RDS

| Moteur | Description | Cas d'usage |
|--------|-------------|-------------|
| **MySQL** | Open source, le plus populaire | Applications web, WordPress |
| **PostgreSQL** | Open source, avance | Applications complexes, GIS |
| **MariaDB** | Fork de MySQL | Alternative a MySQL |
| **Oracle** | Entreprise, licence requise | Systemes legacy entreprise |
| **SQL Server** | Microsoft, licence requise | Ecosysteme .NET |
| **Aurora** | AWS proprietaire, compatible MySQL/PostgreSQL | Haute performance, HA |

### Amazon Aurora

**Aurora** est le moteur proprietaire d'AWS, compatible MySQL et PostgreSQL mais avec des performances superieures :

\`\`\`
Aurora vs RDS MySQL standard :
───────────────────────────────
Performance    : 5x plus rapide que MySQL standard
Stockage       : Auto-scaling jusqu'a 128 To
Replicas       : Jusqu'a 15 read replicas (vs 5 pour RDS)
Failover       : < 30 secondes (vs minutes pour RDS)
Disponibilite  : 99.99% (6 copies sur 3 AZ)
\`\`\`

### Architecture RDS Multi-AZ

\`\`\`
┌──── AZ eu-west-1a ────┐  ┌──── AZ eu-west-1b ────┐
│                         │  │                         │
│  ┌─────────────────┐   │  │  ┌─────────────────┐   │
│  │  RDS Primary    │   │  │  │  RDS Standby    │   │
│  │  (read/write)   │──►│  │  │  (synchrone)    │   │
│  │                 │   │  │  │  Failover auto   │   │
│  └─────────────────┘   │  │  └─────────────────┘   │
│                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘
          │
          ▼
    Application
\`\`\`

### Creer une instance RDS

\`\`\`bash
aws rds create-db-instance \\
  --db-instance-identifier my-database \\
  --db-instance-class db.t3.medium \\
  --engine mysql \\
  --engine-version 8.0 \\
  --master-username admin \\
  --master-user-password 'SecureP@ss123' \\
  --allocated-storage 50 \\
  --storage-type gp3 \\
  --multi-az \\
  --vpc-security-group-ids sg-xxx \\
  --db-subnet-group-name my-subnet-group \\
  --backup-retention-period 7 \\
  --storage-encrypted
\`\`\`

### Autres services BDD AWS

| Service | Type | Usage |
|---------|------|-------|
| **DynamoDB** | NoSQL key-value | Applications serverless, temps reel |
| **ElastiCache** | Cache en memoire (Redis/Memcached) | Sessions, cache applicatif |
| **DocumentDB** | NoSQL document (compatible MongoDB) | Applications document-oriented |
| **Neptune** | Graph database | Reseaux sociaux, recommandations |
| **Redshift** | Data warehouse | Analytics, BI |
| **Timestream** | Time series | IoT, metriques, logs |

### Bonnes pratiques RDS

\`\`\`yaml
# Checklist securite et performance RDS
securite:
  - Placer dans un subnet prive (pas d'acces public)
  - Chiffrement au repos (KMS) active
  - Chiffrement en transit (SSL/TLS) force
  - Security Group restrictif (port 3306 uniquement depuis l'app)
  - Pas de credentials en dur dans le code (utiliser Secrets Manager)

performance:
  - Multi-AZ pour la haute disponibilite
  - Read Replicas pour la scalabilite en lecture
  - Performance Insights pour le monitoring
  - Instance class adaptee a la charge

backup:
  - Backup automatique active (retention 7-35 jours)
  - Snapshots manuels avant les maintenances
  - Tester regulierement la restauration
\`\`\`

> **Conseil :** Pour les nouvelles applications, envisagez **Aurora Serverless v2** qui ajuste automatiquement la capacite de calcul en fonction de la charge. Ideal pour les workloads a trafic variable — vous ne payez que les ACU (Aurora Capacity Units) consommees, avec un scaling qui prend quelques secondes.`
      }
    ]
  },
  {
    id: 127,
    slug: 'azure-gcp',
    title: 'Azure & GCP',
    subtitle: 'Decouvrir les services cles de Microsoft Azure et Google Cloud Platform',
    icon: 'Cloud',
    color: '#3b82f6',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: '',
    sections: [
      {
        title: 'Azure (VMs/App Service/AKS/Storage)',
        content: `**Microsoft Azure** est le deuxieme plus grand fournisseur cloud. Son point fort est l'integration native avec l'ecosysteme Microsoft (Active Directory, Office 365, .NET).

### Services Compute Azure

**Azure Virtual Machines** — equivalent d'EC2 :

\`\`\`bash
# Creer une VM via Azure CLI
az vm create \\
  --resource-group myResourceGroup \\
  --name myVM \\
  --image Ubuntu2204 \\
  --size Standard_B2s \\
  --admin-username azureuser \\
  --generate-ssh-keys
\`\`\`

**Azure App Service** — PaaS pour applications web :

\`\`\`bash
# Deployer une application Node.js
az webapp create \\
  --resource-group myRG \\
  --plan myAppServicePlan \\
  --name my-web-app \\
  --runtime "NODE:18-lts"

# Deployer le code
az webapp up --name my-web-app --resource-group myRG
\`\`\`

App Service gere automatiquement le scaling, le SSL, le load balancing et les deployments slots (blue/green).

### Azure Kubernetes Service (AKS)

AKS est le service Kubernetes manage d'Azure. Le Control Plane est gratuit — vous ne payez que les noeuds worker.

\`\`\`bash
# Creer un cluster AKS
az aks create \\
  --resource-group myRG \\
  --name myAKS \\
  --node-count 3 \\
  --node-vm-size Standard_DS2_v2 \\
  --enable-addons monitoring \\
  --generate-ssh-keys

# Se connecter au cluster
az aks get-credentials --resource-group myRG --name myAKS
kubectl get nodes
\`\`\`

### Stockage Azure

| Service | Equivalent AWS | Usage |
|---------|---------------|-------|
| **Blob Storage** | S3 | Stockage objet (fichiers, images, backups) |
| **Managed Disks** | EBS | Disques pour VMs |
| **Azure Files** | EFS | Partage de fichiers SMB/NFS |
| **Queue Storage** | SQS | Files de messages |
| **Table Storage** | DynamoDB (basique) | NoSQL simple key-value |

\`\`\`bash
# Creer un Storage Account
az storage account create \\
  --name mystorageaccount \\
  --resource-group myRG \\
  --location westeurope \\
  --sku Standard_LRS

# Uploader un fichier dans Blob Storage
az storage blob upload \\
  --account-name mystorageaccount \\
  --container-name mycontainer \\
  --file ./data.json \\
  --name data.json
\`\`\`

### Azure Entra ID (anciennement Azure AD)

Le service d'identite d'Azure gere l'authentification et l'autorisation pour toutes les ressources. Il s'integre nativement avec Active Directory on-premise pour les environnements hybrides.

> **Point fort Azure :** Si votre entreprise utilise deja l'ecosysteme Microsoft (Active Directory, Office 365, Teams), Azure est le choix le plus naturel. L'integration entre Azure AD, les services cloud et l'environnement on-premise est incomparable.`
      },
      {
        title: 'GCP (Compute Engine/GKE/Cloud Storage)',
        content: `**Google Cloud Platform** (GCP) est le troisieme plus grand fournisseur cloud. Ses points forts sont le networking mondial, Kubernetes natif (Google a cree K8s) et les services data/ML.

### Compute Engine — VMs Google

\`\`\`bash
# Creer une VM
gcloud compute instances create my-vm \\
  --zone=europe-west1-b \\
  --machine-type=e2-medium \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=50GB

# Se connecter en SSH
gcloud compute ssh my-vm --zone=europe-west1-b
\`\`\`

Types de machines GCP :

| Famille | Usage | Exemple |
|---------|-------|---------|
| **E2** | General purpose, cout optimise | e2-medium (2 vCPU, 4 Go) |
| **N2/N2D** | General purpose, performance | n2-standard-4 (4 vCPU, 16 Go) |
| **C2/C2D** | Compute optimized | c2-standard-8 (8 vCPU, 32 Go) |
| **M2** | Memory optimized | m2-megamem-416 (416 vCPU, 5.8 To) |
| **A2** | GPU (ML/AI) | a2-highgpu-1g (1 GPU A100) |

### Google Kubernetes Engine (GKE)

GKE est considere comme le **meilleur** service Kubernetes manage, ce qui est logique puisque Google a cree Kubernetes.

\`\`\`bash
# Creer un cluster GKE Autopilot (entierement gere)
gcloud container clusters create-auto my-cluster \\
  --region=europe-west1

# Creer un cluster GKE Standard (plus de controle)
gcloud container clusters create my-cluster \\
  --zone=europe-west1-b \\
  --num-nodes=3 \\
  --machine-type=e2-standard-4 \\
  --enable-autoscaling \\
  --min-nodes=2 \\
  --max-nodes=10

# Se connecter
gcloud container clusters get-credentials my-cluster --zone=europe-west1-b
kubectl get nodes
\`\`\`

**GKE Autopilot** vs **GKE Standard** :

| Feature | Autopilot | Standard |
|---------|-----------|----------|
| Gestion des noeuds | Google | Vous |
| Pricing | Par pod (CPU+RAM) | Par noeud (VM) |
| Configuration | Peu de parametres | Controle total |
| Securite | Hardened par defaut | A configurer |

### Cloud Storage — equivalent S3

\`\`\`bash
# Creer un bucket
gsutil mb -l EU gs://my-unique-bucket/

# Uploader
gsutil cp fichier.txt gs://my-bucket/

# Synchroniser un dossier
gsutil rsync -r ./dist/ gs://my-bucket/website/
\`\`\`

### Cloud Run — Serverless pour conteneurs

\`\`\`bash
# Deployer un conteneur directement
gcloud run deploy my-service \\
  --image=gcr.io/my-project/my-app:v1 \\
  --platform=managed \\
  --region=europe-west1 \\
  --allow-unauthenticated

# Scale a zero quand il n'y a pas de trafic
# Paiement uniquement quand le conteneur est actif
\`\`\`

> **Point fort GCP :** Si vous faites du Kubernetes, GKE Autopilot est imbattable — Google gere tout (noeuds, securite, scaling) et vous ne payez que les ressources des pods. Pour les donnees et le ML, **BigQuery** et **Vertex AI** sont parmi les meilleurs du marche.`
      },
      {
        title: 'Comparaison AWS vs Azure vs GCP',
        content: `Choisir entre AWS, Azure et GCP depend de nombreux facteurs. Voici une comparaison detaillee pour vous aider a faire le bon choix.

### Comparaison par domaine

**Compute**

| | AWS | Azure | GCP |
|-|-----|-------|-----|
| VMs | EC2 (le plus de types) | VMs (integration Windows) | Compute Engine (live migration) |
| Serverless | Lambda (le plus mature) | Functions | Cloud Functions / Cloud Run |
| Containers | ECS/EKS/Fargate | AKS / Container Apps | GKE (le meilleur K8s) |

**Stockage et BDD**

| | AWS | Azure | GCP |
|-|-----|-------|-----|
| Objet | S3 (le standard) | Blob Storage | Cloud Storage |
| RDBMS | RDS / Aurora | SQL Database | Cloud SQL / Spanner |
| NoSQL | DynamoDB | Cosmos DB (multi-model) | Firestore / Bigtable |
| Cache | ElastiCache | Cache for Redis | Memorystore |

**Networking et CDN**

| | AWS | Azure | GCP |
|-|-----|-------|-----|
| VPC | VPC | VNet | VPC |
| CDN | CloudFront | CDN | Cloud CDN |
| DNS | Route 53 | DNS | Cloud DNS |
| Load Balancer | ALB/NLB | Load Balancer | Cloud Load Balancing |

### Comparaison des couts (estimation type)

Pour un workload type (4 vCPU, 16 Go RAM, VM Linux, region Europe) :

\`\`\`
                    On-Demand/mois    Reserved 1 an
AWS (m5.xlarge)     ~$140             ~$90 (-36%)
Azure (D4s v3)      ~$140             ~$85 (-39%)
GCP (n2-standard-4) ~$135             ~$95 (-30%)

Note : GCP offre des remises automatiques (sustained use)
sans engagement (jusqu'a -30% apres un mois d'utilisation)
\`\`\`

### Forces uniques de chaque provider

\`\`\`yaml
AWS:
  - Catalogue le plus complet (200+ services)
  - Le plus d'experience (depuis 2006)
  - Communaute et ecosysteme les plus larges
  - Meilleur pour: Tout, surtout si pas de preference

Azure:
  - Integration Microsoft (AD, O365, .NET)
  - Meilleur support hybride (Azure Arc, Stack)
  - Azure DevOps (CI/CD integree)
  - Meilleur pour: Entreprises Microsoft, environnements hybrides

GCP:
  - Reseau mondial le plus performant (backbone Google)
  - GKE (meilleur Kubernetes manage)
  - BigQuery, Vertex AI (data et ML)
  - Meilleur pour: Kubernetes, data analytics, ML
\`\`\`

### Matrice de decision

| Critere | Choix recommande |
|---------|-----------------|
| Ecosysteme Microsoft | Azure |
| Kubernetes natif | GCP (GKE) |
| Catalogue le plus large | AWS |
| Big Data / ML | GCP (BigQuery, Vertex AI) |
| Startup (credits) | Tous (programmes de credits) |
| Equipe sans preference | AWS (plus de docs, plus de talents) |
| Gaming | Azure (PlayFab, Xbox) |
| IoT | AWS (IoT Core le plus mature) |

> **Conseil pragmatique :** Le meilleur cloud est celui que votre equipe connait le mieux. Les trois providers offrent des services equivalents pour 90% des cas d'usage. Investissez dans les competences de votre equipe plutot que de chercher le provider "parfait". Utilisez des abstractions portables (Terraform, Kubernetes) pour limiter le vendor lock-in.`
      },
      {
        title: 'Multi-cloud strategies',
        content: `Une strategie **multi-cloud** consiste a utiliser plusieurs fournisseurs cloud simultanement. C'est une approche de plus en plus adoptee par les grandes organisations.

### Pourquoi le multi-cloud ?

\`\`\`
Raisons d'adopter le multi-cloud :
──────────────────────────────────
1. Eviter le vendor lock-in
2. Best-of-breed (choisir le meilleur service de chaque provider)
3. Resilience (pas de single point of failure au niveau du provider)
4. Negociation tarifaire (mise en concurrence)
5. Conformite reglementaire (localisation des donnees)
6. Absorption de fusions/acquisitions (chaque equipe a son provider)
\`\`\`

### Architectures multi-cloud

**Pattern 1 : Workload separation**

\`\`\`
AWS                          GCP
├── Applications web         ├── Data pipeline
├── API backend              ├── BigQuery analytics
├── Bases de donnees         ├── ML / Vertex AI
└── S3 stockage              └── GKE Kubernetes
\`\`\`

Chaque workload est place sur le provider le plus adapte. Simple a implementer mais pas de redundance inter-cloud.

**Pattern 2 : Active-Active**

\`\`\`
                    Global Load Balancer
                    ┌─────────┼─────────┐
                    │                    │
              ┌─────┴─────┐       ┌─────┴─────┐
              │    AWS     │       │    GCP     │
              │ Region A   │       │ Region B   │
              │ Full stack │       │ Full stack │
              └───────────┘       └───────────┘
\`\`\`

L'application est deployee sur deux providers. Complexe mais offre la meilleure resilience.

**Pattern 3 : DR (Disaster Recovery)**

\`\`\`
              AWS (principal)         Azure (DR)
              ┌───────────┐         ┌───────────┐
              │ Production │    ──►  │  Standby   │
              │ Full stack │  sync   │  Cold/warm │
              └───────────┘         └───────────┘
\`\`\`

Un provider principal, un secondaire en standby pour le DR.

### Outils pour le multi-cloud

| Outil | Role | Description |
|-------|------|-------------|
| **Terraform** | IaC | Gere l'infra sur tous les providers avec le meme langage (HCL) |
| **Kubernetes** | Orchestration | Meme API sur EKS, AKS, GKE |
| **Crossplane** | IaC K8s-native | Gere les ressources cloud comme des objets K8s |
| **Pulumi** | IaC en code | Python, TypeScript, Go pour tous les providers |
| **Anthos** (Google) | Multi-cloud K8s | Gere des clusters K8s sur GCP, AWS, on-premise |
| **Azure Arc** | Multi-cloud | Gere des serveurs et K8s partout depuis Azure |

### Defis du multi-cloud

\`\`\`yaml
complexite:
  - Competences a maintenir sur N providers
  - Monitoring et observabilite unifies (Datadog, Grafana)
  - Networking inter-cloud (latence, cout de transfert)
  - Gestion des identites (IAM different par provider)

couts:
  - Trafic inter-cloud (egress) tres cher ($0.08-0.12/Go)
  - Duplication des services (2x load balancers, 2x DNS, etc.)
  - Licences et support sur N providers

securite:
  - Surface d'attaque elargie
  - Politiques de securite a harmoniser
  - Gestion des secrets sur plusieurs systemes
\`\`\`

### Approche pragmatique

\`\`\`
Niveau 1 : Single cloud + abstractions portables
             (Terraform + Kubernetes + conteneurs)
             → Prepare le multi-cloud sans la complexite

Niveau 2 : Workload separation
             (Provider X pour le web, Provider Y pour la data)
             → Multi-cloud simple, pas de redundance

Niveau 3 : Active-Active ou DR inter-cloud
             → Multi-cloud complet, complexite maximale
\`\`\`

> **Conseil realiste :** La plupart des entreprises n'ont pas besoin de multi-cloud actif-actif. Commencez par utiliser des **abstractions portables** (Terraform pour l'infra, Kubernetes pour le runtime, S3-compatible pour le stockage) afin de limiter le vendor lock-in. Passez au multi-cloud uniquement si vous avez un besoin metier reel (conformite, resilience) ET les competences pour le gerer.`
      }
    ]
  },
  {
    id: 128,
    slug: 'terraform',
    title: 'Terraform',
    subtitle: 'Infrastructure as Code avec HashiCorp Terraform : HCL, providers, state et modules',
    icon: 'FileCode',
    color: '#3b82f6',
    duration: '50 min',
    level: 'Avance',
    videoId: '_6AITxe5iVc',
    sections: [
      {
        title: 'Infrastructure as Code concept',
        content: `L'**Infrastructure as Code** (IaC) est la pratique de gerer et provisionner l'infrastructure informatique via des fichiers de configuration declaratifs, plutot que via des processus manuels ou des interfaces graphiques.

### Pourquoi l'IaC ?

\`\`\`
Sans IaC (manuel)                   Avec IaC
─────────────────                   ────────
Clics dans la console AWS           Fichiers HCL/YAML versionnes
Pas de versioning                   Historique Git complet
Non reproductible                   Reproductible a 100%
Pas de review                       Code review (Pull Requests)
Drift de configuration              Etat desire = etat reel
Documentation obsolete              Le code EST la documentation
1 env = heures de travail           1 env = terraform apply
\`\`\`

### Approches declarative vs imperative

| Approche | Description | Outil |
|----------|-------------|-------|
| **Declarative** | Vous decrivez l'etat desire, l'outil gere le "comment" | Terraform, CloudFormation |
| **Imperative** | Vous decrivez les etapes a suivre | Scripts bash, Ansible (partiellement) |

\`\`\`hcl
# Declaratif (Terraform) — "je veux 3 serveurs"
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}
# Terraform sait creer, modifier ou supprimer pour atteindre l'etat desire
\`\`\`

\`\`\`bash
# Imperatif (script) — "cree un serveur"
aws ec2 run-instances --image-id ami-xxx --instance-type t3.micro
# Si vous executez 2 fois, vous avez 2 serveurs (pas idempotent)
\`\`\`

### Les principes cles de l'IaC

1. **Idempotence** : appliquer la meme configuration N fois produit toujours le meme resultat
2. **Versioning** : tout est dans Git, avec historique et rollback
3. **Review** : les changements d'infrastructure passent par des Pull Requests
4. **Testing** : validation de la syntaxe, plans de changement, tests d'integration
5. **Reproductibilite** : creez un environnement identique en quelques minutes

### Outils IaC populaires

| Outil | Approche | Multi-cloud | Langage |
|-------|----------|-------------|---------|
| **Terraform** | Declaratif | Oui (tous les clouds) | HCL |
| **CloudFormation** | Declaratif | AWS uniquement | JSON/YAML |
| **Pulumi** | Declaratif | Oui | Python, TS, Go, etc. |
| **Ansible** | Imperatif/Declaratif | Oui | YAML |
| **CDK** | Declaratif | AWS | TypeScript, Python, etc. |
| **Crossplane** | Declaratif | Oui | YAML (K8s-native) |

> **Analogie :** L'IaC est a l'infrastructure ce que le code source est au logiciel. Tout comme vous ne deploieriez jamais une application en ecrivant le code directement en production, vous ne devriez jamais creer de l'infrastructure en cliquant dans une console. Le code d'infrastructure est versionne, teste et deploye via un pipeline CI/CD.`
      },
      {
        title: 'HCL (HashiCorp Configuration Language)',
        content: `**HCL** (HashiCorp Configuration Language) est le langage de configuration utilise par Terraform. Concu pour etre lisible par les humains tout en etant machine-parsable.

### Syntaxe de base

\`\`\`hcl
# Variables
variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 2
}

variable "allowed_ips" {
  description = "List of allowed IP ranges"
  type        = list(string)
  default     = ["10.0.0.0/8", "172.16.0.0/12"]
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    Environment = "production"
    Team        = "devops"
  }
}
\`\`\`

### Blocs de configuration

\`\`\`hcl
# Configuration Terraform
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Provider
provider "aws" {
  region = var.region
}

# Resource
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name = "web-server"
  }
}

# Data source (lire une ressource existante)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Output
output "instance_ip" {
  value       = aws_instance.web.public_ip
  description = "Public IP of the web server"
}
\`\`\`

### Types de donnees HCL

\`\`\`hcl
# String
name = "my-app"

# Number
count = 3

# Bool
enable_monitoring = true

# List
availability_zones = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]

# Map
tags = {
  Name        = "production"
  Environment = "prod"
}

# Object (type complexe)
variable "server_config" {
  type = object({
    name          = string
    instance_type = string
    disk_size     = number
    public        = bool
  })
}
\`\`\`

### Expressions et fonctions

\`\`\`hcl
# String interpolation
name = "web-\${var.environment}-\${count.index}"

# Conditions
instance_type = var.environment == "production" ? "m5.large" : "t3.micro"

# Boucles
resource "aws_instance" "web" {
  count = var.instance_count
  tags = {
    Name = "web-\${count.index}"
  }
}

# For each (avec map)
resource "aws_iam_user" "users" {
  for_each = toset(["alice", "bob", "charlie"])
  name     = each.value
}

# Fonctions built-in
cidr = cidrsubnet("10.0.0.0/16", 8, 1)  # 10.0.1.0/24
upper = upper("hello")                    # HELLO
list  = concat(["a", "b"], ["c", "d"])   # ["a","b","c","d"]
\`\`\`

> **Conseil :** HCL est volontairement simple — ce n'est pas un langage de programmation general. Si vous avez besoin de logique complexe, utilisez des **modules** pour encapsuler la complexite ou envisagez **Pulumi** qui permet d'ecrire l'IaC en Python, TypeScript ou Go.`
      },
      {
        title: 'Providers et resources',
        content: `Les **providers** sont les plugins qui permettent a Terraform d'interagir avec les APIs des fournisseurs cloud et des services tiers. Les **resources** sont les objets d'infrastructure que vous creez.

### Providers

Terraform supporte plus de **3000 providers** via le Terraform Registry.

\`\`\`hcl
# Configuration des providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region  = "eu-west-1"
  profile = "production"
}

# Plusieurs instances du meme provider (alias)
provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}

resource "aws_s3_bucket" "cdn_origin" {
  provider = aws.us_east    # Utilise le provider US
  bucket   = "my-cdn-origin"
}
\`\`\`

### Resources

Les resources sont les briques fondamentales de Terraform. Chaque resource correspond a un objet d'infrastructure.

\`\`\`hcl
# Syntaxe : resource "<provider>_<type>" "<name>" { ... }

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true
}

# Security Group
resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y nginx
    systemctl start nginx
  EOF

  tags = {
    Name = "web-server"
  }
}
\`\`\`

### Workflow Terraform

\`\`\`bash
# 1. Initialiser (telecharge les providers)
terraform init

# 2. Valider la syntaxe
terraform validate

# 3. Planifier (voir ce qui va changer)
terraform plan

# 4. Appliquer (creer/modifier l'infrastructure)
terraform apply

# 5. Detruire (supprimer toute l'infrastructure)
terraform destroy
\`\`\`

> **Regle d'or :** Toujours executer \`terraform plan\` avant \`terraform apply\`. Le plan montre exactement ce qui sera cree, modifie ou detruit. En CI/CD, generez le plan dans un job, puis appliquez-le dans un job separe apres approbation.`
      },
      {
        title: 'State management',
        content: `Le **state** (fichier d'etat) est un concept fondamental de Terraform. Il stocke la correspondance entre les resources definies dans le code HCL et les objets reels dans l'infrastructure cloud.

### Le fichier terraform.tfstate

\`\`\`json
{
  "version": 4,
  "terraform_version": "1.7.0",
  "resources": [
    {
      "type": "aws_instance",
      "name": "web",
      "instances": [
        {
          "attributes": {
            "id": "i-0abc123def456789",
            "ami": "ami-0c55b159cbfafe1f0",
            "instance_type": "t3.micro",
            "public_ip": "54.123.45.67"
          }
        }
      ]
    }
  ]
}
\`\`\`

### Pourquoi le state est critique

Sans le state, Terraform ne saurait pas :
- Quelles ressources existent deja
- Quels attributs elles ont (ID, IP, etc.)
- Quoi modifier ou supprimer lors du prochain \`apply\`

### Remote backend (stockage distant)

En equipe, le state doit etre **partage** et **verrouille** pour eviter les conflits. Ne stockez **jamais** le state localement en production.

\`\`\`hcl
# Backend S3 + DynamoDB (lock)
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
\`\`\`

\`\`\`hcl
# Creer le bucket et la table de lock
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
\`\`\`

### Commandes de gestion du state

\`\`\`bash
# Lister les resources dans le state
terraform state list

# Voir les details d'une resource
terraform state show aws_instance.web

# Renommer une resource (sans la recreer)
terraform state mv aws_instance.web aws_instance.api

# Importer une resource existante dans le state
terraform import aws_instance.web i-0abc123def456789

# Forcer le deverrouillage du state
terraform force-unlock <LOCK_ID>
\`\`\`

### Bonnes pratiques state

- Toujours utiliser un **remote backend** en equipe (S3, GCS, Azure Blob)
- Activer le **versioning** sur le bucket du state (rollback possible)
- Activer le **chiffrement** du state (il contient des valeurs sensibles)
- Utiliser le **locking** (DynamoDB pour AWS) pour eviter les modifications concurrentes
- Ne jamais modifier le state manuellement
- Separer les states par environnement (dev/staging/prod)

> **Avertissement :** Le fichier terraform.tfstate contient des **donnees sensibles** (mots de passe, tokens, cles privees). Ne le committez JAMAIS dans Git. Utilisez un remote backend chiffre et limitez l'acces avec des politiques IAM strictes.`
      },
      {
        title: 'Modules et workspaces',
        content: `Les **modules** et les **workspaces** sont les mecanismes de Terraform pour organiser le code IaC de maniere modulaire et gerer plusieurs environnements.

### Modules

Un **module** est un ensemble de fichiers Terraform reutilisables. Tout repertoire contenant des fichiers \`.tf\` est un module.

\`\`\`
infrastructure/
├── main.tf              # Module racine
├── variables.tf
├── outputs.tf
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ec2/
│   └── rds/
\`\`\`

### Creer et utiliser un module

\`\`\`hcl
# modules/vpc/main.tf
resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  tags = {
    Name        = "\${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.public_subnets[count.index]
}

# modules/vpc/outputs.tf
output "vpc_id" {
  value = aws_vpc.this.id
}
output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}
\`\`\`

\`\`\`hcl
# main.tf (module racine)
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr       = "10.0.0.0/16"
  environment    = "production"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
}

module "web_servers" {
  source = "./modules/ec2"
  subnet_ids  = module.vpc.public_subnet_ids
  environment = "production"
}

# Modules depuis le Terraform Registry
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"
  cluster_name = "my-cluster"
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.public_subnet_ids
}
\`\`\`

### Workspaces

Les **workspaces** permettent de gerer plusieurs environnements avec le meme code :

\`\`\`bash
# Creer des workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new production

# Changer de workspace
terraform workspace select production

# Lister les workspaces
terraform workspace list
\`\`\`

\`\`\`hcl
# Utiliser le workspace dans le code
resource "aws_instance" "web" {
  instance_type = terraform.workspace == "production" ? "m5.large" : "t3.micro"
  count         = terraform.workspace == "production" ? 3 : 1
  tags = {
    Environment = terraform.workspace
  }
}
\`\`\`

### Structure de projet recommandee

\`\`\`
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── backend.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── production/
└── modules/
    ├── vpc/
    ├── ec2/
    ├── rds/
    └── eks/
\`\`\`

> **Conseil :** Preferez les **repertoires par environnement** aux workspaces pour les projets complexes. Les repertoires offrent plus de flexibilite (backend separe, variables differentes) et sont plus explicites. Reservez les workspaces aux cas simples ou l'infrastructure est quasiment identique entre les environnements.`
      }
    ]
  },
  {
    id: 129,
    slug: 'cloudformation-pulumi',
    title: 'CloudFormation & Pulumi',
    subtitle: 'Alternatives IaC : CloudFormation pour AWS et Pulumi en code reel',
    icon: 'Layers',
    color: '#3b82f6',
    duration: '40 min',
    level: 'Avance',
    videoId: '',
    sections: [
      {
        title: 'AWS CloudFormation',
        content: `**AWS CloudFormation** est le service natif d'Infrastructure as Code d'Amazon. Il permet de definir et provisionner des ressources AWS via des templates JSON ou YAML.

### Avantages de CloudFormation

- **Natif AWS** : pas d'outil tiers a installer, integre dans la console AWS
- **Gratuit** : vous ne payez que les ressources creees, pas CloudFormation lui-meme
- **Drift detection** : detecte les modifications manuelles faites hors du template
- **StackSets** : deploie la meme stack dans plusieurs comptes et regions
- **Integration AWS** : supporte les dernieres ressources AWS des leur lancement

### Structure d'un template CloudFormation

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Stack de production - VPC + EC2 + RDS'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [dev, staging, production]
  InstanceType:
    Type: String
    Default: t3.micro

Mappings:
  RegionAMI:
    eu-west-1:
      HVM64: ami-0c55b159cbfafe1f0
    us-east-1:
      HVM64: ami-0abcdef1234567890

Conditions:
  IsProduction: !Equals [!Ref Environment, production]

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub '\${Environment}-vpc'

  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !If [IsProduction, m5.large, !Ref InstanceType]
      ImageId: !FindInMap [RegionAMI, !Ref 'AWS::Region', HVM64]
      Tags:
        - Key: Name
          Value: !Sub '\${Environment}-web-server'

Outputs:
  WebServerIP:
    Description: Public IP of the web server
    Value: !GetAtt WebServer.PublicIp
    Export:
      Name: !Sub '\${Environment}-WebServerIP'
\`\`\`

### Operations CloudFormation

\`\`\`bash
# Creer une stack
aws cloudformation create-stack \\
  --stack-name production-stack \\
  --template-body file://template.yaml \\
  --parameters ParameterKey=Environment,ParameterValue=production

# Mettre a jour une stack
aws cloudformation update-stack \\
  --stack-name production-stack \\
  --template-body file://template.yaml

# Voir l'etat de la stack
aws cloudformation describe-stacks --stack-name production-stack

# Supprimer une stack
aws cloudformation delete-stack --stack-name production-stack
\`\`\`

### Limitations de CloudFormation

- **AWS uniquement** : pas de multi-cloud
- **Verbeux** : un template YAML peut atteindre des milliers de lignes
- **Pas de logique complexe** : les conditions et boucles sont limitees
- **Rollback lent** : en cas d'erreur, le rollback peut prendre du temps

> **Quand choisir CloudFormation :** Si vous etes 100% AWS et souhaitez un outil natif sans dependance externe. CloudFormation est aussi requis pour certains services AWS (Service Catalog, Control Tower). Sinon, Terraform offre plus de flexibilite.`
      },
      {
        title: 'Syntaxe YAML/JSON',
        content: `CloudFormation supporte deux formats de templates : **YAML** (recommande) et **JSON**. La syntaxe YAML est plus lisible et supporte les commentaires.

### Fonctions intrinseques

CloudFormation fournit des fonctions speciales pour la logique dynamique dans les templates :

\`\`\`yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      # !Ref — Reference a un parametre ou une resource
      InstanceType: !Ref InstanceType
      SubnetId: !Ref PublicSubnet

      # !Sub — Substitution de variables
      Tags:
        - Key: Name
          Value: !Sub '\${AWS::StackName}-web-server'

      # !GetAtt — Obtenir un attribut d'une resource
      SecurityGroupIds:
        - !GetAtt WebSG.GroupId

      # !FindInMap — Chercher dans un mapping
      ImageId: !FindInMap
        - RegionAMI
        - !Ref AWS::Region
        - HVM64

      # !If — Condition
      InstanceType: !If
        - IsProduction
        - m5.large
        - t3.micro

      # !Join — Concatenation
      UserData:
        Fn::Base64: !Join
          - ''
          - - '#!/bin/bash\\n'
            - 'echo "Hello"\\n'

      # !Select — Selectionner dans une liste
      AvailabilityZone: !Select
        - 0
        - !GetAZs !Ref AWS::Region
\`\`\`

### Pseudo-parametres

CloudFormation fournit des pseudo-parametres automatiques :

| Pseudo-parametre | Valeur |
|------------------|--------|
| \`AWS::AccountId\` | ID du compte AWS (123456789012) |
| \`AWS::Region\` | Region courante (eu-west-1) |
| \`AWS::StackName\` | Nom de la stack |
| \`AWS::StackId\` | ARN de la stack |
| \`AWS::NoValue\` | Supprime la propriete (avec conditions) |

### Change Sets

Les **Change Sets** sont l'equivalent du \`terraform plan\` — ils montrent ce qui va changer avant d'appliquer :

\`\`\`bash
# Creer un change set
aws cloudformation create-change-set \\
  --stack-name production-stack \\
  --change-set-name update-instance-type \\
  --template-body file://template.yaml

# Voir les changements proposes
aws cloudformation describe-change-set \\
  --stack-name production-stack \\
  --change-set-name update-instance-type

# Appliquer le change set
aws cloudformation execute-change-set \\
  --stack-name production-stack \\
  --change-set-name update-instance-type
\`\`\`

### Nested Stacks

Pour organiser des templates complexes, utilisez des **nested stacks** :

\`\`\`yaml
Resources:
  VPCStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/mybucket/vpc.yaml
      Parameters:
        Environment: !Ref Environment

  AppStack:
    Type: AWS::CloudFormation::Stack
    DependsOn: VPCStack
    Properties:
      TemplateURL: https://s3.amazonaws.com/mybucket/app.yaml
      Parameters:
        VpcId: !GetAtt VPCStack.Outputs.VpcId
\`\`\`

> **Bonne pratique :** Utilisez toujours des **Change Sets** avant de modifier une stack en production. Nommez vos stacks de maniere descriptive et utilisez les nested stacks pour decomposer les templates volumineux en modules reutilisables.`
      },
      {
        title: 'Pulumi et IaC en code',
        content: `**Pulumi** est une plateforme d'Infrastructure as Code qui permet de definir l'infrastructure avec des **langages de programmation reels** (TypeScript, Python, Go, C#, Java) au lieu de DSL specialises (HCL, YAML).

### Pourquoi Pulumi ?

\`\`\`
Terraform (HCL)              Pulumi (TypeScript/Python/Go)
───────────────              ────────────────────────────
DSL specifique               Langages generaux
Pas de boucles complexes     for, while, map, filter
Pas de tests unitaires       Jest, pytest, go test
Pas de types forts           TypeScript types, IDE autocomplete
Pas de packages              npm, pip, go modules
\`\`\`

### Exemple en TypeScript

\`\`\`typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const environment = config.require("environment");
const instanceCount = config.getNumber("instanceCount") || 2;

// VPC
const vpc = new aws.ec2.Vpc("main-vpc", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  tags: { Name: \`\${environment}-vpc\` },
});

// Subnets (avec une vraie boucle !)
const azs = ["eu-west-1a", "eu-west-1b"];
const publicSubnets = azs.map((az, index) =>
  new aws.ec2.Subnet(\`public-\${index}\`, {
    vpcId: vpc.id,
    cidrBlock: \`10.0.\${index + 1}.0/24\`,
    availabilityZone: az,
    mapPublicIpOnLaunch: true,
  })
);

// EC2 Instances
const instances = Array.from({ length: instanceCount }, (_, i) =>
  new aws.ec2.Instance(\`web-\${i}\`, {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: environment === "production" ? "m5.large" : "t3.micro",
    subnetId: publicSubnets[i % publicSubnets.length].id,
    tags: { Name: \`\${environment}-web-\${i}\` },
  })
);

// Outputs
export const vpcId = vpc.id;
export const instanceIps = instances.map(i => i.publicIp);
\`\`\`

### Exemple en Python

\`\`\`python
import pulumi
import pulumi_aws as aws

config = pulumi.Config()
environment = config.require("environment")

vpc = aws.ec2.Vpc("main-vpc",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    tags={"Name": f"{environment}-vpc"})

instance_type = "m5.large" if environment == "production" else "t3.micro"

server = aws.ec2.Instance("web-server",
    ami="ami-0c55b159cbfafe1f0",
    instance_type=instance_type,
    tags={"Name": f"{environment}-web"})

pulumi.export("server_ip", server.public_ip)
\`\`\`

### Workflow Pulumi

\`\`\`bash
# Creer un projet
pulumi new aws-typescript

# Previsualiser les changements
pulumi preview

# Deployer
pulumi up

# Voir les outputs
pulumi stack output

# Detruire
pulumi destroy
\`\`\`

> **Quand choisir Pulumi :** Si votre equipe est composee de developpeurs qui preferent ecrire du TypeScript ou Python plutot que du HCL. Pulumi est excellent pour les infrastructures complexes necessitant de la logique avancee. L'autocompletion IDE et les tests unitaires sont de vrais avantages.`
      },
      {
        title: 'Comparaison Terraform vs CloudFormation vs Pulumi',
        content: `Chaque outil IaC a ses forces et ses faiblesses. Le choix depend de votre contexte : equipe, cloud provider, complexite de l'infrastructure.

### Tableau comparatif

| Critere | Terraform | CloudFormation | Pulumi |
|---------|-----------|----------------|--------|
| **Langage** | HCL | YAML/JSON | TS, Python, Go, C#, Java |
| **Multi-cloud** | Oui (3000+ providers) | AWS uniquement | Oui (tous les clouds) |
| **State** | Fichier explicite (S3, GCS...) | Gere par AWS (implicite) | Pulumi Cloud ou self-hosted |
| **Plan/Preview** | \`terraform plan\` | Change Sets | \`pulumi preview\` |
| **Modules** | Terraform Registry | Nested Stacks | npm, pip, Go modules |
| **Tests** | Terratest (Go) | TaskCat | Jest, pytest, go test |
| **Courbe d'apprentissage** | Moyenne (nouveau DSL) | Faible si deja AWS | Faible si deja dev |
| **IDE support** | Basique (extension HCL) | Basique | Excellent (TypeScript) |
| **Cout** | Open source (Cloud payant) | Gratuit | Open source (Cloud payant) |

### Quand choisir quoi ?

\`\`\`yaml
Terraform:
  quand:
    - Infrastructure multi-cloud ou multi-provider
    - Equipe ops/infra habituee aux DSL
    - Besoin d'un large ecosysteme de modules
    - Standard de l'industrie (le plus adopte)
  eviter_si:
    - Logique tres complexe (boucles imbriquees)
    - Equipe 100% developpeurs

CloudFormation:
  quand:
    - 100% AWS, pas de multi-cloud prevu
    - Equipe deja formee AWS
    - Besoin de StackSets (multi-compte/region)
    - Integration avec AWS Service Catalog
  eviter_si:
    - Multi-cloud ou migration possible
    - Templates tres complexes (verbeux)

Pulumi:
  quand:
    - Equipe de developpeurs (TS/Python/Go)
    - Infrastructure complexe avec logique avancee
    - Besoin de tests unitaires pour l'infra
    - IDE autocomplete et refactoring importants
  eviter_si:
    - Equipe ops sans experience de programmation
    - Besoin d'un ecosysteme de modules mature
\`\`\`

### Exemples comparatifs — Creer un bucket S3

\`\`\`hcl
# Terraform (HCL)
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
  tags   = { Environment = "production" }
}

resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration { status = "Enabled" }
}
\`\`\`

\`\`\`yaml
# CloudFormation (YAML)
Resources:
  DataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-data-bucket
      VersioningConfiguration:
        Status: Enabled
      Tags:
        - Key: Environment
          Value: production
\`\`\`

\`\`\`typescript
// Pulumi (TypeScript)
const bucket = new aws.s3.Bucket("data", {
  bucket: "my-data-bucket",
  versioning: { enabled: true },
  tags: { Environment: "production" },
});
\`\`\`

> **Conseil pragmatique :** Si vous partez de zero, choisissez **Terraform** — c'est le standard de l'industrie avec le plus large ecosysteme. Si votre equipe est 100% AWS et ne fait pas de multi-cloud, **CloudFormation** est plus simple. Si votre equipe est composee de developpeurs, **Pulumi** est le meilleur choix.`
      }
    ]
  },
  {
    id: 130,
    slug: 'bonnes-pratiques-cloud',
    title: 'Bonnes Pratiques Cloud & IaC',
    subtitle: 'Well-Architected Framework, optimisation des couts et securite cloud',
    icon: 'CheckCircle',
    color: '#3b82f6',
    duration: '35 min',
    level: 'Avance',
    videoId: '',
    sections: [
      {
        title: 'Well-Architected Framework',
        content: `Le **AWS Well-Architected Framework** est un ensemble de bonnes pratiques pour concevoir et evaluer des architectures cloud. Bien qu'initie par AWS, ses principes s'appliquent a tout cloud provider.

### Les 6 piliers

\`\`\`
Well-Architected Framework
├── 1. Excellence operationnelle
├── 2. Securite
├── 3. Fiabilite
├── 4. Efficacite des performances
├── 5. Optimisation des couts
└── 6. Durabilite (ajoute en 2021)
\`\`\`

### 1. Excellence operationnelle

Executer et surveiller les systemes pour offrir de la valeur metier, et ameliorer en continu les processus et procedures.

- **Infrastructure as Code** : tout est code, versionne, revise
- **Petits changements frequents** : deploiements incrementaux, pas de big bang
- **Anticiper les pannes** : chaos engineering, game days
- **Apprendre des echecs** : post-mortems blameless

### 2. Securite

Proteger les informations, les systemes et les actifs tout en offrant de la valeur metier.

- **Principe du moindre privilege** : IAM granulaire
- **Tracabilite** : CloudTrail, journalisation de tout
- **Securite a tous les niveaux** : reseau, compute, donnees
- **Automatiser la securite** : detection et remediation automatique

### 3. Fiabilite

La capacite d'un systeme a recuperer d'une defaillance et a repondre a la demande.

- **Multi-AZ / Multi-region** : pas de single point of failure
- **Auto-scaling** : repondre a la demande automatiquement
- **Tests de recovery** : verifier que le DR fonctionne
- **Limiter le blast radius** : isolation des composants

### 4. Efficacite des performances

Utiliser les ressources informatiques de maniere efficace pour repondre aux besoins.

- **Right-sizing** : adapter les types d'instances a la charge
- **Monitoring** : metriques de performance en temps reel
- **Experimenter** : tester differentes configurations
- **Services manages** : utiliser les services natifs plutot que tout rebuilder

### 5. Optimisation des couts

Eviter les depenses inutiles et comprendre ou va l'argent.

- **Payer uniquement ce que vous utilisez** : eteindre les ressources inutilisees
- **Mesurer** : tags de couts, budgets, alertes
- **Instances reservees** : engagement pour les charges stables
- **Spot instances** : pour les workloads tolerants

### 6. Durabilite

Minimiser l'impact environnemental du cloud.

- **Regions a energie verte** : choisir des regions alimentees en energie renouvelable
- **Right-sizing** : ne pas surdimensionner (moins de CPU idle = moins d'energie)
- **Services serverless** : pas de serveurs en attente

> **A retenir :** Le Well-Architected Framework n'est pas un checklist a cocher une fois. C'est un processus continu de revision et d'amelioration. AWS propose un outil gratuit (**AWS Well-Architected Tool**) pour evaluer vos architectures et identifier les axes d'amelioration.`
      },
      {
        title: 'Cost optimization',
        content: `L'optimisation des couts cloud est un exercice continu. Sans surveillance, les couts peuvent facilement tripler en quelques mois.

### Les sources de gaspillage les plus courantes

\`\`\`
1. Instances surdimensionnees        ~35% du gaspillage
2. Ressources inutilisees (idle)     ~25%
3. Stockage non nettoye              ~15%
4. Pas de reserved instances         ~15%
5. Transfert de donnees excessif     ~10%
\`\`\`

### Strategies d'optimisation

**1. Right-sizing (dimensionnement correct)**

\`\`\`bash
# Verifier l'utilisation CPU/memoire des instances
aws cloudwatch get-metric-statistics \\
  --namespace AWS/EC2 \\
  --metric-name CPUUtilization \\
  --dimensions Name=InstanceId,Value=i-xxx \\
  --start-time 2024-01-01T00:00:00 \\
  --end-time 2024-01-31T23:59:59 \\
  --period 86400 \\
  --statistics Average

# Si CPU moyen < 10% → downsize l'instance
# m5.xlarge ($140/mois) → m5.large ($70/mois) = -50%
\`\`\`

**2. Reserved Instances et Savings Plans**

\`\`\`
Type                  Reduction    Engagement    Flexibilite
──────────────────    ─────────    ──────────    ───────────
On-Demand             0%           Aucun         Totale
Savings Plans 1 an    ~30%         $/heure       Flexible
Reserved 1 an         ~40%         Instance       Fixe
Reserved 3 ans        ~60-72%      Instance       Fixe
Spot                  ~70-90%      Aucun          Interruptible
\`\`\`

**3. Spot Instances pour les workloads non-critiques**

\`\`\`hcl
# Terraform — Node group Spot pour Kubernetes
resource "aws_eks_node_group" "spot_workers" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "spot-workers"
  capacity_type   = "SPOT"
  instance_types  = ["m5.large", "m5a.large", "m4.large"]

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 1
  }
}
\`\`\`

**4. Tagging pour l'allocation des couts**

\`\`\`hcl
tags = {
  Environment  = "production"
  Team         = "backend"
  Project      = "api-v2"
  CostCenter   = "CC-1234"
  ManagedBy    = "terraform"
}
\`\`\`

**5. Automatiser l'arret des ressources non-prod**

\`\`\`bash
# Eteindre les instances dev/staging le soir et les week-ends
# AWS Instance Scheduler ou script Lambda
# Economie potentielle : ~65% sur les couts compute non-prod
\`\`\`

### Outils de monitoring des couts

| Outil | Provider | Description |
|-------|----------|-------------|
| **Cost Explorer** | AWS | Analyse native des couts |
| **Cost Management** | Azure | Equivalent Azure |
| **Billing** | GCP | Equivalent GCP |
| **Infracost** | Multi-cloud | Estimation des couts dans les PRs Terraform |
| **Kubecost** | Kubernetes | Couts par namespace/deployment/pod |

> **Regle des 3R :** **Right-size** (dimensionner correctement), **Reserve** (engager pour les charges stables), **Review** (revoir regulierement). Mettez en place des alertes de budget et revoyez vos couts mensuellement. Un audit trimestriel des ressources inutilisees peut reduire la facture de 20 a 40%.`
      },
      {
        title: 'Securite cloud',
        content: `La securite dans le cloud suit le modele de **responsabilite partagee** : le cloud provider securise l'infrastructure, vous securisez ce que vous y deployez.

### Modele de responsabilite partagee

\`\`\`
Votre responsabilite (securite DANS le cloud)
──────────────────────────────────────────────
├── Donnees clients
├── Configuration des applications
├── Gestion des identites et acces (IAM)
├── Configuration du systeme d'exploitation
├── Configuration reseau (SG, NACL, VPC)
└── Chiffrement des donnees (client-side)

Responsabilite du provider (securite DU cloud)
──────────────────────────────────────────────
├── Infrastructure physique (datacenters)
├── Materiel (serveurs, stockage, reseau)
├── Hyperviseur
├── Reseau physique
└── Chiffrement infrastructure (server-side)
\`\`\`

### Les 10 commandements de la securite cloud

**1. IAM — Le plus important**

\`\`\`yaml
regles:
  - Principe du moindre privilege (least privilege)
  - MFA sur tous les comptes, surtout root
  - Pas de cles d'acces pour le root
  - Roles pour les services (pas d'access keys)
  - Rotation des credentials reguliere
\`\`\`

**2. Chiffrement partout**

\`\`\`bash
# Chiffrement au repos
- S3 : SSE-S3 ou SSE-KMS
- EBS : chiffrement active par defaut
- RDS : chiffrement + SSL force

# Chiffrement en transit
- TLS 1.2+ obligatoire
- Certificats ACM (gratuits sur AWS)
- VPN ou PrivateLink pour les connexions internes
\`\`\`

**3. Reseau — Defense en profondeur**

\`\`\`
Internet
    │
    ▼
WAF (Web Application Firewall)
    │
    ▼
ALB (Load Balancer) ── dans subnet public
    │
    ▼
Security Group (firewall stateful)
    │
    ▼
Application ── dans subnet prive
    │
    ▼
Security Group (port 3306 only)
    │
    ▼
RDS ── dans subnet prive, pas d'acces public
\`\`\`

**4. Logging et audit**

\`\`\`bash
# Services essentiels a activer
- CloudTrail    : audit de TOUTES les actions API
- VPC Flow Logs : journalisation du trafic reseau
- GuardDuty     : detection de menaces par ML
- Config        : conformite des configurations
\`\`\`

**5. Gestion des secrets**

\`\`\`bash
# NE JAMAIS stocker dans le code
# Utiliser :
- AWS Secrets Manager (rotation automatique)
- AWS SSM Parameter Store (gratuit, plus simple)
- HashiCorp Vault (multi-cloud)
\`\`\`

### Infrastructure as Code securisee

\`\`\`hcl
# Scan de securite dans le pipeline
# Outils : tfsec, checkov, terrascan

# Pipeline CI/CD avec scan securite
# 1. terraform validate
# 2. tfsec ./
# 3. checkov -d ./
# 4. terraform plan
# 5. Approbation manuelle
# 6. terraform apply
\`\`\`

> **Regle d'or :** La securite n'est pas un etat, c'est un processus continu. Automatisez au maximum : scans de securite dans le CI/CD, detection de drift, remediation automatique. Un incident de securite coute infiniment plus cher que les outils de prevention.`
      },
      {
        title: 'Disaster recovery',
        content: `Le **Disaster Recovery** (DR) est l'ensemble des strategies et procedures pour restaurer les systemes et les donnees apres une catastrophe (panne, cyberattaque, erreur humaine, catastrophe naturelle).

### Metriques cles du DR

| Metrique | Definition | Exemple |
|----------|------------|---------|
| **RTO** (Recovery Time Objective) | Temps maximum acceptable d'indisponibilite | 4 heures |
| **RPO** (Recovery Point Objective) | Perte de donnees maximum acceptable | 1 heure |

\`\`\`
                  RPO                    RTO
                  ◄──►                   ◄────►
──────────────────┼────────────────────────┼──────────────
  Derniere        │                        │
  sauvegarde      Catastrophe              Retour a la
  (donnees                                 normale
  perdues)
\`\`\`

### Les 4 strategies de DR

\`\`\`
Cout $$$$  ◄─────────────────────────────────────────────► Cout $
RTO ~0     ◄─────────────────────────────────────────────► RTO heures

┌──────────────────┬────────────────┬────────────────┬──────────────┐
│  Multi-Site      │  Warm Standby  │  Pilot Light   │  Backup &    │
│  Active/Active   │                │                │  Restore     │
│                  │                │                │              │
│  2 regions       │  Version       │  Infra minimale│  Sauvegardes │
│  identiques      │  reduite en    │  prete a       │  dans une    │
│  100% du trafic  │  DR (~20%)     │  scaler        │  autre region│
│                  │                │                │              │
│  RTO: minutes    │  RTO: 10-30min │  RTO: 1-4h     │  RTO: 4-24h  │
│  RPO: secondes   │  RPO: secondes │  RPO: minutes  │  RPO: heures │
│  Cout: $$$$$     │  Cout: $$$     │  Cout: $$      │  Cout: $     │
└──────────────────┴────────────────┴────────────────┴──────────────┘
\`\`\`

### Backup & Restore (strategie de base)

\`\`\`bash
# Sauvegardes automatiques
# RDS : backups automatiques + snapshots cross-region
aws rds create-db-snapshot \\
  --db-instance-identifier my-db \\
  --db-snapshot-identifier my-db-backup-20240101

# Copier le snapshot dans une autre region
aws rds copy-db-snapshot \\
  --source-db-snapshot-identifier arn:aws:rds:eu-west-1:xxx:snapshot:my-backup \\
  --target-db-snapshot-identifier my-backup-dr \\
  --region us-east-1
\`\`\`

### Pilot Light

L'infrastructure minimale est prete dans la region DR (base de donnees repliquee), mais les serveurs applicatifs ne sont pas demarres :

\`\`\`hcl
# Region DR : RDS replica + AMIs pretes
resource "aws_db_instance" "dr_replica" {
  provider               = aws.dr_region
  replicate_source_db    = aws_db_instance.primary.arn
  instance_class         = "db.t3.micro"    # Taille reduite
  skip_final_snapshot    = true
}

# En cas de catastrophe : scaler les instances et basculer le DNS
\`\`\`

### Tester le DR

\`\`\`yaml
plan_de_test_dr:
  frequence: trimestriel
  etapes:
    - Simuler une panne de la region principale
    - Basculer vers la region DR
    - Verifier que l'application fonctionne
    - Mesurer le RTO reel vs objectif
    - Verifier l'integrite des donnees (RPO)
    - Documenter les resultats et ameliorations
  important:
    - Tester en conditions reelles (pas juste sur papier)
    - Impliquer toute l'equipe (pas seulement les ops)
    - Automatiser au maximum la bascule
\`\`\`

> **Conseil critique :** Un plan de DR qui n'est pas teste est un plan qui ne fonctionne pas. Planifiez des exercices de DR trimestriels et mesurez votre RTO et RPO reels. Automatisez la bascule avec des runbooks et des scripts IaC pour eliminer les erreurs humaines en situation de crise.`
      },
      {
        title: 'IaC best practices',
        content: `Les bonnes pratiques d'Infrastructure as Code sont essentielles pour maintenir un code d'infrastructure fiable, lisible et securise a long terme.

### 1. Organisation du code

\`\`\`
infrastructure/
├── modules/                    # Modules reutilisables
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/
│   └── database/
├── environments/               # Un dossier par environnement
│   ├── dev/
│   │   ├── main.tf
│   │   ├── backend.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── production/
├── .terraform-version
├── .tflint.hcl
└── Makefile
\`\`\`

### 2. Pipeline CI/CD pour l'IaC

\`\`\`yaml
# .github/workflows/terraform.yml
name: Terraform CI/CD
on:
  pull_request:
    paths: ['infrastructure/**']
  push:
    branches: [main]
    paths: ['infrastructure/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: hashicorp/setup-terraform@v3

    - name: Terraform Format Check
      run: terraform fmt -check -recursive

    - name: Terraform Validate
      run: terraform validate

    - name: Security Scan (tfsec)
      uses: aquasecurity/tfsec-action@v1.0.0

    - name: Terraform Plan
      run: terraform plan -out=tfplan

  apply:
    needs: plan
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - name: Terraform Apply
      run: terraform apply -auto-approve tfplan
\`\`\`

### 3. Variables typees avec validation

\`\`\`hcl
variable "environment" {
  type        = string
  description = "Environment name"
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

# Marquer les secrets comme sensibles
variable "db_password" {
  type      = string
  sensitive = true
}
\`\`\`

### 4. Conventions de nommage

\`\`\`hcl
locals {
  name_prefix = "\${var.project}-\${var.environment}"
}

resource "aws_instance" "web" {
  tags = {
    Name        = "\${local.name_prefix}-web-server"
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "terraform"
    Team        = var.team
  }
}
\`\`\`

### 5. Lifecycle et protection

\`\`\`hcl
resource "aws_rds_instance" "production" {
  lifecycle {
    prevent_destroy = true                    # Empeche la suppression accidentelle
    ignore_changes  = [engine_version]        # Ignore les mises a jour mineures auto
  }
}

resource "aws_instance" "web" {
  lifecycle {
    create_before_destroy = true              # Zero downtime lors des remplacements
  }
}
\`\`\`

### Checklist IaC

\`\`\`yaml
code_quality:
  - terraform fmt -recursive (formatage uniforme)
  - terraform validate (syntaxe correcte)
  - tfsec / checkov (scan securite)
  - Variables typees et validees
  - Modules versionnes

workflow:
  - Remote state avec locking
  - Pipeline CI/CD avec plan + review + apply
  - Environnements isoles (state separes)
  - Approbation manuelle pour production
  - Drift detection reguliere

securite:
  - Pas de secrets en clair dans le code
  - sensitive = true pour les variables sensibles
  - Chiffrement du state
  - IAM least privilege pour le service account Terraform
\`\`\`

> **Philosophie :** Traitez votre code IaC avec le meme soin que votre code applicatif. Code review obligatoire, tests automatises, pipeline CI/CD, conventions de nommage. L'infrastructure est du code — elle merite les memes bonnes pratiques de genie logiciel.`
      }
    ]
  }
]
