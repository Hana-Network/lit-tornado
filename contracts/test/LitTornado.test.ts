// npx hardhat test ./test/LitTornado.test.ts
import { expect } from "chai";
import hre from "hardhat";
import { keccak256, parseGwei, toHex, getContract, encodePacked } from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("LitTornado", function () {
  const denomination = parseGwei("0.1");
  const merkleTreeHeight = 20;
  const secret =
    "0x9c1a3b673a4e4820143acbddb65082f13530a972df68a1eec1f5c09d70d1ca34"; //dummy secret
  const nullifier =
    "0x577123fe2d2107cd774e036861272d4d0d07e6bec0fe36ac936a6cccf1f3f00c"; //dummy nullifier
  const relayerFee = parseGwei("0.01");

  const commitment1 = keccak256(
    encodePacked(["bytes32", "bytes32"], [secret, nullifier])
  );

  async function litTornadoFixture() {
    const [owner, addr1, recipient, verifier, relayer] =
      await hre.viem.getWalletClients();

    const publicClient = await hre.viem.getPublicClient();

    const litTornadoContract = await hre.viem.deployContract("LitTornado", [
      verifier.account.address,
      denomination,
      merkleTreeHeight,
    ]);

    const litTornado = getContract({
      address: litTornadoContract.address,
      publicClient,
      walletClient: addr1,
      abi: litTornadoContract.abi,
    });

    return {
      litTornado,
      owner,
      addr1,
      recipient,
      verifier,
      relayer,
      publicClient,
    };
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

  describe("Withdraw", function () {
    async function litTornadoWithdrawFixture() {
      const {
        litTornado,
        owner,
        addr1,
        recipient,
        verifier,
        relayer,
        publicClient,
      } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;
      await litTornado.write.deposit([commitment], { value: denomination });
      const treeRoot = await litTornado.read.roots([BigInt(0)]);
      console.log("Target Merkle Tree Root:", treeRoot);

      return {
        litTornado,
        treeRoot,
        owner,
        addr1,
        recipient,
        verifier,
        publicClient,
        relayer,
      };
    }

    it("Should withdraw correctly", async function () {
      const {
        litTornado,
        treeRoot,
        verifier,
        publicClient,
        relayer,
        recipient,
      } = await loadFixture(litTornadoWithdrawFixture);

      const relayerLitTornado = getContract({
        address: litTornado.address,
        publicClient,
        walletClient: relayer,
        abi: litTornado.abi,
      });

      const root = treeRoot;
      const nullifierHash = keccak256(nullifier);
      const recipientAddress = recipient.account.address;
      const relayerAddress = relayer.account.address;
      const fee = relayerFee;

      const messageHash = keccak256(
        encodePacked(
          ["bytes32", "bytes32", "address", "address", "uint256"],
          [root, nullifierHash, recipientAddress, relayerAddress, fee]
        )
      );

      const signature = await verifier.signMessage({
        message: { raw: messageHash },
      });

      const recipientBalance = await publicClient.getBalance({
        address: recipientAddress,
      });

      await relayerLitTornado.write.withdraw([
        signature,
        root,
        nullifierHash,
        recipientAddress,
        relayerAddress,
        fee,
      ]);

      const withdrawalEvents = await relayerLitTornado.getEvents.Withdrawal();
      expect(withdrawalEvents).to.have.lengthOf(1);
      expect(withdrawalEvents[0].args.to?.toLowerCase()).to.equal(
        recipientAddress.toLowerCase()
      );

      expect(await litTornado.read.nullifierHashes([nullifierHash])).to.equal(
        true
      );

      expect(
        await publicClient.getBalance({
          address: recipientAddress,
        })
      ).to.equal(recipientBalance + (BigInt(denomination) - BigInt(fee)));
    });
  });
});
