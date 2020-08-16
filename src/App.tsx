import React from 'react';
import logo from './logo.svg';
import './App.sass';
import { Hello } from './components/Hello';

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App__header">
          <img src={logo} className="App__logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> or any other file in the <code>src</code> directory and save to reload.
          </p>
          <a className="App__link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
        </header>
        <Hello name="George" enthusiasmLevel={5} />
      </div>
    );
  }
}
