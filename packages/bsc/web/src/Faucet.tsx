/* eslint-disable @typescript-eslint/no-unused-vars */
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { createWalletClient, publicActions, custom } from 'viem';
import { bscTestnet } from 'viem/chains';
import React, { useEffect } from 'react';

import { ETH_CONTRACT } from './env';
import { ETHDummyAbi } from './abis/ETHDummy';

import Navbar from "./Navbar"

function Faucet() {
    const { address, isConnected } = useAccount();
    const [ETHBalance, setETHBalance] = React.useState<bigint>(BigInt(0));

    const publicClient = createWalletClient({
        chain: bscTestnet,
        transport: custom(window.ethereum!), 
    }).extend(publicActions);
    
    const handleFaucet = async () => {
        const loading1 = toast.loading('Faucet...');
        try {
            const txn = await publicClient.writeContract({
                account: address as `0x${string}`,
                address: ETH_CONTRACT,
                abi: ETHDummyAbi,
                functionName: 'mint',
                args: [BigInt(10*10**18)],
            });

            const result = await publicClient.waitForTransactionReceipt({ hash: txn });;
            if (result.status === "success") {
                toast.success('Success');
            } else {
                toast.error('Failed');
            }
        } catch (e) {
            toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            fetchBalance();
            toast.dismiss(loading1);
        }
    }

    const fetchBalance = async () => {
        const loading1 = toast.loading('Checking balance...');
            publicClient.readContract({
                account: address as `0x${string}`,
                address: ETH_CONTRACT,
                abi: ETHDummyAbi,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            }).then((balance) => {
                console.log(balance);
                setETHBalance(balance);
            }).catch((e) => {
                toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
            }).finally(() => {
                toast.dismiss(loading1);
            });
    }

    useEffect(() => {
        if(address) {
            fetchBalance();
        }
    }, [isConnected, address]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl mt-10 mb-3">Faucet DUMMY ETH</h1>
                <button className="p-4 py-2 bg-amber-500 text-white rounded-lg w-[12vw]" onClick={handleFaucet}>FAUCET 10 $ETH</button>
                <h1 className="text-xl mt-5 mb-1">DUMMY ETH Balance:</h1>
                <h1 className="text-4xl">{(ETHBalance / BigInt(10**18)).toLocaleString()}</h1>
            </div>
        </>
    )
}

export default Faucet;