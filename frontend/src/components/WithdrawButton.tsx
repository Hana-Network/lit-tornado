"use client";
import {
  MIXINER_ADDRESS,
  NOTE,
  RELAYER_ADDRESS,
  RELAYER_FEE,
  SAMPLE_NULLIFIER,
  TREE_HEIGHT,
} from "@/constants";

import { encodePacked, keccak256, toBytes } from "viem";
import {
  useLitTornadoWithdraw,
  useMerkleTreeWithHistoryGetLastRoot,
  usePrepareLitTornadoWithdraw,
  useLitTornadoVerifier,
  useMerkleTreeWithHistoryGetLeaves,
} from "@/contracts";
import { generateCommitment } from "@/utils";
import { useAccount, useSignMessage, useWaitForTransaction } from "wagmi";
import { useEffect, useState } from "react";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";
import toast from "react-hot-toast";
import { useReward } from "react-rewards";
import { PROOF_LIT_ACTION_CODE } from "@/lit";
import { useMerkleTree } from "@/hooks/useMerkleTree";

export const WithdrawButton = ({
  note,
  recipientAddress,
}: {
  note?: NOTE;
  recipientAddress?: `0x${string}`;
}) => {
  // const { address, isConnecting } = useAccount();
  const { reward } = useReward("withdrawReward", "confetti", {
    lifetime: 1000,
    startVelocity: 20,
  });
  const [showLoading, setShowLoading] = useState(false);
  const {
    data: rootData,
    isError: isReadRootError,
    // isLoading: isRootLoading,
  } = useMerkleTreeWithHistoryGetLastRoot({
    address: MIXINER_ADDRESS,
  });

  const { data: leavesData, isError: isReadLeavesError } =
    useMerkleTreeWithHistoryGetLeaves({ address: MIXINER_ADDRESS });

  const root = rootData;
  const leaves = leavesData;
  const commitment = note && generateCommitment(note.secret, note.nullifier);
  const proof = useMerkleTree({
    leaves,
    commitment,
  });

  const nullifierHash = note && keccak256(note.nullifier);
  // const recipientAddress = address;
  const relayerAddress = RELAYER_ADDRESS;
  const fee = RELAYER_FEE;

  // if (!root || !nullifierHash || !recipientAddress || !relayerAddress || !fee) {
  //   console.log({ rootData, isReadRootError });
  // }

  const [signMessageData, setSignMessageData] = useState<`0x${string}`>();
  const enableWithdraw =
    signMessageData &&
    root &&
    nullifierHash &&
    recipientAddress &&
    relayerAddress &&
    fee;

  const {
    config,
    error,
    isError,
    // refetch: refetchWithdraw,
  } = usePrepareLitTornadoWithdraw({
    address: MIXINER_ADDRESS,
    args: [
      signMessageData!,
      root!,
      nullifierHash!,
      recipientAddress!,
      relayerAddress!,
      fee,
    ],
    enabled: Boolean(enableWithdraw),
  });

  const {
    write,
    status,
    data: dataWithdraw,
    error: writeError,
  } = useLitTornadoWithdraw(config);

  const {
    data: txReceipt,
    isError: txError,
    status: txStatus,
  } = useWaitForTransaction({
    hash: dataWithdraw?.hash,
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
        // chain: "chronicleTestnet",
        chain: "mumbai",
        switchChain: true,
      });
      console.log("authSig:", authSig);

      if (
        !root ||
        !nullifierHash ||
        !recipientAddress ||
        !relayerAddress ||
        !fee ||
        !leaves ||
        !commitment
      ) {
        // error
        toast.error("PKP Sign message failed!");
        return;
      }
      const message = encodePacked(
        ["bytes32", "bytes32", "address", "address", "uint256"],
        [root!, nullifierHash!, recipientAddress!, relayerAddress!, fee]
      );

      const messageHash = keccak256(message);

      const results = await litNodeClient.executeJs({
        // ipfsId: "Qmf6oYS7nNPV8ZGTk8KdifbPQCa61GwjaMJqXDGac3pnnN",
        authSig,
        code: PROOF_LIT_ACTION_CODE,
        jsParams: {
          data: {
            commitment,
            root,
            proof,
            leafIndex: leaves.indexOf(commitment),
            merkleTreeHeight: TREE_HEIGHT,
          },
          publicKey:
            "0x042034f83acf8e7c97118b0499073e964a93b69b5e1ad94c3627fd8665c4affb2086c59b729ac62a3fa77143a7006fd2f0e2b7e3d7253479346ba4583076f22a51",
          sigName: "sig1",
          // message: message,
          toSign: toBytes(messageHash),
        },
      });
      console.log(results);
      const signatures = results.signatures;
      const sig = signatures.sig1;

      setSignMessageData(sig.signature);
      toast.success("PKP Sign message success!");
    } catch (e) {
      console.log(e);
      toast.error("PKP Sign message failed!");
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    if (signMessageData && write) {
      console.log("withdraw");
      // write?.();
    }
  }, [signMessageData, write]);

  useEffect(() => {
    if (error || writeError) {
      toast.error("Withdraw failed!");
    }
  }, [error, writeError]);

  useEffect(() => {
    if (txReceipt?.status === "success") {
      toast.success("Withdraw successful!");
      reward();
    } else if (txReceipt?.status === "reverted") {
      toast.error("Withdraw failed!");
    }
  }, [txReceipt?.status]);

  return (
    <>
      <button
        className="btn btn-primary w-full"
        disabled={
          !note ||
          !recipientAddress ||
          showLoading ||
          status === "loading" ||
          txStatus === "loading"
        }
        // https://github.com/wagmi-dev/wagmi/pull/2719
        onClick={() => {
          // (signMessage as any)({ message: { raw: messageHash } });
          signMessageByPkp();
        }}
      >
        {(showLoading || status === "loading" || txStatus === "loading") && (
          <span className="loading loading-spinner"></span>
        )}
        Withdraw
      </button>
    </>
  );
};
