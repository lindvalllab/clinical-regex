import { Link, useHistory } from 'react-router-dom';
import { Button, ButtonProps, Flex, Heading, Text } from '@chakra-ui/react';
import useLoadDb from '../../hooks/useLoadDb';
import { FaPlus, FaUpload } from 'react-icons/fa';
import { useContext, useEffect } from 'react';
import { ApiContext } from '../../api';

type MainLinkBoxProps = {
  text: string;
  icon?: ButtonProps['leftIcon'];
  href: string;
};

function MainLink(props: MainLinkBoxProps & ButtonProps): JSX.Element {
  return (
    <Button
      as={Link}
      to={props.href}
      leftIcon={props.icon}
      p={10}
      fontSize={24}
      gridGap={4}
      variant="ghost"
      w="full"
      {...props}
    >
      <Text>{props.text}</Text>
    </Button>
  );
}

function Home(): JSX.Element {
  const loadDb = useLoadDb();
  const history = useHistory();
  const api = useContext(ApiContext);
  useEffect(() => {
    // Route to dashboard if there is already work in progress.
    api.projectStarted().then((started) => {
      if (started) history.push('/dashboard');
    });
  }, [api, history]);

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gridGap={8}
      h="full"
      w="full"
    >
      <Heading size="3xl">✨ Clinical Regex</Heading>
      <Flex
        textAlign="center"
        justifyContent="center"
        gridGap={2}
        fontSize="2xl"
      >
        <MainLink icon={<FaPlus />} text="New Project" href="/upload" />
        <MainLink
          icon={<FaUpload />}
          text="Load Project"
          href="#"
          onClick={loadDb}
        />
      </Flex>
    </Flex>
  );
}

export default Home;
