import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TAAP_FONT, TAAP } from "../taapit/theme";
import { WaveReveal } from "../taapit/WaveReveal";

/**
 * Banc d'essai de l'onde. Les deux contenus sont volontairement schématiques :
 * on valide le mécanisme de bascule, pas la scène 5 elle-même.
 */

const Before: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: TAAP.black,
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TAAP_FONT,
    }}
  >
    <div
      style={{
        width: 300,
        height: 620,
        borderRadius: 44,
        backgroundColor: "#141417",
        border: "1px solid #232327",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "10px 18px",
          borderRadius: 999,
          border: "1px solid #33333A",
          color: "#6B6B73",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Non connecté
      </div>
    </div>
  </AbsoluteFill>
);

const After: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: TAAP.white,
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      fontFamily: TAAP_FONT,
    }}
  >
    <div
      style={{
        fontSize: 66,
        fontWeight: 700,
        color: TAAP.ink,
        letterSpacing: -1.5,
      }}
    >
      Ouvre l&apos;app. Pas le navigateur.
    </div>
    <div
      style={{
        padding: "16px 34px",
        borderRadius: 999,
        backgroundColor: TAAP.green,
        color: TAAP.white,
        fontSize: 24,
        fontWeight: 700,
      }}
    >
      taap.it/lien
    </div>
  </AbsoluteFill>
);

export const ProtoWave: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        // Léger recul de caméra pendant la bascule : l'image s'ouvre.
        scale: interpolate(frame, [0.8 * fps, 2 * fps], [1.06, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <WaveReveal
        before={<Before />}
        after={<After />}
        atInSeconds={0.9}
        durationInSeconds={1.05}
      />
    </AbsoluteFill>
  );
};
