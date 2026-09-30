import { useEffect, useRef } from 'react';
import './StarBorder.css';

// React Bits StarBorder: preserve semantic content instead of adding button behavior.
export default function StarBorder({ as: Tag = 'div', className = '', color = '#76d6c4', speed = '6s', thickness = 1, backgroundColor = '#121817', textColor = '#f3f0e8', borderColor = '#ffffff24', children, style, ...rest }) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    let visible = false;
    const update = () => { element.style.setProperty('--star-play', visible && !document.hidden ? 'running' : 'paused'); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <Tag ref={root} {...rest} className={`star-border-container ${className}`} style={{ '--star-color': color, '--star-speed': speed, '--star-thickness': `${thickness}px`, ...style }}>
    <div className="border-gradient-bottom" aria-hidden="true" />
    <div className="border-gradient-top" aria-hidden="true" />
    <div className="inner-content" style={{ background: backgroundColor, color: textColor, borderColor }}>{children}</div>
  </Tag>;
}
