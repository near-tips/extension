import axios from 'axios';

import { ERROR_LOGS_HOST } from 'utils/constants';

const logger = {
    log: (...messages) => {
        console.log(...messages);
    },
    error: (...errorMessages) => {
        console.error(errorMessages);

        axios.post(`${ERROR_LOGS_HOST}/v1/handleError`, {
            service: 'Extension',
            error: JSON.stringify(...errorMessages),
            funcName: 'LOL',
            environment: process.env.NODE_ENV,
        }).catch((e) => console.log('Cant handle error', e.response.data.details.body))
    },
    warn: (...warnMessages) => {
        console.warn(...warnMessages);
    }
}

export default logger;