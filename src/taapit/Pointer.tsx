import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DARK } from "./theme";

export type PointerStep = {
  /** Cible, en coordonnées de composition. */
  x: number;
  y: number;
  /** Instant d'arrivée sur cette cible. */
  atInSeconds: number;
  /** Un appui a lieu à l'arrivée. */
  click?: boolean;
};

/**
 * Pointeur clair, pour les univers sombres.
 *
 * Le `Cursor` du moteur Remakeit dessine en encre sombre : il serait
 * invisible ici. Plutôt que d'ajouter une prop de couleur à un composant
 * validé, on en fait un spécifique — et on en profite pour lui donner ce qui
 * manquait : une **suite d'étapes** plutôt qu'un aller simple, ce dont S1 a
 * besoin (le lien, puis la croix).
 *
 * Les principes de mouvement sont les mêmes que ceux validés sur Remakeit :
 * phase rapide puis longue correction, et une micro-correction du poignet à
 * l'arrivée. C'est ce détail qui empêche l'arrêt de paraître mécanique.
 */
export const Pointer: React.FC<{
  steps: PointerStep[];
  /** Entrée dans le cadre. */
  fromX: number;
  fromY: number;
  startInSeconds: number;
  /** Sortie. Absent = le pointeur reste. */
  leaveAtInSeconds?: number;
  size?: number;
}> = ({ steps, fromX, fromY, startInSeconds, leaveAtInSeconds, size = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Le trajet complet : le point d'entrée puis chaque étape.
  const legs = [{ x: fromX, y: fromY, atInSeconds: startInSeconds }, ...steps];

  let x = legs[0].x;
  let y = legs[0].y;

  for (let i = 1; i < legs.length; i++) {
    const a = legs[i - 1];
    const b = legs[i];
    if (t >= b.atInSeconds) {
      x = b.x;
      y = b.y;
      continue;
    }
    const p = interpolate(t, [a.atInSeconds, b.atInSeconds], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Phase balistique rapide, puis correction lente : loi de Fitts.
      easing: Easing.bezier(0.3, 0.9, 0.2, 1),
    });
    x = a.x + (b.x - a.x) * p;
    y = a.y + (b.y - a.y) * p;
    break;
  }

  // Micro-correction du poignet après chaque arrivée.
  let settle = 0;
  for (const step of steps) {
    const since = t - step.atInSeconds;
    if (since >= 0 && since < 0.25) {
      settle =
        Math.sin((since / 0.25) * Math.PI * 2) * 1.6 * (1 - since / 0.25);
    }
  }

  // Enfoncement au clic.
  let press = 1;
  for (const step of steps) {
    if (!step.click) {
      continue;
    }
    press = Math.min(
      press,
      interpolate(
        t,
        [
          step.atInSeconds - 0.04,
          step.atInSeconds + 0.07,
          step.atInSeconds + 0.3,
        ],
        [1, 0.86, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [
            Easing.bezier(0.4, 0, 1, 1),
            Easing.bezier(0.34, 1.4, 0.64, 1),
          ],
        },
      ),
    );
  }

  const opacity = interpolate(
    t,
    leaveAtInSeconds === undefined
      ? [startInSeconds, startInSeconds + 0.2, 1e6, 1e6 + 1]
      : [
          startInSeconds,
          startInSeconds + 0.2,
          leaveAtInSeconds,
          leaveAtInSeconds + 0.3,
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
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: x + settle,
          top: y + settle * 0.6,
          scale: press,
        }}
      >
        <svg
          width={size}
          height={size * 1.27}
          viewBox="0 0 30 38"
          style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.8))" }}
        >
          <path
            d="M2 2 L2 27 L9 20.5 L13.5 30.5 L18.5 28 L14 18.5 L23 18 Z"
            fill={DARK.text}
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
