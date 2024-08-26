import { UserOperation } from "../types/erc4337UserOp";
import { BytesLike, ethers } from "ethers";
import { signUserOp } from "./signErc4337UserOp";
import { Entrypoint_V0_6_Address } from "../types/constants";

export function constructUserOp(
    chainId?: BytesLike,
    sender?: string,
    data?: BytesLike,
    wallet?: ethers.Wallet,
    initCode?: BytesLike,
): UserOperation {
    let userOp: UserOperation = {
        sender: sender ?? '0x',
        nonce: 0,
        initCode: initCode ?? '0x',
        callData: data ?? '0x',
        callGasLimit: 1_000_000,
        verificationGasLimit: 1_000_000,
        preVerificationGas: 1, 
        maxFeePerGas: 1,
        maxPriorityFeePerGas: 1e9,
        paymasterAndData: '0x',
        signature: getDummySignature(),
    }
    return userOp;
}

export function getDummySignature(): BytesLike {
    return '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c';
}

export function getRandomAddress(): string {
    return '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
}
