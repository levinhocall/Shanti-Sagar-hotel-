import { ArrowUp, Plant } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <a className="brand" href="#home"><span className="brand-mark"><Plant size={23} aria-hidden /></span><span>Shanti Sagar<small>Pure Veg</small></span></a>
          <nav aria-label="Footer navigation"><a href="#menu">Sample menu</a><a href="#gallery">Gallery</a><a href="#location">Visit & contact</a></nav>
          <a className="text-link" href="#home">Back to top <ArrowUp size={18} aria-hidden /></a>
        </div>
        <p className="footer-note">Independent website concept. Sample dishes, AI concept imagery and stock photos are illustrative. Contact details link to public listings.</p>
      </div>
    </footer>
  );
}
