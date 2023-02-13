import {
  Flex,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const OtherSoftwarePage = (): JSX.Element => {
  return (
    <Layout>
      <SEO title="Other software" />
      <Flex
        flexDir="column"
        alignItems="left"
        justifyContent="center"
        gridGap={2}
      >
        <Heading as="h1">Other software</Heading>
        <Text>
          <UnorderedList>
            <ListItem>
              <Link href="https://github.com/lindvalllab/rpdr-converter/releases/" isExternal>RPDR Converter</Link>,
              a utility to convert RPDR .txt files to the .csv format.
            </ListItem>
            <ListItem>
              <Link href="https://github.com/lindvalllab/datefilter/releases/" isExternal>Datefilter</Link>,
              a utility to filter .csv files to only contain entries in a specified date range.
            </ListItem>
            <ListItem>
              <Link href="https://github.com/lindvalllab/csv-concat/releases" isExternal>CSV Concatenator</Link>,
              a utility to concatenate multiple .csv files.
            </ListItem>
          </UnorderedList>
        </Text>
      </Flex>
    </Layout>
  )
}

export default OtherSoftwarePage
