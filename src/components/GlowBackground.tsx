import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Halos lumineux d'arrière-plan.
 *
 * Chaque halo est un dégradé radial très faible qui dérive lentement selon
 * deux périodes différentes en X et en Y : la trajectoire ne se referme
 * jamais sur elle-même, ce qui évite l'effet balancier et donne un fond
 * vivant sans qu'on puisse dire ce qui bouge.
 *
 * Les couleurs sont uniquement celles de l'identité : le bleu et le corail
 * de `COLORS`, écrits en composantes rgb pour pouvoir moduler l'alpha.
 *
 * Pour régler : `alpha` est le seul curseur d'intensité (0.04 = présence
 * quasi subliminale, 0.14 = maximum avant que le fond ne se remarque).
 */
const BLUE = "47,107,255";
const CORAL = "255,107,74";

type Glow = {
  color: string;
  /** Centre au repos, en % du cadre. */
  x: number;
  y: number;
  /** Taille du dégradé, en % du cadre. */
  w: number;
  h: number;
  /** Opacité au centre du halo. */
  alpha: number;
  /** Amplitude de la dérive, en % du cadre. */
  drift: number;
  /** Période de la dérive, en secondes. */
  periodInSeconds: number;
  /** Déphasage, pour désynchroniser les halos entre eux. */
  phase: number;
};

/**
 * Un préréglage par type de composition, pas un par scène : c'est la
 * répartition des masses à l'image qui décide, pas le numéro de la scène.
 */
export const GLOW_PRESETS = {
  /** Contenu groupé au centre. Deux masses en diagonale. */
  default: [
    { color: BLUE, x: 20, y: 16, w: 58, h: 52, alpha: 0.11, drift: 1.2, periodInSeconds: 11, phase: 0 },
    { color: CORAL, x: 84, y: 86, w: 54, h: 50, alpha: 0.1, drift: 1.4, periodInSeconds: 13, phase: 2.1 },
    { color: BLUE, x: 62, y: 22, w: 40, h: 36, alpha: 0.045, drift: 1, periodInSeconds: 9, phase: 4.2 },
  ],

  /** Contenu étalé jusqu'aux bords. Les halos partent vers les angles. */
  wide: [
    { color: BLUE, x: 12, y: 20, w: 62, h: 56, alpha: 0.125, drift: 1.5, periodInSeconds: 12, phase: 0 },
    { color: CORAL, x: 90, y: 84, w: 58, h: 54, alpha: 0.115, drift: 1.6, periodInSeconds: 14, phase: 2.4 },
    { color: BLUE, x: 78, y: 12, w: 42, h: 38, alpha: 0.05, drift: 1.2, periodInSeconds: 10, phase: 4.5 },
    { color: CORAL, x: 8, y: 90, w: 40, h: 36, alpha: 0.045, drift: 1.3, periodInSeconds: 15, phase: 1.2 },
  ],

  /** Moments de tension. Le corail prend le dessus, le fond se referme. */
  deep: [
    { color: CORAL, x: 82, y: 78, w: 62, h: 58, alpha: 0.135, drift: 1.6, periodInSeconds: 12, phase: 1 },
    { color: BLUE, x: 16, y: 22, w: 56, h: 50, alpha: 0.1, drift: 1.4, periodInSeconds: 13, phase: 3.3 },
    { color: CORAL, x: 50, y: 96, w: 54, h: 34, alpha: 0.06, drift: 1.2, periodInSeconds: 10, phase: 5 },
  ],

  /**
   * Final. Les halos encadrent le centre au lieu de s'y placer : le voile
   * blanc de la scène 10 les effacerait, et le CTA doit rester net.
   */
  focus: [
    { color: BLUE, x: 24, y: 28, w: 54, h: 50, alpha: 0.13, drift: 1.2, periodInSeconds: 12, phase: 0 },
    { color: CORAL, x: 78, y: 76, w: 52, h: 48, alpha: 0.115, drift: 1.3, periodInSeconds: 14, phase: 2.2 },
    { color: BLUE, x: 72, y: 18, w: 40, h: 36, alpha: 0.05, drift: 1, periodInSeconds: 10, phase: 4 },
  ],
} satisfies Record<string, Glow[]>;

export type GlowPreset = keyof typeof GLOW_PRESETS;

export const GlowBackground: React.FC<{ preset?: GlowPreset }> = ({
  preset = "default",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill name="Halos">
      {GLOW_PRESETS[preset].map((glow, i) => {
        const angle = (t / glow.periodInSeconds) * Math.PI * 2 + glow.phase;
        // Période différente en Y : la trajectoire ne se referme pas.
        const angleY = (t / (glow.periodInSeconds * 1.31)) * Math.PI * 2 + glow.phase;

        const x = glow.x + Math.sin(angle) * glow.drift;
        const y = glow.y + Math.cos(angleY) * glow.drift * 0.8;
        // Respiration très légère de la taille.
        const breathe = 1 + Math.sin(angleY * 0.7) * 0.03;

        return (
          <AbsoluteFill
            key={i}
            style={{
              background:
                "radial-gradient(" +
                glow.w * breathe +
                "% " +
                glow.h * breathe +
                "% at " +
                x +
                "% " +
                y +
                "%, rgba(" +
                glow.color +
                "," +
                glow.alpha +
                ") 0%, rgba(" +
                glow.color +
                ",0) 70%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
