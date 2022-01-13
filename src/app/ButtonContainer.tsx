import * as React from 'react';
import { useCallback } from "react"
import * as ReactDOM from "react-dom"
import axios from 'axios';
import { utils } from "near-api-js";

import { signIn } from '../utils/near-utils';
import useNearSetup from '../utils/useNearSetup';
import Button from './Button';

const DEFAULT_GAS = 300000000000000;
const DEFAULT_TIPS = 0.3;

const HOST = 'https://api.near-tips.com';

const ButtonContainer = ({ answers }) => {
    const { wallet, contract } = useNearSetup();

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
            utils.format.parseNearAmount(`${DEFAULT_TIPS}`),
        );
    }, [wallet]);

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
