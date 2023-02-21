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
  Title: string
  Authors: string
  Journal_Book: string
  Publication_Year: number
  PMID: string
  Citation: string
  Labels: string
  Exclusions: string
  Filename: string
}

export const query = graphql`
  query {
    allLibrariesCsv {
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
  }
`

const PublicationsPage = ({
  data,
}: {
  data: { allLibrariesCsv: { nodes: Library[] } }
}): JSX.Element => {
  const libraries = data.allLibrariesCsv.nodes

  return (
    <Layout>
      <SEO title="Libraries" />
      <Flex
        flexDir="column"
        alignItems="left"
        justifyContent="center"
        gridGap={2}
      >
        <Heading as="h1">Publications and Keyword Libraries</Heading>
        <Text mb={8}>List of publications using Clinical Regex and keyword libraries</Text>
        <Stack spacing={8} direction="column" divider={<StackDivider />}>
          {libraries === undefined
            ? "Loading"
            : libraries
                .sort(
                  (a, b) =>
                    Number(b.Publication_Year) - Number(a.Publication_Year)
                )
                .map((library, index) => (
                  <Grid
                    key={index}
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      md: "repeat(8, 1fr)",
                    }}
                    gridGap={2}
                  >
                    <Text fontSize="sm">{library.Publication_Year}</Text>
                    <GridItem colSpan={4}>
                      <ExternalLink
                        href={`https://pubmed.ncbi.nlm.nih.gov/${library.PMID}/`}
                      >
                        {library.Title}
                      </ExternalLink>
                      <Text fontSize="sm">{library.Authors}</Text>
                      <Text fontSize="sm" color="gray">
                        {library.Citation}
                      </Text>
                    </GridItem>
                    <GridItem colSpan={3}>
                      <Text>Keyword Library:</Text>
                      <Text fontSize="sm">{library.Labels}</Text>
                      <Text fontSize="sm" color="gray">
                        {library.Exclusions}
                      </Text>
                      <ExternalLink
                        href={`/downloads/${library.Filename}/`}
                      >
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