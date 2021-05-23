import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  Spacer,
  useColorMode,
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
      <Flex>
        <Text>Theme</Text>
        <Spacer />
        <HStack gridGap={1}>
          <Tooltip label="Light">
            <IconButton
              size="sm"
              fontSize="lg"
              aria-label="Switch to light mode"
              variant="ghost"
              color="current"
              onClick={toggleColorMode}
              icon={<FaSun />}
              isActive={colorMode === 'light'}
            />
          </Tooltip>
          <Tooltip label="Dark">
            <IconButton
              size="sm"
              fontSize="lg"
              aria-label="Switch to dark mode"
              variant="ghost"
              color="current"
              onClick={toggleColorMode}
              icon={<FaMoon />}
              isActive={colorMode === 'dark'}
            />
          </Tooltip>
        </HStack>
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
