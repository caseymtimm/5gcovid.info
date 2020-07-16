import React from "react";
import "./App.css";
import Posts from "./posts";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import AuthProvider from "./authContext";
import Banner from "./Banner";
import Footer from "./Footer";
import { Grid } from "@material-ui/core";

const client = new ApolloClient({
  uri: "https://cms2.caseytimm.com/graphql",
  request: (operation) => {
    const token = JSON.parse(localStorage.getItem("authBody"));
    operation.setContext({
      headers: {
        authorization:
          token && token.data && token.data.jwt
            ? `Bearer ${token.data.jwt}`
            : "",
      },
    });
  },
});

const Wrapper = (props) => (
  <AuthProvider>
    <ApolloProvider client={client}>
      <App props={props} />
    </ApolloProvider>
  </AuthProvider>
);

function App() {
  return (
    <Grid container>
      <Grid item md={3} />
      <Grid md={6}>
        <Banner />
        <Posts />
        <Footer />
      </Grid>
      <Grid item md={3} />
    </Grid>
  );
}

export default Wrapper;
