import { Link } from 'react-router-dom';
import logo from './logo.svg';
import {
  Flex,
  Image,
  keyframes,
  usePrefersReducedMotion,
} from '@chakra-ui/react';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

function Home(): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;
  return (
    <Flex
      textAlign="center"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      fontSize="2xl"
    >
      <Image
        src={logo}
        alt="logo"
        height="sm"
        animation={animation}
        pointerEvents="none"
      />
      <p>
        Edit <code>src/Home.tsx</code> and save to reload.
      </p>
      <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
      <ul>
        <li>
          <Link to="/upload">Upload a file</Link>
        </li>
        <li>
          <Link to="/texts">View texts</Link>
        </li>
      </ul>
    </Flex>
  );
}

export default Home;
