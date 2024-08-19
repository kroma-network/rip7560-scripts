import { BytesLike, ethers } from "ethers";
import { NonceManager_Address } from "../types/constants";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

export async function getNonce(account: string): Promise<BytesLike> {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const res = await provider.send(
        'eth_getTransactionCount',
        [account, 'latest']
    );
    return res;
}

export async function getNonceFromNonceManager(account: string, key: BytesLike): Promise<BytesLike> {
    const nonceManagerCalldata = ethers.utils.defaultAbiCoder.encode(['address', 'string'], [account, key]);
    const res = await provider.call({
        to: NonceManager_Address,
        data: nonceManagerCalldata,
    });
    return res;
}