// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "@bundler-spec-tests/tests/contracts/Create2.sol";
import "./Rip7560TestAccount.sol";

/**
 * A sample factory contract for SimpleAccount
 * A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
contract Rip7560SimpleAccountFactory {
    event Uint(uint);

    function createAccount(address owner, uint256 salt) external returns (address ret) {
        address create2address = getCreate2Address(owner, salt);
        // CALL
        create2address.call("");
        // CALLCODE
        assembly {
            let res := callcode(5000, create2address, 0, 0, 0, 0, 0)
        }
        // DELEGATECALL
        create2address.delegatecall("");
        // STATICCALL
        create2address.staticcall("");
        // EXTCODESIZE
        emit Uint(uint256(keccak256(create2address.code)));
        if (create2address == address(0)) revert();
        // EXTCODEHASH
        emit Uint(uint256(create2address.codehash));
        // EXTCODECOPY
        assembly {
            extcodecopy(create2address, 0, 0, 2)
        }
        ret = address(new Rip7560TestAccount{salt : bytes32(salt)}());
    }

    function getCreate2Address(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(
            type(Rip7560TestAccount).creationCode
        )));
    }
}
