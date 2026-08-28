import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMovement } from "../components/CameraMovement";
import { PhoneFrame } from "../taapit/PhoneFrame";
import { DARK, TAAP, TAAP_FONT } from "../taapit/theme";

/**
 * Banc d'essai du mode sombre.
 *
 * Le téléphone entre dans la lumière plutôt que d'apparaître : `depth` et
 * `screenGlow` montent avec lui. C'est le geste d'entrée propre à cet univers
 * — sur fond clair on aurait joué sur l'ombre, ici on joue sur l'émission.
 *
 * Le tap ne fait pas d'anneau tape-à-l'œil : c'est l'écran entier qui gagne
 * en luminosité une demi-seconde, et la lueur projetée sur le fond suit. La
 * réaction est donc perçue autour de l'objet, pas seulement sur le bouton.
 */

const TIMING = {
  enterFrom: 0,
  enterTo: 0.9,
  pointerFrom: 1.15,
  tap: 1.75,
  state: 2.3,
  exitFrom: 4,
  exitTo: 4.8,
};

const PHONE_WIDTH = 340;

export const ProtoDark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(
    frame,
    [TIMING.enterFrom * fps, TIMING.enterTo * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const exit = interpolate(
    frame,
    [TIMING.exitFrom * fps, TIMING.exitTo * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.5, 0, 0.75, 0.2),
    },
  );

  const live = enter * (1 - exit);

  // Le tap : montée franche, retour lent. La lumière met du temps à retomber.
  const flash = interpolate(
    frame,
    [
      TIMING.tap * fps - 0.05 * fps,
      TIMING.tap * fps + 0.09 * fps,
      TIMING.tap * fps + 0.7 * fps,
    ],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [Easing.bezier(0.3, 0, 0.2, 1), Easing.bezier(0.4, 0, 0.6, 1)],
    },
  );

  const done = interpolate(
    frame,
    [TIMING.state * fps, (TIMING.state + 0.45) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.32, 0.64, 1),
    },
  );

  const pointer = interpolate(
    frame,
    [TIMING.pointerFrom * fps, TIMING.tap * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.3, 0.9, 0.2, 1),
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: DARK.bg, fontFamily: TAAP_FONT }}>
      <CameraMovement
        atInSeconds={[0, 5]}
        zoom={[1, 1.05]}
        panX={[0, -14]}
        curves={[[0.4, 0, 0.6, 1]]}
        driftY={0}
      >
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              position: "relative",
              opacity: live,
              translate: "0px " + ((1 - enter) * 60 + exit * 40) + "px",
              scale: 0.94 + live * 0.06,
              filter: "blur(" + ((1 - enter) * 10 + exit * 10) + "px)",
            }}
          >
            <PhoneFrame
              width={PHONE_WIDTH}
              depth={0.5 * live}
              screenGlow={live * (0.5 + flash * 0.45)}
              accent={TAAP.green}
            >
              <AppScreen flash={flash} done={done} />
            </PhoneFrame>

            {/* Pointeur clair : le curseur sombre du moteur serait invisible ici. */}
            <div
              style={{
                position: "absolute",
                left: interpolate(pointer, [0, 1], [PHONE_WIDTH + 130, 158]),
                top: interpolate(pointer, [0, 1], [PHONE_WIDTH * 1.9, 288]),
                opacity:
                  pointer *
                  interpolate(frame, [3 * fps, 3.4 * fps], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                scale: interpolate(
                  frame,
                  [
                    TIMING.tap * fps - 0.04 * fps,
                    TIMING.tap * fps + 0.06 * fps,
                    TIMING.tap * fps + 0.3 * fps,
                  ],
                  [1, 0.88, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: [
                      Easing.bezier(0.4, 0, 1, 1),
                      Easing.bezier(0.34, 1.4, 0.64, 1),
                    ],
                  },
                ),
              }}
            >
              <svg width={26} height={33} viewBox="0 0 30 38">
                <path
                  d="M2 2 L2 27 L9 20.5 L13.5 30.5 L18.5 28 L14 18.5 L23 18 Z"
                  fill={DARK.text}
                  stroke="rgba(0,0,0,0.55)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </AbsoluteFill>
      </CameraMovement>
    </AbsoluteFill>
  );
};

/** Interface fictive, volontairement minimale. */
const AppScreen: React.FC<{ flash: number; done: number }> = ({
  flash,
  done,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      paddingTop: 104,
      paddingLeft: 26,
      paddingRight: 26,
      // L'écran entier gagne en luminosité au tap, pas seulement le bouton.
      backgroundColor: "rgba(255,255,255," + (flash * 0.035).toFixed(3) + ")",
    }}
  >
    <div style={{ color: DARK.textMuted, fontSize: 14, fontWeight: 600 }}>
      Aujourd&apos;hui
    </div>
    <div
      style={{
        marginTop: 6,
        color: DARK.text,
        fontSize: 27,
        fontWeight: 700,
        letterSpacing: -0.6,
      }}
    >
      Votre lien
    </div>

    <div
      style={{
        marginTop: 20,
        padding: 18,
        borderRadius: 18,
        backgroundColor: DARK.surfaceHigh,
        border: "1px solid " + DARK.line,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: "70%",
          height: 10,
          borderRadius: 5,
          backgroundColor: "#2C2C35",
        }}
      />
      <div
        style={{
          width: "44%",
          height: 10,
          marginTop: 10,
          borderRadius: 5,
          backgroundColor: "#212129",
        }}
      />
    </div>

    <div
      style={{
        marginTop: 18,
        padding: "15px 0",
        borderRadius: 999,
        backgroundColor: TAAP.green,
        color: "#062B14",
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
        scale: 1 - flash * 0.035,
        boxShadow:
          "0 0 " +
          (14 + flash * 30) +
          "px " +
          flash * 8 +
          "px " +
          TAAP.green +
          "55",
      }}
    >
      Ouvrir
    </div>

    {/* État après le tap. */}
    <div
      style={{
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: done,
        translate: "0px " + (1 - done) * 10 + "px",
      }}
    >
      <svg width={20} height={20} viewBox="0 0 20 20">
        <circle
          cx={10}
          cy={10}
          r={9}
          fill="none"
          stroke={TAAP.green}
          strokeWidth={1.6}
        />
        <path
          d="M6 10.3 L8.8 13 L14 7.6"
          fill="none"
          stroke={TAAP.green}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{ color: DARK.textMuted, fontSize: 14, fontWeight: 600 }}>
        Ouvert dans l&apos;application
      </span>
    </div>
  </div>
);
