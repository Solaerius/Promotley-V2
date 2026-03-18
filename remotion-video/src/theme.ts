// Brand tokens — derived from src/index.css CSS variables
// hsl(344, 40%, 6%)  → background dark
// hsl(331, 65%, 35%) → primary magenta
// hsl(9,   90%, 55%) → orange/red accent
// hsl(344, 55%, 12%) → dark wine accent

export const C = {
  bgDark:    "hsl(344, 40%, 6%)",    // #140810 — page background
  bgCard:    "hsl(344, 35%, 9%)",    // card background
  accent:    "hsl(344, 55%, 12%)",   // #35141D — deep wine
  magenta:   "hsl(331, 65%, 35%)",   // #952A5E — primary
  orange:    "hsl(9,   90%, 55%)",   // #EE593D — accent
  white:     "#FFFFFF",
  mutedFg:   "rgba(255,255,255,0.45)",
  border:    "rgba(255,255,255,0.10)",
};

// Exact gradient-primary from CSS:
// linear-gradient(135deg, hsl(9 90% 55%) 0%, hsl(331 70% 45%) 50%, hsl(344 60% 35%) 100%)
export const GRADIENT_PRIMARY =
  "linear-gradient(135deg, hsl(9,90%,55%) 0%, hsl(331,70%,45%) 50%, hsl(344,60%,35%) 100%)";

// gradient-diagonal from CSS:
// linear-gradient(135deg, hsl(344 55% 12%) 0%, hsl(331 65% 28%) 40%, hsl(9 85% 48%) 100%)
export const GRADIENT_DIAGONAL =
  "linear-gradient(135deg, hsl(344,55%,12%) 0%, hsl(331,65%,28%) 40%, hsl(9,85%,48%) 100%)";

// gradient-text from CSS:
// linear-gradient(135deg, hsl(9 90% 58%) 0%, hsl(331 75% 50%) 50%, hsl(344 60% 40%) 100%)
export const GRADIENT_TEXT =
  "linear-gradient(135deg, hsl(9,90%,58%) 0%, hsl(331,75%,50%) 50%, hsl(344,60%,40%) 100%)";

export const FONT = "'Poppins', sans-serif";
