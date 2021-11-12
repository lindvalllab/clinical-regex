import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import NewProject from './pages/NewProject';
import Dashboard from './pages/Dashboard';
import AnnotationInterface from './pages/AnnotationInterface';
import NavBar from './components/NavBar';
import { Box, Flex, ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/poppins/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import { ColorPaletteProvider } from './ColorPaletteProvider';

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <ColorPaletteProvider>
        <Flex h="100vh" flexDirection="column">
          <Router>
            <Box flexGrow={1}>
              <NavBar />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/upload" component={NewProject} />
                <Route path="/dashboard" component={Dashboard} />
                <Route
                  path="/annotation-interface"
                  component={AnnotationInterface}
                />
              </Switch>
            </Box>
          </Router>
        </Flex>
      </ColorPaletteProvider>
    </ChakraProvider>
  );
}

export default App;
