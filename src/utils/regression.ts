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

