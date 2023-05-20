const { request } = process.env.DEV_URL.startsWith('http://') ? require('http') : require('https');

function attemptConnection() {
  return new Promise((resolve) => {
    const result = request(process.env.DEV_URL, { family: 4 }, (_response) => resolve(true));
    result.on('error', (_err) => resolve(false));
    result.end();
  });
}

async function doit() {
  console.log(1, 'second');
  for (let i = 0; ; ++i) {
    await new Promise((resolve) => setTimeout(resolve, 999));
    if (await attemptConnection()) {
      process.exit(0);
    }
    console.log(i + 2, 'seconds');
  }
}

doit();
