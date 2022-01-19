import * as React from 'react';
import { useCallback } from 'react';

import DefaultTips from '../DefaultTips';
import Deposit from '../Deposit';

import useNearSetup from '../../utils/useNearSetup';
import { signIn } from "../../utils/near-utils";

const PopupContainer = () => {
    const { wallet, contract } = useNearSetup();

    const handleSignIn = useCallback(() => {
        signIn(wallet);
    }, [wallet]);

    return wallet?.isSignedIn() ? (
        <div>
            <DefaultTips />
            <Deposit wallet={wallet} contract={contract} />
        </div>
    ) : (
        <button
            className="login"
            onClick={handleSignIn}
        >
            Login with Near
        </button>
    )
};

export default PopupContainer;
