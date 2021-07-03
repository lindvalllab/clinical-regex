import {Modal} from '@chakra-ui/react';

function ProgressModal(): JSX.Element {
  return (
    <Modal isOpen={true} onClose={() => undefined}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Loading</ModalHeader>
          <ModalBody>
            {'hi'}
            <Progress value={30} />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
