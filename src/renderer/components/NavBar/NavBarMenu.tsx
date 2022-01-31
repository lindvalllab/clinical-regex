import {
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  HStack,
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
import useExportConfig from '../../hooks/useExportConfig';
import useExportAnnotations from '../../hooks/useExportAnnotations';
import useExportMatches from '../../hooks/useExportMatches';
import useLoadDb from '../../hooks/useLoadDb';
import useSaveDbAs from '../../hooks/useSaveDbAs';
import PreferencesModal from '../PreferencesModal';
import ProgressModal from '../ProgressModal';
import UnsavedProgressDialog from './UnsavedProgressDialog';
import Logo from '../Logo';

function NavBarMenu(): JSX.Element {
  const history = useHistory();
  const saveDbAs = useSaveDbAs();
  const loadDb = useLoadDb();
  const exportConfigFile = useExportConfig();
  const exportAnnotations = useExportAnnotations();
  const exportMatches = useExportMatches();
  const disclosure = useDisclosure();
  const preferences = { ...disclosure, onClick: disclosure.onToggle };
  const handleMenuEntry = useContext(HandleMenuEntryContext);
  const api = useContext(ApiContext);

  const [newProjectDialogVisible, setNewProjectDialogVisible] =
    useState<boolean>(false);
  const [openProjectDialogVisible, setOpenProjectDialogVisible] =
    useState<boolean>(false);
  const [exportMatchesProgressVisible, setExportMatchesProgressVisible] =
    useState<boolean>(false);
  const [exportConfigVisible, setExportConfigVisible] =
    useState<boolean>(false);

  const newProject = {
    onClick: async () => {
      if ((await api.connectedToTempDb()) && (await api.projectStarted())) {
        setNewProjectDialogVisible(true);
      } else history.push('/upload');
    },
  };
  const saveProjectAs = {
    onClick: saveDbAs,
  };
  const openProject = {
    onClick: async () => {
      if ((await api.connectedToTempDb()) && (await api.projectStarted())) {
        setOpenProjectDialogVisible(true);
      } else loadDb();
    },
  };
  const exportProjectAnnotations = {
    onClick: async () => {
      setExportMatchesProgressVisible(true);
      try {
        await exportAnnotations();
      } finally {
        setExportMatchesProgressVisible(false);
      }
    },
  };
  const exportProjectMatches = {
    onClick: async () => {
      setExportMatchesProgressVisible(true);
      try {
        await exportMatches();
      } finally {
        setExportMatchesProgressVisible(false);
      }
    },
  };
  const exportConfig = {
    onClick: async () => {
      setExportConfigVisible(true);
      try {
        await exportConfigFile();
      } finally {
        setExportConfigVisible(false);
      }
    },
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
    handleMenuEntry[menuEntries.EXPORT_ANNOTATIONS](
      exportProjectAnnotations.onClick
    );
  }, [exportProjectAnnotations.onClick, handleMenuEntry]);
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
          <HStack gap={2}>
            <Logo boxSize={8} />
            <Heading size="md">Clinical Regex</Heading>
          </HStack>
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
            onClick={exportProjectAnnotations.onClick}
            command="⌘E"
          >
            Export Annotations
          </MenuItem>
          <MenuItem
            icon={<FaDownload />}
            onClick={exportProjectMatches.onClick}
          >
            Export Keyword Matches
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaDownload />} onClick={exportConfig.onClick}>
            Export Configuration
          </MenuItem>
          <MenuDivider />{' '}
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
      <ProgressModal
        isOpen={exportMatchesProgressVisible}
        text="Exporting..."
        progress={0}
      />
      <ProgressModal
        isOpen={exportConfigVisible}
        text="Exporting configuration file..."
        progress={0}
      />
    </>
  );
}

export default NavBarMenu;
