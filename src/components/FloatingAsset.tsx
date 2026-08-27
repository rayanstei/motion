import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, DOF, EASE, SHADOWS, SURFACE } from "../theme";

/**
 * Assets flottants contextuels.
 *
 * Le composant ne connaît aucun contenu : il ne sait dessiner que des formes
 * d'interface génériques. Tout — la forme, le texte, la couleur, la place, la
 * profondeur, le rythme — vient des données. Pour une autre entreprise, il
 * suffit de remplacer le tableau de specs, jamais le composant.
 *
 * `depth` est le seul réglage qui compte vraiment : 0 = presque au premier
 * plan, 1 = loin derrière. Il pilote à lui seul l'échelle, l'opacité et le
 * flou, en réutilisant le système de profondeur de champ existant. Deux
 * assets à la même profondeur appartiennent au même plan.
 */

export type FloatingAssetKind = "pill" | "stat" | "tile" | "dot";
export type FloatingAssetIcon = "play" | "check" | "spark";

export type FloatingAssetSpec = {
  kind: FloatingAssetKind;
  /** Position, en px depuis le centre de la composition. */
  x: number;
  y: number;
  /** Taille de base, en px. Largeur pour `stat`, côté pour `tile` et `dot`. */
  size?: number;
  rotate?: number;
  /** 0 = premier plan, 1 = fond. Pilote échelle, opacité et flou. */
  depth: number;
  /** Opacité propre, avant l'effet de profondeur. */
  opacity?: number;
  /** Apparition, en secondes. */
  atInSeconds: number;
  /** Disparition. Absent = reste jusqu'à la fin de la scène. */
  untilInSeconds?: number;
  /** Amplitude de la lévitation, en px. */
  floatAmplitude?: number;
  floatPeriodInSeconds?: number;
  /** Amplitude de la micro-rotation, en degrés. */
  swing?: number;
  color?: string;
  label?: string;
  value?: string;
  icon?: FloatingAssetIcon;
};

const ICON_PATHS: Record<FloatingAssetIcon, string> = {
  play: "M6 4.2 L15.5 10 L6 15.8 Z",
  check: "M4.8 10.3 L8.4 13.6 L15.2 6.6",
  spark:
    "M10 2.6 L11.7 8.3 L17.4 10 L11.7 11.7 L10 17.4 L8.3 11.7 L2.6 10 L8.3 8.3 Z",
};

/** Une couche d'assets. `timeOffsetInSeconds` permet d'enchaîner deux scènes. */
export const FloatingAssets: React.FC<{
  specs: FloatingAssetSpec[];
  timeOffsetInSeconds?: number;
}> = ({ specs, timeOffsetInSeconds = 0 }) => {
  return (
    <AbsoluteFill name="Assets flottants">
      {specs.map((spec, i) => (
        <FloatingAsset
          key={i}
          spec={spec}
          timeOffsetInSeconds={timeOffsetInSeconds}
        />
      ))}
    </AbsoluteFill>
  );
};

const FloatingAsset: React.FC<{
  spec: FloatingAssetSpec;
  timeOffsetInSeconds: number;
}> = ({ spec, timeOffsetInSeconds }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame() + timeOffsetInSeconds * fps;

  const at = spec.atInSeconds * fps;

  const appear = interpolate(frame, [at, at + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Même progression, avec dépassement discret pour l'échelle.
  const pop = interpolate(frame, [at, at + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(EASE.pop[0], EASE.pop[1], EASE.pop[2], EASE.pop[3]),
  });

  const leave =
    spec.untilInSeconds === undefined
      ? 0
      : interpolate(
          frame,
          [spec.untilInSeconds * fps, (spec.untilInSeconds + 0.4) * fps],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          },
        );

  // Chaque asset a sa propre phase : rien ne bouge en même temps.
  const phase = spec.x * 0.013 + spec.y * 0.007;
  const t = frame / fps;
  const period = spec.floatPeriodInSeconds ?? 6.5;
  const amplitude = spec.floatAmplitude ?? 4;

  const float =
    Math.sin((t / period) * Math.PI * 2 + phase) * amplitude * appear;
  const swing =
    Math.sin((t / (period * 1.29)) * Math.PI * 2 + phase) *
    (spec.swing ?? 1.2) *
    appear;

  // La profondeur pilote les trois paramètres d'un coup.
  const depthScale = 1 - spec.depth * 0.28;
  const depthOpacity = 1 - spec.depth * 0.45;
  const depthBlur = spec.depth * DOF.background;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: appear * (spec.opacity ?? 1) * depthOpacity * (1 - leave),
          filter: "blur(" + (depthBlur + (1 - appear) * 8 + leave * 6) + "px)",
          translate:
            spec.x + "px " + (spec.y + float + (1 - appear) * 18) + "px",
          scale: depthScale * (0.9 + pop * 0.1),
          rotate: (spec.rotate ?? 0) + swing + "deg",
        }}
      >
        <Shape spec={spec} />
      </div>
    </AbsoluteFill>
  );
};

/** Les formes. Aucune ne contient de contenu en dur. */
const Shape: React.FC<{ spec: FloatingAssetSpec }> = ({ spec }) => {
  const accent = spec.color ?? COLORS.blue;

  const surface: React.CSSProperties = {
    backgroundColor: COLORS.white,
    border: SURFACE.border,
    boxShadow: SHADOWS.pill + ", " + SURFACE.rim,
  };

  if (spec.kind === "dot") {
    const size = spec.size ?? 12;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: accent,
          boxShadow: "0 0 0 " + size * 0.55 + "px " + accent + "24",
        }}
      />
    );
  }

  if (spec.kind === "tile") {
    const size = spec.size ?? 64;
    return (
      <div
        style={{
          ...surface,
          width: size,
          height: size,
          borderRadius: size * 0.3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 20 20">
          <path
            d={ICON_PATHS[spec.icon ?? "play"]}
            fill={spec.icon === "check" ? "none" : accent}
            stroke={spec.icon === "check" ? accent : "none"}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (spec.kind === "stat") {
    return (
      <div
        style={{
          ...surface,
          width: spec.size ?? 152,
          padding: "12px 16px",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.9,
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {spec.label}
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: -0.3,
            color: COLORS.ink,
          }}
        >
          {spec.value}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...surface,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 11,
        fontSize: 14,
        fontWeight: 600,
        color: COLORS.inkSoft,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: accent,
        }}
      />
      {spec.label}
    </div>
  );
};
