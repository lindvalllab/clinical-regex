import { Flex, Heading, Text } from "@chakra-ui/react"
import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

interface Link {
  src: string
  title: string
}

function Video(link: Link): JSX.Element {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      gridGap={2}
    >
      <Text>{link.title}</Text>
      <iframe
        width="560"
        height="315"
        src={link.src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </Flex>
  )
}

const TrainingVideosPage = (): JSX.Element => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            labUrl
            dfciUrl
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
        gridGap={3}
      >
        <Heading as="h1">Training Videos</Heading>
        <Video
          title="Getting Started"
          src={site.siteMetadata.gettingStartedVideoUrl}
        />
        <Video title="Annotating" src={site.siteMetadata.annotatingVideoUrl} />
        <Video
          title="Finishing and Saving"
          src={site.siteMetadata.finishingSavingVideoUrl}
        />
      </Flex>
    </Layout>
  )
}

export default TrainingVideosPage
