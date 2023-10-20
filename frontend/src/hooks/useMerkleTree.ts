import { MerkleTree } from "merkletreejs";
import { useEffect, useState } from "react";
import { keccak256 } from "viem";

export const useMerkleTree = ({
  leaves,
  commitment,
}: {
  leaves?: readonly `0x${string}`[];
  commitment?: `0x${string}`;
}) => {
  const [proof, setProof] = useState<`0x${string}`[]>();
  useEffect(() => {
    if (leaves && commitment) {
      const tree = new MerkleTree([...leaves], keccak256, { sort: false });
      const proof = tree.getHexProof(commitment) as `0x${string}`[];
      setProof(proof);
    }
  }, [leaves, commitment]);

  return proof;
};
