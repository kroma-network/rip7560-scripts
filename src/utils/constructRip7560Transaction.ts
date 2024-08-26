import { Rip7560Transaction } from "../types/rip7560Transaction";
import { BytesLike } from "ethers";

export function constructRip7560Transaction(
    chainId: BytesLike,
    nonce?: BytesLike,
    sender?: string,
    data?: BytesLike,
    deployer?: string,
    deployerData?: BytesLike,
    paymaster?: string,
    paymasterData?: BytesLike,
): Rip7560Transaction {
    return {
        chainId: chainId,
        nonce: nonce ?? '0x0',
        nonceKey: '0x0',
        sender: sender ?? '0x',
        executionData: data ?? '0x',
        builderFee: '0x0', 
        maxPriorityFeePerGas: '0x1',
        maxFeePerGas: '0x3B9ACA00', // 1e9
        validationGas: '0xF4240',
        gas: '0xF4240',
        authorizationData: getDummyAuthorizationData(),
        deployer: deployer ?? null,
        deployerData: deployerData ?? "0x",
        paymaster: paymaster ?? null,
        paymasterData: paymasterData ?? "0x",
        paymasterGas: paymaster? '0xF4240' : '0x0',
        postOpGas: paymaster ? '0xF4240' : '0x0',
    }
}

export function getDummyAuthorizationData(): BytesLike {
    return '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c';
}

export function getRandomAddress(): string {
    return '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
}
