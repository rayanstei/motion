import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

/**
 * Fond blanc cassé + grille très discrète + gradients pastel subtils.
 * La grille dérive très lentement pour éviter une image morte.
 */
export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Background">
      <AbsoluteFill style={{ backgroundColor: "#FBFBFD" }} />

      <AbsoluteFill
        name="Grid"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,18,32,0.085) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,18,32,0.085) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(72% 68% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 100%)",
          translate: interpolate(frame, [0, 150], ["0px 0px", "-14px -8px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
        }}
      />

      <AbsoluteFill
        name="Halo bleu"
        style={{
          background:
            "radial-gradient(58% 52% at 20% 16%, rgba(47,107,255,0.11) 0%, rgba(47,107,255,0) 70%)",
        }}
      />

      <AbsoluteFill
        name="Halo corail"
        style={{
          background:
            "radial-gradient(54% 50% at 84% 86%, rgba(255,107,74,0.10) 0%, rgba(255,107,74,0) 70%)",
        }}
      />

      <AbsoluteFill
        name="Vignette"
        style={{
          background:
            "radial-gradient(78% 74% at 50% 46%, rgba(255,255,255,0) 40%, rgba(11,18,32,0.05) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
