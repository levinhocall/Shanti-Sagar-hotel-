import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls, Environment, Lightformer } from '@react-three/drei'
import { Vector2 } from 'three'
import { Suspense, useMemo } from 'react'

function Porcelain() {
  const profile = useMemo(() => [[0, .01], [.3, .01], [.7, .03], [1.05, .09], [1.22, .16], [1.3, .2], [1.32, .23], [1.3, .25], [1.22, .23], [1.05, .17], [.7, .1], [.3, .08], [0, .08]].map(point => new Vector2(...point as [number, number])), [])
  return <group rotation={[.2, 0, .08]}>
    {[0, 1].map(index => <group key={index} position={[index ? .12 : 0, index * .19, 0]} scale={index ? .85 : 1}><mesh castShadow receiveShadow><latheGeometry args={[profile, 80]}/><meshPhysicalMaterial color="#ede4ce" roughness={.27} metalness={.08} clearcoat={.7}/></mesh><mesh rotation={[Math.PI / 2, 0, 0]} position={[0, .238, 0]}><torusGeometry args={[1.3, .014, 12, 96]}/><meshStandardMaterial color="#c5a15d" metalness={.75} roughness={.25}/></mesh></group>)}
    <group position={[0, .48, 0]} rotation={[.25, .35, .15]}>
      <mesh><torusKnotGeometry args={[.44, .065, 100, 12, 2, 3]}/><meshStandardMaterial color="#cbb47e" metalness={.75} roughness={.28}/></mesh>
      <mesh position={[0, .02, 0]}><sphereGeometry args={[.18, 32, 24]}/><meshPhysicalMaterial color="#48262f" roughness={.22} metalness={.15} clearcoat={1}/></mesh>
    </group>
    {[-1, 1].map(side => <mesh key={side} position={[side * .8, .5, side * .3]} rotation={[0, 0, side * .6]} scale={[.17, .035, .42]}><sphereGeometry args={[1, 24, 16]}/><meshStandardMaterial color="#526b45" roughness={.5}/></mesh>)}
  </group>
}
export default function TableSculpture({ active, reduced, onFailure }: { active: boolean; reduced: boolean; onFailure: () => void }) {
  return <Canvas dpr={[1, 1.5]} frameloop={active && !reduced ? 'always' : 'demand'} camera={{ position: [0, 2.8, 4.6], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); onFailure() }, { once: true }) }} role="img" aria-label="Interactive sculptural porcelain plates with gold knot and decorative leaves. Drag to rotate.">
    <ambientLight intensity={.7}/><directionalLight position={[4, 5, 3]} intensity={3} color="#fff0cf"/><directionalLight position={[-4, 2, -2]} intensity={1.4} color="#b8cbbb"/>
    <Suspense fallback={null}><Environment resolution={64}><Lightformer intensity={3} position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 5, 1]}/><Lightformer intensity={2} position={[3, 1, 2]} scale={[2, 4, 1]}/></Environment><Porcelain/><ContactShadows position={[0, -.1, 0]} opacity={.25} blur={2.8} scale={7} far={4} frames={1} resolution={128}/></Suspense>
    <OrbitControls enableZoom={false} enablePan={false} autoRotate={active && !reduced} autoRotateSpeed={.45} minPolarAngle={.4} maxPolarAngle={Math.PI / 2.2}/>
  </Canvas>
}
