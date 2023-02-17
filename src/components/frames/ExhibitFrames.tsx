import { FC } from "react";
import { Exhibit } from "../../models";
import { useThree } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import { ExhibitFrame } from "./ExhibitFrame";
import { NextRouter } from "next/router";
import { UserExhibitFrame } from "./UserExhibitFrame";

interface ExhibitFramesProps {
  exhibits: Exhibit[];
  router: NextRouter;
  w?: number;
  gap?: number;
}

export const ExhibitFrames: FC<ExhibitFramesProps> = ({
  exhibits = [],
  router,
  w = 1,
  gap = 0.25,
}) => {
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls
      horizontal
      damping={10}
      pages={(width - xW + (exhibits.length + 1) * xW) / width}
    >
      <Scroll>
        {exhibits?.length && (
          <UserExhibitFrame position={[0, 0, 0]} router={router} />
        )}
        {exhibits.map((exhibit, i) => (
          <ExhibitFrame
            key={i}
            position={[(i + 1) * xW, 0, 0]}
            exhibit={exhibit}
            router={router}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
};
