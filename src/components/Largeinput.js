import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      fontSize: theme.typography.h1.fontSize,
    },
  })
);

export default (props) => {
  const classes = useStyles();

  const InputProps = {
    classes: {
      root: classes.input,
    },
  };

  return <TextField {...props} InputProps={InputProps} />;
};
