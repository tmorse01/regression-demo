# Construction Lender Regression Analysis

A modern, interactive web application for analyzing real estate property data with advanced regression analysis, data visualization, and comprehensive filtering capabilities. Built for construction lenders and real estate professionals to perform comparable sales analysis.

**🌐 Live Demo:** [https://regression-demo.netlify.app/](https://regression-demo.netlify.app/)

## ✨ Features

### 📊 Data Visualization

- **Interactive Scatter Plots** - Visualize price vs. square footage relationships with regression lines
- **Bar Charts** - Analyze price distribution by bedroom count
- **Timeline Scrubber** - Filter properties by year built/listing date with interactive range selection
- **Google Maps Integration** - Geographic visualization of subject property and comparables
- **Multiple View Modes** - Switch between overview, charts-only, and table-only views

### 🔍 Advanced Filtering

- **Multi-criteria Filters** - Price range, square footage, bedrooms, bathrooms, year built, and distance
- **Filter Presets** - Quick access to common filter combinations
- **Debounced Input** - Smooth, performant filtering with optimistic UI updates
- **Real-time Updates** - Instant visual feedback as filters change

### 📈 Statistical Analysis

- **Linear Regression** - Automated regression line calculation for price/sqft relationships
- **KPI Dashboard** - Median price, median price per sqft, average distance, and comp count
- **Insight Callouts** - Automated insights highlighting key data patterns
- **Subject Property Analysis** - Compare subject property against comparable sales

### 💾 Data Export

- **CSV Export** - Download filtered data as CSV files
- **PDF Reports** - Generate professional PDF reports with summary statistics and property listings

### 🎨 User Experience

- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Loading States** - Smooth transitions and loading indicators
- **Empty States** - Helpful messaging when no results match filters
- **Hover Interactions** - Highlight related data points across visualizations

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **UI Library:** Material-UI (MUI) v7
- **Charts:** Recharts
- **Maps:** Google Maps JavaScript API with Places API
- **PDF Generation:** jsPDF
- **State Management:** React Hooks (useState, useMemo, useTransition, useDeferredValue)
- **Styling:** Emotion (CSS-in-JS) with MUI's sx prop

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Google Maps API Key (for map visualization and address autocomplete)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd regression-demo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here  # Optional, defaults to Maps API key
   ```

   > **Note:** The app will still function without API keys, but map visualization and address autocomplete will be disabled.

4. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📜 Available Scripts

- `pnpm dev` - Start development server with hot module replacement
- `pnpm build` - Build production bundle (TypeScript compilation + Vite build)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint to check code quality

## 📁 Project Structure

```
regression-demo/
├── src/
│   ├── components/          # React components
│   │   ├── ChartCard.tsx    # Reusable chart container
│   │   ├── ChartsGrid.tsx   # Main charts visualization
│   │   ├── ControlsPanel.tsx # Filter controls
│   │   ├── ExportButton.tsx  # CSV/PDF export functionality
│   │   ├── FilterPresets.tsx # Quick filter presets
│   │   ├── InsightCallout.tsx # Data insights display
│   │   ├── KPITiles.tsx     # Key performance indicators
│   │   ├── ListingsTable.tsx # Sortable data table
│   │   ├── MapVisualization.tsx # Google Maps integration
│   │   ├── SubjectPropertyForm.tsx # Subject property input
│   │   ├── SubjectSummary.tsx # Subject property summary
│   │   ├── TimelineScrubber.tsx # Year range filter
│   │   └── ...              # Additional UI components
│   ├── data/
│   │   └── listings.ts      # Synthetic data generation
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebouncedFilters.ts
│   │   ├── useDebouncedInput.ts
│   │   └── useDebouncedValue.ts
│   ├── types/
│   │   └── listing.ts        # TypeScript type definitions
│   ├── utils/
│   │   ├── chartPalette.ts  # Chart color utilities
│   │   ├── export.ts        # CSV/PDF export functions
│   │   ├── geocoding.ts     # Geocoding utilities
│   │   ├── placesApi.ts     # Google Places API integration
│   │   ├── regression.ts    # Linear regression calculations
│   │   └── stats.ts         # Statistical functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── docs/
│   └── THEME.md             # Design system documentation
├── public/                  # Static assets
└── dist/                    # Production build output
```

## 🎨 Design System

The application uses a modern slate/blue color scheme with a clean, professional aesthetic. For complete design system documentation including color palette, typography, spacing, and component guidelines, see:

**[📖 Theme Documentation](./docs/THEME.md)**

Key design features:

- **Color Palette:** Slate blue-gray tones with blue accents
- **Typography:** Poppins font family with comprehensive variant system
- **Components:** Glassmorphic cards with subtle shadows and borders
- **Dark Mode:** Full support for light and dark themes
- **Accessibility:** WCAG AA compliant color contrast and focus states

## 🔧 Key Features Explained

### Regression Analysis

The application automatically calculates linear regression lines for price vs. square footage relationships, helping identify market trends and price per square foot patterns.

### Synthetic Data Generation

The app generates realistic synthetic property data based on the subject property characteristics, creating 150 comparable listings with correlated attributes (price, sqft, beds, baths, year built, location).

### Performance Optimizations

- **Debounced Filters** - Reduces computation during rapid filter changes
- **Deferred Values** - Uses React's `useDeferredValue` for smooth UI during heavy computations
- **Transitions** - Uses `useTransition` for non-blocking chart updates
- **Memoization** - Strategic use of `useMemo` for expensive calculations

### Google Maps Integration

- Interactive map showing subject property and all comparables
- Custom markers with color coding by bedroom count
- Distance calculations from subject property
- Address autocomplete for subject property input

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Development Notes

### React Compiler

This project uses the React Compiler (experimental) for automatic optimization. See the [React Compiler documentation](https://react.dev/learn/react-compiler) for more information.

### TypeScript Configuration

- Strict type checking enabled
- Separate configs for app and build tools (`tsconfig.app.json`, `tsconfig.node.json`)

### ESLint Configuration

The project uses ESLint with TypeScript support. To enable stricter type-aware rules, see the configuration examples in the original README template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using React, TypeScript, and Material-UI**
