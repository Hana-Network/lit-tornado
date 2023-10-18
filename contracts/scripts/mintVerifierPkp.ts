// npx hardhat run scripts/mintVerifierPkp.ts --network chronicle
import { getContract, defineChain } from "viem";
import hre from "hardhat";

// const PKP_NFT_ADDRESS = "0x8F75a53F65e31DD0D2e40d0827becAaE2299D111";
const PKP_HELPER_ADDRESS = "0x8bB62077437D918891F12c7F35d9e1B78468bF11";

const chronicle = defineChain({
  id: 175177,
  network: "Chronicle",
  name: "Chronicle - Lit Protocol Testnet",
  nativeCurrency: { name: "LIT", symbol: "LIT", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://chain-rpc.litprotocol.com/http"],
    },
    public: {
      http: ["https://chain-rpc.litprotocol.com/http"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://chain.litprotocol.com",
    },
  },
  testnet: true,
});

enum AuthMethodType {
  EthWallet = 1,
  LitAction,
  WebAuthn,
  Discord,
  Google,
  GoogleJwt,
}
const pkpHelperAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "keyType",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "permittedAuthMethodTypes",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "permittedAuthMethodIds",
        type: "bytes[]",
      },
      {
        internalType: "bytes[]",
        name: "permittedAuthMethodPubkeys",
        type: "bytes[]",
      },
      {
        internalType: "uint256[][]",
        name: "permittedAuthMethodScopes",
        type: "uint256[][]",
      },
      {
        internalType: "bool",
        name: "addPkpEthAddressAsPermittedAddress",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "sendPkpToItself",
        type: "bool",
      },
    ],
    name: "mintNextAndAddAuthMethods",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

async function main() {
  const [walletClient] = await hre.viem.getWalletClients({ chain: chronicle });
  const pkpHelper = getContract({
    address: PKP_HELPER_ADDRESS,
    walletClient,
    abi: pkpHelperAbi,
  });

  const encodedIdForAuthMethod =
    "QmQ5yzoCvYcdW6kBqUnFXx6ZNJzQRAsthDvthutwoPggrL";
  const txHash = await pkpHelper.write.mintNextAndAddAuthMethods(
    [
      2,
      [AuthMethodType.LitAction],
      [encodedIdForAuthMethod],
      ["0x"],
      [[BigInt(0)]],
      true,
      true,
    ],
    {
      value: 0,
    }
  );

  /**
 shortMessage: 'Invalid parameters were provided to the RPC method.\n' +
    'Double check you have provided the correct parameters.',
  version: 'viem@1.16.5',
  cause: InvalidParamsRpcError: Invalid parameters were provided to the RPC method.
  Double check you have provided the correct parameters.
  
  Details: invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field CallArgs.data of type hexutil.Bytes
   */

  console.log("Minting PKP NFT with tx hash:", txHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
