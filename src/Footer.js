import React from 'react'
import { Grid } from '@material-ui/core'

export default () => (
    <Grid container container
        direction="row"
        justify="space-between"
        alignItems="center" >
        <Grid item xs={4}>
            © Casey Timm 2020
        </Grid>
        <Grid item xs={4}>
            This site is purely satire</Grid>
        <Grid item xs={4}><a href="https://caseytimm.com">My Homepage</a></Grid>
    </Grid>
)