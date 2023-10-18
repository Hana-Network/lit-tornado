import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY!],
    },
    // it doesn't work...
    chronicle: {
      url: process.env.CHRONICLE_RPC_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 175177,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
