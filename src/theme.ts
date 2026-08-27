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
 * ── Teintes de surface ───────────────────────────────────────────
 * Les gris et dégradés qui composent les interfaces. Ils font partie de
 * l'identité au même titre que les couleurs d'accent : c'est ici qu'on
 * change l'ambiance d'un client à l'autre, pas dans les composants.
 */
export const TINTS = {
  /** Fond des pistes et des zones creuses. */
  lane: "#F3F5FA",
  /** Barre de titre d'une fenêtre applicative. */
  chromeTop: "#FCFDFF",
  chromeBottom: "#F7F9FC",
  chromeDot: "#E2E6EE",
  /** Dégradé d'avatar. */
  avatarFrom: "#2F6BFF",
  avatarTo: "#7AA0FF",
  /** Haut du dégradé du bouton d'action. */
  buttonTop: "#4A80FF",
  /** Miniature vidéo 16:9, du plus sombre au plus clair. */
  thumbVideo: ["#131B2E", "#1E2C4D", "#24365C"],
  /** Miniature de short 9:16. */
  thumbShort: ["#16203A", "#1C2A4B"],
};

/**
 * Convertit un hex du thème en triplet "r,g,b", pour les endroits qui ont
 * besoin de moduler l'alpha (les halos, notamment).
 */
export const rgbOf = (hex: string) =>
  [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].join(",");

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
