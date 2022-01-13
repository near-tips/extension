import * as React from 'react';
import { useCallback, useState } from 'react';

const DepositWrite = () => {
    const [deposit, setDeposit] = useState(3);

    const handleDepositChange = useCallback((ev) => {
        setDeposit(ev.target.value);
    }, []);

    const makeDeposit = useCallback(() => {
        console.log(`Depositing ${deposit}...`);
        // make deposit
    }, [deposit]);

    return (
        <div>
            <input
                type="number"
                value={deposit}
                onChange={handleDepositChange}
            />
            <button
                onClick={makeDeposit}
            >
                Deposit
            </button>
        </div>
    )
};

export default DepositWrite;
