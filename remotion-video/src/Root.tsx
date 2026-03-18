import React from "react";
import { Composition } from "remotion";
import { PromotelyCommercial } from "./Video";

// 1920×1080 — standard YouTube / widescreen format
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PromotelyCommercial"
      component={PromotelyCommercial}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
