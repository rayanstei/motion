import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Lévitation : un déplacement sinusoïdal de quelques pixels, pour que les
 * éléments restés immobiles n'aient pas l'air collés à l'écran.
 *
 * Comme pour les halos, les périodes en X et en Y sont différentes (rapport
 * 1.37) : la trajectoire ne se referme jamais, donc pas d'effet balancier.
 * L'amplitude horizontale vaut la moitié de la verticale — c'est la
 * proportion qui se lit comme une respiration plutôt qu'un flottement.
 *
 * Le wrapper est un `AbsoluteFill` dans un `AbsoluteFill` : la géométrie des
 * enfants est strictement identique, seul le transform change.
 *
 * À n'utiliser que sur des éléments qui n'ont aucune animation de repos.
 * Superposer deux mouvements donne une dérive incontrôlable.
 */
export const Levitate: React.FC<{
  /** Amplitude verticale, en px. Au-delà de 4, ça se voit. */
  amplitude?: number;
  /** Période du mouvement vertical, en secondes. */
  periodInSeconds?: number;
  /** Déphasage, pour désynchroniser ou pour enchaîner d'une scène à l'autre. */
  phase?: number;
  children: React.ReactNode;
}> = ({ amplitude = 2.5, periodInSeconds = 7, phase = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const y = Math.sin((t / periodInSeconds) * Math.PI * 2 + phase) * amplitude;
  const x =
    Math.sin((t / (periodInSeconds * 1.37)) * Math.PI * 2 + phase * 0.6) *
    amplitude *
    0.5;

  return (
    <AbsoluteFill style={{ translate: x + "px " + y + "px" }}>
      {children}
    </AbsoluteFill>
  );
};
