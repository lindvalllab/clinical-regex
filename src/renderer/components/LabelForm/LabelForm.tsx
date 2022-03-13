import { Button, Flex, Text } from '@chakra-ui/react';
import { FieldArray, useFormikContext } from 'formik';
import { LabelFormData } from './types';
import { FaPlus } from 'react-icons/fa';
import LabelFormItem from './LabelFormItem';
import { useContext } from 'react';
import { ColorPaletteContext } from '../../ColorPaletteProvider';

function LabelForm(): JSX.Element {
  const { values, setFieldValue, errors, touched, setFieldTouched } =
    useFormikContext<LabelFormData>();

  const { paletteAsList } = useContext(ColorPaletteContext);

  return (
    <FieldArray
      name="labels"
      render={(arrayHelpers) => (
        <Flex flexDirection="column" gridGap={8}>
          <Flex gridGap={8}>
            <Text fontSize="sm" color="gray">
              <Text as="span" fontWeight="extrabold">
                Tip:{' '}
              </Text>
              To match whole words, use the word boundary regular expression{' '}
              <code>\b</code>. For example, <code>\bliver\b</code> will match{' '}
              <code>liver</code>, but not <code>deliver</code> or{' '}
              <code>livers</code>.
            </Text>

            <Button
              type="button"
              size="md"
              leftIcon={<FaPlus />}
              onClick={() => arrayHelpers.push({ name: '', patterns: [], exclusions: [] })}
              px={12}
            >
              Add Label
            </Button>
          </Flex>

          {values.labels.map((label, index) => (
            <LabelFormItem
              key={index}
              displayNumber={index + 1}
              label={{
                name: label.name,
                patterns: label.patterns,
                exclusions: [],
              }}
              color={paletteAsList[index % paletteAsList.length]}
              errors={errors.labels && errors.labels[index]}
              touched={touched.labels && touched.labels[index]}
              onChangeName={(event) => {
                setFieldValue(`labels[${index}].name`, event.target.value);
              }}
              onChangePatterns={(value) => {
                setFieldValue(`labels[${index}].patterns`, value);
              }}
              onBlurName={() => setFieldTouched(`labels[${index}].name`, true)}
              onBlurPatterns={() =>
                setFieldTouched(`labels[${index}].patterns`, true)
              }
              onClickRemove={() => arrayHelpers.remove(index)}
              isRemoveDisabled={values.labels.length <= 1}
            />
          ))}
        </Flex>
      )}
    />
  );
}

export default LabelForm;
