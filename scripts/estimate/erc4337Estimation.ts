import { 
    ContractFunctionRevertedError,
    BaseError,
    encodeFunctionData,
    getContract,
    Hex,
    zeroAddress,
} from "viem-rip7560/src";
import { 
    getCallData,
    getDummyAddress,
    constructUserOp,
    decodeRevertReason,
    publicClient
} from "../../src/utils";
import { 
    Entrypoint_V0_6_Address, 
    EntrypointAbi, 
    transferAbi 
} from "../../src/types";
import { UserOperation } from "../../src/types/userOp";

export async function estimate4337EthTransferGas(account: string, value: number): Promise<number> {
    const to = getDummyAddress();
    const callData = getCallData(to, value, '0x');
    const userOp = constructUserOp(account, callData);

    const usedGas = await _estimateUserOpGasLimit(userOp, zeroAddress, '0x');
    return usedGas;
}

export async function estimate4337Erc20Gas(account: string, erc20: string, value: number): Promise<number> {
    const to = getDummyAddress();
    const innerCallData = encodeFunctionData({
        abi: transferAbi,
        functionName: 'transfer',
        args: [to, BigInt(value)]
    });
    const callData = getCallData(erc20, 0, innerCallData);
    const userOp = constructUserOp(account, callData);

    const usedGas = await _estimateUserOpGasLimit(userOp, zeroAddress, '0x');
    return usedGas;
}

async function _estimateUserOpGasLimit(
    userOp: UserOperation,
    target: string,
    targetCallData: Hex,
): Promise<number> {
    // Call to simulateHandleOp is always reverted
    try {
        const entrypoint = getContract({ 
            abi: EntrypointAbi,
            address: Entrypoint_V0_6_Address,
            client: publicClient
        });
        await entrypoint.read.simulateHandleOp([userOp, target, targetCallData]);
    } catch (error: any) {
        if (error instanceof BaseError) {
            const revertError = error.walk(error => error instanceof ContractFunctionRevertedError)
            if (revertError instanceof ContractFunctionRevertedError) {
                const errorData = revertError.data
                if (errorData === undefined) {
                    throw new Error('Failed to decode revert reason');
                }
                const errorDecoded = decodeRevertReason(errorData, true);
                    if (errorDecoded === null) {
                        throw new Error('Failed to decode revert reason');
                    }
                    const parts = errorDecoded.split(',');

                    const extractedNumber = parseInt(parts[1], 10);
                    return extractedNumber;
                }
          }        
    }

    // Code should not reach here
    return 0;
}