// npx hardhat run scripts/deploy.ts --network mumbai
import { parseEther } from "viem";
import hre from "hardhat";

const VERIFIER_ADDRESS = "0x6f723542c2417a49845B9ff9AF92B3c0cc9FC2Da";
const DENOMINATION = parseEther("0.1");
const TREE_HEIGHT = 10;

async function main() {
  const litTornado = await hre.viem.deployContract("LitTornado", [
    VERIFIER_ADDRESS,
    DENOMINATION,
    TREE_HEIGHT,
  ]);

  // 0xec3a882a8f786a34fd305a2c9b3a45b0c78e4a91
  // 0x30bb56f4eeb0cf40529527ecdfe576b904392bdb
  console.log("LitTornado deployed to:", litTornado.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
