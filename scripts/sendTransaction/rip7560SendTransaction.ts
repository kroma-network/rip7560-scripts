import {Hex, type WaitForTransactionReceiptReturnType} from "viem-rip7560/src";
import { toSimpleNativeSmartAccount } from "viem-rip7560/src/experimental";
import {
    getNonce,
    getCallData,
    getDummyAddress,
    publicClient,
    bundlerClient,
    eoaWallet,
    walletClient
} from "../../src/utils";

export async function sendRip7560Transaction(sender: Hex): Promise<WaitForTransactionReceiptReturnType> {
    const account = await toSimpleNativeSmartAccount({
        client: publicClient,
        bundlerClient,
        address: sender,
        owner: eoaWallet,
    })

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
        account,
    })

    return await publicClient.waitForTransactionReceipt({ hash });
}
