import { fundAccountsWithEth } from "../deploy/setUp";
import { sendRip7560Transaction } from "./rip7560SendTransaction";

async function main() {
    const { addr7560 } = await fundAccountsWithEth();
    
    console.log(`Sending a simple ETH transfer transaction with ${addr7560}...`);
    const hash = await sendRip7560Transaction(addr7560);
    console.log('Transaction completed ✅');
    console.log(`🚀 Go to the explorer and check: https://blockscout.pioneer.kroma.network/tx/${hash}`);
}

main().then(() => process.exit(0))
