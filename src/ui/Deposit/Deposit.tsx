import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { utils } from 'near-api-js';

import { DEFAULT_GAS, yoctoNEARToNear } from '../../utils/near-utils';

const Deposit = ({ wallet, contract }) => {
    const [readDeposit, setReadDeposit] = useState('0');
    const [writeDeposit, setWriteDeposit] = useState('3');

    const handleDepositChange = useCallback((ev) => {
        setWriteDeposit(ev.target.value);
    }, []);

    const makeDeposit = useCallback(async () => {
        console.log(`Depositing ${writeDeposit}...`);

        const res = await contract.current.deposit_account(
            {},
            DEFAULT_GAS,
            utils.format.parseNearAmount(writeDeposit)
        );

        console.log({ res })
    }, [writeDeposit]);

    useEffect(() => {
        const accountId = wallet.account().accountId;

        contract.current.get_deposit_account_id({ account_id: accountId }).then(res => {
            console.log(`${accountId}: ${yoctoNEARToNear(res)}`);

            setReadDeposit(yoctoNEARToNear(res));
        });
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
