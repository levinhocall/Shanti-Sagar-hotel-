import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Pose } from './puppet-rig';
import './puppet.css';

const Stage = lazy(() => import('./PuppetStage'));

class PuppetBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function PuppetFallback({ reason }: { reason: string }) {
  return <div className="puppet-fallback" data-puppet-mode="fallback">
    <img src="/images/mascot/idle.webp" alt="" width="52" height="52" />
    <span>{reason}</span>
  </div>;
}

export function PuppetPreview() {
  const reduced = useReducedMotion();
  const diagnostics = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [tableActive, setTableActive] = useState(false);
  const [capable, setCapable] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);
  const record = useCallback((pose: Pose, contact?: number) => {
    const node = diagnostics.current;
    if (!node) return;
    if (node.dataset.phase !== pose.phase) node.dataset.phase = pose.phase;
    if (pose.direction && node.dataset.direction !== pose.direction) node.dataset.direction = pose.direction;
    if (contact !== undefined) node.dataset.contactError = contact.toFixed(2);
  }, []);

  useEffect(() => {
    if (reduced) return;
    if (!window.WebGL2RenderingContext || !window.IntersectionObserver || !window.ResizeObserver) { onFailure(); return; }
    try {
      const context = document.createElement('canvas').getContext('webgl2', { powerPreference: 'low-power' });
      if (!context || context.isContextLost()) { onFailure(); return; }
      context.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { onFailure(); return; }
    const stage = document.querySelector('.sculpture-stage');
    function sync() { setTableActive(Boolean(stage?.querySelector('.scene-host'))); }
    sync();
    const observer = new MutationObserver(sync);
    if (stage) observer.observe(stage, { childList: true });
    setCapable(true);
    return () => observer.disconnect();
  }, [onFailure, reduced]);

  if (reduced) return <PuppetFallback reason="Static preview · reduced motion" />;
  if (failed) return <PuppetFallback reason="Static preview · 3D unavailable" />;
  if (tableActive) return <PuppetFallback reason="Static preview · dining table active" />;
  return <div ref={diagnostics} className="puppet-calibration" data-puppet-mode="rig-test">
    <span className="puppet-calibration-label">Puppet rig test · unskinned</span>
    {capable && <div className="puppet-canvas" aria-hidden="true">
      <PuppetBoundary onFailure={onFailure}>
        <Suspense fallback={null}><Stage invalidateStatus={record} onFailure={onFailure} /></Suspense>
      </PuppetBoundary>
    </div>}
  </div>;
}

export function isLocalPuppetRigTest() {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  return local && new URLSearchParams(window.location.search).get('puppet') === 'rig-test';
}
