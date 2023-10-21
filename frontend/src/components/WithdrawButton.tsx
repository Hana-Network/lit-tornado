"use client";
import { NOTE } from "@/constants";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useReward } from "react-rewards";
import { useWithdraw } from "@/hooks/useWithdraw";

export const WithdrawButton = ({
  note,
  recipientAddress,
}: {
  note?: NOTE;
  recipientAddress?: `0x${string}`;
}) => {
  const { reward } = useReward("withdrawReward", "confetti", {
    lifetime: 1000,
    startVelocity: 20,
  });

  const { showLoading, signMessageByPkp, relayerTxReceipt } = useWithdraw({
    note,
    recipientAddress,
  });

  useEffect(() => {
    if (relayerTxReceipt?.status === "success") {
      toast.success("Withdraw successful!");
      reward();
    } else if (relayerTxReceipt?.status === "reverted") {
      toast.error("Withdraw failed!");
    }
  }, [relayerTxReceipt?.status]);

  return (
    <>
      <button
        className="btn btn-primary w-full"
        disabled={!note || !recipientAddress || showLoading}
        onClick={async () => {
          signMessageByPkp();
        }}
      >
        {showLoading && <span className="loading loading-spinner"></span>}
        Withdraw
      </button>
    </>
  );
};
