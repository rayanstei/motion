/**
 * Identité et système visuel Taap.it.
 *
 * Regroupe ce que les prototypes ont validé : la palette relevée sur le site
 * et le système de profondeur sombre. Volontairement séparé du `theme.ts` de
 * Remakeit — deux clients, deux identités, aucun mélange.
 */

export const TAAP = {
  /** L'accent. rgb(52, 209, 108) relevé sur taap.it. */
  green: "#34D16C",
  /** Encre du site. */
  ink: "#1D1D1E",
  /** Noir de scène, un cran plus profond que l'encre. */
  black: "#08080A",
  white: "#FFFFFF",
  /** Fond chaud secondaire du site. */
  cream: "#FEF4EB",
  grey: "#707072",
};

/**
 * OpenSauceSans n'est pas une police Google : elle doit etre fournie en
 * fichier local. Tant qu'elle ne l'est pas, on tourne en police systeme —
 * une seule ligne a changer le jour ou les .ttf arrivent.
 */
export const TAAP_FONT =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const DARK = {
  /** Fond de scène. Pas #000 : il faut de la marge sous les surfaces. */
  bg: "#08080A",
  /** Corps d'un objet posé. */
  surface: "#121216",
  /** Élément surélevé à l'intérieur d'un objet. */
  surfaceHigh: "#1A1A20",
  /** Creux : champs, zones inactives. */
  surfaceLow: "#0D0D10",

  text: "#F2F2F5",
  textMuted: "#77777F",
  textFaint: "#4A4A52",

  line: "rgba(255,255,255,0.07)",
  lineStrong: "rgba(255,255,255,0.13)",
};

/**
 * Dérive les quatre mécanismes d'une seule valeur de profondeur.
 * `depth` : 0 = posé à plat contre le fond, 1 = nettement détaché.
 *
 * Garder `depth` sous 0.7 pour du premium — au-delà, la lueur commence à se
 * voir en tant qu'effet, et on bascule dans le néon.
 */
export const darkDepth = (depth: number, accent: string) => {
  const d = Math.min(Math.max(depth, 0), 1);

  return {
    /** Liseré d'épaisseur : lumière en haut, arête sombre en bas. */
    rim:
      "inset 0 1px 0 rgba(255,255,255," +
      (0.05 + d * 0.09).toFixed(3) +
      "), inset 0 -1px 0 rgba(0,0,0,0.55)",

    /** Nappe lumineuse projetée par l'objet. */
    spill:
      "0 " +
      (10 + d * 30).toFixed(0) +
      "px " +
      (40 + d * 90).toFixed(0) +
      "px rgba(255,255,255," +
      (d * 0.045).toFixed(3) +
      "), 0 " +
      (2 + d * 6).toFixed(0) +
      "px " +
      (10 + d * 24).toFixed(0) +
      "px rgba(0,0,0,0.5)",

    /** Dégradé de surface : le plan est éclairé par le haut. */
    lift:
      "linear-gradient(180deg, rgba(255,255,255," +
      (d * 0.045).toFixed(3) +
      ") 0%, rgba(255,255,255,0) 55%)",

    /** Lueur d'accent, large et faible : elle ancre sans éclairer. */
    ambient:
      "radial-gradient(closest-side, " +
      accent +
      Math.round(d * 34)
        .toString(16)
        .padStart(2, "0") +
      " 0%, " +
      accent +
      "00 72%)",

    /** Bordure, un peu plus présente quand l'objet est détaché. */
    border: "1px solid rgba(255,255,255," + (0.06 + d * 0.07).toFixed(3) + ")",
  };
};

/**
 * ── Univers clair ────────────────────────────────────────────────────
 * C'est l'identité principale du site : blanc franc, encre presque noire,
 * vert en accent. Volontairement plus contrasté et plus resserré que le
 * système Remakeit — Taap.it est punchy, pas pastel.
 */
export const LIGHT = {
  bg: "#FFFFFF",
  ink: "#1D1D1E",
  inkSoft: "#575757",
  muted: "#707072",
  surface: "#FFFFFF",
  surfaceLow: "#F4F4F5",
  line: "rgba(29,29,30,0.10)",
};

/**
 * Élévation claire. Quatre couches seulement : sur blanc, la profondeur se
 * lit mieux avec une ombre nette et resserrée qu'avec une longue nappe.
 */
export const lightDepth = (depth: number) => {
  const d = Math.min(Math.max(depth, 0), 1);
  return {
    shadow: [
      "0 1px 2px rgba(29,29,30," + (0.04 + d * 0.03).toFixed(3) + ")",
      "0 " + (4 + d * 8).toFixed(0) + "px " + (10 + d * 16).toFixed(0) + "px rgba(29,29,30," + (0.05 + d * 0.04).toFixed(3) + ")",
      "0 " + (14 + d * 26).toFixed(0) + "px " + (30 + d * 50).toFixed(0) + "px rgba(29,29,30," + (0.06 + d * 0.05).toFixed(3) + ")",
      "0 " + (40 + d * 60).toFixed(0) + "px " + (80 + d * 110).toFixed(0) + "px rgba(29,29,30," + (0.04 + d * 0.05).toFixed(3) + ")",
    ].join(", "),
    border: "1px solid rgba(29,29,30," + (0.07 + d * 0.04).toFixed(3) + ")",
  };
};
