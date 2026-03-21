import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { C, FONT, GRADIENT_DIAGONAL } from "../theme";

loadFont("normal", { weights: ["700", "600", "400"] });

export const Scene3BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.8 },
  });

  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const brandSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.9 },
  });

  const brandY = interpolate(brandSpring, [0, 1], [40, 0]);

  const ufOpacity = interpolate(frame, [24, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [38, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [38, 58], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoGlow = interpolate(frame, [0, 24], [0.16, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slow orbit — top-left glow drifts diagonally; bottom-right pulses
  const glow1X = interpolate(frame, [0, durationInFrames], [0, 60],
    { extrapolateRight: "clamp" });
  const glow1Y = interpolate(frame, [0, durationInFrames], [0, -30],
    { extrapolateRight: "clamp" });
  const glow2Scale = 1 + 0.07 * Math.sin((frame / fps) * Math.PI * 1.3);

  // Brand rays — 8 lines shoot outward from logo center once logo has landed
  // Logo center is approx (960, 410) in 1920×1080 canvas
  const RAY_LEN = interpolate(frame, [10, 34], [0, 680], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const RAY_OP = interpolate(frame, [10, 26, 62, durationInFrames - 6], [0, 0.26, 0.12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const LOGO_X = 960;
  const LOGO_Y = 410;

  return (
    <AbsoluteFill
      style={{
        background: GRADIENT_DIAGONAL,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background glow — top-left drifts, bottom-right pulses */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 420,
          borderRadius: "50%",
          background: "hsl(331,65%,40%,0.24)",
          filter: "blur(130px)",
          top: "18%",
          left: "16%",
          transform: `translate(${glow1X}px, ${glow1Y}px)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 340,
          borderRadius: "50%",
          background: "hsl(9,90%,55%,0.18)",
          filter: "blur(120px)",
          bottom: "10%",
          right: "12%",
          transform: `scale(${glow2Scale})`,
          pointerEvents: "none",
        }}
      />

      {/* Brand rays — 8 lines radiating from logo center after logo lands */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: LOGO_X,
          top: LOGO_Y,
          width: RAY_LEN,
          height: 1.5,
          background: "linear-gradient(90deg, rgba(255,255,255,0.55), transparent)",
          transformOrigin: "0 50%",
          transform: `rotate(${i * 45}deg)`,
          opacity: RAY_OP,
          pointerEvents: "none",
        }} />
      ))}

      {/* Centered hero container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        {/* Logo card */}
        <div
          style={{
            width: 250,
            height: 250,
            borderRadius: 56,
            backgroundColor: C.bgDark,
            boxShadow: `0 18px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(255,255,255,${logoGlow})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${logoSpring})`,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: 180, height: 180, objectFit: "contain" }}
          />
        </div>

        {/* Brand lockup */}
        <div
          style={{
            marginTop: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            transform: `translateY(${brandY}px)`,
            opacity: brandSpring,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 126,
              fontWeight: 700,
              color: C.white,
              margin: 0,
              lineHeight: 1,
              letterSpacing: "-5px",
            }}
          >
            Promotley
          </h1>

          <div
            style={{
              marginTop: 8,
              padding: "12px 22px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.24)",
              opacity: ufOpacity,
              boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 30,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "2px",
              }}
            >
              UF
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 400,
            color: "rgba(255,255,255,0.78)",
            marginTop: 26,
            marginBottom: 0,
            lineHeight: 1.35,
            letterSpacing: "-0.6px",
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            maxWidth: 760,
          }}
        >
          AI marketing that actually works.
        </p>
      </div>
    </AbsoluteFill>
  );
};