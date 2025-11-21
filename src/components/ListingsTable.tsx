import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import type { Listing } from "../types/listing";

type SortField = keyof Listing | "pricePerSqft";
type SortDirection = "asc" | "desc";

interface ListingsTableProps {
  listings: Listing[];
}

export default function ListingsTable({ listings }: ListingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("distanceFromSubject");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedListings = [...listings].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    if (sortField === "pricePerSqft") {
      aValue = a.price / a.sqft;
      bValue = b.price / b.sqft;
    } else {
      aValue = a[sortField] as number;
      bValue = b[sortField] as number;
    }

    if (sortDirection === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const SortableHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <TableCell>
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortDirection : "asc"}
        onClick={() => handleSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comparable Properties
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <SortableHeader field="price" label="Price" />
              <SortableHeader field="sqft" label="Sqft" />
              <SortableHeader field="pricePerSqft" label="Price/Sqft" />
              <SortableHeader field="beds" label="Beds" />
              <SortableHeader field="baths" label="Baths" />
              <SortableHeader field="yearBuilt" label="Year Built" />
              <SortableHeader
                field="distanceFromSubject"
                label="Distance (mi)"
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedListings.map((listing) => (
              <TableRow key={listing.id} hover>
                <TableCell>${listing.price.toLocaleString()}</TableCell>
                <TableCell>{listing.sqft.toLocaleString()}</TableCell>
                <TableCell>
                  ${(listing.price / listing.sqft).toFixed(2)}
                </TableCell>
                <TableCell>{listing.beds}</TableCell>
                <TableCell>{listing.baths}</TableCell>
                <TableCell>{listing.yearBuilt}</TableCell>
                <TableCell>{listing.distanceFromSubject.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

