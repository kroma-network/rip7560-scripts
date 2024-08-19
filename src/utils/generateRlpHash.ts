import { ethers } from "ethers";
import { encode } from "rlp";
import { Rip7560Transaction } from "../types/rip7560Transaction";
import { Rip7560TransactionType } from "../types/constants";

export function getRlpHash(rip7560Transaction: Rip7560Transaction): string {
    const encoded = _encode(rip7560Transaction);
    const encodedToHex = ethers.utils.hexlify(encoded);
    const hash = ethers.utils.keccak256(Rip7560TransactionType + encodedToHex.substring(2));
    return hash;
}

function _encode(rip7560Transaction: Rip7560Transaction): Uint8Array {
    const encoded = encode([
        rip7560Transaction.chainId.toString(),
        Number(rip7560Transaction.bigNonce),
        rip7560Transaction.sender,
        rip7560Transaction.data.toString(),
        Number(rip7560Transaction.builderFee),
        Number(rip7560Transaction.maxPriorityFeePerGas),
        Number(rip7560Transaction.maxFeePerGas),
        Number(rip7560Transaction.validationGas),
        Number(rip7560Transaction.gas),
        rip7560Transaction.deployer,
        rip7560Transaction.deployerData?.toString(),
        rip7560Transaction.paymaster,
        rip7560Transaction.paymasterData?.toString(),
        Number(rip7560Transaction.paymasterGas),
        Number(rip7560Transaction.postOpGas),
    ]);
    return encoded;
}