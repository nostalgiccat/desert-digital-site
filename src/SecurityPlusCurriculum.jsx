import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, BookOpen, Code, FileText, Brain, ExternalLink, Star, StickyNote, Flame, Printer, Target } from 'lucide-react';
import { storage } from './studyStorage';
import './study.css';

// Base path for Professor Messer's free SY0-701 videos
const PM = 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/';
const COURSE_INDEX = 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/';
const PRACTICE_EXAMS = 'https://www.professormesser.com/sy0-701-success-bundle/';

// Additional study resources
const RESOURCES = [
  { label: 'Official SY0-701 Exam Objectives (PDF)', url: 'https://www.professormesser.com/objectives', desc: "CompTIA's official objectives list — the actual exam blueprint." },
  { label: 'Messer Study Group Replays', url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-study-group/sy0-701-security-study-group-replays/', desc: 'Free recorded live Q&A sessions, organized by domain.' },
  { label: 'Messer Discord Community', url: 'https://discord.gg/dtf4uQPDZq', desc: 'Ask questions and study alongside other Security+ candidates.' },
  { label: 'Free Daily/Weekly Pop Quizzes', url: 'https://www.professormesser.com/join-my-pop-quiz-mailing-lists/', desc: 'Bite-size recall practice delivered by email.' },
  { label: 'TryHackMe', url: 'https://tryhackme.com/', desc: 'Guided hands-on labs — great for the network & AppSec weeks.' },
  { label: 'HackTheBox', url: 'https://www.hackthebox.com/', desc: 'More advanced hands-on labs once fundamentals are solid.' },
  { label: 'OWASP WebGoat', url: 'https://owasp.org/www-project-webgoat/', desc: 'Deliberately vulnerable app for the Week 6 AppSec lab.' },
  { label: "Messer's Course Notes & Practice Exams", url: PRACTICE_EXAMS, desc: 'Paid 96-page PDF notes + three 90-question practice exams.' }
];

// Notion notebook — general database plus per-week entries as they get added.
// Falls back to the general database link for any week without its own entry yet.
const NOTION_NOTES_DB_URL = 'https://app.notion.com/p/8fc9a773b7544c8a8c0d9d2ea61ed8bd';
const NOTION_WEEK_URLS = {
  1: 'https://app.notion.com/p/3a5466b1ce4d814b9198db9a44e75844',
};
const getNotionUrlForWeek = (week) => NOTION_WEEK_URLS[week] || NOTION_NOTES_DB_URL;

// Real CompTIA SY0-701 domain weights (per the official exam objectives)
const DOMAIN_WEIGHTS = { 1: 12, 2: 22, 3: 18, 4: 28, 5: 20 };
const DOMAIN_NAMES = {
  1: 'General Security Concepts',
  2: 'Threats, Vulnerabilities & Mitigations',
  3: 'Security Architecture',
  4: 'Security Operations',
  5: 'Security Program Management'
};
// Video titles carry their objective number in parentheses, e.g. "Firewalls (4.5)" — domain is the leading digit.
const getObjectiveDomain = (title) => {
  const match = title.match(/\((\d)\.\d+\)/);
  return match ? parseInt(match[1], 10) : null;
};

export default function SecurityPlusCurriculum() {
  const [weeks, setWeeks] = useState([]);
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [showQuiz, setShowQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState('');
  const [editingDate, setEditingDate] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [confidence, setConfidence] = useState({});
  const [showDomainBreakdown, setShowDomainBreakdown] = useState(false);
  const [showStreak, setShowStreak] = useState(false);

  // Curriculum re-mapped to Professor Messer's ACTUAL SY0-701 videos.
  // Each week is a study theme; the videos are pulled from across his 5 course
  // sections (his course isn't organized into these 10 weeks). Domain labels
  // reflect the real CompTIA SY0-701 objective domains.
  const curriculum = [
    {
      week: 1,
      title: "Security Fundamentals & Threats",
      domain: "Domains 1 & 2",
      tasks: [
        { id: 'w1v1', type: 'video', title: 'Security Controls (1.1)', url: PM + 'security-controls-sy0-701/', desc: 'Categories of security controls: technical, managerial, operational, physical.' },
        { id: 'w1v2', type: 'video', title: 'The CIA Triad (1.2)', url: PM + 'the-cia-triad-sy0-701/', desc: 'Confidentiality, integrity, availability — the foundation of everything.' },
        { id: 'w1v3', type: 'video', title: 'Threat Actors (2.1)', url: PM + 'threat-actors-sy0-701/', desc: 'Nation states, organized crime, insiders, shadow IT, and their motivations.' },
        { id: 'w1v4', type: 'video', title: 'Common Threat Vectors (2.2)', url: PM + 'common-threat-vectors-sy0-701/', desc: 'Messages, files, default credentials, and other ways attackers get in.' },
        { id: 'w1v5', type: 'video', title: 'An Overview of Malware (2.4)', url: PM + 'an-overview-of-malware-sy0-701/', desc: 'Malware and ransomware fundamentals.' },
        { id: 'w1v6', type: 'video', title: 'Change Management (1.3)', url: PM + 'change-management-sy0-701/', desc: 'Why formal change control matters and the typical approval/rollback workflow.' },
        { id: 'w1v7', type: 'video', title: 'Technical Change Management (1.3)', url: PM + 'technical-change-management-sy0-701/', desc: "Change management from a technician's perspective — implementation and documentation." },
        { id: 'w1l1', type: 'lab', title: 'Set up VirtualBox + Kali Linux', desc: 'Install a VM for hands-on practice all quarter.' },
        { id: 'w1p1', type: 'practice', title: 'Practice Qs: Threats', desc: 'Malware types, social engineering, threat actors.' },
        { id: 'w1q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Threats & fundamentals' }
      ]
    },
    {
      week: 2,
      title: "Cryptography & PKI",
      domain: "Domain 1.4 (Cryptographic Solutions)",
      tasks: [
        { id: 'w2v1', type: 'video', title: 'Public Key Infrastructure (1.4)', url: PM + 'public-key-infrastructure-sy0-701/', desc: 'Symmetric vs asymmetric encryption, key pairs, PKI foundations.' },
        { id: 'w2v2', type: 'video', title: 'Encrypting Data (1.4)', url: PM + 'encrypting-data-sy0-701/', desc: 'Database, transport, and full-disk encryption techniques.' },
        { id: 'w2v3', type: 'video', title: 'Hashing and Digital Signatures (1.4)', url: PM + 'hashing-and-digital-signatures-sy0-701/', desc: 'Integrity, authentication, and non-repudiation.' },
        { id: 'w2v4', type: 'video', title: 'Certificates (1.4)', url: PM + 'certificates-sy0-701/', desc: 'Digital certs, CSRs, revocation, OCSP stapling.' },
        { id: 'w2v5', type: 'video', title: 'Cryptographic Attacks (2.4)', url: PM + 'cryptographic-attacks-sy0-701/', desc: 'Downgrade attacks, SSL stripping, hash collisions.' },
        { id: 'w2l1', type: 'lab', title: 'Generate SSH Keys', desc: 'Create and use RSA key pairs on Linux (ssh-keygen).' },
        { id: 'w2p1', type: 'practice', title: 'Practice Qs: Crypto', desc: 'Symmetric vs asymmetric, hashing, PKI.' },
        { id: 'w2q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Cryptography deep-dive' }
      ]
    },
    {
      week: 3,
      title: "Identity, Access Control & Authentication",
      domain: "Domain 4.6 (+ 1.2 AAA)",
      tasks: [
        { id: 'w3v1', type: 'video', title: 'Authentication, Authorization & Accounting (1.2)', url: PM + 'authentication-authorization-and-accounting-sy0-701/', desc: 'The AAA framework end to end.' },
        { id: 'w3v2', type: 'video', title: 'Identity and Access Management (4.6)', url: PM + 'identity-and-access-management-sy0-701/', desc: 'Provisioning, SSO, permission assignment — core AppSec territory.' },
        { id: 'w3v3', type: 'video', title: 'Access Controls (4.6)', url: PM + 'access-controls-sy0-701/', desc: 'RBAC, DAC, MAC, least privilege, ABAC.' },
        { id: 'w3v4', type: 'video', title: 'Multifactor Authentication (4.6)', url: PM + 'multifactor-authentication-sy0-701/', desc: 'Something you know / have / are / somewhere you are.' },
        { id: 'w3v5', type: 'video', title: 'Password Security (4.6)', url: PM + 'password-security-sy0-701/', desc: 'Complexity, managers, passwordless auth.' },
        { id: 'w3l1', type: 'lab', title: 'Linux User & Permission Lab', desc: 'chmod, chown, sudo, ACLs.' },
        { id: 'w3p1', type: 'practice', title: 'Practice Qs: Access Control', desc: 'RBAC vs DAC vs MAC, MFA factors.' },
        { id: 'w3q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Access Control & Auth' }
      ]
    },
    {
      week: 4,
      title: "Security Architecture & Network Security",
      domain: "Domain 3 (+ 4.5)",
      tasks: [
        { id: 'w4v1', type: 'video', title: 'Secure Infrastructures (3.2)', url: PM + 'secure-infrastructures-sy0-701/', desc: 'Security zones, attack surfaces, connectivity.' },
        { id: 'w4v2', type: 'video', title: 'Network Appliances (3.2)', url: PM + 'network-appliances-sy0-701/', desc: 'Jump servers, proxies, load balancers, sensors.' },
        { id: 'w4v3', type: 'video', title: 'Firewall Types (3.2)', url: PM + 'firewall-types-sy0-701/', desc: 'UTMs, NGFWs, and WAFs (WAF matters for AppSec).' },
        { id: 'w4v4', type: 'video', title: 'Firewalls (4.5)', url: PM + 'firewalls-sy0-701/', desc: 'Firewall rules, screened subnets, NGFW config.' },
        { id: 'w4v5', type: 'video', title: 'Intrusion Prevention (3.2)', url: PM + 'intrusion-prevention-sy0-701/', desc: 'IPS failure modes, active vs passive monitoring (IDS vs IPS).' },
        { id: 'w4v6', type: 'video', title: 'Segmentation and Access Control (2.5)', url: PM + 'segmentation-and-access-control-sy0-701/', desc: 'Network segmentation, ACLs, allow lists.' },
        { id: 'w4l1', type: 'lab', title: 'Firewall Rules Lab (TryHackMe)', desc: 'Practice filtering and port rules.' },
        { id: 'w4p1', type: 'practice', title: 'Practice Qs: Network Security', desc: 'Firewall types, IDS vs IPS, segmentation.' },
        { id: 'w4q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Network Security' }
      ]
    },
    {
      week: 5,
      title: "Secure Protocols & Wireless",
      domain: "Domains 3 & 4",
      tasks: [
        { id: 'w5v1', type: 'video', title: 'Secure Communication (3.2)', url: PM + 'secure-communication-sy0-701/', desc: 'VPN technologies, SD-WAN, SASE.' },
        { id: 'w5v2', type: 'video', title: 'Secure Protocols (4.5)', url: PM + 'secure-protocols-sy0-701/', desc: 'Protocol/port selection, transport methods, VPN tunnels.' },
        { id: 'w5v3', type: 'video', title: 'Securing Wireless and Mobile (4.1)', url: PM + 'securing-wireless-and-mobile-sy0-701/', desc: 'Site surveys, MDM, BYOD, COPE.' },
        { id: 'w5v4', type: 'video', title: 'Wireless Security Settings (4.1)', url: PM + 'wireless-security-settings-sy0-701/', desc: 'WPA3, RADIUS, 802.1X, EAP.' },
        { id: 'w5v5', type: 'video', title: 'Wireless Attacks (2.4)', url: PM + 'wireless-attacks-sy0-701/', desc: 'Deauth attacks, RF jamming.' },
        { id: 'w5l1', type: 'lab', title: 'Packet Analysis with Wireshark', desc: 'Compare HTTP vs HTTPS traffic on the wire.' },
        { id: 'w5p1', type: 'practice', title: 'Practice Qs: Protocols & Wireless', desc: 'TLS, IPSec, WPA3, EAP.' },
        { id: 'w5q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Protocols & Wireless' }
      ]
    },
    {
      week: 6,
      title: "Application & Data Security  ⭐ AppSec",
      domain: "Domains 2, 3 & 4",
      tasks: [
        { id: 'w6v1', type: 'video', title: 'SQL Injection (2.3)', url: PM + 'sql-injection-sy0-701/', desc: 'The classic injection attack against your data layer.' },
        { id: 'w6v2', type: 'video', title: 'Cross-site Scripting (2.3)', url: PM + 'cross-site-scripting-sy0-701/', desc: 'Reflected/stored/DOM XSS — bread-and-butter AppSec.' },
        { id: 'w6v3', type: 'video', title: 'Application Attacks (2.4)', url: PM + 'application-attacks-sy0-701/', desc: 'Privilege escalation, directory traversal, and more.' },
        { id: 'w6v4', type: 'video', title: 'Application Security (4.1)', url: PM + 'application-security-sy0-701/', desc: 'Input validation, secure cookies, code signing, sandboxing.' },
        { id: 'w6v5', type: 'video', title: 'Data Types and Classifications (3.3)', url: PM + 'data-types-and-classifications-sy0-701/', desc: 'Classifying and labeling sensitive data.' },
        { id: 'w6v6', type: 'video', title: 'States of Data (3.3)', url: PM + 'states-of-data-sy0-701/', desc: 'At rest, in transit, in use.' },
        { id: 'w6v7', type: 'video', title: 'Protecting Data (3.3)', url: PM + 'protecting-data-sy0-701/', desc: 'Encryption, hashing, tokenization, masking.' },
        { id: 'w6v8', type: 'video', title: 'Monitoring Data (4.5)', url: PM + 'monitoring-data-sy0-701/', desc: 'DLP, file integrity monitoring, USB blocking.' },
        { id: 'w6l1', type: 'lab', title: 'OWASP WebGoat Lab', desc: 'Hands-on SQLi, XSS, CSRF in a deliberately vulnerable app.' },
        { id: 'w6p1', type: 'practice', title: 'Practice Qs: App & Data Security', desc: 'Secure coding, DLP, encryption at rest.' },
        { id: 'w6q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Application & Data Security' }
      ]
    },
    {
      week: 7,
      title: "Incident Response, Resiliency & Recovery",
      domain: "Domains 4 & 3",
      tasks: [
        { id: 'w7v1', type: 'video', title: 'Incident Response (4.8)', url: PM + 'incident-response-sy0-701/', desc: 'Preparation, isolation, eradication, recovery.' },
        { id: 'w7v2', type: 'video', title: 'Incident Planning (4.8)', url: PM + 'incident-planning-sy0-701/', desc: 'Tabletop exercises, simulations, root cause analysis.' },
        { id: 'w7v3', type: 'video', title: 'Digital Forensics (4.8)', url: PM + 'digital-forensics-sy0-701/', desc: 'Legal hold, chain of custody, e-discovery.' },
        { id: 'w7v4', type: 'video', title: 'Resiliency (3.4)', url: PM + 'resiliency-sy0-701/', desc: 'Clustering, load balancing, site resiliency, multi-cloud.' },
        { id: 'w7v5', type: 'video', title: 'Recovery Testing (3.4)', url: PM + 'recovery-testing-sy0-701/', desc: 'Testing DR plans before you need them.' },
        { id: 'w7v6', type: 'video', title: 'Backups (3.4)', url: PM + 'backups-sy0-701/', desc: 'Frequency, snapshots, replication, encryption.' },
        { id: 'w7v7', type: 'video', title: 'Business Impact Analysis (5.2)', url: PM + 'business-impact-analysis-sy0-701/', desc: 'RTO, RPO, MTTR, MTBF.' },
        { id: 'w7l1', type: 'lab', title: 'IR Simulation (TryHackMe)', desc: 'Walk a mock incident end to end.' },
        { id: 'w7p1', type: 'practice', title: 'Practice Qs: IR & Recovery', desc: 'RTO, RPO, chain of custody.' },
        { id: 'w7q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Incident Response & Recovery' }
      ]
    },
    {
      week: 8,
      title: "Governance, Risk & Compliance",
      domain: "Domain 5",
      tasks: [
        { id: 'w8v1', type: 'video', title: 'Security Policies (5.1)', url: PM + 'security-policies-sy0-701/', desc: 'AUPs, business continuity, information security policies.' },
        { id: 'w8v2', type: 'video', title: 'Risk Management (5.2)', url: PM + 'risk-management-sy0-701/', desc: 'Ad hoc vs recurring assessments.' },
        { id: 'w8v3', type: 'video', title: 'Risk Analysis (5.2)', url: PM + 'risk-analysis-sy0-701/', desc: 'Risk appetite, tolerance, registers.' },
        { id: 'w8v4', type: 'video', title: 'Risk Management Strategies (5.2)', url: PM + 'risk-management-strategies-sy0-701/', desc: 'Transfer, accept, avoid, mitigate.' },
        { id: 'w8v5', type: 'video', title: 'Third-party Risk Assessment (5.3)', url: PM + 'third-party-risk-assessment-sy0-701/', desc: 'Right-to-audit, supply chain, vendor monitoring.' },
        { id: 'w8v6', type: 'video', title: 'Compliance (5.4)', url: PM + 'compliance-sy0-701/', desc: 'Regulatory compliance, monitoring, consequences.' },
        { id: 'w8v7', type: 'video', title: 'Audits and Assessments (5.5)', url: PM + 'audits-and-assessments-sy0-701/', desc: 'Internal vs external audits.' },
        { id: 'w8v8', type: 'video', title: 'Security Awareness (5.6)', url: PM + 'security-awareness-sy0-701/', desc: 'Phishing campaigns, anomalous behavior recognition, and reporting.' },
        { id: 'w8v9', type: 'video', title: 'User Training (5.6)', url: PM + 'user-training-sy0-701/', desc: 'Training delivery methods and tracking program effectiveness.' },
        { id: 'w8l1', type: 'lab', title: 'Risk Register Exercise', desc: 'Build a risk matrix for a fictional company.' },
        { id: 'w8p1', type: 'practice', title: 'Practice Qs: GRC', desc: 'Frameworks, risk scoring, compliance.' },
        { id: 'w8q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Governance & Risk' }
      ]
    },
    {
      week: 9,
      title: "Cloud, Security Operations & Monitoring",
      domain: "Domains 3 & 4",
      tasks: [
        { id: 'w9v1', type: 'video', title: 'Cloud Infrastructures (3.1)', url: PM + 'cloud-infrastructures-sy0-701/', desc: 'IaC, serverless, APIs, cloud responsibility models.' },
        { id: 'w9v2', type: 'video', title: 'Other Infrastructure Concepts (3.1)', url: PM + 'other-infrastructure-concepts-sy0-701/', desc: 'Virtualization, containerization, IoT, embedded systems.' },
        { id: 'w9v3', type: 'video', title: 'Vulnerability Scanning (4.3)', url: PM + 'vulnerability-scanning-sy0-701/', desc: 'Static analysis and fuzzing — key AppSec tooling.' },
        { id: 'w9v4', type: 'video', title: 'Security Monitoring (4.4)', url: PM + 'security-monitoring-sy0-701/', desc: 'Log aggregation, scanning, alerting.' },
        { id: 'w9v5', type: 'video', title: 'Security Tools (4.4)', url: PM + 'security-tools-sy0-701/', desc: 'SCAP, SIEM, secure baselines.' },
        { id: 'w9v6', type: 'video', title: 'Log Data (4.9)', url: PM + 'log-data-sy0-701/', desc: 'Firewall, application, endpoint, and OS logs.' },
        { id: 'w9v7', type: 'video', title: 'Scripting and Automation (4.7)', url: PM + 'scripting-and-automation-sy0-701/', desc: 'Automation benefits and use cases.' },
        { id: 'w9v8', type: 'video', title: 'Asset Management (4.2)', url: PM + 'asset-management-sy0-701/', desc: 'Procurement, asset tracking, media sanitization, and physical destruction.' },
        { id: 'w9l1', type: 'lab', title: 'Docker Security Lab', desc: 'Spin up a container and practice hardening it.' },
        { id: 'w9p1', type: 'practice', title: 'Practice Qs: Cloud & Ops', desc: 'Cloud models, containers, log analysis.' },
        { id: 'w9q1', type: 'quiz', title: 'Checkpoint Quiz', desc: 'Cloud & Security Operations' }
      ]
    },
    {
      week: 10,
      title: "Final Review & Practice Exams",
      domain: "All Domains",
      tasks: [
        { id: 'w10v1', type: 'video', title: 'How to Pass Your SY0-701 Exam', url: PM + 'how-to-pass-your-sy0-701-security-exam', desc: "Messer's strategy video — re-watch it before test day." },
        { id: 'w10v2', type: 'video', title: 'Full Course Video Index', url: COURSE_INDEX, desc: 'Re-watch any weak-area videos from the complete 121-video index.' },
        { id: 'w10l1', type: 'lab', title: 'Practice Exam 1 (target 80%+)', url: PRACTICE_EXAMS, desc: "Full-length timed exam. Messer's official practice exams linked here." },
        { id: 'w10l2', type: 'lab', title: 'Practice Exam 2', desc: 'Second full-length exam to confirm readiness (Boson recommended too).' },
        { id: 'w10p1', type: 'practice', title: 'Review Weak Areas', desc: 'Revisit any domain scoring below 75%.' },
        { id: 'w10q1', type: 'quiz', title: 'Final Checkpoint', desc: 'Comprehensive review across all domains.' }
      ]
    }
  ];

  const quizzes = {
    'w1q1': [
      { q: 'What is the difference between a threat and a vulnerability?', a: 'A threat is a potential danger; a vulnerability is a weakness that a threat can exploit.' },
      { q: 'Name the four categories of security controls.', a: 'Technical, Managerial, Operational, and Physical.' },
      { q: 'What is social engineering?', a: 'Manipulating people into divulging confidential information or performing actions that compromise security.' }
    ],
    'w2q1': [
      { q: 'Explain the difference between symmetric and asymmetric encryption.', a: 'Symmetric uses one shared key; asymmetric uses a public/private key pair. Asymmetric is slower but solves key exchange.' },
      { q: 'What does hashing provide that encryption does not?', a: 'Integrity verification via a one-way fingerprint. Hashing is not reversible and is not for confidentiality.' },
      { q: 'What is PKI used for?', a: 'Managing digital certificates and public/private key pairs to establish trust and secure communication.' }
    ],
    'w3q1': [
      { q: 'What does AAA stand for and what is each component?', a: 'Authentication (verify identity), Authorization (grant permissions), Accounting (log activity).' },
      { q: 'Why is MFA more secure than a password alone?', a: 'It requires multiple factor types (know/have/are/where), so one stolen factor is not enough.' },
      { q: 'What is the difference between RBAC and DAC?', a: 'RBAC assigns permissions by role (admin-controlled). DAC lets the resource owner control access.' }
    ],
    'w4q1': [
      { q: 'What is a screened subnet (DMZ) and why use it?', a: 'An isolated segment for public-facing servers, separating them from the internal network to limit exposure.' },
      { q: 'Difference between IDS and IPS?', a: 'IDS detects and alerts. IPS detects AND blocks inline.' },
      { q: 'What is a WAF and why does it matter for AppSec?', a: 'A Web Application Firewall filters HTTP traffic to block attacks like SQLi and XSS before they hit the app.' }
    ],
    'w5q1': [
      { q: 'Why use TLS instead of SSL?', a: 'SSL is deprecated and vulnerable; TLS is the modern, secure replacement.' },
      { q: 'What is the difference between WPA2 and WPA3?', a: 'WPA3 adds stronger encryption (SAE), forward secrecy, and better brute-force protection.' },
      { q: 'What does 802.1X provide on a network?', a: 'Port-based network access control — devices must authenticate (often via RADIUS/EAP) before gaining access.' }
    ],
    'w6q1': [
      { q: 'How does SQL injection work at a high level?', a: 'Unsanitized input is concatenated into a query, letting an attacker alter the query logic to read or modify data.' },
      { q: 'What is the core defense against both SQLi and XSS?', a: 'Input validation plus context-aware output encoding / parameterized queries. Never trust user input.' },
      { q: 'Name three application security controls from the 4.1 video.', a: 'Input validation, secure cookies, code signing, sandboxing, static/dynamic analysis (any three).' }
    ],
    'w7q1': [
      { q: 'What are the phases of incident response?', a: 'Preparation, Detection/Analysis, Containment, Eradication, Recovery, Post-Incident (lessons learned).' },
      { q: 'What is the difference between RTO and RPO?', a: 'RTO = max acceptable downtime to restore. RPO = max acceptable data loss measured in time.' },
      { q: 'What is chain of custody?', a: 'Documentation of who handled evidence, when, and how, to preserve its legal integrity.' }
    ],
    'w8q1': [
      { q: 'Name the four risk management strategies.', a: 'Transfer (e.g. insurance), Accept, Avoid, and Mitigate.' },
      { q: 'What lives in a risk register?', a: 'Identified risks with likelihood, impact, owners, and treatment/mitigation status.' },
      { q: 'What is a right-to-audit clause?', a: "A contract term letting you audit a third-party vendor's security controls." }
    ],
    'w9q1': [
      { q: 'What are the three main cloud service models?', a: 'IaaS (Infrastructure), PaaS (Platform), SaaS (Software).' },
      { q: 'Why are containers a security concern?', a: 'Shared kernel means container escapes, image tampering, and misconfig can compromise the host or neighbors.' },
      { q: 'What is a SIEM?', a: 'Security Information and Event Management — aggregates and correlates logs for detection, alerting, and reporting.' }
    ]
  };

  const STORAGE_KEY = 'sec-plus-progress-v2';
  const EXAM_DATE_KEY = 'sec-plus-exam-date';
  const CONFIDENCE_KEY = 'sec-plus-confidence';

  // Build a fresh weeks array from the curriculum, applying any saved completion flags.
  const buildWeeks = (completedMap = {}) =>
    curriculum.map(w => ({
      ...w,
      tasks: w.tasks.map(t => ({
        ...t,
        completed: !!completedMap[t.id],
        completedDate: typeof completedMap[t.id] === 'string' ? completedMap[t.id] : null
      }))
    }));

  useEffect(() => {
    const loadProgress = async () => {
      let completedMap = {};
      try {
        const result = await storage.get(STORAGE_KEY);
        if (result && result.value) completedMap = JSON.parse(result.value);
      } catch (err) {
        // Key doesn't exist yet or storage unavailable — start fresh.
      }
      try {
        const dateResult = await storage.get(EXAM_DATE_KEY);
        if (dateResult && dateResult.value) setExamDate(dateResult.value);
      } catch (err) {
        // No date set yet.
      }
      try {
        const confResult = await storage.get(CONFIDENCE_KEY);
        if (confResult && confResult.value) setConfidence(JSON.parse(confResult.value));
      } catch (err) {
        // No confidence ratings yet.
      }
      setWeeks(buildWeeks(completedMap));
      setLoading(false);
    };
    loadProgress();
  }, []);

  const saveExamDate = async (dateStr) => {
    setExamDate(dateStr);
    try {
      if (dateStr) {
        await storage.set(EXAM_DATE_KEY, dateStr);
      } else {
        await storage.delete(EXAM_DATE_KEY);
      }
    } catch (err) {
      console.error('Failed to save exam date:', err);
    }
  };

  const getDaysUntilExam = () => {
    if (!examDate) return null;
    const target = new Date(examDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  const saveConfidence = async (weekNum, rating) => {
    const updated = { ...confidence, [weekNum]: rating };
    setConfidence(updated);
    try {
      await storage.set(CONFIDENCE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save confidence rating:', err);
    }
  };

  // Exam-weighted readiness: only video tasks map cleanly to a CompTIA domain.
  const getDomainStats = () => {
    const stats = { 1: { done: 0, total: 0 }, 2: { done: 0, total: 0 }, 3: { done: 0, total: 0 }, 4: { done: 0, total: 0 }, 5: { done: 0, total: 0 } };
    weeks.forEach(w => w.tasks.forEach(t => {
      if (t.type !== 'video') return;
      const d = getObjectiveDomain(t.title);
      if (!d || !stats[d]) return;
      stats[d].total += 1;
      if (t.completed) stats[d].done += 1;
    }));
    return stats;
  };

  const getWeightedReadiness = () => {
    const stats = getDomainStats();
    let weightedSum = 0;
    let weightUsed = 0;
    Object.keys(DOMAIN_WEIGHTS).forEach((key) => {
      const d = Number(key);
      const w = DOMAIN_WEIGHTS[d];
      const s = stats[d];
      if (s.total > 0) {
        weightedSum += (s.done / s.total) * w;
        weightUsed += w;
      }
    });
    return weightUsed > 0 ? Math.round((weightedSum / weightUsed) * 100) : 0;
  };

  // Study streak: derived from every task's completedDate, across all types.
  const getStudyDatesSet = () => {
    const set = new Set();
    weeks.forEach(w => w.tasks.forEach(t => {
      if (t.completedDate) set.add(t.completedDate.slice(0, 10));
    }));
    return set;
  };

  const getStreakStats = () => {
    const set = getStudyDatesSet();
    let current = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (set.has(cursor.toISOString().slice(0, 10))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    const sorted = Array.from(set).sort();
    let longest = 0, run = 0, prev = null;
    sorted.forEach((dStr) => {
      const d = new Date(dStr + 'T00:00:00');
      run = prev && Math.round((d - prev) / (1000 * 60 * 60 * 24)) === 1 ? run + 1 : 1;
      longest = Math.max(longest, run);
      prev = d;
    });
    return { current, longest, totalDays: set.size };
  };

  const getHeatmapDays = (numDays = 70) => {
    const set = getStudyDatesSet();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, studied: set.has(key) });
    }
    return days;
  };

  // Weeks worth flagging for review: rated 3-or-below, or not yet rated but already has progress.
  const getWeakWeeks = () => {
    return weeks
      .map((w, idx) => ({ idx, week: w, rating: confidence[w.week] || 0, started: w.tasks.some(t => t.completed) }))
      .filter(w => w.started && w.rating > 0 && w.rating <= 3)
      .sort((a, b) => a.rating - b.rating);
  };

  // Persist only completion state (id -> true), so future curriculum edits
  // always come from code and never get overwritten by stale saved data.
  const saveProgress = async (updatedWeeks) => {
    const map = {};
    updatedWeeks.forEach(w => w.tasks.forEach(t => { if (t.completed) map[t.id] = t.completedDate || new Date().toISOString(); }));
    try {
      await storage.set(STORAGE_KEY, JSON.stringify(map));
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const toggleTask = (weekIdx, taskIdx) => {
    const updated = weeks.map((w, wi) =>
      wi === weekIdx
        ? { ...w, tasks: w.tasks.map((t, ti) => (ti === taskIdx ? { ...t, completed: !t.completed, completedDate: !t.completed ? new Date().toISOString() : null } : t)) }
        : w
    );
    setWeeks(updated);
    saveProgress(updated);
  };

  const resetProgress = async () => {
    setWeeks(buildWeeks({}));
    try { await storage.set(STORAGE_KEY, JSON.stringify({})); } catch (err) { /* noop */ }
  };

  const getProgressPercent = () => {
    if (weeks.length === 0) return 0;
    const total = weeks.reduce((acc, w) => acc + w.tasks.length, 0);
    const completed = weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.completed).length, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (err) {
      return '';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'video': return <BookOpen className="w-4 h-4" />;
      case 'lab': return <Code className="w-4 h-4" />;
      case 'practice': return <FileText className="w-4 h-4" />;
      case 'quiz': return <Brain className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-gray-600">Loading your curriculum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          .print-summary { display: block !important; }
        }
      `}</style>

      {/* Print-only summary — hidden on screen, shown only when printing */}
      <div className="print-summary" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>Security+ Mastery — Progress Summary</h1>
        <p style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>
          Generated {formatDate(new Date().toISOString())} · Overall: {getProgressPercent()}% · Exam-Weighted Readiness: {getWeightedReadiness()}%
          {examDate ? ` · Target exam date: ${formatDate(examDate + 'T00:00:00')}` : ''}
        </p>
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ fontSize: '13px' }}>Domain Breakdown</strong>
          <ul style={{ fontSize: '11px', marginTop: '4px' }}>
            {Object.keys(DOMAIN_WEIGHTS).map((key) => {
              const d = Number(key);
              const s = getDomainStats()[d];
              const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              return <li key={d}>Domain {d} · {DOMAIN_NAMES[d]} ({DOMAIN_WEIGHTS[d]}%) — {s.done}/{s.total} videos ({pct}%)</li>;
            })}
          </ul>
        </div>
        {weeks.map((week) => (
          <div key={week.week} style={{ marginBottom: '14px', pageBreakInside: 'avoid' }}>
            <strong style={{ fontSize: '13px' }}>
              Week {week.week}: {week.title} — {week.tasks.filter(t => t.completed).length}/{week.tasks.length}
              {confidence[week.week] ? ` (confidence ${confidence[week.week]}/5)` : ''}
            </strong>
            <ul style={{ fontSize: '11px', marginTop: '2px' }}>
              {week.tasks.map((t) => (
                <li key={t.id}>
                  [{t.completed ? 'x' : ' '}] {t.title}{t.completed && t.completedDate ? ` — ${formatDate(t.completedDate)}` : ''}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="screen-only max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">🔒 Security+ Mastery</h1>
              <p className="text-gray-600 mb-1">10-Week Study Plan · Real Professor Messer SY0-701 videos</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex-shrink-0 flex items-center gap-1 text-xs bg-white border border-gray-300 rounded px-3 py-2 text-gray-600 hover:bg-gray-50 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Each week is a study theme that pulls videos from across Messer&apos;s 5 course sections.
            Domain labels follow the official CompTIA SY0-701 objectives.{' '}
            <a href={COURSE_INDEX} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
              Full 121-video index →
            </a>
          </p>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-indigo-600">{getProgressPercent()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${getProgressPercent()}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-600">
                {weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.completed).length, 0)} of {weeks.reduce((acc, w) => acc + w.tasks.length, 0)} tasks complete
              </p>
              <button onClick={resetProgress} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Reset progress
              </button>
            </div>
          </div>

          {/* Exam-Weighted Readiness */}
          <div className="bg-white rounded-lg shadow p-4 mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700 inline-flex items-center gap-1">
                <Target className="w-4 h-4 text-purple-600" /> Exam-Weighted Readiness
              </span>
              <span className="text-lg font-bold text-purple-600">{getWeightedReadiness()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${getWeightedReadiness()}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Weighted by the real SY0-701 domain percentages, not raw task count.</p>
              <button onClick={() => setShowDomainBreakdown(!showDomainBreakdown)} className="text-xs text-purple-600 hover:text-purple-800 underline flex-shrink-0 ml-2">
                {showDomainBreakdown ? 'Hide breakdown' : 'Show breakdown'}
              </button>
            </div>
            {showDomainBreakdown && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                {Object.keys(DOMAIN_WEIGHTS).map((key) => {
                  const d = Number(key);
                  const stats = getDomainStats()[d];
                  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                  return (
                    <div key={d}>
                      <div className="flex justify-between items-center text-xs text-gray-600 mb-0.5">
                        <span>Domain {d} · {DOMAIN_NAMES[d]} ({DOMAIN_WEIGHTS[d]}%)</span>
                        <span>{stats.done}/{stats.total} videos</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-400 h-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weak Areas / Review Focus */}
          {getWeakWeeks().length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg shadow p-4 mt-3">
              <span className="font-semibold text-amber-800 text-sm">🎯 Recommended Review Focus</span>
              <div className="mt-2 space-y-1">
                {getWeakWeeks().map(({ idx, week, rating }) => (
                  <button
                    key={week.week}
                    onClick={() => setExpandedWeek(idx)}
                    className="block text-left text-sm text-amber-700 hover:text-amber-900 hover:underline"
                  >
                    W{week.week} · {week.title} — rated {rating}/5
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Study Streak */}
          <div className="bg-white rounded-lg shadow mt-3 overflow-hidden">
            <button
              onClick={() => setShowStreak(!showStreak)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700 inline-flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" /> Study Streak
                {getStreakStats().current > 0 && <span className="text-orange-600 font-bold">· {getStreakStats().current} day{getStreakStats().current === 1 ? '' : 's'}</span>}
              </span>
              <div className="text-indigo-600">
                {showStreak ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
            {showStreak && (
              <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                {(() => {
                  const stats = getStreakStats();
                  return (
                    <p className="text-xs text-gray-500 mb-3">
                      Current streak: <span className="font-semibold text-orange-600">{stats.current} day{stats.current === 1 ? '' : 's'}</span> ·
                      {' '}Longest: <span className="font-semibold">{stats.longest} day{stats.longest === 1 ? '' : 's'}</span> ·
                      {' '}Total study days: <span className="font-semibold">{stats.totalDays}</span>
                    </p>
                  );
                })()}
                <div className="flex flex-wrap gap-1">
                  {getHeatmapDays(70).map((d) => (
                    <div
                      key={d.date}
                      title={d.date}
                      className={`w-3 h-3 rounded-sm ${d.studied ? 'bg-orange-500' : 'bg-gray-200'}`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Last 70 days · each square is a day with at least one completed task</p>
              </div>
            )}
          </div>

          {/* Exam Target Date */}
          <div className="bg-white rounded-lg shadow p-4 mt-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-semibold text-gray-700">Target Exam Date</span>
              {!editingDate && (
                <button
                  onClick={() => setEditingDate(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                >
                  {examDate ? 'Change date' : 'Set a date'}
                </button>
              )}
            </div>

            {editingDate ? (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <input
                  type="date"
                  defaultValue={examDate}
                  onChange={(e) => saveExamDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
                />
                <button
                  onClick={() => setEditingDate(false)}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Done
                </button>
                {examDate && (
                  <button
                    onClick={() => { saveExamDate(''); setEditingDate(false); }}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            ) : examDate ? (
              (() => {
                const days = getDaysUntilExam();
                const isPast = days < 0;
                return (
                  <p className={`text-sm mt-1 ${isPast ? 'text-amber-600' : 'text-gray-600'}`}>
                    {isPast
                      ? `Target date (${formatDate(examDate + 'T00:00:00')}) has passed — update it whenever you're ready.`
                      : days === 0
                      ? "Today's the day! 🎯"
                      : <>Booked for <span className="font-semibold text-indigo-600">{formatDate(examDate + 'T00:00:00')}</span> — <span className="font-semibold">{days} day{days === 1 ? '' : 's'}</span> away (~{Math.round(days / 7)} week{Math.round(days / 7) === 1 ? '' : 's'}).</>}
                  </p>
                );
              })()
            ) : (
              <p className="text-sm text-gray-500 mt-1">Not set yet — no pressure. Set one whenever you're ready to commit.</p>
            )}
          </div>

          {/* Resources Panel Toggle */}
          <div className="bg-white rounded-lg shadow mt-3 overflow-hidden">
            <button
              onClick={() => setShowResources(!showResources)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700">📚 Study Resources</span>
              <div className="text-indigo-600">
                {showResources ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
            {showResources && (
              <div className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-3">
                {RESOURCES.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1">
                      {r.label}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weeks */}
        <div className="space-y-4">
          {weeks.map((week, weekIdx) => {
            const completedTasks = week.tasks.filter(t => t.completed).length;
            const totalTasks = week.tasks.length;
            const isExpanded = expandedWeek === weekIdx;

            return (
              <div key={week.week} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Week Header */}
                <button
                  onClick={() => setExpandedWeek(isExpanded ? -1 : weekIdx)}
                  className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4 flex-1 text-left">
                    <div className="text-xl md:text-2xl font-bold text-indigo-600 min-w-12">W{week.week}</div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">{week.title}</h2>
                      <p className="text-xs md:text-sm text-gray-600">{week.domain}</p>
                    </div>
                    {confidence[week.week] > 0 && (
                      <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0" title={`Confidence: ${confidence[week.week]}/5`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`w-3 h-3 ${n <= confidence[week.week] ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <div className="text-xs md:text-sm font-medium text-gray-600">
                      {completedTasks}/{totalTasks}
                    </div>
                    <div className="text-indigo-600">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </button>

                {/* Week Progress Bar */}
                <div className="px-4 md:px-6 py-2 bg-gray-50 border-t border-b border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Week Content */}
                {isExpanded && (
                  <div className="px-4 md:px-6 py-4 border-t border-gray-200 space-y-3">
                    {/* Confidence Rating */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">How confident do you feel on this week?</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => saveConfidence(week.week, n)} className="p-0.5">
                            <Star className={`w-5 h-5 ${n <= (confidence[week.week] || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {week.tasks.map((task, taskIdx) => (
                      <div key={task.id}>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <button
                            onClick={() => toggleTask(weekIdx, taskIdx)}
                            className="mt-1 flex-shrink-0 transition-colors hover:text-indigo-600"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-indigo-600 flex-shrink-0">{getTaskIcon(task.type)}</span>
                              {task.url ? (
                                <a
                                  href={task.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`font-semibold inline-flex items-center gap-1 hover:underline ${task.completed ? 'text-gray-400 line-through' : 'text-indigo-700 hover:text-indigo-900'}`}
                                >
                                  {task.title}
                                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                </a>
                              ) : (
                                <h3 className={`font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                  {task.title}
                                </h3>
                              )}
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize flex-shrink-0">
                                {task.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.desc}</p>

                            {task.completed && task.completedDate && (
                              <p className="text-xs text-green-600 font-medium mb-2">✓ Completed {formatDate(task.completedDate)}</p>
                            )}

                            {/* Quiz Button */}
                            {task.type === 'quiz' && quizzes[task.id] && (
                              <button
                                onClick={() => setShowQuiz(showQuiz === task.id ? null : task.id)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline mr-3"
                              >
                                {showQuiz === task.id ? 'Hide Quiz' : 'Take Quiz'}
                              </button>
                            )}

                            {/* Notes link */}
                            <a
                              href={getNotionUrlForWeek(week.week)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-500 hover:text-gray-700 font-medium underline inline-flex items-center gap-1"
                            >
                              <StickyNote className="w-3.5 h-3.5" />
                              Notes ↗
                            </a>
                          </div>
                        </div>

                        {/* Quiz Content */}
                        {showQuiz === task.id && quizzes[task.id] && (
                          <div className="ml-4 md:ml-9 mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <h4 className="font-bold text-indigo-800 mb-3 text-sm md:text-base">Checkpoint Quiz</h4>
                            <div className="space-y-3">
                              {quizzes[task.id].map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border border-indigo-100">
                                  <p className="font-semibold text-gray-800 mb-2 text-sm md:text-base">{idx + 1}. {item.q}</p>
                                  <details className="cursor-pointer">
                                    <summary className="text-indigo-600 hover:text-indigo-800 text-xs md:text-sm font-medium">
                                      Reveal Answer
                                    </summary>
                                    <p className="mt-2 text-gray-700 text-xs md:text-sm bg-green-50 p-2 rounded border-l-4 border-green-400">
                                      {item.a}
                                    </p>
                                  </details>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-xs md:text-sm space-y-1">
          <p>📺 Video links go straight to Professor Messer&apos;s free SY0-701 videos (open in a new tab)</p>
          <p>💪 Use TryHackMe, HackTheBox &amp; OWASP WebGoat for the hands-on labs</p>
          <p>✅ Check off tasks to track progress — it saves automatically</p>
        </div>
      </div>
    </div>
  );
}
