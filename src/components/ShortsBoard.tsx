import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShortCard, ShortSpec } from "./ShortCard";
import { COLORS, SHADOWS } from "../theme";

/**
 * Le trio de shorts, avec sa géométrie figée une bonne fois pour toutes.
 * Les scènes 6 à 10 réutilisent ce même plateau : c'est ce qui rend les
 * raccords invisibles d'une scène à l'autre.
 */
export const BOARD_WIDTH = 200;

export const BOARD_SHORTS: ShortSpec[] = [
  {
    x: -256,
    y: 40,
    rotate: -2.5,
    scale: 1,
    delayInSeconds: 0,
    label: "Le hook",
    duration: "0:34",
    accent: COLORS.blue,
  },
  {
    x: 0,
    y: 22,
    rotate: 0.5,
    scale: 1.04,
    delayInSeconds: 0.35,
    label: "L'astuce",
    duration: "0:28",
    accent: COLORS.coral,
  },
  {
    x: 256,
    y: 46,
    rotate: 2.5,
    scale: 0.98,
    delayInSeconds: 0.7,
    label: "La preuve",
    duration: "0:41",
    accent: COLORS.green,
  },
];

export const ShortsBoard: React.FC<{
  /** Instant où le premier short sort (les autres suivent en stagger). */
  shortsStartInSeconds: number;
  /** Instant où les pastilles de publication démarrent. Absent = pas de pastilles. */
  publishStartInSeconds?: number;
}> = ({ shortsStartInSeconds, publishStartInSeconds }) => {
  return (
    <AbsoluteFill>
      {BOARD_SHORTS.map((short, i) => (
        <ShortCard
          key={short.label}
          {...short}
          width={BOARD_WIDTH}
          startInSeconds={shortsStartInSeconds}
          floatPhase={i * 1.7}
        />
      ))}

      {publishStartInSeconds === undefined
        ? null
        : BOARD_SHORTS.map((short, i) => (
            <PublishPill
              key={short.label}
              x={short.x}
              accent={short.accent}
              atInSeconds={publishStartInSeconds + i * 0.22}
            />
          ))}
    </AbsoluteFill>
  );
};

/** Pastille d'état sous un short : envoi en cours, puis publié. */
const PublishPill: React.FC<{ x: number; accent: string; atInSeconds: number }> = ({
  x,
  accent,
  atInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const at = atInSeconds * fps;

  const appear = interpolate(frame, [at - 0.2 * fps, at + 0.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const progress = interpolate(frame, [at, at + 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const done = progress >= 1;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "10px 16px",
          borderRadius: 13,
          backgroundColor: COLORS.white,
          border: "1px solid " + COLORS.line,
          boxShadow: SHADOWS.short,
          opacity: appear,
          translate: x + "px " + (252 + (1 - appear) * 14) + "px",
          scale: 0.9 + appear * 0.1,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 20 20">
          <circle cx={10} cy={10} r={8} fill="none" stroke={COLORS.line} strokeWidth={2.5} />
          <circle
            cx={10}
            cy={10}
            r={8}
            fill="none"
            stroke={done ? COLORS.green : accent}
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
            style={{ rotate: "-90deg", transformOrigin: "center" }}
          />
          {done ? (
            <path
              d="M6.4 10.2 L9 12.7 L13.7 7.6"
              fill="none"
              stroke={COLORS.green}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>

        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: done ? COLORS.ink : COLORS.muted,
          }}
        >
          {done ? "Publié" : "Envoi…"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
