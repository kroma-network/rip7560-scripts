import { setUpFactoryAndAccount } from "../deploy/setUp";
import { sendRip7560Transaction } from "./rip7560SendTransaction";

async function main() {
    const args = process.argv.slice(3);

    let address: string | undefined;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--address') {
            address = args[i + 1]; // Get the next argument as the address
            break;
        }
    }

    if (!address) {
        address = await setUpFactoryAndAccount();
    }

    console.log(`Sending a simple ETH transfer transaction with ${address}...`);
    const hash = await sendRip7560Transaction(address);
    console.log('Transaction completed ✅');
    console.log(`🚀 Go to the explorer and check: https://blockscout.pioneer.kroma.network/tx/${hash}`);
}

main().then(() => process.exit(0))
