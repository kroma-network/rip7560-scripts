import { fundAccountsWithEth, fundAddressWithEth } from "../deploy/setUp";
import { sendRip7560Transaction } from "./rip7560SendTransaction";
import { sendDilithiumTransaction } from "./dilithiumSendTransaction";
import { DilithiumWalletAddress } from "../../src/types/constants";

async function main() {
    const args = process.argv.slice(2);
    const useQuantum = args.includes('--quantum');

    if (useQuantum) {
        await runQuantum();
    } else {
        await runRip7560();
    }
}

async function runRip7560() {
    const { addr7560 } = await fundAccountsWithEth();

    console.log(`Sending a simple ETH transfer transaction with ${addr7560}...`);
    const receipt = await sendRip7560Transaction(addr7560);
    console.log('Transaction completed ✅');
    console.log('🚀 Transaction receipt info')
    console.log(stringifyBigInt(receipt))
}

function stringifyBigInt(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value, 2);
}

async function runQuantum() {
    await fundAddressWithEth(DilithiumWalletAddress);

    console.log(`Sending a simple ETH transfer transaction with ${DilithiumWalletAddress}...`);
    const receipt = await sendDilithiumTransaction(DilithiumWalletAddress);
    console.log('Transaction completed ✅');
    console.log('🚀 Transaction receipt info')
    console.log(stringifyBigInt(receipt))
}

main().then(() => process.exit(0))
