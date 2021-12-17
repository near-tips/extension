import * as React from 'react';
import { useRef, useEffect, useCallback, useState } from "react"
import * as ReactDOM from "react-dom"
import { utils } from "near-api-js";

import { connectWallet, getContract, signIn } from './near-utils';
import Button from './Button';

const DEFAULT_GAS = 300000000000000;
const DEFAULT_TIPS = 0.3;

const ButtonContainer = ({ answers }) => {
    const [wallet, setWallet] = useState(null);
    const contract = useRef(null);

    useEffect(() => {
        const setup = async () => {
            console.log('hey bro');
            const wallet = await connectWallet();

            setWallet(wallet);

            console.log('Your wallet: ', wallet);

            if (wallet.isSignedIn()) {
                contract.current = getContract(wallet);
            }
        }

        setup();
    }, []);

    const handleClick = useCallback(async (authorIds) => {
        if (!wallet.isSignedIn() || !contract.current) {
            return signIn(wallet);
        }

        console.log('Paying tips to: ', authorIds);

        contract.current.make_tip(
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
                onClick={handleClick.bind(null, answer.authorIds)}
                isSignedIn={wallet?.isSignedIn?.() ?? false}
            />,
            answer.container
        )
    })
}

export default ButtonContainer;
