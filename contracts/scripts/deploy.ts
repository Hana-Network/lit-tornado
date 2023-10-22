// npx hardhat run scripts/deploy.ts --network mumbai
// npx hardhat run scripts/deploy.ts --network scrollSepolia
// npx hardhat verify --network scrollSepolia 0x71073366a8b61b1b6634554a9e24cd07b31cb7d4 0x324ACc4B2D6CAAb70E39cA7bd5b6F0D12EcC529b 10000000000000000  --show-stack-traces
// npx hardhat verify --network mumbai 0xf168fcbcf9b861b4f23e9502df5706de2ce73c06 0x324ACc4B2D6CAAb70E39cA7bd5b6F0D12EcC529b 100000000000000000
import { parseEther } from "viem";
import hre from "hardhat";

const VERIFIER_ADDRESS = "0x324ACc4B2D6CAAb70E39cA7bd5b6F0D12EcC529b";
const DENOMINATION = parseEther("0.01");
// const TREE_HEIGHT = 10;

async function main() {
  const litTornado = await hre.viem.deployContract("LitTornado", [
    VERIFIER_ADDRESS,
    DENOMINATION,
    // TREE_HEIGHT,
  ]);

  // mumbai
  // 0xf168fcbcf9b861b4f23e9502df5706de2ce73c06
  // scrollSepolia
  // 0x71073366a8b61b1b6634554a9e24cd07b31cb7d4
  console.log("LitTornado deployed to:", litTornado.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
