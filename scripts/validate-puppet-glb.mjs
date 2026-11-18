import { readFile } from 'node:fs/promises';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node scripts/validate-puppet-glb.mjs path/to/character.glb');
  process.exit(2);
}

const bytes = await readFile(path);
if (bytes.length < 20 || bytes.toString('ascii', 0, 4) !== 'glTF' ||
  bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) {
  throw new Error('Expected a complete glTF 2.0 binary container.');
}
const length = bytes.readUInt32LE(12);
if (bytes.toString('ascii', 16, 20) !== 'JSON' || 20 + length > bytes.length) {
  throw new Error('Expected a valid GLB JSON chunk.');
}
const asset = JSON.parse(bytes.toString('utf8', 20, 20 + length));
const byName = new Map((asset.nodes ?? []).map((node, index) => [node.name, index]));
const joints = new Set((asset.skins ?? []).flatMap(skin => skin.joints ?? []));
const expected = ['Spine', 'Neck', 'Head', 'Hair', 'Eye_L', 'Eye_R', 'Brow_L', 'Brow_R', 'Jaw'];
const chains = [['Spine', 'Neck', 'Head']];
for (const side of ['L', 'R']) {
  const arm = ['Shoulder', 'UpperArm', 'Forearm', 'Wrist', 'Palm'].map(name => `${name}_${side}`);
  expected.push(...arm);
  chains.push(arm);
  for (const finger of ['Thumb', 'Index', 'Middle', 'Ring', 'Little']) {
    const bones = [1, 2, 3].map(segment => `${finger}${segment}_${side}`);
    expected.push(...bones);
    chains.push([arm.at(-1), ...bones]);
  }
}

const morphNames = new Set((asset.meshes ?? []).flatMap(mesh =>
  mesh.primitives?.some(primitive => primitive.targets?.length) ? mesh.extras?.targetNames ?? [] : [],
));
const missing = expected.filter(name => !joints.has(byName.get(name)));
const morphs = ['Smile', 'Surprise', 'Blink', 'Curious', 'Happy', 'MouthOpen', 'MouthClosed', 'Wink']
  .filter(name => !morphNames.has(name));
const broken = chains.flatMap(chain => chain.slice(1).flatMap((name, index) => {
  const parentName = chain[index];
  if (!byName.has(parentName) || !byName.has(name)) return [];
  return asset.nodes[byName.get(parentName)]?.children?.includes(byName.get(name)) ? [] : [`${parentName} → ${name}`];
}));
const valid = missing.length === 0 && morphs.length === 0 && broken.length === 0;
console.log(JSON.stringify({ asset: path, valid, sizeBytes: bytes.length, missingSkinnedJoints: missing, missingMorphs: morphs, brokenChains: broken }, null, 2));
if (!valid) process.exitCode = 1;
