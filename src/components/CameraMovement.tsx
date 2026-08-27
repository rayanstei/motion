import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Curve = readonly [number, number, number, number];

/**
 * Rig caméra 2.5D partagé par toutes les couches d'une scène.
 *
 * Trois axes, tous pilotés par les mêmes keyframes `atInSeconds` et les mêmes
 * courbes : le zoom, le panoramique horizontal et le panoramique vertical.
 * `depth` multiplie l'ensemble et crée le parallax — > 1 = plan plus proche,
 * il bouge davantage. C'est ce qui donne la profondeur sans passer en 3D.
 *
 * `sway` ajoute une instabilité type caméra à l'épaule : trois sinusoïdes de
 * périodes premières entre elles, sur X, Y et le zoom. Elles valent toutes
 * zéro à l'image 0, donc une scène commence toujours parfaitement calée sur
 * la précédente. Laisser à 0 pour un banc-titre parfaitement fixe.
 *
 * Sans props, la caméra joue la chorégraphie de la scène "Une vidéo →
 * plusieurs shorts" : léger recul (reveal) à partir de 1s, puis poussée
 * finale vers les shorts à 4.5s.
 */
export const CameraMovement: React.FC<{
  depth?: number;
  /** Instants des keyframes, en secondes. Communs aux trois axes. */
  atInSeconds?: number[];
  /** Valeur du zoom à chaque keyframe (1 = neutre). */
  zoom?: number[];
  /** Panoramique horizontal, en px, à chaque keyframe. */
  panX?: number[];
  /** Panoramique vertical, en px, à chaque keyframe. */
  panY?: number[];
  /** Courbe de chaque segment, au format cubic-bezier. */
  curves?: Curve[];
  /** Amplitude de l'instabilité caméra, en px. 0 = fixe. */
  sway?: number;
  /** Flou de filé maximal, en px, quand la caméra bouge vite. 0 = aucun. */
  motionBlur?: number;
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
  panX,
  panY,
  curves = [
    [0.65, 0, 0.35, 1],
    [0.33, 0, 0.2, 1],
    [0.4, 0, 0.6, 1],
    [0.5, 0, 0.2, 1],
  ],
  sway = 0,
  motionBlur = 0,
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
      easing: curves.map((curve) =>
        Easing.bezier(curve[0], curve[1], curve[2], curve[3]),
      ),
    },
  );

  const drift =
    driftY === 0
      ? 0
      : interpolate(
          frame,
          [driftFromInSeconds * fps, driftToInSeconds * fps],
          [0, driftY],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(
              driftCurve[0],
              driftCurve[1],
              driftCurve[2],
              driftCurve[3],
            ),
          },
        );

  const frames = atInSeconds.map((second) => second * fps);
  const easings = curves.map((curve) =>
    Easing.bezier(curve[0], curve[1], curve[2], curve[3]),
  );

  const pan = (values: number[] | undefined, at: number = frame) =>
    values === undefined
      ? 0
      : interpolate(at, frames, values, {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easings,
        });

  /**
   * Flou de filé : on mesure de combien la caméra a bougé depuis l'image
   * précédente, et on en déduit le flou. Un travelling rapide devient donc
   * flou tout seul, et une caméra à l'arrêt reste parfaitement nette.
   * Le facteur 900 convertit une variation de zoom en pixels au bord du cadre.
   */
  const previous = frame - 1;
  const zoomBefore = interpolate(previous, frames, zoom, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easings,
  });
  const speed =
    Math.abs(pan(panX) - pan(panX, previous)) +
    Math.abs(pan(panY) - pan(panY, previous)) +
    Math.abs(zoomValue - zoomBefore) * 900;
  const blur =
    motionBlur === 0 ? 0 : Math.min(motionBlur, speed * 0.35 * depth);

  // Sinusoïdes : toutes nulles à l'image 0, donc aucun saut à la coupe.
  const t = frame / fps;
  const swayX = sway === 0 ? 0 : Math.sin((t / 5.9) * Math.PI * 2) * sway;
  const swayY = sway === 0 ? 0 : Math.sin((t / 7.3) * Math.PI * 2) * sway * 0.7;
  const swayZoom =
    sway === 0 ? 0 : Math.sin((t / 8.7) * Math.PI * 2) * sway * 0.0012;

  return (
    <AbsoluteFill
      style={{
        filter: blur === 0 ? undefined : "blur(" + blur + "px)",
        scale: 1 + (zoomValue - 1 + swayZoom) * depth,
        translate:
          (pan(panX) + swayX) * depth +
          "px " +
          (pan(panY) + drift + swayY) * depth +
          "px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
