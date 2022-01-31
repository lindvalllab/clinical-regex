import { Icon, IconProps } from '@chakra-ui/react';
import { ReactComponent as LogoIcon } from './logo_icon.svg';
import { ReactComponent as LogoMain } from './logo_main.svg';

type LogoProps = {
  type?: 'main' | 'icon';
} & IconProps;

function Logo(props: LogoProps): JSX.Element {
  const svg = props.type === 'main' ? LogoMain : LogoIcon;
  return <Icon as={svg} {...props} />;
}

export default Logo;
