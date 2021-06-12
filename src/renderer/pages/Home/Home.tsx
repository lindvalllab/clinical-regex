import { Link } from 'react-router-dom';
import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react';
import Logo from '../../components/Logo';
import useLoadDb from '../../hooks/useLoadDb';

type MainLinkBoxProps = {
  text: string;
  icon?: string;
  href: string;
};

function MainLink(props: MainLinkBoxProps & ButtonProps): JSX.Element {
  return (
    <Button
      as={Link}
      to={props.href}
      variant="outline"
      p={10}
      fontSize={24}
      gridGap={4}
      w="full"
      {...props}
    >
      {props.icon ? <Text>{props.icon}</Text> : <></>}
      <Text>{props.text}</Text>
    </Button>
  );
}

function Home(): JSX.Element {
  const loadDb = useLoadDb();
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gridGap={2}
      h="full"
      w="full"
    >
      <Logo maxW="sm" />
      <Flex
        textAlign="center"
        justifyContent="center"
        gridGap={2}
        fontSize="2xl"
      >
        <MainLink icon={'🚀'} text="New Project" href="/upload" />
        <MainLink icon={'📤'} text="Load Project" href="#" onClick={loadDb} />
      </Flex>
    </Flex>
  );
}

export default Home;
