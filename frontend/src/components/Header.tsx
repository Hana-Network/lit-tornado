"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { GithubLink } from "./GithubLink";

export const Header = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <header className="w-full p-4 bg-base-200 flex justify-between items-center">
      <h1 className="text-xl font-bold prose">Lit🔥Tornado🌪</h1>
      <div className="flex items-center space-x-4">
        <GithubLink url="https://github.com/Hana-Network/lit-tornado" />

        {address && (
          <w3m-button loadingLabel="Connecting..." balance="hide" size="sm" />
        )}
      </div>
    </header>
  );
};
