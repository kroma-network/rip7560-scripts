import { BigNumber, BytesLike, ethers } from "ethers";

export function getCallData(to: string, value: number, data: string): BytesLike {
    const walletAbi = [
        'function execute(address, uint256, bytes)',
    ]
    const walletContract = new ethers.Contract(ethers.constants.AddressZero, walletAbi, new ethers.providers.JsonRpcProvider());
    const callData = walletContract.interface.encodeFunctionData('execute', [to, BigNumber.from(value), data]);
    return callData;
}
