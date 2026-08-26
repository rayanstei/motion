import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SHADOWS } from "../theme";

export type TimelineClip = {
  /** Début, en fraction de la largeur des pistes (0 → 1). */
  start: number;
  /** Largeur, en fraction de la largeur des pistes. */
  width: number;
  /** Apparition, en secondes (temps local de la scène). -1 = déjà en place. */
  atInSeconds: number;
};

export type TimelineTrack = {
  label: string;
  color: string;
  kind: "video" | "audio" | "caption";
  clips: TimelineClip[];
};

/** Géométrie interne du panneau. */
const PAD = 22;
const GUTTER = 128;
const HEADER = 32;
const RULER = 20;
const TRACK_GAP = 12;

/**
 * Timeline de montage volontairement simplifiée mais crédible :
 * en-tête d'application, règle temporelle, pistes vidéo / b-roll / audio /
 * sous-titres, et curseur de lecture.
 *
 * La scène pilote le rythme : elle passe la position du curseur, et chaque
 * clip porte son propre instant d'apparition (stagger).
 */
export const EditorTimeline: React.FC<{
  width: number;
  height: number;
  tracks: TimelineTrack[];
  /** Position du curseur de lecture, de 0 à 1. */
  playhead: number;
}> = ({ width, height, tracks, playhead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lanesTop = PAD + HEADER + 16 + RULER + 12;
  const laneWidth = width - PAD * 2 - GUTTER;
  const laneHeight =
    (height - lanesTop - PAD - TRACK_GAP * (tracks.length - 1)) / tracks.length;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 26,
        backgroundColor: COLORS.white,
        border: "1px solid " + COLORS.line,
        boxShadow: SHADOWS.card,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: PAD,
          height: HEADER,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.blue }}
        />
        <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.2 }}>
          Montage
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.muted }}>
          projet-b2b.mp4
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["Couper", "Titre", "Export"].map((tool) => (
            <div
              key={tool}
              style={{
                padding: "5px 12px",
                borderRadius: 9,
                border: "1px solid " + COLORS.line,
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.muted,
              }}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: PAD + GUTTER,
          top: PAD + HEADER + 16,
          width: laneWidth,
          height: RULER,
          borderTop: "1px solid " + COLORS.line,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((tick) => (
          <div
            key={tick}
            style={{
              position: "absolute",
              left: (tick / 12) * laneWidth,
              top: 0,
              width: 1,
              height: tick % 3 === 0 ? 9 : 5,
              backgroundColor: COLORS.line,
            }}
          />
        ))}
        {[0, 3, 6, 9].map((tick) => (
          <div
            key={tick}
            style={{
              position: "absolute",
              left: (tick / 12) * laneWidth + 6,
              top: 6,
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.muted,
            }}
          >
            {"0" + tick / 3 + ":00"}
          </div>
        ))}
      </div>

      {tracks.map((track, trackIndex) => (
        <div key={track.label}>
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: lanesTop + trackIndex * (laneHeight + TRACK_GAP),
              width: GUTTER - 14,
              height: laneHeight,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: track.color,
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.inkSoft }}>
              {track.label}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: PAD + GUTTER,
              top: lanesTop + trackIndex * (laneHeight + TRACK_GAP),
              width: laneWidth,
              height: laneHeight,
              borderRadius: 10,
              backgroundColor: "#F3F5FA",
            }}
          >
            {track.clips.map((clip) => (
              <Clip
                key={track.label + clip.start}
                clip={clip}
                track={track}
                laneWidth={laneWidth}
                laneHeight={laneHeight}
                appear={interpolate(
                  frame,
                  [clip.atInSeconds * fps, (clip.atInSeconds + 0.32) * fps],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                )}
              />
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: PAD + GUTTER + playhead * laneWidth,
          top: PAD + HEADER + 10,
          bottom: PAD - 4,
          width: 2,
          backgroundColor: COLORS.ink,
          borderRadius: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -9,
            top: -6,
            width: 20,
            height: 14,
            borderRadius: 5,
            backgroundColor: COLORS.ink,
            boxShadow: "0 4px 10px rgba(11,18,32,0.28)",
          }}
        />
      </div>
    </div>
  );
};

/** Un clip : bloc vidéo, forme d'onde audio, ou puce de sous-titre. */
const Clip: React.FC<{
  clip: TimelineClip;
  track: TimelineTrack;
  laneWidth: number;
  laneHeight: number;
  appear: number;
}> = ({ clip, track, laneWidth, laneHeight, appear }) => {
  const clipWidth = clip.width * laneWidth;
  const isCaption = track.kind === "caption";
  const height = isCaption ? laneHeight - 14 : laneHeight - 6;

  return (
    <div
      style={{
        position: "absolute",
        left: clip.start * laneWidth + 3,
        top: (laneHeight - height) / 2,
        width: Math.max(6, clipWidth - 6),
        height,
        borderRadius: 8,
        overflow: "hidden",
        background: isCaption
          ? "rgba(47,107,255,0.10)"
          : "linear-gradient(180deg, " + track.color + "F2 0%, " + track.color + "CC 100%)",
        border: isCaption ? "1px solid rgba(47,107,255,0.25)" : "none",
        boxShadow: isCaption
          ? "none"
          : "0 2px 6px rgba(11,18,32,0.10), inset 0 1px 0 rgba(255,255,255,0.35)",
        opacity: appear,
        scale: 0.86 + appear * 0.14,
        translate: "0px " + (1 - appear) * 9 + "px",
      }}
    >
      {track.kind === "audio" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 3,
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          {new Array(Math.max(1, Math.floor((clipWidth - 12) / 6))).fill(0).map((_, bar) => (
            <div
              key={bar}
              style={{
                width: 3,
                height: (0.28 + 0.62 * Math.abs(Math.sin(bar * 1.9 + clip.start * 31))) * height,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.72)",
              }}
            />
          ))}
        </div>
      ) : null}

      {track.kind === "video" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 4,
            backgroundColor: "rgba(255,255,255,0.4)",
          }}
        />
      ) : null}

      {isCaption ? (
        <div
          style={{
            position: "absolute",
            left: 6,
            right: 6,
            top: "50%",
            height: 3,
            marginTop: -1.5,
            borderRadius: 2,
            backgroundColor: "rgba(47,107,255,0.42)",
          }}
        />
      ) : null}
    </div>
  );
};
