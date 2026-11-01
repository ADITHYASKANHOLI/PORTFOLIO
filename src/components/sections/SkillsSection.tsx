import React, { useMemo } from 'react';
import { Skill } from '@/types';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import {
  Code2,
  Database,
  Cpu,
  Wrench,
  Users,
  Sparkles,
  Terminal,
  Activity,
  Workflow,
  Radio,
  BookOpen
} from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Dynamically group database records into the 5 specified categories
  const { programming, backend, hardware, tools, teaching } = useMemo(() => {
    const pList: Skill[] = [];
    const bList: Skill[] = [];
    const hList: Skill[] = [];
    const tList: Skill[] = [];
    const eList: Skill[] = [];

    skills.forEach((skill) => {
      const cat = (skill.category || '').toLowerCase();
      const name = skill.name.toLowerCase();

      if (
        cat.includes('program') ||
        cat.includes('language') ||
        name.includes('python') ||
        name.includes('c++') ||
        name.includes('c / c++') ||
        name.includes('javascript') ||
        name.includes('typescript')
      ) {
        pList.push(skill);
      } else if (
        cat.includes('backend') ||
        cat.includes('database') ||
        cat.includes('api') ||
        cat.includes('server') ||
        name.includes('fastapi') ||
        name.includes('flask') ||
        name.includes('sql') ||
        name.includes('postgres') ||
        name.includes('rest') ||
        name.includes('websocket')
      ) {
        bList.push(skill);
      } else if (
        cat.includes('hardware') ||
        cat.includes('embedded') ||
        cat.includes('electronic') ||
        cat.includes('iot') ||
        name.includes('esp32') ||
        name.includes('arduino') ||
        name.includes('sensor') ||
        name.includes('servo') ||
        name.includes('circuit') ||
        name.includes('soldering')
      ) {
        hList.push(skill);
      } else if (
        cat.includes('tool') ||
        cat.includes('platform') ||
        cat.includes('devops') ||
        cat.includes('cloud') ||
        name.includes('git') ||
        name.includes('linux') ||
        name.includes('platformio') ||
        name.includes('vscode') ||
        name.includes('shell')
      ) {
        tList.push(skill);
      } else if (
        cat.includes('teach') ||
        cat.includes('learn') ||
        cat.includes('community') ||
        cat.includes('fole') ||
        cat.includes('education') ||
        name.includes('mentor') ||
        name.includes('workshop') ||
        name.includes('documentation')
      ) {
        eList.sort();
        eList.push(skill);
      } else {
        tList.push(skill);
      }
    });

    const sortByOrder = (a: Skill, b: Skill) => a.display_order - b.display_order;

    return {
      programming: pList.sort(sortByOrder),
      backend: bList.sort(sortByOrder),
      hardware: hList.sort(sortByOrder),
      tools: tList.sort(sortByOrder),
      teaching: eList.sort(sortByOrder),
    };
  }, [skills]);

  return (
    <section
      id="skills"
      className="relative w-full py-28 md:py-36 bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-24 pb-8 border-b border-[#292D33]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#D7DCE2] uppercase tracking-technical mb-2 font-medium">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Interactive Engineering Stack</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            What I Work With
          </h2>

          <p className="font-sans text-[#9299A3] text-base sm:text-lg mt-3 font-light leading-relaxed">
            Tools, technologies, and areas I'm exploring, learning, and building with.
          </p>
        </div>

        {/* React Bits Canonical ScrollStack */}
        <div className="w-full max-w-5xl mx-auto">
          <ScrollStack
            useWindowScroll={true}
            smoothScroll={false}
            itemDistance={120}
            itemStackDistance={32}
            stackPosition="12%"
            itemScale={0.035}
            baseScale={0.88}
            dimAmount={0.15}
            blurAmount={0}
            tiltAmount={1.2}
            rotationAmount={0}
            holdDistance={260}
          >

            {/* CARD 01 — PROGRAMMING */}
            <ScrollStackItem
              itemClassName="border border-[#292D33] bg-[#12151A] hover:border-[#D7DCE2]/60 transition-colors"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex flex-col justify-between h-full min-h-[19rem] sm:min-h-[20rem]">
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#292D33] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#08090B] border border-[#292D33] flex items-center justify-center text-white">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block">
                        Category 01
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Programming
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#D7DCE2]/25 select-none">
                    01
                  </span>
                </div>

                {/* Card Content & Intentional Layout */}
                <div className="py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9299A3] leading-relaxed max-w-xl">
                    Core languages applied to firmware development, algorithmic problem solving, scripting, and typed web interfaces.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {programming.length > 0 ? (
                      programming.map((s, idx) => (
                        <div
                          key={s.id}
                          className="px-4 py-2 rounded-sm bg-[#08090B] border border-[#292D33] hover:border-[#D7DCE2] transition-colors flex items-center gap-2 group"
                        >
                          <span className="font-mono text-xs text-[#D7DCE2]/60">0{idx + 1}</span>
                          <span className="font-mono text-xs text-white font-medium group-hover:text-[#D7DCE2]">
                            {s.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-[#9299A3]">No programming entries loaded.</span>
                    )}
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-[#292D33]/60 flex items-center justify-between text-xs font-mono text-[#9299A3]">
                  <span className="flex items-center gap-1.5 text-[#D7DCE2]">
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    <span>SYNTAX & SYSTEMS</span>
                  </span>
                  <span>{programming.length} Active Records</span>
                </div>
              </div>
            </ScrollStackItem>

            {/* CARD 02 — BACKEND DEVELOPMENT */}
            <ScrollStackItem
              itemClassName="border border-[#292D33] bg-[#12151A] hover:border-[#D7DCE2]/60 transition-colors"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex flex-col justify-between h-full min-h-[19rem] sm:min-h-[20rem]">
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#292D33] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#08090B] border border-[#292D33] flex items-center justify-center text-white">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block">
                        Category 02
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Backend Development
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#D7DCE2]/25 select-none">
                    02
                  </span>
                </div>

                {/* Card Content & Intentional Layout */}
                <div className="py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9299A3] leading-relaxed max-w-xl">
                    REST endpoints, persistent databases, WebSocket event streams, and lightweight micro-daemons for sensor telemetry.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                    {backend.length > 0 ? (
                      backend.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 rounded-sm bg-[#08090B] border border-[#292D33] hover:border-[#D7DCE2] transition-colors flex items-center justify-between group"
                        >
                          <span className="font-mono text-xs text-white group-hover:text-[#D7DCE2]">
                            {s.name}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white" />
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-[#9299A3]">No backend entries loaded.</span>
                    )}
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-[#292D33]/60 flex items-center justify-between text-xs font-mono text-[#9299A3]">
                  <span className="flex items-center gap-1.5 text-[#D7DCE2]">
                    <Workflow className="w-3.5 h-3.5 text-white" />
                    <span>PIPELINES & PERSISTENCE</span>
                  </span>
                  <span>{backend.length} Active Records</span>
                </div>
              </div>
            </ScrollStackItem>

            {/* CARD 03 — HARDWARE & EMBEDDED SYSTEMS */}
            <ScrollStackItem
              itemClassName="border border-[#292D33] bg-[#12151A] hover:border-[#D7DCE2]/60 transition-colors"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex flex-col justify-between h-full min-h-[19rem] sm:min-h-[20rem]">
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#292D33] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#08090B] border border-[#292D33] flex items-center justify-center text-white">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block">
                        Category 03
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Hardware & Embedded Systems
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#D7DCE2]/25 select-none">
                    03
                  </span>
                </div>

                {/* Card Content & Intentional Layout */}
                <div className="py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9299A3] leading-relaxed max-w-xl">
                    Physical microcontrollers, hardware-software integration, PWM actuation, circuit prototyping, and bus protocols.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {hardware.length > 0 ? (
                      hardware.map((s) => (
                        <div
                          key={s.id}
                          className="px-3.5 py-2 rounded-sm bg-[#08090B] border border-[#292D33] hover:border-[#D7DCE2] transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="font-mono text-xs text-white group-hover:text-[#D7DCE2]">
                            {s.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-[#9299A3]">No hardware entries loaded.</span>
                    )}
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-[#292D33]/60 flex items-center justify-between text-xs font-mono text-[#9299A3]">
                  <span className="flex items-center gap-1.5 text-[#D7DCE2]">
                    <Radio className="w-3.5 h-3.5 text-white" />
                    <span>SILICON & SENSING BUSES</span>
                  </span>
                  <span>{hardware.length} Active Records</span>
                </div>
              </div>
            </ScrollStackItem>

            {/* CARD 04 — TOOLS & PLATFORMS */}
            <ScrollStackItem
              itemClassName="border border-[#292D33] bg-[#12151A] hover:border-[#D7DCE2]/60 transition-colors"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex flex-col justify-between h-full min-h-[19rem] sm:min-h-[20rem]">
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#292D33] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#08090B] border border-[#292D33] flex items-center justify-center text-white">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block">
                        Category 04
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Tools & Platforms
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#D7DCE2]/25 select-none">
                    04
                  </span>
                </div>

                {/* Card Content & Intentional Layout */}
                <div className="py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9299A3] leading-relaxed max-w-xl">
                    Development toolchains, terminal environments, version control workflows, and embedded flashing toolkits.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {tools.length > 0 ? (
                      tools.map((s) => (
                        <div
                          key={s.id}
                          className="px-4 py-2.5 rounded-sm bg-[#08090B] border border-[#292D33] hover:border-[#D7DCE2] transition-colors flex items-center gap-3 group"
                        >
                          <Terminal className="w-3.5 h-3.5 text-[#D7DCE2]" />
                          <span className="font-mono text-xs text-white group-hover:text-[#D7DCE2]">
                            {s.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-[#9299A3]">No tool entries loaded.</span>
                    )}
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-[#292D33]/60 flex items-center justify-between text-xs font-mono text-[#9299A3]">
                  <span className="flex items-center gap-1.5 text-[#D7DCE2]">
                    <Activity className="w-3.5 h-3.5 text-white" />
                    <span>TOOLCHAIN & DEV ENVIRONMENTS</span>
                  </span>
                  <span>{tools.length} Active Records</span>
                </div>
              </div>
            </ScrollStackItem>

            {/* CARD 05 — TEACHING & COMMUNITY */}
            <ScrollStackItem
              itemClassName="border border-[#292D33] bg-[#12151A] hover:border-[#D7DCE2]/60 transition-colors"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex flex-col justify-between h-full min-h-[19rem] sm:min-h-[20rem]">
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#292D33] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#08090B] border border-[#292D33] flex items-center justify-center text-white">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block">
                        Category 05
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Teaching & Community
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#D7DCE2]/25 select-none">
                    05
                  </span>
                </div>

                {/* Card Content & Intentional Layout */}
                <div className="py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9299A3] leading-relaxed max-w-xl">
                    Peer-to-peer mentoring, collaborative workshops, hands-on engineering labs, and the FOLE open education initiative.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {teaching.length > 0 ? (
                      teaching.map((s) => (
                        <div
                          key={s.id}
                          className="px-4 py-2.5 rounded-sm bg-[#08090B] border border-[#292D33] hover:border-white transition-colors flex items-center gap-2.5 group"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#D7DCE2]" />
                          <span className="font-mono text-xs text-white group-hover:text-[#D7DCE2]">
                            {s.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-[#9299A3]">No community entries loaded.</span>
                    )}
                  </div>
                </div>

                {/* Card Footer Metric */}
                <div className="pt-4 border-t border-[#292D33]/60 flex items-center justify-between text-xs font-mono text-[#9299A3]">
                  <span className="flex items-center gap-1.5 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>FOLE & HORIZONTAL PEDAGOGY</span>
                  </span>
                  <span>{teaching.length} Active Records</span>
                </div>
              </div>
            </ScrollStackItem>

          </ScrollStack>
        </div>

        {/* Bottom Technical Note */}
        <div className="mt-16 pt-8 border-t border-[#292D33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#9299A3]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>LIVE DATABASE SYNCHRONIZED ARCHIVE</span>
          </div>
          <div>
            <span>Scroll vertically to inspect layered stack ↑↓</span>
          </div>
        </div>

      </div>
    </section>
  );
};
