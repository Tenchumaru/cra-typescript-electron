import React from 'react';
import logo from './logo.svg';
import './App.sass';
import { Hello } from './components/Hello';
import { readFile, showMessageBox, showOpenDialog, showSaveDialog } from './main';

interface State {
  result?: number | string;
}

export class App extends React.Component<{}, State> {
  state: State = {}

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
        <button onClick={this.readFile}>Read File</button>
        <button onClick={this.showMessageBox}>Show Message Box</button>
        <button onClick={this.showOpenDialog}>Show Open Dialog</button>
        <button onClick={this.showSaveDialog}>Show Save Dialog</button>
        <br />
        <textarea onChange={this.onChange} value={result} />
      </div>
    );
  }

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = event.currentTarget.value;
    this.setState({ result });
  }

  private readFile = async () => {
    const filePath = await showOpenDialog();
    if (filePath) {
      const result = await readFile(filePath);
      this.setState({ result });
    }
  }

  private showMessageBox = async () => {
    const result = await showMessageBox('Hello from renderer process', ['OK', 'Cancel'], 'App', 'info');
    this.setState({ result });
  }

  private showOpenDialog = async () => {
    const result = await showOpenDialog();
    this.setState({ result });
  }

  private showSaveDialog = async () => {
    const result = await showSaveDialog();
    this.setState({ result });
  }
}
