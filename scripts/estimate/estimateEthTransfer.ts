import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Accounts } from "../deploy/setUp";
import {
    estimate4337EthTransferGas,
    estimate7560EthTransferGasLegacyNonce
} from ".";
import { ethers } from "ethers";

dotenv.config();

export async function estimateEthTransfer(accounts: Accounts) {
    // Set up the provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // Estimate gas for ETH transfer
    let totalUsedGasIn4337 = await estimate4337EthTransferGas(accounts.addr4337, 1, wallet);
    console.log(`Total gas used for ETH transfer in 4337: ${totalUsedGasIn4337}`);

    // Estimate gas for ETH transfer in RIP7560
    const estimateRes = await estimate7560EthTransferGasLegacyNonce(accounts.addr7560, 1);
    const totalUsedGasIn7560 = Number(estimateRes.validationGasLimit) + Number(estimateRes.executionGasLimit);
    console.log(`Total gas used for ETH transfer in 7560: ${totalUsedGasIn7560}`);

    const result = {
        "ERC-4337 SimpleAccount": totalUsedGasIn4337.toString(),
        "RIP-7560 SimpleAccount": totalUsedGasIn7560.toString(),
    };

    // Write the result object to a JSON file
    const outputFilePath = path.resolve(__dirname, '../../gas/eth_transfer.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));

    console.log(`Results written to ${outputFilePath}`);
    return outputFilePath;
}
