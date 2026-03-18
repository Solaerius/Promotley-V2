import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { C, FONT, GRADIENT_PRIMARY } from "../theme";

loadFont("normal", { weights: ["700", "600", "500", "400"] });

// ── Compact stat card ──────────────────────────────────────────────────────────

const StatCard: React.FC<{ value: string; label: string; change: string; up: boolean }> = ({
  value, label, change, up,
}) => (
  <div style={{
    flex: 1,
    background: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: "20px 24px",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
  }}>
    <div style={{ fontFamily: FONT, fontSize: 42, fontWeight: 700, color: C.white,
      letterSpacing: "-1.5px", lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      marginTop: 10 }}>
      <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 500,
        color: "rgba(255,255,255,0.42)" }}>{label}</span>
      <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700,
        color: up ? "#4ade80" : "#f87171" }}>{up ? "↑" : "↓"} {change}</span>
    </div>
  </div>
);

// ── Tool card ──────────────────────────────────────────────────────────────────

const ToolCard: React.FC<{
  emoji: string; title: string; desc: string; btn: string;
  highlight?: boolean; gradBg?: string;
}> = ({ emoji, title, desc, btn, highlight, gradBg }) => (
  <div style={{
    flex: 1,
    background: highlight ? "rgba(149,42,94,0.18)" : "rgba(255,255,255,0.04)",
    border: highlight ? "1.5px solid rgba(149,42,94,0.55)" : "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: "24px 28px",
    boxShadow: highlight ? "0 0 48px rgba(149,42,94,0.24), 0 8px 28px rgba(0,0,0,0.28)" : "none",
    display: "flex", flexDirection: "column",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 15, flexShrink: 0,
        background: gradBg || GRADIENT_PRIMARY,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.32)",
      }}>{emoji}</div>
      <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.white,
        letterSpacing: "-0.5px", lineHeight: 1.2 }}>{title}</div>
    </div>
    <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 400,
      color: "rgba(255,255,255,0.44)", lineHeight: 1.5, flex: 1,
      marginBottom: 18 }}>{desc}</div>
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "9px 20px", borderRadius: 100,
      background: highlight ? GRADIENT_PRIMARY : "rgba(255,255,255,0.09)",
      fontFamily: FONT, fontSize: 15, fontWeight: 700, color: C.white,
      alignSelf: "flex-start",
    }}>{btn} →</div>
  </div>
);

// ── Full 1920×1080 dashboard ───────────────────────────────────────────────────

const Dashboard: React.FC = () => (
  <div style={{ width: 1920, height: 1080, background: C.bgDark,
    display: "flex", flexDirection: "column", overflow: "hidden" }}>

    {/* ── Top bar (76px) ── */}
    <div style={{
      height: 76, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(14,5,11,0.96)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[0,1,2].map(k => (
            <div key={k} style={{ width: 24, height: 2, borderRadius: 2,
              background: "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
        <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.white,
          letterSpacing: "-0.5px", marginLeft: 4 }}>Dashboard</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500,
          color: "rgba(255,255,255,0.40)", letterSpacing: "0.2px" }}>
          promotely.se
        </div>
        <div style={{ width: 46, height: 46, borderRadius: "50%",
          background: GRADIENT_PRIMARY, display: "flex", alignItems: "center",
          justifyContent: "center", fontFamily: FONT, fontSize: 18,
          fontWeight: 700, color: C.white }}>P</div>
      </div>
    </div>

    {/* ── Main content ── */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column",
      padding: "24px 48px 20px", gap: 0, overflow: "hidden" }}>

      {/* Greeting (60px) */}
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.white,
            letterSpacing: "-0.5px" }}>Good morning ⚡ </span>
          <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 400,
            color: "rgba(255,255,255,0.38)" }}>Here's your marketing overview</span>
        </div>
        <div style={{ padding: "10px 22px", borderRadius: 100,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
          display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>✦</span>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600,
            color: "rgba(255,255,255,0.50)", letterSpacing: "0.5px" }}>
            AI Tools powered by Gemini
          </span>
        </div>
      </div>

      {/* Stats row (148px) */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, height: 110 }}>
        <StatCard value="1.2K" label="Total Posts"   change="+12%" up={true}  />
        <StatCard value="45K"  label="Monthly Reach" change="+24%" up={true}  />
        <StatCard value="8.4%" label="Engagement"    change="+3.1%" up={true} />
        <StatCard value="128"  label="New Followers" change="+18%" up={true}  />
      </div>

      {/* AI Tools header (48px) */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700,
          color: C.white, letterSpacing: "-0.5px" }}>AI Tools</span>
        <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400,
          color: "rgba(255,255,255,0.32)", marginLeft: 16 }}>
          Click any tool to get started
        </span>
      </div>

      {/* Tool cards — 2 rows × 2 cols, each fills remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <ToolCard emoji="🎯" title="Content Strategy"
            desc="Your personalized content calendar — what to post, when to post, and why it works."
            btn="Generate" highlight={true} gradBg={GRADIENT_PRIMARY} />
          <ToolCard emoji="✍️" title="Caption Writer"
            desc="Generate scroll-stopping captions for any platform in your brand's voice."
            btn="Try it" gradBg="linear-gradient(135deg,#6366f1,#8b5cf6)" />
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <ToolCard emoji="📈" title="Trend Analyzer"
            desc="Discover trending topics and formats in your niche before they peak."
            btn="Analyze" gradBg="linear-gradient(135deg,#10b981,#059669)" />
          <ToolCard emoji="📅" title="Auto Scheduler"
            desc="Schedule posts at peak engagement times across all your connected platforms."
            btn="Setup" gradBg="linear-gradient(135deg,#f59e0b,#d97706)" />
        </div>
      </div>

    </div>
  </div>
);

// ── Scene ──────────────────────────────────────────────────────────────────────

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const slideSpring = spring({ frame, fps, config: { damping: 22, stiffness: 140, mass: 0.9 } });
  const slideY      = interpolate(slideSpring, [0, 1], [160, 0]);

  // Zoom into Content Strategy card
  // Card center approximate: x=48+(1920-96-16)/2/2=48+452=500, y=76+24+60+20+110+20+48+16+tool_row_half
  // tool row starts at ~374, each row height = (1080-76-24-60-20-110-20-48-16-14-20)/2 = ~236px
  // Card center y = 374 + 118 = 492
  const zoomStart  = Math.round(fps * 3.5);
  const zoomSpring = spring({ frame: Math.max(0, frame - zoomStart), fps, config: { damping: 200 } });
  const zoom = interpolate(zoomSpring, [0, 1], [1, 1.68]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDark, opacity: sceneOpacity, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080,
        overflow: "hidden" }}>
        <div style={{
          transform: `translateY(${slideY}px) scale(${zoom})`,
          transformOrigin: "8% 48%",
          width: 1920, height: 1080,
        }}>
          <Dashboard />
        </div>
      </div>
    </AbsoluteFill>
  );
};
