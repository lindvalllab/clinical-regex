import {
  Center,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface ProgressModalProps {
  isOpen: boolean;
  text: string;
  progress: number;
}

export default function ProgressModal(props: ProgressModalProps): JSX.Element {
  return (
    <Modal isOpen={props.isOpen} onClose={() => undefined}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Loading</ModalHeader>
          <ModalBody>
            {props.text}
            <Center>
              {/* API can send a progress of zero to indicate indeterminate */}
              {props.progress > 0 ? (
                <CircularProgress value={props.progress}>
                  <CircularProgressLabel>
                    {Math.round(props.progress)}%
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <CircularProgress isIndeterminate />
              )}
            </Center>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
