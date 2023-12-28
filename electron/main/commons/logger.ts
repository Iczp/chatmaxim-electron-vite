import log from 'electron-log/main';

// https://www.npmjs.com/package/electron-log

// Optional, initialize the logger for any renderer process
log.initialize({ preload: true });

log.info('%cLog from the main process', 'color: green');
log.info('%cRed text. %cGreen text', 'color: red', 'color: green')
// log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
log.transports.console.useStyles = true;

// log.transports.file.resolvePathFn = () => path.join(APP_DATA, 'logs/main.log');

console.log = log.log;
