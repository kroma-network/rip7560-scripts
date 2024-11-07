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
    ) external virtual override {
        (version); // unused
        _requireFromEntryPoint();
        _validateSignature(transaction, txHash);
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
     */
    function _validateSignature(
        bytes calldata transaction,
        bytes32 txHash
    ) internal virtual;

    function _decodeTransaction(
        bytes calldata transaction
    ) internal pure returns (TransactionType4 memory txData) {
        return abi.decode(transaction, (TransactionType4));
    }
}
