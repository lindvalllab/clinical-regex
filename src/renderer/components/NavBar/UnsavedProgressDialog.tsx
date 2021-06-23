import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React from 'react';

interface UnsavedProgressDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  header: string;
}

export default function UnsavedProgressDialog(
  props: UnsavedProgressDialogProps
): JSX.Element {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{props.header}</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? Unsaved progress will be lost.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.onClose}>
              Cancel
            </Button>
            <Button onClick={props.onConfirm} colorScheme="red" ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
