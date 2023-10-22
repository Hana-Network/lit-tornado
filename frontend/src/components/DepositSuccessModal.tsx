"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

export const DepositSuccessModal = ({
  setShowModal,
  message,
  onCloseDepositModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  message: string;
  onCloseDepositModal: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <dialog className="daisy-modal daisy-modal-open">
      <div className="daisy-modal-box">
        <h3 className="font-bold text-lg prose">Deposit successful🎉</h3>
        <p className="py-4 prose">
          Please keep this secret and nullifier safe, as they will be required
          for withdrawals🌪
        </p>
        <textarea
          className="prose daisy-textarea daisy-textarea-bordered daisy-textarea-xs w-full max-w-xs"
          value={message}
          readOnly
          rows={4}
        ></textarea>
        <div className="mt-4">
          <CopyToClipboard
            text={message}
            onCopy={() => {
              toast.success("Copied to clipboard!");
              setCopied(true);
            }}
          >
            <button className="daisy-btn daisy-btn-accent ">
              Copy to clipboard
            </button>
          </CopyToClipboard>
        </div>
        <div className="daisy-modal-action">
          <div>
            <button
              className="daisy-btn"
              disabled={!copied}
              onClick={() => {
                onCloseDepositModal();
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
