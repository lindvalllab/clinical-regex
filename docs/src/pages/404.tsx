import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Flex, Heading, Text, Link } from "@chakra-ui/react"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Flex
      flexDir="column"
      alignItems="left"
      justifyContent="center"
      gridGap={2}
    >
      <Heading as="h1">404: Not found</Heading>
      <Text>The page you were looking for could not be found.</Text>
      <Link href="/">Go to homepage</Link>
    </Flex>
  </Layout>
)

export default NotFoundPage
