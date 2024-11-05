import { encodeFunctionData, Hex } from "viem-rip7560/src";
import { executeAbi } from "src/types";

export function getCallData(to: string, value: number, data: string): Hex {
    return encodeFunctionData({
        abi: executeAbi,
        functionName: 'execute',
        args: [to, value, data]
    });
}
