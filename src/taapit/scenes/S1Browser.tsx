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
import { Pointer } from "../Pointer";
import { StatusPill } from "../StatusPill";
import { DARK, TAAP, TAAP_FONT } from "../theme";

/* ────────────────────────────────────────────────────────────────
 * S1 — Le mauvais navigateur  (0:00 → 0:18)
 *
 * L'acte 1 en un seul plan : on ne coupe jamais. Le téléphone reste au
 * centre du début à la fin, et c'est le contenu de sa dalle qui se dégrade
 * pendant que la caméra se resserre. Le spectateur n'a rien à lire pour
 * comprendre — trois pastilles de trois mots suffisent.
 *
 * Toutes les positions à l'intérieur de la dalle sont en coordonnées écran ;
 * les cibles du pointeur sont en coordonnées de composition. `SCREEN` fait le
 * pont entre les deux.
 * ──────────────────────────────────────────────────────────────── */

const PHONE = { width: 380 };
const BEZEL = PHONE.width * 0.034;
const SCREEN = {
  width: PHONE.width - BEZEL * 2,
  height: PHONE.width * 2.05 - BEZEL * 2,
  /** Coin haut-gauche de la dalle, en coordonnées de composition. */
  left: 960 - PHONE.width / 2 + BEZEL,
  top: 540 - (PHONE.width * 2.05) / 2 + BEZEL,
};

/**
 * Deux barèmes de temps. Le second resserre le palier mort de 11 à 13 s :
 * la respiration reste, mais elle est habitée par un dernier événement — la
 * barre de chargement fait une ultime tentative puis s'éteint. La page
 * renonce, et c'est ce renoncement qui remplace le silence.
 */
const TIMINGS = {
  ample: {
    pointerIn: 0.9,
    tapLink: 2.1,
    browserIn: 2.4,
    cookies: 5,
    login: 6.6,
    pill1: 8.4,
    pill2: 9.4,
    pill3: 10.4,
    /** Absent = la barre reste allumée jusqu'à la fin. */
    loadGivesUp: 0,
    pointerToClose: 13.4,
    tapClose: 13.9,
    screenOff: 14.1,
    ember: 15.2,
    end: 18,
  },
  tight: {
    pointerIn: 0.9,
    tapLink: 2.1,
    browserIn: 2.4,
    cookies: 5,
    login: 6.6,
    pill1: 8.4,
    pill2: 9.3,
    pill3: 10.1,
    loadGivesUp: 11.3,
    pointerToClose: 12.3,
    tapClose: 12.8,
    screenOff: 13,
    ember: 14.1,
    end: 17,
  },
};

/** Position de la ligne de lien dans la dalle. */
const LINK_ROW_Y = 322;

export const S1Browser: React.FC<{
  /** Resserre le palier de 11 à 13 s. */
  tightened?: boolean;
  /** Affiche la conséquence business quand le clic meurt. */
  showLoss?: boolean;
}> = ({ tightened = false, showLoss = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TIMING = tightened ? TIMINGS.tight : TIMINGS.ample;

  const enter = interpolate(frame, [0, 0.85 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Le navigateur recouvre le feed. Il ne le remplace pas : il s'impose.
  const browser = interpolate(
    frame,
    [TIMING.browserIn * fps, (TIMING.browserIn + 0.55) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  // Chargement qui n'aboutit pas : trois paliers, puis plus rien.
  const load = interpolate(
    frame,
    [
      (TIMING.browserIn + 0.3) * fps,
      (TIMING.browserIn + 0.9) * fps,
      (TIMING.browserIn + 1.6) * fps,
      (TIMING.browserIn + 3.4) * fps,
    ],
    [0, 0.42, 0.61, 0.68],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [
        Easing.bezier(0.2, 0, 0.3, 1),
        Easing.bezier(0.4, 0, 0.6, 1),
        Easing.bezier(0.5, 0, 0.9, 1),
      ],
    },
  );

  // Ultime sursaut, puis la barre s'éteint : la page a renoncé.
  const loadOpacity =
    TIMING.loadGivesUp === 0
      ? 1
      : interpolate(
          frame,
          [(TIMING.loadGivesUp + 0.3) * fps, (TIMING.loadGivesUp + 0.9) * fps],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.6, 1),
          },
        );

  const lastPush =
    TIMING.loadGivesUp === 0
      ? 0
      : interpolate(
          frame,
          [TIMING.loadGivesUp * fps, (TIMING.loadGivesUp + 0.28) * fps],
          [0, 0.04],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0, 0.4, 1),
          },
        );

  // La conséquence, écrite comme un message système sur l'écran mort.
  const loss = showLoss
    ? interpolate(
        frame,
        [
          (TIMING.ember + 0.55) * fps,
          (TIMING.ember + 1) * fps,
          (TIMING.ember + 1.5) * fps,
          (TIMING.ember + 2.1) * fps,
        ],
        [0, 1, 1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [
            Easing.bezier(0.16, 1, 0.3, 1),
            Easing.linear,
            Easing.bezier(0.4, 0, 0.6, 1),
          ],
        },
      )
    : 0;

  const cookies = interpolate(
    frame,
    [TIMING.cookies * fps, (TIMING.cookies + 0.5) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const login = interpolate(
    frame,
    [TIMING.login * fps, (TIMING.login + 0.5) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  // L'écran s'éteint : la dalle noircit et le téléphone perd sa lumière.
  const off = interpolate(
    frame,
    [TIMING.screenOff * fps, (TIMING.screenOff + 0.9) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );

  // La braise : ce qui reste du clic, puis plus rien.
  const ember = interpolate(
    frame,
    [
      TIMING.ember * fps,
      (TIMING.ember + 0.3) * fps,
      (TIMING.ember + 1.1) * fps,
      (TIMING.ember + 1.7) * fps,
    ],
    [0, 1, 0.9, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [
        Easing.bezier(0.16, 1, 0.3, 1),
        Easing.linear,
        Easing.bezier(0.4, 0, 0.6, 1),
      ],
    },
  );

  const live = enter * (1 - off * 0.55);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK.bg, fontFamily: TAAP_FONT }}>
      <CameraMovement
        atInSeconds={[0, 13, TIMING.end]}
        zoom={[1, 1.1, 1.04]}
        curves={[
          [0.4, 0, 0.6, 1],
          [0.3, 0, 0.2, 1],
        ]}
        sway={0.5}
        driftY={0}
      >
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              opacity: enter,
              translate: "0px " + (1 - enter) * 46 + "px",
              scale: 0.95 + enter * 0.05,
              filter: "blur(" + (1 - enter) * 10 + "px)",
            }}
          >
            <PhoneFrame
              width={PHONE.width}
              depth={0.5 * live}
              screenGlow={live}
              accent={TAAP.green}
            >
              <Feed dim={browser} />
              <InAppBrowser
                appear={browser}
                load={load + lastPush}
                loadOpacity={loadOpacity}
                cookies={cookies}
                login={login}
              />
              {/* Extinction de la dalle. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#000000",
                  opacity: off,
                  zIndex: 8,
                }}
              />
            </PhoneFrame>
          </div>
        </AbsoluteFill>

        {/* Les conséquences, hors du téléphone : elles concernent vous, pas lui. */}
        <AbsoluteFill>
          <StatusPill
            label="Non connecté"
            atInSeconds={TIMING.pill1}
            untilInSeconds={TIMING.screenOff}
            x={-430}
            y={-190}
          />
          <StatusPill
            label="Paiement non enregistré"
            atInSeconds={TIMING.pill2}
            untilInSeconds={TIMING.screenOff}
            x={400}
            y={10}
          />
          <StatusPill
            label="Suivi perdu"
            atInSeconds={TIMING.pill3}
            untilInSeconds={TIMING.screenOff}
            x={-390}
            y={215}
          />
        </AbsoluteFill>

        {/* La braise, au centre de l'écran éteint. */}
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              backgroundColor: TAAP.green,
              opacity: ember,
              boxShadow:
                "0 0 " +
                34 * ember +
                "px " +
                10 * ember +
                "px " +
                TAAP.green +
                "66",
              scale: 0.7 + ember * 0.5,
            }}
          />
        </AbsoluteFill>
      </CameraMovement>

      {showLoss ? (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              position: "absolute",
              top: 540 + 44,
              color: "#6E6E78",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              opacity: loss,
              translate: "0px " + (1 - loss) * 6 + "px",
            }}
          >
            Conversion perdue
          </div>
        </AbsoluteFill>
      ) : null}

      <Pointer
        fromX={1520}
        fromY={1010}
        startInSeconds={TIMING.pointerIn}
        leaveAtInSeconds={TIMING.tapClose + 0.3}
        steps={[
          {
            x: SCREEN.left + SCREEN.width / 2 - 40,
            y: SCREEN.top + LINK_ROW_Y,
            atInSeconds: TIMING.tapLink,
            click: true,
          },
          {
            x: SCREEN.left + SCREEN.width / 2 + 60,
            y: SCREEN.top + 420,
            atInSeconds: TIMING.pointerToClose - 1.4,
          },
          {
            x: SCREEN.left + 16,
            y: SCREEN.top + 78,
            atInSeconds: TIMING.tapClose,
            click: true,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

/** Le feed d'où part le clic. Générique, jamais une marque identifiable. */
const Feed: React.FC<{ dim: number }> = ({ dim }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      paddingTop: 96,
      paddingLeft: 22,
      paddingRight: 22,
      opacity: 1 - dim * 0.7,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: "linear-gradient(140deg, #2E2E38 0%, #1B1B22 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      />
      <div>
        <div
          style={{
            width: 104,
            height: 10,
            borderRadius: 5,
            backgroundColor: "#33333D",
          }}
        />
        <div
          style={{
            width: 68,
            height: 8,
            marginTop: 7,
            borderRadius: 4,
            backgroundColor: "#242430",
          }}
        />
      </div>
    </div>

    <div style={{ marginTop: 18 }}>
      {[92, 74, 58].map((w, i) => (
        <div
          key={w}
          style={{
            width: w + "%",
            height: 8,
            marginTop: i === 0 ? 0 : 8,
            borderRadius: 4,
            backgroundColor: "#212129",
          }}
        />
      ))}
    </div>

    {/* Le lien : le seul élément vivant de l'écran. */}
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        top: LINK_ROW_Y - 26,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 16px",
        borderRadius: 14,
        backgroundColor: "#17171C",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <svg width={15} height={15} viewBox="0 0 20 20">
        <path
          d="M8.2 11.8 L11.8 8.2 M7.6 6.2 L9 4.8a3.4 3.4 0 0 1 4.8 4.8l-1.4 1.4 M12.4 13.8 L11 15.2a3.4 3.4 0 0 1-4.8-4.8l1.4-1.4"
          fill="none"
          stroke={DARK.textMuted}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </svg>
      <span style={{ color: DARK.text, fontSize: 14, fontWeight: 600 }}>
        monsite.com/offre
      </span>
    </div>

    {/* Grille de publications, pour meubler sans attirer l'œil. */}
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        top: LINK_ROW_Y + 44,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: (SCREEN.width - 44 - 16) / 3,
            height: (SCREEN.width - 44 - 16) / 3,
            borderRadius: 8,
            backgroundColor: i % 2 === 0 ? "#141419" : "#101015",
          }}
        />
      ))}
    </div>
  </div>
);

/** Ce qui s'impose par-dessus : le navigateur, le bandeau, le mur. */
const InAppBrowser: React.FC<{
  appear: number;
  load: number;
  loadOpacity: number;
  cookies: number;
  login: number;
}> = ({ appear, load, loadOpacity, cookies, login }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity: appear,
      translate: "0px " + (1 - appear) * 90 + "px",
      zIndex: 5,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 52,
        right: 0,
        bottom: 0,
        backgroundColor: "#0E0E11",
      }}
    />

    <BrowserChrome
      width={SCREEN.width}
      url="monsite.com/offre-du-jo…"
      loadProgress={load}
      loadOpacity={loadOpacity}
      top={52}
    />

    {/* Page qui ne finit pas de charger : des blocs, rien de lisible. */}
    <div
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        top: 140,
        opacity: 0.5 - login * 0.35,
      }}
    >
      {[88, 96, 70, 92, 54].map((w, i) => (
        <div
          key={w}
          style={{
            width: w + "%",
            height: 9,
            marginTop: i === 0 ? 0 : 11,
            borderRadius: 5,
            backgroundColor: "#1C1C23",
          }}
        />
      ))}
    </div>

    {/* Mur de connexion. */}
    <div
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        top: 250,
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#15151A",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
        opacity: login,
        translate: "0px " + (1 - login) * 18 + "px",
      }}
    >
      <div style={{ color: DARK.text, fontSize: 15, fontWeight: 700 }}>
        Connectez-vous
      </div>
      <div
        style={{
          marginTop: 14,
          height: 34,
          borderRadius: 9,
          backgroundColor: "#0D0D11",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      />
      <div
        style={{
          marginTop: 9,
          height: 34,
          borderRadius: 9,
          backgroundColor: "#0D0D11",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      />
      <div
        style={{
          marginTop: 12,
          height: 36,
          borderRadius: 999,
          backgroundColor: "#2A2A33",
        }}
      />
    </div>

    {/* Bandeau de consentement : il mange le bas de l'écran. */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 18,
        backgroundColor: "#141419",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        opacity: cookies,
        translate: "0px " + (1 - cookies) * 120 + "px",
      }}
    >
      <div
        style={{
          color: DARK.textMuted,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.45,
        }}
      >
        Nous utilisons des cookies pour améliorer votre expérience.
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <div
          style={{
            flex: 1,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        />
        <div
          style={{
            flex: 1,
            height: 32,
            borderRadius: 999,
            backgroundColor: "#2A2A33",
          }}
        />
      </div>
    </div>
  </div>
);
