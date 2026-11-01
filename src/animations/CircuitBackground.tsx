import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './gsapSetup';

export const CircuitBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const reducedMotion = prefersReducedMotion();

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Schematic nodes and traces
    interface Trace {
      points: { x: number; y: number }[];
      color: string;
      speed: number;
      pulsePos: number;
      pulseLength: number;
      label?: string;
    }

    interface NodePad {
      x: number;
      y: number;
      radius: number;
      label?: string;
      filled: boolean;
    }

    let traces: Trace[] = [];
    let nodes: NodePad[] = [];

    const generateSchematic = () => {
      traces = [];
      nodes = [];

      const gridY = Math.max(30, Math.floor(height / 12));

      // Define circuit bus lines
      const busY = [
        gridY * 2,
        gridY * 4,
        gridY * 6,
        gridY * 8,
        gridY * 10
      ];

      const labels = ['CLK_0', 'ESP_SDA', 'ESP_SCL', 'UART_TX', 'PWM_1'];

      busY.forEach((by, idx) => {
        const startX = width * 0.15 + (idx % 2) * 50;
        const endX = width * 0.95;

        // Trace with angled 45 degree bends
        const bend1X = startX + 120 + idx * 40;
        const bend1Y = by + (idx % 2 === 0 ? 30 : -30);
        const bend2X = bend1X + 40;

        const points = [
          { x: startX, y: by },
          { x: bend1X, y: by },
          { x: bend2X, y: bend1Y },
          { x: endX, y: bend1Y },
        ];

        traces.push({
          points,
          color: idx % 2 === 0 ? 'rgba(184, 110, 70, 0.22)' : 'rgba(135, 149, 138, 0.18)',
          speed: 0.4 + (idx * 0.15),
          pulsePos: (idx * 0.2) % 1,
          pulseLength: 0.15,
          label: labels[idx],
        });

        // Add pad terminals
        nodes.push({
          x: startX,
          y: by,
          radius: 3,
          label: labels[idx],
          filled: true,
        });

        nodes.push({
          x: endX,
          y: bend1Y,
          radius: 2.5,
          filled: false,
        });

        // Middle via
        nodes.push({
          x: bend2X,
          y: bend1Y,
          radius: 2,
          filled: true,
        });
      });
    };

    generateSchematic();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle engineering dot grid in background
      const dotSpacing = 36;
      ctx.fillStyle = 'rgba(135, 149, 138, 0.05)';
      for (let x = 20; x < width; x += dotSpacing) {
        for (let y = 20; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw traces
      traces.forEach((trace) => {
        ctx.beginPath();
        ctx.strokeStyle = trace.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);

        trace.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw small technical label near start
        if (trace.label && trace.points[0]) {
          ctx.fillStyle = 'rgba(135, 149, 138, 0.4)';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText(trace.label, trace.points[0].x - 48, trace.points[0].y + 3);
        }

        // Draw pulse traveling along trace if not reduced motion
        if (!reducedMotion) {
          trace.pulsePos = (trace.pulsePos + 0.003 * trace.speed) % 1;

          // Compute pulse coordinates along line segments
          const totalPoints = trace.points.length;
          const segmentIndex = Math.min(
            Math.floor(trace.pulsePos * (totalPoints - 1)),
            totalPoints - 2
          );
          const p1 = trace.points[segmentIndex];
          const p2 = trace.points[segmentIndex + 1];

          if (p1 && p2) {
            const segFraction = (trace.pulsePos * (totalPoints - 1)) - segmentIndex;
            const curX = p1.x + (p2.x - p1.x) * segFraction;
            const curY = p1.y + (p2.y - p1.y) * segFraction;

            ctx.beginPath();
            ctx.arc(curX, curY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#D7DCE2';
            ctx.fill();
          }
        }
      });

      // Draw node pads / vias
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (node.filled) {
          ctx.fillStyle = '#08090B';
          ctx.fill();
          ctx.strokeStyle = 'rgba(215, 220, 226, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(146, 153, 163, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full opacity-60 ${className}`}
    />
  );
};
