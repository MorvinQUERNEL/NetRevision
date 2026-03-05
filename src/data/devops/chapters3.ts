import type { Chapter } from '../chapters'

export const chapters: Chapter[] = [
  {
    id: 113,
    slug: 'conteneurs-introduction',
    title: 'Introduction aux Conteneurs',
    subtitle: 'Comprendre les conteneurs, leur difference avec les VMs et les bases de Docker',
    icon: 'Box',
    color: '#10b981',
    duration: '30 min',
    level: 'Intermediaire',
    videoId: 'XgKOC6X8W28',
    sections: [
      {
        title: 'VMs vs Conteneurs',
        content: `Les conteneurs sont la revolution DevOps majeure de la derniere decennie. Pour comprendre leur interet, comparons-les aux machines virtuelles traditionnelles.

### Machine Virtuelle (VM)

\`\`\`
┌─────────────────────────────────────────┐
│              Hyperviseur                 │
│  ┌───────────┐  ┌───────────┐          │
│  │    VM 1    │  │    VM 2    │          │
│  │ ┌────────┐│  │ ┌────────┐│          │
│  │ │  App   ││  │ │  App   ││          │
│  │ │  Libs  ││  │ │  Libs  ││          │
│  │ │   OS   ││  │ │   OS   ││          │
│  │ └────────┘│  │ └────────┘│          │
│  └───────────┘  └───────────┘          │
│           Systeme Hote (OS)             │
│              Hardware                    │
└─────────────────────────────────────────┘
\`\`\`

### Conteneur

\`\`\`
┌─────────────────────────────────────────┐
│          Container Runtime               │
│  ┌──────────┐  ┌──────────┐            │
│  │Container1│  │Container2│            │
│  │ ┌──────┐ │  │ ┌──────┐ │            │
│  │ │ App  │ │  │ │ App  │ │            │
│  │ │ Libs │ │  │ │ Libs │ │            │
│  │ └──────┘ │  │ └──────┘ │            │
│  └──────────┘  └──────────┘            │
│        Noyau Linux partage              │
│           Systeme Hote (OS)             │
│              Hardware                    │
└─────────────────────────────────────────┘
\`\`\`

### Comparaison detaillee

| Critere | Machine Virtuelle | Conteneur |
|---------|-------------------|-----------|
| **Isolation** | Complete (hyperviseur) | Processus (noyau partage) |
| **Taille** | Go (OS complet) | Mo (seulement l'app + libs) |
| **Demarrage** | Minutes | Secondes |
| **Performance** | Overhead hyperviseur | Quasi-native |
| **Densite** | ~10 VMs par serveur | ~100+ conteneurs par serveur |
| **Portabilite** | Image VM (lourde) | Image Docker (legere) |
| **OS** | N'importe quel OS | Meme noyau que l'hote |
| **Securite** | Forte (isolation materielle) | Bonne (mais noyau partage) |

### Quand utiliser quoi ?

- **VMs** : isolation forte requise, OS different de l'hote, legacy apps
- **Conteneurs** : microservices, CI/CD, deploiement rapide, scaling horizontal
- **Les deux** : conteneurs dans des VMs (cloud : EC2 + Docker, GKE)

> **Point cle DevOps :** Les conteneurs ne remplacent pas les VMs, ils les complementent. En production cloud, on execute generalement des conteneurs dans des VMs pour combiner les avantages des deux technologies.`
      },
      {
        title: 'Namespaces et cgroups',
        content: `Les conteneurs Linux reposent sur deux mecanismes fondamentaux du noyau : les **namespaces** (isolation) et les **cgroups** (limitation de ressources).

### Namespaces — Isolation des processus

Les namespaces creent des environnements isoles ou chaque conteneur a sa propre vue du systeme.

| Namespace | Isole | Description |
|-----------|-------|-------------|
| **PID** | Processus | Chaque conteneur a son propre arbre de PID (PID 1 = entrypoint) |
| **NET** | Reseau | Interface reseau, IP, ports, table de routage propres |
| **MNT** | Systeme de fichiers | Points de montage independants |
| **UTS** | Hostname | Nom d'hote propre au conteneur |
| **IPC** | Communication inter-processus | Files de messages, memoire partagee isolees |
| **USER** | Utilisateurs | Mapping UID/GID (root dans le conteneur != root sur l'hote) |
| **CGROUP** | Cgroups | Vue isolee de la hierarchie cgroup |

\`\`\`bash
# Voir les namespaces d'un processus
ls -la /proc/1/ns/

# Voir les namespaces d'un conteneur Docker
CONTAINER_PID=$(docker inspect --format '{{.State.Pid}}' mon-conteneur)
ls -la /proc/$CONTAINER_PID/ns/

# Entrer dans le namespace d'un conteneur (debug)
sudo nsenter --target $CONTAINER_PID --mount --uts --ipc --net --pid
\`\`\`

### Cgroups — Limitation des ressources

Les **cgroups** (Control Groups) limitent et comptabilisent les ressources utilisees par les processus.

| Ressource | Cgroup | Description |
|-----------|--------|-------------|
| **CPU** | cpu, cpuset | Limiter le temps CPU, epingler sur des coeurs |
| **Memoire** | memory | Limiter la RAM, swap |
| **I/O disque** | blkio | Limiter les operations disque |
| **Reseau** | net_cls | Classifier le trafic reseau |
| **PIDs** | pids | Limiter le nombre de processus |

\`\`\`bash
# Voir les cgroups d'un conteneur
cat /sys/fs/cgroup/memory/docker/<container_id>/memory.limit_in_bytes

# Docker utilise les cgroups pour --memory et --cpus
docker run --memory=512m --cpus=1.5 nginx
# memory : limite a 512 Mo de RAM
# cpus : limite a 1.5 coeurs CPU
\`\`\`

### Comment Docker utilise namespaces + cgroups

\`\`\`
docker run nginx
    │
    ├── Noyau Linux cree :
    │   ├── PID namespace (processus isoles)
    │   ├── NET namespace (interface veth, IP propre)
    │   ├── MNT namespace (filesystem de l'image)
    │   ├── UTS namespace (hostname du conteneur)
    │   └── USER namespace (mapping UID optionnel)
    │
    └── Cgroups appliques :
        ├── Limite memoire (--memory)
        ├── Limite CPU (--cpus)
        └── Limite PIDs (--pids-limit)
\`\`\`

> **A retenir :** Un conteneur n'est pas une VM legere. C'est un **processus Linux isole** grace aux namespaces et limite en ressources grace aux cgroups. Le noyau est partage avec l'hote.`
      },
      {
        title: 'Architecture Docker',
        content: `**Docker** est la plateforme de conteneurisation la plus populaire. Son architecture client-serveur facilite la creation, le deploiement et l'execution de conteneurs.

### Composants Docker

\`\`\`
┌──────────────────────────────────────────────────┐
│                  Docker Client                    │
│            (docker CLI / Docker Desktop)           │
│                      │                            │
│              API REST (socket Unix)               │
│                      │                            │
│              Docker Daemon (dockerd)              │
│                      │                            │
│   ┌─────────────────┼─────────────────┐          │
│   │                 │                 │          │
│   │  containerd     │  Images         │          │
│   │  (runtime)      │  (Registry)     │          │
│   │      │          │                 │          │
│   │   runc          │  Docker Hub     │          │
│   │  (OCI runtime)  │  / Registry     │          │
│   └─────────────────┘─────────────────┘          │
└──────────────────────────────────────────────────┘
\`\`\`

| Composant | Role |
|-----------|------|
| **Docker CLI** | Interface en ligne de commande (\`docker\` commands) |
| **Docker Daemon** (dockerd) | Gere les conteneurs, images, reseaux, volumes |
| **containerd** | Runtime de conteneurs (gere le cycle de vie) |
| **runc** | Execute les conteneurs (interface OCI) |
| **Docker Registry** | Stockage et distribution des images (Docker Hub) |

### Images Docker

Une image est un **template en lecture seule** compose de couches (layers).

\`\`\`
Image nginx:latest
├── Layer 4 : Configuration nginx (nginx.conf)
├── Layer 3 : Installation nginx (apt install)
├── Layer 2 : Mise a jour apt
└── Layer 1 : Image de base (debian:bookworm-slim)
\`\`\`

\`\`\`bash
# Lister les images locales
docker images
docker image ls

# Telecharger une image
docker pull nginx:1.25
docker pull ubuntu:24.04
docker pull node:20-alpine

# Supprimer une image
docker rmi nginx:1.25

# Voir les couches d'une image
docker history nginx:latest

# Inspecter une image
docker inspect nginx:latest
\`\`\`

### Registries

| Registry | Type | URL |
|----------|------|-----|
| **Docker Hub** | Public | hub.docker.com |
| **GitHub Container Registry** | Public/Prive | ghcr.io |
| **Amazon ECR** | Prive | aws |
| **Google Artifact Registry** | Prive | gcp |
| **Harbor** | Self-hosted | - |

\`\`\`bash
# Se connecter a un registry
docker login
docker login ghcr.io

# Taguer et pousser une image
docker tag mon-app:latest ghcr.io/user/mon-app:v1.0
docker push ghcr.io/user/mon-app:v1.0
\`\`\`

> **Bonne pratique :** Utilisez toujours des tags specifiques (\`nginx:1.25-alpine\`) plutot que \`latest\` en production. Le tag \`latest\` peut changer a tout moment et casser votre deploiement.`
      },
      {
        title: 'Commandes Docker essentielles',
        content: `Maitriser les commandes Docker de base est le premier pas pour tout DevOps. Voici les commandes que vous utiliserez quotidiennement.

### Cycle de vie des conteneurs

\`\`\`bash
# Lancer un conteneur
docker run nginx                          # Premier plan (bloquant)
docker run -d nginx                       # Arriere-plan (detached)
docker run -d --name web nginx            # Avec un nom
docker run -d -p 8080:80 nginx            # Mapping de port (hote:conteneur)
docker run -d -p 8080:80 -p 8443:443 nginx  # Plusieurs ports

# Lancer avec un shell interactif
docker run -it ubuntu:24.04 bash          # Ouvrir un bash
docker run -it --rm ubuntu:24.04 bash     # Supprimer apres arret

# Variables d'environnement
docker run -d -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=mydb mysql:8.0

# Limiter les ressources
docker run -d --memory=512m --cpus=1.5 --name api mon-api:latest
\`\`\`

### Gestion des conteneurs

\`\`\`bash
# Lister les conteneurs
docker ps                                 # En cours d'execution
docker ps -a                              # Tous (y compris arretes)

# Arreter / Demarrer / Redemarrer
docker stop web                           # Arret propre (SIGTERM puis SIGKILL)
docker start web                          # Redemarrer un conteneur arrete
docker restart web                        # Redemarrer

# Supprimer un conteneur
docker rm web                             # Arrete uniquement
docker rm -f web                          # Forcer (meme en cours)

# Nettoyer les conteneurs arretes
docker container prune

# Logs
docker logs web                           # Tous les logs
docker logs -f web                        # Suivre en temps reel
docker logs --tail 100 web                # 100 dernieres lignes
docker logs --since "1h" web              # Depuis 1 heure
\`\`\`

### Interagir avec un conteneur

\`\`\`bash
# Executer une commande dans un conteneur en cours
docker exec -it web bash                  # Ouvrir un shell
docker exec web ls /etc/nginx/            # Commande simple
docker exec -it web sh                    # Si bash n'est pas disponible

# Copier des fichiers
docker cp web:/etc/nginx/nginx.conf ./    # Conteneur → Hote
docker cp ./custom.conf web:/etc/nginx/   # Hote → Conteneur

# Inspecter un conteneur
docker inspect web                        # Toutes les infos (JSON)
docker inspect --format '{{.NetworkSettings.IPAddress}}' web  # IP
docker inspect --format '{{.State.Status}}' web               # Etat

# Stats en temps reel
docker stats                              # Tous les conteneurs
docker stats web                          # Un conteneur specifique
\`\`\`

### Nettoyage

\`\`\`bash
# Supprimer tout ce qui n'est pas utilise
docker system prune                       # Conteneurs arretes + images dangling
docker system prune -a                    # + images non utilisees
docker system prune --volumes             # + volumes orphelins

# Espace disque utilise par Docker
docker system df
docker system df -v                       # Detail par image/conteneur/volume
\`\`\`

### Exemple pratique : lancer une stack

\`\`\`bash
# Lancer MySQL
docker run -d \\
  --name mysql-dev \\
  -e MYSQL_ROOT_PASSWORD=root123 \\
  -e MYSQL_DATABASE=myapp \\
  -e MYSQL_USER=app \\
  -e MYSQL_PASSWORD=app123 \\
  -p 3306:3306 \\
  -v mysql-data:/var/lib/mysql \\
  mysql:8.0

# Lancer Redis
docker run -d --name redis-dev -p 6379:6379 redis:7-alpine

# Verifier
docker ps
docker logs mysql-dev
\`\`\`

> **Astuce :** Utilisez \`--rm\` pour les conteneurs temporaires (tests, debug). Cela evite l'accumulation de conteneurs arretes. Utilisez \`docker system prune\` regulierement pour liberer de l'espace disque.`
      }
    ]
  },
  {
    id: 114,
    slug: 'dockerfile-optimise',
    title: 'Dockerfile Optimise & Multi-stage',
    subtitle: 'Ecrire des Dockerfiles efficaces avec multi-stage builds et bonnes pratiques',
    icon: 'FileCode',
    color: '#10b981',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'Cnw5BeEj1HA',
    sections: [
      {
        title: 'Instructions Dockerfile essentielles',
        content: `Un **Dockerfile** est la recette pour construire une image Docker. Chaque instruction cree une **couche** (layer) dans l'image.

### Instructions principales

| Instruction | Description | Exemple |
|-------------|-------------|---------|
| **FROM** | Image de base | \`FROM node:20-alpine\` |
| **RUN** | Executer une commande | \`RUN apt-get update && apt-get install -y curl\` |
| **COPY** | Copier des fichiers locaux | \`COPY package.json ./\` |
| **ADD** | Copier + extraire archives + URL | \`ADD archive.tar.gz /app/\` |
| **WORKDIR** | Definir le repertoire de travail | \`WORKDIR /app\` |
| **ENV** | Variable d'environnement | \`ENV NODE_ENV=production\` |
| **EXPOSE** | Documenter le port (pas de mapping reel) | \`EXPOSE 3000\` |
| **CMD** | Commande par defaut | \`CMD ["node", "server.js"]\` |
| **ENTRYPOINT** | Point d'entree fixe | \`ENTRYPOINT ["python3"]\` |
| **ARG** | Argument de build | \`ARG VERSION=latest\` |
| **USER** | Utilisateur d'execution | \`USER node\` |
| **HEALTHCHECK** | Verification de sante | \`HEALTHCHECK CMD curl -f http://localhost:3000/health\` |

### Dockerfile basique (Node.js)

\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dependances d'abord (meilleur cache)
COPY package.json package-lock.json ./

# Installer les dependances
RUN npm ci --production

# Copier le code source
COPY src/ ./src/

# Exposer le port
EXPOSE 3000

# Commande de demarrage
CMD ["node", "src/server.js"]
\`\`\`

### CMD vs ENTRYPOINT

\`\`\`dockerfile
# CMD : commande par defaut, remplacable
CMD ["node", "server.js"]
# docker run mon-app                    → node server.js
# docker run mon-app bash               → bash (CMD remplace)

# ENTRYPOINT : point d'entree fixe
ENTRYPOINT ["python3"]
CMD ["app.py"]
# docker run mon-app                    → python3 app.py
# docker run mon-app script.py          → python3 script.py (CMD remplace)

# Forme shell vs exec
CMD node server.js          # Forme shell (lance via /bin/sh -c)
CMD ["node", "server.js"]   # Forme exec (recommande, signaux propres)
\`\`\`

### Build et execution

\`\`\`bash
# Construire l'image
docker build -t mon-app:v1.0 .
docker build -t mon-app:v1.0 -f Dockerfile.prod .    # Dockerfile specifique

# Build avec arguments
docker build --build-arg VERSION=2.3.1 -t mon-app:v2.3.1 .

# Construire sans cache
docker build --no-cache -t mon-app:latest .

# Lancer le conteneur
docker run -d -p 3000:3000 --name api mon-app:v1.0
\`\`\`

> **Bonne pratique :** Utilisez toujours la forme **exec** (\`CMD ["node", "server.js"]\`) plutot que la forme shell. La forme exec permet aux signaux (SIGTERM) d'atteindre directement le processus, ce qui est essentiel pour un arret propre.`
      },
      {
        title: 'Optimisation des layers et cache',
        content: `L'optimisation des couches (layers) est essentielle pour des builds rapides et des images legeres. Docker met en cache chaque layer et ne reconstruit que les layers modifiees.

### Fonctionnement du cache Docker

\`\`\`
Instruction 1: FROM node:20-alpine        ← Cache
Instruction 2: WORKDIR /app               ← Cache
Instruction 3: COPY package.json ./       ← Cache (si fichier inchange)
Instruction 4: RUN npm ci                 ← Cache (si layer precedente inchangee)
Instruction 5: COPY src/ ./src/           ← INVALIDE (code modifie)
Instruction 6: CMD ["node", "server.js"]  ← Reconstruite (apres invalidation)
\`\`\`

**Regle du cache :** Des qu'une layer est invalidee, **toutes les layers suivantes** sont reconstruites.

### Mauvais Dockerfile (lent)

\`\`\`dockerfile
# MAUVAIS : tout est copie d'un coup
FROM node:20-alpine
WORKDIR /app
COPY . .                           # Invalide le cache a chaque modif de code
RUN npm ci --production            # Reinstalle TOUT a chaque build
CMD ["node", "server.js"]
\`\`\`

### Bon Dockerfile (optimise)

\`\`\`dockerfile
# BON : dependances d'abord, code ensuite
FROM node:20-alpine
WORKDIR /app

# Layer 1 : dependances (change rarement)
COPY package.json package-lock.json ./
RUN npm ci --production

# Layer 2 : code source (change souvent)
COPY src/ ./src/

CMD ["node", "server.js"]
\`\`\`

### Reduire le nombre de layers

\`\`\`dockerfile
# MAUVAIS : 4 layers RUN
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# BON : 1 seule layer RUN
RUN apt-get update && \\
    apt-get install -y --no-install-recommends \\
      curl \\
      git && \\
    apt-get clean && \\
    rm -rf /var/lib/apt/lists/*
\`\`\`

### .dockerignore

Le fichier \`.dockerignore\` exclut des fichiers du contexte de build (comme \`.gitignore\` pour Docker).

\`\`\`
# .dockerignore
node_modules
npm-debug.log
dist
.git
.gitignore
.env
.env.*
Dockerfile
docker-compose*.yml
README.md
.vscode
.idea
__pycache__
*.pyc
tests/
coverage/
\`\`\`

### Impact du .dockerignore

\`\`\`bash
# Sans .dockerignore : tout le dossier est envoye au daemon
# Sending build context to Docker daemon  250MB

# Avec .dockerignore : seulement les fichiers necessaires
# Sending build context to Docker daemon  5MB
\`\`\`

> **Regle d'or :** Copiez les fichiers qui changent le **moins souvent en premier** (package.json, requirements.txt) et les fichiers qui changent le **plus souvent en dernier** (code source). Cela maximise l'utilisation du cache.`
      },
      {
        title: 'Multi-stage builds',
        content: `Les **multi-stage builds** permettent d'utiliser plusieurs images dans un seul Dockerfile pour produire une image finale minimale.

### Probleme : image trop grosse

\`\`\`dockerfile
# Image GROSSE : contient les outils de build + le code source + node_modules de dev
FROM node:20
WORKDIR /app
COPY . .
RUN npm install                  # Inclut devDependencies
RUN npm run build                # Genere dist/
CMD ["node", "dist/server.js"]
# Taille : ~1.2 Go !
\`\`\`

### Solution : multi-stage build

\`\`\`dockerfile
# === Stage 1 : Build ===
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                                  # Toutes les deps (y compris dev)
COPY . .
RUN npm run build                           # Genere dist/

# === Stage 2 : Production ===
FROM node:20-alpine AS production
WORKDIR /app

# Copier uniquement le necessaire depuis le stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --production                     # Seulement les deps de prod

# Securite : utilisateur non-root
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
# Taille : ~150 Mo !
\`\`\`

### Exemple : Application React (frontend)

\`\`\`dockerfile
# Stage 1 : Build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build                           # Genere dist/ (fichiers statiques)

# Stage 2 : Servir avec Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Taille : ~25 Mo !
\`\`\`

### Exemple : Application Go

\`\`\`dockerfile
# Stage 1 : Compilation Go
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Stage 2 : Image minimale
FROM scratch                                # Image vide (0 Mo)
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
ENTRYPOINT ["/server"]
# Taille : ~10 Mo !
\`\`\`

### Exemple : Application Python

\`\`\`dockerfile
# Stage 1 : Installer les dependances
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2 : Image finale
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
USER nobody
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
\`\`\`

> **Comparaison des tailles :**
> | Application | Sans multi-stage | Avec multi-stage |
> |-------------|-----------------|------------------|
> | Node.js API | ~1.2 Go | ~150 Mo |
> | React SPA | ~800 Mo | ~25 Mo |
> | Go API | ~800 Mo | ~10 Mo |
> | Python API | ~1 Go | ~200 Mo |`
      },
      {
        title: 'Bonnes pratiques Dockerfile',
        content: `Voici les bonnes pratiques essentielles pour ecrire des Dockerfiles professionnels et securises.

### 1. Utiliser des images de base minimales

\`\`\`dockerfile
# MAUVAIS : image complete (~1 Go)
FROM node:20

# BON : image Alpine (~50 Mo)
FROM node:20-alpine

# ENCORE MIEUX pour les apps compilees : distroless ou scratch
FROM gcr.io/distroless/nodejs20-debian12
FROM scratch
\`\`\`

### 2. Epingler les versions

\`\`\`dockerfile
# MAUVAIS : version non deterministe
FROM node:latest
RUN apt-get install -y curl

# BON : versions epinglees
FROM node:20.11-alpine3.19
RUN apk add --no-cache curl=8.5.0-r0
\`\`\`

### 3. Utilisateur non-root

\`\`\`dockerfile
FROM node:20-alpine

# Creer un utilisateur applicatif
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --chown=appuser:appgroup . .
RUN npm ci --production

# Basculer vers l'utilisateur non-root
USER appuser
CMD ["node", "server.js"]
\`\`\`

### 4. Healthcheck integre

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
\`\`\`

### 5. Labels et metadonnees

\`\`\`dockerfile
FROM node:20-alpine

LABEL maintainer="devops@exemple.com"
LABEL version="2.3.1"
LABEL description="API backend"
LABEL org.opencontainers.image.source="https://github.com/org/repo"
\`\`\`

### 6. Gerer les secrets proprement

\`\`\`dockerfile
# MAUVAIS : secret dans l'image
COPY .env /app/.env
ENV API_KEY=sk-secret123

# BON : passer a l'execution
# docker run -e API_KEY=sk-secret123 mon-app
# docker run --env-file .env mon-app

# BON : Docker BuildKit secrets (build-time)
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
\`\`\`

### Checklist Dockerfile production

1. Image de base minimale (Alpine, slim, distroless)
2. Versions epinglees (image de base + paquets)
3. Multi-stage build
4. .dockerignore complet
5. Utilisateur non-root
6. Healthcheck configure
7. Labels de metadonnees
8. Pas de secrets dans l'image
9. Layers optimisees (cache)
10. \`npm ci\` au lieu de \`npm install\` (reproductible)

> **Conseil final :** Scannez vos images avec \`docker scout\` ou **Trivy** pour detecter les vulnerabilites. Une image minimale a moins de surface d'attaque qu'une image complete.`
      }
    ]
  },
  {
    id: 115,
    slug: 'docker-compose-devops',
    title: 'Docker Compose',
    subtitle: 'Orchestrer des applications multi-conteneurs avec Docker Compose',
    icon: 'Layers',
    color: '#10b981',
    duration: '35 min',
    level: 'Intermediaire',
    videoId: 'F9R1EOaA7EA',
    sections: [
      {
        title: 'Syntaxe docker-compose.yml',
        content: `**Docker Compose** permet de definir et gerer des applications multi-conteneurs dans un seul fichier YAML. C'est l'outil essentiel pour le developpement local et les environnements de staging.

### Structure de base

\`\`\`yaml
# docker-compose.yml
services:
  # Service API
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=database
    depends_on:
      - database
      - redis

  # Service base de donnees
  database:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: myapp
    volumes:
      - db-data:/var/lib/mysql

  # Service cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db-data:
\`\`\`

### Commandes Docker Compose

\`\`\`bash
# Demarrer tous les services (arriere-plan)
docker compose up -d

# Demarrer avec rebuild des images
docker compose up -d --build

# Arreter tous les services
docker compose down

# Arreter et supprimer les volumes
docker compose down -v

# Voir les logs
docker compose logs
docker compose logs -f api          # Suivre un service specifique

# Voir l'etat des services
docker compose ps

# Executer une commande dans un service
docker compose exec api bash
docker compose exec database mysql -u root -proot123

# Redemarrer un service specifique
docker compose restart api

# Scaler un service
docker compose up -d --scale api=3
\`\`\`

### Options de build

\`\`\`yaml
services:
  api:
    # Build depuis un Dockerfile
    build:
      context: ./backend          # Repertoire de contexte
      dockerfile: Dockerfile.prod # Dockerfile specifique
      args:
        NODE_ENV: production      # Arguments de build
      target: production          # Stage cible (multi-stage)

    # Ou image depuis un registry
    image: ghcr.io/org/api:v2.3.1
\`\`\`

### Ports et exposition

\`\`\`yaml
services:
  api:
    ports:
      - "3000:3000"               # hote:conteneur
      - "127.0.0.1:3001:3001"     # Seulement localhost
      - "8080-8090:8080-8090"     # Plage de ports

    expose:
      - "3000"                     # Expose uniquement aux autres services
                                   # (pas a l'hote)
\`\`\`

> **Docker Compose V2 :** La commande est \`docker compose\` (avec espace) et non \`docker-compose\` (avec tiret). La V2 est integree au CLI Docker et est la version recommandee.`
      },
      {
        title: 'Services, reseaux et volumes',
        content: `Docker Compose gere automatiquement les reseaux et volumes pour connecter vos services entre eux.

### Reseaux Docker Compose

Par defaut, Compose cree un reseau \`<projet>_default\` qui connecte tous les services.

\`\`\`yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    networks:
      - frontend-net

  api:
    build: ./backend
    networks:
      - frontend-net              # Accessible par le frontend
      - backend-net               # Accessible par la DB

  database:
    image: mysql:8.0
    networks:
      - backend-net               # Isole du frontend

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true                 # Pas d'acces Internet
\`\`\`

### Resolution DNS interne

Les services se resolvent par leur **nom de service** :

\`\`\`yaml
services:
  api:
    environment:
      DB_HOST: database           # Resolu vers l'IP du conteneur database
      REDIS_HOST: redis           # Resolu vers l'IP du conteneur redis
  database:
    image: mysql:8.0
  redis:
    image: redis:7-alpine
\`\`\`

\`\`\`javascript
// Dans le code de l'API, on utilise le nom du service
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // "database" → resolu par Docker DNS
  port: 3306,
  user: 'root',
  password: 'root123'
});
\`\`\`

### Volumes

\`\`\`yaml
services:
  database:
    image: mysql:8.0
    volumes:
      # Volume nomme (persiste entre les recreations)
      - db-data:/var/lib/mysql

      # Bind mount (developpement : code source monte)
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

  api:
    build: ./backend
    volumes:
      # Bind mount pour le hot reload en dev
      - ./backend/src:/app/src

      # Volume anonyme pour exclure node_modules
      - /app/node_modules

volumes:
  db-data:                        # Volume nomme (gere par Docker)
    driver: local
\`\`\`

### Types de volumes

| Type | Syntaxe | Persistence | Usage |
|------|---------|-------------|-------|
| **Volume nomme** | \`db-data:/var/lib/mysql\` | Oui (docker volume) | Production (donnees) |
| **Bind mount** | \`./src:/app/src\` | Oui (filesystem hote) | Developpement (code) |
| **tmpfs** | \`tmpfs: /tmp\` | Non (RAM) | Donnees temporaires |
| **Anonyme** | \`/app/node_modules\` | Non | Exclure des bind mounts |

> **Bonne pratique :** Utilisez des **volumes nommes** pour les donnees persistantes (bases de donnees) et des **bind mounts** pour le developpement (hot reload du code source).`
      },
      {
        title: 'depends_on et healthchecks',
        content: `L'ordre de demarrage des services est critique. \`depends_on\` gere les dependances, et les healthchecks s'assurent que les services sont reellement prets.

### depends_on basique

\`\`\`yaml
services:
  api:
    build: ./backend
    depends_on:
      - database
      - redis
    # L'API demarre APRES que database et redis aient demarre
    # MAIS pas apres qu'ils soient prets !

  database:
    image: mysql:8.0

  redis:
    image: redis:7-alpine
\`\`\`

### depends_on avec condition de sante

\`\`\`yaml
services:
  api:
    build: ./backend
    depends_on:
      database:
        condition: service_healthy    # Attend que le healthcheck passe
      redis:
        condition: service_healthy

  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot123"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s              # Temps d'initialisation avant les checks

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
\`\`\`

### Healthchecks pour differents services

\`\`\`yaml
# PostgreSQL
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5

# MongoDB
healthcheck:
  test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
  interval: 10s
  timeout: 5s
  retries: 5

# Elasticsearch
healthcheck:
  test: ["CMD-SHELL", "curl -sf http://localhost:9200/_cluster/health || exit 1"]
  interval: 15s
  timeout: 10s
  retries: 5
  start_period: 60s

# Application web
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 5s
  retries: 3
\`\`\`

### Restart policies

\`\`\`yaml
services:
  api:
    restart: always                  # Toujours redemarrer (sauf arret manuel)
  
  database:
    restart: unless-stopped          # Comme always, sauf si arrete manuellement

  migration:
    restart: "no"                    # Ne jamais redemarrer (tache ponctuelle)

  worker:
    restart: on-failure              # Redemarrer seulement en cas d'erreur
\`\`\`

| Politique | Comportement |
|-----------|-------------|
| \`no\` | Ne jamais redemarrer (defaut) |
| \`always\` | Toujours redemarrer (y compris au boot Docker) |
| \`unless-stopped\` | Comme always, sauf apres un \`docker stop\` |
| \`on-failure\` | Seulement si le processus se termine avec un code d'erreur |

> **En production :** Utilisez toujours \`depends_on\` avec \`condition: service_healthy\` pour garantir que les services dependants sont reellement operationnels avant de demarrer les services qui en dependent.`
      },
      {
        title: 'Fichiers .env et scaling',
        content: `Les fichiers d'environnement et le scaling permettent d'adapter Docker Compose a differents contextes (dev, staging, prod).

### Fichiers d'environnement

\`\`\`bash
# .env (charge automatiquement par Docker Compose)
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=myapp
NODE_ENV=production
API_PORT=3000
\`\`\`

\`\`\`yaml
# docker-compose.yml
services:
  api:
    build: ./backend
    ports:
      - "\${API_PORT:-3000}:3000"     # Variable avec valeur par defaut
    environment:
      - NODE_ENV=\${NODE_ENV}
    env_file:
      - .env                          # Charger toutes les variables
      - .env.local                    # Overrides locaux (non commite)

  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: \${MYSQL_DATABASE}
\`\`\`

### Override files (multi-environnement)

\`\`\`yaml
# docker-compose.yml (base)
services:
  api:
    build: ./backend
    environment:
      - NODE_ENV=production

  database:
    image: mysql:8.0
\`\`\`

\`\`\`yaml
# docker-compose.override.yml (dev, charge automatiquement)
services:
  api:
    build:
      target: development             # Stage dev du multi-stage
    volumes:
      - ./backend/src:/app/src        # Hot reload
    ports:
      - "3000:3000"
      - "9229:9229"                   # Debug port
    environment:
      - NODE_ENV=development
\`\`\`

\`\`\`yaml
# docker-compose.prod.yml (production)
services:
  api:
    image: ghcr.io/org/api:v2.3.1    # Image pre-construite
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: "1.0"
    restart: always
\`\`\`

\`\`\`bash
# Developpement (utilise docker-compose.yml + docker-compose.override.yml)
docker compose up -d

# Production (utilise docker-compose.yml + docker-compose.prod.yml)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

### Scaling des services

\`\`\`bash
# Scaler un service
docker compose up -d --scale api=3

# Verifier
docker compose ps
# NAME           SERVICE    STATUS    PORTS
# project-api-1  api       running   0.0.0.0:3000->3000/tcp
# project-api-2  api       running   0.0.0.0:3001->3000/tcp
# project-api-3  api       running   0.0.0.0:3002->3000/tcp
\`\`\`

\`\`\`yaml
# Scaling avec un load balancer
services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api

  api:
    build: ./backend
    expose:
      - "3000"                        # Pas de port mapping hote
    deploy:
      replicas: 3
\`\`\`

\`\`\`nginx
# nginx.conf — load balancer
upstream api {
    server project-api-1:3000;
    server project-api-2:3000;
    server project-api-3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://api;
    }
}
\`\`\`

> **Organisation recommandee :**
> - \`docker-compose.yml\` : configuration de base (commite)
> - \`docker-compose.override.yml\` : overrides de dev (commite)
> - \`docker-compose.prod.yml\` : overrides de prod (commite)
> - \`.env\` : valeurs par defaut (commite)
> - \`.env.local\` : secrets locaux (dans .gitignore)`
      }
    ]
  },
  {
    id: 116,
    slug: 'docker-volumes-reseaux',
    title: 'Volumes & Reseaux Docker',
    subtitle: 'Gerer la persistence des donnees et la communication entre conteneurs',
    icon: 'HardDrive',
    color: '#10b981',
    duration: '30 min',
    level: 'Intermediaire',
    videoId: 'lrBlaHxhpQk',
    sections: [
      {
        title: 'Volumes Docker (named, bind, tmpfs)',
        content: `Les **volumes** Docker gerent la persistence des donnees. Sans volume, les donnees sont perdues quand le conteneur est supprime.

### Pourquoi les volumes ?

Le systeme de fichiers d'un conteneur est **ephemere** : il est detruit avec le conteneur. Les volumes permettent de persister les donnees independamment du cycle de vie du conteneur.

\`\`\`
Conteneur (ephemere)        Volume (persistant)
┌──────────────┐           ┌──────────────┐
│  /app        │           │              │
│  /tmp        │           │  db-data     │
│  /var/lib/   │──────────>│  (persiste)  │
│   mysql      │           │              │
└──────────────┘           └──────────────┘
  Supprime avec              Survit a la
  docker rm                  suppression
\`\`\`

### Types de volumes

| Type | Commande | Gere par | Cas d'usage |
|------|----------|----------|-------------|
| **Volume nomme** | \`-v db-data:/var/lib/mysql\` | Docker | Production (BDD, fichiers) |
| **Bind mount** | \`-v ./src:/app/src\` | Utilisateur | Developpement (code source) |
| **tmpfs** | \`--tmpfs /tmp\` | RAM | Donnees temporaires, secrets |
| **Anonyme** | \`-v /var/lib/mysql\` | Docker | Temporaire, non recommande |

### Volumes nommes

\`\`\`bash
# Creer un volume
docker volume create db-data

# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect db-data
# Mountpoint: /var/lib/docker/volumes/db-data/_data

# Utiliser un volume nomme
docker run -d \\
  --name mysql-prod \\
  -v db-data:/var/lib/mysql \\
  -e MYSQL_ROOT_PASSWORD=secret \\
  mysql:8.0

# Le volume persiste meme apres suppression du conteneur
docker rm -f mysql-prod
docker volume ls                # db-data existe toujours

# Relancer avec le meme volume = donnees intactes
docker run -d \\
  --name mysql-prod-v2 \\
  -v db-data:/var/lib/mysql \\
  mysql:8.0

# Supprimer un volume
docker volume rm db-data

# Supprimer les volumes orphelins
docker volume prune
\`\`\`

### Bind mounts

\`\`\`bash
# Monter un repertoire local dans le conteneur
docker run -d \\
  --name dev-api \\
  -v $(pwd)/src:/app/src \\       # Chemin absolu requis
  -v $(pwd)/.env:/app/.env:ro \\  # :ro = lecture seule
  -p 3000:3000 \\
  node:20-alpine node /app/src/server.js

# Le code modifie localement est immediatement visible dans le conteneur
# Ideal pour le developpement avec hot reload
\`\`\`

### tmpfs mounts

\`\`\`bash
# Monter un volume en RAM (non persistant, rapide)
docker run -d \\
  --name api-secure \\
  --tmpfs /tmp:size=100m \\
  --tmpfs /run/secrets:size=1m \\
  mon-api:latest

# Utile pour :
# - Fichiers temporaires (pas ecrits sur disque)
# - Secrets en memoire
# - Cache ephemere rapide
\`\`\`

### Backup d'un volume

\`\`\`bash
# Sauvegarder un volume dans une archive
docker run --rm \\
  -v db-data:/source:ro \\
  -v $(pwd):/backup \\
  alpine tar czf /backup/db-backup.tar.gz -C /source .

# Restaurer un volume depuis une archive
docker run --rm \\
  -v db-data:/target \\
  -v $(pwd):/backup \\
  alpine tar xzf /backup/db-backup.tar.gz -C /target
\`\`\`

> **Regle de production :** Toujours utiliser des **volumes nommes** pour les donnees de base de donnees. Un \`docker rm\` accidentel ne doit jamais causer de perte de donnees. Planifiez des backups reguliers de vos volumes.`
      },
      {
        title: 'Types de reseaux Docker',
        content: `Docker gere la connectivite reseau entre conteneurs via differents **drivers de reseau**. Comprendre ces types est essentiel pour architecturer des applications multi-conteneurs.

### Les drivers reseau Docker

| Driver | Description | Cas d'usage |
|--------|-------------|-------------|
| **bridge** | Reseau prive isole (defaut) | Conteneurs sur un seul hote |
| **host** | Partage le reseau de l'hote | Performance maximale |
| **none** | Pas de reseau | Isolation complete |
| **overlay** | Reseau multi-hotes | Docker Swarm, clusters |
| **macvlan** | Adresse MAC propre | Integration reseau physique |

### Bridge (defaut)

\`\`\`bash
# Le reseau bridge par defaut (docker0)
docker network ls
# NETWORK ID     NAME      DRIVER    SCOPE
# abc123         bridge    bridge    local
# def456         host      host      local
# ghi789         none      null      local

# Creer un reseau bridge personnalise (RECOMMANDE)
docker network create mon-reseau

# Lancer des conteneurs sur le meme reseau
docker run -d --name api --network mon-reseau mon-api
docker run -d --name db --network mon-reseau mysql:8.0

# Les conteneurs se resolvent par nom
docker exec api ping db              # Fonctionne !
docker exec api curl http://db:3306  # Resolution DNS automatique
\`\`\`

### Difference bridge defaut vs bridge personnalise

| Fonctionnalite | Bridge defaut | Bridge personnalise |
|----------------|---------------|---------------------|
| **Resolution DNS** | Non (seulement par IP) | Oui (par nom de conteneur) |
| **Isolation** | Tous les conteneurs | Seulement les conteneurs connectes |
| **Connexion a chaud** | Non | Oui (\`docker network connect\`) |

\`\`\`bash
# Bridge defaut : pas de resolution DNS
docker run -d --name web1 nginx
docker run -d --name web2 nginx
docker exec web1 ping web2          # ECHEC : nom non resolu

# Bridge personnalise : resolution DNS
docker network create app-net
docker run -d --name web1 --network app-net nginx
docker run -d --name web2 --network app-net nginx
docker exec web1 ping web2          # SUCCES !
\`\`\`

### Host

\`\`\`bash
# Le conteneur utilise directement le reseau de l'hote
docker run -d --network host nginx
# nginx ecoute directement sur le port 80 de l'hote
# Pas besoin de -p 80:80

# Avantage : pas de NAT, meilleure performance
# Inconvenient : pas d'isolation reseau, conflits de ports possibles
\`\`\`

### None

\`\`\`bash
# Conteneur sans aucune connectivite reseau
docker run -d --network none alpine sleep infinity
# Utile pour des taches de calcul pur ou de securite
\`\`\`

### Gestion des reseaux

\`\`\`bash
# Lister les reseaux
docker network ls

# Inspecter un reseau (voir les conteneurs connectes)
docker network inspect mon-reseau

# Connecter un conteneur a un reseau supplementaire
docker network connect mon-reseau conteneur-existant

# Deconnecter
docker network disconnect mon-reseau conteneur-existant

# Supprimer un reseau
docker network rm mon-reseau

# Nettoyer les reseaux inutilises
docker network prune
\`\`\`

> **Bonne pratique :** Toujours creer des **reseaux bridge personnalises** plutot que d'utiliser le reseau bridge par defaut. La resolution DNS par nom de service est indispensable pour des architectures multi-conteneurs.`
      },
      {
        title: 'DNS interne et communication inter-conteneurs',
        content: `Le **DNS interne** de Docker est la cle de la communication entre conteneurs. Il permet aux services de se decouvrir par nom sans connaitre les adresses IP.

### Fonctionnement du DNS Docker

\`\`\`
┌─────────────────────────────────────────────────┐
│            Reseau Docker (app-net)               │
│                                                   │
│  ┌──────────┐    DNS Docker    ┌──────────┐     │
│  │   api    │ ←──────────────→ │ database │     │
│  │ 172.18.  │  "database"      │ 172.18.  │     │
│  │ 0.2      │  → 172.18.0.3   │ 0.3      │     │
│  └──────────┘                  └──────────┘     │
│                                                   │
│  ┌──────────┐                  ┌──────────┐     │
│  │  redis   │                  │  nginx   │     │
│  │ 172.18.  │                  │ 172.18.  │     │
│  │ 0.4      │                  │ 0.5      │     │
│  └──────────┘                  └──────────┘     │
└─────────────────────────────────────────────────┘

DNS resolutions :
  "api"      → 172.18.0.2
  "database" → 172.18.0.3
  "redis"    → 172.18.0.4
  "nginx"    → 172.18.0.5
\`\`\`

### Communication entre services

\`\`\`yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
    depends_on:
      - api

  api:
    build: ./backend
    environment:
      DB_HOST: database             # Nom du service = hostname DNS
      DB_PORT: 3306
      REDIS_URL: redis://redis:6379
    depends_on:
      - database
      - redis

  database:
    image: mysql:8.0
    # Pas de "ports:" = pas accessible depuis l'exterieur
    # Accessible uniquement par les autres conteneurs via le nom "database"

  redis:
    image: redis:7-alpine
    # Meme chose : accessible uniquement en interne
\`\`\`

### Isolation entre reseaux

\`\`\`yaml
# Architecture securisee : isolation frontend/backend
services:
  nginx:
    networks:
      - frontend

  api:
    networks:
      - frontend                    # Communique avec nginx
      - backend                     # Communique avec la DB

  database:
    networks:
      - backend                     # Isole du frontend

networks:
  frontend:
  backend:
    internal: true                   # Pas d'acces Internet
\`\`\`

\`\`\`
nginx ←──frontend──→ api ←──backend──→ database
                                        (pas d'Internet)
nginx ←─────────X──→ database           (pas de connexion directe)
\`\`\`

### Alias et noms personnalises

\`\`\`yaml
services:
  database:
    image: mysql:8.0
    networks:
      backend:
        aliases:
          - mysql                    # Accessible via "mysql" ET "database"
          - db
\`\`\`

### Debug reseau Docker

\`\`\`bash
# Voir l'IP d'un conteneur
docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api

# Tester la resolution DNS depuis un conteneur
docker exec api nslookup database

# Tester la connectivite
docker exec api ping database -c 3
docker exec api curl -sf http://api:3000/health

# Lancer un conteneur de debug sur le meme reseau
docker run --rm -it --network app-net alpine sh
# Puis : ping database, nslookup api, wget -qO- http://api:3000
\`\`\`

> **Architecture recommandee :** Creez des reseaux separes par couche (frontend, backend, monitoring). Seuls les services qui doivent communiquer partagent un reseau. La base de donnees ne doit jamais etre accessible directement depuis Internet.`
      },
      {
        title: 'Backup, restauration et bonnes pratiques',
        content: `La gestion des volumes en production implique des sauvegardes regulieres, des tests de restauration et une strategie de nettoyage.

### Backup d'un volume avec compression

\`\`\`bash
# Sauvegarder un volume dans une archive compressee
docker run --rm \\
  -v db-data:/source:ro \\
  -v $(pwd)/backups:/backup \\
  alpine tar czf /backup/db-data-$(date +%Y%m%d_%H%M%S).tar.gz -C /source .

# Sauvegarder via un dump applicatif (recommande pour les BDD)
docker exec mysql-prod \\
  mysqldump -u root -psecret --all-databases > backup-$(date +%Y%m%d).sql

docker exec postgres-prod \\
  pg_dump -U admin mydb > backup-$(date +%Y%m%d).sql
\`\`\`

### Restauration

\`\`\`bash
# Creer un nouveau volume
docker volume create db-data-restored

# Restaurer depuis l'archive
docker run --rm \\
  -v db-data-restored:/target \\
  -v $(pwd)/backups:/backup:ro \\
  alpine tar xzf /backup/db-data-20260304_120000.tar.gz -C /target

# Restaurer un dump SQL
docker exec -i mysql-prod \\
  mysql -u root -psecret < backup-20260304.sql
\`\`\`

### Script de backup automatise

\`\`\`bash
#!/bin/bash
# /usr/local/bin/docker-volume-backup.sh
BACKUP_DIR="/opt/backups/volumes"
RETENTION=30  # jours
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

for VOL in $(docker volume ls -q --filter dangling=false); do
  echo "Backup: $VOL"
  docker run --rm \\
    -v "$VOL":/source:ro \\
    -v "$BACKUP_DIR":/backup \\
    alpine tar czf "/backup/\${VOL}-\${DATE}.tar.gz" -C /source .
done

# Supprimer les backups anciens
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION -delete
echo "Nettoyage termine. Espace utilise: $(du -sh $BACKUP_DIR | cut -f1)"
\`\`\`

### Nettoyage des ressources Docker

\`\`\`bash
# Supprimer les volumes orphelins (non attaches a un conteneur)
docker volume prune -f

# Supprimer les reseaux inutilises
docker network prune -f

# Nettoyage complet (conteneurs arretes + images dangling + volumes + reseaux)
docker system prune --volumes -f

# Voir l'espace disque utilise par Docker
docker system df
# TYPE            TOTAL     ACTIVE    SIZE       RECLAIMABLE
# Images          12        4         3.2GB      2.1GB (65%)
# Containers      8         3         150MB      100MB (66%)
# Local Volumes   5         3         1.8GB      500MB (27%)
# Build Cache     -         -         800MB      800MB
\`\`\`

### Bonnes pratiques volumes et reseaux

| Pratique | Pourquoi |
|----------|----------|
| Volumes nommes en production | Evite la perte de donnees accidentelle |
| Bind mounts en dev seulement | Hot reload et debug facilite |
| \`:ro\` pour les configs montees | Empeche la modification par le conteneur |
| Reseaux bridge personnalises | DNS automatique entre services |
| \`internal: true\` pour les BDD | Pas d'acces Internet direct |
| Backup quotidien automatise | Protection contre la perte de donnees |
| Test de restauration mensuel | Verifier que les backups fonctionnent |

> **Regle critique :** Un backup non teste est un backup qui n'existe pas. Planifiez des tests de restauration reguliers et documentez la procedure de recovery.`
      }
    ]
  },
  {
    id: 117,
    slug: 'securite-conteneurs',
    title: 'Securisation des Conteneurs',
    subtitle: 'Proteger les conteneurs Docker avec les bonnes pratiques de securite',
    icon: 'Shield',
    color: '#10b981',
    duration: '35 min',
    level: 'Avance',
    videoId: 'VMzgt1434c8',
    sections: [
      {
        title: 'Execution root vs non-root',
        content: `Par defaut, les conteneurs Docker s'executent en tant que **root**. C'est un risque de securite majeur qu'il faut corriger en production.

### Le probleme du root dans les conteneurs

\`\`\`bash
# Par defaut, le processus dans le conteneur est root
docker run --rm alpine id
# uid=0(root) gid=0(root) groups=0(root)

# Si un attaquant s'echappe du conteneur (container escape),
# il est root sur l'hote !
\`\`\`

### Solution : utilisateur non-root

\`\`\`dockerfile
FROM node:20-alpine

# Creer un utilisateur applicatif
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --chown=appuser:appgroup package.json ./
RUN npm ci --production
COPY --chown=appuser:appgroup src/ ./src/

# Basculer vers l'utilisateur non-root
USER appuser

EXPOSE 3000
CMD ["node", "src/server.js"]
\`\`\`

\`\`\`bash
# Verifier que le conteneur ne tourne pas en root
docker run --rm mon-app id
# uid=100(appuser) gid=101(appgroup) groups=101(appgroup)
\`\`\`

### Forcer le non-root au lancement

\`\`\`bash
# Meme si le Dockerfile n'a pas de USER, on peut forcer
docker run --user 1000:1000 nginx

# Empecher completement l'execution en root
docker run --security-opt no-new-privileges nginx
\`\`\`

### User namespace remapping

Le user namespace remapping mappe le root du conteneur (UID 0) vers un utilisateur non-privilegie sur l'hote :

\`\`\`bash
# Configurer dans /etc/docker/daemon.json
{
  "userns-remap": "default"
}

# Avec le remapping :
# root (UID 0) dans le conteneur = UID 100000 sur l'hote
# Meme un container escape ne donne pas les droits root
\`\`\`

### Images avec utilisateur integre

Certaines images officielles ont deja un utilisateur non-root :

| Image | Utilisateur | UID |
|-------|------------|-----|
| \`node:20-alpine\` | node | 1000 |
| \`nginx:alpine\` | nginx | 101 |
| \`postgres:16\` | postgres | 999 |
| \`redis:7-alpine\` | redis | 999 |

\`\`\`dockerfile
# Utiliser l'utilisateur integre de l'image Node
FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node . .
RUN npm ci --production
USER node
CMD ["node", "server.js"]
\`\`\`

> **Regle de securite :** En production, AUCUN conteneur ne doit tourner en root. Utilisez \`USER\` dans le Dockerfile ou \`--user\` au lancement. Verifiez avec \`docker exec <container> id\`.`
      },
      {
        title: 'Capabilities et seccomp',
        content: `Les **capabilities** Linux et les profils **seccomp** permettent de limiter finement les privileges d'un conteneur, au-dela de la simple distinction root/non-root.

### Capabilities Linux

Au lieu d'un "tout ou rien" (root ou pas root), Linux decoupe les privileges en **capabilities** granulaires.

| Capability | Description | Risque |
|------------|-------------|--------|
| \`NET_BIND_SERVICE\` | Ecouter sur les ports < 1024 | Faible |
| \`NET_RAW\` | Paquets raw (ping) | Moyen |
| \`SYS_ADMIN\` | Operations d'admin (mount, etc.) | Eleve |
| \`SYS_PTRACE\` | Debug de processus | Eleve |
| \`NET_ADMIN\` | Configuration reseau | Eleve |
| \`DAC_OVERRIDE\` | Ignorer les permissions fichiers | Eleve |
| \`SETUID/SETGID\` | Changer d'utilisateur | Eleve |

\`\`\`bash
# Docker donne par defaut un ensemble restreint de capabilities
# Mais c'est encore trop pour la plupart des applications

# Supprimer TOUTES les capabilities
docker run --cap-drop=ALL nginx

# Puis ajouter seulement celles necessaires
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# Voir les capabilities d'un conteneur
docker inspect --format '{{.HostConfig.CapAdd}}' mon-conteneur
docker inspect --format '{{.HostConfig.CapDrop}}' mon-conteneur
\`\`\`

### Profil minimum recommande

\`\`\`bash
docker run -d \\
  --cap-drop=ALL \\
  --cap-add=NET_BIND_SERVICE \\     # Si besoin de port < 1024
  --security-opt=no-new-privileges \\
  --read-only \\                     # Filesystem en lecture seule
  --tmpfs /tmp \\                    # tmp en RAM (inscriptible)
  mon-app:latest
\`\`\`

### Seccomp (Secure Computing)

Seccomp filtre les **appels systeme** (syscalls) autorises. Docker applique un profil par defaut qui bloque ~44 syscalls dangereux.

\`\`\`bash
# Voir le profil seccomp par defaut
docker info --format '{{.SecurityOptions}}'

# Utiliser un profil personnalise
docker run --security-opt seccomp=profil-custom.json mon-app

# Desactiver seccomp (DECONSEILLE en production)
docker run --security-opt seccomp=unconfined mon-app
\`\`\`

### AppArmor / SELinux

\`\`\`bash
# Docker utilise AppArmor (Ubuntu) ou SELinux (RHEL) automatiquement
# Voir le profil AppArmor
docker inspect --format '{{.AppArmorProfile}}' mon-conteneur

# Profil personnalise
docker run --security-opt apparmor=mon-profil mon-app
\`\`\`

### Filesystem en lecture seule

\`\`\`bash
# Empecher toute ecriture dans le filesystem du conteneur
docker run --read-only \\
  --tmpfs /tmp \\              # tmp inscriptible (RAM)
  --tmpfs /var/run \\          # PID files
  -v app-data:/app/data \\    # Seul volume inscriptible
  mon-app:latest
\`\`\`

> **Principe du moindre privilege :** Supprimez toutes les capabilities (\`--cap-drop=ALL\`), puis ajoutez uniquement celles necessaires. Activez \`--read-only\` et \`no-new-privileges\`. C'est le profil de securite minimal pour la production.`
      },
      {
        title: 'Scan d\'images avec Trivy',
        content: `Le scan d'images detecte les **vulnerabilites** (CVE) dans les paquets systeme et les dependances applicatives. C'est une etape obligatoire avant le deploiement en production.

### Installation de Trivy

\`\`\`bash
# Ubuntu/Debian
sudo apt-get install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install trivy -y

# macOS
brew install trivy

# Docker (sans installation)
docker run --rm aquasec/trivy image mon-app:latest
\`\`\`

### Scan d'une image

\`\`\`bash
# Scan complet
trivy image mon-app:latest

# Scan avec severite minimale
trivy image --severity HIGH,CRITICAL mon-app:latest

# Scan et echec si vulnerabilites critiques
trivy image --exit-code 1 --severity CRITICAL mon-app:latest

# Format JSON (pour integration CI)
trivy image --format json -o report.json mon-app:latest

# Format table (lisible)
trivy image --format table mon-app:latest
\`\`\`

### Exemple de sortie Trivy

\`\`\`
mon-app:latest (alpine 3.19)
Total: 3 (HIGH: 2, CRITICAL: 1)

┌──────────────┬──────────────┬──────────┬───────────┬──────────────────┐
│   Library    │ Vulnerability │ Severity │  Version  │  Fixed Version   │
├──────────────┼──────────────┼──────────┼───────────┼──────────────────┤
│ libcrypto3   │ CVE-2024-XXX │ CRITICAL │ 3.1.4-r0  │ 3.1.4-r1         │
│ curl         │ CVE-2024-YYY │ HIGH     │ 8.5.0-r0  │ 8.5.0-r1         │
│ busybox      │ CVE-2024-ZZZ │ HIGH     │ 1.36.1-r6 │ 1.36.1-r7        │
└──────────────┴──────────────┴──────────┴───────────┴──────────────────┘
\`\`\`

### Integration dans le CI/CD

\`\`\`yaml
# GitHub Actions
- name: Build image
  run: docker build -t mon-app:\${{ github.sha }} .

- name: Scan with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: mon-app:\${{ github.sha }}
    severity: HIGH,CRITICAL
    exit-code: 1                    # Echec du pipeline si vulnerabilites
    format: table
\`\`\`

### Docker Scout (alternative officielle)

\`\`\`bash
# Docker Scout est integre au Docker CLI
docker scout cves mon-app:latest
docker scout quickview mon-app:latest
docker scout recommendations mon-app:latest
\`\`\`

### Docker Content Trust (DCT)

DCT garantit l'**integrite** et la **provenance** des images via des signatures cryptographiques.

\`\`\`bash
# Activer Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# Avec DCT active :
# - docker pull verifie la signature de l'image
# - docker push signe automatiquement l'image
# - Les images non signees sont rejetees

docker pull nginx:1.25                # Verifie la signature
docker pull image-non-signee:latest   # REFUSE
\`\`\`

> **Pipeline de securite images :**
> 1. Build l'image
> 2. Scan avec Trivy / Docker Scout
> 3. Echec si vulnerabilites CRITICAL
> 4. Signer l'image (DCT / cosign)
> 5. Pousser vers le registry
> 6. Deployer uniquement les images signees`
      },
      {
        title: 'Bonnes pratiques de securite conteneurs',
        content: `Voici un recapitulatif complet des bonnes pratiques de securite pour les conteneurs Docker en production.

### Checklist de securite Docker

**Image :**
- [ ] Image de base minimale (Alpine, distroless, scratch)
- [ ] Versions epinglees (pas de \`latest\`)
- [ ] Multi-stage build (pas d'outils de build en production)
- [ ] Scan de vulnerabilites (Trivy/Scout) dans le CI/CD
- [ ] Pas de secrets dans l'image (pas de .env, pas de cles)
- [ ] .dockerignore complet

**Runtime :**
- [ ] Utilisateur non-root (\`USER\` dans le Dockerfile)
- [ ] \`--cap-drop=ALL\` + ajout minimal
- [ ] \`--security-opt=no-new-privileges\`
- [ ] \`--read-only\` avec tmpfs si necessaire
- [ ] Limites de ressources (\`--memory\`, \`--cpus\`)
- [ ] Healthcheck configure

**Reseau :**
- [ ] Reseaux isoles par service
- [ ] Pas de \`--network host\` en production
- [ ] Pas de ports exposes inutilement
- [ ] TLS pour la communication inter-services si necessaire

### Configuration Docker daemon securisee

\`\`\`json
// /etc/docker/daemon.json
{
  "icc": false,
  "userns-remap": "default",
  "no-new-privileges": true,
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
\`\`\`

| Option | Description |
|--------|-------------|
| \`icc: false\` | Desactive la communication inter-conteneurs par defaut |
| \`userns-remap\` | Active le user namespace remapping |
| \`no-new-privileges\` | Empeche l'escalade de privileges |
| \`live-restore\` | Les conteneurs survivent au redemarrage du daemon |
| \`log-opts\` | Limite la taille des logs (evite de remplir le disque) |

### Gestion des secrets

\`\`\`bash
# MAUVAIS : variable d'environnement visible
docker run -e DB_PASSWORD=secret123 mon-app
# docker inspect montre le secret en clair !

# MIEUX : fichier de secrets
echo "secret123" > /run/secrets/db_password
docker run -v /run/secrets/db_password:/run/secrets/db_password:ro mon-app

# IDEAL : Docker secrets (Swarm) ou solution externe
docker secret create db_password secret_file.txt
docker service create --secret db_password mon-app
\`\`\`

### Audit de securite

\`\`\`bash
# Docker Bench Security (audit automatise)
docker run --rm --net host --pid host \\
  --userns host --cap-add audit_control \\
  -v /var/lib:/var/lib \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -v /etc:/etc:ro \\
  docker/docker-bench-security

# Le rapport indique les points a corriger :
# [WARN] 2.1 - Ensure network traffic is restricted between containers
# [WARN] 4.1 - Ensure a user for the container has been created
# [PASS] 5.1 - Ensure AppArmor Profile is enabled
\`\`\`

> **Principe fondamental :** La securite des conteneurs est une approche en couches (defense in depth). Aucune mesure seule n'est suffisante. Combinez image minimale + non-root + capabilities reduites + scan de vulnerabilites + reseaux isoles + limites de ressources.`
      }
    ]
  },
  {
    id: 118,
    slug: 'docker-production',
    title: 'Docker en Production',
    subtitle: 'Deployer et operer des conteneurs Docker de maniere fiable en production',
    icon: 'Server',
    color: '#10b981',
    duration: '40 min',
    level: 'Avance',
    videoId: 'JHjYZyUNAFg',
    sections: [
      {
        title: 'Healthchecks en production',
        content: `Les **healthchecks** permettent a Docker et aux orchestrateurs de detecter automatiquement les conteneurs en mauvaise sante et de les remplacer.

### Healthcheck dans le Dockerfile

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
\`\`\`

### Parametres du healthcheck

| Parametre | Description | Valeur recommandee |
|-----------|-------------|-------------------|
| \`--interval\` | Frequence des verifications | 15-30s |
| \`--timeout\` | Temps max pour repondre | 3-5s |
| \`--start-period\` | Grace period au demarrage | 10-60s (selon l'app) |
| \`--retries\` | Echecs avant "unhealthy" | 3-5 |

### Healthcheck dans docker-compose.yml

\`\`\`yaml
services:
  api:
    build: .
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

  database:
    image: mysql:8.0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
\`\`\`

### Etats de sante

\`\`\`bash
# Voir l'etat de sante
docker inspect --format='{{.State.Health.Status}}' mon-conteneur
# starting | healthy | unhealthy

# Voir le detail des checks
docker inspect --format='{{json .State.Health}}' mon-conteneur | jq

# Dans docker ps
docker ps
# CONTAINER ID  IMAGE     STATUS                    PORTS
# abc123        mon-app   Up 5 min (healthy)        0.0.0.0:3000->3000/tcp
# def456        mon-app   Up 2 min (unhealthy)      0.0.0.0:3001->3000/tcp
\`\`\`

### Endpoint /health robuste

\`\`\`javascript
// server.js — endpoint de sante complet
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: 'unknown',
    redis: 'unknown',
  };

  try {
    // Verifier la connexion DB
    await db.query('SELECT 1');
    checks.database = 'connected';
  } catch (e) {
    checks.database = 'disconnected';
  }

  try {
    // Verifier Redis
    await redis.ping();
    checks.redis = 'connected';
  } catch (e) {
    checks.redis = 'disconnected';
  }

  const isHealthy = checks.database === 'connected';
  res.status(isHealthy ? 200 : 503).json(checks);
});
\`\`\`

> **En production :** Le healthcheck doit verifier les dependances critiques (base de donnees, cache). Un conteneur "unhealthy" sera automatiquement remplace par Docker Swarm ou Kubernetes.`
      },
      {
        title: 'Restart policies et logging drivers',
        content: `Les politiques de redemarrage et les drivers de logs sont essentiels pour un fonctionnement fiable et observable en production.

### Restart policies

\`\`\`bash
# Toujours redemarrer (recommande en production)
docker run -d --restart=always --name api mon-api:latest

# Redemarrer sauf si arrete manuellement
docker run -d --restart=unless-stopped --name api mon-api:latest

# Redemarrer en cas d'erreur (avec limite)
docker run -d --restart=on-failure:5 --name worker mon-worker:latest
# Maximum 5 tentatives de redemarrage
\`\`\`

| Politique | Docker stop | Crash | Reboot serveur |
|-----------|------------|-------|----------------|
| \`no\` | Reste arrete | Reste arrete | Reste arrete |
| \`always\` | Redemarre | Redemarre | Redemarre |
| \`unless-stopped\` | Reste arrete | Redemarre | Reste arrete |
| \`on-failure[:max]\` | Reste arrete | Redemarre (max tentatives) | Reste arrete |

### Logging drivers

Docker supporte plusieurs backends pour les logs des conteneurs.

\`\`\`bash
# Voir le driver par defaut
docker info | grep "Logging Driver"
# Logging Driver: json-file

# Changer le driver pour un conteneur
docker run -d --log-driver=syslog --log-opt syslog-address=udp://logserver:514 mon-app

# Changer le driver par defaut (daemon.json)
\`\`\`

\`\`\`json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "5",
    "compress": "true"
  }
}
\`\`\`

### Drivers de logs disponibles

| Driver | Description | Cas d'usage |
|--------|-------------|-------------|
| **json-file** | Fichiers JSON locaux (defaut) | Dev, petite production |
| **syslog** | Envoie vers syslog | Integration rsyslog |
| **journald** | Envoie vers journald | Systemes systemd |
| **fluentd** | Envoie vers Fluentd | Stack de logs avancee |
| **awslogs** | Amazon CloudWatch | AWS |
| **gcplogs** | Google Cloud Logging | GCP |
| **none** | Pas de logs | Quand les logs sont geres par l'app |

### Configuration par service (docker-compose)

\`\`\`yaml
services:
  api:
    image: mon-api:latest
    restart: always
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
        tag: "api-{{.Name}}"

  worker:
    image: mon-worker:latest
    restart: on-failure
    logging:
      driver: json-file
      options:
        max-size: "5m"
        max-file: "3"
\`\`\`

### Gestion des logs en production

\`\`\`bash
# Voir les logs avec timestamps
docker logs --timestamps mon-conteneur

# Suivre les logs depuis 1 heure
docker logs --since "1h" -f mon-conteneur

# Trouver ou sont stockes les logs
docker inspect --format='{{.LogPath}}' mon-conteneur
# /var/lib/docker/containers/<id>/<id>-json.log

# Taille des logs d'un conteneur
ls -lh $(docker inspect --format='{{.LogPath}}' mon-conteneur)
\`\`\`

> **IMPORTANT :** Sans limites de taille (\`max-size\`, \`max-file\`), les logs Docker peuvent remplir le disque. Configurez TOUJOURS des limites dans \`daemon.json\` ou par conteneur.`
      },
      {
        title: 'Limites de ressources',
        content: `Limiter les ressources (CPU, memoire) des conteneurs previent les situations ou un conteneur consomme toutes les ressources du serveur et impacte les autres services.

### Limites memoire

\`\`\`bash
# Limiter la memoire RAM
docker run -d --memory=512m --name api mon-api:latest

# Limiter RAM + swap
docker run -d --memory=512m --memory-swap=1g --name api mon-api:latest
# 512 Mo de RAM + 512 Mo de swap = 1 Go total

# Desactiver le swap pour un conteneur
docker run -d --memory=512m --memory-swap=512m --name api mon-api:latest

# Reservation (soft limit)
docker run -d --memory=512m --memory-reservation=256m --name api mon-api:latest
\`\`\`

### Que se passe-t-il quand la limite est atteinte ?

\`\`\`bash
# Si un conteneur depasse sa limite memoire :
# → Le noyau Linux tue le processus (OOM Killer)
# → Docker marque le conteneur comme "OOMKilled"

# Verifier si un conteneur a ete tue par l'OOM
docker inspect --format='{{.State.OOMKilled}}' mon-conteneur
# true = le conteneur a ete tue pour depassement memoire
\`\`\`

### Limites CPU

\`\`\`bash
# Limiter a 1.5 coeurs CPU
docker run -d --cpus=1.5 --name api mon-api:latest

# Partage CPU relatif (poids)
docker run -d --cpu-shares=512 --name api1 mon-api:latest    # Poids faible
docker run -d --cpu-shares=1024 --name api2 mon-api:latest   # Poids normal
# api2 recoit 2x plus de CPU que api1 quand les deux sont charges

# Epingler sur des coeurs specifiques
docker run -d --cpuset-cpus="0,1" --name api mon-api:latest  # Coeurs 0 et 1

# Limiter les I/O disque
docker run -d --device-write-bps /dev/sda:10mb --name api mon-api:latest
\`\`\`

### Configuration dans docker-compose

\`\`\`yaml
services:
  api:
    image: mon-api:latest
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 128M

  database:
    image: mysql:8.0
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 2G
        reservations:
          cpus: "0.5"
          memory: 512M

  redis:
    image: redis:7-alpine
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
\`\`\`

### Monitoring des ressources

\`\`\`bash
# Stats en temps reel de tous les conteneurs
docker stats
# CONTAINER ID  NAME   CPU %  MEM USAGE / LIMIT   MEM %  NET I/O        BLOCK I/O
# abc123        api    12.5%  245MiB / 512MiB      47.8%  1.2MB / 500kB  50MB / 10MB
# def456        db     5.2%   1.1GiB / 2GiB        55.0%  800kB / 1.5MB  200MB / 50MB

# Stats d'un conteneur specifique
docker stats --no-stream api

# Format personnalise
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
\`\`\`

### Calcul des limites recommandees

| Service | CPU | RAM | Justification |
|---------|-----|-----|---------------|
| API Node.js | 0.5-2 | 256-512 Mo | Single-thread, memoire moderee |
| API Python (Gunicorn 4w) | 2-4 | 512M-1G | 1 worker par coeur |
| MySQL | 2-4 | 2-4 Go | Buffer pool = 70% de la RAM |
| Redis | 0.5-1 | 256M-1G | Selon la taille du dataset |
| Nginx | 0.5-1 | 128-256 Mo | Leger, event-driven |

> **Regle de production :** Definissez TOUJOURS des limites de ressources en production. Un conteneur sans limite peut consommer toute la RAM du serveur et causer un OOM qui tue d'autres services.`
      },
      {
        title: 'Introduction a Docker Swarm',
        content: `**Docker Swarm** est l'orchestrateur de conteneurs integre a Docker. Il permet de deployer des applications sur un **cluster** de machines avec haute disponibilite et scaling automatique.

### Architecture Swarm

\`\`\`
                    Docker Swarm Cluster
┌─────────────────────────────────────────────────┐
│                                                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │  Manager  │  │  Manager  │  │  Manager  │   │
│  │  (leader) │  │ (follower)│  │ (follower)│   │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘   │
│        │               │               │         │
│  ┌─────┼───────────────┼───────────────┼─────┐   │
│  │     │    Raft Consensus Protocol    │     │   │
│  └─────┼───────────────┼───────────────┼─────┘   │
│        │               │               │         │
│  ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐   │
│  │  Worker   │  │  Worker   │  │  Worker   │   │
│  │ ┌───┐┌───┐│  │ ┌───┐┌───┐│  │ ┌───┐┌───┐│   │
│  │ │api││api││  │ │api││db ││  │ │api││web││   │
│  │ └───┘└───┘│  │ └───┘└───┘│  │ └───┘└───┘│   │
│  └───────────┘  └───────────┘  └───────────┘   │
└─────────────────────────────────────────────────┘
\`\`\`

### Initialiser un Swarm

\`\`\`bash
# Sur le premier manager
docker swarm init --advertise-addr 10.0.0.1

# Recuperer le token pour ajouter des workers
docker swarm join-token worker
# docker swarm join --token SWMTKN-xxx 10.0.0.1:2377

# Recuperer le token pour ajouter des managers
docker swarm join-token manager

# Sur les autres noeuds
docker swarm join --token SWMTKN-xxx 10.0.0.1:2377

# Voir les noeuds du cluster
docker node ls
\`\`\`

### Deployer un service

\`\`\`bash
# Creer un service avec 3 replicas
docker service create \\
  --name api \\
  --replicas 3 \\
  --publish 3000:3000 \\
  --update-delay 10s \\
  --update-parallelism 1 \\
  --restart-condition on-failure \\
  mon-api:v2.3.1

# Lister les services
docker service ls

# Voir les taches (conteneurs) d'un service
docker service ps api

# Scaler un service
docker service scale api=5

# Mettre a jour l'image (rolling update)
docker service update --image mon-api:v2.4.0 api

# Rollback
docker service update --rollback api

# Supprimer un service
docker service rm api
\`\`\`

### Docker Stack (Compose pour Swarm)

\`\`\`yaml
# stack.yml
version: "3.8"
services:
  api:
    image: ghcr.io/org/api:v2.3.1
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
    ports:
      - "3000:3000"
    networks:
      - app-net

  database:
    image: mysql:8.0
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager          # Seulement sur les managers
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-net

networks:
  app-net:
    driver: overlay

volumes:
  db-data:
\`\`\`

\`\`\`bash
# Deployer la stack
docker stack deploy -c stack.yml mon-app

# Lister les stacks
docker stack ls

# Services de la stack
docker stack services mon-app

# Supprimer la stack
docker stack rm mon-app
\`\`\`

### Swarm vs Kubernetes

| Critere | Docker Swarm | Kubernetes |
|---------|-------------|------------|
| **Complexite** | Simple (integre a Docker) | Complexe (ecosysteme vaste) |
| **Setup** | 1 commande (\`swarm init\`) | Plusieurs composants a installer |
| **Scaling** | \`docker service scale\` | \`kubectl scale\` |
| **Ecosysteme** | Limite | Tres vaste (Helm, Operators...) |
| **Production** | Petites-moyennes infras | Grandes infras |
| **Communaute** | En declin | Dominant |

> **Docker Swarm en 2026 :** Swarm reste pertinent pour les petites infrastructures ou la simplicite est prioritaire. Pour les grandes infrastructures, Kubernetes est le standard de l'industrie. Swarm est un excellent tremplin pour apprendre l'orchestration avant d'aborder Kubernetes.`
      }
    ]
  }
]
