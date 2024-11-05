// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "../interfaces/IRip7560Account.sol";

/**
 * Basic account implementation.
 * This contract provides the basic logic for implementing the IAccount interface - validateUserOp
 * Specific account implementation should inherit it and provide the account-specific logic.
 */
abstract contract Rip7560BaseAccount is IRip7560Account {
    /// @inheritdoc IRip7560Account
    function validateTransaction(
        uint256 version,
        bytes32 txHash,
        bytes calldata transaction
    ) external virtual override returns (bytes32 validationData) {
        (version); // unused
        _requireFromEntryPoint();
        validationData = _validateSignature(transaction, txHash);
    }

    /**
     * Ensure the request comes from the known entrypoint.
     */
    function _requireFromEntryPoint() internal view virtual {
        require(
            msg.sender == 0x0000000000000000000000000000000000007560,
            "account: not from EntryPoint"
        );
    }

    /**
     * Validate the signature is valid for this message.
     * @param transaction     - Validate the transaction.signature field.
     * @param txHash          - Convenient field: the hash of the transaction, to check the signature against.
     * @return validationData - Signature and time-range of this operation.
     *                          <20-byte> aggregatorOrSigFail - 0 for valid signature, 1 to mark signature failure,
     *                                    otherwise, an address of an aggregator contract.
     *                          <6-byte> validUntil - last timestamp this transaction is valid. 0 for "indefinite"
     *                          <6-byte> validAfter - first timestamp this transaction is valid
     *                          If an account doesn't use time-range, it is enough to return SIG_VALIDATION_FAILED value (1) for signature failure.
     *                          Note that the validation code cannot use block.timestamp (or block.number) directly.
     */
    function _validateSignature(
        bytes calldata transaction,
        bytes32 txHash
    ) internal virtual returns (bytes32 validationData);

    function _decodeTransaction(
        bytes calldata transaction
    ) internal pure returns (TransactionType4 memory txData) {
        return abi.decode(transaction, (TransactionType4));
    }
}
