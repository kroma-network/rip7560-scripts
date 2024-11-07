// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "../interfaces/IRip7560EntryPoint.sol";

address constant ENTRY_POINT = 0x0000000000000000000000000000000000007560;

library Rip7560Helpers {
    //struct version, as defined in RIP-7560
    uint constant VERSION = 0;

    function accountAcceptTransaction(
        uint48 validAfter,
        uint48 validUntil
    ) internal {
        (bool success, ) = ENTRY_POINT.call(
            abi.encodeCall(
                IRip7560EntryPoint.acceptAccount,
                (validAfter, validUntil)
            )
        );
        require(success);
    }

    function sigFailTransaction(uint48 validAfter, uint48 validUntil) internal {
        (bool success, ) = ENTRY_POINT.call(
            abi.encodeCall(
                IRip7560EntryPoint.sigFailAccount,
                (validAfter, validUntil)
            )
        );
        require(success);
    }

    function paymasterAcceptTransaction(
        bytes memory context,
        uint256 validAfter,
        uint256 validUntil
    ) internal {
        (bool success, ) = ENTRY_POINT.call(
            abi.encodeCall(
                IRip7560EntryPoint.acceptPaymaster,
                (validAfter, validUntil, context)
            )
        );
        require(success);
    }
}
