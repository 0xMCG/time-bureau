import { ethers } from "hardhat";
import { getJson } from "./hutils";

async function main() {
    const json = getJson();
    const erc20Address = json["TestERC20"].address;
    const timeNFTAddress = json["TimeBureau"].address;
    const timeNFT = await ethers.getContractAt("TimeNFT", timeNFTAddress);
    const signer = (await ethers.getSigners())[0];
  
    const erc20 = await ethers.getContractAt("TestERC20", erc20Address);
    await erc20.approve(timeNFT.address, ethers.utils.parseEther("1000000")).then(t => t.wait(1))
    await timeNFT.mint(1, signer.address).then(t => t.wait(1));
    console.info("mintinfo:", await timeNFT.getMintInfo());
    console.info('nftCount:',  await timeNFT.balanceOf(signer.address, 1).then(t => t.toNumber()))
}
main();