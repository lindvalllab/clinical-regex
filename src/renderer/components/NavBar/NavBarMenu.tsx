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
import useSaveDb from '../../hooks/useSaveDb';
import PreferencesModal from '../PreferencesModal';

function NavBarMenu(): JSX.Element {
  const history = useHistory();
  const saveDb = useSaveDb();
  const disclosure = useDisclosure();
  const preferences = { ...disclosure, onClick: () => disclosure.onOpen() };

  const newProject = {
    onClick: () => {
      history.push('/upload');
    },
  };
  const saveProject = {
    onClick: () => {
      saveDb();
    },
  };
  const openProject = {
    onClick: () => {
      console.log('Clicked "Open Project');
    },
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
            onClick={saveProject.onClick}
            command="⌘S"
          >
            Save Project
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
