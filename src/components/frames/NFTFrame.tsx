import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Html, Image, Text, useCursor } from "@react-three/drei";
import { Color, Texture, TextureLoader, VideoTexture } from "three";
import { NFT } from "../../models";
import { shortenAddress, shortenText } from "../../utils";
import { useAppState } from "hooks/useAppState";
import { isSafari, isMobile, isIOS, isMobileSafari } from "react-device-detect";

interface NFTFrameProps {
  nft: NFT;
  position: any;
  color?: Color;
  emissiveColor?: Color;
  emissiveIntensity?: number;
}

export const NFTFrame: FC<NFTFrameProps> = ({
  nft,
  position,
  color = new Color("silver"),
  emissiveColor = new Color("silver"),
  emissiveIntensity = 0.15,
}) => {
  const image = useRef<any>(); // TODO: type these
  const frame = useRef<any>(); // TODO: type these
  const [hovered, setHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState<Texture>();
  const { selectedNft, setSelectedNft } = useAppState();

  const isCompatibleAutoPlayBrowser = useMemo(() => {
    return !(
      (isIOS && isMobile) ||
      (isSafari && isMobile) ||
      isMobileSafari ||
      isMobile
    );
  }, [nft.imageType]);

  const selectThisNft = (nft: NFT | null) => {
    if (selectedNft) {
      setSelectedNft(null);
      setSelectedNft(nft);
    } else {
      setSelectedNft(nft);
    }
  };

  useCursor(hovered);

  useEffect(() => {
    const loader = new TextureLoader();
    const imageType = nft?.imageType || "image";

    switch (imageType) {
      case "image":
      case "html":
      case "Unknown":
        const image = loader.load(nft.image);
        setCurrentImage(image);
        break;

      case "video":
        if (isCompatibleAutoPlayBrowser) {
          const videoEl = document.createElement("video");
          const videoSrc = document.createElement("source");

          videoEl.id = nft.mint;
          videoEl.loop = true;
          videoEl.muted = true;
          videoEl.playsInline = true;
          videoEl.crossOrigin = "anonymous";
          videoSrc.src = nft.image;
          videoEl.style.display = "none";
          videoEl.appendChild(videoSrc);
          document.body.appendChild(videoEl);
          videoEl.play();

          const videoTexture = new VideoTexture(videoEl);
          setCurrentImage(videoTexture);
        } else {
          const image = loader.load("/assets/play-icon.png");
          setCurrentImage(image);
          break;
        }

        break;
    }
  }, [nft.image]);

  return (
    <>
      <group position={position}>
        <mesh
          onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
          onPointerOut={() => setHovered(false)}
          scale={[1, 1, 0.05]}
          position={[0, 1 / 2, 0]}
          onClick={(e) => (e.stopPropagation(), selectThisNft(nft))}
        >
          <boxGeometry />
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.5}
            envMapIntensity={2}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />

          <mesh
            ref={frame}
            raycast={() => null}
            scale={[0.9, 0.9, 0.9]}
            position={[0, 0, 0.2]}
          >
            <boxGeometry />
            <meshBasicMaterial toneMapped={false} fog={false} />
          </mesh>

          {currentImage && (
            <>
              <mesh
                ref={image}
                raycast={() => null}
                rotation={[0, -Math.PI / 2, 0]}
                position={[0, 0, 0.2]}
                scale={0.93}
              >
                <boxGeometry />
                <meshBasicMaterial
                  attachArray={"material"}
                  map={currentImage}
                />
              </mesh>

              {nft.imageType === "html" && !selectedNft && (
                <Html center>
                  <iframe
                    height={256}
                    width={256}
                    src={nft.externalUrl}
                    frameBorder="0"
                  />
                </Html>
              )}

              <Image
                raycast={() => null}
                position={[-0.43, -0.43, 0.7]}
                scale={0.05}
                url={
                  nft.isSolana ? "/assets/solana.png" : "/assets/ethereum.png"
                }
              />
            </>
          )}
        </mesh>

        {nft.name && (
          <Text
            maxWidth={1}
            anchorX="center"
            anchorY="top"
            position={[0, 1.1, 0]}
            fontSize={0.05}
          >
            {nft.name.length > 32 ? shortenText(nft.name, 32) : nft.name}
          </Text>
        )}

        {nft.mint && (
          <Text
            maxWidth={1}
            anchorX={nft.owner ? "left" : "center"}
            anchorY="top"
            position={[nft.owner ? -0.4 : 0, 0.0275, 0.2]}
            fontSize={0.04}
          >
            Mint: {shortenAddress(nft.mint)}
          </Text>
        )}

        {nft.owner && (
          <Text
            maxWidth={1}
            anchorX="right"
            anchorY="top"
            position={[0.4, 0.0275, 0.2]}
            fontSize={0.04}
          >
            Owner: {shortenAddress(nft.owner)}
          </Text>
        )}
      </group>
    </>
  );
};
