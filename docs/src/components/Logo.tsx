import { Image, ImageProps } from "@chakra-ui/react"
import React from "react"
import LogoBanner from "../images/logo_banner-1024.png"

const Logo = (props: ImageProps): JSX.Element => {
  return <Image src={LogoBanner} w="md" alt="Clinical Regex Logo" {...props} />
}

export default Logo
