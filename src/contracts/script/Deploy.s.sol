// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Rip7560SimpleAccount} from "../src/Rip7560/Rip7560SimpleAccount.sol";
import {Rip7560SimpleAccountFactory} from "../src/Rip7560/Rip7560SimpleAccountFactory.sol";
import {SimpleAccount} from "../src/Erc4337/SimpleAccount.sol";
import {SimpleAccountFactory} from "../src/Erc4337/SimpleAccountFactory.sol";
import {IEntryPoint} from "../src/interfaces/IEntryPoint.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract DeployScript is Script {
    Rip7560SimpleAccount public rip7560Account;
    Rip7560SimpleAccountFactory public rip7560Factory;
    SimpleAccount public simpleAccount;
    SimpleAccountFactory public erc4337Factory;
    MockERC20 public mockERC20;

    IEntryPoint public entrypoint;

    function run() public {
        entrypoint = IEntryPoint(0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789);
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast();

        rip7560Factory = new Rip7560SimpleAccountFactory();
        console.log("[LOG] rip7560Factory: ", address(rip7560Factory));

        rip7560Account = rip7560Factory.createAccount(owner, 0);
        console.log("[LOG] rip7560Account: ", address(rip7560Account));

        erc4337Factory = new SimpleAccountFactory(entrypoint);
        console.log("[LOG] erc4337Factory: ", address(erc4337Factory));

        simpleAccount = erc4337Factory.createAccount(owner, 0);
        console.log("[LOG] simpleAccount: ", address(simpleAccount));

        mockERC20 = new MockERC20();
        console.log("[LOG] mockERC20: ", address(mockERC20));

        vm.stopBroadcast();
    }
}
