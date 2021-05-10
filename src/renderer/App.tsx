import React from 'react';
import logo from './logo.svg';
import { api } from './api';
import FileUploader from './FileUploader';
import './App.css';

function App(): JSX.Element {
  const onClick = async () => {
    console.log('Button clicked');
    const result = await api.getById('texts', 1);
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
        <button onClick={onClick}>Test</button>
        <FileUploader />
      </header>
    </div>
  );
}

export default App;
