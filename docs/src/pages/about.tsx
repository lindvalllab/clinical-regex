import { Heading, Link, Text, Stack, Box } from "@chakra-ui/react"
import { graphql, useStaticQuery, Link as GatsbyLink } from "gatsby"
import React from "react"
import ExternalLink from "../components/ExternalLink"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const AboutPage = (): JSX.Element => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            labUrl
            dfciUrl
          }
        }
      }
    `
  )

  return (
    <Layout>
      <SEO title="About" />
      <Stack spacing={26}>
        <Heading as="h1">About</Heading>
        <Box>
            <Text>
              Clinical Regex is a text annotation software developed by the{" "}
              <ExternalLink href={site.siteMetadata.labUrl}>
                Lindvall Lab
              </ExternalLink>{" "}
              at{" "}
              <ExternalLink href={site.siteMetadata.dfciUrl}>
                Dana-Farber Cancer Institute
              </ExternalLink>{" "}
              for analyzing collections of clinical texts.
            </Text>
        </Box>
        <Box>
            <Heading as="h2" size="md">Description</Heading>
            <Text>
            ClinicalRegex is an natural language processing (NLP)-based software which helps researchers
            search large amounts of text for keywords and phrases associated with one or more outcomes of interest.
            </Text>
            <Text>
            In ClinicalRegex, users load their data file as well as a pre-defined ontology (keyword library).
            The software performs a search of the data for said terms using NLP, and displays texts which
             contain highlighted keywords.
            </Text>
            <Text>
            The software enables NLP-assisted <i>human annotation</i>: trained human coders are tasked
            with reviewing keyword matches in-context, and manually labeling whether relevant target
            outcomes are indicated in the data.
            </Text>
            <Text>
            This software has been applied in several large clinical trials <Link as={GatsbyLink} to="#ref1-5">[1-5]</Link> to examine the data of
            thousands of patients across more than a dozen healthcare systems. It is also supported by
            multiple validation studies <Link as={GatsbyLink} to="#ref6-8">[6-8]</Link>.
            </Text>
            <Text>
            ClinicalRegex has been used in a number of peer-reviewed studies, which can be found{" "}
              <Link as={GatsbyLink} to="/publications">
                here
              </Link>
              .
            </Text>
        </Box>
        <Box>
            <Heading as="h2" size="md">Ontologies</Heading>
            <Text>
            The Lindvall Lab has built and validated multiple ontologies for use with ClinicalRegex,
            to identify specific clinical conditions <Link as={GatsbyLink} to="#ref9">[9]</Link>,
            biopsy results <Link as={GatsbyLink} to="#ref10">[10]</Link>,
            CT scan results <Link as={GatsbyLink} to="#ref11">[11]</Link>,
            functional status <Link as={GatsbyLink} to="#ref12">[12]</Link>,
            chronic mobility disability <Link as={GatsbyLink} to="#ref13">[13]</Link>,
            social support <Link as={GatsbyLink} to="#ref14">[14]</Link>,
            symptoms <Link as={GatsbyLink} to="#ref15">[15]</Link>,
            and advance care planning <Link as={GatsbyLink} to="#ref16-20">[16-20]</Link>.
            </Text>
            <Text>
            Note: Previously developed ontologies are downloadable in the{" "}
                <Link as={GatsbyLink} to="/publications">
                Publications tab
                </Link>
                , though it is important that they are revisited, tested, and potentially expanded upon
                in new implementations. Even if keywords have been validated in a prior investigation,
                language varies – there may be important terms to find within new data which are not
                accounted for in the original libraries.
            </Text>
        </Box>
        <Box>
            <Heading as="h2" size="md">Purpose</Heading>
            <Text>
            ClinicalRegex seeks to enable gleaning structured data from unstructured sources.
            Unstructured data in the form of free-text notes make up 70-80% of clinical information
            in the electronic health record (EHR) <Link as={GatsbyLink} to="#ref21">[21]</Link>. This
            information has been traditionally inaccessible in large studies, given the laborious
            process of chart review required to extract usable data elements.
            </Text>
            <Text>
            Manual chart review is time-consuming, resource-intensive, and requires considerable
            clinical expertise and training to achieve high inter-rater reliability
            <Link as={GatsbyLink} to="#ref22">[22]</Link>. Clinical
            documentation in the EHR is also often lengthy, repetitive, and inconsistently
            formatted. Human coders often experience coder fatigue
            <Link as={GatsbyLink} to="#ref23">[23]</Link>, which limits the speed and accuracy of
            chart review.
            </Text>
            <Text>
            In an effort to expedite the process of high-quality data
            abstraction, ClinicalRegex uses NLP to identify relevant documentation within notes
            quickly, to avoid human reviewers spending time attentively sorting through information
            that is ultimately unnecessary. With the NLP-assisted note-screening process offered by
            ClinicalRegex, humans still determine whether target outcomes are present among patients’
            relevant documentation, but assess such outcomes in-context, as they would during manual
            chart review. A “human-in-the-loop” method allows for data extraction to take place in a
            considerably expedited manner without removing human judgement from the outcome
            identification process.
            </Text>
        </Box>
        <Box>
            <Heading as="h2" size="md">Limitations</Heading>
            <Text>
            Importantly, ClinicalRegex uses pragmatic, rule-based NLP rather than more advanced
            machine learning (ML) or artificial intelligence (AI) language methods. In only capturing
            predefined concepts, rule-based NLP is limited by the terms one is searching for. For example,
            variations in spelling (e.g., misspellings) can lead to false  negatives.
            </Text>
            <Text>
            Certain aspects of this issue are mitigated in ClinicalRegex by active acknowledgement of
            the limitation: ontology development is a specific, sensitive process that is iterative and
            tested, and final ontologies include various potential spellings, word phrasings, and the
            search accounts for any combination of surrounding punctuation. Otherwise, it remains vital
            that ontology development/testing occurs with feedback from an expert in the target outcome.
            </Text>
            <Text>
            Additionally, the human review component of ClinicalRegex aims to prevent NLP from producing
            results out-of-context; ontologies are developed to err on the side of true positives (as all
            ‘hits’ will be reviewed, while misses will not be), and manual review ensures the accuracy of
            all found content.
            </Text>
        </Box>
        <Box>
            <Heading as="h2" size="md">Privacy Note</Heading>
            <Text>
            ClinicalRegex is a downloaded desktop application. It iterates over the loaded notes file
            while in use, but does not store or save any patient information.
            </Text>
        </Box>
        <Box>
            <Heading as="h2" size="md">References</Heading>
            <Text id="ref1-5">
            1. Lakin JR, Brannen EN, Tulsky JA, et al. Advance Care Planning: Promoting Effective and Aligned
            Communication in the Elderly (ACP-PEACE): the study protocol for a pragmatic stepped-wedge trial of
            older patients with cancer. BMJ Open 2020;10(7):e040999. doi: {" "}
                <ExternalLink href="https://doi.org/10.1136/bmjopen-2020-040999">10.1136/bmjopen-2020-040999</ExternalLink>
                .
            </Text>
            <Text>
            2. Lakin JR, Zupanc SN, Lindvall C, et al. Study protocol for Video Images about Decisions to
            Improve Ethical Outcomes with Palliative Care Educators (VIDEO-PCE): a pragmatic stepped wedge
            cluster randomised trial of older patients admitted to the hospital. BMJ Open 2022;12(7):e065236. doi: {" "}
                <ExternalLink href="https://doi.org/10.1136/bmjopen-2022-065236">10.1136/bmjopen-2022-065236</ExternalLink>
                .
            </Text>
            <Text>
            3. Eneanya ND, Lakin JR, Paasche-Orlow MK, et al. Video Images about Decisions for Ethical
            Outcomes in Kidney Disease (VIDEO-KD): the study protocol for a multi-centre randomised
            controlled trial. BMJ Open 2022;12(4):e059313. doi: {" "}
                <ExternalLink href="https://doi.org/10.1136/bmjopen-2021-059313">10.1136/bmjopen-2021-059313</ExternalLink>
                .
            </Text>
            <Text>
            4. Volandes AE, Zupanc SN, Paasche-Orlow MK, et al. Association of an Advance Care Planning
            Video and Communication Intervention With Documentation of Advance Care Planning Among Older
            Adults: A Nonrandomized Controlled Trial. JAMA Netw Open 2022;5(2):e220354. doi: {" "}
                <ExternalLink href="https://doi.org/10.1001/jamanetworkopen.2022.0354">10.1001/jamanetworkopen.2022.0354</ExternalLink>
                .
            </Text>
            <Text>
            5. Greer JA, Moy B, El-Jawahri A, et al. Randomized Trial of a Palliative Care Intervention
            to Improve End-of-Life Care Discussions in Patients With Metastatic Breast Cancer. J Natl Compr
            Canc Netw 2022;20(2):136-143. doi: {" "}
                <ExternalLink href="https://doi.org/10.6004/jnccn.2021.7040">10.6004/jnccn.2021.7040</ExternalLink>
                .
            </Text>
            <Text id="ref6-8">
            6. Lilley EJ, Lindvall C, Lillemoe KD, et al. Measuring processes of care in palliative surgery:
            a novel approach using natural language processing. Ann Surg 2018;267(5):823-825. doi: {" "}
                <ExternalLink href="https://doi.org/10.1097/sla.0000000000002579">10.1097/SLA.0000000000002579</ExternalLink>
                .
            </Text>
            <Text>
            7.	Lindvall C, Deng CY, Moseley E, et al. Natural language processing to identify advance care
            planning documentation in a multisite pragmatic clinical trial. J Pain Symptom Manage 2022;
            63(1):e29-e36. doi: {" "}
                <ExternalLink href="https://doi.org/10.1016/j.jpainsymman.2021.06.025">10.1016/j.jpainsymman.2021.06.025</ExternalLink>
                .
            </Text>
            <Text>
            8. Lindvall C, Lilley EJ, Zupanc SN, et al. Natural language processing to assess end-of-life
            quality indicators in cancer patients receiving palliative surgery. J Palliat Med 2019;22(2):
            183-187. doi: {" "}
                <ExternalLink href="https://doi.org/10.1089/jpm.2018.0326">10.1089/jpm.2018.0326</ExternalLink>
                .
            </Text>
            <Text id="ref9">
            9. Udelsman B, Chien I, Ouchi K, et al. Needle in a haystack: natural language processing to
            identify serious illness. J Palliat Med 2019;22(2):179-182. doi: {" "}
                <ExternalLink href="https://doi.org/10.1089/jpm.2018.0294">10.1089/jpm.2018.0294</ExternalLink>
                .
            </Text>
            <Text id="ref10">
            10.	Udelsman BV, Corey KE, Lindvall C, et al. Risk factors and prevalence of liver disease in
            review of 2557 routine liver biopsies performed during bariatric surgery. Surg Obes Relat Dis
            2019;15(6):843-849. doi: {" "}
                <ExternalLink href="https://doi.org/10.1016/j.soard.2019.01.035">10.1016/j.soard.2019.01.035</ExternalLink>
                .
            </Text>
            <Text id="ref11">
            11.	Udelsman B, Lee K, Qadan M, et al. Management of pneumoperitoneum: role and limits of
            nonoperative treatment. Ann Surg 2021;274(1):146-154. doi: {" "}
                <ExternalLink href="https://doi.org/10.1097/sla.0000000000003492">10.1097/SLA.0000000000003492</ExternalLink>
                .
            </Text>
            <Text id="ref12">
            12. Agaronnik N, Lindvall C, El-Jawahri A, et al. Use of natural language processing to assess
            frequency of functional status documentation for patients newly diagnosed with colorectal
            cancer. JAMA Oncol 2020;6(10):1628-1630. doi: {" "}
                <ExternalLink href="https://doi.org/10.1001/jamaoncol.2020.2708">10.1001/jamaoncol.2020.2708</ExternalLink>
                .
            </Text>
            <Text id="ref13">
            13.	Agaronnik ND, Lindvall C, El-Jawahri A, et al. Challenges of developing a natural language
            processing method with electronic health records to identify persons with chronic mobility
            disability. Arch Phys Med Rehabil 2020;101(10):1739-1746. doi: {" "}
                <ExternalLink href="https://doi.org/10.1016/j.apmr.2020.04.024">10.1016/j.apmr.2020.04.024</ExternalLink>
                .
            </Text>
            <Text id="ref14">
            14.	Johnson PC, Markovitz NH, Gray TF, et al. Association of social support with overall
            survival and healthcare utilization in patients with aggressive hematologic malignancies.
            J Natl Compr Canc Netw 2021;1(aop):1-7. doi: {" "}
                <ExternalLink href="https://doi.org/10.6004/jnccn.2021.7033">10.6004/jnccn.2021.7033</ExternalLink>
                .
            </Text>
            <Text id="ref15">
            15. Marziliano A, Burns E, Chauhan L, et al. Patient factors and hospital outcomes associated
            with atypical presentation in hospitalized older adults with COVID-19 during the first surge
            of the pandemic. J Gerontol A Biol Sci Med Sci 2022;77(4):e124-e132. doi: {" "}
                <ExternalLink href="https://doi.org/10.1093/gerona/glab171">10.1093/gerona/glab171</ExternalLink>
                .
            </Text>
            <Text id="ref16-20">
            16. Udelsman BV, Lilley EJ, Qadan M, et al. Deficits in the palliative care process measures
            in patients with advanced pancreatic cancer undergoing operative and invasive nonoperative
            palliative procedures. Ann Surg Oncol 2019;26(13):4204-4212. doi: {" "}
                <ExternalLink href="https://doi.org/10.1245/s10434-019-07757-2">10.1245/s10434-019-07757-2</ExternalLink>
                .
            </Text>
            <Text>
            17. Poort H, Zupanc SN, Leiter RE, et al. Documentation of palliative and end-of-life care
            process measures among young adults who died of cancer: a natural language processing
            approach. J Adolesc Young Adult Oncol 2020;9(1):100-104. doi: {" "}
                <ExternalLink href="https://doi.org/10.1089/jayao.2019.0040">10.1089/jayao.2019.0040</ExternalLink>
                .
            </Text>
            <Text>
            18. Lindvall C, Lilley EJ, Zupanc SN, et al. Natural language processing to assess end-of-life
            quality indicators in cancer patients receiving palliative surgery. J Palliat Med 2019;22(2):183-187. doi: {" "}
                <ExternalLink href="https://doi.org/10.1089/jpm.2018.0326">10.1089/jpm.2018.0326</ExternalLink>
                .
            </Text>
            <Text>
            19. Lee KC, Udelsman BV, Streid J, et al. Natural language processing accurately measures
            adherence to best practice guidelines for palliative care in trauma. J Pain Symptom Manage 2020;
            59(2):225-232. doi: {" "}
                <ExternalLink href="https://doi.org/10.1016/j.jpainsymman.2019.09.017">10.1016/j.jpainsymman.2019.09.017</ExternalLink>
                .
            </Text>
            <Text>
            20. Brizzi K, Zupanc SN, Udelsman BV, et al. Natural language processing to assess palliative
            care and end-of-life process measures in patients with breast cancer with leptomeningeal disease.
            Am J Hosp Palliat Care 2020;37(5):371-376. doi: {" "}
                <ExternalLink href="https://doi.org/10.1177/1049909119885585">10.1177/1049909119885585</ExternalLink>
                .
            </Text>
            <Text id="ref21">
            21. Murdoch TB, Detsky AS. The inevitable application of big data to health care. JAMA 2013;
            309(13):1351-1352. doi: {" "}
                <ExternalLink href="https://doi.org/10.1001/jama.2013.393">10.1001/jama.2013.393</ExternalLink>
                .
            </Text>
            <Text id="ref22">
            22. Yim WW, Yetisgen M, Harris WP, Kwan SW. Natural language processing in oncology: a review.
            JAMA Oncol 2016;2(6):797-804. doi: {" "}
                <ExternalLink href="https://doi.org/10.1001/jamaoncol.2016.0213">10.1001/jamaoncol.2016.0213</ExternalLink>
                .
            </Text>
            <Text id="ref23">
            23. Kleinheksel AJ, Rockich-Winston N, Tawfik H, Wyatt TR. Demystifying content analysis.
            Am J Pharm Educ 2020;84(1):7113. doi: {" "}
                <ExternalLink href="https://doi.org/10.5688/ajpe7113">10.5688/ajpe7113</ExternalLink>
                .
            </Text>
        </Box>
      </Stack>
    </Layout>
  )
}

export default AboutPage