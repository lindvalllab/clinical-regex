import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import NewProject from './pages/NewProject';
import Dashboard from './pages/Dashboard';
import AnnotationInterface from './pages/AnnotationInterface';
import NavBar from './components/NavBar';
import { Box, Flex, ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import '@fontsource/jetbrains-mono';
import '@fontsource/poppins';
import '@fontsource/inter';

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <Flex h="100vh" flexDirection="column">
        <Router>
          <NavBar />
          <Box flexGrow={1}>
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
    </ChakraProvider>
  );
}

export default App;
