import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { CameraMovement } from "../components/CameraMovement";
import { GridBackground } from "../components/GridBackground";
import { ShortCard, ShortSpec } from "../components/ShortCard";
import { VideoCard } from "../components/VideoCard";
import { COLORS, fontFamily } from "../theme";

/* ────────────────────────────────────────────────────────────────
 * Réglages de la scène — tout ce qui se retouche souvent est ici.
 * ──────────────────────────────────────────────────────────────── */

/** Repères temporels, en secondes. */
const TIMING = {
  /** Le curseur entre dans le cadre. */
  cursorIn: 0.35,
  /** Clic sur "Générer les shorts". */
  click: 1.0,
  /** Première carte short qui sort de la vidéo. */
  shortsStart: 1.15,
  /** Le titre complet se révèle. */
  headline: 3.5,
};

/** Carte vidéo centrale. `height` sert à ancrer les connexions sur son bord. */
const CARD = { width: 780, height: 522, offsetY: 60 };

/** Titre. `offsetX` recentre la phrase quand elle se complète. */
const HEADLINE = { fontSize: 88, gap: 26, top: 140, offsetX: 403 };

/** Le curseur vise le centre du bouton de la carte. */
const CURSOR = { fromX: 1580, fromY: 1040, toX: 1200, toY: 818 };

/** Profondeur des couches (parallax). 1 = plan de la carte vidéo. */
const DEPTH = { headline: 0.62, card: 1, shorts: 1.16 };

/** Cartes shorts — ajouter ou retirer une entrée suffit. */
const SHORT_WIDTH = 176;
const SHORTS: ShortSpec[] = [
  {
    x: -680,
    y: -70,
    rotate: -6.5,
    scale: 1,
    delayInSeconds: 0,
    label: "Le hook",
    duration: "0:34",
    accent: COLORS.blue,
  },
  {
    x: 500,
    y: -95,
    rotate: 3,
    scale: 1.06,
    delayInSeconds: 0.16,
    label: "L'astuce",
    duration: "0:28",
    accent: COLORS.coral,
  },
  {
    x: -520,
    y: 215,
    rotate: -2.5,
    scale: 0.94,
    delayInSeconds: 0.32,
    label: "La preuve",
    duration: "0:41",
    accent: COLORS.green,
  },
  {
    x: 665,
    y: 140,
    rotate: 7,
    scale: 0.9,
    delayInSeconds: 0.46,
    label: "Le CTA",
    duration: "0:22",
    accent: COLORS.blue,
  },
];

/* ──────────────────────────────────────────────────────────────── */

export const OneVideoManyShorts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill name="Scène" style={{ backgroundColor: COLORS.bg, fontFamily }}>
      <GridBackground />

      {/* Les shorts sont sous la carte vidéo : ils en sortent réellement. */}
      <CameraMovement depth={DEPTH.shorts}>
        <Connections />

        <AbsoluteFill style={{ translate: "0px " + CARD.offsetY + "px" }}>
          {SHORTS.map((short, i) => (
            <ShortCard
              key={short.label}
              {...short}
              width={SHORT_WIDTH}
              startInSeconds={TIMING.shortsStart}
              floatPhase={i * 1.7}
            />
          ))}
        </AbsoluteFill>
      </CameraMovement>

      <CameraMovement depth={DEPTH.card}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", paddingTop: 120 }}
        >
          <Interactive.Div
            name="Carte vidéo"
            style={{
              opacity: interpolate(frame, [0, 0.45 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [0, 1 * fps, 5 * fps],
                ["0px 52px", "0px 0px", "0px -8px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.4, 0, 0.6, 1)],
                },
              ),
              scale: interpolate(frame, [0, 1 * fps, 5 * fps], [0.93, 1, 1.008], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.bezier(0.4, 0, 0.6, 1)],
                output: "perceptual-scale",
              }),
              filter:
                "blur(" +
                interpolate(frame, [0, 0.5 * fps], [12, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 0, 0.1, 1),
                }) +
                "px)",
            }}
          >
            <VideoCard
              width={CARD.width}
              title="Structurer une offre B2B"
              channel="SalesMedia"
              meta="47 min · aujourd'hui"
              duration="47:52"
              clickAtInSeconds={TIMING.click}
            />
          </Interactive.Div>
        </AbsoluteFill>

        <Cursor />
      </CameraMovement>

      <CameraMovement depth={DEPTH.headline}>
        <AbsoluteFill style={{ paddingTop: HEADLINE.top }}>
          <AnimatedText
            fontSize={HEADLINE.fontSize}
            gap={HEADLINE.gap}
            offsetX={HEADLINE.offsetX}
            recenterFromInSeconds={TIMING.headline}
            recenterToInSeconds={TIMING.headline + 0.75}
            words={[
              { text: "Une", atInSeconds: 0.32 },
              { text: "vidéo", atInSeconds: 0.42 },
              { text: "→", atInSeconds: TIMING.headline, soft: true },
              { text: "plusieurs", atInSeconds: TIMING.headline + 0.12, highlight: true },
              { text: "shorts", atInSeconds: TIMING.headline + 0.24 },
            ]}
          />
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};

/**
 * Connexions carte vidéo → shorts.
 * Le trait part du bord de la carte, se dessine juste avant l'arrivée du
 * short, puis s'efface quand la composition se stabilise.
 */
const Connections: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const originX = width / 2;
  const originY = height / 2 + CARD.offsetY;

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [(TIMING.headline - 0.3) * fps, (TIMING.headline + 0.4) * fps],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          },
        ),
      }}
    >
      <svg width={width} height={height} viewBox={"0 0 " + width + " " + height}>
        {SHORTS.map((short) => {
          const targetX = width / 2 + short.x;
          const targetY = height / 2 + CARD.offsetY + short.y;
          const dx = targetX - originX;
          const dy = targetY - originY;

          // Point de sortie sur le bord de la carte vidéo.
          const edge = Math.min(
            (CARD.width / 2 + 18) / Math.abs(dx),
            (CARD.height / 2 + 18) / Math.abs(dy),
          );
          const startX = originX + dx * edge;
          const startY = originY + dy * edge;

          // Courbure perpendiculaire, pour éviter des traits rectilignes.
          const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const controlX = (startX + targetX) / 2 + (-dy / len) * 62;
          const controlY = (startY + targetY) / 2 + (dx / len) * 62;

          // Le trait se dessine à la vitesse du short qu'il accompagne.
          const draw = (TIMING.shortsStart + short.delayInSeconds) * fps;

          return (
            <path
              key={short.label}
              d={
                "M " +
                startX +
                " " +
                startY +
                " Q " +
                controlX +
                " " +
                controlY +
                " " +
                targetX +
                " " +
                targetY
              }
              fill="none"
              stroke={COLORS.blue}
              strokeOpacity={0.34}
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={interpolate(frame, [draw, draw + 1.0 * fps], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Curseur qui vient déclencher la génération, puis quitte le cadre. */
const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const click = TIMING.click * fps;

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [TIMING.cursorIn * fps, (TIMING.cursorIn + 0.2) * fps, 1.4 * fps, 1.75 * fps],
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
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          translate: interpolate(
            frame,
            [TIMING.cursorIn * fps, click, 1.75 * fps],
            [
              CURSOR.fromX + "px " + CURSOR.fromY + "px",
              CURSOR.toX + "px " + CURSOR.toY + "px",
              CURSOR.toX + 40 + "px " + (CURSOR.toY + 70) + "px",
            ],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [Easing.bezier(0.18, 0.86, 0.24, 1), Easing.bezier(0.4, 0, 0.7, 1)],
            },
          ),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -30,
            top: -30,
            width: 60,
            height: 60,
            borderRadius: 30,
            border: "2px solid " + COLORS.blue,
            opacity: interpolate(frame, [click, click + 0.45 * fps], [0.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 0, 0.2, 1),
            }),
            scale: interpolate(frame, [click, click + 0.45 * fps], [0.3, 1.5], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        />

        <svg
          width={30}
          height={38}
          viewBox="0 0 30 38"
          style={{ filter: "drop-shadow(0 6px 12px rgba(11,18,32,0.28))" }}
        >
          <path
            d="M2 2 L2 27 L9 20.5 L13.5 30.5 L18.5 28 L14 18.5 L23 18 Z"
            fill={COLORS.ink}
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
