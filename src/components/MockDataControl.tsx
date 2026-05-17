import {
  Box,
  Button,
  Collapse,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Science } from "@mui/icons-material";
import { useState } from "react";
import type { GenerateListingsOptions } from "../data/listings";

export interface MockFormValues {
  count: number;
  options: GenerateListingsOptions;
}

interface MockDataControlProps {
  initialCount: number;
  initialOptions: GenerateListingsOptions;
  onApply: (values: MockFormValues) => void;
}

const defaults: GenerateListingsOptions = {
  sqftSpread: 1200,
  geoSpread: 0.08,
  pricePerSqftBase: 350,
  pricePerSqftVariance: 40,
  seed: null,
};

export default function MockDataControl({
  initialCount,
  initialOptions,
  onApply,
}: MockDataControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [count, setCount] = useState(String(initialCount));
  const [seedInput, setSeedInput] = useState(
    initialOptions.seed != null ? String(initialOptions.seed) : ""
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sqftSpread, setSqftSpread] = useState(
    String(initialOptions.sqftSpread ?? defaults.sqftSpread)
  );
  const [geoSpread, setGeoSpread] = useState(
    String(initialOptions.geoSpread ?? defaults.geoSpread)
  );
  const [priceBase, setPriceBase] = useState(
    String(initialOptions.pricePerSqftBase ?? defaults.pricePerSqftBase)
  );
  const [priceVar, setPriceVar] = useState(
    String(
      initialOptions.pricePerSqftVariance ?? defaults.pricePerSqftVariance
    )
  );

  const parseNum = (raw: string): number | null => {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const handleApply = () => {
    const c = parseNum(count);
    if (c === null || c < 1 || c > 2000) {
      return;
    }
    const seedTrim = seedInput.trim();
    const seedParsed = seedTrim === "" ? null : parseNum(seedTrim);
    if (seedTrim !== "" && seedParsed === null) {
      return;
    }
    const opts: GenerateListingsOptions = {
      sqftSpread: parseNum(sqftSpread) ?? defaults.sqftSpread,
      geoSpread: parseNum(geoSpread) ?? defaults.geoSpread,
      pricePerSqftBase: parseNum(priceBase) ?? defaults.pricePerSqftBase,
      pricePerSqftVariance: parseNum(priceVar) ?? defaults.pricePerSqftVariance,
      seed: seedParsed,
    };
    onApply({ count: Math.floor(c), options: opts });
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<Science />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ borderColor: "rgba(255,255,255,0.5)", color: "common.white" }}
      >
        Mock data
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { mt: 1, p: 2, minWidth: 280, maxWidth: 360 },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Regenerate synthetic comps
        </Typography>
        <TextField
          label="Count"
          type="number"
          size="small"
          fullWidth
          value={count}
          onChange={(e) => setCount(e.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 2000 } }}
          sx={{ mb: 1.5 }}
        />
        <TextField
          label="Seed (optional)"
          size="small"
          fullWidth
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value)}
          placeholder="Random if empty"
          helperText="Same seed + settings = reproducible set"
          sx={{ mb: 1 }}
        />
        <Button
          size="small"
          onClick={() => setShowAdvanced((v) => !v)}
          sx={{ mb: 1, textTransform: "none" }}
        >
          {showAdvanced ? "Hide" : "Show"} advanced
        </Button>
        <Collapse in={showAdvanced}>
          <TextField
            label="Sqft spread"
            type="number"
            size="small"
            fullWidth
            value={sqftSpread}
            onChange={(e) => setSqftSpread(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Geo spread (deg)"
            type="number"
            size="small"
            fullWidth
            value={geoSpread}
            onChange={(e) => setGeoSpread(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Price/sqft base"
            type="number"
            size="small"
            fullWidth
            value={priceBase}
            onChange={(e) => setPriceBase(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Price/sqft variance"
            type="number"
            size="small"
            fullWidth
            value={priceVar}
            onChange={(e) => setPriceVar(e.target.value)}
            sx={{ mb: 1 }}
          />
        </Collapse>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
          <Button size="small" onClick={() => setAnchorEl(null)}>
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}
