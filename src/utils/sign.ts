import { Wallet, ethers } from 'ethers'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { UserOperation } from '../types/erc4337UserOp'
import { encode } from "rlp";
import { Rip7560Transaction } from '../types/rip7560Transaction'
import { Rip7560TransactionType } from "../types/constants";

export function getUserOpHash (op: UserOperation, entryPoint: string, chainId: number): string {
    const userOpHash = keccak256(encodeUserOp(op, true))
    const enc = ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'address', 'uint256'],
        [userOpHash, entryPoint, chainId])
    return keccak256(enc)
}

export function getRlpHash(rip7560Transaction: Rip7560Transaction): string {
  const encoded = _encode(rip7560Transaction);
  const encodedToHex = ethers.utils.hexlify(encoded);
  const hash = ethers.utils.keccak256(Rip7560TransactionType + encodedToHex.substring(2));
  return hash;
}

function _encode(rip7560Transaction: Rip7560Transaction): Uint8Array {
  const encoded = encode([
      rip7560Transaction.chainId.toString(),
      Number(rip7560Transaction.nonceKey),
      Number(rip7560Transaction.nonce),
      rip7560Transaction.sender,
      rip7560Transaction.executionData.toString(),
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

export function encodeUserOp (userOp: UserOperation, forSignature = true): string {
    if (forSignature) {
      return ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'bytes32', 'bytes32',
          'uint256', 'uint256', 'uint256', 'uint256',
          'uint256', 'bytes32'],
        [userOp.sender, userOp.nonce, keccak256(userOp.initCode), keccak256(userOp.callData),
            userOp.callGasLimit, userOp.verificationGasLimit, userOp.preVerificationGas, 
            userOp.maxFeePerGas, userOp.maxPriorityFeePerGas, keccak256(userOp.paymasterAndData)])
    } else {
      // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
      return ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'bytes', 'bytes',
          'uint256', 'uint256', 'uint256', 'uint256',
          'uint256', 'bytes', 'bytes'],
        [userOp.sender, userOp.nonce, userOp.initCode, userOp.callData,
            userOp.callGasLimit, userOp.verificationGasLimit, userOp.preVerificationGas, 
            userOp.maxFeePerGas, userOp.maxPriorityFeePerGas, userOp.paymasterAndData, userOp.signature])
    }
  }


export function signUserOp (op: UserOperation, signer: Wallet, entryPoint: string, chainId: number): string {
    const message = getUserOpHash(op, entryPoint, chainId)
    const msg1 = Buffer.concat([
        Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
        Buffer.from(arrayify(message))
    ])
  
    const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(signer.privateKey)))

    const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s)
    return signedMessage1
}

export async function signRip7560Transaction(transaction: Rip7560Transaction, signer: Wallet): Promise<string> {
    const hash = getRlpHash(transaction)
    const sig = await signer.signMessage(arrayify(hash))
    return sig
}