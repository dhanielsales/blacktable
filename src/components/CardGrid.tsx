/* eslint-disable @typescript-eslint/no-explicit-any */

export function CardGrid({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  cols,
  rows,
  cellHeight,
  cellWidth,
  gridOrigin,
  color = "#6f6f6f",
  onCellHover,
  onCellClick,
  hoveredCell,
}: {
  color?: string;
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gridOrigin: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  onCellHover?: (cell: { row: number; col: number } | null) => void;
  onCellClick?: (cell: { row: number; col: number }) => void;
  hoveredCell?: { row: number; col: number } | null;
}) {
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
      const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;

      gridCells.push(
        <mesh
          key={`cell-${row}-${col}`}
          position={[x, gridOriginY + 0.01, z]}
          rotation={[Math.PI / 2, Math.PI, Math.PI / 2]}
          onPointerEnter={(e) => {
            e.stopPropagation();
            onCellHover?.({ row, col });
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            onCellHover?.(null);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onCellClick?.({ row, col });
          }}
        >
          <planeGeometry args={[cellWidth * 0.92, cellHeight * 0.92]} />
          <meshBasicMaterial
            color={isHovered ? "#ffff00" : "#00000000"}
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
    <group position={position} rotation={rotation}>
      {lines}
      {gridCells}
    </group>
  );
}
