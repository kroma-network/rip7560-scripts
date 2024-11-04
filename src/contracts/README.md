## Contracts for RIP-7560 and ERC-4337

### Compile

```shell
$ forge compile
```

### Deploy RIP-7560 and ERC-4337 SimpleAccount

```shell
$ source .env && forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

### Deploy quantum-safe Dilithium SimpleAccount

Before you run the below command, you must run build script at `script/dilithium/build.ts`. It will copy `publicKey.sol` into `src/dilithium`.

```shell
$ source .env && forge script script/DeployDilithium.s.sol:DeployDilithiumScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```
