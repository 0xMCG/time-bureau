import { run } from "hardhat";
import { getJson, writeJson } from "./json";

const json = getJson();
async function doVerify(name: string, args: any[]) {
  const timenft = json[name];
  if (timenft && !timenft.verify) {
    await run("verify:verify", {
      address: timenft.address,
      constructorArguments: args,
    });
    console.info("verified:", name, timenft.address);
    timenft.verify = true;
    writeJson(json);
  } else if (timenft) {
    console.info("allready verified:", name, timenft?.address);
  }
}
async function main() {
  await doVerify("TimeBureau", ["ipfs://QmZ7kyGEaKZkFmo6gb6tMXqPFq6THquHweixhccGi6mMnq"]);
}
main();
