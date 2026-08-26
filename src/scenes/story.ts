import { TimelineTrack } from "../components/EditorTimeline";
import { COLORS } from "../theme";

/**
 * Données partagées par les scènes du problème (1 → 3).
 * Tout ce qui doit rester identique d'une scène à l'autre pour que le
 * raccord soit invisible est centralisé ici.
 */

/** La vidéo source. Identique dans toutes les scènes, c'est le fil rouge. */
export const SOURCE_VIDEO = {
  title: "Structurer une offre B2B",
  channel: "SalesMedia",
  meta: "47 min · aujourd'hui",
  duration: "47:52",
};

/**
 * Le plateau de la table de montage (scènes 2 et 3).
 * `previewScale` s'applique à une VideoCard de 780px : c'est l'échelle que la
 * carte de la scène 1 doit atteindre pour se poser ici sans saut.
 */
export const STAGE = {
  cardWidth: 780,
  /** Position de la carte vidéo en scène 1 (identique à la scène 4). */
  cardY: 60,
  previewScale: 0.42,
  previewY: -175,
  panelWidth: 1440,
  panelHeight: 350,
  panelY: 205,
  headlineTop: 140,
  /** Zoom caméra au raccord scène 1 → 2. */
  handoverZoom: 1.045,
  /** Zoom caméra au raccord scène 2 → 3. */
  chaosZoom: 1.22,
};

/**
 * Le plateau produit (scènes 5 → 10).
 * Toutes les valeurs sont en coordonnées de composition, relatives au centre.
 */
export const APP = {
  windowWidth: 1180,
  windowHeight: 580,
  windowY: 70,
  /** Champ URL dans la fenêtre. */
  fieldWidth: 1100,
  fieldHeight: 72,
  fieldY: -96,
  /** Aperçu de la vidéo collée. */
  previewScale: 0.68,
  previewY: 146,
  /** Bande d'analyse en bas de fenêtre. */
  analysisWidth: 1100,
  analysisHeight: 90,
  analysisY: 285,
};

/**
 * Décalages qui font courir le même plateau de shorts d'une scène à l'autre.
 * Négatifs : au démarrage de la scène, l'animation est déjà en cours depuis
 * ce nombre de secondes. C'est ce qui supprime tout saut aux coupes 6→10.
 */
export const BOARD_HANDOVER = {
  shortsScene6: 1.15,
  shortsScene7: -2.85,
  shortsScene8: -6.35,
  shortsScene9: -9.85,
  shortsScene10: -12.85,
  publishScene8: 0.5,
  publishScene9: -3,
  publishScene10: -6.5,
};

/** Pistes de la scène 2 : les clips s'accumulent, le rythme s'accélère. */
export const SCENE2_TRACKS: TimelineTrack[] = [
  {
    label: "Vidéo",
    color: COLORS.blue,
    kind: "video",
    clips: [
      { start: 0.0, width: 0.16, atInSeconds: 0.35 },
      { start: 0.17, width: 0.11, atInSeconds: 0.75 },
      { start: 0.29, width: 0.14, atInSeconds: 1.05 },
      { start: 0.44, width: 0.09, atInSeconds: 1.3 },
      { start: 0.54, width: 0.13, atInSeconds: 1.52 },
      { start: 0.68, width: 0.1, atInSeconds: 1.7 },
      { start: 0.79, width: 0.08, atInSeconds: 1.86 },
    ],
  },
  {
    label: "B-roll",
    color: COLORS.coral,
    kind: "video",
    clips: [
      { start: 0.06, width: 0.09, atInSeconds: 0.95 },
      { start: 0.22, width: 0.07, atInSeconds: 1.25 },
      { start: 0.34, width: 0.1, atInSeconds: 1.48 },
      { start: 0.5, width: 0.06, atInSeconds: 1.66 },
      { start: 0.6, width: 0.09, atInSeconds: 1.8 },
      { start: 0.73, width: 0.07, atInSeconds: 1.94 },
    ],
  },
  {
    label: "Audio",
    color: COLORS.green,
    kind: "audio",
    clips: [
      { start: 0.0, width: 0.34, atInSeconds: 0.6 },
      { start: 0.36, width: 0.28, atInSeconds: 1.18 },
      { start: 0.66, width: 0.22, atInSeconds: 1.75 },
    ],
  },
  {
    label: "Sous-titres",
    color: COLORS.blue,
    kind: "caption",
    clips: [
      { start: 0.02, width: 0.06, atInSeconds: 1.35 },
      { start: 0.1, width: 0.05, atInSeconds: 1.55 },
      { start: 0.18, width: 0.07, atInSeconds: 1.72 },
      { start: 0.28, width: 0.05, atInSeconds: 1.88 },
      { start: 0.36, width: 0.06, atInSeconds: 2.0 },
      { start: 0.45, width: 0.05, atInSeconds: 2.1 },
      { start: 0.53, width: 0.06, atInSeconds: 2.2 },
      { start: 0.62, width: 0.05, atInSeconds: 2.3 },
      { start: 0.7, width: 0.06, atInSeconds: 2.4 },
      { start: 0.79, width: 0.05, atInSeconds: 2.5 },
    ],
  },
];

/** Ce que la scène 3 ajoute par-dessus : les trous se bouchent, ça sature. */
const SCENE3_EXTRA: TimelineClip3[][] = [
  [
    { start: 0.87, width: 0.11, atInSeconds: 0.2 },
    { start: 0.13, width: 0.035, atInSeconds: 0.55 },
    { start: 0.425, width: 0.02, atInSeconds: 0.85 },
    { start: 0.525, width: 0.015, atInSeconds: 1.1 },
    { start: 0.665, width: 0.015, atInSeconds: 1.35 },
    { start: 0.775, width: 0.015, atInSeconds: 1.55 },
  ],
  [
    { start: 0.155, width: 0.06, atInSeconds: 0.35 },
    { start: 0.3, width: 0.035, atInSeconds: 0.7 },
    { start: 0.445, width: 0.05, atInSeconds: 0.95 },
    { start: 0.565, width: 0.03, atInSeconds: 1.18 },
    { start: 0.695, width: 0.03, atInSeconds: 1.4 },
    { start: 0.815, width: 0.09, atInSeconds: 1.58 },
    { start: 0.92, width: 0.06, atInSeconds: 1.75 },
  ],
  [{ start: 0.89, width: 0.1, atInSeconds: 0.45 }],
  [
    { start: 0.85, width: 0.05, atInSeconds: 1.65 },
    { start: 0.92, width: 0.05, atInSeconds: 1.8 },
    { start: 0.075, width: 0.02, atInSeconds: 1.9 },
    { start: 0.245, width: 0.03, atInSeconds: 2.0 },
    { start: 0.335, width: 0.02, atInSeconds: 2.08 },
    { start: 0.415, width: 0.03, atInSeconds: 2.15 },
    { start: 0.505, width: 0.02, atInSeconds: 2.22 },
    { start: 0.595, width: 0.02, atInSeconds: 2.28 },
  ],
];

type TimelineClip3 = { start: number; width: number; atInSeconds: number };

/**
 * Scène 3 : les clips de la scène 2 sont déjà posés (`atInSeconds: -1`),
 * les nouveaux arrivent de plus en plus vite.
 */
export const SCENE3_TRACKS: TimelineTrack[] = SCENE2_TRACKS.map((track, i) => ({
  label: track.label,
  color: track.color,
  kind: track.kind,
  clips: [
    ...track.clips.map((clip) => ({
      start: clip.start,
      width: clip.width,
      atInSeconds: -1,
    })),
    ...SCENE3_EXTRA[i],
  ],
}));
