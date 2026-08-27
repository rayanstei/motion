import { COLORS, SHADOWS } from "../theme";

/**
 * Bouton d'action bleu, même langage que celui de la carte vidéo.
 * L'étincelle rappelle la génération : c'est le geste central de l'outil.
 */
export const ActionButton: React.FC<{
  label: string;
  fontSize?: number;
}> = ({ label, fontSize = 20 }) => {
  const glyph = fontSize * 0.72;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: fontSize * 0.45,
        padding: fontSize * 0.7 + "px " + fontSize * 1.1 + "px",
        borderRadius: fontSize * 0.7,
        background:
          "linear-gradient(180deg, #4A80FF 0%, " + COLORS.blue + " 100%)",
        color: COLORS.white,
        fontSize,
        fontWeight: 600,
        letterSpacing: -0.2,
        whiteSpace: "nowrap",
        boxShadow: SHADOWS.button + ", inset 0 1px 0 rgba(255,255,255,0.32)",
      }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 16 16">
        <path
          d="M8 1.4 L9.5 6.5 L14.6 8 L9.5 9.5 L8 14.6 L6.5 9.5 L1.4 8 L6.5 6.5 Z"
          fill="rgba(255,255,255,0.95)"
        />
      </svg>
      {label}
    </div>
  );
};
