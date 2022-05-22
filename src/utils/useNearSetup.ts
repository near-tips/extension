import { useEffect, useState, useCallback } from 'react';
import * as querystring from 'querystring';
import { toast } from 'react-toastify';

import logger from '../utils/logger';
import notify from '../app/notify';
import { WORKER_METHODS } from '../constants';
import { failureMessage, successMessage } from './messages';

const useNearSetup = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginFromApp = useCallback((callbackUrl) => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.nearLogin,
            payload: callbackUrl,
        }, (response) => {
            logger.log('response', { response })
            setIsLoggedIn(response);
        })
    }, []);

    const logout = useCallback(() => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.logout,
        }, () => {
            logger.log('logged out');
            setIsLoggedIn(false);
        })
    }, []);

    useEffect(() => {
        const searchParams = querystring.parse(location.search.slice(1));
        const {
            account_id, public_key, all_keys,
            transactionHashes, nicknames, tipAmount, answerId,
        } = searchParams;

        if (account_id && public_key && all_keys) {
            logger.log('finish login: ', searchParams);

            chrome.runtime.sendMessage({
                action: WORKER_METHODS.finishNearLogin,
                payload: location.search,
            }, (response) => {
                setIsLoggedIn(response);
            })
        } else {
            chrome.runtime.sendMessage({
                action: WORKER_METHODS.getLoggedInStatus,
            }, (response) => {
                setIsLoggedIn(response);
            })
        }

        if (transactionHashes && answerId && nicknames) {
            logger.log('approving transaction: ', searchParams);

            chrome.runtime.sendMessage({
                action: WORKER_METHODS.checkTransactionStatus,
                payload: transactionHashes,
            }, (response) => {
                // :(
                const isSuccess = response.status.SuccessValue === '';

                if (isSuccess) {
                    const formattedNicknames = Array.isArray(nicknames) ? nicknames : [nicknames];

                    notify(formattedNicknames, answerId);
                    toast.success(successMessage(tipAmount, formattedNicknames));
                } else {
                    logger.error(failureMessage, { nicknames, answerId, transactionHashes, tipAmount });
                    toast.error(failureMessage);
                }
            })
        }

        if (window.location.search) {
            const newUrl = new URL(window.location.href);

            newUrl.search = '';

            window.history.replaceState(null, null, newUrl.toString());
        }
    }, [])

    return {
        isLoggedIn,
        setIsLoggedIn,
        loginFromApp,
        logout,
    }
};

export default useNearSetup;
