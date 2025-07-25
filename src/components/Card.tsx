/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import type { RefObject } from "react";
import * as THREE from "three";

import type { BasicObject } from "@/utils/types";

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

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick?.();
  };

  return (
    <group
      ref={ref}
      scale={[1.25 * scale, 0.0095 * scale, 0.895 * scale]}
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
      <mesh geometry={(nodes.Card as any).geometry} rotation={[0, 0, 0]}>
        <meshMatcapMaterial
          transparent
          color={"#222"}
          opacity={isSelected ? 0.6 : 1.0}
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
            opacity={isSelected ? 0.6 : 1.0}
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
          color={"#222"}
          opacity={isSelected ? 0.6 : 1.0}
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
            opacity={isSelected ? 0.6 : 1.0}
          />
        </Decal>
      </mesh>
    </group>
  );
}

useGLTF.preload("models/card.glb");
