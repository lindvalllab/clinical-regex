import React, { useContext } from 'react';
import { ApiContext } from '../../api';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { useViewportScroll } from 'framer-motion';
import {
  chakra,
  Button,
  Flex,
  Heading,
  HStack,
  HTMLChakraProps,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import useSaveDb from '../../hooks/useSaveDb';

function NavBar(props: HTMLChakraProps<'header'>): JSX.Element {
  // For color mode toggle
  const bg = useColorModeValue('white', 'gray.800');
  const otherColorModeName = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const { toggleColorMode } = useColorMode();

  const ref = React.useRef<HTMLHeadingElement>(null);
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {};
  const { scrollY } = useViewportScroll();

  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  const api = useContext(ApiContext);

  const onClickLog = async () => {
    console.log('Button clicked');
    const result = await api.getAllTexts();
    console.log(result);
  };
  const onClickSave = useSaveDb();

  return (
    <chakra.header
      ref={ref}
      pos="sticky"
      top="0"
      zIndex="3"
      bg={bg}
      shadow={y > height ? 'sm' : undefined}
      w="full"
      {...props}
    >
      <Flex justifyContent="space-between" p={6} align="center" w="100%">
        <Flex align="center" w="100%">
          <NavLink to="/" exact={true}>
            <Heading size="md">✨ Clinical Regex</Heading>
          </NavLink>
        </Flex>
        <Flex justify="flex-end" align="center" w="100%" maxW="1100px">
          <HStack spacing={5} display={{ base: 'none', sm: 'flex' }}>
            <NavLink to="/" exact={true} activeClassName="is-active">
              Home
            </NavLink>
            <NavLink to="/upload" activeClassName="is-active">
              Upload a file
            </NavLink>
            <NavLink to="/dashboard" activeClassName="is-active">
              Dashboard
            </NavLink>
            <NavLink to="/annotation-interface" activeClassName="is-active">
              Annotate
            </NavLink>
            <IconButton
              size="md"
              fontSize="lg"
              aria-label={`Switch to ${otherColorModeName} mode`}
              variant="ghost"
              color="current"
              ml={{ base: '0', md: '3' }}
              onClick={toggleColorMode}
              icon={<SwitchIcon />}
            />
            <Button onClick={onClickLog}>Log All Texts</Button>
            <Button onClick={onClickSave}>Save</Button>
          </HStack>
        </Flex>
      </Flex>
    </chakra.header>
  );
}

export default NavBar;
