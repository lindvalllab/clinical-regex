import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './Home.css';

function Home(): JSX.Element {
  return (
    <div className="Home page">
      <img src={logo} className="Home-logo" alt="logo" />
      <p>
        Edit <code>src/Home.tsx</code> and save to reload.
      </p>
      <a
        className="Home-link"
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
    </div>
  );
}

export default Home;
