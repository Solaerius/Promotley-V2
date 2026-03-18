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
import { C, FONT, GRADIENT_PRIMARY } from "../theme";

loadFont("normal", { weights: ["700", "600", "300"] });

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  const logoSpring    = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const logoOpacity   = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const headlineSpring = spring({ frame: Math.max(0, frame - 14), fps,
    config: { damping: 16, stiffness: 130, mass: 0.8 } });
  const headlineScale  = interpolate(headlineSpring, [0, 1], [0.84, 1]);

  const todaySpring = spring({ frame: Math.max(0, frame - 26), fps,
    config: { damping: 16, stiffness: 130, mass: 0.8 } });
  const todayScale  = interpolate(todaySpring, [0, 1], [0.84, 1]);

  const badgeOpacity = interpolate(frame, [34, 50], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const urlSpring = spring({ frame: Math.max(0, frame - 46), fps,
    config: { damping: 22, stiffness: 140 } });
  const urlY      = interpolate(urlSpring, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{ background: GRADIENT_PRIMARY, opacity: fadeIn,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 160px" }}
    >
      {/* Glow overlays */}
      <div style={{ position: "absolute", width: 1000, height: 500, borderRadius: "50%",
        background: "rgba(255,255,255,0.10)", filter: "blur(150px)",
        top: "5%", left: "5%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 700, height: 350, borderRadius: "50%",
        background: "rgba(0,0,0,0.22)", filter: "blur(130px)",
        bottom: "5%", right: "4%", pointerEvents: "none" }} />

      {/* Two-column: logo left, text right */}
      <div style={{ display: "flex", alignItems: "center", width: "100%",
        gap: 0, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ flex: "0 0 auto", paddingRight: 80 }}>
          <div style={{
            width: 220, height: 220, borderRadius: 52,
            backgroundColor: "#000000",
            boxShadow: "0 12px 52px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.16)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${logoSpring})`, opacity: logoOpacity,
          }}>
            <Img src={staticFile("logo.png")}
              style={{ width: 160, height: 160, objectFit: "contain" }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 340, background: "rgba(255,255,255,0.18)",
          flexShrink: 0, marginRight: 80,
          opacity: interpolate(frame, [12, 26], [0, 1], { extrapolateRight: "clamp" }) }} />

        {/* Text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column",
          alignItems: "flex-start" }}>

          <h1 style={{ fontFamily: FONT, fontSize: 152, fontWeight: 700, color: C.white,
            margin: 0, lineHeight: 0.95, letterSpacing: "-7px",
            transform: `scale(${headlineScale})`, opacity: headlineSpring,
            transformOrigin: "left center" }}>
            Start free
          </h1>
          <h1 style={{ fontFamily: FONT, fontSize: 152, fontWeight: 700,
            color: "rgba(255,255,255,0.85)", margin: "4px 0 0", lineHeight: 0.95,
            letterSpacing: "-7px", transform: `scale(${todayScale})`, opacity: todaySpring,
            transformOrigin: "left center" }}>
            today.
          </h1>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10,
            padding: "12px 28px", borderRadius: 9999,
            background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.26)",
            marginTop: 40, opacity: badgeOpacity }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600,
              color: "rgba(255,255,255,0.90)", letterSpacing: "2px",
              textTransform: "uppercase" }}>No credit card required</span>
          </div>

          {/* URL */}
          <p style={{ fontFamily: FONT, fontSize: 48, fontWeight: 300,
            color: "rgba(255,255,255,0.82)", marginTop: 36, letterSpacing: "7px",
            opacity: urlSpring, transform: `translateY(${urlY}px)` }}>
            promotely.se
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
