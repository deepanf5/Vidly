import winston from 'winston';
import 'winston-mongodb';


const logger = winston.createLogger({
  level: 'error', // or 'error', 'debug', etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // or use `winston.format.simple()` for plain text
  ),
  transports: [
    new winston.transports.File({ filename: 'logfile.log' }),
    new winston.transports.Console(), // optional: logs to console
    new winston.transports.MongoDB({
      db:"mongodb://127.0.0.1:27017/Vidly",
      collection:"log",
      level:'error',
      options:{useUnifiedTopology:true}
    })
  ],
});


export default logger;