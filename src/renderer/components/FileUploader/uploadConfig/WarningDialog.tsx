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
  Flex,
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
          <Flex flexDirection="column" px={6} gridGap={4}>
            {props.warnings.map((message, index) => (
              <Alert
                key={index}
                status={props.status}
                borderRadius="base"
                fontSize="xs"
              >
                <AlertIcon />
                <AlertDescription whiteSpace="pre-wrap">
                  {message}
                </AlertDescription>
              </Alert>
            ))}
          </Flex>
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
