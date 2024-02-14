const { spawn } = require('child_process');

// Set the START_PID environment variable.  The application will use it to stop
// a Visual Studio debugging session.
process.env['START_PID'] = process.pid.toString();
const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['start'], { shell: true });
child.stdout.on('data', (buffer) => {
  process.stdout.write(buffer);
});
child.stderr.on('data', (buffer) => {
  process.stderr.write(buffer);
});
child.on('spawn', () => {
  console.log('spawned NPM, process ID', child.pid);
});
child.on('error', (err) => {
  console.error(err);
});
child.on('exit', () => {
  console.log('done');
});
