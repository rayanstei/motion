import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TAAP } from "./theme";

export type PathPoint = { x: number; y: number };

/**
 * Trajet du clic — prototype des scènes 7 à 10 de Taap.it.
 *
 * ── Le point d'architecture qui compte ───────────────────────────────
 * Le retour (scène 10) ne doit pas être un second développement. La solution
 * retenue : `direction: "reverse"` inverse simplement la liste de points, et
 * toute la mécanique en aval est identique. Un aller et un retour, c'est le
 * même composant et la même géométrie — seule la prop change.
 *
 * ── Géométrie ────────────────────────────────────────────────────────
 * Le trajet est une polyligne. On calcule les longueurs cumulées une fois,
 * puis on situe le point à une distance donnée le long du parcours. Le rail
 * dessiné en SVG utilise exactement les mêmes points : la traînée ne peut
 * donc jamais décoller du rail, même dans les virages.
 *
 * Une branche se fait en ajoutant des points qui dévient — pas besoin d'un
 * système d'aiguillage séparé.
 */

/**
 * Arrondit les sommets d'une polyligne.
 *
 * Chaque coude est remplacé par une courbe quadratique dont le point de
 * contrôle est le sommet d'origine. On renvoie une polyligne plus dense,
 * pas une courbe : le calcul de position et le rail SVG continuent donc
 * d'utiliser exactement la même géométrie, et la traînée ne peut pas
 * décoller du rail.
 *
 * Symétrique : arrondir puis inverser donne le même tracé qu'inverser puis
 * arrondir. L'architecture bidirectionnelle est intacte.
 */
const roundCorners = (points: PathPoint[], radius: number): PathPoint[] => {
  if (points.length < 3 || radius <= 0) {
    return points;
  }
  const out: PathPoint[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const before = points[i - 1];
    const after = points[i + 1];
    const ax = before.x - p.x;
    const ay = before.y - p.y;
    const bx = after.x - p.x;
    const by = after.y - p.y;
    const la = Math.max(1, Math.sqrt(ax * ax + ay * ay));
    const lb = Math.max(1, Math.sqrt(bx * bx + by * by));
    // Jamais plus de la moitié d'un segment, sinon deux coudes se mangent.
    const r = Math.min(radius, la / 2, lb / 2);
    const sx = p.x + (ax / la) * r;
    const sy = p.y + (ay / la) * r;
    const ex = p.x + (bx / lb) * r;
    const ey = p.y + (by / lb) * r;
    const steps = 12;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const inv = 1 - t;
      out.push({
        x: inv * inv * sx + 2 * inv * t * p.x + t * t * ex,
        y: inv * inv * sy + 2 * inv * t * p.y + t * t * ey,
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
};

/** Longueurs cumulées le long de la polyligne. */
const cumulative = (points: PathPoint[]) => {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  return lengths;
};

/** Position à l'avancement `t` (0 → 1) le long de la polyligne. */
const positionAt = (
  points: PathPoint[],
  lengths: number[],
  t: number,
): PathPoint => {
  const total = lengths[lengths.length - 1];
  const target = Math.min(Math.max(t, 0), 1) * total;

  for (let i = 1; i < points.length; i++) {
    if (target <= lengths[i]) {
      const segment = lengths[i] - lengths[i - 1];
      const local = segment === 0 ? 0 : (target - lengths[i - 1]) / segment;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * local,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * local,
      };
    }
  }
  return points[points.length - 1];
};

export const ClickPath: React.FC<{
  /** Le parcours, en px depuis le coin haut-gauche du cadre. */
  points: PathPoint[];
  atInSeconds: number;
  durationInSeconds: number;
  /** "reverse" rejoue le même trajet à l'envers, sans autre changement. */
  direction?: "forward" | "reverse";
  /** Courbe d'avancement. Par défaut : départ franc, arrivée maîtrisée. */
  curve?: readonly [number, number, number, number];
  color?: string;
  /** Nombre d'échantillons de traînée. */
  trailLength?: number;
  /** Écart entre deux échantillons, en avancement. */
  trailSpacing?: number;
  dotSize?: number;
  /** Couleur du noyau. Blanc sur fond sombre, accent sur fond clair. */
  coreColor?: string;
  /** Rayon des virages, en px. 0 = angles vifs. */
  cornerRadius?: number;
  /** Affiche le rail sous le trajet. */
  showRail?: boolean;
  /**
   * Dimensions du SVG du rail. Par defaut celles de la composition ; a
   * elargir quand le trajet sort du cadre et que la camera le suit.
   */
  canvasWidth?: number;
  canvasHeight?: number;
}> = ({
  points,
  atInSeconds,
  durationInSeconds,
  direction = "forward",
  curve = [0.45, 0, 0.25, 1],
  color = TAAP.green,
  trailLength = 14,
  trailSpacing = 0.014,
  dotSize = 16,
  coreColor,
  cornerRadius = 0,
  showRail = true,
  canvasWidth,
  canvasHeight,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const railWidth = canvasWidth ?? width;
  const railHeight = canvasHeight ?? height;
  const core = coreColor ?? TAAP.white;

  // Toute l'inversion tient dans cette ligne.
  const ordered = direction === "reverse" ? [...points].reverse() : points;
  const path = roundCorners(ordered, cornerRadius);
  const lengths = cumulative(path);

  const progress = interpolate(
    frame,
    [atInSeconds * fps, (atInSeconds + durationInSeconds) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(curve[0], curve[1], curve[2], curve[3]),
    },
  );

  const head = positionAt(path, lengths, progress);

  // Le point n'existe que pendant son trajet.
  const alive = interpolate(
    frame,
    [
      atInSeconds * fps - 0.15 * fps,
      atInSeconds * fps,
      (atInSeconds + durationInSeconds) * fps,
      (atInSeconds + durationInSeconds) * fps + 0.3 * fps,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: [
        Easing.bezier(0.4, 0, 0.2, 1),
        Easing.linear,
        Easing.bezier(0.4, 0, 0.2, 1),
      ],
    },
  );

  const d = "M " + path.map((p) => p.x + " " + p.y).join(" L ");

  return (
    <AbsoluteFill>
      {showRail ? (
        <svg
          width={railWidth}
          height={railHeight}
          viewBox={"0 0 " + railWidth + " " + railHeight}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {/* Rail au repos. */}
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeOpacity={0.14}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Portion déjà parcourue, révélée par le point. */}
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeOpacity={0.55 * alive}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
          />
        </svg>
      ) : null}

      {/* Traînée : des échantillons du passé récent, de plus en plus faibles. */}
      {new Array(trailLength).fill(0).map((_, i) => {
        const back = progress - (i + 1) * trailSpacing;
        if (back <= 0) {
          return null;
        }
        const p = positionAt(path, lengths, back);
        const decay = 1 - (i + 1) / (trailLength + 1);
        const size = dotSize * (0.25 + decay * 0.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              borderRadius: size,
              backgroundColor: color,
              opacity: decay * decay * 0.55 * alive,
              filter: "blur(" + (1 - decay) * 3 + "px)",
            }}
          />
        );
      })}

      {/* La tête : un noyau net dans un halo. */}
      <div
        style={{
          position: "absolute",
          left: head.x - dotSize * 2.4,
          top: head.y - dotSize * 2.4,
          width: dotSize * 4.8,
          height: dotSize * 4.8,
          borderRadius: dotSize * 4.8,
          background:
            "radial-gradient(circle, " + color + "66 0%, " + color + "00 70%)",
          opacity: alive,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: head.x - dotSize / 2,
          top: head.y - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize,
          backgroundColor: core,
          boxShadow:
            "0 0 " + dotSize * 1.4 + "px " + dotSize * 0.5 + "px " + color,
          opacity: alive,
        }}
      />
    </AbsoluteFill>
  );
};
