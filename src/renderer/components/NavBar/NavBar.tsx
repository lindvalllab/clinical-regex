import { Flex, Heading, HStack } from '@chakra-ui/layout';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar(): JSX.Element {
  return (
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
          <NavLink to="/annotation-interface" activeClassName="is-active">
            Annotate
          </NavLink>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default NavBar;
