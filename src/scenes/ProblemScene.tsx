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
import { VideoCard } from "../components/VideoCard";
import { COLORS, fontFamily } from "../theme";
import { SOURCE_VIDEO, STAGE } from "./story";

/* ────────────────────────────────────────────────────────────────
 * Scène 1 — "Vous avez des heures de vidéos ?"  (0:00 → 0:03)
 *
 * La carte vidéo occupe exactement la place qu'elle aura en scène 4.
 * Autour d'elle, la bibliothèque s'accumule. En fin de scène, la carte
 * rétrécit et monte jusqu'au moniteur de la table de montage : c'est le
 * raccord avec la scène 2.
 * ──────────────────────────────────────────────────────────────── */

const TIMING = {
  /** Fin de l'entrée de la carte principale. */
  cardIn: 0.5,
  /** Début du départ vers la scène 2. */
  handoverStart: 2.5,
  /** La carte est en place dans le moniteur — état figé jusqu'à la coupe. */
  handoverEnd: 2.85,
};

const HEADLINE = { fontSize: 80, gap: 24 };

const DEPTH = { headline: 0.62, card: 1, library: 1.18 };

/** Les vidéos secondaires. `hue` décale la teinte pour varier les miniatures. */
type Satellite = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  hue: number;
  opacity: number;
  atInSeconds: number;
  title: string;
  duration: string;
  meta: string;
};

const LIBRARY: Satellite[] = [
  { x: -700, y: -150, scale: 0.4, rotate: -2.5, hue: 0, opacity: 0.94, atInSeconds: 0.55, title: "Webinar Q3", duration: "1:12:04", meta: "hier" },
  { x: -640, y: 195, scale: 0.46, rotate: 1.5, hue: -10, opacity: 0.96, atInSeconds: 0.75, title: "Podcast #14", duration: "58:20", meta: "il y a 3 jours" },
  { x: 690, y: -160, scale: 0.36, rotate: 2.5, hue: 8, opacity: 0.92, atInSeconds: 0.95, title: "Demo produit", duration: "22:47", meta: "hier" },
  { x: 655, y: 180, scale: 0.44, rotate: -1.5, hue: -12, opacity: 0.95, atInSeconds: 1.15, title: "Interview client", duration: "41:09", meta: "cette semaine" },
  { x: -140, y: 495, scale: 0.3, rotate: 2, hue: 6, opacity: 0.86, atInSeconds: 1.45, title: "Formation SDR", duration: "1:34:52", meta: "la semaine dernière" },
  { x: -880, y: 420, scale: 0.3, rotate: -3, hue: -8, opacity: 0.8, atInSeconds: 1.95, title: "Keynote 2026", duration: "1:08:11", meta: "mars" },
  { x: 880, y: -350, scale: 0.28, rotate: 3.5, hue: 12, opacity: 0.78, atInSeconds: 2.15, title: "Table ronde", duration: "36:28", meta: "février" },
  { x: 250, y: 500, scale: 0.26, rotate: -2, hue: -6, opacity: 0.76, atInSeconds: 2.3, title: "Atelier closing", duration: "27:55", meta: "janvier" },
];

/* ──────────────────────────────────────────────────────────────── */

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill name="Scène 1 — Le stock" style={{ backgroundColor: COLORS.bg, fontFamily }}>
      <GridBackground />

      <CameraMovement
        depth={DEPTH.library}
        atInSeconds={[0, 2.5, 3]}
        zoom={[1, 1.03, 1.045]}
        curves={[
          [0.4, 0, 0.6, 1],
          [0.4, 0, 0.2, 1],
        ]}
        driftY={0}
      >
        {LIBRARY.map((satellite) => (
          <LibraryCard key={satellite.title} satellite={satellite} />
        ))}
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.card}
        atInSeconds={[0, 2.5, 3]}
        zoom={[1, 1.03, 1.045]}
        curves={[
          [0.4, 0, 0.6, 1],
          [0.4, 0, 0.2, 1],
        ]}
        driftY={0}
      >
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
                [0, 0.5 * fps, 2.5 * fps, 2.85 * fps],
                ["0px 52px", "0px 0px", "0px 0px", "0px -235px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: [
                    Easing.bezier(0.16, 1, 0.3, 1),
                    Easing.linear,
                    Easing.bezier(0.5, 0, 0.2, 1),
                  ],
                },
              ),
              scale: interpolate(
                frame,
                [0, 0.5 * fps, 2.5 * fps, 2.85 * fps],
                [0.93, 1, 1, 0.42],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: [
                    Easing.bezier(0.16, 1, 0.3, 1),
                    Easing.linear,
                    Easing.bezier(0.5, 0, 0.2, 1),
                  ],
                  output: "perceptual-scale",
                },
              ),
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
              width={780}
              title="Structurer une offre B2B"
              channel="SalesMedia"
              meta="47 min · aujourd'hui"
              duration="47:52"
              clickAtInSeconds={99}
              showAction={false}
            />
          </Interactive.Div>
        </AbsoluteFill>
      </CameraMovement>

      <CameraMovement
        depth={DEPTH.headline}
        atInSeconds={[0, 2.5, 3]}
        zoom={[1, 1.03, 1.045]}
        curves={[
          [0.4, 0, 0.6, 1],
          [0.4, 0, 0.2, 1],
        ]}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            paddingTop: 140,
            opacity: interpolate(frame, [2.55 * fps, 2.9 * fps], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.5, 0, 0.75, 0.2),
            }),
            translate: interpolate(
              frame,
              [2.55 * fps, 2.9 * fps],
              ["0px 0px", "0px -46px"],
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
              { text: "Vous", atInSeconds: 0.25 },
              { text: "avez", atInSeconds: 0.33 },
              { text: "des", atInSeconds: 0.41 },
              // L'accent tombe pendant que la bibliothèque se remplit.
              { text: "heures", atInSeconds: 0.49, highlight: true, highlightAtInSeconds: 0.85 },
              { text: "de", atInSeconds: 0.57 },
              { text: "vidéos ?", atInSeconds: 0.65 },
            ]}
          />
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};

/**
 * Une vidéo de la bibliothèque : même carte que la vidéo principale, réduite.
 * Elle apparaît en flou, flotte très légèrement, puis se retire quand la
 * scène bascule vers la table de montage.
 */
const LibraryCard: React.FC<{ satellite: Satellite }> = ({ satellite }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const at = satellite.atInSeconds * fps;

  const appear = interpolate(frame, [at, at + 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const leave = interpolate(
    frame,
    [TIMING.handoverStart * fps - 5, TIMING.handoverEnd * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.5, 0, 0.75, 0.2),
    },
  );

  const float = Math.sin(frame / (fps * 0.9) + satellite.x) * 5 * appear;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: appear * satellite.opacity * (1 - leave),
          filter: "blur(" + ((1 - appear) * 10 + leave * 12) + "px)",
          translate: satellite.x + "px " + (satellite.y + float + leave * 60) + "px",
          scale: satellite.scale * (0.9 + appear * 0.1) * (1 - leave * 0.14),
          rotate: satellite.rotate + "deg",
        }}
      >
        <div style={{ filter: "hue-rotate(" + satellite.hue + "deg)" }}>
          <VideoCard
            width={STAGE.cardWidth}
            title={satellite.title}
            channel={SOURCE_VIDEO.channel}
            meta={satellite.meta}
            duration={satellite.duration}
            clickAtInSeconds={99}
            showAction={false}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
