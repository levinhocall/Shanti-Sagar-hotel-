import { ArrowUpRight, ChatCircle } from '@phosphor-icons/react';
import { MAP_SEARCH, RESTAURANT_INFO } from '../data/restaurantData';

export function ReviewsAndRatings() {
  return (
    <section id="reviews" className="section shell reviews-section" tabIndex={-1} aria-labelledby="review-heading">
      <div><p className="eyebrow"><ChatCircle size={18} aria-hidden /> Guest reviews</p><h2 id="review-heading">See what guests say.</h2></div>
      <div className="review-links">
        <a className="text-link" href={RESTAURANT_INFO.zomato + '/reviews'} target="_blank" rel="noreferrer">Reviews on Zomato <ArrowUpRight size={18} aria-hidden /></a>
        <a className="text-link" href={MAP_SEARCH} target="_blank" rel="noreferrer">Find the listing on Google Maps <ArrowUpRight size={18} aria-hidden /></a>
      </div>
    </section>
  );
}
