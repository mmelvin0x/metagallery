import { FC, useRef, useState } from "react";
import { Image, Text, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils } from "three";
import { NextRouter } from "next/router";

interface UserExhibitFrameProps {
  position: any;
  router: NextRouter;
  color?: Color;
  emissiveColor?: Color;
  emissiveIntensity?: number;
}

export const UserExhibitFrame: FC<UserExhibitFrameProps> = ({
  position,
  router,
  color = new Color("silver"),
  emissiveColor = new Color("silver"),
  emissiveIntensity = 0.15,
}) => {
  const frame = useRef<any>();
  const image = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  useFrame((state) => {
    image.current.scale.x = MathUtils.lerp(
      image.current.scale.x,
      0.95 * (hovered ? 0.99 : 1),
      0.1
    );
    image.current.scale.y = MathUtils.lerp(
      image.current.scale.y,
      0.95 * (hovered ? 0.99 : 1),
      0.1
    );
  });

  return (
    <group position={position}>
      <mesh
        onClick={() => router.push(`/user-exhibit`)}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        scale={[1, 1, 0.05]}
        position={[0, 1 / 2, 0]}
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
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>

        <Text
          maxWidth={1}
          anchorX="center"
          anchorY="bottom"
          position={[0, 0.6, 0]}
          fontSize={0.075}
          textAlign={"center"}
        >
          View your NFTs
        </Text>

        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          ref={image}
          raycast={() => null}
          position={[0, 0, 0.7]}
          url="./assets/wallet.png"
        />
      </mesh>
    </group>
  );
};
