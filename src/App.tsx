import React from 'react';
import { Navigation } from './components/Navigation';
import { CinematicHero } from './components/CinematicHero';
import { RestaurantStory } from './components/RestaurantStory';
import { TableExperience } from './components/TableExperience';
import { FoodExplorer } from './components/FoodExplorer';
import { DiningFacilities } from './components/DiningFacilities';
import { GalleryLightbox } from './components/GalleryLightbox';
import { ReviewsAndRatings } from './components/ReviewsAndRatings';
import { LocationAndContact } from './components/LocationAndContact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080D0B] text-[#FFF7E8] font-sans selection:bg-[#D6B56E] selection:text-[#080D0B]">
      {/* Sticky Glass Navigation */}
      <Navigation />

      {/* Main Exhibition Flow */}
      <main id="main" data-design-version="cinematic-v3">
        {/* Scene 1: Arrival & Hero */}
        <CinematicHero />

        {/* Scene 2: Restaurant Story & Ethos */}
        <RestaurantStory />

        {/* Scene 3: Interactive Table Sculpture */}
        <TableExperience />

        {/* Scene 4: Flagship Food Product Explorer */}
        <FoodExplorer />

        {/* Scene 5: Dining Sanctuary & Facilities */}
        <DiningFacilities />

        {/* Scene 6: Visual Journal & Masonry Lightbox */}
        <GalleryLightbox />

        {/* Scene 7: Verified Ratings & Testimonials */}
        <ReviewsAndRatings />

        {/* Scene 8: Location, Map & Contact CTAs */}
        <LocationAndContact />
      </main>

      {/* Elegant Footer Conclusion */}
      <Footer />
    </div>
  );
};

export default App;
