import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { C, FONT, GRADIENT_PRIMARY } from "../theme";

loadFont("normal", { weights: ["700", "600", "500", "400"] });

// ── Cursor ─────────────────────────────────────────────────────────────────────

const Cursor: React.FC<{ x: number; y: number; pressed: boolean; opacity: number }> = ({
  x, y, pressed, opacity,
}) => (
  <div style={{
    position: "absolute", left: x, top: y,
    width: 32, height: 42, zIndex: 300, opacity,
    transform: `scale(${pressed ? 0.80 : 1})`, pointerEvents: "none",
  }}>
    <svg viewBox="0 0 32 42" fill="none">
      <path d="M3 3 L3 33 L11 24 L17 40 L22 37 L16 21 L27 21 Z"
        fill="white" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
);

// ── Result item ────────────────────────────────────────────────────────────────

const ResultItem: React.FC<{ text: string; enterFrame: number; frame: number }> = ({
  text, enterFrame, frame,
}) => {
  const p = interpolate(frame, [enterFrame, enterFrame + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18,
      opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-28, 0])}px)` }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: GRADIENT_PRIMARY,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 3, boxShadow: "0 2px 12px rgba(149,42,94,0.45)" }}>
        <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>✓</span>
      </div>
      <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 500,
        color: "rgba(255,255,255,0.88)", lineHeight: 1.45, letterSpacing: "-0.3px" }}>
        {text}
      </span>
    </div>
  );
};

// ── Scene constants ────────────────────────────────────────────────────────────

const RESULT_ITEMS = [
  { text: "Post 3×/week on Instagram — Tuesday, Thursday & Sunday",  enterFrame: 88  },
  { text: "Lead TikTok with trending audio, 5× per week",            enterFrame: 106 },
  { text: "Facebook: 2× weekly — focus on community questions",      enterFrame: 124 },
];

// Left column: x=60, width=820, center-x=470
// Generate button y center ≈ 580
const BTN_CX = 470;
const BTN_CY = 572;

export const SceneResult: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn  = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Cursor path: start bottom-left, move to button
  const cursorX = interpolate(frame, [4, 44], [160, BTN_CX - 16], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorY = interpolate(frame, [4, 44], [900, BTN_CY - 20], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOpacity = interpolate(frame, [4, 14], [0, 1], { extrapolateRight: "clamp" });
  const cursorPressed = frame >= 46 && frame <= 58;

  // Ripple
  const rippleP   = interpolate(frame, [48, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleOp  = interpolate(rippleP, [0, 0.6, 1], [0.55, 0.25, 0]);
  const rippleSc  = interpolate(rippleP, [0, 1], [0.8, 2.6]);

  // Loading
  const loadingOp = interpolate(frame, [60, 68, 74, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Result card — right column slides in
  const resultSpring = spring({ frame: Math.max(0, frame - 82), fps,
    config: { damping: 22, stiffness: 150, mass: 0.8 } });
  const resultX      = interpolate(resultSpring, [0, 1], [100, 0]);
  const resultOp     = interpolate(Math.max(0, frame - 82), [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // Left column entrance
  const leftSpring = spring({ frame, fps, config: { damping: 200 } });
  const leftY      = interpolate(leftSpring, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDark, opacity: sceneOpacity, overflow: "hidden" }}>

      {/* ── Shared header bar ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 76,
        display: "flex", alignItems: "center", padding: "0 48px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(14,5,11,0.96)", zIndex: 10,
        opacity: leftSpring, transform: `translateY(${leftY}px)`,
      }}>
        <div style={{ width: 42, height: 42, borderRadius: 12,
          background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center",
          justifyContent: "center", marginRight: 20 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 24, fontWeight: 700 }}>←</span>
        </div>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.white,
            letterSpacing: "-0.5px" }}>AI Content Strategy</div>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400,
            color: "rgba(255,255,255,0.35)" }}>Powered by Gemini</div>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 76, left: 0, right: 0, bottom: 0,
        display: "flex" }}>

        {/* Left column — tool interface (880px) */}
        <div style={{ width: 880, flexShrink: 0, padding: "40px 48px",
          display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          opacity: leftSpring, transform: `translateY(${leftY}px)` }}>

          <h2 style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.white,
            margin: "0 0 8px", letterSpacing: "-1.5px", lineHeight: 1.15 }}>
            Your personalized<br />content strategy
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 400,
            color: "rgba(255,255,255,0.40)", margin: "0 0 32px", lineHeight: 1.4 }}>
            Based on your niche, audience & growth goals
          </p>

          {/* Input card */}
          <div style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600,
              color: "rgba(255,255,255,0.32)", letterSpacing: "2.5px",
              textTransform: "uppercase", marginBottom: 8 }}>Brand / Niche</div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 500,
              color: "rgba(255,255,255,0.82)" }}>Fashion & Lifestyle · 3–5 posts/week</div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18, padding: "20px 24px", marginBottom: 36 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600,
              color: "rgba(255,255,255,0.32)", letterSpacing: "2.5px",
              textTransform: "uppercase", marginBottom: 8 }}>Target Audience</div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 500,
              color: "rgba(255,255,255,0.82)" }}>Women 18–35 · Sweden & Nordics</div>
          </div>

          {/* Generate button */}
          <div style={{
            height: 80, borderRadius: 22,
            background: GRADIENT_PRIMARY,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 36px rgba(149,42,94,0.48)",
            overflow: "hidden", position: "relative",
            opacity: interpolate(frame, [18, 32], [0, 1], { extrapolateRight: "clamp" }),
          }}>
            <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.white,
              letterSpacing: "-0.5px" }}>Generate Strategy →</span>
            {frame >= 48 && (
              <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%",
                background: "rgba(255,255,255,0.32)",
                transform: `scale(${rippleSc})`, opacity: rippleOp,
                left: "50%", top: "50%", marginLeft: -65, marginTop: -65 }} />
            )}
          </div>

          {/* Loading text */}
          <div style={{ marginTop: 20, fontFamily: FONT, fontSize: 18, fontWeight: 500,
            color: "rgba(255,255,255,0.45)", opacity: loadingOp, textAlign: "center" }}>
            Generating your strategy
            {frame >= 62 && frame < 70 && " ."}
            {frame >= 70 && frame < 76 && " .."}
            {frame >= 76 && " ..."}
          </div>
        </div>

        {/* Right column — result (1040px) */}
        <div style={{ flex: 1, padding: "40px 48px", display: "flex",
          flexDirection: "column", justifyContent: "flex-start",
          opacity: resultOp, transform: `translateX(${resultX}px)` }}>

          {/* Result card */}
          <div style={{
            background: "rgba(149,42,94,0.13)",
            border: "1.5px solid rgba(149,42,94,0.38)",
            borderRadius: 28, padding: "36px 40px",
            boxShadow: "0 12px 48px rgba(149,42,94,0.18)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14,
                background: GRADIENT_PRIMARY, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 26,
                boxShadow: "0 4px 18px rgba(149,42,94,0.45)" }}>✦</div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700,
                  color: C.white, letterSpacing: "-0.5px" }}>Your Strategy is Ready</div>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400,
                  color: "rgba(255,255,255,0.38)" }}>3 personalized recommendations</div>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              {RESULT_ITEMS.map(({ text, enterFrame }) => (
                <ResultItem key={text} text={text} enterFrame={enterFrame} frame={frame} />
              ))}
            </div>

            {/* Bottom tag */}
            <div style={{ marginTop: 36, paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              opacity: interpolate(frame, [135, 148], [0, 1], { extrapolateRight: "clamp" }) }}>
              <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600,
                color: "rgba(255,255,255,0.38)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Powered by Gemini AI · Updated weekly
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cursor */}
      <Cursor x={cursorX} y={cursorY} pressed={cursorPressed} opacity={cursorOpacity} />
    </AbsoluteFill>
  );
};
