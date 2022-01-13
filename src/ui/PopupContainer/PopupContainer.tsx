import * as React from 'react';

import DefaultTips from '../DefaultTips';
import DepositRead from '../DepositRead';
import DepositWrite from '../DepositWrite';

import useNearSetup from '../../utils/useNearSetup';
import { signInFromExtension } from "../../utils/near-utils";

const PopupContainer = () => {
    const { wallet, contract } = useNearSetup();

    return wallet?.isSignedIn() ? (
        <div>
            <DefaultTips />
            <DepositRead wallet={wallet} contract={contract} />
            <DepositWrite />
        </div>
    ) : (
        <button onClick={signInFromExtension}>Login with Near</button>
    )
};

export default PopupContainer;
