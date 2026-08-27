import { TransitionSeries } from "@remotion/transitions";
import { AudioMix } from "./AudioMix";
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
import { SoundDesign } from "./SoundDesign";

/**
 * Montage de la vidéo Remakeit.
 *
 * Les coupes sont franches, sans transition générique : chaque scène se
 * termine déjà dans l'état où la suivante commence (position, échelle et
 * zoom caméra de la carte vidéo), c'est ce qui assure la continuité.
 */
export const RemakeitVideo: React.FC = () => {
  return (
    <>
      <AudioMix />

      <SoundDesign />

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
