import { Rip7560Transaction } from "../types/rip7560Transaction";
import { BytesLike } from "ethers";

export function constructRip7560Transaction(
    chainId: BytesLike,
    bigNonce?: BytesLike,
    sender?: string,
    data?: BytesLike,
    deployer?: string,
    deployerData?: BytesLike,
    paymaster?: string,
    paymasterData?: BytesLike,
): Rip7560Transaction {
    return {
        chainId: chainId,
        bigNonce: bigNonce ?? '0x0',
        sender: sender ?? '0x',
        data: data ?? '0x',
        builderFee: '0x0', 
        maxPriorityFeePerGas: '0x1',
        maxFeePerGas: '0x3B9ACA00', // 1e9
        validationGas: '0xF4240',
        gas: '0xF4240',
        subType: '0x1',
        signature: getDummySignature(),
        deployer: deployer ?? null,
        deployerData: deployerData ?? "0x",
        paymaster: paymaster ?? null,
        paymasterData: paymasterData ?? "0x",
        paymasterGas: paymaster? '0xF4240' : '0x0',
        postOpGas: paymaster ? '0xF4240' : '0x0',
    }
}

export function getDummySignature(): BytesLike {
    return '0xce3692b3287f4cc42531c32397f14159670d627ce8dae0abb6c8f15d332dddf0';
}

export function getRandomAddress(): string {
    return '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
}
