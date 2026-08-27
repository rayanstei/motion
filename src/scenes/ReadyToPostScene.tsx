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
import { FloatingAssets } from "../components/FloatingAsset";
import { GridBackground } from "../components/GridBackground";
import { Outro } from "../components/Outro";
import { ShortsBoard } from "../components/ShortsBoard";
import { COLORS, fontFamily } from "../theme";
import { AnalysisStrip } from "./AiClippingScene";
import { APP, BOARD_ASSETS, BOARD_HANDOVER } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 7 — "Prêt à poster."  (0:23 → 0:26,5)
 *
 * L'interface s'efface, les shorts restent exactement où ils étaient :
 * ils sortent de l'outil et deviennent le sujet.
 * ──────────────────────────────────────────────────────────────── */

const HEADLINE = { fontSize: 80, gap: 24 };

const DEPTH = { headline: 0.5, window: 1, board: 1.08 };

const CAMERA = {
  atInSeconds: [0, 3.5],
  zoom: [1.06, 1.02],
  curves: [[0.4, 0, 0.6, 1]] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const ReadyToPostScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leave = interpolate(frame, [0, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.35, 1),
  });

  return (
    <AbsoluteFill
      name="Scène 7 — Prêt à poster"
      style={{ backgroundColor: COLORS.bg, fontFamily }}
    >
      <GridBackground glow="wide" />

      <CameraMovement
        depth={0.9}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <FloatingAssets specs={BOARD_ASSETS} />
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.window}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 140,
          }}
        >
          <div
            style={{
              opacity: 1 - leave,
              filter: "blur(" + leave * 16 + "px)",
              scale: 1 + leave * 0.06,
            }}
          >
            <AppWindow
              width={APP.windowWidth}
              height={APP.windowHeight}
              label="remakeit.io"
            />
          </div>
        </AbsoluteFill>

        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              opacity: 1 - leave,
              filter: "blur(" + leave * 16 + "px)",
              translate: "0px " + (APP.analysisY + leave * 40) + "px",
              scale: 1 - leave * 0.06,
            }}
          >
            <AnalysisStrip timeOffsetInSeconds={4} />
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
        <ShortsBoard shortsStartInSeconds={BOARD_HANDOVER.shortsScene7} />
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.headline}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <Outro atInSeconds={3.1}>
          <AbsoluteFill style={{ paddingTop: 140 }}>
            <AnimatedText
              fontSize={HEADLINE.fontSize}
              gap={HEADLINE.gap}
              words={[
                { text: "Prêt", atInSeconds: 0.35, highlight: true },
                { text: "à", atInSeconds: 0.43 },
                { text: "poster.", atInSeconds: 0.51 },
              ]}
            />
          </AbsoluteFill>

          <AbsoluteFill style={{ paddingTop: 252 }}>
            <AnimatedText
              fontSize={36}
              gap={12}
              words={[
                { text: "Optimisé", atInSeconds: 0.95, soft: true },
                { text: "TikTok", atInSeconds: 1.03, soft: true },
              ]}
            />
          </AbsoluteFill>
        </Outro>
      </CameraMovement>
    </AbsoluteFill>
  );
};
