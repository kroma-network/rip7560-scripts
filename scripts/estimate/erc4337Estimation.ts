import path from "path";
import fs from "fs";
import * as dotenv from "dotenv";
import { 
    getCallData,
    getRandomAddress,
    constructUserOp,
    getChainId,
    decodeRevertReason
} from "../../src/utils";
import { Entrypoint_V0_6_Address } from "../../src/types/constants";
import { UserOperation } from "../../src/types/erc4337UserOp";
import { ethers, BytesLike } from "ethers";

dotenv.config();

export async function estimate4337EthTransferGas(account: string, value: number, wallet: ethers.Wallet): Promise<number> {
    const to = getRandomAddress();
    const callData = getCallData(to, value, '0x');
    const chainId = await getChainId();
    const userOp = constructUserOp(chainId, account, callData, wallet);

    const usedGas = await _estimateUserOpGasLimit(userOp, ethers.constants.AddressZero, '0x');
    return usedGas;
}

export async function estimate4337Erc20Gas(account: string, erc20: string, value: number, wallet: ethers.Wallet): Promise<number> {
    const to = getRandomAddress();
    const iface = new ethers.utils.Interface(['function transfer(address to, uint256 value)']);
    const callData = getCallData(erc20, 0, iface.encodeFunctionData('transfer', [to, value]));
    const chainId = await getChainId();
    const userOp = constructUserOp(chainId, account, callData, wallet);

    const usedGas = await _estimateUserOpGasLimit(userOp, ethers.constants.AddressZero, '0x');
    return usedGas;
}

async function _estimateUserOpGasLimit(
    userOp: UserOperation,
    target: string,
    targetCallData: BytesLike,
): Promise<number> {
    const artifactPath = path.resolve(
        __dirname,
        '../../node_modules/@account-abstraction/contracts/artifacts/Entrypoint.json'
    );
    const abi = JSON.parse(fs.readFileSync(artifactPath, 'utf8')).abi;

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const entryPointContract = new ethers.Contract(Entrypoint_V0_6_Address, abi, provider);

    const data = entryPointContract.interface.encodeFunctionData('simulateHandleOp', [userOp, target, targetCallData]);
    const tx = {
        to: Entrypoint_V0_6_Address,
        data,
    };

    // Call to simulateHandleOp is always reverted
    try {
        await provider.send('eth_call', [tx, 'latest']);
    } catch (error: any) {
        const errorData = decodeRevertReason(error, true, entryPointContract);
        if (errorData === null) {
            throw new Error('Failed to decode revert reason');
        }
        const parts = errorData.split(',');

        const extractedNumber = parseInt(parts[1], 10);
        return extractedNumber;
    }

    // Code should not reach here
    return 0;
}