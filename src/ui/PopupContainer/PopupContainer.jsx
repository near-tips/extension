import React, { useCallback } from 'react';

import DefaultTips from '../DefaultTips';
import Deposit from '../Deposit';

import useNearSetup from '../../utils/useNearSetup';

const PopupContainer = () => {
    const { isLoggedIn, loginFromApp, logout } = useNearSetup();

    const handleLogin = useCallback(() => {
      loginFromApp(window.location.href);
    }, [loginFromApp]);

    return isLoggedIn ? (
        <div>
            <DefaultTips />
            <Deposit />
            <button
                className="button logout"
                onClick={logout}
            >
                Logout
            </button>
        </div>
    ) : (
        <button
            className="login"
            onClick={handleLogin}
        >
            Login with Near
        </button>
    )
};

export default PopupContainer;
