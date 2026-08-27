import { COLORS, SHADOWS, SURFACE } from "../theme";

const pad = (value: number) => (value < 10 ? "0" + value : "" + value);

/**
 * Compteur de temps flottant, façon HUD d'application.
 * La scène pilote la valeur et la rotation de l'aiguille : c'est elle qui
 * décide de l'emballement puis de l'arrêt net.
 */
export const TimeCounter: React.FC<{
  width: number;
  label: string;
  /** Secondes écoulées à afficher. */
  seconds: number;
  /** Rotation de l'aiguille, en degrés. */
  handRotation: number;
  /** 0 → 1 : plus ça s'emballe, plus le chiffre vire à la couleur d'accent. */
  intensity: number;
}> = ({ width, label, seconds, handRotation, intensity }) => {
  const total = Math.max(0, Math.floor(seconds));

  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 20,
        backgroundColor: COLORS.white,
        border: SURFACE.border,
        boxShadow: SHADOWS.card + ", " + SURFACE.rim,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 42,
          height: 42,
          flexShrink: 0,
          borderRadius: 21,
          border: "2px solid " + COLORS.line,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 2,
            height: 15,
            marginLeft: -1,
            marginTop: -15,
            borderRadius: 1,
            transformOrigin: "bottom center",
            backgroundColor: intensity > 0.5 ? COLORS.coral : COLORS.inkSoft,
            rotate: handRotation + "deg",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 5,
            height: 5,
            marginLeft: -2.5,
            marginTop: -2.5,
            borderRadius: 3,
            backgroundColor: COLORS.ink,
          }}
        />
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.1,
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 31,
            fontWeight: 700,
            letterSpacing: -0.5,
            fontVariantNumeric: "tabular-nums",
            color: intensity > 0.5 ? COLORS.coral : COLORS.ink,
          }}
        >
          {pad(Math.floor(total / 3600)) +
            ":" +
            pad(Math.floor((total % 3600) / 60)) +
            ":" +
            pad(total % 60)}
        </div>
      </div>
    </div>
  );
};
