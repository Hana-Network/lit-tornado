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
import { generateRandom32BytesHex, isNote } from "@/utils";
import toast from "react-hot-toast";
import { useReward } from "react-rewards";
import { WithdrawSuccessModal } from "./WithdrawSuccessModal";

const enum Tab {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

const SECRET = generateRandom32BytesHex();
const NULLIFIER = generateRandom32BytesHex();

export const Main = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({ chainId: polygonMumbai.id });

  const [secret, setSecret] = useState(SECRET);
  const [nullifier, setNullifier] = useState(NULLIFIER);

  const onCloseDepositModal = () => {
    setSecret(generateRandom32BytesHex());
    setNullifier(generateRandom32BytesHex());
  };

  useEffect(() => {
    if (chain && switchNetwork) {
      switchNetwork();
    }
  }, [chain, switchNetwork]);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);
  const { address, isConnecting } = useAccount();
  const { open } = useWeb3Modal();
  const [showDepositSuccessModal, setShowDepositSuccessModal] = useState(false);
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] =
    useState(false);
  const [commitmentMessage, setCommitmentMessage] = useState("");
  const [note, setNote] = useState<NOTE>();
  const [recipientAddress, setRecipientAddress] = useState<`0x${string}`>();

  const depositSuccess = (secret: `0x${string}`, nullifier: `0x${string}`) => {
    console.log("deposit success");
    console.log(secret, nullifier);
    setCommitmentMessage(JSON.stringify({ secret, nullifier }));
    setShowDepositSuccessModal(true);
  };
  const { reward } = useReward("withdrawReward", "confetti", {
    lifetime: 1000,
    startVelocity: 20,
    zIndex: 1000,
  });
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}`>();
  const withdrawSuccess = (txHash: `0x${string}`) => {
    toast.success("Withdraw successful!");
    reward();
    setWithdrawTxHash(txHash);
    setShowWithdrawSuccessModal(true);
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
          <DepositButton
            depositSuccess={depositSuccess}
            secret={secret}
            nullifier={nullifier}
          />
        ) : (
          <WithdrawButton
            note={note}
            recipientAddress={recipientAddress}
            withdrawSuccess={withdrawSuccess}
          />
        )
      ) : (
        <button className="btn btn-primary w-full" onClick={() => open()}>
          {isConnecting && <span className="loading loading-spinner"></span>}
          Connect
        </button>
      )}
      {showDepositSuccessModal && (
        <DepositSuccessModal
          setShowModal={setShowDepositSuccessModal}
          message={commitmentMessage}
          onCloseDepositModal={onCloseDepositModal}
        />
      )}
      {showWithdrawSuccessModal && withdrawTxHash && (
        <WithdrawSuccessModal
          setShowModal={setShowWithdrawSuccessModal}
          txHash={withdrawTxHash}
        />
      )}
    </div>
  );
};
