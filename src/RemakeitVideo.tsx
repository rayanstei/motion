import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { Easing, interpolate, staticFile, useVideoConfig } from "remotion";
import { AiClippingScene } from "./scenes/AiClippingScene";
import { AutoPublishScene } from "./scenes/AutoPublishScene";
import { CtaScene } from "./scenes/CtaScene";
import { NoSkillsScene } from "./scenes/NoSkillsScene";
import { NoTimeScene } from "./scenes/NoTimeScene";
import { OneVideoManyShorts } from "./scenes/OneVideoManyShorts";
import { OverloadScene } from "./scenes/OverloadScene";
import { PasteLinkScene } from "./scenes/PasteLinkScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { ReadyToPostScene } from "./scenes/ReadyToPostScene";

/**
 * Musique générale — "Close Up", Michael Ramir C. (Mixkit).
 * Le morceau fait 1:35, il est coupé net à la durée de la vidéo.
 *
 * `volume` est le seul réglage à toucher : il est volontairement gardé sous
 * le maximum pour laisser de la place aux SFX dans un second temps.
 */
const MUSIC = {
  file: "mixkit-close-up-1167.mp3",
  volume: 0.55,
  fadeInInSeconds: 0.9,
  fadeOutInSeconds: 1.8,
};

/**
 * Montage de la vidéo Remakeit.
 *
 * Les coupes sont franches, sans transition générique : chaque scène se
 * termine déjà dans l'état où la suivante commence (position, échelle et
 * zoom caméra de la carte vidéo), c'est ce qui assure la continuité.
 */
export const RemakeitVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      <Audio
        src={staticFile(MUSIC.file)}
        trimAfter={durationInFrames}
        volume={(f) =>
          interpolate(
            f,
            [
              0,
              MUSIC.fadeInInSeconds * fps,
              durationInFrames - MUSIC.fadeOutInSeconds * fps,
              durationInFrames,
            ],
            [0, MUSIC.volume, MUSIC.volume, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [
                Easing.bezier(0.4, 0, 0.2, 1),
                Easing.linear,
                Easing.bezier(0.4, 0, 0.6, 1),
              ],
            },
          )
        }
      />

      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={90}
          name="Scène 1 — Le stock"
        >
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={120}
          name="Scène 2 — Le montage"
        >
          <OverloadScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={90}
          name="Scène 3 — Plus le temps"
        >
          <NoTimeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={150}
          name="Scène 4 — Une vidéo, plusieurs shorts"
        >
          <OneVideoManyShorts />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={120}
          name="Scène 5 — Coller le lien"
        >
          <PasteLinkScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={120}
          name="Scène 6 — Le clipping"
        >
          <AiClippingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={105}
          name="Scène 7 — Prêt à poster"
        >
          <ReadyToPostScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={105}
          name="Scène 8 — Publication"
        >
          <AutoPublishScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={90}
          name="Scène 9 — Sans montage"
        >
          <NoSkillsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence
          durationInFrames={120}
          name="Scène 10 — Appel à l'action"
        >
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
