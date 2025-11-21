import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Download, PictureAsPdf, TableChart } from "@mui/icons-material";
import { useState } from "react";
import type { Listing, SubjectProperty } from "../types/listing";
import { exportToCSV, exportToPDF } from "../utils/export";
import {
  medianPrice,
  medianPricePerSqft,
  averageDistance,
} from "../utils/stats";

interface ExportButtonProps {
  listings: Listing[];
  subjectProperty: SubjectProperty;
}

export default function ExportButton({
  listings,
  subjectProperty,
}: ExportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCSVExport = () => {
    exportToCSV(listings, "comps.csv");
    handleClose();
  };

  const handlePDFExport = () => {
    const stats = {
      count: listings.length,
      medianPrice: medianPrice(listings),
      medianPricePerSqft: medianPricePerSqft(listings),
      averageDistance: averageDistance(listings),
    };
    exportToPDF(listings, subjectProperty, stats, "comps-report.pdf");
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={handleClick}
      >
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleCSVExport}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePDFExport}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

