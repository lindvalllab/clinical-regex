import { ChangeEvent, useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import Papa from 'papaparse';
import { ApiContext } from '../../api';
import { CRLabel } from '../../../types';
import validationSchema from './validationSchema';
import LabelWithError from './LabelWithError';

type FormData = {
  isGrouped: boolean;
  idColIndex: number;
  textColIndex: number;
  labels: CRLabel[];
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

  const sendData = (values: FormData, helpers: FormikHelpers<FormData>) => {
    console.log(JSON.stringify(values, null, 2));
    const idColIndex = values.idColIndex;
    const textColIndex = values.textColIndex;
    const parseCsv = (result: Papa.ParseResult<string[]>) => {
      api.insertTexts(
        result.data
          .slice(1) // Ignore header row.
          .map((x) => ({ group_id: x[idColIndex], text: x[textColIndex] }))
      );
      helpers.setSubmitting(false);
    };
    if (csv !== undefined) {
      Papa.parse<string[]>(csv, {
        complete: parseCsv,
        skipEmptyLines: true,
      });
    }
    helpers.resetForm();
  };

  const headerList = headers.map((h, i) => (
    <option value={i} key={i}>
      {h}
    </option>
  ));

  return (
    <Formik
      initialValues={{
        isGrouped: true,
        idColIndex: -1,
        textColIndex: -1,
        labels: [{ name: '', pattern: '' }],
      }}
      onSubmit={sendData}
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
            <Field name="isGrouped" as={Checkbox} defaultIsChecked>
              Group notes by ID column?
            </Field>
          </FormControl>
          <FormControl marginBlock="1em">
            <LabelWithError text="Select group ID column." name="idColIndex" />
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
                        arrayHelpers.push({ name: '', pattern: '' })
                      }
                    >
                      +
                    </Button>
                  </Box>

                  {props.values.labels.map((_label, index) => (
                    <Box key={index}>
                      <Box display="flex" alignItems="center">
                        <FormControl marginInlineEnd="0.5em" minWidth="20em">
                          <LabelWithError
                            text={`Label ${index + 1}`}
                            name={`labels.${index}.name`}
                          />
                          <Field
                            name={`labels.${index}.name`}
                            as={Textarea}
                            placeholder="Palliative Care"
                          />
                        </FormControl>
                        <FormControl
                          marginInlineStart="0.5em"
                          marginInlineEnd="0.5em"
                          minWidth="20em"
                        >
                          <LabelWithError
                            text={`Pattern ${index + 1}`}
                            name={`labels.${index}.pattern`}
                          />
                          <Field
                            name={`labels.${index}.pattern`}
                            as={Textarea}
                            placeholder="pall(iative)? (care|medicine)"
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
          <Button type="submit" isLoading={props.isSubmitting}>
            Send
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default FileUploader;
