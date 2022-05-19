import { keyStores, WalletConnection, connect, Contract, utils } from 'near-api-js';
import {WORKER_METHODS} from "../constants";

export const DEFAULT_GAS = 300000000000000;

const contractAddress = 'near-tips.testnet';

const viewMethods = ["get_deposit_account_id", "get_service_id_tips", "get_account_id_tips"];
const changeMethods = ["deposit_account", "send_tips", "withdraw_deposit", "withdraw_tips", "link_account"];

export const ARCHIVAL_NODE_URL = 'https://archival-rpc.testnet.near.org';

export const connectWallet = async () => {
    const netConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    const near = await connect(netConfig);

    return new WalletConnection(near);
}

export const signIn = (wallet, redirectUrl) => {
    console.log(redirectUrl);

    wallet.requestSignIn({
        successUrl: redirectUrl,
        failureUrl: redirectUrl,
        contractId: contractAddress,
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
            contractAddress,
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
