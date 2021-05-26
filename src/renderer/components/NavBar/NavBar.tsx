import React, { useContext } from 'react';
import { ApiContext } from '../../api';
import { NavLink } from 'react-router-dom';
import { useViewportScroll } from 'framer-motion';
import {
  chakra,
  Button,
  Flex,
  HStack,
  HTMLChakraProps,
  useColorModeValue,
} from '@chakra-ui/react';
import NavBarMenu from './NavBarMenu';

const activeStyle: React.CSSProperties = {
  fontWeight: 'bold',
};

function NavBar(props: HTMLChakraProps<'header'>): JSX.Element {
  // For color mode toggle
  const bg = useColorModeValue('white', 'gray.800');

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
    console.log('Texts');
    const texts = await api.getAllTexts();
    console.log(texts);
    console.log('Labels');
    const labels = await api.getAllLabels();
    console.log(labels);
    console.log('Annotations');
    const annotations = await api.getAllAnnotations();
    console.log(annotations);
  };

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
          <NavBarMenu />
        </Flex>
        <Flex justify="flex-end" align="center" w="100%" maxW="1100px">
          <HStack spacing={5} display={{ base: 'none', sm: 'flex' }}>
            <NavLink to="/" exact={true} activeStyle={activeStyle}>
              Home
            </NavLink>
            <NavLink to="/dashboard" activeStyle={activeStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/annotation-interface" activeStyle={activeStyle}>
              Annotate
            </NavLink>
            <Button onClick={onClickLog}>Log All Texts</Button>
          </HStack>
        </Flex>
      </Flex>
    </chakra.header>
  );
}

export default NavBar;
