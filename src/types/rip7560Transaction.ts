import { BytesLike } from 'ethers'

export type Rip7560Transaction = {
    chainId: BytesLike;
    bigNonce: BytesLike;
    sender: string;
    data: BytesLike;
    builderFee: BytesLike;
    maxPriorityFeePerGas: BytesLike;
    maxFeePerGas: BytesLike;
    validationGas: BytesLike;
    gas: BytesLike;
    deployer: string | null;
    deployerData: BytesLike | null;
    paymaster: string | null;
    paymasterData: BytesLike | null;
    paymasterGas: BytesLike;
    postOpGas: BytesLike;
    subType: BytesLike;
    signature: BytesLike;
}

export type EstimateRip7560TransactionGasResponse = {
    validationGasLimit: BytesLike;
    executionGasLimit: BytesLike;
}