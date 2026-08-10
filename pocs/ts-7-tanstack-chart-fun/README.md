# TanStack Charts 0.7.0 App

A comprehensive demonstration of TanStack Charts 0.7.0 features with React 19, TypeScript 5, and Node.js.

## Features

### 🧱 Statistical, Spatial, Hierarchy + Network Primitives

- **Multi-Line Charts**: Compare multiple time series with interactive tooltips
- **Stacked Area Charts**: Visualize cumulative distributions
- **Bar Charts**: Category comparisons with grouped bars
- **Line Charts**: Single metric tracking over time
- **Step Line Charts**: Discrete value changes visualization

### 🖱️ Crosshairs, Brush, Zoom, Selection + Interactive Legends

- **Interactive Tooltips**: Rich tooltips with data values
- **Legend Control**: Toggle visibility for data series
- **Responsive Design**: Adapts to different screen sizes

### 📈 Live-Data Motion + Pinned Tooltips

- **Real-time Updates**: Live data streaming with configurable refresh rates
- **Smooth Transitions**: Animated data point updates

### 🧩 Multi-Chart Composition

- **Side-by-Side Charts**: Multiple charts displayed simultaneously
- **Composed Views**: Combine different chart types in one view

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start Server

```bash
npm start
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── charts/        # Chart components
│   │   ├── ui/            # UI components (Button, Card, Badge)
│   │   └── App.tsx        # Main application
│   ├── data/
│   │   ├── generators.ts  # Data generation utilities
│   │   └── charts.ts      # Chart configurations
│   ├── types/             # TypeScript types
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── server.js              # Node.js server
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **TanStack Charts 0.7.0** - Charting library
- **Vite** - Build tool and dev server
- **Node.js** - Server runtime
