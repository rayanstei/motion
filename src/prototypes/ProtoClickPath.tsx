import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ClickPath, PathPoint } from "../taapit/ClickPath";
import { TAAP_FONT, TAAP } from "../taapit/theme";

/**
 * Banc d'essai du trajet.
 *
 * On joue le même parcours deux fois : d'abord vers la droite, puis en
 * `direction="reverse"`. Les deux appels sont identiques à une prop près —
 * c'est précisément ce qu'il fallait démontrer pour les scènes 7 à 10.
 *
 * Le parcours comporte deux coudes : c'est ce qui servira d'aiguillage.
 */
const PATH: PathPoint[] = [
  { x: 220, y: 540 },
  { x: 620, y: 540 },
  { x: 820, y: 360 },
  { x: 1180, y: 360 },
  { x: 1380, y: 660 },
  { x: 1700, y: 660 },
];

const FORWARD_AT = 0.6;
const FORWARD_FOR = 2.8;
const REVERSE_AT = 4.2;
const REVERSE_FOR = 2.2;

export const ProtoClickPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const label = frame < REVERSE_AT * fps - 0.4 * fps ? "forward" : "reverse";

  return (
    <AbsoluteFill
      style={{ backgroundColor: TAAP.black, fontFamily: TAAP_FONT }}
    >
      {/* Repères aux coudes, pour lire la branche. */}
      {PATH.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - 5,
            top: p.y - 5,
            width: 10,
            height: 10,
            borderRadius: 10,
            border: "1px solid " + TAAP.green,
            opacity: 0.35,
          }}
        />
      ))}

      <ClickPath
        points={PATH}
        atInSeconds={FORWARD_AT}
        durationInSeconds={FORWARD_FOR}
        direction="forward"
      />

      <ClickPath
        points={PATH}
        atInSeconds={REVERSE_AT}
        durationInSeconds={REVERSE_FOR}
        direction="reverse"
        curve={[0.3, 0, 0.2, 1]}
        showRail={false}
        dotSize={13}
      />

      <div
        style={{
          position: "absolute",
          left: 100,
          top: 110,
          color: TAAP.white,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -0.5,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        direction = &quot;{label}&quot;
      </div>

      <div
        style={{
          position: "absolute",
          left: 100,
          top: 156,
          color: TAAP.grey,
          fontSize: 19,
          fontWeight: 500,
        }}
      >
        {label === "forward"
          ? "téléphone → aiguillage → destination"
          : "destination → dashboard"}
      </div>
    </AbsoluteFill>
  );
};
