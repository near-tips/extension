import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { WORKER_METHODS } from "../../constants";
import logger from '../../utils/logger';

const Deposit = () => {
    const [readDeposit, setReadDeposit] = useState('0');
    const [writeDeposit, setWriteDeposit] = useState('3');

    const handleDepositChange = useCallback((ev) => {
        setWriteDeposit(ev.target.value);
    }, []);

    const makeDeposit = useCallback(async () => {
        logger.log(`Depositing ${writeDeposit}...`);

        chrome.runtime.sendMessage({
            action: WORKER_METHODS.deposit_account,
            payload: {
                amount: writeDeposit,
                callbackUrl: window.location.href,
            },
        }, (response) => {
            logger.log('deposited successfully: ', response);
            setReadDeposit(response);
        })
    }, [writeDeposit]);

    const withdrawDeposit = useCallback(() => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.withdraw_deposit,
            payload: readDeposit,
        }, (response) => {
            logger.log('withdraw successfully: ', response);
            setReadDeposit('0');
        });
    }, [readDeposit]);

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.get_deposit_account_id,
        }, (response) => {
            logger.log({ response })
            setReadDeposit(response);
        })
    }, []);

    return (
        <div>
            <div className="label">
                <span>
                    Balance: {readDeposit} Ⓝ
                </span>
                <button
                    className="secondaryButton"
                    onClick={withdrawDeposit}
                >
                    Withdraw deposit
                </button>
            </div>

            <div>
                <input
                    className="input"
                    type="number"
                    value={writeDeposit}
                    onChange={handleDepositChange}
                />
                <button
                    className="button"
                    onClick={makeDeposit}
                >
                    Deposit
                </button>
            </div>
        </div>
    )
};

export default Deposit;
