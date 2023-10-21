"use client";
import { Dispatch, SetStateAction } from "react";

export const WithdrawSuccessModal = ({
  setShowModal,
  txHash,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  txHash: `0x${string}`;
}) => {
  const explorerLink = `https://mumbai.polygonscan.com/tx/${txHash}`;
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box">
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
            className="btn btn-secondary"
          >
            View on Explorer
          </a>
        </div>

        <div className="modal-action">
          <div>
            <button
              className="btn"
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
