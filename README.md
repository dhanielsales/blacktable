# BlackTable - Virtual Card Gaming Platform

A modern, 3D virtual card gaming platform built with React Three Fiber, TypeScript, and TanStack Router. Features interactive pentagon tables, real-time multiplayer capabilities, and PWA support.

## 🚀 Features

### 🎮 Interactive 3D Gaming

- **Pentagon Table Layout**: 5 beautifully arranged pentagon tables for optimal gameplay
- **Card Interactions**: Click to select cards, move them to any grid cell
- **Visual Feedback**: Translucent selection effects and hover previews
- **Smooth Animations**: Fluid 3D movements and transitions

### 🌐 Web Application

- **Landing Page**: Professional homepage with feature showcase
- **Game Rooms**: Create and join multiplayer game sessions
- **Settings**: Customize graphics, audio, and player preferences
- **Help System**: Comprehensive tutorials and FAQ
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 📱 Progressive Web App (PWA)

- **Install Prompt**: Add to home screen for native app experience
- **Offline Support**: Play even without internet connection
- **Service Worker**: Caches assets for fast loading
- **Push Notifications**: Stay updated with game events

### 🎯 Performance Optimized

- **Ref-based State**: Optimized hover detection to prevent re-renders
- **Unified Coordinates**: Accurate card positioning across all tables
- **Lazy Loading**: Components load only when needed
- **Asset Caching**: Fast startup and smooth gameplay

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **3D Graphics**: React Three Fiber (@react-three/fiber)
- **Routing**: TanStack Router with file-based routing
- **Styling**: Tailwind CSS with custom gradients
- **State Management**: React Context API with refs
- **PWA**: Service Worker, Web App Manifest
- **Build Tool**: Vite for fast development

## 🎮 How to Play

### Getting Started

1. **Launch the Game**: Click "Play Game" from the homepage
2. **Select a Card**: Click on any card to select it (becomes translucent)
3. **Move Cards**: Click on any grid cell to move your selected card
4. **Multiple Tables**: Use all 5 pentagon tables for complex gameplay

### Advanced Features

- **Room Play**: Create or join rooms for multiplayer sessions
- **Settings**: Adjust graphics quality and game preferences
- **Install App**: Add to home screen for native experience
- **Help**: Access tutorials and controls reference

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd blacktable

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📱 PWA Installation

### Desktop

1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click "Install BlackTable"

### Mobile

1. Open in Safari/Chrome mobile
2. Tap the "Install" prompt on the homepage
3. Add to home screen

## 🎯 Performance Features

### Optimizations Implemented

- **Hover State Optimization**: Uses refs instead of state for hover detection
- **Coordinate System**: Unified positioning across rotated tables
- **Asset Caching**: Service worker caches 3D models and textures
- **Component Splitting**: Lazy loading for better initial load times

## 🛡️ Browser Support

### Fully Supported

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requirements

- WebGL 2.0 support
- ES2020 features
- Service Workers (for PWA)

---

**BlackTable** - Where card games come alive in 3D! 🎮✨
