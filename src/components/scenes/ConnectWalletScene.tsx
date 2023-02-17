import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { CanvasLayout } from "../layout";
import { EthConnectButton } from "components";

export const ConnectWalletScene: FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="absolute z-10 flex flex-col">
        <WalletMultiButton className="btn" />
        <EthConnectButton />
      </div>
      <CanvasLayout loader={false}>
        <group position={[0, -0.4, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={40}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#000000"
              metalness={0.5}
              mirror={0}
              alphaWrite={undefined}
              refractionRatio={undefined}
            />
          </mesh>
        </group>
      </CanvasLayout>
    </div>
  );
};
