/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { createWalletClient, publicActions, custom } from 'viem';
import { bscTestnet } from 'viem/chains';
import React, { useEffect } from 'react';

import { ETH_CONTRACT, STAKESTONE_CONTRACT, GGP_CONTRACT, WORLD_CONTRACT, ITEM_CONTRACT, FEESVAULT_CONTRACT } from './env';
import { ETHDummyAbi } from './abis/ETHDummy';
import { StakeStoneDummyAbi } from './abis/StakeStoneDummy';
import { GGPAbi } from './abis/GGP';
import { WorldAbi } from './abis/World';
import { ItemAbi } from './abis/Item';

import IconNormalPickAxe from './assets/pickaxe-normal.png';
import IconCoin from './assets/coin-icon.png';
import IconExchange from './assets/exchange-icon.png';

import Navbar from "./Navbar"

function Use() {
    const { address, isConnected } = useAccount();
    const [ETHBalance, setETHBalance] = React.useState<bigint>(BigInt(0));
    const [StakeStoneBalance, setStakeStoneBalance] = React.useState<bigint>(BigInt(0));
    const [GGPBalance, setGGPBalance] = React.useState<bigint>(BigInt(0));
    const [pickaxeBalance, setPickaxeBalance] = React.useState<bigint>(BigInt(0));
    const [vaultTaxBalance, setVaultTaxBalance] = React.useState<bigint>(BigInt(0));
    const [worldBalance, setWorldBalance] = React.useState<bigint>(BigInt(0));

    const publicClient = createWalletClient({
        chain: bscTestnet,
        transport: custom(window.ethereum!), 
    }).extend(publicActions);

    const exchangeItem = async (itemId: number, type: number) => {
        const loading1 = toast.loading('Exchange Item...');
        try {
            const txn = await publicClient.writeContract({
                account: address as `0x${string}`,
                address: GGP_CONTRACT,
                abi: GGPAbi,
                functionName: 'approve',
                args: [WORLD_CONTRACT, BigInt(1000*10**18)]
            });
            const result = await publicClient.waitForTransactionReceipt({ hash: txn });
            if (result.status === "success") {
                const txn = await publicClient.writeContract({
                    account: address as `0x${string}`,
                    address: WORLD_CONTRACT,
                    abi: WorldAbi,
                    functionName: 'exchangeItem',
                    args: [itemId, type]
                });
                const result = await publicClient.waitForTransactionReceipt({ hash: txn });
        
                if (result.status === "success") {
                    toast.success('Exchange Item success');
                    fetchBalance1();
                    fetchBalance2();
                    fetchBalance3();
                    fetchBalance4();
                    fetchBalance5();
                    fetchBalance6();
                    // fetchCubeBalance();
                    // fetchPlayer(address as `0x${string}`);
                    // openModal(<div className="flex flex-col items-center justify-center text-center">
                    //     <img src={IconNormalPickAxe} width={80} />
                    //     <span className="mt-5 text-2xl">Congratulation, exchange is successful</span>
                    //     <span className="mt-2 text-md">Got 1 Normal PickAxe</span>
                    //     </div>);
                }
            }
        } catch(error: any) {
            toast.error('Exchange Item error: ', error);
        } finally {
            setTimeout(function() {
                toast.dismiss(loading1);
            }, 5000); // 5 secs; zeta's block time    
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

    const fetchBalance3 = async () => {
        const loading1 = toast.loading('Checking balance...');
            publicClient.readContract({
                account: address as `0x${string}`,
                address: GGP_CONTRACT,
                abi: GGPAbi,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            }).then((balance) => {
                console.log(balance);
                setGGPBalance(balance);
            }).catch((e) => {
                toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
            }).finally(() => {
                toast.dismiss(loading1);
            });
    }

    const fetchBalance4 = async () => {
        const loading1 = toast.loading('Checking balance...');
            publicClient.readContract({
                account: address as `0x${string}`,
                address: ITEM_CONTRACT,
                abi: ItemAbi,
                functionName: 'balanceOf',
                args: [address as `0x${string}`, BigInt(0)]
            }).then((balance) => {
                console.log(balance);
                setPickaxeBalance(balance);
            }).catch((e) => {
                toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
            }).finally(() => {
                toast.dismiss(loading1);
            });
    }

    const fetchBalance5 = async () => {
        const loading1 = toast.loading('Checking balance...');
            publicClient.readContract({
                account: address as `0x${string}`,
                address: GGP_CONTRACT,
                abi: GGPAbi,
                functionName: 'balanceOf',
                args: [FEESVAULT_CONTRACT as `0x${string}`]
            }).then((balance) => {
                console.log(balance);
                setVaultTaxBalance(balance);
            }).catch((e) => {
                toast(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
            }).finally(() => {
                toast.dismiss(loading1);
            });
    }

    const fetchBalance6 = async () => {
        const loading1 = toast.loading('Checking balance...');
            publicClient.readContract({
                account: address as `0x${string}`,
                address: GGP_CONTRACT,
                abi: GGPAbi,
                functionName: 'balanceOf',
                args: [WORLD_CONTRACT as `0x${string}`]
            }).then((balance) => {
                console.log(balance);
                setWorldBalance(balance);
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
            fetchBalance3();
            fetchBalance4();
            fetchBalance5();
            fetchBalance6();
        }
    }, [isConnected, address]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl mt-10 mb-3">Use $GGP</h1>
                <h1 className="text-xl mt-5 mb-1">DUMMY ETH Balance:</h1>
                <h1 className="text-4xl">{(ETHBalance / BigInt(10**18)).toLocaleString()}</h1>
                <h1 className="text-xl mt-5 mb-1">StakeStone Balance:</h1>
                <h1 className="text-4xl">{(StakeStoneBalance / BigInt(10**18)).toLocaleString()}</h1>
                <h1 className="text-xl mt-5 mb-1">GGP Balance:</h1>
                <h1 className="text-4xl">{(GGPBalance / BigInt(10**18)).toLocaleString()}</h1>
                <h1 className="text-xl mt-5 mb-1">Pickaxe Balance:</h1>
                <h1 className="text-4xl">{(pickaxeBalance).toLocaleString()}</h1>
                <hr className="mt-8 border-2 border-black w-full" />
                <h1 className="text-xl mt-5 mb-1">Vault Tax Fees Balance:</h1>
                <h1 className="text-4xl">{(vaultTaxBalance / BigInt(10**18)).toLocaleString()} $GGP</h1>
                <h1 className="text-xl mt-5 mb-1">World Balance:</h1>
                <h1 className="text-4xl">{(worldBalance / BigInt(10**18)).toLocaleString()} $GGP</h1>
                <div className="mb-8">
                    <hr className="mt-8 border-2 border-black" />
                    <h3 className="text-2xl text-background-primary font-bold mt-3 mb-3 text-center">Exchange</h3>
                    <div className="text-white w-full h-[25vh]">
                        <div className="mt-3 w-full text-center bg-slate-100 p-4 text-black cursor-pointer hover:bg-slate-400" onClick={() => exchangeItem(0, 0)}>
                            <div>
                                <div className="">
                                    <div className="inline-block"><span className="inline-block text-3xl font-black">100</span><br/><span className="inline-block text-xl">$GGP</span></div>
                                    <img src={IconCoin} className="w-1/6 inline-block" alt="coin" />
                                    <img src={IconExchange} className="w-[50px] ml-5 mr-5 inline-block" alt="exchange" />
                                    <div className="inline-block"><span className="inline-block text-3xl font-black">1</span><br/><span className="inline-block text-xl">ea</span></div>
                                    <img src={IconNormalPickAxe} className="w-1/6 inline-block" alt="normal-pickaxe" />
                                </div>
                            </div>
                                <div className="mt-2 text-xl">
                                    {/* <span>1 NORMAL PICKAXE = 100 $CUBE</span><br/> */}
                                    <span><span className="text-green-500">BUY</span> NORMAL PICKAXE</span>
                                </div>
                        </div>
                    </div>
                    <div className="text-white w-full h-[25vh]">
                    <div className="mt-3 w-full text-center bg-slate-100 p-4 text-black cursor-pointer hover:bg-slate-400" onClick={() => exchangeItem(0, 1)}>
                        <div>
                            <div className="">
                                <div className="inline-block"><span className="inline-block text-3xl font-black">1</span><br/><span className="inline-block text-xl">ea</span></div>
                                <img src={IconNormalPickAxe} className="w-1/6 inline-block" alt="normal-pickaxe" />
                                <img src={IconExchange} className="w-[50px] ml-5 mr-5 inline-block" alt="exchange" />
                                <div className="inline-block"><span className="inline-block text-3xl font-black">80</span><br/><span className="inline-block text-xl">$GGP</span></div>
                                <img src={IconCoin} className="w-1/6 inline-block" alt="coin" />
                            </div>
                        </div>
                            <div className="mt-2 text-xl">
                                {/* <span>1 NORMAL PICKAXE = 100 $CUBE</span><br/> */}
                                <span><span className="text-red-500">SELL</span> NORMAL PICKAXE</span>
                            </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Use;