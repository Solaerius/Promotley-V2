import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { C, FONT } from "../theme";

loadFont("normal", { weights: ["700", "600", "400"] });

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const line1Spring = spring({ frame, fps, config: { damping: 20, stiffness: 180, mass: 0.8 } });
  const line1Y      = interpolate(line1Spring, [0, 1], [60, 0]);

  const line2Spring = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 20, stiffness: 160 } });
  const line2Y      = interpolate(line2Spring, [0, 1], [40, 0]);

  const line3Spring = spring({ frame: Math.max(0, frame - 38), fps, config: { damping: 20, stiffness: 140 } });
  const line3Y      = interpolate(line3Spring, [0, 1], [30, 0]);

  const glowIntensity = interpolate(frame, [50, 80, 95], [0, 0.22, 0.14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "marketing fails." emphasis — brief scale-up punch at peak visibility (≈frame 62)
  // gives the key line one moment of weight before the scene exits
  const failsPulse = interpolate(frame, [62, 68, 76, 84], [1, 1.038, 1.012, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Slow ambient drift — glow orb moves so the background feels alive, not frozen
  const glowDriftX = interpolate(frame, [0, durationInFrames], [-40, 80],
    { extrapolateRight: "clamp" });
  const glowDriftY = interpolate(frame, [0, durationInFrames], [0, -30],
    { extrapolateRight: "clamp" });
  const glowPulse = 1 + 0.05 * Math.sin((frame / fps) * Math.PI);

  // Secondary accent glow (top-left) fades in with the scene
  const accentGlow = interpolate(frame, [20, 60], [0, 0.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0508",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      {/* Primary glow — drifts slowly */}
      <div style={{ position: "absolute", width: 1100, height: 500, borderRadius: "50%",
        background: `hsl(9,90%,40%,${glowIntensity})`, filter: "blur(160px)",
        top: "50%", left: "50%",
        transform: `translate(calc(-50% + ${glowDriftX}px), calc(-50% + ${glowDriftY}px)) scale(${glowPulse})`,
        pointerEvents: "none" }} />
      {/* Accent glow — top left, wine colour */}
      <div style={{ position: "absolute", width: 600, height: 280, borderRadius: "50%",
        background: `rgba(149,42,94,${accentGlow})`, filter: "blur(130px)",
        top: "8%", left: "5%", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center", width: "100%" }}>

        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.mutedFg,
          letterSpacing: "5px", textTransform: "uppercase", marginBottom: 52,
          opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
          Sound familiar?
        </div>

        <h1 style={{ fontFamily: FONT, fontSize: 130, fontWeight: 700, color: C.white,
          margin: 0, lineHeight: 1.02, letterSpacing: "-5px",
          transform: `translateY(${line1Y}px)`, opacity: line1Spring }}>
          Everyone knows
        </h1>

        <h2 style={{ fontFamily: FONT, fontSize: 112, fontWeight: 600,
          color: "rgba(255,255,255,0.50)", margin: "10px 0 0", lineHeight: 1.02,
          letterSpacing: "-4px", transform: `translateY(${line2Y}px)`, opacity: line2Spring }}>
          the feeling when
        </h2>

        <h2 style={{ fontFamily: FONT, fontSize: 112, fontWeight: 700, color: C.orange,
          margin: "8px 0 0", lineHeight: 1.02, letterSpacing: "-4px",
          transform: `translateY(${line3Y}px) scale(${failsPulse})`,
          opacity: line3Spring }}>
          marketing fails.
        </h2>
      </div>
    </AbsoluteFill>
  );
};
