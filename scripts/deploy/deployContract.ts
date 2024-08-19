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