import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Sortie de fin de scène.
 *
 * Les scènes 1 à 3 avaient déjà une sortie de titre écrite à la main ; les
 * scènes 5 à 9 n'en avaient pas et leur texte disparaissait d'un coup à la
 * coupe. C'est ce composant qui uniformise le geste : le texte se soulève,
 * se dissout et perd sa netteté, exactement comme il était arrivé.
 *
 * Le flou de sortie compte autant que l'opacité : sans lui, un texte qui
 * s'efface reste net jusqu'au bout et trahit la coupe.
 */
export const Outro: React.FC<{
  /** Début de la sortie, en secondes. */
  atInSeconds: number;
  durationInSeconds?: number;
  /** Hauteur du soulèvement, en px. */
  lift?: number;
  children: React.ReactNode;
}> = ({ atInSeconds, durationInSeconds = 0.32, lift = 40, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const out = interpolate(
    frame,
    [atInSeconds * fps, (atInSeconds + durationInSeconds) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.5, 0, 0.75, 0.2),
    },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - out,
        translate: "0px " + -lift * out + "px",
        filter: "blur(" + out * 7 + "px)",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
