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

// ── Platform logos — all have black backgrounds, no wrapper needed ─────────────

const PLATFORMS = [
  { name: "TikTok",    file: "tiktok.png"    },
  { name: "Instagram", file: "instagram.png" },
  { name: "Facebook",  file: "facebook.png"  },
  { name: "LinkedIn",  file: "linkedin.png"  },
  { name: "YouTube",   file: "youtube.png"   },
  { name: "X",         file: "x.png"         },
];

// Logo dimensions & layout
const ICON_SIZE = 210;
const GAP       = 90;
const TOTAL_W   = PLATFORMS.length * ICON_SIZE + (PLATFORMS.length - 1) * GAP; // 6*210 + 5*90 = 1710
const START_X   = (1920 - TOTAL_W) / 2; // 105 — centered
const ICON_Y    = 640; // center-y of icons (below the text)

// ── Scene ──────────────────────────────────────────────────────────────────────

export const Scene4Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  // "Simply connect your" text
  const line1Opacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const line1Y = interpolate(frame, [6, 22], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "social media." headline spring
  const socialSpring = spring({ frame: Math.max(0, frame - 16), fps,
    config: { damping: 20, stiffness: 160 } });
  const socialY      = interpolate(socialSpring, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", opacity, overflow: "hidden" }}>

      {/* Subtle glow strip behind logos */}
      <div style={{
        position: "absolute",
        width: 1800, height: 300,
        borderRadius: "50%",
        background: "hsl(331,65%,35%,0.16)",
        filter: "blur(90px)",
        top: ICON_Y - 150,
        left: 60,
        pointerEvents: "none",
      }} />

      {/* ── Text block ─────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 200,
        left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
      }}>
        <p style={{
          fontFamily: FONT, fontSize: 44, fontWeight: 400,
          color: "rgba(255,255,255,0.55)", margin: 0, letterSpacing: "-0.5px",
          opacity: line1Opacity, transform: `translateY(${line1Y}px)`,
        }}>
          Simply connect your
        </p>
        <h1 style={{
          fontFamily: FONT, fontSize: 120, fontWeight: 700, color: C.white,
          margin: "8px 0 0", lineHeight: 1, letterSpacing: "-5px",
          transform: `translateY(${socialY}px)`, opacity: socialSpring,
        }}>
          social media.
        </h1>
      </div>

      {/* ── Logo row ───────────────────────────────────────────────────────── */}
      {PLATFORMS.map(({ name, file }, i) => {
        const enterDelay  = i * 10 + 38;
        const slideSpring = spring({ frame: Math.max(0, frame - enterDelay), fps,
          config: { damping: 18, stiffness: 160, mass: 0.8 } });
        const slideY      = interpolate(slideSpring, [0, 1], [80, 0]);
        const iconOpacity = interpolate(
          Math.max(0, frame - enterDelay), [0, 12], [0, 1],
          { extrapolateRight: "clamp" }
        );

        const x = START_X + i * (ICON_SIZE + GAP);

        return (
          <React.Fragment key={name}>
            {/* Logo */}
            <div style={{
              position: "absolute",
              left: x,
              top: ICON_Y - ICON_SIZE / 2,
              width: ICON_SIZE,
              height: ICON_SIZE,
              opacity: iconOpacity,
              transform: `translateY(${slideY}px)`,
              borderRadius: ICON_SIZE * 0.18,
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.50)",
            }}>
              <Img
                src={staticFile(file)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Platform name label */}
            <div style={{
              position: "absolute",
              left: x,
              top: ICON_Y + ICON_SIZE / 2 + 20,
              width: ICON_SIZE,
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 600,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.5px",
              opacity: iconOpacity,
              transform: `translateY(${slideY}px)`,
            }}>
              {name}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
