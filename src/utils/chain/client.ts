import { createWalletClient, createPublicClient, http, Hex } from "viem-rip7560/src";
import { privateKeyToAccount } from "viem-rip7560/src/accounts";
import { pioneerChain } from "./pioneerChain";

export const walletClient = createWalletClient({
    chain: pioneerChain,
    transport: http(),
});

export const publicClient = createPublicClient({
    chain: pioneerChain,
    transport: http(),
});

export const bundlerClient = createPublicClient({
    chain: pioneerChain,
    transport: http('http://localhost:7560/rpc'), // TODO: change this
});
export const eoaWallet = privateKeyToAccount(process.env.PRIVATE_KEY! as Hex);