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

const generateCommitment = (
  secret: `0x${string}`,
  nullifier: `0x${string}`
) => {
  return keccak256(encodePacked(["bytes32", "bytes32"], [secret, nullifier]));
};

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
