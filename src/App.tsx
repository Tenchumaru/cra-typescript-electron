import React, { Component } from 'react';
import logo from './logo.svg';
import './App.sass';
import Hello from './components/Hello';

class App extends Component {
  private tesst = async () => {
    await fetch('');
  }

  render() {
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
        </header>
        <Hello name="George" enthusiasmLevel={5} />
      </div>
    );
  }
}

export default App;
