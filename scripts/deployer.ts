import { ethers, network } from "hardhat";
import { deployContract } from "./hutils";
const salt =
  "0x0000000000000000000000000000000000000000d4b6fcc21169b803f25d1111";
async function main() {
  // deploy
  const timeNFTAddress = await deployContract("TimeBureau", ["ipfs://QmZ7kyGEaKZkFmo6gb6tMXqPFq6THquHweixhccGi6mMnq"]);

  const wrapDeployErc20 = async () => {
    if (network.name == "arb_goerli" || network.name == "sepolia") {
      return await deployContract("TestERC20",[]);
    }
    if (network.name == "arb")
      return "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
    throw network.name + "Network not config";
  };
  const Erc20Address = await wrapDeployErc20();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
