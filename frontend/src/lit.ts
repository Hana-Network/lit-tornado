import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { defineChain } from "viem";

export const chronicle = /*#__PURE__*/ defineChain({
  id: 5,
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
