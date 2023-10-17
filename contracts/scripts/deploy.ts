// npx hardhat run scripts/deploy.ts --network mumbai
import { parseEther } from "viem";
import hre from "hardhat";

const VERIFIER_ADDRESS = "0x951444F56EF94FeC42e8cDBeDef1A4Dc1D1ea63B";
const DENOMINATION = parseEther("0.1");
const TREE_HEIGHT = 10;

async function main() {
  const litTornado = await hre.viem.deployContract("LitTornado", [
    VERIFIER_ADDRESS,
    DENOMINATION,
    TREE_HEIGHT,
  ]);

  // 0xec3a882a8f786a34fd305a2c9b3a45b0c78e4a91
  console.log("LitTornado deployed to:", litTornado.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
