import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TAAP } from "./theme";

/**
 * Onde de révélation — prototype de la scène 5 de Taap.it.
 *
 * ── Pourquoi `clip-path` et pas un masque ────────────────────────────
 * L'effet consiste à inverser les valeurs de toute l'image. Trois pistes
 * étaient possibles :
 *   1. animer l'opacité d'une couche claire → non : on passerait par un gris
 *      laiteux au milieu, ce qui tue l'effet.
 *   2. un `mask-image` en dégradé radial animé → possible, mais le bord est
 *      mou et le coût de rasterisation est élevé sur 1080p.
 *   3. `clip-path: circle()` sur la couche du dessus → le bord est net, le
 *      GPU gère, et les deux couches restent des arbres React indépendants.
 * C'est la 3 qui est implémentée ici.
 *
 * Les deux états sont passés en props (`before` / `after`), donc le composant
 * ne sait rien du contenu : il sert à n'importe quelle bascule, pas seulement
 * noir → blanc.
 *
 * Le rayon est calculé pour atteindre le coin le plus éloigné de l'origine :
 * l'onde couvre donc toujours le cadre, où qu'on place son centre.
 */
export const WaveReveal: React.FC<{
  before: React.ReactNode;
  after: React.ReactNode;
  /** Départ de l'onde, en secondes. */
  atInSeconds: number;
  durationInSeconds?: number;
  /** Centre de l'onde, en % du cadre. */
  originX?: number;
  originY?: number;
  ringColor?: string;
  /** Petite pulsation d'anticipation avant le départ. */
  anticipation?: boolean;
}> = ({
  before,
  after,
  atInSeconds,
  durationInSeconds = 1.05,
  originX = 50,
  originY = 50,
  ringColor = TAAP.green,
  anticipation = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cx = (originX / 100) * width;
  const cy = (originY / 100) * height;

  // Rayon nécessaire pour couvrir le coin le plus éloigné.
  const maxRadius = Math.max(
    Math.sqrt(cx * cx + cy * cy),
    Math.sqrt((width - cx) * (width - cx) + cy * cy),
    Math.sqrt(cx * cx + (height - cy) * (height - cy)),
    Math.sqrt((width - cx) * (width - cx) + (height - cy) * (height - cy)),
  );

  const start = atInSeconds * fps;
  const end = (atInSeconds + durationInSeconds) * fps;

  // Départ franc, longue décélération : le geste est lancé, pas poussé.
  const radius = interpolate(frame, [start, end], [0, maxRadius], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // L'énergie se dissipe à mesure que l'onde s'agrandit.
  // Le premier point de la rampe eteint l anneau avant le depart : a rayon
  // nul, un bord de 10 px se dessinerait comme un point vert plein.
  const ringFade = interpolate(
    frame,
    [start - 1, start, end - 0.25 * fps],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [Easing.linear, Easing.bezier(0.4, 0, 0.7, 1)],
    },
  );

  const seed = anticipation
    ? interpolate(
        frame,
        [start - 0.4 * fps, start - 0.12 * fps, start],
        [0, 1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.4, 0, 1, 1)],
        },
      )
    : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill>{before}</AbsoluteFill>

      {/* Point d'amorce : l'onde ne surgit pas de nulle part. */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: 18,
            height: 18,
            marginLeft: -9,
            marginTop: -9,
            borderRadius: 9,
            backgroundColor: ringColor,
            opacity: seed,
            scale: 0.4 + seed * 0.8,
            boxShadow:
              "0 0 " + 40 * seed + "px " + 12 * seed + "px " + ringColor + "77",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          clipPath: "circle(" + radius + "px at " + cx + "px " + cy + "px)",
        }}
      >
        {after}
      </AbsoluteFill>

      {/* Anneau posé exactement sur le bord du clip. */}
      <AbsoluteFill style={{ opacity: ringFade }}>
        <div
          style={{
            position: "absolute",
            left: cx - radius,
            top: cy - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: "50%",
            // Le trait s'affine en s'étirant, comme une onde qui perd sa densité.
            border:
              interpolate(radius, [0, maxRadius], [10, 2], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) +
              "px solid " +
              ringColor,
            boxShadow:
              "0 0 " +
              interpolate(radius, [0, maxRadius], [70, 18], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) +
              "px " +
              ringColor +
              "88, inset 0 0 40px " +
              ringColor +
              "44",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
