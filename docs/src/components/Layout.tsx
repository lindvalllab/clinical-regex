import { Flex } from "@chakra-ui/layout"
import React from "react"
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }: LayoutProps): JSX.Element => (
  <Flex flexDir="column" minHeight="100vh" px={12} py={6} gridGap={6}>
    <Header />
    <Flex flexGrow={1} justifyContent="center" alignItems="center" w="full">
      {children}
    </Flex>
    <Footer />
  </Flex>
)

interface LayoutProps {
  children: React.ReactNode
}

export default Layout
