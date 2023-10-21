"use client";
import { DENOMINATION, MIXINER_ADDRESS } from "@/constants";
import { usePrepareLitTornadoDeposit, useLitTornadoDeposit } from "@/contracts";
import { generateCommitment } from "@/utils";
import { useEffect } from "react";
import { useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

export const DepositButton = ({
  depositSuccess,
  secret,
  nullifier,
}: {
  depositSuccess: (secret: `0x${string}`, nullifier: `0x${string}`) => void;
  secret: `0x${string}`;
  nullifier: `0x${string}`;
}) => {
  const { config } = usePrepareLitTornadoDeposit({
    address: MIXINER_ADDRESS,
    args: [generateCommitment(secret, nullifier)],
    value: DENOMINATION,
  });

  const { data, write, status } = useLitTornadoDeposit(config);

  const {
    data: txReceipt,
    // isError: txError,
    status: txStatus,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  txReceipt && console.log({ txReceipt });

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
