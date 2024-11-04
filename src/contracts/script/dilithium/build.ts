import * as dilitium from 'pqc_dilithium';
import fs from 'fs';
import { 
    toBytes,
    keccak256,
    encodePacked,
} from 'viem-rip7560/src';

type ExpandedPublicKeyDto = {
    packed: number[]
    mat: PolyVec[]
    t1: PolyVec
}

type Poly = {
    coeffs: number[]
}
  
type PolyVec = {
    vec: Poly[]
}

function build(mnemonic: string) {
    const keys = dilitium.Keys.derive(toBytes(mnemonic));
    const keyJson = keys.expanded_pk_json();
    
    buildPublicKeyContracts(JSON.parse(keyJson));
}

function buildPublicKeyContracts(keyJson: ExpandedPublicKeyDto) {
    fs.copyFileSync('src/dilithium/templates/publicKey.template.sol', 'src/contracts/src/dilithium/publicKey.sol')
    const solidity = fs.readFileSync('src/contracts/src/dilithium/publicKey.sol', 'utf8')
    const packedBuffer = Buffer.from(keyJson.packed)
    let newSolidity = solidity.replace("{%%packed%%}", packedBuffer.toString('hex'));

    // write t1
    for (let i = 0; i < keyJson.t1.vec.length; i++) {
        const newCoeffs = convertCoeffs(keyJson.t1.vec[i].coeffs)
        newSolidity = newSolidity.replace(`{%%t1.polys${i}%%}`, newCoeffs);
    }

    // write mat
    for (let i = 0; i < keyJson.mat.length; i++) {
        for (let j = 0; j < keyJson.mat[i].vec.length; j++) {
            const newCoeffs = convertCoeffs(keyJson.mat[i].vec[j].coeffs)
            newSolidity = newSolidity.replace(`{%%mat${i}.polys${j}%%}`, newCoeffs);
        }
    }

    fs.writeFileSync('src/contracts/src/dilithium/publicKey.sol', newSolidity)
}

function convertCoeffs(coeffs: number[]): string {
    let newCoeffs = [];
    newCoeffs = coeffs as any
    newCoeffs[0] = `int32(${newCoeffs[0]})`
    let text = `${newCoeffs.toString()}`
    return text
}

build("password")