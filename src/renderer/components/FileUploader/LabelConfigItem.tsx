import {
  Button,
  Grid,
  FormControl,
  FormLabel,
  GridItem,
  Input,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import PatternInput from './PatternInput';

type LabelConfigItemProps = {
  onClickRemove: () => void;
  isRemoveDisabled: boolean;
};

const LabelConfigItem = ({
  onClickRemove,
  isRemoveDisabled,
}: LabelConfigItemProps): JSX.Element => {
  return (
    <Grid
      alignItems="flex-end"
      gridRowGap={4}
      gridColumnGap={2}
      borderRadius="base"
      borderWidth={1}
      shadow="sm"
      p={6}
    >
      <GridItem>
        <FormControl>
          <FormLabel>Label Name</FormLabel>
          <Input />
        </FormControl>
      </GridItem>
      <GridItem>
        <FormControl>
          <FormLabel>Pattern</FormLabel>
          <PatternInput inputId={''} value={[]} />
        </FormControl>
      </GridItem>
      <GridItem>
        <Button
          leftIcon={<FaTrash />}
          aria-label="remove"
          onClick={onClickRemove}
          disabled={isRemoveDisabled}
          w="full"
        >
          Remove
        </Button>
      </GridItem>
    </Grid>
  );
};

export default LabelConfigItem;
