import { keccak256, encodePacked } from "viem";
import crypto from "crypto";

const hashLeftRight = (left: `0x${string}`, right: `0x${string}`) => {
  return keccak256(encodePacked(["bytes32", "bytes32"], [left, right]));
};

export function verifyMerkleProof(
  leaf: `0x${string}`,
  root: `0x${string}`,
  pathElements: `0x${string}`[],
  pathIndices: boolean[]
) {
  let computedHash = leaf;

  for (let i = 0; i < pathElements.length; i++) {
    const sibling = pathElements[i];
    const isLeft = pathIndices[i];

    computedHash = isLeft
      ? hashLeftRight(sibling, computedHash)
      : hashLeftRight(computedHash, sibling);
  }

  return computedHash === root;
}

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
