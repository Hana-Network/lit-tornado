import { encodePacked, keccak256 } from "viem";
import { NOTE } from "./constants";

export function generateRandom32BytesHex(): `0x${string}` {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const randomHex = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `0x${randomHex}`;
}

export function generateCommitment(
  secret: `0x${string}`,
  nullifier: `0x${string}`
) {
  return keccak256(encodePacked(["bytes32", "bytes32"], [secret, nullifier]));
}

export function isNote(object: any): object is NOTE {
  return (
    typeof object === "object" &&
    object !== null &&
    typeof object.secret === "string" &&
    object.secret.startsWith("0x") &&
    object.secret.length === 66 &&
    typeof object.nullifier === "string" &&
    object.nullifier.startsWith("0x") &&
    object.nullifier.length === 66
  );
}
