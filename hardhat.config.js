/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    networks: {
      pioneer: {
        url: "https://api.pioneer.kroma.network",
        chainId: 11171168
      }
    },
    solidity: "0.8.24",
    paths: {
      sources: "./src/contracts",
      tests: "./test",
      cache: "./cache",
      artifacts: "./artifacts"
    }
};
  