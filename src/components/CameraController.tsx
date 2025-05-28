import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { CAMERA_SETTINGS, type CameraOptions } from "@/consts";

export function CameraController({
  position,
  cameraOption,
  lookAt,
  fov,
}: {
  position: [number, number, number];
  cameraOption?: CameraOptions;
  lookAt?: [number, number, number];
  fov?: number;
}) {
  const { camera } = useThree();

  const target = useMemo(
    () =>
      (lookAt as [number, number, number]) ||
      (cameraOption ? CAMERA_SETTINGS[cameraOption].value : [0, 0, 0]),
    [lookAt, cameraOption]
  );

  const effectiveFov =
    cameraOption && CAMERA_SETTINGS[cameraOption]
      ? CAMERA_SETTINGS[cameraOption].fov
      : fov !== undefined
        ? fov
        : (camera as THREE.PerspectiveCamera).fov;

  const desired = useRef(new THREE.Vector3(...position));
  const lookAtVec = useRef(new THREE.Vector3(...target));
  const lookAtTarget = useRef(new THREE.Vector3(...target));
  const desiredFov = useRef(effectiveFov);

  useEffect(() => {
    desired.current.set(...position);
  }, [position]);

  useEffect(() => {
    lookAtTarget.current.set(...target);
  }, [target]);

  useEffect(() => {
    desiredFov.current = effectiveFov;
  }, [effectiveFov]);

  useFrame(() => {
    camera.position.lerp(desired.current, 0.08);
    lookAtVec.current.lerp(lookAtTarget.current, 0.08);
    camera.lookAt(lookAtVec.current);

    // Animate FOV only if camera is PerspectiveCamera
    if (camera instanceof THREE.PerspectiveCamera) {
      if (camera.fov !== desiredFov.current) {
        camera.fov += (desiredFov.current - camera.fov) * 0.08;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
