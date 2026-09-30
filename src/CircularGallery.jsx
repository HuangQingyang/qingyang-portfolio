import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProjectCard } from './ProjectGallery';
import './CircularGallery.css';

// Adapted from the supplied React Bits CircularGallery: circular arc geometry,
// wrapped positions and eased, snapped scrolling. DOM layers replace OGL planes
// so GlassIcons can retain real backdrop blur, native buttons and accessible focus.
export default function CircularGallery({ items, language, onOpen, bend = 72 }) {
  const root = useRef(null);
  const viewport = useRef(null);
  const controls = useRef({});
  const [active, setActive] = useState(0);
  const zh = language === 'zh';

  useGSAP((context, contextSafe) => {
    const stage = viewport.current;
    const cards = [...stage.querySelectorAll('.circular-item')];
    const buttons = cards.map(card => card.querySelector('.project-trigger'));
    const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const position = { value: 0 };
    let target = 0, width = 1, spacing = 1, tween, snapTimer, drag = null;
    let suppressClick = false, selected = -1;
    const wrap = value => ((value % items.length) + items.length) % items.length;
    const render = () => {
      const next = wrap(Math.round(position.value));
      if (next !== selected) { selected = next; setActive(next); }
      const half = width / 2;
      const radius = (half * half + bend * bend) / (2 * bend);
      cards.forEach((card, i) => {
        const offset = wrap(i - position.value + items.length / 2) - items.length / 2;
        const x = offset * spacing;
        const distance = Math.abs(offset);
        const arcX = Math.min(Math.abs(x), half);
        const y = radius - Math.sqrt(Math.max(0, radius * radius - arcX * arcX));
        const angle = Math.sign(x) * Math.asin(arcX / radius) * 180 / Math.PI;
        gsap.set(card, {
          x, y: reduceQuery.matches ? 0 : y,
          rotation: reduceQuery.matches ? 0 : angle,
          scale: 1 - Math.min(distance, 2) * .09,
          opacity: Math.max(.18, 1 - Math.min(distance, 1.5) * .62),
          zIndex: Math.round(100 - distance * 10),
        });
        const visible = Math.abs(x) < half + spacing * .55;
        card.style.visibility = visible ? 'inherit' : 'hidden';
        card.dataset.active = String(i === next);
        buttons[i].tabIndex = i === next ? 0 : -1;
        buttons[i].setAttribute('aria-label', `${i === next ? (zh ? '打开项目' : 'Open project') : (zh ? '移至中央' : 'Center project')}: ${items[i].title}`);
        if (i === next) buttons[i].setAttribute('aria-current', 'true');
        else buttons[i].removeAttribute('aria-current');
      });
    };
    const go = contextSafe((value, immediate = false) => {
      target = value;
      tween?.kill();
      tween = gsap.to(position, { value, duration: reduceQuery.matches || immediate ? 0 : .65, ease: 'power3.out', onUpdate: render });
    });
    const snap = () => go(Math.round(target));
    const resize = () => {
      width = stage.clientWidth;
      spacing = cards[0].offsetWidth + (width < 700 ? 35 : 74);
      render();
    };
    controls.current = {
      step: delta => go(Math.round(target) + delta),
      select: index => {
        if (suppressClick) return;
        const nearest = wrap(index - position.value + items.length / 2) - items.length / 2;
        if (Math.abs(nearest) < .12) onOpen(index);
        else go(Math.round(position.value + nearest));
      },
      home: () => go(0),
    };
    const down = event => {
      if (event.button !== 0 || !event.isPrimary) return;
      tween?.kill();
      clearTimeout(snapTimer);
      suppressClick = false;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, value: position.value, moved: false };
    };
    const move = event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { drag = null; return; }
      if (Math.abs(dx) > 7) {
        if (!drag.moved) {
          stage.setPointerCapture(event.pointerId);
          stage.dispatchEvent(new Event('gallerydrag'));
        }
        drag.moved = true;
        suppressClick = true;
        stage.classList.add('is-dragging');
        go(drag.value - dx / spacing, true);
      }
    };
    const up = event => {
      if (!drag || event.pointerId !== drag.id) return;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      const moved = drag.moved;
      drag = null;
      stage.classList.remove('is-dragging');
      if (moved) snap();
    };
    const wheel = event => {
      // Vertical scrolling must still navigate the portfolio, especially on touch.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) && !event.shiftKey) return;
      event.preventDefault();
      const delta = (event.deltaX || event.deltaY) * (event.deltaMode === 1 ? 16 : 1);
      go(target + Math.max(-1, Math.min(1, delta / spacing)));
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 160);
    };
    const click = event => { if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; } };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    reduceQuery.addEventListener('change', render);
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('click', click, true);
    stage.addEventListener('wheel', wheel, { passive: false });
    resize();
    return () => {
      tween?.kill(); clearTimeout(snapTimer); observer.disconnect();
      reduceQuery.removeEventListener('change', render);
      stage.removeEventListener('pointerdown', down);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerup', up);
      stage.removeEventListener('pointercancel', up);
      stage.removeEventListener('click', click, true);
      stage.removeEventListener('wheel', wheel);
      controls.current = {};
    };
  }, { scope: root, dependencies: [items, language, bend, onOpen], revertOnUpdate: true });

  return <div className="circular-gallery" ref={root} role="region" aria-roledescription={zh ? '轮播画廊' : 'carousel'} aria-label={zh ? '精选项目' : 'Selected work'} onKeyDown={event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); controls.current.step?.(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home') { event.preventDefault(); controls.current.home?.(); }
  }}>
    <div className="circular-viewport" ref={viewport}>
      {items.map((project, index) => <div className="circular-item" key={index}>
        <ProjectCard project={project} index={index} language={language} onOpen={index => controls.current.select?.(index)} />
      </div>)}
    </div>
    <div className="gallery-controls">
      <p className="gallery-hint">{zh ? '左右拖动探索 · 点击中央项目打开' : 'DRAG TO EXPLORE · CLICK CENTER TO OPEN'}</p>
      <div className="gallery-navigation">
        <button type="button" onClick={() => controls.current.step?.(-1)} aria-label={zh ? '上一个项目' : 'Previous project'}><ArrowLeft size={20} /></button>
        <span className="gallery-counter" aria-live="polite" aria-atomic="true"><b>{String(active + 1).padStart(2, '0')}</b><span> / {String(items.length).padStart(2, '0')}</span><span className="gallery-sr"> {items[active].title}</span></span>
        <button type="button" onClick={() => controls.current.step?.(1)} aria-label={zh ? '下一个项目' : 'Next project'}><ArrowRight size={20} /></button>
      </div>
    </div>
  </div>;
}
