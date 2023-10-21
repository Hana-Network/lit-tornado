"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { DepositButton } from "./DepositButton";
import { WithdrawButton } from "./WithdrawButton";
import { DepositSuccessModal } from "./DepositSuccessModal";
import { DENOMINATION, NOTE, RELAYER_FEE } from "@/constants";
import { formatEther } from "viem";
import { polygonMumbai } from "wagmi/chains";
import { isNote } from "@/utils";
import toast from "react-hot-toast";

const enum Tab {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

export const Main = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({ chainId: polygonMumbai.id });

  useEffect(() => {
    if (chain && switchNetwork) {
      // console.log("switching network");
      switchNetwork();
    }
  }, [chain, switchNetwork]);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);
  const { address, isConnecting } = useAccount();
  const { open } = useWeb3Modal();
  const [showModal, setShowModal] = useState(false);
  const [commitmentMessage, setCommitmentMessage] = useState("");
  const [note, setNote] = useState<NOTE>();
  const [recipientAddress, setRecipientAddress] = useState<`0x${string}`>();

  const depositSuccess = (secret: `0x${string}`, nullifier: `0x${string}`) => {
    console.log("deposit success");
    console.log(secret, nullifier);
    setCommitmentMessage(JSON.stringify({ secret, nullifier }));
    setShowModal(true);
  };

  return (
    <div className="bg-base-200 p-8 rounded-lg w-96">
      <div className="flex justify-center">
        <div id="withdrawReward"></div>
      </div>
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
        <div className="badge badge-outline badge-primary">
          {polygonMumbai.nativeCurrency.symbol}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-base-content text-opacity-medium text-sm mb-2">
          Amount
        </label>
        <div className="badge badge-outline badge-primary">{`${formatEther(
          DENOMINATION
        )} ${polygonMumbai.nativeCurrency.symbol}`}</div>
      </div>

      {activeTab === Tab.Withdraw && (
        <>
          <div className="mb-6">
            <label className="block text-base-content text-opacity-medium text-sm mb-2">
              Relayer Fee
            </label>
            {/* <div className="prose">
              <span className="text-sm">Fee: </span> */}
            <div className="badge badge-outline badge-primary">
              {formatEther(RELAYER_FEE)} {polygonMumbai.nativeCurrency.symbol}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-base-content text-opacity-medium text-sm mb-2">
              Receipient Address
            </label>
            <input
              type="text"
              placeholder="Paste here"
              className="prose input input-bordered w-full max-w-xs"
              value={recipientAddress || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (!value.startsWith("0x") || value.length !== 42) {
                  toast.error("Invalid address!");
                  return;
                }
                setRecipientAddress(value as `0x${string}`);
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-base-content text-opacity-medium text-sm mb-2">
              Note(Secret & Nullifier)
            </label>
            <textarea
              className="prose textarea textarea-bordered textarea-xs w-full max-w-xs"
              value={JSON.stringify(note)}
              placeholder="Paste here"
              onChange={(e) => {
                const value = e.target.value;
                let parsedValue = {};
                try {
                  parsedValue = JSON.parse(value);
                  if (!isNote(parsedValue)) {
                    throw new Error();
                  }
                } catch (err) {
                  toast.error("Invalid note!");
                  return;
                }

                setNote(parsedValue as NOTE);
              }}
              rows={4}
            ></textarea>
          </div>
        </>
      )}
      {address ? (
        activeTab == Tab.Deposit ? (
          <DepositButton depositSuccess={depositSuccess} />
        ) : (
          <WithdrawButton note={note} recipientAddress={recipientAddress} />
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
