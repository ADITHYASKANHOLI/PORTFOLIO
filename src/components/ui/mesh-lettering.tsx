import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface MeshLetteringProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  colors?: [string, string];
  sheen?: number;
  gloss?: number;
  iridescence?: number;
  wind?: number;
  windAngle?: number;
  turbulence?: number;
  flow?: number;
  softness?: number;
  drag?: number;
  hold?: number;
  lightAngle?: number;
  lightDrift?: number;
  interactive?: boolean;
  gustStrength?: number;
  gustRadius?: number;
  clickGust?: boolean;
  intro?: boolean;
  introDuration?: number;
  paused?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface MeshLetteringHandle {
  gust: (x?: number, y?: number, strength?: number) => void;
  replay: () => void;
}

const FIXED_DELTA = 1 / 60;

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

let sharedCanvasCtx: CanvasRenderingContext2D | null = null;
const parseColor = (
  colorStr: string,
  fallback: [number, number, number]
): [number, number, number] => {
  if (typeof document === 'undefined') return fallback;
  if (!sharedCanvasCtx) {
    sharedCanvasCtx = document.createElement('canvas').getContext('2d');
  }
  if (!sharedCanvasCtx) return fallback;

  sharedCanvasCtx.fillStyle = '#010203';
  sharedCanvasCtx.fillStyle = colorStr;
  const parsed = String(sharedCanvasCtx.fillStyle);
  if (parsed === '#010203' && colorStr.trim().toLowerCase() !== '#010203') {
    return fallback;
  }
  if (parsed.startsWith('#')) {
    const hex = parsed.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const matches = parsed.match(/[\d.]+/g);
  if (!matches || matches.length < 3) return fallback;
  return [
    Number(matches[0]) / 255,
    Number(matches[1]) / 255,
    Number(matches[2]) / 255,
  ];
};

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const toLinearRGB = (
  rgb: [number, number, number]
): [number, number, number] => [
  srgbToLinear(rgb[0]),
  srgbToLinear(rgb[1]),
  srgbToLinear(rgb[2]),
];

const vertexShader = `
in vec3 aTangent;
out vec3 vNormal;
out vec3 vTangent;
out vec3 vWorld;
out vec2 vUv;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vTangent = normalize(mat3(modelMatrix) * aTangent);
  vWorld = world.xyz;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = `
uniform sampler2D uMask;
uniform vec3 uSilk;
uniform vec3 uSheenColor;
uniform vec3 uKey;
uniform vec3 uFill;
uniform vec3 uEye;
uniform float uSheen;
uniform float uGloss;
uniform float uIridescence;
uniform float uFront;
uniform float uFrontWidth;
uniform vec2 uWindDir;
uniform vec4 uRestRect;
uniform vec3 uFrontShape;
in vec3 vNormal;
in vec3 vTangent;
in vec3 vWorld;
in vec2 vUv;
out vec4 fragColor;

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

vec3 tonemap(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 rest = vec2(uRestRect.x + vUv.x * uRestRect.z, uRestRect.y - vUv.y * uRestRect.w);
  float across = dot(rest, vec2(-uWindDir.y, uWindDir.x));
  float along = dot(rest, uWindDir) - across * uFrontShape.x + uFrontShape.y * sin(across * uFrontShape.z + 0.7);
  float reveal = clamp((uFront - along) / uFrontWidth, 0.0, 1.0);
  float alpha = smoothstep(0.25, 0.75, texture(uMask, vUv).a) * reveal * reveal * (3.0 - 2.0 * reveal);
  if (alpha < 0.003) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(uEye - vWorld);
  vec3 t = normalize(vTangent - n * dot(n, vTangent));
  vec3 b = cross(n, t);
  vec3 h = normalize(uKey + v);
  float lit = clamp((dot(n, uKey) + 0.25) / 1.25, 0.0, 1.0);
  float fill = clamp(dot(n, uFill), 0.0, 1.0);
  float facing = clamp(dot(n, v), 0.0, 1.0);
  float th = dot(t, h);
  float bh = dot(b, h);
  float warp = pow(sqrt(max(1.0 - th * th, 0.0)), mix(30.0, 260.0, uGloss));
  float weft = pow(sqrt(max(1.0 - bh * bh, 0.0)), mix(12.0, 80.0, uGloss));
  float broad = pow(sqrt(max(1.0 - th * th, 0.0)), 8.0);
  float exposure = smoothstep(-0.25, 0.35, dot(n, uKey));
  float grazing = pow(1.0 - facing, 2.5);
  vec3 body = mix(uSilk, uSheenColor, clamp(uIridescence * (grazing * 1.6 + weft * 0.5), 0.0, 1.0));
  vec3 color = body * (0.06 + 1.05 * lit * lit + 0.12 * fill);
  color += body * broad * exposure * uSheen * 0.2;
  color = mix(color, uSheenColor, clamp(grazing * 0.3 * uSheen, 0.0, 1.0));
  color = mix(color, uSheenColor, clamp(weft * exposure * uSheen * 0.3, 0.0, 1.0));
  color = mix(color, mix(uSheenColor, vec3(1.0), 0.2) * 1.15, clamp(warp * exposure * uSheen * 0.9, 0.0, 1.0));
  if (!gl_FrontFacing) color *= 0.72;
  fragColor = vec4(encode(tonemap(color)) * alpha, alpha);
}
`;

export const MeshLettering = forwardRef<MeshLetteringHandle, MeshLetteringProps>(
  (
    {
      text = 'Hey, I am Adithya',
      fontFamily = '',
      fontWeight = 800,
      fontSize = 124,
      letterSpacing = -0.01,
      lineHeight = 1,
      colors = ['#7B61FF', '#FFC4F5'],
      sheen = 1,
      gloss = 0.6,
      iridescence = 0.5,
      wind = 1,
      windAngle = 0,
      turbulence = 0.5,
      flow = 1,
      softness = 0.6,
      drag = 0.5,
      hold = 0.5,
      lightAngle = -35,
      lightDrift = 1,
      interactive = true,
      gustStrength = 1,
      gustRadius = 1.2,
      clickGust = true,
      intro = true,
      introDuration = 1.8,
      paused = false,
      quality = 1,
      className,
      style,
      children,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<{
      sync: () => void;
      destroy: () => void;
      replay: () => void;
      gust: (x?: number, y?: number, strength?: number) => void;
    } | null>(null);

    const [isSupported, setIsSupported] = useState<boolean>(true);

    const reducedMotion = useSyncExternalStore(
      subscribeReducedMotion,
      getReducedMotionSnapshot,
      () => false
    );

    const propsRef = useRef({
      text,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      lineHeight,
      colors,
      sheen,
      gloss,
      iridescence,
      wind,
      windAngle,
      turbulence,
      flow,
      softness,
      drag,
      hold,
      lightAngle,
      lightDrift,
      interactive,
      gustStrength,
      gustRadius,
      clickGust,
      intro,
      introDuration,
      paused,
      quality,
      reduced: reducedMotion,
    });

    useEffect(() => {
      propsRef.current = {
        text,
        fontFamily,
        fontWeight,
        fontSize,
        letterSpacing,
        lineHeight,
        colors,
        sheen,
        gloss,
        iridescence,
        wind,
        windAngle,
        turbulence,
        flow,
        softness,
        drag,
        hold,
        lightAngle,
        lightDrift,
        interactive,
        gustStrength,
        gustRadius,
        clickGust,
        intro,
        introDuration,
        paused,
        quality,
        reduced: reducedMotion,
      };
      controllerRef.current?.sync();
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const initController = (root: HTMLDivElement) => {
        let renderer: THREE.WebGLRenderer;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
        root.prepend(canvas);

        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
          });
        } catch {
          canvas.remove();
          setIsSupported(false);
          return null;
        }

        if (!renderer.capabilities.isWebGL2) {
          renderer.dispose();
          canvas.remove();
          setIsSupported(false);
          return null;
        }

        renderer.setClearColor(0, 0);

        const camera = new THREE.PerspectiveCamera(30, 1, 1, 20000);
        const scene = new THREE.Scene();

        const maskCanvas = document.createElement('canvas');
        const maskTexture = new THREE.CanvasTexture(maskCanvas);
        maskTexture.flipY = false;
        maskTexture.minFilter = THREE.LinearMipmapLinearFilter;
        maskTexture.magFilter = THREE.LinearFilter;
        maskTexture.generateMipmaps = true;
        maskTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        maskTexture.colorSpace = THREE.SRGBColorSpace;

        const uniforms = {
          uMask: { value: maskTexture },
          uSilk: { value: new THREE.Vector3(0.5, 0.4, 1) },
          uSheenColor: { value: new THREE.Vector3(1, 0.4, 1) },
          uKey: { value: new THREE.Vector3(-0.4, 0.6, 0.7).normalize() },
          uFill: { value: new THREE.Vector3(0.6, -0.3, 0.7).normalize() },
          uEye: { value: new THREE.Vector3(0, 0, 1000) },
          uSheen: { value: 1 },
          uGloss: { value: 0.6 },
          uIridescence: { value: 0.5 },
          uFront: { value: 1e9 },
          uFrontWidth: { value: 100 },
          uWindDir: { value: new THREE.Vector2(1, 0) },
          uRestRect: { value: new THREE.Vector4(0, 0, 1, 1) },
          uFrontShape: { value: new THREE.Vector3(0.3, 0, 1) },
        };

        const material = new THREE.RawShaderMaterial({
          glslVersion: THREE.GLSL3,
          vertexShader,
          fragmentShader,
          uniforms,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: true,
          depthWrite: true,
          premultipliedAlpha: true,
          blending: THREE.CustomBlending,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
        });

        let geometry = new THREE.BufferGeometry();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        scene.add(mesh);

        const layoutBounds = { x0: 0, y0: 0, x1: 0, y1: 0, size: 100 };
        const cloth = {
          cols: 0,
          rows: 0,
          count: 0,
          position: new Float32Array(0),
          previous: new Float32Array(0),
          rest: new Float32Array(0),
          normal: new Float32Array(0),
          tangent: new Float32Array(0),
          first: new Uint32Array(0),
          second: new Uint32Array(0),
          length: new Float32Array(0),
          weight: new Float32Array(0),
          spacing: 8,
        };

        let posAttr: THREE.BufferAttribute | null = null;
        let normAttr: THREE.BufferAttribute | null = null;
        let tanAttr: THREE.BufferAttribute | null = null;

        const pointerTracker = { x: 0, y: 0, t: 0, placed: false };
        const raycasterVector = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const planeIntersection = new THREE.Vector3();

        let lastSignature = '';
        let viewportWidth = 1;
        let viewportHeight = 1;
        let pixelRatio = 1;
        let simulationTime = 0;
        let physicsAccumulator = 0;
        let animLightTime = 0;
        let animFrameId = 0;
        let lastTimestamp = 0;
        let isIntersecting = true;
        let isDestroyed = false;
        let isReady = false;
        let tickCounter = 0;
        let hasSettled = false;
        let lastLayoutKey = '';

        const introWave = { active: false, time: 0, lo: 0, hi: 1 };
        const loadedFonts = new Set<string>();

        const getFontString = (sizePx: number) => {
          const cfg = propsRef.current;
          const family = cfg.fontFamily || getComputedStyle(root).fontFamily;
          const weight = clamp(Math.round(Number(cfg.fontWeight) || 800), 100, 900);
          return `${weight} ${sizePx}px ${family}`;
        };

        const updateMesh = () => {
          const cfg = propsRef.current;
          const fontCheck = cfg.fontFamily || getComputedStyle(root).fontFamily;
          const sig = [
            cfg.text,
            cfg.fontFamily,
            cfg.fontWeight,
            cfg.fontSize,
            cfg.letterSpacing,
            cfg.lineHeight,
            Math.round(viewportWidth),
            Math.round(viewportHeight),
            pixelRatio.toFixed(2),
            fontCheck,
          ].join('|');

          if (sig === lastSignature) return;
          lastSignature = sig;

          const ctx = maskCanvas.getContext('2d');
          if (!ctx) return;

          const fontDesc = getFontString(16);
          if (document.fonts?.load && !loadedFonts.has(fontDesc)) {
            loadedFonts.add(fontDesc);
            document.fonts
              .load(fontDesc)
              .then((loaded) => {
                if (!isDestroyed && loaded.length) {
                  lastSignature = '';
                  if (isReady) renderFrame();
                }
              })
              .catch(() => {});
          }

          const words = cfg.text.split(/\s+/).filter(Boolean);
          const lh = clamp(cfg.lineHeight ?? 1, 0.7, 2);
          const ls = clamp(cfg.letterSpacing ?? -0.01, -0.2, 1);
          let targetFontSize = clamp(cfg.fontSize ?? 124, 12, 600);
          let wrappedLines: string[] = [];

          const measureWordWidth = (w: string) => {
            ctx.font = getFontString(targetFontSize);
            (ctx as any).letterSpacing = `${ls * targetFontSize}px`;
            return ctx.measureText(w).width;
          };

          for (let iter = 0; iter < 40; iter++) {
            wrappedLines = [];
            let currentLine = '';
            let fits = true;

            for (const word of words) {
              if (measureWordWidth(word) > 0.8 * viewportWidth) {
                fits = false;
                break;
              }
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              if (currentLine && measureWordWidth(testLine) > 0.8 * viewportWidth) {
                wrappedLines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }

            if (currentLine) wrappedLines.push(currentLine);
            if (fits && wrappedLines.length * targetFontSize * lh <= 0.66 * viewportHeight) {
              break;
            }
            targetFontSize *= 0.94;
          }

          let maxLineWidth = 0;
          wrappedLines.forEach((line) => {
            maxLineWidth = Math.max(maxLineWidth, measureWordWidth(line));
          });

          const totalTextHeight = Math.max(1, wrappedLines.length) * targetFontSize * lh;
          const pad = 0.25 * targetFontSize;

          layoutBounds.size = targetFontSize;
          layoutBounds.x0 = -maxLineWidth / 2 - pad;
          layoutBounds.x1 = maxLineWidth / 2 + pad;
          layoutBounds.y0 = -totalTextHeight / 2 - pad;
          layoutBounds.y1 = totalTextHeight / 2 + pad;

          const maskW = layoutBounds.x1 - layoutBounds.x0;
          const maskH = layoutBounds.y1 - layoutBounds.y0;
          const scaleK = Math.min(1.5 * pixelRatio, 3);

          maskCanvas.width = Math.max(1, Math.ceil(maskW * scaleK));
          maskCanvas.height = Math.max(1, Math.ceil(maskH * scaleK));

          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          ctx.setTransform(scaleK, 0, 0, scaleK, 0, 0);

          ctx.font = getFontString(targetFontSize);
          (ctx as any).letterSpacing = `${ls * targetFontSize}px`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';

          wrappedLines.forEach((line, idx) => {
            const yOffset = ((wrappedLines.length - 1) / 2 - idx) * targetFontSize * lh;
            ctx.fillText(
              line,
              -layoutBounds.x0 + (ls * targetFontSize) / 2,
              layoutBounds.y1 - yOffset
            );
          });

          maskTexture.dispose();
          maskTexture.needsUpdate = true;

          // Build simulation grid
          const margin = 0.35 * layoutBounds.size;
          const gridX0 = layoutBounds.x0 - margin;
          const gridX1 = layoutBounds.x1 + margin;
          const gridY0 = layoutBounds.y0 - margin;
          const gridY1 = layoutBounds.y1 + margin;
          const gridW = gridX1 - gridX0;
          const gridH = gridY1 - gridY0;

          let stepSize = clamp(0.075 * layoutBounds.size, 6, 16);
          while ((gridW / stepSize + 1) * (gridH / stepSize + 1) > 4200) {
            stepSize *= 1.08;
          }

          const cols = Math.max(4, Math.round(gridW / stepSize) + 1);
          const rows = Math.max(4, Math.round(gridH / stepSize) + 1);
          const totalPoints = cols * rows;
          const stepX = gridW / (cols - 1);
          const stepY = gridH / (rows - 1);

          const positions = new Float32Array(3 * totalPoints);
          const restPositions = new Float32Array(2 * totalPoints);
          const uvCoords = new Float32Array(2 * totalPoints);

          const spanX = layoutBounds.x1 - layoutBounds.x0;
          const spanY = layoutBounds.y1 - layoutBounds.y0;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const idx = r * cols + c;
              const px = gridX0 + c * stepX;
              const py = gridY1 - r * stepY;

              positions[3 * idx] = px;
              positions[3 * idx + 1] = py;
              positions[3 * idx + 2] = 0;

              restPositions[2 * idx] = px;
              restPositions[2 * idx + 1] = py;

              uvCoords[2 * idx] = (px - layoutBounds.x0) / spanX;
              uvCoords[2 * idx + 1] = (layoutBounds.y1 - py) / spanY;
            }
          }

          const edgeFirst: number[] = [];
          const edgeSecond: number[] = [];
          const edgeLength: number[] = [];
          const edgeWeight: number[] = [];

          const addConstraint = (p1: number, p2: number, weightVal: number) => {
            edgeFirst.push(p1);
            edgeSecond.push(p2);
            edgeLength.push(
              Math.hypot(
                restPositions[2 * p1] - restPositions[2 * p2],
                restPositions[2 * p1 + 1] - restPositions[2 * p2 + 1]
              )
            );
            edgeWeight.push(weightVal);
          };

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const node = r * cols + c;
              if (c + 1 < cols) addConstraint(node, node + 1, 1);
              if (r + 1 < rows) addConstraint(node, node + cols, 1);
              if (c + 1 < cols && r + 1 < rows) {
                addConstraint(node, node + cols + 1, 0.7);
                addConstraint(node + 1, node + cols, 0.7);
              }
              if (c + 2 < cols) addConstraint(node, node + 2, -1);
              if (r + 2 < rows) addConstraint(node, node + 2 * cols, -1);
            }
          }

          const indices: number[] = [];
          for (let r = 0; r < rows - 1; r++) {
            for (let c = 0; c < cols - 1; c++) {
              const n0 = r * cols + c;
              indices.push(n0, n0 + cols, n0 + 1, n0 + 1, n0 + cols, n0 + cols + 1);
            }
          }

          cloth.cols = cols;
          cloth.rows = rows;
          cloth.count = totalPoints;
          cloth.position = positions;
          cloth.previous = positions.slice();
          cloth.rest = restPositions;
          cloth.normal = new Float32Array(3 * totalPoints);
          cloth.tangent = new Float32Array(3 * totalPoints);
          cloth.first = Uint32Array.from(edgeFirst);
          cloth.second = Uint32Array.from(edgeSecond);
          cloth.length = Float32Array.from(edgeLength);
          cloth.weight = Float32Array.from(edgeWeight);
          cloth.spacing = Math.min(stepX, stepY);

          const newGeo = new THREE.BufferGeometry();
          posAttr = new THREE.BufferAttribute(positions, 3);
          posAttr.setUsage(THREE.DynamicDrawUsage);
          normAttr = new THREE.BufferAttribute(cloth.normal, 3);
          normAttr.setUsage(THREE.DynamicDrawUsage);
          tanAttr = new THREE.BufferAttribute(cloth.tangent, 3);
          tanAttr.setUsage(THREE.DynamicDrawUsage);

          newGeo.setAttribute('position', posAttr);
          newGeo.setAttribute('normal', normAttr);
          newGeo.setAttribute('aTangent', tanAttr);
          newGeo.setAttribute('uv', new THREE.BufferAttribute(uvCoords, 2));
          newGeo.setIndex(
            totalPoints > 65535
              ? new THREE.Uint32BufferAttribute(indices, 1)
              : new THREE.Uint16BufferAttribute(indices, 1)
          );

          geometry.dispose();
          geometry = newGeo;
          mesh.geometry = newGeo;

          simulationTime = 0;
          physicsAccumulator = 0;
          hasSettled = false;

          const currentLayoutKey = [
            cfg.text,
            cfg.fontFamily,
            cfg.fontWeight,
            cfg.fontSize,
            cfg.letterSpacing,
            cfg.lineHeight,
          ].join('|');

          if (currentLayoutKey !== lastLayoutKey) {
            lastLayoutKey = currentLayoutKey;
            if (cfg.intro && !cfg.reduced && !cfg.paused) {
              triggerIntro();
            }
          }
          computeNormalsAndTangents();
        };

        const getWindVector = (): [number, number] => {
          const rad = (clamp(propsRef.current.windAngle ?? 0, -180, 180) * Math.PI) / 180;
          return [Math.cos(rad), Math.sin(rad)];
        };

        const calculateFrontDistance = (
          x: number,
          y: number,
          dirX: number,
          dirY: number
        ) => {
          const perp = -x * dirY + y * dirX;
          return (
            x * dirX +
            y * dirY -
            0.3 * perp +
            0.22 * layoutBounds.size * Math.sin((perp * Math.PI * 2) / (2.4 * layoutBounds.size) + 0.7)
          );
        };

        const triggerIntro = () => {
          const [wx, wy] = getWindVector();
          const corners = [
            calculateFrontDistance(layoutBounds.x0, layoutBounds.y0, wx, wy),
            calculateFrontDistance(layoutBounds.x1, layoutBounds.y0, wx, wy),
            calculateFrontDistance(layoutBounds.x0, layoutBounds.y1, wx, wy),
            calculateFrontDistance(layoutBounds.x1, layoutBounds.y1, wx, wy),
          ];
          introWave.lo = Math.min(...corners) - 0.22 * layoutBounds.size;
          introWave.hi = Math.max(...corners) + 0.22 * layoutBounds.size;
          introWave.time = 0;
          introWave.active = true;
        };

        const getCurrentFrontPos = () => {
          if (!introWave.active) return Infinity;
          const dur = clamp(propsRef.current.introDuration ?? 1.8, 0.2, 8);
          const progress = (1 - Math.cos(Math.PI * clamp(introWave.time / dur, 0, 1))) / 2;
          const extra = 0.8 * layoutBounds.size;
          return introWave.lo - 0.4 * extra + progress * (introWave.hi - introWave.lo + 1.4 * extra);
        };

        const stepPhysics = () => {
          const cfg = propsRef.current;
          const { cols, rows, count, position, previous, rest, first, second, length, weight } = cloth;
          if (!count) return;

          simulationTime += FIXED_DELTA;
          const charSize = layoutBounds.size;
          const windRad = (clamp(cfg.windAngle ?? 0, -180, 180) * Math.PI) / 180;
          const cosWind = Math.cos(windRad);
          const sinWind = Math.sin(windRad);
          const windMag = clamp(cfg.wind ?? 1, 0, 3) * charSize * 0.0034;
          const turb = clamp(cfg.turbulence ?? 0.5, 0, 1);
          const flw = clamp(cfg.flow ?? 1, 0, 4);
          const flowPhase = simulationTime * flw;

          const fWave1 = (2 * Math.PI) / (4.2 * charSize);
          const fWave2 = (2 * Math.PI) / (2.3 * charSize);
          const fWave3 = (2 * Math.PI) / (6.5 * charSize);

          const damping = 1 - (0.012 + 0.05 * clamp(cfg.drag ?? 0.5, 0, 1));
          const springK = 0.001 + 0.006 * clamp(cfg.hold ?? 0.5, 0, 1);
          const depthK = 0.0018 + 0.009 * clamp(cfg.hold ?? 0.5, 0, 1);

          const currentFront = getCurrentFrontPos();
          const frontSpan = 0.8 * charSize;
          const frontPeak = 0.32 * charSize;

          for (let i = 0; i < count; i++) {
            const pIdx = 3 * i;
            const px = position[pIdx];
            const py = position[pIdx + 1];
            const pz = position[pIdx + 2];

            const rx = rest[2 * i];
            const ry = rest[2 * i + 1];

            const uAlong = rx * cosWind + ry * sinWind;
            const uAcross = -rx * sinWind + ry * cosWind;

            const waveZ =
              (0.62 * Math.sin(uAlong * fWave1 - 1.1 * flowPhase) +
                0.38 *
                  Math.sin(uAlong * fWave2 + uAcross * fWave2 * 0.45 - 1.7 * flowPhase + 1.3) *
                  (0.4 + turb) +
                0.3 * Math.sin(uAcross * fWave3 - 0.6 * flowPhase + 2.1) * turb) *
              windMag;

            const forceX = cosWind * windMag * 0.08;
            const forceY = sinWind * windMag * 0.08;

            const vx = (px - previous[pIdx]) * damping;
            const vy = (py - previous[pIdx + 1]) * damping;
            const vz = (pz - previous[pIdx + 2]) * damping;

            previous[pIdx] = px;
            previous[pIdx + 1] = py;
            previous[pIdx + 2] = pz;

            position[pIdx] = px + vx + forceX + (rx - px) * springK;
            position[pIdx + 1] = py + vy + forceY + (ry - py) * springK;
            position[pIdx + 2] = pz + vz + waveZ - pz * depthK;

            if (currentFront !== Infinity) {
              const distFromFront =
                (currentFront - calculateFrontDistance(rx, ry, cosWind, sinWind) - 0.55 * frontSpan) /
                (0.5 * frontSpan);
              const envelope = Math.exp(-distFromFront * distFromFront);
              if (envelope > 0.01) {
                position[pIdx + 2] += (frontPeak * envelope - position[pIdx + 2]) * 0.1 * envelope;
              }
            }
          }

          const bendFlex = 0.32 + 0.6 * (1 - clamp(cfg.softness ?? 0.6, 0, 1));
          for (let iter = 0; iter < 4; iter++) {
            for (let e = 0; e < first.length; e++) {
              const pA = 3 * first[e];
              const pB = 3 * second[e];

              const dx = position[pB] - position[pA];
              const dy = position[pB + 1] - position[pA + 1];
              const dz = position[pB + 2] - position[pA + 2];

              const currentDist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
              const stiffness = weight[e] < 0 ? bendFlex : weight[e];
              const delta = ((currentDist - length[e]) / currentDist) * 0.5 * stiffness;

              position[pA] += dx * delta;
              position[pA + 1] += dy * delta;
              position[pA + 2] += dz * delta;

              position[pB] -= dx * delta;
              position[pB + 1] -= dy * delta;
              position[pB + 2] -= dz * delta;
            }
          }
          if (cols < 2 || rows < 2) return;
        };

        const computeNormalsAndTangents = () => {
          const { cols, rows, position, normal, tangent } = cloth;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const idx = r * cols + c;
              const leftIdx = (r * cols + Math.max(0, c - 1)) * 3;
              const rightIdx = (r * cols + Math.min(cols - 1, c + 1)) * 3;
              const topIdx = (Math.max(0, r - 1) * cols + c) * 3;
              const bottomIdx = (Math.min(rows - 1, r + 1) * cols + c) * 3;

              const tanX = position[rightIdx] - position[leftIdx];
              const tanY = position[rightIdx + 1] - position[leftIdx + 1];
              const tanZ = position[rightIdx + 2] - position[leftIdx + 2];

              const bitanX = position[topIdx] - position[bottomIdx];
              const bitanY = position[topIdx + 1] - position[bottomIdx + 1];
              const bitanZ = position[topIdx + 2] - position[bottomIdx + 2];

              let normX = tanY * bitanZ - tanZ * bitanY;
              let normY = tanZ * bitanX - tanX * bitanZ;
              let normZ = tanX * bitanY - tanY * bitanX;

              const normLen = Math.hypot(normX, normY, normZ) || 1;
              normX /= normLen;
              normY /= normLen;
              normZ /= normLen;

              const tanLen = Math.hypot(tanX, tanY, tanZ) || 1;
              normal[3 * idx] = normX;
              normal[3 * idx + 1] = normY;
              normal[3 * idx + 2] = normZ;

              tangent[3 * idx] = tanX / tanLen;
              tangent[3 * idx + 1] = tanY / tanLen;
              tangent[3 * idx + 2] = tanZ / tanLen;
            }
          }
          if (posAttr) posAttr.needsUpdate = true;
          if (normAttr) normAttr.needsUpdate = true;
          if (tanAttr) tanAttr.needsUpdate = true;
        };

        const applyGustForce = (
          originX: number,
          originY: number,
          dirX: number,
          dirY: number,
          forceScale: number
        ) => {
          const cfg = propsRef.current;
          const { cols, rows, position, previous, rest } = cloth;
          if (!cloth.count) return;

          const radius = clamp(cfg.gustRadius ?? 1.2, 0.1, 3) * layoutBounds.size;
          const dirLen = Math.hypot(dirX, dirY);
          const normDirX = dirLen > 0 ? dirX / dirLen : 0;
          const normDirY = dirLen > 0 ? dirY / dirLen : 0;

          const colMin = Math.max(0, Math.floor((originX - radius - rest[0]) / cloth.spacing));
          const colMax = Math.min(cols - 1, Math.ceil((originX + radius - rest[0]) / cloth.spacing));
          const rowMin = Math.max(0, Math.floor((rest[1] - (originY + radius)) / cloth.spacing));
          const rowMax = Math.min(rows - 1, Math.ceil((rest[1] - (originY - radius)) / cloth.spacing));

          for (let r = rowMin; r <= rowMax; r++) {
            for (let c = colMin; c <= colMax; c++) {
              const idx = r * cols + c;
              const dist = Math.hypot(position[3 * idx] - originX, position[3 * idx + 1] - originY);
              if (dist > radius) continue;

              const falloff = 1 - dist / radius;
              const impulse = falloff * falloff * (3 - 2 * falloff) * forceScale;

              previous[3 * idx + 2] += impulse * layoutBounds.size * 0.022;
              previous[3 * idx] -= normDirX * impulse * layoutBounds.size * 0.004;
              previous[3 * idx + 1] -= normDirY * impulse * layoutBounds.size * 0.004;
            }
          }
        };

        const renderFrame = () => {
          if (!isReady) return;
          updateMesh();

          const cfg = propsRef.current;
          const silkColor = toLinearRGB(parseColor(cfg.colors?.[0] ?? '#7B61FF', [0.72, 0.65, 1]));
          const sheenColor = toLinearRGB(parseColor(cfg.colors?.[1] ?? '#FFC4F5', [1, 0.62, 0.99]));

          uniforms.uSilk.value.set(silkColor[0], silkColor[1], silkColor[2]);
          uniforms.uSheenColor.value.set(sheenColor[0], sheenColor[1], sheenColor[2]);
          uniforms.uSheen.value = clamp(cfg.sheen ?? 1, 0, 2);
          uniforms.uGloss.value = clamp(cfg.gloss ?? 0.6, 0, 1);
          uniforms.uIridescence.value = clamp(cfg.iridescence ?? 0.5, 0, 1);

          const lightRad =
            (clamp(cfg.lightAngle ?? -35, -180, 180) * Math.PI) / 180 +
            0.4 * Math.sin(0.27 * animLightTime) +
            0.2 * Math.sin(0.13 * animLightTime + 0.7);

          uniforms.uKey.value
            .set(0.62 * Math.sin(lightRad), 0.62 * Math.cos(lightRad), 0.72)
            .normalize();
          uniforms.uFill.value
            .set(-(0.5 * Math.sin(lightRad)), -(0.4 * Math.cos(lightRad)), 0.76)
            .normalize();

          const [wx, wy] = getWindVector();
          uniforms.uWindDir.value.set(wx, wy);
          uniforms.uFront.value = Math.min(getCurrentFrontPos(), 1e9);
          uniforms.uFrontWidth.value = 0.8 * layoutBounds.size;
          uniforms.uFrontShape.value.set(
            0.3,
            0.22 * layoutBounds.size,
            (2 * Math.PI) / (2.4 * layoutBounds.size)
          );
          uniforms.uRestRect.value.set(
            layoutBounds.x0,
            layoutBounds.y1,
            layoutBounds.x1 - layoutBounds.x0,
            layoutBounds.y1 - layoutBounds.y0
          );
          uniforms.uEye.value.copy(camera.position);

          renderer.setRenderTarget(null);
          renderer.clear();
          renderer.render(scene, camera);
        };

        const canAnimate = () => {
          const cfg = propsRef.current;
          return !cfg.reduced && !cfg.paused;
        };

        const settleMesh = () => {
          if (!hasSettled && cloth.count) {
            hasSettled = true;
            for (let i = 0; i < 150; i++) stepPhysics();
            computeNormalsAndTangents();
          }
        };

        const animationLoop = (timeNow: number) => {
          animFrameId = 0;
          if (isDestroyed) return;

          const deltaSec = Math.min(0.1, Math.max(0, (timeNow - lastTimestamp) / 1000));
          lastTimestamp = timeNow;

          if (
            ++tickCounter % 30 === 0 &&
            (Math.abs(root.clientWidth - viewportWidth) > 1 ||
              Math.abs(root.clientHeight - viewportHeight) > 1)
          ) {
            handleResize();
          }

          if (isReady) updateMesh();

          if (canAnimate()) {
            animLightTime += deltaSec * clamp(propsRef.current.lightDrift ?? 1, 0, 4);
            if (introWave.active) {
              introWave.time += deltaSec;
              if (introWave.time > clamp(propsRef.current.introDuration ?? 1.8, 0.2, 8) + 0.3) {
                introWave.active = false;
              }
            }

            physicsAccumulator += deltaSec;
            let subSteps = 0;
            while (physicsAccumulator >= FIXED_DELTA && subSteps < 4) {
              stepPhysics();
              physicsAccumulator -= FIXED_DELTA;
              subSteps++;
            }
            if (subSteps === 4) physicsAccumulator = 0;
            if (subSteps > 0) computeNormalsAndTangents();
          } else {
            settleMesh();
          }

          renderFrame();

          if (isIntersecting && !document.hidden && canAnimate()) {
            animFrameId = requestAnimationFrame(animationLoop);
          }
        };

        function startLoop() {
          if (!isDestroyed && !animFrameId && isIntersecting) {
            lastTimestamp = performance.now();
            animFrameId = requestAnimationFrame(animationLoop);
          }
        }

        function handleResize() {
          const rect = root.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) {
            isReady = false;
            return;
          }
          isReady = true;
          viewportWidth = rect.width;
          viewportHeight = rect.height;
          pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * clamp(propsRef.current.quality ?? 1, 0.25, 1);

          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(viewportWidth, viewportHeight, false);

          camera.fov = 30;
          camera.aspect = viewportWidth / viewportHeight;
          camera.position.set(0, 0, viewportHeight / 2 / Math.tan((camera.fov * Math.PI) / 360));
          camera.near = 0.05 * camera.position.z;
          camera.far = 4 * camera.position.z;
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();

          renderFrame();
          startLoop();
        }

        const projectPointer = (clientX: number, clientY: number): [number, number] | null => {
          const rect = root.getBoundingClientRect();
          raycasterVector.set(
            ((clientX - rect.left) / rect.width) * 2 - 1,
            -(((clientY - rect.top) / rect.height) * 2 - 1)
          );
          raycaster.setFromCamera(raycasterVector, camera);
          return raycaster.ray.intersectPlane(raycastPlane, planeIntersection)
            ? [planeIntersection.x, planeIntersection.y]
            : null;
        };

        const onPointerMove = (e: PointerEvent) => {
          const cfg = propsRef.current;
          const pos = projectPointer(e.clientX, e.clientY);
          if (!pos) return;

          const now = performance.now();
          if (cfg.interactive && canAnimate() && pointerTracker.placed && now - pointerTracker.t < 120) {
            const dt = Math.max((now - pointerTracker.t) / 1000, 1 / 240);
            const dx = (pos[0] - pointerTracker.x) / dt;
            const dy = (pos[1] - pointerTracker.y) / dt;
            const speed = Math.hypot(dx, dy);
            const force =
              clamp(cfg.gustStrength ?? 1, 0, 3) *
              Math.min(1, speed / 2200) *
              Math.min(1, 60 * dt) *
              0.7;

            if (force > 0.002) {
              applyGustForce(pos[0], pos[1], dx, dy, force);
              startLoop();
            }
          }

          pointerTracker.x = pos[0];
          pointerTracker.y = pos[1];
          pointerTracker.t = now;
          pointerTracker.placed = true;
        };

        const onPointerDown = (e: PointerEvent) => {
          const cfg = propsRef.current;
          if (
            !cfg.interactive ||
            !cfg.clickGust ||
            !canAnimate() ||
            (e.pointerType === 'mouse' && e.button !== 0)
          ) {
            return;
          }

          const pos = projectPointer(e.clientX, e.clientY);
          if (pos) {
            applyGustForce(pos[0], pos[1], 0, 0, 0.8 * clamp(cfg.gustStrength ?? 1, 0, 3));
            startLoop();
          }
        };

        const onPointerLeave = () => {
          pointerTracker.placed = false;
        };

        root.addEventListener('pointermove', onPointerMove);
        root.addEventListener('pointerdown', onPointerDown);
        root.addEventListener('pointerleave', onPointerLeave);

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(root);

        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            isIntersecting = entries.some((entry) => entry.isIntersecting);
            if (isIntersecting) startLoop();
          },
          { rootMargin: '80px' }
        );
        intersectionObserver.observe(root);

        const onVisibilityChange = () => {
          if (!document.hidden) startLoop();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        if (document.fonts?.ready) {
          document.fonts.ready
            .then(() => {
              if (!isDestroyed) {
                lastSignature = '';
                if (isReady) renderFrame();
              }
            })
            .catch(() => {});
        }

        const onContextLost = (e: Event) => e.preventDefault();
        canvas.addEventListener('webglcontextlost', onContextLost);

        handleResize();

        return {
          sync: () => {
            const targetRatio =
              Math.min(window.devicePixelRatio || 1, 2) *
              clamp(propsRef.current.quality ?? 1, 0.25, 1);

            if (!isReady || Math.abs(targetRatio - pixelRatio) > 0.001) {
              handleResize();
            } else {
              if (!canAnimate()) {
                introWave.active = false;
                updateMesh();
                settleMesh();
              }
              renderFrame();
            }
            startLoop();
          },
          destroy: () => {
            isDestroyed = true;
            cancelAnimationFrame(animFrameId);
            root.removeEventListener('pointermove', onPointerMove);
            root.removeEventListener('pointerdown', onPointerDown);
            root.removeEventListener('pointerleave', onPointerLeave);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            canvas.removeEventListener('webglcontextlost', onContextLost);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            maskTexture.dispose();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
          },
          replay: () => {
            if (canAnimate() && isReady) {
              updateMesh();
              triggerIntro();
              startLoop();
            }
          },
          gust: (fracX = 0.5, fracY = 0.5, strength = 1) => {
            if (canAnimate() && isReady) {
              updateMesh();
              applyGustForce(
                layoutBounds.x0 + clamp(fracX, 0, 1) * (layoutBounds.x1 - layoutBounds.x0),
                layoutBounds.y1 - clamp(fracY, 0, 1) * (layoutBounds.y1 - layoutBounds.y0),
                0,
                0,
                1.6 * clamp(strength, 0, 3)
              );
              startLoop();
            }
          },
        };
      };

      const controller = initController(container);
      controllerRef.current = controller;

      return () => {
        controller?.destroy();
        controllerRef.current = null;
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        gust: (x = 0.5, y = 0.5, strength = 1) =>
          controllerRef.current?.gust(x, y, strength),
        replay: () => controllerRef.current?.replay(),
      }),
      []
    );

    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={text}
        className={cn(
          'relative isolate h-full min-h-[140px] w-full overflow-hidden select-none',
          className
        )}
        style={{ touchAction: 'pan-y', ...style }}
      >
        <span className="sr-only">{text}</span>
        {!isSupported && (
          <div className="w-full h-full flex items-center justify-start">
            <span
              className="font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#C87A54] via-[#F5F2EB] to-[#FFFFFF]"
              style={{
                fontSize:
                  typeof fontSize === 'number'
                    ? `clamp(2rem, 5vw, ${fontSize}px)`
                    : '3rem',
                fontFamily: fontFamily || '"Space Grotesk", sans-serif',
              }}
            >
              {text}
            </span>
          </div>
        )}
        {children && (
          <div className="relative z-10 h-full w-full pointer-events-none">
            {children}
          </div>
        )}
      </div>
    );
  }
);

MeshLettering.displayName = 'MeshLettering';
export default MeshLettering;
