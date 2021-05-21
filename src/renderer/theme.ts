import { extendTheme } from '@chakra-ui/react';
// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  fonts: {
    heading: 'Poppins, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
});

export default theme;
