import type { Chapter } from '../chapters'

export const chapters: Chapter[] = [
  {
    id: 131,
    slug: 'cicd-github-actions',
    title: 'CI/CD & GitHub Actions',
    subtitle: 'Automatiser le build, les tests et le deploiement avec les pipelines CI/CD',
    icon: 'Play',
    color: '#f59e0b',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'tiSfXCM8VTw',
    sections: [
      {
        title: 'Concepts CI/CD',
        content: `Le **CI/CD** (Continuous Integration / Continuous Delivery / Continuous Deployment) est un ensemble de pratiques qui automatisent le cycle de vie du logiciel, du commit au deploiement en production.

### Les trois piliers

\`\`\`
Continuous Integration (CI)
───────────────────────────
Code → Build → Tests → Feedback rapide
- Chaque commit declenche un build automatique
- Les tests s'executent a chaque push
- Les erreurs sont detectees en minutes, pas en jours

Continuous Delivery (CD)
────────────────────────
CI + Deploiement automatique en staging
- Le code est toujours dans un etat deployable
- Le deploiement en production est un clic (approbation manuelle)

Continuous Deployment
─────────────────────
CD + Deploiement automatique en production
- Chaque commit qui passe les tests va directement en production
- Aucune intervention humaine (sauf rollback)
\`\`\`

### Pipeline CI/CD typique

\`\`\`
┌──────┐   ┌───────┐   ┌──────┐   ┌─────────┐   ┌────────────┐
│ Code │──►│ Build │──►│ Test │──►│ Staging │──►│ Production │
│ Push │   │       │   │      │   │ Deploy  │   │ Deploy     │
└──────┘   └───────┘   └──────┘   └─────────┘   └────────────┘
  Git        Compile     Unit       Auto          Manuel ou
  commit     Package     Integ      deploy        Auto
             Docker      E2E
\`\`\`

### Avantages du CI/CD

| Sans CI/CD | Avec CI/CD |
|------------|------------|
| Build manuel (\"ca marche sur ma machine\") | Build automatise et reproductible |
| Tests oublies ou ignores | Tests obligatoires a chaque commit |
| Deploiement manuel (SSH, FTP) | Deploiement automatique et tracable |
| Integration une fois par semaine | Integration continue (chaque commit) |
| Bugs decouverts tard | Bugs detectes en minutes |
| Deploiement stressant | Deploiement routinier et serein |

### Outils CI/CD populaires

| Outil | Type | Points forts |
|-------|------|-------------|
| **GitHub Actions** | SaaS (GitHub) | Integration native GitHub, gratuit pour l'open source |
| **GitLab CI** | SaaS/Self-hosted | Integre dans GitLab, puissant |
| **Jenkins** | Self-hosted | Le plus configurable, plugins |
| **CircleCI** | SaaS | Rapide, bonne DX |
| **ArgoCD** | GitOps (K8s) | Deploiement Kubernetes declaratif |

> **Bonne pratique :** Commencez par la CI (build + tests automatiques). C'est le fondement. Ajoutez le CD (deploiement automatique) une fois que votre suite de tests est fiable. Ne deployez jamais automatiquement en production sans une couverture de tests suffisante.`
      },
      {
        title: 'GitHub Actions architecture',
        content: `**GitHub Actions** est la plateforme CI/CD integree a GitHub. Elle permet d'automatiser les workflows directement depuis votre repository.

### Concepts cles

\`\`\`
Repository (.github/workflows/)
└── Workflow (fichier YAML)
    └── Event (declencheur : push, PR, schedule, manual)
        └── Job (unite d'execution)
            └── Step (commande ou action)
                └── Action (module reutilisable)
\`\`\`

| Concept | Description |
|---------|-------------|
| **Workflow** | Processus automatise defini dans un fichier YAML |
| **Event** | Ce qui declenche le workflow (push, pull_request, schedule...) |
| **Job** | Ensemble de steps qui s'executent sur un runner |
| **Step** | Une commande ou une action individuelle |
| **Action** | Module reutilisable (marketplace GitHub Actions) |
| **Runner** | Machine qui execute le job (GitHub-hosted ou self-hosted) |

### Runners disponibles

| Runner | OS | CPU/RAM | Gratuit |
|--------|-----|---------|---------|
| \`ubuntu-latest\` | Ubuntu 22.04 | 2 vCPU, 7 Go | Oui (public repos) |
| \`windows-latest\` | Windows Server 2022 | 2 vCPU, 7 Go | Oui |
| \`macos-latest\` | macOS 14 | 3 vCPU, 14 Go | Oui (mais limites) |
| **Self-hosted** | Votre machine | Votre config | Oui |

### Premier workflow

\`\`\`yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build
\`\`\`

### Marketplace

Le **GitHub Actions Marketplace** propose des milliers d'actions reutilisables :

- \`actions/checkout\` : cloner le repo
- \`actions/setup-node\` : installer Node.js
- \`docker/build-push-action\` : build et push Docker
- \`aws-actions/configure-aws-credentials\` : configurer AWS

> **Conseil :** Utilisez toujours des versions fixees pour les actions (\`actions/checkout@v4\` au lieu de \`actions/checkout@main\`) pour eviter les breaking changes et les risques de supply chain attack.`
      },
      {
        title: 'Workflow YAML',
        content: `La syntaxe YAML des workflows GitHub Actions offre de nombreuses fonctionnalites pour definir des pipelines complexes.

### Structure complete d'un workflow

\`\`\`yaml
name: Deploy Pipeline

# Declencheurs
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'    # Chaque lundi a 2h
  workflow_dispatch:         # Declenchement manuel
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]

# Variables d'environnement globales
env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io

# Permissions
permissions:
  contents: read
  packages: write

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
    - run: npm ci
    - run: npm test

  build:
    needs: test       # Depend du job test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Build Docker image
      run: docker build -t myapp:\${{ github.sha }} .
    - name: Push to registry
      run: |
        echo \${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u \${{ github.actor }} --password-stdin
        docker push ghcr.io/\${{ github.repository }}/myapp:\${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'   # Seulement sur main
    environment: production                # Approbation requise
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying \${{ github.sha }} to production"
\`\`\`

### Expressions et contextes

\`\`\`yaml
# Contextes disponibles
\${{ github.sha }}              # Hash du commit
\${{ github.ref }}              # Branche (refs/heads/main)
\${{ github.actor }}            # Utilisateur qui a declenche
\${{ github.event_name }}       # Type d'evenement (push, PR)
\${{ secrets.MY_SECRET }}       # Secret du repository
\${{ vars.MY_VARIABLE }}        # Variable du repository
\${{ env.NODE_VERSION }}        # Variable d'environnement
\${{ needs.test.result }}       # Resultat du job precedent
\${{ matrix.node-version }}     # Valeur de la matrice

# Conditions
if: github.ref == 'refs/heads/main'
if: contains(github.event.head_commit.message, '[skip ci]') == false
if: \${{ success() }}           # Si les steps precedents ont reussi
if: \${{ failure() }}           # Si un step a echoue
if: \${{ always() }}            # Toujours executer
\`\`\`

### Caching des dependances

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-
\`\`\`

> **Bonne pratique :** Utilisez le caching pour accelerer vos pipelines. Un \`npm ci\` sans cache peut prendre 1-2 minutes ; avec cache, quelques secondes. Utilisez \`hashFiles()\` comme cle pour invalider le cache quand les dependances changent.`
      },
      {
        title: 'Jobs et steps',
        content: `Les **jobs** et **steps** sont les briques fondamentales d'un workflow GitHub Actions. Comprendre leur fonctionnement est essentiel pour construire des pipelines efficaces.

### Jobs : execution parallele et sequentielle

\`\`\`yaml
jobs:
  # Jobs paralleles (pas de "needs")
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm test

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm audit

  # Job sequentiel (depend des 3 precedents)
  build:
    needs: [lint, test, security]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run build

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - run: echo "Deploying to staging"

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production    # Approbation manuelle requise
    steps:
    - run: echo "Deploying to production"
\`\`\`

### Steps : types et fonctionnalites

\`\`\`yaml
steps:
  # Step avec une action du marketplace
  - name: Checkout
    uses: actions/checkout@v4
    with:
      fetch-depth: 0    # Historique Git complet

  # Step avec une commande shell
  - name: Install and build
    run: |
      npm ci
      npm run build
    working-directory: ./frontend

  # Step avec un ID (pour referencer le resultat)
  - name: Get version
    id: version
    run: echo "version=$(node -p 'require(\"./package.json\").version')" >> $GITHUB_OUTPUT

  # Step conditionnel
  - name: Deploy
    if: steps.version.outputs.version != ''
    run: echo "Deploying v\${{ steps.version.outputs.version }}"

  # Step qui continue meme si le precedent echoue
  - name: Cleanup
    if: always()
    run: docker system prune -f
\`\`\`

### Matrix strategy

La strategie **matrix** execute le meme job avec differentes combinaisons :

\`\`\`yaml
jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node: [18, 20]
        include:
          - os: ubuntu-latest
            node: 22
        exclude:
          - os: macos-latest
            node: 18
      fail-fast: false    # Continue les autres meme si un echoue
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node }}
    - run: npm ci && npm test
\`\`\`

### Artifacts : partager des fichiers entre jobs

\`\`\`yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run build
    - uses: actions/upload-artifact@v4
      with:
        name: build-output
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/download-artifact@v4
      with:
        name: build-output
        path: dist/
    - run: echo "Deploying dist/"
\`\`\`

> **Bonne pratique :** Executez les jobs independants en parallele (lint, test, security) et utilisez \`needs\` uniquement pour les dependances reelles. Cela reduit considerablement le temps total du pipeline. Utilisez \`fail-fast: false\` dans les matrices pour voir tous les echecs, pas seulement le premier.`
      },
      {
        title: "Secrets et variables d'environnement",
        content: `La gestion securisee des **secrets** et des **variables d'environnement** est cruciale dans un pipeline CI/CD.

### Secrets GitHub

Les secrets sont chiffres et ne sont jamais exposes dans les logs.

\`\`\`yaml
# Utiliser un secret
steps:
- name: Deploy to server
  env:
    SSH_KEY: \${{ secrets.SSH_PRIVATE_KEY }}
    API_TOKEN: \${{ secrets.API_TOKEN }}
  run: |
    echo "$SSH_KEY" > /tmp/key && chmod 600 /tmp/key
    ssh -i /tmp/key user@server "deploy.sh"
\`\`\`

### Niveaux de secrets

| Niveau | Scope | Configuration |
|--------|-------|---------------|
| **Repository** | Un seul repo | Settings > Secrets and variables > Actions |
| **Environment** | Un environnement specifique | Settings > Environments > [env] > Secrets |
| **Organization** | Tous les repos de l'org | Org Settings > Secrets |

### Variables (non-sensibles)

\`\`\`yaml
# Variables definies dans Settings > Variables
env:
  APP_NAME: \${{ vars.APP_NAME }}
  DEPLOY_URL: \${{ vars.DEPLOY_URL }}

steps:
- name: Show config
  run: |
    echo "Deploying \${{ vars.APP_NAME }} to \${{ vars.DEPLOY_URL }}"
\`\`\`

### Environments avec protection

\`\`\`yaml
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
    - name: Deploy
      env:
        DB_PASSWORD: \${{ secrets.DB_PASSWORD }}
      run: ./deploy.sh
\`\`\`

Les **environments** offrent des protections avancees :
- **Reviewers requis** : approbation manuelle avant le deploiement
- **Wait timer** : delai obligatoire avant le deploiement
- **Branch restrictions** : seules certaines branches peuvent deployer
- **Secrets specifiques** : chaque environnement a ses propres secrets

### GITHUB_TOKEN (secret automatique)

\`\`\`yaml
# Le GITHUB_TOKEN est automatiquement disponible
steps:
- name: Create release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v1.0.0
    release_name: Release v1.0.0
\`\`\`

### OIDC pour les cloud providers (sans credentials)

\`\`\`yaml
# Pas besoin de stocker des access keys AWS !
permissions:
  id-token: write
  contents: read

steps:
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/github-actions
    aws-region: eu-west-1

- name: Deploy to S3
  run: aws s3 sync dist/ s3://my-bucket/
\`\`\`

> **Regle d'or :** Ne stockez JAMAIS de secrets dans le code, les variables d'environnement du workflow YAML, ou les logs. Utilisez les GitHub Secrets pour tout ce qui est sensible. Pour les cloud providers, preferez l'**OIDC** (OpenID Connect) qui elimine completement le besoin de stocker des credentials longue duree.`
      }
    ]
  },
  {
    id: 132,
    slug: 'gitlab-ci-jenkins',
    title: 'GitLab CI & Jenkins',
    subtitle: 'Pipelines CI/CD avec GitLab CI et Jenkins : configuration et comparaison',
    icon: 'Settings',
    color: '#f59e0b',
    duration: '45 min',
    level: 'Intermediaire',
    videoId: 'Gy4Nk2pIuNs',
    sections: [
      {
        title: 'GitLab CI (.gitlab-ci.yml)',
        content: `**GitLab CI/CD** est la solution CI/CD integree a GitLab. Elle se configure via un fichier \`.gitlab-ci.yml\` a la racine du repository.

### Structure de base

\`\`\`yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "20"

# Job de build
build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# Job de test
test:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm test
  coverage: '/Statements\\s*:\\s*(\\d+\\.?\\d*)%/'

# Job de deploiement
deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging"
    - rsync -avz dist/ user@staging-server:/var/www/
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production"
  environment:
    name: production
    url: https://example.com
  when: manual          # Declenchement manuel
  only:
    - main
\`\`\`

### Concepts cles GitLab CI

| Concept | Description |
|---------|-------------|
| **Stages** | Phases du pipeline (build, test, deploy). Les jobs d'un meme stage s'executent en parallele |
| **Jobs** | Unite d'execution. Chaque job a un script, un stage et un runner |
| **Runners** | Machines qui executent les jobs (shared ou project-specific) |
| **Artifacts** | Fichiers produits par un job et passes aux jobs suivants |
| **Cache** | Fichiers caches entre les pipelines (node_modules, etc.) |
| **Variables** | Variables d'environnement (projet, groupe ou instance) |

### Cache vs Artifacts

\`\`\`yaml
# Cache : persiste entre les pipelines (meme branche)
cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

# Artifacts : passes entre les jobs d'un meme pipeline
build:
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
\`\`\`

### Rules (remplace only/except)

\`\`\`yaml
deploy:
  stage: deploy
  script: ./deploy.sh
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      when: never
    - when: on_success
\`\`\`

> **Point fort GitLab CI :** L'integration native avec GitLab (issues, merge requests, registry, monitoring) est son plus grand avantage. Le fichier \`.gitlab-ci.yml\` est plus intuitif que les workflows GitHub Actions pour les pipelines lineaires. Les environnements avec historique de deploiement sont particulierement bien faits.`
      },
      {
        title: 'Pipelines et stages',
        content: `Les **pipelines** GitLab CI sont composes de **stages** qui s'executent sequentiellement, chaque stage contenant des **jobs** qui s'executent en parallele.

### Pipeline multi-stages

\`\`\`yaml
stages:
  - validate
  - build
  - test
  - security
  - deploy

# Stage validate : lint + format
lint:
  stage: validate
  script: npm run lint

format-check:
  stage: validate
  script: npm run format:check

# Stage build
build-app:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]

build-docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# Stage test : en parallele
unit-test:
  stage: test
  script: npm test

integration-test:
  stage: test
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
  script:
    - npm run test:integration

# Stage security
sast:
  stage: security
  script: npm audit --audit-level=high

# Stage deploy
deploy-prod:
  stage: deploy
  when: manual
  environment:
    name: production
\`\`\`

### Pipeline DAG (Directed Acyclic Graph)

\`\`\`yaml
# Par defaut, les stages sont sequentiels.
# Avec needs, vous pouvez creer un DAG pour optimiser :

build-frontend:
  stage: build
  script: npm run build:frontend

build-backend:
  stage: build
  script: npm run build:backend

test-frontend:
  stage: test
  needs: [build-frontend]     # N'attend que build-frontend
  script: npm run test:frontend

test-backend:
  stage: test
  needs: [build-backend]      # N'attend que build-backend
  script: npm run test:backend

deploy:
  stage: deploy
  needs: [test-frontend, test-backend]
\`\`\`

### Pipelines enfant (child pipelines)

\`\`\`yaml
# Pipeline parent
trigger-frontend:
  stage: build
  trigger:
    include: frontend/.gitlab-ci.yml
    strategy: depend

trigger-backend:
  stage: build
  trigger:
    include: backend/.gitlab-ci.yml
    strategy: depend
\`\`\`

### Visualisation du pipeline

GitLab offre une visualisation graphique du pipeline directement dans l'interface web, montrant les stages, les jobs, leur statut et les dependances. Cela facilite le debug et le suivi des deploiements.

> **Bonne pratique :** Utilisez \`needs\` pour creer des DAG et eviter les attentes inutiles entre les stages. Un pipeline optimise avec DAG peut etre 2 a 3 fois plus rapide qu'un pipeline sequentiel classique.`
      },
      {
        title: 'Jenkins (Jenkinsfile)',
        content: `**Jenkins** est le serveur d'automatisation CI/CD le plus ancien et le plus configurable. Il se distingue par son architecture en plugins et sa flexibilite.

### Jenkinsfile declaratif

\`\`\`groovy
// Jenkinsfile (Declarative Pipeline)
pipeline {
    agent {
        docker {
            image 'node:20-alpine'
        }
    }

    environment {
        CI = 'true'
        DEPLOY_ENV = 'production'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm test'
                    }
                }
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**'
            }
        }

        stage('Deploy Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh './deploy.sh staging'
            }
        }

        stage('Deploy Production') {
            when {
                branch 'main'
            }
            input {
                message 'Deploy to production?'
                ok 'Deploy'
            }
            steps {
                sh './deploy.sh production'
            }
        }
    }

    post {
        success {
            slackSend message: "Build SUCCESS: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
        }
        failure {
            slackSend message: "Build FAILED: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
        }
        always {
            cleanWs()    // Nettoyer le workspace
        }
    }
}
\`\`\`

### Architecture Jenkins

\`\`\`
┌─────────────────────────────┐
│  Jenkins Controller (Master) │
│  - Interface web              │
│  - Planification des jobs     │
│  - Gestion des plugins        │
└──────────┬──────────────────┘
           │
     ┌─────┼─────┐
     │     │     │
  ┌──┴──┐┌─┴──┐┌┴───┐
  │Agent││Agent││Agent│   ← Executent les jobs
  │Linux││Docker││K8s │
  └─────┘└─────┘└────┘
\`\`\`

### Plugins essentiels

| Plugin | Usage |
|--------|-------|
| **Pipeline** | Definir les pipelines en code (Jenkinsfile) |
| **Git** | Integration avec les repositories Git |
| **Docker** | Build et execution dans des conteneurs |
| **Credentials** | Gestion securisee des secrets |
| **Blue Ocean** | Interface moderne pour les pipelines |
| **Slack/Teams** | Notifications |
| **SonarQube** | Analyse de qualite de code |

### Jenkins vs GitHub Actions vs GitLab CI

| Critere | Jenkins | GitHub Actions | GitLab CI |
|---------|---------|----------------|-----------|
| Hebergement | Self-hosted | SaaS | SaaS/Self-hosted |
| Configuration | Jenkinsfile (Groovy) | YAML | YAML |
| Plugins | 1800+ | Marketplace Actions | Built-in |
| Maintenance | A votre charge | Zero | Faible |
| Cout | Gratuit (infra a charge) | Gratuit (limites) | Gratuit (limites) |

> **Quand choisir Jenkins :** Si vous avez besoin d'un controle total sur votre infrastructure CI/CD, de pipelines tres complexes avec des plugins specifiques, ou si vous etes dans un environnement on-premise sans acces cloud. Pour les nouveaux projets, GitHub Actions ou GitLab CI sont generalement plus simples a mettre en place.`
      },
      {
        title: 'Comparaison des outils CI/CD',
        content: `Choisir le bon outil CI/CD depend de votre ecosysteme, de vos besoins et de vos competences.

### Matrice de comparaison detaillee

\`\`\`
                GitHub Actions   GitLab CI      Jenkins        ArgoCD
────────────    ──────────────   ─────────      ───────        ──────
Hebergement     SaaS             SaaS/On-prem   On-prem        On-prem (K8s)
Config          YAML             YAML           Groovy/YAML    YAML
VCS             GitHub           GitLab         Tous           Git (tous)
Docker natif    Oui              Oui (DinD)     Plugin         Non (K8s natif)
K8s deploy      Actions          Built-in       Plugin         Natif (GitOps)
Secrets         GitHub Secrets   CI Variables   Credentials    K8s Secrets
Runners         Hosted/Self      Shared/Self    Agents         N/A
Interface       GitHub UI        GitLab UI      Blue Ocean     Dashboard web
\`\`\`

### Criteres de choix

\`\`\`yaml
github_actions:
  ideal_pour:
    - Projets heberges sur GitHub
    - Open source (gratuit et illimite)
    - Equipes qui veulent zero maintenance
    - Ecosysteme d'actions communautaires
  limitations:
    - Lie a GitHub (vendor lock-in)
    - Minutes limitees en prive (2000 min/mois gratuit)

gitlab_ci:
  ideal_pour:
    - Equipes qui utilisent GitLab
    - Besoin de self-hosting
    - Pipeline + registry + monitoring integres
    - Securite (SAST/DAST integres)
  limitations:
    - Plus complexe que GitHub Actions
    - Interface parfois lente

jenkins:
  ideal_pour:
    - Pipelines tres complexes
    - Environnements on-premise
    - Ecosysteme de plugins specifiques
    - Controle total sur l'infrastructure
  limitations:
    - Maintenance lourde (mises a jour, plugins)
    - Interface vieillissante (Blue Ocean aide)
    - Courbe d'apprentissage Groovy

argocd:
  ideal_pour:
    - Deploiements Kubernetes (GitOps)
    - Sync automatique Git → cluster
    - Multi-cluster, multi-environnement
  limitations:
    - Uniquement Kubernetes
    - Pas de CI (seulement CD)
    - Necessite un outil CI en complement
\`\`\`

### Approche GitOps avec ArgoCD

\`\`\`yaml
# Application ArgoCD
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/manifests.git
    targetRevision: main
    path: environments/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

### Combinaison courante

\`\`\`
GitHub/GitLab (CI)          ArgoCD (CD)
┌──────────────┐           ┌──────────────┐
│ Code Push    │           │ Git Manifest  │
│ → Build      │──────────►│ → Sync K8s   │
│ → Test       │  Update   │ → Auto-heal  │
│ → Push Image │  manifests│ → Rollback   │
└──────────────┘           └──────────────┘
\`\`\`

> **Conseil :** Ne choisissez pas l'outil le plus puissant, choisissez celui qui s'integre le mieux dans votre ecosysteme existant. Si votre code est sur GitHub, utilisez GitHub Actions. Sur GitLab, utilisez GitLab CI. Pour les deploiements Kubernetes, ajoutez ArgoCD en complement de votre outil CI.`
      }
    ]
  },
  {
    id: 133,
    slug: 'prometheus-grafana',
    title: 'Prometheus & Grafana',
    subtitle: 'Monitoring et observabilite avec Prometheus pour les metriques et Grafana pour la visualisation',
    icon: 'BarChart',
    color: '#f59e0b',
    duration: '45 min',
    level: 'Avance',
    videoId: 'JoITFSa_8Ak',
    sections: [
      {
        title: 'Monitoring et observabilite',
        content: `Le **monitoring** et l'**observabilite** sont essentiels pour comprendre le comportement de vos systemes en production et detecter les problemes avant qu'ils n'impactent les utilisateurs.

### Les trois piliers de l'observabilite

\`\`\`
Observabilite
├── Metriques (Metrics)     → Prometheus, Datadog
│   Valeurs numeriques dans le temps
│   Ex: CPU 75%, 1500 req/s, latence p99 = 200ms
│
├── Logs (Journalisation)   → ELK, Loki, Fluentd
│   Evenements textuels horodates
│   Ex: [ERROR] 2024-01-15 Connection refused to DB
│
└── Traces (Tracing)        → Jaeger, Zipkin, Tempo
    Suivi d'une requete a travers les microservices
    Ex: API → Auth → DB → Cache → Response (350ms total)
\`\`\`

### Metriques : les 4 Golden Signals (Google SRE)

| Signal | Description | Exemple |
|--------|-------------|---------|
| **Latency** | Temps de reponse des requetes | p50 = 50ms, p99 = 500ms |
| **Traffic** | Volume de demandes | 1500 requetes/seconde |
| **Errors** | Taux d'erreurs | 0.5% de requetes en erreur (5xx) |
| **Saturation** | Niveau d'utilisation des ressources | CPU a 85%, disque a 90% |

### Metriques RED (microservices)

| Metrique | Description |
|----------|-------------|
| **Rate** | Nombre de requetes par seconde |
| **Errors** | Nombre de requetes en erreur |
| **Duration** | Distribution des temps de reponse |

### Metriques USE (infrastructure)

| Metrique | Description |
|----------|-------------|
| **Utilization** | Pourcentage de la ressource utilisee |
| **Saturation** | File d'attente (travail en attente) |
| **Errors** | Nombre d'erreurs de la ressource |

### Stack de monitoring moderne

\`\`\`
┌─────────────────────────────────────────────┐
│               Grafana (Visualisation)        │
│  Dashboards + Alertes + Correlations         │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
┌──────┴──────┐ ┌─────┴─────┐ ┌─────┴──────┐
│ Prometheus  │ │   Loki    │ │   Tempo    │
│ (Metriques) │ │  (Logs)   │ │  (Traces)  │
└─────────────┘ └───────────┘ └────────────┘
\`\`\`

> **Distinction cle :** Le **monitoring** repond a la question "est-ce que ca marche ?". L'**observabilite** repond a "pourquoi ca ne marche pas ?". Un systeme est observable si vous pouvez comprendre son etat interne a partir de ses sorties (metriques, logs, traces).`
      },
      {
        title: 'Prometheus (architecture/metriques/PromQL)',
        content: `**Prometheus** est un systeme de monitoring open-source cree par SoundCloud, aujourd'hui projet diplome de la CNCF. C'est le standard de facto pour le monitoring dans l'ecosysteme Kubernetes.

### Architecture Prometheus

\`\`\`
┌─────────────────────────────────────────────┐
│              Prometheus Server               │
│                                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
│  │ Retrieval │  │   TSDB    │  │  HTTP    │ │
│  │ (scrape)  │  │ (stockage)│  │  Server  │ │
│  └────┬─────┘  └───────────┘  └────┬─────┘ │
│       │                             │        │
└───────┼─────────────────────────────┼────────┘
        │  Pull (scrape)              │ PromQL
        │                             │
   ┌────┼────────┐              ┌─────┴──────┐
   │    │        │              │  Grafana   │
Targets:                        │  Alertmanager
├── Node Exporter (:9100)       └────────────┘
├── App metrics   (:8080/metrics)
├── cAdvisor      (:8080)
└── kube-state-metrics
\`\`\`

### Modele Pull vs Push

Prometheus utilise un modele **pull** : il va chercher les metriques aupres des cibles (scrape) plutot que de recevoir des metriques poussees.

### Types de metriques

| Type | Description | Exemple |
|------|-------------|---------|
| **Counter** | Valeur qui ne fait qu'augmenter | Nombre total de requetes |
| **Gauge** | Valeur qui monte et descend | Temperature, CPU, memoire |
| **Histogram** | Distribution de valeurs (buckets) | Latence des requetes |
| **Summary** | Distribution avec quantiles pre-calcules | Latence p50, p90, p99 |

### Exposer des metriques

\`\`\`bash
# Endpoint /metrics d'une application
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/api/users",status="200"} 1542
http_requests_total{method="POST",path="/api/users",status="201"} 89
http_requests_total{method="GET",path="/api/users",status="500"} 3

# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.01"} 500
http_request_duration_seconds_bucket{le="0.05"} 1200
http_request_duration_seconds_bucket{le="0.1"} 1400
http_request_duration_seconds_bucket{le="+Inf"} 1542
\`\`\`

### PromQL — Prometheus Query Language

\`\`\`bash
# Requetes de base
http_requests_total                    # Toutes les series
http_requests_total{status="500"}      # Filtrer par label
http_requests_total{status=~"5.."}     # Regex

# Taux (rate) — le plus utilise
rate(http_requests_total[5m])          # Requetes/seconde sur 5 min
irate(http_requests_total[5m])         # Taux instantane

# Aggregations
sum(rate(http_requests_total[5m]))                    # Total requetes/s
sum by (status)(rate(http_requests_total[5m]))        # Par code status
avg by (instance)(node_cpu_seconds_total)             # CPU moyen par instance

# Quantiles (latence)
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
# → latence p99

# Alertes
http_requests_total{status="500"} / http_requests_total > 0.01
# → true si plus de 1% d'erreurs 500
\`\`\`

> **Bonne pratique :** Utilisez toujours \`rate()\` avec les counters — un counter brut (1542) n'est pas utile, mais son taux de variation (50 req/s) l'est. Pour les histogrammes, utilisez \`histogram_quantile()\` pour calculer les percentiles (p50, p90, p99).`
      },
      {
        title: 'Grafana (dashboards/alertes)',
        content: `**Grafana** est la plateforme de visualisation et d'alerting la plus populaire. Elle se connecte a de nombreuses sources de donnees (Prometheus, Loki, Elasticsearch, InfluxDB, etc.) pour creer des dashboards interactifs.

### Installation avec Helm

\`\`\`bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana \\
  --namespace monitoring \\
  --create-namespace \\
  --set persistence.enabled=true \\
  --set adminPassword='SecureP@ss'
\`\`\`

### Dashboard type — Application web

Un bon dashboard inclut :

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Application Dashboard                               │
│                                                       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐│
│  │ Requests/s│ │ Error Rate│ │ Latency   │ │ CPU  ││
│  │  1,500    │ │   0.3%    │ │ p99: 180ms│ │  65% ││
│  └───────────┘ └───────────┘ └───────────┘ └──────┘│
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Request Rate (by status code)                   │ │
│  │  ━━━ 200  ━━━ 201  ━━━ 404  ━━━ 500            │ │
│  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁               │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Response Time Distribution (p50, p90, p99)      │ │
│  │  ▁▁▂▂▃▃▄▅▅▆▆▇▇██▇▆▅▄▃▂▁                       │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
\`\`\`

### Configurer les alertes Grafana

\`\`\`yaml
# Alerte : taux d'erreurs > 1%
# Dans Grafana UI : Alerting > Alert rules > New rule

# Requete PromQL
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
> 0.01

# Configuration
evaluation_interval: 1m     # Evaluer toutes les minutes
for: 5m                     # Attendre 5 min avant d'alerter (evite les faux positifs)
severity: critical
\`\`\`

### Alertmanager (Prometheus)

\`\`\`yaml
# alertmanager.yml
route:
  receiver: 'slack-critical'
  group_by: ['alertname', 'namespace']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
  - match:
      severity: critical
    receiver: 'slack-critical'
  - match:
      severity: warning
    receiver: 'slack-warnings'

receivers:
- name: 'slack-critical'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/xxx'
    channel: '#alerts-critical'
    title: '{{ .GroupLabels.alertname }}'
    text: '{{ .Annotations.description }}'
\`\`\`

### Dashboards communautaires

Grafana propose un catalogue de dashboards pre-faits sur **grafana.com/grafana/dashboards** :

| Dashboard ID | Nom | Usage |
|-------------|-----|-------|
| 1860 | Node Exporter Full | Monitoring serveur Linux |
| 315 | Kubernetes Cluster | Vue d'ensemble K8s |
| 7249 | Kubernetes Pods | Details par pod |
| 12740 | Kubernetes API Server | Monitoring API Server |

> **Conseil :** Ne creez pas vos dashboards from scratch. Importez un dashboard communautaire comme base et personnalisez-le selon vos besoins. Utilisez des **variables de template** (namespace, pod, instance) pour rendre vos dashboards dynamiques et reutilisables.`
      },
      {
        title: 'Exporters et ServiceMonitor',
        content: `Les **exporters** exposent les metriques de services tiers au format Prometheus. Les **ServiceMonitors** sont des objets Kubernetes qui configurent automatiquement le scraping.

### Exporters populaires

| Exporter | Port | Metriques |
|----------|------|-----------|
| **Node Exporter** | 9100 | CPU, RAM, disque, reseau du serveur |
| **cAdvisor** | 8080 | Metriques des conteneurs (CPU, memoire, I/O) |
| **kube-state-metrics** | 8080 | Etat des objets K8s (pods, deployments, nodes) |
| **MySQL Exporter** | 9104 | Queries, connections, replication |
| **Postgres Exporter** | 9187 | Queries, locks, replication |
| **Redis Exporter** | 9121 | Memory, commands, clients |
| **Nginx Exporter** | 9113 | Requests, connections, status |
| **Blackbox Exporter** | 9115 | Probes HTTP, DNS, TCP, ICMP |

### Deployer Node Exporter sur Kubernetes

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet          # Un pod par noeud
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true
      hostPID: true
      containers:
      - name: node-exporter
        image: prom/node-exporter:v1.7.0
        ports:
        - containerPort: 9100
        args:
        - '--path.rootfs=/host'
        volumeMounts:
        - name: rootfs
          mountPath: /host
          readOnly: true
      volumes:
      - name: rootfs
        hostPath:
          path: /
\`\`\`

### ServiceMonitor (Prometheus Operator)

Le **Prometheus Operator** simplifie la configuration de Prometheus dans Kubernetes. Les **ServiceMonitors** definissent automatiquement les cibles a scraper :

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api-monitor
  namespace: monitoring
  labels:
    release: prometheus       # Doit matcher le selector de Prometheus
spec:
  selector:
    matchLabels:
      app: api                # Cible les Services avec ce label
  namespaceSelector:
    matchNames:
    - production
  endpoints:
  - port: metrics             # Nom du port dans le Service
    interval: 15s             # Frequence de scraping
    path: /metrics            # Chemin des metriques
\`\`\`

### Installer la stack complete avec kube-prometheus-stack

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  --create-namespace \\
  --set grafana.adminPassword='SecureP@ss'

# Cette chart installe :
# - Prometheus Operator
# - Prometheus Server
# - Alertmanager
# - Grafana (avec dashboards pre-configures)
# - Node Exporter
# - kube-state-metrics
# - ServiceMonitors pour les composants K8s
\`\`\`

### Instrumenter votre application

\`\`\`javascript
// Node.js avec prom-client
const client = require('prom-client');

// Metrics par defaut (CPU, memoire, event loop)
client.collectDefaultMetrics();

// Counter custom
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status']
});

// Histogram custom
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'path'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5]
});

// Middleware Express
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, path: req.path });
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, path: req.path, status: res.statusCode });
    end();
  });
  next();
});

// Endpoint /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
\`\`\`

> **Bonne pratique :** Utilisez la chart Helm \`kube-prometheus-stack\` pour installer toute la stack de monitoring en une commande. Elle inclut des dashboards Grafana et des alertes pre-configurees pour Kubernetes. Ajoutez des ServiceMonitors pour vos propres applications.`
      }
    ]
  },
  {
    id: 134,
    slug: 'elk-stack-logging',
    title: 'ELK Stack & Logging',
    subtitle: 'Centraliser et analyser les logs avec Elasticsearch, Logstash et Kibana',
    icon: 'Database',
    color: '#f59e0b',
    duration: '40 min',
    level: 'Avance',
    videoId: 'QmSIml8lo-c',
    sections: [
      {
        title: 'Architecture ELK',
        content: `La **stack ELK** (Elasticsearch, Logstash, Kibana) est la solution de logging centralisee la plus populaire. Elle permet de collecter, stocker, rechercher et visualiser les logs de toute votre infrastructure.

### Pourquoi centraliser les logs ?

Sans centralisation, les logs sont disperses sur chaque serveur et conteneur. Retrouver une erreur necessite de se connecter en SSH a chaque machine. Avec une stack de logging centralisee, tous les logs sont dans un seul endroit, recherchables et correlables.

### Architecture classique

\`\`\`
┌─────────┐  ┌─────────┐  ┌─────────┐
│ App 1   │  │ App 2   │  │ App 3   │
│ (logs)  │  │ (logs)  │  │ (logs)  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     ▼            ▼            ▼
┌────────────────────────────────────┐
│     Logstash / Fluentd / Beats    │  ← Collection
│     (parsing, enrichissement)      │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│         Elasticsearch              │  ← Stockage + Recherche
│    (index, full-text search)       │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│            Kibana                  │  ← Visualisation
│    (dashboards, requetes, alertes) │
└────────────────────────────────────┘
\`\`\`

### Evolution : Elastic Stack

La stack ELK a evolue vers l'**Elastic Stack** qui inclut aussi **Beats** (agents legers de collecte) :

\`\`\`
Beats (agents legers)
├── Filebeat    → Collecte de fichiers de logs
├── Metricbeat  → Collecte de metriques systeme
├── Packetbeat  → Analyse de trafic reseau
├── Heartbeat   → Monitoring de disponibilite (probes)
└── Auditbeat   → Audit de securite
\`\`\`

### Flux de donnees typique

\`\`\`
App → stdout/stderr → Container Runtime → Filebeat → Logstash → Elasticsearch → Kibana
                                           (collecte)  (parse)    (stocke)      (visualise)
\`\`\`

> **Dimensionnement :** Elasticsearch est gourmand en ressources. Pour un cluster de production moyen (100 Go de logs/jour), prevoyez au minimum 3 noeuds Elasticsearch avec 16 Go de RAM et des SSDs. La RAM est le facteur le plus critique pour les performances de recherche.`
      },
      {
        title: 'Elasticsearch',
        content: `**Elasticsearch** est un moteur de recherche et d'analyse distribue base sur Apache Lucene. Il stocke les logs sous forme de documents JSON indexes et offre une recherche full-text ultrarapide.

### Concepts cles

| Concept | Description | Analogie SQL |
|---------|-------------|-------------|
| **Index** | Collection de documents | Table |
| **Document** | Un enregistrement JSON | Ligne |
| **Field** | Un champ dans un document | Colonne |
| **Mapping** | Schema des champs | DDL (CREATE TABLE) |
| **Shard** | Partition d'un index | Partition |
| **Replica** | Copie d'un shard | Replication |

### Requetes Elasticsearch

\`\`\`bash
# Chercher des erreurs dans les logs des dernieres 24h
curl -X GET "localhost:9200/logs-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ],
      "filter": [
        { "term": { "service": "api-gateway" } }
      ]
    }
  },
  "sort": [{ "@timestamp": { "order": "desc" } }],
  "size": 50
}'

# Aggregation : nombre d'erreurs par service
curl -X GET "localhost:9200/logs-*/_search" -d'
{
  "size": 0,
  "aggs": {
    "errors_by_service": {
      "terms": { "field": "service.keyword" },
      "aggs": {
        "error_count": {
          "filter": { "term": { "level": "ERROR" } }
        }
      }
    }
  }
}'
\`\`\`

### Index Lifecycle Management (ILM)

\`\`\`json
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50gb",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": { "number_of_shards": 1 },
          "forcemerge": { "max_num_segments": 1 }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": { "delete": {} }
      }
    }
  }
}
\`\`\`

> **Bonne pratique :** Configurez toujours une politique ILM pour gerer le cycle de vie de vos index. Sans ILM, votre cluster Elasticsearch va finir par manquer d'espace disque. Les logs de plus de 30 jours devraient etre archives ou supprimes.`
      },
      {
        title: 'Logstash',
        content: `**Logstash** est le composant de traitement de la stack ELK. Il recoit les logs bruts, les parse, les enrichit et les envoie vers Elasticsearch (ou d'autres destinations).

### Pipeline Logstash

Un pipeline Logstash comporte trois phases : **input**, **filter**, **output**.

\`\`\`ruby
# /etc/logstash/conf.d/pipeline.conf

# INPUT : source des logs
input {
  beats {
    port => 5044       # Filebeat envoie les logs ici
  }

  tcp {
    port => 5000       # Logs via TCP (Docker, syslog)
    codec => json
  }
}

# FILTER : parsing et enrichissement
filter {
  # Parser les logs JSON
  if [message] =~ /^{/ {
    json {
      source => "message"
    }
  }

  # Parser les logs Apache/Nginx
  if [fileset][name] == "access" {
    grok {
      match => {
        "message" => '%{IPORHOST:remote_ip} - %{DATA:user} \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{DATA:url} HTTP/%{NUMBER:http_version}" %{NUMBER:status} %{NUMBER:bytes}'
      }
    }
  }

  # Enrichissement GeoIP
  if [remote_ip] {
    geoip {
      source => "remote_ip"
      target => "geo"
    }
  }

  # Ajouter des champs
  mutate {
    add_field => { "environment" => "production" }
    remove_field => ["agent", "ecs", "host"]
  }

  # Parser les dates
  date {
    match => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
    target => "@timestamp"
  }
}

# OUTPUT : destination
output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{[service]}-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "changeme"
  }

  # Debug : afficher dans stdout
  # stdout { codec => rubydebug }
}
\`\`\`

### Grok patterns

Grok est le filtre le plus utilise pour parser les logs non-structures :

\`\`\`ruby
# Pattern Grok pour un log d'application
# Log: 2024-01-15 14:30:25 [ERROR] [api-service] User not found: id=42
grok {
  match => {
    "message" => "%{TIMESTAMP_ISO8601:timestamp} \[%{LOGLEVEL:level}\] \[%{DATA:service}\] %{GREEDYDATA:msg}"
  }
}
\`\`\`

### Filebeat (agent de collecte)

\`\`\`yaml
# filebeat.yml
filebeat.inputs:
- type: container
  paths:
    - '/var/lib/docker/containers/*/*.log'
  processors:
  - add_kubernetes_metadata:
      host: \${NODE_NAME}

output.logstash:
  hosts: ["logstash:5044"]
\`\`\`

> **Conseil :** Dans les architectures modernes, Filebeat a remplace Logstash comme collecteur sur les noeuds. Logstash est utilise uniquement pour le parsing et l'enrichissement centralise. Cette architecture (Filebeat → Logstash → Elasticsearch) est plus performante et moins gourmande en ressources.`
      },
      {
        title: 'Kibana',
        content: `**Kibana** est l'interface de visualisation de la stack Elastic. Elle permet de rechercher, analyser et visualiser les logs stockes dans Elasticsearch.

### Fonctionnalites principales

| Fonctionnalite | Description |
|----------------|-------------|
| **Discover** | Recherche et exploration des logs en temps reel |
| **Dashboard** | Tableaux de bord avec graphiques et metriques |
| **Lens** | Editeur visuel de graphiques (drag & drop) |
| **Alerting** | Regles d'alerte basees sur les logs |
| **Maps** | Visualisation geographique (GeoIP) |
| **Dev Tools** | Console pour executer des requetes Elasticsearch |

### KQL (Kibana Query Language)

\`\`\`bash
# Recherche simple
level: ERROR

# Avec AND/OR
level: ERROR AND service: api-gateway
level: ERROR OR level: FATAL

# Wildcards
message: *timeout*
service: api-*

# Ranges
status >= 500
@timestamp >= "2024-01-15" AND @timestamp < "2024-01-16"

# Negation
NOT level: DEBUG
level: ERROR AND NOT service: healthcheck

# Champs imbriques
geo.country_name: France
\`\`\`

### Dashboard type pour les logs

\`\`\`
┌──────────────────────────────────────────────────────┐
│  Logs Dashboard                                       │
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ Total    │ │ Errors   │ │ Warnings │ │ Services ││
│  │ 125,432  │ │    342   │ │  1,205   │ │    12    ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                        │
│  ┌────────────────────────────────────────────────────┐│
│  │  Log Volume Over Time (stacked by level)           ││
│  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁                 ││
│  └────────────────────────────────────────────────────┘│
│                                                        │
│  ┌─────────────────────┐ ┌────────────────────────────┐│
│  │ Top Errors (table)  │ │ Errors by Service (pie)    ││
│  │ Connection refused  │ │                            ││
│  │ Timeout expired     │ │                            ││
│  │ Auth failed         │ │                            ││
│  └─────────────────────┘ └────────────────────────────┘│
└──────────────────────────────────────────────────────┘
\`\`\`

### Alerting dans Kibana

\`\`\`yaml
# Alerte : plus de 100 erreurs en 5 minutes
rule:
  type: threshold
  index: logs-*
  time_field: '@timestamp'
  group_by: service
  conditions:
    - when: count
      of: level:ERROR
      over: 5m
      is_above: 100
  actions:
    - type: slack
      channel: '#alerts'
      message: '{{ context.group }} has {{ context.value }} errors in the last 5 minutes'
\`\`\`

> **Bonne pratique :** Creez des **Data Views** (anciennement Index Patterns) avec des noms descriptifs comme \`logs-api-*\`, \`logs-frontend-*\`. Utilisez des filtres de temps courts (derniere heure, dernieres 24h) pour des recherches rapides. Les requetes sur des plages de temps trop longues peuvent surcharger Elasticsearch.`
      },
      {
        title: 'Alternatives (Loki/Fluentd)',
        content: `La stack ELK n'est pas la seule option pour le logging centralise. Des alternatives plus legeres et modernes existent.

### Grafana Loki — "Prometheus for logs"

**Loki** est un systeme d'agregation de logs concu par Grafana Labs. Contrairement a Elasticsearch, Loki n'indexe **pas** le contenu des logs — il indexe uniquement les **labels** (metadonnees), ce qui le rend beaucoup plus leger.

\`\`\`
Elasticsearch                   Loki
─────────────                   ────
Full-text indexing              Index par labels uniquement
Gourmand en RAM/disque          Leger (10x moins de ressources)
Recherche ultra-rapide           Recherche par labels + grep
Schema riche (mapping)          Pas de schema (logs bruts)
Kibana (interface dediee)       Grafana (meme outil que metriques)
\`\`\`

### Architecture Loki

\`\`\`
┌─────────┐  ┌─────────┐  ┌─────────┐
│ App 1   │  │ App 2   │  │ App 3   │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     ▼            ▼            ▼
┌────────────────────────────────────┐
│           Promtail                 │  ← Agent de collecte
│   (equivalent de Filebeat)          │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│             Loki                   │  ← Stockage (S3, GCS, filesystem)
│   (index labels + chunks logs)      │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│           Grafana                  │  ← Visualisation (LogQL)
└────────────────────────────────────┘
\`\`\`

### LogQL (langage de requete Loki)

\`\`\`bash
# Filtrer par labels
{namespace="production", app="api"}

# Filtrer le contenu (grep)
{app="api"} |= "error"
{app="api"} !~ "healthcheck"

# Parser les logs JSON
{app="api"} | json | status >= 500

# Aggregations
sum(rate({app="api"} |= "error" [5m])) by (namespace)
\`\`\`

### Fluentd et Fluent Bit

**Fluentd** et **Fluent Bit** sont des collecteurs de logs open-source de la CNCF.

| | Fluentd | Fluent Bit |
|-|---------|------------|
| Langage | Ruby + C | C |
| Memoire | ~40 Mo | ~450 Ko |
| Plugins | 1000+ | ~70 (les plus utilises) |
| Usage | Aggregateur central | Agent sur chaque noeud |

\`\`\`yaml
# Fluent Bit sur Kubernetes (DaemonSet)
# fluent-bit.conf
[INPUT]
    Name              tail
    Path              /var/log/containers/*.log
    Parser            docker
    Tag               kube.*
    Mem_Buf_Limit     5MB

[FILTER]
    Name              kubernetes
    Match             kube.*
    Merge_Log         On

[OUTPUT]
    Name              loki
    Match             *
    Host              loki.monitoring.svc
    Port              3100
    Labels            job=fluent-bit
\`\`\`

### Quand choisir quoi ?

\`\`\`yaml
elk_stack:
  quand:
    - Besoin de recherche full-text avancee
    - Gros volumes avec analyses complexes
    - Equipe familiere avec Elasticsearch
  attention: Gourmand en ressources et couteux

loki:
  quand:
    - Vous utilisez deja Grafana et Prometheus
    - Budget limite (beaucoup moins de ressources)
    - Logs principalement filtres par labels/service
  attention: Recherche full-text moins performante

fluentd_fluent_bit:
  quand:
    - Collecteur de logs dans Kubernetes (CNCF standard)
    - Besoin de router vers plusieurs destinations
    - Remplacement de Logstash (plus leger)
\`\`\`

> **Recommandation :** Pour les nouvelles installations, considerez **Loki + Promtail + Grafana** plutot que la stack ELK. Loki est 10x moins gourmand en ressources, s'integre parfaitement avec Prometheus et Grafana, et suffit pour 90% des cas d'usage de logging. Reservez ELK pour les cas necessitant une recherche full-text avancee.`
      }
    ]
  },
  {
    id: 135,
    slug: 'devsecops-secrets',
    title: 'DevSecOps & Gestion des Secrets',
    subtitle: 'Integrer la securite dans le cycle DevOps et gerer les secrets de maniere securisee',
    icon: 'ShieldCheck',
    color: '#f59e0b',
    duration: '40 min',
    level: 'Avance',
    videoId: '',
    sections: [
      {
        title: 'Principes DevSecOps',
        content: `Le **DevSecOps** integre la securite a chaque etape du cycle de vie du logiciel, au lieu de la traiter comme une etape finale. Le principe fondamental est **"shift left"** : deplacer la securite le plus tot possible dans le pipeline.

### DevOps vs DevSecOps

\`\`\`
DevOps traditionnel :
Plan → Code → Build → Test → Deploy → Operate → Monitor
                                 ↑
                          Security review (trop tard !)

DevSecOps :
Plan → Code → Build → Test → Deploy → Operate → Monitor
  ↑      ↑      ↑       ↑       ↑        ↑         ↑
 Threat  SAST   SCA    DAST    Config   Runtime   Audit
 Model   Lint   Deps   Pentest  Scan    Protect   Log
\`\`\`

### Les piliers du DevSecOps

| Pilier | Description | Outils |
|--------|-------------|--------|
| **Shift Left** | Securite des le code (pre-commit, IDE) | ESLint security, git-secrets |
| **Automatisation** | Scans automatiques dans le CI/CD | tfsec, trivy, OWASP ZAP |
| **Culture** | Formation, responsabilite partagee | Security champions, CTF internes |
| **Feedback rapide** | Resultats de securite dans les PRs | SonarQube, Snyk, GitHub Security |
| **Compliance as Code** | Politiques de conformite automatisees | OPA, Kyverno, Sentinel |

### Pipeline DevSecOps

\`\`\`yaml
# .github/workflows/devsecops.yml
name: DevSecOps Pipeline
on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: SAST - SonarQube
      uses: SonarSource/sonarqube-scan-action@v2
    - name: SAST - Semgrep
      uses: returntocorp/semgrep-action@v1

  sca:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: SCA - Dependency check
      run: npm audit --audit-level=high
    - name: SCA - Snyk
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}

  container-scan:
    runs-on: ubuntu-latest
    steps:
    - name: Build image
      run: docker build -t myapp:\${{ github.sha }} .
    - name: Scan image - Trivy
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: myapp:\${{ github.sha }}
        severity: 'CRITICAL,HIGH'

  iac-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: IaC scan - tfsec
      uses: aquasecurity/tfsec-action@v1.0.0
    - name: IaC scan - Checkov
      uses: bridgecrewio/checkov-action@v12
\`\`\`

> **Philosophie DevSecOps :** La securite n'est pas une barriere, c'est un accelerateur. En detectant les vulnerabilites tot (dans le code, pas en production), vous evitez les incidents couteux et les correctifs d'urgence. L'objectif est de rendre la securite aussi naturelle que les tests unitaires.`
      },
      {
        title: 'SAST/DAST/SCA',
        content: `Les tests de securite automatises se declinent en trois categories principales qui couvrent differents aspects de la securite applicative.

### SAST (Static Application Security Testing)

L'analyse **statique** examine le code source sans l'executer pour detecter les vulnerabilites.

\`\`\`
Code source → Analyse statique → Rapport de vulnerabilites

Detecte :
- Injections SQL
- Cross-Site Scripting (XSS)
- Buffer overflows
- Secrets en dur dans le code
- Configurations non securisees
\`\`\`

| Outil | Langages | Type |
|-------|----------|------|
| **SonarQube** | 25+ langages | Open source / Commercial |
| **Semgrep** | 20+ langages | Open source |
| **CodeQL** | 10+ langages | Gratuit (GitHub) |
| **Bandit** | Python | Open source |
| **ESLint (security)** | JavaScript | Open source |

### DAST (Dynamic Application Security Testing)

L'analyse **dynamique** teste l'application en cours d'execution en simulant des attaques.

\`\`\`
Application deployee → Scanner DAST → Attaques simulees → Rapport

Detecte :
- Injections (SQL, LDAP, OS)
- XSS reflete et stocke
- CSRF
- Misconfigurations serveur
- Headers de securite manquants
\`\`\`

\`\`\`bash
# OWASP ZAP - scan automatique
docker run -t owasp/zap2docker-stable zap-baseline.py \\
  -t https://staging.example.com \\
  -r report.html

# Nuclei - scanner de vulnerabilites
nuclei -u https://staging.example.com -t cves/ -severity critical,high
\`\`\`

### SCA (Software Composition Analysis)

L'analyse de **composition logicielle** identifie les vulnerabilites dans les dependances (libraries, packages).

\`\`\`bash
# npm audit
npm audit
# found 3 high severity vulnerabilities

# Snyk
snyk test
# ✗ High severity vulnerability found in lodash
#   Description: Prototype Pollution
#   Fix: upgrade lodash to 4.17.21

# Trivy (images Docker)
trivy image myapp:latest
# Total: 12 (HIGH: 8, CRITICAL: 4)
\`\`\`

### Comparaison SAST vs DAST vs SCA

| | SAST | DAST | SCA |
|-|------|------|-----|
| **Quand** | Pendant le dev (CI) | Apres deploiement (staging) | Pendant le dev (CI) |
| **Analyse** | Code source | Application running | Dependances |
| **Faux positifs** | Eleves | Faibles | Faibles |
| **Couverture** | 100% du code | Routes testees | 100% des deps |
| **Vitesse** | Rapide | Lent (crawling) | Rapide |

### Integration dans le pipeline

\`\`\`
Commit → SAST + SCA → Build → Container Scan → Deploy Staging → DAST → Deploy Prod
          (code)        (deps)    (image)                          (app running)
\`\`\`

> **Bonne pratique :** Utilisez les trois types de tests ensemble — ils sont complementaires. Le SAST detecte les bugs dans votre code, le SCA dans vos dependances, et le DAST dans l'application deployee. Configurez-les pour bloquer le pipeline sur les vulnerabilites critiques et hautes.`
      },
      {
        title: 'Vault (HashiCorp)',
        content: `**HashiCorp Vault** est la solution de reference pour la gestion centralisee des secrets. Il fournit un acces securise aux tokens, mots de passe, certificats et cles de chiffrement.

### Pourquoi Vault ?

\`\`\`
Sans Vault                          Avec Vault
──────────                          ──────────
Secrets dans .env                   Secrets centralises et chiffres
Secrets dans les variables CI       Acces temporaire (leases)
Pas de rotation                     Rotation automatique
Pas d'audit trail                   Audit complet de chaque acces
Meme secret partout                 Secret unique par service/env
\`\`\`

### Architecture Vault

\`\`\`
┌─────────────────────────────────────────┐
│              Vault Server                │
│                                          │
│  ┌──────────┐  ┌───────────────────┐    │
│  │ Auth     │  │ Secrets Engines   │    │
│  │ Methods  │  │ ├── KV (key-value)│    │
│  │ ├── Token│  │ ├── Database      │    │
│  │ ├── K8s  │  │ ├── PKI (certs)  │    │
│  │ ├── LDAP │  │ ├── AWS          │    │
│  │ └── OIDC │  │ └── Transit      │    │
│  └──────────┘  └───────────────────┘    │
│                                          │
│  ┌──────────┐  ┌───────────────────┐    │
│  │ Policies │  │ Audit Logs        │    │
│  │ (ACL)    │  │ (chaque acces)    │    │
│  └──────────┘  └───────────────────┘    │
│                                          │
│  Storage Backend : Consul, Raft, S3      │
└─────────────────────────────────────────┘
\`\`\`

### Commandes Vault essentielles

\`\`\`bash
# Authentification
vault login
vault login -method=userpass username=admin

# KV secrets (version 2)
vault kv put secret/myapp/db username=admin password=S3cret!
vault kv get secret/myapp/db
vault kv get -field=password secret/myapp/db
vault kv delete secret/myapp/db

# Lister les secrets
vault kv list secret/myapp/

# Secrets dynamiques (database)
vault read database/creds/my-role
# Key             Value
# lease_id        database/creds/my-role/abc123
# lease_duration  1h
# username        v-token-my-role-abc123
# password        A1B2C3D4-random-password
\`\`\`

### Secrets dynamiques pour bases de donnees

\`\`\`bash
# Configurer le moteur database
vault secrets enable database

vault write database/config/mysql \\
  plugin_name=mysql-database-plugin \\
  connection_url="{{username}}:{{password}}@tcp(db.example.com:3306)/" \\
  allowed_roles="my-role" \\
  username="vault-admin" \\
  password="vault-pass"

vault write database/roles/my-role \\
  db_name=mysql \\
  creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}'; GRANT SELECT ON mydb.* TO '{{name}}'@'%';" \\
  default_ttl="1h" \\
  max_ttl="24h"
\`\`\`

### Vault Agent (injection sidecar pour K8s)

\`\`\`yaml
# Annotations pour injecter les secrets dans un pod
metadata:
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "my-app"
    vault.hashicorp.com/agent-inject-secret-db: "secret/data/myapp/db"
    vault.hashicorp.com/agent-inject-template-db: |
      {{- with secret "secret/data/myapp/db" -}}
      DB_HOST={{ .Data.data.host }}
      DB_PASSWORD={{ .Data.data.password }}
      {{- end }}
\`\`\`

> **Bonne pratique :** Utilisez les **secrets dynamiques** pour les bases de donnees. Vault genere des credentials uniques avec un TTL court (1h). A expiration, les credentials sont automatiquement revoques. Cela elimine le probleme des secrets statiques partages et jamais changes.`
      },
      {
        title: 'Gestion des secrets en CI/CD',
        content: `La gestion des secrets dans les pipelines CI/CD est un point critique de securite. Les secrets doivent etre injectes de maniere securisee sans jamais apparaitre dans les logs ou le code.

### Regles fondamentales

\`\`\`
1. JAMAIS de secrets dans le code source (Git)
2. JAMAIS de secrets dans les logs du pipeline
3. JAMAIS de secrets en clair dans les variables d'environnement visibles
4. Rotation reguliere des secrets
5. Principe du moindre privilege pour chaque secret
6. Audit trail de chaque acces
\`\`\`

### Detection de secrets dans le code

\`\`\`bash
# git-secrets (AWS)
git secrets --install
git secrets --register-aws
git secrets --scan

# gitleaks (pre-commit hook)
gitleaks detect --source=. --verbose

# trufflehog (historique Git complet)
trufflehog git file://. --since-commit HEAD~50
\`\`\`

\`\`\`yaml
# Pre-commit hook avec gitleaks
# .pre-commit-config.yaml
repos:
- repo: https://github.com/gitleaks/gitleaks
  rev: v8.18.0
  hooks:
  - id: gitleaks
\`\`\`

### Secrets dans GitHub Actions

\`\`\`yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy
      env:
        # Les secrets sont masques dans les logs
        DB_PASSWORD: \${{ secrets.DB_PASSWORD }}
        API_KEY: \${{ secrets.API_KEY }}
      run: |
        # ATTENTION : ne pas echo les secrets !
        # echo $DB_PASSWORD  ← INTERDIT (expose dans les logs)
        ./deploy.sh
\`\`\`

### Secrets dans GitLab CI

\`\`\`yaml
# Variables masquees et protegees
# Settings > CI/CD > Variables
# [x] Masked (masque dans les logs)
# [x] Protected (uniquement sur les branches protegees)

deploy:
  script:
    - echo "Deploying with token $DEPLOY_TOKEN"
  variables:
    DB_HOST: $DB_HOST
  only:
    - main     # Variable protegee = uniquement sur main
\`\`\`

### OIDC pour les cloud providers

La meilleure pratique est d'utiliser **OIDC** (OpenID Connect) pour eviter de stocker des credentials cloud :

\`\`\`yaml
# GitHub Actions avec OIDC pour AWS
permissions:
  id-token: write

steps:
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/github-actions
    aws-region: eu-west-1
    # Pas d'access key ! Le token OIDC est genere automatiquement
\`\`\`

### Sealed Secrets pour Kubernetes + GitOps

\`\`\`bash
# Chiffrer un secret pour le stocker dans Git
kubectl create secret generic db-creds \\
  --from-literal=password=secret123 \\
  --dry-run=client -o yaml | \\
  kubeseal --format yaml > sealed-secret.yaml

# Le fichier sealed-secret.yaml est securise pour Git
# Seul le controleur dans le cluster peut le dechiffrer
git add sealed-secret.yaml
git commit -m "Add encrypted database credentials"
\`\`\`

> **Hierarchie de securite des secrets en CI/CD :**
> 1. **Ideal** : OIDC (pas de secret stocke du tout)
> 2. **Bien** : Vault + injection dynamique
> 3. **Acceptable** : GitHub/GitLab Secrets (masques et proteges)
> 4. **Mauvais** : Variables d'environnement non masquees
> 5. **Interdit** : Secrets en dur dans le code ou les manifestes`
      },
      {
        title: 'Compliance as Code',
        content: `Le **Compliance as Code** consiste a exprimer les regles de conformite et les politiques de securite sous forme de code, pour les verifier automatiquement dans le pipeline CI/CD.

### Pourquoi automatiser la conformite ?

\`\`\`
Audit manuel                        Compliance as Code
────────────                        ──────────────────
1 fois par an                       A chaque commit
Resultat : rapport PDF              Resultat : pipeline vert/rouge
Verification humaine                Verification automatique
Reactive (apres le fait)            Preventive (avant le deploiement)
Couteuse en temps                   Rapide et reproductible
\`\`\`

### Open Policy Agent (OPA)

**OPA** est un moteur de politiques generaliste qui evalue des regles ecrites en **Rego** :

\`\`\`rego
# policy.rego — Interdire les conteneurs root
package kubernetes.admission

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.runAsUser == 0
  msg := sprintf("Container '%v' must not run as root", [container.name])
}

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.resources.limits.memory
  msg := sprintf("Container '%v' must have memory limits", [container.name])
}
\`\`\`

### Kyverno (policies Kubernetes natives)

**Kyverno** est un moteur de politiques specifique a Kubernetes, plus simple qu'OPA :

\`\`\`yaml
# Politique : tous les pods doivent avoir des labels
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: Enforce
  rules:
  - name: require-team-label
    match:
      resources:
        kinds: [Pod]
    validate:
      message: "Le label 'team' est obligatoire"
      pattern:
        metadata:
          labels:
            team: "?*"

---
# Politique : pas d'images latest
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-latest-tag
spec:
  validationFailureAction: Enforce
  rules:
  - name: validate-image-tag
    match:
      resources:
        kinds: [Pod]
    validate:
      message: "L'utilisation du tag 'latest' est interdite"
      pattern:
        spec:
          containers:
          - image: "!*:latest"
\`\`\`

### Terraform Sentinel (politiques IaC)

\`\`\`python
# Politique : toutes les instances EC2 doivent avoir des tags
import "tfplan/v2" as tfplan

mandatory_tags = ["Environment", "Team", "CostCenter"]

ec2_instances = filter tfplan.resource_changes as _, rc {
  rc.type is "aws_instance" and
  rc.change.actions contains "create"
}

all_tags_present = rule {
  all ec2_instances as _, instance {
    all mandatory_tags as tag {
      instance.change.after.tags contains tag
    }
  }
}

main = rule {
  all_tags_present
}
\`\`\`

### Checklist Compliance as Code

\`\`\`yaml
kubernetes:
  - Pas de conteneurs root
  - Limits CPU/memoire obligatoires
  - Pas d'images latest
  - Labels obligatoires (team, env, app)
  - Network Policies definies
  - Pod Security Standards enforces

infrastructure:
  - Tags obligatoires sur toutes les ressources
  - Chiffrement au repos active
  - Pas d'acces public aux BDD
  - Security Groups restrictifs
  - Logs actives

ci_cd:
  - Scans SAST/SCA dans chaque PR
  - Scan d'images Docker avant push
  - Pas de secrets dans le code
  - Approbation pour production
\`\`\`

> **Bonne pratique :** Commencez en mode **audit** (rapport sans bloquer) pour identifier les violations existantes. Une fois les violations corrigees, passez en mode **enforce** (bloque les deploiements non conformes). Traitez les politiques de securite comme du code : versionnez-les, testez-les, reviewez-les.`
      }
    ]
  },
  {
    id: 136,
    slug: 'securite-kubernetes-zerotrust',
    title: 'Securite Kubernetes & Zero Trust',
    subtitle: 'RBAC, Network Policies, Pod Security et architecture Zero Trust',
    icon: 'Lock',
    color: '#f59e0b',
    duration: '45 min',
    level: 'Expert',
    videoId: '',
    sections: [
      {
        title: 'RBAC Kubernetes',
        content: `Le **RBAC** (Role-Based Access Control) est le mecanisme d'autorisation de Kubernetes. Il controle qui peut faire quoi sur quelles ressources.

### Concepts RBAC

\`\`\`
RBAC
├── Role          → Permissions dans un namespace
├── ClusterRole   → Permissions dans tout le cluster
├── RoleBinding   → Associe un Role a un user/group/SA
└── ClusterRoleBinding → Associe un ClusterRole globalement
\`\`\`

### Creer un Role et un RoleBinding

\`\`\`yaml
# Role : permissions dans le namespace "production"
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list"]

---
# RoleBinding : associe le Role au ServiceAccount "app-sa"
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: production
subjects:
- kind: ServiceAccount
  name: app-sa
  namespace: production
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### ClusterRole pour les admins

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: namespace-admin
rules:
- apiGroups: ["", "apps", "networking.k8s.io"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["roles", "rolebindings"]
  verbs: ["get", "list"]   # Peut voir les roles mais pas les modifier

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-binding
subjects:
- kind: Group
  name: platform-team
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: namespace-admin
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### Verifier les permissions

\`\`\`bash
# Verifier vos propres permissions
kubectl auth can-i create deployments --namespace production
# yes

kubectl auth can-i delete nodes
# no

# Verifier les permissions d'un ServiceAccount
kubectl auth can-i get pods --as=system:serviceaccount:production:app-sa -n production
# yes

# Lister toutes les permissions d'un utilisateur
kubectl auth can-i --list --as=user@example.com
\`\`\`

### Bonnes pratiques RBAC

- **Principe du moindre privilege** : ne donner que les permissions strictement necessaires
- **Pas de cluster-admin** pour les utilisateurs reguliers
- **ServiceAccount dedie** par application (pas le default SA)
- **Namespaces** pour isoler les equipes et les environnements
- **Auditer** regulierement les RoleBindings

> **Regle d'or :** Chaque application doit avoir son propre ServiceAccount avec uniquement les permissions dont elle a besoin. Ne laissez jamais le ServiceAccount \`default\` avec des permissions elevees — c'est une faille de securite courante.`
      },
      {
        title: 'Network Policies',
        content: `Les **Network Policies** sont des firewalls au niveau du pod dans Kubernetes. Par defaut, tous les pods peuvent communiquer entre eux. Les Network Policies permettent de restreindre ce trafic.

### Principe : deny by default

\`\`\`yaml
# Bloquer tout le trafic entrant dans un namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: production
spec:
  podSelector: {}           # Tous les pods du namespace
  policyTypes:
  - Ingress                 # Bloque tout le trafic entrant
  # Pas de regles ingress = tout est bloque
\`\`\`

### Autoriser le trafic specifique

\`\`\`yaml
# Autoriser le frontend a communiquer avec l'API
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api                # S'applique aux pods "api"
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend       # Autorise uniquement depuis "frontend"
    ports:
    - protocol: TCP
      port: 8080

---
# Autoriser l'API a communiquer avec la BDD
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: database
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api
    ports:
    - protocol: TCP
      port: 5432
\`\`\`

### Isolation entre namespaces

\`\`\`yaml
# Autoriser uniquement le trafic depuis le namespace "monitoring"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-monitoring
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          purpose: monitoring
    ports:
    - protocol: TCP
      port: 9090          # Prometheus scraping
\`\`\`

### Visualisation du trafic autorise

\`\`\`
Sans Network Policies :         Avec Network Policies :
Tous ←→ Tous                    Frontend → API → Database
                                Monitoring → Tous (:9090)
                                Ingress → Frontend (:80)
\`\`\`

### Prerequisites

Les Network Policies necessitent un **CNI** (Container Network Interface) compatible :
- **Calico** : le plus populaire, supporte les Network Policies
- **Cilium** : base sur eBPF, performant, supporte les L7 policies
- **Weave Net** : supporte les Network Policies
- **Flannel** : ne supporte **PAS** les Network Policies (a eviter si vous en avez besoin)

> **Important :** Les Network Policies sont **additives** — elles autorisent du trafic, elles ne le bloquent pas explicitement. Le blocage vient de l'absence de regle correspondante. Commencez toujours par une politique \`deny-all\` puis ajoutez les autorisations necessaires.`
      },
      {
        title: 'Pod Security Standards',
        content: `Les **Pod Security Standards** (PSS) definissent trois niveaux de securite pour les pods Kubernetes. Ils remplacent les anciennes PodSecurityPolicies (PSP) depreciees depuis K8s 1.25.

### Les trois niveaux

| Niveau | Description | Usage |
|--------|-------------|-------|
| **Privileged** | Aucune restriction | Composants systeme (kube-system) |
| **Baseline** | Restrictions minimales, previent les escalades connues | Applications standard |
| **Restricted** | Restrictions strictes, bonnes pratiques de securite | Applications sensibles |

### Appliquer les PSS avec Pod Security Admission

\`\`\`yaml
# Appliquer le niveau "restricted" sur un namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
\`\`\`

### Pod conforme au niveau "restricted"

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: myapp:v1
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsUser: 1000
      runAsGroup: 1000
      capabilities:
        drop: ["ALL"]
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "256Mi"
    volumeMounts:
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}
\`\`\`

### Restrictions par niveau

\`\`\`yaml
baseline_interdit:
  - hostNetwork: true
  - hostPID: true
  - hostIPC: true
  - privileged: true
  - capabilities ajoutees (sauf NET_BIND_SERVICE)
  - hostPath volumes

restricted_ajoute:
  - runAsNonRoot obligatoire
  - Seccomp profile obligatoire
  - Drop ALL capabilities
  - allowPrivilegeEscalation: false
  - Pas de runAsUser: 0
\`\`\`

### Audit des violations

\`\`\`bash
# Voir les warnings dans les logs de l'API Server
kubectl get events --field-selector reason=FailedCreate

# Tester un pod avant de le deployer
kubectl label namespace test-ns pod-security.kubernetes.io/warn=restricted
kubectl apply -f pod.yaml -n test-ns
# Warning: would violate PodSecurity "restricted:latest"
\`\`\`

> **Migration :** Commencez par appliquer les PSS en mode \`warn\` (avertissement) pour identifier les pods non conformes sans les bloquer. Corrigez-les progressivement, puis passez en mode \`enforce\`. Appliquez \`baseline\` minimum sur tous les namespaces applicatifs et \`restricted\` sur les namespaces sensibles.`
      },
      {
        title: 'Service Mesh (Istio/Linkerd)',
        content: `Un **Service Mesh** est une couche d'infrastructure qui gere la communication entre microservices. Il ajoute des fonctionnalites de securite, d'observabilite et de controle du trafic sans modifier le code applicatif.

### Pourquoi un Service Mesh ?

\`\`\`
Sans Service Mesh                 Avec Service Mesh
──────────────────                ─────────────────
mTLS a implementer par service    mTLS automatique entre tous les pods
Retry/timeout dans le code        Retry/timeout configures par mesh
Pas de traffic splitting          Canary deployments, A/B testing
Observabilite a instrumenter      Traces et metriques automatiques
\`\`\`

### Architecture sidecar

\`\`\`
┌─────────────── Pod ──────────────────┐
│                                       │
│  ┌───────────┐    ┌───────────────┐  │
│  │ App       │◄──►│ Sidecar Proxy │  │
│  │ Container │    │ (Envoy)       │  │
│  └───────────┘    └───────┬───────┘  │
│                           │          │
└───────────────────────────┼──────────┘
                            │ mTLS
┌───────────────────────────┼──────────┐
│                           │          │
│  ┌───────────┐    ┌───────┴───────┐  │
│  │ App       │◄──►│ Sidecar Proxy │  │
│  │ Container │    │ (Envoy)       │  │
│  └───────────┘    └───────────────┘  │
│                                       │
└─────────────── Pod ──────────────────┘
\`\`\`

### Istio

\`\`\`bash
# Installation Istio
istioctl install --set profile=demo
kubectl label namespace production istio-injection=enabled
\`\`\`

\`\`\`yaml
# mTLS strict entre tous les services
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT

---
# Traffic splitting (canary deployment)
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: api
spec:
  hosts: [api]
  http:
  - route:
    - destination:
        host: api
        subset: v1
      weight: 90        # 90% du trafic vers v1
    - destination:
        host: api
        subset: v2
      weight: 10        # 10% vers v2 (canary)
\`\`\`

### Linkerd (alternative legere)

\`\`\`bash
# Installation Linkerd
linkerd install | kubectl apply -f -
linkerd inject deployment.yaml | kubectl apply -f -

# Verifier le mTLS
linkerd viz stat deployments -n production
\`\`\`

### Istio vs Linkerd

| Critere | Istio | Linkerd |
|---------|-------|---------|
| Complexite | Elevee | Faible |
| Ressources | ~100 Mo/sidecar | ~20 Mo/sidecar |
| Fonctionnalites | Tres riche | Essentiel |
| Proxy | Envoy (C++) | linkerd2-proxy (Rust) |
| Courbe d'apprentissage | Longue | Courte |

> **Conseil :** Si vous avez besoin uniquement de mTLS et d'observabilite basique, **Linkerd** est suffisant et beaucoup plus simple. Choisissez **Istio** si vous avez besoin de fonctionnalites avancees (traffic management complexe, policies d'autorisation granulaires, integration avec des systemes externes).`
      },
      {
        title: 'Zero Trust architecture',
        content: `L'architecture **Zero Trust** repose sur le principe "ne jamais faire confiance, toujours verifier". Contrairement au modele perimetrique traditionnel (chateau fort), Zero Trust considere que le reseau interne est aussi peu fiable que l'externe.

### Perimetre vs Zero Trust

\`\`\`
Modele perimetrique (traditionnel) :
──────────────────────────────────
┌─── Firewall ────────────────────┐
│  Reseau interne = zone de       │
│  confiance. Une fois dedans,    │
│  acces libre a tout.            │
│                                  │
│  ← VPN pour l'acces distant     │
└──────────────────────────────────┘
Probleme : un attaquant qui passe le firewall a acces a tout.

Zero Trust :
────────────
Chaque requete est authentifiee et autorisee,
que la source soit interne ou externe.
Pas de zone de confiance implicite.
\`\`\`

### Les 5 piliers du Zero Trust

| Pilier | Description | Implementation |
|--------|-------------|----------------|
| **Identite** | Verifier l'identite de chaque acteur | MFA, SSO, certificats mTLS |
| **Appareils** | Verifier la conformite de l'appareil | MDM, attestation, device trust |
| **Reseau** | Micro-segmentation, pas de reseau plat | Network Policies, service mesh |
| **Applications** | Autorisation par application/API | RBAC, OPA, API Gateway |
| **Donnees** | Chiffrement et classification | Encryption, DLP, etiquetage |

### Zero Trust dans Kubernetes

\`\`\`yaml
# 1. Identite : ServiceAccount + RBAC par application
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-sa
  namespace: production

# 2. Reseau : Network Policies (deny by default)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]

# 3. mTLS : Service Mesh (chiffrement pod-to-pod)
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT

# 4. Autorisation : AuthorizationPolicy (Istio)
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: api-authz
  namespace: production
spec:
  selector:
    matchLabels:
      app: api
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/production/sa/frontend-sa"]
    to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/*"]
\`\`\`

### Implementation progressive

\`\`\`
Phase 1 : Visibilite
  - Inventaire des flux reseau
  - Mapping des communications inter-services
  - Activation des logs et metriques

Phase 2 : Identite
  - ServiceAccount dedie par application
  - RBAC granulaire
  - mTLS avec service mesh

Phase 3 : Micro-segmentation
  - Network Policies deny-by-default
  - Autorisation des flux legitimes uniquement
  - Isolation entre namespaces

Phase 4 : Autorisation continue
  - Politiques d'autorisation L7 (Istio, OPA)
  - Verification de l'identite a chaque requete
  - Anomaly detection
\`\`\`

> **Realite :** Le Zero Trust n'est pas un produit a acheter, c'est une approche a implementer progressivement. Commencez par la visibilite (savoir qui communique avec qui), puis ajoutez l'authentification mutuelle (mTLS), puis la micro-segmentation (Network Policies), et enfin l'autorisation granulaire (AuthorizationPolicy). Chaque etape ameliore votre posture de securite.`
      }
    ]
  },
  {
    id: 137,
    slug: 'sre-sla-incidents',
    title: 'SRE, SLA/SLO & Gestion d\'Incidents',
    subtitle: 'Site Reliability Engineering, objectifs de fiabilite et gestion des incidents',
    icon: 'Activity',
    color: '#f59e0b',
    duration: '45 min',
    level: 'Expert',
    videoId: '',
    sections: [
      {
        title: 'Site Reliability Engineering',
        content: `Le **SRE** (Site Reliability Engineering) est une discipline creee par Google qui applique les principes du genie logiciel aux operations d'infrastructure. L'objectif est de creer des systemes a grande echelle, fiables et efficaces.

### SRE vs DevOps

\`\`\`
DevOps                              SRE
──────                              ───
Philosophie / culture               Implementation concrete
"Automatiser tout"                  "Automatiser via le code"
Pas de role specifique              Role dedie : SRE Engineer
Collaboration Dev ↔ Ops             SRE = Dev qui fait des Ops
Pas de metriques standard           SLA, SLO, SLI, Error Budgets
\`\`\`

> Google decrit la relation ainsi : **"SRE implements DevOps"**. DevOps est la philosophie, SRE est une implementation concrete de cette philosophie.

### Principes fondamentaux du SRE

| Principe | Description |
|----------|-------------|
| **Embracing risk** | Accepter un niveau de risque calcule (pas de 100% de fiabilite) |
| **SLO & Error Budgets** | Definir des objectifs de fiabilite mesurables |
| **Toil reduction** | Eliminer le travail manuel et repetitif |
| **Monitoring** | Observer les systemes avec les 4 Golden Signals |
| **Automation** | Automatiser tout ce qui est repetitif |
| **Release engineering** | Deploiements frequents, petits et securises |
| **Simplicity** | Un systeme simple est plus fiable qu'un systeme complexe |

### Le budget d'erreur (Error Budget)

Le concept le plus important du SRE est l'**error budget**. Il definit combien d'indisponibilite est acceptable.

\`\`\`
SLO de disponibilite : 99.9%
────────────────────────────
Temps total dans un mois    : 43,200 minutes (30 jours)
Budget d'erreur (0.1%)      : 43.2 minutes

Utilisation du budget :
┌──────────────────────────────────────────┐
│████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 30% utilise
└──────────────────────────────────────────┘
  13 min de downtime sur 43.2 min autorisees

Si budget > 100% : STOP les deploiements, focus sur la fiabilite
Si budget < 50%  : GO pour les deploiements et les experimentations
\`\`\`

### Le role de l'ingenieur SRE

\`\`\`yaml
responsabilites:
  - Definir et maintenir les SLO
  - Monitorer les SLI et l'error budget
  - Gerer les incidents et les astreintes (on-call)
  - Automatiser les taches repetitives (toil)
  - Conduire les post-mortems
  - Planifier la capacite
  - Participer aux code reviews pour la fiabilite

repartition_temps:
  ops_reactif: 50% maximum    # Incidents, on-call, tickets
  engineering: 50% minimum    # Automatisation, tooling, amelioration
  # Si ops > 50%, l'equipe SRE rend des services a l'equipe Dev
\`\`\`

### Toil (travail repetitif)

Le **toil** est tout travail manuel, repetitif, automatisable et qui n'apporte pas de valeur durable. L'objectif du SRE est de le reduire en permanence.

\`\`\`
Exemples de toil :
- Redemarrer manuellement un service plante
- Scaler manuellement les instances
- Repondre aux tickets de routine
- Verifier manuellement les backups

Solutions :
- Self-healing (Kubernetes liveness probes)
- Autoscaling (HPA, Cluster Autoscaler)
- Runbooks automatises (scripts, bots)
- Backup et verification automatiques
\`\`\`

> **Regle des 50% :** Un ingenieur SRE ne doit pas passer plus de 50% de son temps sur le travail operationnel (toil). Les 50% restants doivent etre consacres a l'automatisation et l'amelioration des systemes. Si cette repartition n'est pas respectee, l'equipe SRE doit alerter le management.`
      },
      {
        title: 'SLA vs SLO vs SLI',
        content: `Les **SLA**, **SLO** et **SLI** forment une hierarchie de metriques de fiabilite qui permet de definir, mesurer et communiquer les objectifs de performance d'un service.

### Definitions

\`\`\`
SLI (Service Level Indicator)
─────────────────────────────
Mesure concrete d'une metrique de performance
Exemple : "99.95% des requetes repondent en < 200ms"

        ↓ definit l'objectif

SLO (Service Level Objective)
─────────────────────────────
Objectif interne de performance base sur les SLI
Exemple : "Disponibilite >= 99.9% sur 30 jours glissants"

        ↓ engagement contractuel

SLA (Service Level Agreement)
─────────────────────────────
Contrat avec les clients, avec consequences financieres
Exemple : "Disponibilite >= 99.5%, sinon credit de 10%"
\`\`\`

### Relation entre SLI, SLO et SLA

\`\`\`
SLI : Latence p99 = 180ms   ← Ce qu'on mesure
SLO : Latence p99 < 200ms   ← Ce qu'on vise (interne)
SLA : Latence p99 < 500ms   ← Ce qu'on promet (contractuel)

         SLA < SLO < SLI ideal
  (plus permissif)     (plus exigeant)
\`\`\`

### SLI courants

| SLI | Formule | Bon/Mauvais evenement |
|-----|---------|----------------------|
| **Disponibilite** | requetes reussies / total requetes | 2xx-3xx = bon, 5xx = mauvais |
| **Latence** | requetes < seuil / total requetes | < 200ms = bon, >= 200ms = mauvais |
| **Throughput** | requetes traitees par seconde | > seuil = bon |
| **Error rate** | requetes en erreur / total | < seuil = bon |
| **Freshness** | age des donnees | < seuil = bon |

### SLO : choisir le bon objectif

\`\`\`
Disponibilite    Downtime/mois    Downtime/an     Usage typique
─────────────    ─────────────    ────────────    ─────────────
99%              7h 18min         3.65 jours      Outils internes
99.5%            3h 39min         1.83 jours      Services non-critiques
99.9%            43.8 min         8.77 heures     Services web standard
99.95%           21.9 min         4.38 heures     E-commerce, SaaS
99.99%           4.38 min         52.6 minutes    Services financiers
99.999%          26.3 sec         5.26 minutes    Telecom, sante
\`\`\`

### Definir de bons SLO

\`\`\`yaml
# Service API
api_slos:
  availability:
    sli: "Pourcentage de requetes HTTP avec status != 5xx"
    target: 99.9%
    window: 30 jours glissants
  latency:
    sli: "Pourcentage de requetes avec latence < 200ms"
    target: 99%
    window: 30 jours glissants
  error_budget:
    monthly: 43.2 minutes   # (100% - 99.9%) * 43200 min
    current_usage: 12 min    # 28% utilise

# Service de paiement (plus strict)
payment_slos:
  availability:
    target: 99.99%
    window: 30 jours
  latency_p99:
    target: "< 500ms"
  correctness:
    sli: "Transactions traitees correctement"
    target: 99.999%
\`\`\`

### SLA et consequences

\`\`\`yaml
sla_example:
  service: "API Platform"
  availability: 99.5%
  measurement: "Monthly uptime percentage"
  exclusions:
    - Maintenance planifiee (notifiee 48h a l'avance)
    - Force majeure
    - Problemes cote client
  penalties:
    99.0% - 99.5%: "Credit de 10% sur la facture mensuelle"
    95.0% - 99.0%: "Credit de 25%"
    below_95%: "Credit de 50%"
\`\`\`

> **Conseil critique :** Votre SLO doit toujours etre plus strict que votre SLA. Si votre SLA promet 99.5%, visez un SLO de 99.9%. Cela vous donne une marge pour detecter les degradations avant qu'elles ne violent le SLA. Ne visez JAMAIS 100% — c'est techniquement impossible et economiquement irrationnel.`
      },
      {
        title: 'Error budgets',
        content: `L'**error budget** (budget d'erreur) est la quantite d'indisponibilite ou de degradation acceptable pour un service sur une periode donnee. C'est l'outil qui reconcilie la vitesse d'innovation avec la fiabilite.

### Calcul de l'error budget

\`\`\`
Error Budget = 100% - SLO

SLO = 99.9% → Error Budget = 0.1%
Sur 30 jours (43,200 minutes) :
  Budget = 43,200 * 0.001 = 43.2 minutes de downtime autorise

SLO = 99.95% → Error Budget = 0.05%
  Budget = 43,200 * 0.0005 = 21.6 minutes

SLO = 99.99% → Error Budget = 0.01%
  Budget = 43,200 * 0.0001 = 4.32 minutes
\`\`\`

### Politique d'error budget

\`\`\`yaml
error_budget_policy:
  budget_remaining:
    above_50%:
      action: "Deploiements normaux, experimentations autorisees"
      velocity: "Haute"
    25%_to_50%:
      action: "Deploiements normaux, prudence sur les experimentations"
      velocity: "Normale"
    10%_to_25%:
      action: "Seuls les deploiements critiques, pas de feature flags"
      velocity: "Reduite"
    below_10%:
      action: "Gel des deploiements, focus fiabilite uniquement"
      velocity: "Minimale"
    exhausted:
      action: "STOP deploiements, toute l'equipe sur la fiabilite"
      velocity: "Zero"
      escalation: "Comite de direction informe"
\`\`\`

### Dashboard error budget

\`\`\`
Error Budget - API Service (SLO: 99.9%)
Periode : Mars 2024 (30 jours)
Budget total : 43.2 minutes

Utilisation :
┌──────────────────────────────────────────┐
│████████████████████░░░░░░░░░░░░░░░░░░░░│ 48% (20.7 min)
└──────────────────────────────────────────┘

Incidents ce mois :
- 3 mars : deploiement v2.1 (8 min downtime)
- 12 mars : pic de charge (5 min degradation)
- 22 mars : rollback v2.3 (7.7 min downtime)

Budget restant : 22.5 minutes (52%)
Statut : NORMAL - deploiements autorises
\`\`\`

### Burn rate

Le **burn rate** mesure la vitesse a laquelle le budget est consomme :

\`\`\`
Burn rate = Taux de consommation reel / Taux de consommation ideal

Burn rate = 1  → Consommation normale (budget epuise en fin de fenetre)
Burn rate = 2  → Budget epuise en 15 jours au lieu de 30
Burn rate = 10 → Budget epuise en 3 jours - ALERTE !
Burn rate = 0  → Aucune erreur (peut-etre sur-provisionne)
\`\`\`

\`\`\`yaml
# Alertes basees sur le burn rate
alerts:
  - name: "High error rate - 1h window"
    burn_rate: 14.4    # Budget epuise en ~2h
    window: 1h
    severity: critical
    action: "Page l'equipe on-call immediatement"

  - name: "Elevated error rate - 6h window"
    burn_rate: 6
    window: 6h
    severity: warning
    action: "Ticket dans le backlog, investigation sous 24h"

  - name: "Slow burn - 3d window"
    burn_rate: 1.5
    window: 3d
    severity: info
    action: "Revue en reunion hebdo SRE"
\`\`\`

> **Philosophie :** L'error budget n'est pas une punition, c'est un outil de decision. Il donne a l'equipe de developpement la liberte d'innover tant que la fiabilite est maintenue. Quand le budget s'epuise, c'est un signal clair que la priorite doit passer de la vitesse a la fiabilite.`
      },
      {
        title: 'Incident management',
        content: `La **gestion des incidents** est le processus structure pour detecter, repondre et resoudre les interruptions de service. Un bon processus d'incident management reduit le temps de resolution et l'impact sur les utilisateurs.

### Severites des incidents

| Severite | Impact | Exemples | Reponse |
|----------|--------|----------|---------|
| **SEV1 / P1** | Service completement indisponible | Site down, perte de donnees | Mobilisation immediate, comms C-level |
| **SEV2 / P2** | Degradation majeure | Fonctionnalite cle cassee, latence x10 | Equipe on-call + escalade |
| **SEV3 / P3** | Impact limite | Bug visible mais contournable | Investigation sous 24h |
| **SEV4 / P4** | Impact mineur | Bug cosmetique, warning | Backlog |

### Processus d'incident

\`\`\`
Detection → Triage → Mobilisation → Investigation → Remediation → Post-mortem

 1. Alerte         2. Qualifier      3. Assembler     4. Identifier    5. Corriger
    Monitoring        la severite       l'equipe          la cause        et verifier
    detecte le        (P1-P4)           (on-call,         racine          que le service
    probleme                            experts)                          est restaure
\`\`\`

### Roles pendant un incident

| Role | Responsabilite |
|------|----------------|
| **Incident Commander (IC)** | Coordonne la reponse, prend les decisions |
| **Communication Lead** | Communique avec les stakeholders et les clients |
| **Operations Lead** | Execute les actions techniques de remediation |
| **Subject Matter Expert** | Apporte l'expertise technique specifique |
| **Scribe** | Documente les actions et la timeline |

### Communication pendant un incident

\`\`\`yaml
# Template de communication
channels:
  interne: "#incident-xyz"        # Channel Slack dedie
  status_page: "status.example.com"
  email: "support@example.com"

updates:
  - time: "14:00"
    message: |
      [INVESTIGATING] Nous avons detecte une augmentation des erreurs 500
      sur l'API. L'equipe SRE investigue. Impact : certains utilisateurs
      ne peuvent pas se connecter.

  - time: "14:15"
    message: |
      [IDENTIFIED] La cause est identifiee : migration DB echouee
      causant des timeouts. Un rollback est en cours.

  - time: "14:30"
    message: |
      [RESOLVED] Le rollback est termine. Le service est restaure.
      Temps de resolution : 30 minutes.
\`\`\`

### On-call

\`\`\`yaml
on_call_rotation:
  schedule: "1 semaine par ingenieur"
  equipe: 6 ingenieurs
  frequence: "on-call toutes les 6 semaines"

  regles:
    - Reponse sous 5 minutes pour P1
    - Reponse sous 30 minutes pour P2
    - Laptop et connexion Internet obligatoires
    - Pas plus de 2 incidents par nuit (sinon escalade)
    - Jour de repos compensatoire apres on-call charge

  outils:
    - PagerDuty / OpsGenie (alerting)
    - Slack #incidents (coordination)
    - Runbooks (procedures documentees)
    - Grafana / Kibana (investigation)
\`\`\`

### Runbooks

\`\`\`yaml
# Runbook : API latence elevee
name: "High API Latency"
trigger: "Alerte latence p99 > 500ms pendant 5 min"

steps:
  1: "Verifier le dashboard API dans Grafana"
  2: "Identifier le endpoint concerne (par path label)"
  3: "Verifier les logs dans Kibana pour des erreurs DB"
  4: "Verifier la charge CPU/memoire des pods API"
  5: "Si saturation CPU : kubectl scale deployment/api --replicas=+2"
  6: "Si probleme DB : verifier les connexions actives et les slow queries"
  7: "Si deploiement recent : kubectl rollout undo deployment/api"

escalation: "Si non resolu en 30 min, escalader au lead SRE"
\`\`\`

> **Bonne pratique :** Documentez vos runbooks AVANT les incidents, pas pendant. Chaque alerte doit avoir un runbook associe avec les etapes de diagnostic et de remediation. Automatisez les runbooks les plus frequents pour reduire le MTTR (Mean Time To Resolve).`
      },
      {
        title: 'Post-mortems et blameless culture',
        content: `Le **post-mortem** est un document redige apres un incident significatif. Son objectif est de comprendre ce qui s'est passe, pourquoi, et comment eviter que cela se reproduise. La culture **blameless** est essentielle pour que les post-mortems soient utiles.

### La culture blameless

\`\`\`
Culture de blame                    Culture blameless
────────────────                    ─────────────────
"Qui a cause le probleme ?"         "Quel systeme a permis cette erreur ?"
Les gens cachent leurs erreurs      Les gens partagent ouvertement
Blame → peur → moins de reporting   Blameless → confiance → plus d'apprentissage
Focus sur la personne               Focus sur le systeme
Punition                            Amelioration
\`\`\`

### Pourquoi blameless ?

Les erreurs humaines ne sont **jamais** la cause racine. Elles sont le **symptome** d'un systeme qui n'a pas assez de garde-fous. Si un ingenieur peut casser la production en une commande, le probleme est le systeme, pas l'ingenieur.

### Template de post-mortem

\`\`\`yaml
title: "Incident du 15 mars - API indisponible pendant 45 min"
date: "2024-03-15"
severity: P1
duration: 45 minutes
authors: ["Alice", "Bob"]
status: "Completed"

summary: |
  Le 15 mars a 14h00 UTC, une migration de base de donnees a cause
  une indisponibilite totale de l'API pendant 45 minutes. 100% des
  utilisateurs ont ete impactes. Le service a ete restaure par un
  rollback de la migration a 14h45.

impact:
  users_affected: "100% (estimé 5,000 utilisateurs actifs)"
  revenue_impact: "~$2,500 (transactions echouees)"
  error_budget_consumed: "45 min sur 43.2 min budget (104%)"
  slo_violated: true

timeline:
  - time: "14:00"
    event: "Deploiement v2.3.0 avec migration schema DB"
  - time: "14:02"
    event: "Alertes Prometheus : latence API > 5s"
  - time: "14:05"
    event: "Incident Commander assigne (Alice)"
  - time: "14:10"
    event: "Cause identifiee : migration ajoute colonne NOT NULL sans defaut"
  - time: "14:15"
    event: "Decision de rollback"
  - time: "14:30"
    event: "Rollback migration termine"
  - time: "14:45"
    event: "Service restaure, monitoring confirme"

root_causes:
  - "La migration ALTER TABLE a verrouille la table users (5M lignes)"
  - "Pas de valeur par defaut sur la colonne NOT NULL"
  - "La migration n'a pas ete testee sur un volume de donnees realiste"

contributing_factors:
  - "Pas de review de migration par un DBA"
  - "Pas de dry-run sur une copie de prod"
  - "Alertes trop lentes (seuil a 5s, aurait du etre 500ms)"

action_items:
  - id: AI-001
    action: "Ajouter un step de review DBA pour les migrations"
    owner: "Alice"
    priority: P1
    due_date: "2024-03-22"
    status: "In Progress"

  - id: AI-002
    action: "Creer un environnement de pre-prod avec donnees realistes"
    owner: "Bob"
    priority: P1
    due_date: "2024-04-01"
    status: "TODO"

  - id: AI-003
    action: "Reduire le seuil d'alerte latence de 5s a 500ms"
    owner: "Charlie"
    priority: P2
    due_date: "2024-03-25"
    status: "Done"

  - id: AI-004
    action: "Implementer un canary deployment pour les migrations"
    owner: "Alice"
    priority: P2
    due_date: "2024-04-15"
    status: "TODO"

lessons_learned:
  - "Les migrations de schema doivent etre non-bloquantes (online DDL)"
  - "Tester les migrations sur un volume de donnees representatif"
  - "Les alertes doivent detecter les problemes en secondes, pas en minutes"
\`\`\`

### Les 5 Pourquoi (5 Whys)

\`\`\`
Probleme : L'API est tombee pendant 45 minutes
1. Pourquoi ? → La migration DB a verrouille la table users
2. Pourquoi ? → ALTER TABLE NOT NULL sans valeur par defaut
3. Pourquoi ? → La migration n'a pas ete testee sur un grand volume
4. Pourquoi ? → Pas d'environnement de pre-prod avec donnees realistes
5. Pourquoi ? → Le provisionnement d'un tel environnement est manuel et long
→ Action : automatiser la creation d'un env de pre-prod avec donnees anonymisees
\`\`\`

### Metriques de maturite incident management

| Metrique | Description | Objectif |
|----------|-------------|----------|
| **MTTD** | Mean Time To Detect | < 5 min |
| **MTTA** | Mean Time To Acknowledge | < 15 min |
| **MTTR** | Mean Time To Resolve | < 1h (P1) |
| **MTBF** | Mean Time Between Failures | > 30 jours |
| **Post-mortem completion** | % d'incidents avec post-mortem | 100% (P1/P2) |
| **Action items completion** | % d'actions terminees a temps | > 80% |

> **Philosophie :** Le but d'un post-mortem n'est pas de trouver un coupable, mais d'ameliorer le systeme. Chaque incident est une opportunite d'apprentissage. Les meilleures equipes SRE celebrent les post-mortems de qualite et suivent rigoureusement les action items. Un post-mortem sans action items est inutile.`
      }
    ]
  }
]
