import { COLORS, SHADOWS, SURFACE, TINTS } from "../theme";

/**
 * Fenêtre d'application : uniquement le châssis (barre de titre + cadre).
 * Le contenu est posé par la scène dans ses propres couches, en
 * coordonnées de composition — plus simple à animer indépendamment.
 */
export const AppWindow: React.FC<{
  width: number;
  height: number;
  /** Domaine affiché dans la barre d'adresse. */
  label: string;
  /** Nom du produit, à gauche de la barre de titre. */
  brand: string;
}> = ({ width, height, label, brand }) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 28,
        backgroundColor: COLORS.white,
        border: SURFACE.border,
        boxShadow: SHADOWS.card + ", " + SURFACE.rim,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 56,
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 18,
          gap: 8,
          background:
            "linear-gradient(180deg, " +
            TINTS.chromeTop +
            " 0%, " +
            TINTS.chromeBottom +
            " 100%)",
          borderBottom: "1px solid " + COLORS.line,
        }}
      >
        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: TINTS.chromeDot,
          }}
        />
        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: TINTS.chromeDot,
          }}
        />
        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: TINTS.chromeDot,
          }}
        />

        <div
          style={{
            marginLeft: 16,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: COLORS.ink,
          }}
        >
          {brand}
        </div>

        <div
          style={{
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "6px 20px",
            borderRadius: 9,
            backgroundColor: COLORS.white,
            border: "1px solid " + COLORS.line,
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.muted,
          }}
        >
          <svg width={11} height={13} viewBox="0 0 11 13">
            <path
              d="M2.6 5.4V3.9a2.9 2.9 0 0 1 5.8 0v1.5"
              fill="none"
              stroke={COLORS.muted}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <rect
              x={1}
              y={5.4}
              width={9}
              height={6.6}
              rx={1.8}
              fill={COLORS.muted}
            />
          </svg>
          {label}
        </div>

        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            background:
              "linear-gradient(135deg, " +
              TINTS.avatarFrom +
              " 0%, " +
              TINTS.avatarTo +
              " 100%)",
          }}
        />
      </div>
    </div>
  );
};
