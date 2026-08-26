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
import { GridBackground } from "../components/GridBackground";
import { TimeCounter } from "../components/TimeCounter";
import { VideoCard } from "../components/VideoCard";
import { COLORS, fontFamily } from "../theme";
import { SCENE3_TRACKS, SOURCE_VIDEO, STAGE } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 3 — "Et vous n'avez pas le temps."  (0:07 → 0:10)
 *
 * Même plateau que la scène 2, mais tout s'emballe : clips, curseur de
 * lecture et compteur accélèrent ensemble jusqu'à l'arrêt net.
 * Après l'arrêt, la table de montage tombe et le moniteur revient au
 * centre, à sa taille pleine : c'est de là que naît la scène 4.
 * ──────────────────────────────────────────────────────────────── */

const TIMING = {
  /** Arrêt brutal. Toutes les animations sont bornées ici. */
  stop: 2.3,
  /** Fin du temps de calme, début du dégagement vers la scène 4. */
  clearStart: 2.66,
  clearEnd: 2.98,
};

const HEADLINE = { fontSize: 80, gap: 24 };

const DEPTH = { headline: 0.35, preview: 1, panel: 1.12 };

const CAMERA = {
  atInSeconds: [0, 2.3, 2.5, 3],
  zoom: [STAGE.chaosZoom, 1.26, 1.23, 1.14],
  curves: [
    [0.5, 0, 0.85, 0.4],
    [0.3, 0, 0.2, 1],
    [0.4, 0, 0.2, 1],
  ] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const NoTimeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** 0 → 1, de plus en plus vite, puis figé net à l'arrêt. */
  const chaos = interpolate(frame, [0, 1.5 * fps, TIMING.stop * fps], [0, 0.42, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: [Easing.bezier(0.5, 0, 0.85, 0.4), Easing.bezier(0.6, 0, 1, 0.7)],
  });

  /** Perte d'énergie juste après l'arrêt : le décor passe en arrière-plan. */
  const dim = interpolate(frame, [TIMING.stop * fps, (TIMING.stop + 0.22) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  /** Dégagement final : le montage tombe, la vidéo revient au centre. */
  const clear = interpolate(
    frame,
    [TIMING.clearStart * fps, TIMING.clearEnd * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.25, 1),
    },
  );

  return (
    <AbsoluteFill
      name="Scène 3 — Plus le temps"
      style={{ backgroundColor: COLORS.bg, fontFamily }}
    >
      <GridBackground />

      <CameraMovement
        depth={DEPTH.panel}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", paddingTop: 410 }}
        >
          <div
            style={{
              opacity: (1 - dim * 0.55) * (1 - clear),
              filter: "blur(" + (dim * 3 + clear * 14) + "px) saturate(" + (1 - dim * 0.5) + ")",
              translate:
                Math.sin(frame / (fps * 0.13)) * 2.4 * (1 - dim) +
                "px " +
                (Math.sin(frame / (fps * 0.09) + 1.6) * 2.4 * (1 - dim) + clear * 150) +
                "px",
              scale: 1 - clear * 0.12,
            }}
          >
            <EditorTimeline
              width={STAGE.panelWidth}
              height={STAGE.panelHeight}
              tracks={SCENE3_TRACKS}
              playhead={(0.8 + chaos * 2.4) % 1}
            />
          </div>
        </AbsoluteFill>

        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", paddingBottom: 116 }}
        >
          <div
            style={{
              opacity:
                interpolate(frame, [0.15 * fps, 0.6 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }) *
                (1 - dim * 0.5) *
                (1 - clear),
              filter: "blur(" + (dim * 2 + clear * 12) + "px)",
              translate:
                interpolate(frame, [0.15 * fps, 0.6 * fps], [640, 560], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }) +
                "px " +
                clear * 150 +
                "px",
            }}
          >
            <TimeCounter
              width={276}
              label="Temps de montage"
              seconds={4380 + chaos * 23000}
              handRotation={chaos * 2600}
              intensity={interpolate(frame, [1.4 * fps, 2 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          </div>
        </AbsoluteFill>
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.preview}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", paddingBottom: 350 }}
        >
          <div
            style={{
              opacity: (1 - dim * 0.4) * (1 - clear),
              filter: "blur(" + clear * 16 + "px)",
              translate: "0px " + (Math.sin(frame / (fps * 1.4)) * 3 + clear * 235) + "px",
              scale: 0.42 + clear * 0.46,
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
        depth={DEPTH.headline}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            paddingTop: 140,
            opacity: interpolate(frame, [2.72 * fps, TIMING.clearEnd * fps], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.5, 0, 0.75, 0.2),
            }),
            translate: interpolate(
              frame,
              [2.72 * fps, TIMING.clearEnd * fps],
              ["0px 0px", "0px -40px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.5, 0, 0.75, 0.2),
              },
            ),
            scale: interpolate(
              frame,
              [TIMING.stop * fps, (TIMING.stop + 0.16) * fps],
              [1, 1.045],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                output: "perceptual-scale",
              },
            ),
          }}
        >
          <AnimatedText
            fontSize={HEADLINE.fontSize}
            gap={HEADLINE.gap}
            words={[
              { text: "Et", atInSeconds: 0.2 },
              { text: "vous", atInSeconds: 0.27 },
              { text: "n'avez", atInSeconds: 0.34 },
              { text: "pas", atInSeconds: 0.41 },
              { text: "le", atInSeconds: 0.48 },
              {
                text: "temps.",
                atInSeconds: 0.55,
                highlight: true,
                highlightAtInSeconds: 2.16,
              },
            ]}
          />
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};
