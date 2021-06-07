import { useRef } from 'react';
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Button,
} from '@chakra-ui/react';

interface WarningDialogProps {
  title: string;
  status: 'warning' | 'error';
  warnings: string[];
  setWarnings: (warnings: string[]) => void;
}

function WarningDialog(props: WarningDialogProps): JSX.Element {
  const okRef = useRef<HTMLButtonElement>(null);
  const onClose = () => props.setWarnings([]);
  function createAlert(message: string) {
    return (
      <Alert status={props.status} mb={5} borderRadius={30}>
        <AlertIcon />
        <AlertDescription whiteSpace="pre-wrap">{message}</AlertDescription>
      </Alert>
    );
  }
  return (
    <AlertDialog
      isOpen={props.warnings.length > 0}
      leastDestructiveRef={okRef}
      onClose={onClose}
      size="xl"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {props.title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          {props.warnings.map(createAlert)}
          <AlertDialogFooter>
            <Button onClick={onClose} ref={okRef}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default WarningDialog;
