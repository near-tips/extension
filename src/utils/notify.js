import axios from 'axios';

import { HOST } from './constants';
import logger from './logger';

export default async (nicknames, postId) => {
    try {
        const notifyResponse = await axios.post(`${HOST}/v1/notify`, {
            nicknames,
            postId,
        })

        logger.log({ notifyResponse })

        return notifyResponse;
    } catch (err) {
        logger.error(err);
    }
}
