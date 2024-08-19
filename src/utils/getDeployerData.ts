import dotenv from 'dotenv';
import { BytesLike, ethers } from "ethers";

dotenv.config();

export function getDeployerData(owner: string, salt: number): BytesLike {
    const factoryAbi = [
        'function createAccount(address, uint256)',
    ];
    const factoryContract = new ethers.Contract(ethers.constants.AddressZero, factoryAbi, new ethers.providers.JsonRpcProvider(process.env.RPC_URL));
    const deployerData = factoryContract.interface.encodeFunctionData('createAccount', [owner, salt]);
    return deployerData;
}

export async function getAddress(factory: string, owner: string, salt: number): Promise<string> {
    const factoryAbi = [
        'function getAddress(address, uint256) view returns (address)',
    ];
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const factoryContract = new ethers.Contract(factory, factoryAbi, provider);
    const address = await factoryContract.callStatic.getAddress(owner, salt);
    return address.toString();
}