import { utils, providers } from 'near-api-js';

import { WORKER_METHODS, LOCAL_STORAGE_KEY, ARCHIVAL_NODE_URL } from 'utils/constants';
import {
    connectWallet,
    getContract,
    signIn,
    signOut,
    DEFAULT_GAS,
    yoctoNEARToNear,
} from 'utils/near-utils';
import logger from 'utils/logger';

import { LocalStorage, Service } from './classes';

let wallet, contract

const provider = new providers.JsonRpcProvider(ARCHIVAL_NODE_URL);

const setup = async () => {
    const res = await chrome.storage.local.get(LOCAL_STORAGE_KEY)

    const storage = res[LOCAL_STORAGE_KEY]
    logger.log({ storage })

    const localStorage = new LocalStorage(storage)
    const location = new URL(globalThis.location)

    globalThis.window = {
        localStorage,
        location,
        history: {
            replaceState: () => {},
        },
    }
    globalThis.document = {
        title: 'Near Tips'
    }

    wallet = await connectWallet()

    logger.log('set contract', wallet.isSignedIn())
    if (wallet.isSignedIn()) {
        contract = getContract(wallet)
    }

    logger.log({wallet});
}

setup()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logger.log("Background got a message!", message)

    switch (message.action) {
        case WORKER_METHODS.nearLogin:
            const isSignedIn = wallet.isSignedIn();
            const redirectUrl = message.payload;

            logger.log({ isSignedIn })
            if (!isSignedIn) {
                signIn(wallet, redirectUrl);
                return;
            }

            sendResponse(isSignedIn);
            break;

        case WORKER_METHODS.finishNearLogin:
            logger.log('payload: ', message.payload);
            window.location.href += message.payload;
            logger.log('new href: ', window.location.href);

            wallet._completeSignInWithAccessKey();

            logger.log('isSignedIn: ', wallet.isSignedIn());

            contract = getContract(wallet)

            sendResponse(true);
            break;
        case WORKER_METHODS.logout:
            signOut(wallet);
            localStorage.clear();
            sendResponse(true);
            break;
        case WORKER_METHODS.getLoggedInStatus:
            sendResponse(wallet.isSignedIn());
            break;
        case WORKER_METHODS.deposit_account:
            contract.deposit_account({
                args: {},
                gas: DEFAULT_GAS,
                amount: utils.format.parseNearAmount(message.payload.amount),
                callbackUrl: message.payload.callbackUrl,
            }).then(() => {
                sendResponse(message.payload);
            }).catch((err) => {
                logger.error({ err });
            });

            return true;
        case WORKER_METHODS.get_deposit_account_id: {
            const accountId = wallet.account().accountId;

            contract.get_deposit_account_id({account_id: accountId}).then(accountDeposit => {
                logger.log(`${accountId}: ${yoctoNEARToNear(accountDeposit)}`);

                sendResponse(yoctoNEARToNear(accountDeposit))
            })

            return true;
        }
        case WORKER_METHODS.send_tips: {
            // 1. - deposit is enough to send
            // 2. - deposit is not enough and make transaction directly
            const accountId = wallet.account().accountId;

            contract.get_deposit_account_id({ account_id: accountId }).then(accountDeposit => {
                const { tipAmount, authorIds, callbackUrl } = message.payload;
                const amount = utils.format.parseNearAmount(tipAmount);

                logger.log({ accountDeposit })

                const formattedAuthorIds = authorIds.map(userId => {
                    return {
                        service: Service.stackOverflow,
                        id: userId,
                    }
                });

                logger.log({
                    a: yoctoNEARToNear(accountDeposit),
                    accountDeposit,
                    amount,
                    tipAmount,
                    formattedAuthorIds,
                })

                const methodCall = yoctoNEARToNear(accountDeposit) >= tipAmount ?
                    () => {
                        return contract.send_tips(
                            {
                                user_ids: formattedAuthorIds,
                                tips: amount,
                            }
                        )
                    }
                    :
                    () => {
                        return contract.send_tips({
                            args: {
                                user_ids: formattedAuthorIds,
                                tips: amount,
                            },
                            gas: DEFAULT_GAS,
                            amount,
                            callbackUrl,
                        })
                    };

                methodCall().then(() => {
                    logger.log('tips was sent');

                    sendResponse(true);
                }).catch(err => {
                    logger.error({ err });
                    sendResponse(false);
                })
            }).catch((err) => {
                logger.error('mystery?', { err });
                sendResponse(false);
            })

            return true;
        }
        case WORKER_METHODS.withdraw_deposit: {
            contract.withdraw_deposit({
                withdraw_amount: utils.format.parseNearAmount(message.payload),
            }).then(() => {
                sendResponse(message.payload);
            }).catch((err) => {
                logger.error({err});
            });

            return true;
        }
        case WORKER_METHODS.checkTransactionStatus: {
            provider.txStatus(
                message.payload,
                wallet.account().accountId
            ).then((res) => {
                sendResponse(res);
            });

            return true;
        }
        default:
            logger.error('unknown worker method')
    }
})
