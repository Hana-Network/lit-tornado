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
import {
  generateCommitment,
  generateRandom32BytesHex,
  verifyMerkleProof,
} from "./utils";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";

describe("LitTornado", function () {
  const denomination = parseEther("0.01");
  const merkleTreeHeight = 10;
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
      // merkleTreeHeight,
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

    /*
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
        "verifyMessage,
        ethers.verifyMessage(message, signature) === //verifier.account.address
          "0x6f723542c2417a49845B9ff9AF92B3c0cc9FC2Da"
      );
    });
    */

    it("get all leaves", async function () {
      const { litTornado } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;
      await litTornado.write.deposit([commitment], { value: denomination });
      const leaves = await litTornado.read.getLeaves();

      expect(leaves.length).to.equal(2 ** merkleTreeHeight);
      expect(leaves[0]).to.equal(commitment);
      expect(BigInt(leaves[1])).to.equal(BigInt(0));
    });

    it("merkle proof verification", async function () {
      const { litTornado } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;

      await litTornado.write.deposit([commitment], { value: denomination });
      const commitment2 = generateCommitment(
        generateRandom32BytesHex(),
        generateRandom32BytesHex()
      );
      // const commitment2 =
      //   "0xec4c70e5233db463d65d0e5a07af8210654d8534e7ecc2183592ee3f6d14f7ee";
      await litTornado.write.deposit([commitment2], { value: denomination });

      const commitment3 = generateCommitment(
        generateRandom32BytesHex(),
        generateRandom32BytesHex()
      );
      await litTornado.write.deposit([commitment3], { value: denomination });

      const leaves = await litTornado.read.getLeaves();
      const treeRoot = await litTornado.read.getLastRoot();

      const tree = new MerkleTree([...leaves], keccak256, { sort: false });
      const root = tree.getHexRoot() as `0x${string}`;
      const proof = tree.getHexProof(commitment) as `0x${string}`[];
      // console.log(proof);
      const leafIndex = leaves.indexOf(commitment);
      expect(root).to.equal(treeRoot);

      expect(
        verifyMerkleProof(commitment, root, proof, leafIndex, merkleTreeHeight)
      ).to.equal(true);

      const proof2 = tree.getHexProof(commitment2) as `0x${string}`[];
      // console.log({ treeRoot });
      // console.log({ root });
      // console.log({ commitment2 });
      // console.log({ leaves });
      // console.log({ tree: tree.getHexLeaves() });
      // console.log({ proof2 });
      const leafIndex2 = leaves.indexOf(commitment2);
      expect(
        verifyMerkleProof(
          commitment2,
          root,
          proof2,
          leafIndex2,
          merkleTreeHeight
        )
      ).to.equal(true);

      const proof3 = tree.getHexProof(commitment3) as `0x${string}`[];
      const leafIndex3 = leaves.indexOf(commitment3);
      expect(
        verifyMerkleProof(
          commitment3,
          root,
          proof3,
          leafIndex3,
          merkleTreeHeight
        )
      ).to.equal(true);

      expect(
        verifyMerkleProof(
          commitment3,
          root,
          proof2,
          leafIndex3,
          merkleTreeHeight
        )
      ).to.equal(false);
    });
  });

  /*
  describe("generateProofFromCommitment", function () {
    it("Should generate a proof from a valid commitment", async function () {
      const { litTornado } = await loadFixture(litTornadoFixture);
      const commitment = commitment1;
      await litTornado.write.deposit([commitment], { value: denomination });

      const commitment2 = generateCommitment(
        generateRandom32BytesHex(),
        generateRandom32BytesHex()
      );

      await litTornado.write.deposit([commitment2], { value: denomination });

      const treeRoot = await litTornado.read.getLastRoot();
      const leaves = await litTornado.read.getLeaves();
      console.log("Leaves:", leaves[0], leaves[1], leaves[2]);
      console.log("Tree Root:", treeRoot);
      const [proof, pathIndices] =
        await litTornado.read.generateProofFromCommitment([commitment]);

      console.log("Proof:", proof);
      console.log("Path Indices:", pathIndices);
      // expect(proof).to.be.an("array").that.is.not.empty;

      expect(
        verifyMerkleProof(commitment, treeRoot, [...proof], [...pathIndices])
      ).to.be.true;
    });
  });
  */
});
