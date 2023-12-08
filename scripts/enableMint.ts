import { ethers, network } from "hardhat";
import { getJson } from "./hutils";

async function main() {
  const json = getJson();

  const erc20Address =
    network.name === "arb"
      ? "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
      : json["TestERC20"].address;
  const timeNFTAddress = json["TimeNFT"].address;
  const timeNFT = await ethers.getContractAt("TimeNFT", timeNFTAddress);
  const signer = (await ethers.getSigners())[0];

  const unixTime = Math.round(new Date().getTime() / 1000);
  await timeNFT
    .enableMint(
      unixTime - 24 * 60 * 60,
      unixTime + 7 * 24 * 60 * 60,
      ethers.utils.parseEther("10"),
      1000,
      5,
      erc20Address,
      signer.address
    )
    .then((tx) => tx.wait(1));
  console.info('mintInfo:', await timeNFT.getMintInfo())  
}
main();
