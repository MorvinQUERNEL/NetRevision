import type { GlossaryTerm } from '../glossaryTerms'

export const glossaryTerms: GlossaryTerm[] = [
  // ============================================================
  // === Linux (~15 terms) ===
  // ============================================================
  {
    id: 'kernel',
    term: 'Kernel',
    definition: 'The core of the Linux operating system that manages hardware, memory, processes, and system calls. It acts as the interface between software and hardware. The Linux kernel is modular and monolithic.',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'shell',
    term: 'Shell',
    definition: 'A command interpreter that allows users to interact with the operating system via command lines. Bash is the most common shell on Linux. Alternatives include Zsh, Fish, and Dash.',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'permissions-unix',
    term: 'Unix Permissions (rwx)',
    definition: 'An access control system based on three levels (owner, group, others) and three types (read r, write w, execute x). Octal representation: chmod 755 = rwxr-xr-x.',
    category: 'Linux',
    relatedChapter: 'utilisateurs-permissions'
  },
  {
    id: 'systemd',
    term: 'systemd',
    definition: 'An init system and service manager for Linux. It boots the system, manages services (systemctl start/stop/enable), timers, logs (journalctl), and cgroups.',
    category: 'Linux',
    relatedChapter: 'systemd-services'
  },
  {
    id: 'processus',
    term: 'Process',
    definition: 'An instance of a running program. Each process has a PID (Process ID), a PPID (parent), file descriptors, and allocated resources. Commands: ps, top, htop, kill.',
    category: 'Linux',
    relatedChapter: 'commandes-linux-avancees'
  },
  {
    id: 'package-manager',
    term: 'Package Manager',
    definition: 'A tool to install, update, and remove software. apt/dpkg for Debian/Ubuntu, yum/dnf/rpm for RHEL/Fedora. Handles dependencies automatically.',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'cron',
    term: 'Cron / Crontab',
    definition: 'A Linux task scheduler that runs commands at regular intervals. Crontab syntax: minute hour day_of_month month day_of_week command. systemd alternative: timers.',
    category: 'Linux',
    relatedChapter: 'systemd-services'
  },
  {
    id: 'ssh',
    term: 'SSH (Secure Shell)',
    definition: 'A secure communication protocol (port 22) for remote server access. Uses asymmetric encryption for authentication (public/private keys) and symmetric encryption for the session.',
    category: 'Linux',
    relatedChapter: 'commandes-linux-avancees'
  },
  {
    id: 'sudo',
    term: 'sudo',
    definition: 'A command that allows an authorized user to execute a command with root privileges. Configured via the /etc/sudoers file. Preferred over logging in directly as root for traceability.',
    category: 'Linux',
    relatedChapter: 'utilisateurs-permissions'
  },
  {
    id: 'syslog',
    term: 'Syslog / journald',
    definition: 'A standardized logging system on Linux. Syslog writes to /var/log/ (messages, auth.log, kern.log). journald (systemd) stores logs in binary format, viewable via journalctl.',
    category: 'Linux',
    relatedChapter: 'logs-systeme'
  },
  {
    id: 'bash-script',
    term: 'Bash Script',
    definition: 'A text file containing a sequence of shell commands executed sequentially. Starts with #!/bin/bash (shebang). Supports variables, loops, conditionals, functions, and argument handling.',
    category: 'Linux',
    relatedChapter: 'scripting-bash'
  },
  {
    id: 'filesystem-linux',
    term: 'Linux Filesystem',
    definition: 'A tree-like hierarchy starting from / (root). Key directories: /etc (config), /var (variable data), /home (users), /tmp (temporary), /usr (programs), /proc (virtual processes).',
    category: 'Linux',
    relatedChapter: 'linux-installation'
  },
  {
    id: 'pipe-redirection',
    term: 'Pipe and Redirection',
    definition: 'The pipe (|) sends the output of one command as input to the next. Redirections: > (overwrite), >> (append), < (input), 2> (errors). Fundamental for chaining Unix commands.',
    category: 'Linux',
    relatedChapter: 'commandes-linux-avancees'
  },
  {
    id: 'logrotate',
    term: 'Logrotate',
    definition: 'A utility that manages automatic log file rotation to prevent them from filling up the disk. Configures compression, retention, and rotation frequency via /etc/logrotate.d/.',
    category: 'Linux',
    relatedChapter: 'logs-systeme'
  },
  {
    id: 'umask',
    term: 'Umask',
    definition: 'A file creation mask that defines default permissions subtracted from maximum permissions (666 for files, 777 for directories). A umask of 022 results in files with 644 permissions.',
    category: 'Linux',
    relatedChapter: 'utilisateurs-permissions'
  },

  // ============================================================
  // === Git (~10 terms) ===
  // ============================================================
  {
    id: 'git',
    term: 'Git',
    definition: 'A distributed version control system. Each developer has the complete repository history. Key concepts: staging, commit, branch, merge, rebase, remote, clone, pull, push.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'gitflow',
    term: 'GitFlow',
    definition: 'A branching model with main, develop, feature/*, release/*, and hotfix/* branches. Suited for planned release cycles. Alternative: trunk-based development for fast CI/CD.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'pull-request',
    term: 'Pull Request (PR) / Merge Request (MR)',
    definition: 'A code review mechanism. A developer proposes changes (feature branch) for integration into the main branch. Enables review, automatic CI, and discussion before merging.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'gitops',
    term: 'GitOps',
    definition: 'A paradigm where Git is the single source of truth for infrastructure and deployments. An operator (ArgoCD, Flux) watches the Git repository and automatically synchronizes the cluster.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'semver',
    term: 'Semantic Versioning (SemVer)',
    definition: 'A versioning scheme: MAJOR.MINOR.PATCH. MAJOR: incompatible changes, MINOR: new backward-compatible features, PATCH: bug fixes. Example: 2.4.1.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'git-rebase',
    term: 'Rebase',
    definition: 'A Git operation that reapplies commits from one branch onto another base. Produces a linear history unlike merge. Interactive rebase (git rebase -i) allows reordering or squashing commits.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'git-stash',
    term: 'Git Stash',
    definition: 'Temporarily shelves uncommitted changes to work on something else. Commands: git stash, git stash pop, git stash list. Useful for switching branches without committing.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },
  {
    id: 'git-hook',
    term: 'Git Hook',
    definition: 'A script executed automatically during Git events (pre-commit, pre-push, post-merge). Enables automating linting, testing, and code formatting before each commit or push.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'trunk-based',
    term: 'Trunk-Based Development',
    definition: 'A branching strategy where all developers commit to a single main branch (trunk/main) with short-lived branches. Promotes continuous integration and fast deployments.',
    category: 'Git',
    relatedChapter: 'github-gitlab-workflows'
  },
  {
    id: 'git-tag',
    term: 'Git Tag',
    definition: 'A named reference pointing to a specific commit, typically used to mark versions (v1.0.0, v2.3.1). Annotated tags contain a message, an author, and a date.',
    category: 'Git',
    relatedChapter: 'git-fondamentaux'
  },

  // ============================================================
  // === Docker (~15 terms) ===
  // ============================================================
  {
    id: 'conteneur',
    term: 'Container',
    definition: 'A lightweight, isolated execution unit that shares the host kernel. Uses Linux namespaces (PID, network, filesystem isolation) and cgroups (CPU, memory limits). Lighter than a VM.',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'image-docker',
    term: 'Docker Image',
    definition: 'An immutable (read-only) template made of layers containing code, dependencies, and configuration. Built from a Dockerfile. Stored in a registry (Docker Hub, ECR).',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'dockerfile',
    term: 'Dockerfile',
    definition: 'A text file containing instructions to build a Docker image. Main instructions: FROM (base image), COPY, RUN, CMD, ENTRYPOINT, EXPOSE, ENV, WORKDIR.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },
  {
    id: 'docker-compose',
    term: 'Docker Compose',
    definition: 'A tool to define and run multi-container applications via a docker-compose.yml file. Manages services, networks, and volumes. Ideal for local development and testing.',
    category: 'Docker',
    relatedChapter: 'docker-compose-devops'
  },
  {
    id: 'docker-volume',
    term: 'Docker Volume',
    definition: 'A data persistence mechanism managed by Docker. Volumes survive container deletion. Types: named volumes, bind mounts, tmpfs. Commands: docker volume create/ls/rm.',
    category: 'Docker',
    relatedChapter: 'docker-volumes-reseaux'
  },
  {
    id: 'docker-network',
    term: 'Docker Network',
    definition: 'A container networking system. Drivers: bridge (default, local communication), host (shares host network), overlay (multi-host), none (no network).',
    category: 'Docker',
    relatedChapter: 'docker-volumes-reseaux'
  },
  {
    id: 'registry',
    term: 'Container Registry',
    definition: 'A service for storing and distributing Docker images. Docker Hub (public), Amazon ECR, Google GCR, Azure ACR, Harbor (self-hosted). Images are identified by name:tag.',
    category: 'Docker',
    relatedChapter: 'docker-production'
  },
  {
    id: 'multi-stage-build',
    term: 'Multi-stage Build',
    definition: 'A Dockerfile technique using multiple FROM instructions to separate build and runtime stages. Produces smaller final images by copying only the necessary artifacts.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },
  {
    id: 'namespaces',
    term: 'Linux Namespaces',
    definition: 'A Linux kernel mechanism providing process isolation. Types: PID (processes), NET (network), MNT (mount points), UTS (hostname), IPC (inter-process communication), USER (users).',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'cgroups',
    term: 'cgroups (Control Groups)',
    definition: 'A Linux kernel feature that limits and accounts for resources (CPU, memory, disk I/O, network) used by a group of processes. A foundation of containerization alongside namespaces.',
    category: 'Docker',
    relatedChapter: 'conteneurs-introduction'
  },
  {
    id: 'docker-layer',
    term: 'Docker Layer',
    definition: 'Each Dockerfile instruction creates a read-only layer that is stacked. Layer caching speeds up builds: only modified layers are rebuilt. Order instructions from least to most frequently changed.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },
  {
    id: 'docker-healthcheck',
    term: 'Docker Healthcheck',
    definition: 'A Dockerfile instruction or docker run option that periodically checks a container\'s health via a command. Unhealthy containers are flagged for the orchestrator to restart.',
    category: 'Docker',
    relatedChapter: 'docker-production'
  },
  {
    id: 'docker-rootless',
    term: 'Docker Rootless',
    definition: 'A mode for running Docker without root privileges, reducing the attack surface. The daemon and containers run in user space. Recommended for secure production environments.',
    category: 'Docker',
    relatedChapter: 'securite-conteneurs'
  },
  {
    id: 'docker-scan',
    term: 'Docker Image Scan',
    definition: 'A security analysis of images to detect known vulnerabilities (CVEs) in the base OS and dependencies. Tools: Trivy, Snyk, Docker Scout, Clair. Should be integrated into the CI pipeline.',
    category: 'Docker',
    relatedChapter: 'securite-conteneurs'
  },
  {
    id: 'docker-entrypoint',
    term: 'ENTRYPOINT vs CMD',
    definition: 'ENTRYPOINT defines the main container command (not easily overridable). CMD provides default arguments. Common combination: ENTRYPOINT ["app"] CMD ["--help"]. Exec form [] preferred over shell form.',
    category: 'Docker',
    relatedChapter: 'dockerfile-optimise'
  },

  // ============================================================
  // === Kubernetes (~15 terms) ===
  // ============================================================
  {
    id: 'kubernetes',
    term: 'Kubernetes (K8s)',
    definition: 'An open-source container orchestration platform (CNCF). Automates deployment, scaling, self-healing, and management of containerized applications across a cluster of nodes.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },
  {
    id: 'pod',
    term: 'Pod',
    definition: 'The smallest deployable unit in Kubernetes. Contains one or more containers sharing the same network namespace (IP), storage, and security context.',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'deployment-k8s',
    term: 'Deployment',
    definition: 'A declarative Kubernetes object that manages ReplicaSets and rolling updates. Defines the desired state (image, replicas, resources) and Kubernetes automatically converges toward that state.',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'service-k8s',
    term: 'Kubernetes Service',
    definition: 'An abstraction that exposes a set of Pods via a stable IP and DNS name. Types: ClusterIP (internal), NodePort (port on each node), LoadBalancer (external cloud LB).',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'ingress',
    term: 'Ingress',
    definition: 'A Kubernetes object that manages external HTTP/HTTPS access to Services. Supports path-based and host-based routing, TLS termination. Requires an Ingress Controller (Nginx, Traefik).',
    category: 'Kubernetes',
    relatedChapter: 'ingress-controllers'
  },
  {
    id: 'hpa',
    term: 'HPA (Horizontal Pod Autoscaler)',
    definition: 'A Kubernetes object that automatically adjusts the number of Deployment replicas based on metrics (CPU, memory, custom metrics). Requires the metrics-server.',
    category: 'Kubernetes',
    relatedChapter: 'scaling-autoscaling'
  },
  {
    id: 'helm',
    term: 'Helm',
    definition: 'A package manager for Kubernetes. Uses "charts" (templates + values) to package, configure, and deploy applications. Manages releases and rollbacks.',
    category: 'Kubernetes',
    relatedChapter: 'helm-charts'
  },
  {
    id: 'statefulset',
    term: 'StatefulSet',
    definition: 'A Kubernetes object for stateful applications (databases). Guarantees stable pod names (pod-0, pod-1), unique persistent storage per pod, and ordered deployment.',
    category: 'Kubernetes',
    relatedChapter: 'scaling-autoscaling'
  },
  {
    id: 'daemonset',
    term: 'DaemonSet',
    definition: 'A Kubernetes object that ensures a pod runs on every node in the cluster (or a subset). Used for monitoring agents, log collection, and network plugins.',
    category: 'Kubernetes',
    relatedChapter: 'pods-deployments-services'
  },
  {
    id: 'etcd',
    term: 'etcd',
    definition: 'A distributed, consistent key-value database used by Kubernetes to store all cluster configuration and state. Part of the control plane.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },
  {
    id: 'configmap',
    term: 'ConfigMap',
    definition: 'A Kubernetes object for storing non-sensitive configuration data as key-value pairs. Injected into pods as environment variables or mounted as files.',
    category: 'Kubernetes',
    relatedChapter: 'secrets-configmaps'
  },
  {
    id: 'secret-k8s',
    term: 'Kubernetes Secret',
    definition: 'An object similar to a ConfigMap but for sensitive data (passwords, tokens, keys). Stored in base64 (not encrypted by default). Can be encrypted at rest with EncryptionConfiguration.',
    category: 'Kubernetes',
    relatedChapter: 'secrets-configmaps'
  },
  {
    id: 'kubectl',
    term: 'kubectl',
    definition: 'The official command-line tool for interacting with a Kubernetes cluster. Common commands: get, describe, apply, delete, logs, exec, port-forward. Configured via ~/.kube/config.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },
  {
    id: 'pv-pvc',
    term: 'PersistentVolume / PersistentVolumeClaim',
    definition: 'PV: a storage resource provisioned in the cluster. PVC: a storage request by a pod. The PVC binds to a PV matching the criteria (size, accessMode, storageClass).',
    category: 'Kubernetes',
    relatedChapter: 'scaling-autoscaling'
  },
  {
    id: 'kube-proxy',
    term: 'kube-proxy',
    definition: 'A network component running on each node that manages routing rules for Kubernetes Services. Uses iptables or IPVS to redirect traffic to target pods.',
    category: 'Kubernetes',
    relatedChapter: 'kubernetes-architecture'
  },

  // ============================================================
  // === Network (~8 terms) ===
  // ============================================================
  {
    id: 'modele-osi-devops',
    term: 'OSI Model',
    definition: 'A 7-layer reference model (Physical, Data Link, Network, Transport, Session, Presentation, Application) describing network communication. In DevOps, work primarily involves layers 3 (IP), 4 (TCP/UDP), and 7 (HTTP).',
    category: 'Reseau',
    relatedChapter: 'osi-tcpip-devops'
  },
  {
    id: 'cidr',
    term: 'CIDR (Classless Inter-Domain Routing)',
    definition: 'A flexible subnet notation (e.g., 10.0.0.0/16). Replaces classful addressing. The prefix indicates the number of fixed network bits. A /24 = 256 addresses, a /16 = 65,536 addresses.',
    category: 'Reseau',
    relatedChapter: 'ip-cidr-nat-dhcp'
  },
  {
    id: 'dns-devops',
    term: 'DNS (Domain Name System)',
    definition: 'A hierarchical system for resolving domain names into IP addresses. Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification), SRV (services). TTL controls caching.',
    category: 'Reseau',
    relatedChapter: 'dns-http-firewall'
  },
  {
    id: 'nat-devops',
    term: 'NAT (Network Address Translation)',
    definition: 'A technique that translates private IP addresses to public addresses for internet access. SNAT (Source NAT) for outbound traffic, DNAT (Destination NAT) to redirect inbound traffic.',
    category: 'Reseau',
    relatedChapter: 'ip-cidr-nat-dhcp'
  },
  {
    id: 'reverse-proxy',
    term: 'Reverse Proxy',
    definition: 'An intermediary server that receives client requests and forwards them to backend servers. Features: SSL termination, caching, compression, load balancing, DDoS protection. Examples: Nginx, HAProxy, Traefik.',
    category: 'Reseau',
    relatedChapter: 'reverse-proxy-loadbalancing'
  },
  {
    id: 'load-balancer',
    term: 'Load Balancer',
    definition: 'A service that distributes incoming traffic across multiple instances/servers. Layer 4 (TCP, e.g., NLB) or Layer 7 (HTTP, e.g., ALB). Algorithms: round-robin, least connections, IP hash.',
    category: 'Reseau',
    relatedChapter: 'reverse-proxy-loadbalancing'
  },
  {
    id: 'firewall-devops',
    term: 'Firewall',
    definition: 'A security system that filters network traffic based on rules. iptables/nftables (Linux), Security Groups (AWS), NSG (Azure). Principles: deny by default, least privilege, stateful vs stateless rules.',
    category: 'Reseau',
    relatedChapter: 'dns-http-firewall'
  },
  {
    id: 'tls-ssl',
    term: 'TLS/SSL',
    definition: 'Network communication encryption protocols. TLS 1.3 is the current version. Uses X.509 certificates for authentication. Let\'s Encrypt provides free, automated certificates.',
    category: 'Reseau',
    relatedChapter: 'dns-http-firewall'
  },

  // ============================================================
  // === CI/CD (~10 terms) ===
  // ============================================================
  {
    id: 'ci',
    term: 'CI (Continuous Integration)',
    definition: 'The practice of frequently merging code into a shared repository with automatic builds and tests on each commit. Detects regressions quickly. Tools: GitHub Actions, GitLab CI, Jenkins.',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'cd',
    term: 'CD (Continuous Delivery/Deployment)',
    definition: 'Continuous Delivery: code is automatically prepared for production (staging), deployed manually. Continuous Deployment: everything is automated all the way to production without human intervention.',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'pipeline',
    term: 'CI/CD Pipeline',
    definition: 'An automated chain of steps (build, test, scan, deploy) triggered by an event (commit, PR, tag). Defined in YAML (.github/workflows/, .gitlab-ci.yml) or Groovy (Jenkinsfile).',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'artefact',
    term: 'Artifact',
    definition: 'The result of the build process: compiled binary, Docker image, npm/pip package, JAR/WAR archive. Stored in a registry or artifact repository (Artifactory, Nexus, ECR).',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'blue-green',
    term: 'Blue-Green Deployment',
    definition: 'A deployment strategy using two identical environments (blue = current, green = new). Traffic is switched to green after validation. Instant rollback by switching back to blue.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },
  {
    id: 'canary',
    term: 'Canary Deployment',
    definition: 'A progressive deployment strategy: a small percentage of traffic (5-10%) is directed to the new version. If metrics look good, the percentage gradually increases to 100%.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },
  {
    id: 'rolling-update',
    term: 'Rolling Update',
    definition: 'A deployment strategy where instances are updated progressively (one by one or in batches). Zero downtime because some instances remain available during the update.',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'feature-flag',
    term: 'Feature Flag (Toggle)',
    definition: 'A mechanism to enable/disable a feature in production without redeploying. Allows dark launching, A/B testing, and progressive rollback. Tools: LaunchDarkly, Unleash.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },
  {
    id: 'github-actions',
    term: 'GitHub Actions',
    definition: 'A CI/CD platform integrated into GitHub. Workflows are defined in YAML in .github/workflows/. Concepts: events (push, PR), jobs, steps, reusable actions, secrets, runners (GitHub-hosted or self-hosted).',
    category: 'CI/CD',
    relatedChapter: 'cicd-github-actions'
  },
  {
    id: 'jenkins',
    term: 'Jenkins',
    definition: 'An open-source CI/CD automation server (Java). Pipeline-as-code via Jenkinsfile (Groovy). Master/agent architecture. Ecosystem of 1,800+ plugins. Self-hosted alternative to GitHub Actions/GitLab CI.',
    category: 'CI/CD',
    relatedChapter: 'gitlab-ci-jenkins'
  },

  // ============================================================
  // === Cloud (~10 terms) ===
  // ============================================================
  {
    id: 'iaas',
    term: 'IaaS (Infrastructure as a Service)',
    definition: 'A cloud model providing basic infrastructure: virtual machines, storage, networking. The customer manages the OS and applications. Examples: AWS EC2, Azure VMs, GCP Compute Engine.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'paas',
    term: 'PaaS (Platform as a Service)',
    definition: 'A cloud model providing a development platform: runtime, database, middleware. The customer only manages their code. Examples: Heroku, Google App Engine, Azure App Service.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'saas',
    term: 'SaaS (Software as a Service)',
    definition: 'A cloud model providing a complete application accessible via a browser. The customer manages nothing. Examples: Gmail, Slack, Salesforce, Office 365.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'vpc',
    term: 'VPC (Virtual Private Cloud)',
    definition: 'An isolated virtual network in the cloud with subnets, route tables, security groups, and gateways. Allows controlling the network architecture of cloud resources.',
    category: 'Cloud',
    relatedChapter: 'aws-services'
  },
  {
    id: 'serverless',
    term: 'Serverless',
    definition: 'An execution model where the cloud manages infrastructure and scaling automatically. The customer only pays for executions. Examples: AWS Lambda, Azure Functions, GCP Cloud Functions.',
    category: 'Cloud',
    relatedChapter: 'aws-services'
  },
  {
    id: 'availability-zone',
    term: 'Availability Zone (AZ)',
    definition: 'One or more isolated data centers (independent power, networking, cooling) within a cloud Region. Deploying across multiple AZs ensures local high availability.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },
  {
    id: 'iam',
    term: 'IAM (Identity and Access Management)',
    definition: 'A cloud service for managing identities and access. Defines who (users, roles, services) can do what (permissions, policies) on which resources. Principle of least privilege.',
    category: 'Cloud',
    relatedChapter: 'aws-services'
  },
  {
    id: 'terraform',
    term: 'Terraform',
    definition: 'An open-source IaC tool (HashiCorp) that uses HCL to declaratively define infrastructure. Multi-cloud (AWS, GCP, Azure). Workflow: init -> plan -> apply. State file for tracking.',
    category: 'Cloud',
    relatedChapter: 'terraform'
  },
  {
    id: 'cloudformation',
    term: 'CloudFormation',
    definition: 'An AWS-native IaC service using JSON or YAML templates to provision resources. Manages stacks with automatic rollback on failure. AWS alternative to Terraform.',
    category: 'Cloud',
    relatedChapter: 'cloudformation-pulumi'
  },
  {
    id: 'cloud-region',
    term: 'Cloud Region',
    definition: 'A geographic area containing multiple Availability Zones. Each region is independent. Selection based on latency, regulatory compliance (GDPR), and service availability.',
    category: 'Cloud',
    relatedChapter: 'cloud-fondamentaux'
  },

  // ============================================================
  // === Monitoring (~8 terms) ===
  // ============================================================
  {
    id: 'prometheus',
    term: 'Prometheus',
    definition: 'An open-source monitoring system (CNCF) that collects metrics by HTTP scraping, stores them as time-series, and supports PromQL for queries and alerting.',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'grafana',
    term: 'Grafana',
    definition: 'An open-source visualization platform. Creates dashboards with charts for metrics (Prometheus, InfluxDB, CloudWatch) and logs (Loki, Elasticsearch).',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'observabilite',
    term: 'Observability',
    definition: 'The ability to understand a system\'s internal state from its outputs. Three pillars: Metrics (time-series numerical data), Logs (textual events), Traces (distributed request tracking).',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'elk-stack',
    term: 'ELK Stack',
    definition: 'A suite of three tools for log management: Elasticsearch (search/indexing engine), Logstash (collection and transformation), Kibana (visualization). Alternative: Grafana Loki.',
    category: 'Monitoring',
    relatedChapter: 'elk-stack-logging'
  },
  {
    id: 'golden-signals',
    term: 'Golden Signals',
    definition: 'Four essential metrics defined by the Google SRE Book for monitoring a service: Latency (response time), Traffic (load), Errors (failure rate), Saturation (resource utilization).',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'opentelemetry',
    term: 'OpenTelemetry (OTel)',
    definition: 'A unified CNCF framework for collecting metrics, logs, and traces. Provides a multi-language SDK and a collector. Open standard compatible with Prometheus, Jaeger, Grafana, Datadog.',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },
  {
    id: 'tracing-distribue',
    term: 'Distributed Tracing',
    definition: 'A technique that follows a request\'s path through microservices using a unique trace ID. Each service adds a span. Tools: Jaeger, Zipkin, OpenTelemetry.',
    category: 'Monitoring',
    relatedChapter: 'elk-stack-logging'
  },
  {
    id: 'alertmanager',
    term: 'Alertmanager',
    definition: 'A Prometheus component that manages alerts: deduplication, grouping, inhibition, routing to receivers (email, Slack, PagerDuty). Supports temporary silencing.',
    category: 'Monitoring',
    relatedChapter: 'prometheus-grafana'
  },

  // ============================================================
  // === Security (~8 terms) ===
  // ============================================================
  {
    id: 'devsecops',
    term: 'DevSecOps',
    definition: 'Integrating security into every stage of the DevOps lifecycle. "Shift left": security testing in CI, vulnerability scanning, secret management, compliance as code.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'sast',
    term: 'SAST (Static Application Security Testing)',
    definition: 'Analyzing source code without executing it to detect vulnerabilities (injections, XSS, buffer overflow). Tools: SonarQube, Semgrep, Snyk Code. Integrates into the CI pipeline.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'vault',
    term: 'HashiCorp Vault',
    definition: 'A centralized secrets management solution. Secure storage, automatic rotation, auditing, access control. Integrates with Kubernetes (CSI driver, sidecar), CI/CD, and applications.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'trivy',
    term: 'Trivy',
    definition: 'An open-source vulnerability scanner (Aqua Security). Scans Docker images, IaC files (Terraform, Kubernetes), source code, and dependencies. Fast and zero-configuration.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'zero-trust',
    term: 'Zero Trust',
    definition: 'A security model based on "never trust, always verify." Every request is authenticated and authorized, whether from inside or outside the network. Microsegmentation.',
    category: 'Securite',
    relatedChapter: 'securite-kubernetes-zerotrust'
  },
  {
    id: 'rbac',
    term: 'RBAC (Role-Based Access Control)',
    definition: 'A role-based access control model. In Kubernetes: Role/ClusterRole (permissions) + RoleBinding/ClusterRoleBinding (assignment to users/serviceAccounts).',
    category: 'Securite',
    relatedChapter: 'securite-kubernetes-zerotrust'
  },
  {
    id: 'secret-scanning',
    term: 'Secret Scanning',
    definition: 'Automated detection of secrets (passwords, tokens, API keys) accidentally committed in source code or Git history. Tools: GitLeaks, truffleHog, GitHub Secret Scanning.',
    category: 'Securite',
    relatedChapter: 'devsecops-secrets'
  },
  {
    id: 'network-policy-k8s',
    term: 'Network Policy (Kubernetes)',
    definition: 'A Kubernetes object that controls network traffic between pods at L3/L4. Allows defining ingress and egress rules by labels, namespaces, or CIDR blocks. Requires a compatible CNI (Calico, Cilium).',
    category: 'Securite',
    relatedChapter: 'securite-kubernetes-zerotrust'
  },

  // ============================================================
  // === SRE (~5 terms) ===
  // ============================================================
  {
    id: 'sre',
    term: 'SRE (Site Reliability Engineering)',
    definition: 'A discipline originating from Google that applies software engineering principles to operations. Goal: create reliable and scalable systems through automation, SLOs, and toil elimination.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'slo',
    term: 'SLO (Service Level Objective)',
    definition: 'A target objective for an SLI. Example: 99.9% availability (8.76 hours of downtime per year). Guides engineering decisions: when to deploy, when to focus on reliability.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'sla',
    term: 'SLA (Service Level Agreement)',
    definition: 'A legal contract between provider and customer defining service commitments (based on SLOs) with financial penalties for non-compliance. The SLO is generally stricter than the SLA.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'error-budget',
    term: 'Error Budget',
    definition: 'The tolerated amount of downtime = 100% - SLO. For a 99.9% SLO, the budget is 0.1% (43.8 min/month). As long as budget remains, deployments can proceed. Exhausted = reliability priority.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
  {
    id: 'post-mortem',
    term: 'Post-mortem (Blameless)',
    definition: 'An incident analysis without blaming individuals. Documents the timeline, root causes, impact, corrective actions, and lessons learned. Aims for continuous improvement.',
    category: 'SRE',
    relatedChapter: 'sre-sla-incidents'
  },
]
