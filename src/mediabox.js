import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { useTheme } from "@material-ui/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { Grid, Button } from "@material-ui/core"
import "react-pdf/src/Page/AnnotationLayer.css"
import Youtube from "react-youtube"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function useWidth() {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || "xs"
  )
}

export default function Image(props) {
  const width = useWidth()
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)

  console.log(props.src)

  return props.src
    .split(/\#|\?/)[0]
    .split(".")
    .pop()
    .trim()
    .toLowerCase() === "pdf" ? (
    <>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Document
            file={props.src}
            onLoadSuccess={({ numPages }) => setPages(numPages)}
          >
            <Page
              pageNumber={page}
              width={
                width === "xl"
                  ? 1000
                  : width === "lg"
                  ? 900
                  : width === "md"
                  ? 500
                  : width === "sm"
                  ? 400
                  : 200
              }
            ></Page>
          </Document>
        </Grid>
        <Grid item>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              {page > 1 ? (
                <Button onClick={() => setPage(page - 1)}>Previous Page</Button>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item>
              Page {page} of {pages}
            </Grid>
            <Grid item>
              {page < pages ? (
                <Button onClick={() => setPage(page + 1)}>Next Page</Button>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  ) : props.src.startsWith("https://www.youtube.com/") ? (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Youtube videoId={props.src.split("v=")[1]} />
      </Grid>
    </Grid>
  ) : (
    <img
      alt="Markdown"
      {...props}
      style={{
        maxWidth: "50%",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    />
  )
}
