import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LIGHT, TAAP, lightDepth } from "./theme";

/**
 * Point de décision du lien.
 *
 * C'est le seul asset propriétaire de S3. Aucun composant existant ne
 * convenait : `FloatingAsset` est calibré pour Remakeit, `StatusPill` est un
 * constat passif, alors qu'ici il faut montrer un **choix qui se fait**.
 *
 * Trois états dans un seul composant : en attente (gris, la question posée),
 * puis la décision (le vert entre, la valeur remplace le tiret), puis le
 * repos. La bascule est déclenchée par le passage du clic — la scène passe
 * l'instant, le composant joue la transition.
 */
export const DecisionGate: React.FC<{
  /** La question. */
  label: string;
  /** La réponse. */
  value: string;
  /** Position dans le monde, en px. */
  x: number;
  y: number;
  /** Apparition de la carte. */
  atInSeconds: number;
  /** Instant où le clic passe et où la décision se prend. */
  decideAtInSeconds: number;
}> = ({ label, value, x, y, atInSeconds, decideAtInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const surface = lightDepth(0.45);

  const appear = interpolate(
    frame,
    [atInSeconds * fps, (atInSeconds + 0.5) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  // La décision : franche à l'entrée, longue à se stabiliser.
  const decided = interpolate(
    frame,
    [decideAtInSeconds * fps, (decideAtInSeconds + 0.42) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  // Une impulsion au moment exact du passage, qui retombe vite.
  const pulse = interpolate(
    frame,
    [
      decideAtInSeconds * fps - 0.06 * fps,
      decideAtInSeconds * fps + 0.1 * fps,
      decideAtInSeconds * fps + 0.75 * fps,
    ],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [Easing.bezier(0.3, 0, 0.2, 1), Easing.bezier(0.4, 0, 0.6, 1)],
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        minWidth: 196,
        padding: "16px 20px",
        borderRadius: 18,
        backgroundColor: LIGHT.surface,
        border:
          "1px solid rgba(29,29,30," + (0.09 + decided * 0.02).toFixed(3) + ")",
        boxShadow:
          surface.shadow +
          ", 0 0 0 " +
          pulse * 6 +
          "px rgba(52,209,108," +
          (pulse * 0.16).toFixed(3) +
          ")",
        opacity: appear,
        scale: 0.9 + appear * 0.1 + pulse * 0.018,
        filter: "blur(" + (1 - appear) * 7 + "px)",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.3,
          color: LIGHT.muted,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 7,
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: -0.5,
          color: decided > 0.5 ? TAAP.green : "#C9C9CE",
        }}
      >
        {/* La coche n'arrive qu'avec la décision. */}
        <svg width={19} height={19} viewBox="0 0 20 20">
          <circle
            cx={10}
            cy={10}
            r={8.4}
            fill="none"
            stroke={decided > 0.5 ? TAAP.green : "#DCDCE0"}
            strokeWidth={1.7}
          />
          <path
            d="M6.2 10.3 L8.8 12.9 L13.8 7.4"
            fill="none"
            stroke={TAAP.green}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - decided}
          />
        </svg>

        <span style={{ position: "relative" }}>
          {/* Le tiret cède la place à la réponse. */}
          <span style={{ opacity: 1 - decided, color: "#C9C9CE" }}>—</span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              whiteSpace: "nowrap",
              opacity: decided,
              translate: "0px " + (1 - decided) * 9 + "px",
            }}
          >
            {value}
          </span>
        </span>
      </div>
    </div>
  );
};
