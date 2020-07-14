import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import useDimensions from "react-use-dimensions"

export default () => {
    const [ref, { height }] = useDimensions();
    return (
        <Grid container>
            <Grid item xs={3}><img src="/Logo.svg" height={height} /></Grid>
            <Grid item xs={9}><Typography variant="h1" component="h2" gutterBottom ref={ref}>5GCOVID.info</Typography> </Grid>
        </Grid>
    )
}