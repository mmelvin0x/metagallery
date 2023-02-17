import { FC, useRef, useState } from "react";
import { Exhibit } from "../../models";
import { Image, Text, useCursor } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Color, TextureLoader } from "three";
import { NextRouter } from "next/router";
import { useAppState } from "hooks/useAppState";

interface ExhibitFrameProps {
  exhibit: Exhibit;
  position: any;
  router: NextRouter;
  color?: Color;
  emissiveColor?: Color;
  emissiveIntensity?: number;
}

export const ExhibitFrame: FC<ExhibitFrameProps> = ({
  exhibit,
  position,
  router,
  color = new Color("silver"),
  emissiveColor = new Color("silver"),
  emissiveIntensity = 0.15,
}) => {
  const frame = useRef<any>();
  const image = useRef<any>();
  const [hovered, setHovered] = useState(false);
  const mask = useLoader(TextureLoader, "./assets/mask.png");
  const { setSelectedExhibit } = useAppState();

  const onExhibitClicked = (id: number) => {
    setSelectedExhibit(exhibit);
    router.push(`/exhibit/${exhibit.id}`);
  };

  useCursor(hovered);

  return (
    <group position={position}>
      <mesh
        onClick={() => onExhibitClicked(exhibit.id)}
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
          position={[0, -0.525, 3]}
          fontSize={0.04}
          textAlign={"center"}
        >
          Items: {exhibit.mints.length}
        </Text>

        <Text
          maxWidth={1}
          anchorX="center"
          anchorY="bottom"
          position={[0, 0.6, 0]}
          fontSize={0.05}
          textAlign={"center"}
        >
          {exhibit.title}
        </Text>

        <Text
          maxWidth={1}
          anchorX="center"
          anchorY="bottom"
          position={[0, 0.525, 0]}
          fontSize={0.04}
          textAlign={"center"}
        >
          Curator: {exhibit.curator}
        </Text>

        {hovered && (
          <>
            <mesh
              raycast={() => null}
              rotation={[0, -Math.PI / 2, 0]}
              position={[0, 0, 0.2]}
            >
              <boxGeometry />
              <meshStandardMaterial
                attachArray={"material"}
                map={mask}
                opacity={0.7}
                transparent={true}
              />
            </mesh>
            <Text
              maxWidth={0.9}
              raycast={() => null}
              anchorX="center"
              anchorY="middle"
              position={[0, 0, 0.7]}
              fontSize={0.04}
              textAlign={"center"}
            >
              {exhibit.description}
            </Text>
          </>
        )}

        <Image
          ref={image}
          raycast={() => null}
          position={[0, 0, 0.7]}
          url={exhibit.coverPhoto}
        />
      </mesh>
    </group>
  );
};
