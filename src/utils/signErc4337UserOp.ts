import { Wallet, ethers } from 'ethers'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { UserOperation } from '../types/erc4337UserOp'

export function getUserOpHash (op: UserOperation, entryPoint: string, chainId: number): string {
    const userOpHash = keccak256(encodeUserOp(op, true))
    const enc = ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'address', 'uint256'],
        [userOpHash, entryPoint, chainId])
    return keccak256(enc)
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


export function signUserOp (op: UserOperation, signer: Wallet, entryPoint: string, chainId: number): UserOperation {
    const message = getUserOpHash(op, entryPoint, chainId)
    const msg1 = Buffer.concat([
        Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
        Buffer.from(arrayify(message))
    ])
  
    const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(signer.privateKey)))

    const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s)
    return {
        ...op,
        signature: signedMessage1
    }
}