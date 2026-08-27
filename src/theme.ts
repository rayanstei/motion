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

/**
 * ── Élévation ────────────────────────────────────────────────────
 * Trois niveaux, un seul principe : chaque couche double son flou et
 * perd un peu d'opacité. La première est une ombre de contact très
 * serrée qui pose l'objet, la dernière une nappe très large qui donne
 * la sensation d'espace. C'est ce dégradé continu qui remplace les
 * trois paliers d'avant, où l'on devinait les marches.
 *
 * Pour ajuster : garder la progression du flou (×2) et ne toucher
 * qu'aux opacités, toutes dans la même famille (0.03 → 0.05).
 */
export const SHADOWS = {
  /** Petits éléments flottants : pastilles, bandeaux, badges. */
  pill: [
    "0 1px 1px rgba(11,18,32,0.045)",
    "0 2px 4px rgba(11,18,32,0.03)",
    "0 5px 10px rgba(11,18,32,0.035)",
    "0 12px 22px rgba(11,18,32,0.035)",
    "0 24px 44px rgba(11,18,32,0.028)",
  ].join(", "),

  /** Cartes de taille moyenne : shorts verticaux. */
  short: [
    "0 1px 1px rgba(11,18,32,0.05)",
    "0 2px 4px rgba(11,18,32,0.035)",
    "0 5px 10px rgba(11,18,32,0.04)",
    "0 11px 22px rgba(11,18,32,0.045)",
    "0 24px 46px rgba(11,18,32,0.04)",
    "0 48px 86px rgba(11,18,32,0.03)",
  ].join(", "),

  /** Grandes surfaces posées au premier plan : carte vidéo, fenêtre, panneau. */
  card: [
    "0 1px 1px rgba(11,18,32,0.05)",
    "0 2px 5px rgba(11,18,32,0.03)",
    "0 7px 14px rgba(11,18,32,0.032)",
    "0 16px 30px rgba(11,18,32,0.038)",
    "0 32px 60px rgba(11,18,32,0.042)",
    "0 64px 120px rgba(11,18,32,0.038)",
  ].join(", "),

  /** Bouton d'action : ombre teintée, plus resserrée. */
  button: [
    "0 1px 1px rgba(11,18,32,0.06)",
    "0 2px 4px rgba(47,107,255,0.16)",
    "0 6px 14px rgba(47,107,255,0.2)",
    "0 14px 28px rgba(47,107,255,0.16)",
  ].join(", "),
};

/**
 * ── Arêtes des surfaces ──────────────────────────────────────────
 * Une bordure semi-transparente se lit plus fine qu'un gris plein à
 * épaisseur égale : elle prend la couleur de ce qu'il y a derrière.
 */
export const SURFACE = {
  /** Contour des cartes claires. */
  border: "1px solid rgba(11,18,32,0.055)",
  /**
   * Liseré interne d'une carte claire : lumière sur l'arête haute,
   * ombre très légère sur l'arête basse. C'est ce qui donne l'épaisseur.
   */
  rim: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(11,18,32,0.035)",
  /** Liseré interne d'une surface sombre : effet verre sur les miniatures. */
  darkRim: "inset 0 1px 0 rgba(255,255,255,0.13)",
};

/**
 * ── Profondeur de champ ──────────────────────────────────────────
 * Le flou encode l'éloignement, il ne décore jamais. Plafond volontairement
 * bas : au-delà d'environ 1,5 px sur du 1080p, on cesse de « sentir » la
 * profondeur et on « voit » un flou, ce qui trahit l'effet.
 *
 * Aucun élément destiné à être lu ne doit passer par ici.
 */
export const DOF = {
  /** Arrière-plan : présent, jamais à lire. */
  background: 1.4,
  /** Second plan : lisible, mais ce n'est pas le sujet. */
  midground: 0.6,

  /**
   * Flou dérivé de l'échelle apparente : ce qui est réduit est plus loin.
   * `reference` est l'échelle considérée comme étant au premier plan —
   * au-dessus, l'élément reste parfaitement net.
   */
  fromScale: (scale: number, max: number, reference = 1) =>
    Math.min(max, Math.max(0, (reference - scale) * 5)),
};

/** Courbes d'easing — jamais de linéaire. */
export const EASE = {
  /** Sortie très douce, longue décélération (entrées principales). */
  out: [0.16, 1, 0.3, 1] as const,
  /** Accélère puis décélère (déplacements). */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Léger dépassement, mouvement organique. */
  overshoot: [0.34, 1.56, 0.64, 1] as const,
  /** Dépassement discret : ce qui apparaît se pose au lieu de s'arrêter net. */
  pop: [0.34, 1.32, 0.64, 1] as const,
};
