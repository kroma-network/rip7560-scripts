import path from 'path';
import fs from 'fs';
import { ethers } from 'ethers';
import { 
    deployContract,
    deployContractWithConstructor,
    deployAccountWithFactory
} from './deployContract';
import { Entrypoint_V0_6_Address } from '../../src/types/constants';

export type Accounts = {
    addr4337: string;
    addr7560: string;
};

export async function setUpAccounts(): Promise<Accounts> {
    // Deploy ERC4337 SimpleAccount contract
    let contractArtifactPath = path.resolve(
        __dirname,
        '../../node_modules/@account-abstraction/contracts/artifacts/SimpleAccount.json'
    );
    let artifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
    const accountContract1 = await deployContractWithConstructor(artifact, [Entrypoint_V0_6_Address], 'ERC-4337 SimpleAccount');
    const addr1: string = accountContract1.address;

    // Deploy Rip7560SimpleAccount contract
    contractArtifactPath = path.resolve(
        __dirname,
        '../../artifacts/src/contracts/Rip7560/Rip7560SimpleAccount.sol/Rip7560SimpleAccount.json'
    );
    artifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
    const accountContract2 = await deployContract(artifact, 'RIP-7560 SimpleAccount');
    const addr2: string = accountContract2.address;

    // Set up the provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // Fund the target smart accounts
    console.log(`Sending 0.1 ETH to ${addr1}...`);
    let tx = await wallet.sendTransaction({
        from: wallet.address,
        to: addr1,
        value: ethers.utils.parseEther('0.1'),
    });
    await tx.wait();
    console.log(`Sent 0.1 ETH to ${addr1}`);

    console.log(`Sending 0.1 ETH to ${addr2}...`);
    tx = await wallet.sendTransaction({
        from: wallet.address,
        to: addr2,
        value: ethers.utils.parseEther('0.1'),
    });
    await tx.wait();
    console.log(`Sent 0.1 ETH to ${addr2}`);

    return { 
        addr4337: addr1,
        addr7560: addr2
    };
}

export async function setUpErc20(addr1: string, addr2: string) {
    // Deploy MockERC20 contract
    const contractArtifactPath = path.resolve(
        __dirname,
        '../../artifacts/src/contracts/mocks/MockERC20.sol/MockERC20.json'
    );
    const artifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
    const erc20Contract = await deployContract(artifact, 'MockERC20');
    const erc20Addr: string = erc20Contract.address;

    // Mint 1000 tokens to the accounts
    console.log(`Minting 1000 tokens to ${addr1}...`);
    let mintTx = await erc20Contract.mint(addr1, 1000);
    await mintTx.wait();
    console.log(`Minted 1000 tokens to ${addr1}`);

    console.log(`Minting 1000 tokens to ${addr2}...`);
    mintTx = await erc20Contract.mint(addr2, 1000);
    await mintTx.wait();
    console.log(`Minted 1000 tokens to ${addr2}`);

    return erc20Addr;
}

export async function setUpFactoryAndAccount(): Promise<string> {
    // Deploy AccountFactory contract
    const contractArtifactPath = path.resolve(
        __dirname,
        '../../artifacts/src/contracts/Rip7560/Rip7560SimpleAccountFactory.sol/Rip7560SimpleAccountFactory.json'
    );
    const artifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
    const factoryContract = await deployContract(artifact, 'RIP-7560 SimpleAccountFactory');

    const account = await deployAccountWithFactory(factoryContract.address, artifact, 1);

    // Set up the provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // Fund the target smart accounts
    console.log(`Sending 0.1 ETH to ${account}...`);
    let tx = await wallet.sendTransaction({
        from: wallet.address,
        to: account,
        value: ethers.utils.parseEther('0.1'),
    });
    await tx.wait();
    console.log(`Sent 0.1 ETH to ${account}`);

    return account;
}