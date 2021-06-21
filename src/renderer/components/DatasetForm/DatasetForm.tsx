import { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';
import {
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { DatasetFormData } from './types';

function DatasetForm(props: FormikProps<DatasetFormData>): JSX.Element {
  const { values, setFieldValue } = props;
  const [fields, setFields] = useState<string[]>([]);

  // For these we'll use the indices within the header
  // to handle cases where there are multiple fields with
  // the same name.

  // In the future, this may have to be rewritten if we
  // want to handle non-csv formats

  const getFields = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file_ = event.target.files[0];

      setFieldValue('file', file_);

      // Parse just first line and store
      Papa.parse<string>(file_, {
        step: (result, parser) => {
          setFields(result.data);
          parser.abort();
        },
      });
    }
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    getFields(event);

    setFieldValue('groupIdField', -1);
    setFieldValue('textField', -1);
  };
  const onChangeIsGrouped = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('groupIdField', -1);
    setFieldValue('isGrouped', event.target.checked);
  };
  const onChangeGroupIdField = (event: ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('groupIdField', Number(event.target.value));
  };
  const onChangeTextField = (event: ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('textField', Number(event.target.value));
  };

  const fieldOptions = fields.map((name, index) => (
    <option value={index} key={index}>
      {name}
    </option>
  ));

  return (
    <Flex flexDirection="column" gridGap={4}>
      <FormControl>
        <FormLabel>Dataset File</FormLabel>
        <input
          type="file"
          name="dataset"
          accept=".csv"
          onChange={onChangeFile}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Text Field</FormLabel>
        <Select onChange={onChangeTextField} value={values.textField}>
          <option value={-1} disabled>
            Select the field which has your texts
          </option>
          {fieldOptions}
        </Select>
        <FormErrorMessage></FormErrorMessage>
      </FormControl>
      <FormControl>
        <Checkbox isChecked={values.isGrouped} onChange={onChangeIsGrouped}>
          Group texts by another field?
        </Checkbox>
      </FormControl>
      <FormControl hidden={!values.isGrouped}>
        <FormLabel>Group ID Field</FormLabel>
        <Select
          disabled={!values.isGrouped}
          onChange={onChangeGroupIdField}
          value={values.groupIdField}
        >
          <option value={-1} disabled>
            Select a field to group by
          </option>
          {fieldOptions}
        </Select>
      </FormControl>
    </Flex>
  );
}

export default DatasetForm;
