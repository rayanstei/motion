import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShortCard, ShortSpec } from "./ShortCard";
import { COLORS, EASE, SHADOWS, SURFACE } from "../theme";

export const ShortsBoard: React.FC<{
  /** Les cartes à disposer : position, libellé, durée, accent. */
  shorts: ShortSpec[];
  /** Largeur d'une carte, en px. */
  width: number;
  /** Instant où le premier short sort (les autres suivent en stagger). */
  shortsStartInSeconds: number;
  /** Instant où les pastilles de publication démarrent. Absent = pas de pastilles. */
  publishStartInSeconds?: number;
  /** Libellés d'état des pastilles. */
  statusPending?: string;
  statusDone?: string;
}> = ({
  shorts,
  width,
  shortsStartInSeconds,
  publishStartInSeconds,
  statusPending = "",
  statusDone = "",
}) => {
  return (
    <AbsoluteFill>
      {shorts.map((short, i) => (
        <ShortCard
          key={short.label}
          {...short}
          width={width}
          startInSeconds={shortsStartInSeconds}
          floatPhase={i * 1.7}
        />
      ))}

      {publishStartInSeconds === undefined
        ? null
        : shorts.map((short, i) => (
            <PublishPill
              key={short.label}
              x={short.x}
              accent={short.accent}
              atInSeconds={publishStartInSeconds + i * 0.22}
              pendingLabel={statusPending}
              doneLabel={statusDone}
            />
          ))}
    </AbsoluteFill>
  );
};

/** Pastille d'état sous un short : envoi en cours, puis publié. */
const PublishPill: React.FC<{
  x: number;
  accent: string;
  atInSeconds: number;
  pendingLabel: string;
  doneLabel: string;
}> = ({ x, accent, atInSeconds, pendingLabel, doneLabel }) => {
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

  // Dépassement discret : la pastille se pose au lieu de s'arrêter net.
  const pop = interpolate(frame, [at - 0.2 * fps, at + 0.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(EASE.pop[0], EASE.pop[1], EASE.pop[2], EASE.pop[3]),
  });

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
          border: SURFACE.border,
          boxShadow: SHADOWS.pill + ", " + SURFACE.rim,
          opacity: appear,
          // Les shorts flottent déjà : la pastille suit, avec sa propre phase.
          translate:
            x +
            "px " +
            (252 +
              (1 - appear) * 14 +
              Math.sin((frame / fps / 5.5) * Math.PI * 2 + x / 128) *
                2 *
                appear) +
            "px",
          scale: 0.9 + pop * 0.1,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 20 20">
          <circle
            cx={10}
            cy={10}
            r={8}
            fill="none"
            stroke={COLORS.line}
            strokeWidth={2.5}
          />
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
          {done ? doneLabel : pendingLabel}
        </div>
      </div>
    </AbsoluteFill>
  );
};
