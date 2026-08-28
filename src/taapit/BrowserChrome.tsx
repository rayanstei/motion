import { DARK } from "./theme";

/**
 * Barre d'un navigateur intégré à une application.
 *
 * Ce n'est volontairement pas l'`AppWindow` du moteur Remakeit : une fenêtre
 * de bureau et un navigateur in-app mobile n'ont ni la même anatomie ni le
 * même propos. Ici tout doit dire « ce n'est pas chez vous » : la croix qui
 * remplace le bouton retour, l'URL tronquée qu'on ne peut pas modifier, et la
 * barre de chargement.
 */
export const BrowserChrome: React.FC<{
  /** Largeur de la dalle. */
  width: number;
  /** Domaine affiché, déjà tronqué. */
  url: string;
  /** Avancement du chargement, 0 → 1. */
  loadProgress: number;
  /** Décalage vertical, en px depuis le haut de la dalle. */
  top: number;
  /** Opacité de la barre de chargement. 0 = la page a renoncé. */
  loadOpacity?: number;
}> = ({ width, url, loadProgress, top, loadOpacity = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width,
        height: 62,
        backgroundColor: "#161619",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
          gap: 12,
        }}
      >
        {/* Croix : on ne revient pas en arrière, on ferme. */}
        <svg width={15} height={15} viewBox="0 0 16 16">
          <path
            d="M3 3 L13 13 M13 3 L3 13"
            stroke={DARK.textMuted}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </svg>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            minWidth: 0,
          }}
        >
          <svg width={9} height={11} viewBox="0 0 11 13">
            <path
              d="M2.6 5.4V3.9a2.9 2.9 0 0 1 5.8 0v1.5"
              fill="none"
              stroke={DARK.textFaint}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <rect
              x={1}
              y={5.4}
              width={9}
              height={6.6}
              rx={1.8}
              fill={DARK.textFaint}
            />
          </svg>
          <span
            style={{
              color: DARK.textMuted,
              fontSize: 13,
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {url}
          </span>
        </div>

        {/* Trois points : le menu réduit d'un navigateur qui n'est pas le vôtre. */}
        <div style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 3,
                borderRadius: 2,
                backgroundColor: DARK.textMuted,
              }}
            />
          ))}
        </div>
      </div>

      {/* Chargement : il n'atteint jamais le bout. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: -1,
          height: 2,
          width: loadProgress * width,
          backgroundColor: "#4A6CF0",
          opacity: loadProgress > 0 ? loadOpacity : 0,
        }}
      />
    </div>
  );
};
