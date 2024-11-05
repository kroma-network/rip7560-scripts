import { 
    EstimateRIP7560TransactionGasReturnType, 
    toSimpleNativeSmartAccount 
} from "viem-rip7560/src/experimental";
import { estimateGas } from "viem-rip7560/src/actions";
import { encodeFunctionData, Hex } from "viem-rip7560/src";
import { 
    getNonce,
    getCallData,
    getDummyAddress,
    bundlerClient, 
    publicClient, 
    eoaWallet 
} from "../../src/utils";
import { transferAbi } from "../../src/types";

/* ETH Transfer Estimation */
export async function estimate7560EthTransferGasLegacyNonce(sender: Hex, value: number): Promise<EstimateRIP7560TransactionGasReturnType> {
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
    const executionData = getCallData(to, value, '0x');

    return await estimateGas(publicClient, {
        nonce,
        sender,
        executionData,
        verificationGasLimit: BigInt(0),
        account,
    }) as EstimateRIP7560TransactionGasReturnType;;
}

export async function estimate7560EthTransferGasNonceManager(sender: Hex, value: number): Promise<EstimateRIP7560TransactionGasReturnType> {
    const account = await toSimpleNativeSmartAccount({
        client: publicClient,
        bundlerClient,
        address: sender,
        owner: eoaWallet,
    })
    
    const to = getDummyAddress();
    const executionData = getCallData(to, value, '0x');

    return await estimateGas(publicClient, {
        sender,
        executionData,
        verificationGasLimit: BigInt(0),
        account,
    }) as EstimateRIP7560TransactionGasReturnType;;
}

/* ERC20 Transfer Estimation */
/// TODO: Change the calldata to directly call transfer function
export async function estimate7560Erc20TransferGasLegacyNonce(sender: Hex, erc20: string, value: number): Promise<EstimateRIP7560TransactionGasReturnType> {
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
    const innerCallData = encodeFunctionData({
        abi: transferAbi,
        functionName: 'transfer',
        args: [to, BigInt(value)]
    });    
    const executionData = getCallData(erc20, 0, innerCallData);

    return await estimateGas(publicClient, {
        nonce,
        sender,
        executionData,
        verificationGasLimit: BigInt(0),
        account,
    }) as EstimateRIP7560TransactionGasReturnType;;
}

export async function estimate7560Erc20TransferGasNonceManager(sender: Hex, erc20: string, value: number): Promise<EstimateRIP7560TransactionGasReturnType> {
    const account = await toSimpleNativeSmartAccount({
        client: publicClient,
        bundlerClient,
        address: sender,
        owner: eoaWallet,
    })

    const to = getDummyAddress();
    const innerCallData = encodeFunctionData({
        abi: transferAbi,
        functionName: 'transfer',
        args: [to, BigInt(value)]
    });
    const executionData = getCallData(erc20, 0, innerCallData);

    return await estimateGas(publicClient, {
        sender,
        executionData,
        verificationGasLimit: BigInt(0),
        account,
    }) as EstimateRIP7560TransactionGasReturnType;;
}

// /* Deployment Estimation */
// export async function estimate7560DeploymentGasLegacyNonce(): Promise<EstimateRIP7560TransactionGasReturnType> {
//     const smartAccount = await toSimpleNativeSmartAccount({
//         client: publicClient,
//         owner: eoaWallet,
//     })
//     const deployerArgs = await smartAccount.getDeployerArgs();

//     const sender = await smartAccount.getAddress();
//     const nonce = await getNonce(sender);
//     const executionData = '0x';
   
//     return await estimateGas(publicClient, {
//         nonce,
//         sender,
//         executionData,
//         verificationGasLimit: 0n,
//         deployer: deployerArgs.deployer, 
//         deployerData: deployerArgs.deployerData
//     }) as EstimateRIP7560TransactionGasReturnType;
// }

// export async function estimate7560DeploymentGasNonceManager(): Promise<EstimateRIP7560TransactionGasReturnType> {
//     const smartAccount = await toSimpleNativeSmartAccount({
//         client: publicClient,
//         owner: eoaWallet,
//     })
//     const deployerArgs = await smartAccount.getDeployerArgs();

//     const sender = await smartAccount.getAddress();
//     const executionData = '0x';
   
//     return await estimateGas(publicClient, {
//         sender,
//         executionData,
//         verificationGasLimit: 0n,
//         deployer: deployerArgs.deployer, 
//         deployerData: deployerArgs.deployerData
//     }) as EstimateRIP7560TransactionGasReturnType;
// }