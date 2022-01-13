import { useEffect, useRef, useState } from 'react';

import { connectWallet, getContract } from './near-utils';

const useNearSetup = () => {
    const [wallet, setWallet] = useState(null);
    const contract = useRef(null);

    useEffect(() => {
        const setup = async () => {
            console.log('hey bro');
            const wallet = await connectWallet();

            setWallet(wallet);

            console.log('Your wallet: ', wallet, wallet.isSignedIn());

            if (wallet.isSignedIn()) {
                contract.current = getContract(wallet);
            }
        }

        setup();
    }, []);

    return {
        wallet,
        contract,
    }
};

export default useNearSetup;
