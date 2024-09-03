import { setUpFactoryAndAccount } from "../deploy/setUp";
import { sendRip7560TransactionsBundle } from "./rip7560SendTransaction";

async function main() {
    const args = process.argv.slice(2);

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
    const hash = await sendRip7560TransactionsBundle(address);
    console.log(`Transaction hash: ${hash}`);
}

main().then(() => process.exit(0))
