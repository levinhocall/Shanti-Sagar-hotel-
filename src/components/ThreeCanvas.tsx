import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'motion/react';
import { Color, Object3D, Vector2 } from 'three';
import type { InstancedMesh } from 'three';
import { LIGHTS } from '../data/table';
import type { Hotspot, LightMode } from '../data/table';

const bowl = [[0, 0], [.33, 0], [.38, .06], [.43, .16], [.45, .25], [.44, .27], [.415, .25], [.385, .14], [.32, .06], [0, .06]]
  .map(([x, y]) => new Vector2(x, y));
const brass = '#cca264';
const rotation = -Math.PI / 2;
const bowls = [
  { id: 'paneer', position: [-.65, 0, -.57], color: '#ac4621' },
  { id: 'dal', position: [.50, 0, -.63], color: '#c98823' },
  { id: 'rice', position: [.83, 0, .35], color: '#e7d4a1' },
] as const;

type Props = {
  angle: number; light: LightMode; hotspot: Hotspot;
  onSelect: (value: Hotspot) => void; onReady: () => void; onFailure: () => void;
};

function Grains({ kind }: { kind: Hotspot }) {
  const meshes = useRef<InstancedMesh>(null);
  const invalidate = useThree(state => state.invalidate);
  const count = kind === 'rice' ? 112 : kind === 'dal' ? 24 : 12;

  useEffect(() => {
    const mesh = meshes.current;
    if (!mesh) return;
    const grain = new Object3D();
    for (let i = 0; i < count; i++) {
      const angle = i * 2.39996;
      const radius = .34 * Math.sqrt((i + .5) / count);
      const y = kind === 'rice' ? .23 + .135 * (1 - radius / .36) : .235;
      grain.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      grain.rotation.set(i * 1.17, i * 1.42, i * .77);
      grain.scale.setScalar(.76 + (i % 6) * .065);
      grain.updateMatrix();
      mesh.setMatrixAt(i, grain.matrix);
      mesh.setColorAt(i, new Color(kind === 'rice' ? (i % 9 === 0 ? '#e4ac55' : '#f4e8cc') :
        kind === 'dal' ? (i % 2 ? '#644118' : '#60703b') : (i % 4 ? '#e2a367' : '#f0c891')));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    invalidate();
  }, [count, kind, invalidate]);

  return (
    <instancedMesh ref={meshes} args={[undefined, undefined, count]}>
      {kind === 'paneer' ? <boxGeometry args={[.106, .087, .098]} /> :
        <sphereGeometry args={[1, 7, 5]} onUpdate={geometry => geometry.scale(kind === 'rice' ? .019 : .015, .011, kind === 'rice' ? .055 : .024)} />}
      <meshStandardMaterial roughness={.69} />
    </instancedMesh>
  );
}

function Readiness({ onReady, onFailure }: Pick<Props, 'onReady' | 'onFailure'>) {
  const gl = useThree(state => state.gl);
  const sent = useRef(false);
  const frame = useRef(0);
  useFrame(() => {
    if (sent.current) return;
    sent.current = true;
    frame.current = requestAnimationFrame(() => {
      if (gl.getContext().isContextLost()) onFailure();
      else if (gl.info.render.triangles > 0) onReady();
      else onFailure();
    });
  });
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      cancelAnimationFrame(frame.current);
      gl.domElement.removeEventListener('webglcontextlost', lost);
    };
  }, [gl, onFailure]);
  return null;
}

export default function ThreeCanvas({ angle, light, hotspot, onSelect, onFailure, onReady }: Props) {
  const [rotationOffset, setRotationOffset] = useState(0);
  const dragging = useRef(false);
  const lightStyle = LIGHTS[light];

  return (
    <motion.div className="scene-interaction" onPanStart={() => { dragging.current = true; }}
      onPan={(_, info) => setRotationOffset(value => value + info.delta.x * .013)}
      onPanEnd={() => { requestAnimationFrame(() => { dragging.current = false; }); }}>
      <Canvas camera={{ position: [0, 3.7, 3.9], fov: 46 }} frameloop="demand" dpr={[1, 1.4]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={null}
        aria-label="Interactive 3D vegetarian thali. Drag to rotate or use the rotation buttons.">
        <hemisphereLight args={[lightStyle.fill, '#3f2419', 1.55]} />
        <directionalLight position={[2, 5, 3]} color={lightStyle.color} intensity={lightStyle.intensity} />
        <directionalLight position={[-3, 1, -4]} color="#d3b589" intensity={1.35} />
        <group rotation={[0, angle + rotationOffset, 0]}>
          <mesh position={[0, -.14, 0]}><cylinderGeometry args={[1.55, 1.49, .14, 64]} /><meshStandardMaterial color={brass} metalness={.56} roughness={.33} /></mesh>
          {[1.49, 1.54].map(radius => <mesh key={radius} rotation={[rotation, 0, 0]} position={[0, -.056, 0]}>
            <torusGeometry args={[radius, .024, 8, 64]} /><meshStandardMaterial color="#e9bc77" metalness={.56} roughness={.29} />
          </mesh>)}
          {bowls.map(({ id, position, color }) => (
            <group position={[...position]} key={id} onClick={event => { event.stopPropagation(); if (!dragging.current) onSelect(id); }}>
              <mesh><latheGeometry args={[bowl, 40]} /><meshStandardMaterial color={brass} metalness={.55} roughness={.34} /></mesh>
              <mesh position={[0, .204, 0]} scale={[1, .16, 1]}><sphereGeometry args={[.391, 32, 14]} /><meshStandardMaterial color={color} roughness={.63} /></mesh>
              <Grains kind={id} />
              <mesh rotation={[rotation, 0, 0]} position={[0, .268, 0]}>
                <torusGeometry args={[.446, .015, 7, 40]} />
                <meshStandardMaterial color={hotspot === id ? '#fff0b2' : '#cca264'} emissive={hotspot === id ? '#916519' : '#000000'} emissiveIntensity={.4} metalness={.4} roughness={.31} />
              </mesh>
            </group>
          ))}
          {[0, 1, 2].map(i => <mesh key={i} position={[-.62 + i * .082, i * .032, .55]} rotation={[.04, 0, i * .12]} scale={[.54, .056, .38]}>
            <sphereGeometry args={[1, 30, 12]} /><meshStandardMaterial color={i % 2 ? '#b57940' : '#d9a360'} roughness={.9} />
          </mesh>)}
          {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-.91 + (i % 5) * .109, .091 + (i % 2) * .012, .38 + Math.floor(i / 5) * .109]}
            rotation={[0, i, 0]} scale={[.03 + (i % 3) * .012, .008, .018]}>
            <sphereGeometry args={[1, 8, 5]} /><meshStandardMaterial color={i % 3 === 0 ? '#604224' : '#995d33'} roughness={.92} />
          </mesh>)}
          {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[.09 + Math.cos(i * 1.7) * .13, .015 + i * .003, .81 + Math.sin(i * 1.7) * .14]}
            rotation={[0, i, 0]} scale={[.13, .024, .052]}>
            <sphereGeometry args={[1, 12, 6]} /><meshStandardMaterial color={i % 2 ? '#526132' : '#718545'} />
          </mesh>)}
        </group>
        <Readiness onReady={onReady} onFailure={onFailure} />
      </Canvas>
    </motion.div>
  );
}
