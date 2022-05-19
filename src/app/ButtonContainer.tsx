import * as React from 'react';
import { useCallback, useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios';
import { toast } from 'react-toastify';

import { DEFAULT_TIPS_STORAGE_KEY, DEFAULT_TIPS, WORKER_METHODS, LOCAL_STORAGE_KEY, FAILURE_MESSAGE } from '../constants';
import useNearSetup from '../utils/useNearSetup';
import Button from './Button';
import * as queryString from "querystring";

const HOST = 'https://api.near-tips.com';

const sendTips = ({ authorIds, tipAmount, callbackUrl }) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.send_tips,
            payload: {
                authorIds,
                tipAmount,
                callbackUrl,
            }
        }, (isSuccess) => {
            if (isSuccess) {
                resolve()
            } else {
                reject()
            }
        });
    })
}

const ButtonContainer = ({ answers }) => {
    const { isLoggedIn, loginFromApp, setIsLoggedIn } = useNearSetup();
    const [tipAmount, setTipAmount] = useState(DEFAULT_TIPS);

    useEffect(() => {
        chrome.storage.local.get([DEFAULT_TIPS_STORAGE_KEY], result => {
            const defaultTip = result[DEFAULT_TIPS_STORAGE_KEY];
            console.log('default tip: ', defaultTip);

            if (defaultTip) {
                setTipAmount(defaultTip);
            }
        })

        const listener = (change) => {
            console.log('default tip amount changed: ', change);

            if (change[DEFAULT_TIPS_STORAGE_KEY]) {
                setTipAmount(change[DEFAULT_TIPS_STORAGE_KEY].newValue);
            }
            if (change[LOCAL_STORAGE_KEY]) {
                const oldValueKeysLength = Object.keys(change[LOCAL_STORAGE_KEY].oldValue).length;
                const newValueKeysLength = Object.keys(change[LOCAL_STORAGE_KEY].newValue).length;

                if (oldValueKeysLength !== newValueKeysLength) {
                    console.log(change[LOCAL_STORAGE_KEY]);
                    if (newValueKeysLength < oldValueKeysLength) {
                        setIsLoggedIn(false);
                    } else if (newValueKeysLength > oldValueKeysLength) {
                        setIsLoggedIn(true);
                    }
                }
            }
        };

        chrome.storage.onChanged.addListener(listener)

        return () => {
            chrome.storage.onChanged.removeListener(listener);
        }
    }, []);

    const handleClick = useCallback(async ({ authorIds, authorNicknames, answerId }) => {
        const callbackUrl = new URL(window.location.toString());

        if (!callbackUrl.hash) {
            callbackUrl.hash = answerId;
        }

        if (!isLoggedIn) {
            loginFromApp(callbackUrl)
            return;
        }

        console.log({ authorIds, tipAmount })

        const successMessage = `🦄 Well done! You've sent ${tipAmount} Ⓝ to ${authorNicknames.join(', ')}`;
        const pendingMessage = `⏳ You're sending ${tipAmount} Ⓝ to ${authorNicknames.join(', ')}`;

        callbackUrl.search = queryString.stringify({
            successMessage,
            answerId,
        });

        await toast.promise(
            () => sendTips({ authorIds, tipAmount, callbackUrl: callbackUrl }),
            {
                pending: pendingMessage,
                success: successMessage,
                error: FAILURE_MESSAGE,
            }
        )

        console.log('tips was sent successfully')

        axios.post(`${HOST}/v1/notify`, {
            nicknames: authorNicknames,
            postId: answerId,
        }).then(notifyResponse => {
            console.log({notifyResponse})
        }).catch(err => {
            console.error(err);
        })
    }, [tipAmount, isLoggedIn]);

    return answers.map((answer, index) => {
        return ReactDOM.createPortal(
            <Button
                key={index}
                onClick={handleClick.bind(null, answer)}
            />,
            answer.container
        )
    })
}

export default ButtonContainer;
