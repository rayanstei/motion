import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMovement } from "../../components/CameraMovement";
import { BrowserChrome } from "../BrowserChrome";
import { PhoneFrame } from "../PhoneFrame";
import { TaapHeadline } from "../TaapHeadline";
import { WaveReveal } from "../WaveReveal";
import { DARK, LIGHT, TAAP, TAAP_FONT, lightDepth } from "../theme";

/* ────────────────────────────────────────────────────────────────
 * S2 — Le renversement  (acte 2, 14 s)
 *
 * La scène démarre exactement là où S1 s'arrête : le téléphone éteint, au
 * noir. La braise se rallume, l'onde part de là et retourne l'image. Tout
 * l'acte 2 se joue ensuite dans l'univers clair — celui du site.
 *
 * Deux temps :
 *   1. le renversement, et l'affirmation « Ouvre l'app. Pas le navigateur. »
 *   2. la démonstration : deux téléphones, le mauvais recule.
 *
 * Le contraste avec S1 est volontairement brutal — c'est le geste de toute
 * la vidéo. Mais on reste dans le même univers : même vert, même châssis,
 * même typographie.
 * ──────────────────────────────────────────────────────────────── */

const PHONE = { width: 380, compare: 300 };

const TIMING = {
  /** La braise se rallume. */
  seed: 0.75,
  wave: 1.1,
  headline: 1.9,
  pill: 2.9,
  /** Le titre sort, les deux téléphones entrent. */
  compare: 4.9,
  /** Le mauvais côté recule. */
  recede: 7.6,
  proof: 8.9,
  end: 11.8,
};

export const S2Reversal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Passage du premier temps au second : le titre sort, la comparaison entre.
  const toCompare = interpolate(
    frame,
    [TIMING.compare * fps, (TIMING.compare + 0.9) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const recede = interpolate(
    frame,
    [TIMING.recede * fps, (TIMING.recede + 1.3) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );

  return (
    <AbsoluteFill style={{ fontFamily: TAAP_FONT }}>
      <CameraMovement
        atInSeconds={[0, TIMING.wave, TIMING.compare, TIMING.end]}
        zoom={[1.04, 1.04, 1, 1.05]}
        curves={[
          [0.4, 0, 0.6, 1],
          [0.16, 1, 0.3, 1],
          [0.4, 0, 0.6, 1],
        ]}
        driftY={0}
      >
        <WaveReveal
          before={<DeadPhone />}
          after={
            <LightWorld
              toCompare={toCompare}
              recede={recede}
              frame={frame}
              fps={fps}
            />
          }
          atInSeconds={TIMING.wave}
          durationInSeconds={1.05}
        />
      </CameraMovement>
    </AbsoluteFill>
  );
};

/**
 * L'état exact où S1 se termine : téléphone éteint, presque plus de lumière.
 * C'est ce qui rend la coupe invisible.
 */
const DeadPhone: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: DARK.bg,
      alignItems: "center",
      justifyContent: "center",
      // Sans cela, l'ilot et le reflet de PhoneFrame (z-index 3 et 4)
      // remontent au-dessus de l'onde et flottent sur le blanc.
      isolation: "isolate",
    }}
  >
    <PhoneFrame
      width={PHONE.width}
      depth={0.225}
      screenGlow={0.45}
      accent={TAAP.green}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          // Comme en fin de S1 : passe au-dessus de la barre d'etat et de
          // l'ilot, sinon ils reapparaissent a la coupe.
          zIndex: 8,
        }}
      />
    </PhoneFrame>
  </AbsoluteFill>
);

/** Tout ce qui vit après le renversement. */
const LightWorld: React.FC<{
  toCompare: number;
  recede: number;
  frame: number;
  fps: number;
}> = ({ toCompare, recede, frame, fps }) => {
  const surface = lightDepth(0.6);

  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT.bg }}>
      {/* Temps 1 — l'affirmation. */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 46,
          opacity: 1 - toCompare,
          translate: "0px " + -toCompare * 60 + "px",
          filter: "blur(" + toCompare * 8 + "px)",
        }}
      >
        <TaapHeadline
          words={[
            { text: "Ouvre" },
            { text: "l'app." },
            { text: "Pas" },
            { text: "le" },
            { text: "navigateur." },
          ]}
          atInSeconds={TIMING.headline}
          fontSize={92}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            padding: "17px 34px",
            borderRadius: 999,
            backgroundColor: TAAP.green,
            color: "#06301A",
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: -0.4,
            boxShadow: "0 18px 44px rgba(52,209,108,0.32)",
            opacity: interpolate(
              frame,
              [TIMING.pill * fps, (TIMING.pill + 0.45) * fps],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            scale: interpolate(
              frame,
              [TIMING.pill * fps, (TIMING.pill + 0.5) * fps],
              [0.9, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.34, 1.32, 0.64, 1),
              },
            ),
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 6,
              backgroundColor: "#06301A",
              opacity: 0.55,
            }}
          />
          taap.it/lien
        </div>
      </AbsoluteFill>

      {/* Temps 2 — la démonstration. */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: toCompare,
        }}
      >
        {/* Le mauvais côté : il recule et perd ses couleurs. */}
        <div
          style={{
            position: "absolute",
            translate:
              -300 - recede * 30 + "px " + (50 + (1 - toCompare) * 40) + "px",
            scale: 0.92 - recede * 0.12,
            opacity: 1 - recede * 0.72,
            filter: "grayscale(" + recede + ") blur(" + recede * 5 + "px)",
            boxShadow: surface.shadow,
            borderRadius: PHONE.compare * 0.145,
          }}
        >
          <PhoneFrame
            width={PHONE.compare}
            depth={0.1}
            screenGlow={0.15}
            accent={TAAP.green}
          >
            <BrowserChrome
              width={PHONE.compare - PHONE.compare * 0.034 * 2}
              url="monsite.com/offre-du-…"
              loadProgress={0.62}
              loadOpacity={0.6}
              top={52}
            />
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 132,
              }}
            >
              {[86, 94, 62].map((w, i) => (
                <div
                  key={w}
                  style={{
                    width: w + "%",
                    height: 8,
                    marginTop: i === 0 ? 0 : 10,
                    borderRadius: 4,
                    backgroundColor: "#1C1C23",
                  }}
                />
              ))}
            </div>
          </PhoneFrame>
        </div>

        {/* Le bon côté : il avance et reste net. */}
        <div
          style={{
            position: "absolute",
            // Le bon cote avance vers le centre : il prend la scene.
            translate:
              300 - recede * 140 + "px " + (50 + (1 - toCompare) * 60) + "px",
            scale: 0.92 + recede * 0.13,
            boxShadow: surface.shadow,
            borderRadius: PHONE.compare * 0.145,
          }}
        >
          <PhoneFrame
            width={PHONE.compare}
            depth={0.15}
            screenGlow={0.35}
            accent={TAAP.green}
          >
            <NativeApp reveal={recede} frame={frame} fps={fps} />
          </PhoneFrame>
        </div>

        {/* La conclusion du temps 2. */}
        <div
          style={{
            position: "absolute",
            top: 138,
            opacity: interpolate(
              frame,
              [TIMING.proof * fps, (TIMING.proof + 0.5) * fps],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            translate:
              "0px " +
              interpolate(
                frame,
                [TIMING.proof * fps, (TIMING.proof + 0.7) * fps],
                [22, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ) +
              "px",
          }}
        >
          <TaapHeadline
            words={[
              { text: "Connecté." },
              { text: "Prêt", accent: true },
              { text: "à", accent: true },
              { text: "agir.", accent: true },
            ]}
            atInSeconds={TIMING.proof}
            fontSize={46}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** L'app native : connectée, et les actions sont possibles. */
const NativeApp: React.FC<{ reveal: number; frame: number; fps: number }> = ({
  reveal,
  frame,
  fps,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      paddingTop: 86,
      paddingLeft: 18,
      paddingRight: 18,
    }}
  >
    {/* Le compte : la différence tient d'abord à ça. */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 18,
          background:
            "linear-gradient(140deg, " + TAAP.green + " 0%, #1E9E4E 100%)",
        }}
      />
      <div>
        <div
          style={{
            width: 74,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#3A3A45",
          }}
        />
        <div
          style={{
            width: 44,
            height: 6,
            marginTop: 5,
            borderRadius: 3,
            backgroundColor: "#26262F",
          }}
        />
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 10px",
          borderRadius: 999,
          border: "1px solid rgba(52,209,108,0.35)",
          color: TAAP.green,
          fontSize: 10,
          fontWeight: 700,
          opacity: reveal,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: TAAP.green,
          }}
        />
        Connecté
      </div>
    </div>

    <div
      style={{
        marginTop: 16,
        height: 132,
        borderRadius: 14,
        background: "linear-gradient(150deg, #1B1B22 0%, #121218 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />

    {/* Les actions redevenues possibles. */}
    <div style={{ display: "flex", gap: 7, marginTop: 14 }}>
      {["J'aime", "Suivre", "Acheter"].map((label, i) => {
        const at = (TIMING.proof + 0.2 + i * 0.16) * fps;
        return (
          <div
            key={label}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 999,
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: i === 2 ? TAAP.green : "transparent",
              color: i === 2 ? "#06301A" : TAAP.green,
              border: i === 2 ? "none" : "1px solid rgba(52,209,108,0.4)",
              opacity: interpolate(frame, [at, at + 0.35 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              scale: interpolate(frame, [at, at + 0.4 * fps], [0.88, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.34, 1.32, 0.64, 1),
              }),
            }}
          >
            {label}
          </div>
        );
      })}
    </div>

    {/* De quoi occuper le bas de l'ecran : l'app continue sous les actions. */}
    <div style={{ marginTop: 16, opacity: reveal * 0.9 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginTop: i === 0 ? 0 : 11,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#22222A",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: [78, 62, 70][i] + "%",
                height: 6,
                borderRadius: 3,
                backgroundColor: "#26262F",
              }}
            />
            <div
              style={{
                width: [46, 38, 52][i] + "%",
                height: 5,
                marginTop: 4,
                borderRadius: 3,
                backgroundColor: "#1B1B22",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
