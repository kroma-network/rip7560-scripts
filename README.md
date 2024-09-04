## RIP-7560 Scripts for Simple Interactions

This is a simple scripts for basic interactions with Pioneer Alpha, which is OP Stack based devnet for Native Account Abstraction.
Pioneer Alpha implements [RIP-7560](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7560.md), [RIP-7711](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7711.md),
and [RIP-7712](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7712.md), offering full support for Native Account Abstraction on the OP Stack.

The implementation is fully open-sourced on the following repositories:

- [Execution client (geth)](https://github.com/kroma-network/7560-poc-geth): inspired by the [work of eth-infinitism](https://github.com/eth-infinitism/go-ethereum).
- [Consensus client (optimism)](https://github.com/kroma-network/7560-poc-optimism)
- [RIP-7560 compatible bundler](https://github.com/kroma-network/rip7560-bundler): inspired by the [Stackup ERC-4337 bundler](https://github.com/stackup-wallet/stackup-bundler).

For more information, please visit the following pages:

- [Motivation behind Pioneer Alpha](https://blog.kroma.network/beyond-erc-4337-native-account-abstraction-on-layer-2-aab89a83794b)
- [Official Launch Announcement](https://blog.kroma.network/calling-all-account-abstraction-builders-launch-of-pioneer-alpha-ce79190baddd)
- [Official Docs](https://docs.pioneer.kroma.network/)
- [Telegram Group for support](https://t.me/rip7560_pioneer)
- [Spec Thread on Optimism Spec Repository](https://github.com/ethereum-optimism/specs/discussions/202)

### Setup

1. Install dependencies.

Ensure you have Node.js installed, then run the following command to install the necessary dependencies:

```
npm install
```

2. Obtain test ETH from the faucet.

To interact with the Pioneer Alpha network, you'll need test ETH.
Visit the [Pioneer Alpha Faucet](https://faucet.pioneer.kroma.network/), input your wallet address, and receive test ETH to your account.

3. Configure the `.env` file

You'll need to set up a .env file with your wallet information. Follow these steps:

Copy the provided example file to create your own .env configuration:

```
cp .env.example .env
```

Open the .env file in your preferred text editor and add your wallet's private key:

```
WALLET=<your-private-key-here>
RPC_URL=https://api.pioneer.kroma.network
BUNDLER_URL=https://bundler.pioneer.kroma.network
```

Replace <your-private-key-here> with the private key of your wallet. Ensure this key is kept secure and never shared publicly.

### RIP-7560 Gas Estimation

To execute gas estimations for RIP-7560:

```
npm run estimate
```

After running the estimations, you can generate a graph to visualize the gas usage:

```
npm run draw-graph
```

### RIP-7560 Send Transaction

To send a RIP-7560 transaction to Pioneer Alpha, run the following command.

```
npm run send-tx
```

If you already deployed a RIP-7560 Account and has its address, you can simply run this command
to skip the deployment process.

```
npm run send-tx --address <ACCOUNT_ADDRESS>
```

### Additional Resources

- For more detailed information, please refer to the [official documentation](https://docs.pioneer.kroma.network).
- If you encounter any issues or need support, join the [Telegram Group](https://t.me/rip7560_pioneer).
