import axios from 'axios';

const logger = {
    log: (...messages) => {
        console.log(...messages);
    },
    error: (...errorMessages) => {
        console.error(errorMessages);

        // process.env.NODE_ENV
    },
    warn: (...warnMessages) => {
        console.warn(...warnMessages);
    }
}

export default logger;