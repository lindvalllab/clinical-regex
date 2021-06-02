import {
  Image,
  ImageProps,
  keyframes,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import logo from './logo.svg';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

function Logo(props: ImageProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;
  return (
    <Image
      src={logo}
      alt="Clinical Regex Logo"
      animation={animation}
      {...props}
    />
  );
}

export default Logo;
