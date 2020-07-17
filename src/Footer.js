import React, { useState, useContext } from "react";
import { Grid, Button } from "@material-ui/core";
import Login from "./Login";
import { AuthContext } from "./authContext";

export default () => {
  const [loginopen, setloginopen] = useState(false);
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Login open={loginopen} setOpen={setloginopen} />
      <Grid
        container
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={4}>
          © Casey Timm 2020
        </Grid>
        <Grid item xs={4}>
          This site is purely satire
        </Grid>
        <Grid item xs={4}>
          {authenticated ? (
            <Button onClick={() => setAuthenticated(false)}>Logout</Button>
          ) : (
            <Button onClick={() => setloginopen(!loginopen)}>Login</Button>
          )}
        </Grid>
      </Grid>
    </>
  );
};
