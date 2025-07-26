export interface SelectionEffectTheme {
  particleColor: string;
  glowColor: string;
  baseGlowColor: string;
  cardGlowColor: string;
}

export const SELECTION_EFFECT_THEMES = {
  fire: {
    particleColor: "#ff4400",
    glowColor: "#ff0000",
    baseGlowColor: "#ff8800",
    cardGlowColor: "#ff6600",
  },
  ice: {
    particleColor: "#88ddff",
    glowColor: "#0088ff",
    baseGlowColor: "#aaccff",
    cardGlowColor: "#66aaff",
  },
  electric: {
    particleColor: "#ffff00",
    glowColor: "#8800ff",
    baseGlowColor: "#ff00ff",
    cardGlowColor: "#cc00ff",
  },
  nature: {
    particleColor: "#44ff44",
    glowColor: "#88ff00",
    baseGlowColor: "#00ff88",
    cardGlowColor: "#66cc44",
  },
  gold: {
    particleColor: "#ffdd00",
    glowColor: "#ff8800",
    baseGlowColor: "#ffaa44",
    cardGlowColor: "#ffcc66",
  },
  blood: {
    particleColor: "#cc0000",
    glowColor: "#990000",
    baseGlowColor: "#660000",
    cardGlowColor: "#910101",
  },
} as const;

export type SelectionThemeName = keyof typeof SELECTION_EFFECT_THEMES;

export const defaultSelectionTheme: SelectionThemeName = "blood";
