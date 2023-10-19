// npx hardhat test ./test/LitTornado.test.ts
import { expect } from "chai";
import hre from "hardhat";
import {
  keccak256,
  parseGwei,
  parseEther,
  toHex,
  getContract,
  encodePacked,
  recoverMessageAddress,
} from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { verifyMerkleProof } from "./utils";
import { ethers } from "ethers";

describe("LitTornado", function () {
  const denomination = parseEther("0.01");
  const merkleTreeHeight = 20;
  const secret =
    "0x9c1a3b673a4e4820143acbddb65082f13530a972df68a1eec1f5c09d70d1ca34"; //dummy secret
  const nullifier =
    "0x577123fe2d2107cd774e036861272d4d0d07e6bec0fe36ac936a6cccf1f3f00c"; //dummy nullifier
  const relayerFee = parseEther("0.01");

  const commitment1 = keccak256(
    encodePacked(["bytes32", "bytes32"], [secret, nullifier])
  );
  console.log("Commitment 1:", commitment1);

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
      const treeRoot = await litTornado.read.getLastRoot();
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
    /*
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
*/
    it("check recovery address", async function () {
      const { litTornado, verifier } = await loadFixture(litTornadoFixture);
      console.log(verifier.account.address);
      const signature =
        "0xeecd54b25f1b9d3e33483194a9f379858939935f0c2c87b6ae432de6cfbd7d2464c289d819e9a2f2b3b595b9faadcb7affecc900aa169c9d0ae83ec3de7435bf1c";
      const root =
        "0x0058459724ff6ca5a1652fcbc3e82b93895cf08e975b19beab3f54c217d1c007";
      const nullifierHash =
        "0x2a84186a4711fa5d8b1438208bbdb010b68d683d1e2795fabc9fef91a1380dac";
      const recipientAddress = "0x951444F56EF94FeC42e8cDBeDef1A4Dc1D1ea63B";
      const relayerAddress = "0x951444F56EF94FeC42e8cDBeDef1A4Dc1D1ea63B";
      const fee = relayerFee;

      const message = encodePacked(
        ["bytes32", "bytes32", "address", "address", "uint256"],
        [root!, nullifierHash, recipientAddress!, relayerAddress!, fee]
      );
      // const abi = ethers.AbiCoder.defaultAbiCoder();
      // const message = abi.encode(
      //   ["bytes32", "bytes32", "address", "address", "uint256"],
      //   [root!, nullifierHash, recipientAddress!, relayerAddress!, fee]
      // ) as `0x${string}`;
      // const message = "hello";

      // const messageHash = keccak256(ethers.toUtf8Bytes(message));
      const messageHash = keccak256(message);

      console.log({ message });
      console.log({ messageHash });

      const testHash = await litTornado.read.hashTest([
        root,
        nullifierHash,
        recipientAddress,
        relayerAddress,
        fee,
      ]);
      console.log({ testHash });

      function hashMessage(message: Uint8Array | string): string {
        if (typeof message === "string") {
          message = ethers.toUtf8Bytes(message);
        }
        return ethers.keccak256(
          ethers.concat([
            ethers.toUtf8Bytes("\x19Ethereum Signed Message:\n32"),
            // ethers.toUtf8Bytes(String(message.length)),
            message,
          ])
        );
      }
      console.log("ethers.hashMessage: ", hashMessage(messageHash));
      // const signature = await verifier.signMessage({
      //   // message: { raw: messageHash },
      //   message,
      // });

      // const signature = (await wallet.signMessage(message)) as `0x${string}`;

      console.log({ signature });
      const recoverTestAddress = await litTornado.read.recoveryTest([
        signature,
        root,
        nullifierHash,
        recipientAddress,
        relayerAddress,
        fee,
      ]);
      console.log({ recoverTestAddress });

      const recoveredAddress_ = await recoverMessageAddress({
        message: message,
        signature: signature,
      });
      // recoveredAddresses are not the same...
      console.log({ recoveredAddress_ });

      const hoge = ethers.getBytes(ethers.hashMessage(message));
      const recoveredAddress = ethers.recoverAddress(hoge, signature);

      console.log({ recoveredAddress });

      // const expectedAddress = await wallet.getAddress();

      console.log(
        "ok???????????",
        ethers.verifyMessage(message, signature) === //verifier.account.address
          "0x6f723542c2417a49845B9ff9AF92B3c0cc9FC2Da"
      );
    });
  });

  // describe("generateProofFromCommitment", function () {
  //   it("Should generate a proof from a valid commitment", async function () {
  //     const { litTornado } = await loadFixture(litTornadoFixture);
  //     const commitment = commitment1;
  //     await litTornado.write.deposit([commitment], { value: denomination });

  //     const treeRoot = await litTornado.read.getLastRoot();
  //     // The logic in generateProofFromCommitment function is incorrect...
  //     // TODO: fix the logic
  //     const proof = await litTornado.read.generateProofFromCommitment([
  //       commitment,
  //     ]);

  //     console.log("Proof:", proof);
  //     expect(proof).to.be.an("array").that.is.not.empty;

  //     // expect(verifyMerkleProof(commitment, treeRoot, pathElements, pathIndices)).to.be.true;
  //   });
  // });
});
