# Shanti Sagar V4 concept art

Images used by the V4 site are AI-generated concept imagery. They illustrate general vegetarian dishes and were not photographed at the restaurant. Check the current menu with the restaurant before publishing a dish as an official offering.

| Art direction | Published assets under `public/images/v4` | Website use |
| --- | --- | --- |
| Royal Paneer | `paneer-wide.webp` (1600 × 900), `paneer-960.webp` (960 × 540), `paneer-mobile.webp` (540 × 960), `paneer-card.webp` (480 × 600) | Desktop and portrait hero, explorer, poster |
| Grand Thali | `thali-960.webp`, `thali-600.webp` | Story poster, explorer and 3D fallback |
| Golden Dosa | `dosa-960.webp`, `dosa-600.webp` | Story poster and explorer |
| North Indian feast | `feast-960.webp`, `feast-600.webp` | Gallery |
| Paneer scroll loop source | `paneer-frames/001.webp` through `016.webp` (960 × 540) | Exposure reveal, selective spotlight and camera push layered from a single still |
| Dining model materials | `table-paneer.webp`, `table-dal.webp`, `table-rice.webp`, `table-naan.webp` (256 × 256) | Crops of an AI-generated food texture atlas applied to 3D serving geometry |

## Still-image prompts

Use realistic high-end food editorial photography. Leave branding and typography to the page. Stage all dishes on an emerald-black set with champagne-gold side or rim light, realistic highlights, shadows, and shallow depth of field where appropriate.

- **Royal Paneer.** Hammered copper bowl full of glossy orange-red paneer gravy, with ivory paneer and a thin arc of sauce suspended above the opening. Add naan, cream, coriander and small spice accents. Place the bowl in the right half of the 16:9 composition, with enough margin to crop a portrait around the dish.
- **Grand Thali.** Top-down photograph with the entire circular brass tray visible. Arrange vivid bowls of dal, chutney, and vegetable dishes around rice. Use subtle steam and a matte green surface.
- **Golden Dosa.** Low angle across the crisp, blistered shell. Place potato filling in view and add three small bowls of sambar and chutneys in the midground. Light from the side to resolve texture on the golden crepe.
- **North Indian feast.** Layer serving bowls, rice, naan and vegetarian accompaniments on a dark dining table at a low three-quarter angle. Keep a gentle foreground-to-background light falloff.
- **Model atlas.** A strict overhead 2×2 macro texture sheet, fully filled quadrants and no dishware or borders. Paneer curry at top left, dal at top right, rice at bottom left, blistered naan at bottom right. Use diffuse lighting to avoid baked specular highlights.

## Video shot specifications for a future render

Keep exact plate placement and ingredient continuity between shots. Use 5–6 seconds per shot, 24 fps, no artificial deformation. For web video, render H.264 MP4 and WebM with a WebP poster, muted inline playback, and no autoplay for users with reduced motion. For scroll playback, export at most 120 WebP frames per sequence. Number them `001.webp` onward at a consistent resolution and configure `frameSequence` in `src/data/foodStories.ts`. Use 960 × 540 where a landscape composition supplies sufficient mobile crop room. Add a separate portrait poster. Use an isolated alpha cutout only for separately filmed ingredients that need independent composition.

| Sequence | Shot direction |
| --- | --- |
| Paneer | Begin on an unlit emerald stage. Bring up a warm soft-edged spot, swirl one fine ribbon of sauce inward, then bring in paneer and coriander with a controlled shutter. Reveal the copper bowl from shadow as the pieces settle. End with a slow push toward the glossy dish. |
| Thali | Start with an empty tabletop at three-quarter height. Move a polished tray in first, then reveal individual bowls and rice in timed succession. Rise smoothly to directly overhead and hold on the full arrangement. |
| Dosa | Open on warm spill across a dark tabletop. Slide in a crisp dosa and stage sambar and chutneys one by one. Add subtle steam and a short lateral move over the textured shell. Settle on a composed three-quarter view. |

The published implementation uses the 16-frame paneer reveal and scroll-linked 2.5D views for thali and dosa. The full ingredient-assembly videos and alpha cutout are future assets.
