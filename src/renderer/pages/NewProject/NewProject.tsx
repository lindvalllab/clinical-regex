import { Box, Button, Container, Heading, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import DatasetForm from '../../components/DatasetForm';
import LabelForm from '../../components/LabelForm';
import validationDataset from '../../components/DatasetForm/validationSchema';
import validationLabels from '../../components/LabelForm/validationSchema';

function NewProject(): JSX.Element {
  return (
    <Container maxW="container.lg">
      <Formik
        initialValues={{
          file: undefined,
          isGrouped: true,
          textField: -1,
          groupIdField: -1,
          labels: [{ name: '', patterns: [] }],
        }}
        validationSchema={validationDataset.concat(validationLabels)}
        onSubmit={(values, actions) => console.log(values)}
      >
        <Form>
          <VStack spacing={6}>
            <Box w="full">
              <Heading size="md" mb={2}>
                Dataset
              </Heading>
              <Box
                p={8}
                borderRadius="base"
                borderWidth={1}
                boxShadow="md"
                w="full"
              >
                <DatasetForm />
              </Box>
            </Box>
            <Box w="full">
              <Heading size="md" mb={2}>
                Labels
              </Heading>
              <Box
                p={8}
                borderRadius="base"
                borderWidth={1}
                boxShadow="md"
                w="full"
              >
                <LabelForm />
              </Box>
            </Box>
            <Button type="submit" size="lg">
              Submit
            </Button>
          </VStack>
        </Form>
      </Formik>
    </Container>
  );
}

export default NewProject;
