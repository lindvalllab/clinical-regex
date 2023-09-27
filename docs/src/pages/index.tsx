import {
  Button,
  Flex,
  Heading,
  Link,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { FaApple, FaWindows, FaLaptop, FaLinux } from "react-icons/fa"
import React, { useState, useEffect } from "react"
import Layout from "../components/Layout"
import Logo from "../components/Logo"
import SEO from "../components/SEO"
import Demo from "../components/Demo"
import ExternalLink from "../components/ExternalLink"
import { useStaticQuery, graphql } from "gatsby"
import { Octokit } from "octokit"
import { Endpoints } from "@octokit/types"

type Release =
  Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]["data"]

const osSupported = ["Mac", "Windows", "Linux"]

// https://stackoverflow.com/a/38241481
function getOS(): string {
  const isBrowser = typeof window !== "undefined"

  if (!isBrowser) return "Unknown"

  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"]

  let os = "Unknown"

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac"
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS"
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows"
  } else if (/Android/.test(userAgent)) {
    os = "Android"
  } else if (/Linux/.test(platform)) {
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
            releasesUrl
          }
        }
      }
    `
  )

  const os = getOS()

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

  const [release, setRelease] = useState<Release | undefined>(undefined)
  const [downloadLink, setDownloadLink] = useState("#")

  useEffect(() => {
    const octokit = new Octokit()

    octokit
      .request(
        "GET /repos/lindvalllab/clinical-regex-releases/releases/latest",
        {
          owner: "lindvalllab",
          repo: "clinical-regex-releases",
        }
      )
      .then((response) => {
        setRelease(response.data)

        const asset = (response.data as Release).assets.find((asset) => {
          if (os === "Mac") {
            return asset.name.endsWith(".dmg")
          } else if (os === "Windows") {
            return asset.name.endsWith(".exe")
          } else if (os === "Linux") {
            return asset.name.endsWith(".AppImage")
          } else {
            return false
          }
        })

        if (asset?.browser_download_url) {
          setDownloadLink(asset.browser_download_url)
        }
      })
  }, [os])

  const isSupported = osSupported.indexOf(os) !== -1

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
          <Logo width={512} />
          <Text>{site.siteMetadata.description}</Text>
          <Link href={downloadLink}>
            <Button
              size="lg"
              leftIcon={osIcon}
              isLoading={release === null || release === undefined}
              loadingText={"Fetching download link"}
              isDisabled={!isSupported}
              w="full"
            >
              {isSupported
                ? `Download ${release?.tag_name}`
                : `App not supported for detected OS`}
            </Button>
          </Link>
          <Button
            data-tf-popup="ALBY4SzH"
            data-tf-size="70"
            data-tf-iframe-props="title=Clinical Regex - Contact Form"
            data-tf-medium="snippet"
            variant="outline"
          >
            User Registration
          </Button>
          <Text fontSize="sm">
            Not seeing the version you want?{" "}
            <ExternalLink href={site.siteMetadata.releasesUrl}>
              Click here for more options.
            </ExternalLink>
          </Text>
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

export const Head = () => (
  <>
    <html lang="en" />
    <script src="//embed.typeform.com/next/embed.js"></script>
  </>
)

export default IndexPage
