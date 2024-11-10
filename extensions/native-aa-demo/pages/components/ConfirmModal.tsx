"use client"

import React, { useState } from 'react';
import styles from '../../styles/Home.module.css';
import { publicClient } from '../../utils/chain/client';
import { sendRip7560Transaction } from 'utils/sendRip7560Transaction';
import { TransactionReceipt } from 'viem-rip7560/src';
import { Hash } from 'viem-rip7560/src';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	transactionType: string;
	amount: bigint;
  setHash: (value: Hash | null) => void;
	setIsReceiptModalOpen: (value: boolean) => void;
	setIsError: (value: boolean) => void;
	setIsLoading: (value: boolean) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
	isOpen,
	onClose,
	transactionType,
	amount,
	setHash,
	setIsReceiptModalOpen,
	setIsError,
	setIsLoading
}) => {
	const [recipientAddress, setRecipientAddress] = useState<string>('');
	const isEthTransfer = transactionType === 'ETH';
	
	let hashForTx: Hash | null = null;
	const handleConfirm = async (transactionType: string, receipientAddress: string) => {
    try {
			setIsError(false);
			setIsLoading(true);

      hashForTx = await sendRip7560Transaction(transactionType, amount, receipientAddress);
			console.log("Transaction confirmed with hash:", hashForTx);
    } catch (error) {
      console.error("Transaction failed:", error);
			setIsError(true);
			setIsLoading(false);	
    } finally {
			onConfirm(hashForTx);
      onClose();
    }
  };

	const onConfirm = async (hashForTx: Hash | null) => {
		if (!hashForTx) return;
		setHash(hashForTx);
		setIsReceiptModalOpen(true);
  };

	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div 
				className={styles.confirmModalContent}
				onClick={(e) => e.stopPropagation()}
			>
				<p>To</p>
				<input
          type="text"
          placeholder="Input wallet address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className={styles.addressInput}
        />

				<div className={styles.modalButtons}>
					<button 
						onClick={() => handleConfirm(transactionType, recipientAddress)}
						className={styles.confirmButton}
						disabled={
							!recipientAddress || 
							!recipientAddress.startsWith('0x') || 
							recipientAddress.length !== 42
						}
					>
						{isEthTransfer ? 'Send 0.1 ETH' : 'Send 100 FQR'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmModal;
