import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { UploadFile, TableChart, DataObject } from "@mui/icons-material";
import { useRef, useState } from "react";
import type { ImportParseResult } from "../utils/importListings";
import { parseListingsCsv, parseListingsJson } from "../utils/importListings";

interface ImportButtonProps {
  onImportComplete: (result: ImportParseResult, filename: string) => void;
}

export default function ImportButton({ onImportComplete }: ImportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const readFile = (
    file: File,
    parse: (text: string) => ImportParseResult
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const result = parse(text);
      onImportComplete(result, file.name);
    };
    reader.onerror = () => {
      onImportComplete(
        {
          listings: [],
          warnings: [],
          errors: ["Could not read file"],
        },
        file.name
      );
    };
    reader.readAsText(file);
  };

  const handleCsvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    handleClose();
    if (!file) return;
    readFile(file, parseListingsCsv);
  };

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    handleClose();
    if (!file) return;
    readFile(file, parseListingsJson);
  };

  return (
    <>
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={handleCsvInputChange}
      />
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={handleJsonInputChange}
      />
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<UploadFile />}
        onClick={handleClick}
        sx={{ borderColor: "rgba(255,255,255,0.5)", color: "common.white" }}
      >
        Import
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            csvInputRef.current?.click();
          }}
        >
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import CSV</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            jsonInputRef.current?.click();
          }}
        >
          <ListItemIcon>
            <DataObject fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import JSON</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
