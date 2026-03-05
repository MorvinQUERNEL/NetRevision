import type { GlossaryTerm } from '../glossaryTerms'

export const glossaryTerms: GlossaryTerm[] = [
  // ============================================================
  // === Linux (~15 terms) ===
  // ============================================================
  {
    id: 'kernel',
    term: 'Kernel (Noyau)',
    definition: 'Le coeur du systeme Linux qui gere le materiel, la memoire, les processus et les appels systeme. Il fait l\'interface entre le logiciel et le materiel. Le noyau Linux est monolithique modulaire.',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'shell',
    term: 'Shell',
    definition: 'Interpreteur de commandes qui permet a l\'utilisateur d\'interagir avec le systeme d\'exploitation via des lignes de commande. Bash est le shell le plus courant sous Linux. Alternatives : Zsh, Fish, Dash.',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'permissions-unix',
    term: 'Permissions Unix (rwx)',
    definition: 'Systeme de controle d\'acces base sur trois niveaux (proprietaire, groupe, autres) et trois types (lecture r, ecriture w, execution x). Representation octale : chmod 755 = rwxr-xr-x.',
    category: 'Linux',
    relatedChapter: 'utilisateurs-permissions'
  },
  {
    id: 'systemd',
    term: 'systemd',
    definition: 'Systeme d\'initialisation et gestionnaire de services pour Linux. Il demarre le systeme, gere les services (systemctl start/stop/enable), les timers, les journaux (journalctl) et les cgroups.',
    category: 'Linux',
    relatedChapter: 'systemd-services'
  },
  {
    id: 'processus',
    term: 'Processus',
    definition: 'Instance d\'un programme en cours d\'execution. Chaque processus a un PID (Process ID), un PPID (parent), des descripteurs de fichiers et des ressources allouees. Commandes : ps, top, htop, kill.',
    category: 'Linux',
    relatedChapter: 'commandes-linux-avancees'
  },
  {
    id: 'package-manager',
    term: 'Gestionnaire de paquets',
    definition: 'Outil pour installer, mettre a jour et supprimer des logiciels. apt/dpkg pour Debian/Ubuntu, yum/dnf/rpm pour RHEL/Fedora. Gere les dependances automatiquement.',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'cron',
    term: 'Cron / Crontab',
    definition: 'Planificateur de taches Linux qui execute des commandes a des intervalles reguliers. Syntaxe crontab : minute heure jour_mois mois jour_semaine commande. Alternative systemd : timers.',
    category: 'Linux',
    relatedChapter: 'systemd-services'
  },
  {
    id: 'ssh',
    term: 'SSH (Secure Shell)',
    definition: 'Protocole de communication securise (port 22) pour l\'acces distant aux serveurs. Utilise le chiffrement asymetrique pour l\'authentification (cles publique/privee) et symetrique pour la session.',
    category: 'Linux',
    relatedChapter: 'commandes-linux-avancees'
  },
  {
    id: 'sudo',
    term: 'sudo',
    definition: 'Commande permettant a un utilisateur autorise d\'executer une commande avec les privileges root. Configure via le fichier /etc/sudoers. Preferable a se connecter directement en root pour la tracabilite.',
    category: 'Linux',
    relatedChapter: 'utilisateurs-permissions'
  },
  {
    id: 'syslog',
    term: 'Syslog / journald',
    definition: 'Systeme de journalisation standardise sous Linux. Syslog ecrit dans /var/log/ (messages, auth.log, kern.log). journald (systemd) stocke les logs en binaire, consultables via journalctl.',
    category: 'Linux',
    relatedChapter: 'logs-systeme'
  },
  {
    id: 'bash-script',
    term: 'Script Bash',
    definition: 'Fichier texte contenant une suite de commandes shell executees sequentiellement. Commence par #!/bin/bash (shebang). Supporte les variables, boucles, conditions, fonctions et la gestion des arguments.',
    category: 'Linux',
    relatedChapter: 'scripting-bash'
  },
  {
    id: 'filesystem-linux',
    term: 'Systeme de fichiers Linux',
    definition: 'Hierarchie arborescente partant de / (racine). Repertoires cles : /etc (config), /var (donnees variables), /home (utilisateurs), /tmp (temporaire), /usr (programmes), /proc (processus virtuels).',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'pipe-redirection',
    term: 'Pipe et redirection',
    definition: 'Le pipe (|) envoie la sortie d\'une commande comme entree de la suivante. Redirections : > (ecraser), >> (ajouter), < (entree), 2> (erreurs). Fondamental pour le chainage de commandes Unix.',
    category: 'Linux',
    relatedChapter: 'commandes-linux-avancees'
  },
  {
    id: 'logrotate',
    term: 'Logrotate',
    definition: 'Utilitaire qui gere la rotation automatique des fichiers de logs pour eviter qu\'ils ne remplissent le disque. Configure la compression, la retention et la frequence de rotation via /etc/logrotate.d/.',
    category: 'Linux',
    relatedChapter: 'logs-systeme'
  },
  {
    id: 'umask',
    term: 'Umask',
    definition: 'Masque de creation de fichiers qui definit les permissions par defaut soustraites des permissions maximales (666 pour fichiers, 777 pour repertoires). Un umask de 022 donne des fichiers en 644.',
    category: 'Linux',
    relatedChapter: 'utilisateurs-permissions'
  },

  // ============================================================
  // === Git (~10 terms) ===
  // ============================================================
  {
    id: 'git',
    term: 'Git',
    definition: 'Systeme de controle de version distribue. Chaque developpeur possede l\'historique complet du depot. Concepts cles : staging, commit, branch, merge, rebase, remote, clone, pull, push.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'gitflow',
    term: 'GitFlow',
    definition: 'Modele de branching avec des branches main, develop, feature/*, release/* et hotfix/*. Adapte aux cycles de release planifies. Alternative : trunk-based development pour la CI/CD rapide.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'pull-request',
    term: 'Pull Request (PR) / Merge Request (MR)',
    definition: 'Mecanisme de revue de code. Un developpeur propose ses changements (branche feature) pour integration dans la branche principale. Permet review, CI automatique et discussion avant le merge.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'gitops',
    term: 'GitOps',
    definition: 'Paradigme ou Git est la source unique de verite pour l\'infrastructure et les deployments. Un operateur (ArgoCD, Flux) surveille le depot Git et synchronise automatiquement le cluster.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'semver',
    term: 'Semantic Versioning (SemVer)',
    definition: 'Schema de versioning MAJOR.MINOR.PATCH. MAJOR : changements incompatibles, MINOR : nouvelles fonctionnalites retro-compatibles, PATCH : corrections de bugs. Ex: 2.4.1.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'git-rebase',
    term: 'Rebase',
    definition: 'Operation Git qui reapplique les commits d\'une branche sur une autre base. Produit un historique lineaire contrairement au merge. Rebase interactif (git rebase -i) permet de reordonner ou squash les commits.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'git-stash',
    term: 'Git Stash',
    definition: 'Met de cote temporairement les modifications non commitees pour travailler sur autre chose. Commandes : git stash, git stash pop, git stash list. Utile pour changer de branche sans commiter.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'git-hook',
    term: 'Git Hook',
    definition: 'Script execute automatiquement lors d\'evenements Git (pre-commit, pre-push, post-merge). Permet d\'automatiser le linting, les tests et le formatage du code avant chaque commit ou push.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'trunk-based',
    term: 'Trunk-Based Development',
    definition: 'Strategie de branching ou tous les developpeurs commitent dans une branche principale unique (trunk/main) avec des branches de courte duree. Favorise l\'integration continue et les deploiements rapides.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'git-tag',
    term: 'Git Tag',
    definition: 'Reference nommee pointant vers un commit specifique, generalement utilisee pour marquer les versions (v1.0.0, v2.3.1). Tags annotes contiennent un message, un auteur et une date.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },

  // ============================================================
  // === Docker (~15 terms) ===
  // ============================================================
  {
    id: 'conteneur',
    term: 'Conteneur',
    definition: 'Unite d\'execution legere et isolee qui partage le noyau de l\'hote. Utilise les namespaces Linux (isolation PID, reseau, filesystem) et les cgroups (limitation CPU, memoire). Plus leger qu\'une VM.',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'image-docker',
    term: 'Image Docker',
    definition: 'Template immuable (en lecture seule) compose de couches (layers) contenant le code, les dependances et la configuration. Construite a partir d\'un Dockerfile. Stockee dans un registre (Docker Hub, ECR).',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'dockerfile',
    term: 'Dockerfile',
    definition: 'Fichier texte contenant les instructions pour construire une image Docker. Instructions principales : FROM (image de base), COPY, RUN, CMD, ENTRYPOINT, EXPOSE, ENV, WORKDIR.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },
  {
    id: 'docker-compose',
    term: 'Docker Compose',
    definition: 'Outil pour definir et executer des applications multi-conteneurs via un fichier docker-compose.yml. Gere les services, reseaux et volumes. Ideal pour le developpement local et les tests.',
    category: 'Docker',
    relatedChapter: 'docker-compose-devops'
  },
  {
    id: 'docker-volume',
    term: 'Volume Docker',
    definition: 'Mecanisme de persistance des donnees gere par Docker. Les volumes survivent a la suppression du conteneur. Types : volumes nommes, bind mounts, tmpfs. Commande : docker volume create/ls/rm.',
    category: 'Docker',
    relatedChapter: 'docker-volumes-reseaux'
  },
  {
    id: 'docker-network',
    term: 'Reseau Docker',
    definition: 'Systeme de mise en reseau des conteneurs. Drivers : bridge (defaut, communication locale), host (partage le reseau de l\'hote), overlay (multi-hote), none (pas de reseau).',
    category: 'Docker',
    relatedChapter: 'docker-volumes-reseaux'
  },
  {
    id: 'registry',
    term: 'Registre de conteneurs',
    definition: 'Service de stockage et distribution d\'images Docker. Docker Hub (public), Amazon ECR, Google GCR, Azure ACR, Harbor (self-hosted). Les images sont identifiees par nom:tag.',
    category: 'Docker',
    relatedChapter: 'docker-production'
  },
  {
    id: 'multi-stage-build',
    term: 'Multi-stage Build',
    definition: 'Technique Dockerfile utilisant plusieurs instructions FROM pour separer les etapes de build et de runtime. Produit des images finales plus petites en ne copiant que les artefacts necessaires.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },
  {
    id: 'namespaces',
    term: 'Namespaces Linux',
    definition: 'Mecanisme du noyau Linux fournissant l\'isolation des processus. Types : PID (processus), NET (reseau), MNT (points de montage), UTS (hostname), IPC (communication inter-processus), USER (utilisateurs).',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'cgroups',
    term: 'cgroups (Control Groups)',
    definition: 'Fonctionnalite du noyau Linux qui limite et comptabilise les ressources (CPU, memoire, I/O disque, reseau) utilisees par un groupe de processus. Fondation de la conteneurisation avec les namespaces.',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'docker-layer',
    term: 'Couche (Layer) Docker',
    definition: 'Chaque instruction du Dockerfile cree une couche en lecture seule empilee. Le cache des couches accelere les builds : seules les couches modifiees sont reconstruites. Ordonner les instructions du moins au plus changeant.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },
  {
    id: 'docker-healthcheck',
    term: 'Healthcheck Docker',
    definition: 'Instruction Dockerfile ou option docker run qui verifie periodiquement la sante d\'un conteneur via une commande. Les conteneurs unhealthy sont signales a l\'orchestrateur pour redemarrage.',
    category: 'Docker',
    relatedChapter: 'docker-production'
  },
  {
    id: 'docker-rootless',
    term: 'Docker Rootless',
    definition: 'Mode d\'execution de Docker sans privileges root, reduisant la surface d\'attaque. Le daemon et les conteneurs tournent dans l\'espace utilisateur. Recommande pour les environnements de production securises.',
    category: 'Docker',
    relatedChapter: 'securite-conteneurs'
  },
  {
    id: 'docker-scan',
    term: 'Scan d\'image Docker',
    definition: 'Analyse de securite des images pour detecter les vulnerabilites connues (CVE) dans l\'OS de base et les dependances. Outils : Trivy, Snyk, Docker Scout, Clair. A integrer dans le pipeline CI.',
    category: 'Docker',
    relatedChapter: 'securite-conteneurs'
  },
  {
    id: 'docker-entrypoint',
    term: 'ENTRYPOINT vs CMD',
    definition: 'ENTRYPOINT definit la commande principale du conteneur (non surchargeable facilement). CMD fournit les arguments par defaut. Combinaison courante : ENTRYPOINT ["app"] CMD ["--help"]. Forme exec [] preferee a la forme shell.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },

  // ============================================================
  // === Kubernetes (~15 terms) ===
  // ============================================================
  {
    id: 'kubernetes',
    term: 'Kubernetes (K8s)',
    definition: 'Plateforme open-source d\'orchestration de conteneurs (CNCF). Automatise le deploiement, le scaling, le self-healing et la gestion des applications conteneurisees sur un cluster de noeuds.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },
  {
    id: 'pod',
    term: 'Pod',
    definition: 'Plus petite unite deployable dans Kubernetes. Contient un ou plusieurs conteneurs partageant le meme namespace reseau (IP), stockage et contexte de securite.',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'deployment-k8s',
    term: 'Deployment',
    definition: 'Objet Kubernetes declaratif qui gere les ReplicaSets et les rolling updates. Definit l\'etat desire (image, replicas, ressources) et Kubernetes converge automatiquement vers cet etat.',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'service-k8s',
    term: 'Service Kubernetes',
    definition: 'Abstraction qui expose un ensemble de Pods via une IP stable et un nom DNS. Types : ClusterIP (interne), NodePort (port sur chaque noeud), LoadBalancer (cloud LB externe).',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'ingress',
    term: 'Ingress',
    definition: 'Objet Kubernetes qui gere l\'acces HTTP/HTTPS externe vers les Services. Supporte le routage par chemin et par nom de domaine, la terminaison TLS. Necessite un Ingress Controller (Nginx, Traefik).',
    category: 'Kubernetes',
    relatedChapter: 'ingress-controllers'
  },
  {
    id: 'hpa',
    term: 'HPA (Horizontal Pod Autoscaler)',
    definition: 'Objet Kubernetes qui ajuste automatiquement le nombre de replicas d\'un Deployment en fonction des metriques (CPU, memoire, metriques custom). Necessite le metrics-server.',
    category: 'Kubernetes',
    relatedChapter: 'scaling-autoscaling'
  },
  {
    id: 'helm',
    term: 'Helm',
    definition: 'Gestionnaire de packages pour Kubernetes. Utilise des "charts" (templates + values) pour packager, configurer et deployer des applications. Gere les releases et les rollbacks.',
    category: 'Kubernetes',
    relatedChapter: 'helm-charts'
  },
  {
    id: 'statefulset',
    term: 'StatefulSet',
    definition: 'Objet Kubernetes pour les applications avec etat (bases de donnees). Garantit un nom de pod stable (pod-0, pod-1), un stockage persistant unique par pod et un deploiement ordonne.',
    category: 'Kubernetes',
    relatedChapter: 'scaling-autoscaling'
  },
  {
    id: 'daemonset',
    term: 'DaemonSet',
    definition: 'Objet Kubernetes qui garantit qu\'un pod tourne sur chaque noeud du cluster (ou un sous-ensemble). Utilise pour les agents de monitoring, collecte de logs, plugins reseau.',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'etcd',
    term: 'etcd',
    definition: 'Base de donnees cle-valeur distribuee et consistante utilisee par Kubernetes pour stocker toute la configuration et l\'etat du cluster. Fait partie du control plane.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },
  {
    id: 'configmap',
    term: 'ConfigMap',
    definition: 'Objet Kubernetes pour stocker des donnees de configuration non sensibles sous forme de paires cle-valeur. Injectees dans les pods comme variables d\'environnement ou montees comme fichiers.',
    category: 'Kubernetes',
    relatedChapter: 'secrets-configmaps'
  },
  {
    id: 'secret-k8s',
    term: 'Secret Kubernetes',
    definition: 'Objet similaire a un ConfigMap mais pour les donnees sensibles (mots de passe, tokens, cles). Stocke en base64 (pas chiffre par defaut). Peut etre chiffre au repos avec EncryptionConfiguration.',
    category: 'Kubernetes',
    relatedChapter: 'secrets-configmaps'
  },
  {
    id: 'kubectl',
    term: 'kubectl',
    definition: 'Outil en ligne de commande officiel pour interagir avec un cluster Kubernetes. Commandes courantes : get, describe, apply, delete, logs, exec, port-forward. Configure via ~/.kube/config.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },
  {
    id: 'pv-pvc',
    term: 'PersistentVolume / PersistentVolumeClaim',
    definition: 'PV : ressource de stockage provisionnee dans le cluster. PVC : demande de stockage par un pod. Le PVC se lie a un PV correspondant aux criteres (taille, accessMode, storageClass).',
    category: 'Kubernetes',
    relatedChapter: 'scaling-autoscaling'
  },
  {
    id: 'kube-proxy',
    term: 'kube-proxy',
    definition: 'Composant reseau qui tourne sur chaque noeud et gere les regles de routage pour les Services Kubernetes. Utilise iptables ou IPVS pour rediriger le trafic vers les pods cibles.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },

  // ============================================================
  // === Reseau (~8 terms) ===
  // ============================================================
  {
    id: 'modele-osi-devops',
    term: 'Modele OSI',
    definition: 'Modele de reference a 7 couches (Physique, Liaison, Reseau, Transport, Session, Presentation, Application) decrivant la communication reseau. En DevOps, on travaille principalement sur les couches 3 (IP), 4 (TCP/UDP) et 7 (HTTP).',
    category: 'Reseau',
    relatedChapter: 'osi-tcpip-devops'
  },
  {
    id: 'cidr',
    term: 'CIDR (Classless Inter-Domain Routing)',
    definition: 'Notation de sous-reseau flexible (ex: 10.0.0.0/16). Remplace les classes d\'adresses. Le prefixe indique le nombre de bits fixes du reseau. Un /24 = 256 adresses, un /16 = 65 536 adresses.',
    category: 'Reseau',
    relatedChapter: 'ip-cidr-nat-dhcp'
  },
  {
    id: 'dns-devops',
    term: 'DNS (Domain Name System)',
    definition: 'Systeme hierarchique de resolution de noms de domaine en adresses IP. Types d\'enregistrements : A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification), SRV (services). TTL controle le cache.',
    category: 'Reseau',
    relatedChapter: 'dns-http-firewall'
  },
  {
    id: 'nat-devops',
    term: 'NAT (Network Address Translation)',
    definition: 'Technique qui traduit les adresses IP privees en adresses publiques pour l\'acces internet. SNAT (Source NAT) pour le trafic sortant, DNAT (Destination NAT) pour rediriger le trafic entrant.',
    category: 'Reseau',
    relatedChapter: 'ip-cidr-nat-dhcp'
  },
  {
    id: 'reverse-proxy',
    term: 'Reverse Proxy',
    definition: 'Serveur intermediaire qui recoit les requetes clients et les redirige vers les serveurs backend. Fonctions : terminaison SSL, cache, compression, load balancing, protection DDoS. Ex: Nginx, HAProxy, Traefik.',
    category: 'Reseau',
    relatedChapter: 'reverse-proxy-loadbalancing'
  },
  {
    id: 'load-balancer',
    term: 'Load Balancer',
    definition: 'Service qui repartit le trafic entrant entre plusieurs instances/serveurs. Couche 4 (TCP, ex: NLB) ou couche 7 (HTTP, ex: ALB). Algorithmes : round-robin, least connections, IP hash.',
    category: 'Reseau',
    relatedChapter: 'reverse-proxy-loadbalancing'
  },
  {
    id: 'firewall-devops',
    term: 'Firewall',
    definition: 'Systeme de securite filtrant le trafic reseau selon des regles. iptables/nftables (Linux), Security Groups (AWS), NSG (Azure). Principes : deny by default, moindre privilege, regles stateful vs stateless.',
    category: 'Reseau',
    relatedChapter: 'dns-http-firewall'
  },
  {
    id: 'tls-ssl',
    term: 'TLS/SSL',
    definition: 'Protocoles de chiffrement des communications reseau. TLS 1.3 est la version actuelle. Utilise des certificats X.509 pour l\'authentification. Let\'s Encrypt fournit des certificats gratuits et automatises.',
    category: 'Reseau',
    relatedChapter: 'dns-http-firewall'
  },

  // ============================================================
  // === CI/CD (~10 terms) ===
  // ============================================================
  {
    id: 'ci',
    term: 'CI (Continuous Integration)',
    definition: 'Pratique consistant a fusionner frequemment le code dans un depot partage avec build et tests automatiques a chaque commit. Detecte les regressions rapidement. Outils : GitHub Actions, GitLab CI, Jenkins.',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'cd',
    term: 'CD (Continuous Delivery/Deployment)',
    definition: 'Continuous Delivery : le code est automatiquement prepare pour la production (staging), deploye manuellement. Continuous Deployment : tout est automatique jusqu\'a la production sans intervention humaine.',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'pipeline',
    term: 'Pipeline CI/CD',
    definition: 'Enchainement automatise d\'etapes (build, test, scan, deploy) declenche par un evenement (commit, PR, tag). Defini en YAML (.github/workflows/, .gitlab-ci.yml) ou en Groovy (Jenkinsfile).',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'artefact',
    term: 'Artefact',
    definition: 'Resultat du processus de build : binaire compile, image Docker, package npm/pip, archive JAR/WAR. Stocke dans un registre ou un depot d\'artefacts (Artifactory, Nexus, ECR).',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'blue-green',
    term: 'Deploiement Blue-Green',
    definition: 'Strategie de deploiement utilisant deux environnements identiques (blue = actuel, green = nouveau). Le trafic est bascule vers green apres validation. Rollback instantane en rebasculant vers blue.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },
  {
    id: 'canary',
    term: 'Deploiement Canary',
    definition: 'Strategie de deploiement progressif : un petit pourcentage de trafic (5-10%) est dirige vers la nouvelle version. Si les metriques sont bonnes, le pourcentage augmente progressivement jusqu\'a 100%.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },
  {
    id: 'rolling-update',
    term: 'Rolling Update',
    definition: 'Strategie de deploiement ou les instances sont mises a jour progressivement (une par une ou par lots). Zero downtime car certaines instances restent disponibles pendant la mise a jour.',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'feature-flag',
    term: 'Feature Flag (Toggle)',
    definition: 'Mecanisme permettant d\'activer/desactiver une fonctionnalite en production sans redeployer. Permet le dark launching, les tests A/B et le rollback progressif. Outils : LaunchDarkly, Unleash.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },
  {
    id: 'github-actions',
    term: 'GitHub Actions',
    definition: 'Plateforme CI/CD integree a GitHub. Les workflows sont definis en YAML dans .github/workflows/. Concepts : events (push, PR), jobs, steps, actions reutilisables, secrets, runners (GitHub-hosted ou self-hosted).',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'jenkins',
    term: 'Jenkins',
    definition: 'Serveur d\'automatisation CI/CD open-source (Java). Pipeline-as-code via Jenkinsfile (Groovy). Architecture maitre/agents. Ecosysteme de 1 800+ plugins. Alternative self-hosted a GitHub Actions/GitLab CI.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },

  // ============================================================
  // === Cloud (~10 terms) ===
  // ============================================================
  {
    id: 'iaas',
    term: 'IaaS (Infrastructure as a Service)',
    definition: 'Modele cloud fournissant l\'infrastructure de base : machines virtuelles, stockage, reseau. Le client gere l\'OS et les applications. Ex: AWS EC2, Azure VMs, GCP Compute Engine.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'paas',
    term: 'PaaS (Platform as a Service)',
    definition: 'Modele cloud fournissant une plateforme de developpement : runtime, base de donnees, middleware. Le client ne gere que son code. Ex: Heroku, Google App Engine, Azure App Service.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'saas',
    term: 'SaaS (Software as a Service)',
    definition: 'Modele cloud fournissant une application complete accessible via navigateur. Le client ne gere rien. Ex: Gmail, Slack, Salesforce, Office 365.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'vpc',
    term: 'VPC (Virtual Private Cloud)',
    definition: 'Reseau virtuel isole dans le cloud avec des sous-reseaux, tables de routage, security groups et gateways. Permet de controler l\'architecture reseau des ressources cloud.',
    category: 'Cloud',
    relatedChapter: 'aws-services'
  },
  {
    id: 'serverless',
    term: 'Serverless',
    definition: 'Modele d\'execution ou le cloud gere l\'infrastructure et le scaling automatiquement. Le client ne paie que pour les executions. Ex: AWS Lambda, Azure Functions, GCP Cloud Functions.',
    category: 'Cloud',
    relatedChapter: 'aws-services'
  },
  {
    id: 'availability-zone',
    term: 'Availability Zone (AZ)',
    definition: 'Un ou plusieurs datacenters isoles (alimentation, reseau, refroidissement independants) dans une Region cloud. Deployer sur plusieurs AZ assure la haute disponibilite locale.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'iam',
    term: 'IAM (Identity and Access Management)',
    definition: 'Service de gestion des identites et des acces dans le cloud. Definit qui (utilisateurs, roles, services) peut faire quoi (permissions, politiques) sur quelles ressources. Principe du moindre privilege.',
    category: 'Cloud',
    relatedChapter: 'aws-services'
  },
  {
    id: 'terraform',
    term: 'Terraform',
    definition: 'Outil IaC open-source (HashiCorp) qui utilise HCL pour definir l\'infrastructure de maniere declarative. Multi-cloud (AWS, GCP, Azure). Workflow : init -> plan -> apply. State file pour le suivi.',
    category: 'Cloud',
    relatedChapter: 'terraform'
  },
  {
    id: 'cloudformation',
    term: 'CloudFormation',
    definition: 'Service IaC natif AWS utilisant des templates JSON ou YAML pour provisionner des ressources. Gere les stacks avec rollback automatique en cas d\'erreur. Alternative AWS a Terraform.',
    category: 'Cloud',
    relatedChapter: 'cloudformation-pulumi'
  },
  {
    id: 'cloud-region',
    term: 'Region Cloud',
    definition: 'Zone geographique contenant plusieurs Availability Zones. Chaque region est independante. Choix base sur la latence, la conformite reglementaire (RGPD) et la disponibilite des services.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },

  // ============================================================
  // === Monitoring (~8 terms) ===
  // ============================================================
  {
    id: 'prometheus',
    term: 'Prometheus',
    definition: 'Systeme de monitoring open-source (CNCF) qui collecte les metriques par scraping HTTP, les stocke en time-series et supporte PromQL pour les requetes et les alertes.',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'grafana',
    term: 'Grafana',
    definition: 'Plateforme de visualisation open-source. Cree des dashboards avec des graphiques pour les metriques (Prometheus, InfluxDB, CloudWatch) et les logs (Loki, Elasticsearch).',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'observabilite',
    term: 'Observabilite',
    definition: 'Capacite a comprendre l\'etat interne d\'un systeme a partir de ses sorties. Trois piliers : Metriques (donnees numeriques temporelles), Logs (evenements textuels), Traces (suivi des requetes distribuees).',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'elk-stack',
    term: 'ELK Stack',
    definition: 'Ensemble de trois outils pour la gestion des logs : Elasticsearch (moteur de recherche/indexation), Logstash (collecte et transformation), Kibana (visualisation). Alternative : Grafana Loki.',
    category: 'Monitoring',
    relatedChapter: 'elk-stack-logging'
  },
  {
    id: 'golden-signals',
    term: 'Golden Signals',
    definition: 'Quatre metriques essentielles definies par le Google SRE Book pour monitorer un service : Latence (temps de reponse), Trafic (charge), Erreurs (taux d\'echec), Saturation (utilisation des ressources).',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'opentelemetry',
    term: 'OpenTelemetry (OTel)',
    definition: 'Framework CNCF unifie pour la collecte de metriques, logs et traces. Fournit un SDK multi-langage et un collecteur. Standard ouvert compatible avec Prometheus, Jaeger, Grafana, Datadog.',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'tracing-distribue',
    term: 'Tracing distribue',
    definition: 'Technique qui suit le chemin d\'une requete a travers les microservices en utilisant un trace ID unique. Chaque service ajoute un span. Outils : Jaeger, Zipkin, OpenTelemetry.',
    category: 'Monitoring',
    relatedChapter: 'elk-stack-logging'
  },
  {
    id: 'alertmanager',
    term: 'Alertmanager',
    definition: 'Composant de Prometheus qui gere les alertes : deduplication, groupement, inhibition, routage vers les recepteurs (email, Slack, PagerDuty). Supporte le silencing temporaire.',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },

  // ============================================================
  // === Securite (~8 terms) ===
  // ============================================================
  {
    id: 'devsecops',
    term: 'DevSecOps',
    definition: 'Integration de la securite dans chaque etape du cycle DevOps. "Shift left" : tests de securite dans la CI, scan de vulnerabilites, gestion des secrets, compliance as code.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'sast',
    term: 'SAST (Static Application Security Testing)',
    definition: 'Analyse du code source sans l\'executer pour detecter les vulnerabilites (injections, XSS, buffer overflow). Outils : SonarQube, Semgrep, Snyk Code. S\'integre dans le pipeline CI.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'vault',
    term: 'HashiCorp Vault',
    definition: 'Solution de gestion centralisee des secrets. Stockage securise, rotation automatique, audit, controle d\'acces. S\'integre avec Kubernetes (CSI driver, sidecar), CI/CD et applications.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'trivy',
    term: 'Trivy',
    definition: 'Scanner de vulnerabilites open-source (Aqua Security). Scanne les images Docker, les fichiers IaC (Terraform, Kubernetes), le code source et les dependances. Rapide et sans configuration.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'zero-trust',
    term: 'Zero Trust',
    definition: 'Modele de securite "ne jamais faire confiance, toujours verifier". Chaque requete est authentifiee et autorisee, qu\'elle provienne de l\'interieur ou de l\'exterieur du reseau. Microsegmentation.',
    category: 'Securite',
    relatedChapter: 'securite-kubernetes-zerotrust'
  },
  {
    id: 'rbac',
    term: 'RBAC (Role-Based Access Control)',
    definition: 'Modele de controle d\'acces base sur les roles. Dans Kubernetes : Role/ClusterRole (permissions) + RoleBinding/ClusterRoleBinding (affectation aux utilisateurs/serviceAccounts).',
    category: 'Securite',
    relatedChapter: 'securite-kubernetes-zerotrust'
  },
  {
    id: 'secret-scanning',
    term: 'Secret Scanning',
    definition: 'Detection automatisee de secrets (mots de passe, tokens, cles API) commites accidentellement dans le code source ou l\'historique Git. Outils : GitLeaks, truffleHog, GitHub Secret Scanning.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'network-policy-k8s',
    term: 'Network Policy (Kubernetes)',
    definition: 'Objet Kubernetes qui controle le trafic reseau entre pods au niveau L3/L4. Permet de definir des regles d\'ingress et d\'egress par labels, namespaces ou blocs CIDR. Necessite un CNI compatible (Calico, Cilium).',
    category: 'Securite',
    relatedChapter: 'securite-kubernetes-zerotrust'
  },

  // ============================================================
  // === SRE (~5 terms) ===
  // ============================================================
  {
    id: 'sre',
    term: 'SRE (Site Reliability Engineering)',
    definition: 'Discipline originaire de Google qui applique les principes d\'ingenierie logicielle aux operations. Objectif : creer des systemes fiables et scalables via l\'automatisation, les SLO et l\'elimination du toil.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'slo',
    term: 'SLO (Service Level Objective)',
    definition: 'Objectif cible pour un SLI. Ex: 99.9% de disponibilite (8.76h d\'indisponibilite par an). Guide les decisions d\'ingenierie : quand deployer, quand se concentrer sur la fiabilite.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'sla',
    term: 'SLA (Service Level Agreement)',
    definition: 'Contrat juridique entre le fournisseur et le client definissant les engagements de service (base sur les SLO) avec des penalites financieres en cas de non-respect. Le SLO est generalement plus strict que le SLA.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'error-budget',
    term: 'Error Budget',
    definition: 'Quantite d\'indisponibilite toleree = 100% - SLO. Pour un SLO de 99.9%, le budget est 0.1% (43.8 min/mois). Tant qu\'il reste du budget, on peut deployer. Epuise = priorite fiabilite.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'post-mortem',
    term: 'Post-mortem (Blameless)',
    definition: 'Analyse d\'un incident sans accuser les individus. Documente la chronologie, les causes profondes, l\'impact, les actions correctives et les lecons apprises. Vise l\'amelioration continue.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
]
