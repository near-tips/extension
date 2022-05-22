import * as React from 'react';
import { useCallback, useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { toast } from 'react-toastify';
import * as queryString from 'querystring';

import { successMessage, failureMessage, pendingMessage } from '../utils/messages';
import { DEFAULT_TIPS_STORAGE_KEY, DEFAULT_TIPS, WORKER_METHODS, LOCAL_STORAGE_KEY } from '../constants';
import useNearSetup from '../utils/useNearSetup';
import logger from '../utils/logger';
import Button from './Button';
import notify from './notify';

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
            logger.log('default tip: ', defaultTip);

            if (defaultTip) {
                setTipAmount(defaultTip);
            }
        })

        const listener = (change) => {
            logger.log('default tip amount changed: ', change);

            if (change[DEFAULT_TIPS_STORAGE_KEY]) {
                setTipAmount(change[DEFAULT_TIPS_STORAGE_KEY].newValue);
            }
            if (change[LOCAL_STORAGE_KEY]) {
                const oldValueKeysLength = Object.keys(change[LOCAL_STORAGE_KEY].oldValue).length;
                const newValueKeysLength = Object.keys(change[LOCAL_STORAGE_KEY].newValue).length;

                if (oldValueKeysLength !== newValueKeysLength) {
                    logger.log(change[LOCAL_STORAGE_KEY]);
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

        logger.log({ authorIds, tipAmount })

        callbackUrl.search = queryString.stringify({
            tipAmount,
            nicknames: authorNicknames,
            answerId,
        });

        await toast.promise(
            () => sendTips({ authorIds, tipAmount, callbackUrl: callbackUrl }),
            {
                pending: pendingMessage(tipAmount, authorNicknames),
                success: {
                    render() {
                        logger.log('tips was sent successfully');

                        notify(authorNicknames, answerId);

                        return successMessage(tipAmount, authorNicknames);
                    }
                },
                error: failureMessage,
            }
        )
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
