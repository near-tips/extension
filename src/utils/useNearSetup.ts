import { useEffect, useState, useCallback } from 'react';
import * as querystring from 'querystring';
import { toast } from 'react-toastify';

import { WORKER_METHODS, FAILURE_MESSAGE } from '../constants';

const useNearSetup = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginFromApp = useCallback((callbackUrl) => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.nearLogin,
            payload: callbackUrl,
        }, (response) => {
            console.log('response', { response })
            setIsLoggedIn(response);
        })
    }, []);

    const logout = useCallback(() => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.logout,
        }, () => {
            console.log('logged out');
            setIsLoggedIn(false);
        })
    }, []);

    useEffect(() => {
        const searchParams = querystring.parse(location.search.slice(1));

        if (searchParams.account_id && searchParams.public_key && searchParams.all_keys) {
            console.log('finish login: ', searchParams);

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

        if (searchParams.transactionHashes) {
            console.log('approving transaction: ', searchParams.transactionHashes);

            chrome.runtime.sendMessage({
                action: WORKER_METHODS.checkTransactionStatus,
                payload: searchParams.transactionHashes,
            }, (response) => {
                // :(
                const isSuccess = response.status.SuccessValue === '';

                if (isSuccess) {
                    toast.success(searchParams.successMessage);
                } else {
                    toast.error(FAILURE_MESSAGE);
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
