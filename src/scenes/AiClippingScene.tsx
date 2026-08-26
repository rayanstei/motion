import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { AppWindow } from "../components/AppWindow";
import { CameraMovement } from "../components/CameraMovement";
import { GridBackground } from "../components/GridBackground";
import { VideoCard } from "../components/VideoCard";
import { COLORS, SHADOWS, fontFamily } from "../theme";
import { BOARD_SHORTS, ShortsBoard } from "../components/ShortsBoard";
import { APP, BOARD_HANDOVER, SOURCE_VIDEO, STAGE } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 6 — "L'IA crée votre vidéo"  (0:19 → 0:23)
 *
 * Même fenêtre qu'en scène 5 : la vidéo collée descend dans la bande
 * d'analyse, un balayage la parcourt, les passages retenus s'allument,
 * et les shorts en sortent. Le plateau de shorts démarre ici et ne
 * bougera plus jusqu'à la fin de la vidéo.
 * ──────────────────────────────────────────────────────────────── */

const HEADLINE = { fontSize: 80, gap: 24 };

const DEPTH = { headline: 0.5, window: 1, board: 1.08 };

const CAMERA = {
  atInSeconds: [0, 4],
  zoom: [1.03, 1.06],
  curves: [[0.4, 0, 0.6, 1]] as [number, number, number, number][],
};

/**
 * Découpage de la vidéo source. Les passages retenus portent la couleur du
 * short qu'ils produisent : on voit d'où vient chaque carte.
 */
const SEGMENTS = [
  { start: 0.0, width: 0.1, at: 0, accent: "" },
  { start: 0.11, width: 0.08, at: 0.9, accent: BOARD_SHORTS[0].accent },
  { start: 0.2, width: 0.12, at: 0, accent: "" },
  { start: 0.33, width: 0.09, at: 1.25, accent: BOARD_SHORTS[1].accent },
  { start: 0.43, width: 0.11, at: 0, accent: "" },
  { start: 0.55, width: 0.08, at: 1.6, accent: BOARD_SHORTS[2].accent },
  { start: 0.64, width: 0.13, at: 0, accent: "" },
  { start: 0.78, width: 0.09, at: 0, accent: "" },
  { start: 0.88, width: 0.11, at: 0, accent: "" },
];

/* ──────────────────────────────────────────────────────────────── */

export const AiClippingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leave = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.35, 1),
  });

  return (
    <AbsoluteFill
      name="Scène 6 — Le clipping"
      style={{ backgroundColor: COLORS.bg, fontFamily }}
    >
      <GridBackground />

      <CameraMovement
        depth={DEPTH.window}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", paddingTop: 140 }}
        >
          <AppWindow
            width={APP.windowWidth}
            height={APP.windowHeight}
            label="remakeit.io"
          />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              opacity: 1 - leave,
              filter: "blur(" + leave * 12 + "px)",
              translate: "0px " + (APP.previewY + leave * 96) + "px",
              scale: APP.previewScale * (1 - leave * 0.42),
            }}
          >
            <VideoCard
              width={STAGE.cardWidth}
              title={SOURCE_VIDEO.title}
              channel={SOURCE_VIDEO.channel}
              meta={SOURCE_VIDEO.meta}
              duration={SOURCE_VIDEO.duration}
              clickAtInSeconds={99}
              showAction={false}
            />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              opacity: interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }),
              translate:
                "0px " +
                interpolate(frame, [0.2 * fps, 0.8 * fps], [APP.analysisY + 30, APP.analysisY], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }) +
                "px",
            }}
          >
            <AnalysisStrip />
          </div>
        </AbsoluteFill>
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.board}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <ShortsBoard shortsStartInSeconds={BOARD_HANDOVER.shortsScene6} />
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.headline}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill style={{ paddingTop: 140 }}>
          <AnimatedText
            fontSize={HEADLINE.fontSize}
            gap={HEADLINE.gap}
            words={[
              { text: "L'IA", atInSeconds: 0.3, highlight: true },
              { text: "crée", atInSeconds: 0.4 },
              { text: "votre", atInSeconds: 0.5 },
              { text: "vidéo", atInSeconds: 0.6 },
            ]}
          />
        </AbsoluteFill>

        <AbsoluteFill style={{ paddingTop: 252 }}>
          <AnimatedText
            fontSize={36}
            gap={12}
            words={[
              { text: "Clipping", atInSeconds: 2.5, soft: true },
              { text: "automatique", atInSeconds: 2.58, soft: true },
            ]}
          />
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};

/**
 * Bande d'analyse : les passages retenus s'allument, un balayage passe.
 * `timeOffsetInSeconds` permet à la scène 7 de reprendre l'horloge de la
 * scène 6 pour que la bande ne se réinitialise pas à la coupe.
 */
export const AnalysisStrip: React.FC<{ timeOffsetInSeconds?: number }> = ({
  timeOffsetInSeconds = 0,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame() + timeOffsetInSeconds * fps;

  const laneWidth = APP.analysisWidth - 28 - 96;

  return (
    <div
      style={{
        position: "relative",
        width: APP.analysisWidth,
        height: APP.analysisHeight,
        padding: 14,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        border: "1px solid " + COLORS.line,
        boxShadow: SHADOWS.short,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 0,
          bottom: 0,
          width: 88,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.blue }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.inkSoft }}>Analyse</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 14 + 96,
          top: 14,
          width: laneWidth,
          height: APP.analysisHeight - 28,
          borderRadius: 10,
          backgroundColor: "#F3F5FA",
        }}
      >
        {SEGMENTS.map((segment) => (
          <div
            key={segment.start}
            style={{
              position: "absolute",
              left: segment.start * laneWidth + 3,
              top: 4,
              width: segment.width * laneWidth - 6,
              bottom: 4,
              borderRadius: 7,
              background: segment.accent
                ? "linear-gradient(180deg, " +
                  segment.accent +
                  "F2 0%, " +
                  segment.accent +
                  "CC 100%)"
                : "linear-gradient(180deg, #D3DAE7 0%, #C6CEDD 100%)",
              boxShadow: segment.accent
                ? "0 0 0 3px " + segment.accent + "2E, inset 0 1px 0 rgba(255,255,255,0.35)"
                : "inset 0 1px 0 rgba(255,255,255,0.5)",
              opacity: segment.accent
                ? interpolate(
                    frame,
                    [segment.at * fps, (segment.at + 0.3) * fps],
                    [0.35, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  )
                : 1,
              scale: segment.accent
                ? interpolate(
                    frame,
                    [segment.at * fps, (segment.at + 0.35) * fps],
                    [0.94, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.34, 1.4, 0.64, 1),
                      output: "perceptual-scale",
                    },
                  )
                : 1,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            top: -6,
            bottom: -6,
            width: 2,
            borderRadius: 1,
            backgroundColor: COLORS.blue,
            boxShadow: "0 0 16px 4px rgba(47,107,255,0.35)",
            left: interpolate(frame, [0.5 * fps, 2 * fps], [0, laneWidth], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0, 0.35, 1),
            }),
            opacity: interpolate(
              frame,
              [0.4 * fps, 0.6 * fps, 2 * fps, 2.25 * fps],
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
          }}
        />
      </div>
    </div>
  );
};
