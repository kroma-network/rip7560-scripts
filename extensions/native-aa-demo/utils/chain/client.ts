import { createWalletClient, createPublicClient, http } from "viem-rip7560/src";
import { pioneerChain } from "./pioneerChain";

export const walletClient = createWalletClient({
	chain: pioneerChain,
	transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

export const publicClient = createPublicClient({
	chain: pioneerChain,
	transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

export const bundlerClient = createPublicClient({
	chain: pioneerChain,
	transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL),
});
