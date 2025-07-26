/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useMemo } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

import type { BasicObject } from "@/utils/types";
import { SelectionEffects } from "./SelectionEffects";

interface CardProps extends BasicObject {
  front: string;
  back?: string;
  debug?: boolean;
  scale?: number;
  ref?: RefObject<THREE.Group<THREE.Object3DEventMap> | null>;
  onClick?: () => void;
  isSelected?: boolean;
  cardId?: string;
}

export function Card({
  debug,
  scale = 1,
  front,
  back = "textures/crypt-background.jpg",
  ref,
  onClick,
  isSelected = false,
  ...rest
}: CardProps) {
  const { nodes } = useGLTF("models/card.glb");
  const frontTexture = useTexture(front);
  const backTexture = useTexture(back);
  const glowRef = useRef<THREE.Mesh>(null);

  // Spring animation for smooth transitions
  const { position, scale: animatedScale } = useSpring({
    position: isSelected ? [0, 0.3, 0] : [0, 0, 0], // Elevate when selected
    scale: isSelected ? 1.1 : 1.0, // Slight scale increase
    config: { tension: 300, friction: 30 },
  });

  // Pulsing glow effect
  useFrame((state) => {
    if (glowRef.current && isSelected) {
      const time = state.clock.getElapsedTime();
      const pulse = Math.sin(time * 4) * 0.1 + 0.5;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = pulse * 0.8;
      glowRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1); // Subtle size pulse
    }
  });

  // Glow geometry
  const glowGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(2.2, 2.2); // Slightly larger than card
  }, []);

  // Glow material
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#910101"),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick?.();
  };

  return (
    <animated.group
      ref={ref}
      scale={animatedScale.to((s) => [
        1.25 * scale * s,
        0.0095 * scale,
        0.895 * scale * s,
      ])}
      position={position as any}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
      {...rest}
    >
      {/* Selection Effects */}
      <SelectionEffects
        isSelected={isSelected}
        theme="blood" // Use the new blood theme
      />

      {/* Glow effect behind the card */}
      {isSelected && (
        <mesh
          ref={glowRef}
          geometry={glowGeometry}
          material={glowMaterial}
          position={[0, 2.2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      )}

      {/* Outline/border effect */}
      {isSelected && (
        <mesh rotation={[0, 0, 0]} position={[0, 0.01, 0]}>
          <boxGeometry args={[1.02, 0.02, 0.91]} />
          <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
        </mesh>
      )}

      <mesh geometry={(nodes.Card as any).geometry} rotation={[0, 0, 0]}>
        <meshMatcapMaterial
          transparent
          color={isSelected ? "#ff4444" : "#222"}
          opacity={isSelected ? 0.9 : 1.0}
        />
        <Decal
          debug={debug}
          position={[0, 1, 0]}
          rotation={[Math.PI / 2, Math.PI, Math.PI / 2]}
          scale={[2, 2, 1.99]}
          castShadow
        >
          <meshMatcapMaterial
            map={frontTexture}
            transparent
            polygonOffsetFactor={-1}
            polygonOffset
            opacity={isSelected ? 0.9 : 1.0}
          />
        </Decal>
      </mesh>
      <mesh
        geometry={(nodes.Card_1 as any).geometry}
        position={[0, -1, 0]}
        rotation={[0, Math.PI, 0]}
      >
        <meshMatcapMaterial
          transparent
          color={isSelected ? "#ff4444" : "#222"}
          opacity={isSelected ? 0.9 : 1.0}
        />
        <Decal
          position={[0, -1, 0]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          scale={[2, 2, 1.99]}
          castShadow
        >
          <meshMatcapMaterial
            map={backTexture}
            transparent
            polygonOffsetFactor={-1}
            polygonOffset
            opacity={isSelected ? 0.9 : 1.0}
          />
        </Decal>
      </mesh>
    </animated.group>
  );
}

useGLTF.preload("models/card.glb");
