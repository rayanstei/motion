import { loadFont } from "@remotion/google-fonts/Inter";

/**
 * ── Design tokens ────────────────────────────────────────────────
 * Tous les réglages globaux de la direction artistique sont ici.
 */

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const COLORS = {
  bg: "#FBFBFD",
  ink: "#0B1220",
  inkSoft: "#33425C",
  muted: "#818FA6",
  line: "#E7EAF1",
  blue: "#2F6BFF",
  blueSoft: "#EAF0FF",
  coral: "#FF6B4A",
  green: "#12B981",
  white: "#FFFFFF",
};

/** Ombres douces, "SaaS premium" — carte légèrement surélevée. */
export const SHADOWS = {
  card: "0 2px 4px rgba(11,18,32,0.03), 0 18px 40px rgba(11,18,32,0.07), 0 48px 90px rgba(11,18,32,0.06)",
  short:
    "0 1px 3px rgba(11,18,32,0.04), 0 10px 24px rgba(11,18,32,0.08), 0 28px 56px rgba(11,18,32,0.05)",
  button: "0 6px 16px rgba(47,107,255,0.28)",
};

/** Courbes d'easing — jamais de linéaire. */
export const EASE = {
  /** Sortie très douce, longue décélération (entrées principales). */
  out: [0.16, 1, 0.3, 1] as const,
  /** Accélère puis décélère (déplacements). */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Léger dépassement, mouvement organique. */
  overshoot: [0.34, 1.56, 0.64, 1] as const,
};
