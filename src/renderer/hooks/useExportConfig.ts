import { useToast } from '@chakra-ui/toast';
import { useContext } from 'react';
import { ApiContext } from '../api';

export default function useExportConfig(): () => Promise<void> {
  const api = useContext(ApiContext);
  const toast = useToast();
  const exportConfig = () => {
    return api
      .exportConfig()
      .then((result) => {
        if (result) {
          toast({
            title: 'Saved!',
            description: `Configuration file successfully exported: ${result}`,
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
          description: 'Error exporting configuration file.',
          status: 'error',
          isClosable: true,
        });
      });
  };

  return exportConfig;
}
