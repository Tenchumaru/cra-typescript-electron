import React from 'react';
import logo from './logo.svg';
import './App.sass';
import { Hello } from './components/Hello';
import { showMessageBox } from './main';

interface State {
  result?: number;
}

export class App extends React.Component<{}, State> {
  state: State = {}

  componentDidMount() {
    window.main.onResponse(this.onMainResponse);
  }

  render() {
    const { result } = this.state;
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
        <button onClick={this.showMessageBox}>Show Message Box</button>
        <p>{result}</p>
      </div>
    );
  }

  private onMainResponse = (result: number) => {
    this.setState({ result });
  }

  private showMessageBox = () => {
    showMessageBox('Hello from renderer process');
  }
}
