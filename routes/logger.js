var winston = require('winston');

const wLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            (info) => `${info.timestamp}, ${info.level}, ${info.message},`
        )
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/app.log' }),
        new winston.transports.File({ filename: `logs/${('0' + (new Date().getMonth() + 1)).slice(-2)}_${('0' + new Date().getDate()).slice(-2)}_${new Date().getFullYear()}.csv` }),
        new winston.transports.Console()
    ]
});

module.exports = { wLogger };

