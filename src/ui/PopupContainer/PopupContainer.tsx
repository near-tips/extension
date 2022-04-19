import * as React from 'react';

import DefaultTips from '../DefaultTips';
import Deposit from '../Deposit';

import useNearSetup from '../../utils/useNearSetup';
import { loginFromApp } from '../../utils/near-utils';

const PopupContainer = () => {
    const { isLoggedIn } = useNearSetup();

    return isLoggedIn ? (
        <div>
            <DefaultTips />
            <Deposit />
        </div>
    ) : (
        <button
            className="login"
            onClick={loginFromApp}
        >
            Login with Near
        </button>
    )
};

export default PopupContainer;
