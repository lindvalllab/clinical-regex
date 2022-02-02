import { Button, Flex, Heading, Text, Wrap, WrapItem } from "@chakra-ui/react"
import { FaApple, FaWindows, FaLaptop, FaLinux } from "react-icons/fa"
import React from "react"

import Layout from "../components/Layout"
import Logo from "../components/Logo"
import SEO from "../components/SEO"
import { useStaticQuery, graphql } from "gatsby"
import Demo from "../components/Demo"

// https://stackoverflow.com/a/38241481
function getOS() {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"]

  let os = undefined

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac"
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS"
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows"
  } else if (/Android/.test(userAgent)) {
    os = "Android"
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux"
  }

  return os
}

const IndexPage = (): JSX.Element => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            description
          }
        }
      }
    `
  )

  const os = "Mac"

  let osIcon

  if (os === "Mac") {
    osIcon = <FaApple />
  } else if (os === "Windows") {
    osIcon = <FaWindows />
  } else if (os === "Linux") {
    osIcon = <FaLinux />
  } else {
    osIcon = <FaLaptop />
  }

  return (
    <Layout>
      <SEO title="Home" />
      <Wrap spacing={12} justify="center">
        <WrapItem
          flexDir="column"
          alignItems="left"
          justifyContent="center"
          gridGap={2}
        >
          <Logo />
          <Text>{site.siteMetadata.description}</Text>
          <Button size="lg" leftIcon={osIcon} isDisabled={true}>
            Coming soon!
          </Button>
        </WrapItem>
        <WrapItem>
          <Flex
            borderWidth={1}
            p={8}
            minH="full"
            maxW={600}
            flexGrow={1}
            flexDir="column"
            gridGap={2}
          >
            <Heading as="h2" size="sm">
              Sample
            </Heading>
            <Demo />
          </Flex>
        </WrapItem>
      </Wrap>
    </Layout>
  )
}

export default IndexPage
