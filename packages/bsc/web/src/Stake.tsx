/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { createWalletClient, publicActions, custom } from 'viem';
import { bscTestnet } from 'viem/chains';
import React, { useEffect } from 'react';

import { ETH_CONTRACT, STAKESTONE_CONTRACT, STONEVAULT_CONTRACT } from './env';
import { ETHDummyAbi } from './abis/ETHDummy';
import { StakeStoneDummyAbi } from './abis/StakeStoneDummy';
import { StoneVaultAbi } from './abis/StoneVault';

import Navbar from "./Navbar"

function Stake() {
    const { address, isConnected } = useAccount();
    const [ETHBalance, setETHBalance] = React.useState<bigint>(BigInt(0));
    const [StakeStoneBalance, setStakeStoneBalance] = React.useState<bigint>(BigInt(0));

    const publicClient = createWalletClient({
        chain: bscTestnet,
        transport: custom(window.ethereum!), 
    }).extend(publicActions);
    
    const handleMint = async () => {
        const loading1 = toast.loading('Mint...');
        try {
            const txn = await publicClient.writeContract({
                account: address as `0x${string}`,
                address: ETH_CONTRACT,
                abi: ETHDummyAbi,
                functionName: 'approve',
                args: [STONEVAULT_CONTRACT, BigInt(10*10**18)]
            });
            const result = await publicClient.waitForTransactionReceipt({ hash: txn });;
            if (result.status === "success") {
                const txn = await publicClient.writeContract({
                    account: address as `0x${string}`,
                    address: STONEVAULT_CONTRACT,
                    abi: StoneVaultAbi,
                    functionName: 'mint',
                    args: [address as `0x${string}`, BigInt(10*10**18)],
                });
                const result = await publicClient.waitForTransactionReceipt({ hash: txn });;
                if (result.status === "success") {
                    toast.success('Success');
                } else {
                    toast.error('Failed');
                    console.error(result);
                }
            }
        } catch (e) {
            toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
            console.error(e);
        } finally {
            fetchBalance1();
            fetchBalance2();
            toast.dismiss(loading1);
        }
    }

    const fetchBalance1 = async () => {
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

    const fetchBalance2 = async () => {
        const loading1 = toast.loading('Checking balance...');
            publicClient.readContract({
                account: address as `0x${string}`,
                address: STAKESTONE_CONTRACT,
                abi: StakeStoneDummyAbi,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            }).then((balance) => {
                console.log(balance);
                setStakeStoneBalance(balance);
            }).catch((e) => {
                toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
            }).finally(() => {
                toast.dismiss(loading1);
            });
    }

    useEffect(() => {
        if(address) {
            fetchBalance1();
            fetchBalance2();
        }
    }, [isConnected, address]);
    
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl mt-10 mb-3">Mint StakeStone by DummyETH</h1>
                <button className="p-4 py-2 bg-amber-500 text-white rounded-lg" onClick={handleMint}>MINT 10 $StakeStone</button>
                <h1 className="text-xl mt-5 mb-1">DUMMY ETH Balance:</h1>
                <h1 className="text-4xl">{(ETHBalance / BigInt(10**18)).toLocaleString()}</h1>
                <h1 className="text-xl mt-5 mb-1">StakeStone Balance:</h1>
                <h1 className="text-4xl">{(StakeStoneBalance / BigInt(10**18)).toLocaleString()}</h1>
            </div>
        </>
    )
}

export default Stake;