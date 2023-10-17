"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export const Header = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <header className="w-full p-4 bg-base-200 flex justify-between items-center">
      <h1 className="text-xl font-bold prose">Lit🔥Tornado🌪</h1>
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/yourusername/yourrepository" // <-- あなたのGitHubリンクに変更してください
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-xs btn-outline btn-secondary"
        >
          GitHub
        </a>

        {address && (
          <w3m-button loadingLabel="Connecting..." balance="hide" size="sm" />
        )}
      </div>
    </header>
  );
};
