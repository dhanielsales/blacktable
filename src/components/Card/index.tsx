import { Decal, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { Mesh, Vector3 } from "three";
import { a } from "@react-spring/three";

export function Card({
  rotation = [0, 0, 0],
  position = [0, 1.35, 0],
  onDoubleClick,
}: {
  rotation?: [number, number, number];
  position?: [number, number, number];
  onDoubleClick?: () => void;
}) {
  const front = useTexture("textures/annekeg1.jpg");
  const background = useTexture("textures/crypt-background.jpg");
  const meshRef = useRef<Mesh>(null);

  return (
    <a.mesh
      ref={meshRef}
      castShadow
      position={position}
      rotation={rotation}
      onDoubleClick={onDoubleClick}
    >
      <boxGeometry args={[0.895, 1.25, 0.015]} />
      <meshStandardMaterial color="#222" />
      <Decal
        position={[0, 0, -0.5]}
        rotation={[0, Math.PI, 0]}
        scale={[0.92, 1.28, 1]}
      >
        <meshBasicMaterial
          map={front}
          transparent
          polygonOffsetFactor={-1}
          polygonOffset
        />
      </Decal>

      <Decal
        position={[0, 0, 0.5]}
        rotation={[0, 0, 0]}
        scale={[0.92, 1.28, 1]}
      >
        <meshBasicMaterial
          map={background}
          transparent
          polygonOffsetFactor={-1}
          polygonOffset
        />
      </Decal>
    </a.mesh>
  );
}

// Grid and card constants
const CARD_WIDTH = 0.895;
const CARD_HEIGHT = 1.25;
const GRID_COLS = 20;
const GRID_ROWS = 4;
const GRID_CELL_WIDTH = CARD_WIDTH + 0.05;
const GRID_CELL_HEIGHT = CARD_HEIGHT + 0.05;
const GRID_ORIGIN = {
  x: -((GRID_COLS * GRID_CELL_WIDTH) / 2),
  y: 0.01,
  z: -((GRID_ROWS * GRID_CELL_HEIGHT) / 2),
};

// Helper: Clamp value between min and max
export const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

// Helper: Snap world position to grid cell
export function snapToGrid(pos: Vector3) {
  const col = clamp(
    Math.round((pos.x - GRID_ORIGIN.x) / GRID_CELL_WIDTH - 0.5),
    0,
    GRID_COLS - 1
  );
  const row = clamp(
    Math.round((pos.z - GRID_ORIGIN.z) / GRID_CELL_HEIGHT - 0.5),
    0,
    GRID_ROWS - 1
  );
  return {
    col,
    row,
    x: GRID_ORIGIN.x + col * GRID_CELL_WIDTH + GRID_CELL_WIDTH / 2,
    z: GRID_ORIGIN.z + row * GRID_CELL_HEIGHT + GRID_CELL_HEIGHT / 2,
  };
}
