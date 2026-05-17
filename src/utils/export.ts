import type { Listing } from "../types/listing";
import jsPDF from "jspdf";
import {
  EXPORT_CSV_FILENAME,
  EXPORT_PDF_FILENAME,
  PDF_PRIMARY_HEADING,
  PDF_SECONDARY_HEADING,
  PRODUCT_TAGLINE,
} from "../brand";

export function exportToCSV(
  listings: Listing[],
  filename: string = EXPORT_CSV_FILENAME
): void {
  const headers = [
    "Price",
    "Sqft",
    "Price/Sqft",
    "Beds",
    "Baths",
    "Year Built",
    "Distance (miles)",
    "Id",
    "Lat",
    "Lng",
    "Listing Year",
  ];

  const rows = listings.map((listing) => [
    listing.price.toString(),
    listing.sqft.toString(),
    (listing.price / listing.sqft).toFixed(2),
    listing.beds.toString(),
    listing.baths.toString(),
    listing.yearBuilt.toString(),
    listing.distanceFromSubject.toFixed(2),
    listing.id,
    listing.lat.toString(),
    listing.lng.toString(),
    listing.listingDate.toString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(
  listings: Listing[],
  subjectProperty: {
    address: string;
    sqft: number;
    beds: number;
    baths: number;
    yearBuilt: number;
  },
  stats: {
    count: number;
    medianPrice: number;
    medianPricePerSqft: number;
    averageDistance: number;
  },
  filename: string = EXPORT_PDF_FILENAME
): void {
  const doc = new jsPDF();
  const margin = 10;
  let yPos = margin;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(PDF_PRIMARY_HEADING, margin, yPos);
  yPos += 7;
  doc.setFontSize(12);
  doc.text(PDF_SECONDARY_HEADING, margin, yPos);
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const taglineLines = doc.splitTextToSize(PRODUCT_TAGLINE, 190);
  doc.text(taglineLines, margin, yPos);
  yPos += 4 + taglineLines.length * 4;

  // Subject Property
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Subject Property", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${subjectProperty.address}`,
    margin,
    yPos
  );
  yPos += 5;
  doc.text(
    `${subjectProperty.beds} bed · ${subjectProperty.baths} bath · ${subjectProperty.sqft.toLocaleString()} sqft · Built ${subjectProperty.yearBuilt}`,
    margin,
    yPos
  );
  yPos += 10;

  // Summary Statistics
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Summary Statistics", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Active Comps: ${stats.count}`, margin, yPos);
  yPos += 5;
  doc.text(
    `Median Price: $${stats.medianPrice.toLocaleString()}`,
    margin,
    yPos
  );
  yPos += 5;
  doc.text(
    `Median Price/Sqft: $${stats.medianPricePerSqft.toFixed(2)}`,
    margin,
    yPos
  );
  yPos += 5;
  doc.text(
    `Average Distance: ${stats.averageDistance.toFixed(2)} miles`,
    margin,
    yPos
  );
  yPos += 10;

  // Table Header
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Comparable Properties", margin, yPos);
  yPos += 7;

  // Table
  const tableHeaders = ["Price", "Sqft", "$/Sqft", "Beds", "Baths", "Year", "Dist"];
  const colWidths = [30, 25, 25, 15, 15, 20, 20];
  let xPos = margin;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  tableHeaders.forEach((header, i) => {
    doc.text(header, xPos, yPos);
    xPos += colWidths[i];
  });
  yPos += 5;

  doc.setFont("helvetica", "normal");
  listings.slice(0, 20).forEach((listing) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = margin;
    }
    xPos = margin;
    const row = [
      `$${(listing.price / 1000).toFixed(0)}k`,
      listing.sqft.toString(),
      `$${(listing.price / listing.sqft).toFixed(0)}`,
      listing.beds.toString(),
      listing.baths.toString(),
      listing.yearBuilt.toString(),
      listing.distanceFromSubject.toFixed(1),
    ];
    row.forEach((cell, i) => {
      doc.text(cell, xPos, yPos);
      xPos += colWidths[i];
    });
    yPos += 5;
  });

  doc.save(filename);
}

