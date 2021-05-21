import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import UploadCsv from './pages/UploadCsv';
import AnnotationInterface from './pages/AnnotationInterface';
import NavBar from './components/NavBar';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import '@fontsource/jetbrains-mono';
import '@fontsource/poppins';
import '@fontsource/inter';

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/upload" component={UploadCsv} />
          <Route path="/annotation-interface" component={AnnotationInterface} />
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
