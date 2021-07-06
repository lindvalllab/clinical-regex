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
              <CircularProgress value={props.progress}>
                <CircularProgressLabel>
                  {Math.round(props.progress)}%
                </CircularProgressLabel>
              </CircularProgress>
            </Center>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
