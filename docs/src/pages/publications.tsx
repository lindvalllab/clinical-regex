import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import { graphql } from "gatsby"
import React from "react"
import ExternalLink from "../components/ExternalLink"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

interface Library {
  publicURL: string
  name: string
}

interface Publication {
  Title: string
  Authors: string
  Journal_Book: string
  Publication_Year: number
  PMID: string
  Citation: string
  Labels: string
  Exclusions: string
  Filename: string
  Library?: Library
}

export const query = graphql`
  query {
    allPublicationsCsv {
      nodes {
        Title
        Authors
        Publication_Year
        Journal_Book
        PMID
        Citation
        Labels
        Exclusions
        Filename
      }
    }
    allFile(filter: { extension: { eq: "json" } }) {
      nodes {
        publicURL
        name
      }
    }
  }
`

const PublicationsPage = ({
  data,
}: {
  data: {
    allPublicationsCsv: { nodes: Publication[] }
    allFile: { nodes: Library[] }
  }
}): JSX.Element => {
  const configFiles = data.allFile.nodes
  const publications = data.allPublicationsCsv.nodes.map((publication) => ({
    ...publication,
    Library: configFiles.find(
      (configFile) => `${configFile.name}.json` == publication.Filename
    ),
  }))

  return (
    <Layout>
      <SEO title="Publications" />
      <Flex
        flexDir="column"
        alignItems="left"
        justifyContent="center"
        gridGap={2}
      >
        <Heading as="h1">Publications and Keyword Libraries</Heading>
        <Text mb={8}>
          List of publications using Clinical Regex and keyword libraries
        </Text>
        <Stack spacing={8} direction="column" divider={<StackDivider />}>
          {publications === undefined
            ? "Loading"
            : publications
                .sort(
                  (a, b) =>
                    Number(b.Publication_Year) - Number(a.Publication_Year)
                )
                .map((publication, index) => (
                  <Grid
                    key={index}
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      md: "repeat(8, 1fr)",
                    }}
                    gridGap={2}
                  >
                    <Text fontSize="sm">{publication.Publication_Year}</Text>
                    <GridItem colSpan={4}>
                      <ExternalLink
                        href={`https://pubmed.ncbi.nlm.nih.gov/${publication.PMID}/`}
                      >
                        {publication.Title}
                      </ExternalLink>
                      <Text fontSize="sm">{publication.Authors}</Text>
                      <Text fontSize="sm" color="gray">
                        {publication.Citation}
                      </Text>
                    </GridItem>
                    <GridItem colSpan={3}>
                      <Text>Keyword Library:</Text>
                      <Text fontSize="sm">{publication.Labels}</Text>
                      <Text fontSize="sm" color="gray">
                        {publication.Exclusions}
                      </Text>
                      <ExternalLink href={publication.Library?.publicURL}>
                        Download Configuration File
                      </ExternalLink>
                    </GridItem>
                  </Grid>
                ))}
        </Stack>
      </Flex>
    </Layout>
  )
}

export default PublicationsPage
