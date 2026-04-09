/**
 * UrchinBackground — SSoT config for the tttwinkle-inspired radial spike field.
 *
 * Visual: 120 lines at 3° intervals emanating from the centre, varied lengths
 * and opacities, with per-spike shimmer (the "twinkle").
 *
 * Interaction: cursor proximity deflects nearby spikes AWAY via a torque model;
 * a spring restores each spike to its base angle with pleasant oscillation.
 *
 * All length/radius values are fractions of Math.min(containerW, containerH)
 * so the field scales correctly at any container size.
 */

/* ── Geometry & appearance ──────────────────────────────────────────────────── */

export const URCHIN_CONFIG = {
  /** Number of spikes — 100 gives clean 3° angular step (TAU / 120) */
  spikeCount:   100,

  /** Shortest spike as a fraction of minDim */
  minHalfLen:   0.09,

  /** Longest spike as a fraction of minDim */
  maxHalfLen:   0.445,

  /** Minimum base opacity — matches SVG's lightest lines (~0.08) */
  minOpacity:   0.01,

  /** Maximum base opacity */
  maxOpacity:   0.2,

  /** Thinnest stroke (px) — scales with spike length */
  lineWidthMin: 0.6,

  /** Thickest stroke (px) */
  lineWidthMax: 3.0,

  /* ── Twinkle ──────────────────────────────────────────────────────────── */

  /** How much the opacity shimmer can vary (0 = static, 1 = full range) */
  shimmerAmp:   0.30,

  /** Base shimmer speed in radians per frame */
  shimmerSpeed: 0.005,

  /* ── Spring physics ───────────────────────────────────────────────────── */

  /** Cursor influence radius as a fraction of minDim */
  repelRadius:  0.05,

  /**
   * Maximum angular impulse added per frame at closest approach (radians).
   * Tune this for more / less dramatic deflection.
   */
  repelSpeed:   0.015,

  /**
   * Spring stiffness — how hard the spike pulls back to baseAngle.
   * Lower = softer, more oscillation before settling.
   */
  springK:      0.025,

  /**
   * Per-frame velocity decay [0–1].
   */
  damping:      0.5,
} as const;

/* ── Colour palette ─────────────────────────────────────────────────────────── */

export const URCHIN_COLORS = {
  cyan:   [0,   245, 255] as const,
  pink:   [255,   0,  85] as const,
  purple: [179,   0, 255] as const,
} as const;

export type UrchinColorKey = keyof typeof URCHIN_COLORS;

/**
 * Cumulative probability thresholds — cyan dominant (matches site palette).
 * Each entry: [colorKey, cumulativeProbability].
 */
export const URCHIN_COLOR_DIST: Array<[UrchinColorKey, number]> = [
  ['cyan',   0.60],
  ['pink',   0.85],
  ['purple', 1.00],
];
