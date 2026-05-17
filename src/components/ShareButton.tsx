import { Button } from "@mui/material";
import { Share as ShareIcon } from "@mui/icons-material";
import {
  buildShareUrlWithHash,
  buildShareSnapshot,
  type WorkspacePersistedFields,
} from "../utils/workspacePersistence";

interface ShareButtonProps {
  getWorkspace: () => WorkspacePersistedFields;
  listingsSource: "synthetic" | "imported";
  onNotify: (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => void;
}

export default function ShareButton({
  getWorkspace,
  listingsSource,
  onNotify,
}: ShareButtonProps) {
  const handleClick = async () => {
    const fields = getWorkspace();
    const snap = buildShareSnapshot(fields);
    const url = buildShareUrlWithHash(snap);
    try {
      await navigator.clipboard.writeText(url);
      if (listingsSource === "imported") {
        onNotify(
          "Link copied. Shared setup uses synthetic comps; re-import your file on another device if needed.",
          "info"
        );
      } else {
        onNotify("Link copied to clipboard.", "success");
      }
    } catch {
      onNotify("Could not copy link. Check clipboard permissions.", "error");
    }
  };

  return (
    <Button variant="contained" startIcon={<ShareIcon />} onClick={handleClick}>
      Share
    </Button>
  );
}
