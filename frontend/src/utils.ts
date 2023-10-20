import { encodePacked, keccak256 } from "viem";

export function generateRandom32BytesHex(): `0x${string}` {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const randomHex = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `0x${randomHex}`;
}

export const generateCommitment = (
  secret: `0x${string}`,
  nullifier: `0x${string}`
) => {
  return keccak256(encodePacked(["bytes32", "bytes32"], [secret, nullifier]));
};
