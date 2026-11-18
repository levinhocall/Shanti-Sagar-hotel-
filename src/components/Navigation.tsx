import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Plant } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';

const links = [
  ['Food stories', 'food-stories'], ['Menu', 'menu'], ['3D table', 'experience'], ['Our story', 'story'],
  ['Gallery', 'gallery'], ['Reviews', 'reviews'], ['Visit', 'location'],
];

export function Navigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setCurrent(visible.target.id);
    }, { rootMargin: '-16% 0px -66% 0px' });
    links.forEach(([, id]) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1000px)');
    const closeOnDesktop = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <header className="site-header shell">
      <a className="brand" href="#home">
        <span className="brand-mark"><Plant size={23} aria-hidden /></span>
        <span>Shanti Sagar <small>Pure Veg</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation" data-mascot-reaction="curious">
        {links.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined}>{label}</a>)}
      </nav>
      <a className="button button-small header-visit" href="#location" data-mascot-reaction="approval">Plan a visit <ArrowUpRight size={16} aria-hidden /></a>
      <div className="header-mascot-slot" id="header-mascot-slot" />
      <button data-mascot-reaction="curious" className="icon-button mobile-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-menu"
        onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
        <span className="menu-glyph" aria-hidden><i /><i /></span>
      </button>
      <dialog id="mobile-menu" className="menu-dialog" ref={dialog} aria-label="Navigation menu" onClose={() => setOpen(false)}>
        <div className="menu-dialog-head">
          <span>Shanti Sagar Pure Veg</span>
          <button autoFocus className="icon-button" aria-label="Close navigation" onClick={() => dialog.current?.close()}><span className="menu-glyph close-glyph" aria-hidden><i /><i /></span></button>
        </div>
        {open && <nav aria-label="Mobile navigation">
          {links.map(([label, id], index) => <motion.a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined}
            initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : .24, delay: reduced ? 0 : index * .03 }}
            onClick={() => { dialog.current?.close(); document.getElementById(id)?.focus({ preventScroll: true }); }}>
            {label}<ArrowUpRight size={22} aria-hidden />
          </motion.a>)}
        </nav>}
      </dialog>
    </header>
  );
}
