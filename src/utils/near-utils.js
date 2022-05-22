import { keyStores, WalletConnection, connect, Contract, utils } from 'near-api-js';

import logger from './logger';

import {
    CONTRACT_ADDRESS,
    NETWORK_ID,
    NODE_URL,
    WALLET_URL,
    HELPER_URL,
    EXPLORER_URL,
} from './constants';

export const DEFAULT_GAS = 300000000000000;

const viewMethods = ["get_deposit_account_id", "get_service_id_tips", "get_account_id_tips"];
const changeMethods = ["deposit_account", "send_tips", "withdraw_deposit", "withdraw_tips", "link_account"];

export const connectWallet = async () => {
    const netConfig = {
        networkId: NETWORK_ID,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: NODE_URL,
        walletUrl: WALLET_URL,
        helperUrl: HELPER_URL,
        explorerUrl: EXPLORER_URL,
    };

    const near = await connect(netConfig);

    return new WalletConnection(near);
}

export const signIn = (wallet, redirectUrl) => {
    logger.log(redirectUrl);

    wallet.requestSignIn({
        successUrl: redirectUrl,
        failureUrl: redirectUrl,
        contractId: CONTRACT_ADDRESS,
        methodNames: [
            ...viewMethods,
            ...changeMethods,
        ],
    })
};

export const signOut = (wallet) => {
    wallet.signOut();
};

export const getContract = (wallet) => {
    if (wallet.isSignedIn()) {
        return new Contract(
            wallet.account(),
            CONTRACT_ADDRESS,
            {
                viewMethods,
                changeMethods,
                sender: wallet.account(),
            }
        );
    }

    return null;
}

export const yoctoNEARToNear = (yoctoNear) => {
    const normalAmountString = yoctoNear.toLocaleString().split(',').join('');

    return utils.format.formatNearAmount(normalAmountString);
}
