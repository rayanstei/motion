import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { CameraMovement } from "../components/CameraMovement";
import { GridBackground } from "../components/GridBackground";
import { Outro } from "../components/Outro";
import { ShortsBoard } from "../components/ShortsBoard";
import { COLORS, fontFamily } from "../theme";
import { BOARD_HANDOVER } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 9 — "Pas de montage. Pas de compétences."  (0:30 → 0:33)
 *
 * Le plateau reste identique mais recule d'un cran : il passe en
 * arrière-plan et le texte devient le point focal. C'est la réponse
 * directe à la scène 3.
 * ──────────────────────────────────────────────────────────────── */

const HEADLINE = { fontSize: 72, gap: 22 };

const DEPTH = { headline: 0.5, board: 1.08 };

const CAMERA = {
  atInSeconds: [0, 3],
  zoom: [1.05, 1],
  curves: [[0.4, 0, 0.6, 1]] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const NoSkillsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** Le plateau passe derrière le texte. */
  const recede = interpolate(frame, [0.4 * fps, 1.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill
      name="Scène 9 — Sans montage"
      style={{ backgroundColor: COLORS.bg, fontFamily }}
    >
      <GridBackground />

      <CameraMovement
        depth={DEPTH.board}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            opacity: 1 - recede * 0.3,
            filter: "blur(" + recede * 1.6 + "px)",
            scale: 1 - recede * 0.045,
          }}
        >
          <ShortsBoard
            shortsStartInSeconds={BOARD_HANDOVER.shortsScene9}
            publishStartInSeconds={BOARD_HANDOVER.publishScene9}
          />
        </AbsoluteFill>
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.headline}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <Outro atInSeconds={2.6}>
          <AbsoluteFill style={{ paddingTop: 140 }}>
            <AnimatedText
              fontSize={HEADLINE.fontSize}
              gap={HEADLINE.gap}
              words={[
                { text: "Pas", atInSeconds: 0.3 },
                { text: "de", atInSeconds: 0.37 },
                { text: "montage.", atInSeconds: 0.44, highlight: true },
                // Micro-pause avant la seconde moitié : c'est elle qui porte.
                { text: "Pas", atInSeconds: 0.82 },
                { text: "de", atInSeconds: 0.89 },
                { text: "compétences.", atInSeconds: 0.96 },
              ]}
            />
          </AbsoluteFill>
        </Outro>
      </CameraMovement>
    </AbsoluteFill>
  );
};
