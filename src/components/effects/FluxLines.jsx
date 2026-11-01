'use client';

import { useEffect, useRef, useState } from 'react';
import './FluxLines.css';

const MAX_COLORS = 8;
const INTRO_SECONDS = 1.8;
const FLOW = { up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0] };

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FIELD = `
float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += vec3(dot(p3, p3.zyx + 33.33));
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * 3.14159265 - 3.14159265 / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uLine;
uniform float uMaxHalf;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform vec4 uMagnet;
uniform vec4 uSwirl;
uniform float uReveal;
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;
${FIELD}

vec3 palette(float h) {
  float x = clamp(h, 0.0, 1.0) * float(uColorCount - 1);
  int i = int(floor(x));
  int j = min(i + 1, uColorCount - 1);
  return mix(uColors[i], uColors[j], smoothstep(0.0, 1.0, x - float(i)));
}

void main() {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 frag = gl_FragCoord.xy;
  vec2 toMagnet = (frag - uMagnet.xy) / uResolution.y;
  float pull = uMagnet.z * exp(-dot(toMagnet, toMagnet) / (uMagnet.w * uMagnet.w));
  if (pull > 0.001) {
    float angle = pull * 0.55;
    float c = cos(angle);
    float s = sin(angle);
    frag = uMagnet.xy + mat2(c, s, -s, c) * (frag - uMagnet.xy);
  }
  if (uSwirl.w > 0.0) {
    vec2 d = frag - uSwirl.xy;
    float reach = uSwirl.z;
    float angle = uSwirl.w * exp(-dot(d, d) / (reach * reach));
    float c = cos(angle);
    float s = sin(angle);
    frag = uSwirl.xy + mat2(c, s, -s, c) * d;
  }
  vec2 p = frag / uResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = uTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float field = smin(peaks, peaks2, max(uFluidity, 0.001));

  float slope = length(vec2(dFdx(field), dFdy(field)));
  float gap = abs(field - 0.4);
  float pixels = gap / max(slope, 1e-6);
  float halfBand = max(uRimWidth, 0.001) * 0.5;
  float across = max(gap / halfBand, pixels / uMaxHalf);
  float band = 5.0 * uRimWidth * (1.0 - across);
  float reveal = smoothstep(0.2, 0.85, pull);
  float shimmer = vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer * (1.0 - reveal * 0.75);
  float lit = clamp(band - shimmer * 0.35, 0.0, 1.0);
  float glow = pow(lit, uSharpness) * uGlow * (1.0 + reveal * 0.25);
  float core = uLine > 0.0 ? smoothstep(uLine + 0.75, uLine - 0.75, pixels) * max(0.4, max(smoothstep(0.08, 0.6, glow), reveal)) : 0.0;
  float shine = clamp(glow, 0.0, 1.0);
  float energy = max(shine * shine, core * 0.85) * uReveal;

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 tint = palette(h);

  if (uLight > 0.5) {
    float chroma = max(tint.r, max(tint.g, tint.b)) - min(tint.r, min(tint.g, tint.b));
    vec3 ink = mix(vec3(0.07, 0.07, 0.08), tint * 0.55, clamp(chroma * 1.6, 0.0, 1.0));
    vec3 col = mix(vec3(1.0), ink, energy * uOpacity);
    outColor = vec4(col, energy * uOpacity);
    return;
  }

  vec3 light = tint * energy * uOpacity;
  outColor = uOpaque > 0.5 ? vec4(uBackground + light, 1.0) : vec4(light, clamp(energy * uOpacity, 0.0, 1.0));
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Direct hex color decoder: immune to 2D canvas fingerprinting blocks in Brave/Firefox
const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.trim();
  const match6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  if (match6) {
    return [
      parseInt(match6[1], 16) / 255,
      parseInt(match6[2], 16) / 255,
      parseInt(match6[3], 16) / 255
    ];
  }
  const match3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(clean);
  if (match3) {
    return [
      parseInt(match3[1] + match3[1], 16) / 255,
      parseInt(match3[2] + match3[2], 16) / 255,
      parseInt(match3[3] + match3[3], 16) / 255
    ];
  }
  return null;
};

// Section 1: Canonical Diagnostic Shader Compiler
const compile = (gl, type, source, label) => {
  if (gl.isContextLost()) {
    console.error(`[FluxLines] WebGL context is lost. Cannot compile ${label}`);
    return null;
  }

  const shader = gl.createShader(type);
  if (!shader) {
    console.error(`[FluxLines] Unable to create ${label}`);
    return null;
  }

  const cleanSource = typeof source === 'string' ? source.trim() : source;
  gl.shaderSource(shader, cleanSource);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  const infoLog = gl.getShaderInfoLog(shader);

  if (!compiled) {
    console.error(`[FluxLines] ${label} compilation failed`, {
      infoLog: infoLog ?? "No compiler log returned",
      sourceLength: cleanSource?.length,
      sourceStart: cleanSource?.slice(0, 250),
      sourceEnd: cleanSource?.slice(-250),
      shaderType: type,
      glError: gl.getError(),
      contextLost: gl.isContextLost()
    });

    console.error(`[FluxLines] Complete ${label} source:`, cleanSource);

    gl.deleteShader(shader);
    return null;
  }

  console.info(`[FluxLines] ${label} compiled successfully`, infoLog || '(no warnings)');
  return shader;
};

// Section 3: Minimal WebGL2 Shader Test
const testMinimalWebGL2 = (gl) => {
  if (gl.isContextLost()) {
    console.error('[FluxLines] Cannot run minimal test: WebGL context is lost.');
    return false;
  }

  console.info('[FluxLines] Running minimal WebGL2 GLSL ES 3.00 shader test...');
  const testVertexSource = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

  const testFragmentSource = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  outColor = vec4(0.8, 0.35, 0.2, 1.0);
}`;

  const vShader = compile(gl, gl.VERTEX_SHADER, testVertexSource, 'Minimal Test Vertex Shader');
  const fShader = compile(gl, gl.FRAGMENT_SHADER, testFragmentSource, 'Minimal Test Fragment Shader');

  if (!vShader || !fShader) {
    console.error('[FluxLines] Minimal WebGL2 shader test FAILED at compile step. Inspect the error logs above.', {
      vertexSuccess: !!vShader,
      fragmentSuccess: !!fShader,
      contextLost: gl.isContextLost(),
      webglContextInfo: {
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
      }
    });
    if (vShader) gl.deleteShader(vShader);
    if (fShader) gl.deleteShader(fShader);
    return false;
  }

  const testProg = gl.createProgram();
  gl.attachShader(testProg, vShader);
  gl.attachShader(testProg, fShader);
  gl.linkProgram(testProg);
  const linked = gl.getProgramParameter(testProg, gl.LINK_STATUS);
  const log = gl.getProgramInfoLog(testProg);
  gl.deleteShader(vShader);
  gl.deleteShader(fShader);
  gl.deleteProgram(testProg);

  if (!linked) {
    console.error('[FluxLines] Minimal WebGL2 test program link FAILED:', log);
    return false;
  }

  console.info('[FluxLines] Minimal WebGL2 shader test PASSED successfully! WebGL2 context and GLSL ES 3.00 compiler are verified.');
  return true;
};

// Section 4: Full FluxLines Program Linker
const link = (gl, vertexSource, fragmentSource) => {
  if (gl.isContextLost()) {
    console.error('[FluxLines] Cannot link program: WebGL context is lost.');
    return null;
  }

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource, 'FluxLines Vertex Shader');
  if (!vertex) {
    console.error('[FluxLines] Aborting program link: FluxLines Vertex Shader compilation failed');
    return null;
  }

  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource, 'FluxLines Fragment Shader');
  if (!fragment) {
    console.error('[FluxLines] Aborting program link: FluxLines Fragment Shader compilation failed');
    gl.deleteShader(vertex);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    console.error('[FluxLines] Unable to create WebGL program');
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  const infoLog = gl.getProgramInfoLog(program);

  // Clean up shaders after link
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!linked) {
    console.error('[FluxLines] Program linking failed', {
      infoLog: infoLog ?? 'No program link log returned',
      glError: gl.getError(),
      contextLost: gl.isContextLost()
    });
    gl.deleteProgram(program);
    return null;
  }

  console.info('[FluxLines] FluxLines Program linked successfully', infoLog || '(no warnings)');

  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name.replace('[0]', '')] = gl.getUniformLocation(program, info.name);
  }

  return { program, uniforms };
};

const FluxLines = ({
  colors = ['#ffffff', '#ffffff', '#ffffff'],
  speed = 0.5,
  scale = 1.6,
  turbulence = 1,
  fluidity = 0.1,
  rimWidth = 0.2,
  sharpness = 2.5,
  shimmer = 1.5,
  glow = 2,
  lineWidth = 1,
  flowDirection = 'down',
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1,
  mouseRadius = 0.35,
  mouseDampening = 0.15,
  clickSwirl = true,
  intro = false,
  lightMode = false,
  transparent = true,
  backgroundColor,
  paused = false,
  dpr,
  mixBlendMode,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  const settings = {
    colors: Array.isArray(colors) && colors.length ? colors.slice(0, MAX_COLORS) : ['#ffffff'],
    speed,
    scale: Math.max(0.05, scale),
    turbulence,
    fluidity: Math.max(0.001, fluidity),
    rimWidth: Math.max(0.001, rimWidth),
    sharpness: Math.max(0.1, sharpness),
    shimmer: Math.max(0, shimmer),
    glow: Math.max(0, glow),
    lineWidth: Math.max(0, lineWidth),
    flow: FLOW[flowDirection] ?? FLOW.down,
    opacity: clamp(opacity, 0, 1),
    mouseInteraction,
    mouseStrength: Math.max(0, mouseStrength),
    mouseRadius: Math.max(0.01, mouseRadius),
    mouseDampening: Math.max(0, mouseDampening),
    clickSwirl,
    intro,
    lightMode,
    transparent,
    backgroundColor,
    paused,
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    console.info('[FluxLines] Mount check:', {
      containerAvailable: !!container,
      canvasAvailable: !!canvas,
      containerDimensions: container ? `${container.clientWidth} × ${container.clientHeight}` : 'none',
      boundingRect: container?.getBoundingClientRect()
    });

    if (!container || !canvas) return undefined;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });

    if (!gl) {
      console.error('[FluxLines] WebGL2 context acquisition failed or was blocked by browser permissions.');
      setHasWebGL(false);
      return undefined;
    }

    // Step 3: Required Context Validity Checks
    const isLost = gl.isContextLost();
    console.log('[FluxLines] WebGL context lost:', isLost);
    console.log('[FluxLines] WebGL version:', gl.getParameter(gl.VERSION));
    console.log('[FluxLines] GLSL version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    console.log('[FluxLines] WebGL renderer:', gl.getParameter(gl.RENDERER));

    if (isLost) {
      console.error('[FluxLines] WebGL context was lost before shader compilation.');
      setHasWebGL(false);
      return undefined;
    }

    // Step 3: Minimal WebGL2 shader verification
    testMinimalWebGL2(gl);

    if (gl.isContextLost()) {
      console.error('[FluxLines] WebGL context was lost after minimal shader test.');
      setHasWebGL(false);
      return undefined;
    }

    // Step 4: Link actual FluxLines program
    const program = link(gl, VERTEX, FRAGMENT);
    if (!program) {
      console.error('[FluxLines] Shader program initialization failed');
      setHasWebGL(false);
      return undefined;
    }

    if (gl.isContextLost()) {
      console.error('[FluxLines] WebGL context was lost after program link.');
      setHasWebGL(false);
      return undefined;
    }

    const u = program.uniforms;

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const probe = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d', { willReadFrequently: true }) : null;
    const cache = new Map();
    const parse = (value, fallback) => {
      if (!value) return fallback;
      const key = String(value);
      if (cache.has(key)) return cache.get(key);

      // Direct hex decoding immune to canvas fingerprint blocking
      const direct = hexToRgb(key);
      if (direct) {
        cache.set(key, direct);
        return direct;
      }

      let rgb = fallback;
      if (probe) {
        try {
          probe.clearRect(0, 0, 1, 1);
          probe.fillStyle = '#000000';
          probe.fillStyle = key;
          probe.fillRect(0, 0, 1, 1);
          const data = probe.getImageData(0, 0, 1, 1).data;
          if (data && (data[0] !== 0 || data[1] !== 0 || data[2] !== 0 || key.toLowerCase() === '#000' || key.toLowerCase() === '#000000' || key.toLowerCase() === 'black')) {
            rgb = [data[0] / 255, data[1] / 255, data[2] / 255];
          }
        } catch {
          // Fallback safely
        }
      }
      cache.set(key, rgb);
      return rgb;
    };
    const palette = new Float32Array(MAX_COLORS * 3);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const pointer = { x: 0, y: 0, inside: false };
    const magnet = { x: 0, y: 0, active: 0 };
    const swirl = { x: 0, y: 0, age: 10 };
    let time = 0;
    let reveal = settingsRef.current.intro && !reduce ? 0 : 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let frameCount = 0;

    const render = () => {
      if (gl.isContextLost()) {
        console.warn('[FluxLines] WebGL context lost during render.');
        return;
      }

      const s = settingsRef.current;
      const ratio = canvas.width / Math.max(1, container.clientWidth);
      s.colors.forEach((value, index) => palette.set(parse(value, [1, 1, 1]), index * 3));
      const intro = Math.min(1, reveal);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program.program);
      gl.bindVertexArray(vao);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, time);
      gl.uniform2f(u.uFlow, s.flow[0], s.flow[1]);
      gl.uniform1f(u.uSpeed, s.speed);
      gl.uniform1f(u.uScale, s.scale);
      gl.uniform1f(u.uTurbulence, s.turbulence);
      gl.uniform1f(u.uFluidity, s.fluidity);
      gl.uniform1f(u.uRimWidth, s.rimWidth);
      gl.uniform1f(u.uSharpness, s.sharpness);
      gl.uniform1f(u.uShimmer, s.shimmer);
      gl.uniform1f(u.uGlow, s.glow);
      gl.uniform1f(u.uLine, s.lineWidth * ratio * 0.5);
      gl.uniform1f(u.uMaxHalf, 28 * ratio);
      gl.uniform3fv(u.uColors, palette);
      gl.uniform1i(u.uColorCount, s.colors.length);
      gl.uniform4f(u.uMagnet, magnet.x, magnet.y, magnet.active * s.mouseStrength, s.mouseRadius);
      const age = swirl.age;
      const twist = 1.9 * Math.min(1, age / 0.23) * Math.exp(-Math.max(0, age - 0.23) * 1.1);
      gl.uniform4f(u.uSwirl, swirl.x, swirl.y, canvas.height * 0.22 * (1 + age * 0.5), age < 6 ? twist : 0);
      gl.uniform1f(u.uReveal, intro * intro * (3 - 2 * intro));
      gl.uniform1f(u.uLight, s.lightMode ? 1 : 0);
      gl.uniform1f(u.uOpaque, s.transparent ? 0 : 1);
      gl.uniform3fv(u.uBackground, parse(s.backgroundColor, s.lightMode ? [1, 1, 1] : [0.0706, 0.0588, 0.0902]));
      gl.uniform1f(u.uOpacity, s.opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (frameCount <= 2) {
        console.info(`[FluxLines] Render pass #${frameCount + 1} completed. Buffer: ${canvas.width} × ${canvas.height}`);
      }
    };

    const frame = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60;
      last = now;
      const motion = s.paused || reduce ? 0 : 1;
      time += dt * motion;
      swirl.age += dt;
      if (s.intro && !reduce && reveal < 1) reveal = Math.min(1, reveal + dt / INTRO_SECONDS);
      else if (!s.intro || reduce) reveal = 1;

      const engaged = s.mouseInteraction && pointer.inside;
      const follow = s.mouseDampening > 0 ? 1 - Math.exp(-dt / s.mouseDampening) : 1;
      if (engaged) {
        magnet.x += (pointer.x - magnet.x) * follow;
        magnet.y += (pointer.y - magnet.y) * follow;
      }
      const target = engaged ? 1 : 0;
      magnet.active += (target - magnet.active) * (1 - Math.exp(-dt / 0.3));
      if (Math.abs(target - magnet.active) < 0.001) magnet.active = target;

      render();
      frameCount++;
      if (frameCount <= 2) {
        console.info(`[FluxLines] Animation loop active. Frame #${frameCount} at timestamp: ${Math.round(now)}`);
      }

      const busy = motion > 0 || magnet.active !== target || reveal < 1 || swirl.age < 6;
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const s = settingsRef.current;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, container.clientWidth || rect.width || window.innerWidth || 1280);
      const height = Math.max(1, container.clientHeight || rect.height || window.innerHeight || 800);
      const ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));

      console.info('[FluxLines] Resized:', {
        container: `${width} × ${height}`,
        canvasBuffer: `${canvas.width} × ${canvas.height}`,
        dpr: ratio
      });

      render();
      wake();
    };

    const locate = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ratio = canvas.width / Math.max(1, rect.width);
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x * ratio;
      pointer.y = (rect.height - y) * ratio;
    };

    const onPointerMove = event => {
      const wasInside = pointer.inside;
      locate(event);
      if (pointer.inside && !wasInside && magnet.active < 0.05) {
        magnet.x = pointer.x;
        magnet.y = pointer.y;
      }
      wake();
    };

    const onPointerDown = event => {
      onPointerMove(event);
      if (!pointer.inside || !settingsRef.current.clickSwirl || reduce) return;
      swirl.x = pointer.x;
      swirl.y = pointer.y;
      swirl.age = 0;
      wake();
    };

    const onPointerUp = event => {
      if (event.pointerType !== 'mouse') pointer.inside = false;
    };

    const onPointerLeave = () => {
      pointer.inside = false;
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();

    let lastDpr = settingsRef.current.dpr;
    wakeRef.current = () => {
      const s = settingsRef.current;
      if (s.dpr !== lastDpr) {
        lastDpr = s.dpr;
        resize();
        return;
      }
      if (!raf) render();
      wake();
    };

    // NOTE on React StrictMode:
    // In React 18/19 StrictMode, this cleanup is immediately followed by a remount setup
    // on the exact same DOM canvas element.
    // We clean up setup-specific GPU resources (program, buffer, vao), animation frames,
    // and event listeners. We MUST NOT call loseContext() because that would permanently
    // kill the WebGL context on the canvas and break the remounted instance.
    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      if (program?.program) gl.deleteProgram(program.program);
      if (buffer) gl.deleteBuffer(buffer);
      if (vao) gl.deleteVertexArray(vao);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div
      ref={containerRef}
      className={`flux-lines-container${className ? ` ${className}` : ''}`}
      style={mixBlendMode ? { ...style, mixBlendMode } : style}
      {...rest}
    >
      {hasWebGL ? (
        <canvas ref={canvasRef} className="flux-lines-canvas" aria-hidden="true" />
      ) : (
        <div
          className="flux-lines-canvas flex items-center justify-center p-6 text-center font-mono text-xs text-[#9299A3]/40"
          style={{ backgroundColor: backgroundColor || 'transparent' }}
        >
          [WebGL2 acceleration unavailable]
        </div>
      )}
    </div>
  );
};

export default FluxLines;
