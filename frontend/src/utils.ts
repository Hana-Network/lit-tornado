import { encodePacked, keccak256 } from "viem";

export const generateCommitment = (
  secret: `0x${string}`,
  nullifier: `0x${string}`
) => {
  return keccak256(encodePacked(["bytes32", "bytes32"], [secret, nullifier]));
};
