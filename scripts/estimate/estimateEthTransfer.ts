import fs from "fs";
import path from "path";
import { Accounts } from "../deploy/setUp";
import { estimate4337EthTransferGas } from "./erc4337Estimation";
import { estimate7560EthTransferGasLegacyNonce } from "./rip7560Estimation";

export async function estimateEthTransfer(accounts: Accounts) {
    // Estimate gas for ETH transfer
    let totalUsedGasIn4337 = await estimate4337EthTransferGas(accounts.addr4337, 1);
    console.log(`Total gas used for ETH transfer in 4337: ${totalUsedGasIn4337}`);

    // Estimate gas for ETH transfer in RIP7560
    const estimateRes = await estimate7560EthTransferGasLegacyNonce(accounts.addr7560, 1);
    const totalUsedGasIn7560 = Number(estimateRes.verificationGasLimit) + Number(estimateRes.callGasLimit);
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
