import { useToast } from '@chakra-ui/toast';
import { useContext } from 'react';
import { ApiContext } from '../api';

export default function useExportAnnotations(): () => void {
  const api = useContext(ApiContext);
  const toast = useToast();
  const exportAnnotations = () => {
    api
      .exportAnnotations()
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

  return exportAnnotations;
}
