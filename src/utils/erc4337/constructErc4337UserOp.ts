import { UserOperation } from "../../types/userOp";
import { Hex } from "viem-rip7560/src";

export function constructUserOp(
    sender?: string,
    data?: Hex,
    initCode?: Hex,
): UserOperation {
    let userOp: UserOperation = {
        sender: sender ?? '0x',
        nonce: BigInt(0),
        initCode: initCode ?? '0x',
        callData: data ?? '0x',
        callGasLimit: BigInt(1_000_000),
        verificationGasLimit: BigInt(1_000_000),
        preVerificationGas: BigInt(1), 
        maxFeePerGas: BigInt(1),
        maxPriorityFeePerGas: BigInt(1_000_000_000),
        paymasterAndData: '0x',
        signature: getDummySignature(),
    }
    return userOp;
}

export function getDummySignature(): Hex {
    return '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c';
}
