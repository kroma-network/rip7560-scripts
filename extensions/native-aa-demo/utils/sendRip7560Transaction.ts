import { dilithiumWallet } from './rip7560/dilithiumWallet';
import { getDummyAddress, getCallData, getRandomNonceKey } from './getters';
import { DILITHIUM_WALLET_ADDRESS, TRANSFER_ABI, FQR_ERC20_ADDRESS } from './types/constants';
import { walletClient } from './chain/client';
import { encodeFunctionData, Hex } from 'viem-rip7560/src';

export async function sendRip7560Transaction(transactionType: string, amount: bigint, to?: string): Promise<Hex> {
	if (!to) to = getDummyAddress();
	const erc20InnerCallData = encodeFunctionData({
		abi: TRANSFER_ABI,
		functionName: 'transfer',
		args: [to, BigInt(1)]
	});
	const executionData = transactionType == 'ETH' 
		? getCallData(to, amount, '0x') 
		: getCallData(FQR_ERC20_ADDRESS, amount, erc20InnerCallData);

	const account = await dilithiumWallet(DILITHIUM_WALLET_ADDRESS);

	const hash = await walletClient.sendTransaction({
		nonceKey: getRandomNonceKey(),
		sender: DILITHIUM_WALLET_ADDRESS,
		executionData,
		verificationGasLimit: BigInt(0),
		account,
	});

	return hash;
}