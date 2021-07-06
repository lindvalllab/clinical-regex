import { useToast } from '@chakra-ui/toast';
import { useContext } from 'react';
import { ApiContext } from '../api';

export default function useExportMatches(): () => Promise<void> {
  // TODO: include an indicator that something is happening
  // when the export takes a long time.
  const api = useContext(ApiContext);
  const toast = useToast();
  const exportMatches = () => {
    return api
      .exportMatches()
      .then((result) => {
        if (result) {
          toast({
            title: 'Saved!',
            description: `File successfully exported: ${result}`,
            status: 'success',
            isClosable: true,
          });
        } else {
          toast({
            title: 'Export cancelled.',
            status: 'warning',
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Error exporting file.',
          status: 'error',
          isClosable: true,
        });
      });
  };

  return exportMatches;
}
