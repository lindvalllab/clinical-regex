import {
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
} from '@chakra-ui/react';

import {
  FaCog,
  FaPlus,
  FaUpload,
  FaDownload,
  FaChevronDown,
  FaQuestionCircle,
  FaSave,
} from 'react-icons/fa';
import { useHistory } from 'react-router';
import useLoadDb from '../../hooks/useLoadDb';
import useSaveDbAs from '../../hooks/useSaveDbAs';
import PreferencesModal from '../PreferencesModal';

function NavBarMenu(): JSX.Element {
  const history = useHistory();
  const saveDbAs = useSaveDbAs();
  const loadDb = useLoadDb();
  const disclosure = useDisclosure();
  const preferences = { ...disclosure, onClick: () => disclosure.onOpen() };

  const newProject = {
    onClick: () => {
      history.push('/upload');
    },
  };
  const saveProjectAs = {
    onClick: saveDbAs,
  };
  const openProject = {
    onClick: loadDb,
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          rightIcon={<FaChevronDown color="gray" />}
        >
          <Heading size="md">✨ Clinical Regex</Heading>
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaPlus />} onClick={newProject.onClick} command="⌘N">
            New Project
          </MenuItem>
          <MenuItem
            icon={<FaUpload />}
            onClick={openProject.onClick}
            command="⌘O"
          >
            Load Project
          </MenuItem>
          <MenuItem
            icon={<FaSave />}
            onClick={saveProjectAs.onClick}
            command="⌘⇧S"
          >
            Save Project As
          </MenuItem>
          <MenuItem icon={<FaDownload />} command="⌘E">
            Export
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaCog />} onClick={preferences.onClick} command="⌘,">
            Preferences
          </MenuItem>
          <MenuItem icon={<FaQuestionCircle />}>Help</MenuItem>
        </MenuList>
      </Menu>
      <PreferencesModal
        isOpen={preferences.isOpen}
        onClose={preferences.onClose}
      />
    </>
  );
}

export default NavBarMenu;
