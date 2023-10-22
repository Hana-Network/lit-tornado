"use client";
import { NOTE } from "@/constants";
import { useWithdraw } from "@/hooks/useWithdraw";

export const WithdrawButton = ({
  note,
  recipientAddress,
  withdrawSuccess,
}: {
  note?: NOTE;
  recipientAddress?: `0x${string}`;
  withdrawSuccess: (txHash: `0x${string}`) => void;
}) => {
  const { showLoading, signMessageByPkp } = useWithdraw({
    note,
    recipientAddress,
    withdrawSuccess,
  });

  return (
    <>
      <button
        className="daisy-btn daisy-btn-primary w-full"
        disabled={!note || !recipientAddress || showLoading}
        onClick={async () => {
          signMessageByPkp();
        }}
      >
        {showLoading && (
          <span className="daisy-loading daisy-loading-spinner"></span>
        )}
        Withdraw
      </button>
    </>
  );
};
