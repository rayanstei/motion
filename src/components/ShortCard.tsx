import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, DOF, SHADOWS, SURFACE, TINTS } from "../theme";

export type ShortSpec = {
  /** Position finale, en px, relative au centre de la composition. */
  x: number;
  y: number;
  /** Inclinaison finale, en degrés. */
  rotate: number;
  /** Échelle finale — crée la profondeur entre les cartes. */
  scale: number;
  /** Décalage de départ (stagger), en secondes. */
  delayInSeconds: number;
  label: string;
  duration: string;
  accent: string;
};

/**
 * Carte "short" verticale 9:16.
 * Elle naît au centre (dans la carte vidéo), se déploie vers sa position
 * finale selon une trajectoire courbe (horizontale et verticale n'ont pas
 * la même durée), puis se stabilise avec un flottement quasi imperceptible.
 */
export const ShortCard: React.FC<
  ShortSpec & {
    width: number;
    /** Instant (en secondes) où la première carte commence à sortir. */
    startInSeconds: number;
    /** Phase du flottement, pour désynchroniser les cartes. */
    floatPhase: number;
  }
> = ({
  x,
  y,
  rotate,
  scale,
  delayInSeconds,
  label,
  duration,
  accent,
  width,
  startInSeconds,
  floatPhase,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = (startInSeconds + delayInSeconds) * fps;
  const local = frame - start;

  const spreadX = interpolate(local, [0, 1.0 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const spreadY = interpolate(local, [0, 1.25 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 1.02, 0.35, 1),
  });

  const settle = interpolate(local, [0.9 * fps, 1.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const float = Math.sin(local / (fps * 0.62) + floatPhase) * 5 * settle;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        height: (width * 16) / 9,
        marginLeft: -width / 2,
        marginTop: (-width * 16) / 9 / 2,
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: COLORS.white,
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: SHADOWS.short,
        opacity: interpolate(local, [0, 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        filter:
          "blur(" +
          (interpolate(local, [0, 0.55 * fps], [14, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0, 0.1, 1),
          }) +
            // Une carte réduite est en retrait : elle perd un cheveu de netteté.
            DOF.fromScale(scale, 0.4)) +
          "px)",
        translate: x * spreadX + "px " + (y * spreadY + float) + "px",
        scale: interpolate(local, [0, 1.0 * fps], [0.3, scale], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1.14, 0.36, 1),
          output: "perceptual-scale",
        }),
        rotate:
          interpolate(local, [0, 1.15 * fps], [0, rotate], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.22, 1.2, 0.36, 1),
          }) +
          Math.sin(local / (fps * 0.9) + floatPhase) * 0.35 * settle +
          "deg",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(150deg, " +
            TINTS.thumbShort[0] +
            " 0%, " +
            TINTS.thumbShort[1] +
            " 55%, " +
            accent +
            " 190%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(52% 34% at 50% 30%, " +
            accent +
            "66 0%, rgba(0,0,0,0) 72%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          padding: "5px 9px",
          borderRadius: 7,
          backgroundColor: "rgba(255,255,255,0.16)",
          border: "1px solid rgba(255,255,255,0.22)",
          color: COLORS.white,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        9:16
      </div>

      <div
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: accent,
          boxShadow: "0 0 0 4px " + accent + "33",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: 44,
          height: 44,
          marginLeft: -22,
          marginTop: -22,
          borderRadius: 22,
          backgroundColor: "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            marginLeft: 4,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderLeft: "13px solid rgba(255,255,255,0.92)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 14,
          background:
            "linear-gradient(to bottom, rgba(11,18,32,0) 0%, rgba(11,18,32,0.62) 45%, rgba(11,18,32,0.88) 100%)",
        }}
      >
        <div
          style={{
            color: COLORS.white,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: -0.2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 7,
          }}
        >
          <div
            style={{
              padding: "3px 7px",
              borderRadius: 6,
              backgroundColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.92)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {duration}
          </div>
          <div
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.24)",
            }}
          />
        </div>
      </div>

      {/* Liseré de verre sur l'arête haute. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          boxShadow: SURFACE.darkRim,
        }}
      />
    </div>
  );
};
