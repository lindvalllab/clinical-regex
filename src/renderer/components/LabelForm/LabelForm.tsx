import { Button, Flex } from '@chakra-ui/react';
import { FieldArray, useFormikContext } from 'formik';
import { LabelFormData } from './types';
import { FaPlus } from 'react-icons/fa';
import LabelFormItem from './LabelFormItem';

function LabelForm(): JSX.Element {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<LabelFormData>();

  return (
    <>
      <FieldArray
        name="labels"
        render={(arrayHelpers) => (
          <Flex flexDirection="column" gridGap={8}>
            <Button
              type="button"
              size="md"
              leftIcon={<FaPlus />}
              onClick={() => arrayHelpers.push({ name: '', patterns: [] })}
            >
              Add Label
            </Button>
            {values.labels.map((label, index) => (
              <LabelFormItem
                key={index}
                displayNumber={index + 1}
                label={{
                  name: label.name,
                  patterns: label.patterns,
                }}
                errors={errors.labels && errors.labels[index]}
                touched={touched.labels && touched.labels[index]}
                onChangeName={(event) =>
                  setFieldValue(`labels[${index}].name`, event.target.value)
                }
                onChangePatterns={(value) =>
                  setFieldValue(`labels[${index}].patterns`, value)
                }
                onClickRemove={() => arrayHelpers.remove(index)}
                isRemoveDisabled={values.labels.length <= 1}
              />
            ))}
          </Flex>
        )}
      />
    </>
  );
}

export default LabelForm;
