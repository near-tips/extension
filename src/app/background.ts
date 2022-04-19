import { utils } from 'near-api-js';

import { WORKER_METHODS, LOCAL_STORAGE_KEY } from '../constants';
import {connectWallet, getContract, signIn, DEFAULT_GAS, yoctoNEARToNear} from '../utils/near-utils';

import { LocalStorage, Service } from './classes';

let wallet, contract

const setup = async () => {
    const res = await chrome.storage.local.get(LOCAL_STORAGE_KEY)

    const storage = res[LOCAL_STORAGE_KEY]
    console.log({ storage })

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

    console.log('set contract', wallet.isSignedIn())
    if (wallet.isSignedIn()) {
        contract = getContract(wallet)
    }

    console.log({wallet});
}

setup()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background got a message!", message)

    switch (message.action) {
        case WORKER_METHODS.nearLogin:
            const isSignedIn = wallet.isSignedIn();
            const redirectUrl = message.payload;

            console.log({ isSignedIn })
            if (!isSignedIn) {
                signIn(wallet, redirectUrl);
                return;
            }

            sendResponse(isSignedIn);
            break;

        case WORKER_METHODS.finishNearLogin:
            console.log('payload: ', message.payload);
            window.location.href += message.payload;
            console.log('new href: ', window.location.href);

            wallet._completeSignInWithAccessKey();

            console.log('isSignedIn: ', wallet.isSignedIn());

            contract = getContract(wallet)

            sendResponse(true);
            break;
        case WORKER_METHODS.getLoggedInStatus:
            sendResponse(wallet.isSignedIn());
            break;
        case WORKER_METHODS.deposit_account:
            contract.deposit_account(
                {},
                DEFAULT_GAS,
                utils.format.parseNearAmount(message.payload)
            ).then(() => {
                sendResponse(true);
            }).catch((err) => {
                console.log({err});
            });

            return true;
        case WORKER_METHODS.get_deposit_account_id: {
            const accountId = wallet.account().accountId;

            contract.get_deposit_account_id({account_id: accountId}).then(accountDeposit => {
                console.log(`${accountId}: ${yoctoNEARToNear(accountDeposit)}`);

                sendResponse(yoctoNEARToNear(accountDeposit))
            })

            return true;
        }
        case WORKER_METHODS.send_tips: {
            // 1. - deposit is enough to send
            // 2. - deposit is not enough and make transaction directly
            const accountId = wallet.account().accountId;

            contract.get_deposit_account_id({account_id: accountId}).then(accountDeposit => {
                const { tipAmount, authorIds } = message.payload;
                const amount = utils.format.parseNearAmount(tipAmount);

                console.log({ accountDeposit })

                const formattedAuthorIds = authorIds.map(userId => {
                    return {
                        service: Service.stackOverflow,
                        id: userId,
                    }
                });

                console.log({
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
                        return contract.send_tips(
                            {
                                user_ids: formattedAuthorIds,
                                tips: amount,
                            },
                            DEFAULT_GAS,
                            amount,
                        )
                    };

                methodCall().then(() => {
                    console.log('tips was sent');

                    sendResponse(true);
                }).catch(err => {
                    console.log({ err })
                })
            })

            return true;
        }
        case WORKER_METHODS.withdraw_deposit: {

            return true;
        }
        default:
            console.log('unknown worker method')
    }
})
