require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version : "0.8.28",
  },
  networks: {
    sepolia: {
      url: "https://1rpc.io/sepolia",
      chainId: 11155111,
      gasPrice: 20000000000,
      accounts: [process.env.EVM_PRIVATE_KEY],
    }
  }
};
