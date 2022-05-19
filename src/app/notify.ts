import axios from 'axios';

import { HOST } from '../constants';

export default async (nicknames, postId) => {
    try {
        const notifyResponse = await axios.post(`${HOST}/v1/notify`, {
            nicknames,
            postId,
        })

        console.log({ notifyResponse })

        return notifyResponse;
    } catch (err) {
        console.error(err);
    }
}
