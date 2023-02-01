import React from "react";
import { ShowBase, SimpleShowLayout } from "react-admin";
import { Grid } from "@mui/material";

export function PracticePage() {
  return (
    <ShowBase resource="practice">
      <Grid container>
        <Grid item xs={8}>
          Show another
        </Grid>
        <Grid item xs={4}>
          Show instructions...
        </Grid>
      </Grid>
      <div>Post related links...</div>
    </ShowBase>
  );
}
