import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import { TestERC20 } from "./../typechain-types/contracts/TestERC20";
import { TimeNFT } from "./../typechain-types/contracts/TimeNFT";
import { expect } from "chai";

const { provider } = hre.ethers;

async function deployContract<T>(name: string, args: any[]): Promise<T> {
  const Factory = await hre.ethers.getContractFactory(name);
  const Contract = await Factory.deploy(...args);
  await Contract.deployed();
  const deployed = await hre.ethers.getContractAt(name, Contract.address);
  return deployed as T;
}

describe("TimeNFT", function () {
  let timeNFT: TimeNFT;
  let testERC20: TestERC20;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;

  async function setupFixture() {
    const timeNFT = await deployContract<TimeNFT>("TimeNFT", ["uri://"]);
    const testERC20 = await deployContract<TestERC20>("TestERC20", []);
    const [admin, user1, user2, user3] = await hre.ethers.getSigners();
    return { timeNFT, testERC20, admin, user1, user2, user3 };
  }
  beforeEach(async () => {
    ({ timeNFT, testERC20, admin, user1 } = await loadFixture(setupFixture));
  });

  it("Should enable mint", async function () {
    const start = Math.round(new Date().getTime() / 1000 - 60);
    await timeNFT.enableMint(
      start,
      start + 72 * 60 * 10,
      hre.ethers.utils.parseEther("10"),
      1000,
      5,
      testERC20.address,
      admin.address
    );

    await testERC20
      .connect(admin)
      .transfer(user1.address, hre.ethers.utils.parseEther("10000"));
    await testERC20
      .connect(user1)
      .approve(timeNFT.address, hre.ethers.utils.parseEther("100"));

    await timeNFT.connect(user1).mint(1, user1.address);
    await timeNFT.connect(admin).mint(6, admin.address);

    const u1Count = await timeNFT.balanceOf(user1.address, 1);
    expect(u1Count.toString()).is.eql("1");
    const adminCount = await timeNFT.balanceOf(admin.address, 1);
    expect(adminCount.toString()).is.eql("6");
    const mintInfo = await timeNFT.getMintInfo();
    expect(mintInfo.total.toString()).is.eql("7");
    const largeCountError = await timeNFT
      .connect(user1)
      .mint(6, user1.address)
      .then(() => false)
      .catch(() => true);
    expect(largeCountError).is.true;
  });

  it("Should get minted", async function () {
    const start = Math.round(new Date().getTime() / 1000 - 60);
    await timeNFT.enableMint(
      start,
      start + 72 * 60 * 10,
      hre.ethers.utils.parseEther("10"),
      1000,
      5,
      testERC20.address,
      admin.address
    );

    await testERC20
      .connect(admin)
      .transfer(user1.address, hre.ethers.utils.parseEther("10000"));
    await testERC20
      .connect(user1)
      .approve(timeNFT.address, hre.ethers.utils.parseEther("100"));

    await timeNFT.connect(user1).mint(1, user1.address);
    await timeNFT.connect(admin).mint(6, admin.address);

    const u1Minted = await timeNFT.minted(user1.address);
    expect(u1Minted.toString()).to.equal("1");
    const adminMinted = await timeNFT.minted(admin.address);
    expect(adminMinted.toString()).to.equal("6");
  });
});
