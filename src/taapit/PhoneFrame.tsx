import { DARK, darkDepth } from "./theme";

/**
 * Châssis de téléphone, générique.
 *
 * Le composant ne connaît aucun contenu : l'écran reçoit ses enfants. Il ne
 * connaît pas non plus Taap.it — seule la couleur d'accent est une prop, ce
 * qui le rend réutilisable pour n'importe quel univers sombre.
 *
 * `depth` pilote les quatre mécanismes de profondeur d'un coup (voir
 * `darkTheme.ts`). `screenGlow` module séparément la lumière que l'écran
 * projette : c'est ce qui permet de faire réagir le téléphone à un tap sans
 * toucher à sa profondeur de repos.
 */
export const PhoneFrame: React.FC<{
  width: number;
  /** 0 = posé à plat, 1 = nettement détaché. Au-delà de 0.7 ça se voit. */
  depth?: number;
  /** Intensité de la lumière projetée par l'écran, 0 → 1. */
  screenGlow?: number;
  accent?: string;
  /** Contenu de l'écran. */
  children?: React.ReactNode;
  /** Heure affichée dans la barre d'état. */
  statusTime?: string;
}> = ({
  width,
  depth = 0.5,
  screenGlow = 0.5,
  accent = "#FFFFFF",
  children,
  statusTime = "9:41",
}) => {
  const height = width * 2.05;
  const radius = width * 0.145;
  const bezel = width * 0.034;
  const style = darkDepth(depth, accent);

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Nappe d'accent, très large : elle ancre l'objet dans une couleur. */}
      <div
        style={{
          position: "absolute",
          left: -width * 0.75,
          top: -height * 0.18,
          width: width * 2.5,
          height: height * 1.36,
          background: style.ambient,
          opacity: screenGlow,
        }}
      />

      {/* Lumière que l'écran projette autour de lui. */}
      <div
        style={{
          position: "absolute",
          left: -width * 0.4,
          top: -height * 0.08,
          width: width * 1.8,
          height: height * 1.16,
          background:
            "radial-gradient(closest-side, rgba(255,255,255," +
            (0.05 * screenGlow).toFixed(3) +
            ") 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Corps. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          backgroundColor: DARK.surface,
          backgroundImage: style.lift,
          border: style.border,
          // La tranche : un filet clair juste à l'intérieur du bord. C'est
          // le signal le plus fort qu'il s'agit d'un objet et non d'un aplat.
          boxShadow:
            style.spill +
            ", " +
            style.rim +
            ", inset 0 0 0 1.5px rgba(255,255,255,0.085)",
        }}
      />

      {/* Boutons latéraux : trois volumes qui cassent la silhouette. */}
      <div
        style={{
          position: "absolute",
          left: -2,
          top: height * 0.2,
          width: 3,
          height: height * 0.055,
          borderRadius: 2,
          backgroundColor: DARK.surfaceHigh,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -2,
          top: height * 0.28,
          width: 3,
          height: height * 0.055,
          borderRadius: 2,
          backgroundColor: DARK.surfaceHigh,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -2,
          top: height * 0.24,
          width: 3,
          height: height * 0.08,
          borderRadius: 2,
          backgroundColor: DARK.surfaceHigh,
        }}
      />

      {/* Écran. */}
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: radius - bezel * 0.7,
          backgroundColor: "#000000",
          overflow: "hidden",
        }}
      >
        {/* Barre d'état, générique. */}
        <div
          style={{
            position: "absolute",
            left: width * 0.09,
            right: width * 0.09,
            top: width * 0.05,
            height: width * 0.06,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: DARK.text,
            fontSize: width * 0.045,
            fontWeight: 600,
            zIndex: 2,
          }}
        >
          <span>{statusTime}</span>
          <span style={{ display: "flex", gap: width * 0.018 }}>
            {[0.55, 0.75, 1].map((h) => (
              <span
                key={h}
                style={{
                  width: width * 0.012,
                  height: width * 0.04 * h,
                  alignSelf: "flex-end",
                  borderRadius: 1,
                  backgroundColor: DARK.text,
                  opacity: 0.85,
                }}
              />
            ))}
            <span
              style={{
                width: width * 0.05,
                height: width * 0.026,
                marginLeft: width * 0.01,
                alignSelf: "center",
                borderRadius: 3,
                border: "1px solid " + DARK.textMuted,
              }}
            />
          </span>
        </div>

        {/* Îlot. */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: width * 0.038,
            width: width * 0.26,
            height: width * 0.075,
            marginLeft: -width * 0.13,
            borderRadius: width * 0.04,
            backgroundColor: "#000000",
            zIndex: 3,
          }}
        />

        {children}

        {/* Reflet de verre : une bande diagonale très faible sur la dalle. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(122deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 38%)",
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
      </div>

      {/* Liseré interne de l'écran : sépare la dalle du châssis. */}
      <div
        style={{
          position: "absolute",
          inset: bezel,
          borderRadius: radius - bezel * 0.7,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
