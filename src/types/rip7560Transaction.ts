import { BytesLike } from 'ethers'

export type Rip7560Transaction = {
    chainId: BytesLike;
    nonce: BytesLike;
    nonceKey: BytesLike | null;
    sender: string;
    executionData: BytesLike;
    builderFee: BytesLike;
    maxPriorityFeePerGas: BytesLike;
    maxFeePerGas: BytesLike;
    verificationGasLimit: BytesLike;
    gas: BytesLike;
    deployer: string | null;
    deployerData: BytesLike;
    paymaster: string | null;
    paymasterData: BytesLike;
    paymasterVerificationGasLimit: BytesLike;
    paymasterPostOpGasLimit: BytesLike;
    authorizationData: BytesLike;
}

export type EstimateRip7560TransactionGasResponse = {
    validationGasLimit: BytesLike;
    executionGasLimit: BytesLike;
}