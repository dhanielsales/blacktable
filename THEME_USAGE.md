# 🎨 Selection Effect Themes

## Available Themes

The `SelectionEffects` component now supports predefined themes and custom colors.

### 🔥 **Fire Theme**

```tsx
<SelectionEffects isSelected={true} theme="fire" />
```

- **Particles**: Orange (`#ff4400`)
- **Glow Ring**: Red (`#ff0000`)
- **Base Glow**: Orange-yellow (`#ff8800`)

### ❄️ **Ice Theme**

```tsx
<SelectionEffects isSelected={true} theme="ice" />
```

- **Particles**: Light blue (`#88ddff`)
- **Glow Ring**: Blue (`#0088ff`)
- **Base Glow**: Pale blue (`#aaccff`)

### ⚡ **Electric Theme**

```tsx
<SelectionEffects isSelected={true} theme="electric" />
```

- **Particles**: Yellow (`#ffff00`)
- **Glow Ring**: Purple (`#8800ff`)
- **Base Glow**: Magenta (`#ff00ff`)

### 🌿 **Nature Theme**

```tsx
<SelectionEffects isSelected={true} theme="nature" />
```

- **Particles**: Green (`#44ff44`)
- **Glow Ring**: Lime (`#88ff00`)
- **Base Glow**: Teal (`#00ff88`)

### ✨ **Gold Theme**

```tsx
<SelectionEffects isSelected={true} theme="gold" />
```

- **Particles**: Gold (`#ffdd00`)
- **Glow Ring**: Orange (`#ff8800`)
- **Base Glow**: Light orange (`#ffaa44`)

### 🩸 **Blood Theme** (NEW!)

```tsx
<SelectionEffects isSelected={true} theme="blood" />
```

- **Particles**: Dark red (`#cc0000`)
- **Glow Ring**: Deep red (`#990000`)
- **Base Glow**: Dark maroon (`#660000`)

### 🔧 **Default Theme**

```tsx
<SelectionEffects isSelected={true} theme="default" />
```

- **Particles**: Cyan (`#00ffff`)
- **Glow Ring**: Pink-red (`#ff6b6b`)
- **Base Glow**: Red (`#ff3333`)

## Usage Examples

### Using a predefined theme:

```tsx
import { SelectionEffects } from "./SelectionEffects";

<SelectionEffects isSelected={true} theme="blood" />;
```

### Using custom colors (overrides theme):

```tsx
<SelectionEffects
  isSelected={true}
  theme="fire"
  particleColor="#custom-color" // Overrides theme particle color
/>
```

### Using only custom colors:

```tsx
<SelectionEffects
  isSelected={true}
  particleColor="#ff0080"
  glowColor="#8000ff"
  baseGlowColor="#ff8000"
/>
```

## Theme Object Export

You can also import the themes object for external use:

```tsx
import { SELECTION_THEMES, SelectionThemeName } from "./SelectionEffects";

// Get all theme names
const themeNames: SelectionThemeName[] = Object.keys(SELECTION_THEMES);

// Access specific theme colors
const bloodTheme = SELECTION_THEMES.blood;
console.log(bloodTheme.particleColor); // "#cc0000"
```

## Current Implementation

The card game currently uses the **blood theme** which fits perfectly with the Vampire: The Eternal Struggle aesthetic!

The blood theme provides a dark, ominous selection effect with deep red tones that enhance the gothic atmosphere of the game.
