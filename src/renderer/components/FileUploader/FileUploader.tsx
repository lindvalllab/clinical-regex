import { ChangeEvent, useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import Papa from 'papaparse';
import { ApiContext } from '../../api';
import validationSchema from './validationSchema';
import LabelWithError from './LabelWithError';
import PatternInput from './PatternInput';

type Label = {
  name: string;
  patterns: string[];
};

type FormData = {
  isGrouped: boolean;
  idColIndex: number;
  textColIndex: number;
  labels: Label[];
};

function FileUploader(): JSX.Element {
  const [headers, setHeaders] = useState<string[]>([]); // List of all header names
  const [csv, setCsv] = useState<File>(); // The uploaded file.
  const api = useContext(ApiContext);

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
      await api.clearDb();
      await api.loadCsv(csv.path, values.idColIndex, values.textColIndex);
      await api.insertLabels(
        values.labels.flatMap((label) =>
          label.patterns.map((pattern) => ({
            name: label.name,
            pattern: pattern,
          }))
        )
      );
    }
    helpers.setSubmitting(false);
  };

  const headerList = headers.map((h, i) => (
    <option value={i} key={i}>
      {h}
    </option>
  ));

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
              <FormLabel>Upload a file.</FormLabel>
              <input
                type="file"
                name="file"
                accept=".csv"
                onChange={readHeader}
              />
            </FormControl>
            <FormControl marginBlock="1em">
              <Field
                name="isGrouped"
                as={Checkbox}
                defaultIsChecked
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

                    {props.values.labels.map((_label, index) => (
                      <Box key={index}>
                        <Box
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
                            />
                            <Field
                              name={`labels.${index}.patterns`}
                              as={PatternInput}
                              placeholder="pall(iative)? (care|medicine)"
                              onBlur={() =>
                                props.setFieldTouched(
                                  `labels.${index}.patterns`
                                )
                              }
                              onAddition={(value: string[]) =>
                                props.setFieldValue(
                                  `labels.${index}.patterns`,
                                  value
                                )
                              }
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
                      </Box>
                    ))}
                  </Box>
                )}
              />
            </FormControl>
            <Button
              type="submit"
              isLoading={props.isSubmitting}
              margin="1em auto"
              display="block"
            >
              Send
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default FileUploader;
