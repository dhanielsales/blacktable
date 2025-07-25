import { Card } from "@/components/Card";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import * as THREE from "three";
import allCards from "@/consts/cards.json" with { type: "json" };
import { getRandomInt } from "@/utils/random";
import { Light } from "@/components/Light";
import { Floor } from "@/components/Floor";

export const Route = createFileRoute("/demo")({
  component: Demo,
});

// Main options
const mainScale = 1;
const animationSpeed = 0.01;
const animation = true;
const debug = false;
const floorDepth = -1.161;
const spacing = 1.9;
const y = 0.5;
const z = -9;
const cards = new Array(7)
  .fill(null)
  .map(() => allCards[getRandomInt(0, allCards.length)]);
const positions: Array<[number, number, number]> = cards.map((_, i) => {
  const offset = (cards.length - 1) / 2;
  return [(i - offset) * spacing, y, z];
});
const card = allCards[getRandomInt(0, allCards.length)];

function AnimatedCard() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (animation) {
      meshRef.current!.rotation.x += animationSpeed;
      // meshRef.current!.rotation.y += animationSpeed;
      meshRef.current!.rotation.z += animationSpeed;
    }
  });

  return (
    <Card ref={meshRef} scale={mainScale} front={card} position={[0, 0.5, 0]} />
  );
}

function Cards() {
  return (
    <>
      {cards.map((front, i) => (
        <Card
          key={i}
          scale={mainScale}
          front={front}
          position={positions[i]}
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
        />
      ))}
    </>
  );
}

export function Demo() {
  return (
    <div className="overflow-y-hidden">
      <div className="w-screen h-screen">
        <Canvas
          gl={{ logarithmicDepthBuffer: true, antialias: false }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 15], fov: 25 }}
        >
          <color attach="background" args={["#15151a"]} />
          <fog attach="fog" args={["#800", 10, 70]} />

          <Light debug={debug} />
          <Floor floorDepth={floorDepth} />
          <ContactShadows
            resolution={1920}
            position={[0, floorDepth + 0.1, 0]}
            scale={15}
            blur={0.25}
            opacity={0.6}
            far={20}
          />
          <Cards />

          <AnimatedCard />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>
    </div>
  );
}
