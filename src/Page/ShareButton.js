import { useGetRecordId } from "react-admin";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

export function ShareButton() {
  const recordId = useGetRecordId();
  return (
    <Button
      startIcon={<ShareIcon />}
      size="small"
      href={"/app/all_exams/share/".concat(recordId)}
    >
      Share
    </Button>
  );
}
