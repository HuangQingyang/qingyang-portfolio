import { useEffect, useRef, useState } from 'react';

export default function HeroReel({ language }) {
  const video = useRef(null);
  const actions = useRef({});
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const element = video.current;
    let visible = true, disposed = false, frame = 0, stallTimer;
    const cancelFrame = () => {
      if (frame && element.cancelVideoFrameCallback) element.cancelVideoFrameCallback(frame);
      frame = 0;
    };
    const showFrame = () => {
      clearTimeout(stallTimer);
      cancelFrame();
      const reveal = () => {
        frame = 0;
        if (!disposed && element.readyState >= 2) { setReady(true); setBlocked(false); }
      };
      if (element.requestVideoFrameCallback) frame = element.requestVideoFrameCallback(reveal);
      else if (element.readyState >= 2) reveal();
    };
    const play = () => {
      if (!visible || document.hidden || disposed) return;
      element.muted = true;
      element.play().then(showFrame).catch(error => {
        if (!disposed && error.name !== 'AbortError') { setBlocked(true); setReady(false); }
      });
    };
    const waiting = () => {
      clearTimeout(stallTimer);
      // Retain the decoded frame for brief buffering; only show the poster for a long stall.
      stallTimer = setTimeout(() => { if (!disposed && element.readyState < 3) setReady(false); }, 700);
    };
    const failed = () => { setReady(false); setBlocked(true); };
    const sync = () => {
      if (visible && !document.hidden) play();
      else { clearTimeout(stallTimer); cancelFrame(); element.pause(); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .01 });
    observer.observe(element);
    element.addEventListener('playing', showFrame);
    element.addEventListener('waiting', waiting);
    element.addEventListener('stalled', waiting);
    element.addEventListener('error', failed);
    document.addEventListener('visibilitychange', sync);
    actions.current.retry = () => { if (element.error) element.load(); play(); };
    play();
    return () => {
      disposed = true; clearTimeout(stallTimer); cancelFrame(); observer.disconnect();
      element.pause();
      element.removeEventListener('playing', showFrame);
      element.removeEventListener('waiting', waiting);
      element.removeEventListener('stalled', waiting);
      element.removeEventListener('error', failed);
      document.removeEventListener('visibilitychange', sync);
      actions.current = {};
    };
  }, []);
  return <>
    <img className="hero-reel-poster" src="./assets/reel-home-poster.jpg" alt="" fetchPriority="high" decoding="sync" aria-hidden="true" />
    <video ref={video} className={`hero-reel${ready ? ' is-ready' : ''}`} muted loop playsInline autoPlay preload="auto" poster="./assets/reel-home-poster.jpg" src="./assets/reel-home-v3.mp4" aria-hidden="true" />
    {blocked && <button className="reel-retry" type="button" onClick={() => actions.current.retry?.()}>{language === 'zh' ? '播放背景视频' : 'PLAY BACKGROUND REEL'}</button>}
  </>;
}
