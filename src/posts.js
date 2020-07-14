
import React from "react"
import { Grid } from "@material-ui/core"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import ReactMarkdown from "react-markdown"
import useDimensions from "react-use-dimensions"

const POSTS = gql`
  {
    fivegcovidposts(sort: "id:desc") {
        Title
        slug
        Body
        image {
        url
      }
    }
  }
`

const Posts = () => {
    const { loading, error, data } = useQuery(POSTS)
    const [ref, { x, y, width }] = useDimensions();
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>
    return (
        <Grid container justify="center" spacing={2}>
            <Grid item xs={9}></Grid>
            <Grid item xs={3} ref={ref}> </Grid>
            {data.fivegcovidposts.map((document, i) => {
                let { Title, slug, Body, image } = document
                return (
                    <Grid key={slug} item container xs={12}>
                        <Grid item xs={12}>
                            <h1>{Title}</h1>
                        </Grid>
                        <Grid item xs={9}>
                            <ReactMarkdown>{Body}</ReactMarkdown>
                        </Grid>
                        <Grid item xs={3}>
                            <img src={`https://cms.caseytimm.com${image.url}`} width={width} />
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default Posts