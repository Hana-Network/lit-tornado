"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { DepositButton } from "./DepositButton";

const WithdrawButton = () => {
  return <button className="btn btn-primary w-full">Withdraw</button>;
};

const enum Tab {
  Deposit = "deposit",
  Withdraw = "withdraw",
}
export const Main = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);
  const { address, isConnecting } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <div className="bg-base-200 p-8 rounded-lg w-96">
      <div className="mb-6">
        <div className="tabs flex justify-center w-full space-x-4">
          <a
            className={`tab tab-bordered flex-1 text-center ${
              activeTab === "deposit" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab(Tab.Deposit)}
          >
            Deposit
          </a>
          <a
            className={`tab tab-bordered flex-1 text-center ${
              activeTab === "withdraw" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab(Tab.Withdraw)}
          >
            Withdraw
          </a>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-base-content text-opacity-medium text-sm mb-2">
          Token
        </label>
        <div className="badge badge-outline badge-primary">ETH</div>
      </div>

      <div className="mb-6">
        <label className="block text-base-content text-opacity-medium text-sm mb-2">
          Amount
        </label>
        <div className="badge badge-outline badge-primary">1 ETH</div>
      </div>

      {address ? (
        activeTab == Tab.Deposit ? (
          <DepositButton />
        ) : (
          <WithdrawButton />
        )
      ) : (
        <button className="btn btn-primary w-full" onClick={() => open()}>
          {isConnecting && <span className="loading loading-spinner"></span>}
          Connect
        </button>
      )}
    </div>
  );
};
