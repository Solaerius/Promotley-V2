import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3BrandIntro } from "./scenes/Scene3ProductIntro";
import { Scene4Connect } from "./scenes/Scene4HowItWorks";
import { SceneDashboard } from "./scenes/SceneDashboard";
import { SceneResult } from "./scenes/SceneResult";
import { Scene7CTA } from "./scenes/Scene5CTA";

// 30 fps × 30 s = 900 frames — 1920×1080 widescreen format
//
// Scene 1:  0–105    (3.5 s) — Problem recognition: "Everyone knows the feeling..."
// Scene 2:  105–195  (3 s)   — Hook: "You post. Nobody sees it."
// Scene 3:  195–285  (3 s)   — Brand intro: Promotley UF
// Scene 4:  285–435  (5 s)   — Connect your social media + platform orbit
// Scene 5:  435–645  (7 s)   — Dashboard demo + zoom into AI tools
// Scene 6:  645–795  (5 s)   — Cursor click + AI result reveal
// Scene 7:  795–900  (3.5 s) — CTA: Start free today

// ─────────────────────────────────────────────────────────────────────────────
// Custom transition overlays — one unique design per cut point.
// Each runs as an independent Sequence over the cut, no timing changes.
// ─────────────────────────────────────────────────────────────────────────────

// Cut 1 (frame 105): Problem → Hook
// "marketing fails." orange was building to a peak. An orange radial burst
// expands from center, echoing that color, then fades into the Hook's dark.
const T1_ProblemToHook: React.FC = () => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, 14], [0, 1700], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const op = interpolate(frame, [0, 3, 9, 14], [0, 0.72, 0.42, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        left: 960 - r, top: 540 - r, width: r * 2, height: r * 2,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(238,89,61,0.62) 0%, rgba(149,42,94,0.22) 50%, transparent 78%)",
        opacity: op,
      }} />
    </AbsoluteFill>
  );
};

// Cut 2 (frame 195): Hook → Brand intro
// "Again." orange glows at bottom-center of Hook. A brilliant white+warm bloom
// fires from that position, expanding upward — the brand ignites into the
// diagonal gradient background of Scene3.
const T2_HookToBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, 14], [0, 2100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const op = interpolate(frame, [0, 2, 8, 14], [0, 1, 0.58, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Origin at "Again." — approx bottom-center of the Hook scene
  const OX = 960, OY = 880;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        left: OX - r, top: OY - r, width: r * 2, height: r * 2,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.94) 0%, rgba(238,89,61,0.48) 28%, rgba(149,42,94,0.20) 58%, transparent 80%)",
        opacity: op,
      }} />
    </AbsoluteFill>
  );
};

// Cut 3 (frame 285): Brand intro → Connect
// The diagonal gradient background lifts upward like a theatre curtain, cleanly
// revealing the pure black beneath — a confident contrast cut into the
// "simply connect your social media" scene.
const T3_BrandToConnect: React.FC = () => {
  const frame = useCurrentFrame();
  const curtainY = interpolate(frame, [0, 14], [0, -1080], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const op = interpolate(frame, [0, 2, 12, 14], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        top: curtainY, left: 0, right: 0, height: 1080,
        background:
          "linear-gradient(135deg, hsl(344,55%,12%) 0%, hsl(331,65%,28%) 40%, hsl(9,85%,48%) 100%)",
        opacity: op,
      }} />
    </AbsoluteFill>
  );
};

// Cut 4 (frame 435): Connect → Dashboard
// The platform icons' horizon glow line flares into a single bright brand bar at
// y≈655 — "all platforms connected" — then the bar shrinks as the dashboard
// slides up from below. Reinforces the narrative bridge.
const T4_ConnectToDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const barH = interpolate(frame, [0, 4, 14], [0, 14, 2], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const barOp = interpolate(frame, [0, 2, 10, 14], [0, 0.92, 0.60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const glowOp = interpolate(frame, [0, 3, 14], [0, 0.48, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        top: 655 - barH / 2, left: 0, right: 0, height: barH,
        background:
          "linear-gradient(90deg, transparent 1%, rgba(149,42,94,0.88) 18%, rgba(238,89,61,0.96) 50%, rgba(149,42,94,0.88) 82%, transparent 99%)",
        filter: "blur(1px)",
        opacity: barOp,
      }} />
      <div style={{
        position: "absolute",
        top: 500, left: 200, right: 200, height: 310,
        borderRadius: "50%",
        background: "rgba(149,42,94,0.20)",
        filter: "blur(90px)",
        opacity: glowOp,
      }} />
    </AbsoluteFill>
  );
};

// Cut 5 (frame 645): Dashboard → Result
// The cursor click at (62, 706) in SceneDashboard fires a magenta radial expansion
// that floods the screen — as if the button click "opens" the Result view.
// Origin exactly matches the cursor click point.
const T5_DashboardToResult: React.FC = () => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, 14], [0, 2500], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const op = interpolate(frame, [0, 2, 9, 14], [0, 0.85, 0.52, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const CX = 62, CY = 706;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        left: CX - r, top: CY - r, width: r * 2, height: r * 2,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(149,42,94,0.78) 0%, rgba(238,89,61,0.32) 48%, transparent 74%)",
        opacity: op,
      }} />
    </AbsoluteFill>
  );
};

// Cut 6 (frame 795): Result → CTA
// The "Schedule All →" gradient button at (x≈1640, y≈527) floods the entire canvas
// with GRADIENT_PRIMARY. The button literally *becomes* the CTA scene background.
// This is the strongest transition — action → reward.
const T6_ResultToCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, 14], [0, 2700], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const op = interpolate(frame, [0, 2, 9, 14], [0, 1, 0.88, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // "Schedule All →" center: right column (880→1920), y≈527
  const BX = 1640, BY = 527;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        left: BX - r, top: BY - r, width: r * 2, height: r * 2,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, hsl(9,90%,56%) 0%, hsl(331,70%,45%) 28%, hsl(344,60%,35%) 58%, transparent 84%)",
        opacity: op,
      }} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const PromotelyCommercial: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0508" }}>

      {/* ── Scenes ── */}
      <Sequence from={0}   durationInFrames={105} premountFor={30}><Scene2Problem /></Sequence>
      <Sequence from={105} durationInFrames={90}  premountFor={30}><Scene1Hook /></Sequence>
      <Sequence from={195} durationInFrames={90}  premountFor={30}><Scene3BrandIntro /></Sequence>
      <Sequence from={285} durationInFrames={150} premountFor={30}><Scene4Connect /></Sequence>
      <Sequence from={435} durationInFrames={210} premountFor={30}><SceneDashboard /></Sequence>
      <Sequence from={645} durationInFrames={150} premountFor={30}><SceneResult /></Sequence>
      <Sequence from={795} durationInFrames={105} premountFor={30}><Scene7CTA /></Sequence>

      {/* ── Unique custom transitions — one per cut point ── */}
      <Sequence from={98}  durationInFrames={14}><T1_ProblemToHook /></Sequence>
      <Sequence from={188} durationInFrames={14}><T2_HookToBrand /></Sequence>
      <Sequence from={278} durationInFrames={14}><T3_BrandToConnect /></Sequence>
      <Sequence from={428} durationInFrames={14}><T4_ConnectToDashboard /></Sequence>
      <Sequence from={638} durationInFrames={14}><T5_DashboardToResult /></Sequence>
      <Sequence from={788} durationInFrames={14}><T6_ResultToCTA /></Sequence>

    </AbsoluteFill>
  );
};
