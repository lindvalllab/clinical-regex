import React from "react"
import { Link as GatsbyLink } from "gatsby"
import {
  Flex,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/layout"

interface HeaderLinkProps {
  href: string
  isExternal?: boolean
}

const HeaderLink = ({
  href,
  isExternal = false,
  ...restProps
}: HeaderLinkProps & ChakraLinkProps): JSX.Element => {
  return (
    <ChakraLink
      {...(isExternal ? { href } : { as: GatsbyLink, to: href })}
      fontFamily="heading"
      activeClassName="active"
      sx={{
        ":not(.active)": {
          color: "black",
        },
      }}
      {...restProps}
    />
  )
}

const Header = (): JSX.Element => {
  return (
    <Flex p={4} justifyContent="center" gridGap={4}>
      <HeaderLink href="/">Home</HeaderLink>
      <HeaderLink href="/about">About</HeaderLink>
      <HeaderLink href="/publications">Publications</HeaderLink>
      <HeaderLink href="/otherSoftware">Other Software</HeaderLink>
    </Flex>
  )
}

export default Header
