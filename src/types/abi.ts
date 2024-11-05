import path from 'path';
import fs from 'fs';

function loadAbi(contractName: string): any {
    const contractArtifactPath = path.resolve(
        __dirname,
        `./abis/${contractName}.json`
    );
    return JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
}

export const MockERC20Abi = loadAbi('MockERC20').abi;
export const EntrypointAbi = loadAbi('Entrypoint').abi;

export const executeAbi = [
    {
        type: "function",
        name: "execute",
        inputs: [
            { type: "address", name: "to" },
            { type: "uint256", name: "value" },
            { type: "bytes", name: "data" },
        ],
    },
] as const;
export const transferAbi = [
    {
        type: "function",
        name: "transfer",
        inputs: [
            { type: "address", name: "to" },
            { type: "uint256", name: "value" },
        ],
    },
] as const;