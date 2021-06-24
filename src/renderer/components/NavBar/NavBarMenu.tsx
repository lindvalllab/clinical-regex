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
import { useContext, useEffect, useState } from 'react';
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
import { menuEntries } from '../../../menu';
import { ApiContext, HandleMenuEntryContext } from '../../api';
import useExportAnnotations from '../../hooks/useExportAnnotations';
import useLoadDb from '../../hooks/useLoadDb';
import useSaveDbAs from '../../hooks/useSaveDbAs';
import PreferencesModal from '../PreferencesModal';
import UnsavedProgressDialog from './UnsavedProgressDialog';

function NavBarMenu(): JSX.Element {
  const history = useHistory();
  const saveDbAs = useSaveDbAs();
  const loadDb = useLoadDb();
  const exportAnnotations = useExportAnnotations();
  const disclosure = useDisclosure();
  const preferences = { ...disclosure, onClick: disclosure.onToggle };
  const handleMenuEntry = useContext(HandleMenuEntryContext);
  const api = useContext(ApiContext);

  const [newProjectDialogVisible, setNewProjectDialogVisible] =
    useState<boolean>(false);
  const [openProjectDialogVisible, setOpenProjectDialogVisible] =
    useState<boolean>(false);

  const newProject = {
    onClick: () => {
      if (api.connectedToTempDb() && api.projectStarted()) {
        setNewProjectDialogVisible(true);
      } else history.push('/upload');
    },
  };
  const saveProjectAs = {
    onClick: saveDbAs,
  };
  const openProject = {
    onClick: () => {
      if (api.connectedToTempDb() && api.projectStarted()) {
        setOpenProjectDialogVisible(true);
      } else loadDb();
    },
  };
  const exportProject = {
    onClick: exportAnnotations,
  };

  // Associate menu actions to the electron menu.
  useEffect(() => {
    handleMenuEntry[menuEntries.NEW_PROJECT](newProject.onClick);
  }, [handleMenuEntry, newProject.onClick]);
  useEffect(() => {
    handleMenuEntry[menuEntries.LOAD_PROJECT](openProject.onClick);
  }, [handleMenuEntry, openProject.onClick]);
  useEffect(() => {
    handleMenuEntry[menuEntries.SAVE_AS](saveProjectAs.onClick);
  }, [handleMenuEntry, saveProjectAs.onClick]);
  useEffect(() => {
    handleMenuEntry[menuEntries.EXPORT_PROJECT](exportProject.onClick);
  }, [exportProject.onClick, handleMenuEntry]);
  useEffect(() => {
    handleMenuEntry[menuEntries.PREFERENCES](preferences.onClick);
  }, [handleMenuEntry, preferences.onClick]);

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
          <MenuItem
            icon={<FaDownload />}
            onClick={exportProject.onClick}
            command="⌘E"
          >
            Export
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaCog />} onClick={preferences.onClick} command="⌘,">
            Preferences
          </MenuItem>
          <MenuItem icon={<FaQuestionCircle />} isDisabled>
            Help
          </MenuItem>
        </MenuList>
      </Menu>
      <PreferencesModal
        isOpen={preferences.isOpen}
        onClose={preferences.onClose}
      />
      <UnsavedProgressDialog // New project dialog
        isOpen={newProjectDialogVisible}
        onClose={() => setNewProjectDialogVisible(false)}
        header="New Project"
        onConfirm={async () => {
          await api.deleteTempDb();
          await api.loadDbFromPath(); // Connect to a new temporary database.
          setNewProjectDialogVisible(false);
          history.push('/upload');
        }}
      />
      <UnsavedProgressDialog // Open project dialog
        isOpen={openProjectDialogVisible}
        onClose={() => setOpenProjectDialogVisible(false)}
        header="Load Project"
        onConfirm={async () => {
          setOpenProjectDialogVisible(false);
          loadDb();
        }}
      />
    </>
  );
}

export default NavBarMenu;
