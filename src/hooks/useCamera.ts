import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { CAMERA_SETTINGS, type CameraOptions } from "@/consts";

export type GameCameraConfig = {
  fov?: number;
  position: [number, number, number];
  cameraOption?: CameraOptions;
  lookAt?: [number, number, number];
};

export function useGameCamera({
  fov: initialFov,
  position,
  cameraOption: initialCameraOption,
  lookAt,
}: GameCameraConfig) {
  const { camera } = useThree();
  const [cameraOption, setCameraOption] = useState(initialCameraOption);
  const [fov, setFov] = useState(() => {
    if (initialFov) {
      return initialFov;
    }

    if (cameraOption) {
      return CAMERA_SETTINGS[cameraOption].fov;
    }

    return 55;
  });

  const target = useMemo(
    () =>
      (lookAt as [number, number, number]) ||
      (cameraOption ? CAMERA_SETTINGS[cameraOption].value : [0, 0, 0]),
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

  return {
    camera,
    fov,
    cameraOption,
    setFov,
    setCameraOption,
  };
}
