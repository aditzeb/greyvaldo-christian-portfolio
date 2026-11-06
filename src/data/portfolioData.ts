export type Language = 'en' | 'id';

export interface ExperienceItem {
  id: string;
  staCode: string;
  elevation: string;
  company: string;
  role: { en: string; id: string };
  period: { en: string; id: string };
  project: string;
  location: { en: string; id: string };
  metrics: { label: { en: string; id: string }; value: string }[];
  highlights: { en: string[]; id: string[] };
  photo?: {
    src: string;
    caption: { en: string; id: string };
    code: string;
    aspect: 'portrait' | 'square' | 'landscape';
    telemetry: string;
  };
}

export interface LeadershipItem {
  role: { en: string; id: string };
  organization: { en: string; id: string };
  period: string;
  staCode: string;
  description: { en: string; id: string };
}

export interface SkillGroup {
  code: string;
  category: { en: string; id: string };
  items: {
    name: { en: string; id: string };
    spec: { en: string; id: string };
  }[];
}

export interface AwardItem {
  id: string;
  code: string;
  title: { en: string; id: string };
  event: string;
  detail: { en: string; id: string };
  metric: string;
}

export const UI_COPY = {
  en: {
    navRole: '// QA/QC ENGINEER — IKN',
    navProfile: '01. PROFILE',
    navExperience: '02. EXPERIENCE',
    navEducation: '03. EDUCATION',
    navSkills: '04. SKILLS & AWARDS',
    navVault: '[FINANCE VAULT]',
    navMenu: 'MENU',
    navClose: 'CLOSE',
    heroBadge: 'NATIONAL STRATEGIC INFRASTRUCTURE // IBU KOTA NUSANTARA (IKN)',
    heroSpecTitle: 'PROFILE // ENGINEERING SUMMARY',
    heroSpecRole: 'QA/QC SPECIALIST',
    heroPrimaryCta: 'Download Engineering Dossier / Contact',
    heroSubTags: 'ITP / WMS / RIGID PAVEMENT / STRUCTURAL BRIDGE QC',
    expSectionCode: '02 // INFRASTRUCTURE TRACK RECORD (STA 0+000 — STA 7+000)',
    expSectionTitle: 'Work Experience & Field Operations',
    expSectionRight: 'PT. PP (PERSERO) TBK — IKN & BPJN SULUT',
    expProjectLabel: 'PROJECT ASSIGNMENT:',
    eduSectionCode: '03 // ACADEMIC RECORD & ORGANIZATIONAL ROLES',
    eduSectionTitle: 'Education, Academic Honours & Leadership',
    eduSectionRight: 'CUM LAUDE 3.64 / 4.00 — RANK #1 OF 40+ GRADUATES',
    eduSpecHeader: 'DEGREE SPECIFICATION // 144 CREDIT HOURS',
    eduGpaLabel: 'CUMULATIVE GPA',
    eduRankLabel: 'GRADUATING CLASS DISTINCTION',
    eduCourseworkLabel: 'CORE ENGINEERING COURSEWORK (144 CREDITS):',
    eduCapstoneLabel: 'URBAN PLANNING CAPSTONE PROJECT',
    skillsSectionCode: '04 // TECHNICAL COMPETENCIES & PUBLICATIONS',
    skillsSectionTitle: 'Technical Skills, Software & Awards',
    skillsSectionRight: 'AUTOCAD // SAP2000 // SKETCHUP // ITP & WMS',
    skillsVerified: 'TECHNICAL SPEC',
    footerStatus: 'PORTFOLIO // GREYVALDO-CHRISTIAN.WEB.APP',
    footerDossierBtn: 'Open Engineering Dossier',
    footerVaultBtn: '[FINANCE VAULT]',
    hudEngineLabel: '3D VIEW:',
    hudAuto: 'AUTO',
    hudStage1: '01: BRIDGE TRUSS',
    hudStage2: '02: RIGID PAVEMENT',
    hudStage3: '03: FEM MESH',
    hudReady: 'COORDINATES ACTIVE',
    photoInspect: 'INSPECT 1:1',
    photoVerified: '[RECORDED]',
    photoArchive: 'ORIGINAL ARCHIVE ASSET',
    dossierSpecHeader: 'CURRICULUM VITAE & ENGINEERING DOSSIER',
    dossierDirectEmail: 'EMAIL ADDRESS',
    dossierDirectPhone: 'PHONE / WHATSAPP',
    dossierBaseLocation: 'BASE LOCATION',
    dossierAvailability: 'OPEN FOR NATIONAL & MULTINATIONAL PROJECTS',
    dossierCopy: 'COPY',
    dossierCopied: 'COPIED',
    dossierDownloadTxt: 'Download CV Dossier (.TXT)',
    dossierPrintPdf: 'PRINT / SAVE PDF',
    dossierSendEmail: 'SEND EMAIL',
    dossierSec1: '01 // PROFILE SUMMARY',
    dossierSec2: '02 // WORK EXPERIENCE',
    dossierSec3: '03 // EDUCATION',
  },
  id: {
    navRole: '// INSINYUR QA/QC — IKN',
    navProfile: '01. PROFIL',
    navExperience: '02. PENGALAMAN',
    navEducation: '03. PENDIDIKAN',
    navSkills: '04. KEAHLIAN & PENGHARGAAN',
    navVault: '[BRANKAS KEUANGAN]',
    navMenu: 'MENU',
    navClose: 'TUTUP',
    heroBadge: 'PROYEK STRATEGIS NASIONAL // IBU KOTA NUSANTARA (IKN)',
    heroSpecTitle: 'PROFIL // RINGKASAN PROFESIONAL',
    heroSpecRole: 'SPESIALIS QA/QC',
    heroPrimaryCta: 'Unduh Dokumen CV / Kontak Langsung',
    heroSubTags: 'ITP / WMS / PERKERASAN KAKU / QC JEMBATAN & STRUKTUR',
    expSectionCode: '02 // REKAM JEJAK KONSTRUKSI (STA 0+000 — STA 7+000)',
    expSectionTitle: 'Pengalaman Kerja & Operasional Lapangan',
    expSectionRight: 'PT. PP (PERSERO) TBK — IKN & BPJN SULUT',
    expProjectLabel: 'PENUGASAN PROYEK:',
    eduSectionCode: '03 // REKAM AKADEMIK & KEPEMIMPINAN ORGANISASI',
    eduSectionTitle: 'Pendidikan, Lulusan Terbaik & Organisasi',
    eduSectionRight: 'CUM LAUDE 3.64 / 4.00 — PERINGKAT #1 DARI 40+ LULUSAN',
    eduSpecHeader: 'SPESIFIKASI AKADEMIK // 144 SKS',
    eduGpaLabel: 'INDEKS PRESTASI KUMULATIF (IPK)',
    eduRankLabel: 'PREDIKAT LULUSAN TERBAIK',
    eduCourseworkLabel: 'MATA KULIAH INTI TEKNIK SIPIL (144 SKS):',
    eduCapstoneLabel: 'TUGAS AKHIR PERENCANAAN KOTA BERKELanjutan',
    skillsSectionCode: '04 // KOMPETENSI TEKNIS & PENGHARGAAN QHSE',
    skillsSectionTitle: 'Keahlian Teknis, Perangkat Lunak & Penghargaan',
    skillsSectionRight: 'AUTOCAD // SAP2000 // SKETCHUP // ITP & WMS',
    skillsVerified: 'SPESIFIKASI TEKNIS',
    footerStatus: 'PORTOFOLIO // GREYVALDO-CHRISTIAN.WEB.APP',
    footerDossierBtn: 'Buka Dokumen CV & Kontak',
    footerVaultBtn: '[BRANKAS KEUANGAN]',
    hudEngineLabel: 'TAMPILAN 3D:',
    hudAuto: 'OTOMATIS',
    hudStage1: '01: RANGKA JEMBATAN',
    hudStage2: '02: PERKERASAN KAKU',
    hudStage3: '03: JARINGAN FEM',
    hudReady: 'KOORDINAT AKTIF',
    photoInspect: 'PERBESAR 1:1',
    photoVerified: '[DOKUMENTASI]',
    photoArchive: 'ARSIP DOKUMENTASI LAPANGAN',
    dossierSpecHeader: 'CURRICULUM VITAE & DOKUMEN TEKNIS',
    dossierDirectEmail: 'ALAMAT EMAIL',
    dossierDirectPhone: 'TELEPON / WHATSAPP',
    dossierBaseLocation: 'DOMISILI',
    dossierAvailability: 'SIAP UNTUK PROYEK NASIONAL & MULTINASIONAL',
    dossierCopy: 'SALIN',
    dossierCopied: 'TERSALIN',
    dossierDownloadTxt: 'Unduh Dokumen CV (.TXT)',
    dossierPrintPdf: 'CETAK / SIMPAN PDF',
    dossierSendEmail: 'KIRIM EMAIL',
    dossierSec1: '01 // RINGKASAN PROFIL',
    dossierSec2: '02 // PENGALAMAN KERJA',
    dossierSec3: '03 // PENDIDIKAN',
  },
};

export const HERO_DATA = {
  name: 'Greyvaldo Christian, S.T',
  title: {
    en: 'Civil Engineer — Quality Control Specialist for National Strategic Infrastructure (IKN)',
    id: 'Insinyur Teknik Sipil — Spesialis Quality Control Infrastruktur Strategis Nasional (IKN)',
  },
  location: 'MANADO, ID 95234',
  phone: '+6281241664556',
  email: 'greyvaldochristian@gmail.com',
  summary: {
    en: "Civil Engineer with 2+ years of experience in Quality Control for Large-Scale Infrastructure Projects, including Indonesia's National Strategic Project (IKN). Proven expertise in conducting field inspections, laboratory material testing, and quality documentation to ensure compliance with project specifications and construction standards. Experienced in coordinating with multidisciplinary teams, contractors, and consultants to support efficient and high-quality heavy industrial facilities, critical infrastructure, and utility integration.",
    id: 'Insinyur Teknik Sipil dengan pengalaman lebih dari 2 tahun di bidang Quality Control pada Proyek Infrastruktur Skala Besar, termasuk Proyek Strategis Nasional Ibu Kota Nusantara (IKN). Memiliki keahlian teruji dalam inspeksi lapangan, pengujian material laboratorium, serta dokumentasi mutu (ITP/WMS) untuk memastikan kepatuhan terhadap spesifikasi teknis dan standar konstruksi. Berpengalaman berkoordinasi lintas disiplin bersama pemilik proyek (PU), konsultan pengawas, dan kontraktor pada pembangunan fasilitas infrastruktur berat dan jalan kawasan.',
  },
  portrait: {
    src: '/assets/GreyvaldoDiIstanaGarudaIKN.jpeg',
    caption: {
      en: '[LOC: ISTANA GARUDA, IKN // ROLE: QA/QC OFFICER]',
      id: '[LOKASI: ISTANA GARUDA, IKN // JABATAN: QUALITY CONTROL OFFICER]',
    },
    code: 'REF // IKN-GARUDA-01',
    coordinates: '00°58\'23.4"S 116°42\'31.8"E',
    elevation: 'ELV +48.50m MSL',
  },
  telemetry: [
    {
      id: 'compliance',
      prefix: '>',
      numericValue: 95,
      suffix: '%',
      display: '>95%',
      label: {
        en: 'Project-Wide QA/QC Compliance Rate',
        id: 'Tingkat Kepatuhan Mutu QA/QC Proyek',
      },
      code: 'KPI-01 // QA-COMP',
    },
    {
      id: 'closure',
      prefix: '95–',
      numericValue: 100,
      suffix: '%',
      display: '95–100%',
      label: {
        en: 'Monthly NC/CAPA Closure Efficiency',
        id: 'Efisiensi Penyelesaian NC/CAPA Bulanan',
      },
      code: 'KPI-02 // CAPA-RATE',
    },
    {
      id: 'radius',
      prefix: '',
      numericValue: 7,
      suffix: '+ KM',
      display: '7+ KM',
      label: {
        en: 'Heavy Infrastructure Operational Radius (6 Zones)',
        id: 'Radius Operasional Infrastruktur Berat (6 Zona)',
      },
      code: 'KPI-03 // STA-SPAN',
    },
    {
      id: 'documents',
      prefix: '',
      numericValue: 100,
      suffix: '+',
      display: '100+',
      label: {
        en: 'Weekly Engineering Documents Validated (ITP/WMS)',
        id: 'Dokumen Teknis (ITP/WMS) Divalidasi per Minggu',
      },
      code: 'KPI-04 // DOC-AUDIT',
    },
  ],
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'pp-qc-officer',
    staCode: 'STA 0+000 — STA 7+000',
    elevation: 'ZONES 01–06 // KIPP IKN',
    company: 'PT. PP (Persero) Tbk',
    role: {
      en: 'Quality Control Officer',
      id: 'Quality Control Officer',
    },
    period: {
      en: 'SEP 2024 – JUL 2026',
      id: 'SEP 2024 – JUL 2026',
    },
    project:
      'Proyek Pembangunan Jalan di Dalam KIPP: Peningkatan Jalan Kawasan West Residence, Ibu Kota Nusantara (IKN)',
    location: {
      en: 'Ibu Kota Nusantara (IKN), East Kalimantan',
      id: 'Ibu Kota Nusantara (IKN), Kalimantan Timur',
    },
    metrics: [
      { label: { en: 'OPERATIONAL SPAN', id: 'CAKUPAN TRASE' }, value: '7+ KM (6 ZONES)' },
      { label: { en: 'QA/QC COMPLIANCE', id: 'KEPATUHAN MUTU' }, value: '>95% SUSTAINED' },
      { label: { en: 'NC/CAPA CLOSURE', id: 'PENUTUPAN NC/CAPA' }, value: '95–100% / MO' },
      { label: { en: 'ITP/WMS AUDITED', id: 'AUDIT ITP/WMS' }, value: '100+ DOCS / WK' },
    ],
    highlights: {
      en: [
        'Directed project-wide quality operations as the primary QC decision-maker, orchestrating comprehensive QA/QC frameworks and stringent execution phases across 6 simultaneous heavy-duty infrastructure zones spanning a 7+ km operational radius.',
        'Commanded rigorous inspection protocols for critical civil structures, specifically focusing on the absolute structural integrity of concrete works and steel reinforcement to meet uncompromising engineering standards essential for heavy facility foundations.',
        'Governed project-wide Key Performance Indicators (KPIs), enforcing uncompromising quality assurance parameters to successfully sustain a >95% compliance rate across all heavy infrastructure operations.',
        'Spearheaded comprehensive Root Cause Analyses (RCA) for Non-Conformance (NC) incidents, mandating strategic Corrective and Preventive Actions (CAPA) that achieved a consistent 95–100% monthly closure rate and eliminated systemic quality bottlenecks.',
        'Audited and validated an extensive portfolio of over 100 critical quality engineering documents weekly—including cross-disciplinary Inspection Test Plans (ITP) and Work Method Statements (WMS), ensuring absolute technical compliance prior to physical execution.',
        "Executed advanced quality risk mitigation strategies across multiple high-stakes work zones, effectively neutralizing potential structural defects and drastically reducing rework to safeguard the project's critical timeline.",
      ],
      id: [
        'Memimpin operasional pengendalian mutu proyek sebagai pengambil keputusan utama QC, menyusun kerangka kerja QA/QC serta tahapan eksekusi ketat pada 6 zona infrastruktur berat secara simultan sepanjang radius operasional 7+ km.',
        'Mengawasi protokol inspeksi ketat untuk struktur sipil kritis, khususnya integritas struktural pekerjaan beton (rigid pavement & struktur) dan pembesian agar memenuhi standar rekayasa tertinggi.',
        'Mengelola indikator kinerja utama (KPI) mutu proyek dan menjaga tingkat kepatuhan spesifikasi di atas >95% di seluruh operasi konstruksi.',
        'Memimpin analisis akar masalah (Root Cause Analysis / RCA) atas temuan ketidaksesuaian (NC), serta menerapkan tindakan korektif dan preventif (CAPA) dengan tingkat penyelesaian 95–100% setiap bulan.',
        'Mengaudit dan memvalidasi lebih dari 100 dokumen rekayasa mutu setiap minggu—termasuk Inspection Test Plan (ITP) dan Work Method Statement (WMS) lintas disiplin sebelum pelaksanaan fisik di lapangan.',
        'Melaksanakan strategi mitigasi risiko mutu di berbagai zona kerja prioritas, mencegah potensi cacat struktural dan menekan pekerjaan ulang (rework) demi mengamankan jadwal kritis proyek.',
      ],
    },
    photo: {
      src: '/assets/QualityTalkPenjelasanKepadaSeluruhStakeholderPUOwnerKonsultanTenagaKerja.jpeg',
      caption: {
        en: '[FIELD BRIEFING: MULTI-STAKEHOLDER QUALITY TALK & QHSE ALIGNMENT]',
        id: '[PENGARAHAN LAPANGAN: QUALITY TALK BERSAMA OWNER PU, KONSULTAN & TENAGA KERJA]',
      },
      code: 'REF // IKN-QTALK-02',
      aspect: 'square',
      telemetry: 'STAKEHOLDERS: PU OWNER // CONSULTANTS // WORKFORCE',
    },
  },
  {
    id: 'pp-staff-qc',
    staCode: 'STA 2+450 — FLYOVER',
    elevation: 'BOX GIRDER & ABUTMENT // IKN',
    company: 'PT. PP (Persero) Tbk',
    role: {
      en: 'Staff Quality Control',
      id: 'Staf Quality Control',
    },
    period: {
      en: 'OCT 2023 – AUG 2024',
      id: 'OKT 2023 – AGU 2024',
    },
    project:
      'Proyek Fly Over (Istana Negara, Kantor Presiden, Kantor Kementrian Sekretariat Negara), Ibu Kota Nusantara (IKN)',
    location: {
      en: 'Ibu Kota Nusantara (IKN), East Kalimantan',
      id: 'Ibu Kota Nusantara (IKN), Kalimantan Timur',
    },
    metrics: [
      { label: { en: 'QC DOSSIERS', id: 'DOKUMEN QC' }, value: '50+ REPORTS' },
      { label: { en: 'STAKEHOLDERS', id: 'PEMANGKU KEPENTINGAN' }, value: '10+ ENTITIES' },
      { label: { en: 'NC CASES RESOLVED', id: 'PENYELESAIAN NC' }, value: '10+ STRUCTURAL' },
    ],
    highlights: {
      en: [
        'Prepared and maintained 50+ Quality Control documents, including inspection reports, test reports, and QC checklists for bridge construction works.',
        'Coordinated with 10+ stakeholders (owner representatives, consultants, and contractors) to resolve quality issues and maintain project quality standards.',
        'Coordinated the QA/QC team in managing 10+ quality findings and NC cases, contributing to improved NC closing efficiency across the project.',
      ],
      id: [
        'Menyusun dan mengelola 50+ dokumen Quality Control, meliputi laporan inspeksi, laporan pengujian material, serta daftar periksa (checklist) QC untuk pekerjaan konstruksi jembatan dan flyover.',
        'Berkoordinasi dengan 10+ pemangku kepentingan (perwakilan pemilik proyek/PU, konsultan pengawas, dan kontraktor) untuk menyelesaikan permasalahan teknis dan menjaga standar mutu proyek.',
        'Mengkoordinasikan tim QA/QC dalam menangani 10+ temuan mutu dan kasus Non-Conformance (NC), sehingga meningkatkan efisiensi penutupan NC di seluruh proyek.',
      ],
    },
  },
  {
    id: 'bpjn-sulut',
    staCode: 'STA 0+000 — STA 1+000',
    elevation: 'NATIONAL ROAD CORRIDOR // SULUT',
    company: 'Balai Pelaksanaan Jalan Nasional (BPJN) Sulawesi Utara',
    role: {
      en: 'Asst. Field Coordinator',
      id: 'Asisten Koordinator Lapangan',
    },
    period: {
      en: 'JUL 2022 – DEC 2022',
      id: 'JUL 2022 – DES 2022',
    },
    project: 'Peningkatan Jalan Kuwil – Malendeng',
    location: {
      en: 'North Sulawesi, Indonesia',
      id: 'Sulawesi Utara, Indonesia',
    },
    metrics: [
      { label: { en: 'CORRIDOR LENGTH', id: 'PANJANG SEGMEN' }, value: '±1.00 KM' },
      { label: { en: 'REPORTS & JMF', id: 'LAPORAN & JMF' }, value: '30+ DELIVERABLES' },
    ],
    highlights: {
      en: [
        'Executed field coordination for road improvement works covering ±1 km road section between Kuwil and Malendeng.',
        'Prepared 30+ project reports, including daily, weekly, and monthly progress reports and Job Mix Formula (JMF) summaries.',
      ],
      id: [
        'Melaksanakan koordinasi lapangan untuk pekerjaan peningkatan jalan sepanjang segmen ±1 km pada ruas Kuwil – Malendeng.',
        'Menyusun 30+ laporan proyek, mencakup laporan progres harian, mingguan, bulanan, serta rekapitulasi Job Mix Formula (JMF).',
      ],
    },
  },
];

export const EDUCATION_DATA = {
  institution: 'Catholic University of De La Salle Manado',
  degree: {
    en: 'Bachelor of Civil Engineering (S.T)',
    id: 'Sarjana Teknik Sipil (S.T)',
  },
  period: 'AUG 2019 – AUG 2023',
  gpa: '3.64 / 4.00',
  gpaNumeric: 3.64,
  honor: {
    en: 'Cum Laude Honor',
    id: 'Predikat Cum Laude',
  },
  distinction: {
    en: 'Awarded Top / Highest Graduate of the Civil Engineering Study Program among 40+ students in the graduating class.',
    id: 'Meraih penghargaan Lulusan Terbaik / IPK Tertinggi Program Studi Teknik Sipil dari 40+ mahasiswa pada angkatan kelulusan.',
  },
  creditHours: 144,
  coursework: {
    en: [
      'Structural Analysis',
      'Geotechnical Engineering',
      'Transportation Engineering',
      'Environmental Engineering',
      'Construction Management',
    ],
    id: [
      'Analisis Struktur',
      'Rekayasa Geoteknik',
      'Rekayasa Transportasi',
      'Rekayasa Lingkungan',
      'Manajemen Konstruksi',
    ],
  },
  capstone: {
    en: 'Urban Planning Capstone: Collaborated with a team of 4–5 students to develop a sustainable urban planning proposal focusing on transportation systems, green spaces, and community development.',
    id: 'Proyek Perencanaan Kota: Berkolaborasi dalam tim beranggotakan 4–5 mahasiswa untuk menyusun proposal tata kota berkelanjutan yang berfokus pada sistem transportasi, ruang terbuka hijau, dan pengembangan kawasan.',
  },
  photo: {
    src: '/assets/BestGraduateCivilEngineeringDellaSalle.jpeg',
    caption: {
      en: '[HONOUR: TOP GRADUATE OF CIVIL ENGINEERING // CUM LAUDE 3.64/4.00]',
      id: '[PENGHARGAAN: LULUSAN TERBAIK TEKNIK SIPIL // CUM LAUDE 3.64/4.00]',
    },
    code: 'REF // DLSU-GRAD-03',
    telemetry: 'RANK: #1 OF 40+ COHORT // 144 CREDITS',
  },
};

export const LEADERSHIP_DATA: LeadershipItem[] = [
  {
    role: {
      en: 'Head of Public Relation',
      id: 'Kepala Divisi Hubungan Masyarakat (Humas)',
    },
    organization: {
      en: 'Civil Engineering Student Association',
      id: 'Himpunan Mahasiswa Program Studi Teknik Sipil',
    },
    period: 'MAY 2022 – MAY 2023',
    staCode: 'ORG-01 // PR-LEAD',
    description: {
      en: 'Led PR for 50+ active members; organized and promoted 5+ academic and student development events.',
      id: 'Memimpin kehumasan untuk 50+ anggota aktif; menyelenggarakan dan mempublikasikan 5+ kegiatan akademik dan pengembangan mahasiswa.',
    },
  },
  {
    role: {
      en: 'Teaching Assistant / Asst. Lecturer',
      id: 'Asisten Dosen',
    },
    organization: {
      en: 'Faculty of Engineering — De La Salle University',
      id: 'Fakultas Teknik — Universitas Katolik De La Salle',
    },
    period: 'FEB 2022 – MAY 2022',
    staCode: 'ORG-02 // ACAD-ASST',
    description: {
      en: 'Conducted 3 tutorial sessions, graded 20+ assignments/examinations, and resolved 30+ student academic consultations.',
      id: 'Memandu 3 sesi tutorial akademik, memeriksa 20+ tugas dan ujian, serta memfasilitasi 30+ sesi asistensi akademik mahasiswa.',
    },
  },
  {
    role: {
      en: 'Volunteer Educational Mentor',
      id: 'Relawan Pengajar Pendidikan',
    },
    organization: {
      en: 'Komunitas Dinding Manado',
      id: 'Komunitas Dinding Manado',
    },
    period: 'OCT 2019',
    staCode: 'ORG-03 // MENTOR',
    description: {
      en: 'Mentored ±70 children from underprivileged backgrounds at Pasar Bersehati Manado.',
      id: 'Membimbing ±70 anak dari keluarga prasejahtera di kawasan Pasar Bersehati Manado.',
    },
  },
];

export const SKILLS_DATA: SkillGroup[] = [
  {
    code: 'MOD-01 // QA-QC',
    category: {
      en: 'Quality Control & Construction',
      id: 'Pengendalian Mutu & Konstruksi',
    },
    items: [
      {
        name: {
          en: 'Quality Assurance & Quality Control',
          id: 'Quality Assurance & Quality Control (QA/QC)',
        },
        spec: { en: 'SNI / ASTM / Bina Marga', id: 'SNI / ASTM / Spesifikasi Bina Marga' },
      },
      {
        name: {
          en: 'Inspection Test Plan (ITP)',
          id: 'Inspection Test Plan (ITP)',
        },
        spec: {
          en: 'Hold & Witness Point Verification',
          id: 'Verifikasi Hold & Witness Point',
        },
      },
      {
        name: {
          en: 'Work Method Statement (WMS)',
          id: 'Work Method Statement (WMS)',
        },
        spec: {
          en: 'Pre-Execution Technical Audit',
          id: 'Audit Teknis Pra-Pelaksanaan',
        },
      },
      {
        name: {
          en: 'Material Testing (Aggregate, Asphalt, Concrete)',
          id: 'Pengujian Material (Agregat, Aspal, Beton)',
        },
        spec: {
          en: 'Slump, Compressive, JMF, Core Drill',
          id: 'Uji Slump, Kuat Tekan, JMF, Core Drill',
        },
      },
    ],
  },
  {
    code: 'MOD-02 // ENG-CORE',
    category: {
      en: 'Engineering Knowledge',
      id: 'Keahlian Rekayasa Sipil',
    },
    items: [
      {
        name: {
          en: 'Utility & Critical Infrastructure',
          id: 'Infrastruktur Kritis & Utilitas Terpadu',
        },
        spec: {
          en: 'Multi-Zone Box Culvert & Rigid Pavement',
          id: 'Box Culvert & Perkerasan Kaku Multi-Zona',
        },
      },
      {
        name: {
          en: 'Root Cause Analysis (RCA)',
          id: 'Analisis Akar Masalah (RCA)',
        },
        spec: {
          en: 'NC Mitigation & CAPA Closure',
          id: 'Mitigasi Temuan NC & Penyelesaian CAPA',
        },
      },
      {
        name: {
          en: 'Project Management',
          id: 'Manajemen Proyek Konstruksi',
        },
        spec: {
          en: 'Cost, Schedule & Quality Control',
          id: 'Pengendalian Biaya, Jadwal & Mutu',
        },
      },
      {
        name: {
          en: 'Data Analysis & Reporting',
          id: 'Analisis Data & Pelaporan Teknis',
        },
        spec: {
          en: 'KPI Tracking & Technical Dossiers',
          id: 'Evaluasi KPI & Laporan Eksekutif',
        },
      },
    ],
  },
  {
    code: 'MOD-03 // CAD-BIM',
    category: {
      en: 'Engineering Software',
      id: 'Perangkat Lunak Rekayasa',
    },
    items: [
      {
        name: { en: 'AutoCAD', id: 'AutoCAD' },
        spec: {
          en: '2D/3D Shop Drawings & As-Built Drafting',
          id: 'Shop Drawing & As-Built Drawing 2D/3D',
        },
      },
      {
        name: { en: 'SAP2000', id: 'SAP2000' },
        spec: {
          en: 'Finite Element Structural & Truss Analysis',
          id: 'Analisis Elemen Hingga Struktur & Rangka',
        },
      },
      {
        name: { en: 'SketchUp', id: 'SketchUp' },
        spec: {
          en: '3D Structural Modeling & Massing',
          id: 'Pemodelan Konstruksi 3D',
        },
      },
      {
        name: { en: 'Microsoft Office', id: 'Microsoft Office' },
        spec: {
          en: 'Engineering Spreadsheets & Documentation',
          id: 'Spreadsheet Rekayasa & Dokumentasi QC',
        },
      },
    ],
  },
  {
    code: 'MOD-04 // COORD',
    category: {
      en: 'Project & Coordination',
      id: 'Koordinasi & Dokumentasi Proyek',
    },
    items: [
      {
        name: { en: 'Project Documentation', id: 'Dokumentasi Mutu Proyek' },
        spec: {
          en: '100+ Weekly ITP/WMS/Checklists',
          id: '100+ Dokumen ITP/WMS/Checklist Mingguan',
        },
      },
      {
        name: { en: 'Progress Monitoring', id: 'Pemantauan Progres Konstruksi' },
        spec: {
          en: 'Longitudinal STA Tracking',
          id: 'Evaluasi Progres STA Memanjang',
        },
      },
      {
        name: { en: 'Quality Audit Support', id: 'Dukungan Audit Mutu & QHSE' },
        spec: {
          en: 'Internal & External ISO/QHSE Audits',
          id: 'Audit Internal & Eksternal ISO/QHSE',
        },
      },
      {
        name: {
          en: 'Cross-Functional Team Collaboration',
          id: 'Kolaborasi Tim Lintas Disiplin',
        },
        spec: {
          en: 'PU Owner, Consultants & Contractors',
          id: 'Koordinasi Owner PU, Konsultan & Kontraktor',
        },
      },
    ],
  },
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: 'qhse-ebook',
    code: 'AWD-01 // QHSE-2025',
    title: {
      en: '1st Place Winner – E-Book Category',
      id: 'Juara 1 – Kategori Buku Elektronik (E-Book)',
    },
    event: 'QHSE Awards 2025',
    detail: {
      en: 'Authored "Beyond Smooth Road: Quality Control in Rigid Pavement Construction".',
      id: 'Penulis buku teknis "Beyond Smooth Road: Quality Control in Rigid Pavement Construction".',
    },
    metric: '1ST PLACE',
  },
  {
    id: 'qhse-video',
    code: 'AWD-02 // QHSE-2025',
    title: {
      en: '3rd Place Winner – Quality Induction Video Category',
      id: 'Juara 3 – Kategori Video Induksi Mutu (Quality Induction)',
    },
    event: 'QHSE Awards 2025',
    detail: {
      en: 'Digital QHSE onboarding induction workflow video for field engineering personnel.',
      id: 'Perancangan video alur induksi standar mutu dan keselamatan kerja (QHSE) bagi personel proyek.',
    },
    metric: '3RD PLACE',
  },
  {
    id: 'lang-ielts',
    code: 'CRT-03 // CEFR-C1',
    title: {
      en: 'Language Credentials — Bilingual Technical Fluency',
      id: 'Sertifikasi Bahasa Inggris — Kemahiran Teknis Dwi-Bahasa',
    },
    event: 'IELTS Academic & TOEFL ITP',
    detail: {
      en: 'IELTS Band 7.0 (CEFR C1 Advanced Level) | TOEFL ITP Score 610.',
      id: 'Skor IELTS Band 7.0 (Tingkat Mahir CEFR C1) | Skor TOEFL ITP 610.',
    },
    metric: 'IELTS 7.0 / TOEFL 610',
  },
];
