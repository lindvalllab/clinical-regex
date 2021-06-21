import { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';
import {
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { DatasetFormData } from './types';
import FormErrorWithSpace from '../FormErrorWithSpace';

function DatasetForm(): JSX.Element {
  const { values, setFieldValue, handleBlur, errors, touched } =
    useFormikContext<DatasetFormData>();
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
    <Flex flexDirection="column">
      <FormControl mb={6}>
        <FormLabel>Dataset File</FormLabel>
        <input
          type="file"
          name="dataset"
          accept=".csv"
          onChange={onChangeFile}
          onBlur={handleBlur}
        />
      </FormControl>
      <FormControl
        isInvalid={errors.textField !== undefined && touched.textField}
      >
        <FormLabel>Text Field</FormLabel>
        <Select
          onChange={onChangeTextField}
          onBlur={handleBlur}
          value={values.textField}
          name="textField"
        >
          <option value={-1} disabled>
            Select the field which has your texts
          </option>
          {fieldOptions}
        </Select>
        <FormErrorWithSpace>{errors.textField || '&nbsp;'}</FormErrorWithSpace>
      </FormControl>
      <FormControl my={4}>
        <Checkbox
          isChecked={values.isGrouped}
          onChange={onChangeIsGrouped}
          onBlur={handleBlur}
          name="isGrouped"
        >
          Group texts by another field?
        </Checkbox>
      </FormControl>
      <FormControl
        isDisabled={!values.isGrouped}
        isInvalid={errors.groupIdField !== undefined && touched.groupIdField}
        mb={4}
      >
        <FormLabel>Group ID Field</FormLabel>
        <Select
          disabled={!values.isGrouped}
          onChange={onChangeGroupIdField}
          onBlur={handleBlur}
          value={values.groupIdField}
          name="groupIdField"
        >
          <option value={-1} disabled>
            Select a field to group by
          </option>
          {fieldOptions}
        </Select>
        <FormErrorWithSpace>
          {errors.groupIdField || '&nbsp;'}
        </FormErrorWithSpace>
      </FormControl>
    </Flex>
  );
}

export default DatasetForm;
