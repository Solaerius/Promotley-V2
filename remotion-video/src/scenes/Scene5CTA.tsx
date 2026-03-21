import React from "react";
import { loadFont as loadFontSora } from "@remotion/google-fonts/Sora";
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
import { loadFont as loadFontSG } from "@remotion/google-fonts/SpaceGrotesk";
import { C, FONT, GRADIENT_PRIMARY } from "../theme";

loadFont("normal", { weights: ["700", "600", "300"] });
loadFontSG("normal", { weights: ["300", "400", "500"] });
loadFontSora("normal", { weights: ["400", "600"] });

const URL_FONT = "'Sora', sans-serif";

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.9 },
  });

  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headlineSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 135, mass: 0.85 },
  });

  const headlineY = interpolate(headlineSpring, [0, 1], [36, 0]);
  const headlineScale = interpolate(headlineSpring, [0, 1], [0.92, 1]);

  const todaySpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 16, stiffness: 130, mass: 0.85 },
  });

  const todayY = interpolate(todaySpring, [0, 1], [24, 0]);
  const todayScale = interpolate(todaySpring, [0, 1], [0.94, 1]);

  const badgeOpacity = interpolate(frame, [28, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeY = interpolate(frame, [28, 44], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlSpring = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 22, stiffness: 145, mass: 0.9 },
  });

  const urlY = interpolate(urlSpring, [0, 1], [24, 0]);
  const urlOpacity = interpolate(frame, [40, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(
    Math.sin((frame / 105) * Math.PI * 2),
    [-1, 1],
    [0.92, 1.08]
  );

  return (
    <AbsoluteFill
      style={{
        background: GRADIENT_PRIMARY,
        opacity: fadeIn,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 520,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
          filter: "blur(160px)",
          top: "2%",
          left: "8%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 380,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.22)",
          filter: "blur(140px)",
          bottom: "4%",
          right: "5%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 620,
          height: 240,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          filter: "blur(100px)",
          left: "50%",
          bottom: 130,
          transform: `translateX(-50%) scale(${glowPulse})`,
          pointerEvents: "none",
        }}
      />

      {/* Main centered content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 48,
            backgroundColor: "#000000",
            boxShadow:
              "0 14px 56px rgba(0,0,0,0.44), 0 0 0 1px rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${logoSpring})`,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 146, height: 146, objectFit: "contain" }}
          />
        </div>

        {/* Headline */}
        <div style={{ marginTop: 34 }}>
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 150,
              fontWeight: 700,
              color: C.white,
              margin: 0,
              lineHeight: 0.94,
              letterSpacing: "-2px",
              transform: `translateY(${headlineY}px) scale(${headlineScale})`,
              opacity: headlineSpring,
            }}
          >
            Start free
          </h1>

          <h1
            style={{
              fontFamily: FONT,
              fontSize: 150,
              fontWeight: 700,
              color: "rgba(255,255,255,0.86)",
              margin: "2px 0 0",
              lineHeight: 0.94,
              letterSpacing: "-5px",
              transform: `translateY(${todayY}px) scale(${todayScale})`,
              opacity: todaySpring,
            }}
          >
            today.
          </h1>
        </div>

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "14px 30px",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.24)",
            marginTop: 34,
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "1.8px",
              textTransform: "uppercase",
            }}
          >
            No credit card required to start
          </span>
        </div>

        {/* URL */}
        <p 
         style={{ 
          fontFamily: URL_FONT,
          fontSize: 50,
          fontWeight: 600,
          color: "rgba(255,255,255,0.94)",
          marginTop: 34,
          marginBottom: 0,
          letterSpacing: "-0.6px",
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
          textTransform: "lowercase",
          }}
        >
          promotley.se
        </p>
        
      </div>
    </AbsoluteFill>
  );
}; 