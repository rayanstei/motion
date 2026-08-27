import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ActionButton } from "../components/ActionButton";
import { AnimatedText } from "../components/AnimatedText";
import { AppWindow } from "../components/AppWindow";
import { CameraMovement } from "../components/CameraMovement";
import { Cursor } from "../components/Cursor";
import { GridBackground } from "../components/GridBackground";
import { Outro } from "../components/Outro";
import { Levitate } from "../components/Levitate";
import { VideoCard } from "../components/VideoCard";
import { COLORS, SHADOWS, SURFACE, fontFamily } from "../theme";
import { APP, BRAND, SOURCE_VIDEO, STAGE } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 5 — "Collez une URL YouTube"  (0:15 → 0:19)
 *
 * Première étape du produit. La caméra continue sa poussée de la scène 4
 * et décélère sur la fenêtre de l'application : l'URL se colle, le lien
 * se résout, la vidéo apparaît.
 * ──────────────────────────────────────────────────────────────── */

const URL_TEXT = "https://youtube.com/watch?v=k7Qd2Xm";

const HEADLINE = { fontSize: 80, gap: 24 };

const DEPTH = { headline: 0.5, window: 1 };

const CAMERA = {
  atInSeconds: [0, 0.6, 4],
  zoom: [1.12, 1, 1.03],
  curves: [
    [0.16, 1, 0.3, 1],
    [0.4, 0, 0.6, 1],
  ] as [number, number, number, number][],
};

/* ──────────────────────────────────────────────────────────────── */

export const PasteLinkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typed = Math.round(
    interpolate(frame, [0.6 * fps, 1.5 * fps], [0, URL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    }),
  );

  return (
    <AbsoluteFill
      name="Scène 5 — Coller le lien"
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
        <Levitate amplitude={2.5} periodInSeconds={7}>
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 140,
            }}
          >
            <div
              style={{
                // Bornes négatives : à l'image de la coupe, la fenêtre est déjà
                // là, floue et en sur-zoom. La caméra finit d'y entrer.
                opacity: interpolate(frame, [-0.4 * fps, 0.2 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.4, 0, 0.2, 1),
                }),
                filter:
                  "blur(" +
                  interpolate(frame, [-0.4 * fps, 0.45 * fps], [24, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.2, 0, 0.1, 1),
                  }) +
                  "px)",
              }}
            >
              <AppWindow
                width={APP.windowWidth}
                height={APP.windowHeight}
                label={BRAND.domain}
                brand={BRAND.name}
              />
            </div>
          </AbsoluteFill>

          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: APP.fieldWidth,
                height: APP.fieldHeight,
                paddingLeft: 20,
                paddingRight: 12,
                borderRadius: 16,
                backgroundColor: "#F8FAFD",
                border:
                  "1px solid " +
                  (frame > 1.55 * fps ? "rgba(18,185,129,0.45)" : COLORS.line),
                // Feedback de focus : le champ réagit au clic du curseur.
                boxShadow:
                  "0 0 0 " +
                  interpolate(
                    frame,
                    [0.5 * fps, 0.64 * fps, 1.5 * fps, 1.66 * fps],
                    [0, 4, 4, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: [
                        Easing.bezier(0.16, 1, 0.3, 1),
                        Easing.linear,
                        Easing.bezier(0.4, 0, 0.2, 1),
                      ],
                    },
                  ) +
                  "px rgba(47,107,255,0.14)",
                translate: "0px " + APP.fieldY + "px",
                opacity: interpolate(frame, [0.2 * fps, 0.5 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.4, 0, 0.2, 1),
                }),
              }}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M8.2 11.8 L11.8 8.2 M7.6 6.2 L9 4.8a3.4 3.4 0 0 1 4.8 4.8l-1.4 1.4 M12.4 13.8 L11 15.2a3.4 3.4 0 0 1-4.8-4.8l1.4-1.4"
                  fill="none"
                  stroke={frame > 1.55 * fps ? COLORS.green : COLORS.muted}
                  strokeWidth={1.7}
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: COLORS.inkSoft,
                  whiteSpace: "nowrap",
                }}
              >
                {URL_TEXT.slice(0, typed)}
              </div>
              <div
                style={{
                  width: 2,
                  height: 26,
                  backgroundColor: COLORS.blue,
                  opacity:
                    typed < URL_TEXT.length && Math.floor(frame / 8) % 2 === 0
                      ? 1
                      : 0,
                }}
              />
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 15,
                    fontWeight: 600,
                    color: COLORS.green,
                    opacity: interpolate(
                      frame,
                      [1.55 * fps, 1.75 * fps],
                      [0, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    ),
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 16 16">
                    <path
                      d="M4 8.4 L6.7 11 L12 5.4"
                      fill="none"
                      stroke={COLORS.green}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Vidéo trouvée
                </div>

                <ActionButton label="Générer" fontSize={19} />
              </div>
            </div>
          </AbsoluteFill>

          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div
              style={{
                opacity:
                  interpolate(frame, [0.32 * fps, 0.62 * fps], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }) *
                  interpolate(frame, [1.6 * fps, 1.95 * fps], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                  }),
                translate:
                  "0px " +
                  interpolate(
                    frame,
                    [0.32 * fps, 0.7 * fps],
                    [APP.previewY + 22, APP.previewY],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ) +
                  "px",
              }}
            >
              <PreviewSkeleton />
            </div>
          </AbsoluteFill>

          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div
              style={{
                opacity: interpolate(frame, [1.7 * fps, 2.2 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
                filter:
                  "blur(" +
                  interpolate(frame, [1.7 * fps, 2.3 * fps], [16, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.2, 0, 0.1, 1),
                  }) +
                  "px)",
                translate:
                  "0px " +
                  interpolate(
                    frame,
                    [1.7 * fps, 2.4 * fps],
                    [APP.previewY + 34, APP.previewY],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ) +
                  "px",
                scale: interpolate(
                  frame,
                  [1.7 * fps, 2.4 * fps],
                  [APP.previewScale * 0.92, APP.previewScale],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    output: "perceptual-scale",
                  },
                ),
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
        </Levitate>

        <Cursor
          from={{ x: 1620, y: 1010 }}
          to={{ x: 700, y: 444 }}
          startInSeconds={0.15}
          arriveInSeconds={0.52}
          clickAtInSeconds={0.5}
          leaveAtInSeconds={0.82}
          leaveDurationInSeconds={0.4}
          leaveOffset={{ x: 120, y: 180 }}
          arc={90}
        />
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.headline}
        atInSeconds={CAMERA.atInSeconds}
        zoom={CAMERA.zoom}
        curves={CAMERA.curves}
        driftY={0}
      >
        <Outro atInSeconds={3.6}>
          <AbsoluteFill style={{ paddingTop: 140 }}>
            <AnimatedText
              fontSize={HEADLINE.fontSize}
              gap={HEADLINE.gap}
              words={[
                { text: "Collez", atInSeconds: 0.12 },
                { text: "une", atInSeconds: 0.2 },
                { text: "URL", atInSeconds: 0.28 },
                { text: "YouTube", atInSeconds: 0.36, highlight: true },
              ]}
            />
          </AbsoluteFill>

          <AbsoluteFill style={{ paddingTop: 252 }}>
            <AnimatedText
              fontSize={36}
              gap={12}
              words={[
                { text: "ou", atInSeconds: 2.6, soft: true },
                { text: "écrivez", atInSeconds: 2.66, soft: true },
                { text: "un", atInSeconds: 2.72, soft: true },
                { text: "prompt", atInSeconds: 2.78, soft: true },
              ]}
            />
          </AbsoluteFill>
        </Outro>
      </CameraMovement>
    </AbsoluteFill>
  );
};

/**
 * Squelette de chargement à la place de l'aperçu, le temps que le lien se
 * résolve. Il occupe la fenêtre dès le début de la scène et se fond dans la
 * vraie carte vidéo quand elle arrive.
 */
const PreviewSkeleton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const width = STAGE.cardWidth * APP.previewScale;
  const inner = width - 28;

  return (
    <div
      style={{
        position: "relative",
        width,
        padding: 14,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        border: SURFACE.border,
        boxShadow: SHADOWS.short + ", " + SURFACE.rim,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: inner,
          height: (inner * 9) / 16,
          borderRadius: 14,
          backgroundColor: "#EEF1F7",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          marginTop: 14,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#EEF1F7",
          }}
        />
        <div>
          <div
            style={{
              width: 210,
              height: 11,
              borderRadius: 6,
              backgroundColor: "#EEF1F7",
            }}
          />
          <div
            style={{
              width: 132,
              height: 9,
              marginTop: 7,
              borderRadius: 5,
              backgroundColor: "#F2F4F9",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: -40,
          bottom: -40,
          width: 150,
          background:
            "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
          left: interpolate(
            frame,
            [0.45 * fps, 1.55 * fps],
            [-180, width + 60],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0, 0.35, 1),
            },
          ),
        }}
      />
    </div>
  );
};
