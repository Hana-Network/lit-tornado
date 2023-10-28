"use client";
import { DENOMINATION, MIXIER_ADDRESS } from "@/constants";
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
  const {
    config,
    status: prepareStatus,
    error: prepareError,
  } = usePrepareLitTornadoDeposit({
    address: MIXIER_ADDRESS,
    args: [generateCommitment(secret, nullifier)],
    value: DENOMINATION,
  });
  // console.log({ config, prepareStatus, prepareError });
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
    if (prepareError) {
      console.log(prepareError);
      toast.error(
        "An error has occurred.\nPlease check if the connected account holds 1Matic or more.",
        { duration: 5000 }
      );
    }
  }, [prepareError]);

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
      className="daisy-btn daisy-btn-primary w-full"
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
        <span className="daisy-loading daisy-loading-spinner"></span>
      )}
      Deposit
    </button>
  );
};
