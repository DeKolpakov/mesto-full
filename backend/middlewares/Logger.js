const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Создание директории для логов, если она не существует
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Создание транспортов для логов запросов и ошибок
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

// Middleware для логирования запросов
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

// Middleware для логирования ошибок
const logError = (err, req, res, next) => {
  errorLogger.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
  });
  next(err);
};

module.exports = { logRequest, logError };
