const winston = require('winston');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, 'request.log'),
      level: 'info',
    }),
  ],
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
    }),
  ],
});

const logRequest = (req, res, next) => {
  requestLogger.info({
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
};

const logError = (err, req, res, next) => {
  errorLogger.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
  });
  next(err);
};

module.exports = { logRequest, logError };
