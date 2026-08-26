import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ActionButton } from "../components/ActionButton";
import { AnimatedText } from "../components/AnimatedText";
import { CameraMovement } from "../components/CameraMovement";
import { GridBackground } from "../components/GridBackground";
import { ShortsBoard } from "../components/ShortsBoard";
import { COLORS, fontFamily } from "../theme";
import { BOARD_HANDOVER } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 10 — Appel à l'action  (0:33 → 0:37)
 *
 * Le plateau finit de reculer et devient une toile de fond floue.
 * Le nom, la promesse et le bouton arrivent par-dessus, en stagger.
 *
 * Le texte de cette scène reprend les formulations de remakeit.io.
 * ──────────────────────────────────────────────────────────────── */

const TAGLINE = "Créez des vidéos virales qui rapportent, automatiquement.";
const CTA_LABEL = "Créer ma première vidéo virale (gratuit)";

const DEPTH = { cta: 0.7, board: 1.08 };

const CAMERA = {
  atInSeconds: [0, 4],
  zoom: [1, 1.04],
  curves: [[0.4, 0, 0.6, 1]] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** Reprend exactement l'état où la scène 9 s'arrête, puis va au bout. */
  const recede = interpolate(frame, [0, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill
      name="Scène 10 — Appel à l'action"
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
            opacity: 0.7 - recede * 0.26,
            filter: "blur(" + (1.6 + recede * 4.4) + "px)",
            scale: 0.955 - recede * 0.115,
          }}
        >
          <ShortsBoard
            shortsStartInSeconds={BOARD_HANDOVER.shortsScene10}
            publishStartInSeconds={BOARD_HANDOVER.publishScene10}
          />
        </AbsoluteFill>
      </CameraMovement>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(44% 38% at 50% 50%, rgba(251,251,253,0.86) 0%, rgba(251,251,253,0) 74%)",
          opacity: interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
        }}
      />

      <CameraMovement
        depth={DEPTH.cta}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <AbsoluteFill style={{ paddingTop: 336 }}>
          <AnimatedText
            fontSize={96}
            gap={24}
            words={[{ text: "Remakeit", atInSeconds: 0.5 }]}
          />
        </AbsoluteFill>

        <AbsoluteFill style={{ paddingTop: 486, alignItems: "center" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: COLORS.inkSoft,
              letterSpacing: -0.3,
              whiteSpace: "nowrap",
              opacity: interpolate(frame, [1.1 * fps, 1.55 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [1.1 * fps, 1.8 * fps],
                ["0px 26px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              filter:
                "blur(" +
                interpolate(frame, [1.1 * fps, 1.5 * fps], [8, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 0, 0.1, 1),
                }) +
                "px)",
            }}
          >
            {TAGLINE}
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ paddingTop: 606, alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              opacity: interpolate(frame, [1.75 * fps, 2.15 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [1.75 * fps, 2.45 * fps],
                ["0px 22px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
              scale: interpolate(
                frame,
                [1.75 * fps, 2.45 * fps, 4 * fps],
                [0.9, 1, 1.015],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: [
                    Easing.bezier(0.34, 1.4, 0.64, 1),
                    Easing.bezier(0.4, 0, 0.6, 1),
                  ],
                  output: "perceptual-scale",
                },
              ),
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: 80,
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(47,107,255,0.16) 0%, rgba(47,107,255,0) 72%)",
                opacity: interpolate(frame, [2.1 * fps, 2.7 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.4, 0, 0.2, 1),
                }),
              }}
            />
            <ActionButton label={CTA_LABEL} fontSize={27} />
          </div>
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};
