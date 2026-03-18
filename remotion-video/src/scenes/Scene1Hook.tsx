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

const METRICS = [
  { icon: "👁", label: "3 views",    enterFrame: 20 },
  { icon: "❤️",  label: "0 likes",   enterFrame: 32 },
  { icon: "💬", label: "0 comments", enterFrame: 44 },
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const titleSpring  = spring({ frame, fps, config: { damping: 18, stiffness: 220, mass: 0.6 } });
  const titleY       = interpolate(titleSpring, [0, 1], [70, 0]);

  const nobodySpring = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 18, stiffness: 180 } });
  const nobodyY      = interpolate(nobodySpring, [0, 1], [40, 0]);

  const againOpacity = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const againY       = interpolate(frame, [58, 72], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      <div style={{ position: "absolute", width: 900, height: 450, borderRadius: "50%",
        background: "hsl(344,60%,22%,0.18)", filter: "blur(140px)", top: "40%", left: "50%",
        transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center", width: "100%" }}>

        <h1 style={{ fontFamily: FONT, fontSize: 180, fontWeight: 700, color: C.white,
          margin: 0, lineHeight: 1, letterSpacing: "-7px",
          transform: `translateY(${titleY}px)`, opacity: titleSpring }}>
          You post.
        </h1>

        <h2 style={{ fontFamily: FONT, fontSize: 96, fontWeight: 600,
          color: "rgba(255,255,255,0.28)", margin: "14px 0 0", lineHeight: 1.1,
          letterSpacing: "-3px", transform: `translateY(${nobodyY}px)`, opacity: nobodySpring }}>
          Nobody sees it.
        </h2>

        {/* Metrics — horizontal row for landscape */}
        <div style={{ display: "flex", gap: 64, marginTop: 64, alignItems: "center",
          justifyContent: "center" }}>
          {METRICS.map(({ icon, label, enterFrame }) => {
            const p = interpolate(frame, [enterFrame, enterFrame + 14], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 20,
                opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>
                <span style={{ fontSize: 52 }}>{icon}</span>
                <span style={{ fontFamily: FONT, fontSize: 52, fontWeight: 600,
                  color: "rgba(255,255,255,0.30)", letterSpacing: "-1.5px" }}>{label}</span>
              </div>
            );
          })}
        </div>

        <p style={{ fontFamily: FONT, fontSize: 72, fontWeight: 700, color: C.orange,
          marginTop: 56, letterSpacing: "-2px", opacity: againOpacity,
          transform: `translateY(${againY}px)` }}>
          Again.
        </p>
      </div>
    </AbsoluteFill>
  );
};
