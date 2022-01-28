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
    heading: 'IBM Plex Sans, system-ui, sans-serif',
    body: 'IBM Plex Sans, system-ui, sans-serif',
    mono: 'IBM Plex Mono, monospace',
  },
});

export default theme;
