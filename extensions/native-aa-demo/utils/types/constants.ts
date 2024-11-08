export const DILITHIUM_WALLET_ADDRESS = "0x82B642D9deDb3Ad19b8E99FF3792A49d4d9d85Bf";
export const FQR_ERC20_ADDRESS = "0x82B642D9deDb3Ad19b8E99FF3792A49d4d9d85Bf";

export const EXECUTE_ABI = [
	{
		type: "function",
		name: "execute",
		inputs: [
			{ type: "address", name: "to" },
			{ type: "uint256", name: "value" },
			{ type: "bytes", name: "data" },
		],
	},
] as const;

export const TRANSFER_ABI = [
	{
		type: "function",
		name: "transfer",
		inputs: [
			{ type: "address", name: "to" },
			{ type: "uint256", name: "value" },
		],
	},
] as const;