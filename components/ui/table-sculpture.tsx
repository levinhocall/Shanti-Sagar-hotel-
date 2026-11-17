import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei/core/OrbitControls.js'
import { Group, Vector2 } from 'three'
import { useEffect, useMemo, useRef } from 'react'

function Porcelain({ active, reduced, compact }: { active: boolean; reduced: boolean; compact: boolean }) {
  const group = useRef<Group>(null)
  const time = useRef(0)
  const profile = useMemo(() => [[0, .01], [.3, .01], [.7, .03], [1.05, .09], [1.22, .16], [1.3, .2], [1.32, .23], [1.3, .25], [1.22, .23], [1.05, .17], [.7, .1], [.3, .08], [0, .08]].map(point => new Vector2(...point as [number, number])), [])
  useFrame((state, delta) => {
    if (!group.current || !active || reduced) return
    time.current += Math.min(delta, .05)
    group.current.position.y = Math.sin(time.current * .65) * .045
    group.current.rotation.z += ((state.pointer.x * .035) - group.current.rotation.z) * .025
  })
  const segments = compact ? 48 : 80
  return <group ref={group} rotation={[.16, 0, 0]}>
    {[0, 1, 2].map(index => <group key={index} position={[index * .035, index * .145, 0]} scale={1 - index * .13}>
      <mesh castShadow receiveShadow><latheGeometry args={[profile, segments]}/><meshPhysicalMaterial color="#e6dfca" roughness={.3} metalness={.12} clearcoat={.6}/></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, .238, 0]}><torusGeometry args={[1.3, .014, 8, segments]}/><meshStandardMaterial color="#c5a15d" metalness={.5} roughness={.27}/></mesh>
    </group>)}
    <group position={[0, .75, 0]} rotation={[.25, .35, .15]}>
      <mesh castShadow><torusKnotGeometry args={[.39, .055, compact ? 64 : 100, 10, 2, 3]}/><meshStandardMaterial color="#cbb47e" metalness={.55} roughness={.24}/></mesh>
      <mesh><sphereGeometry args={[.15, 24, 16]}/><meshPhysicalMaterial color="#48262f" roughness={.2} metalness={.12} clearcoat={1}/></mesh>
    </group>
    {[-1, 1].map(side => <mesh castShadow key={side} position={[side * .75, .67, side * .3]} rotation={[.1, 0, side * .7]} scale={[.12, .025, .35]}><sphereGeometry args={[1, 24, 12]}/><meshStandardMaterial color="#5e7a4b" roughness={.5}/></mesh>)}
  </group>
}
function SceneReadiness({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const sent = useRef(false)
  const { gl, invalidate, setDpr } = useThree()
  const initialDpr = useThree(state => state.viewport.initialDpr)
  const quality = useThree(state => state.performance.current)
  useEffect(() => {
    setDpr(Math.max(1, Math.min(1.5, initialDpr * quality)))
  }, [setDpr, initialDpr, quality])
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure() }
    gl.domElement.addEventListener('webglcontextlost', lost)
    invalidate()
    return () => gl.domElement.removeEventListener('webglcontextlost', lost)
  }, [gl, invalidate, onFailure])
  useFrame(() => {
    if (!sent.current && gl.info.render.triangles > 100) {
      sent.current = true
      onReady()
    }
  })
  return null
}
export default function TableSculpture({ active, reduced, compact, onFailure, onReady }: { active: boolean; reduced: boolean; compact: boolean; onFailure: () => void; onReady: () => void }) {
  return <Canvas shadows dpr={[1, compact ? 1 : 1.5]} performance={{ min: .65 }} frameloop={active && !reduced ? 'always' : 'demand'} camera={{ position: [0, 2.8, 4.8], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} role="img" aria-label="Interactive sculptural porcelain plates with gold knot and decorative leaves. Drag to rotate.">
    <ambientLight intensity={1.2}/><hemisphereLight args={['#e7e7ce', '#1c3020', 1]}/>
    <spotLight position={[3, 5, 4]} intensity={65} angle={.5} penumbra={1} color="#ffe5b5" castShadow shadow-mapSize-width={compact ? 512 : 1024} shadow-mapSize-height={compact ? 512 : 1024} shadow-bias={-.0003}/>
    <directionalLight position={[-4, 2, -2]} intensity={2.5} color="#a3bca3"/>
    <Porcelain active={active} reduced={reduced} compact={compact}/>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.14, 0]} receiveShadow><planeGeometry args={[10, 10]}/><shadowMaterial transparent opacity={.3}/></mesh>
    <OrbitControls enableZoom={false} enablePan={false} regress autoRotate={active && !reduced} autoRotateSpeed={.4} minPolarAngle={.35} maxPolarAngle={Math.PI / 2.2}/>
    <SceneReadiness onReady={onReady} onFailure={onFailure}/>
  </Canvas>
}
