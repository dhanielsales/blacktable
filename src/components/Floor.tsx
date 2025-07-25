import { Svg, Environment, Lightformer } from "@react-three/drei";

export function Floor(props: { floorDepth: number }) {
  return (
    <>
      <Svg
        scale={0.02}
        position={[-6, props.floorDepth, 6.5]}
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
