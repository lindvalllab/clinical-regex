import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import React from "react"
import ExternalLink from "../components/ExternalLink"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import publicationsData from "../data/publications.yaml"

interface Publication {
  title: string
  authors: string
  journal: string
  date: Date
  link: string
}

const AboutPage = () => {
  const publications: Publication[] = publicationsData
  return (
    <Layout>
      <SEO title="Publications" />
      <Flex
        flexDir="column"
        alignItems="left"
        justifyContent="center"
        gridGap={2}
      >
        <Heading as="h1">Publications</Heading>
        <Text mb={8}>List of publications using Clinical Regex</Text>
        <Stack spacing={8} direction="column" divider={<StackDivider />}>
          {publications
            .sort(
              (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
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
                <Text fontSize="sm">{publication.date}</Text>
                <GridItem colSpan={7}>
                  <ExternalLink href={publication.link}>
                    {publication.title}
                  </ExternalLink>
                  <Text fontSize="sm">{publication.authors}</Text>
                  <Text mt={2}>{publication.journal}</Text>
                </GridItem>
              </Grid>
            ))}
        </Stack>
      </Flex>
    </Layout>
  )
}

export default AboutPage
