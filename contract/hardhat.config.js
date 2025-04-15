require("@nomicfoundation/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      accounts: [process.env.PRIVATE_KEY],
    },
    hardhat: {
      timeout: 200000, 
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};