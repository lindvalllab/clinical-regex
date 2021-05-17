import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './Home.css';

function Home(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ul>
          <li>
            <Link to="/upload">Upload a file</Link>
          </li>
          <li>
            <Link to="/texts">View texts</Link>
          </li>
        </ul>
      </header>
    </div>
  );
}

export default Home;
