export const CONTRACT_ADDRESS = 'near-tips.testnet';
export const NETWORK_ID = 'testnet';
export const NODE_URL = 'https://rpc.testnet.near.org';
export const ARCHIVAL_NODE_URL = 'https://archival-rpc.testnet.near.org';
export const WALLET_URL = 'https://wallet.testnet.near.org';
export const HELPER_URL = 'https://helper.testnet.near.org';
export const EXPLORER_URL = 'https://explorer.testnet.near.org';

export const HOST = 'https://api.near-tips.com';

export const DEFAULT_TIPS_STORAGE_KEY = 'default-tips-storage-key';
export const DEFAULT_TIPS = '0.3';

export const WORKER_METHODS = {
    nearLogin: 'NEAR_LOGIN',
    finishNearLogin: 'FINISH_NEAR_LOGIN',
    logout: 'LOGOUT',

    getLoggedInStatus: 'GET_LOGGED_IN_STATUS',

    checkTransactionStatus: 'CHECK_TRANSACTION_STATUS',

    // SC methods
    get_deposit_account_id: 'get_deposit_account_id',
    deposit_account: 'deposit_account',
    send_tips: 'send_tips',
    withdraw_deposit: 'withdraw_deposit',
}

export const LOCAL_STORAGE_KEY = 'local_storage_key'
