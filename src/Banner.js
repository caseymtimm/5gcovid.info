import React from "react";
import { Grid, Typography } from "@material-ui/core";
import useDimensions from "react-use-dimensions";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "@reach/router";
import ButtonBase from "@material-ui/core/ButtonBase";

const HEADER = gql`
  {
    fivegcoivdheader {
      title
      leftimage {
        url
      }
      rightimage {
        url
      }
    }
  }
`;

export default () => {
  const [ref, { height }] = useDimensions();
  const { loading, error, data } = useQuery(HEADER);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Grid container>
      <Grid item xs={2}>
        <img
          src={`https://cms2.caseytimm.com${data.fivegcoivdheader.leftimage.url}`}
          height={height}
          alt="leftbanner"
        />
      </Grid>
      <Grid item xs={8}>
        <ButtonBase component={Link} to={`/`}>
          <Typography variant="h1" component="h2" gutterBottom ref={ref}>
            {data.fivegcoivdheader.title}
          </Typography>
        </ButtonBase>
      </Grid>
      <Grid item xs={2}>
        <img
          src={`https://cms2.caseytimm.com${data.fivegcoivdheader.rightimage.url}`}
          height={height}
          alt="rightbanner"
        />
      </Grid>
    </Grid>
  );
};
