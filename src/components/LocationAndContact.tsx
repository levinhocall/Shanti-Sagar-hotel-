import { useState } from 'react';
import { ArrowUpRight, MapPin, Phone, NavigationArrow } from '@phosphor-icons/react';
import { DIRECTIONS, MAP_QUERY, RESTAURANT_INFO } from '../data/restaurantData';

export function LocationAndContact() {
  const [showMap, setShowMap] = useState(false);
  return (
    <section id="location" className="section visit-section" tabIndex={-1} aria-labelledby="visit-heading">
      <div className="shell">
        <div className="section-heading"><div><p className="eyebrow">Visit & contact</p><h2 id="visit-heading">Find us in Ulhasnagar.</h2></div></div>
        <div className="visit-grid">
          <div className="visit-details">
            <h3>{RESTAURANT_INFO.name}</h3>
            <address>{RESTAURANT_INFO.address}</address>
            <div className="visit-actions">
              <a className="button button-primary" href={DIRECTIONS} target="_blank" rel="noreferrer"><NavigationArrow size={19} aria-hidden /> Get directions</a>
              <a className="button" href={`tel:${RESTAURANT_INFO.phone}`}><Phone size={18} aria-hidden /> Call {RESTAURANT_INFO.phoneLabel}</a>
            </div>
            <div className="listing-links">
              <a className="text-link" href={RESTAURANT_INFO.district} target="_blank" rel="noreferrer">Check hours on District <ArrowUpRight size={16} aria-hidden /></a>
              <a className="text-link" href={RESTAURANT_INFO.orderUrl} target="_blank" rel="noreferrer">Order on Zomato <ArrowUpRight size={16} aria-hidden /></a>
            </div>
            <p className="visit-source">Address and phone are from public listings. Check opening hours before visiting.</p>
          </div>
          <div className="map-stage">
            {showMap ? <iframe title="Google Maps search for Shanti Sagar Pure Veg in Ulhasnagar"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`} referrerPolicy="no-referrer" allowFullScreen /> :
              <div className="map-preview">
                <MapPin size={44} weight="duotone" aria-hidden />
                <p>Maharishi Complex, Camp Road</p>
                <button className="button" onClick={() => setShowMap(true)}>Load Google Maps</button>
              </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
