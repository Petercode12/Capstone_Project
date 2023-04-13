import * as React from "react";
import { Box, Button, Typography, CardContent, Card } from "@mui/material";
import { Title } from "react-admin";
import { useNavigate } from "react-router-dom";
import "../Style/NotFound.css";

export function NotFound() {
  let navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        marginTop: "-3em",
      }}
    >
      <svg
        class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium RaNotFound-icon css-hung-MuiSvgIcon-root"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="HotTubIcon"
      >
        <circle cx="7" cy="6" r="2" />
        <path d="M11.15 12c-.31-.22-.59-.46-.82-.72l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C6.01 9 5 10.01 5 11.25V12H2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8H11.15zM7 20H5v-6h2v6zm4 0H9v-6h2v6zm4 0h-2v-6h2v6zm4 0h-2v-6h2v6zm-.35-14.14-.07-.07c-.57-.62-.82-1.41-.67-2.2L18 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71zm-4 0-.07-.07c-.57-.62-.82-1.41-.67-2.2L14 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71z" />
      </svg>
      <h1 className="not-found-font">Not Found</h1>
      <div className="not-found-subfont">
        Either you typed a wrong URL, or you followed a bad link.
      </div>

      <div className="RaNotFound-toolbar">
        <Button variant="contained" onClick={() => navigate(-1)}>
          <span class="MuiButton-startIcon MuiButton-iconSizeMedium css-1d6wzja-MuiButton-startIcon">
            <svg
              class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="HistoryIcon"
            >
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
          </span>
          Go Back
          <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root" />
        </Button>
      </div>
    </Box>
  );
}
