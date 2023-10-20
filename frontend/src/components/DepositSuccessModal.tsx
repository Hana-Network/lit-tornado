"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

export const DepositSuccessModal = ({
  setShowModal,
  message,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  message: string;
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg prose">Deposit successful🎉</h3>
        <p className="py-4 prose">
          Please keep this secret and nullifier safe, as they will be required
          for withdrawals🌪
        </p>
        <textarea
          className="prose textarea textarea-bordered textarea-xs w-full max-w-xs"
          value={message}
          readOnly
          rows={4}
        ></textarea>
        <div className=" mt-4">
          <CopyToClipboard
            text={message}
            onCopy={() => {
              toast.success("Copied to clipboard!");
              setCopied(true);
            }}
          >
            <button className="btn btn-accent ">Copy to clipboard</button>
          </CopyToClipboard>
        </div>
        <div className="modal-action">
          <div>
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn"
              disabled={!copied}
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
