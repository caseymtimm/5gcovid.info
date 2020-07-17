import React from "react";
import "./App.css";
import Posts from "./posts";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import AuthProvider from "./authContext";
import Banner from "./Banner";
import Footer from "./Footer";
import { Grid } from "@material-ui/core";
import { Router, Link, Location } from "@reach/router";
import Post from "./Post";

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
      <Grid item md={6}>
        <Banner />
        <Router>
          <Posts path="/" />
          <Post path="/post/:slug" />
        </Router>
        <Footer />
      </Grid>
      <Grid item md={3} />
    </Grid>
  );
}

export default Wrapper;
