import { Card } from "@/components/Card2";
import { useOrientation } from "@/hooks/useOrientation";
import {
  ContactShadows,
  Svg,
  Effects,
  Environment,
  Lightformer,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/test")({
  component: Page,
});

// Main options
const debug = false;
const floorDepth = -1.161;

function Light() {
  const light = useRef<THREE.DirectionalLightHelper>(null);
  if (debug) {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    useHelper(light as any, THREE.DirectionalLightHelper, 1, "blur");
  }

  return (
    <>
      <ambientLight color="#000000" intensity={0.5} />
      <directionalLight
        ref={light}
        intensity={0.5}
        castShadow
        position={[1, 2, 3]}
      />
      <hemisphereLight intensity={0.5} />
      <Effects />
    </>
  );
}

function Floor() {
  return (
    <>
      <Svg
        scale={0.02}
        position={[-6, floorDepth, 5]}
        rotation={[Math.PI / 2, 0, 0]}
        src={"images/vtes.svg"}
        castShadow
        receiveShadow
      />

      <Environment resolution={1080}>
        <Lightformer
          color="#800"
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, -9]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          color="#800"
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, -6]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-x={Math.PI / 2}
          position={[0, 4, -3]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-x={Math.PI / 2}
          position={[0, 4, 0]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-x={Math.PI / 2}
          position={[0, 4, 3]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-x={Math.PI / 2}
          position={[0, 4, 6]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-x={Math.PI / 2}
          position={[0, 4, 9]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-y={Math.PI / 2}
          position={[-50, 2, 0]}
          scale={[100, 2, 1]}
        />
        <Lightformer
          intensity={2}
          color="#800"
          rotation-y={-Math.PI / 2}
          position={[50, 2, 0]}
          scale={[100, 2, 1]}
        />
        <Lightformer
          form="ring"
          color="#800"
          intensity={10}
          scale={2}
          position={[10, 5, 10]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>
    </>
  );
}

function Page() {
  const orientation = useOrientation();

  return (
    <div className="overflow-y-hidden">
      <div className="w-screen h-screen">
        {orientation === "landscape" ? (
          <Canvas
            gl={{ logarithmicDepthBuffer: true, antialias: false }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 15], fov: 25 }}
          >
            <color attach="background" args={["#15151a"]} />
            <fog attach="fog" args={["#800", 10, 70]} />

            <Light />
            <Floor />
            <ContactShadows
              resolution={1920}
              position={[0, floorDepth + 0.1, 0]}
              scale={15}
              blur={0.25}
              opacity={0.6}
              far={20}
            />
            <Card
              front="textures/44magnum.jpg"
              rotation={[Math.PI / 2, Math.PI / 2, 0]}
            />

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 2.2}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Canvas>
        ) : (
          <div>Please change the device to landscape</div>
        )}
      </div>
      {/* <div className="bg-slate-500 overflow-y-hidden">
        <h3>Welcome Home!</h3>
      </div> */}
    </div>
  );
}
