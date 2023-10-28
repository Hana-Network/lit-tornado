import { parseEther } from "viem";

export const MIXIER_ADDRESS = "0xf168fcbcf9b861b4f23e9502df5706de2ce73c06";
export const DENOMINATION = parseEther("0.1");
export const RELAYER_FEE = parseEther("0.01");
export const SAMPLE_SECRET =
  "0x9c1a3b673a4e4820143acbddb65082f13530a972df68a1eec1f5c09d70d1ca34";

const SAMPLE_NULLIFIERS = [
  "0x577123fe2d2107cd774e036861272d4d0d07e6bec0fe36ac936a6cccf1f3f00c",
  "0x1a45c8d93e2a90bfedc1a3e2b0f23a8dc4e9f6a7b8c6d5e1f2d3c4b5a6a7b8c9",
  "0x3c67f8e9d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
  "0x4d78f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
  "0x5e89f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
  "0x6fa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
  "0x7ab1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
  "0x8bc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
  "0x9cd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
  "0xad4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9a0b1c2d3e4f5",
] as `0x${string}`[];
export const SAMPLE_NULLIFIER = SAMPLE_NULLIFIERS[1];

export const PKP_NFT_ADDRESS = "0x8F75a53F65e31DD0D2e40d0827becAaE2299D111";
export const PKP_HELPER_ADDRESS = "0x8bB62077437D918891F12c7F35d9e1B78468bF11";

export const TREE_HEIGHT = 10;

export enum AuthMethodType {
  EthWallet = 1,
  LitAction,
  WebAuthn,
  Discord,
  Google,
  GoogleJwt,
}

export type NOTE = {
  secret: `0x${string}`;
  nullifier: `0x${string}`;
};

export const PKP_NFT_PUBLIC_KEY =
  "0x04d8d2d47a3b590ff1127d57ee030bfc7198fac82fef265a0cd86c568e585c7419ddf5a9738d5df8a431db52b59c0c7c5c69cc001d8838038597f1c42c0db195a9";
export const PROVER_PKP_PUBLIC_KEY =
  "0x04af87d233e617af1d9fc3d599450b28934965b0282b0810dc5dc0a03ab3f9df66ebdc9b4469b3c1552c33a809efa1233fff04638ba5703ee47eb42bbad916b64b";
export const PROVER_PKP_ADDRESS = "0x324ACc4B2D6CAAb70E39cA7bd5b6F0D12EcC529b";
export const PROVER_ACTION_IPFS_CID =
  "QmdLt6uHwzB79947cRtzV7Ug6B9wLHeCzZisgecsvLfDNE";
export const RELAYER_PKP_PUBLIC_KEY =
  "0x04a4fbe3070ab0ee40d0eb2b55d697a514bf77707ffc6fcbe5ae0fabdaffbb5bf1e13b7d59f9589566af17babd5d6c6d9944e22186ff9a8c0513bf8c713d140e14";
export const RELAYER_PKP_ADDRESS = "0x66024cDbEF500FAe7Da9f4b76A0Fb008bD045033";
export const RELAYER_ACTION_IPFS_CID =
  "QmZtDtANdTrD8pqbJm5JBtmH7t28ZnVfcJowDrd2HFd3Mk";
