"use client";
import {
  DENOMINATION,
  MIXINER_ADDRESS,
  RELAYER_FEE,
  SAMPLE_NULLIFIER,
  SAMPLE_SECRET,
} from "@/constants";

import {
  encodePacked,
  keccak256,
  parseGwei,
  recoverMessageAddress,
} from "viem";
import {
  useLitTornadoWithdraw,
  useMerkleTreeWithHistoryGetLastRoot,
  usePrepareLitTornadoWithdraw,
} from "@/contracts";
import { generateCommitment } from "@/utils";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect } from "react";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";

export const WithdrawButton = () => {
  const { address, isConnecting } = useAccount();
  const {
    data,
    isError: isReadRootError,
    isLoading,
  } = useMerkleTreeWithHistoryGetLastRoot({
    address: MIXINER_ADDRESS,
  });
  // console.log({ data, isReadRootError, isLoading });

  const root = data;
  const nullifierHash = keccak256(SAMPLE_NULLIFIER);
  const recipientAddress = address;
  const relayerAddress = address;
  const fee = RELAYER_FEE;

  if (!root || !nullifierHash || !recipientAddress || !relayerAddress || !fee) {
    // error
    console.log({ data, isReadRootError, isLoading });
  }
  // console.log({ data, isReadRootError, isLoading });
  const messageHash = keccak256(
    encodePacked(
      ["bytes32", "bytes32", "address", "address", "uint256"],
      [root!, nullifierHash, recipientAddress!, relayerAddress!, fee]
    )
  );

  // const message = encodePacked(
  //   ["bytes32", "bytes32", "address", "address", "uint256"],
  //   [root!, nullifierHash, recipientAddress!, relayerAddress!, fee]
  // );
  const {
    data: signMessageData,
    error: signMessageError,
    isLoading: isSignMessageLoading,
    signMessage,
    variables,
  } = useSignMessage();

  useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        console.log({ variables, signMessageData });
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        });
        // setRecoveredAddress(recoveredAddress);
        console.log({ recoveredAddress });
      }
    })();
  }, [signMessageData, variables?.message]);

  // const signature = await verifier.signMessage({
  //   message: { raw: messageHash },
  // });

  const enableWithdraw =
    signMessageData &&
    root &&
    nullifierHash &&
    recipientAddress &&
    relayerAddress &&
    fee;
  console.log(enableWithdraw);
  console.log({ signMessageData });
  console.log({ root });
  console.log({ nullifierHash });
  console.log({ recipientAddress });
  console.log({ relayerAddress });
  console.log({ fee });

  const {
    config,
    error,
    isError,
    // refetch: refetchWithdraw,
  } = usePrepareLitTornadoWithdraw({
    address: MIXINER_ADDRESS,
    args: [
      signMessageData,
      root,
      nullifierHash,
      recipientAddress,
      relayerAddress,
      fee,
    ],
    enabled: Boolean(enableWithdraw),
  });

  const { write, status, data: dataWithdraw } = useLitTornadoWithdraw(config);

  console.log({ status });
  console.log({ dataWithdraw });

  return (
    <>
      <button
        className="btn btn-primary w-full"
        disabled={false}
        // https://github.com/wagmi-dev/wagmi/pull/2719
        onClick={() => {
          (signMessage as any)({ message: { raw: messageHash } });
        }}
      >
        Withdraw
      </button>
      <button
        className="btn btn-primary w-full"
        disabled={false}
        // https://github.com/wagmi-dev/wagmi/pull/2719
        onClick={() => {
          console.log(write);
          write?.();
        }}
      >
        Withdraw
      </button>
    </>
  );
};
