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
  TablePagination,
  Typography,
  Box,
} from "@mui/material";
import type { Listing } from "../types/listing";

type SortField = keyof Listing | "pricePerSqft";
type SortDirection = "asc" | "desc";

interface ListingsTableProps {
  listings: Listing[];
  highlightedListingId?: string | null;
  onListingHover?: (listingId: string | null) => void;
}

interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const SortableHeader = ({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
}: SortableHeaderProps) => (
  <TableCell>
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortDirection : "asc"}
      onClick={() => onSort(field)}
    >
      {label}
    </TableSortLabel>
  </TableCell>
);

export default function ListingsTable({
  listings,
  highlightedListingId,
  onListingHover,
}: ListingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("distanceFromSubject");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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

  const paginatedListings = sortedListings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Comparable Properties</Typography>
        <Typography variant="body2" color="textSecondary">
          {listings.length} total properties
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <SortableHeader
                field="price"
                label="Price"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="sqft"
                label="Sqft"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="pricePerSqft"
                label="Price/Sqft"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="beds"
                label="Beds"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="baths"
                label="Baths"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="yearBuilt"
                label="Year Built"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="distanceFromSubject"
                label="Distance (mi)"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedListings.map((listing) => (
              <TableRow
                key={listing.id}
                hover
                onMouseEnter={() => {
                  if (onListingHover) {
                    onListingHover(listing.id);
                  }
                }}
                onMouseLeave={() => {
                  if (onListingHover) {
                    onListingHover(null);
                  }
                }}
                sx={{
                  backgroundColor:
                    highlightedListingId === listing.id
                      ? "action.selected"
                      : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
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
      <TablePagination
        component="div"
        count={sortedListings.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
}
