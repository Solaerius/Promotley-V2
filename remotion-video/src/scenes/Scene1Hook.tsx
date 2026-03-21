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

const EyeIcon: React.FC = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const METRICS = [
  { icon: <EyeIcon />, label: "3 views", enterFrame: 24 },
  { icon: "❤️", label: "0 likes", enterFrame: 34 },
  { icon: "💬", label: "0 comments", enterFrame: 44 },
];

export const Scene1Hook: React.FC = () => {
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

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 220, mass: 0.7 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [80, 0]);

  const andSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 18, stiffness: 170, mass: 0.8 },
  });
  const andY = interpolate(andSpring, [0, 1], [26, 0]);

  const nobodySpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 18, stiffness: 165, mass: 0.85 },
  });
  const nobodyY = interpolate(nobodySpring, [0, 1], [42, 0]);

  const metricsOpacity = interpolate(frame, [22, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const againOpacity = interpolate(frame, [60, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const againY = interpolate(frame, [60, 74], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const againScale = interpolate(frame, [60, 74], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(
    Math.sin((frame / durationInFrames) * Math.PI * 2),
    [-1, 1],
    [0.92, 1.08]
  );

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
        overflow: "hidden",
      }}
    >
      {/* Primary glow — uses pulse scale + slow X drift */}
      <div
        style={{
          position: "absolute",
          width: 950,
          height: 480,
          borderRadius: "50%",
          background: "hsl(344,60%,22%,0.20)",
          filter: "blur(150px)",
          top: "40%",
          left: "50%",
          transform: `translate(calc(-50% + ${interpolate(frame, [0, durationInFrames], [-50, 50], { extrapolateRight: "clamp" })}px), -50%) scale(${pulse})`,
          pointerEvents: "none",
        }}
      />
      {/* Secondary accent — orange, fades in with the "Again." beat */}
      <div
        style={{
          position: "absolute",
          width: 480,
          height: 220,
          borderRadius: "50%",
          background: "rgba(238,89,61,0.08)",
          filter: "blur(120px)",
          top: "62%",
          left: "52%",
          opacity: interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 650,
          height: 220,
          borderRadius: "50%",
          background: "rgba(238,89,61,0.10)",
          filter: "blur(90px)",
          bottom: 120,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontFamily: FONT,
            fontSize: 180,
            fontWeight: 700,
            color: C.white,
            margin: 0,
            lineHeight: 0.96,
            letterSpacing: "-7px",
            transform: `translateY(${titleY}px)`,
            opacity: titleSpring,
          }}
        >
          You post.
        </h1>

        <h2
          style={{
            fontFamily: FONT,
            fontSize: 54,
            fontWeight: 500,
            color: "rgba(255,255,255,0.24)",
            margin: "44px 0 0",
            lineHeight: 1,
            letterSpacing: "2px",
            textTransform: "uppercase",
            transform: `translateY(${andY}px)`,
            opacity: andSpring,
          }}
        >
          and
        </h2>

        <h2
          style={{
            fontFamily: FONT,
            fontSize: 102,
            fontWeight: 600,
            color: "rgba(255,255,255,0.30)",
            margin: "10px 0 0",
            lineHeight: 1.04,
            letterSpacing: "-3px",
            transform: `translateY(${nobodyY}px)`,
            opacity: nobodySpring,
          }}
        >
          Nobody sees it.
        </h2>

        <div
          style={{
            display: "flex",
            gap: 56,
            marginTop: 68,
            alignItems: "center",
            justifyContent: "center",
            opacity: metricsOpacity,
          }}
        >
          {METRICS.map(({ icon, label, enterFrame }) => {
            const p = interpolate(frame, [enterFrame, enterFrame + 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const y = interpolate(p, [0, 1], [26, 0]);
            const scale = interpolate(p, [0, 1], [0.94, 1]);

            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  opacity: p,
                  transform: `translateY(${y}px) scale(${scale})`,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: "14px 20px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.20)",
                }}
              >
                <span
                  style={{
                    fontSize: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                  }}
                >
                  {icon}
                </span>

                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 40,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.34)",
                    letterSpacing: "-1.2px",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 78,
            fontWeight: 700,
            color: C.orange,
            marginTop: 54,
            letterSpacing: "-2.5px",
            opacity: againOpacity,
            transform: `translateY(${againY}px) scale(${againScale * pulse})`,
            textShadow: "0 0 28px rgba(238,89,61,0.18)",
          }}
        >
          Again.
        </p>
      </div>
    </AbsoluteFill>
  );
};