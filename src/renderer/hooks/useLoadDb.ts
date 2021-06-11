import { useToast } from '@chakra-ui/toast';
import { useContext } from 'react';
import { ApiContext } from '../api';

export default function useLoadDb(): () => void {
  const api = useContext(ApiContext);
  const toast = useToast();
  const loadDb = () => {
    api
      .loadDb()
      .then((result) => {
        if (result) {
          toast({
            title: 'Loaded!',
            description: `File successfully loaded: ${result}`,
            status: 'success',
            isClosable: true,
          });
        } else {
          toast({
            title: 'Load cancelled.',
            status: 'warning',
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Error loading file.',
          status: 'error',
          isClosable: true,
        });
      });
  };

  return loadDb;
}
