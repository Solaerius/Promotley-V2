import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { C, FONT } from "../theme";

loadFont("normal", { weights: ["700", "600", "400"] });

const PLATFORMS = [
  { name: "TikTok", file: "tiktok.png" },
  { name: "Instagram", file: "instagram.png" },
  { name: "Facebook", file: "facebook.png" },
  { name: "LinkedIn", file: "linkedin.png" },
  { name: "YouTube", file: "youtube.png" },
  { name: "X", file: "x.png" },
];

const ICON_SIZE = 176;
const GAP = 44;
const TOTAL_W = PLATFORMS.length * ICON_SIZE + (PLATFORMS.length - 1) * GAP;
const START_X = (1920 - TOTAL_W) / 2;
const ICON_Y = 655;

export const Scene4Connect: React.FC = () => {
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

  const line1Opacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const line1Y = interpolate(frame, [4, 18], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const socialSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.9 },
  });

  const socialY = interpolate(socialSpring, [0, 1], [34, 0]);

  const subOpacity = interpolate(frame, [24, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient glow pulse — top glow breathes, bottom glow drifts
  const glowPulse   = 1 + 0.06 * Math.sin((frame / fps) * Math.PI * 1.1);
  const glowDriftX  = interpolate(frame, [0, durationInFrames], [-30, 50],
    { extrapolateRight: "clamp" });

  // Connection beam — draws left→right at icon horizon after all icons have settled
  // All icons are in by frame ~90 (last icon enters at delay=74, settles ~+20=94)
  const beamProgress = interpolate(frame, [94, 122], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const beamOpacity = interpolate(
    frame, [94, 106, 136, durationInFrames - 8], [0, 0.62, 0.30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const beamWidth = TOTAL_W * beamProgress;
  const beamLeft  = START_X + TOTAL_W / 2 - beamWidth / 2;

  // Small dot nodes that appear at each icon's horizontal center when beam passes
  // beam right edge position: beamLeft + beamWidth
  const beamRightX = beamLeft + beamWidth;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity,
        overflow: "hidden",
      }}
    >
      {/* Top glow — pulses */}
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 420,
          borderRadius: "50%",
          background: "rgba(149,42,94,0.20)",
          filter: "blur(130px)",
          top: 90,
          left: "50%",
          transform: `translateX(calc(-50% + ${glowDriftX}px)) scale(${glowPulse})`,
          pointerEvents: "none",
        }}
      />
      {/* Icon row glow — static horizon bar */}
      <div
        style={{
          position: "absolute",
          width: 1700,
          height: 320,
          borderRadius: "50%",
          background: "rgba(238,89,61,0.09)",
          filter: "blur(100px)",
          top: ICON_Y - 110,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      {/* Connection beam — brand-colored line linking all platform icons */}
      <div style={{
        position: "absolute",
        left: beamLeft,
        top: ICON_Y,
        width: beamWidth,
        height: 2,
        background:
          "linear-gradient(90deg, rgba(149,42,94,0.55), rgba(238,89,61,0.80), rgba(149,42,94,0.55))",
        opacity: beamOpacity,
        filter: "blur(0.5px)",
        pointerEvents: "none",
      }} />
      {/* Node dots at each icon center — light up as beam reaches them */}
      {PLATFORMS.map(({ name }, i) => {
        const iconCenterX = START_X + i * (ICON_SIZE + GAP) + ICON_SIZE / 2;
        const nodeActive  = beamRightX >= iconCenterX ? 1 : 0;
        const nodeOp = nodeActive * beamOpacity * 1.4;
        return (
          <div key={`node-${name}`} style={{
            position: "absolute",
            left: iconCenterX - 4,
            top: ICON_Y - 4,
            width: 8, height: 8,
            borderRadius: "50%",
            background: "rgba(238,89,61,0.90)",
            boxShadow: "0 0 10px rgba(238,89,61,0.60)",
            opacity: Math.min(nodeOp, beamOpacity),
            pointerEvents: "none",
          }} />
        );
      })}

      {/* Top text block */}
      <div
        style={{
          position: "absolute",
          top: 135,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 500,
            color: "rgba(255,255,255,0.56)",
            margin: 0,
            letterSpacing: "0px",
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          Simply connect your
        </p>

        <h1
          style={{
            fontFamily: FONT,
            fontSize: 126,
            fontWeight: 700,
            color: C.white,
            margin: "10px 0 0",
            lineHeight: 0.96,
            letterSpacing: "-5px",
            transform: `translateY(${socialY}px)`,
            opacity: socialSpring,
          }}
        >
          social media
        </h1>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.42)",
            marginTop: 18,
            marginBottom: 0,
            letterSpacing: "-0.2px",
            opacity: subOpacity,
          }}
        >
          One connection. All your channels.
        </p>
      </div>

      {/* Platform row */}
      {PLATFORMS.map(({ name, file }, i) => {
        const enterDelay = i * 8 + 34;

        const slideSpring = spring({
          frame: Math.max(0, frame - enterDelay),
          fps,
          config: { damping: 18, stiffness: 150, mass: 0.9 },
        });

        const slideY = interpolate(slideSpring, [0, 1], [70, 0]);
        const scale = interpolate(slideSpring, [0, 1], [0.92, 1]);
        const iconOpacity = interpolate(Math.max(0, frame - enterDelay), [0, 10], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Gentle idle float — each icon has a different phase so they feel independent
        const floatPhase = (i / PLATFORMS.length) * Math.PI * 2;
        const floatY = 5 * Math.sin((frame / fps) * Math.PI * 0.6 + floatPhase);
        // Float only after the icon has fully entered (settled)
        const floatWeight = interpolate(Math.max(0, frame - enterDelay - 20), [0, 20], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        const x = START_X + i * (ICON_SIZE + GAP);

        return (
          <React.Fragment key={name}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: ICON_Y - ICON_SIZE / 2,
                width: ICON_SIZE,
                height: ICON_SIZE,
                opacity: iconOpacity,
                transform: `translateY(${slideY + floatY * floatWeight}px) scale(${scale})`,
                borderRadius: 34,
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03)",
              }}
            >
              <Img
                src={staticFile(file)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                left: x,
                top: ICON_Y + ICON_SIZE / 2 + 18,
                width: ICON_SIZE,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(255,255,255,0.62)",
                letterSpacing: "0.2px",
                opacity: iconOpacity,
                transform: `translateY(${slideY + floatY * floatWeight}px)`,
              }}
            >
              {name}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};