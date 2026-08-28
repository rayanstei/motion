import { AbsoluteFill } from "remotion";
import { DARK } from "../taapit/theme";
import { PhoneFrame } from "../taapit/PhoneFrame";
import { TAAP_FONT, TAAP } from "../taapit/theme";

/**
 * Banc de comparaison des niveaux de profondeur.
 *
 * Trois `depth` côte à côte, contenu identique. Sert à trancher visuellement
 * plutôt qu'à l'estime — et à documenter pourquoi la valeur retenue l'a été.
 */

const DemoScreen: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      paddingTop: 92,
      paddingLeft: 22,
      paddingRight: 22,
      fontFamily: TAAP_FONT,
    }}
  >
    <div style={{ color: DARK.textMuted, fontSize: 13, fontWeight: 600 }}>
      Aujourd&apos;hui
    </div>
    <div
      style={{
        marginTop: 6,
        color: DARK.text,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: -0.5,
      }}
    >
      Votre lien
    </div>

    <div
      style={{
        marginTop: 18,
        padding: 16,
        borderRadius: 16,
        backgroundColor: DARK.surfaceHigh,
        border: "1px solid " + DARK.line,
      }}
    >
      <div
        style={{
          width: "72%",
          height: 9,
          borderRadius: 5,
          backgroundColor: "#2A2A32",
        }}
      />
      <div
        style={{
          width: "45%",
          height: 9,
          marginTop: 9,
          borderRadius: 5,
          backgroundColor: "#202027",
        }}
      />
    </div>

    <div
      style={{
        marginTop: 16,
        padding: "13px 0",
        borderRadius: 999,
        backgroundColor: TAAP.green,
        color: "#062B14",
        fontSize: 15,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      Ouvrir
    </div>
  </div>
);

const LEVELS = [
  { depth: 0.25, x: 380, label: "depth 0.25 — posé" },
  { depth: 0.5, x: 960, label: "depth 0.50 — détaché" },
  { depth: 0.85, x: 1540, label: "depth 0.85 — flottant" },
];

export const ProtoDarkLevels: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK.bg, fontFamily: TAAP_FONT }}>
      {LEVELS.map((level) => (
        <div key={level.depth}>
          <div
            style={{
              position: "absolute",
              left: level.x - 150,
              top: 190,
              width: 300,
            }}
          >
            <PhoneFrame
              width={300}
              depth={level.depth}
              screenGlow={level.depth}
              accent={TAAP.green}
            >
              <DemoScreen />
            </PhoneFrame>
          </div>

          <div
            style={{
              position: "absolute",
              left: level.x - 150,
              top: 880,
              width: 300,
              textAlign: "center",
              color: DARK.textMuted,
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            {level.label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
