import log from 'electron-log/main';

// Optional, initialize the logger for any renderer process
log.initialize({ preload: true });

log.info('Log from the main process');

// log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

console.log = log.log;