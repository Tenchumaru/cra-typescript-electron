const { spawn } = require('child_process');

// Set the START_PID environment variable.  The application will use it to stop
// a Visual Studio debugging session.
process.env['START_PID'] = process.pid.toString();
const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['start'], { shell: true });
child.stdout.on('data', process.stdout.write.bind(process.stdout));
child.stderr.on('data', process.stderr.write.bind(process.stderr));
child.on('spawn', () => {
  console.log('spawned NPM, process ID', child.pid);
});
child.on('error', (err) => {
  console.error(err);
});
child.on('exit', () => {
  console.log('done');
});
