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
import { C, FONT, GRADIENT_PRIMARY } from "../theme";

loadFont("normal", { weights: ["700", "600", "500", "400"] });

const Cursor: React.FC<{ x: number; y: number; pressed: boolean; opacity: number }> = ({
  x, y, pressed, opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 32,
      height: 42,
      zIndex: 300,
      opacity,
      transform: `scale(${pressed ? 0.8 : 1})`,
      pointerEvents: "none",
    }}
  >
    <svg viewBox="0 0 32 42" fill="none">
      <path
        d="M3 3 L3 33 L11 24 L17 40 L22 37 L16 21 L27 21 Z"
        fill="white"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const StatCard: React.FC<{ value: string; label: string; change: string; up: boolean }> = ({
  value, label, change, up,
}) => (
  <div
    style={{
      flex: 1,
      background: "rgba(255,255,255,0.055)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
      backdropFilter: "blur(10px)",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 700,
        color: C.white,
        letterSpacing: "-1.5px",
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 500,
          color: "rgba(255,255,255,0.46)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 700,
          color: up ? "#4ade80" : "#f87171",
        }}
      >
        {up ? "↑" : "↓"} {change}
      </span>
    </div>
  </div>
);

const ToolCard: React.FC<{
  emoji: string;
  title: string;
  desc: string;
  btn: string;
  highlight?: boolean;
  gradBg?: string;
}> = ({ emoji, title, desc, btn, highlight, gradBg }) => (
  <div
    style={{
      flex: 1,
      background: highlight ? "rgba(149,42,94,0.18)" : "rgba(255,255,255,0.04)",
      border: highlight
        ? "1.5px solid rgba(149,42,94,0.58)"
        : "1px solid rgba(255,255,255,0.08)",
      borderRadius: 24,
      padding: "26px 28px",
      boxShadow: highlight
        ? "0 0 54px rgba(149,42,94,0.20), 0 12px 30px rgba(0,0,0,0.28)"
        : "0 10px 24px rgba(0,0,0,0.16)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {highlight && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
          pointerEvents: "none",
        }}
      />
    )}

    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 16,
          flexShrink: 0,
          background: gradBg || GRADIENT_PRIMARY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
        }}
      >
        {emoji}
      </div>

      <div
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 700,
          color: C.white,
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
    </div>

    <div
      style={{
        fontFamily: FONT,
        fontSize: 16,
        fontWeight: 400,
        color: "rgba(255,255,255,0.46)",
        lineHeight: 1.5,
        flex: 1,
        marginBottom: 18,
      }}
    >
      {desc}
    </div>

    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 20px",
        borderRadius: 9999,
        background: highlight ? GRADIENT_PRIMARY : "rgba(255,255,255,0.09)",
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 700,
        color: C.white,
        alignSelf: "flex-start",
        boxShadow: highlight ? "0 8px 24px rgba(149,42,94,0.25)" : "none",
      }}
    >
      {btn} →
    </div>
  </div>
);

const Dashboard: React.FC = () => (
  <div
    style={{
      width: 1920,
      height: 1080,
      background: C.bgDark,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}
  >
    {/* ambient glows */}
    <div
      style={{
        position: "absolute",
        width: 620,
        height: 300,
        borderRadius: "50%",
        background: "rgba(149,42,94,0.10)",
        filter: "blur(110px)",
        top: 130,
        left: 240,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 700,
        height: 320,
        borderRadius: "50%",
        background: "rgba(238,89,61,0.06)",
        filter: "blur(120px)",
        bottom: 80,
        right: 140,
        pointerEvents: "none",
      }}
    />

    {/* Top bar */}
    <div
      style={{
        height: 78,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(14,5,11,0.96)",
        backdropFilter: "blur(14px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[0, 1, 2].map((k) => (
            <div
              key={k}
              style={{
                width: 24,
                height: 2,
                borderRadius: 2,
                background: "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 700,
            color: C.white,
            letterSpacing: "-0.5px",
            marginLeft: 4,
          }}
        >
          Dashboard
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 19,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.2px",
          }}
        >
          promotley.se
        </div>

        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: GRADIENT_PRIMARY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,0.24)",
          }}
        >
          <Img
            src={staticFile("Promotley UF Logo white.png")}
            style={{ width: 64, height: 64, objectFit: "contain" }}
          />
        </div>
      </div>
    </div>

    {/* Main content */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "26px 48px 26px",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Greeting */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              color: C.white,
              letterSpacing: "-0.6px",
            }}
          >
            Your marketing overview
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.42)",
              marginTop: 4,
            }}
          >
            Performance, tools, and next actions in one place
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 22, height: 112 }}>
        <StatCard value="26" label="Total Posts" change="+0%" up={true} />
        <StatCard value="45K" label="Monthly Reach" change="+24%" up={true} />
        <StatCard value="8.4%" label="Engagement" change="+3.1%" up={true} />
        <StatCard value="128" label="New Followers" change="+18%" up={true} />
      </div>

      {/* AI Tools header */}
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 700,
            color: C.white,
            letterSpacing: "-0.5px",
          }}
        >
          AI Tools
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 400,
            color: "rgba(255,255,255,0.34)",
            marginLeft: 16,
          }}
        >
          Click any tool to get started
        </span>
      </div>

      {/* Tool cards */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <ToolCard
            emoji="🎯"
            title="Content Strategy"
            desc="Your personalized content calendar — what to post, when to post, and why it works."
            btn="Go to tool"
            highlight={true}
            gradBg={GRADIENT_PRIMARY}
          />
          <ToolCard
            emoji="✍️"
            title="Caption Writer"
            desc="Generate scroll-stopping captions for any platform in your brand's voice."
            btn="Try it"
            gradBg="linear-gradient(135deg,#6366f1,#8b5cf6)"
          />
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <ToolCard
            emoji="📈"
            title="Trend Analyzer"
            desc="Discover trending topics and formats in your niche before they peak."
            btn="Analyze"
            gradBg="linear-gradient(135deg,#10b981,#059669)"
          />
          <ToolCard
            emoji="📅"
            title="Auto Scheduler"
            desc="Schedule posts at peak engagement times across all your connected platforms."
            btn="Setup"
            gradBg="linear-gradient(135deg,#f59e0b,#d97706)"
          />
        </div>
      </div>
    </div>
  </div>
);

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const slideSpring = spring({ frame, fps, config: { damping: 22, stiffness: 140, mass: 0.9 } });
  const slideY = interpolate(slideSpring, [0, 1], [140, 0]);

  const zoomStart = Math.round(fps * 3.5);
  const zoomSpring = spring({
    frame: Math.max(0, frame - zoomStart),
    fps,
    config: { damping: 200 },
  });
  const zoom = interpolate(zoomSpring, [0, 1], [1, 1.68]);

  const eio = Easing.inOut(Easing.quad);

  const cursorX = (() => {
    if (frame <= 45) return interpolate(frame, [0, 45], [900, 680], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
    if (frame <= 90) return interpolate(frame, [45, 90], [680, 380], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
    return interpolate(frame, [90, 165], [380, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
  })();

  const cursorY = (() => {
    if (frame <= 45) return interpolate(frame, [0, 45], [360, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
    if (frame <= 90) return interpolate(frame, [45, 90], [220, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
    return interpolate(frame, [90, 165], [480, 746], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
  })();

  const cursorOpacity = interpolate(frame, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorPressed = frame >= 166 && frame <= 182;

  const rippleP = interpolate(frame, [167, 196], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOp = interpolate(rippleP, [0, 0.6, 1], [0.55, 0.25, 0]);
  const rippleSc = interpolate(rippleP, [0, 1], [0.8, 2.8]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDark, opacity: sceneOpacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 5,
          width: 1920,
          height: 1080,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transform: `translateY(${slideY}px) scale(${zoom})`,
            transformOrigin: "5% 46%",
            width: 1920,
            height: 1080,
          }}
        >
          <Dashboard />
        </div>
      </div>

      {frame >= 167 && (
        <div
          style={{
            position: "absolute",
            left: 95,
            top: 681,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.30)",
            transform: `scale(${rippleSc})`,
            opacity: rippleOp,
            pointerEvents: "none",
            zIndex: 200,
          }}
        />
      )}

      <Cursor x={cursorX} y={cursorY} pressed={cursorPressed} opacity={cursorOpacity} />
    </AbsoluteFill>
  );
};