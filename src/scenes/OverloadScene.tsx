import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { CameraMovement } from "../components/CameraMovement";
import { EditorTimeline } from "../components/EditorTimeline";
import { FloatingAssets } from "../components/FloatingAsset";
import { GridBackground } from "../components/GridBackground";
import { VideoCard } from "../components/VideoCard";
import { COLORS, DOF, fontFamily } from "../theme";
import {
  EDITOR_UI,
  SCENE2_ASSETS,
  SCENE2_TRACKS,
  SOURCE_VIDEO,
  STAGE,
} from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 2 — "Mais créer du contenu prend du temps."  (0:03 → 0:07)
 *
 * La carte de la scène 1 arrive déjà posée dans le moniteur : aucun saut
 * au raccord. La table de montage monte par en dessous, les clips
 * s'accumulent de plus en plus vite, et la caméra finit par entrer dans la
 * timeline pour enchaîner sur la scène 3.
 * ──────────────────────────────────────────────────────────────── */

const HEADLINE = { fontSize: 76, gap: 23 };

const DEPTH = { headline: 0.4, preview: 1, panel: 1.12 };

/** Chorégraphie caméra : quasi immobile, puis entrée dans la timeline. */
const CAMERA = {
  atInSeconds: [0, 0.8, 3.2, 4],
  zoom: [STAGE.handoverZoom, 1.05, 1.09, STAGE.chaosZoom],
  curves: [
    [0.4, 0, 0.6, 1],
    [0.4, 0, 0.6, 1],
    [0.4, 0, 0.2, 1],
  ] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const OverloadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Scène 2 — Le montage"
      style={{ backgroundColor: COLORS.bg, fontFamily }}
    >
      <GridBackground glow="deep" />

      <CameraMovement
        depth={0.9}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        sway={0.7}
        motionBlur={1}
        driftY={0}
      >
        <FloatingAssets specs={SCENE2_ASSETS} />
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.preview}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        sway={0.7}
        motionBlur={1}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 350,
          }}
        >
          <div
            style={{
              scale: 0.42,
              // Le moniteur est en second plan : le sujet, c'est la timeline.
              filter: "blur(" + DOF.midground + "px)",
              translate: "0px " + Math.sin(frame / (fps * 1.4)) * 3 + "px",
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
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.panel}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        sway={0.7}
        motionBlur={1}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 410,
          }}
        >
          <div
            style={{
              opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }),
              translate: interpolate(
                frame,
                [0, 0.45 * fps],
                ["0px 96px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              scale: interpolate(frame, [0, 0.45 * fps], [0.97, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                output: "perceptual-scale",
              }),
              filter:
                "blur(" +
                interpolate(frame, [0, 0.3 * fps], [8, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 0, 0.1, 1),
                }) +
                "px)",
            }}
          >
            <div
              style={{
                translate:
                  Math.sin(frame / (fps * 0.8)) * 1.2 +
                  "px " +
                  Math.sin(frame / (fps * 1.1) + 2) * 1.2 +
                  "px",
              }}
            >
              <EditorTimeline
                width={STAGE.panelWidth}
                height={STAGE.panelHeight}
                tracks={SCENE2_TRACKS}
                appName={EDITOR_UI.appName}
                fileName={EDITOR_UI.fileName}
                tools={EDITOR_UI.tools}
                playhead={interpolate(
                  frame,
                  [0.3 * fps, 3.9 * fps],
                  [0.02, 0.8],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.35, 0, 0.65, 1),
                  },
                )}
              />
            </div>
          </div>
        </AbsoluteFill>
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.headline}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        sway={0.7}
        motionBlur={1}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            paddingTop: 140,
            opacity: interpolate(frame, [3.55 * fps, 3.9 * fps], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.5, 0, 0.75, 0.2),
            }),
            translate: interpolate(
              frame,
              [3.55 * fps, 3.9 * fps],
              ["0px 0px", "0px -42px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.5, 0, 0.75, 0.2),
              },
            ),
          }}
        >
          <AnimatedText
            fontSize={HEADLINE.fontSize}
            gap={HEADLINE.gap}
            words={[
              { text: "Mais", atInSeconds: 0.2 },
              { text: "créer", atInSeconds: 0.28 },
              { text: "du", atInSeconds: 0.36 },
              { text: "contenu", atInSeconds: 0.44 },
              { text: "prend", atInSeconds: 0.52 },
              { text: "du", atInSeconds: 0.6 },
              { text: "temps.", atInSeconds: 0.68, highlight: true },
            ]}
          />
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};
