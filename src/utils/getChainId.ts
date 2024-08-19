import dotenv from 'dotenv';
import { BytesLike } from 'ethers';

dotenv.config();

export async function getChainId(): Promise<BytesLike> {
    const response = await fetch(
        `${process.env.RPC_URL}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_chainId',
                params: [],
                id: 1,
            }),
        }
    ).then((res) => {
        return res.json();
    }
    );
    return response.result;
}