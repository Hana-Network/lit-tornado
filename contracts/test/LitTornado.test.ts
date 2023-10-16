// npx hardhat test ./test/LitTornado.test.ts
import { expect } from "chai";
import hre from "hardhat";
import { keccak256, parseGwei, toHex, getContract } from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("LitTornado", function () {
  const denomination = parseGwei("0.1");
  const merkleTreeHeight = 20;
  const verifierAddress = "0x951444F56EF94FeC42e8cDBeDef1A4Dc1D1ea63B"; //dummy address
  const nullifier =
    "0x577123fe2d2107cd774e036861272d4d0d07e6bec0fe36ac936a6cccf1f3f00c"; //dummy nullifier
  const secret =
    "0x9c1a3b673a4e4820143acbddb65082f13530a972df68a1eec1f5c09d70d1ca34"; //dummy secret
  const relayerAddress = verifierAddress;
  const relayerFee = parseGwei("0.01");
  // TODO: should use ABI encode for security reasons
  const commitment1 = keccak256(toHex(nullifier + secret));

  async function litTornadoFixture() {
    const [owner, addr1, addr2] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();
    const litTornadoContract = await hre.viem.deployContract("LitTornado", [
      verifierAddress,
      denomination,
      merkleTreeHeight,
    ]);

    const litTornado = getContract({
      address: litTornadoContract.address,
      publicClient,
      walletClient: addr1,
      abi: litTornadoContract.abi,
    });

    return { litTornado, owner, addr1, addr2, publicClient };
  }

  describe("Deposit", function () {
    it("Should deposit correctly", async function () {
      const { litTornado } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;

      await litTornado.write.deposit([commitment], {
        value: denomination,
      });

      expect(await litTornado.read.commitments([commitment])).to.equal(true);
    });

    it("Should revert if sent value is not equal to denomination", async function () {
      const { litTornado } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;
      const wrongValue = parseGwei("0.5");

      await expect(
        litTornado.write.deposit([commitment], { value: wrongValue })
      ).to.be.rejectedWith(
        "Please send `denomination` ETH along with transaction"
      );
    });

    it("Should revert if the same commitment is used", async function () {
      const { litTornado } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;
      await litTornado.write.deposit([commitment], { value: denomination });

      await expect(
        litTornado.write.deposit([commitment], { value: denomination })
      ).to.be.rejectedWith("The commitment has been submitted");
    });
  });
});
