import * as React from 'react';
import { useCallback, useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios';
import { utils } from 'near-api-js';

import { signIn, DEFAULT_GAS } from '../utils/near-utils';
import { DEFAULT_TIPS_STORAGE_KEY, DEFAULT_TIPS } from '../constants';
import useNearSetup from '../utils/useNearSetup';
import Button from './Button';

const HOST = 'https://api.near-tips.com';

const ButtonContainer = ({ answers }) => {
    const { wallet, contract } = useNearSetup();
    const [tipAmount, setTipAmount] = useState(DEFAULT_TIPS);

    useEffect(() => {
        chrome.storage.local.get([DEFAULT_TIPS_STORAGE_KEY], result => {
            const defaultTip = Number(result[DEFAULT_TIPS_STORAGE_KEY]);

            if (defaultTip) {
                setTipAmount(defaultTip);
            }
        })
    }, []);

    const handleClick = useCallback(async ({ authorIds, authorNicknames, answerId }) => {
        if (!wallet.isSignedIn() || !contract.current) {
            return signIn(wallet);
        }

        contract.current.get_deposit_account_id({ account_id: wallet.account().accountId }).then(res => {
            console.log({res});
        })

        return;

        console.log('Paying tips to: ', authorIds);

        console.log({ authorNicknames, answerId })

        // todo: make notify after making tip
        // notify user with authorNicknames and answerId
        const notifyResponse = await axios.post(`${HOST}/v1/notify`, {
            nicknames: authorNicknames,
            postId: answerId,
        })

        console.log({ notifyResponse })

        await contract.current.make_tip(
            {
                nicknames: authorIds,
            },
            DEFAULT_GAS,
            utils.format.parseNearAmount(`${tipAmount}`),
        );
    }, [wallet, tipAmount]);

    return answers.map((answer, index) => {
        return ReactDOM.createPortal(
            <Button
                key={index}
                onClick={handleClick.bind(null, answer)}
                isSignedIn={wallet?.isSignedIn?.() ?? false}
            />,
            answer.container
        )
    })
}

export default ButtonContainer;
