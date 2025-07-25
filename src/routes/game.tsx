import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";

import { CAMERA_SETTINGS, type CameraOptions } from "@/consts";
import { CameraController } from "@/components/CameraController";
import { CardGrid } from "@/components/CardGrid";
import { Card } from "@/components/Card";
import { getTableID, TableProvider, useTableContext } from "@/contexts/table";
import { degToRad } from "three/src/math/MathUtils.js";

export const Route = createFileRoute("/game")({
  component: Game,
});

const TABLE_SIZE = 14;
const TABLE_RADIUS = 11.8;
const CAMERA_RADIUS = 15;
const CAMERA_HEIGHT = 7;
// const CARD_WIDTH = 0.895;
const CARD_HEIGHT = 1.25;
const GRID_COLS = 10;
const GRID_ROWS = 4;
const GRID_CELL_WIDTH = CARD_HEIGHT + 0.05;
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
  tableIndex,
  position,
  rotation,
}: {
  tableIndex: number;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const { tableStates, selectCard, deselectCard, moveCard, setHoveredCell } =
    useTableContext();
  const tableState = tableStates[getTableID(tableIndex)];

  const handleCardClick = (cardId: string) => {
    if (tableState.selectedCardId === cardId) {
      deselectCard(tableIndex);
    } else {
      selectCard(tableIndex, cardId);
    }
  };

  const handleCellClick = (cell: { row: number; col: number }) => {
    if (tableState.selectedCardId) {
      // Check if cell is occupied
      const isOccupied = tableState.cards.some(
        (card) => card.row === cell.row && card.col === cell.col
      );
      if (!isOccupied) {
        moveCard(tableIndex, tableState.selectedCardId, cell.row, cell.col);
      }
    }
  };

  // Calculate card positions based on grid - should match CardGrid cell positioning exactly
  const getCardPosition = (
    row: number,
    col: number
  ): [number, number, number] => {
    console.log("getCardPosition", row, col);

    const gridOriginX = -((GRID_COLS * GRID_CELL_WIDTH) / 2);
    const gridOriginZ = -((GRID_ROWS * GRID_CELL_HEIGHT) / 2);

    // Calculate position exactly like CardGrid does for its cells
    const localX = gridOriginX + col * GRID_CELL_WIDTH + GRID_CELL_WIDTH / 2;
    const localY = 0.12; // Slightly above the grid
    const localZ = gridOriginZ + row * GRID_CELL_HEIGHT + GRID_CELL_HEIGHT / 2;

    // Return local position - let the group transform handle rotation/positioning
    return [localX, localY, localZ];
  };
  return (
    <>
      {/* Group that contains both grid and cards with same transform */}
      <group position={position} rotation={rotation}>
        {/* Render all cards at their grid positions */}
        {tableState.cards.map((card) => {
          const cardPosition = getCardPosition(card.row, card.col);
          return (
            <Card
              key={card.id}
              front={card.front}
              back={card.back}
              scale={0.49}
              position={cardPosition}
              rotation={[0, -degToRad(90), 0]} // Only apply card-specific rotation
              onClick={() => handleCardClick(card.id)}
              isSelected={tableState.selectedCardId === card.id}
            />
          );
        })}

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
          onCellHover={(cell) => setHoveredCell(tableIndex, cell)}
          onCellClick={handleCellClick}
        />
      </group>

      {/* Table mesh */}
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
    <TableProvider numberOfTables={5} gridCols={GRID_COLS} gridRows={GRID_ROWS}>
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
          onClick={() =>
            setPlayerIndex((i) => (i + 1) % cameraPositions.length)
          }
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
            <Table
              key={i}
              tableIndex={i}
              position={pos}
              rotation={tableRotations[i]}
            />
          ))}
          <CameraController
            position={cameraPositions[playerIndex]}
            cameraOption={cameraOption}
            fov={CAMERA_SETTINGS[cameraOption].fov}
          />
        </Canvas>
      </div>
    </TableProvider>
  );
}
