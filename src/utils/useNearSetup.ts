import { useEffect, useRef, useState, useCallback } from 'react';

import { connectWallet, getContract } from './near-utils';

import { WORKER_METHODS } from '../constants';

const useNearSetup = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginFromApp = useCallback(() => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.nearLogin,
            payload: window.location.href,
        }, (response) => {
            console.log('response', { response })
            setIsLoggedIn(response);
        })
    }, []);

    console.log({isLoggedIn})
    useEffect(() => {
        console.log('aaa', {
            ss: location.search,
        });
        if (location.search) {
            chrome.runtime.sendMessage({
                action: WORKER_METHODS.finishNearLogin,
                payload: location.search,
            }, (response) => {
                setIsLoggedIn(response);
            })
            location.search = ''
        } else {
            chrome.runtime.sendMessage({
                action: WORKER_METHODS.getLoggedInStatus,
            }, (response) => {
                setIsLoggedIn(response);
            })
        }
    }, [])

    return {
        isLoggedIn,
        setIsLoggedIn,
        loginFromApp,
    }
};

export default useNearSetup;
