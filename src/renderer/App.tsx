import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import UploadCsv from './pages/UploadCsv';
import ViewTexts from './pages/ViewTexts';
import NavBar from './components/NavBar';
import './App.css';

function App(): JSX.Element {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
