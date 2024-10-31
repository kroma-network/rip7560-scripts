import { ethers } from 'ethers'
import {
    ContractErrorArgs,
    DecodeErrorResultReturnType,
    decodeErrorResult, 
    numberToBytes, 
    stringToBytes,
    concat
} from 'viem-rip7560/src'
import { EntrypointAbi } from '../../../src/types/abi'

const panicCodes: { [key: number]: string } = {
    // from https://docs.soliditylang.org/en/v0.8.0/control-structures.html
    0x01: 'assert(false)',
    0x11: 'arithmetic overflow/underflow',
    0x12: 'divide by zero',
    0x21: 'invalid enum value',
    0x22: 'storage byte array that is incorrectly encoded',
    0x31: '.pop() on an empty array.',
    0x32: 'array sout-of-bounds or negative index',
    0x41: 'memory overflow',
    0x51: 'zero-initialized variable of internal function type'
}

export function decodeRevertReason (data: DecodeErrorResultReturnType, nullIfNoMatch = true): string | null {    
    try {
        if (!data || !data.args) {
            return null
        }
        // treat any error "bytes" argument as possible error to decode (e.g. FailedOpWithRevert, PostOpReverted)
        const args = data.args.map((arg: any) => {
            if (typeof arg === 'bigint') {
                return arg.toString()
            }
        })
        return `${data.errorName}(${args.join(',')})`
    } catch (e) {
        // throw new Error('unsupported errorSig ' + data)
        if (!nullIfNoMatch) {
            return `Error('unsupported errorSig ${data})`
        }
        return null
    }
}
  