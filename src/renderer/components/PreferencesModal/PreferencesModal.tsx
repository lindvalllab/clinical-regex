import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Spacer,
  useColorMode,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

type PreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AppearancePreferences(): JSX.Element {
  /** For dark mode toggle */
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Flex alignItems="center">
        <Text>Theme</Text>
        <Spacer />
        <ButtonGroup colorScheme="gray" variant="ghost">
          <Button
            aria-label="Switch to light mode"
            color="current"
            onClick={toggleColorMode}
            leftIcon={<FaSun />}
            isActive={colorMode === 'light'}
          >
            Light
          </Button>
          <Button
            aria-label="Switch to dark mode"
            color="current"
            onClick={toggleColorMode}
            leftIcon={<FaMoon />}
            isActive={colorMode === 'dark'}
          >
            Dark
          </Button>
        </ButtonGroup>
      </Flex>
    </>
  );
}

function PreferencesContent(): JSX.Element {
  return (
    <>
      <Heading size="sm" mb={4}>
        Appearance
      </Heading>
      <AppearancePreferences />
    </>
  );
}

function PreferencesModal(props: PreferencesModalProps): JSX.Element {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottomWidth={1}>Preferences</ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={4}>
          <PreferencesContent />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PreferencesModal;
