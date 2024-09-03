import { Wallet, ethers } from 'ethers'
import dotenv from 'dotenv'
import { arrayify, keccak256 } from 'ethers/lib/utils'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { UserOperation } from '../types/erc4337UserOp'
import { Rip7560Transaction } from '../types/rip7560Transaction'
import {encode} from '@ethersproject/rlp';
import { BigNumber } from 'ethers';
import { stripZeros } from '@ethersproject/bytes';

dotenv.config()

export function getRlpHash(rip7560Transaction: Rip7560Transaction): string {
  const encoded = _encode(rip7560Transaction);
  const encodedToHex = ethers.utils.hexConcat(['0x04', encoded]);
  return ethers.utils.keccak256(encodedToHex);
}

function _encode(rip7560Transaction: Rip7560Transaction): string {
  const encoded = encode([
      formatNumber(rip7560Transaction.chainId),
      formatNumber(rip7560Transaction.nonce),
      formatNumber(rip7560Transaction.nonceKey || '0x0'),
      rip7560Transaction.sender,
      rip7560Transaction.deployer || '0x',
      rip7560Transaction.deployerData,
      rip7560Transaction.paymaster || '0x',
      rip7560Transaction.paymasterData,
      rip7560Transaction.executionData,
      formatNumber(rip7560Transaction.builderFee),
      formatNumber(rip7560Transaction.maxPriorityFeePerGas),
      formatNumber(rip7560Transaction.maxFeePerGas),
      formatNumber(rip7560Transaction.verificationGasLimit),
      formatNumber(rip7560Transaction.paymasterVerificationGasLimit),
      formatNumber(rip7560Transaction.paymasterPostOpGasLimit),
      formatNumber(rip7560Transaction.gas),
      [], // Accesslist
  ]);
  return encoded;
}

export async function signRip7560Transaction(transaction: Rip7560Transaction): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  let signer: Wallet;
  if (process.env.PRIVATE_KEY === undefined) {
      throw new Error('PRIVATE_KEY is not set');
  }
  signer = new Wallet(process.env.PRIVATE_KEY, provider);
  const hash = getRlpHash(transaction)
  console.log('hash', hash)
  const sig = await signer.signMessage(arrayify(hash))
  return sig
}

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

function formatNumber(value: ethers.utils.BytesLike): Uint8Array {
    return stripZeros(BigNumber.from(Number(value)).toHexString());
}