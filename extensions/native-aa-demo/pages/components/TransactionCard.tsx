"use client"
import styles from '../../styles/Home.module.css'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import ReceiptModal from './ReceiptModal'
import LoadingOverlay from './LoadingOverlay'
import { parseEther } from 'viem-rip7560/src'

const TransactionCard = () => {
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<string>('');
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [hash, setHash] = useState<any>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

	const openConfirmModal = (type: string, amt: bigint) => {
    setTransactionType(type);
    setAmount(amt);
    setIsConfirmModalOpen(true);
  };

	return (
		<div className={styles.card}>
      <div className={styles.cardTitle}>ETH Transfer</div>
      <div className={styles.cardRow}>
        <div className={styles.cardColumn}>
          <button
            onClick={() => openConfirmModal('ETH', parseEther('0.1'))}
            className={styles.ethButton}
          >
            Send ETH
          </button>
        </div>
      </div>
      <div className={styles.cardTitle}>ERC-20 Transfer</div>
      <div className={styles.cardRow}>
        <div className={styles.cardColumn}>
          <button
            onClick={() => openConfirmModal('ERC20', parseEther('100'))}
            className={styles.ercButton}
          >
            Send FQR
          </button>
        </div>
      </div>

			<ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        transactionType={transactionType}
        amount={amount}
        setHash={setHash}
        setIsReceiptModalOpen={setIsReceiptModalOpen}
        setIsError={setIsError}
        setIsLoading={setIsLoading}
      />
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        hash={hash}
        isError={isError}
        setIsError={setIsError}
        setIsLoading={setIsLoading}
      />
      <LoadingOverlay isLoading={isLoading} />
		</div>
	)
}

export default TransactionCard