import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type Curve = readonly [number, number, number, number];

/**
 * Mouvement de caméra partagé par toutes les couches d'une scène.
 * `depth` crée le parallax : > 1 = plan plus proche (bouge davantage).
 *
 * Sans props, la caméra joue la chorégraphie de la scène "Une vidéo →
 * plusieurs shorts" : léger recul (reveal) à partir de 1s, puis poussée
 * finale vers les shorts à 4.5s.
 * Les autres scènes passent leurs propres keyframes.
 */
export const CameraMovement: React.FC<{
  depth?: number;
  /** Instants des keyframes de zoom, en secondes. */
  atInSeconds?: number[];
  /** Valeur du zoom à chaque keyframe (1 = neutre). */
  zoom?: number[];
  /** Courbe de chaque segment, au format cubic-bezier. */
  curves?: Curve[];
  /** Dérive verticale en fin de mouvement, en px. */
  driftY?: number;
  driftFromInSeconds?: number;
  driftToInSeconds?: number;
  driftCurve?: Curve;
  children: React.ReactNode;
}> = ({
  depth = 1,
  atInSeconds = [0, 1, 3.5, 4.5, 5],
  zoom = [1.06, 1.06, 0.98, 0.985, 1.07],
  curves = [
    [0.65, 0, 0.35, 1],
    [0.33, 0, 0.2, 1],
    [0.4, 0, 0.6, 1],
    [0.5, 0, 0.2, 1],
  ],
  driftY = -22,
  driftFromInSeconds = 4.5,
  driftToInSeconds = 5,
  driftCurve = [0.5, 0, 0.2, 1],
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomValue = interpolate(
    frame,
    atInSeconds.map((second) => second * fps),
    zoom,
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: curves.map((curve) => Easing.bezier(curve[0], curve[1], curve[2], curve[3])),
    },
  );

  const drift =
    driftY === 0
      ? 0
      : interpolate(frame, [driftFromInSeconds * fps, driftToInSeconds * fps], [0, driftY], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(driftCurve[0], driftCurve[1], driftCurve[2], driftCurve[3]),
        });

  return (
    <AbsoluteFill
      style={{
        scale: 1 + (zoomValue - 1) * depth,
        translate: "0px " + drift * depth + "px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
