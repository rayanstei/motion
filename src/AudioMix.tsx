import { Audio } from "@remotion/media";
import { Easing, interpolate, staticFile, useVideoConfig } from "remotion";

/**
 * Mixage voix + musique.
 *
 * Les SFX vivent à part, dans `SoundDesign.tsx`. Ici on ne gère que les deux
 * lits sonores et la relation entre eux : la musique s'efface là où la voix
 * parle, et revient là où elle se tait.
 *
 * Pour une autre vidéo, il suffit de remplacer le fichier de voix, de mesurer
 * ses périodes de parole et de réécrire `speech`. Rien d'autre ne bouge.
 *
 * ── Comment `speech` a été obtenu ───────────────────────────────────
 * Pas à l'oreille ni d'après un script, mais mesuré sur le fichier :
 *   ffmpeg -i voix.mp3 -af silencedetect=noise=-34dB:d=0.30 -f null -
 * Le relevé montre une parole continue de 0 à 25,87 s, coupée seulement de
 * respirations de 0,33 à 0,55 s. Ces trous sont trop courts pour y remonter
 * la musique : une remontée suivie d'une rechute en moins d'une seconde
 * s'entend comme du pompage. D'où une seule fenêtre de ducking, tenue sur
 * toute la narration, et une vraie remontée après 25,87 s — là où il reste
 * onze secondes d'image sans voix.
 *
 * ── Niveaux ─────────────────────────────────────────────────────────
 * Le fichier de voix a été normalisé à -18 LUFS / -1,5 dBTP en amont, donc
 * il se joue ici à gain unitaire. La hiérarchie voix > SFX > musique tient
 * par les niveaux, pas par des corrections dynamiques.
 */
const MIX = {
  voice: {
    file: "sons/remakeit-voiceover-mix.mp3",
    /** Fichier déjà normalisé : 1 = tel quel. */
    volume: 1,
  },
  music: {
    file: "mixkit-close-up-1167.mp3",
    /** Niveau quand personne ne parle. */
    soloVolume: 0.5,
    /** Niveau sous la narration. */
    duckedVolume: 0.14,
    fadeInInSeconds: 0.9,
    fadeOutInSeconds: 1.8,
  },
  /** Périodes de parole réellement mesurées, en secondes. */
  speech: [{ fromInSeconds: 0, toInSeconds: 25.87 }],
  /** Descente avant la parole, montée après : assez longues pour ne pas s'entendre. */
  duckAttackInSeconds: 0.35,
  duckReleaseInSeconds: 1.1,
};

export const AudioMix: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      <Audio src={staticFile(MIX.voice.file)} volume={() => MIX.voice.volume} />

      <Audio
        src={staticFile(MIX.music.file)}
        trimAfter={durationInFrames}
        volume={(f) => {
          // 1 = la voix parle, 0 = silence. Le max couvre plusieurs fenêtres.
          const duck = Math.max(
            0,
            ...MIX.speech.map((window) =>
              interpolate(
                f,
                [
                  (window.fromInSeconds - MIX.duckAttackInSeconds) * fps,
                  window.fromInSeconds * fps,
                  window.toInSeconds * fps,
                  (window.toInSeconds + MIX.duckReleaseInSeconds) * fps,
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
              ),
            ),
          );

          const level =
            MIX.music.soloVolume +
            (MIX.music.duckedVolume - MIX.music.soloVolume) * duck;

          // Fondus d'entrée et de sortie du morceau, indépendants du ducking.
          const fade = interpolate(
            f,
            [
              0,
              MIX.music.fadeInInSeconds * fps,
              durationInFrames - MIX.music.fadeOutInSeconds * fps,
              durationInFrames,
            ],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [
                Easing.bezier(0.4, 0, 0.2, 1),
                Easing.linear,
                Easing.bezier(0.4, 0, 0.6, 1),
              ],
            },
          );

          return level * fade;
        }}
      />
    </>
  );
};
