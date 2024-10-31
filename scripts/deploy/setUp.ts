import { parseEther, Hex } from 'viem-rip7560/src';
import { eoaWallet, publicClient, walletClient } from 'src/utils';
import {
    MockERC20Abi,
    Rip7560Account,
    Erc4337Account,
    MockErc20,
} from '../../src/types';

export type Accounts = {
    addr4337: Hex;
    addr7560: Hex;
};

export async function fundAccountsWithEth(): Promise<Accounts> {
    // Fund the target smart accounts
    console.log(`Sending 0.1 ETH to ${Erc4337Account}...`);
    await walletClient.sendTransaction({
        account: eoaWallet,
        to: Erc4337Account,
        value: parseEther('0.1'),
    });
    console.log(`Sent 0.1 ETH to ${Erc4337Account}`);

    console.log(`Sending 0.1 ETH to ${Rip7560Account}...`);
    const hash = await walletClient.sendTransaction({
        account: eoaWallet,
        to: Rip7560Account,
        value: parseEther('0.1'),
    });
    await publicClient.waitForTransactionReceipt({hash});
    console.log(`Sent 0.1 ETH to ${Rip7560Account}`);

    return { addr4337: Erc4337Account, addr7560: Rip7560Account };
}

export async function fundAccountsWithErc20(addr1: string, addr2: string) {
    console.log(`Minting 1000 tokens to ${addr1}...`);
    let hash = await walletClient.writeContract({
        address: MockErc20,
        abi: MockERC20Abi,
        functionName: 'mint',
        args: [addr1, BigInt(1000)],
        account: eoaWallet,
    });
    await publicClient.waitForTransactionReceipt({hash});
    console.log(`Minted 1000 tokens to ${addr1}`);

    console.log(`Minting 1000 tokens to ${addr2}...`);
    hash = await walletClient.writeContract({
        address: MockErc20,
        abi: MockERC20Abi,
        functionName: 'mint',
        args: [addr2, BigInt(1000)],
        account: eoaWallet,
    });
    await publicClient.waitForTransactionReceipt({hash});
    console.log(`Minted 1000 tokens to ${addr2}`);

    return MockErc20;
}