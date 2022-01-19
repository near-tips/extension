import * as React from 'react';
import { useState, useEffect } from 'react';

const DepositRead = ({ wallet, contract }) => {
    const [deposit, setDeposit] = useState(0);

    useEffect(() => {
        const accountId = wallet.account().accountId;

        contract.current.get_deposit_account_id({ account_id: accountId }).then(res => {
            console.log(`${accountId}: ${res}`);

            setDeposit(res);
        });
    }, []);

    return (
        <div>
            Deposit: {deposit}
        </div>
    )
};

export default DepositRead;