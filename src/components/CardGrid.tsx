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
}: {
  color?: string;
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gridOrigin: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  // Create arrays for indices
  const verticalIndices = Array.from({ length: cols + 1 }, (_, c) => c);
  const horizontalIndices = Array.from({ length: rows + 1 }, (_, r) => r);
  const [gridOriginX, gridOriginY, gridOriginZ] = gridOrigin;

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
    </group>
  );
}
