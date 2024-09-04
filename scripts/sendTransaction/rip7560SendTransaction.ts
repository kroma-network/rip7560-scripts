import { Rip7560Transaction } from "../../src/types/rip7560Transaction";
import { 
    getNonce, 
    getCallData,
    getRandomAddress,
    getChainId,
    constructRip7560Transaction,
    signRip7560Transaction,
    increaseGasLimit
} from "../../src/utils";
import { estimateRip7560TransactionGasLimit } from "../estimate/rip7560Estimation";

export async function sendRip7560Transaction(account: string): Promise<string> {
    let nonce = await getNonce(account);
    if (nonce === '0x0') {
        nonce = '0x01';
    }
    const to = getRandomAddress();
    const callData = getCallData(to, 1, '0x');
    const chainId = await getChainId();
    let rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData);

    // Estimate gas limit and apply 1.1 multiplier 
    const estimateRes = await estimateRip7560TransactionGasLimit(rip7560Transaction);
    rip7560Transaction.verificationGasLimit = increaseGasLimit(estimateRes.validationGasLimit);
    rip7560Transaction.gas = increaseGasLimit(estimateRes.executionGasLimit);
    rip7560Transaction.authorizationData = await signRip7560Transaction(rip7560Transaction);

    return await _sendRip7560TransactionsBundle(rip7560Transaction);
}

async function _sendRip7560TransactionsBundle(
    rip7560Transaction: Rip7560Transaction
): Promise<string> {
    const response = await fetch(
        `${process.env.BUNDLER_URL}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_sendTransaction',
                params: [rip7560Transaction], // TransactionArgs
                id: 1,
            }),
        }
    ).then((res) => {
        return res.json();
    }
    );

    return response.result
}
