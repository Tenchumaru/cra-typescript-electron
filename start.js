const { spawn } = require('child_process');

const child = spawn('npm.cmd', ['start'], { shell: true });
child.stdout.on('data', (arg) => {
  console.log(arg.toString());
});
child.stderr.on('data', (arg) => {
  console.error(arg.toString());
});
