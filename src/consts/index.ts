export type CameraOptions = "lookAtTable" | "lookAtCenter";

export const CAMERA_SETTINGS: Record<
  CameraOptions,
  { value: [number, number, number]; fov: number }
> = {
  lookAtTable: { value: [0, -20, 0], fov: 65 },
  lookAtCenter: { value: [0, 0, 0], fov: 75 },
};
