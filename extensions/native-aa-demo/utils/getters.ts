import { publicClient } from "./chain/client";
import { Address, encodeFunctionData, Hex } from "viem-rip7560/src";
import { EXECUTE_ABI } from "./types/constants";

export async function getNonce(account: Hex): Promise<number> {
	return publicClient.getTransactionCount({
		address: account
	});
}

export function getDummyAddress(): string {
	return "0x1e358e9C944b8b1Def896Bb63AdD6c2d2E5A0F90"
}

export function getCallData(to: string, value: bigint, data: string): Hex {
	return encodeFunctionData({
		abi: EXECUTE_ABI,
		functionName: 'execute',
		args: [to, value, data]
	});
}

export function getRandomNonceKey(): bigint {
	const randomBytes = crypto.getRandomValues(new Uint8Array(24));

	// Convert the bytes to a BigInt
	let randomBigInt = BigInt(0);
	for (let i = 0; i < randomBytes.length; i++) {
			randomBigInt = (randomBigInt << BigInt(8)) + BigInt(randomBytes[i]);
	}

	return randomBigInt;
}

export function toAddress(data: Hex): Address {
  // Extract the last 40 characters (20 bytes) to get the address
  const address = '0x' + data.slice(-40);
  return address as Address;
}

export function formatShortenedHex(data: Hex): string {
  const prefix = data.slice(0, 6);
  const suffix = data.slice(-4); 

  return `${prefix}...${suffix}`;
}

export function stringifyBigInts(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString(); // Convert BigInt to string
  } else if (Array.isArray(obj)) {
    return obj.map(stringifyBigInts); // Recursively process array elements
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, stringifyBigInts(value)])
    ); // Recursively process object properties
  } else {
    return obj; // Return other types as-is
  }
}
