import winston from 'winston';


const logger = winston.createLogger({
  level: 'error', // or 'error', 'debug', etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // or use `winston.format.simple()` for plain text
  ),
  transports: [
    new winston.transports.File({ filename: 'logfile.log' }),
    new winston.transports.Console() // optional: logs to console
  ],
});


export default logger;