"use client";
import { MIXINER_ADDRESS, RELAYER_FEE, SAMPLE_NULLIFIER } from "@/constants";

import {
  encodePacked,
  keccak256,
  parseGwei,
  recoverMessageAddress,
  toBytes,
} from "viem";
import {
  useLitTornadoWithdraw,
  useMerkleTreeWithHistoryGetLastRoot,
  usePrepareLitTornadoWithdraw,
  useLitTornadoVerifier,
} from "@/contracts";
import { generateCommitment } from "@/utils";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";

// const litActionCode = `
// // const go = async () => {
// //   const sigShare = await LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });
// // };
// // go();
// `;
const litActionCode = `
const go = async () => {
  const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey , sigName });
  // LitActions.setResponse({ response: JSON.stringify(sigShare) });
};
go();
`;

export const WithdrawButton = () => {
  const { address, isConnecting } = useAccount();
  const {
    data,
    isError: isReadRootError,
    isLoading,
  } = useMerkleTreeWithHistoryGetLastRoot({
    address: MIXINER_ADDRESS,
  });

  // const { data: verifierData } = useLitTornadoVerifier({
  //   address: MIXINER_ADDRESS,
  // });

  const root = data;
  const nullifierHash = keccak256(SAMPLE_NULLIFIER);
  const recipientAddress = address;
  const relayerAddress = address;
  const fee = RELAYER_FEE;

  if (!root || !nullifierHash || !recipientAddress || !relayerAddress || !fee) {
    console.log({ data, isReadRootError, isLoading });
  }

  const [signMessageData, setSignMessageData] = useState<`0x${string}`>();
  const enableWithdraw =
    signMessageData &&
    root &&
    nullifierHash &&
    recipientAddress &&
    relayerAddress &&
    fee;
  // console.log(enableWithdraw);
  // console.log({ signMessageData });
  // console.log({ root });
  // console.log({ nullifierHash });
  // console.log({ recipientAddress });
  // console.log({ relayerAddress });
  // console.log({ fee });

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
      nullifierHash,
      recipientAddress!,
      relayerAddress!,
      fee,
    ],
    enabled: Boolean(enableWithdraw),
  });

  const { write, status, data: dataWithdraw } = useLitTornadoWithdraw(config);

  const signMessageByPkp = async () => {
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
      !fee
    ) {
      // error
      console.log("error");
    }
    const message = encodePacked(
      ["bytes32", "bytes32", "address", "address", "uint256"],
      [root!, nullifierHash, recipientAddress!, relayerAddress!, fee]
    );

    const messageHash = keccak256(message);

    const { signatures } = await litNodeClient.executeJs({
      // ipfsId: "Qmf6oYS7nNPV8ZGTk8KdifbPQCa61GwjaMJqXDGac3pnnN",
      authSig,
      code: litActionCode,
      jsParams: {
        publicKey:
          "0x042034f83acf8e7c97118b0499073e964a93b69b5e1ad94c3627fd8665c4affb2086c59b729ac62a3fa77143a7006fd2f0e2b7e3d7253479346ba4583076f22a51",
        sigName: "sig1",
        // message: message,
        toSign: toBytes(messageHash),
      },
    });
    const sig = signatures.sig1;

    setSignMessageData(sig.signature);
  };

  useEffect(() => {
    if (signMessageData) {
      console.log("withdraw");
      write?.();
    }
  }, [signMessageData]);

  return (
    <>
      <button
        className="btn btn-primary w-full"
        disabled={false}
        // https://github.com/wagmi-dev/wagmi/pull/2719
        onClick={() => {
          // (signMessage as any)({ message: { raw: messageHash } });
          signMessageByPkp();
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
