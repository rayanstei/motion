import { Audio } from "@remotion/media";
import {
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";

/**
 * Piste d'effets sonores.
 *
 * Elle est totalement indépendante du montage visuel : c'est une simple
 * liste de repères. Modifier un son, son instant ou son volume ne touche
 * aucune animation.
 *
 * `at` est une image (30 fps). Les repères sont calés sur l'animation réelle
 * plutôt que sur la seconde ronde du canevas, pour que le son tombe pile sur
 * le mouvement.
 *
 * `rate` (playbackRate) sert à décliner un même fichier en plusieurs
 * gestes : au-dessus de 1 le son est plus léger et plus rapide, en dessous
 * il est plus grave et plus lourd. C'est ce qui évite que les six whooshes
 * sonnent comme le même fichier recollé six fois.
 *
 * Hiérarchie de volume voulue :
 *   impacts / riser  0.34 – 0.44
 *   whooshes         0.16 – 0.30
 *   chime final      0.34
 *   processing       0.26
 *   notifications    0.20 – 0.26
 *   pops             0.22
 *   clics UI         0.14 – 0.18
 *   clavier          0.14
 */
type Cue = {
  name: string;
  file: string;
  /** Image de départ. */
  at: number;
  volume: number;
  /** Durée jouée, en secondes de source. Absent = durée naturelle. */
  playInSeconds?: number;
  /** Vitesse / hauteur. 1 = fichier d'origine. */
  rate?: number;
  /** Fondu de fin, en secondes. Ignoré si `playInSeconds` est absent. */
  fadeOutInSeconds?: number;
};

const ENERGY = "mixkit-shot-light-energy-flowing-2589.wav";
const WHOOSH = "mixkit-cinematic-whoosh-fast-transition-1492.wav";
const CLICK = "mixkit-select-click-1109.wav";
const POP = "mixkit-explainer-video-pops-whoosh-light-pop-3005.wav";
const TECH = "mixkit-technology-transition-slide-3120.wav";
const SUCCESS = "mixkit-software-interface-start-2574.wav";
const RISER = "mixkit-air-zoom-vacuum-2608.wav";
const IMPACT = "mixkit-big-cinematic-impact-788.mp3";
const CHIME = "mixkit-crystal-chime-3108.wav";

const CUES: Cue[] = [
  // ── Scène 1 — le stock ────────────────────────────────────────
  {
    // Raccourci de 2.2s à 1.5s : il empiétait sur le whoosh suivant.
    name: "Intro whoosh",
    file: ENERGY,
    at: 0,
    volume: 0.32,
    playInSeconds: 1.5,
    fadeOutInSeconds: 0.5,
  },
  {
    name: "Whoosh — la bibliothèque s'accumule",
    file: WHOOSH,
    at: 28,
    volume: 0.16,
    rate: 1.18,
  },

  // ── Scène 2 — le montage ──────────────────────────────────────
  {
    // Était le son "AI processing" : mauvais rôle pour un panneau qui
    // monte, et ça usait le son réservé à l'IA (scène 6).
    name: "Whoosh — la timeline monte",
    file: WHOOSH,
    at: 90,
    volume: 0.22,
    rate: 0.9,
  },
  // Cinq micro-clics sur des arrivées de clips réelles, en léger crescendo
  // pour accompagner l'accélération du montage.
  {
    name: "Clic clip 1",
    file: CLICK,
    at: 121,
    volume: 0.14,
    playInSeconds: 0.35,
    rate: 1,
  },
  {
    name: "Clic clip 2",
    file: CLICK,
    at: 129,
    volume: 0.15,
    playInSeconds: 0.35,
    rate: 1.12,
  },
  {
    name: "Clic clip 3",
    file: CLICK,
    at: 142,
    volume: 0.16,
    playInSeconds: 0.35,
    rate: 0.95,
  },
  {
    name: "Clic sous-titre 1",
    file: CLICK,
    at: 156,
    volume: 0.17,
    playInSeconds: 0.35,
    rate: 1.08,
  },
  {
    name: "Clic sous-titre 2",
    file: CLICK,
    at: 165,
    volume: 0.18,
    playInSeconds: 0.35,
    rate: 1.18,
  },

  // ── Scène 3 — plus le temps ───────────────────────────────────
  {
    name: "Whoosh — bascule vers le chaos",
    file: WHOOSH,
    at: 210,
    volume: 0.24,
    rate: 0.88,
  },
  {
    // Sa durée naturelle (1.27s) le fait culminer pile sur l'arrêt net.
    name: "Riser — monte jusqu'à l'arrêt net",
    file: RISER,
    at: 241,
    volume: 0.22,
  },
  {
    // AJOUT : le plus gros temps fort de la première moitié n'était marqué
    // par aucun son. Version courte et aiguë de l'impact final, pour ne pas
    // lui voler la vedette.
    name: "Impact — l'arrêt net",
    file: IMPACT,
    at: 279,
    volume: 0.26,
    playInSeconds: 0.9,
    rate: 1.15,
    fadeOutInSeconds: 0.4,
  },

  // ── Scène 4 — une vidéo, plusieurs shorts ─────────────────────
  {
    // Raccourci de 0.6s à 0.45s : sa traîne couvrait les pops.
    name: "Clic — Générer les shorts",
    file: CLICK,
    at: 330,
    volume: 0.26,
    playInSeconds: 0.45,
    fadeOutInSeconds: 0.15,
  },
  // Quatre hauteurs différentes : quatre cartes, pas une rafale.
  { name: "Pop short 1", file: POP, at: 335, volume: 0.22, rate: 1 },
  { name: "Pop short 2", file: POP, at: 339, volume: 0.22, rate: 1.08 },
  { name: "Pop short 3", file: POP, at: 344, volume: 0.22, rate: 0.94 },
  { name: "Pop short 4", file: POP, at: 348, volume: 0.22, rate: 1.14 },
  {
    name: "Whoosh — le titre se complète",
    file: WHOOSH,
    at: 405,
    volume: 0.13,
    rate: 1.25,
  },

  // ── Scène 5 — coller le lien ──────────────────────────────────
  {
    // Démarre et s'arrête avec la frappe réelle (f468 → f495).
    name: "Frappe clavier",
    file: "mixkit-fast-keyboard-typing-1387.wav",
    at: 468,
    volume: 0.16,
    playInSeconds: 0.95,
    fadeOutInSeconds: 0.2,
  },
  {
    // AJOUT : le champ passe au vert avec "Vidéo trouvée", changement
    // d'état muet jusqu'ici. Volontairement plus aigu et plus discret que
    // les notifications de publication.
    name: "Lien validé",
    file: SUCCESS,
    at: 497,
    volume: 0.16,
    playInSeconds: 0.5,
    rate: 1.2,
    fadeOutInSeconds: 0.2,
  },

  // ── Scène 6 — le clipping ─────────────────────────────────────
  {
    // Seul endroit où ce son apparaît désormais : c'est la signature de l'IA.
    name: "Traitement IA",
    file: TECH,
    at: 585,
    volume: 0.32,
  },

  // ── Scène 7 — prêt à poster ───────────────────────────────────
  {
    name: "Whoosh — les shorts sortent de l'outil",
    file: WHOOSH,
    at: 690,
    volume: 0.18,
    rate: 1.05,
  },

  // ── Scène 8 — publication ─────────────────────────────────────
  // Raccourcis de 1.2s à 0.7s : trois sons de 1.2s à 0.2s d'intervalle se
  // empilaient en bouillie. Hauteurs montantes : ça fait une résolution.
  {
    name: "Publié 1",
    file: SUCCESS,
    at: 837,
    volume: 0.28,
    playInSeconds: 0.7,
    rate: 1,
  },
  {
    name: "Publié 2",
    file: SUCCESS,
    at: 844,
    volume: 0.3,
    playInSeconds: 0.7,
    rate: 1.06,
  },
  {
    name: "Publié 3",
    file: SUCCESS,
    at: 850,
    volume: 0.34,
    playInSeconds: 0.7,
    rate: 1.12,
  },

  // ── Scène 9 — sans montage ────────────────────────────────────
  {
    name: "Whoosh — le plateau recule",
    file: WHOOSH,
    at: 912,
    volume: 0.2,
    rate: 0.92,
  },

  // ── Scène 10 — appel à l'action ───────────────────────────────
  {
    // Sur l'arrivée du nom. Le fondu long le fait mourir en même temps que
    // la musique, pile sur la dernière image.
    name: "Impact final",
    file: IMPACT,
    at: 1005,
    volume: 0.58,
    playInSeconds: 3.5,
    fadeOutInSeconds: 1.2,
  },
  {
    name: "Chime final",
    file: CHIME,
    at: 1042,
    volume: 0.4,
  },
];

export const SoundDesign: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {CUES.map((cue) => {
        const rate = cue.rate ?? 1;
        // `playInSeconds` compte en secondes de source : à vitesse modifiée,
        // la durée réellement entendue change.
        const heardInFrames = cue.playInSeconds
          ? (cue.playInSeconds / rate) * fps
          : 0;
        const fadeInFrames = (cue.fadeOutInSeconds ?? 0.2) * fps;

        return (
          <Sequence key={cue.name} from={cue.at} name={cue.name} layout="none">
            <Audio
              src={staticFile("sons/" + cue.file)}
              playbackRate={rate}
              trimAfter={
                cue.playInSeconds ? cue.playInSeconds * fps : undefined
              }
              volume={(f) =>
                cue.playInSeconds === undefined
                  ? cue.volume
                  : interpolate(
                      f,
                      [heardInFrames - fadeInFrames, heardInFrames],
                      [cue.volume, 0],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.4, 0, 0.6, 1),
                      },
                    )
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
