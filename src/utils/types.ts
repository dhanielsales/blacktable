import * as THREE from "three";

export interface BasicObject {
  scale?:
    | THREE.Vector3
    | [x: number, y: number, z: number]
    | Readonly<
        number | THREE.Vector3 | [x: number, y: number, z: number] | undefined
      >;
  position?:
    | THREE.Vector3
    | [x: number, y: number, z: number]
    | Readonly<
        number | THREE.Vector3 | [x: number, y: number, z: number] | undefined
      >;
  rotation?:
    | THREE.Euler
    | [x: number, y: number, z: number, order?: THREE.EulerOrder | undefined]
    | Readonly<
        | number
        | THREE.Euler
        | [
            x: number,
            y: number,
            z: number,
            order?: THREE.EulerOrder | undefined,
          ]
        | undefined
      >;
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
