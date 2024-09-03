import { Rip7560Transaction } from "../../src/types/rip7560Transaction";
import { 
    getNonce, 
    getCallData,
    getRandomAddress,
    getChainId,
    constructRip7560Transaction,
    signRip7560Transaction
} from "../../src/utils";

export async function sendRip7560TransactionsBundle(account: string): Promise<string> {
    let nonce = await getNonce(account);
    if (nonce === '0x0') {
        nonce = '0x01';
    }
    const to = getRandomAddress();
    const callData = getCallData(to, 1, '0x');
    const chainId = await getChainId();
    let rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData);
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
