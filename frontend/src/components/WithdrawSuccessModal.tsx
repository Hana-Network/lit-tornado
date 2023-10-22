"use client";
import { Dispatch, SetStateAction } from "react";

export const WithdrawSuccessModal = ({
  setShowModal,
  txHash,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  txHash: `0x${string}`;
}) => {
  const explorerLink = `https://sepolia.scrollscan.dev/tx/${txHash}`;
  return (
    <dialog id="my_daisy-modal_1" className="daisy-modal daisy-modal-open">
      <div className="daisy-modal-box">
        <h3 className="font-bold text-lg prose">Withdraw successful🎉</h3>
        <p className="py-4 prose ">
          Transaction Hash:{" "}
          <span className="prose font-mono text-sm">{txHash}</span>
        </p>

        <div className="flex space-x-4">
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="daisy-btn daisy-btn-secondary"
          >
            View on Explorer
          </a>
        </div>

        <div className="daisy-modal-action">
          <div>
            <button
              className="daisy-btn"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
