import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";

type Point = { x: number; y: number };

/**
 * Curseur de souris piloté comme une vraie main.
 *
 * Trois détails font la différence avec un simple déplacement linéaire :
 *
 * 1. La trajectoire est une courbe de Bézier quadratique. Personne ne déplace
 *    une souris en ligne droite parfaite.
 * 2. La courbe d'accélération suit à peu près la loi de Fitts : phase
 *    balistique rapide, puis longue correction lente avant la cible.
 * 3. À l'arrivée, une micro-correction amortie de 1,5 px sur 0,25 s — c'est
 *    le dernier ajustement du poignet, et c'est ce qui rend l'arrêt crédible.
 *
 * Le clic ne fait pas de ripple : le curseur s'enfonce légèrement et un
 * anneau fin se dissipe. Le feedback du bouton lui-même est géré par le
 * composant ciblé.
 */
export const Cursor: React.FC<{
  from: Point;
  to: Point;
  /** Entrée dans le cadre, en secondes. */
  startInSeconds: number;
  /** Instant où le curseur est posé sur la cible. */
  arriveInSeconds: number;
  /** Instant du clic. Absent = le curseur passe sans cliquer. */
  clickAtInSeconds?: number;
  /** Début de la sortie de champ. */
  leaveAtInSeconds: number;
  /** Durée de la sortie. */
  leaveDurationInSeconds?: number;
  /** Où le curseur dérive en sortant, relativement à la cible. */
  leaveOffset?: Point;
  /** Courbure du trajet, en px. Positif = courbe d'un côté, négatif de l'autre. */
  arc?: number;
}> = ({
  from,
  to,
  startInSeconds,
  arriveInSeconds,
  clickAtInSeconds,
  leaveAtInSeconds,
  leaveDurationInSeconds = 0.35,
  leaveOffset = { x: 40, y: 70 },
  arc = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const travel = interpolate(
    frame,
    [startInSeconds * fps, arriveInSeconds * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Rapide au départ, longue décélération de précision.
      easing: Easing.bezier(0.3, 0.9, 0.2, 1),
    },
  );

  // Point de contrôle décalé perpendiculairement au trajet.
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const controlX = (from.x + to.x) / 2 + (-dy / len) * arc;
  const controlY = (from.y + to.y) / 2 + (dx / len) * arc;

  const inv = 1 - travel;
  const curveX =
    inv * inv * from.x + 2 * inv * travel * controlX + travel * travel * to.x;
  const curveY =
    inv * inv * from.y + 2 * inv * travel * controlY + travel * travel * to.y;

  // Micro-correction du poignet à l'arrivée, amortie.
  const sinceArrival = frame - arriveInSeconds * fps;
  const settle =
    sinceArrival >= 0 && sinceArrival < 0.25 * fps
      ? Math.sin((sinceArrival / (0.25 * fps)) * Math.PI * 2) *
        1.5 *
        (1 - sinceArrival / (0.25 * fps))
      : 0;

  const leave = interpolate(
    frame,
    [leaveAtInSeconds * fps, (leaveAtInSeconds + leaveDurationInSeconds) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.7, 1),
    },
  );

  const click = clickAtInSeconds === undefined ? -999 : clickAtInSeconds * fps;

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [
            startInSeconds * fps,
            (startInSeconds + 0.2) * fps,
            leaveAtInSeconds * fps,
            (leaveAtInSeconds + leaveDurationInSeconds) * fps,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.bezier(0.4, 0, 0.2, 1),
              Easing.linear,
              Easing.bezier(0.4, 0, 0.2, 1),
            ],
          },
        ),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          translate:
            curveX +
            leaveOffset.x * leave +
            settle +
            "px " +
            (curveY + leaveOffset.y * leave + settle * 0.6) +
            "px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -22,
            top: -22,
            width: 44,
            height: 44,
            borderRadius: 22,
            border: "1.5px solid " + COLORS.blue,
            opacity: interpolate(frame, [click, click + 0.4 * fps], [0.4, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 0, 0.2, 1),
            }),
            scale: interpolate(frame, [click, click + 0.4 * fps], [0.35, 1.4], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        />

        <svg
          width={30}
          height={38}
          viewBox="0 0 30 38"
          style={{
            filter: "drop-shadow(0 6px 12px rgba(11,18,32,0.28))",
            // Le curseur s'enfonce au clic, comme un vrai appui.
            scale: interpolate(
              frame,
              [click - 0.04 * fps, click + 0.06 * fps, click + 0.28 * fps],
              [1, 0.9, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: [
                  Easing.bezier(0.4, 0, 1, 1),
                  Easing.bezier(0.34, 1.4, 0.64, 1),
                ],
                output: "perceptual-scale",
              },
            ),
          }}
        >
          <path
            d="M2 2 L2 27 L9 20.5 L13.5 30.5 L18.5 28 L14 18.5 L23 18 Z"
            fill={COLORS.ink}
            stroke={COLORS.white}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
