// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "@tetrationlab/dilithium/contract/Dilithium.sol";

interface IDilithiumPublicKey {
    function expandedPublicKey() external view returns (Dilithium.ExpandedPublicKey memory);
}
