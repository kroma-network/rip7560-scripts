import {Hex, type WaitForTransactionReceiptReturnType} from "viem-rip7560/src";
import { dilithiumWallet } from "../../src/dilithium/dilithiumWallet";
import {
    getNonce,
    getCallData,
    getDummyAddress,
    publicClient,
    walletClient
} from "../../src/utils";
import { DilithiumWalletAddress } from "src/types/constants";

export async function sendDilithiumTransaction(sender: Hex): Promise<WaitForTransactionReceiptReturnType> {
    let nonce = await getNonce(sender);
    if (nonce === 0) {
        nonce = 1;
    }
    const to = getDummyAddress();
    const executionData = getCallData(to, 1, '0x');

    const hash = await walletClient.sendTransaction({
        nonce,
        sender,
        executionData,
        verificationGasLimit: BigInt(0),
        account: await dilithiumWallet(DilithiumWalletAddress),
    })

    return await publicClient.waitForTransactionReceipt({ hash });
}
