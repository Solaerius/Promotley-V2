import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3BrandIntro } from "./scenes/Scene3ProductIntro";
import { Scene4Connect } from "./scenes/Scene4HowItWorks";
import { SceneDashboard } from "./scenes/SceneDashboard";
import { SceneResult } from "./scenes/SceneResult";
import { Scene7CTA } from "./scenes/Scene5CTA";

// 30 fps × 30 s = 900 frames — 9:16 (1080 × 1920) social-first format
//
// Scene 1:  0–90     (3 s) — Hook: declining engagement
// Scene 2:  90–195   (3.5 s) — Problem recognition
// Scene 3:  195–285  (3 s)   — Brand intro: Promotely UF
// Scene 4:  285–435  (5 s)   — Connect your social media + platform orbit
// Scene 5:  435–645  (7 s)   — Dashboard demo + zoom into AI tools
// Scene 6:  645–795  (5 s)   — Cursor click + AI result reveal
// Scene 7:  795–900  (3.5 s) — CTA: Start free today

export const PromotelyCommercial: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0508" }}>
      <Sequence from={0}   durationInFrames={90}  premountFor={30}><Scene1Hook /></Sequence>
      <Sequence from={90}  durationInFrames={105} premountFor={30}><Scene2Problem /></Sequence>
      <Sequence from={195} durationInFrames={90}  premountFor={30}><Scene3BrandIntro /></Sequence>
      <Sequence from={285} durationInFrames={150} premountFor={30}><Scene4Connect /></Sequence>
      <Sequence from={435} durationInFrames={210} premountFor={30}><SceneDashboard /></Sequence>
      <Sequence from={645} durationInFrames={150} premountFor={30}><SceneResult /></Sequence>
      <Sequence from={795} durationInFrames={105} premountFor={30}><Scene7CTA /></Sequence>
    </AbsoluteFill>
  );
};
