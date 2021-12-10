import { Icon, IconProps, Link, LinkProps } from "@chakra-ui/react"
import React from "react"
import { FaExternalLinkAlt } from "react-icons/fa"

const ExternalLinkIcon = (props: IconProps) => {
  return <Icon as={FaExternalLinkAlt} boxSize={3} {...props} />
}

const ExternalLink = (props: LinkProps) => {
  return (
    <Link {...props} target="_blank" rel="noopener noreferrer">
      {props.children} <ExternalLinkIcon />
    </Link>
  )
}

export default ExternalLink
