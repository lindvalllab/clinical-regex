import { Center } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function RedirectHome(): JSX.Element {
  const history = useHistory();
  useEffect(() => {
    const timeout = setTimeout(() => {
      history.push('/');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [history]);
  return (
    <Center h="full" w="full">
      <Link to="/">
        Something went wrong! Click here or wait five seconds to return home.
      </Link>
    </Center>
  );
}
