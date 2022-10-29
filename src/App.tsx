import React from 'react';
import logo from './logo.svg';
import './App.sass';
import { Hello } from './components/Hello';
import { readFile, showMessageBox, showOpenDialog, showSaveDialog, writeFile, delayResponse, subscribe, unsubscribe } from './main';

interface State {
  result?: string;
  time?: string;
}

export class App extends React.Component<{}, State> {
  state: State = {};
  private value: number = 0;

  componentDidMount() {
    subscribe(this.onMessage);
  }

  componentWillUnmount() {
    unsubscribe(this.onMessage);
  }

  render() {
    const { result, time } = this.state;
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
        <button onClick={this.writeFile}>Write File</button>
        <button onClick={this.testDelayResponse}>Test Delay Response</button>
        <button onClick={this.fiveSeconds}>Five Seconds</button>
        <br />
        <textarea onChange={this.onChange} value={result} />
        <br />
        <span>Time from main: <span id="time">{time}</span></span>
      </div>
    );
  }

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = event.currentTarget.value;
    this.setState({ result });
  }

  private onMessage = (time: string) => {
    this.setState({ time });
  }

  private fiveSeconds = async () => {
    ++this.value;
    const result = await delayResponse(5555, this.value.toString());
    this.setState({ result });
  }

  private testDelayResponse = async () => {
    const response5 = delayResponse(5555, 'five');
    const response4 = delayResponse(4444, 'four');
    const response3 = delayResponse(3333, 'three');
    const response2 = delayResponse(2222, 'two');
    const response1 = delayResponse(1111, 'one');
    const responses = await Promise.all([response1, response2, response3, response4, response5]);
    const result = `one is ${responses[0]}\ntwo is ${responses[1]}\nthree is ${responses[2]}\nfour is ${responses[3]}\nfive is ${responses[4]}`;
    this.setState({ result });
  }

  private readFile = async () => {
    try {
      const filePath = await showOpenDialog();
      if (filePath) {
        const result = await readFile(filePath);
        this.setState({ result });
      }
    } catch (ex: any) {
      this.setState({ result: ex.message });
    }
  }

  private showMessageBox = async () => {
    try {
      const result = await showMessageBox('Hello from renderer process', ['OK', 'Cancel'], 'App', 'info');
      this.setState({ result: `Button at position ${result} pressed` });
    } catch (ex: any) {
      this.setState({ result: ex.message });
    }
  }

  private showOpenDialog = async () => {
    try {
      const result = await showOpenDialog();
      this.setState({ result });
    } catch (ex: any) {
      this.setState({ result: ex.message });
    }
  }

  private showSaveDialog = async () => {
    try {
      const result = await showSaveDialog();
      this.setState({ result });
    } catch (ex: any) {
      this.setState({ result: ex.message });
    }
  }

  private writeFile = async () => {
    if (this.state.result) {
      try {
        const filePath = await showSaveDialog();
        if (filePath) {
          await writeFile(filePath, this.state.result);
        }
      } catch (ex: any) {
        this.setState({ result: ex.message });
      }
    }
  }
}
