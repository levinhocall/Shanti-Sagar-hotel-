import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  className?: string;
  onLoaded?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ className, onLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLFailed(true);
        if (onLoaded) onLoaded();
        return;
      }
    } catch {
      setWebGLFailed(true);
      if (onLoaded) onLoaded();
      return;
    }

    let isVisible = true;
    let animationFrameId: number;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080d0b, 0.08);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Centerpiece Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Royal Brass Platter (Thali Base)
    const platterGeo = new THREE.CylinderGeometry(1.2, 1.05, 0.08, 48);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0xd6b56e,
      metalness: 0.85,
      roughness: 0.28,
      emissive: 0x1a1205,
      emissiveIntensity: 0.15,
    });
    const platter = new THREE.Mesh(platterGeo, platterMat);
    platter.position.y = -0.2;
    rootGroup.add(platter);

    // 2. Decorative Rim Ring
    const rimGeo = new THREE.TorusGeometry(1.22, 0.035, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf0d495,
      metalness: 0.95,
      roughness: 0.15,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.16;
    rootGroup.add(rim);

    // 3. Floating Spice Particles & Golden Aromatic Orbs
    const spiceParticles: THREE.Mesh[] = [];
    const orbColors = [0xf0d495, 0xa66a48, 0x103d32, 0xe28d38];

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.9;
      const height = 0.05 + Math.random() * 0.45;

      const size = 0.03 + Math.random() * 0.04;
      const geo = i % 2 === 0 ? new THREE.OctahedronGeometry(size) : new THREE.DodecahedronGeometry(size);
      const mat = new THREE.MeshStandardMaterial({
        color: orbColors[i % orbColors.length],
        metalness: 0.6,
        roughness: 0.3,
        emissive: orbColors[i % orbColors.length],
        emissiveIntensity: 0.3,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      rootGroup.add(mesh);
      spiceParticles.push(mesh);
    }

    // 4. Subtle Inner Glow Ring (Vegetarian Harmony Circle)
    const ringGeo = new THREE.RingGeometry(0.3, 0.33, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd6b56e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.15;
    rootGroup.add(ringMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7e8, 0.8);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffdca8, 3.5);
    mainSpot.position.set(2.5, 4.5, 3);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.5;
    scene.add(mainSpot);

    const fillLight = new THREE.PointLight(0x103d32, 2.5, 10);
    fillLight.position.set(-3, 2, -1.5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xd6b56e, 2, 8);
    rimLight.position.set(0, -1, -2);
    scene.add(rimLight);

    // Interaction State
    let targetRotationY = 0;
    let targetRotationX = 0.2;
    let currentRotationY = 0;
    let currentRotationX = 0.2;
    let pointerX = 0;
    let pointerY = 0;
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      setIsInteracting(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isPointerDown) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.005;
        targetRotationX = Math.max(-0.2, Math.min(0.6, targetRotationX));
      } else {
        const rect = container.getBoundingClientRect();
        pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    const onPointerUp = () => {
      isPointerDown = false;
      setIsInteracting(false);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Visibility Observer to pause when off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle auto-spin when idle
      if (!isPointerDown) {
        targetRotationY += 0.0025;
      }

      // Parallax response
      const parallaxTargetX = targetRotationX + pointerY * 0.12;
      const parallaxTargetY = targetRotationY + pointerX * 0.18;

      currentRotationX += (parallaxTargetX - currentRotationX) * 0.06;
      currentRotationY += (parallaxTargetY - currentRotationY) * 0.06;

      rootGroup.rotation.x = currentRotationX;
      rootGroup.rotation.y = currentRotationY;

      // Gentle floating animation for particles
      spiceParticles.forEach((particle, idx) => {
        const speed = 1.2 + (idx % 4) * 0.3;
        const phase = idx * 0.8;
        particle.position.y += Math.sin(elapsedTime * speed + phase) * 0.0012;
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();
    if (onLoaded) onLoaded();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      renderer.dispose();
      platterGeo.dispose();
      platterMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onLoaded]);

  if (webGLFailed) {
    return (
      <div className={`relative flex items-center justify-center ${className || ''}`}>
        <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border border-[#D6B56E]/40 p-3 animate-float">
          <div className="w-full h-full rounded-full overflow-hidden border border-[#D6B56E]/20 shadow-[0_0_60px_rgba(214,181,110,0.25)]">
            <img
              src="/images/feast.webp"
              alt="Shanti Sagar Pure Veg Table Presentation"
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative cursor-grab active:cursor-grabbing select-none touch-pan-y ${className || ''}`}
      style={{ minHeight: 'min(78vw, 380px)' }}
      aria-label="Interactive 3D Table Centerpiece - Drag to rotate"
    >
      {/* Interaction Hint */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0E241E]/80 backdrop-blur-md border border-[#D6B56E]/30 text-[#D6B56E] text-xs font-mono tracking-wider flex items-center gap-2 pointer-events-none transition-opacity duration-300 ${isInteracting ? 'opacity-30' : 'opacity-90'}`}>
        <span className="w-2 h-2 rounded-full bg-[#D6B56E] animate-ping" />
        DRAG TO EXPLORE 3D
      </div>
    </div>
  );
};
