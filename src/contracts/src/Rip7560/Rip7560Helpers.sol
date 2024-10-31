// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

bytes4 constant MAGIC_VALUE_SENDER = 0xbf45c166;

bytes4 constant MAGIC_VALUE_SIGFAIL = 0x31665494;

function _packValidationData(
    bytes4 magicValue,
    uint48 validUntil,
    uint48 validAfter
) pure returns (bytes32) {
    return
        bytes32(
            uint256(uint32(magicValue)) |
                ((uint256(validUntil)) << 160) |
                (uint256(validAfter) << (160 + 48))
        );
}
