import {
  Box,
  Button,
  Container,
  Heading,
  Link,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import DatasetForm from '../../components/DatasetForm';
import LabelForm from '../../components/LabelForm';
import validationDataset from '../../components/DatasetForm/validationSchema';
import validationLabels from '../../components/LabelForm/validationSchema';
import InlineUpload from '../../components/InlineUpload';
import { CRLabel } from '../../../types';
import { ChangeEvent } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { DatasetFormData } from '../../components/DatasetForm/types';
import { LabelFormData } from '../../components/LabelForm/types';
import { useContext } from 'react';
import { ApiContext } from '../../api';
import { useHistory } from 'react-router-dom';

type NewProjectConfig = {
  isGrouped?: boolean;
  textField?: string;
  textFieldIndex?: number;
  groupIdField?: string;
  groupIdFieldIndex?: number;
  labels?: CRLabel[];
};

type FormData = DatasetFormData & LabelFormData;

function NewProject(): JSX.Element {
  const ref = useRef<FormikProps<FormData>>(null);
  const api = useContext(ApiContext);
  const history = useHistory();
  const toast = useToast();
  const [config, setConfig] = useState<NewProjectConfig>({
    textFieldIndex: -1,
    groupIdFieldIndex: -1,
    isGrouped: true,
    labels: [{ name: '', patterns: [] }],
  });

  const linkColor = useColorModeValue('blue.600', 'blue.400');

  const onSubmit = async (
    values: FormData,
    helpers: FormikHelpers<FormData>
  ) => {
    if (values.file) {
      await api.deleteTempDb();
      // Connect to the (now empty) database in the user data directory
      await api.loadDbFromPath();
      await api.loadCsv(
        values.file.path,
        values.groupIdField,
        values.textField
      );
      await api.insertLabels(values.labels);
      await api.insertSettings(
        values.isGrouped,
        values.groupIdField !== -1 ? values.fields[values.groupIdField] : null,
        values.fields[values.textField]
      );
    }

    helpers.setSubmitting(false);
    history.push('/dashboard');
  };

  const getFieldIndex = (
    name: string,
    fields: string[],
    key: string
  ): number => {
    const index = fields.indexOf(name);

    if (index === -1) {
      toast({
        status: 'warning',
        title: 'Warning: Field ignored',
        description: `${key}: ${name} was not found among the dataset fields [${fields.join(
          ', '
        )}].`,
        isClosable: true,
        duration: 8000,
        position: 'top-right',
      });
    } else if (fields.lastIndexOf(name) !== index) {
      toast({
        title: 'Warning: Duplicate field found',
        description: `Multiple fields found with the name: ${name}.,
      Please check that the selected one is correct.`,
        isClosable: true,
        duration: 8000,
        position: 'top-right',
      });
    }

    return index;
  };

  const onChangeConfig = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file)
      try {
        const fields = ref.current?.values.fields;
        const loadedConfig = JSON.parse(await file?.text());

        toast.closeAll();

        if (fields !== undefined) {
          setConfig({
            ...loadedConfig,
            textFieldIndex:
              loadedConfig.textField !== undefined
                ? getFieldIndex(loadedConfig.textField, fields, 'textField')
                : undefined,
            groupIdFieldIndex:
              loadedConfig.groupIdField !== undefined
                ? getFieldIndex(
                    loadedConfig.groupIdField,
                    fields,
                    'groupIdField'
                  )
                : undefined,
          });
        } else {
          setConfig(loadedConfig);
        }

        // Motivation: https://github.com/formium/formik/issues/811#issuecomment-478586750
        // Source: https://github.com/formium/formik/issues/2129#issuecomment-566148651
        ref.current?.resetForm({ values: ref.current.values });

        toast({
          status: 'success',
          title: 'Success: Configuration loaded',
          description: `Successfully loaded ${file.name}`,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        if (error instanceof SyntaxError) {
          toast({
            status: 'error',
            title: 'Error: Invalid JSON',
            description: error.message,
            duration: null,
            isClosable: true,
            position: 'top-right',
          });
        }
      }

    // Reset so that if the same file is loaded twice in a row, the onChange event will
    // still be fired.
    event.target.value = '';
  };

  return (
    <Container maxW="container.xl" p={16}>
      <Box mb={4}>
        <Heading size="lg">New Project</Heading>
        Alternatively, you can fill in this form by{' '}
        <InlineUpload
          inputProps={{
            accept: '.json',
            onChange: onChangeConfig,
            onClick: (event) => {
              if (ref.current?.values.file.name === undefined) {
                event.preventDefault();
                toast({
                  status: 'error',
                  description: 'Please select a dataset file first.',
                  isClosable: true,
                  position: 'top-right',
                });
              }
            },
          }}
        >
          <Text as={Link} fontWeight="bold" color={linkColor}>
            loading a configuration from a file
          </Text>
        </InlineUpload>
        .
      </Box>
      <Formik
        enableReinitialize
        initialValues={{
          file: ref.current?.values.file || ({} as File),
          isGrouped: config.isGrouped || ref.current?.values.isGrouped || true,
          textField:
            config.textFieldIndex || ref.current?.values.textField || -1,
          groupIdField:
            config.groupIdFieldIndex || ref.current?.values.groupIdField || -1,
          labels: config.labels ||
            ref.current?.values.labels || [{ name: '', patterns: [] }],
          fields: ref.current?.values.fields || [],
        }}
        validationSchema={validationDataset.concat(validationLabels)}
        onSubmit={onSubmit}
        innerRef={ref}
      >
        {(props) => (
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
              <Button type="submit" size="lg" isLoading={props.isSubmitting}>
                Submit
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default NewProject;
