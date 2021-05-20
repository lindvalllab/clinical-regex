import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import UploadCsv from './pages/UploadCsv';
import ViewTexts from './pages/ViewTexts';
import NavBar from './components/NavBar';
import { ChakraProvider } from '@chakra-ui/react';

function App(): JSX.Element {
  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/upload">
              <UploadCsv />
            </Route>
            <Route path="/texts">
              <ViewTexts />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
