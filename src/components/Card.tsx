/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import type { RefObject } from "react";
import * as THREE from "three";

import type { BasicObject } from "@/utils/types";
import { SelectionEffects } from "./SelectionEffects";
import type { SelectionThemeName } from "@/consts/selectionThemes";
import type { ThreeEvent } from "@react-three/fiber";

interface CardProps extends BasicObject {
  front: string;
  back?: string;
  debug?: boolean;
  scale?: number;
  ref?: RefObject<THREE.Group<THREE.Object3DEventMap> | null>;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
  onRightClick?: (event: THREE.Event) => void;
  isSelected?: boolean;
  cardId?: string;
  selectedTheme?: SelectionThemeName;
}

export function Card({
  debug,
  scale = 1,
  front,
  back = "textures/crypt-background.jpg",
  ref,
  onClick,
  // onRightClick,
  isSelected = false,
  selectedTheme = "blood",
  ...rest
}: CardProps) {
  const { nodes } = useGLTF("models/card.glb");
  const frontTexture = useTexture(front);
  const backTexture = useTexture(back);

  // Spring animation for smooth transitions
  const { position, scale: animatedScale } = useSpring({
    position: isSelected ? [0, 0.3, 0] : [0, 0, 0], // Elevate when selected
    scale: isSelected ? 1.1 : 1.0, // Slight scale increase
    config: { tension: 300, friction: 30 },
  });

  return (
    <animated.group
      ref={ref}
      scale={animatedScale.to((s) => [
        1.25 * scale * s,
        0.0095 * scale,
        0.895 * scale * s,
      ])}
      position={position as any}
      onClick={(event) => {
        event.stopPropagation();
        event.nativeEvent.preventDefault();
        onClick(event);
      }}
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
      <SelectionEffects isSelected={isSelected} theme={selectedTheme} />

      <mesh geometry={(nodes.Card as any).geometry} rotation={[0, 0, 0]}>
        <meshMatcapMaterial
          transparent
          opacity={isSelected ? 0.9 : 1.0}
          color={"#000"}
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
        <meshMatcapMaterial transparent opacity={isSelected ? 0.9 : 1.0} />
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
