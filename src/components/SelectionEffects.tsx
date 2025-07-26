import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export interface SelectionTheme {
  particleColor: string;
  glowColor: string;
  baseGlowColor: string;
}

export const SELECTION_THEMES = {
  fire: {
    particleColor: "#ff4400",
    glowColor: "#ff0000",
    baseGlowColor: "#ff8800",
  },
  ice: {
    particleColor: "#88ddff",
    glowColor: "#0088ff",
    baseGlowColor: "#aaccff",
  },
  electric: {
    particleColor: "#ffff00",
    glowColor: "#8800ff",
    baseGlowColor: "#ff00ff",
  },
  nature: {
    particleColor: "#44ff44",
    glowColor: "#88ff00",
    baseGlowColor: "#00ff88",
  },
  gold: {
    particleColor: "#ffdd00",
    glowColor: "#ff8800",
    baseGlowColor: "#ffaa44",
  },
  blood: {
    particleColor: "#cc0000",
    glowColor: "#990000",
    baseGlowColor: "#660000",
  },
  default: {
    particleColor: "#00ffff",
    glowColor: "#ff6b6b",
    baseGlowColor: "#ff3333",
  },
} as const;

export type SelectionThemeName = keyof typeof SELECTION_THEMES;

interface SelectionEffectsProps {
  isSelected: boolean;
  theme?: SelectionThemeName;
  particleColor?: string;
  glowColor?: string;
  baseGlowColor?: string;
}

export function SelectionEffects({
  isSelected,
  theme = "default",
  particleColor,
  glowColor,
  baseGlowColor,
}: SelectionEffectsProps) {
  const selectedTheme = SELECTION_THEMES[theme];

  // Use custom colors if provided, otherwise use theme colors
  const finalParticleColor = particleColor || selectedTheme.particleColor;
  const finalGlowColor = glowColor || selectedTheme.glowColor;
  const finalBaseGlowColor = baseGlowColor || selectedTheme.baseGlowColor;
  const glowRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Animated glow ring
  useFrame((state) => {
    if (!isSelected) return;

    const time = state.clock.getElapsedTime();

    // Glow ring animation
    if (glowRingRef.current) {
      glowRingRef.current.rotation.z = time * 0.5;
      const material = glowRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (Math.sin(time * 3) * 0.3 + 0.7) * 0.6;
    }

    // Particle effect
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.3;
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = Math.sin(time * 2) * 0.3 + 0.5;
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
    <group>
      {/* Glowing ring */}
      <mesh
        ref={glowRingRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshBasicMaterial
          color={finalGlowColor}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Particle effect */}
      <points ref={particlesRef} position={[0, 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={finalParticleColor}
          size={0.03}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* Pulsing base glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial
          color={finalBaseGlowColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
