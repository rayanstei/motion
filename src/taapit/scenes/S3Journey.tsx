import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMovement } from "../../components/CameraMovement";
import { ClickPath, PathPoint } from "../ClickPath";
import { DecisionGate } from "../DecisionGate";
import { PhoneFrame } from "../PhoneFrame";
import { TaapHeadline } from "../TaapHeadline";
import { LIGHT, TAAP, TAAP_FONT, lightDepth } from "../theme";

/* ────────────────────────────────────────────────────────────────
 * S3 — Le trajet du clic  (acte 3, 15,2 s)
 *
 * Le clic n'est pas un point qui glisse sur une ligne : il traverse un
 * espace. La caméra le suit latéralement sur 1600 px de monde, croise trois
 * décisions, et arrive à destination. Puis elle revient — plus vite, avec la
 * donnée.
 *
 * Le monde est plus large que le cadre. Tout est posé en coordonnées monde,
 * et c'est `panX` de la caméra qui fait le voyage. Les couches ont des
 * profondeurs différentes : le fond suit moins que le contenu, la
 * typographie moins encore.
 * ──────────────────────────────────────────────────────────────── */

/** Le monde, en coordonnées absolues. La source est au centre du cadre. */
const WORLD = {
  source: 960,
  gate1: 1360,
  gate2: 1760,
  gate3: 2160,
  destination: 2560,
  /** Déplacement de caméra pour amener la destination au centre. */
  travel: -1600,
};

const PATH: PathPoint[] = [
  { x: 990, y: 540 },
  { x: 1240, y: 540 },
  { x: 1360, y: 462 },
  { x: 1600, y: 462 },
  { x: 1760, y: 618 },
  { x: 2000, y: 618 },
  { x: 2160, y: 498 },
  { x: 2400, y: 498 },
  { x: 2528, y: 540 },
];

/**
 * La course du clic. Aller et retour partagent la même courbe : départ net,
 * puis vitesse tenue, puis une décélération courte qui pose l'arrivée sans la
 * laisser ramper. Le retour n'est pas plus mou, il est plus court — c'est la
 * durée qui le rend vif, pas la courbe.
 */
const RUN: [number, number, number, number] = [0.32, 0, 0.68, 1];

const TIMING = {
  depart: 1.5,
  journey: 6.4,
  gate1: 3.5,
  gate2: 4.73,
  gate3: 5.93,
  arrive: 7.9,
  action: 8.7,
  /** La donnée repart en sens inverse. */
  back: 9.9,
  backFor: 2.4,
  recorded: 12.6,
  end: 15.2,
};

const PHONE = 300;

export const S3Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /** Course de la caméra : elle suit le clic, puis revient avec la donnée. */
  const cameraX = [0, 0, WORLD.travel, WORLD.travel, 0, 0];
  const cameraAt = [
    0,
    TIMING.depart,
    TIMING.depart + TIMING.journey,
    TIMING.back,
    TIMING.back + TIMING.backFor,
    TIMING.end,
  ];
  const cameraCurves = [
    [0.4, 0, 0.6, 1],
    // La caméra partage exactement la courbe du clic, sinon elle le distance.
    RUN,
    [0.4, 0, 0.6, 1],
    RUN,
    [0.4, 0, 0.6, 1],
  ] as [number, number, number, number][];

  const arrived = interpolate(
    frame,
    [TIMING.action * fps, (TIMING.action + 0.5) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.3, 0.64, 1),
    },
  );

  const recorded = interpolate(
    frame,
    [TIMING.recorded * fps, (TIMING.recorded + 0.6) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT.bg, fontFamily: TAAP_FONT }}>
      {/* Fond : une trame très faible qui donne le déplacement. */}
      <CameraMovement
        depth={0.45}
        atInSeconds={cameraAt}
        zoom={[1, 1, 1, 1, 1, 1]}
        panX={cameraX}
        curves={cameraCurves}
        driftY={0}
      >
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(29,29,30,0.085) 1.4px, transparent 1.4px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(72% 62% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </CameraMovement>

      {/* Le monde traversé. */}
      <CameraMovement
        depth={1}
        atInSeconds={cameraAt}
        zoom={[1.05, 1.02, 1, 1, 1.02, 1.04]}
        panX={cameraX}
        curves={cameraCurves}
        driftY={0}
      >
        <SourcePhone />

        <DecisionGate
          label="Appareil"
          value="iOS"
          x={WORLD.gate1}
          y={330}
          atInSeconds={2.2}
          decideAtInSeconds={TIMING.gate1}
        />
        <DecisionGate
          label="Application"
          value="Installée"
          x={WORLD.gate2}
          y={790}
          atInSeconds={3.4}
          decideAtInSeconds={TIMING.gate2}
        />
        <DecisionGate
          label="Destination"
          value="La bonne page"
          x={WORLD.gate3}
          y={352}
          atInSeconds={4.75}
          decideAtInSeconds={TIMING.gate3}
        />

        <DestinationPhone arrived={arrived} />

        {/* Le retour arrive quelque part : c'est le seul signal de mesure de
            la scene. Le tableau de bord, lui, est l'affaire de l'acte 4. */}
        <div
          style={{
            position: "absolute",
            left: 1215,
            top: 636,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 20px",
            borderRadius: 999,
            backgroundColor: LIGHT.surface,
            border: "1px solid rgba(52,209,108,0.35)",
            boxShadow: lightDepth(0.4).shadow,
            opacity: recorded,
            translate: "0px " + (1 - recorded) * 12 + "px",
            scale: 0.92 + recorded * 0.08,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 6,
              backgroundColor: TAAP.green,
              boxShadow: "0 0 0 5px rgba(52,209,108,0.16)",
            }}
          />
          <span
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: -0.3,
              color: LIGHT.ink,
            }}
          >
            Clic enregistré
          </span>
        </div>

        {/* L'aller. */}
        <ClickPath
          points={PATH}
          atInSeconds={TIMING.depart}
          durationInSeconds={TIMING.journey}
          curve={RUN}
          color={TAAP.green}
          coreColor={TAAP.green}
          dotSize={17}
          trailLength={16}
          trailSpacing={0.011}
          cornerRadius={90}
          canvasWidth={2900}
        />

        {/* Le retour : plus petit, plus vif, sans rail — c'est immatériel. */}
        <ClickPath
          points={PATH}
          atInSeconds={TIMING.back}
          durationInSeconds={TIMING.backFor}
          direction="reverse"
          curve={RUN}
          color={TAAP.green}
          coreColor={TAAP.green}
          dotSize={11}
          trailLength={20}
          trailSpacing={0.008}
          cornerRadius={90}
          showRail={false}
          canvasWidth={2900}
        />
      </CameraMovement>

      {/* Typographie : elle suit à peine, elle appartient au cadre. */}
      <CameraMovement
        depth={0.18}
        atInSeconds={cameraAt}
        zoom={[1, 1, 1, 1, 1, 1]}
        panX={cameraX}
        curves={cameraCurves}
        driftY={0}
      >
        <AbsoluteFill style={{ paddingTop: 128, alignItems: "center" }}>
          <TaapHeadline
            words={[{ text: "Le" }, { text: "lien" }, { text: "choisit." }]}
            atInSeconds={1.9}
            untilInSeconds={7.4}
            fontSize={74}
          />
        </AbsoluteFill>

        <AbsoluteFill style={{ paddingTop: 128, alignItems: "center" }}>
          <div style={{ opacity: recorded }}>
            <TaapHeadline
              words={[
                { text: "Rien", accent: true },
                { text: "ne" },
                { text: "se" },
                { text: "perd." },
              ]}
              atInSeconds={TIMING.recorded}
              fontSize={74}
            />
          </div>
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};

/**
 * Le téléphone de départ : celui de la fin de S2, littéralement.
 *
 * S2 se termine sur ce même châssis de 300 px, décalé de RACCORD et agrandi
 * à 1,05. S3 reprend exactement cette pose puis la ramène au centre : le
 * téléphone ne saute pas au montage, il se replace.
 *
 * L'échelle a un rattrapage : à sa dernière frame S2 cumule le 1,05 du
 * téléphone et le 1,05 de sa propre caméra, soit 1,1025, alors que la caméra
 * de S3 n'apporte que 1,05. Les 5 % manquants sont rendus ici, puis rendus.
 */
const RACCORD = { x: 160, y: 50, scale: 0.05, settleFor: 1.2 };

const SourcePhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const surface = lightDepth(0.5);

  // 1 sur la pose de S2, 0 une fois replacé.
  const fromS2 = interpolate(
    frame,
    [0, RACCORD.settleFor * fps],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  // L'écran change de contenu : on l'installe au lieu de le faire claquer.
  const screen = interpolate(frame, [0.1 * fps, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: WORLD.source,
        top: 540,
        translate:
          "calc(-50% + " +
          fromS2 * RACCORD.x +
          "px) calc(-50% + " +
          fromS2 * RACCORD.y +
          "px)",
        scale: 1 + fromS2 * RACCORD.scale,
        boxShadow: surface.shadow,
        borderRadius: PHONE * 0.145,
        isolation: "isolate",
      }}
    >
      <PhoneFrame
        width={PHONE}
        depth={0.15}
        screenGlow={0.35}
        accent={TAAP.green}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 88,
            paddingLeft: 18,
            paddingRight: 18,
            opacity: screen,
            translate: "0px " + (1 - screen) * 10 + "px",
            filter: "blur(" + (1 - screen) * 5 + "px)",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 999,
              backgroundColor: TAAP.green,
              color: "#06301A",
              fontSize: 13,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            taap.it/lien
          </div>
          <div style={{ marginTop: 16 }}>
            {[74, 58, 66].map((w, i) => (
              <div
                key={w}
                style={{
                  width: w + "%",
                  height: 7,
                  marginTop: i === 0 ? 0 : 9,
                  borderRadius: 4,
                  backgroundColor: "#22222A",
                }}
              />
            ))}
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
};

/** L'arrivée : l'app s'ouvre, l'action se fait. */
const DestinationPhone: React.FC<{ arrived: number }> = ({ arrived }) => {
  const surface = lightDepth(0.55);
  return (
    <div
      style={{
        position: "absolute",
        left: WORLD.destination,
        top: 540,
        translate: "-50% -50%",
        boxShadow: surface.shadow,
        borderRadius: PHONE * 0.145,
        isolation: "isolate",
        scale: 0.97 + arrived * 0.03,
      }}
    >
      <PhoneFrame
        width={PHONE}
        depth={0.15}
        screenGlow={0.3 + arrived * 0.25}
        accent={TAAP.green}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 86,
            paddingLeft: 18,
            paddingRight: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 16,
                background:
                  "linear-gradient(140deg, " +
                  TAAP.green +
                  " 0%, #1E9E4E 100%)",
              }}
            />
            <div
              style={{
                width: 66,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#33333D",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              height: 118,
              borderRadius: 13,
              background: "linear-gradient(150deg, #1B1B22 0%, #121218 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />

          {/* L'action aboutie. */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 0",
              borderRadius: 999,
              backgroundColor: arrived > 0.5 ? TAAP.green : "#1E1E26",
              color: arrived > 0.5 ? "#06301A" : "#4A4A55",
              fontSize: 13,
              fontWeight: 700,
              scale: 1 + arrived * 0.02,
            }}
          >
            <svg width={15} height={15} viewBox="0 0 16 16">
              <path
                d="M4 8.4 L6.6 11 L12 5.4"
                fill="none"
                stroke={arrived > 0.5 ? "#06301A" : "#4A4A55"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - arrived}
              />
            </svg>
            Acheté
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
};
