# 🧠 Project Prompt: Local Price Regression Demo

This `prompt.md` is designed for **Cursor**, **Bolt.new**, or any AI-powered coding workspace** to auto-generate a complete working project**.  
It contains full requirements, architecture, components, data generation, and instructions so the AI can scaffold everything with minimal effort.

---

# 📈 Local Price Regression Demo – Full Project Prompt

## 🎯 Goal

Create a **single-page React + Vite + TypeScript** demo app using **MUI** and **Recharts** that:

- Loads a **static synthetic dataset** of property listings.
- Allows basic **filtering** (price, sqft, beds).
- Displays:
  - A **summary bar** (count, median price, median price/sqft)
  - A **scatter plot (sqft vs price)** with a **regression line**
  - A **sortable data table**

This is a quick prototype—something that can be hacked together in **one night**, but feels like a legit real-estate data analysis tool.

---

# 📦 Tech Stack Requirements

- **React + Vite + TypeScript**
- **MUI v6** for layout, cards, controls, table
- **Recharts** for charts  
  _(Use MUI Charts only if absolutely necessary.)_
- **No backend** — All data is static and generated client-side
- **State management**: Local component state only

---

# 🧱 Project Structure to Generate

```
src/
  components/
    ControlsPanel.tsx
    SubjectSummary.tsx
    SummaryBar.tsx
    ChartCard.tsx
    ListingsTable.tsx
  data/
    listings.ts
  utils/
    regression.ts
    stats.ts
  App.tsx
  main.tsx
```

---

# 📊 Features to Implement

## 1. Static Dataset (150 listings)

- Properties:
  - id
  - price
  - sqft
  - beds
  - baths
  - yearBuilt
  - lat, lng
  - distanceFromSubject (generated)
- Data should look **realistic and somewhat correlated** so regression looks good.

---

## 2. Filters

Create a **ControlsPanel** with:

- **Price range** (min/max numeric inputs)
- **Sqft range** (min/max numeric inputs)
- **Min beds** (select or slider)
- **Reset filters** button

Filters must instantly update:

- SummaryBar
- ChartCard
- ListingsTable

---

## 3. Summary Bar

A top-level bar showing:

- Number of active listings
- Median price
- Median price per sqft

Use small MUI Paper or Cards for these KPIs.

---

## 4. Scatter Plot + Regression Line (ChartCard)

Using **Recharts**:

**Scatter plot:**

- X-axis: sqft
- Y-axis: price
- Tooltips for each point
- Nice colors & clean grid

**Regression line:**

- Use JS helper `computeLinearRegression` (provided below)
- Render as a `<Line />` on the same chart

---

## 5. Data Table (ListingsTable)

- Columns:
  - Price
  - Sqft
  - Price/sqft
  - Beds
  - Baths
  - Year built
  - Distance from subject
- Sorting behavior:
  - Click header → toggle asc/desc

Use **MUI Table**.

---

# 🔢 Utility Code to Include

## regression.ts (copy verbatim)

```ts
export function computeLinearRegression(
  data: { sqft: number; price: number }[]
) {
  const n = data.length;
  if (n < 2) return null;

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  data.forEach((p) => {
    const x = p.sqft;
    const y = p.price;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const xs = data.map((d) => d.sqft);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  return [
    { sqft: minX, price: intercept + slope * minX },
    { sqft: maxX, price: intercept + slope * maxX },
  ];
}
```

---

## stats.ts

Implement:

- `median`
- `medianPrice`
- `medianPricePerSqft`

---

## listings.ts (fake dataset generator)

```ts
const SUBJECT_LAT = 48.75;
const SUBJECT_LNG = -122.48;
const SUBJECT_SQFT = 1800;

export function generateListing(i: number) {
  const sqft = SUBJECT_SQFT + (Math.random() - 0.5) * 1200;
  const pricePerSqft = 350 + (Math.random() - 0.5) * 40;
  const price = Math.round(sqft * pricePerSqft);

  const beds = Math.floor(2 + Math.random() * 4);
  const baths = Math.round((1 + Math.random() * 2.5) * 2) / 2;
  const yearBuilt = 1965 + Math.floor(Math.random() * 55);

  const lat = SUBJECT_LAT + (Math.random() - 0.5) * 0.02;
  const lng = SUBJECT_LNG + (Math.random() - 0.5) * 0.02;

  const distanceFromSubject =
    Math.sqrt((lat - SUBJECT_LAT) ** 2 + (lng - SUBJECT_LNG) ** 2) * 111;

  return {
    id: i.toString(),
    price,
    sqft: Math.round(sqft),
    beds,
    baths,
    yearBuilt,
    lat,
    lng,
    distanceFromSubject,
  };
}

export const listings = Array.from({ length: 150 }, (_, i) =>
  generateListing(i)
);
```

---

# 🎨 UI Details

## Theme & Layout

- Use **MUI Container**, **Grid**, **Paper**, and **Card**
- Clean spacing: `sx={{ p: 2, mb: 2 }}`
- Responsive layout:
  - ControlsPanel in left column (md=3)
  - Content in right column (md=9)

---

# 🧩 Component Responsibilities

## ControlsPanel

- Numeric inputs for price+sqft
- Select or slider for beds
- Reset button
- State lifting into App

---

## SubjectSummary

Show:

```
Subject Property
3 bed · 2 bath · 1,850 sqft · Built 1998
Within 1 mile · 150 comps
```

---

## SummaryBar

Three KPIs using MUI Cards:

- Count
- Median Price
- Median Price/Sqft

---

## ChartCard

- Recharts ScatterChart + CartesianGrid
- Compute regression line and overlay as Line
- Tooltip displaying price, sqft, beds, baths

---

## ListingsTable

- MUI Table
- Sort by clicking headers
- Format prices nicely

---

# 🧭 App Behavior

- App loads `listings`
- Filters derive `filteredListings`
- SummaryBar, ChartCard, ListingsTable observe filteredListings
- Simple, clean, no routing

---

# ▶️ Run Instructions (have Cursor generate this)

- Install dependencies
- Run Vite dev server
- No backend required

---

# 🧪 Stretch Goals (Optional but easy)

- Add histogram of price/sqft
- Add save presets (localStorage)
- Add a second regression (distance vs price/sqft)

---

# ✔️ Done

This prompt is designed to fully bootstrap the entire project inside Cursor.  
It contains everything needed for the AI to generate the **full codebase**.

Use this file as `prompt.md` in your project root.
