import cn from 'classnames';

import DefaultTips from '../DefaultTips';
import Deposit from '../Deposit';

import useNearSetup from '../../utils/useNearSetup';

import styles from '../Popup.module.scss';

const PopupContainer = () => {
    const { isLoggedIn, loginFromApp, logout } = useNearSetup();

    return isLoggedIn ? (
        <div>
            <DefaultTips />
            <Deposit />
            <button
                className={cn([styles.button, styles.logout])}
                onClick={logout}
            >
                Logout
            </button>
        </div>
    ) : (
        <button
            className={styles.login}
            onClick={loginFromApp}
        >
            Login with Near
        </button>
    )
};

export default PopupContainer;
