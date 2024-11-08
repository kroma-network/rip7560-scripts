"use client"

import React from 'react';
import ReactJson from 'react-json-view';
import styles from '../../styles/Home.module.css';
import { stringifyBigInts } from 'utils/getters';

interface ReceiptModalProps {
	isOpen: boolean;
	onClose: () => void;
	transactionReceipt: any;
	isError: boolean;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
	isOpen, onClose, transactionReceipt, isError
}) => {
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
						<h3>Transaction Receipt</h3>
						<div className={styles.scrollableContainer}>
							<ReactJson
								src={stringifyBigInts(transactionReceipt)}
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
