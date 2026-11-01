-- Migration: 003_hardware_and_teaching.sql
-- Description: Dedicated tables and policies for Hardware and Teaching exhibition cards

-- 1. HARDWARE ITEMS TABLE
create table if not exists public.hardware_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text not null default '',
  detailed_description text not null default '',
  image_url text not null default '',
  gallery_images text[] not null default '{}',
  category text not null default 'Hardware & Systems',
  technologies text[] not null default '{}',
  external_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hardware_items_slug on public.hardware_items(slug);
create index if not exists idx_hardware_items_published on public.hardware_items(is_published);
create index if not exists idx_hardware_items_display_order on public.hardware_items(display_order asc);
create index if not exists idx_hardware_items_category on public.hardware_items(category);

-- 2. TEACHING ITEMS TABLE
create table if not exists public.teaching_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text not null default '',
  detailed_description text not null default '',
  image_url text not null default '',
  gallery_images text[] not null default '{}',
  category text not null default 'Teaching & Mentorship',
  tag text not null default '',
  learning_outcomes text[] not null default '{}',
  resource_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teaching_items_slug on public.teaching_items(slug);
create index if not exists idx_teaching_items_published on public.teaching_items(is_published);
create index if not exists idx_teaching_items_display_order on public.teaching_items(display_order asc);
create index if not exists idx_teaching_items_category on public.teaching_items(category);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.hardware_items enable row level security;
alter table public.teaching_items enable row level security;

-- Hardware Items Policies
create policy "Anyone can view published hardware items"
  on public.hardware_items for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert hardware items"
  on public.hardware_items for insert
  with check (public.is_admin());

create policy "Admins can update hardware items"
  on public.hardware_items for update
  using (public.is_admin());

create policy "Admins can delete hardware items"
  on public.hardware_items for delete
  using (public.is_admin());

-- Teaching Items Policies
create policy "Anyone can view published teaching items"
  on public.teaching_items for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert teaching items"
  on public.teaching_items for insert
  with check (public.is_admin());

create policy "Admins can update teaching items"
  on public.teaching_items for update
  using (public.is_admin());

-- 4. UPDATED_AT TRIGGERS
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_hardware_items_updated_at on public.hardware_items;
create trigger set_hardware_items_updated_at
  before update on public.hardware_items
  for each row execute function public.set_updated_at();

drop trigger if exists set_teaching_items_updated_at on public.teaching_items;
create trigger set_teaching_items_updated_at
  before update on public.teaching_items
  for each row execute function public.set_updated_at();

-- 5. INITIAL SEED DATA FOR HARDWARE ITEMS
insert into public.hardware_items (
  title, slug, short_description, detailed_description, image_url, category, technologies, display_order, is_published
) values
(
  'ESP32 & Real-Time Computing',
  'esp32-real-time-computing',
  'Dual-core Xtensa microcontrollers, FreeRTOS multitasking, real-time telemetry, and hardware interrupts.',
  'Developing asynchronous embedded firmware with FreeRTOS tasks, mutex synchronization, Wi-Fi telemetry pipelines, and low-power deep sleep cycles on ESP32 architectures.',
  '/hardware/esp32.svg',
  'ESP32',
  array['FreeRTOS', 'Dual-Core Xtensa', 'Wi-Fi / BLE', 'Hardware Timers'],
  1,
  true
),
(
  'Actuation & Motor Control',
  'actuation-motor-control',
  'Precision pulse-width modulation (PWM), servo calibration, and mechanical actuation.',
  'Controlling multi-axis servo arms, measuring duty-cycle jitter, designing power distribution stages, and tuning response curves for electromechanical linkages.',
  '/hardware/motors.svg',
  'Servo Motors',
  array['PWM Drivers', 'Servo Calibration', 'H-Bridge', 'Kinematics'],
  2,
  true
),
(
  'Sensors & Bus Interfacing',
  'sensors-bus-interfacing',
  'Interfacing physical transducers, ultrasonic distance sensors, and environmental modules.',
  'Sampling analog inputs via ADC, calibrating signal noise, and querying digital sensor registers across standard I2C/SPI buses.',
  '/hardware/sensors.svg',
  'Sensors & Modules',
  array['I2C Bus', 'ADC Calibration', 'Ultrasonic', 'IMU Registers'],
  3,
  true
),
(
  'Embedded Systems Architecture',
  'embedded-systems-architecture',
  'Connecting low-level microcontroller firmware with higher-level software systems.',
  'Designing lightweight telemetry daemons, reliable serial protocols, and state machines to bridge physical electronics with application layers.',
  '/hardware/embedded.svg',
  'Embedded Systems',
  array['State Machines', 'Serial Protocols', 'Embedded C', 'Telemetry Daemons'],
  4,
  true
),
(
  'Circuits & Practical Electronics',
  'circuits-practical-electronics',
  'Exploring circuit prototyping, voltage regulation, signal conditioning, and workbench experimentation.',
  'Hands-on bench experimentation with breadboards, schematic diagrams, multimeter diagnostics, and soldering techniques.',
  '/hardware/electronics.svg',
  'Electronics',
  array['Circuit Design', 'Voltage Regulators', 'Breadboard Prototyping', 'Soldering'],
  5,
  true
)
on conflict (slug) do nothing;

-- 6. INITIAL SEED DATA FOR TEACHING ITEMS
insert into public.teaching_items (
  title, slug, short_description, detailed_description, image_url, category, tag, learning_outcomes, display_order, is_published
) values
(
  'Learning Together',
  'learning-together',
  'Collaborative learning, group discussions, and knowledge exchange.',
  'True learning happens when curious minds connect, break down complex concepts, and build shared understanding through open dialogue and mutual curiosity.',
  '/teaching/learning-together.svg',
  'Peer Learning',
  '01 // Peer Collaboration',
  array['Horizontal knowledge sharing', 'Technical discourse', 'Active listening and consensus'],
  1,
  true
),
(
  'Teaching Through Building',
  'teaching-through-building',
  'Hands-on electronics workshops, dev boards, and live circuit demos.',
  'Abstract schematics become intuitive the moment a student connects their first microcontroller, solders a sensor bus, or debugs an SPI waveform on a real oscilloscope.',
  '/teaching/teaching-building.svg',
  'Workshops',
  '02 // Hands-on Workshops',
  array['Hands-on circuit prototyping', 'Oscilloscope debugging', 'Microcontroller programming'],
  2,
  true
),
(
  'Sharing Technical Knowledge',
  'sharing-technical-knowledge',
  'Documenting systems, open architectures, and technical insights.',
  'Demystifying embedded systems, firmware architecture, and modern full-stack workflows through accessible documentation, open-source repositories, and mentorship.',
  '/teaching/sharing-knowledge.svg',
  'Documentation',
  '03 // Open Documentation',
  array['Open-source documentation', 'Firmware architecture diagrams', 'Reproducible research'],
  3,
  true
),
(
  'FOLE — Free Open Learning & Education',
  'fole-student-community',
  'Student-led peer-to-peer learning community at College of Engineering Vadakara (CEV).',
  'Founded FOLE to champion horizontal peer-to-peer technical learning, empowering students across batches to build, explore, and master engineering without gatekeeping.',
  '/teaching/fole-community.svg',
  'Community',
  '04 // Student Community',
  array['Student community leadership', 'Democratized engineering education', 'Cross-batch mentorship'],
  4,
  true
)
on conflict (slug) do nothing;

