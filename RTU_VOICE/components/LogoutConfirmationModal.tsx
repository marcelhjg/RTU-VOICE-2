"use client";
import Button from "@/components/Button";
import { LogoutIcon } from "@/components/Icons";
import Modal from "@/components/Modal";

export default function LogoutConfirmationModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal title="Logout?" headerIcon={<LogoutIcon aria-hidden="true" />} onClose={onClose} className="modal-md logout-modal">
      <p className="modal-note">Are you sure you want to end your RTU Voice session?</p>
      <div className="modal-actions">
        <Button variant="outline" onClick={onClose}>
          Stay signed in
        </Button>
        <Button variant="reject" onClick={onConfirm}>
          Yes, Logout
        </Button>
      </div>
    </Modal>
  );
}