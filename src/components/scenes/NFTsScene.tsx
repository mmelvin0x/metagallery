import { Html, MeshReflectorMaterial } from "@react-three/drei";
import { FC, useMemo, useState } from "react";
import { Exhibit, NFT, Project } from "../../models";
import { NFTFrames } from "../frames";
import { NextRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendCLX } from "../../utils";
import { CanvasLayout } from "../layout";
import { TwitterShareButton } from "react-twitter-embed";
import { QrcodeOutline } from "heroicons-react";
import { useAppState } from "hooks/useAppState";

interface NFTGalleryProps {
  nfts: NFT[];
  router: NextRouter;
  project: Project;
  exhibit?: Exhibit;
}

export const NFTsScene: FC<NFTGalleryProps> = ({
  nfts,
  exhibit,
  router,
  project,
}) => {
  const { publicKey } = useWallet();
  const { selectedNft } = useAppState();
  const [isUserWalletRoute, setIsUserWalletRoute] = useState<boolean>(false);

  const onClickClick = async () => {
    const { id } = router.query;
    if (publicKey && id) {
      await sendCLX(publicKey.toString(), id.toString());
    }
  };

  useMemo(
    () => setIsUserWalletRoute(router.route.includes("user-exhibit")),
    [router]
  );

  return (
    <CanvasLayout loader={true}>
      <group position={[0, -0.4, 3.5]}>
        <NFTFrames nfts={nfts} />

        {!selectedNft && (
          <Html center position={[0, -1, -1]}>
            <div className="flex flex-col items-center z-10">
              <div className="flex w-96 items-center justify-center text-2xl mb-5">
                <button
                  onClick={() => router.push("/")}
                  className="btn btn-outline btn-circle mx-3"
                >
                  back
                </button>

                {isUserWalletRoute && (
                  <label
                    htmlFor={"connect-modal"}
                    className="btn btn-outline btn-circle mx-3"
                  >
                    <QrcodeOutline />
                  </label>
                )}

                {exhibit && (
                  <button
                    disabled
                    onClick={() => onClickClick()}
                    className="btn btn-outline btn-circle mx-3"
                  >
                    +1
                  </button>
                )}
              </div>

              {exhibit && project && (
                <TwitterShareButton
                  url={""}
                  options={{
                    text: `✨ Check out this exhibition in the ${project.twitterHandle} MetaGallery! ✨\n\n“${exhibit.title}” - curated by ${exhibit.curator}\n\n`,
                  }}
                />
              )}
            </div>
          </Html>
        )}

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
};
