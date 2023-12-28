import log from 'electron-log/renderer';
log.info('Log from the renderer process');

log.transports.console.useStyles = true;


console.log = log.log;