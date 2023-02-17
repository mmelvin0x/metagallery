import { FC, Suspense } from "react";
import { Loader } from "./Loader";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export const CanvasLayout: FC<{ loader: boolean }> = (props) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Suspense fallback={props.loader ? <Loader /> : null}>
        <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 0, 15]} />
          <Environment preset="city" />
          {props.children}
        </Canvas>
      </Suspense>
    </div>
  );
};
