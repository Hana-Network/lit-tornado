import {
  MIXINER_ADDRESS,
  NOTE,
  RELAYER_FEE,
  RELAYER_PKP_ADDRESS,
  RELAYER_PKP_PUBLIC_KEY,
  TREE_HEIGHT,
} from "@/constants";
import { polygonMumbai } from "wagmi/chains";
import {
  encodePacked,
  keccak256,
  toBytes,
  formatEther,
  encodeFunctionData,
  serializeTransaction,
} from "viem";
import {
  useMerkleTreeWithHistoryGetLastRoot,
  useMerkleTreeWithHistoryGetLeaves,
  litTornadoABI,
} from "@/contracts";
import { generateCommitment } from "@/utils";
import { useWaitForTransaction, usePublicClient } from "wagmi";
import { useState } from "react";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";
import toast from "react-hot-toast";
import { PROOF_LIT_ACTION_CODE, RELAYER_LIT_ACTION_CODE } from "@/lit";
import { useMerkleTree } from "@/hooks/useMerkleTree";

export const useWithdraw = ({
  note,
  recipientAddress,
}: {
  note?: NOTE;
  recipientAddress?: `0x${string}`;
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const publicClient = usePublicClient();
  const { data: treeRoot } = useMerkleTreeWithHistoryGetLastRoot({
    address: MIXINER_ADDRESS,
  });

  const { data: leaves } = useMerkleTreeWithHistoryGetLeaves({
    address: MIXINER_ADDRESS,
  });

  const commitment = note && generateCommitment(note.secret, note.nullifier);
  const nullifierHash = note && keccak256(note.nullifier);
  const proof = useMerkleTree({
    leaves,
    commitment,
  });

  const relayerAddress = RELAYER_PKP_ADDRESS;
  const relayerFee = RELAYER_FEE;

  const [relayerTxHash, setRelayerTxHash] = useState<`0x${string}`>();
  const {
    data: relayerTxReceipt,
    isError: relayerTxError,
    status: relayerTxStatus,
  } = useWaitForTransaction({
    hash: relayerTxHash,
  });

  const signMessageByPkp = async () => {
    setShowLoading(true);
    try {
      const litNodeClient = new LitNodeClient({
        litNetwork: "serrano",
        // litNetwork: "cayenne",
        debug: true,
      });
      await litNodeClient.connect();

      const authSig = await checkAndSignAuthMessage({
        chain: "mumbai",
        switchChain: true,
      });
      // console.log("authSig:", authSig);

      if (
        !treeRoot ||
        !nullifierHash ||
        !recipientAddress ||
        !relayerAddress ||
        !relayerFee ||
        !leaves ||
        !commitment
      ) {
        toast.error("PKP Sign message failed!");
        return;
      }
      const message = encodePacked(
        ["bytes32", "bytes32", "address", "address", "uint256"],
        [treeRoot, nullifierHash, recipientAddress, relayerAddress, relayerFee]
      );

      const messageHash = keccak256(message);

      // Prover Lit Action
      const results = await litNodeClient.executeJs({
        // ipfsId: "Qmf6oYS7nNPV8ZGTk8KdifbPQCa61GwjaMJqXDGac3pnnN",
        authSig,
        code: PROOF_LIT_ACTION_CODE,
        // Lit Action does not have the concept of private input and public input. I just borrowed those names from zero-knowledge proofs.
        jsParams: {
          privateInputs: {
            nullifier: note.nullifier,
            secret: note.secret,
            merkleProof: proof,
            leafIndex: leaves.indexOf(commitment),
          },
          publicInputs: {
            nullifierHash: keccak256(note.nullifier),
            treeRoot,
            merkleTreeHeight: TREE_HEIGHT,
            recipientAddress,
            relayerAddress,
            // passing BigNumber causes error
            relayerFee: formatEther(relayerFee),
          },
          publicKey:
            "0x042034f83acf8e7c97118b0499073e964a93b69b5e1ad94c3627fd8665c4affb2086c59b729ac62a3fa77143a7006fd2f0e2b7e3d7253479346ba4583076f22a51",
          sigName: "sig1",
          toSign: toBytes(messageHash),
        },
      });
      console.log(results);
      const signatures = results.signatures;
      const sig = signatures.sig1;

      toast.success("PKP Sign message success!");

      // Relayer Lit Action
      const relayerTxRequest = await publicClient.prepareTransactionRequest({
        account: relayerAddress,
        to: MIXINER_ADDRESS,
        data: encodeFunctionData({
          abi: litTornadoABI,
          functionName: "withdraw",
          args: [
            sig.signature,
            treeRoot,
            nullifierHash,
            recipientAddress,
            relayerAddress,
            relayerFee,
          ],
        }),
      });
      // console.log({ relayerTxRequest });

      const relayerRawTx = {
        chainId: polygonMumbai.id,
        gas: relayerTxRequest.gas,
        maxFeePerGas: relayerTxRequest.maxFeePerGas,
        maxPriorityFeePerGas: relayerTxRequest.maxPriorityFeePerGas,
        nonce: relayerTxRequest.nonce,
        to: relayerTxRequest.to,
        data: relayerTxRequest.data,
      };
      const serializedRelayerTx = serializeTransaction(relayerRawTx);
      const unsignedTxnHash = keccak256(serializedRelayerTx);

      const relayerLitActionResults = await litNodeClient.executeJs({
        authSig,
        code: RELAYER_LIT_ACTION_CODE,
        jsParams: {
          toSign: toBytes(unsignedTxnHash),
          sigName: "sig1",
          publicKey: RELAYER_PKP_PUBLIC_KEY,
        },
      });

      // console.log("results", relayerLitActionResults);

      const relayerTxSignature =
        relayerLitActionResults.signatures.sig1.signature;

      const serializedTx = serializeTransaction(relayerRawTx, {
        r: relayerTxSignature.slice(0, 66),
        s: ("0x" + relayerTxSignature.slice(66, 130)) as `0x${string}`,
        v: BigInt("0x" + relayerTxSignature.slice(130, 132)),
      });
      const _relayerTxHash = await publicClient.sendRawTransaction({
        serializedTransaction: serializedTx,
      });

      setRelayerTxHash(_relayerTxHash);
      console.log({ _relayerTxHash });
    } catch (e) {
      console.log(e);
      toast.error("Withdrawal failed!");
    } finally {
      setShowLoading(false);
    }
  };

  return {
    showLoading: relayerTxStatus === "loading" || showLoading,
    signMessageByPkp,
    relayerTxReceipt,
  };
};
