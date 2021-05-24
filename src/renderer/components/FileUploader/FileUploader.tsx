import { ChangeEvent, useContext, useState } from 'react';
import { Button, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Papa from 'papaparse';
import { ApiContext } from '../../api';

type FormData = {
  idCol: string;
  textCol: string;
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
  };

  const headerList = headers.map((h, i) => (
    <option value={i} key={i}>
      {h}
    </option>
  ));

  return (
    <Formik initialValues={{ idCol: '0', textCol: '0' }} onSubmit={sendData}>
      {(props) => (
        <Form>
          <FormControl>
            <FormLabel>Upload a file</FormLabel>
            <input
              type="file"
              name="file"
              accept=".csv"
              onChange={readHeader}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Select group ID column.</FormLabel>
            <Field name="idCol" as={Select}>
              {headerList}
            </Field>
          </FormControl>
          <FormControl>
            <FormLabel>Select text column.</FormLabel>
            <Field name="textCol" as={Select}>
              {headerList}
            </Field>
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
