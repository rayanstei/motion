import { Composition, Folder } from "remotion";
import { RemakeitVideo } from "./RemakeitVideo";
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

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="RemakeitVideo"
        component={RemakeitVideo}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />

      <Folder name="Scenes">
        <Composition
          id="Scene1-Stock"
          component={ProblemScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2-Montage"
          component={OverloadScene}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3-PlusLeTemps"
          component={NoTimeScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="OneVideoManyShorts"
          component={OneVideoManyShorts}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene5-CollerLeLien"
          component={PasteLinkScene}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene6-Clipping"
          component={AiClippingScene}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene7-PretAPoster"
          component={ReadyToPostScene}
          durationInFrames={105}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene8-Publication"
          component={AutoPublishScene}
          durationInFrames={105}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene9-SansMontage"
          component={NoSkillsScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene10-CTA"
          component={CtaScene}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
