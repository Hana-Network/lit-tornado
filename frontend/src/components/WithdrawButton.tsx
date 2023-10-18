"use client";
import {
  DENOMINATION,
  MIXINER_ADDRESS,
  RELAYER_FEE,
  SAMPLE_NULLIFIER,
  SAMPLE_SECRET,
} from "@/constants";

import { encodePacked, keccak256 } from "viem";
import {
  useLitTornadoWithdraw,
  useMerkleTreeWithHistoryGetLastRoot,
  usePrepareLitTornadoWithdraw,
} from "@/contracts";
import { generateCommitment } from "@/utils";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect } from "react";

export const WithdrawButton = () => {
  const { address, isConnecting } = useAccount();
  const {
    data,
    isError: isReadRootError,
    isLoading,
  } = useMerkleTreeWithHistoryGetLastRoot({
    address: MIXINER_ADDRESS,
  });
  console.log({ data, isReadRootError, isLoading });

  const root = data;
  const nullifierHash = keccak256(SAMPLE_NULLIFIER);
  const recipientAddress = address;
  const relayerAddress = address;
  const fee = RELAYER_FEE;

  if (!root || !nullifierHash || !recipientAddress || !relayerAddress || !fee) {
    // error
  }
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
        // const recoveredAddress = await recoverMessageAddress({
        //   message: variables?.message,
        //   signature: signMessageData,
        // })
        // setRecoveredAddress(recoveredAddress)
      }
    })();
  }, [signMessageData, variables?.message]);

  // const signature = await verifier.signMessage({
  //   message: { raw: messageHash },
  // });

  // const { config, error, isError } = usePrepareLitTornadoWithdraw({
  //   address: MIXINER_ADDRESS,
  //   args: [],
  // });

  // const { write, status } = useLitTornadoWithdraw(config);
  // console.log({ status });

  return (
    <button
      className="btn btn-primary w-full"
      disabled={true}
      // https://github.com/wagmi-dev/wagmi/pull/2719
      onClick={() => {
        (signMessage as any)({ message: { raw: messageHash } });
      }}
    >
      Withdraw
    </button>
  );
};
