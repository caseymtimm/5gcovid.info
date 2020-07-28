import React from "react";
import "./App.css";
import Posts from "./posts";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "@apollo/react-hooks";
import AuthProvider from "./authContext";
import Banner from "./Banner";
import Footer from "./Footer";
import { Grid } from "@material-ui/core";
import { Router, Link, Location } from "@reach/router";
import Post from "./Post";
import { setContext } from "@apollo/client/link/context";
import Toast from "./Toast.js";

const httpLink = createUploadLink({
  uri: "https://cms2.caseytimm.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem("authBody"));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization:
        token && token.data && token.data.jwt ? `Bearer ${token.data.jwt}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  //uri: "https://cms2.caseytimm.com/graphql",
  link: authLink.concat(httpLink),
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
    <>
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
      <Toast />
    </>
  );
}

export default Wrapper;
