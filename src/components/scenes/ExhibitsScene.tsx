import { MeshReflectorMaterial } from "@react-three/drei";
import { FC } from "react";
import { Exhibit } from "../../models";
import { ExhibitFrames } from "../frames";
import { NextRouter } from "next/router";
import { CanvasLayout } from "../layout";

interface ExhibitsSceneProps {
  exhibits: Exhibit[];
  router: NextRouter;
}

export const ExhibitsScene: FC<ExhibitsSceneProps> = ({ exhibits, router }) => (
  <CanvasLayout loader={true}>
    <group position={[0, -0.4, 3.5]}>
      <ExhibitFrames exhibits={exhibits} router={router} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <planeGeometry args={[50, 50]} />
        {/*@ts-ignore*/}
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.5}
          mirror={0}
          alphaWrite={undefined}
          refractionRatio={undefined}
        />
      </mesh>
    </group>
  </CanvasLayout>
);
