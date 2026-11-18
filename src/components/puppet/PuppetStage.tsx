import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Bone, Group } from 'three';
import { startPuppetDirector } from './puppet-director';
import { ARM_LENGTHS, distance, shoulderOf, solveArm, viewportToWorld } from './puppet-rig';
import type { Gesture, Point, Pose, Side } from './puppet-rig';

type FrameRef = RefObject<Pose | null>;
const GOLD = '#e8be78';
const FINGER_LENGTHS = [8, 6, 5] as const;

function Rod({ length, radius = 2 }: { length: number; radius?: number }) {
  return <mesh position-y={length / 2}>
    <cylinderGeometry args={[radius * .73, radius, length, 8]} />
    <meshStandardMaterial color={GOLD} metalness={.37} roughness={.39} />
  </mesh>;
}

function Pin({ radius = 4 }: { radius?: number }) {
  return <mesh>
    <sphereGeometry args={[radius, 12, 8]} />
    <meshStandardMaterial color="#fff0c1" metalness={.18} roughness={.34} />
  </mesh>;
}

function Finger({ number, x, y, thumb = false }: { number: number; x: number; y: number; thumb?: boolean }) {
  const [proximal, middle, distal] = thumb ? [7, 5, 4] : FINGER_LENGTHS;
  return <bone name={`finger-${number}-0`} position={[x, y, 0]}>
    <Rod length={proximal} radius={1.25} />
    <bone name={`finger-${number}-1`} position-y={proximal}>
      <Rod length={middle} radius={1.1} />
      <bone name={`finger-${number}-2`} position-y={middle}>
        <Rod length={distal} radius={1} />
        <mesh name={number === 0 ? 'index-tip' : undefined} position-y={distal}>
          <sphereGeometry args={[1.8, 8, 6]} />
          <meshStandardMaterial color={number === 0 ? '#e6ffdf' : GOLD} emissive={number === 0 ? '#68b883' : '#523d22'} />
        </mesh>
      </bone>
    </bone>
  </bone>;
}

function applyFingerPose(wrist: Bone, grip: Gesture) {
  for (let finger = 0; finger < 5; finger++) {
    for (let joint = 0; joint < 3; joint++) {
      const bone = wrist.getObjectByName(`finger-${finger}-${joint}`);
      if (!bone) continue;
      const extended = (grip === 'point' && finger === 0) || (grip === 'thumb' && finger === 4) || grip === 'wave';
      bone.rotation.x = extended ? 0 : (grip === 'grip' ? .76 : grip === 'present' ? .26 : .55) * (joint === 0 ? .58 : 1);
      bone.rotation.z = finger === 4 && joint === 0 ? -.65 : 0;
    }
  }
}

function applyArm(upper: Bone, pose: Pose, side: Side, size: { width: number; height: number }) {
  const forearm = upper.getObjectByName('forearm') as Bone;
  const wrist = upper.getObjectByName('wrist') as Bone;
  if (!forearm || !wrist) return;
  upper.visible = !pose.hidden;
  const solved = solveArm(shoulderOf(pose, side), side === 1 ? pose.right : pose.left, side, pose.scale);
  const shoulder = viewportToWorld(solved.shoulder, size);
  const worldAngle = (from: Point, to: Point) => Math.atan2(from.y - to.y, to.x - from.x) - Math.PI / 2;
  const first = worldAngle(solved.shoulder, solved.elbow);
  const second = worldAngle(solved.elbow, solved.wrist);
  upper.position.set(shoulder.x, shoulder.y, 0);
  upper.scale.setScalar(pose.scale);
  upper.rotation.z = first;
  forearm.rotation.z = second - first;
  wrist.rotation.z = solved.angle - second;
  const grip = side === 1 ? pose.grip :
    pose.grip === 'wave' ? 'grip' : pose.grip === 'point' || pose.grip === 'thumb' ? 'rest' : pose.grip;
  if (wrist.userData.grip !== grip) {
    wrist.userData.grip = grip;
    applyFingerPose(wrist, grip);
  }
}

function Arm({ actor, side, upper }: { actor: FrameRef; side: Side; upper: RefObject<Bone> }) {
  useFrame(({ size }) => {
    if (upper.current && actor.current) applyArm(upper.current, actor.current, side, size);
  });
  return <bone ref={upper} visible={false}>
    <Pin radius={5} />
    <Rod length={ARM_LENGTHS.upper} radius={3} />
    <bone name="forearm" position-y={ARM_LENGTHS.upper}>
      <Pin />
      <Rod length={ARM_LENGTHS.forearm} radius={2.5} />
      <bone name="wrist" position-y={ARM_LENGTHS.forearm}>
        <Pin radius={3} />
        <mesh position={[-4, 4, 0]}>
          <boxGeometry args={[17, 9, 4]} />
          <meshStandardMaterial color={GOLD} metalness={.32} roughness={.45} />
        </mesh>
        <Finger number={0} x={0} y={10} />
        <Finger number={1} x={-4.5} y={10} />
        <Finger number={2} x={-9} y={9} />
        <Finger number={3} x={-13} y={8} />
        <Finger number={4} x={4} y={4} thumb />
      </bone>
    </bone>
  </bone>;
}

function HeadGuide({ actor }: { actor: FrameRef }) {
  const root = useRef<Group>(null);
  const gaze = useRef<Group>(null);
  useFrame(({ size }) => {
    const pose = actor.current;
    if (!root.current || !gaze.current || !pose) return;
    root.current.visible = !pose.hidden && !pose.hideHead;
    const point = viewportToWorld(pose.anchor, size);
    root.current.position.set(point.x, point.y, -7);
    root.current.scale.setScalar(pose.scale);
    root.current.rotation.z = pose.tilt;
    gaze.current.position.x = Math.max(-11, Math.min(11, (pose.gaze.x - pose.anchor.x) / 9));
    gaze.current.position.y = Math.max(-9, Math.min(9, (pose.anchor.y - pose.gaze.y) / 12));
    gaze.current.scale.setScalar(pose.phase === 'surprise' ? 1.35 : 1);
  });
  return <group ref={root} visible={false}>
    <mesh>
      <torusGeometry args={[22, 1.4, 6, 30]} />
      <meshBasicMaterial color="#f2cc91" />
    </mesh>
    <group ref={gaze} position-z={2}>
      <mesh>
        <ringGeometry args={[3, 4.8, 16]} />
        <meshBasicMaterial color="#a8e3ad" />
      </mesh>
    </group>
    <mesh position-y={-28}>
      <boxGeometry args={[2, 13, 2]} />
      <meshBasicMaterial color="#f2cc91" />
    </mesh>
  </group>;
}

type SceneProps = {
  invalidateStatus: (pose: Pose, contact?: number) => void;
  onFailure: () => void;
};

function Scene({ invalidateStatus, onFailure }: SceneProps) {
  const actor = useRef<Pose | null>(null);
  const left = useRef<Bone>(null);
  const right = useRef<Bone>(null);
  const { invalidate, gl, get } = useThree();

  useEffect(() => startPuppetDirector((pose, error) => {
    actor.current = pose;
    invalidateStatus(pose, error);
    invalidate();
  }, (pose, point) => {
    const arm = right.current;
    const indexTip = arm?.getObjectByName('index-tip');
    if (!arm || !indexTip) return null;
    const { size, camera } = get();
    applyArm(arm, pose, 1, size);
    const projected = indexTip.getWorldPosition(new Vector3()).project(camera);
    return distance({ x: (projected.x + 1) * size.width / 2, y: (1 - projected.y) * size.height / 2 }, point);
  }), [get, invalidate, invalidateStatus]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);

  return <>
    <ambientLight intensity={1.5} />
    <directionalLight color="#ffe1a5" position={[100, 180, 200]} intensity={2.1} />
    <Arm actor={actor} side={-1} upper={left} />
    <Arm actor={actor} side={1} upper={right} />
    <HeadGuide actor={actor} />
  </>;
}

export default function PuppetStage(props: SceneProps) {
  const compact = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  return <Canvas orthographic camera={{ position: [0, 0, 500], near: .1, far: 1000 }}
    frameloop="demand" dpr={compact ? 1 : [1, 1.3]}
    gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}>
    <Scene {...props} />
  </Canvas>;
}
