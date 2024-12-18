import { estimateEthTransfer } from "./estimateEthTransfer";
import { estimateErc20 } from "./estimateErc20";
import { fundAccountsWithEth, fundAccountsWithErc20 } from "../deploy/setUp";

async function estimateAtFirstTime() {
    const accounts = await fundAccountsWithEth();
    const erc20Addr = await fundAccountsWithErc20(accounts.addr4337, accounts.addr7560);

    await estimateEthTransfer(accounts);
    await estimateErc20(accounts, erc20Addr);
}

// TODO: add the function that will be called when the addresses are given.

estimateAtFirstTime().then(() => process.exit(0));

