import React, { useEffect, useState, useContext } from "react";
import { Link } from "@reach/router";
import ReactMarkdown from "react-markdown";
import { Typography, Container } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import MediaBox from "./mediabox";
import Moment from "react-moment";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { AuthContext } from "./authContext";
import { CopyBlock, dracula } from "react-code-blocks";
import useDimensions from "react-use-dimensions";
import TextField from "@material-ui/core/TextField";

const POST = gql`
  query fivegcovidpost($slug: String!) {
    fivegcovidposts(where: { slug: $slug }) {
      slug
      Title
      id
      image {
        url
      }
      Body
    }
  }
`;

const UPDATEPOST = gql`
  mutation($id: ID!, $body: String!, $Title: String!) {
    updateFivegcovidpost(
      input: { where: { id: $id }, data: { Body: $body, Title: $Title } }
    ) {
      fivegcovidpost {
        slug
        Title
        id
        image {
          url
        }
        Body
      }
    }
  }
`;

const MarkdownViewer = ({ content }) => (
  <ReactMarkdown
    source={content}
    escapeHtml={false}
    renderers={{
      image: MediaBox,
      heading: ({ level, children }) => {
        switch (level) {
          case 1:
            return <Typography variant="h4">{children}</Typography>;
          case 2:
            return <Typography variant="h5">{children}</Typography>;
          case 3:
            return <Typography variant="h6">{children}</Typography>;
          case 4:
          case 5:
          case 6:
          default:
            return <Typography variant="h6">{children}</Typography>;
        }
      },
      paragraph: ({ children }) => (
        <Typography variant="body1">{children}</Typography>
      ),
      code: (props) => (
        <CopyBlock
          text={props.value}
          language={props.language}
          wrapLines
          theme={dracula}
        />
      ),
    }}
  />
);

const Post = ({ slug, setImage }) => {
  const [ref, { x, y, width }] = useDimensions();
  const { authenticated } = useContext(AuthContext);
  const { loading, error, data } = useQuery(POST, {
    variables: {
      slug: slug.toUpperCase(),
    },
  });
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [edit, setEdit] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState("write");
  const [updatePost, { mutatedData }] = useMutation(UPDATEPOST);

  const post = data ? data.fivegcovidposts[0] : undefined;

  useEffect(() => {
    if (data) {
      setMarkdown(post.Body);
      setTitle(post.Title);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Container flex>
        <Typography ref={ref} variant="h1" paragraph>
          {edit ? (
            <TextField
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          ) : (
            title
          )}
        </Typography>

        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            {authenticated && (
              <FormGroup>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!edit}
                  onClick={() => {
                    updatePost({
                      variables: { body: markdown, id: post.id, Title: title },
                    });
                  }}
                >
                  Save
                </Button>
                <FormControlLabel
                  control={
                    <Switch
                      checked={edit}
                      onChange={(e) => {
                        setEdit(e.currentTarget.checked);
                      }}
                      value="Edit"
                    />
                  }
                  label="Edit"
                />
              </FormGroup>
            )}
          </Grid>
        </Grid>
        <img
          width={width}
          src={`https://cms2.caseytimm.com${post.image.url}`}
        />
        {authenticated && edit ? (
          <ReactMde
            value={markdown}
            onChange={setMarkdown}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(<MarkdownViewer content={markdown} />)
            }
          />
        ) : (
          <MarkdownViewer content={post.Body} />
        )}
        <br />
      </Container>
      {/*</Layout>*/}
    </>
  );
};

export default Post;
