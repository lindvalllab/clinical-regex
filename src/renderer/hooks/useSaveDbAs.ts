import { useToast } from '@chakra-ui/toast';
import { useContext } from 'react';
import { ApiContext } from '../api';

export default function useSaveDbAs(): () => void {
  const api = useContext(ApiContext);
  const toast = useToast();
  const saveDbAs = () => {
    api
      .saveDbAs()
      .then((result) => {
        if (result) {
          toast({
            title: 'Saved!',
            description: `File successfully saved: ${result}`,
            status: 'success',
            isClosable: true,
          });
        } else {
          toast({
            title: 'Save cancelled.',
            status: 'warning',
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Error saving file.',
          status: 'error',
          isClosable: true,
        });
      });
  };

  return saveDbAs;
}
