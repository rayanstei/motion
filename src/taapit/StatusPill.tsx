import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DARK, TAAP, darkDepth } from "./theme";

/**
 * Pastille d'état flottante, univers sombre.
 *
 * Elle sert à nommer une conséquence en trois mots, sans texte long. Sur fond
 * noir elle ne peut pas s'appuyer sur une ombre : elle utilise le même
 * système de profondeur que le téléphone — liseré, tranche, nappe.
 *
 * `tone` change l'icône et l'accent, jamais la structure : les pastilles
 * négatives de l'acte 1 et les positives de l'acte 3 doivent se répondre.
 */
export const StatusPill: React.FC<{
  label: string;
  tone?: "negative" | "positive";
  atInSeconds: number;
  /** Décalage depuis le centre de la composition, en px. */
  x: number;
  y: number;
  /** Sortie. Absent = reste jusqu'à la fin. */
  untilInSeconds?: number;
}> = ({ label, tone = "negative", atInSeconds, x, y, untilInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = tone === "positive" ? TAAP.green : "#F0576B";
  const style = darkDepth(0.45, accent);

  const appear = interpolate(
    frame,
    [atInSeconds * fps, (atInSeconds + 0.42) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  // Léger dépassement sur l'échelle : la pastille se pose au lieu de surgir.
  const pop = interpolate(
    frame,
    [atInSeconds * fps, (atInSeconds + 0.42) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.32, 0.64, 1),
    },
  );

  const leave =
    untilInSeconds === undefined
      ? 0
      : interpolate(
          frame,
          [untilInSeconds * fps, (untilInSeconds + 0.35) * fps],
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
        position: "absolute",
        left: "50%",
        top: "50%",
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "13px 20px",
        borderRadius: 999,
        backgroundColor: DARK.surface,
        backgroundImage: style.lift,
        border: style.border,
        boxShadow: style.rim + ", 0 18px 46px rgba(0,0,0,0.55)",
        whiteSpace: "nowrap",
        opacity: appear * (1 - leave),
        translate: x + "px " + (y + (1 - appear) * 14 + leave * 10) + "px",
        scale: 0.92 + pop * 0.08,
        filter: "blur(" + ((1 - appear) * 6 + leave * 5) + "px)",
      }}
    >
      <svg width={17} height={17} viewBox="0 0 18 18">
        <circle
          cx={9}
          cy={9}
          r={7.6}
          fill="none"
          stroke={accent}
          strokeWidth={1.5}
          opacity={0.85}
        />
        {tone === "positive" ? (
          <path
            d="M5.6 9.3 L7.9 11.5 L12.4 6.7"
            fill="none"
            stroke={accent}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6.2 6.2 L11.8 11.8 M11.8 6.2 L6.2 11.8"
            fill="none"
            stroke={accent}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span
        style={{
          color: DARK.text,
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </span>
    </div>
  );
};
