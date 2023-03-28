import { Flex, Heading, Text } from "@chakra-ui/react"
import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import ExternalLink from "../components/ExternalLink"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const TrainingVideosPage = (): JSX.Element => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            labUrl
            dfciUrl
            oldTrainingUrl
            gettingStartedVideoUrl
            annotatingVideoUrl
            finishingSavingVideoUrl
          }
        }
      }
    `
  )

  return (
    <Layout>
      <SEO title="Training Videos" />
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gridGap={2}
      >
        <Heading as="h1">Training Videos</Heading>
        <Text>
          Old Download and Installation Instructions can be found{" "}
          <ExternalLink href={site.siteMetadata.oldTrainingUrl}>
            here
          </ExternalLink>{" "}
          .
        </Text>
        <Text>
          Training videos can be found below.
        </Text>
        <Heading as="h3">Getting Started</Heading>
        <iframe
            width="560"
            height="315"
            src={site.siteMetadata.gettingStartedVideoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
        </iframe>
        <Heading as="h3">Annotating</Heading>
        <iframe
            width="560"
            height="315"
            src={site.siteMetadata.annotatingVideoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
        </iframe>
        <Heading as="h3">Finishing and Saving</Heading>
        <iframe
            width="560"
            height="315"
            src={site.siteMetadata.finishingSavingVideoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
        </iframe>
      </Flex>
    </Layout>
  )
}

export default TrainingVideosPage