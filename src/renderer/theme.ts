import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'body, #root': {
        minHeight: '100vh',
      },
    },
  },
  fonts: {
    heading: 'Poppins, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
});

export default theme;
