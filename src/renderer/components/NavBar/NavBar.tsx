import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar(): JSX.Element {
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
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

export default NavBar;
