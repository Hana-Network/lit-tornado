"use client";
import { DENOMINATION, MIXINER_ADDRESS } from "@/constants";
import { usePrepareLitTornadoDeposit, useLitTornadoDeposit } from "@/contracts";
import { generateCommitment, generateRandom32BytesHex } from "@/utils";
import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

const SECRET = generateRandom32BytesHex();
const NULLIFIER = generateRandom32BytesHex();
export const DepositButton = ({
  depositSuccess,
}: {
  depositSuccess: (secret: `0x${string}`, nullifier: `0x${string}`) => void;
}) => {
  // TODO: update secret and nullifier after deposit
  const [secret, setSecret] = useState(SECRET);
  const [nullifier, setNullifier] = useState(NULLIFIER);

  const { config, error, isError } = usePrepareLitTornadoDeposit({
    address: MIXINER_ADDRESS,
    args: [generateCommitment(secret, nullifier)],
    value: DENOMINATION,
    // enabled: Boolean(),
  });

  const { data, write, status } = useLitTornadoDeposit(config);
  // console.log({ status });
  // console.log({ data });

  const {
    data: txReceipt,
    isError: txError,
    status: txStatus,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  // console.log({ txReceipt });

  useEffect(() => {
    if (txReceipt?.status === "success") {
      toast.success("Deposit successful!");
      depositSuccess(secret, nullifier);
    } else if (txReceipt?.status === "reverted") {
      toast.error("Deposit failed!");
    }
  }, [txReceipt]);

  return (
    <button
      className="btn btn-primary w-full"
      disabled={
        !write ||
        status === "loading" ||
        txStatus === "loading" ||
        txReceipt?.status === "success"
      }
      onClick={() => {
        write?.();
      }}
    >
      {(status === "loading" || txStatus === "loading") && (
        <span className="loading loading-spinner"></span>
      )}
      Deposit
    </button>
  );
};
