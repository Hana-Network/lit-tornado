import { parseEther } from "viem";

export const MIXINER_ADDRESS = "0xec3a882a8f786a34fd305a2c9b3a45b0c78e4a91";
export const DENOMINATION = parseEther("0.1");
export const RELAYER_FEE = parseEther("0.01");
export const SAMPLE_SECRET =
  "0x9c1a3b673a4e4820143acbddb65082f13530a972df68a1eec1f5c09d70d1ca34";
export const SAMPLE_NULLIFIER =
  "0x577123fe2d2107cd774e036861272d4d0d07e6bec0fe36ac936a6cccf1f3f00c";

export const PKP_NFT_ADDRESS = "0x8F75a53F65e31DD0D2e40d0827becAaE2299D111";
export const PKP_HELPER_ADDRESS = "0x8bB62077437D918891F12c7F35d9e1B78468bF11";
export const VERIFIER_IPFS_CID =
  "QmQ5yzoCvYcdW6kBqUnFXx6ZNJzQRAsthDvthutwoPggrL";
export const VERIFIER_PKP_ADDRESS = "";

export enum AuthMethodType {
  EthWallet = 1,
  LitAction,
  WebAuthn,
  Discord,
  Google,
  GoogleJwt,
}

export const PKP_NFT_PUBLIC_KEY =
  "0x04d8d2d47a3b590ff1127d57ee030bfc7198fac82fef265a0cd86c568e585c7419ddf5a9738d5df8a431db52b59c0c7c5c69cc001d8838038597f1c42c0db195a9";
// QmQ5yzoCvYcdW6kBqUnFXx6ZNJzQRAsthDvthutwoPggrL
// pkpPublicKey 0x04d8d2d47a3b590ff1127d57ee030bfc7198fac82fef265a0cd86c568e585c7419ddf5a9738d5df8a431db52b59c0c7c5c69cc001d8838038597f1c42c0db195a9
// pkpEthAddress 0x131cEc33bDd29DdA9213B9e65F9666231E601DFF
// minted token 0x231532e44afd9c17f06140911e87f61af91258dc9e2ff265bd02743c2ab9499f
