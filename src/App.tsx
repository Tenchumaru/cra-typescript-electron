import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.sass';
import { Hello } from './components/Hello';
import { readFile, showMessageBox, showOpenDialog, showSaveDialog, writeFile, delayResponse, subscribe, unsubscribe, startTimer, stopTimer } from './main';

export function App() {
  let value: number = 0;
  const [result, setResult] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => {
    subscribe(onMessage);
    return () => {
      unsubscribe(onMessage);
    }
  }, []);

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
      <button onClick={mainReadFile}>Read File</button>
      <button onClick={mainShowMessageBox}>Show Message Box</button>
      <button onClick={mainShowOpenDialog}>Show Open Dialog</button>
      <button onClick={mainShowSaveDialog}>Show Save Dialog</button>
      <button onClick={mainWriteFile}>Write File</button>
      <button onClick={testDelayResponse}>Test Delay Response</button>
      <button onClick={fiveSeconds}>Five Seconds</button>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={stopTimer}>Stop Timer</button>
      <br />
      <textarea onChange={onChange} value={result} />
      <br />
      <span>Time from main: <span id="time">{time}</span></span>
    </div>
  );

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const result = event.currentTarget.value;
    setResult(result);
  }

  function onMessage(time: string) {
    setTime(time);
  }

  async function fiveSeconds() {
    ++value;
    const result = await delayResponse(5555, value.toString());
    setResult(result);
  }

  async function testDelayResponse() {
    const promise5 = delayResponse(5555, 'five');
    const promise4 = delayResponse(4444, 'four');
    const promise3 = delayResponse(3333, 'three');
    const promise2 = delayResponse(2222, 'two');
    const promise1 = delayResponse(1111, 'one');
    const responses = await Promise.all([promise1, promise2, promise3, promise4, promise5]);
    const result = `one is ${responses[0]}\ntwo is ${responses[1]}\nthree is ${responses[2]}\nfour is ${responses[3]}\nfive is ${responses[4]}`;
    setResult(result);
  }

  async function mainReadFile() {
    try {
      const filePath = await showOpenDialog();
      if (filePath) {
        const result = await readFile(filePath);
        setResult(result);
      }
    } catch (ex: any) {
      setResult(ex.message);
    }
  }

  async function mainShowMessageBox() {
    try {
      const options: Parameters<typeof showMessageBox>[0] = {
        message: 'Hello from renderer process',
        buttons: ['OK', 'Cancel'],
        title: 'App',
        type: 'info'
      };
      const result = await showMessageBox(options);
      setResult(`Button at position ${result} pressed`);
    } catch (ex: any) {
      setResult(ex.message);
    }
  }

  async function mainShowOpenDialog() {
    try {
      const result = await showOpenDialog();
      setResult(result || '');
    } catch (ex: any) {
      setResult(ex.message);
    }
  }

  async function mainShowSaveDialog() {
    try {
      const result = await showSaveDialog();
      setResult(result || '');
    } catch (ex: any) {
      setResult(ex.message);
    }
  }

  async function mainWriteFile() {
    if (result) {
      try {
        const filePath = await showSaveDialog();
        if (filePath) {
          await writeFile(filePath, result);
        }
      } catch (ex: any) {
        setResult(ex.message);
      }
    }
  }
}
