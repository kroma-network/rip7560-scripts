import { ethers } from 'ethers';

export async function deployContract(artifact: any, name: string): Promise<ethers.Contract> {
    // Set up the provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // Contract factory to deploy the contract
    const Account = new ethers.ContractFactory(
        artifact.abi,
        artifact.bytecode,
        wallet
    );

    console.log(`Deploying the ${name} contract...`);
    const contract = await Account.deploy();

    await contract.deployTransaction.wait();

    console.log(`${name} contract deployed at address: ${contract.address}`);

    return contract;
}

export async function deployContractWithConstructor(artifact: any, constructorArgs: any, name: string): Promise<ethers.Contract> {
    // Set up the provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // Contract factory to deploy the contract
    const Account = new ethers.ContractFactory(
        artifact.abi,
        artifact.bytecode,
        wallet
    );

    console.log(`Deploying the ${name} contract...`);
    const contract = await Account.deploy(...constructorArgs);

    await contract.deployTransaction.wait();

    console.log(`${name} contract deployed at address: ${contract.address}`);

    return contract;
}

export async function deployAccountWithFactory(factoryAddress: string, factoryArtifact: any, salt: number): Promise<string> {
    // Set up the provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    if (!Array.isArray(factoryArtifact.abi)) {
        throw new Error("Invalid ABI format. ABI should be an array.");
    }

    // Contract factory to deploy the contract
    const factory = new ethers.Contract(
        factoryAddress,
        factoryArtifact.abi,
        wallet
    );

    console.log(`Deploying the account contract...`);
    const tx = await factory.createAccount(wallet.address, salt);

    await tx.wait();
    const deployedAddress = await factory.callStatic.createAccount(wallet.address, salt);
    console.log(`Account contract deployed at address: ${deployedAddress}`);

    return deployedAddress;
}