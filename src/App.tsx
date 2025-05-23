import { useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useSpring, a } from "@react-spring/three";

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
const CARD_THICKNESS = 0.001;

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

function Card({
  rotation = [0, 0, 0],
  position = [0, 1.35, 0],
}: {
  rotation?: [number, number, number];
  position?: [number, number, number];
}) {
  const [flipped, setFlipped] = useState(false);
  const { rotationY } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    config: { mass: 1, tension: 200, friction: 30 },
  });
  return (
    <a.mesh
      position={position}
      rotation={rotation}
      onClick={() => setFlipped((f) => !f)}
      rotation-y={rotationY}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1.5, 2.5, 0.001]} />
      {/* Front */}
      <meshStandardMaterial attach="material-0" color="#f5f5dc" side={2} />
      {/* Back */}
      <meshStandardMaterial attach="material-1" color="#2a4d69" side={2} />
      {/* Sides */}
      <meshStandardMaterial attach="material-2" color="#888" />
      <meshStandardMaterial attach="material-3" color="#888" />
      <meshStandardMaterial attach="material-4" color="#888" />
      <meshStandardMaterial attach="material-5" color="#888" />
    </a.mesh>
  );
}

function Table({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <Card
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, TABLE_HEIGHT / 2 + CARD_THICKNESS / 2 + 0.01, 0]}
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
}: {
  position: [number, number, number];
  cameraOption: CameraOptions;
}) {
  const { camera } = useThree();
  const spring = useSpring({
    to: { pos: position },
    config: { mass: 1, tension: 120, friction: 24 },
  });

  useFrame(() => {
    const val = spring.pos.get();
    camera.position.set(val[0], val[1], val[2]);
    camera.lookAt(...CAMERA_SETTINGS[cameraOption]);
  });

  return null;
}

function App() {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [cameraOption, setCameraOption] =
    useState<CameraOptions>("lookAtTable");

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
        camera={{ position: cameraPositions[playerIndex], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 20, 5]} intensity={0.8} castShadow />
        <Physics>
          {tablePositions.map((pos, i) => (
            <Table key={i} position={pos} rotation={tableRotations[i]} />
          ))}
        </Physics>
        <CameraController
          position={cameraPositions[playerIndex]}
          cameraOption={cameraOption}
        />
      </Canvas>
    </div>
  );
}

export default App;
