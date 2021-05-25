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
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
} from 'formik';
import Papa from 'papaparse';
import { ApiContext } from '../../api';
import { CRLabel } from '../../../types';

type FormData = {
  useId: boolean;
  idCol: string;
  textCol: string;
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
    const idCol = Number(values.idCol);
    const textCol = Number(values.textCol);
    const parseCsv = (result: Papa.ParseResult<string[]>) => {
      api.insertTexts(
        result.data
          .slice(1) // Ignore header row.
          .map((x) => ({ group_id: x[idCol], text: x[textCol] }))
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
        useId: true,
        idCol: '-1',
        textCol: '-1',
        labels: [{ name: '', pattern: '' }],
      }}
      onSubmit={sendData}
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
          <FormControl>
            <Field name="useId" as={Checkbox} defaultIsChecked>
              Group notes by ID column?
            </Field>
          </FormControl>
          <FormControl>
            <FormLabel>Select group ID column.</FormLabel>
            <Field
              name="idCol"
              as={Select}
              disabled={!props.values.useId}
              placeholder=""
            >
              <option value="-1">Select a column</option>
              {headerList}
            </Field>
            <ErrorMessage name="idCol" />
          </FormControl>
          <FormControl marginBlockStart="0.5em">
            <FormLabel>Select text column.</FormLabel>
            <Field name="textCol" as={Select}>
              <option value="-1">Select a column</option>
              {headerList}
            </Field>
            <ErrorMessage name="textCol" />
          </FormControl>
          <FormControl marginBlockStart="0.5em">
            <FieldArray
              name="labels"
              render={(arrayHelpers) => (
                <Box>
                  <Box display="flex" justifyContent="space-between">
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
                        <FormControl marginInlineEnd="0.5em">
                          <FormLabel>Label {index + 1}</FormLabel>
                          <Field
                            name={`labels.${index}.name`}
                            as={Textarea}
                            placeholder="Palliative Care"
                          />
                        </FormControl>
                        <FormControl
                          marginInlineStart="0.5em"
                          marginInlineEnd="1em"
                        >
                          <FormLabel>Pattern {index + 1}</FormLabel>
                          <Field
                            name={`labels.${index}.pattern`}
                            as={Textarea}
                            placeholder="pall(iative)? (care|medicine)"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
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
