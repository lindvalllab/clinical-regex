import { useContext } from 'react';
import { ApiContext } from './api';
import logo from './logo.svg';
import FileUploader from './FileUploader';
import styled from 'styled-components';
import TextDisplay from './TextDisplay/TextDisplay';
import './App.css';

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid white;
  color: white;
  margin: 0.5em 1em;
  padding: 0.25em 1em;
`;

function App(): JSX.Element {
  const api = useContext(ApiContext);
  const onClick = async () => {
    console.log('Button clicked');
    const result = await api.getAllTexts();
    console.log(result);
  };

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
        <Button onClick={onClick}>Log all Text objects to console</Button>
        <FileUploader />
        <TextDisplay />
      </header>
    </div>
  );
}

export default App;
