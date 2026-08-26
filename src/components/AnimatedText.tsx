import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export type Word = {
  text: string;
  /** Instant d'apparition du mot, en secondes. */
  atInSeconds: number;
  /** Mot mis en évidence avec la couleur d'accent + soulignement animé. */
  highlight?: boolean;
  /** Retarde le soulignement pour le faire tomber sur un temps fort. */
  highlightAtInSeconds?: number;
  /** Mot secondaire (la flèche), rendu plus discret. */
  soft?: boolean;
};

/** Reveal d'un mot : opacity + translateY + blur → net. */
const AnimatedWord: React.FC<{ word: Word; fontSize: number }> = ({ word, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = word.atInSeconds * fps;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        color: word.highlight ? COLORS.coral : word.soft ? COLORS.muted : COLORS.ink,
        opacity: interpolate(frame, [at, at + 0.42 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(frame, [at, at + 0.85 * fps], ["0px 34px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        filter:
          "blur(" +
          interpolate(frame, [at, at + 0.4 * fps], [10, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0, 0.1, 1),
          }) +
          "px)",
      }}
    >
      {word.text}
      {word.highlight ? (
        <WordHighlight
          atInSeconds={word.highlightAtInSeconds ?? word.atInSeconds}
          fontSize={fontSize}
        />
      ) : null}
    </span>
  );
};

/** Barre d'accent qui se déploie sous le mot mis en évidence. */
export const WordHighlight: React.FC<{ atInSeconds: number; fontSize: number }> = ({
  atInSeconds,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = atInSeconds * fps;

  return (
    <span
      style={{
        position: "absolute",
        left: 0,
        bottom: -fontSize * 0.12,
        height: fontSize * 0.09,
        borderRadius: fontSize * 0.05,
        backgroundColor: COLORS.coral,
        opacity: 0.32,
        transformOrigin: "left center",
        width: interpolate(frame, [at + 0.3 * fps, at + 1.1 * fps], ["0%", "100%"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    />
  );
};

/**
 * Ligne de titre construite mot par mot (stagger).
 *
 * `offsetX` compense le fait que les mots pas encore visibles occupent déjà
 * leur place : la ligne démarre décalée, puis se recentre quand elle se
 * complète — la phrase courte devient la phrase longue sans coupure.
 */
export const AnimatedText: React.FC<{
  words: Word[];
  fontSize: number;
  gap: number;
  /** 0 pour une ligne qui ne se complète pas en cours de scène. */
  offsetX?: number;
  recenterFromInSeconds?: number;
  recenterToInSeconds?: number;
}> = ({
  words,
  fontSize,
  gap,
  offsetX = 0,
  recenterFromInSeconds = 0,
  recenterToInSeconds = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap,
        fontSize,
        fontWeight: 700,
        letterSpacing: -fontSize * 0.022,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
        translate:
          interpolate(
            frame,
            [recenterFromInSeconds * fps, recenterToInSeconds * fps],
            [offsetX, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.22, 1, 0.28, 1),
            },
          ) + "px 0px",
      }}
    >
      {words.map((word, i) => (
        <AnimatedWord key={word.text + i} word={word} fontSize={fontSize} />
      ))}
    </div>
  );
};
