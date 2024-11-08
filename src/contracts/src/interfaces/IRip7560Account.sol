// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

struct TransactionType4 {
    address sender;
    uint256 nonceKey;
    uint256 nonce;
    uint256 validationGasLimit;
    uint256 paymasterGasLimit;
    uint256 postOpGasLimit;
    uint256 callGasLimit;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    uint256 builderFee;
    address paymaster;
    bytes paymasterData;
    address deployer;
    bytes deployerData;
    bytes executionData;
    bytes authorizationData;
}

interface IRip7560Account {
    function validateTransaction(
        uint256 version,
        bytes32 txHash,
        bytes calldata transaction
    ) external;
}
