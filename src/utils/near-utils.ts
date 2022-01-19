import { keyStores, WalletConnection, connect, Contract, utils } from 'near-api-js';

export const DEFAULT_GAS = 300000000000000;

const netConfig = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

const contractAddress = 'near-tips.testnet';

const viewMethods = ["get_deposit_account_id", "get_service_id_tips", "get_account_id_tips"];
const changeMethods = ["deposit_account", "send_tips", "withdraw_deposit", "withdraw_tips", "authentification_commitment", "link_account"];

export const connectWallet = async () => {
    const near = await connect(netConfig);

    return new WalletConnection(near);
}

export const signIn = (wallet) => {
    wallet.requestSignIn({
        success_url: window.location.href,
        failure_url: window.location.href,
        contract_id: contractAddress,
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