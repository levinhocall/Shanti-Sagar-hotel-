import { MotionConfig, LayoutGroup } from 'motion/react';
import { Navigation } from './components/Navigation';
import { CinematicHero } from './components/CinematicHero';
import { RestaurantStory } from './components/RestaurantStory';
import { TableExperience } from './components/TableExperience';
import { FoodCinematicScroll } from './components/FoodCinematicScroll';
import { FoodExplorer } from './components/FoodExplorer';
import { DiningFacilities } from './components/DiningFacilities';
import { GalleryLightbox } from './components/GalleryLightbox';
import { ReviewsAndRatings } from './components/ReviewsAndRatings';
import { LocationAndContact } from './components/LocationAndContact';
import { Footer } from './components/Footer';
import { ExplorerDialog } from './components/ExplorerDialog';
import { PuppetExperience } from './components/puppet/PuppetExperience';
import { useExplorer } from './hooks/use-explorer';

export default function App() {
  const explorer = useExplorer();
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: .5, ease: [.22, 1, .36, 1] }}>
      <LayoutGroup id="shanti-sagar">
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="concept-banner">Unofficial website concept</div>
        <Navigation />
        <main id="main" tabIndex={-1} data-design-version="cinematic-v4">
          <CinematicHero />
          <FoodCinematicScroll />
          <FoodExplorer open={explorer.open} />
          <TableExperience />
          <RestaurantStory />
          <DiningFacilities />
          <GalleryLightbox open={explorer.open} />
          <ReviewsAndRatings />
          <LocationAndContact />
        </main>
        <Footer />
        <PuppetExperience />
        <ExplorerDialog panel={explorer.panel} onClose={explorer.close} onChange={explorer.change} onExit={explorer.restore} />
      </LayoutGroup>
    </MotionConfig>
  );
}
