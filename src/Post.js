import React, { useEffect, useState, useContext, useCallback } from "react";
import { navigate } from "@reach/router";
import ReactMarkdown from "react-markdown";
import { Typography, Container, Paper } from "@material-ui/core";
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
import { useDropzone } from "react-dropzone";
import Modal from "@material-ui/core/Modal";
import Largeinput from "./components/Largeinput";

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

const UPDATEPOSTWITHIMAGE = gql`
  mutation($id: ID!, $body: String!, $Title: String!, $image: ID!) {
    updateFivegcovidpost(
      input: {
        where: { id: $id }
        data: { Body: $body, Title: $Title, image: $image }
      }
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

const CREATE = gql`
  mutation($body: String!, $Title: String!, $image: ID!, $slug: String!) {
    createFivegcovidpost(
      input: {
        data: { slug: $slug, Title: $Title, image: $image, Body: $body }
      }
    ) {
      fivegcovidpost {
        id
      }
    }
  }
`;

const UPLOADIMAGE = gql`
  mutation($file: Upload!) {
    upload(file: $file) {
      name
      id
    }
  }
`;

const DELETEPOST = gql`
  mutation($id: ID!) {
    deleteFivegcovidpost(input: { where: { id: $id } }) {
      fivegcovidpost {
        id
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

const Post = ({ slug }) => {
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
  const [selectedTab, setSelectedTab] = useState("write");
  const [updatePost] = useMutation(UPDATEPOST);
  const [createPost] = useMutation(CREATE);
  const [deletePost] = useMutation(DELETEPOST);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uploadImage] = useMutation(UPLOADIMAGE);
  const [updatePostWithImage] = useMutation(UPDATEPOSTWITHIMAGE);
  const [image, setImage] = useState();
  const [newImage, setNewImage] = useState();
  const [newpost, setNewPost] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setNewImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const update = useCallback(async () => {
    if (newpost) {
      const uploadedimg = await uploadImage({
        variables: {
          file: newImage,
        },
      });

      const ID = uploadedimg.data.upload.id;

      createPost({
        variables: {
          body: markdown,
          Title: title,
          image: ID,
          slug: slug.toUpperCase(),
        },
      });
      setNewPost(false);
    } else if (newImage) {
      const uploadedimg = await uploadImage({
        variables: {
          file: newImage,
        },
      });

      const ID = uploadedimg.data.upload.id;
      updatePostWithImage({
        variables: {
          body: markdown,
          id: post.id,
          Title: title,
          image: ID,
        },
      });
    } else {
      updatePost({
        variables: {
          body: markdown,
          id: post.id,
          Title: title,
          slug,
        },
      });
    }
    setEdit(false);
  });

  const post = data
    ? data.fivegcovidposts[0]
      ? data.fivegcovidposts[0]
      : { Body: "", Title: "", image: "", slug }
    : { Body: "", Title: "", image: "", slug };

  useEffect(() => {
    if (data) {
      setMarkdown(post.Body);
      setTitle(post.Title);
      setImage(`https://cms2.caseytimm.com${post.image.url}`);
      if (data.fivegcovidposts.length == 0) setNewPost(true);
      else setNewPost(false);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Container flex>
        <Typography ref={ref} variant="h1" paragraph>
          {edit ? (
            <Largeinput
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
              <FormGroup row>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!edit}
                  onClick={update}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!edit}
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>

                <Modal
                  open={deleteOpen}
                  onClose={() => setDeleteOpen(false)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <Paper>
                    <p>Are you sure?</p>
                    <Button
                      onClick={async () => {
                        await deletePost({ variables: { id: post.id } });
                        navigate("/");
                      }}
                    >
                      DELETE
                    </Button>
                  </Paper>
                </Modal>
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
        {edit ? (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <img width={width} src={image} />
          </div>
        ) : (
          <img width={width} src={image} />
        )}
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
