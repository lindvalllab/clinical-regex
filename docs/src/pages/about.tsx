import { Flex, Heading, Link, Text } from "@chakra-ui/react"
import { graphql, useStaticQuery, Link as GatsbyLink } from "gatsby"
import React from "react"
import ExternalLink from "../components/ExternalLink"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const AboutPage = (): JSX.Element => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            labUrl
            dfciUrl
          }
        }
      }
    `
  )

  return (
    <Layout>
      <SEO title="About" />
      <Flex
        flexDir="column"
        alignItems="left"
        justifyContent="center"
        gridGap={2}
      >
        <Heading as="h1">About</Heading>
        <Text>
          Clinical Regex is a text annotation software developed by the{" "}
          <ExternalLink href={site.siteMetadata.labUrl}>
            Lindvall Lab
          </ExternalLink>{" "}
          at{" "}
          <ExternalLink href={site.siteMetadata.dfciUrl}>
            Dana-Farber Cancer Institute
          </ExternalLink>{" "}
          for analyzing collections of clinical texts.
        </Text>
        <Text>
          It has been used in a number of peer-reviewed studies, which can be
          found{" "}
          <Link as={GatsbyLink} to="/publications">
            here
          </Link>
          .
        </Text>
      </Flex>
    </Layout>
  )
}

export default AboutPage
