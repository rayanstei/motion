import { AbsoluteFill } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { CameraMovement } from "../components/CameraMovement";
import { FloatingAssets } from "../components/FloatingAsset";
import { GridBackground } from "../components/GridBackground";
import { Outro } from "../components/Outro";
import { ShortsBoard } from "../components/ShortsBoard";
import { COLORS, fontFamily } from "../theme";
import { BOARD_ASSETS, BOARD_HANDOVER } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 8 — "Publication automatique."  (0:26,5 → 0:30)
 *
 * Rien ne bouge à la coupe : les shorts sont au même endroit qu'en
 * scène 7. Seules les pastilles d'état apparaissent, en stagger.
 * ──────────────────────────────────────────────────────────────── */

const HEADLINE = { fontSize: 80, gap: 24 };

const DEPTH = { headline: 0.5, board: 1.08 };

const CAMERA = {
  atInSeconds: [0, 3.5],
  zoom: [1.02, 1.05],
  curves: [[0.4, 0, 0.6, 1]] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const AutoPublishScene: React.FC = () => {
  return (
    <AbsoluteFill
      name="Scène 8 — Publication"
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
        <FloatingAssets specs={BOARD_ASSETS} timeOffsetInSeconds={3.5} />
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.board}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <ShortsBoard
          shortsStartInSeconds={BOARD_HANDOVER.shortsScene8}
          publishStartInSeconds={BOARD_HANDOVER.publishScene8}
        />
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
                { text: "Publication", atInSeconds: 0.3 },
                { text: "automatique.", atInSeconds: 0.4, highlight: true },
              ]}
            />
          </AbsoluteFill>
        </Outro>
      </CameraMovement>
    </AbsoluteFill>
  );
};
