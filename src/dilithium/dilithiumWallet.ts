import { toNativeSmartAccount } from "viem-rip7560/src/experimental";
import { publicClient, bundlerClient } from "src/utils";
import { 
  decodeFunctionData, 
  encodeFunctionData,
  keccak256,
  serializeTransaction,
  hashMessage,
  BaseError,
  Hash,
  Address,
  Hex,
  TypedDataDefinition,
  TypedData,
  TransactionSerializable,
  hashTypedData,
  toBytes,
  fromHex,
  toHex
} from "viem-rip7560/src";
import * as dilithium from "pqc_dilithium";


export async function dilithiumWallet(address: Hex) {
  return toNativeSmartAccount({
    client: publicClient,
    bundlerClient: bundlerClient,
    address,

    async decodeCalls(data) {
      const result = decodeFunctionData({
        abi,
        data,
      })
    
      if (result.functionName === 'execute')
        return [
          { to: result.args[0], value: result.args[1], data: result.args[2] },
        ]
      if (result.functionName === 'executeBatch')
        return result.args[0].map((target, index) => ({
            to: target,
            value: result.args[1][index],
            data: result.args[2][index],
          }))
        throw new BaseError(`unable to decode calls for "${result.functionName}"`)
      },
    
      async encodeCalls(calls) {
        if (calls.length === 1)
          return encodeFunctionData({
            abi,
            functionName: 'execute',
            args: [calls[0].to, calls[0].value ?? BigInt(0), calls[0].data ?? '0x'],
          })
        return encodeFunctionData({
          abi,
          functionName: 'executeBatch',
          args: [
            calls.map((call) => call.to),
            calls.map((call) => call.value ?? BigInt(0)),
            calls.map((call) => call.data ?? '0x'),
          ],
        })
      },


      async getAddress() {
        return address
      },
    
      async getDeployerArgs() {
        return {
          deployer: undefined,
          deployerData: undefined,
        }
      },
    
      async getStubSignature() {
        return '0x6e0132c21443f2a0ad9d4ab47cc12e4f29b744ce4971ef93e11cd82fcbb0616c55278e80823c1effe8b95cb25295cd85be915d1194c5142a16b304f208716d4eea6f85f60df75763216a92a1c3063fc9a5f567cb556b58512a640b046701dcf5608d47023b965176369b4d9749abb6984f0c47688644b3be8fe93af5e6826b6af164c98061bb296e876668811c53667ccedb478eccc6b3502e30c719931a1e3c60d68e08fc48e2630038fe86cbcc50682d027e438882629e23f2a0c1bc1fb76c693b630614d6a1d5f4963a6328312ebfb638c38d753ae398c40c5b19e08a8fdf06478eadaa5dfb1c21080af0058911293c047da7ee16626db0461041f1a90f9654a525e9a62f2381b18c9a645de5ad996a03b2104a2ad4f5d189bb82f5f619559da669bf303e1a4e79109b2b33cc242b5e5b054849156b72bcbf704fdb5484ae48bbb5dd6c30669c1de31ab651da45231ad1d73a9d3a5701acad3927f5126c54b70ded40ad568d7073db68f041f3913e91c20f78d6a0287a36caf14e4a63ffb0f6ade9b150c62efbb085427589598428cb90f14d945bc8a25fe01d10bc824a0beccbd774ad8cf36e7f443a462845c120af4dc2d0ceba86aeadeaab0c600304c00bb965a9cbea39606620cb20e4a3a4d534f75528a85bfcee8851c923b503dadf3427e8e9727852bafaa72b29f86998bdda8cea6502e645c2f20264314d28b8197feec6b3821d88b9e6d4ec17df5e4baa3917adb8a7ccf33b0d603f79a2e3c30e75b26c956ffb7e51b84d152a740d1eca981f352faddd3b5c04929156b785a8885787c71acc839b2c034e116b4efedea1f799f1549c2f7097c47e414cd4f1d38f01510805b57585e773cd2ac5531ba4ba1db0b25c99d48682472632448ef6053b3d16adbef7473ccc2b29add2ffc41589808fb09058e350912b1c2c232678b6a1e2829e9e33308b73dec55c20421e7db12f08c8c64f59c9321341edde0680618a32b67a2f8f8672986877777cf9c0256f30adf28a6d581d9b47fe2b162b31a090a6f1286b8d283a5ea02274fe8520a978d333ad34ef27f4f699ed968a404efe08ebacf5a39597b7c52edb3d50998fc08275492f6bac443a81e5063203494abb94ee333005abb1ab8e4c7e57c26ffd032e2a8d9d4d2a47f0287c3dc4c2a211b8866c6470437b3b0f99a7f8f8c810ebb4e485daf2eb0face20dae557f515ea30522c5753155421e106a54161812ec12f93133b12c5be299cb061fd5421f067b18da77afee52f3947a9e9bc115f5949477370ab3366ae77332d32161bfad82d7fd005e7a6978483bce45f0ca3f9a0f18c4fafaba28113893b076bba3a7e4baea9f8b741db4306ded4da847223f9b087257b28bf26ae640672e2935ae6bab3df944cbb29289ca6b8674c14fcce353aab522b49bde51d8d897d0040953572fbb01f20ee7d70987e2a5d35a63e74450192ac6bcf494b4d74a275d8a2927414263fe44a07fda45798da4dd8f00f09ce8aea4929bc10b5238e9a9cda448cc51f4d6e7349fb548a567b62f9822565072118f2ed27658beb1eb4fb5cc46d9abaafe758de20b02420e7ea03f39ae8a43fbbad4c6b030e7cc777ddc94b985be797d30f82eed6b9ffad980725b1bb608b764195d8775c58038ec31f541aef32ebc1bcb5de7683de3187c47d3e81f7e1126f6fdadd89688dad36de27a6d3b2d6db0168caddd34c04b55ae74a417d87dfccd28b6c555da8267b03abe75005448cf82f92a7db8dc1386ffd1a04b79e3c475b52e1cb16eb1345ba7ffc4ad21b20cbd5e6f94c3ee335adf822f19f1e011bdc1fc9f5443ff25a3c75227bd37aa428a89134aa1b01c3b9d7ab880ed9ce8a0bb962f8d882c782d3a6bdf2f734fac78634a5d1a34eed92d4b09962d8b00f97d86b8b2a3c7b387a78c618547ae64b9140b83aa9bf54f79b85c820c8a4d2b11ffb2c4a98006bef2538b410cc1ec0bf6976a143ce334629311b1530d258b916aaf2eac05cb88171bc58ff48c9ddc8328f48ee3b1a873b4a76fb40ed4abf75bd1a6a40ae8b9cdb7798fdb7566cd66adf82fa18ab80af7a241bf568f1dbb900f00696abf556911fd1326706f650f6414ab31e08ba0d9988cf04a4598710e4adb99fdcca836fd67eef8de4a58c708ee254b522cdefcc2a254aee53dd60d8fa42676246302f976bd0b150bac4d0b50a6e023145a97edd1754d5a0b6273d77a9abe025db21699b4d3b8b3081ed1c4717ed9376ab824e98fa56a21ad7ce41ea743ad7bbd0d43afc8fd80834ff20a4ce00dcd3bbc2686d744a605aaee54a06545664d38ae379ece174e37ffcf2c54aea1b131b26d257b82936b78160324445688150490a960f4f130e8c2094ce986d0d83be3d67e336e811db75619f4b17e7882e290f47679fb539d8e225982eba6119dd7d1ae20aed8fd8217a914611ba0a662b5b2dce9aa39b5d12d905f8df96cddacfcfdc7e67e96575fc700bf80d551137b46e9755da6c5b891d07a394ff99b23b2cab727d0f966607f883b1647015057cb49322f5032d209cf5cca64f5c8ea9d78355ae34e9d884c9b2d7460163d8de0e88622a68bbc08fd6c2f161198dafe31a56e59ac9ab87041edc518651f99cd0e6c0470852473b77f4579eacd10a549a8f9d6d8123e2117fa496a1c3f2a16c84b16afecd067e1d4fee71be97f608b9a263f30d9e8f755f5c7009b97fc4f943d6c91b929c3db99cccb8cee7ec8209bc6e8de83749cc9c561d50c90d0c4cfeba9c07e4b3c375f75af0e4b729b78fade1a2fa24450ec1c634317a2511a5a2c626dc73d66184da922d08128208259cac34fd5010d150762d1dafb98086f476dc75b1312d9c5cb6bbf9597b45f063f55963d164709b3d065889c43f2e9fc24a1d0d3a34533d956a021a3a62e2458ddad9e1e4d5b4c0c7508492ac0b1eec83f16ba48521f394992d0f1c42f680f19c7ef05999617dda487d154804b838e1c52b7589315ca7c1230149d52fa0f145b1030caeffa8485e51880e93cb5996e134ce07a417352d041c9c1e9e534b66ac9cade58c1863f2a780f6e5812c59455754252dad37e3413cf09dd4623613babb068112fd2de4ce5e3a49906bb1896b4f84a679eedc4d4c9abd1a01bada588fb9949a67b7c953fbe2fab89cdf21e2fbfc0af86d895e9dfdc5f76746cd674cd7ce84036ab2445702ef08548b812333984eb43aa50a605bad3d8e2856aca172d822ba1893fd5d6691cbfc645ba291b909685a60c9a20dd90a374a4cbd57d931b47561eb21b6b1b3539f895331d4c4bc5b1ca82898f0514555d67696c7a83868df70b191c242b3f445eabb3d8d9dbdfe1f7f802161a363e5063696d8098a0a1c6d8f7fa0442545b6e818ba4a6abbc00000000000000000000000000000000000000000000000c1d2e39' as Hex
      },
    
      async sign(parameters) {
        const address = await this.getAddress()
  
        const hash = toReplaySafeHash({
          address,
          chainId: publicClient.chain!.id,
          hash: parameters.hash,
        })
  
        const signature = await sign({ hash })
  
        return signature
      },
    
      async signMessage(parameters) {
        const { message } = parameters
        const address = await this.getAddress()
  
        const hash = toReplaySafeHash({
          address,
          chainId: publicClient.chain!.id,
          hash: hashMessage(message),
        })
  
        const signature = await sign({ hash })
  
        return signature
      },
    
      async signTypedData(parameters) {
        const { domain, types, primaryType, message } =
          parameters as TypedDataDefinition<TypedData, string>
        const address = await this.getAddress()
  
        const hash = toReplaySafeHash({
          address,
          chainId: publicClient.chain!.id,
          hash: hashTypedData({
            domain,
            message,
            primaryType,
            types,
          }),
        })
  
        const signature = await sign({ hash })
  
        return signature
      },
    
      async signTransaction(parameters) {
        const { chainId = publicClient.chain!.id, ...transaction } = parameters
  
        const address = await this.getAddress()
        const serializableTransaction = {
          ...transaction,
          sender: address,
          chainId,
        } as TransactionSerializable
        const hash = keccak256(serializeTransaction(serializableTransaction))
  
        const signature = await sign({ hash })
  
        return signature
      },
    
      transaction: {
        async estimateGas(transaction) {
          return {
            verificationGasLimit: BigInt(
              Number(transaction.verificationGasLimit ?? BigInt(0)),
            ),
          }
        },
      },
  })
}


export async function sign({
    hash,
}: { hash: Hash; }) {
  const keys = dilithium.Keys.derive(toBytes("password"))
  const bytes = keys.sign_bytes(fromHex(hash, "bytes"), true);

  return toHex(bytes)
}

/** @internal */
export function toReplaySafeHash({
  address,
  chainId,
  hash,
}: { address: Address; chainId: number; hash: Hash }) {
  return hashTypedData({
    domain: {
      chainId,
      name: 'Simple Native Smart Wallet',
      verifyingContract: address,
      version: '1',
    },
    types: {
      SimpleNativeSmartWalletMessage: [
        {
          name: 'hash',
          type: 'bytes32',
        },
      ],
    },
    primaryType: 'SimpleNativeSmartWalletMessage',
    message: {
      hash,
    },
  })
}

const abi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_packValidationData',
    inputs: [
      { name: 'magicValue', type: 'bytes4', internalType: 'bytes4' },
      { name: 'validUntil', type: 'uint48', internalType: 'uint48' },
      { name: 'validAfter', type: 'uint48', internalType: 'uint48' },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [
      { name: 'dest', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'func', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'executeBatch',
    inputs: [
      { name: 'dest', type: 'address[]', internalType: 'address[]' },
      { name: 'value', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'func', type: 'bytes[]', internalType: 'bytes[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [{ name: 'anOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      { name: 'newImplementation', type: 'address', internalType: 'address' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'validateTransaction',
    inputs: [
      { name: 'version', type: 'uint256', internalType: 'uint256' },
      { name: 'txHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'transaction', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SimpleAccount7560Initialized',
    inputs: [
      {
        name: 'entryPoint',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'ECDSAInvalidSignature', inputs: [] },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureLength',
    inputs: [{ name: 'length', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureS',
    inputs: [{ name: 's', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      { name: 'implementation', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'FailedCall', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }],
  },
] as const