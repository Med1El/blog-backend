import winston from 'winston';

const customConsoleFormat = winston.format.printf(({ level, timestamp, message, stack, ...rest }) => {

    // const additionalParts = Array.isArray(splat) ? splat.join(' ') : '';
    return `${timestamp} : ${level.toUpperCase()}: ${message} \n ${JSON.stringify(rest)} \n ${stack}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                customConsoleFormat
            ),
        }),
    ],
});

export default logger;