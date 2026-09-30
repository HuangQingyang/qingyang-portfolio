import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';

export function ProjectCard({ project, index, onOpen, language }) {
  const root = useRef(null);
  useGSAP((context, contextSafe) => {
    const button = root.current.querySelector('button');
    const shell = root.current.querySelector('.glass-project');
    const back = root.current.querySelector('.icon-btn__back');
    const front = root.current.querySelector('.icon-btn__front');
    const label = root.current.querySelector('.project-open');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const xTo = gsap.quickTo(shell, 'x', { duration: .45, ease: 'power3.out' });
    const yTo = gsap.quickTo(shell, 'y', { duration: .45, ease: 'power3.out' });
    const tilt = gsap.quickTo(shell, 'rotation', { duration: .5, ease: 'power3.out' });
    let timer;
    let hovered = false;
    const enter = contextSafe(() => {
      hovered = true;
      gsap.to(back, { x: reduce ? 0 : -10, y: reduce ? 0 : -14, rotation: reduce ? 10 : 18, duration: .5, ease: 'power3.out', overwrite: true });
      gsap.to(front, { z: reduce ? 0 : 32, duration: .5, ease: 'power3.out', overwrite: true });
      clearTimeout(timer);
      timer = setTimeout(contextSafe(() => {
        if (root.current?.closest('.circular-item')?.dataset.active === 'true') gsap.to(label, { autoAlpha: 1, y: 0, duration: reduce ? 0 : .3 });
      }), 2000);
    });
    const leave = contextSafe(() => {
      hovered = false;
      clearTimeout(timer);
      gsap.to(back, { x: 0, y: 0, rotation: 10, duration: reduce ? 0 : .5, overwrite: true });
      gsap.to(front, { z: 0, duration: reduce ? 0 : .5, overwrite: true });
      xTo(0); yTo(0); tilt(0);
      gsap.to(label, { autoAlpha: 0, y: 5, duration: .15 });
    });
    const move = (event) => {
      if (!fine || reduce) return;
      const rect = button.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - .5;
      const dy = (event.clientY - rect.top) / rect.height - .5;
      xTo(dx * 20); yTo(dy * 16 - 8); tilt(dx * 3);
    };
    const scroll = () => { if (hovered) leave(); };
    button.addEventListener('pointerenter', enter);
    button.addEventListener('pointerleave', leave);
    button.addEventListener('pointermove', move);
    button.addEventListener('focus', enter);
    button.addEventListener('blur', leave);
    window.addEventListener('scroll', scroll, { passive: true });
    const stage = root.current.closest('.circular-viewport');
    stage?.addEventListener('gallerydrag', leave);
    return () => {
      clearTimeout(timer);
      button.removeEventListener('pointerenter', enter);
      button.removeEventListener('pointerleave', leave);
      button.removeEventListener('pointermove', move);
      button.removeEventListener('focus', enter);
      button.removeEventListener('blur', leave);
      window.removeEventListener('scroll', scroll);
      stage?.removeEventListener('gallerydrag', leave);
    };
  }, { scope: root });
  return <article className="project-card" ref={root}>
    <button type="button" className="project-trigger" onClick={() => onOpen(index)} aria-haspopup="dialog" aria-label={`${language === 'zh' ? '打开项目' : 'Open project'}: ${project.title}`}>
      <div className="glass-project" style={{ '--glass-color': ['#61846f', '#667daf', '#997849', '#805783', '#3d8b85', '#a76052'][index % 6] }}>
        <span className="icon-btn__back" aria-hidden="true" />
        <div className="icon-btn__front">
          <span className="glass-poster"><img src={project.image} alt="" loading="lazy" draggable="false" /></span>
          <span className="glass-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="project-open" aria-hidden="true">OPEN</span>
          <div className="project-info"><span>{project.year}</span><h3>{project.title}</h3><p className="project-role">{project.role}</p></div>
        </div>
      </div>
    </button>
  </article>;
}

export function ProjectDialog({ project, language, onClose }) {
  const dialog = useRef(null);
  const video = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      video.current?.pause();
      document.body.style.overflow = overflow;
      element.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from(dialog.current, { autoAlpha: 0, y: 24, scale: .97, duration: .45, ease: 'power3.out' });
    gsap.from(dialog.current.querySelectorAll('.project-details > *'), { opacity: 0, y: 15, stagger: .07, duration: .5, delay: .12 });
  }, { scope: dialog });
  const zh = language === 'zh';
  return createPortal(<dialog ref={dialog} className="project-dialog" lang={zh ? 'zh-CN' : 'en'} aria-labelledby="project-dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}>
    <button className="dialog-close" onClick={onClose} autoFocus aria-label={zh ? '关闭项目' : 'Close project'}><X size={22} /></button>
    <div className="project-viewer">
      {project.video && !failed ? <video ref={video} controls playsInline preload="metadata" poster={project.image} onError={() => setFailed(true)} aria-label={project.title}><source src={project.video} type="video/mp4" /></video> : <img className="project-poster" src={project.image} alt={zh ? `${project.title}海报` : `${project.title} poster`} />}
      {failed && <p className="video-error">{zh ? '视频暂时无法播放，请稍后重试。' : 'The video could not be loaded. Please try again.'}</p>}
    </div>
    <div className="project-details">
      <p className="section-label">{zh ? '精选项目' : 'SELECTED WORK'}</p>
      <h2 id="project-dialog-title">{project.title}</h2>
      <dl><div><dt>{zh ? '岗位' : 'ROLE'}</dt><dd>{project.role}</dd></div>{project.year && <div><dt>{zh ? '年份' : 'YEAR'}</dt><dd>{project.year}</dd></div>}</dl>
      <p className="project-description">{project.description}</p>
      {!project.video && <p className="poster-note">{zh ? '项目海报' : 'PROJECT POSTER'}</p>}
    </div>
  </dialog>, document.body);
}
