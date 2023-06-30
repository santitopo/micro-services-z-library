function killGracefully(error) {
  logError(error);
  process.kill(process.pid, 'SIGTERM');
}

function logError(msg) {
  console.log(`${colors.FgRed}%s${colors.Reset}`, msg); //red
}

function logWarn(msg) {
  console.log(`${colors.FgYellow}%s${colors.Reset}`, msg);
}

function logImportant(msg) {
  console.log(`${colors.FgGreen}%s${colors.Reset}`, msg);
}

function logDuration(endpoint, duration) {
  console.log(JSON.stringify({ endpoint, duration: `${duration} ms` }));
}

const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
};

function terminate(server, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      logError(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    //server.close(exit);
    //setTimeout(exit, options.timeout).unref();
  };
}

module.exports = {
  logError,
  logImportant,
  logWarn,
  logDuration,
  killGracefully,
  terminate
};
