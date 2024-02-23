// import { HardhatUserConfig, task } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// const config: HardhatUserConfig = {
//   solidity: "0.8.20",
//   paths: { tests: "tests" },
// };

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// export default config;

import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-gas-reporter"

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  defaultNetwork: "sepolia",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    zoragoerli: {
      url: 'https://testnet.rpc.zora.energy/',
      accounts: [deployerPrivateKey],
    },
    // for mainnet
    zoramainnet: {
      url: 'https://rpc.zora.energy/',
      accounts: [deployerPrivateKey],
    },
  },
  gasReporter: {
    outputFile: "gas-report.txt",
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    noColors: true,
    coinmarketcap: process.env.COIN_MARKETCAP_API_KEY || "",
    token: "ETH"
  },
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
};

export default config;
