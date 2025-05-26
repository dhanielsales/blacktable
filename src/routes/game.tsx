import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { Card } from "@/components/Card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
  component: Game,
});

type CameraOptions = "lookAtTable" | "lookAtCenter";

const CAMERA_SETTINGS: Record<CameraOptions, [number, number, number]> = {
  lookAtTable: [0, -20, 0],
  lookAtCenter: [0, 0, 0],
};

const TABLE_SIZE = 22;
const TABLE_RADIUS = 20;
const CAMERA_RADIUS = 30;
const CAMERA_HEIGHT = 12;
const TABLE_HEIGHT = 0.2;
// const CARD_WIDTH = 0.895;
// const CARD_HEIGHT = 1.25;
const CARD_THICKNESS = 0.05;

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
  onCardDoubleClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  onCardDoubleClick?: () => void;
}) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <Card
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, TABLE_HEIGHT / 2 + CARD_THICKNESS / 2 + 0.01, 0]}
        onDoubleClick={onCardDoubleClick}
      />
      <mesh receiveShadow>
        <boxGeometry args={[TABLE_SIZE, 0.1, TABLE_SIZE / 2]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </RigidBody>
  );
}

function CameraController({
  position,
  cameraOption,
  lookAt,
}: {
  position: [number, number, number];
  cameraOption?: CameraOptions;
  lookAt?: [number, number, number];
}) {
  const { camera } = useThree();
  const target = useMemo(
    () =>
      (lookAt as [number, number, number]) ||
      (cameraOption ? CAMERA_SETTINGS[cameraOption] : [0, 0, 0]),
    [lookAt, cameraOption]
  );
  const desired = useRef(new THREE.Vector3(...position));
  const lookAtVec = useRef(new THREE.Vector3(...target));
  const lookAtTarget = useRef(new THREE.Vector3(...target));

  useEffect(() => {
    desired.current.set(...position);
  }, [position]);

  useEffect(() => {
    lookAtTarget.current.set(...target);
  }, [target]);

  useFrame(() => {
    camera.position.lerp(desired.current, 0.08);
    lookAtVec.current.lerp(lookAtTarget.current, 0.08);
    camera.lookAt(lookAtVec.current);
  });

  return null;
}

function Game() {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [cameraOption, setCameraOption] =
    useState<CameraOptions>("lookAtTable");
  const [zoomedCardIndex, setZoomedCardIndex] = useState<number | null>(null);

  const zoomedCameraPos =
    zoomedCardIndex !== null
      ? ([
          tablePositions[zoomedCardIndex][0],
          5, // height above the card
          tablePositions[zoomedCardIndex][2],
        ] as [number, number, number])
      : cameraPositions[playerIndex];
  const zoomedLookAt =
    zoomedCardIndex !== null
      ? ([
          tablePositions[zoomedCardIndex][0],
          TABLE_HEIGHT / 2 + CARD_THICKNESS / 2,
          tablePositions[zoomedCardIndex][2],
        ] as [number, number, number])
      : CAMERA_SETTINGS[cameraOption];

  function handleCanvasPointerMissed() {
    if (zoomedCardIndex !== null) setZoomedCardIndex(null);
  }

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
        disabled={zoomedCardIndex !== null}
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
        disabled={zoomedCardIndex !== null}
      >
        Switch Camera
      </button>

      <Canvas
        camera={{ position: zoomedCameraPos, fov: 55 }}
        shadows
        onPointerMissed={handleCanvasPointerMissed}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 20, 5]} intensity={0.8} castShadow />
        <Physics>
          {tablePositions.map((pos, i) => (
            <Table
              key={i}
              position={pos}
              rotation={tableRotations[i]}
              onCardDoubleClick={() => setZoomedCardIndex(i)}
            />
          ))}
        </Physics>
        <CameraController
          position={zoomedCameraPos}
          cameraOption={zoomedCardIndex !== null ? undefined : cameraOption}
          lookAt={zoomedLookAt}
        />
      </Canvas>
    </div>
  );
}
