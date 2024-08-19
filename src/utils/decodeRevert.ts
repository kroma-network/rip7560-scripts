import { ethers } from 'ethers'

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

export function decodeRevertReason (data: string | Error, nullIfNoMatch = true, entrypoint?: ethers.Contract): string | null {
    if (!entrypoint) {
        return null
    }
    
    if (typeof data !== 'string') {
        const err = data as any
        data = (err.data ?? err.error?.data) as string
        if (typeof data !== 'string') throw err
    }
  
    const methodSig = data.slice(0, 10)
    const dataParams = '0x' + data.slice(10)
  
    // can't add Error(string) to xface...
    if (methodSig === '0x08c379a0') {
        const [err] = ethers.utils.defaultAbiCoder.decode(['string'], dataParams)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `Error(${err})`
    } else if (methodSig === '0x4e487b71') {
        const [code] = ethers.utils.defaultAbiCoder.decode(['uint256'], dataParams)
        return `Panic(${panicCodes[code] ?? code} + ')`
    }
  
    try {
        const err = entrypoint.interface.parseError(data)
        // treat any error "bytes" argument as possible error to decode (e.g. FailedOpWithRevert, PostOpReverted)
        const args = err.args.map((arg: any, index: any) => {
            switch (err.errorFragment.inputs[index].type) {
                case 'bytes' : return decodeRevertReason(arg)
                case 'string': return `"${(arg as string)}"`
                default: return arg
            }
        })
        return `${err.name}(${args.join(',')})`
    } catch (e) {
        // throw new Error('unsupported errorSig ' + data)
        if (!nullIfNoMatch) {
            return data
        }
        return null
    }
}
  