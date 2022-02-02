import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Box } from "@chakra-ui/react"
import ExternalLink from "./ExternalLink"

const Footer = (): JSX.Element => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          labUrl
          dfciUrl
        }
      }
    }
  `)

  const year = new Date().getFullYear()

  return (
    <Box>
      <Box textAlign="center" fontSize="0.8rem" marginX="2rem" marginY="0">
        &copy; {year}{" "}
        <ExternalLink href={data.site.siteMetadata.labUrl}>
          lindvalllab
        </ExternalLink>{" "}
        at{" "}
        <ExternalLink href={data.site.siteMetadata.dfciUrl}>DFCI</ExternalLink>
      </Box>
    </Box>
  )
}

export default Footer
