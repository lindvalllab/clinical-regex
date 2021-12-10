import { Flex, Link, Text, TextProps, Tooltip } from "@chakra-ui/react"
import React from "react"

interface HighlightProps {
  children: React.ReactNode
  bgColor: TextProps["bgColor"]
  label: string
}

const Highlight = ({ children, bgColor, label }: HighlightProps) => {
  return (
    <Tooltip label={label}>
      <Text
        as="span"
        bgColor={bgColor}
        _hover={{ opacity: 0.8, cursor: "pointer" }}
      >
        {children}
      </Text>
    </Tooltip>
  )
}

const Demo = () => {
  const labelACP = "advanced care planning"
  const colorACP = "yellow.200"

  const labelCaregivers = "caregiver"
  const colorCaregivers = "blue.200"

  return (
    <Flex flexDir="column" gridGap={4}>
      <Text fontFamily="mono">
        <Highlight bgColor={colorACP} label={labelACP}>
          Advance care planning
        </Highlight>{" "}
        (
        <Highlight bgColor={colorACP} label={labelACP}>
          ACP
        </Highlight>
        ) is associated with improved health outcomes for patients with cancer,
        and its absence is associated with unfavourable outcomes for patients
        and their{" "}
        <Highlight bgColor={colorCaregivers} label={labelCaregivers}>
          caregivers
        </Highlight>
        . However, older adults do not complete{" "}
        <Highlight bgColor={colorACP} label={labelACP}>
          ACP
        </Highlight>{" "}
        at expected rates due to patient and clinician barriers. We present the
        original design, methods and rationale for a trial aimed at improving{" "}
        <Highlight bgColor={colorACP} label={labelACP}>
          ACP
        </Highlight>{" "}
        for older patients with advanced cancer and the modified protocol in
        response to changes brought by the COVID-19 pandemic.
      </Text>
      <Link
        href="https://pubmed.ncbi.nlm.nih.gov/32665394/"
        fontSize="xs"
        fontFamily="heading"
        alignSelf="end"
      >
        Source: PubMed
      </Link>
    </Flex>
  )
}

export default Demo
