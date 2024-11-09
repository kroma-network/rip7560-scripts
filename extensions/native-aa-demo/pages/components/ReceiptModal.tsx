"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../../styles/Home.module.css';
import { stringifyBigInts } from 'utils/getters';
import { Hash } from 'viem-rip7560/src';
import { publicClient } from 'utils/chain/client';
import { TransactionReceipt, Transaction } from 'viem-rip7560/src';

interface ReceiptModalProps {
	isOpen: boolean;
	onClose: () => void;
	hash: Hash | null;
	isError: boolean;
	setIsError: (value: boolean) => void;
	setIsLoading: (value: boolean) => void;
}

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
	isOpen, onClose, hash, isError, setIsError, setIsLoading
}) => {
	const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | null>(null);
	const [transactionData, setTransactionData] = useState<Transaction | null>(null);
	const [isReceiptView, setIsReceiptView] = useState<boolean>(false);

	useEffect(() => {
    const fetchTransactionReceipt = async () => {
			if (!hash) return;
      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
				const transaction = await publicClient.getTransaction({ hash });
				setTransactionData(transaction);
        setTransactionReceipt(receipt);
				setIsReceiptView(true);
				setIsLoading(false);
      } catch (error) {
				if ((error as string).startsWith("WaitForTransactionReceiptTimeoutError")) {
					setIsError(false);
					return;
				}
        console.error("Failed to fetch transaction receipt:", error);
        setIsError(true);
      }
    };

		fetchTransactionReceipt();
  }, [hash, isOpen]);

	if (!isOpen) return null;

	return (
		<>
			{isError && ( 
				<div className={styles.modalOverlay}>
					<div className={styles.receiptModalContent}>
						<h3>Unknown error occured.</h3>
						<h4>Failed to send your transaction.</h4>
						<button onClick={onClose} className={styles.closeButton}>Close</button>
					</div>
				</div>
			)}
			{!isError && !transactionReceipt && (
				<div className={styles.modalOverlay}>
					<div className={styles.receiptModalContent}>
						<h3>Transaction Pending</h3>
						<h4>Your transaction is being processed.</h4>
						<button onClick={onClose} className={styles.closeButton}>Close</button>
					</div>
				</div>
			)}
			{!isError && transactionReceipt && (
				<div className={styles.modalOverlay}>
					<div className={styles.receiptModalContent}>
					<h3>Transaction {isReceiptView ? "Receipt" : "Data"}</h3>
						<div className={styles.toggleLabel} onClick={() => setIsReceiptView(!isReceiptView)}>
							→ {isReceiptView ? "Transaction Data" : "Transaction Receipt"}
						</div>
						<div className={styles.scrollableContainer}>
							<ReactJson
								src={stringifyBigInts(isReceiptView ? transactionReceipt : transactionData)}
								name={false} 
								theme="google"
								collapsed={1} 
								enableClipboard={true} 
								displayDataTypes={false}
								displayObjectSize={false}
							/>
						</div>
						<button onClick={onClose} className={styles.closeButton}>Close</button>
					</div>
				</div>	
			)}
		</>
	);
}

export default ReceiptModal;
