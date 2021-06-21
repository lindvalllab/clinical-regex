import { useFormControlContext, FormErrorMessageProps } from '@chakra-ui/react';
import {
  chakra,
  forwardRef,
  omitThemingProps,
  StylesProvider,
  useMultiStyleConfig,
} from '@chakra-ui/system';
import { cx } from '@chakra-ui/utils';

/**
 * This is basically a copy of the default Chakra FormErrorMessage
 * that only changes to visibility: hidden rather than returning
 * null, in order to create a component that doesn't push the surrounding
 * page content around.
 */

const FormErrorMessage = forwardRef<FormErrorMessageProps, 'div'>(
  (props, ref) => {
    const styles = useMultiStyleConfig('FormError', props);
    const ownProps = omitThemingProps(props);
    const field = useFormControlContext();

    return (
      <StylesProvider value={styles}>
        <chakra.div
          {...field?.getErrorMessageProps(ownProps, ref)}
          className={cx('chakra-form__error-message', props.className)}
          __css={{
            display: 'flex',
            alignItems: 'center',
            ...styles.text,
            visibility: !field.isInvalid ? 'hidden' : 'visible',
          }}
        />
      </StylesProvider>
    );
  }
);

export default FormErrorMessage;
