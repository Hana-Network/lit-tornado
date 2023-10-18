"use client";
import {
  DENOMINATION,
  MIXINER_ADDRESS,
  SAMPLE_NULLIFIER,
  SAMPLE_SECRET,
} from "@/constants";
import { encodePacked, toHex } from "viem";
import { keccak256 } from "viem";
import { usePrepareLitTornadoDeposit, useLitTornadoDeposit } from "@/contracts";
import { generateCommitment } from "@/utils";

export const DepositButton = () => {
  const { config, error, isError } = usePrepareLitTornadoDeposit({
    address: MIXINER_ADDRESS,
    args: [generateCommitment(SAMPLE_SECRET, SAMPLE_NULLIFIER)],
    value: DENOMINATION,
  });

  const { write, status } = useLitTornadoDeposit(config);
  // console.log({ status });
  return (
    <button
      className="btn btn-primary w-full"
      disabled={!write}
      onClick={() => write?.()}
    >
      Deposit
    </button>
  );
};
