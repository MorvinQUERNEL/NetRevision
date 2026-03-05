import type { Chapter } from '../chapters'

export const chapters: Chapter[] = [
  {
    id: 100,
    slug: 'linux-installation',
    title: 'Installation & Gestion Ubuntu/Debian/CentOS',
    subtitle: 'Choisir, installer et configurer une distribution Linux adaptee a un environnement DevOps',
    icon: 'Monitor',
    color: '#f97316',
    duration: '30 min',
    level: 'Debutant',
    videoId: '9vvUgpKfJ3c',
    sections: [
      {
        title: 'Choix de la distribution',
        content: `Le choix d'une distribution Linux est la premiere decision importante dans un parcours DevOps. Chaque distribution a ses specificites, sa communaute et ses cas d'usage privilegies.

### Les grandes familles

| Famille | Distributions | Gestionnaire de paquets | Usage principal |
|---------|--------------|------------------------|-----------------|
| **Debian** | Debian, Ubuntu, Linux Mint | apt / dpkg | Serveurs, postes de travail |
| **Red Hat** | RHEL, CentOS, Fedora, AlmaLinux, Rocky Linux | dnf / yum / rpm | Entreprise, production |
| **Arch** | Arch Linux, Manjaro | pacman | Utilisateurs avances |
| **SUSE** | openSUSE, SLES | zypper / rpm | Entreprise europeenne |

### Ubuntu Server vs Debian

**Ubuntu Server** est recommande pour debuter en DevOps :
- Cycle de release previsible : **LTS** (Long Term Support) tous les 2 ans, supporte 5 ans
- Documentation abondante et communaute active
- Compatible avec la majorite des outils DevOps (Docker, Ansible, Terraform...)
- Version actuelle LTS : **Ubuntu 24.04 (Noble Numbat)**

**Debian** est prefere pour les serveurs de production stables :
- Cycle de release plus lent, stabilite maximale
- Moins de paquets recents mais **extrêmement fiable**
- Base de Ubuntu (Ubuntu est derive de Debian)

### CentOS / RHEL / AlmaLinux

**CentOS** etait le clone gratuit de Red Hat Enterprise Linux (RHEL). Depuis la fin de CentOS 8, deux alternatives majeures :
- **AlmaLinux** : fork communautaire 1:1 de RHEL, gratuit
- **Rocky Linux** : fonde par le createur original de CentOS

> **Conseil DevOps :** En production, privilegiez **Ubuntu LTS** ou **AlmaLinux/Rocky** pour la stabilite et le support long terme. Evitez les distributions "rolling release" (Arch, Fedora) sur des serveurs.

### Criteres de choix

1. **Support long terme** : combien de temps les mises a jour de securite sont fournies ?
2. **Ecosysteme de paquets** : les outils DevOps sont-ils facilement installables ?
3. **Compatibilite** : Docker, Kubernetes, Ansible fonctionnent-ils nativement ?
4. **Documentation** : la communaute est-elle active et les guides disponibles ?
5. **Certification** : RHEL est souvent requis en entreprise (certification RHCSA)`
      },
      {
        title: 'Installation de Linux',
        content: `L'installation d'un serveur Linux peut se faire de plusieurs manieres selon le contexte DevOps.

### Methodes d'installation

| Methode | Description | Cas d'usage |
|---------|-------------|-------------|
| **ISO bootable** | Installation classique via USB/CD | Serveur physique, VM manuelle |
| **Cloud image** | Image preconstruite (AMI, qcow2) | AWS, GCP, Azure, OpenStack |
| **Vagrant** | VM automatisee via Vagrantfile | Environnement de dev local |
| **Docker** | Conteneur Linux leger | Tests rapides, CI/CD |
| **PXE / Kickstart** | Installation reseau automatisee | Deploiement en masse |

### Installation Ubuntu Server (etapes cles)

\`\`\`bash
# 1. Telecharger l'ISO Ubuntu Server LTS
# https://ubuntu.com/download/server

# 2. Creer une cle USB bootable
# Sur Linux/macOS :
sudo dd if=ubuntu-24.04-live-server-amd64.iso of=/dev/sdX bs=4M status=progress

# 3. Demarrer sur la cle USB et suivre l'installateur
# Choix importants :
# - Partitionnement : LVM recommande (redimensionnement facile)
# - OpenSSH Server : TOUJOURS installer
# - Pas d'interface graphique sur un serveur
\`\`\`

### Partitionnement recommande (serveur)

| Partition | Taille | Systeme de fichiers | Justification |
|-----------|--------|--------------------|--------------------|
| \`/boot\` | 1 Go | ext4 | Noyaux et GRUB |
| \`/\` | 20-50 Go | ext4 / xfs | Systeme de base |
| \`/home\` | Variable | ext4 | Donnees utilisateurs |
| \`/var\` | 20+ Go | ext4 / xfs | Logs, Docker, bases de donnees |
| \`swap\` | 2-4 Go | swap | Memoire virtuelle |

> **Bonne pratique DevOps :** Utilisez **LVM** (Logical Volume Manager) pour pouvoir redimensionner les partitions sans reinstallation. La partition \`/var\` est critique car Docker y stocke ses images et conteneurs (\`/var/lib/docker\`).

### Installation via Vagrant (dev local)

\`\`\`ruby
# Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/noble64"
  config.vm.hostname = "devops-lab"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
  end
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y docker.io git curl
  SHELL
end
\`\`\`

\`\`\`bash
# Lancer la VM
vagrant up
vagrant ssh
\`\`\``
      },
      {
        title: 'Gestionnaires de paquets (apt, dnf, yum)',
        content: `Le gestionnaire de paquets est l'outil central pour installer, mettre a jour et supprimer des logiciels sur Linux. En DevOps, sa maitrise est indispensable.

### APT (Debian / Ubuntu)

\`apt\` (Advanced Package Tool) est le gestionnaire de paquets des distributions Debian.

\`\`\`bash
# Mettre a jour la liste des paquets disponibles
sudo apt update

# Mettre a jour tous les paquets installes
sudo apt upgrade -y

# Installer un paquet
sudo apt install nginx -y

# Supprimer un paquet (garder la config)
sudo apt remove nginx

# Supprimer un paquet ET sa configuration
sudo apt purge nginx

# Supprimer les dependances orphelines
sudo apt autoremove -y

# Rechercher un paquet
apt search docker

# Afficher les informations d'un paquet
apt show nginx

# Lister les paquets installes
apt list --installed
\`\`\`

### DNF (Fedora / RHEL 8+ / AlmaLinux / Rocky)

\`dnf\` (Dandified YUM) remplace \`yum\` depuis RHEL 8 / Fedora 22.

\`\`\`bash
# Mettre a jour
sudo dnf update -y

# Installer un paquet
sudo dnf install nginx -y

# Supprimer un paquet
sudo dnf remove nginx

# Rechercher
dnf search docker

# Lister les depots actifs
dnf repolist

# Installer un groupe de paquets
sudo dnf groupinstall "Development Tools"

# Historique des operations
dnf history
\`\`\`

### YUM (CentOS 7 / RHEL 7)

\`yum\` est l'ancien gestionnaire, encore present sur CentOS 7.

\`\`\`bash
sudo yum update -y
sudo yum install httpd -y
sudo yum remove httpd
yum search php
\`\`\`

### Comparaison rapide

| Action | apt (Debian) | dnf (RHEL 8+) | yum (RHEL 7) |
|--------|-------------|---------------|--------------|
| Mise a jour index | \`apt update\` | \`dnf check-update\` | \`yum check-update\` |
| Mise a jour paquets | \`apt upgrade\` | \`dnf update\` | \`yum update\` |
| Installer | \`apt install\` | \`dnf install\` | \`yum install\` |
| Supprimer | \`apt remove\` | \`dnf remove\` | \`yum remove\` |
| Rechercher | \`apt search\` | \`dnf search\` | \`yum search\` |
| Info paquet | \`apt show\` | \`dnf info\` | \`yum info\` |

> **Astuce :** Sur les systemes modernes RHEL, \`yum\` est un alias vers \`dnf\`. Les deux commandes fonctionnent de maniere identique.

### Depots additionnels

\`\`\`bash
# Ubuntu : ajouter un PPA (Personal Package Archive)
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update

# RHEL/AlmaLinux : activer EPEL (Extra Packages for Enterprise Linux)
sudo dnf install epel-release -y
\`\`\``
      },
      {
        title: 'Configuration post-installation',
        content: `Apres l'installation de Linux, plusieurs etapes de configuration sont essentielles pour preparer un serveur DevOps fonctionnel et securise.

### 1. Mise a jour complete du systeme

\`\`\`bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

# RHEL/AlmaLinux
sudo dnf update -y
\`\`\`

### 2. Configuration du hostname

\`\`\`bash
# Definir le hostname
sudo hostnamectl set-hostname devops-srv01

# Verifier
hostnamectl

# Ajouter dans /etc/hosts
echo "127.0.1.1  devops-srv01" | sudo tee -a /etc/hosts
\`\`\`

### 3. Configuration reseau (Netplan sur Ubuntu)

\`\`\`yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
\`\`\`

\`\`\`bash
# Appliquer la configuration
sudo netplan apply
\`\`\`

### 4. Configuration SSH securisee

\`\`\`bash
# Editer la configuration SSH
sudo nano /etc/ssh/sshd_config

# Parametres recommandes :
# Port 2222                      # Changer le port par defaut
# PermitRootLogin no             # Interdire le login root
# PasswordAuthentication no      # Desactiver les mots de passe
# PubkeyAuthentication yes       # Autoriser les cles SSH
# MaxAuthTries 3                 # Limiter les tentatives

# Redemarrer SSH
sudo systemctl restart sshd
\`\`\`

### 5. Configuration du pare-feu (UFW / firewalld)

\`\`\`bash
# Ubuntu (UFW)
sudo ufw allow 2222/tcp      # SSH (port personnalise)
sudo ufw allow 80/tcp        # HTTP
sudo ufw allow 443/tcp       # HTTPS
sudo ufw enable
sudo ufw status verbose

# RHEL/AlmaLinux (firewalld)
sudo firewall-cmd --permanent --add-port=2222/tcp
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
\`\`\`

### 6. Configuration du fuseau horaire et NTP

\`\`\`bash
# Definir le fuseau horaire
sudo timedatectl set-timezone Europe/Paris

# Activer la synchronisation NTP
sudo timedatectl set-ntp true

# Verifier
timedatectl
\`\`\`

### 7. Outils de base DevOps a installer

\`\`\`bash
# Outils essentiels
sudo apt install -y \\
  curl wget git vim htop tree \\
  net-tools dnsutils iputils-ping \\
  unzip jq ca-certificates \\
  software-properties-common

# Docker (methode officielle)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
\`\`\`

> **Checklist post-installation :**
> 1. Systeme a jour
> 2. Hostname configure
> 3. IP statique (si serveur)
> 4. SSH securise (cle + port non-standard)
> 5. Pare-feu actif
> 6. NTP synchronise
> 7. Outils de base installes`
      }
    ]
  },
  {
    id: 101,
    slug: 'commandes-linux-avancees',
    title: 'Commandes Linux Avancees',
    subtitle: 'Maitriser le terminal Linux avec les commandes essentielles pour le DevOps',
    icon: 'Terminal',
    color: '#f97316',
    duration: '35 min',
    level: 'Debutant',
    videoId: '6rxwGTIPpjA',
    sections: [
      {
        title: 'Navigation dans le systeme de fichiers',
        content: `La navigation dans l'arborescence Linux est la base de toute operation en DevOps. Le systeme de fichiers Linux suit la norme **FHS** (Filesystem Hierarchy Standard).

### Arborescence Linux standard

\`\`\`
/                     # Racine du systeme
├── bin/              # Binaires essentiels (ls, cp, mv...)
├── sbin/             # Binaires systeme (iptables, fdisk...)
├── etc/              # Fichiers de configuration
├── home/             # Repertoires utilisateurs
├── var/              # Donnees variables (logs, cache, Docker)
│   ├── log/          # Fichiers de log
│   ├── lib/          # Donnees applicatives (Docker, MySQL)
│   └── cache/        # Cache applicatif
├── tmp/              # Fichiers temporaires (efface au reboot)
├── usr/              # Programmes utilisateur
│   ├── bin/          # Binaires utilisateur
│   ├── lib/          # Bibliotheques
│   └── local/        # Logiciels installes manuellement
├── opt/              # Logiciels tiers
├── proc/             # Systeme de fichiers virtuel (infos noyau)
├── sys/              # Infos materielles
├── dev/              # Fichiers de peripheriques
└── mnt/ & media/     # Points de montage
\`\`\`

### Commandes de navigation

\`\`\`bash
# Position actuelle
pwd                          # /home/user

# Se deplacer
cd /var/log                  # Chemin absolu
cd ../etc                    # Chemin relatif (remonter + descendre)
cd ~                         # Retour au home
cd -                         # Retour au repertoire precedent

# Lister les fichiers
ls                           # Liste simple
ls -la                       # Liste detaillee + fichiers caches
ls -lh                       # Tailles lisibles (Ko, Mo, Go)
ls -lt                       # Tri par date de modification
ls -lS                       # Tri par taille
ls -R                        # Recursif

# Arborescence visuelle
tree /etc/nginx              # Arbre de repertoires
tree -L 2                    # Limiter a 2 niveaux de profondeur
\`\`\`

### Lecture du listing detaille

\`\`\`
-rw-r--r-- 1 root root 1234 Mar 01 10:00 fichier.conf
│          │ │    │    │    │             └─ Nom du fichier
│          │ │    │    │    └─ Date de modification
│          │ │    │    └─ Taille en octets
│          │ │    └─ Groupe proprietaire
│          │ └─ Proprietaire
│          └─ Nombre de liens
└─ Permissions (type + rwx user + rwx group + rwx other)
\`\`\`

> **Astuce DevOps :** Les repertoires \`/var/log\`, \`/etc\` et \`/var/lib/docker\` sont les plus frequemment consultes lors du depannage de serveurs.`
      },
      {
        title: 'Gestion des fichiers et repertoires',
        content: `La manipulation de fichiers est une competence quotidienne en DevOps : copier des configs, deplacer des logs, creer des backups.

### Creation

\`\`\`bash
# Creer un fichier vide
touch fichier.txt

# Creer un fichier avec du contenu
echo "Hello DevOps" > fichier.txt           # Ecrase le contenu
echo "Ligne supplementaire" >> fichier.txt   # Ajoute a la fin

# Creer un repertoire
mkdir mon-projet
mkdir -p parent/enfant/sous-enfant          # Creer toute l'arborescence

# Creer un fichier avec heredoc
cat << 'EOF' > config.yaml
server:
  port: 8080
  host: 0.0.0.0
database:
  host: localhost
  port: 5432
EOF
\`\`\`

### Copie et deplacement

\`\`\`bash
# Copier un fichier
cp source.txt destination.txt
cp -r dossier/ copie-dossier/               # Copie recursive

# Deplacer / Renommer
mv ancien.txt nouveau.txt                   # Renommer
mv fichier.txt /tmp/                        # Deplacer

# Copie avec preservation des attributs (backup)
cp -a /etc/nginx/ /backup/nginx-$(date +%Y%m%d)/
\`\`\`

### Suppression

\`\`\`bash
# Supprimer un fichier
rm fichier.txt
rm -f fichier.txt                           # Forcer (pas de confirmation)

# Supprimer un repertoire
rmdir dossier-vide/                         # Seulement si vide
rm -rf dossier/                             # Recursif + force (DANGEREUX)
\`\`\`

> **ATTENTION :** \`rm -rf /\` detruit tout le systeme. Toujours verifier deux fois avant d'executer un \`rm -rf\`.

### Lecture de fichiers

\`\`\`bash
# Afficher tout le fichier
cat fichier.txt

# Afficher avec numeros de ligne
cat -n fichier.txt

# Afficher le debut / la fin
head -20 fichier.txt                        # 20 premieres lignes
tail -50 /var/log/syslog                    # 50 dernieres lignes
tail -f /var/log/nginx/access.log           # Suivre en temps reel

# Pagination
less /var/log/syslog                        # Navigation avec fleches
# q pour quitter, / pour chercher, n pour suivant
\`\`\`

### Liens symboliques

\`\`\`bash
# Creer un lien symbolique (raccourci)
ln -s /etc/nginx/sites-available/monsite /etc/nginx/sites-enabled/monsite

# Verifier un lien
ls -la /etc/nginx/sites-enabled/
# lrwxrwxrwx 1 root root 40 monsite -> /etc/nginx/sites-available/monsite
\`\`\`

### Archivage et compression

\`\`\`bash
# Creer une archive tar.gz
tar -czf backup.tar.gz /var/log/

# Extraire une archive
tar -xzf backup.tar.gz

# Lister le contenu sans extraire
tar -tzf backup.tar.gz

# Compresser un seul fichier
gzip fichier.log                            # Produit fichier.log.gz
gunzip fichier.log.gz                       # Decompresser
\`\`\``
      },
      {
        title: 'Pipes, redirections et chaines de commandes',
        content: `Les pipes et redirections sont la **puissance** du shell Linux. Ils permettent de chainer des commandes pour creer des traitements complexes en une seule ligne.

### Redirections

\`\`\`bash
# Redirection de la sortie standard (stdout)
ls -la > listing.txt                        # Ecraser
ls -la >> listing.txt                       # Ajouter

# Redirection de la sortie d'erreur (stderr)
commande 2> erreurs.txt                     # Erreurs dans un fichier
commande 2>> erreurs.txt                    # Ajouter les erreurs

# Rediriger stdout ET stderr
commande > output.txt 2>&1                  # Tout dans le meme fichier
commande &> output.txt                      # Syntaxe equivalente (bash)

# Rediriger vers /dev/null (ignorer la sortie)
commande > /dev/null 2>&1                   # Silence total
\`\`\`

### Les descripteurs de fichiers

| Descripteur | Nom | Signification |
|-------------|-----|---------------|
| **0** | stdin | Entree standard (clavier) |
| **1** | stdout | Sortie standard (ecran) |
| **2** | stderr | Sortie d'erreur (ecran) |

### Pipe ( | )

Le pipe envoie la sortie d'une commande comme entree de la suivante.

\`\`\`bash
# Compter les fichiers dans un repertoire
ls -la /etc | wc -l

# Trouver un processus specifique
ps aux | grep nginx

# Trier les plus gros fichiers
du -sh /var/* | sort -rh | head -10

# Filtrer les logs d'erreur nginx
cat /var/log/nginx/error.log | grep "500" | tail -20

# Compter les connexions actives par IP
netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10
\`\`\`

### Enchainement de commandes

\`\`\`bash
# ET logique : la commande suivante s'execute seulement si la precedente reussit
apt update && apt upgrade -y

# OU logique : s'execute seulement si la precedente echoue
ping -c1 google.com || echo "Pas de connexion Internet"

# Point-virgule : execute toujours la commande suivante
cd /tmp ; ls ; pwd

# Combinaison avancee
mkdir -p /backup && cp -a /etc/nginx /backup/ && echo "Backup OK" || echo "Backup ECHEC"
\`\`\`

### Substitution de commandes

\`\`\`bash
# Utiliser le resultat d'une commande dans une autre
echo "Date : $(date)"
echo "Hostname : $(hostname)"

# Creer un repertoire avec la date
mkdir backup-$(date +%Y%m%d)

# Compter les lignes d'un fichier
LIGNES=$(wc -l < /var/log/syslog)
echo "Le syslog contient $LIGNES lignes"
\`\`\`

> **Conseil DevOps :** Maitrisez les pipes pour analyser rapidement des logs en production. La combinaison \`grep | sort | uniq -c | sort -rn\` est extremement utile pour identifier des patterns dans les logs.`
      },
      {
        title: 'grep, sed et awk',
        content: `Ces trois outils sont les **piliers** du traitement de texte en ligne de commande. Indispensables pour l'analyse de logs, la modification de configurations et l'automatisation.

### grep — Recherche de motifs

\`\`\`bash
# Recherche simple
grep "error" /var/log/syslog

# Ignorer la casse
grep -i "error" /var/log/syslog

# Recherche recursive dans un dossier
grep -r "password" /etc/

# Afficher les numeros de ligne
grep -n "error" /var/log/syslog

# Inverser la recherche (exclure)
grep -v "DEBUG" /var/log/app.log

# Compter les occurrences
grep -c "404" /var/log/nginx/access.log

# Expressions regulieres etendues
grep -E "error|warning|critical" /var/log/syslog

# Contexte (lignes avant/apres)
grep -B 3 -A 3 "panic" /var/log/kern.log

# Rechercher uniquement les noms de fichiers
grep -rl "TODO" /home/dev/projet/
\`\`\`

### sed — Edition de flux

\`sed\` (Stream Editor) modifie du texte a la volee sans ouvrir de fichier.

\`\`\`bash
# Substitution (premiere occurrence par ligne)
sed 's/ancien/nouveau/' fichier.txt

# Substitution globale (toutes les occurrences)
sed 's/ancien/nouveau/g' fichier.txt

# Modifier le fichier directement (-i = in-place)
sed -i 's/port 80/port 8080/g' nginx.conf

# Supprimer des lignes
sed '/^#/d' config.conf                     # Supprimer les commentaires
sed '/^$/d' config.conf                     # Supprimer les lignes vides

# Inserer une ligne
sed -i '5i\\nouvelle ligne' fichier.txt      # Inserer avant la ligne 5

# Afficher une plage de lignes
sed -n '10,20p' fichier.txt                 # Lignes 10 a 20

# Remplacements multiples
sed -e 's/foo/bar/g' -e 's/baz/qux/g' fichier.txt
\`\`\`

### awk — Traitement de colonnes

\`awk\` excelle dans le traitement de donnees structurees en colonnes.

\`\`\`bash
# Afficher une colonne specifique
awk '{print $1}' fichier.txt                # 1ere colonne
awk '{print $1, $3}' fichier.txt            # 1ere et 3eme colonnes

# Separateur personnalise
awk -F: '{print $1, $3}' /etc/passwd        # Afficher user et UID

# Filtrer par condition
awk '$3 > 1000 {print $1}' /etc/passwd      # UID > 1000

# Calculer une somme
df -h | awk '/^\\/dev/ {print $1, $5}'       # Utilisation disque par partition

# Formater la sortie
ps aux | awk '{printf "%-10s %5s %5s %s\\n", $1, $2, $3, $11}'

# Compter les requetes HTTP par code de statut
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn
\`\`\`

### Combinaisons puissantes

\`\`\`bash
# Top 10 des IPs les plus actives dans les logs nginx
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# Extraire les erreurs 500 avec timestamp
grep " 500 " access.log | awk '{print $4, $1, $7}'

# Remplacer toutes les IPs dans un fichier de config
sed -i 's/192\\.168\\.1\\.[0-9]*/10.0.0.1/g' config.conf
\`\`\`

> **Memo rapide :**
> - **grep** = chercher des lignes qui correspondent a un motif
> - **sed** = modifier du texte (substitution, suppression, insertion)
> - **awk** = traiter des donnees en colonnes (extraction, calcul, formatage)`
      },
      {
        title: 'find et locate',
        content: `Trouver rapidement des fichiers sur un systeme Linux est essentiel pour le depannage et l'administration. \`find\` et \`locate\` sont les deux outils principaux.

### find — Recherche en temps reel

\`find\` parcourt l'arborescence a chaque execution. Plus lent mais toujours a jour.

\`\`\`bash
# Recherche par nom
find /etc -name "*.conf"                     # Nom exact (sensible casse)
find /etc -iname "*.conf"                    # Insensible a la casse

# Recherche par type
find /var -type f                            # Fichiers uniquement
find /var -type d                            # Repertoires uniquement
find /var -type l                            # Liens symboliques

# Recherche par taille
find /var/log -size +100M                    # Fichiers > 100 Mo
find /tmp -size -1k                          # Fichiers < 1 Ko
find / -size +1G                             # Fichiers > 1 Go (espace disque)

# Recherche par date
find /var/log -mtime -7                      # Modifie dans les 7 derniers jours
find /tmp -atime +30                         # Accede il y a plus de 30 jours
find /etc -newer /etc/passwd                 # Plus recent que /etc/passwd

# Recherche par permissions
find / -perm 777                             # Permissions exactes 777
find / -perm -4000                           # Fichiers avec SUID

# Recherche par proprietaire
find /home -user www-data
find /var -group docker

# Executer une commande sur les resultats
find /tmp -type f -mtime +30 -exec rm {} \\;
find /var/log -name "*.gz" -exec ls -lh {} \\;
find . -name "*.log" -exec grep -l "ERROR" {} \\;

# Utiliser xargs (plus performant que -exec)
find /var/log -name "*.log" | xargs grep "critical"
find . -name "*.tmp" -print0 | xargs -0 rm   # Gerer les espaces dans les noms
\`\`\`

### locate — Recherche dans une base de donnees

\`locate\` utilise une base de donnees indexee, beaucoup plus rapide que \`find\`.

\`\`\`bash
# Installer locate
sudo apt install mlocate -y                  # Ubuntu/Debian
sudo dnf install mlocate -y                  # RHEL/AlmaLinux

# Mettre a jour la base de donnees
sudo updatedb

# Rechercher un fichier
locate nginx.conf
locate -i "readme"                           # Insensible a la casse
locate -c "*.log"                            # Compter les resultats

# Limiter les resultats
locate -l 10 "*.conf"                        # 10 premiers resultats
\`\`\`

### which, whereis, type

\`\`\`bash
# Trouver le chemin d'un programme
which nginx                                  # /usr/sbin/nginx
which python3                                # /usr/bin/python3

# Trouver binaire + man + sources
whereis nginx                                # nginx: /usr/sbin/nginx /etc/nginx /usr/share/nginx

# Savoir si une commande est un alias, builtin ou programme
type ls                                      # ls is aliased to 'ls --color=auto'
type cd                                      # cd is a shell builtin
type grep                                    # grep is /usr/bin/grep
\`\`\`

### Cas d'usage DevOps courants

\`\`\`bash
# Trouver les fichiers de config modifies recemment
find /etc -type f -mtime -1 -name "*.conf"

# Trouver les gros fichiers de log a nettoyer
find /var/log -type f -size +100M -exec ls -lh {} \\;

# Trouver les fichiers avec des permissions dangereuses
find / -type f -perm -o+w -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null

# Trouver tous les Dockerfiles dans un projet
find /home/dev -name "Dockerfile" -o -name "docker-compose.yml"
\`\`\`

> **Quand utiliser quoi ?**
> - \`find\` : recherche precise avec filtres (taille, date, permissions, proprietaire)
> - \`locate\` : recherche rapide par nom de fichier
> - \`which\` : trouver le chemin d'un executable
> - \`grep -r\` : chercher du contenu a l'interieur des fichiers`
      }
    ]
  },
  {
    id: 102,
    slug: 'utilisateurs-permissions',
    title: 'Utilisateurs, Permissions & Processus',
    subtitle: 'Gerer les utilisateurs, les droits d\'acces et les processus Linux',
    icon: 'Users',
    color: '#f97316',
    duration: '40 min',
    level: 'Intermediaire',
    videoId: 'A2aaJVc5PD8',
    sections: [
      {
        title: 'Utilisateurs et groupes',
        content: `La gestion des utilisateurs est un aspect fondamental de la securite Linux. Chaque processus, chaque fichier appartient a un utilisateur et un groupe.

### Fichiers systeme cles

| Fichier | Contenu |
|---------|---------|
| \`/etc/passwd\` | Liste des utilisateurs (nom, UID, GID, shell...) |
| \`/etc/shadow\` | Mots de passe haches (accessible uniquement par root) |
| \`/etc/group\` | Liste des groupes et leurs membres |
| \`/etc/gshadow\` | Mots de passe de groupes (rarement utilise) |

### Structure de /etc/passwd

\`\`\`
username:x:UID:GID:commentaire:/home/username:/bin/bash
   │     │  │   │      │            │           └─ Shell par defaut
   │     │  │   │      │            └─ Repertoire home
   │     │  │   │      └─ Nom complet / commentaire
   │     │  │   └─ GID du groupe principal
   │     │  └─ UID (User ID)
   │     └─ Mot de passe dans /etc/shadow
   └─ Nom d'utilisateur
\`\`\`

### Gestion des utilisateurs

\`\`\`bash
# Creer un utilisateur avec home directory et shell bash
sudo useradd -m -s /bin/bash deploy

# Creer un utilisateur avec plus de details
sudo useradd -m -s /bin/bash -c "Compte deploiement" -G docker,sudo deploy

# Definir un mot de passe
sudo passwd deploy

# Modifier un utilisateur
sudo usermod -aG docker deploy              # Ajouter au groupe docker
sudo usermod -s /usr/sbin/nologin deploy    # Desactiver le login shell
sudo usermod -L deploy                      # Verrouiller le compte

# Supprimer un utilisateur
sudo userdel deploy                         # Garder le home
sudo userdel -r deploy                      # Supprimer le home aussi

# Informations sur un utilisateur
id deploy                                   # uid=1001(deploy) gid=1001(deploy) groups=...
whoami                                      # Utilisateur courant
who                                         # Utilisateurs connectes
last                                        # Historique des connexions
\`\`\`

### Gestion des groupes

\`\`\`bash
# Creer un groupe
sudo groupadd devops

# Ajouter un utilisateur a un groupe
sudo usermod -aG devops deploy              # -a = append, -G = supplementary group

# Lister les groupes d'un utilisateur
groups deploy

# Lister les membres d'un groupe
getent group docker

# Supprimer un groupe
sudo groupdel devops
\`\`\`

### Utilisateurs systeme importants

| Utilisateur | UID | Role |
|-------------|-----|------|
| **root** | 0 | Super-administrateur, tous les droits |
| **nobody** | 65534 | Utilisateur sans privileges |
| **www-data** | 33 | Serveur web (nginx/Apache) |
| **mysql** | 27 | Serveur MySQL |
| **docker** | - | Groupe Docker (acces au daemon) |

> **Bonne pratique DevOps :** Ne jamais executer des services en tant que **root**. Creer un utilisateur dedie par service (ex: \`deploy\` pour les deploiements, \`www-data\` pour le web server). Ajouter les utilisateurs au groupe \`docker\` plutot que d'utiliser \`sudo docker\`.`
      },
      {
        title: 'chmod et chown',
        content: `Les permissions Linux definissent qui peut lire, ecrire ou executer un fichier. Leur maitrise est essentielle pour securiser un serveur.

### Le systeme de permissions

Chaque fichier a trois ensembles de permissions pour trois categories :

| Categorie | Symbole | Description |
|-----------|---------|-------------|
| **User** (proprietaire) | u | L'utilisateur proprietaire du fichier |
| **Group** (groupe) | g | Le groupe proprietaire du fichier |
| **Other** (autres) | o | Tous les autres utilisateurs |

Chaque categorie peut avoir trois types de droits :

| Permission | Symbole | Valeur octale | Sur un fichier | Sur un repertoire |
|------------|---------|--------------|----------------|-------------------|
| **Read** | r | 4 | Lire le contenu | Lister le contenu |
| **Write** | w | 2 | Modifier le contenu | Creer/supprimer des fichiers |
| **Execute** | x | 1 | Executer le programme | Entrer dans le repertoire |

### chmod — Modifier les permissions

\`\`\`bash
# Notation octale (la plus utilisee)
chmod 755 script.sh        # rwxr-xr-x (proprietaire: rwx, groupe: r-x, autres: r-x)
chmod 644 config.conf      # rw-r--r-- (proprietaire: rw-, groupe: r--, autres: r--)
chmod 600 id_rsa           # rw------- (proprietaire uniquement)
chmod 700 .ssh/            # rwx------ (repertoire prive)

# Notation symbolique
chmod u+x script.sh        # Ajouter execution pour le proprietaire
chmod g-w fichier.txt      # Retirer ecriture pour le groupe
chmod o-rwx secret.key     # Retirer tous les droits pour les autres
chmod a+r readme.txt       # Ajouter lecture pour tous (a = all)

# Recursif
chmod -R 755 /var/www/html/
chmod -R o-rwx /home/deploy/.ssh/
\`\`\`

### Permissions courantes en DevOps

| Fichier/Repertoire | Permission | Octale | Raison |
|---------------------|-----------|--------|--------|
| Cles SSH privees | \`-rw-------\` | 600 | Securite obligatoire (SSH refuse sinon) |
| Repertoire \`.ssh/\` | \`drwx------\` | 700 | Acces proprietaire uniquement |
| Scripts shell | \`-rwxr-xr-x\` | 755 | Executable par tous, modifiable par proprio |
| Fichiers de config | \`-rw-r--r--\` | 644 | Lisible par tous, modifiable par proprio |
| Cles SSL/TLS | \`-rw-------\` | 600 | Secrets sensibles |
| Repertoire web | \`drwxr-xr-x\` | 755 | Nginx/Apache doit pouvoir lire |

### chown — Modifier le proprietaire

\`\`\`bash
# Changer le proprietaire
sudo chown deploy fichier.txt

# Changer proprietaire ET groupe
sudo chown deploy:www-data /var/www/html/

# Recursif
sudo chown -R www-data:www-data /var/www/

# Changer uniquement le groupe
sudo chgrp docker /var/run/docker.sock
\`\`\`

### Exemple pratique : deploiement web

\`\`\`bash
# Structure classique nginx
sudo mkdir -p /var/www/monsite
sudo chown -R www-data:www-data /var/www/monsite
sudo chmod -R 755 /var/www/monsite

# Le deploy user doit pouvoir ecrire
sudo usermod -aG www-data deploy
sudo chmod -R 775 /var/www/monsite    # Groupe peut ecrire
\`\`\`

> **Astuce :** Utilisez \`stat fichier.txt\` pour voir les permissions detaillees, y compris en notation octale.`
      },
      {
        title: 'Permissions speciales (SUID, SGID, Sticky Bit)',
        content: `Au-dela des permissions classiques rwx, Linux dispose de trois permissions speciales qui modifient le comportement d'execution.

### SUID (Set User ID) — Valeur octale : 4000

Quand le bit SUID est active sur un executable, celui-ci s'execute avec les droits de son **proprietaire** (et non de l'utilisateur qui le lance).

\`\`\`bash
# Exemple classique : la commande passwd
ls -la /usr/bin/passwd
# -rwsr-xr-x 1 root root 68208 passwd
#    ^-- Le 's' au lieu du 'x' indique le SUID

# Un utilisateur normal peut changer son mot de passe
# car passwd s'execute avec les droits root (proprietaire)
# et peut donc ecrire dans /etc/shadow

# Appliquer le SUID
chmod u+s programme
chmod 4755 programme

# Trouver tous les fichiers SUID sur le systeme
find / -perm -4000 -type f 2>/dev/null
\`\`\`

### SGID (Set Group ID) — Valeur octale : 2000

**Sur un fichier executable :** s'execute avec les droits du **groupe proprietaire**.
**Sur un repertoire :** les nouveaux fichiers crees heritent du **groupe du repertoire** (au lieu du groupe de l'utilisateur).

\`\`\`bash
# Appliquer le SGID sur un repertoire
chmod g+s /var/www/projet/
chmod 2775 /var/www/projet/

# Verifier
ls -la /var/www/
# drwxrwsr-x 2 root www-data 4096 projet/
#       ^-- Le 's' sur le groupe

# Tout fichier cree dans /var/www/projet/ aura le groupe www-data
# meme si l'utilisateur deploy le cree
touch /var/www/projet/index.html
ls -la /var/www/projet/index.html
# -rw-r--r-- 1 deploy www-data 0 index.html
\`\`\`

> **Cas d'usage DevOps :** Le SGID sur les repertoires partages est tres utile quand plusieurs utilisateurs (deploy, dev) doivent travailler sur les memes fichiers web appartenant au groupe \`www-data\`.

### Sticky Bit — Valeur octale : 1000

Sur un repertoire, seul le **proprietaire** d'un fichier (ou root) peut le supprimer, meme si d'autres ont les droits d'ecriture.

\`\`\`bash
# Exemple classique : /tmp
ls -ld /tmp
# drwxrwxrwt 15 root root 4096 /tmp
#          ^-- Le 't' indique le sticky bit

# Tout le monde peut ecrire dans /tmp
# Mais chaque utilisateur ne peut supprimer que SES fichiers

# Appliquer le sticky bit
chmod +t /repertoire-partage/
chmod 1777 /repertoire-partage/
\`\`\`

### Resume des permissions speciales

| Permission | Valeur | Sur fichier | Sur repertoire |
|------------|--------|-------------|----------------|
| **SUID** | 4000 | Execute avec les droits du proprietaire | (pas d'effet) |
| **SGID** | 2000 | Execute avec les droits du groupe | Nouveaux fichiers heritent du groupe |
| **Sticky** | 1000 | (pas d'effet) | Seul le proprietaire peut supprimer |

### Notation octale complete

\`\`\`bash
# La permission octale complete a 4 chiffres :
# [special][user][group][other]
chmod 4755 fichier    # SUID + rwxr-xr-x
chmod 2775 dossier    # SGID + rwxrwxr-x
chmod 1777 /tmp       # Sticky + rwxrwxrwx

# Representation dans ls -la :
# SUID : 's' dans les droits user (S si pas de x)
# SGID : 's' dans les droits group (S si pas de x)
# Sticky : 't' dans les droits other (T si pas de x)
\`\`\`

> **Securite :** Les fichiers SUID appartenant a root sont des cibles privilegiees pour les attaquants. Auditez regulierement avec \`find / -perm -4000\`.`
      },
      {
        title: 'Gestion des processus (ps, top, kill)',
        content: `En DevOps, surveiller et gerer les processus est une tache quotidienne : identifier un processus qui consomme trop de ressources, redemarrer un service bloque, ou analyser les performances.

### ps — Lister les processus

\`\`\`bash
# Lister tous les processus (format BSD)
ps aux

# Lister tous les processus (format System V)
ps -ef

# Filtrer un processus specifique
ps aux | grep nginx
ps aux | grep -v grep | grep nginx          # Exclure le grep lui-meme

# Afficher les processus en arbre
ps auxf                                      # Arbre avec details
pstree                                       # Arbre simplifie
pstree -p                                    # Avec les PID

# Afficher les colonnes specifiques
ps -eo pid,user,%cpu,%mem,comm --sort=-%cpu | head -20
\`\`\`

### Lecture de la sortie ps aux

\`\`\`
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169592 13288 ?        Ss   Feb20   0:05 /sbin/init
www-data  1234  2.3  1.5 456789 61234 ?        S    10:00   0:30 nginx: worker
\`\`\`

| Colonne | Description |
|---------|-------------|
| **PID** | Process ID (identifiant unique) |
| **%CPU** | Pourcentage CPU utilise |
| **%MEM** | Pourcentage memoire utilisee |
| **VSZ** | Memoire virtuelle (Ko) |
| **RSS** | Memoire physique reelle (Ko) |
| **STAT** | Etat (S=sleeping, R=running, Z=zombie, T=stopped) |
| **TIME** | Temps CPU cumule |

### top / htop — Monitoring en temps reel

\`\`\`bash
# top : monitoring par defaut
top
# Raccourcis dans top :
# P = trier par CPU
# M = trier par memoire
# k = kill un processus
# q = quitter

# htop : version amelioree (a installer)
sudo apt install htop -y
htop
# Navigation avec les fleches, F9 pour kill, F10 pour quitter

# Afficher uniquement un utilisateur
top -u www-data
\`\`\`

### Signaux et kill

Les signaux sont le mecanisme de communication entre processus sous Linux.

\`\`\`bash
# Lister les signaux disponibles
kill -l

# Envoyer un signal a un processus
kill PID                    # Signal 15 (SIGTERM) — arret propre
kill -9 PID                 # Signal 9 (SIGKILL) — arret force (dernier recours)
kill -HUP PID               # Signal 1 (SIGHUP) — recharger la configuration

# Tuer par nom
killall nginx               # Tue tous les processus nginx
pkill -f "python script.py" # Tue par pattern du nom complet
\`\`\`

### Signaux importants

| Signal | Numero | Action | Usage |
|--------|--------|--------|-------|
| **SIGHUP** | 1 | Recharger la config | \`kill -1 PID\` nginx relit nginx.conf |
| **SIGINT** | 2 | Interruption | Ctrl+C dans le terminal |
| **SIGTERM** | 15 | Arret propre | \`kill PID\` (par defaut) |
| **SIGKILL** | 9 | Arret force | \`kill -9 PID\` (impossible a ignorer) |
| **SIGSTOP** | 19 | Suspendre | Ctrl+Z dans le terminal |
| **SIGCONT** | 18 | Reprendre | \`fg\` ou \`bg\` dans le terminal |

### Processus en arriere-plan

\`\`\`bash
# Lancer en arriere-plan
./script.sh &

# Detacher du terminal (continue meme apres deconnexion)
nohup ./script.sh > output.log 2>&1 &

# Lister les jobs en cours
jobs

# Ramener un job au premier plan
fg %1

# Envoyer un job en arriere-plan
bg %1
\`\`\`

> **Bonne pratique DevOps :** Toujours essayer \`SIGTERM\` (kill PID) avant \`SIGKILL\` (kill -9 PID). SIGTERM permet au processus de se terminer proprement (fermer les connexions, ecrire les donnees). SIGKILL est un arret brutal qui peut corrompre des donnees.`
      }
    ]
  },
  {
    id: 103,
    slug: 'systemd-services',
    title: 'Systemd & Gestion des Services',
    subtitle: 'Comprendre systemd, gerer les services et creer des unit files personnalises',
    icon: 'Settings',
    color: '#f97316',
    duration: '30 min',
    level: 'Intermediaire',
    videoId: 'H0T1yMpKiHY',
    sections: [
      {
        title: 'Init vs Systemd',
        content: `**Systemd** est le systeme d'initialisation et de gestion de services standard sur les distributions Linux modernes. Il a remplace les anciens systemes init (SysVinit, Upstart).

### Historique des systemes d'init

| Systeme | Periode | Distributions | Caracteristiques |
|---------|---------|---------------|------------------|
| **SysVinit** | 1983-2014 | Anciennes Debian, RHEL 6 | Scripts shell sequentiels, lent |
| **Upstart** | 2006-2015 | Ubuntu 6.10 a 14.10 | Event-driven, parallele partiel |
| **Systemd** | 2010-present | Ubuntu 15+, RHEL 7+, Debian 8+ | Parallele, socket activation, cgroups |

### Pourquoi systemd a remplace SysVinit

**SysVinit** demarrait les services de maniere **sequentielle** via des scripts dans \`/etc/init.d/\`. Problemes :
- Demarrage lent (un service a la fois)
- Scripts shell complexes et fragiles
- Pas de gestion des dependances entre services
- Pas de supervision automatique des processus

**Systemd** resout ces problemes :
- **Demarrage parallele** : tous les services independants demarrent en meme temps
- **Socket activation** : un service demarre uniquement quand une connexion arrive sur son port
- **Gestion des dependances** : \`After=\`, \`Requires=\`, \`Wants=\`
- **Supervision** : redemarrage automatique des processus crashes (\`Restart=always\`)
- **Cgroups** : isolation et limitation des ressources par service
- **Journald** : systeme de logs unifie et structure

### PID 1 : le processus init

\`\`\`bash
# Systemd est toujours le PID 1
ps -p 1 -o pid,comm
# PID COMMAND
#   1 systemd

# Verifier la version de systemd
systemd --version
# systemd 255 (255.4-1ubuntu8)
\`\`\`

### Architecture de systemd

\`\`\`
systemd (PID 1)
├── systemd-journald      # Gestion des logs
├── systemd-logind        # Gestion des sessions utilisateur
├── systemd-networkd      # Configuration reseau
├── systemd-resolved      # Resolution DNS
├── systemd-timesyncd     # Synchronisation NTP
└── systemd-udevd         # Gestion du materiel
\`\`\`

> **Point important :** Meme si systemd est parfois critique pour sa complexite ("il fait trop de choses"), il est le standard de facto. En DevOps, vous le rencontrerez sur la quasi-totalite des serveurs Linux modernes.`
      },
      {
        title: 'systemctl — Gestion des services',
        content: `\`systemctl\` est la commande principale pour interagir avec systemd. C'est l'outil que vous utiliserez le plus souvent en tant que DevOps.

### Operations de base sur les services

\`\`\`bash
# Demarrer un service
sudo systemctl start nginx

# Arreter un service
sudo systemctl stop nginx

# Redemarrer un service (arret + demarrage)
sudo systemctl restart nginx

# Recharger la configuration (sans interrompre le service)
sudo systemctl reload nginx

# Redemarrer si actif, sinon rien
sudo systemctl try-restart nginx

# Recharger si supporte, sinon redemarrer
sudo systemctl reload-or-restart nginx
\`\`\`

### Activation au demarrage

\`\`\`bash
# Activer un service au boot
sudo systemctl enable nginx

# Activer ET demarrer immediatement
sudo systemctl enable --now nginx

# Desactiver au boot
sudo systemctl disable nginx

# Desactiver ET arreter
sudo systemctl disable --now nginx

# Verifier si active au boot
systemctl is-enabled nginx                   # enabled / disabled
\`\`\`

### Verification de l'etat

\`\`\`bash
# Etat detaille d'un service
systemctl status nginx
# nginx.service - A high performance web server
#    Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
#    Active: active (running) since Mon 2026-03-01 10:00:00 CET; 3 days ago
#    Main PID: 1234 (nginx)
#    Tasks: 5 (limit: 4915)
#    Memory: 12.5M
#    CPU: 1.234s
#    CGroup: /system.slice/nginx.service
#            ├─1234 nginx: master process
#            └─1235 nginx: worker process

# Verifications rapides
systemctl is-active nginx                    # active / inactive
systemctl is-failed nginx                    # failed / active

# Lister tous les services
systemctl list-units --type=service

# Lister les services actifs uniquement
systemctl list-units --type=service --state=active

# Lister les services en echec
systemctl list-units --type=service --state=failed

# Lister les services au boot
systemctl list-unit-files --type=service
\`\`\`

### Masquer un service

\`\`\`bash
# Masquer : empeche completement le demarrage (meme manuellement)
sudo systemctl mask nginx

# Demasquer
sudo systemctl unmask nginx
\`\`\`

### Recharger la configuration systemd

\`\`\`bash
# Apres avoir modifie un unit file, recharger le daemon
sudo systemctl daemon-reload

# Puis redemarrer le service concerne
sudo systemctl restart monservice
\`\`\`

> **Conseil DevOps :** Apres chaque deploiement, verifiez l'etat des services critiques avec \`systemctl status\`. En cas de probleme, consultez les logs avec \`journalctl -u service_name -f\`.`
      },
      {
        title: 'Unit files personnalises',
        content: `Les unit files definissent comment systemd gere un service. Savoir en creer est une competence cle pour deployer des applications personnalisees.

### Emplacement des unit files

| Chemin | Priorite | Usage |
|--------|----------|-------|
| \`/etc/systemd/system/\` | Haute | Unit files personnalises / overrides |
| \`/run/systemd/system/\` | Moyenne | Unit files temporaires (runtime) |
| \`/lib/systemd/system/\` | Basse | Unit files fournis par les paquets |

### Structure d'un unit file

\`\`\`ini
# /etc/systemd/system/mon-api.service
[Unit]
Description=Mon API Node.js
Documentation=https://docs.exemple.com
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/opt/mon-api
ExecStart=/usr/bin/node server.js
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mon-api
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/opt/mon-api/.env

# Securite
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/mon-api/data

# Limites de ressources
MemoryMax=512M
CPUQuota=50%

[Install]
WantedBy=multi-user.target
\`\`\`

### Sections detaillees

**[Unit]** — Metadonnees et dependances :
- \`Description=\` : description du service
- \`After=\` : demarrer APRES ces unites (ordre, pas dependance)
- \`Requires=\` : dependance forte (si l'autre echoue, celui-ci aussi)
- \`Wants=\` : dependance faible (si l'autre echoue, on continue)

**[Service]** — Configuration du service :
- \`Type=simple\` : le processus principal est celui lance par ExecStart
- \`Type=forking\` : le processus fork en arriere-plan (comme nginx)
- \`Type=oneshot\` : execute une tache puis se termine
- \`ExecStart=\` : commande de demarrage
- \`Restart=always\` : redemarrer automatiquement en cas de crash
- \`RestartSec=5\` : attendre 5 secondes avant de redemarrer

**[Install]** — Activation :
- \`WantedBy=multi-user.target\` : equivalent du runlevel 3 (multi-utilisateur)

### Exemples pratiques

**Service Python Flask :**
\`\`\`ini
[Unit]
Description=Flask API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/flask-api
ExecStart=/opt/flask-api/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
\`\`\`

**Service Docker Compose :**
\`\`\`ini
[Unit]
Description=Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/mon-app
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
\`\`\`

### Deployer un nouveau service

\`\`\`bash
# 1. Creer le unit file
sudo nano /etc/systemd/system/mon-api.service

# 2. Recharger systemd
sudo systemctl daemon-reload

# 3. Demarrer et activer
sudo systemctl enable --now mon-api

# 4. Verifier
systemctl status mon-api
journalctl -u mon-api -f
\`\`\``
      },
      {
        title: 'journalctl — Consultation des logs',
        content: `\`journalctl\` est l'outil de consultation des logs systemd (journald). Il centralise les logs de tous les services geres par systemd.

### Commandes de base

\`\`\`bash
# Tous les logs (du plus ancien au plus recent)
journalctl

# Logs du boot actuel uniquement
journalctl -b

# Logs du boot precedent
journalctl -b -1

# Suivre les logs en temps reel (equivalent tail -f)
journalctl -f
\`\`\`

### Filtrer par service

\`\`\`bash
# Logs d'un service specifique
journalctl -u nginx.service

# Logs en temps reel d'un service
journalctl -u nginx -f

# Logs de plusieurs services
journalctl -u nginx -u php8.3-fpm

# Logs du noyau
journalctl -k
\`\`\`

### Filtrer par temps

\`\`\`bash
# Logs depuis une date
journalctl --since "2026-03-01 10:00:00"

# Logs entre deux dates
journalctl --since "2026-03-01" --until "2026-03-02"

# Logs des 30 dernieres minutes
journalctl --since "30 min ago"

# Logs de la derniere heure
journalctl --since "1 hour ago"

# Logs d'aujourd'hui
journalctl --since today
\`\`\`

### Filtrer par priorite

\`\`\`bash
# Uniquement les erreurs et au-dessus
journalctl -p err

# Priorites disponibles (du plus critique au moins critique) :
# emerg (0) > alert (1) > crit (2) > err (3) > warning (4) > notice (5) > info (6) > debug (7)

# Erreurs d'un service specifique
journalctl -u nginx -p err

# Erreurs depuis le dernier boot
journalctl -b -p err
\`\`\`

### Format de sortie

\`\`\`bash
# Format JSON (utile pour le parsing automatise)
journalctl -u nginx -o json-pretty

# Sortie courte (par defaut)
journalctl -o short

# Sortie verbose (tous les champs)
journalctl -o verbose

# Sortie compacte (une ligne par entree)
journalctl -o cat
\`\`\`

### Gestion de l'espace disque

\`\`\`bash
# Voir l'espace utilise par les logs
journalctl --disk-usage
# Archived and active journals take up 1.5G in the file system.

# Nettoyer les anciens logs (garder les 7 derniers jours)
sudo journalctl --vacuum-time=7d

# Limiter la taille totale
sudo journalctl --vacuum-size=500M

# Configuration permanente dans /etc/systemd/journald.conf
# SystemMaxUse=500M
# MaxRetentionSec=1month
\`\`\`

### Cas d'usage DevOps

\`\`\`bash
# Diagnostiquer un service qui ne demarre pas
systemctl status mon-api
journalctl -u mon-api --since "5 min ago" --no-pager

# Chercher des erreurs de demarrage
journalctl -b -p err --no-pager | head -50

# Exporter les logs pour analyse
journalctl -u nginx --since "1 hour ago" -o json > /tmp/nginx-logs.json
\`\`\`

> **Astuce :** Utilisez \`--no-pager\` pour eviter la pagination et pouvoir piper la sortie vers \`grep\` ou d'autres outils.`
      },
      {
        title: 'Targets et runlevels',
        content: `Les **targets** systemd sont l'equivalent moderne des **runlevels** SysVinit. Elles definissent l'etat du systeme (mode graphique, mode texte, mode urgence...).

### Correspondance runlevels / targets

| Runlevel (SysVinit) | Target (systemd) | Description |
|---------------------|-------------------|-------------|
| 0 | \`poweroff.target\` | Arret du systeme |
| 1 | \`rescue.target\` | Mode mono-utilisateur (maintenance) |
| 2 | \`multi-user.target\` | Multi-utilisateur (sans reseau) |
| 3 | \`multi-user.target\` | Multi-utilisateur avec reseau (serveur) |
| 4 | \`multi-user.target\` | Non defini (personnalise) |
| 5 | \`graphical.target\` | Interface graphique |
| 6 | \`reboot.target\` | Redemarrage |

### Gestion des targets

\`\`\`bash
# Voir la target actuelle
systemctl get-default
# multi-user.target  (serveur sans interface graphique)

# Changer la target par defaut
sudo systemctl set-default multi-user.target    # Serveur
sudo systemctl set-default graphical.target     # Desktop

# Changer de target immediatement
sudo systemctl isolate rescue.target            # Mode maintenance
sudo systemctl isolate multi-user.target        # Mode normal

# Lister toutes les targets
systemctl list-units --type=target
\`\`\`

### Targets importantes pour DevOps

| Target | Quand l'utiliser |
|--------|-----------------|
| \`multi-user.target\` | **Serveur de production** (pas d'interface graphique) |
| \`graphical.target\` | Poste de travail avec GUI |
| \`rescue.target\` | Maintenance (un seul utilisateur, root) |
| \`emergency.target\` | Urgence (systeme de fichiers en lecture seule) |

### Commandes de gestion du systeme

\`\`\`bash
# Redemarrer le systeme
sudo systemctl reboot

# Arreter le systeme
sudo systemctl poweroff

# Suspendre (RAM)
sudo systemctl suspend

# Hibernation (disque)
sudo systemctl hibernate

# Mode maintenance (rescue)
sudo systemctl rescue
\`\`\`

### Dependances des targets

\`\`\`bash
# Voir les dependances d'une target
systemctl list-dependencies multi-user.target

# Voir quelles unites sont actives pour la target actuelle
systemctl list-dependencies --type=service

# Arbre de dependances complet
systemctl list-dependencies multi-user.target --all
\`\`\`

### Overrides de services

\`\`\`bash
# Modifier un service existant sans toucher au unit file original
sudo systemctl edit nginx.service
# Cree /etc/systemd/system/nginx.service.d/override.conf

# Exemple d'override : augmenter les limites
# [Service]
# LimitNOFILE=65535

# Voir la configuration effective (avec overrides)
systemctl cat nginx.service

# Supprimer un override
sudo rm /etc/systemd/system/nginx.service.d/override.conf
sudo systemctl daemon-reload
\`\`\`

> **Pour les serveurs DevOps :** Utilisez toujours \`multi-user.target\` comme target par defaut. L'interface graphique consomme des ressources inutiles sur un serveur. Reservez \`rescue.target\` pour la maintenance d'urgence (filesystem corrompu, probleme de demarrage).`
      }
    ]
  },
  {
    id: 104,
    slug: 'logs-systeme',
    title: 'Logs Systeme & Journald',
    subtitle: 'Comprendre, analyser et centraliser les logs Linux pour le monitoring et le depannage',
    icon: 'FileText',
    color: '#f97316',
    duration: '25 min',
    level: 'Intermediaire',
    videoId: '',
    sections: [
      {
        title: '/var/log — Les fichiers de logs classiques',
        content: `Le repertoire \`/var/log\` est le point central des logs sur un systeme Linux. Chaque service, chaque sous-systeme y ecrit ses evenements.

### Fichiers de logs principaux

| Fichier | Contenu | Distribution |
|---------|---------|--------------|
| \`/var/log/syslog\` | Logs systeme generaux | Debian/Ubuntu |
| \`/var/log/messages\` | Logs systeme generaux | RHEL/CentOS |
| \`/var/log/auth.log\` | Authentification (SSH, sudo...) | Debian/Ubuntu |
| \`/var/log/secure\` | Authentification | RHEL/CentOS |
| \`/var/log/kern.log\` | Messages du noyau | Debian/Ubuntu |
| \`/var/log/dmesg\` | Messages hardware au boot | Toutes |
| \`/var/log/dpkg.log\` | Installation de paquets | Debian/Ubuntu |
| \`/var/log/yum.log\` | Installation de paquets | RHEL/CentOS |
| \`/var/log/cron.log\` | Execution des crons | Toutes |
| \`/var/log/boot.log\` | Demarrage du systeme | Toutes |
| \`/var/log/nginx/\` | Logs Nginx (access + error) | Si installe |
| \`/var/log/apache2/\` | Logs Apache | Si installe |
| \`/var/log/mysql/\` | Logs MySQL | Si installe |

### Consultation des logs

\`\`\`bash
# Lire les dernieres lignes
tail -50 /var/log/syslog

# Suivre en temps reel
tail -f /var/log/syslog

# Suivre plusieurs fichiers
tail -f /var/log/nginx/access.log /var/log/nginx/error.log

# Chercher des erreurs
grep -i "error" /var/log/syslog
grep -i "failed" /var/log/auth.log

# Compter les tentatives de connexion SSH echouees
grep "Failed password" /var/log/auth.log | wc -l

# Top 10 des IPs qui echouent le SSH
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10
\`\`\`

### Format Syslog standard

\`\`\`
Mar 04 10:15:32 devops-srv01 sshd[1234]: Accepted publickey for deploy from 192.168.1.50 port 52345
│               │             │           └─ Message
│               │             └─ Processus [PID]
│               └─ Hostname
└─ Timestamp
\`\`\`

### Niveaux de severite Syslog

| Niveau | Code | Signification |
|--------|------|---------------|
| **emerg** | 0 | Systeme inutilisable |
| **alert** | 1 | Action immediate requise |
| **crit** | 2 | Condition critique |
| **err** | 3 | Erreur |
| **warning** | 4 | Avertissement |
| **notice** | 5 | Normal mais significatif |
| **info** | 6 | Information |
| **debug** | 7 | Debug (tres verbeux) |

> **Reflexe DevOps :** En cas de probleme, toujours commencer par \`/var/log/syslog\` (ou \`messages\`) et \`/var/log/auth.log\` (ou \`secure\`). Ces deux fichiers couvrent la majorite des diagnostics.`
      },
      {
        title: 'rsyslog — Le daemon de logs traditionnel',
        content: `**rsyslog** est le daemon de logs traditionnel sur Linux. Meme avec systemd/journald, rsyslog reste souvent actif pour ecrire les logs dans des fichiers texte.

### Architecture rsyslog

\`\`\`
Sources de logs                     rsyslog                    Destinations
┌──────────┐                    ┌──────────────┐           ┌──────────────┐
│ Kernel   │──┐                 │              │──────────>│ /var/log/    │
│ Services │──┼────────────────>│   rsyslogd   │──────────>│ Serveur      │
│ Apps     │──┘                 │              │──────────>│ distant      │
└──────────┘                    └──────────────┘           └──────────────┘
\`\`\`

### Configuration rsyslog

\`\`\`bash
# Fichier de configuration principal
cat /etc/rsyslog.conf

# Configuration modulaire
ls /etc/rsyslog.d/
# 50-default.conf  — regles par defaut
\`\`\`

### Syntaxe des regles

\`\`\`
# Format : facility.severity    destination
# facility = source du message (auth, kern, mail, daemon, user, local0-7...)
# severity = niveau minimum (emerg, alert, crit, err, warning, notice, info, debug)

# Tous les messages auth dans auth.log
auth,authpriv.*                /var/log/auth.log

# Messages noyau dans kern.log
kern.*                         /var/log/kern.log

# Tout sauf auth et mail dans syslog
*.*;auth,authpriv.none         /var/log/syslog

# Erreurs et au-dessus dans un fichier separe
*.err                          /var/log/errors.log

# Envoyer les logs critiques vers un serveur distant
*.crit                         @192.168.1.200:514    # UDP
*.crit                         @@192.168.1.200:514   # TCP
\`\`\`

### Creer une regle personnalisee

\`\`\`bash
# /etc/rsyslog.d/60-mon-app.conf
# Envoyer les logs de mon application dans un fichier dedie
if $programname == 'mon-api' then /var/log/mon-api.log
& stop

# Ou avec la syntaxe template
template(name="MonApiFormat" type="string"
  string="%timestamp% %hostname% %syslogtag%%msg%\\n")

if $programname == 'mon-api' then {
  action(type="omfile" file="/var/log/mon-api.log" template="MonApiFormat")
  stop
}
\`\`\`

\`\`\`bash
# Appliquer les changements
sudo systemctl restart rsyslog
\`\`\`

### Envoi de logs vers un serveur distant

\`\`\`bash
# Sur le serveur emetteur : /etc/rsyslog.d/70-remote.conf
*.* @@logserver.exemple.com:514

# Sur le serveur recepteur : /etc/rsyslog.conf
# Activer la reception TCP
module(load="imtcp")
input(type="imtcp" port="514")

# Stocker par hostname
template(name="RemoteLogs" type="string" string="/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log")
*.* ?RemoteLogs
\`\`\`

> **En DevOps :** rsyslog est souvent utilise comme **agent de collecte** pour envoyer les logs vers un systeme centralise (ELK Stack, Graylog, Loki). La configuration est simple et fiable.`
      },
      {
        title: 'Journald — Le systeme de logs systemd',
        content: `**journald** (systemd-journald) est le systeme de logs moderne integre a systemd. Contrairement a rsyslog qui ecrit des fichiers texte, journald stocke les logs dans un format binaire structure.

### Journald vs rsyslog

| Critere | journald | rsyslog |
|---------|----------|---------|
| **Format** | Binaire structure | Texte brut |
| **Consultation** | \`journalctl\` | \`cat\`, \`grep\`, \`tail\` |
| **Indexation** | Automatique (rapide a filtrer) | Pas d'index (grep sequentiel) |
| **Metadonnees** | Riches (PID, UID, unit...) | Limitees |
| **Persistence** | Configurable (volatile ou persistant) | Toujours persistant |
| **Transfert distant** | Possible (systemd-journal-remote) | Natif (UDP/TCP) |
| **Rotation** | Automatique par taille/temps | Via logrotate |

### Configuration de journald

\`\`\`bash
# Fichier de configuration
sudo nano /etc/systemd/journald.conf
\`\`\`

\`\`\`ini
# /etc/systemd/journald.conf
[Journal]
# Stockage persistant (survit aux redemarrages)
Storage=persistent

# Taille maximale sur disque
SystemMaxUse=500M

# Taille maximale par fichier journal
SystemMaxFileSize=100M

# Retention maximale
MaxRetentionSec=1month

# Compresser les anciens journaux
Compress=yes

# Transferer vers rsyslog aussi
ForwardToSyslog=yes

# Niveau maximum enregistre
MaxLevelStore=info
MaxLevelSyslog=info
\`\`\`

\`\`\`bash
# Appliquer les changements
sudo systemctl restart systemd-journald
\`\`\`

### Stockage des journaux

\`\`\`bash
# Logs persistants (survivent au reboot)
ls /var/log/journal/

# Logs volatiles (perdus au reboot)
ls /run/log/journal/

# Pour activer le stockage persistant :
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald
\`\`\`

### Requetes avancees avec journalctl

\`\`\`bash
# Filtrer par champ de metadonnees
journalctl _SYSTEMD_UNIT=nginx.service
journalctl _UID=1000
journalctl _PID=1234
journalctl _HOSTNAME=devops-srv01

# Combiner les filtres (ET logique)
journalctl _SYSTEMD_UNIT=nginx.service _PID=1234

# Afficher les champs disponibles
journalctl -o verbose -u nginx | head -30

# Statistiques sur les journaux
journalctl --header

# Nombre d'entrees par unite
journalctl --field _SYSTEMD_UNIT
\`\`\`

### Interactions journald + rsyslog

Par defaut sur la plupart des distributions, journald et rsyslog coexistent :

\`\`\`
Application ──> journald ──> rsyslog ──> /var/log/syslog
                  │
                  └──> /var/log/journal/ (binaire)
\`\`\`

Si \`ForwardToSyslog=yes\` (defaut), journald transmet les logs a rsyslog qui les ecrit dans les fichiers texte traditionnels. Les deux systemes sont complementaires.

> **Bonne pratique DevOps :** Activez le stockage persistant de journald (\`Storage=persistent\`) et definissez des limites de taille raisonnables. Les logs en format binaire sont plus rapides a interroger, surtout sur des serveurs avec beaucoup de services.`
      },
      {
        title: 'Rotation des logs avec logrotate',
        content: `Sans rotation, les fichiers de logs grandissent indefiniment et finissent par remplir le disque. **logrotate** est l'outil standard pour gerer cette rotation automatiquement.

### Configuration globale

\`\`\`bash
# Configuration principale
cat /etc/logrotate.conf
\`\`\`

\`\`\`
# /etc/logrotate.conf
# Rotation hebdomadaire
weekly

# Garder 4 fichiers archives
rotate 4

# Creer un nouveau fichier apres rotation
create

# Compresser les anciens fichiers
compress

# Compresser avec un delai (le precedent n'est pas compresse)
delaycompress

# Ne pas generer d'erreur si le fichier n'existe pas
missingok

# Ne pas faire de rotation si le fichier est vide
notifempty

# Charger les configurations additionnelles
include /etc/logrotate.d
\`\`\`

### Configurations par service

\`\`\`bash
# Rotation nginx
cat /etc/logrotate.d/nginx
\`\`\`

\`\`\`
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}
\`\`\`

### Creer une configuration personnalisee

\`\`\`bash
# /etc/logrotate.d/mon-api
/var/log/mon-api/*.log {
    daily                    # Rotation quotidienne
    rotate 30                # Garder 30 jours
    compress                 # Compresser les anciens
    delaycompress            # Sauf le dernier archive
    missingok                # Pas d'erreur si absent
    notifempty               # Pas de rotation si vide
    create 0644 deploy deploy  # Permissions du nouveau fichier
    size 100M                # OU rotation quand > 100 Mo
    dateext                  # Suffixe par date (20260304)
    dateformat -%Y%m%d       # Format de la date
    sharedscripts            # Un seul script pour tous les fichiers
    postrotate
        systemctl reload mon-api > /dev/null 2>&1 || true
    endscript
}
\`\`\`

### Directives importantes

| Directive | Description |
|-----------|-------------|
| \`daily\` / \`weekly\` / \`monthly\` | Frequence de rotation |
| \`rotate N\` | Nombre d'archives a conserver |
| \`compress\` | Compresser les archives (gzip) |
| \`size 100M\` | Rotation basee sur la taille |
| \`maxsize 500M\` | Rotation forcee si > 500M (meme si pas daily) |
| \`minsize 10M\` | Ne pas tourner si < 10M |
| \`create MODE USER GROUP\` | Creer un nouveau fichier avec ces droits |
| \`copytruncate\` | Copier puis vider (pour les apps qui gardent le fd ouvert) |
| \`postrotate/endscript\` | Script a executer apres rotation |
| \`dateext\` | Utiliser la date au lieu d'un numero |

### Test et execution manuelle

\`\`\`bash
# Tester sans executer (dry run)
sudo logrotate -d /etc/logrotate.d/mon-api

# Forcer la rotation immediatement
sudo logrotate -f /etc/logrotate.d/mon-api

# Verifier l'etat de logrotate
cat /var/lib/logrotate/status
\`\`\`

### Logrotate est execute par cron

\`\`\`bash
# Le timer systemd (ou cron) execute logrotate quotidiennement
cat /etc/cron.daily/logrotate
# ou
systemctl list-timers | grep logrotate
\`\`\`

> **Conseil DevOps :** Toujours tester avec \`logrotate -d\` avant de deployer une nouvelle configuration. Le \`postrotate\` est critique : il doit signaler au service de reouvrir ses fichiers de logs (sinon il ecrit dans l'ancien fichier renomme).`
      },
      {
        title: 'Centralisation des logs',
        content: `En environnement DevOps avec plusieurs serveurs, la centralisation des logs est essentielle pour le monitoring, le depannage et la conformite.

### Pourquoi centraliser ?

- **Correlation** : croiser les logs de plusieurs services pour diagnostiquer un incident
- **Persistence** : les logs survivent meme si un serveur est detruit
- **Recherche** : recherche full-text rapide sur des millions de lignes
- **Alerting** : declencher des alertes sur des patterns (erreurs, intrusions)
- **Conformite** : retention reglementaire des logs d'acces

### Solutions de centralisation

| Solution | Type | Complexite | Cout |
|----------|------|-----------|------|
| **rsyslog distant** | Push syslog | Faible | Gratuit |
| **ELK Stack** (Elasticsearch + Logstash + Kibana) | Full-stack | Elevee | Gratuit (self-hosted) |
| **PLG Stack** (Promtail + Loki + Grafana) | Full-stack | Moyenne | Gratuit (self-hosted) |
| **Graylog** | Full-stack | Moyenne | Gratuit (CE) |
| **Datadog** | SaaS | Faible | Payant |
| **Splunk** | SaaS / On-prem | Elevee | Payant |

### Architecture ELK Stack

\`\`\`
Serveurs                   Pipeline                    Interface
┌──────────┐          ┌──────────────┐           ┌──────────────┐
│ Filebeat │─────────>│  Logstash    │──────────>│Elasticsearch │
│ (agent)  │          │  (parsing)   │           │  (stockage)  │
└──────────┘          └──────────────┘           └──────┬───────┘
┌──────────┐                                           │
│ Filebeat │─────────────────────────────>              │
└──────────┘                                    ┌──────┴───────┐
                                                │   Kibana     │
                                                │  (dashboard) │
                                                └──────────────┘
\`\`\`

### Filebeat — Agent de collecte leger

\`\`\`yaml
# /etc/filebeat/filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/nginx/access.log
      - /var/log/nginx/error.log
    tags: ["nginx"]

  - type: log
    enabled: true
    paths:
      - /var/log/syslog
    tags: ["system"]

output.elasticsearch:
  hosts: ["http://elk-server:9200"]
  index: "filebeat-%{+yyyy.MM.dd}"

# OU envoyer vers Logstash pour traitement
output.logstash:
  hosts: ["elk-server:5044"]
\`\`\`

### Architecture PLG (Promtail + Loki + Grafana)

Plus legere que ELK, Loki n'indexe que les **labels** (pas le contenu des logs).

\`\`\`yaml
# /etc/promtail/config.yml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki-server:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets: ["localhost"]
        labels:
          job: syslog
          host: devops-srv01
          __path__: /var/log/syslog

  - job_name: nginx
    static_configs:
      - targets: ["localhost"]
        labels:
          job: nginx
          host: devops-srv01
          __path__: /var/log/nginx/*.log
\`\`\`

### Bonnes pratiques de centralisation

1. **Structurer les logs** : utilisez le format JSON quand c'est possible
2. **Ajouter des labels** : hostname, service, environnement (prod/staging/dev)
3. **Definir une retention** : ne pas tout garder indefiniment (couteux en stockage)
4. **Creer des alertes** : erreurs 500, tentatives SSH echouees, espace disque critique
5. **Securiser le transport** : TLS entre les agents et le serveur de logs

\`\`\`bash
# Exemple : configurer nginx pour des logs JSON
# /etc/nginx/nginx.conf
log_format json_combined escape=json
  '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"method":"$request_method",'
    '"uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"user_agent":"$http_user_agent"'
  '}';

access_log /var/log/nginx/access.log json_combined;
\`\`\`

> **Recommendation DevOps :** Pour debuter, la stack **PLG** (Promtail + Loki + Grafana) est plus simple a deployer et consomme moins de ressources que ELK. Grafana peut aussi servir pour le monitoring de metriques avec Prometheus.`
      }
    ]
  },
  {
    id: 105,
    slug: 'scripting-bash',
    title: 'Scripting Bash Avance',
    subtitle: 'Ecrire des scripts Bash robustes pour automatiser les taches DevOps',
    icon: 'Code',
    color: '#f97316',
    duration: '45 min',
    level: 'Avance',
    videoId: '3CR7tS56Obo',
    sections: [
      {
        title: 'Variables et conditions',
        content: `Le scripting Bash est la premiere brique de l'automatisation DevOps. Avant d'utiliser Ansible ou Terraform, on automatise avec des scripts shell.

### Structure de base d'un script

\`\`\`bash
#!/bin/bash
# Shebang : indique l'interpreteur a utiliser
# TOUJOURS mettre en premiere ligne

# Mode strict (fortement recommande)
set -euo pipefail
# -e : arreter en cas d'erreur
# -u : erreur si variable non definie
# -o pipefail : propager les erreurs dans les pipes
\`\`\`

### Variables

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Declaration de variables (PAS d'espaces autour du =)
NOM="DevOps"
VERSION=3
CHEMIN="/opt/mon-app"

# Utilisation
echo "Bienvenue $NOM"
echo "Version : $VERSION"
echo "Chemin : \${CHEMIN}/config"     # Accolades pour delimiter

# Variables d'environnement
export APP_ENV="production"           # Disponible pour les sous-processus
echo "Environnement : $APP_ENV"

# Substitution de commandes
DATE=$(date +%Y%m%d)
HOSTNAME=$(hostname)
IP=$(hostname -I | awk '{print $1}')

echo "Backup du $DATE sur $HOSTNAME ($IP)"

# Variables speciales
echo "Nom du script : $0"
echo "Nombre d'arguments : $#"
echo "Tous les arguments : $@"
echo "Premier argument : $1"
echo "Code retour precedent : $?"
echo "PID du script : $$"
\`\`\`

### Conditions

\`\`\`bash
#!/bin/bash
set -euo pipefail

# if / elif / else
if [ "$1" = "deploy" ]; then
    echo "Deploiement en cours..."
elif [ "$1" = "rollback" ]; then
    echo "Rollback en cours..."
else
    echo "Usage: $0 {deploy|rollback}"
    exit 1
fi

# Tests sur les fichiers
if [ -f "/etc/nginx/nginx.conf" ]; then
    echo "Nginx est installe"
fi

if [ -d "/var/log/nginx" ]; then
    echo "Le repertoire de logs nginx existe"
fi

if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERREUR : fichier de config manquant"
    exit 1
fi
\`\`\`

### Operateurs de test

| Operateur | Description | Exemple |
|-----------|-------------|---------|
| \`-f\` | Fichier existe | \`[ -f /etc/passwd ]\` |
| \`-d\` | Repertoire existe | \`[ -d /var/log ]\` |
| \`-r\` | Fichier lisible | \`[ -r config.yml ]\` |
| \`-w\` | Fichier inscriptible | \`[ -w /tmp ]\` |
| \`-x\` | Fichier executable | \`[ -x script.sh ]\` |
| \`-z\` | Chaine vide | \`[ -z "$VAR" ]\` |
| \`-n\` | Chaine non vide | \`[ -n "$VAR" ]\` |
| \`=\` | Egalite de chaines | \`[ "$A" = "$B" ]\` |
| \`!=\` | Difference de chaines | \`[ "$A" != "$B" ]\` |
| \`-eq\` | Egalite numerique | \`[ "$N" -eq 5 ]\` |
| \`-ne\` | Difference numerique | \`[ "$N" -ne 0 ]\` |
| \`-gt\` | Plus grand que | \`[ "$N" -gt 10 ]\` |
| \`-lt\` | Plus petit que | \`[ "$N" -lt 100 ]\` |

> **Bonne pratique :** Toujours encadrer les variables avec des guillemets doubles (\`"$VAR"\`) pour eviter les problemes avec les espaces et les chaines vides.`
      },
      {
        title: 'Boucles',
        content: `Les boucles permettent de repeter des operations sur des listes de serveurs, des fichiers, des services... Indispensable pour l'automatisation.

### Boucle for

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Boucle sur une liste
for SERVER in web01 web02 web03 db01; do
    echo "Verification de $SERVER..."
    ping -c 1 -W 2 "$SERVER" > /dev/null 2>&1 && echo "  OK" || echo "  INACCESSIBLE"
done

# Boucle sur une sequence de nombres
for i in {1..5}; do
    echo "Iteration $i"
done

# Boucle C-style
for ((i=0; i<10; i++)); do
    echo "Compteur : $i"
done

# Boucle sur les fichiers d'un repertoire
for FILE in /var/log/*.log; do
    SIZE=$(du -sh "$FILE" | awk '{print $1}')
    echo "$FILE : $SIZE"
done

# Boucle sur le resultat d'une commande
for USER in $(awk -F: '$3 >= 1000 {print $1}' /etc/passwd); do
    echo "Utilisateur humain : $USER"
done
\`\`\`

### Boucle while

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Lire un fichier ligne par ligne
while IFS= read -r LINE; do
    echo "Traitement : $LINE"
done < /etc/hosts

# Boucle avec compteur
COUNT=0
while [ "$COUNT" -lt 5 ]; do
    echo "Tentative $COUNT..."
    COUNT=$((COUNT + 1))
done

# Attendre qu'un service soit pret
MAX_RETRIES=30
RETRY=0
while ! curl -s http://localhost:8080/health > /dev/null; do
    RETRY=$((RETRY + 1))
    if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
        echo "ERREUR : le service n'a pas demarre apres $MAX_RETRIES tentatives"
        exit 1
    fi
    echo "En attente du service... ($RETRY/$MAX_RETRIES)"
    sleep 2
done
echo "Service disponible !"
\`\`\`

### Boucle until

\`\`\`bash
#!/bin/bash
# until : inverse de while (boucle JUSQU'A ce que la condition soit vraie)

until docker ps | grep -q "mon-conteneur"; do
    echo "En attente du conteneur..."
    sleep 3
done
echo "Conteneur demarre !"
\`\`\`

### Deploiement sur plusieurs serveurs

\`\`\`bash
#!/bin/bash
set -euo pipefail

SERVERS=("web01.exemple.com" "web02.exemple.com" "web03.exemple.com")
DEPLOY_DIR="/opt/mon-app"
ARCHIVE="app-v2.3.tar.gz"

for SERVER in "\${SERVERS[@]}"; do
    echo "=== Deploiement sur $SERVER ==="

    # Transferer l'archive
    scp "$ARCHIVE" "deploy@$SERVER:/tmp/"

    # Deployer sur le serveur distant
    ssh "deploy@$SERVER" << 'REMOTE'
        set -euo pipefail
        cd /opt/mon-app
        tar -xzf /tmp/app-v2.3.tar.gz
        sudo systemctl restart mon-app
        echo "Deploiement termine"
REMOTE

    echo "=== $SERVER : OK ==="
done

echo "Deploiement termine sur \${#SERVERS[@]} serveurs"
\`\`\`

> **Conseil :** Utilisez \`"\${ARRAY[@]}"\` (avec guillemets) pour iterer sur un tableau. Sans guillemets, les elements contenant des espaces seraient decoupes.`
      },
      {
        title: 'Fonctions',
        content: `Les fonctions rendent les scripts modulaires, lisibles et reutilisables. En DevOps, elles structurent les scripts de deploiement complexes.

### Declaration et appel

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Declaration d'une fonction
log_info() {
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') $*"
}

log_error() {
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') $*" >&2
}

log_success() {
    echo "[OK] $(date '+%Y-%m-%d %H:%M:%S') $*"
}

# Appel
log_info "Demarrage du script"
log_error "Quelque chose a echoue"
log_success "Operation terminee"
\`\`\`

### Fonctions avec parametres et retour

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Fonction avec parametres
check_service() {
    local SERVICE_NAME="$1"            # local : variable locale a la fonction

    if systemctl is-active --quiet "$SERVICE_NAME"; then
        echo "$SERVICE_NAME est actif"
        return 0                        # Succes
    else
        echo "$SERVICE_NAME est inactif"
        return 1                        # Echec
    fi
}

# Appel
if check_service "nginx"; then
    echo "Nginx fonctionne correctement"
else
    echo "ALERTE : Nginx est arrete !"
fi

# Fonction qui retourne une valeur (via stdout)
get_disk_usage() {
    local PARTITION="\${1:-/}"
    df -h "$PARTITION" | awk 'NR==2 {print $5}' | tr -d '%'
}

USAGE=$(get_disk_usage "/")
echo "Utilisation du disque / : \${USAGE}%"

if [ "$USAGE" -gt 80 ]; then
    echo "ALERTE : disque presque plein !"
fi
\`\`\`

### Script structure avec fonctions

\`\`\`bash
#!/bin/bash
set -euo pipefail

# === Configuration ===
APP_NAME="mon-api"
APP_DIR="/opt/$APP_NAME"
BACKUP_DIR="/opt/backups"
LOG_FILE="/var/log/\${APP_NAME}-deploy.log"

# === Fonctions ===
log() {
    local LEVEL="$1"; shift
    echo "[$LEVEL] $(date '+%H:%M:%S') $*" | tee -a "$LOG_FILE"
}

backup_current() {
    log "INFO" "Backup de la version actuelle..."
    local BACKUP_NAME="\${APP_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "\${BACKUP_DIR}/\${BACKUP_NAME}" -C "$APP_DIR" . || {
        log "ERROR" "Echec du backup"
        return 1
    }
    log "OK" "Backup cree : $BACKUP_NAME"
}

deploy_new_version() {
    local ARCHIVE="$1"
    log "INFO" "Deploiement de $ARCHIVE..."
    tar -xzf "$ARCHIVE" -C "$APP_DIR"
    log "OK" "Fichiers extraits"
}

restart_service() {
    log "INFO" "Redemarrage du service..."
    sudo systemctl restart "$APP_NAME"
    sleep 3
    if systemctl is-active --quiet "$APP_NAME"; then
        log "OK" "Service redemarre avec succes"
    else
        log "ERROR" "Le service n'a pas demarre"
        return 1
    fi
}

# === Main ===
main() {
    log "INFO" "=== Deploiement de $APP_NAME ==="

    if [ $# -lt 1 ]; then
        log "ERROR" "Usage: $0 <archive.tar.gz>"
        exit 1
    fi

    local ARCHIVE="$1"

    backup_current
    deploy_new_version "$ARCHIVE"
    restart_service

    log "OK" "=== Deploiement termine ==="
}

main "$@"
\`\`\`

> **Bonne pratique :** Utilisez \`local\` pour les variables dans les fonctions afin d'eviter la pollution de l'espace global. Structurez le script avec une fonction \`main()\` appelee a la fin.`
      },
      {
        title: 'Gestion des erreurs',
        content: `Un script DevOps fiable doit gerer les erreurs proprement. Un echec silencieux peut conduire a des deploiements corrompus ou des pertes de donnees.

### Le mode strict

\`\`\`bash
#!/bin/bash
# TOUJOURS activer le mode strict
set -euo pipefail

# -e : arreter immediatement si une commande echoue
# -u : erreur si on utilise une variable non definie
# -o pipefail : le code de retour d'un pipe est celui de la derniere commande echouee

# Exemple sans -e : le script continue malgre l'erreur
cd /repertoire/inexistant    # Erreur silencieuse
rm -rf *                      # CATASTROPHE : on supprime le repertoire courant !

# Avec -e : le script s'arrete a l'erreur
cd /repertoire/inexistant    # Le script s'arrete ici
\`\`\`

### Gestion d'erreur avec trap

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Fonction de nettoyage executee en cas d'erreur ou de sortie
cleanup() {
    local EXIT_CODE=$?
    echo "[CLEANUP] Nettoyage en cours..."

    # Supprimer les fichiers temporaires
    rm -f /tmp/deploy-*.tmp

    # Retablir le service si necessaire
    if [ "$EXIT_CODE" -ne 0 ]; then
        echo "[ERROR] Script termine avec le code $EXIT_CODE"
        echo "[ROLLBACK] Restauration de la version precedente..."
        # Logique de rollback ici
    fi
}

# Enregistrer le trap (execute a la sortie du script)
trap cleanup EXIT

# Trap pour signaux specifiques
trap 'echo "Script interrompu par Ctrl+C"; exit 130' INT
trap 'echo "Signal TERM recu"; exit 143' TERM
\`\`\`

### Patterns de gestion d'erreur

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Pattern 1 : || pour gerer un echec specifique
mkdir -p /opt/backup || { echo "Impossible de creer le repertoire"; exit 1; }

# Pattern 2 : if pour tester le succes
if ! docker build -t mon-app:latest .; then
    echo "Echec du build Docker"
    exit 1
fi

# Pattern 3 : code de retour
deploy() {
    scp archive.tar.gz "deploy@server:/tmp/"
    local RC=$?
    if [ "$RC" -ne 0 ]; then
        echo "Echec du transfert (code: $RC)"
        return 1
    fi
    return 0
}

# Pattern 4 : timeout
timeout 60 curl -s http://localhost:8080/health || {
    echo "Le service n'a pas repondu en 60 secondes"
    exit 1
}

# Pattern 5 : retry avec backoff
retry_with_backoff() {
    local MAX_RETRIES="\${1}"; shift
    local DELAY=1
    local RETRY=0

    until "$@"; do
        RETRY=$((RETRY + 1))
        if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
            echo "Echec apres $MAX_RETRIES tentatives"
            return 1
        fi
        echo "Tentative $RETRY echouee, prochaine dans \${DELAY}s..."
        sleep "$DELAY"
        DELAY=$((DELAY * 2))    # Backoff exponentiel
    done
}

# Utilisation : 5 tentatives avec backoff
retry_with_backoff 5 curl -sf http://localhost:8080/health
\`\`\`

### Validation des prerequis

\`\`\`bash
#!/bin/bash
set -euo pipefail

# Verifier que le script est lance en root
check_root() {
    if [ "$(id -u)" -ne 0 ]; then
        echo "Ce script doit etre lance en root (sudo)"
        exit 1
    fi
}

# Verifier les dependances
check_dependencies() {
    local DEPS=("docker" "curl" "jq" "tar")
    for DEP in "\${DEPS[@]}"; do
        if ! command -v "$DEP" &> /dev/null; then
            echo "ERREUR : '$DEP' n'est pas installe"
            exit 1
        fi
    done
    echo "Toutes les dependances sont presentes"
}

check_root
check_dependencies
\`\`\`

> **Regle d'or DevOps :** Un script qui echoue silencieusement est plus dangereux qu'un script qui s'arrete avec une erreur explicite. Utilisez \`set -euo pipefail\` + \`trap cleanup EXIT\` dans TOUS vos scripts.`
      },
      {
        title: 'Scripts d\'automatisation pratiques',
        content: `Voici des scripts Bash concrets couramment utilises en DevOps pour automatiser les taches repetitives.

### Script de backup automatique

\`\`\`bash
#!/bin/bash
set -euo pipefail

# === Configuration ===
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30
MYSQL_CONTAINER="revision-mysql"
DB_NAME="revision_reseaux"
DB_USER="revision_user"
DB_PASS="your_db_password"
DATE=$(date +%Y%m%d_%H%M%S)

# === Fonctions ===
log() { echo "[$(date '+%H:%M:%S')] $*"; }

backup_database() {
    log "Backup de la base de donnees..."
    local DUMP_FILE="\${BACKUP_DIR}/db_\${DB_NAME}_\${DATE}.sql.gz"
    docker exec "$MYSQL_CONTAINER" mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$DUMP_FILE"
    log "Dump cree : $DUMP_FILE ($(du -sh "$DUMP_FILE" | awk '{print $1}'))"
}

backup_config() {
    log "Backup des fichiers de configuration..."
    tar -czf "\${BACKUP_DIR}/config_\${DATE}.tar.gz" \\
        /etc/nginx/ \\
        /etc/systemd/system/*.service \\
        2>/dev/null || true
    log "Config sauvegardee"
}

cleanup_old_backups() {
    log "Nettoyage des backups de plus de $RETENTION_DAYS jours..."
    local COUNT
    COUNT=$(find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" | wc -l)
    find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -delete
    log "$COUNT anciens fichiers supprimes"
}

# === Main ===
main() {
    mkdir -p "$BACKUP_DIR"
    log "=== Debut du backup ==="

    backup_database
    backup_config
    cleanup_old_backups

    log "=== Backup termine ==="
    log "Espace utilise : $(du -sh "$BACKUP_DIR" | awk '{print $1}')"
}

main
\`\`\`

### Script de healthcheck

\`\`\`bash
#!/bin/bash
set -euo pipefail

# === Services a verifier ===
declare -A SERVICES=(
    ["nginx"]="http://localhost:80"
    ["api"]="http://localhost:3000/api/health"
    ["mysql"]="docker exec revision-mysql mysqladmin ping -u root -pyour_root_password"
)

ALERT_EMAIL="admin@exemple.com"
ISSUES=()

check_http() {
    local NAME="$1" URL="$2"
    local HTTP_CODE
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$URL" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        echo "[OK] $NAME (HTTP $HTTP_CODE)"
    else
        echo "[FAIL] $NAME (HTTP $HTTP_CODE)"
        ISSUES+=("$NAME: HTTP $HTTP_CODE")
    fi
}

check_disk() {
    local USAGE
    USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

    if [ "$USAGE" -gt 90 ]; then
        echo "[CRIT] Disque : \${USAGE}% utilise"
        ISSUES+=("Disque: \${USAGE}% (critique)")
    elif [ "$USAGE" -gt 80 ]; then
        echo "[WARN] Disque : \${USAGE}% utilise"
    else
        echo "[OK] Disque : \${USAGE}% utilise"
    fi
}

check_memory() {
    local MEM_USAGE
    MEM_USAGE=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 * 100}')

    if [ "$MEM_USAGE" -gt 90 ]; then
        echo "[CRIT] Memoire : \${MEM_USAGE}% utilisee"
        ISSUES+=("Memoire: \${MEM_USAGE}% (critique)")
    else
        echo "[OK] Memoire : \${MEM_USAGE}% utilisee"
    fi
}

# === Execution ===
echo "=== Healthcheck $(date) ==="
check_http "nginx" "http://localhost:80"
check_http "api" "http://localhost:3000/api/health"
check_disk
check_memory

if [ \${#ISSUES[@]} -gt 0 ]; then
    echo ""
    echo "=== ALERTES ==="
    printf '%s\\n' "\${ISSUES[@]}"
fi
\`\`\`

### Script de deploiement zero-downtime

\`\`\`bash
#!/bin/bash
set -euo pipefail

APP_DIR="/opt/mon-app"
RELEASES_DIR="$APP_DIR/releases"
CURRENT_LINK="$APP_DIR/current"
SHARED_DIR="$APP_DIR/shared"
KEEP_RELEASES=5
VERSION="$1"

deploy() {
    local RELEASE_DIR="\${RELEASES_DIR}/\${VERSION}"

    # 1. Creer le repertoire de release
    mkdir -p "$RELEASE_DIR"

    # 2. Extraire le code
    tar -xzf "/tmp/app-\${VERSION}.tar.gz" -C "$RELEASE_DIR"

    # 3. Lier les fichiers partages (logs, uploads, .env)
    ln -sfn "$SHARED_DIR/.env" "$RELEASE_DIR/.env"
    ln -sfn "$SHARED_DIR/logs" "$RELEASE_DIR/logs"

    # 4. Basculer le lien symbolique (atomique !)
    ln -sfn "$RELEASE_DIR" "\${CURRENT_LINK}.new"
    mv -Tf "\${CURRENT_LINK}.new" "$CURRENT_LINK"

    # 5. Redemarrer le service
    sudo systemctl reload mon-app

    # 6. Nettoyer les anciennes releases
    cd "$RELEASES_DIR"
    ls -t | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

    echo "Deploiement v\${VERSION} termine !"
}

deploy
\`\`\``
      },
      {
        title: 'Cron et planification de taches',
        content: `**Cron** est le planificateur de taches historique de Linux. En DevOps, il automatise les backups, le nettoyage, les healthchecks et les deploiements programmes.

### Syntaxe crontab

\`\`\`
# Format :
# minute  heure  jour_du_mois  mois  jour_de_la_semaine  commande
# (0-59)  (0-23) (1-31)        (1-12) (0-7, 0 et 7 = dimanche)

# Exemples :
*  *  *  *  *     # Chaque minute
0  *  *  *  *     # Chaque heure
0  3  *  *  *     # Tous les jours a 3h00
0  3  *  *  1     # Chaque lundi a 3h00
0  0  1  *  *     # Le 1er de chaque mois a minuit
*/5  *  *  *  *   # Toutes les 5 minutes
0  8-18  *  *  1-5  # Toutes les heures de 8h a 18h, du lundi au vendredi
\`\`\`

### Gestion du crontab

\`\`\`bash
# Editer le crontab de l'utilisateur courant
crontab -e

# Lister le crontab
crontab -l

# Editer le crontab d'un autre utilisateur
sudo crontab -u deploy -e

# Supprimer le crontab
crontab -r
\`\`\`

### Exemples DevOps courants

\`\`\`bash
# Backup quotidien a 3h du matin
0 3 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1

# Healthcheck toutes les 5 minutes
*/5 * * * * /opt/scripts/healthcheck.sh >> /var/log/healthcheck.log 2>&1

# Nettoyage des logs chaque dimanche a 2h
0 2 * * 0 find /var/log -name "*.gz" -mtime +30 -delete

# Renouvellement SSL (Let's Encrypt) chaque jour a 4h
0 4 * * * certbot renew --quiet && systemctl reload nginx

# Synchronisation de fichiers toutes les heures
0 * * * * rsync -avz /opt/data/ backup-server:/opt/data/ >> /var/log/rsync.log 2>&1
\`\`\`

### Bonnes pratiques cron

\`\`\`bash
# 1. TOUJOURS rediriger la sortie (sinon emails cron)
0 3 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1

# 2. Utiliser des chemins absolus
0 3 * * * /usr/bin/python3 /opt/scripts/process.py

# 3. Definir les variables d'environnement
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=admin@exemple.com

# 4. Utiliser un fichier de lock pour eviter les executions paralleles
*/5 * * * * flock -n /tmp/healthcheck.lock /opt/scripts/healthcheck.sh

# 5. Logs avec horodatage
0 3 * * * echo "=== $(date) ===" >> /var/log/backup.log && /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
\`\`\`

### Systemd timers (alternative moderne)

\`\`\`ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Backup quotidien

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
\`\`\`

\`\`\`ini
# /etc/systemd/system/backup.service
[Unit]
Description=Execution du backup

[Service]
Type=oneshot
ExecStart=/opt/scripts/backup.sh
User=root
\`\`\`

\`\`\`bash
# Activer le timer
sudo systemctl enable --now backup.timer

# Verifier les timers actifs
systemctl list-timers --all
\`\`\`

### Cron vs Systemd Timers

| Critere | Cron | Systemd Timer |
|---------|------|---------------|
| **Simplicite** | Tres simple | Plus verbeux |
| **Logs** | Sortie a rediriger | journalctl automatique |
| **Rattrapage** | Non | \`Persistent=true\` (execute si manque) |
| **Dependances** | Non | \`After=\`, \`Requires=\` |
| **Randomisation** | Non | \`RandomizedDelaySec=\` |

> **Conseil DevOps :** Pour des taches simples, cron reste le plus pratique. Pour des taches complexes avec des dependances et du logging, privilegiez les systemd timers. Dans les deux cas, testez toujours vos scripts manuellement avant de les planifier.`
      }
    ]
  }
]
