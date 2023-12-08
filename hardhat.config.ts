import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";

// const optimizerSettingsNoSpecializer = {
//   enabled: true,
//   runs: 4_294_967_295,
//   details: {
//     peephole: true,
//     inliner: true,
//     jumpdestRemover: true,
//     orderLiterals: true,
//     deduplicate: true,
//     cse: true,
//     constantOptimizer: true,
//     yulDetails: {
//       stackAllocation: true,
//       optimizerSteps:
//         "dhfoDgvulfnTUtnIf[xa[r]EscLMcCTUtTOntnfDIulLculVcul [j]Tpeulxa[rul]xa[r]cLgvifCTUca[r]LSsTOtfDnca[r]Iulc]jmul[jul] VcTOcul jmul",
//     },
//   },
// };

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          // viaIR: true,
          optimizer: {
            enabled: true, runs: 9000
          },
          metadata: {
            bytecodeHash: "none",
          },
          outputSelection: {
            "*": {
              "*": ["evm.assembly", "irOptimized", "devdoc"],
            },
          },
        },
      },
    ]
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      blockGasLimit: 30_000_000,
      throwOnCallFailures: false,
      // Temporarily remove contract size limit for local test
      allowUnlimitedContractSize: false,
    },
    arb: {
      url: "https://arbitrum-one.public.blastapi.io",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    arb_goerli: {
      url: "https://arbitrum-goerli.public.blastapi.io",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  },

  etherscan: {
    apiKey: {
      arb: process.env.ARBSCAN_KEY || "",
      arb_goerli: process.env.ARBSCAN_KEY || "",
      sepolia: process.env.ETHERSCAN_KEY || "",
    },
    customChains: [
      {
        network: "arb",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io/",
        },
      },
      {
        network: "arb_goerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://goerli.arbiscan.io/",
        },
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io/",
        },
      },
    ],
  },
};

export default config;
