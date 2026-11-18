import { BowlFood, Plant, UsersThree } from '@phosphor-icons/react';

const features = [
  { icon: Plant, title: 'Pure vegetarian', text: 'Shanti Sagar Pure Veg is listed as a vegetarian restaurant in Ulhasnagar.' },
  { icon: BowlFood, title: 'South and North Indian', text: 'The public listing includes South Indian, North Indian, biryani and more.' },
  { icon: UsersThree, title: 'Dining enquiries', text: 'Call the listed number to ask about seating, group visits and dietary needs before you go.' },
];

export function DiningFacilities() {
  return (
    <section className="section shell dining-facilities" aria-labelledby="dining-heading">
      <div className="section-heading"><h2 id="dining-heading">Dining at Shanti Sagar</h2></div>
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={29} aria-hidden /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}
