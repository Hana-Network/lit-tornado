import { keccak256, encodePacked } from "viem";

const hashLeftRight = (left: `0x${string}`, right: `0x${string}`) => {
  return keccak256(encodePacked(["bytes32", "bytes32"], [left, right]));
};

export function verifyMerkleProof(
  leaf: `0x${string}`,
  root: `0x${string}`,
  pathElements: `0x${string}`[],
  pathIndices: `0x${string}`[]
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
