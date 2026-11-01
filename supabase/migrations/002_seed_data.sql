-- Migration: 002_seed_data.sql
-- Description: Seed initial genuine content for Adithya S. Kanholi's portfolio

-- Initial Site Content
insert into public.site_content (section_key, content) values
(
  'hero',
  '{
    "title_line_1": "Engineering Ideas.",
    "title_line_2": "Building Experiences.",
    "subheading": "An engineering student exploring software, hardware, and the things we can learn by building.",
    "cta_work": "Explore My Work",
    "cta_contact": "Get in Touch",
    "status_badge": "Available for Collaborations & Open Source"
  }'::jsonb
),
(
  'portrait',
  '{
    "heading": "Hey, I’m Adithya.",
    "caption": "An engineering student, developer, and lifelong learner.",
    "image_url": "",
    "note": "Electrical and Electronics Engineering student at College of Engineering Vadakara (CEV). Focused on the intersection of physical hardware and software systems."
  }'::jsonb
),
(
  'about',
  '{
    "headline": "Curious, practical, collaborative, and interested in learning by building.",
    "paragraphs": [
      "I study Electrical and Electronics Engineering at College of Engineering Vadakara (CEV). My engineering journey is driven by an urge to understand how things work under the hood—from raw silicon and microcontrollers to scalable backend architectures.",
      "I enjoy programming and exploring software systems, with a particular love for Python and backend development. On the physical side, I work with ESP32 microcontrollers, sensors, servos, and embedded robotics.",
      "Beyond building alone, I care deeply about teaching and sharing knowledge. I believe that technical concepts only truly click when you explain them, test them with others, and solve problems together in an open environment."
    ],
    "philosophy": "Learning becomes more meaningful when people build and learn together."
  }'::jsonb
),
(
  'fole',
  '{
    "title": "FOLE — Free Open Learning & Education",
    "tagline": "Student-led peer-to-peer learning community at CEV",
    "narrative_stages": [
      {
        "step": "01",
        "title": "The Origin",
        "desc": "Traditional engineering education often isolates theoretical learning from open experimentation. FOLE was conceived at CEV as an answer to this gap—a welcoming sanctuary where students teach students without barriers or hierarchy."
      },
      {
        "step": "02",
        "title": "Peer-to-Peer Learning",
        "desc": "Knowledge compounds when shared horizontally. At FOLE, someone who discovered how to program an ESP32 or write clean backend logic yesterday helps a peer take their first step today."
      },
      {
        "step": "03",
        "title": "Hands-on Practicality",
        "desc": "We build real circuits, debug stubborn firmware, craft software tools, and unpack technical concepts together. The focus is always on tangible, practical understanding over passive memorization."
      },
      {
        "step": "04",
        "title": "Open Culture",
        "desc": "Completely free and open. Every workshop, code repository, and study session is designed to make engineering approachable, encouraging curiosity and collective problem solving."
      }
    ]
  }'::jsonb
),
(
  'hardware',
  '{
    "headline": "Hardware & Embedded Systems",
    "subheading": "Bridging microcontrollers, real-time sensing, and software control.",
    "focus_areas": [
      {
        "name": "ESP32 Ecosystem",
        "detail": "Dual-core computing, FreeRTOS tasks, Wi-Fi & BLE telemetry, and low-power sensory nodes."
      },
      {
        "name": "Actuators & Servos",
        "detail": "PWM signal generation, servo angle calibration, motor drivers, and kinematic motion control."
      },
      {
        "name": "Sensors & Interfaces",
        "detail": "I2C, SPI, and UART bus communications with ultrasonic sensors, IMUs, environmental sensors, and ADCs."
      },
      {
        "name": "Hardware-Software Bridges",
        "detail": "Connecting embedded devices to Python backends, WebSockets, and real-time telemetry dashboards."
      }
    ]
  }'::jsonb
),
(
  'teaching',
  '{
    "headline": "Teaching, Community & Peer Knowledge",
    "description": "True technical mastery is found in making complex engineering concepts accessible to anyone with curiosity.",
    "pillars": [
      {
        "title": "Peer-to-Peer Mentorship",
        "detail": "Fostering learning environments where questions are encouraged, mistakes are debugged together, and everyone contributes."
      },
      {
        "title": "Teaching Through Building",
        "detail": "Moving past slides into active prototyping—breadboards, terminals, logic analyzers, and working code."
      },
      {
        "title": "Democratizing Tools",
        "detail": "Advocating open-source hardware, permissive software tools, and freely accessible learning notes."
      }
    ]
  }'::jsonb
),
(
  'contact',
  '{
    "headline": "Let’s start a conversation.",
    "subheading": "Whether you want to discuss embedded systems, collaborate on an open-source project, talk about FOLE, or share ideas.",
    "email": "adithya@example.com",
    "note": "Email and social links are editable in the admin dashboard."
  }'::jsonb
),
(
  'footer',
  '{
    "tagline": "An engineering notebook in public. Built with care.",
    "credit": "Designed & Built by Adithya S. Kanholi",
    "colophon": "Crafted with React, TypeScript, GSAP, Tailwind CSS & Supabase."
  }'::jsonb
)
on conflict (section_key) do update set content = excluded.content;

-- Initial Skills
insert into public.skills (name, category, display_order) values
-- Programming
('Python', 'Programming', 1),
('C / C++', 'Programming', 2),
('TypeScript / JavaScript', 'Programming', 3),
-- Backend Development
('FastAPI / Flask', 'Backend Development', 4),
('RESTful APIs & WebSockets', 'Backend Development', 5),
('PostgreSQL / SQLite', 'Backend Development', 6),
-- Hardware and Embedded Systems
('ESP32 / ESP8266', 'Hardware and Embedded Systems', 7),
('Arduino Platform', 'Hardware and Embedded Systems', 8),
('Sensors & Actuators (PWM, I2C, SPI)', 'Hardware and Embedded Systems', 9),
('Circuit Prototyping & Soldering', 'Hardware and Embedded Systems', 10),
-- Tools and Platforms
('Git & GitHub', 'Tools and Platforms', 11),
('Linux / Bash', 'Tools and Platforms', 12),
('VS Code / PlatformIO', 'Tools and Platforms', 13),
-- Teaching and Learning
('Workshop Facilitation', 'Teaching and Learning', 14),
('Peer Mentorship', 'Teaching and Learning', 15),
('Technical Documentation', 'Teaching and Learning', 16)
on conflict do nothing;

-- Initial Social Links (with editable place-holders)
insert into public.social_links (platform, url, display_order, enabled) values
('GitHub', 'https://github.com', 1, true),
('LinkedIn', 'https://linkedin.com', 2, true),
('Instagram', 'https://instagram.com', 3, true),
('Email', 'mailto:adithya@example.com', 4, true)
on conflict do nothing;

-- Initial Sample Projects (authentic, realistic engineering projects)
insert into public.projects (
  title, slug, short_description, full_description, category,
  technologies, github_url, demo_url, external_url, project_date,
  featured, display_order, published
) values
(
  'ESP32 Telemetry Node & Environmental Monitor',
  'esp32-telemetry-node',
  'Low-power sensor telemetry node logging real-time environmental metrics over Wi-Fi and MQTT to a local backend.',
  'An embedded hardware project developed to explore reliable sensor telemetry with the ESP32. Utilizes FreeRTOS tasks to separate sensor acquisition (temperature, humidity, ambient light via I2C) from network transmission. Data is packaged and pushed via lightweight MQTT to a local Python daemon which stores time-series metrics. Features deep-sleep cycles to optimize battery consumption and brownout protection circuitry.',
  'Hardware & Embedded Systems',
  array['ESP32', 'C++', 'FreeRTOS', 'MQTT', 'Python', 'I2C'],
  'https://github.com',
  null,
  null,
  '2026-08-15',
  true,
  1,
  true
),
(
  'FOLE Community Platform & Learning Hub',
  'fole-learning-hub',
  'An open-source peer knowledge archive and session coordinator built for the FOLE student learning collective.',
  'The digital home for FOLE (Free Open Learning & Education) at CEV. Developed to organize student-led technical workshops, archive experiment notes, code snippets, and coordinate collaborative hardware builds. Designed with minimal dependencies and structured Markdown notes to ensure rapid load times even on slow campus networks.',
  'Software & Systems',
  array['Python', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
  'https://github.com',
  null,
  null,
  '2026-06-20',
  true,
  2,
  true
),
(
  'Autonomous 2-Axis Sensor Pan-Tilt Tracker',
  'sensor-pan-tilt-tracker',
  'Closed-loop servo tracking mechanism using analog sensor arrays and micro-stepping calibration.',
  'A physical engineering prototype pairing two PWM-driven servo motors with an optical/ultrasonic sensor payload. Employs a discrete proportional control loop running directly on microcontroller firmware to minimize overshoot and jitter while orienting toward targeted stimuli in real time.',
  'Hardware & Embedded Systems',
  array['ESP32', 'PWM Control', 'Servo Kinematics', 'Electronics', 'C++'],
  'https://github.com',
  null,
  null,
  '2026-04-10',
  true,
  3,
  true
),
(
  'Local Hardware-in-the-Loop Test Utility',
  'hardware-in-the-loop-test-utility',
  'Python CLI tool to automate serial testing, packet verification, and firmware validation for embedded boards.',
  'Created to streamline firmware debugging during embedded development sessions. This command-line utility listens on active UART COM ports, feeds structured byte sequences to attached microcontrollers, monitors response timing, and logs communication anomalies with high-resolution timestamps.',
  'Software & Systems',
  array['Python', 'PySerial', 'CLI', 'Embedded Testing'],
  'https://github.com',
  null,
  null,
  '2026-02-05',
  false,
  4,
  true
)
on conflict (slug) do nothing;

