import { Project, SiteContentMap, Skill, SocialLink } from '@/types';

export const INITIAL_SITE_CONTENT: SiteContentMap = {
  hero: {
    title_line_1: "Engineering Ideas.",
    title_line_2: "Building Experiences.",
    subheading: "An engineering student exploring software, hardware, and the things we can learn by building.",
    cta_work: "Explore My Work",
    cta_contact: "Get in Touch",
    status_badge: "CEV Electrical & Electronics Engineering • Founder @ FOLE",
  },
  portrait: {
    heading: "Hey, I’m Adithya.",
    caption: "An engineering student, developer, and lifelong learner.",
    image_url: "",
    note: "B.Tech in Electrical and Electronics Engineering at College of Engineering Vadakara (CEV). Focused on where software systems meet tangible hardware.",
  },
  about: {
    headline: "Curious, practical, collaborative, and interested in learning by building.",
    paragraphs: [
      "I study Electrical and Electronics Engineering at College of Engineering Vadakara (CEV). My path in engineering is shaped by curiosity about how things genuinely work beneath the surface—from logic gates and microcontroller buses to distributed backend services.",
      "I write software with a focus on Python and clean backend architecture. On the physical bench, I work with the ESP32 ecosystem, analog sensors, servo motors, and embedded automation.",
      "Above all, I believe learning becomes far more meaningful when people build and learn together. That philosophy is what led me to found FOLE—an open peer-to-peer engineering and knowledge-sharing collective."
    ],
    philosophy: "Learning becomes more meaningful when people learn together.",
  },
  fole: {
    title: "FOLE — Free Open Learning & Education",
    tagline: "A student-led peer-to-peer learning community at College of Engineering Vadakara (CEV).",
    narrative_stages: [
      {
        "step": "01",
        "title": "The Core Philosophy",
        "desc": "Technical knowledge should not be confined behind credentials or gatekeeping. FOLE was started at CEV as an open space where any student can explore engineering by doing, without fear of judgment."
      },
      {
        "step": "02",
        "title": "Peer-to-Peer Learning",
        "desc": "We believe students learn best from other students who just solved the same hurdles. When you discover how an I2C sensor communicates or how an asynchronous Python server functions, your next step is to teach it to someone else."
      },
      {
        "step": "03",
        "title": "Practical Prototyping",
        "desc": "No dry theory without physical verification. We hook up breadboards, debug firmware over serial monitors, build software utilities, and explore robotics through collaborative builds."
      },
      {
        "step": "04",
        "title": "Open Culture & Sharing",
        "desc": "Completely free, open-source, and student-driven. Every repository, workshop note, and design schematic is shared openly so future students can build upon what we started."
      }
    ]
  },
  hardware: {
    headline: "Beyond the Screen.",
    subheading: "Exploring the intersection of electronics, embedded systems, and software.",
    panels: [
      {
        id: "hw-1",
        title: "ESP32 & Microcontrollers",
        category: "ESP32",
        short_description: "Dual-core computing, FreeRTOS multitasking, and hardware-software telemetry.",
        detailed_description: "Exploring 32-bit silicon architectures, FreeRTOS task scheduling, hardware timer interrupts, low-power sleep cycles, and Wi-Fi/Bluetooth communication.",
        technologies: ["ESP32", "FreeRTOS", "UART / SPI", "PlatformIO", "C++"],
        image: "/hardware/esp32.svg",
        display_order: 1,
        published: true
      },
      {
        id: "hw-2",
        title: "Servo Actuation & Kinematics",
        category: "Servo Motors",
        short_description: "Precision PWM signal generation, angular position control, and mechanical linkages.",
        detailed_description: "Experimenting with duty-cycle timing, torque response, H-bridge motor drivers, and kinematic motion for physical automation.",
        technologies: ["PWM Timers", "Servo Control", "H-Bridge Drivers", "Kinematics"],
        image: "/hardware/servo.svg",
        display_order: 2,
        published: true
      },
      {
        id: "hw-3",
        title: "Sensors & Bus Interfacing",
        category: "Sensors & Modules",
        short_description: "Interfacing physical transducers, ultrasonic distance sensors, and environmental modules.",
        detailed_description: "Sampling analog inputs via ADC, calibrating signal noise, and querying digital sensor registers across standard I2C/SPI buses.",
        technologies: ["I2C Bus", "ADC Calibration", "Ultrasonic", "IMU Registers"],
        image: "/hardware/sensors.svg",
        display_order: 3,
        published: true
      },
      {
        id: "hw-4",
        title: "Embedded Systems Architecture",
        category: "Embedded Systems",
        short_description: "Connecting low-level microcontroller firmware with higher-level software systems.",
        detailed_description: "Designing lightweight telemetry daemons, reliable serial protocols, and state machines to bridge physical electronics with application layers.",
        technologies: ["State Machines", "Serial Protocols", "Embedded C", "Telemetry Daemons"],
        image: "/hardware/embedded.svg",
        display_order: 4,
        published: true
      },
      {
        id: "hw-5",
        title: "Circuits & Practical Electronics",
        category: "Electronics",
        short_description: "Exploring circuit prototyping, voltage regulation, signal conditioning, and workbench experimentation.",
        detailed_description: "Hands-on bench experimentation with breadboards, schematic diagrams, multimeter diagnostics, and soldering techniques.",
        technologies: ["Circuit Design", "Voltage Regulators", "Breadboard Prototyping", "Soldering"],
        image: "/hardware/electronics.svg",
        display_order: 5,
        published: true
      }
    ],
    focus_areas: [
      {
        "name": "ESP32 & Real-Time Computing",
        "detail": "Multitasking firmware with FreeRTOS, hardware interrupts, Wi-Fi telemetry, and power management."
      },
      {
        "name": "Actuation & Motor Control",
        "detail": "Precision PWM signal generation, servo calibration, H-bridge motor drivers, and kinematic motion."
      },
      {
        "name": "Sensors & Bus Protocols",
        "detail": "Interfacing IMUs, ultrasonic rangefinders, and analog sensors via I2C, SPI, and UART protocols."
      },
      {
        "name": "Hardware-Software Bridges",
        "detail": "Creating bi-directional telemetry pipelines between microcontrollers and Python web backends."
      }
    ]
  },
  teaching: {
    headline: "Learning is better when shared.",
    description: "Teaching, collaborating, experimenting, and learning together.",
    cards: [
      {
        id: "teach-1",
        title: "Learning Together",
        tag: "01 // Peer Collaboration",
        short_description: "Collaborative learning, group discussions, and knowledge exchange.",
        detailed_description: "True learning happens when curious minds connect, break down complex concepts, and build shared understanding through open dialogue and mutual curiosity.",
        image: "/teaching/learning-together.svg",
        display_order: 1,
        published: true
      },
      {
        id: "teach-2",
        title: "Teaching Through Building",
        tag: "02 // Hands-on Workshops",
        short_description: "Hands-on electronics workshops, dev boards, and live circuit demos.",
        detailed_description: "Abstract schematics become intuitive the moment a student connects their first microcontroller, solders a sensor bus, or debugs an SPI waveform on a real oscilloscope.",
        image: "/teaching/teaching-building.svg",
        display_order: 2,
        published: true
      },
      {
        id: "teach-3",
        title: "Sharing Technical Knowledge",
        tag: "03 // Open Documentation",
        short_description: "Documenting systems, open architectures, and technical insights.",
        detailed_description: "Demystifying embedded systems, firmware architecture, and modern full-stack workflows through accessible documentation, open-source repositories, and mentorship.",
        image: "/teaching/sharing-knowledge.svg",
        display_order: 3,
        published: true
      },
      {
        id: "teach-4",
        title: "FOLE — Free Open Learning & Education",
        tag: "04 // Student Community",
        short_description: "Student-led peer-to-peer learning community at College of Engineering Vadakara (CEV).",
        detailed_description: "Founded FOLE to champion horizontal peer-to-peer technical learning, empowering students across batches to build, explore, and master engineering without gatekeeping.",
        image: "/teaching/fole-community.svg",
        display_order: 4,
        published: true
      }
    ],
    pillars: [
      {
        "title": "Horizontal Knowledge Exchange",
        "detail": "Dismantling hierarchical education in favor of open peer circles where everyone is simultaneously a learner and a contributor."
      },
      {
        "title": "Hands-On Problem Solving",
        "detail": "Encouraging experimentation, hands-on debugging, and building real tools rather than memorizing abstract exam questions."
      },
      {
        "title": "Open Documentation",
        "detail": "Documenting learning journeys publicly, publishing hardware notes, and building a collective technical archive."
      }
    ]
  },
  contact: {
    headline: "Let’s start a conversation.",
    subheading: "Whether you’re interested in embedded systems, peer education, collaborative open-source, or talking about FOLE.",
    email: "adithya@example.com",
    note: "All contact details and social links can be updated directly from the admin panel."
  },
  footer: {
    tagline: "An independent engineering journal & archive.",
    credit: "Adithya S. Kanholi — CEV",
    colophon: "Built with React, TypeScript, Tailwind CSS, GSAP & Supabase."
  }
};

export const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: 'Python', category: 'Programming', display_order: 1 },
  { id: '2', name: 'C / C++', category: 'Programming', display_order: 2 },
  { id: '3', name: 'TypeScript / JavaScript', category: 'Programming', display_order: 3 },
  { id: '4', name: 'FastAPI / Flask', category: 'Backend Development', display_order: 4 },
  { id: '5', name: 'REST APIs & WebSockets', category: 'Backend Development', display_order: 5 },
  { id: '6', name: 'PostgreSQL / SQLite', category: 'Backend Development', display_order: 6 },
  { id: '7', name: 'ESP32 & ESP8266', category: 'Hardware and Embedded Systems', display_order: 7 },
  { id: '8', name: 'Arduino Platform', category: 'Hardware and Embedded Systems', display_order: 8 },
  { id: '9', name: 'Sensors (I2C, SPI, UART, ADC)', category: 'Hardware and Embedded Systems', display_order: 9 },
  { id: '10', name: 'PWM & Servo Actuation', category: 'Hardware and Embedded Systems', display_order: 10 },
  { id: '11', name: 'Circuit Prototyping & Soldering', category: 'Hardware and Embedded Systems', display_order: 11 },
  { id: '12', name: 'Linux & Shell Scripting', category: 'Tools and Platforms', display_order: 12 },
  { id: '13', name: 'Git & GitHub', category: 'Tools and Platforms', display_order: 13 },
  { id: '14', name: 'PlatformIO & VS Code', category: 'Tools and Platforms', display_order: 14 },
  { id: '15', name: 'Peer-to-Peer Mentoring', category: 'Teaching and Learning', display_order: 15 },
  { id: '16', name: 'Workshop Facilitation', category: 'Teaching and Learning', display_order: 16 },
  { id: '17', name: 'Technical Documentation', category: 'Teaching and Learning', display_order: 17 },
];

export const INITIAL_SOCIALS: SocialLink[] = [
  { id: '1', platform: 'GitHub', url: 'https://github.com', display_order: 1, enabled: true },
  { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', display_order: 2, enabled: true },
  { id: '3', platform: 'Instagram', url: 'https://instagram.com', display_order: 3, enabled: true },
  { id: '4', platform: 'Email', url: 'mailto:adithya@example.com', display_order: 4, enabled: true },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'ESP32 Telemetry Node & Environmental Monitor',
    slug: 'esp32-telemetry-node',
    short_description: 'Low-power sensor telemetry node logging real-time environmental metrics over Wi-Fi and MQTT to a local backend.',
    full_description: 'An embedded hardware project developed to explore reliable sensor telemetry with the ESP32. Utilizes FreeRTOS tasks to separate sensor acquisition (temperature, humidity, ambient light via I2C) from network transmission. Data is packaged and pushed via lightweight MQTT to a local Python daemon which stores time-series metrics. Features deep-sleep cycles to optimize battery consumption and brownout protection circuitry.',
    cover_image_path: null,
    gallery: [],
    category: 'Hardware & Embedded',
    technologies: ['ESP32', 'C++', 'FreeRTOS', 'MQTT', 'Python', 'I2C'],
    github_url: 'https://github.com',
    demo_url: null,
    external_url: null,
    project_date: '2026-08-15',
    featured: true,
    display_order: 1,
    published: true,
    created_at: new Date('2026-08-15').toISOString(),
    updated_at: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'p2',
    title: 'FOLE Community Platform & Learning Hub',
    slug: 'fole-learning-hub',
    short_description: 'An open-source peer knowledge archive and session coordinator built for the FOLE student learning collective.',
    full_description: 'The digital home for FOLE (Free Open Learning & Education) at CEV. Developed to organize student-led technical workshops, archive experiment notes, code snippets, and coordinate collaborative hardware builds. Designed with minimal dependencies and structured Markdown notes to ensure rapid load times even on slow campus networks.',
    cover_image_path: null,
    gallery: [],
    category: 'Software & Systems',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    github_url: 'https://github.com',
    demo_url: null,
    external_url: null,
    project_date: '2026-06-20',
    featured: true,
    display_order: 2,
    published: true,
    created_at: new Date('2026-06-20').toISOString(),
    updated_at: new Date('2026-06-20').toISOString(),
  },
  {
    id: 'p3',
    title: 'Autonomous 2-Axis Sensor Pan-Tilt Tracker',
    slug: 'sensor-pan-tilt-tracker',
    short_description: 'Closed-loop servo tracking mechanism using analog sensor arrays and micro-stepping calibration.',
    full_description: 'A physical engineering prototype pairing two PWM-driven servo motors with an optical/ultrasonic sensor payload. Employs a discrete proportional control loop running directly on microcontroller firmware to minimize overshoot and jitter while orienting toward targeted stimuli in real time.',
    cover_image_path: null,
    gallery: [],
    category: 'Hardware & Embedded',
    technologies: ['ESP32', 'PWM Control', 'Servo Kinematics', 'Electronics', 'C++'],
    github_url: 'https://github.com',
    demo_url: null,
    external_url: null,
    project_date: '2026-04-10',
    featured: true,
    display_order: 3,
    published: true,
    created_at: new Date('2026-04-10').toISOString(),
    updated_at: new Date('2026-04-10').toISOString(),
  },
  {
    id: 'p4',
    title: 'Local Hardware-in-the-Loop Test Utility',
    slug: 'hardware-in-the-loop-test-utility',
    short_description: 'Python CLI tool to automate serial testing, packet verification, and firmware validation for embedded boards.',
    full_description: 'Created to streamline firmware debugging during embedded development sessions. This command-line utility listens on active UART COM ports, feeds structured byte sequences to attached microcontrollers, monitors response timing, and logs communication anomalies with high-resolution timestamps.',
    cover_image_path: null,
    gallery: [],
    category: 'Software & Systems',
    technologies: ['Python', 'PySerial', 'CLI', 'Embedded Testing'],
    github_url: 'https://github.com',
    demo_url: null,
    external_url: null,
    project_date: '2026-02-05',
    featured: false,
    display_order: 4,
    published: true,
    created_at: new Date('2026-02-05').toISOString(),
    updated_at: new Date('2026-02-05').toISOString(),
  }
];

