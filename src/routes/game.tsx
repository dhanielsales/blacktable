import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";

import { CAMERA_SETTINGS, type CameraOptions } from "@/consts";
import { CameraController } from "@/components/CameraController";
import { CardGrid } from "@/components/CardGrid";
import { Card } from "@/components/Card";
import { getTableID, TableProvider, useTableContext } from "@/contexts/table";
import { degToRad } from "three/src/math/MathUtils.js";
import { Light } from "@/components/Light";
import { Floor } from "@/components/Floor";
import {
  SELECTION_THEMES,
  type SelectionThemeName,
} from "@/components/SelectionEffects";

export const Route = createFileRoute("/game")({
  component: Game,
});

// Calculate card positions based on grid - should match CardGrid cell positioning exactly
const getCardPosition = (
  row: number,
  col: number
): [number, number, number] => {
  const gridOriginX = -((GRID_COLS * GRID_CELL_WIDTH) / 2);
  const gridOriginZ = -((GRID_ROWS * GRID_CELL_HEIGHT) / 2);

  // Calculate position exactly like CardGrid does for its cells
  const localX = gridOriginX + col * GRID_CELL_WIDTH + GRID_CELL_WIDTH / 2;
  const localY = 0.12; // Slightly above the grid
  const localZ = gridOriginZ + row * GRID_CELL_HEIGHT + GRID_CELL_HEIGHT / 2;

  // Return local position - let the group transform handle rotation/positioning
  return [localX, localY, localZ];
};

const floorDepth = -1.161;
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
  selectedTheme,
}: {
  tableIndex: number;
  position: [number, number, number];
  rotation: [number, number, number];
  selectedTheme: SelectionThemeName;
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
              selectedTheme={selectedTheme}
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
  const [selectedTheme, setSelectedTheme] =
    useState<SelectionThemeName>("electric");

  return (
    <TableProvider numberOfTables={5} gridCols={GRID_COLS} gridRows={GRID_ROWS}>
      <div style={{ width: "100vw", height: "100vh", background: "#222" }}>
        {/* Navigation Header */}
        <header className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-red-600 to-red-700 hover:text-red-600 transition-colors"
            >
              ← BlackTable
            </Link>
            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <div className="flex items-center space-x-2 bg-gray-900/70 px-3 py-2 rounded-lg border border-gray-600">
                <label
                  htmlFor="theme-select"
                  className="text-sm text-gray-300 font-medium"
                >
                  Effect:
                </label>
                <div className="flex items-center space-x-2">
                  {/* Color preview */}
                  <div
                    className="w-3 h-3 rounded-full border border-gray-500"
                    style={{
                      backgroundColor:
                        SELECTION_THEMES[selectedTheme].particleColor,
                    }}
                  />
                  <select
                    id="theme-select"
                    value={selectedTheme}
                    onChange={(e) =>
                      setSelectedTheme(e.target.value as SelectionThemeName)
                    }
                    className="bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-red-700 focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    {Object.keys(SELECTION_THEMES).map((theme) => (
                      <option key={theme} value={theme} className="bg-gray-800">
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}{" "}
                        {theme === "blood"
                          ? "🩸"
                          : theme === "fire"
                            ? "🔥"
                            : theme === "ice"
                              ? "❄️"
                              : theme === "electric"
                                ? "⚡"
                                : theme === "nature"
                                  ? "🌿"
                                  : theme === "gold"
                                    ? "✨"
                                    : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <span className="text-sm text-gray-300">
                Player {playerIndex + 1} of 5
              </span>
              <Link
                to="/rooms"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Game Rooms
              </Link>
            </div>
          </div>
        </header>

        {/* Game Controls */}
        <div className="absolute top-20 left-4 z-10 space-y-2">
          <button
            className="block bg-gray-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-gray-600 hover:border-red-700 transition-all duration-200 font-medium"
            onClick={() =>
              setPlayerIndex((i) => (i + 1) % cameraPositions.length)
            }
          >
            Switch Player ({playerIndex + 1}/5)
          </button>
          <button
            className="block bg-gray-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-gray-600 hover:border-red-700 transition-all duration-200 font-medium"
            onClick={() =>
              setCameraOption((prev) =>
                prev === "lookAtCenter" ? "lookAtTable" : "lookAtCenter"
              )
            }
          >
            Switch Camera
          </button>
        </div>

        {/* Game Instructions */}
        <div className="absolute top-20 right-4 z-10 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-gray-600 max-w-xs">
          <h3 className="text-red-600 font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Click a card to select it</li>
            <li>• Click an empty grid cell to move</li>
            <li>• Switch players to view different tables</li>
            <li>• Use camera modes for different views</li>
            <li>• Change effect themes in the header</li>
          </ul>
        </div>

        <Canvas
          camera={{
            position: cameraPositions[playerIndex],
          }}
          shadows
        >
          <Light />
          <Floor floorDepth={floorDepth} />

          {/* <ambientLight intensity={0.7} /> */}
          <directionalLight position={[5, 20, 5]} intensity={0.8} castShadow />
          {tablePositions.map((pos, i) => (
            <Table
              key={i}
              tableIndex={i}
              position={pos}
              rotation={tableRotations[i]}
              selectedTheme={selectedTheme}
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
