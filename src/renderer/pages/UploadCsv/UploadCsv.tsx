import { Box } from '@chakra-ui/react';
import FileUploader from '../../components/FileUploader';

function UploadCsv(): JSX.Element {
  return (
    <Box display="flex" justifyContent="center">
      <FileUploader />
    </Box>
  );
}

export default UploadCsv;
