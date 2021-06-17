import { ChangeEvent, useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import Papa from 'papaparse';
import { ApiContext } from '../../api';
import validationSchema from './validationSchema';
import LabelWithError from './LabelWithError';
import PatternInput from './PatternInput';
import InlineUpload from './InlineUpload';
import handleUploadConfig from './uploadConfig/handleUploadConfig';
import ConfigWarningDialog from './uploadConfig/WarningDialog';
import { CRLabel } from '../../../types';
import { useHistory } from 'react-router-dom';

type FormData = {
  isGrouped: boolean;
  idColIndex: number;
  textColIndex: number;
  labels: CRLabel[];
};

function FileUploader(): JSX.Element {
  const [headers, setHeaders] = useState<string[]>([]); // List of all header names
  const [csv, setCsv] = useState<File>(); // The uploaded file.
  const [configWarnings, setConfigWarnings] = useState<string[]>([]);
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const api = useContext(ApiContext);
  const history = useHistory();

  const readHeader = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setCsv(file);
        // Parse just the first line and store in headers.
        Papa.parse<string>(file, {
          step: (result, parser) => {
            setHeaders(result.data);
            parser.abort(); // Stop after the first line.
          },
        });
      }
    }
  };

  const sendData = async (
    values: FormData,
    helpers: FormikHelpers<FormData>
  ) => {
    if (csv) {
      await api.deleteTempDb();
      await api.loadDbFromPath(); // Connect to the (now empty) database in the user data directory.
      await api.loadCsv(csv.path, values.idColIndex, values.textColIndex);
      await api.insertLabels(
        values.labels.map((label) => ({
          name: label.name,
          patterns: label.patterns,
        }))
      );
      await api.insertSettings(
        values.isGrouped,
        values.idColIndex !== -1 ? headers[values.idColIndex] : null,
        headers[values.textColIndex]
      );
    }
    helpers.setSubmitting(false);
    history.push('/dashboard');
  };

  const headerList = headers.map((h, i) => (
    <option value={i} key={i}>
      {h}
    </option>
  ));

  const linkColor = useColorModeValue('blue', 'lightblue');

  return (
    <Box width="90vw">
      <Formik
        onSubmit={sendData}
        initialValues={
          {
            isGrouped: true,
            idColIndex: -1,
            textColIndex: -1,
            labels: [{ name: '', patterns: [] }],
          } as FormData
        }
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="csvUpload">Upload a file.</FormLabel>
              <input
                type="file"
                name="csvUpload"
                id="csvUpload"
                accept=".csv"
                onChange={readHeader}
              />
            </FormControl>
            <FormControl>
              Please choose your project configuration. You can also{' '}
              <InlineUpload
                inputProps={{
                  accept: '.json',
                  onChange: handleUploadConfig(
                    headers,
                    props.setFieldValue,
                    setConfigErrors,
                    setConfigWarnings
                  ),
                  disabled: !csv,
                }}
                fontWeight="bold"
                color={linkColor}
              >
                upload from a configuration file
              </InlineUpload>
              .
            </FormControl>
            <FormControl marginBlock="1em">
              <Field
                name="isGrouped"
                as={Checkbox}
                isChecked={props.values.isGrouped}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  props.setFieldValue('idColIndex', -1);
                  props.handleChange(e);
                }}
              >
                Group notes by ID column?
              </Field>
            </FormControl>
            <FormControl marginBlock="1em">
              <LabelWithError
                text="Select group ID column."
                name="idColIndex"
              />
              <Field
                name="idColIndex"
                as={Select}
                disabled={!props.values.isGrouped}
              >
                <option value={-1}>Select a column</option>
                {headerList}
              </Field>
            </FormControl>
            <FormControl marginBlock="1em">
              <LabelWithError text="Select text column." name="textColIndex" />
              <Field name="textColIndex" as={Select}>
                <option value={-1}>Select a column</option>
                {headerList}
              </Field>
            </FormControl>
            <FormControl marginBlockStart="1em">
              <FieldArray
                name="labels"
                render={(arrayHelpers) => (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <FormLabel>Labels and patterns</FormLabel>
                      <Button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({ name: '', patterns: [] })
                        }
                      >
                        +
                      </Button>
                    </Box>
                    <FormHelperText my={2}>
                      Tip: to match whole words, use the word boundary regular
                      expression <code>\b</code>. For example,{' '}
                      <code>\bliver\b</code> will match <code>liver</code>, but
                      not <code>deliver</code> or <code>livers</code>.
                    </FormHelperText>

                    {props.values.labels.map((_label, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="space-around"
                      >
                        <FormControl marginInlineEnd="0.5em" flex="1">
                          <LabelWithError
                            text={`Label ${index + 1}`}
                            name={`labels.${index}.name`}
                          />
                          <Field
                            name={`labels.${index}.name`}
                            as={Input}
                            placeholder="Palliative Care"
                          />
                        </FormControl>
                        <FormControl
                          marginInlineStart="0.5em"
                          marginInlineEnd="0.5em"
                          flex="3"
                        >
                          <LabelWithError
                            text={`Pattern ${index + 1}`}
                            name={`labels.${index}.patterns`}
                            htmlFor={`labels.${index}.patterns`}
                          />
                          <Field
                            name={`labels.${index}.patterns`}
                            inputId={`labels.${index}.patterns`}
                            as={PatternInput}
                            placeholder="pall(iative)? (care|medicine)"
                            onBlur={() =>
                              props.setFieldTouched(`labels.${index}.patterns`)
                            }
                            onChange={(value: string[]) =>
                              props.setFieldValue(
                                `labels.${index}.patterns`,
                                value
                              )
                            }
                            value={props.values.labels[index].patterns}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          marginInlineStart="0.5em"
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={props.values.labels.length === 1}
                        >
                          -
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              />
            </FormControl>
            <Flex justifyContent="center" mt={4}>
              <Button type="submit" isLoading={props.isSubmitting}>
                Send
              </Button>
            </Flex>
            <ConfigWarningDialog
              title="Warning"
              status="warning"
              warnings={configWarnings}
              setWarnings={setConfigWarnings}
            />
            <ConfigWarningDialog
              title="Error"
              status="error"
              warnings={configErrors}
              setWarnings={setConfigErrors}
            />
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default FileUploader;
