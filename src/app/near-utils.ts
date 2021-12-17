import { keyStores, WalletConnection, connect, Contract } from 'near-api-js';

const netConfig = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

const contractAddress = 'norfolks.testnet';

export const connectWallet = async () => {
    const near = await connect(netConfig);

    return new WalletConnection(near);
}

export const signIn = (wallet) => {
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn(
            contractAddress,
            "Near Tips Extension",
            window.location.toString(),
            window.location.toString()
        );
    }
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
                viewMethods: ["get_user_tips"],
                changeMethods: ["make_tip", "withdraw_tip"],
                sender: wallet.account(),
            }
        );
    }

    return null;
}
