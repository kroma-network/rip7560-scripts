import { publicClient } from "../chain/client";
import { Hex } from "viem-rip7560/src";

export async function getNonce(account: Hex): Promise<number> {
    return publicClient.getTransactionCount({
        address: account
    });
}