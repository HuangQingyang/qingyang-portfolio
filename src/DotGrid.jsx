import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import './DotGrid.css';
gsap.registerPlugin(InertiaPlugin, useGSAP);

const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

// React Bits DotGrid: same proximity colors, inertia and click shockwave;
// redraw on demand, scope input to its section and dispose every dot tween.
export default function DotGrid({ dotSize = 4, gap = 24, baseColor = '#31544b', activeColor = '#76d6c4', proximity = 130, speedTrigger = 100, shockRadius = 220, shockStrength = 5, maxSpeed = 5000, resistance = 750, returnDuration = 1.5 }) {
  const root = useRef(null);
  const canvas = useRef(null);
  useGSAP((context, contextSafe) => {
    const element = canvas.current;
    const section = root.current.closest('section');
    const ctx = element.getContext('2d');
    if (!ctx || !section) return;
    const base = rgb(baseColor), active = rgb(activeColor);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let dots = [], width = 1, height = 1, dpr = 1, frame = 0, visible = false, disposed = false;
    const pointer = { x: -9999, y: -9999, time: 0, clientX: 0, clientY: 0 };
    const circle = new Path2D(); circle.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    const draw = () => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const dist = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
        const amount = Math.max(0, 1 - dist / proximity);
        ctx.fillStyle = amount ? `rgb(${base.map((v,i) => Math.round(v + (active[i] - v) * amount)).join(',')})` : baseColor;
        ctx.setTransform(dpr, 0, 0, dpr, (dot.cx + dot.xOffset) * dpr, (dot.cy + dot.yOffset) * dpr);
        ctx.fill(circle);
      }
    };
    const requestDraw = () => { if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(draw); };
    const reset = () => { gsap.killTweensOf(dots); for (const dot of dots) { dot.xOffset = dot.yOffset = 0; dot.busy = false; } };
    const build = () => {
      reset();
      width = root.current.clientWidth; height = root.current.clientHeight;
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      const cell = dotSize + gap;
      const cols = Math.floor((width + gap) / cell), rows = Math.floor((height + gap) / cell);
      const startX = (width - (cell * cols - gap)) / 2 + dotSize / 2;
      const startY = (height - (cell * rows - gap)) / 2 + dotSize / 2;
      dots = Array.from({ length: rows * cols }, (_, i) => ({ cx: startX + (i % cols) * cell, cy: startY + Math.floor(i / cols) * cell, xOffset: 0, yOffset: 0, busy: false }));
      requestDraw();
    };
    const kick = contextSafe((dot, x, y) => {
      if (dot.busy) return;
      dot.busy = true;
      gsap.to(dot, { inertia: { xOffset: x, yOffset: y, resistance }, onUpdate: requestDraw, onComplete: contextSafe(() => {
        gsap.to(dot, { xOffset: 0, yOffset: 0, duration: returnDuration, ease: 'elastic.out(1,0.75)', onUpdate: requestDraw, onComplete: () => { dot.busy = false; } });
      }) });
    });
    const move = event => {
      if (!visible || document.hidden || reduced.matches) return;
      const now = performance.now(), dt = now - pointer.time;
      if (dt < 40) return;
      const rect = element.getBoundingClientRect();
      const first = !pointer.time;
      let vx = first ? 0 : (event.clientX - pointer.clientX) * 1000 / dt;
      let vy = first ? 0 : (event.clientY - pointer.clientY) * 1000 / dt;
      const speed = Math.hypot(vx, vy), scale = Math.min(1, maxSpeed / Math.max(speed, 1));
      vx *= scale; vy *= scale;
      Object.assign(pointer, { x: event.clientX - rect.left, y: event.clientY - rect.top, time: now, clientX: event.clientX, clientY: event.clientY });
      if (speed > speedTrigger) for (const dot of dots) {
        if (Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y) < proximity) kick(dot, dot.cx - pointer.x + vx * .005, dot.cy - pointer.y + vy * .005);
      }
      requestDraw();
    };
    const click = event => {
      if (!visible || document.hidden || reduced.matches) return;
      const rect = element.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
      for (const dot of dots) {
        const dist = Math.hypot(dot.cx - x, dot.cy - y);
        if (dist < shockRadius) { const strength = shockStrength * (1 - dist / shockRadius); kick(dot, (dot.cx - x) * strength, (dot.cy - y) * strength); }
      }
    };
    const leave = () => { pointer.x = pointer.y = -9999; pointer.time = 0; requestDraw(); };
    const sync = () => {
      if (!visible || document.hidden || reduced.matches) { reset(); leave(); cancelAnimationFrame(frame); frame = 0; }
      requestDraw();
    };
    const resize = new ResizeObserver(build); resize.observe(root.current);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }); observer.observe(root.current);
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    section.addEventListener('click', click);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    build();
    return () => {
      disposed = true; reset(); cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', leave); section.removeEventListener('click', click);
      document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync);
    };
  }, { scope: root, dependencies: [dotSize, gap, baseColor, activeColor, proximity, speedTrigger, shockRadius, shockStrength, maxSpeed, resistance, returnDuration], revertOnUpdate: true });
  return <div className="dot-grid" ref={root}><canvas ref={canvas} className="dot-grid__canvas" /></div>;
}
