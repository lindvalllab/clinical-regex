import { useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ApiContext } from '../api';

export default function useLoadDb(): () => void {
  const api = useContext(ApiContext);
  const history = useHistory();
  const toast = useToast();
  const loadDb = () => {
    api
      .loadDb()
      .then((result) => {
        if (result) {
          api.deleteTempDb();
          history.push('/dashboard');
          history.go(0);
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
