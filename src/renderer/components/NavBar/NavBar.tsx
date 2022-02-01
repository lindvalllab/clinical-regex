import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useViewportScroll } from 'framer-motion';
import {
  chakra,
  Flex,
  HStack,
  HTMLChakraProps,
  useColorModeValue,
} from '@chakra-ui/react';
import NavBarMenu from './NavBarMenu';
import { ApiContext } from '../../api';

const activeStyle: React.CSSProperties = {
  fontWeight: 'bold',
};

function NavBarContent(): JSX.Element {
  const api = useContext(ApiContext);
  const location = useLocation();
  const [isProjectStarted, setIsProjectStarted] = useState(false);

  useEffect(() => {
    api.projectStarted().then(setIsProjectStarted);
  }, [api, location.hash]);

  return (
    <Flex justifyContent="space-between" p={6} align="center" w="100%">
      <Flex align="center" w="100%">
        <NavBarMenu />
      </Flex>
      <Flex
        hidden={!isProjectStarted}
        justify="flex-end"
        align="center"
        w="100%"
        maxW="1100px"
      >
        <HStack spacing={5} display={{ base: 'none', sm: 'flex' }}>
          <NavLink to="/dashboard" activeStyle={activeStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/annotation-interface?page=0" activeStyle={activeStyle}>
            Annotate
          </NavLink>
        </HStack>
      </Flex>
    </Flex>
  );
}

function NavBar(props: HTMLChakraProps<'header'>): JSX.Element {
  // For color mode toggle
  const bg = useColorModeValue('white', 'gray.800');

  const ref = React.useRef<HTMLHeadingElement>(null);
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {};
  const { scrollY } = useViewportScroll();

  useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);

  return (
    <chakra.header
      ref={ref}
      shadow={y > height ? 'sm' : undefined}
      pos="sticky"
      top="0"
      zIndex="3"
      bg={bg}
      left="0"
      right="0"
      w="full"
      {...props}
    >
      <NavBarContent />
    </chakra.header>
  );
}

export default NavBar;
