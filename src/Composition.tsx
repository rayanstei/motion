import { Composition, Folder } from "remotion";
import { RemakeitVideo } from "./RemakeitVideo";
import { S1Browser } from "./taapit/scenes/S1Browser";
import { S2Reversal } from "./taapit/scenes/S2Reversal";
import { S3Journey } from "./taapit/scenes/S3Journey";
import { ProtoClickPath } from "./prototypes/ProtoClickPath";
import { ProtoDark } from "./prototypes/ProtoDark";
import { ProtoDarkLevels } from "./prototypes/ProtoDarkLevels";
import { ProtoWave } from "./prototypes/ProtoWave";
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

      <Folder name="Taapit">
        <Composition
          id="Taapit-S1"
          component={S1Browser}
          durationInFrames={510}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ tightened: true, showLoss: false }}
        />
        <Composition
          id="Taapit-S2"
          component={S2Reversal}
          durationInFrames={354}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Taapit-S3"
          component={S3Journey}
          durationInFrames={456}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Prototypes">
        <Composition
          id="Proto-Wave"
          component={ProtoWave}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Proto-Dark"
          component={ProtoDark}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Proto-DarkLevels"
          component={ProtoDarkLevels}
          durationInFrames={30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Proto-ClickPath"
          component={ProtoClickPath}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

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
