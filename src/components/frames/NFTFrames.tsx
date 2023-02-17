import { FC } from "react";
import { NFT } from "../../models";
import { useThree } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import { NFTFrame } from "./NFTFrame";

interface NFTFramesProps {
  nfts: NFT[];
  w?: number;
  gap?: number;
}

export const NFTFrames: FC<NFTFramesProps> = ({
  nfts = [],
  w = 1,
  gap = 0.25,
}) => {
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls
      horizontal
      damping={10}
      pages={(width - xW + nfts.length * xW) / width}
    >
      <Scroll>
        {nfts.map((nft, i) => (
          <NFTFrame key={i} position={[i * xW, 0, 0]} nft={nft} />
        ))}
      </Scroll>
    </ScrollControls>
  );
};
