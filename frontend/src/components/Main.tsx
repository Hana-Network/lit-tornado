"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { DepositButton } from "./DepositButton";
import { WithdrawButton } from "./WithdrawButton";
import { DepositSuccessModal } from "./DepositSuccessModal";

const enum Tab {
  Deposit = "deposit",
  Withdraw = "withdraw",
}
export const Main = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);
  const { address, isConnecting } = useAccount();
  const { open } = useWeb3Modal();
  const [showModal, setShowModal] = useState(false);
  const [commitmentMessage, setCommitmentMessage] = useState("");

  const depositSuccess = (secret: `0x${string}`, nullifier: `0x${string}`) => {
    console.log("deposit success");
    console.log(secret, nullifier);
    setCommitmentMessage(JSON.stringify({ secret, nullifier }));
    setShowModal(true);
  };
  return (
    <div className="bg-base-200 p-8 rounded-lg w-96">
      {/* <div id="depositReward"></div> */}
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
          <DepositButton depositSuccess={depositSuccess} />
        ) : (
          <WithdrawButton />
        )
      ) : (
        <button className="btn btn-primary w-full" onClick={() => open()}>
          {isConnecting && <span className="loading loading-spinner"></span>}
          Connect
        </button>
      )}
      {showModal && (
        <DepositSuccessModal
          setShowModal={setShowModal}
          message={commitmentMessage}
        />
      )}
    </div>
  );
};
