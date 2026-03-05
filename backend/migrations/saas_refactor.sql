-- NetRevision SaaS Multi-Formation Migration
-- Run this AFTER backing up the database:
-- docker exec revision-mysql mysqldump -u root -proot revision_reseaux > backup.sql

-- ============================================
-- 1. Formation master table
-- ============================================
CREATE TABLE IF NOT EXISTS formation (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description TEXT,
  description_en TEXT,
  accent_color VARCHAR(20) DEFAULT '#00e5a0',
  icon VARCHAR(50) DEFAULT 'Network',
  order_index INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Program table (replaces hardcoded arrays)
-- ============================================
CREATE TABLE IF NOT EXISTS program (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  formation_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  color VARCHAR(20) DEFAULT '#00e5a0',
  description TEXT,
  description_en TEXT,
  order_index INT DEFAULT 0,
  CONSTRAINT fk_program_formation FOREIGN KEY (formation_id) REFERENCES formation(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Add content columns to chapter
-- ============================================
ALTER TABLE chapter
  ADD COLUMN IF NOT EXISTS subtitle VARCHAR(500) NULL AFTER title,
  ADD COLUMN IF NOT EXISTS icon VARCHAR(50) NULL AFTER subtitle,
  ADD COLUMN IF NOT EXISTS color VARCHAR(20) NULL AFTER icon,
  ADD COLUMN IF NOT EXISTS duration VARCHAR(20) NULL AFTER color,
  ADD COLUMN IF NOT EXISTS level VARCHAR(50) NULL AFTER duration,
  ADD COLUMN IF NOT EXISTS video_id VARCHAR(50) NULL AFTER level,
  ADD COLUMN IF NOT EXISTS video_id_en VARCHAR(50) NULL AFTER video_id,
  ADD COLUMN IF NOT EXISTS program_id VARCHAR(50) NULL AFTER formation;

-- Add FK for program_id (only if column was just added)
-- Note: MariaDB/MySQL will ignore if FK already exists with same name
ALTER TABLE chapter
  ADD CONSTRAINT fk_chapter_program FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE SET NULL;

-- ============================================
-- 4. Chapter sections (markdown content)
-- ============================================
CREATE TABLE IF NOT EXISTS chapter_section (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  chapter_id INT NOT NULL,
  title VARCHAR(500),
  title_en VARCHAR(500),
  content LONGTEXT,
  content_en LONGTEXT,
  order_index INT DEFAULT 0,
  CONSTRAINT fk_section_chapter FOREIGN KEY (chapter_id) REFERENCES chapter(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Quiz questions
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_question (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  chapter_id INT NOT NULL,
  question TEXT NOT NULL,
  question_en TEXT,
  options JSON NOT NULL,
  options_en JSON,
  correct_index INT NOT NULL DEFAULT 0,
  explanation TEXT,
  explanation_en TEXT,
  order_index INT DEFAULT 0,
  CONSTRAINT fk_quiz_chapter FOREIGN KEY (chapter_id) REFERENCES chapter(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Exam questions
-- ============================================
CREATE TABLE IF NOT EXISTS exam_question (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  program_id VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  question_en TEXT,
  options JSON NOT NULL,
  options_en JSON,
  correct_index INT NOT NULL DEFAULT 0,
  explanation TEXT,
  explanation_en TEXT,
  order_index INT DEFAULT 0,
  CONSTRAINT fk_exam_program FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Glossary terms
-- ============================================
CREATE TABLE IF NOT EXISTS glossary_term (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  formation_id VARCHAR(50) NOT NULL,
  term VARCHAR(255) NOT NULL,
  term_en VARCHAR(255),
  definition TEXT NOT NULL,
  definition_en TEXT,
  category VARCHAR(100),
  CONSTRAINT fk_glossary_formation FOREIGN KEY (formation_id) REFERENCES formation(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. Flashcards
-- ============================================
CREATE TABLE IF NOT EXISTS flashcard (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  formation_id VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  question_en TEXT,
  answer TEXT NOT NULL,
  answer_en TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(20) DEFAULT 'medium',
  CONSTRAINT fk_flashcard_formation FOREIGN KEY (formation_id) REFERENCES formation(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. CLI Labs
-- ============================================
CREATE TABLE IF NOT EXISTS cli_lab (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  formation_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description TEXT,
  description_en TEXT,
  scenario JSON,
  scenario_en JSON,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  order_index INT DEFAULT 0,
  CONSTRAINT fk_clilab_formation FOREIGN KEY (formation_id) REFERENCES formation(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. Seed formation + program data
-- ============================================
INSERT INTO formation (id, name, name_en, description, description_en, accent_color, icon, order_index) VALUES
('reseaux', 'Reseaux & CCNA', 'Networking & CCNA', '49 chapitres couvrant 100% du CCNA 200-301 : reseaux, switching, routage, services IP, securite, wireless et automation.', '49 chapters covering 100% of CCNA 200-301: networking, switching, routing, IP services, security, wireless and automation.', '#00e5a0', 'Network', 0),
('devops', 'Admin Systeme & DevOps', 'System Admin & DevOps', '38 chapitres couvrant Linux, Git, Docker, Kubernetes, Cloud, CI/CD, Monitoring, Securite et SRE.', '38 chapters covering Linux, Git, Docker, Kubernetes, Cloud, CI/CD, Monitoring, Security and SRE.', '#3b82f6', 'Container', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO program (id, formation_id, name, name_en, color, description, description_en, order_index) VALUES
('programme-1', 'reseaux', 'Fondamentaux Reseau', 'Network Fundamentals', '#00e5a0', 'OSI, composants, topologies, cablage, switching, IPv4, TCP/UDP, IPv6', 'OSI, components, topologies, cabling, switching, IPv4, TCP/UDP, IPv6', 0),
('programme-2', 'reseaux', 'Acces Reseau & Connectivite', 'Network Access & Connectivity', '#6366f1', 'VLANs, STP, inter-VLAN, EtherChannel, routage statique, OSPF', 'VLANs, STP, inter-VLAN, EtherChannel, static routing, OSPF', 1),
('programme-3', 'reseaux', 'Services IP & Entreprise', 'IP Services & Enterprise', '#f59e0b', 'NAT/PAT, DHCP, DNS, NTP, SNMP, Syslog, QoS, ACL', 'NAT/PAT, DHCP, DNS, NTP, SNMP, Syslog, QoS, ACL', 2),
('programme-4', 'reseaux', 'Securite', 'Security', '#e11d48', 'Concepts securite, Layer 2, VPN IPsec, AAA', 'Security concepts, Layer 2, IPsec VPN, AAA', 3),
('programme-5', 'reseaux', 'Wireless', 'Wireless', '#8b5cf6', 'Wi-Fi, architectures, WLAN, securite wireless, WLC', 'Wi-Fi, architectures, WLAN, wireless security, WLC', 4),
('programme-6', 'reseaux', 'Automation & Programmabilite', 'Automation & Programmability', '#06b6d4', 'SDN, APIs REST, outils de config, JSON, AI/ML', 'SDN, REST APIs, config tools, JSON, AI/ML', 5),
('devops-1', 'devops', 'Fondations Linux', 'Linux Foundations', '#f97316', 'Installation, commandes, permissions, systemd, logs, scripting bash', 'Installation, commands, permissions, systemd, logs, bash scripting', 0),
('devops-2', 'devops', 'Reseaux, Git & Scripting', 'Networking, Git & Scripting', '#8b5cf6', 'OSI, IP/CIDR, DNS, reverse proxy, Git, GitHub/GitLab, Python', 'OSI, IP/CIDR, DNS, reverse proxy, Git, GitHub/GitLab, Python', 1),
('devops-3', 'devops', 'Conteneurs & Docker', 'Containers & Docker', '#10b981', 'Conteneurs, Dockerfile, Docker Compose, volumes, securite, production', 'Containers, Dockerfile, Docker Compose, volumes, security, production', 2),
('devops-4', 'devops', 'Kubernetes', 'Kubernetes', '#ef4444', 'Architecture, Pods, Services, Ingress, Helm, Secrets, Autoscaling', 'Architecture, Pods, Services, Ingress, Helm, Secrets, Autoscaling', 3),
('devops-5', 'devops', 'Cloud & Infrastructure as Code', 'Cloud & Infrastructure as Code', '#3b82f6', 'AWS, Azure, GCP, Terraform, CloudFormation, bonnes pratiques', 'AWS, Azure, GCP, Terraform, CloudFormation, best practices', 4),
('devops-6', 'devops', 'CI/CD, Monitoring, Securite & SRE', 'CI/CD, Monitoring, Security & SRE', '#f59e0b', 'GitHub Actions, GitLab CI, Prometheus, ELK, DevSecOps, SRE', 'GitHub Actions, GitLab CI, Prometheus, ELK, DevSecOps, SRE', 5)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- 11. Update existing chapters with program_id
-- ============================================
UPDATE chapter SET program_id = program WHERE program IS NOT NULL AND program_id IS NULL;
