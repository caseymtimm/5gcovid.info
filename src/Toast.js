import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";

export default () => (
  <Snackbar
    open={true}
    autoHideDuration={6000}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert severity="error">
      <AlertTitle>Warning</AlertTitle>
      Your Virus has Computer!
    </Alert>
  </Snackbar>
);
