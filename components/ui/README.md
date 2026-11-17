# Original components

Root `components/ui/` is aliased as `@/components/ui` in both TypeScript and Vite,
and configured in `components.json`. The incomplete original third-party hero
was replaced at the user’s direction. No missing source is required.

- `hero.tsx`: cinematic opening, layered photo composition and pointer response.
- `restaurant-sections.tsx`: preserved sections, menu filters/carousel and gallery.
- `explorer-dialog.tsx`: native dialogs, shared image geometry, detail tabs and lightbox.
- `table-experience.tsx`: opt-in loading, error boundary and CSS still-life fallback.
- `table-sculpture.tsx`: independently authored 3D porcelain composition.
- `motion-elements.tsx`: section reveals and magnetic links.
- `food-image.tsx`: responsive local images and accessible error state.

Shared data and destination configuration: `src/data.ts`.
URL-driven detail state and return position/focus: `src/hooks/use-explorer.ts`.
Global design and responsive styles: `src/index.css`.
