import * as React from 'react';
import { useCallback, useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios';

import {DEFAULT_TIPS_STORAGE_KEY, DEFAULT_TIPS, WORKER_METHODS} from '../constants';
import useNearSetup from '../utils/useNearSetup';
import Button from './Button';

const HOST = 'https://api.near-tips.com';

const ButtonContainer = ({ answers }) => {
    const { isLoggedIn, loginFromApp } = useNearSetup();
    const [tipAmount, setTipAmount] = useState(DEFAULT_TIPS);

    useEffect(() => {
        chrome.storage.local.get([DEFAULT_TIPS_STORAGE_KEY], result => {
            console.log('default tip: ', { result })
            const defaultTip = result[DEFAULT_TIPS_STORAGE_KEY];

            if (defaultTip) {
                console.log({ defaultTip })
                setTipAmount(defaultTip);
            }
        })

        const listener = (change) => {
            console.log('default tip amount changed: ', change);

            setTipAmount(change[DEFAULT_TIPS_STORAGE_KEY].newValue);
        };

        chrome.storage.onChanged.addListener(listener)

        return () => {
            chrome.storage.onChanged.removeListener(listener);
        }
    }, []);

    const handleClick = useCallback(async ({ authorIds, authorNicknames, answerId }) => {
        if (!isLoggedIn) {
            loginFromApp()
        }

        console.log({ authorIds, tipAmount })
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.send_tips,
            payload: {
                authorIds,
                tipAmount,
            }
        }, () => {
            console.log('tips was sent successfully')

            if (false) {
                axios.post(`${HOST}/v1/notify`, {
                    nicknames: authorNicknames,
                    postId: answerId,
                }).then(notifyResponse => {
                    console.log({notifyResponse})
                })
            }
        })
    }, [tipAmount, isLoggedIn]);

    return answers.map((answer, index) => {
        return ReactDOM.createPortal(
            <Button
                key={index}
                onClick={handleClick.bind(null, answer)}
                isSignedIn={isLoggedIn}
            />,
            answer.container
        )
    })
}

export default ButtonContainer;
