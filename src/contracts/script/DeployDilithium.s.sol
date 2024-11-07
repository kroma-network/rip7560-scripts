// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Packing} from "@tetrationlab/dilithium/contract/Packing.sol";
import {Dilithium} from "@tetrationlab/dilithium/contract/Dilithium.sol";
import {Invntt} from "@tetrationlab/dilithium/contract/Invntt.sol";
import {Ntt} from "@tetrationlab/dilithium/contract/Ntt.sol";
import {Polynomial} from "@tetrationlab/dilithium/contract/Poly.sol";
import {PolynomialVector} from "@tetrationlab/dilithium/contract/PolyVec.sol";
import {Stream} from "@tetrationlab/dilithium/contract/Symmetric.sol";
import {DilithiumPublicKey, PKMAT0, PKMAT1, PKMAT2, PKMAT3, PKT1} from "../src/dilithium/publicKey.sol";
import {DilithiumSimpleAccount} from "../src/dilithium/DilithiumSimpleAccount.sol";
import {IDilithiumPublicKey} from "../src/interfaces/IDilithiumPublicKey.sol";

contract DeployDilithiumScript is Script {
    PKMAT0 public pkmat0;
    PKMAT1 public pkmat1;
    PKMAT2 public pkmat2;
    PKMAT3 public pkmat3;
    PKT1 public pkt1;
    DilithiumPublicKey public dilithiumPublicKey;
    DilithiumSimpleAccount public dilithiumSimpleAccountImpl;
    ERC1967Proxy public dilithiumSimpleAccount;

    function run() public {
        vm.startBroadcast();

        // Deploy the public key contract
        pkmat0 = new PKMAT0();
        pkmat1 = new PKMAT1();
        pkmat2 = new PKMAT2();
        pkmat3 = new PKMAT3();
        pkt1 = new PKT1();

        dilithiumPublicKey = new DilithiumPublicKey(
            pkmat0,
            pkmat1,
            pkmat2,
            pkmat3,
            pkt1
        );
        console.log("dilithiumPublicKey: ", address(dilithiumPublicKey));

        // Deploy Dilithium contract
        Ntt ntt = new Ntt();
        Invntt invntt = new Invntt();
        Stream stream = new Stream();
        Polynomial poly = new Polynomial(ntt, stream);
        PolynomialVector polyVec = new PolynomialVector(ntt, invntt, poly);
        Packing packing = new Packing(poly);
        Dilithium dilithium = new Dilithium(poly, polyVec, packing);

        // Deploy DilithiumSimpleAccount contract
        dilithiumSimpleAccountImpl = new DilithiumSimpleAccount(
            dilithium,
            packing
        );

        // Deploy the proxy and initialize it
        dilithiumSimpleAccount = new ERC1967Proxy(
            address(dilithiumSimpleAccountImpl),
            abi.encodeCall(
                dilithiumSimpleAccountImpl.initialize,
                (IDilithiumPublicKey(address(dilithiumPublicKey)))
            )
        );

        console.log(
            "dilithiumSimpleAccount: ",
            address(dilithiumSimpleAccount)
        );

        vm.stopBroadcast();
    }
}
