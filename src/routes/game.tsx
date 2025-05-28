import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";

import { CAMERA_SETTINGS, type CameraOptions } from "@/consts";
import { CameraController } from "@/components/CameraController";
import { CardGrid } from "@/components/CardGrid";

export const Route = createFileRoute("/game")({
  component: Game,
});

const TABLE_SIZE = 15;
const TABLE_RADIUS = 10;
const CAMERA_RADIUS = 13;
const CAMERA_HEIGHT = 8;
const CARD_WIDTH = 0.895;
const CARD_HEIGHT = 1.25;
const GRID_COLS = 10;
const GRID_ROWS = 4;
const GRID_CELL_WIDTH = CARD_WIDTH + 0.05;
const GRID_CELL_HEIGHT = CARD_HEIGHT + 0.05;
const pentagonAngles = [0, 72, 144, 216, 288];
const tablePositions: [number, number, number][] = pentagonAngles.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return [Math.cos(rad) * TABLE_RADIUS, 0, Math.sin(rad) * TABLE_RADIUS];
});
const tableRotations: [number, number, number][] = tablePositions.map(
  ([x, , z]) => {
    const angle = Math.atan2(-x, -z);
    return [0, angle, 0];
  }
);
const cameraPositions: [number, number, number][] = pentagonAngles.map(
  (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [
      Math.cos(rad) * CAMERA_RADIUS,
      CAMERA_HEIGHT,
      Math.sin(rad) * CAMERA_RADIUS,
    ];
  }
);

function Table({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <>
      <CardGrid
        cellHeight={GRID_CELL_HEIGHT}
        cellWidth={GRID_CELL_WIDTH}
        cols={GRID_COLS}
        rows={GRID_ROWS}
        gridOrigin={[
          -((GRID_COLS * GRID_CELL_WIDTH) / 2),
          0.1,
          -((GRID_ROWS * GRID_CELL_HEIGHT) / 2),
        ]}
        rotation={rotation}
        position={[position[0], position[1], position[2]]}
      />
      <mesh receiveShadow type="fixed" position={position} rotation={rotation}>
        <boxGeometry args={[TABLE_SIZE, 0.1, TABLE_SIZE / 2]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </>
  );
}

function Game() {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [cameraOption, setCameraOption] =
    useState<CameraOptions>("lookAtCenter");

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#222" }}>
      <button
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: 20,
          padding: "10px 20px",
          fontSize: 18,
          borderRadius: 8,
          border: "none",
          background: "#f5f5dc",
          color: "#222",
          cursor: "pointer",
        }}
        onClick={() => setPlayerIndex((i) => (i + 1) % cameraPositions.length)}
      >
        Switch Player ({playerIndex + 1}/5)
      </button>
      <button
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: 230,
          padding: "10px 20px",
          fontSize: 18,
          borderRadius: 8,
          border: "none",
          background: "#f5f5dc",
          color: "#222",
          cursor: "pointer",
        }}
        onClick={() =>
          setCameraOption((prev) =>
            prev === "lookAtCenter" ? "lookAtTable" : "lookAtCenter"
          )
        }
      >
        Switch Camera
      </button>

      <Canvas
        camera={{
          position: cameraPositions[playerIndex],
        }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 20, 5]} intensity={0.8} castShadow />
        {tablePositions.map((pos, i) => (
          <Table key={i} position={pos} rotation={tableRotations[i]} />
        ))}
        <CameraController
          position={cameraPositions[playerIndex]}
          cameraOption={cameraOption}
          fov={CAMERA_SETTINGS[cameraOption].fov}
        />
      </Canvas>
    </div>
  );
}
