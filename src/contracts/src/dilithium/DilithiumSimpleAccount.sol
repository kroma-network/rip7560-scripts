// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@tetrationlab/dilithium/contract/Dilithium.sol";
import "@tetrationlab/dilithium/contract/Packing.sol";
import "../interfaces/IDilithiumPublicKey.sol";
import "../Rip7560/Rip7560BaseAccount.sol";
import "../Rip7560/Rip7560Helpers.sol";

/**
 * Dilithium account implementation.
 * This contract provides the basic logic for implementing the IRip75660Account interface - validateTransaction
 */
contract DilithiumSimpleAccount is Rip7560BaseAccount, UUPSUpgradeable {
    using MessageHashUtils for bytes32;
    using ECDSA for bytes32;

    address private constant _entryPoint =
        0x0000000000000000000000000000000000007560;

    Dilithium immutable dilithium;
    Packing immutable packing;

    IDilithiumPublicKey public publicKey;

    event Rip7560SimpleAccountInitialized(
        address indexed entryPoint,
        IDilithiumPublicKey indexed publicKey
    );

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(Dilithium _dilithium, Packing _packing) {
        dilithium = _dilithium;
        packing = _packing;
        _disableInitializers();
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     * @param dest destination address to call
     * @param value the value to pass in this call
     * @param func the calldata to pass in this call
     */
    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external {
        _requireFromEntryPoint();
        _call(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
     * @param dest an array of destination addresses
     * @param value an array of values to pass to each call. can be zero-length for no-value calls
     * @param func an array of calldata to pass to each call
     */
    function executeBatch(
        address[] calldata dest,
        uint256[] calldata value,
        bytes[] calldata func
    ) external {
        _requireFromEntryPoint();
        require(
            dest.length == func.length &&
                (value.length == 0 || value.length == func.length),
            "wrong array lengths"
        );
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], 0, func[i]);
            }
        } else {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], value[i], func[i]);
            }
        }
    }

    /**
     * @param _publicKey the public key of the owner of this account
     */
    function initialize(
        IDilithiumPublicKey _publicKey
    ) public virtual initializer {
        _initialize(_publicKey);
    }

    function _initialize(IDilithiumPublicKey _publicKey) internal virtual {
        publicKey = _publicKey;
        emit Rip7560SimpleAccountInitialized(_entryPoint, _publicKey);
    }

    // Require the function call went through EntryPoint
    function _requireFromEntryPoint() internal view override {
        require(msg.sender == _entryPoint, "account: not Owner or EntryPoint");
    }

    /// implement template method of BaseAccount
    function _validateSignature(
        bytes calldata transaction,
        bytes32 txHash
    ) internal virtual override {
        TransactionType4 memory _tx = abi.decode(
            transaction,
            (TransactionType4)
        );

        Dilithium.ExpandedPublicKey memory epk = publicKey.expandedPublicKey();
        Dilithium.Signature memory sig;
        try this.unpackSig(_tx.authorizationData) returns (
            Dilithium.Signature memory _sig
        ) {
            sig = _sig;
        } catch {
            Rip7560Helpers.sigFailTransaction(0, 0);
        }

        try this.verify(sig, epk, txHash) returns (bool success) {
            if (success) {
                Rip7560Helpers.accountAcceptTransaction(0, 0);
            } else {
                Rip7560Helpers.sigFailTransaction(0, 0);
            }
        } catch {
            Rip7560Helpers.sigFailTransaction(0, 0);
        }
    }

    function unpackSig(
        bytes calldata _sig
    ) external view returns (Dilithium.Signature memory sig) {
        return packing.unpack_sig(_sig);
    }

    function verify(
        Dilithium.Signature calldata sig,
        Dilithium.ExpandedPublicKey calldata epk,
        bytes32 txHash
    ) external view returns (bool) {
        if (dilithium.verifyExpanded(sig, epk, bytes.concat(txHash))) {
            return true;
        } else {
            return false;
        }
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal pure override {
        (newImplementation);
    }
}
