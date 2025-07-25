/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

export function CardGrid({
  cols,
  rows,
  cellHeight,
  cellWidth,
  gridOrigin,
  color = "#6f6f6f",
  onCellHover,
  onCellClick,
}: {
  color?: string;
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gridOrigin: [number, number, number];
  onCellHover?: (cell: { row: number; col: number } | null) => void;
  onCellClick?: (cell: { row: number; col: number }) => void;
}) {
  // Local state for visual hover effects only
  const [localHoveredCell, setLocalHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellEnter = useCallback(
    (row: number, col: number) => {
      const cell = { row, col };
      setLocalHoveredCell(cell);
      onCellHover?.(cell);
    },
    [onCellHover]
  );

  const handleCellLeave = useCallback(() => {
    setLocalHoveredCell(null);
    onCellHover?.(null);
  }, [onCellHover]);
  // Create arrays for indices
  const verticalIndices = Array.from({ length: cols + 1 }, (_, c) => c);
  const horizontalIndices = Array.from({ length: rows + 1 }, (_, r) => r);
  const [gridOriginX, gridOriginY, gridOriginZ] = gridOrigin;

  // Create grid cells for interaction
  const gridCells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = gridOriginX + col * cellWidth + cellWidth / 2;
      const z = gridOriginZ + row * cellHeight + cellHeight / 2;
      const isHovered =
        localHoveredCell?.row === row && localHoveredCell?.col === col;

      gridCells.push(
        <mesh
          key={`cell-${row}-${col}`}
          position={[x, gridOriginY + 0.01, z]}
          rotation={[Math.PI / 2, Math.PI, Math.PI / 2]}
          onPointerEnter={(e) => {
            e.stopPropagation();
            handleCellEnter(row, col);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            handleCellLeave();
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onCellClick?.({ row, col });
          }}
        >
          <planeGeometry args={[cellWidth * 0.92, cellHeight * 0.92]} />
          <meshBasicMaterial
            color={isHovered ? "#000000" : undefined}
            transparent
            opacity={isHovered ? 0.3 : 0}
            side={2}
          />
        </mesh>
      );
    }
  }

  // Map to vertical lines
  const verticalLines = verticalIndices.map((c) => {
    const x = gridOriginX + c * cellWidth;
    return (
      <line key={`v${c}`}>
        <bufferGeometry>
          <bufferAttribute
            args={[] as any}
            attach="attributes-position"
            count={2}
            array={
              new Float32Array([
                x,
                gridOriginY,
                gridOriginZ,
                x,
                gridOriginY,
                gridOriginZ + rows * cellHeight,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
    );
  });

  // Map to horizontal lines
  const horizontalLines = horizontalIndices.map((r) => {
    const z = gridOriginZ + r * cellHeight;
    return (
      <line key={`h${r}`}>
        <bufferGeometry>
          <bufferAttribute
            args={[] as any}
            attach="attributes-position"
            count={2}
            array={
              new Float32Array([
                gridOriginX,
                gridOriginY,
                z,
                gridOriginX + cols * cellWidth,
                gridOriginY,
                z,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
    );
  });

  // Combine all lines
  const lines = [...verticalLines, ...horizontalLines];

  return (
    <group>
      {lines}
      {gridCells}
    </group>
  );
}
