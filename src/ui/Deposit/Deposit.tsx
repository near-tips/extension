import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { WORKER_METHODS } from "../../constants";

const Deposit = () => {
    const [readDeposit, setReadDeposit] = useState('0');
    const [writeDeposit, setWriteDeposit] = useState('3');

    const handleDepositChange = useCallback((ev) => {
        setWriteDeposit(ev.target.value);
    }, []);

    const makeDeposit = useCallback(async () => {
        console.log(`Depositing ${writeDeposit}...`);

        chrome.runtime.sendMessage({
            action: WORKER_METHODS.deposit_account,
            payload: writeDeposit,
        })
    }, [writeDeposit]);

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: WORKER_METHODS.get_deposit_account_id,
        }, (response) => {
            console.log({ response })
            setReadDeposit(response);
        })
    }, []);

    return (
        <div>
            <div className="label">
                Balance: {readDeposit} Ⓝ
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
