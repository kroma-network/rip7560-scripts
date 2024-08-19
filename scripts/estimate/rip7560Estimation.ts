import dotenv  from "dotenv";
import { BytesLike, ethers } from "ethers";
import { Rip7560Transaction, EstimateRip7560TransactionGasResponse } from "../../src/types/rip7560Transaction";
import { 
    constructRip7560Transaction,
    getNonce,
    getNonceFromNonceManager,
    getCallData,
    getRandomAddress,
    getAddress,
    getDeployerData,
    getChainId
} from "../../src/utils";

dotenv.config();

/* ETH Transfer Estimation */
export async function estimate7560EthTransferGasLegacyNonce(account: string, value: number): Promise<EstimateRip7560TransactionGasResponse> {
    let nonce = await getNonce(account);
    if (nonce === '0x0') {
        nonce = '0x1';
    }
    const to = getRandomAddress();
    const callData = getCallData(to, value, '0x');
    const chainId = await getChainId();
    const rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData);

    const estimateRes = await _estimateRip7560TransactionGasLimit(rip7560Transaction);
    return estimateRes;
}

export async function estimate7560EthTransferGasNonceManager(account: string, key: BytesLike, value: number): Promise<EstimateRip7560TransactionGasResponse> {
    const nonce = await getNonceFromNonceManager(account, key);
    const to = getRandomAddress();
    const callData = getCallData(to, value, '0x');
    const chainId = await getChainId();
    const rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData);

    const estimateRes = _estimateRip7560TransactionGasLimit(rip7560Transaction);
    return estimateRes;
}

/* ERC20 Transfer Estimation */
export async function estimate7560Erc20TransferGasLegacyNonce(account: string, erc20: string, value: number): Promise<EstimateRip7560TransactionGasResponse> {
    let nonce = await getNonce(account);
    if (nonce === '0x0') {
        nonce = '0x1';
    }
    const to = getRandomAddress();
    const iface = new ethers.utils.Interface(['function transfer(address to, uint256 value)']);
    const callData = getCallData(erc20, 0, iface.encodeFunctionData('transfer', [to, value]));
    const chainId = await getChainId();

    const rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData);

    const estimateRes = await _estimateRip7560TransactionGasLimit(rip7560Transaction);
    return estimateRes;
}

export async function estimate7560Erc20TransferGasNonceManager(account: string, erc20: string, key: string, value: number): Promise<EstimateRip7560TransactionGasResponse> {
    const nonce = await getNonceFromNonceManager(account, key);
    const to = getRandomAddress();
    const iface = new ethers.utils.Interface(['function transfer(address to, uint256 value)']);
    const callData = getCallData(erc20, 0, iface.encodeFunctionData('transfer', [to, value]));    
    const chainId = await getChainId();

    const rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData);

    const estimateRes = _estimateRip7560TransactionGasLimit(rip7560Transaction);
    return estimateRes;
}

/* Deployment Estimation */
export async function estimate7560DeploymentGasLegacyNonce(owner: string, factory: string, salt: number): Promise<EstimateRip7560TransactionGasResponse> {
    const account = await getAddress(factory, owner, salt);
    const nonce = await getNonce(account);
    const callData = '0x';
    const deployerData = getDeployerData(owner, salt);
    const chainId = await getChainId();

    const rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData, factory, deployerData);

    const estimateRes = await _estimateRip7560TransactionGasLimit(rip7560Transaction);
    return estimateRes;
}

export async function estimate7560DeploymentGasNonceManager(owner: string, factory: string, salt: number, key: BytesLike): Promise<EstimateRip7560TransactionGasResponse> {
    const account = await getAddress(factory, owner, salt);
    const nonce = await getNonceFromNonceManager(owner, key);
    const callData = '0x';
    const deployerData = getDeployerData(owner, salt);
    const chainId = await getChainId();

    const rip7560Transaction = constructRip7560Transaction(chainId, nonce, account, callData, factory, deployerData);

    const estimateRes = await _estimateRip7560TransactionGasLimit(rip7560Transaction);
    return estimateRes;
}


async function _estimateRip7560TransactionGasLimit(
    rip7560Transaction: Rip7560Transaction
): Promise<EstimateRip7560TransactionGasResponse> {
    const response = await fetch(
        `${process.env.RPC_URL}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_estimateRip7560TransactionGas',
                params: [rip7560Transaction],
                id: 1,
            }),
        }
    ).then((res) => {
        return res.json();
    }
    );

    return {
        validationGasLimit: response.result.validationGas,
        executionGasLimit: response.result.executionGas,
    }
}
