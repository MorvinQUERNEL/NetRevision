import type { Chapter } from '../chapters'

export const chapters: Chapter[] = [
  {
    id: 119,
    slug: 'kubernetes-architecture',
    title: 'Architecture Kubernetes',
    subtitle: 'Comprendre les composants master et worker, le plan de controle et kubectl',
    icon: 'Network',
    color: '#ef4444',
    duration: '45 min',
    level: 'Avance',
    videoId: 'PlraENp_bMk',
    sections: [
      {
        title: 'Introduction a Kubernetes',
        content: `**Kubernetes** (souvent abrege **K8s**) est une plateforme open-source d'orchestration de conteneurs, initialement concue par Google et aujourd'hui maintenue par la **CNCF** (Cloud Native Computing Foundation). Son nom vient du grec et signifie "timonier" ou "pilote" — une metaphore parfaite pour un systeme qui pilote vos conteneurs en production.

### Pourquoi Kubernetes ?

Lorsque vous passez de quelques conteneurs Docker a des dizaines, voire des centaines de services, la gestion manuelle devient impossible. Kubernetes resout les problemes suivants :

- **Deploiement automatise** : plus besoin de SSH sur chaque serveur, K8s deploie vos conteneurs de maniere declarative
- **Self-healing** : si un conteneur tombe, Kubernetes le redemarre automatiquement
- **Scaling horizontal** : ajoutez ou retirez des replicas en une commande ou automatiquement selon la charge
- **Service discovery** : les services se trouvent mutuellement via un DNS interne
- **Rolling updates** : mettez a jour vos applications sans downtime

### Docker Compose vs Kubernetes

| Critere | Docker Compose | Kubernetes |
|---------|----------------|------------|
| **Scope** | Machine unique | Cluster multi-noeuds |
| **Self-healing** | Non | Oui (redemarrage auto) |
| **Scaling** | Manuel | Automatique (HPA) |
| **Rolling updates** | Non natif | Natif |
| **Production** | Dev/staging | Production a grande echelle |

### Ecosysteme Kubernetes

L'ecosysteme K8s est vaste. Les distributions les plus populaires incluent :

\`\`\`
Distributions managees (Cloud)     Distributions on-premise
──────────────────────────────     ────────────────────────
AWS EKS                            kubeadm (vanilla K8s)
Azure AKS                          Rancher (RKE/RKE2)
Google GKE                         k3s (Rancher, leger)
                                   OpenShift (Red Hat)
\`\`\`

> **Conseil :** Pour apprendre, utilisez **minikube** ou **kind** (Kubernetes in Docker) sur votre machine locale. En production, preferez un service manage (EKS, AKS, GKE) qui gere le Control Plane pour vous.

### Installation locale avec minikube

\`\`\`bash
# Installer minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Demarrer un cluster local
minikube start --driver=docker --cpus=2 --memory=4096

# Verifier que le cluster est fonctionnel
kubectl cluster-info
kubectl get nodes
\`\`\`

Kubernetes est devenu le standard de facto pour l'orchestration de conteneurs en production. Comprendre son architecture est essentiel pour tout ingenieur DevOps ou SRE.`
      },
      {
        title: 'Architecture (Master/Worker nodes)',
        content: `L'architecture Kubernetes repose sur un modele **master/worker** (ou **control plane/data plane**). Le cluster est compose de deux types de noeuds aux roles distincts.

### Vue d'ensemble de l'architecture

\`\`\`
┌──────────────────────────────────────────────────────┐
│                    CLUSTER K8S                        │
│                                                       │
│  ┌─────────────────────┐   ┌───────────────────────┐ │
│  │    CONTROL PLANE     │   │     WORKER NODE 1     │ │
│  │    (Master Node)     │   │                       │ │
│  │                      │   │  ┌─────┐  ┌─────┐    │ │
│  │  API Server          │   │  │Pod A│  │Pod B│    │ │
│  │  etcd                │   │  └─────┘  └─────┘    │ │
│  │  Scheduler           │   │  kubelet              │ │
│  │  Controller Manager  │   │  kube-proxy           │ │
│  └─────────────────────┘   │  container runtime    │ │
│                             └───────────────────────┘ │
│  ┌───────────────────────┐                            │
│  │     WORKER NODE 2     │                            │
│  │                       │                            │
│  │  ┌─────┐  ┌─────┐    │                            │
│  │  │Pod C│  │Pod D│    │                            │
│  │  └─────┘  └─────┘    │                            │
│  │  kubelet              │                            │
│  │  kube-proxy           │                            │
│  │  container runtime    │                            │
│  └───────────────────────┘                            │
└──────────────────────────────────────────────────────┘
\`\`\`

### Le Control Plane (Master)

Le Control Plane est responsable de l'etat desire du cluster. Il prend les decisions globales : ou placer les pods, quand les redemarrer, comment router le trafic. En production, le Control Plane est generalement deploye en **haute disponibilite** (3 ou 5 noeuds master).

Les composants du Control Plane ne doivent **jamais** executer de workloads applicatifs (sauf dans un cluster de dev).

### Les Worker Nodes

Les Worker Nodes executent les charges de travail (vos applications). Chaque Worker possede :

- Un **kubelet** : agent qui communique avec l'API Server
- Un **kube-proxy** : gere les regles reseau (iptables/IPVS)
- Un **container runtime** : Docker, containerd, ou CRI-O

### Communication entre les composants

Toute communication dans le cluster passe par l'**API Server**. Le kubelet de chaque worker interroge l'API Server pour savoir quels pods il doit executer. Le Scheduler decide sur quel noeud placer un nouveau pod. Le Controller Manager verifie en permanence que l'etat reel correspond a l'etat desire.

> **Important :** Dans les services manages (EKS, AKS, GKE), le Control Plane est gere par le cloud provider. Vous ne voyez et ne gerez que les Worker Nodes. C'est un avantage majeur : pas besoin de maintenir etcd, l'API Server, etc.

### Haute disponibilite du Control Plane

En production, le Control Plane doit etre replique sur **au minimum 3 noeuds** (nombre impair pour le quorum etcd). Chaque composant peut etre redondant sauf etcd qui utilise le protocole **Raft** pour l'election de leader.`
      },
      {
        title: 'Composants du Control Plane (API Server/etcd/Scheduler/Controller Manager)',
        content: `Le Control Plane est compose de quatre composants principaux. Chacun a un role precis et critique pour le fonctionnement du cluster.

### kube-apiserver

L'**API Server** est le point d'entree unique du cluster. Toute interaction — que ce soit via \`kubectl\`, un dashboard, ou un autre composant — passe par l'API Server via des appels REST.

\`\`\`bash
# Toute commande kubectl appelle l'API Server
kubectl get pods
# Equivalent a : GET https://<api-server>:6443/api/v1/namespaces/default/pods

# Verifier la sante de l'API Server
kubectl get componentstatuses
\`\`\`

Fonctions principales :
- **Authentification et autorisation** (RBAC) de chaque requete
- **Validation** des manifestes YAML/JSON
- **Persistence** des objets dans etcd
- **Notification** des autres composants via le mecanisme de watch

### etcd

**etcd** est une base de donnees cle-valeur distribuee qui stocke **tout l'etat du cluster** : deployments, services, secrets, configmaps, etc. C'est le composant le plus critique.

\`\`\`yaml
# Exemple de donnee stockee dans etcd
# /registry/deployments/default/nginx-deployment
{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": { "name": "nginx-deployment" },
  "spec": { "replicas": 3 }
}
\`\`\`

- Utilise le protocole **Raft** pour la consensus distribue
- Doit etre sauvegarde regulierement (\`etcdctl snapshot save\`)
- En production : 3 ou 5 instances (nombre impair obligatoire)
- **Seul l'API Server communique directement avec etcd**

### kube-scheduler

Le **Scheduler** decide sur quel noeud placer un pod nouvellement cree. Il applique un algorithme en deux phases :

1. **Filtrage** : elimine les noeuds qui ne respectent pas les contraintes (resources insuffisantes, taints, affinites)
2. **Scoring** : classe les noeuds restants selon des criteres (repartition de charge, localite des donnees)

\`\`\`yaml
# Influencer le scheduling avec des resources requests
spec:
  containers:
  - name: app
    resources:
      requests:
        cpu: "500m"     # Le scheduler reserve 0.5 CPU
        memory: "256Mi" # et 256 Mo de RAM
\`\`\`

### kube-controller-manager

Le **Controller Manager** execute en boucle des controleurs qui surveillent l'etat du cluster et agissent pour atteindre l'etat desire :

- **ReplicaSet Controller** : maintient le nombre de replicas desire
- **Deployment Controller** : gere les rolling updates
- **Node Controller** : detecte les noeuds en panne (heartbeat toutes les 10s)
- **Job Controller** : gere les jobs batch (CronJob, Job)
- **ServiceAccount Controller** : cree les comptes de service par defaut

> **Concept cle — Boucle de reconciliation :** Chaque controleur compare en permanence l'etat **desire** (dans etcd) avec l'etat **actuel** (dans le cluster) et effectue des actions pour les aligner. C'est le coeur du modele declaratif de Kubernetes.`
      },
      {
        title: 'Composants des Workers (kubelet/kube-proxy/container runtime)',
        content: `Chaque Worker Node execute trois composants essentiels qui permettent l'execution et la mise en reseau des pods.

### kubelet

Le **kubelet** est l'agent qui tourne sur chaque noeud worker. Il est responsable de :

- Recevoir les specifications de pods depuis l'API Server
- S'assurer que les conteneurs decrits dans les PodSpecs sont en cours d'execution
- Reporter l'etat du noeud et des pods a l'API Server
- Executer les **liveness probes** et **readiness probes**

\`\`\`yaml
# Exemple de probes configurees dans un pod
spec:
  containers:
  - name: app
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
\`\`\`

- **livenessProbe** : si elle echoue, le kubelet redemarre le conteneur
- **readinessProbe** : si elle echoue, le pod est retire du service (plus de trafic)
- **startupProbe** : pour les applications lentes a demarrer

Le kubelet communique avec le container runtime via l'interface **CRI** (Container Runtime Interface).

### kube-proxy

Le **kube-proxy** gere les regles reseau sur chaque noeud. Il permet aux Services Kubernetes de fonctionner en routant le trafic vers les bons pods.

\`\`\`
Client → Service (ClusterIP) → kube-proxy → Pod
                                    │
                               iptables ou IPVS
                               (regles de routage)
\`\`\`

Trois modes de fonctionnement :

| Mode | Description | Performance |
|------|-------------|-------------|
| **iptables** (defaut) | Regles iptables pour chaque service | Bon jusqu'a ~5000 services |
| **IPVS** | Utilise le load balancer kernel Linux | Excellent pour clusters larges |
| **userspace** | Legacy, tout passe par le processus kube-proxy | Deconseille |

### Container Runtime

Le container runtime est le logiciel qui execute effectivement les conteneurs. Kubernetes supporte tout runtime compatible **CRI** :

- **containerd** : le plus utilise, stable, leger (utilise par Docker en interne)
- **CRI-O** : optimise pour Kubernetes, utilise par OpenShift
- **Docker** : supporte via le shim dockershim (deprecie depuis K8s 1.24)

\`\`\`bash
# Verifier le runtime utilise sur un noeud
kubectl get nodes -o wide
# La colonne CONTAINER-RUNTIME indique le runtime
# Exemple : containerd://1.7.2

# Verifier les images presentes sur un noeud
crictl images
\`\`\`

> **Note historique :** Depuis Kubernetes 1.24, Docker n'est plus supporte directement comme container runtime. Les images Docker restent compatibles (elles respectent le standard OCI), mais le daemon Docker n'est plus necessaire sur les noeuds. La plupart des clusters utilisent desormais **containerd** directement.`
      },
      {
        title: 'kubectl et kubeconfig',
        content: `**kubectl** est l'outil en ligne de commande pour interagir avec un cluster Kubernetes. C'est l'interface principale pour les administrateurs et les developpeurs.

### Installation de kubectl

\`\`\`bash
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# macOS (Homebrew)
brew install kubectl

# Verifier l'installation
kubectl version --client
\`\`\`

### Le fichier kubeconfig

Le fichier **kubeconfig** (par defaut \`~/.kube/config\`) contient les informations de connexion au cluster. Il definit trois elements :

\`\`\`yaml
# Structure du kubeconfig
apiVersion: v1
kind: Config
current-context: my-cluster

clusters:
- name: my-cluster
  cluster:
    server: https://api.my-cluster.example.com:6443
    certificate-authority-data: LS0tLS1C...

users:
- name: admin
  user:
    client-certificate-data: LS0tLS1C...
    client-key-data: LS0tLS1C...

contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: admin
    namespace: default
\`\`\`

- **clusters** : les adresses des API Servers
- **users** : les identifiants d'authentification
- **contexts** : associe un cluster, un user et un namespace par defaut

### Commandes kubectl essentielles

\`\`\`bash
# Gestion des contexts
kubectl config get-contexts          # Lister les contexts
kubectl config use-context staging   # Changer de context
kubectl config set-context --current --namespace=prod  # Changer namespace

# Operations CRUD
kubectl get pods                     # Lister les pods
kubectl get pods -o wide             # Avec plus de details (noeud, IP)
kubectl get all                      # Tous les objets du namespace
kubectl describe pod my-pod          # Details complets d'un pod
kubectl logs my-pod                  # Voir les logs
kubectl logs my-pod -f               # Suivre les logs en temps reel
kubectl exec -it my-pod -- /bin/sh   # Shell interactif dans un pod
kubectl delete pod my-pod            # Supprimer un pod

# Appliquer des manifestes
kubectl apply -f deployment.yaml     # Creer/mettre a jour
kubectl diff -f deployment.yaml      # Voir les differences avant apply
kubectl delete -f deployment.yaml    # Supprimer les ressources
\`\`\`

### Alias et autocompletion

\`\`\`bash
# Ajouter l'autocompletion (bash)
echo 'source <(kubectl completion bash)' >> ~/.bashrc

# Alias courants
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kga='kubectl get all'
alias kaf='kubectl apply -f'
\`\`\`

> **Bonne pratique :** Utilisez toujours \`kubectl apply -f\` plutot que \`kubectl create\`. La commande \`apply\` est idempotente : elle cree l'objet s'il n'existe pas et le met a jour sinon. C'est l'approche declarative recommandee par Kubernetes.`
      }
    ]
  },
  {
    id: 120,
    slug: 'pods-deployments-services',
    title: 'Pods, Deployments & Services',
    subtitle: 'Les objets fondamentaux de Kubernetes pour deployer et exposer vos applications',
    icon: 'Boxes',
    color: '#ef4444',
    duration: '50 min',
    level: 'Avance',
    videoId: 'AFEU_mBbzr0',
    sections: [
      {
        title: 'Les Pods (unite de base)',
        content: `Le **Pod** est l'unite de deploiement la plus petite dans Kubernetes. Un Pod encapsule un ou plusieurs conteneurs qui partagent le meme espace reseau et le meme stockage.

### Anatomie d'un Pod

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
    env: production
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "256Mi"
\`\`\`

### Caracteristiques cles des Pods

- **Ephemere** : un Pod peut etre detruit et recree a tout moment. Ne stockez jamais de donnees critiques dans un Pod sans volume persistant
- **IP unique** : chaque Pod recoit une IP dans le reseau interne du cluster. Cette IP change si le Pod est recree
- **Conteneurs co-localises** : les conteneurs d'un meme Pod partagent \`localhost\` et peuvent communiquer via les ports
- **Volumes partages** : les conteneurs d'un Pod peuvent monter les memes volumes

### Cycle de vie d'un Pod

\`\`\`
Pending → Running → Succeeded/Failed
            ↓
        CrashLoopBackOff (redemarrage en boucle)
\`\`\`

| Phase | Description |
|-------|-------------|
| **Pending** | Le Pod est accepte mais les conteneurs ne sont pas encore demarres |
| **Running** | Au moins un conteneur est en cours d'execution |
| **Succeeded** | Tous les conteneurs se sont termines avec succes |
| **Failed** | Au moins un conteneur s'est termine avec une erreur |
| **Unknown** | L'etat du Pod ne peut pas etre determine (noeud injoignable) |

### Multi-container Pods (Sidecar pattern)

Un Pod peut contenir plusieurs conteneurs qui cooperent :

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:v1
    ports:
    - containerPort: 8080
  - name: log-shipper       # Sidecar
    image: fluentd:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  volumes:
  - name: logs
    emptyDir: {}
\`\`\`

Les patterns multi-conteneurs courants :
- **Sidecar** : ajoute une fonctionnalite (logs, monitoring, proxy)
- **Ambassador** : proxy vers des services externes
- **Adapter** : transforme la sortie du conteneur principal

> **Regle d'or :** Ne creez jamais de Pods directement en production. Utilisez toujours un **Deployment** ou un **StatefulSet** qui gere les Pods pour vous (self-healing, rolling updates, scaling).`
      },
      {
        title: 'ReplicaSets et Deployments',
        content: `Les **ReplicaSets** et **Deployments** sont les objets qui gerent le cycle de vie des Pods en production.

### ReplicaSet

Un **ReplicaSet** garantit qu'un nombre specifie de replicas d'un Pod est en cours d'execution a tout moment. Si un Pod tombe, le ReplicaSet en cree un nouveau.

\`\`\`yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
\`\`\`

En pratique, on ne cree **jamais** un ReplicaSet directement. On utilise un **Deployment** qui cree et gere les ReplicaSets pour nous.

### Deployment

Le **Deployment** est l'objet le plus utilise pour deployer des applications stateless. Il gere les ReplicaSets et permet les rolling updates, les rollbacks, et le scaling.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # 1 pod en plus pendant l'update
      maxUnavailable: 0   # 0 pod en moins (zero downtime)
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
\`\`\`

### Operations courantes sur les Deployments

\`\`\`bash
# Deployer
kubectl apply -f deployment.yaml

# Verifier l'etat du rollout
kubectl rollout status deployment/nginx-deployment

# Mettre a jour l'image (declenche un rolling update)
kubectl set image deployment/nginx-deployment nginx=nginx:1.26

# Historique des rollouts
kubectl rollout history deployment/nginx-deployment

# Rollback a la version precedente
kubectl rollout undo deployment/nginx-deployment

# Rollback a une revision specifique
kubectl rollout undo deployment/nginx-deployment --to-revision=2

# Scaler manuellement
kubectl scale deployment/nginx-deployment --replicas=5
\`\`\`

### Strategies de deploiement

| Strategie | Description | Downtime |
|-----------|-------------|----------|
| **RollingUpdate** (defaut) | Remplace progressivement les pods | Non |
| **Recreate** | Detruit tous les pods avant d'en creer de nouveaux | Oui |

> **Bonne pratique :** Configurez \`maxSurge: 1\` et \`maxUnavailable: 0\` pour un deploiement zero-downtime. Cela garantit qu'au moins le nombre desire de pods est toujours disponible pendant la mise a jour.`
      },
      {
        title: 'Services (ClusterIP/NodePort/LoadBalancer)',
        content: `Un **Service** Kubernetes fournit une adresse reseau stable pour acceder a un ensemble de Pods. Comme les Pods sont ephemeres et changent d'IP, le Service agit comme un load balancer interne.

### Types de Services

\`\`\`
                Internet
                   │
            ┌──────┴──────┐
            │ LoadBalancer │  ← Cloud provider (AWS ELB, etc.)
            └──────┬──────┘
                   │
            ┌──────┴──────┐
            │   NodePort   │  ← Port ouvert sur chaque noeud (30000-32767)
            └──────┬──────┘
                   │
            ┌──────┴──────┐
            │  ClusterIP   │  ← IP interne, accessible uniquement dans le cluster
            └──────┬──────┘
                   │
              ┌────┼────┐
              │    │    │
            Pod1 Pod2 Pod3
\`\`\`

### ClusterIP (defaut)

Accessible uniquement **a l'interieur du cluster**. Ideal pour la communication inter-services.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP       # Type par defaut
  selector:
    app: backend
  ports:
  - port: 80            # Port du Service
    targetPort: 8080    # Port du conteneur
\`\`\`

Les autres pods accedent au service via : \`http://backend-service.default.svc.cluster.local:80\` ou simplement \`http://backend-service:80\` dans le meme namespace.

### NodePort

Expose le service sur un port statique de chaque noeud du cluster (plage 30000-32767).

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
    nodePort: 30080     # Optionnel, auto-attribue si omis
\`\`\`

Accessible via \`http://<node-ip>:30080\` depuis l'exterieur.

### LoadBalancer

Provisionne un load balancer externe via le cloud provider. C'est le moyen le plus simple d'exposer un service sur Internet.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
\`\`\`

\`\`\`bash
# Voir l'IP externe attribuee
kubectl get svc web-service
# NAME          TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)
# web-service   LoadBalancer   10.96.0.15    34.123.45.67    80:31234/TCP
\`\`\`

> **Attention cout :** Chaque Service de type LoadBalancer cree un load balancer cloud (AWS ELB ~18$/mois). Pour exposer plusieurs services, preferez un **Ingress Controller** (chapitre suivant) qui mutualise un seul load balancer pour toutes vos routes.`
      },
      {
        title: 'Labels et Selectors',
        content: `Les **Labels** et **Selectors** sont le mecanisme fondamental de Kubernetes pour organiser et selectionner des objets. Ils sont utilises partout : Services, Deployments, Network Policies, etc.

### Labels

Un **label** est une paire cle/valeur attachee a un objet Kubernetes. Les labels n'ont pas de semantique intrinseque pour K8s — c'est vous qui definissez leur signification.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-server
  labels:
    app: api
    env: production
    team: backend
    version: v2.1.0
spec:
  containers:
  - name: api
    image: my-api:2.1.0
\`\`\`

Conventions de nommage courantes :

| Label | Valeurs typiques | Usage |
|-------|------------------|-------|
| \`app\` | api, frontend, worker | Identifier l'application |
| \`env\` | dev, staging, production | Environnement |
| \`tier\` | frontend, backend, database | Couche architecturale |
| \`version\` | v1.0, v2.1.0 | Version de l'application |
| \`team\` | backend, infra, data | Equipe proprietaire |

### Selectors

Les **selectors** permettent de filtrer les objets par leurs labels. Deux syntaxes existent :

\`\`\`bash
# Selector d'egalite
kubectl get pods -l app=api
kubectl get pods -l env=production
kubectl get pods -l app=api,env=production  # ET logique

# Selector d'ensemble (set-based)
kubectl get pods -l 'env in (production, staging)'
kubectl get pods -l 'env notin (dev)'
kubectl get pods -l 'app, !canary'    # a le label app, n'a pas canary
\`\`\`

### Selectors dans les manifestes

Les Services et Deployments utilisent les selectors pour cibler les bons Pods :

\`\`\`yaml
# Le Service route le trafic vers les pods
# qui ont TOUS les labels du selector
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api           # Match les pods avec app=api
    env: production    # ET env=production
  ports:
  - port: 80
    targetPort: 8080
\`\`\`

### Labels recommandes par Kubernetes

Kubernetes definit un ensemble de labels standardises :

\`\`\`yaml
metadata:
  labels:
    app.kubernetes.io/name: nginx
    app.kubernetes.io/version: "1.25"
    app.kubernetes.io/component: frontend
    app.kubernetes.io/part-of: my-app
    app.kubernetes.io/managed-by: helm
\`\`\`

> **Bonne pratique :** Definissez une convention de labelling des la creation du cluster et appliquez-la rigoureusement. Les labels sont essentiels pour le monitoring, le networking (Network Policies) et la gestion des couts par equipe ou environnement. Sans bons labels, un cluster K8s devient rapidement ingerable.`
      },
      {
        title: 'Namespaces',
        content: `Les **Namespaces** sont un mecanisme de partitionnement logique au sein d'un cluster Kubernetes. Ils permettent d'isoler les ressources entre equipes, environnements ou projets.

### Namespaces par defaut

Tout cluster Kubernetes possede quatre namespaces pre-crees :

\`\`\`bash
kubectl get namespaces

# NAME              STATUS   AGE
# default           Active   1d    ← Namespace par defaut
# kube-system       Active   1d    ← Composants K8s (coredns, kube-proxy...)
# kube-public       Active   1d    ← Ressources accessibles a tous (rarement utilise)
# kube-node-lease   Active   1d    ← Heartbeats des noeuds
\`\`\`

### Creer et utiliser des Namespaces

\`\`\`yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  labels:
    env: staging
\`\`\`

\`\`\`bash
# Creer le namespace
kubectl apply -f namespace.yaml
# ou directement
kubectl create namespace staging

# Deployer dans un namespace
kubectl apply -f deployment.yaml -n staging

# Lister les pods d'un namespace
kubectl get pods -n staging

# Lister les pods de TOUS les namespaces
kubectl get pods --all-namespaces
# ou
kubectl get pods -A
\`\`\`

### Isolation par Namespace

Les namespaces fournissent plusieurs niveaux d'isolation :

| Type d'isolation | Mecanisme | Exemple |
|------------------|-----------|---------|
| **Noms** | Les noms d'objets sont uniques PAR namespace | Deux services "api" dans deux NS differents |
| **Ressources** | ResourceQuota limite CPU/RAM par namespace | Limiter staging a 4 CPU et 8 Go |
| **Acces** | RBAC restreint les permissions par namespace | L'equipe A ne voit que son namespace |
| **Reseau** | Network Policies isolent le trafic | Bloquer la communication entre namespaces |

### ResourceQuota

\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: staging-quota
  namespace: staging
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"
    services: "10"
\`\`\`

### LimitRange

Un **LimitRange** definit les valeurs par defaut et les limites pour chaque Pod dans un namespace :

\`\`\`yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: staging
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container
\`\`\`

### Communication entre Namespaces

Les services d'un namespace sont accessibles depuis un autre namespace via leur **FQDN** (Fully Qualified Domain Name) :

\`\`\`
<service-name>.<namespace>.svc.cluster.local
\`\`\`

\`\`\`bash
# Depuis le namespace "frontend", appeler le service "api" du namespace "backend"
curl http://api.backend.svc.cluster.local:8080/health
\`\`\`

> **Bonne pratique :** Utilisez les namespaces pour separer les environnements (dev, staging, production) ou les equipes. Combinez-les avec des **ResourceQuotas** pour eviter qu'un namespace consomme toutes les ressources du cluster, et des **Network Policies** pour isoler le trafic reseau.`
      }
    ]
  },
  {
    id: 121,
    slug: 'ingress-controllers',
    title: 'Ingress Controllers',
    subtitle: 'Gerer le trafic HTTP/HTTPS entrant avec Ingress et les certificats TLS',
    icon: 'Globe',
    color: '#ef4444',
    duration: '40 min',
    level: 'Avance',
    videoId: '',
    sections: [
      {
        title: "Concept d'Ingress",
        content: `Un **Ingress** est un objet Kubernetes qui gere l'acces HTTP/HTTPS externe vers les services du cluster. Il agit comme un reverse proxy intelligent qui route le trafic en fonction des regles definies (hostname, path).

### Pourquoi Ingress ?

Sans Ingress, chaque service expose sur Internet necessite un **LoadBalancer** dedie (un par service). Avec Ingress, un seul LoadBalancer suffit pour router le trafic vers tous vos services.

\`\`\`
Sans Ingress (couteux)              Avec Ingress (optimise)
──────────────────────              ───────────────────────
LB1 → Service A                    LB → Ingress Controller
LB2 → Service B                         ├── /api    → Service A
LB3 → Service C                         ├── /web    → Service B
(3 load balancers = $$$)                 └── /admin  → Service C
                                    (1 seul load balancer)
\`\`\`

### Architecture Ingress

L'Ingress fonctionne en deux parties :

1. **L'objet Ingress** : un manifeste YAML qui definit les regles de routage
2. **L'Ingress Controller** : le composant qui lit les regles et les applique (Nginx, Traefik, HAProxy, etc.)

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
\`\`\`

### Types de routage

| Type | Exemple | Description |
|------|---------|-------------|
| **Host-based** | api.example.com vs app.example.com | Route selon le hostname |
| **Path-based** | example.com/api vs example.com/web | Route selon le chemin URL |
| **Mixte** | api.example.com/v1 vs app.example.com/admin | Combine les deux |

### pathType

- **Prefix** : \`/api\` match \`/api\`, \`/api/users\`, \`/api/v1/users\`
- **Exact** : \`/api\` ne match que \`/api\` exactement
- **ImplementationSpecific** : le comportement depend de l'Ingress Controller

> **Important :** L'objet Ingress seul ne fait rien. Il necessite un **Ingress Controller** installe dans le cluster pour interpreter et appliquer les regles. Sans controleur, les regles Ingress sont ignorees.`
      },
      {
        title: 'Nginx Ingress Controller',
        content: `Le **Nginx Ingress Controller** est le controleur Ingress le plus populaire dans l'ecosysteme Kubernetes. Il utilise Nginx comme reverse proxy et load balancer.

### Installation avec Helm

\`\`\`bash
# Ajouter le repository Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Installer le controleur
helm install ingress-nginx ingress-nginx/ingress-nginx \\
  --namespace ingress-nginx \\
  --create-namespace \\
  --set controller.replicaCount=2

# Verifier l'installation
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
\`\`\`

### Fonctionnement interne

\`\`\`
Internet
   │
   ▼
LoadBalancer (cloud)
   │
   ▼
Ingress Controller (pod Nginx)
   │
   ├── Lit les objets Ingress via l'API Server
   ├── Genere la config nginx.conf dynamiquement
   └── Reload Nginx a chaque changement
   │
   ▼
Services K8s → Pods
\`\`\`

Le controleur surveille en permanence les objets Ingress dans le cluster. A chaque creation, modification ou suppression d'un Ingress, il regenere automatiquement la configuration Nginx et effectue un reload.

### Annotations utiles

Les annotations permettent de personnaliser le comportement du Nginx Ingress Controller :

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    # Rate limiting
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    # Taille max du body (upload)
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    # Redirections
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    # CORS
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://app.example.com"
    # Timeouts
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "300"
\`\`\`

### Alternatives au Nginx Ingress Controller

| Controleur | Points forts | Cas d'usage |
|------------|--------------|-------------|
| **Nginx** | Stable, tres populaire, bien documente | Usage general |
| **Traefik** | Auto-discovery, dashboard, Let's Encrypt natif | Clusters dynamiques |
| **HAProxy** | Performances TCP/HTTP elevees | Trafic haute performance |
| **Istio Gateway** | Integre au service mesh Istio | Architectures microservices avancees |
| **AWS ALB Ingress** | Integration native AWS | Clusters EKS |

> **Conseil :** Pour la plupart des cas, le Nginx Ingress Controller est un excellent choix. Si vous utilisez un service mesh comme Istio, preferez l'Istio Gateway qui s'integre mieux avec les fonctionnalites du mesh (mTLS, traffic splitting).`
      },
      {
        title: 'Configuration des regles Ingress',
        content: `La configuration des regles Ingress permet de definir precisement comment le trafic HTTP/HTTPS est route vers vos services.

### Routage par hostname

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-host-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
  - host: dashboard.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: dashboard-service
            port:
              number: 3000
\`\`\`

### Routage par chemin (path-based)

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-based-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /api(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: api-service
            port:
              number: 8080
      - path: /grafana(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: grafana-service
            port:
              number: 3000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
\`\`\`

L'annotation \`rewrite-target\` est cruciale pour le path-based routing. Sans elle, la requete \`/api/users\` serait transmise au backend avec le chemin \`/api/users\`. Avec le rewrite, seul \`/users\` est transmis.

### Default backend

Le **default backend** gere les requetes qui ne matchent aucune regle :

\`\`\`yaml
spec:
  defaultBackend:
    service:
      name: default-404-service
      port:
        number: 80
  rules:
  - host: api.example.com
    # ...
\`\`\`

### Exemples de configurations avancees

\`\`\`yaml
# Sticky sessions (affinite)
metadata:
  annotations:
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/affinity-mode: "persistent"
    nginx.ingress.kubernetes.io/session-cookie-name: "SERVERID"

# WebSocket support
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"

# Basic auth
metadata:
  annotations:
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: basic-auth-secret
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
\`\`\`

\`\`\`bash
# Verifier la configuration generee
kubectl get ingress
kubectl describe ingress multi-host-ingress

# Voir les logs du controleur
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
\`\`\`

> **Bonne pratique :** Ordonnez les regles de routage du plus specifique au plus general. Les regles \`Exact\` sont evaluees avant les regles \`Prefix\`. Pour le path-based routing, le chemin le plus long a la priorite.`
      },
      {
        title: 'TLS et certificats',
        content: `Configurer le **TLS** (HTTPS) sur un Ingress Kubernetes est essentiel pour securiser le trafic entre les clients et votre cluster.

### Principe du TLS termination

L'Ingress Controller effectue la **TLS termination** : il dechiffre le trafic HTTPS entrant et transmet le trafic en HTTP (clair) vers les services internes du cluster.

\`\`\`
Client (HTTPS) → Ingress Controller (TLS termination) → Service (HTTP) → Pod
    chiffre              dechiffre                         clair
\`\`\`

### Creer un Secret TLS

Le certificat et la cle privee sont stockes dans un **Secret** Kubernetes de type \`tls\` :

\`\`\`bash
# A partir de fichiers existants
kubectl create secret tls my-tls-secret \\
  --cert=fullchain.pem \\
  --key=privkey.pem \\
  -n default

# Verifier
kubectl get secret my-tls-secret
kubectl describe secret my-tls-secret
\`\`\`

### Configurer TLS dans l'Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    - app.example.com
    secretName: my-tls-secret     # Le Secret contenant cert + key
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 3000
\`\`\`

### TLS cote backend (end-to-end)

Pour chiffrer aussi le trafic entre l'Ingress Controller et les pods :

\`\`\`yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
\`\`\`

### Wildcard TLS

Un certificat wildcard couvre tous les sous-domaines :

\`\`\`yaml
tls:
- hosts:
  - "*.example.com"
  secretName: wildcard-tls-secret
\`\`\`

### Bonnes pratiques TLS

- Toujours activer \`ssl-redirect: "true"\` pour forcer HTTPS
- Utiliser des certificats **Let's Encrypt** gratuits via **cert-manager** (section suivante)
- Renouveler les certificats **avant** leur expiration (cert-manager le fait automatiquement)
- Utiliser des protocoles TLS modernes (TLS 1.2 minimum, TLS 1.3 recommande)
- Ne jamais stocker les cles privees en clair dans les manifestes (utiliser Sealed Secrets ou External Secrets)

> **Important :** Gerer les certificats manuellement est fastidieux et source d'erreurs (oubli de renouvellement = downtime). Utilisez **cert-manager** pour automatiser entierement le provisionnement et le renouvellement des certificats TLS.`
      },
      {
        title: 'Cert-manager',
        content: `**cert-manager** est un controleur Kubernetes qui automatise la gestion des certificats TLS. Il s'integre avec des autorites de certification (CA) comme **Let's Encrypt** pour provisionner et renouveler automatiquement les certificats.

### Installation de cert-manager

\`\`\`bash
# Installation avec kubectl
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# Ou avec Helm
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \\
  --namespace cert-manager \\
  --create-namespace \\
  --set crds.enabled=true

# Verifier l'installation
kubectl get pods -n cert-manager
\`\`\`

### Configurer un ClusterIssuer

Le **ClusterIssuer** definit comment cert-manager obtient les certificats. Pour Let's Encrypt :

\`\`\`yaml
# ClusterIssuer pour Let's Encrypt (production)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx

---
# ClusterIssuer pour Let's Encrypt (staging - pour tester)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
    - http01:
        ingress:
          class: nginx
\`\`\`

### Utiliser cert-manager avec un Ingress

Il suffit d'ajouter une annotation a l'Ingress pour que cert-manager genere automatiquement le certificat :

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls      # cert-manager cree ce Secret automatiquement
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
\`\`\`

### Verification et debug

\`\`\`bash
# Verifier les certificats
kubectl get certificates
kubectl describe certificate api-tls

# Verifier les challenges en cours
kubectl get challenges

# Verifier les ordres
kubectl get orders

# Logs cert-manager
kubectl logs -n cert-manager -l app=cert-manager
\`\`\`

### Flux de provisionnement automatique

\`\`\`
1. Ingress cree avec annotation cert-manager
2. cert-manager detecte l'annotation
3. Cree un objet Certificate
4. Lance un Challenge HTTP-01 (ou DNS-01)
5. Let's Encrypt valide le domaine
6. cert-manager stocke le certificat dans un Secret
7. L'Ingress Controller charge le certificat
8. Renouvellement automatique 30 jours avant expiration
\`\`\`

> **Bonne pratique :** Testez toujours avec le ClusterIssuer \`letsencrypt-staging\` avant de passer en production. Let's Encrypt a des rate limits stricts (50 certificats par domaine par semaine) et les depasser peut bloquer vos deployments pendant plusieurs jours.`
      }
    ]
  },
  {
    id: 122,
    slug: 'helm-charts',
    title: 'Helm Charts',
    subtitle: 'Le gestionnaire de packages pour Kubernetes : templates, values et deployments',
    icon: 'Package',
    color: '#ef4444',
    duration: '40 min',
    level: 'Avance',
    videoId: 'DuVxSs6ZoRA',
    sections: [
      {
        title: 'Introduction a Helm',
        content: `**Helm** est le gestionnaire de packages de Kubernetes. Tout comme \`apt\` pour Debian ou \`npm\` pour Node.js, Helm simplifie l'installation, la mise a jour et la gestion d'applications complexes sur un cluster Kubernetes.

### Le probleme que Helm resout

Deployer une application sur Kubernetes necessite souvent plusieurs manifestes YAML : Deployment, Service, ConfigMap, Secret, Ingress, PVC, ServiceAccount, RBAC... Gerer ces fichiers manuellement pose des problemes :

- **Duplication** : les memes templates sont copies entre environnements (dev, staging, prod) avec juste quelques valeurs qui changent
- **Versioning** : pas de moyen natif de versionner un ensemble de manifestes
- **Rollback** : difficile de revenir a une version precedente de toute l'application
- **Partage** : pas de standard pour partager des configurations d'applications

### Concepts cles de Helm

| Concept | Description |
|---------|-------------|
| **Chart** | Un package Helm — contient les templates + valeurs par defaut |
| **Release** | Une instance d'un Chart deploye dans le cluster |
| **Repository** | Un depot de Charts (similaire a un registry Docker) |
| **Values** | Les parametres de configuration injectes dans les templates |

### Installation de Helm

\`\`\`bash
# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# macOS
brew install helm

# Verifier
helm version
\`\`\`

### Commandes de base

\`\`\`bash
# Chercher un chart dans les repositories
helm search repo nginx
helm search hub wordpress    # Recherche sur Artifact Hub

# Installer un chart
helm install my-release bitnami/nginx

# Lister les releases
helm list
helm list --all-namespaces

# Voir le statut d'une release
helm status my-release

# Mettre a jour
helm upgrade my-release bitnami/nginx --set replicaCount=3

# Rollback
helm rollback my-release 1    # Revenir a la revision 1

# Desinstaller
helm uninstall my-release
\`\`\`

> **Helm 2 vs Helm 3 :** Helm 3 (version actuelle) a supprime **Tiller**, le composant serveur qui posait des problemes de securite dans Helm 2. Helm 3 utilise directement le kubeconfig de l'utilisateur et stocke les releases sous forme de Secrets Kubernetes. Assurez-vous d'utiliser Helm 3.`
      },
      {
        title: "Structure d'un Chart",
        content: `Un **Helm Chart** est un repertoire structure contenant tout le necessaire pour deployer une application sur Kubernetes.

### Arborescence d'un Chart

\`\`\`
my-chart/
├── Chart.yaml          # Metadonnees du chart (nom, version, description)
├── values.yaml         # Valeurs par defaut
├── charts/             # Sous-charts (dependances)
├── templates/          # Templates Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── hpa.yaml
│   ├── _helpers.tpl    # Fonctions templates reutilisables
│   ├── NOTES.txt       # Message affiche apres l'installation
│   └── tests/
│       └── test-connection.yaml
├── .helmignore         # Fichiers a ignorer (comme .gitignore)
└── README.md
\`\`\`

### Chart.yaml

Le fichier \`Chart.yaml\` contient les metadonnees du chart :

\`\`\`yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
type: application       # 'application' ou 'library'
version: 1.2.0          # Version du chart (SemVer)
appVersion: "3.1.0"     # Version de l'application deployee
keywords:
  - web
  - api
maintainers:
  - name: DevOps Team
    email: devops@example.com
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
\`\`\`

### Creer un chart

\`\`\`bash
# Generer un chart de base
helm create my-app

# Le chart genere contient des templates de reference
# pour un deploiement Nginx avec Service, Ingress, HPA, etc.

# Structure generee
ls my-app/
# Chart.yaml  charts/  templates/  values.yaml
\`\`\`

### Le fichier _helpers.tpl

Ce fichier contient des **named templates** reutilisables dans tous les templates du chart :

\`\`\`yaml
# templates/_helpers.tpl
{{- define "my-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "my-app.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
\`\`\`

> **Bonne pratique :** Versionnez vos charts avec **SemVer** (Semantic Versioning). Incrementez la version majeure pour les breaking changes, mineure pour les nouvelles fonctionnalites, et patch pour les corrections de bugs. La \`version\` du chart et la \`appVersion\` de l'application sont independantes.`
      },
      {
        title: 'Templates et values',
        content: `Le systeme de **templates** Helm utilise le langage **Go templates** pour generer des manifestes Kubernetes dynamiques a partir de valeurs configurables.

### Syntaxe des templates

\`\`\`yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.targetPort }}
        {{- if .Values.resources }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        {{- end }}
        {{- if .Values.env }}
        env:
          {{- range .Values.env }}
          - name: {{ .name }}
            value: {{ .value | quote }}
          {{- end }}
        {{- end }}
\`\`\`

### Fichier values.yaml

\`\`\`yaml
# values.yaml — valeurs par defaut
replicaCount: 2

image:
  repository: my-registry/my-app
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  host: app.example.com

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi

env:
  - name: NODE_ENV
    value: production
  - name: LOG_LEVEL
    value: info
\`\`\`

### Surcharger les values

\`\`\`bash
# Via --set (inline)
helm install my-release ./my-chart --set replicaCount=5

# Via un fichier de values specifique a l'environnement
helm install my-release ./my-chart -f values-production.yaml

# Combiner plusieurs fichiers (le dernier a la priorite)
helm install my-release ./my-chart \\
  -f values.yaml \\
  -f values-production.yaml \\
  --set image.tag=v2.1.0
\`\`\`

### Fonctions et pipelines

\`\`\`yaml
# Fonctions utiles
{{ .Values.name | upper }}                    # Majuscules
{{ .Values.name | quote }}                    # Entoure de guillemets
{{ .Values.name | default "my-app" }}         # Valeur par defaut
{{ .Values.labels | toYaml | nindent 4 }}     # Conversion YAML + indentation

# Conditions
{{- if .Values.ingress.enabled }}
# ... manifeste Ingress ...
{{- end }}

# Boucles
{{- range .Values.env }}
- name: {{ .name }}
  value: {{ .value }}
{{- end }}
\`\`\`

### Debugger les templates

\`\`\`bash
# Voir le YAML genere sans deployer
helm template my-release ./my-chart -f values-prod.yaml

# Dry-run avec validation par l'API Server
helm install my-release ./my-chart --dry-run --debug

# Valider la syntaxe
helm lint ./my-chart
\`\`\`

> **Bonne pratique :** Creez un fichier \`values-<env>.yaml\` pour chaque environnement (dev, staging, production). Le fichier \`values.yaml\` par defaut doit contenir des valeurs de dev securisees. Les secrets ne doivent jamais etre dans les fichiers values — utilisez des Secrets Kubernetes ou un gestionnaire de secrets externe.`
      },
      {
        title: 'Repositories Helm',
        content: `Les **repositories Helm** sont des serveurs qui hebergent et distribuent des Charts. Ils fonctionnent comme un registry pour les packages Kubernetes.

### Repositories publics populaires

| Repository | URL | Description |
|------------|-----|-------------|
| **Bitnami** | charts.bitnami.com/bitnami | Le plus grand repo communautaire (~200 charts) |
| **Artifact Hub** | artifacthub.io | Moteur de recherche centralise pour tous les charts |
| **ingress-nginx** | kubernetes.github.io/ingress-nginx | Nginx Ingress Controller officiel |
| **jetstack** | charts.jetstack.io | cert-manager |
| **prometheus-community** | prometheus-community.github.io/helm-charts | Stack monitoring Prometheus |
| **grafana** | grafana.github.io/helm-charts | Grafana, Loki, Tempo |

### Gerer les repositories

\`\`\`bash
# Ajouter un repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Mettre a jour les index locaux
helm repo update

# Lister les repositories configures
helm repo list

# Rechercher un chart
helm search repo postgresql
helm search repo bitnami/postgresql --versions    # Voir toutes les versions

# Supprimer un repository
helm repo remove bitnami
\`\`\`

### Creer un repository prive

Pour heberger vos propres charts, plusieurs options :

\`\`\`bash
# 1. GitHub Pages (gratuit)
# Packager le chart
helm package my-chart/

# Generer l'index
helm repo index . --url https://myorg.github.io/helm-charts

# Pousser sur GitHub Pages
git add . && git commit -m "Release my-chart v1.0.0" && git push

# 2. OCI Registry (Docker Hub, ECR, GCR, etc.)
# Depuis Helm 3.8, les charts peuvent etre stockes dans un OCI registry
helm push my-chart-1.0.0.tgz oci://registry.example.com/charts
helm pull oci://registry.example.com/charts/my-chart --version 1.0.0

# 3. ChartMuseum (self-hosted)
docker run -d -p 8080:8080 chartmuseum/chartmuseum --storage=local
\`\`\`

### OCI Registry (methode moderne)

Depuis Helm 3.8, les charts OCI sont le standard recommande :

\`\`\`bash
# Se connecter au registry
helm registry login registry.example.com

# Pousser un chart
helm push my-chart-1.0.0.tgz oci://registry.example.com/charts

# Installer depuis un OCI registry
helm install my-release oci://registry.example.com/charts/my-chart --version 1.0.0
\`\`\`

> **Conseil :** Pour les equipes, privilegiez un **OCI registry** (comme Harbor, ECR ou GCR) qui permet de stocker a la fois les images Docker et les Helm Charts dans le meme outil. Cela simplifie la gestion des artefacts et la securite (un seul systeme d'authentification).`
      },
      {
        title: 'Deploiement avec Helm',
        content: `Le deploiement avec Helm suit un workflow structure qui facilite la gestion du cycle de vie des applications sur Kubernetes.

### Workflow de deploiement complet

\`\`\`bash
# 1. Creer le chart (premiere fois)
helm create my-app

# 2. Developper les templates et values
#    Editer templates/, values.yaml, Chart.yaml

# 3. Valider le chart
helm lint my-app/
helm template my-release my-app/ -f values-staging.yaml

# 4. Deployer en staging
helm install my-app-staging my-app/ \\
  -f values-staging.yaml \\
  -n staging \\
  --create-namespace

# 5. Verifier le deploiement
helm status my-app-staging -n staging
kubectl get all -n staging

# 6. Deployer en production
helm install my-app-prod my-app/ \\
  -f values-production.yaml \\
  -n production
\`\`\`

### Mises a jour (upgrade)

\`\`\`bash
# Mettre a jour avec de nouvelles values
helm upgrade my-app-prod my-app/ \\
  -f values-production.yaml \\
  --set image.tag=v2.1.0

# Upgrade avec installation automatique si la release n'existe pas
helm upgrade --install my-app-prod my-app/ \\
  -f values-production.yaml

# Voir l'historique des revisions
helm history my-app-prod

# REVISION  STATUS      CHART        APP VERSION  DESCRIPTION
# 1         superseded  my-app-1.0   1.0.0        Install complete
# 2         superseded  my-app-1.1   1.1.0        Upgrade complete
# 3         deployed    my-app-1.2   1.2.0        Upgrade complete
\`\`\`

### Rollback

\`\`\`bash
# Revenir a la revision precedente
helm rollback my-app-prod

# Revenir a une revision specifique
helm rollback my-app-prod 1

# Verifier apres rollback
helm status my-app-prod
\`\`\`

### Hooks Helm

Les hooks permettent d'executer des actions a des moments specifiques du cycle de vie :

\`\`\`yaml
# templates/pre-upgrade-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  annotations:
    "helm.sh/hook": pre-upgrade
    "helm.sh/hook-weight": "1"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: my-app:latest
        command: ["./migrate.sh"]
      restartPolicy: Never
\`\`\`

| Hook | Moment d'execution |
|------|-------------------|
| \`pre-install\` | Avant l'installation |
| \`post-install\` | Apres l'installation |
| \`pre-upgrade\` | Avant une mise a jour |
| \`post-upgrade\` | Apres une mise a jour |
| \`pre-rollback\` | Avant un rollback |
| \`pre-delete\` | Avant la desinstallation |

### Integration CI/CD

\`\`\`yaml
# GitHub Actions example
- name: Deploy to production
  run: |
    helm upgrade --install my-app ./charts/my-app \\
      -f values-production.yaml \\
      --set image.tag=\${{ github.sha }} \\
      --namespace production \\
      --wait \\
      --timeout 300s
\`\`\`

> **Bonne pratique :** Utilisez toujours \`helm upgrade --install\` (au lieu de \`helm install\`) dans vos pipelines CI/CD. Cette commande est idempotente : elle installe la release si elle n'existe pas ou la met a jour sinon. Ajoutez \`--wait\` pour que la commande attende que tous les pods soient Ready avant de retourner.`
      }
    ]
  },
  {
    id: 123,
    slug: 'secrets-configmaps',
    title: 'Secrets & ConfigMaps',
    subtitle: 'Gerer la configuration et les donnees sensibles dans Kubernetes',
    icon: 'Lock',
    color: '#ef4444',
    duration: '35 min',
    level: 'Avance',
    videoId: 'cMzEl3I9qsc',
    sections: [
      {
        title: 'ConfigMaps (creation et utilisation)',
        content: `Les **ConfigMaps** permettent de separer la configuration de l'image du conteneur. Ils stockent des donnees non-sensibles sous forme de paires cle-valeur.

### Creer un ConfigMap

\`\`\`bash
# A partir de valeurs literals
kubectl create configmap app-config \\
  --from-literal=DATABASE_HOST=db.example.com \\
  --from-literal=DATABASE_PORT=5432 \\
  --from-literal=LOG_LEVEL=info

# A partir d'un fichier
kubectl create configmap nginx-config --from-file=nginx.conf

# A partir d'un repertoire (chaque fichier = une cle)
kubectl create configmap config-dir --from-file=config/
\`\`\`

### ConfigMap en YAML

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Valeurs simples
  DATABASE_HOST: "db.example.com"
  DATABASE_PORT: "5432"
  LOG_LEVEL: "info"
  FEATURE_FLAGS: "true"

  # Fichier de configuration complet
  app.properties: |
    server.port=8080
    server.host=0.0.0.0
    cache.ttl=300
    cache.max-size=1000

  # Fichier JSON
  config.json: |
    {
      "database": {
        "host": "db.example.com",
        "port": 5432
      },
      "features": {
        "new-ui": true
      }
    }
\`\`\`

### Utiliser un ConfigMap dans un Pod

**Methode 1 : Variables d'environnement**

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:v1
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DATABASE_HOST
    # Ou injecter TOUTES les cles comme variables d'environnement
    envFrom:
    - configMapRef:
        name: app-config
\`\`\`

**Methode 2 : Volume monte**

\`\`\`yaml
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    volumeMounts:
    - name: config-volume
      mountPath: /etc/nginx/conf.d
  volumes:
  - name: config-volume
    configMap:
      name: nginx-config
      items:
      - key: nginx.conf
        path: default.conf
\`\`\`

### Mise a jour des ConfigMaps

Les ConfigMaps montes en volume sont mis a jour **automatiquement** (delai ~1 minute). Les variables d'environnement ne sont **pas** mises a jour — il faut recreer les Pods.

\`\`\`bash
# Mettre a jour un ConfigMap
kubectl edit configmap app-config

# Forcer le redemarrage des pods pour prendre en compte les nouvelles variables
kubectl rollout restart deployment/my-app
\`\`\`

> **Attention :** Les ConfigMaps ont une limite de taille de **1 Mo**. Pour des fichiers de configuration plus volumineux, utilisez des Volumes persistants ou des outils comme **ConfigMap Reloader** qui detecte les changements et redemarre automatiquement les Deployments concernes.`
      },
      {
        title: 'Secrets Kubernetes',
        content: `Les **Secrets** Kubernetes stockent des donnees sensibles (mots de passe, tokens, cles SSH, certificats TLS). Ils sont similaires aux ConfigMaps mais avec un traitement specifique pour la securite.

### Types de Secrets

| Type | Description |
|------|-------------|
| \`Opaque\` (defaut) | Donnees arbitraires (cle-valeur) |
| \`kubernetes.io/tls\` | Certificat TLS + cle privee |
| \`kubernetes.io/dockerconfigjson\` | Credentials de registre Docker |
| \`kubernetes.io/basic-auth\` | Identifiants basiques (username/password) |
| \`kubernetes.io/ssh-auth\` | Cle privee SSH |

### Creer un Secret

\`\`\`bash
# A partir de valeurs literals
kubectl create secret generic db-credentials \\
  --from-literal=username=admin \\
  --from-literal=password='S3cur3P@ssw0rd!'

# A partir d'un fichier
kubectl create secret generic ssh-key --from-file=id_rsa=~/.ssh/id_rsa

# Secret TLS
kubectl create secret tls my-tls \\
  --cert=fullchain.pem \\
  --key=privkey.pem

# Secret pour Docker registry
kubectl create secret docker-registry regcred \\
  --docker-server=registry.example.com \\
  --docker-username=user \\
  --docker-password=pass
\`\`\`

### Secret en YAML

Les valeurs doivent etre encodees en **base64** :

\`\`\`bash
# Encoder en base64
echo -n 'admin' | base64        # YWRtaW4=
echo -n 'S3cur3P@ss' | base64  # UzNjdXIzUEBzcw==
\`\`\`

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=          # base64 de 'admin'
  password: UzNjdXIzUEBzcw== # base64 de 'S3cur3P@ss'
---
# Alternative avec stringData (pas besoin de base64)
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: admin
  password: S3cur3P@ss
\`\`\`

### Utiliser un Secret dans un Pod

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:v1
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
    volumeMounts:
    - name: certs
      mountPath: /etc/ssl/certs
      readOnly: true
  volumes:
  - name: certs
    secret:
      secretName: my-tls
  # Pour les registres prives
  imagePullSecrets:
  - name: regcred
\`\`\`

> **Avertissement securite :** Les Secrets Kubernetes sont encodes en base64, **pas chiffres**. Toute personne avec acces au namespace peut les lire. Pour une securite renforcee, activez le **chiffrement au repos** (encryption at rest) dans etcd et utilisez des outils comme Sealed Secrets ou un gestionnaire de secrets externe (Vault, AWS Secrets Manager).`
      },
      {
        title: 'Injection dans les Pods',
        content: `L'injection de ConfigMaps et de Secrets dans les Pods peut se faire de plusieurs manieres. Le choix depend de la facon dont votre application consomme la configuration.

### Comparaison des methodes d'injection

| Methode | Mise a jour auto | Cas d'usage |
|---------|-----------------|-------------|
| **Env vars (valueFrom)** | Non (necessite restart) | Variables simples (DB_HOST, API_KEY) |
| **Env vars (envFrom)** | Non | Toutes les cles en une seule fois |
| **Volume mount** | Oui (~1 min) | Fichiers de config (nginx.conf, app.yaml) |
| **Init container** | Non | Configuration au demarrage |

### Variables d'environnement selectionnees

\`\`\`yaml
spec:
  containers:
  - name: app
    env:
    # Depuis un ConfigMap
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DATABASE_HOST
    # Depuis un Secret
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
    # Valeur fixe
    - name: APP_ENV
      value: "production"
\`\`\`

### Injection complete avec envFrom

\`\`\`yaml
spec:
  containers:
  - name: app
    envFrom:
    - configMapRef:
        name: app-config
        prefix: APP_        # Prefixe optionnel (APP_DATABASE_HOST, etc.)
    - secretRef:
        name: db-credentials
        prefix: DB_
\`\`\`

### Montage en volume avec permissions

\`\`\`yaml
spec:
  containers:
  - name: app
    volumeMounts:
    - name: config
      mountPath: /app/config
      readOnly: true
    - name: secrets
      mountPath: /app/secrets
      readOnly: true
  volumes:
  - name: config
    configMap:
      name: app-config
      items:                    # Selectionner des cles specifiques
      - key: config.json
        path: config.json       # Nom du fichier dans le volume
      - key: app.properties
        path: app.properties
  - name: secrets
    secret:
      secretName: db-credentials
      defaultMode: 0400         # Permissions restrictives (lecture seule pour owner)
\`\`\`

### Projected volumes (combinaison)

Les **projected volumes** permettent de combiner plusieurs sources dans un seul montage :

\`\`\`yaml
spec:
  containers:
  - name: app
    volumeMounts:
    - name: all-config
      mountPath: /app/config
  volumes:
  - name: all-config
    projected:
      sources:
      - configMap:
          name: app-config
          items:
          - key: config.json
            path: config.json
      - secret:
          name: db-credentials
          items:
          - key: password
            path: db-password
      - downwardAPI:
          items:
          - path: "pod-name"
            fieldRef:
              fieldPath: metadata.name
\`\`\`

### Pattern Sidecar pour rechargement automatique

\`\`\`yaml
# Utiliser un sidecar qui surveille les changements de config
spec:
  containers:
  - name: app
    image: my-app:v1
    volumeMounts:
    - name: config
      mountPath: /app/config
  - name: config-reloader
    image: jimmidyson/configmap-reload:latest
    args:
    - --volume-dir=/app/config
    - --webhook-url=http://localhost:8080/-/reload
    volumeMounts:
    - name: config
      mountPath: /app/config
\`\`\`

> **Bonne pratique :** Utilisez les volumes montes pour les fichiers de configuration (nginx.conf, application.yaml) car ils sont mis a jour automatiquement. Utilisez les variables d'environnement pour les parametres simples qui ne changent pas souvent (URL de base de donnees, niveau de log).`
      },
      {
        title: 'External Secrets Operator',
        content: `L'**External Secrets Operator** (ESO) est un controleur Kubernetes qui synchronise les secrets depuis des gestionnaires de secrets externes (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, GCP Secret Manager) vers des Secrets Kubernetes natifs.

### Pourquoi External Secrets ?

Les Secrets Kubernetes natifs ont des limitations :

- Encodes en base64, **pas chiffres** (lisibles par quiconque a acces au namespace)
- Stockes en clair dans etcd (sauf si encryption at rest est active)
- Difficiles a synchroniser entre clusters
- Pas de rotation automatique
- Pas de journalisation d'acces (audit)

### Architecture

\`\`\`
┌─────────────────────┐     ┌──────────────────────┐
│  Secret Provider     │     │  Kubernetes Cluster   │
│  (AWS SM / Vault)    │◄───│  External Secrets     │
│                      │     │  Operator             │
│  my-app/db-password  │     │       │               │
│  my-app/api-key      │     │       ▼               │
└─────────────────────┘     │  Secret (K8s natif)   │
                             │  db-credentials       │
                             │       │               │
                             │       ▼               │
                             │  Pod (env var/volume) │
                             └──────────────────────┘
\`\`\`

### Installation

\`\`\`bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets \\
  --namespace external-secrets \\
  --create-namespace
\`\`\`

### Configuration avec AWS Secrets Manager

\`\`\`yaml
# 1. SecretStore — comment se connecter au provider
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: aws-secrets
spec:
  provider:
    aws:
      service: SecretsManager
      region: eu-west-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
            namespace: external-secrets

---
# 2. ExternalSecret — quel secret synchroniser
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: production
spec:
  refreshInterval: 1h          # Frequence de synchronisation
  secretStoreRef:
    name: aws-secrets
    kind: ClusterSecretStore
  target:
    name: db-credentials       # Nom du Secret K8s cree
    creationPolicy: Owner
  data:
  - secretKey: username        # Cle dans le Secret K8s
    remoteRef:
      key: production/database  # Chemin dans AWS SM
      property: username        # Propriete dans le JSON
  - secretKey: password
    remoteRef:
      key: production/database
      property: password
\`\`\`

### Configuration avec HashiCorp Vault

\`\`\`yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-store
spec:
  provider:
    vault:
      server: "https://vault.example.com"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "my-app-role"
\`\`\`

\`\`\`bash
# Verifier la synchronisation
kubectl get externalsecrets
kubectl describe externalsecret db-credentials

# STATUS    READY   AGE
# synced    True    5m
\`\`\`

> **Bonne pratique :** Utilisez toujours un gestionnaire de secrets externe en production. L'External Secrets Operator est le standard de facto pour synchroniser les secrets vers Kubernetes. Configurez un \`refreshInterval\` adapte (1h pour les secrets rarement changes, 5m pour les secrets avec rotation frequente).`
      },
      {
        title: 'Best practices securite',
        content: `La gestion securisee des Secrets et ConfigMaps est un aspect critique de tout deploiement Kubernetes en production.

### Hierarchie de securite des secrets

\`\`\`
Niveau 1 (base)     : Secrets K8s natifs (base64)
Niveau 2 (mieux)    : Encryption at rest dans etcd
Niveau 3 (bien)     : Sealed Secrets (chiffres dans Git)
Niveau 4 (excellent): External Secrets (AWS SM, Vault, etc.)
Niveau 5 (optimal)  : Vault avec injection sidecar + rotation auto
\`\`\`

### 1. Activer le chiffrement au repos (encryption at rest)

Par defaut, etcd stocke les secrets en clair. Activez le chiffrement :

\`\`\`yaml
# /etc/kubernetes/enc/encryption-config.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: <base64-encoded-32-byte-key>
  - identity: {}
\`\`\`

### 2. RBAC granulaire

Limitez l'acces aux Secrets avec des regles RBAC strictes :

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secret-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["app-credentials"]   # Restreindre a des secrets specifiques
  verbs: ["get"]                        # Pas de list, watch, create, delete
\`\`\`

### 3. Sealed Secrets (secrets chiffres dans Git)

**Sealed Secrets** (par Bitnami) permet de stocker des secrets **chiffres** dans Git :

\`\`\`bash
# Installer le controleur
helm install sealed-secrets sealed-secrets/sealed-secrets -n kube-system

# Installer kubeseal CLI
brew install kubeseal

# Chiffrer un secret
kubectl create secret generic my-secret \\
  --from-literal=password=secret123 \\
  --dry-run=client -o yaml | \\
  kubeseal --format yaml > sealed-secret.yaml

# Le sealed-secret.yaml peut etre commit dans Git en toute securite
kubectl apply -f sealed-secret.yaml
# Le controleur le dechiffre automatiquement en Secret K8s
\`\`\`

### 4. Ne jamais hardcoder dans les images

\`\`\`dockerfile
# MAUVAIS - secret dans l'image
ENV DATABASE_PASSWORD=secret123

# BON - injecte au runtime via Secret K8s
# Le secret est monte comme variable d'environnement ou fichier
\`\`\`

### 5. Rotation des secrets

\`\`\`yaml
# Avec External Secrets Operator
spec:
  refreshInterval: 30m     # Synchronise les nouvelles valeurs toutes les 30 min

# Avec Vault Agent Injector
# La rotation est automatique via le lease TTL de Vault
\`\`\`

### Checklist securite secrets

- [ ] Chiffrement au repos active dans etcd
- [ ] RBAC granulaire pour l'acces aux secrets
- [ ] Pas de secrets dans les images Docker
- [ ] Pas de secrets en clair dans Git (utiliser Sealed Secrets ou External Secrets)
- [ ] Rotation reguliere des secrets
- [ ] Audit logging active pour les acces aux secrets
- [ ] Network Policies pour isoler les pods avec acces aux secrets
- [ ] \`readOnly: true\` pour les montages de secrets en volume
- [ ] Permissions fichier restrictives (\`defaultMode: 0400\`)

> **Regle d'or :** Les secrets ne doivent JAMAIS apparaitre dans : les logs applicatifs, les variables d'environnement visibles (\`kubectl describe pod\`), les images Docker, les fichiers YAML committes dans Git (sauf si chiffres avec Sealed Secrets), ou les ConfigMaps. Utilisez un gestionnaire de secrets externe pour tout environnement de production.`
      }
    ]
  },
  {
    id: 124,
    slug: 'scaling-autoscaling',
    title: 'Scaling & Autoscaling',
    subtitle: 'Strategies de mise a echelle et autoscaling dans Kubernetes',
    icon: 'TrendingUp',
    color: '#ef4444',
    duration: '40 min',
    level: 'Expert',
    videoId: '',
    sections: [
      {
        title: 'Scaling horizontal vs vertical',
        content: `Le **scaling** est la capacite d'un systeme a s'adapter a la charge. Kubernetes offre deux approches fondamentales de mise a echelle.

### Scaling horizontal (scale-out)

Le scaling horizontal consiste a **ajouter ou retirer des replicas** (instances) d'un pod. C'est l'approche privilegiee dans Kubernetes.

\`\`\`bash
# Scaler manuellement un deployment
kubectl scale deployment/api --replicas=5

# Verifier
kubectl get pods -l app=api
# NAME                   READY   STATUS    RESTARTS   AGE
# api-6d8f9b7c4d-abc12   1/1     Running   0          5m
# api-6d8f9b7c4d-def34   1/1     Running   0          5m
# api-6d8f9b7c4d-ghi56   1/1     Running   0          30s  ← nouveau
# api-6d8f9b7c4d-jkl78   1/1     Running   0          30s  ← nouveau
# api-6d8f9b7c4d-mno90   1/1     Running   0          30s  ← nouveau
\`\`\`

\`\`\`
Scaling horizontal :
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│Pod 1│  │Pod 2│  │Pod 3│  │Pod 4│  │Pod 5│
└─────┘  └─────┘  └─────┘  └─────┘  └─────┘
  ↑ ajout de replicas identiques ↑
\`\`\`

**Avantages :**
- Pas de downtime (les pods existants continuent de fonctionner)
- Theoriquement illimite (ajoutez des noeuds au cluster)
- Tolerance aux pannes (si un pod tombe, les autres prennent le relais)

### Scaling vertical (scale-up)

Le scaling vertical consiste a **augmenter les ressources** (CPU, RAM) d'un pod existant.

\`\`\`yaml
# Avant : petit pod
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "200m"
    memory: "256Mi"

# Apres : pod plus puissant
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "1000m"
    memory: "1Gi"
\`\`\`

\`\`\`
Scaling vertical :
┌─────────────┐
│             │
│   Pod 1     │  ← Plus de CPU et RAM
│  (upgraded) │
│             │
└─────────────┘
\`\`\`

**Inconvenients :**
- Necessite souvent un redemarrage du pod
- Limite par les ressources du noeud
- Point unique de defaillance si un seul pod

### Quand utiliser quoi ?

| Scenario | Approche recommandee |
|----------|---------------------|
| Application web stateless | Horizontal (ajouter des pods) |
| Base de donnees leader | Vertical (plus de RAM/CPU) |
| Workers de traitement batch | Horizontal (paralleliser) |
| Application monolithique | Vertical (puis refactorer en microservices) |
| API a trafic variable | Horizontal + HPA |

> **Bonne pratique :** Privilegiez toujours le scaling horizontal. Concevez vos applications pour etre **stateless** (sans etat) afin de pouvoir les scaler horizontalement sans contrainte. Stockez l'etat dans des services dedies (base de donnees, cache Redis, stockage objet).`
      },
      {
        title: 'HPA (Horizontal Pod Autoscaler)',
        content: `Le **Horizontal Pod Autoscaler** (HPA) ajuste automatiquement le nombre de replicas d'un Deployment, ReplicaSet ou StatefulSet en fonction de metriques observees (CPU, memoire, metriques custom).

### Prerequis : Metrics Server

Le HPA a besoin du **Metrics Server** pour collecter les metriques de CPU et memoire :

\`\`\`bash
# Installer Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Verifier
kubectl top nodes
kubectl top pods
\`\`\`

### Creer un HPA

\`\`\`bash
# Via kubectl
kubectl autoscale deployment api \\
  --min=2 \\
  --max=10 \\
  --cpu-percent=70
\`\`\`

\`\`\`yaml
# Via manifeste YAML (recommande)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # Scale up si CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80    # Scale up si memoire > 80%
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60    # Attendre 60s avant de scaler up
      policies:
      - type: Pods
        value: 2
        periodSeconds: 60               # Max 2 pods ajoutes par minute
    scaleDown:
      stabilizationWindowSeconds: 300   # Attendre 5 min avant de scaler down
      policies:
      - type: Percent
        value: 25
        periodSeconds: 60               # Max 25% des pods retires par minute
\`\`\`

### Algorithme du HPA

Le HPA calcule le nombre de replicas souhaite avec la formule :

\`\`\`
replicas = ceil(current_replicas * (current_metric / desired_metric))

Exemple :
- 3 replicas actuels
- CPU moyen : 90%
- Target : 70%
- Calcul : ceil(3 * (90/70)) = ceil(3.86) = 4 replicas
\`\`\`

### Metriques custom

Pour scaler sur des metriques metier (requetes/seconde, taille de la file d'attente) :

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa-custom
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: 1000         # Scale si > 1000 req/s par pod
  - type: Object
    object:
      describedObject:
        apiVersion: v1
        kind: Service
        name: api-service
      metric:
        name: requests_queue_length
      target:
        type: Value
        value: 100                 # Scale si file > 100 elements
\`\`\`

\`\`\`bash
# Surveiller le HPA
kubectl get hpa
kubectl describe hpa api-hpa

# Voir les evenements de scaling
kubectl get events --field-selector reason=SuccessfulRescale
\`\`\`

> **Important :** Le HPA necessite que vos pods aient des \`resources.requests\` definies pour le CPU et/ou la memoire. Sans requests, le HPA ne peut pas calculer l'utilisation en pourcentage. Definissez toujours des requests realistes basees sur le profil de charge de votre application.`
      },
      {
        title: 'VPA (Vertical Pod Autoscaler)',
        content: `Le **Vertical Pod Autoscaler** (VPA) ajuste automatiquement les \`requests\` et \`limits\` de CPU et memoire des pods en fonction de l'utilisation reelle.

### Installation du VPA

Le VPA n'est pas installe par defaut dans Kubernetes :

\`\`\`bash
# Cloner le repository
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler

# Installer
./hack/vpa-up.sh

# Verifier les composants
kubectl get pods -n kube-system | grep vpa
# vpa-admission-controller-xxx
# vpa-recommender-xxx
# vpa-updater-xxx
\`\`\`

### Composants du VPA

| Composant | Role |
|-----------|------|
| **Recommender** | Analyse l'utilisation historique et recommande des valeurs optimales |
| **Updater** | Evicte les pods qui doivent etre redimensionnes |
| **Admission Controller** | Modifie les requests/limits des nouveaux pods crees |

### Configurer un VPA

\`\`\`yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  updatePolicy:
    updateMode: "Auto"          # Auto, Recreate, Initial, ou Off
  resourcePolicy:
    containerPolicies:
    - containerName: api
      minAllowed:
        cpu: "50m"
        memory: "64Mi"
      maxAllowed:
        cpu: "2"
        memory: "2Gi"
      controlledResources: ["cpu", "memory"]
\`\`\`

### Modes de fonctionnement

| Mode | Description |
|------|-------------|
| **Off** | Ne fait que recommander (pas de modification) — ideal pour commencer |
| **Initial** | Applique les recommandations uniquement a la creation du pod |
| **Recreate** | Evicte et recree les pods avec les nouvelles valeurs |
| **Auto** | Comme Recreate (mais pourra faire du in-place resize a l'avenir) |

### Consulter les recommandations

\`\`\`bash
kubectl describe vpa api-vpa

# Recommendation:
#   Container Recommendations:
#     Container Name: api
#     Lower Bound:
#       Cpu:     50m
#       Memory:  128Mi
#     Target:
#       Cpu:     250m        ← Valeur recommandee pour requests
#       Memory:  384Mi
#     Upper Bound:
#       Cpu:     1000m
#       Memory:  1Gi
#     Uncapped Target:
#       Cpu:     250m
#       Memory:  384Mi
\`\`\`

### VPA + HPA : attention aux conflits

Le VPA et le HPA ne doivent **pas** scaler sur la meme metrique :

\`\`\`yaml
# BON : VPA sur la memoire, HPA sur le CPU
# VPA
spec:
  resourcePolicy:
    containerPolicies:
    - containerName: api
      controlledResources: ["memory"]   # VPA gere la memoire

# HPA
spec:
  metrics:
  - type: Resource
    resource:
      name: cpu                         # HPA gere le CPU
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

> **Conseil :** Commencez par utiliser le VPA en mode \`Off\` pour observer les recommandations pendant quelques jours. Comparez avec vos requests actuels. Une fois confiant, passez en mode \`Auto\`. Le VPA est particulierement utile pour les applications dont la consommation memoire est difficile a estimer (JVM, applications ML).`
      },
      {
        title: 'Cluster Autoscaler',
        content: `Le **Cluster Autoscaler** ajuste automatiquement le nombre de noeuds dans le cluster. Quand les pods ne peuvent pas etre schedules (faute de ressources), il ajoute des noeuds. Quand des noeuds sont sous-utilises, il les supprime.

### Fonctionnement

\`\`\`
1. Le HPA augmente les replicas de 5 a 10
2. Le Scheduler ne trouve pas de noeud avec assez de ressources
3. Les pods restent en etat "Pending"
4. Le Cluster Autoscaler detecte les pods Pending
5. Il provisionne un nouveau noeud via le cloud provider
6. Le nouveau noeud rejoint le cluster
7. Les pods Pending sont schedules sur le nouveau noeud
\`\`\`

\`\`\`
┌─────────────────────────────────────────────────────┐
│  Cluster Autoscaler                                  │
│                                                      │
│  Pods Pending? ──► Ajouter un noeud (scale up)      │
│  Noeud sous-utilise? ──► Supprimer le noeud (down)  │
│                                                      │
│  Node Group (ex: AWS ASG)                           │
│  min: 2, max: 10, desired: variable                 │
│                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │Node 1│  │Node 2│  │Node 3│  │Node 4│ ← auto     │
│  └──────┘  └──────┘  └──────┘  └──────┘             │
└─────────────────────────────────────────────────────┘
\`\`\`

### Configuration par cloud provider

**AWS EKS :**

\`\`\`bash
# Avec eksctl
eksctl create nodegroup \\
  --cluster=my-cluster \\
  --name=workers \\
  --nodes-min=2 \\
  --nodes-max=10 \\
  --node-type=m5.large \\
  --asg-access

# Installer le Cluster Autoscaler
helm install cluster-autoscaler autoscaler/cluster-autoscaler \\
  --set autoDiscovery.clusterName=my-cluster \\
  --set awsRegion=eu-west-1 \\
  --namespace kube-system
\`\`\`

**GCP GKE :**

\`\`\`bash
# Active nativement dans GKE
gcloud container clusters update my-cluster \\
  --enable-autoscaling \\
  --min-nodes=2 \\
  --max-nodes=10 \\
  --zone=europe-west1-b
\`\`\`

**Azure AKS :**

\`\`\`bash
az aks update \\
  --resource-group my-rg \\
  --name my-cluster \\
  --enable-cluster-autoscaler \\
  --min-count 2 \\
  --max-count 10
\`\`\`

### Scale-down : quand un noeud est supprime

Le Cluster Autoscaler supprime un noeud si :

- L'utilisation est **inferieure a 50%** (configurable)
- Tous les pods du noeud peuvent etre rescheduled ailleurs
- Aucun pod avec un **PDB** (PodDisruptionBudget) ne serait viole
- Le noeud est sous-utilise depuis au moins **10 minutes** (configurable)

### PodDisruptionBudget (PDB)

Le PDB protege vos applications pendant le scale-down :

\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2          # Au minimum 2 pods doivent rester disponibles
  # OU
  # maxUnavailable: 1      # Au maximum 1 pod peut etre indisponible
  selector:
    matchLabels:
      app: api
\`\`\`

### La chaine complete de scaling

\`\`\`
Trafic augmente
     ↓
HPA detecte CPU > 70%
     ↓
HPA augmente les replicas (3 → 6)
     ↓
Scheduler : pas de place sur les noeuds existants
     ↓
Pods en Pending
     ↓
Cluster Autoscaler ajoute un noeud
     ↓
Les pods Pending sont schedules
     ↓
Le trafic est absorbe
\`\`\`

> **Bonne pratique :** Configurez toujours un **PodDisruptionBudget** pour vos applications critiques. Cela garantit qu'un nombre minimum de pods reste disponible pendant les operations de maintenance, les scale-downs et les mises a jour de noeuds. Sans PDB, le Cluster Autoscaler pourrait supprimer un noeud et causer un downtime.`
      },
      {
        title: 'Capacity planning',
        content: `Le **capacity planning** consiste a estimer et provisionner les ressources necessaires pour votre cluster Kubernetes en fonction de la charge actuelle et previsionnelle.

### Dimensionner les requests et limits

La premiere etape du capacity planning est de definir correctement les \`requests\` et \`limits\` de chaque conteneur :

\`\`\`yaml
# Mauvais : pas de requests/limits
spec:
  containers:
  - name: api
    image: my-api:v1
    # Aucune contrainte → risque de noisy neighbor

# Bon : requests et limits bien definis
spec:
  containers:
  - name: api
    image: my-api:v1
    resources:
      requests:             # Ressources garanties
        cpu: "200m"         # 0.2 CPU
        memory: "256Mi"     # 256 Mo
      limits:               # Maximum autorise
        cpu: "500m"         # 0.5 CPU
        memory: "512Mi"     # 512 Mo
\`\`\`

### Formules de calcul

\`\`\`
Ressources totales necessaires :
────────────────────────────────
CPU total = somme(requests.cpu de tous les pods) + overhead systeme (10-15%)
RAM total = somme(requests.memory de tous les pods) + overhead systeme (10-15%)

Nombre de noeuds :
──────────────────
noeuds = max(ceil(CPU_total / CPU_par_noeud), ceil(RAM_total / RAM_par_noeud))

Exemple :
- 20 pods avec requests.cpu=200m et requests.memory=256Mi
- CPU total : 20 * 200m = 4000m = 4 CPU + 15% overhead = 4.6 CPU
- RAM total : 20 * 256Mi = 5120Mi = 5 Gi + 15% overhead = 5.75 Gi
- Noeud m5.large (2 CPU, 8 Gi) : ceil(4.6/2) = 3 noeuds pour le CPU
- Resultat : 3 noeuds m5.large minimum
\`\`\`

### Overhead systeme par noeud

Chaque noeud reserve des ressources pour les composants systeme :

| Composant | CPU | Memoire |
|-----------|-----|---------|
| kubelet | ~100m | ~100Mi |
| kube-proxy | ~100m | ~50Mi |
| Container runtime | ~100m | ~100Mi |
| OS + kernel | variable | ~500Mi |
| **Total overhead** | **~300m-500m** | **~750Mi-1Gi** |

### Outils de monitoring

\`\`\`bash
# Utilisation actuelle des noeuds
kubectl top nodes

# Utilisation actuelle des pods
kubectl top pods --all-namespaces --sort-by=cpu

# Voir les requests vs utilisation reelle
kubectl describe node <node-name>
# Allocated resources:
#   CPU Requests   CPU Limits   Memory Requests   Memory Limits
#   1200m (60%)    3000m (150%) 2Gi (50%)         4Gi (100%)
\`\`\`

### Strategies de planning

| Strategie | Description | Quand l'utiliser |
|-----------|-------------|------------------|
| **On-demand** | Noeuds ajoutes a la demande (Cluster Autoscaler) | Charge impredictible |
| **Pre-provisioned** | Noeuds reserves en avance | Charge predictible, SLA strict |
| **Spot/Preemptible** | Noeuds a prix reduit mais interruptibles | Workloads tolerants aux interruptions (batch, CI) |
| **Reserved instances** | Noeuds reserves 1-3 ans a prix reduit | Charge de base stable |

### Multi-tenant : quotas par namespace

\`\`\`yaml
# Limiter les ressources par equipe/environnement
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-backend-quota
  namespace: team-backend
spec:
  hard:
    requests.cpu: "8"
    requests.memory: 16Gi
    limits.cpu: "16"
    limits.memory: 32Gi
    pods: "50"
    services.loadbalancers: "2"
    persistentvolumeclaims: "10"
\`\`\`

### Ratio requests/limits recommandes

\`\`\`yaml
# CPU : limits = 2-5x requests (burstable)
# Le CPU est compressible : le pod est throttle mais ne crash pas
resources:
  requests:
    cpu: "200m"
  limits:
    cpu: "1000m"    # 5x requests

# Memoire : limits = 1-1.5x requests (protege contre OOMKill)
# La memoire n'est PAS compressible : depassement = OOMKilled
resources:
  requests:
    memory: "256Mi"
  limits:
    memory: "384Mi"  # 1.5x requests
\`\`\`

> **Bonne pratique :** Revoyez votre capacity planning **trimestriellement**. Analysez les metriques du VPA (recommendations vs requests actuels), les tendances de trafic, et ajustez les types d'instances et le nombre de noeuds en consequence. Un cluster surdimensionne coute cher ; un cluster sous-dimensionne impacte la performance et la fiabilite.`
      }
    ]
  }
]
