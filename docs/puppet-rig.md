# Puppet rig verification

The public site shows the supplied character's 2.5D portraits in the Food Explorer. Grid cards can trigger a portrait reaction after a short dwell. Public links with the old rig-test query show the same character. The repository has no character mesh, skin, rigged GLB, or face morphs matching that character. The rendering test uses an unskinned technical rig with articulated Three.js bones and an index endpoint. It is separate from the public illustrated host.

From a local development or preview server, open `/?puppet=rig-test` to inspect entrance timing, scene travel, pointing, visible dish contact, two-hand presentation on hover or keyboard focus, and pointing toward Get directions. Scroll until a menu card is visible and pause to run the contact sequence. The test display shows a static smile when reduced motion is enabled, WebGL fails, or the visitor turns on the separate 3D dining table.

The director reads card bounds in viewport pixels and computes a bounded bend-plane IK pose. Before a dish pulse, the renderer projects the positioned index bone endpoint through its camera, then checks it against the current card rectangle. Contact is decorative and uses a standalone Web Animations transform. It never dispatches a click. Scrolling, dialogs, and unmounting cancel active effects. The scene uses demand rendering and the asset-free homepage does not load its WebGL chunk.

## Production asset handoff

Supply an original or appropriately licensed GLB with this same character's custom hair, skin, shirt and proportions. Include one compatible hierarchy with a neutral rest pose, arm joints aligned with their child joints, and forearm twist and shoulder deformation tested under load. The test rig currently works in a planar bend space. A skinned asset needs local quaternion and bind-pose calibration, fingertip offsets, joint limits, collision volumes, and facial keys tuned to the actual artwork.

Run `node scripts/validate-puppet-glb.mjs /path/to/character.glb` to check the asset's named skinned joints, arm/finger parent chains, and eight facial target names. The script reports the exact names it expects. This structural check cannot verify deformation, character identity, licence, or visual quality.

After binding the asset, validate neutral and matching facial poses, grip occlusion against the hero, eye intent, fingers curling around a real edge, both-hand presentation, and contact on physical Android and iOS devices. The test rig provides timing and alignment evidence for the skeleton only.
