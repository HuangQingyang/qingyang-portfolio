import { Component, Suspense, useEffect, useRef, useState } from 'react';

class EffectBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// Keep the layout and fallback background; load GPU modules near their section.
export default function DeferredEffect({ children, className }) {
  const root = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '240px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={className} aria-hidden="true">
    {ready && <EffectBoundary><Suspense fallback={null}>{children}</Suspense></EffectBoundary>}
  </div>;
}
