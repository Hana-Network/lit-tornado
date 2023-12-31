// npx hardhat run scripts/deploy.ts --network mumbai
import { parseEther } from "viem";
import hre from "hardhat";

const VERIFIER_ADDRESS = "0x324ACc4B2D6CAAb70E39cA7bd5b6F0D12EcC529b";
const DENOMINATION = parseEther("0.1");
// const TREE_HEIGHT = 10;

async function main() {
  const litTornado = await hre.viem.deployContract("LitTornado", [
    VERIFIER_ADDRESS,
    DENOMINATION,
    // TREE_HEIGHT,
  ]);

  // 0xec3a882a8f786a34fd305a2c9b3a45b0c78e4a91
  // 0x30bb56f4eeb0cf40529527ecdfe576b904392bdb
  // 0xb0d829de1848581ed84402fc4e1205c12b9fe190
  // 0x75fc58514cf666640a3f5ca7d8e2f8c0fe262f86
  // 0x2897217b19b1aa6a7f7579dc4e29218318272b06
  // 0xf168fcbcf9b861b4f23e9502df5706de2ce73c06
  console.log("LitTornado deployed to:", litTornado.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
