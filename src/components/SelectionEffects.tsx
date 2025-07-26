import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import {
  defaultSelectionTheme,
  SELECTION_EFFECT_THEMES,
  type SelectionThemeName,
} from "@/consts/selectionThemes";

interface SelectionEffectsProps {
  isSelected: boolean;
  theme?: SelectionThemeName;
  particleColor?: string;
  glowColor?: string;
  baseGlowColor?: string;
  cardGlowColor?: string;
}

export function SelectionEffects({
  isSelected,
  theme = defaultSelectionTheme,
  particleColor,
  glowColor,
  baseGlowColor,
  cardGlowColor,
}: SelectionEffectsProps) {
  const selectedTheme = SELECTION_EFFECT_THEMES[theme];

  // Use custom colors if provided, otherwise use theme colors
  const finalParticleColor = particleColor || selectedTheme.particleColor;
  const finalGlowColor = glowColor || selectedTheme.glowColor;
  const finalBaseGlowColor = baseGlowColor || selectedTheme.baseGlowColor;
  const finalCardGlowColor = cardGlowColor || selectedTheme.cardGlowColor;

  const glowRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const baseGlowRef = useRef<THREE.Mesh>(null);
  const cardGlowRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.Mesh>(null);

  // Glow geometry and material for card background glow (from Card component)
  const cardGlowGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(2.2, 2.2); // Slightly larger than card
  }, []);

  const cardGlowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(finalCardGlowColor),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [finalCardGlowColor]);

  // Animated glow effects
  useFrame((state) => {
    if (!isSelected) return;

    const time = state.clock.getElapsedTime();

    // Glow ring animation
    if (glowRingRef.current) {
      glowRingRef.current.rotation.z = time * 0.5;
      const material = glowRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (Math.sin(time * 3) * 0.3 + 0.7) * 0.8;
      material.color.set(finalGlowColor);
    }

    // Particle effect
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.3;
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = Math.sin(time * 2) * 0.3 + 0.7;
      material.color.set(finalParticleColor);
    }

    // Base glow pulsing effect
    if (baseGlowRef.current) {
      const material = baseGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(time * 1.5) * 0.2 + 0.4;
      material.color.set(finalBaseGlowColor);
    }

    // Card background glow pulsing effect (from Card component)
    if (cardGlowRef.current) {
      const pulse = Math.sin(time * 4) * 0.1 + 0.5;
      const material = cardGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = pulse * 0.8;
      material.color.set(finalCardGlowColor);
      cardGlowRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1); // Subtle size pulse
    }

    // Outline effect animation
    if (outlineRef.current) {
      const material = outlineRef.current.material as THREE.MeshBasicMaterial;
      material.color.set(finalCardGlowColor);
    }
  });

  if (!isSelected) return null;

  // Create particles geometry
  const particleCount = 20;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 0.8 + Math.random() * 0.4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return (
    <group renderOrder={10}>
      {/* Card background glow effect (moved from Card component) */}
      <mesh
        ref={cardGlowRef}
        geometry={cardGlowGeometry}
        material={cardGlowMaterial}
        position={[0, 2.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={0}
      />

      {/* Outline/border effect (moved from Card component) */}
      <mesh
        ref={outlineRef}
        rotation={[0, 0, 0]}
        position={[0, 0.01, 0]}
        renderOrder={1}
      >
        <boxGeometry args={[1.02, 0.02, 0.91]} />
        <meshBasicMaterial
          color={finalCardGlowColor}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Base glow effect */}
      <mesh
        ref={baseGlowRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        renderOrder={2}
      >
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial
          color={finalBaseGlowColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glow ring effect */}
      <mesh
        ref={glowRingRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.08, 0]}
        renderOrder={3}
      >
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshBasicMaterial
          color={finalGlowColor}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Particle effects */}
      <points ref={particlesRef} position={[0, 1.8, 0]} renderOrder={4}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={finalParticleColor}
          size={0.04}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
