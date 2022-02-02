import { Image, ImageProps } from "@chakra-ui/react"
import React from "react"
import LogoBanner from "../images/logo_banner.svg"

const Logo = (props: ImageProps): JSX.Element => {
  return <Image src={LogoBanner} w="md" {...props} />
}

export default Logo
