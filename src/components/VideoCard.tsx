import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SHADOWS } from "../theme";

/**
 * Carte "vidéo YouTube" : miniature 16:9 + UI crédible (durée, progression,
 * chaîne, bouton d'action). Le bouton s'enfonce au moment du clic, puis un
 * balayage lumineux traverse la miniature : c'est la "génération" des shorts.
 */
export const VideoCard: React.FC<{
  width: number;
  title: string;
  channel: string;
  meta: string;
  duration: string;
  /** Instant (en secondes) où le curseur clique sur le bouton. */
  clickAtInSeconds: number;
  /** false pour une carte de contenu simple, sans appel à l'action. */
  showAction?: boolean;
}> = ({ width, title, channel, meta, duration, clickAtInSeconds, showAction = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const click = clickAtInSeconds * fps;

  return (
    <div
      style={{
        width,
        padding: 20,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        border: "1px solid " + COLORS.line,
        boxShadow: SHADOWS.card,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(135deg, #131B2E 0%, #1E2C4D 48%, #24365C 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(46% 60% at 30% 38%, rgba(47,107,255,0.55) 0%, rgba(47,107,255,0) 70%), radial-gradient(40% 52% at 76% 74%, rgba(255,107,74,0.42) 0%, rgba(255,107,74,0) 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 92,
            height: 92,
            marginLeft: -46,
            marginTop: -46,
            borderRadius: 46,
            backgroundColor: "rgba(255,255,255,0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            scale: interpolate(frame, [0, 0.9 * fps], [0.86, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 6,
              borderTop: "15px solid transparent",
              borderBottom: "15px solid transparent",
              borderLeft: "24px solid " + COLORS.ink,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 30,
            padding: "6px 12px",
            borderRadius: 8,
            backgroundColor: "rgba(11,18,32,0.72)",
            color: COLORS.white,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          {duration}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            backgroundColor: "rgba(255,255,255,0.28)",
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: COLORS.coral,
              width: interpolate(frame, [0, 5 * fps], ["34%", "46%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }),
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 180,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(160,200,255,0.30) 55%, rgba(255,255,255,0) 100%)",
            opacity: interpolate(
              frame,
              [click, click + 0.12 * fps, click + 0.7 * fps, click + 0.95 * fps],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: [
                  Easing.bezier(0.4, 0, 0.2, 1),
                  Easing.linear,
                  Easing.bezier(0.4, 0, 0.2, 1),
                ],
              },
            ),
            translate: interpolate(
              frame,
              [click, click + 0.95 * fps],
              ["0px -180px", "0px 500px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.45, 0, 0.35, 1),
              },
            ),
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 20,
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            flexShrink: 0,
            background: "linear-gradient(135deg, #2F6BFF 0%, #7AA0FF 100%)",
          }}
        />

        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <div
            style={{
              fontSize: 25,
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: -0.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 19, fontWeight: 500, color: COLORS.muted, marginTop: 4 }}>
            {channel} · {meta}
          </div>
        </div>

        {showAction ? (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 22px",
              borderRadius: 14,
              backgroundColor: COLORS.blue,
              color: COLORS.white,
              fontSize: 20,
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: SHADOWS.button,
              scale: interpolate(
                frame,
                [click - 0.06 * fps, click + 0.08 * fps, click + 0.34 * fps],
                [1, 0.955, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: [Easing.bezier(0.4, 0, 1, 1), Easing.bezier(0.34, 1.56, 0.64, 1)],
                  output: "perceptual-scale",
                },
              ),
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 5,
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            />
            Générer les shorts
          </div>
        ) : null}
      </div>
    </div>
  );
};
