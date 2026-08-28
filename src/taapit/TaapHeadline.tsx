import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LIGHT, TAAP } from "./theme";

export type HeadlineWord = {
  text: string;
  /** Le mot porte l'accent vert. */
  accent?: boolean;
  /** Le mot est secondaire. */
  soft?: boolean;
};

/**
 * Titre Taap.it.
 *
 * L'`AnimatedText` du moteur Remakeit fait un travail équivalent, mais ses
 * couleurs sont celles de Remakeit — un mot accentué y serait corail. Plutôt
 * que d'ajouter des props de couleur à un composant validé, on en écrit un
 * propre à cet univers : chasse plus serrée, graisse plus lourde, accent vert.
 *
 * Le stagger est calculé depuis un seul instant de départ : on décrit quand la
 * phrase commence, pas quand chaque mot arrive.
 */
export const TaapHeadline: React.FC<{
  words: HeadlineWord[];
  atInSeconds: number;
  /** Écart entre deux mots, en secondes. */
  staggerInSeconds?: number;
  fontSize?: number;
  /** Sortie. Absent = le titre reste. */
  untilInSeconds?: number;
  align?: "center" | "left";
}> = ({
  words,
  atInSeconds,
  staggerInSeconds = 0.09,
  fontSize = 82,
  untilInSeconds,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leave =
    untilInSeconds === undefined
      ? 0
      : interpolate(
          frame,
          [untilInSeconds * fps, (untilInSeconds + 0.4) * fps],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.5, 0, 0.75, 0.2),
          },
        );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "baseline",
        gap: fontSize * 0.28,
        fontSize,
        fontWeight: 700,
        // Chasse serrée : c'est ce qui donne le côté compact du site.
        letterSpacing: -fontSize * 0.032,
        lineHeight: 1.06,
        opacity: 1 - leave,
        translate: "0px " + -leave * 34 + "px",
        filter: "blur(" + leave * 7 + "px)",
      }}
    >
      {words.map((word, i) => {
        const at = (atInSeconds + i * staggerInSeconds) * fps;
        return (
          <span
            key={word.text + i}
            style={{
              display: "inline-block",
              color: word.accent
                ? TAAP.green
                : word.soft
                  ? LIGHT.muted
                  : LIGHT.ink,
              opacity: interpolate(frame, [at, at + 0.4 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [at, at + 0.75 * fps],
                ["0px 30px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              filter:
                "blur(" +
                interpolate(frame, [at, at + 0.38 * fps], [9, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 0, 0.1, 1),
                }) +
                "px)",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
