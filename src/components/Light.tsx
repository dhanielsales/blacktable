import { Effects, useHelper } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export function Light({
  debug = false,
  color = "#fff000",
  intensity = 0.5,
}: {
  debug?: boolean;
  color?: string | number | THREE.Color;
  intensity?: number;
}) {
  const light = useRef<THREE.DirectionalLightHelper>(null);
  if (debug) {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    useHelper(light as any, THREE.DirectionalLightHelper, 1, "blur");
  }

  return (
    <>
      <ambientLight color={color} intensity={intensity} />
      <directionalLight
        ref={light}
        intensity={intensity}
        castShadow
        position={[1, 2, 3]}
      />
      <hemisphereLight intensity={intensity} />
      <Effects />
    </>
  );
}
