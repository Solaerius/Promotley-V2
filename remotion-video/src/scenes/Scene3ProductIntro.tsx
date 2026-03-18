import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { C, FONT, GRADIENT_DIAGONAL } from "../theme";

loadFont("normal", { weights: ["700", "600", "400"] });

export const Scene3BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const logoSpring  = spring({ frame, fps, config: { damping: 9, stiffness: 120, mass: 0.7 } });
  const logoOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const titleSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 18, stiffness: 160 } });
  const titleY      = interpolate(titleSpring, [0, 1], [50, 0]);

  const ufOpacity      = interpolate(frame, [30, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [48, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{ background: GRADIENT_DIAGONAL, opacity,
        display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* Glow orbs */}
      <div style={{ position: "absolute", width: 800, height: 400, borderRadius: "50%",
        background: "hsl(331,65%,40%,0.28)", filter: "blur(120px)",
        top: "20%", left: "10%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 600, height: 300, borderRadius: "50%",
        background: "hsl(9,90%,55%,0.18)", filter: "blur(120px)",
        bottom: "15%", right: "8%", pointerEvents: "none" }} />

      {/* Two-column landscape layout */}
      <div style={{ display: "flex", alignItems: "center", width: "100%",
        padding: "0 120px", gap: 0, position: "relative", zIndex: 1 }}>

        {/* Left: big logo */}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center",
          justifyContent: "center", paddingRight: 80 }}>
          <div style={{
            width: 260, height: 260, borderRadius: 60,
            backgroundColor: C.bgDark,
            boxShadow: "0 16px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${logoSpring})`, opacity: logoOpacity,
          }}>
            <Img src={staticFile("logo.png")}
              style={{ width: 190, height: 190, objectFit: "contain" }} />
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 320, background: "rgba(255,255,255,0.15)",
          flexShrink: 0, marginRight: 80,
          opacity: interpolate(frame, [14, 28], [0, 1], { extrapolateRight: "clamp" }) }} />

        {/* Right: brand name + tagline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column",
          alignItems: "flex-start", textAlign: "left" }}>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 20,
            transform: `translateY(${titleY}px)`, opacity: titleSpring }}>
            <h1 style={{ fontFamily: FONT, fontSize: 120, fontWeight: 700, color: C.white,
              margin: 0, lineHeight: 1, letterSpacing: "-5px" }}>
              Promotely
            </h1>
            <div style={{ marginTop: 14, padding: "10px 22px", borderRadius: 16,
              background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)",
              opacity: ufOpacity }}>
              <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700,
                color: "rgba(255,255,255,0.90)", letterSpacing: "2px" }}>UF</span>
            </div>
          </div>

          <p style={{ fontFamily: FONT, fontSize: 38, fontWeight: 400,
            color: "rgba(255,255,255,0.72)", marginTop: 24, lineHeight: 1.4,
            letterSpacing: "-0.5px", opacity: taglineOpacity }}>
            AI marketing that actually works.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
