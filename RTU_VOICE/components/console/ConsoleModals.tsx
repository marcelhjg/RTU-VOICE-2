"use client";
/**
 * components/console/ConsoleModals.tsx
 * -----------------------------------------------------------------
 * The three pop-ups used by the Admin page:
 *   1) ComplaintDetailsModal -> read-only details of one complaint
 *   2) AssignDepartmentModal -> choose a department for a complaint
 *   3) ReassignModal         -> move a complaint to another department + reason
 */
import { useState } from "react";
import type { Complaint, Department } from "@/types/complaint";
import { DEPARTMENTS } from "@/types/complaint";
import { mediumDate, shortId } from "@/lib/format";
import Button from "../Button";
import Modal from "../Modal";
import Select from "../Select";
import { StatusBadge } from "../StatusBadge";
import Textarea from "../Textarea";

// 1) Shows every detail of a complaint (view only).
export function ComplaintDetailsModal({ complaint, onClose }: { complaint: Complaint; onClose: () => void }) {
  return (
    <Modal title="Complaint Details" onClose={onClose} className="modal-md">
      <dl className="kv-list">
        <div className="kv">
          <dt>Title</dt>
          <dd>{complaint.title}</dd>
        </div>
        <div className="kv">
          <dt>Category</dt>
          <dd>{complaint.category}</dd>
        </div>
        <div className="kv kv-stack">
          <dt>Description</dt>
          <dd className="kv-text">{complaint.description}</dd>
        </div>
        <div className="kv">
          <dt>Date submitted</dt>
          <dd>{mediumDate(complaint.submittedAt)}</dd>
        </div>
        <div className="kv">
          <dt>Current status</dt>
          <dd>
            <StatusBadge status={complaint.status} />
          </dd>
        </div>
        <div className="kv">
          <dt>Assigned department</dt>
          <dd>{complaint.department ?? "Not assigned"}</dd>
        </div>
      </dl>
    </Modal>
  );
}

// 2) Admin picks a department. The Confirm button stays disabled until one is chosen.
export function AssignDepartmentModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (d: Department) => void }) {
  const [dept, setDept] = useState("");
  return (
    <Modal title="Assign Department" onClose={onClose} className="modal-md">
      <Select id="assign-dept" label="Department" placeholder="Select department" options={DEPARTMENTS} value={dept} onChange={(e) => setDept(e.target.value)} />
      <div className="modal-actions">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!dept} onClick={() => onConfirm(dept as Department)}>
          Assign / Confirm
        </Button>
      </div>
      <p className="modal-note">
        On confirm, status becomes <strong>Assigned</strong> and the department is notified.
      </p>
    </Modal>
  );
}

// 3) Admin picks a NEW department (the current one is removed from the list) and types a reason.
export function ReassignModal({
  complaint,
  onClose,
  onConfirm,
}: {
  complaint: Complaint;
  onClose: () => void;
  onConfirm: (d: Department, reason: string) => void;
}) {
  const [dept, setDept] = useState("");
  const [reason, setReason] = useState("");
  return (
    <Modal title="Reassign Ticket" onClose={onClose} className="modal-md">
      <dl className="kv-list">
        <div className="kv">
          <dt>Current ticket</dt>
          <dd>{shortId(complaint.id)}</dd>
        </div>
        <div className="kv">
          <dt>Current dept.</dt>
          <dd>{complaint.department ?? "Not assigned"}</dd>
        </div>
      </dl>
      <Select
        id="reassign-dept"
        label="New Department"
        placeholder="Select department"
        options={DEPARTMENTS.filter((d) => d !== complaint.department)}
        value={dept}
        onChange={(e) => setDept(e.target.value)}
      />
      <Textarea id="reassign-reason" label="Reason for reassignment" placeholder="Add a short note..." value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="modal-actions">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!dept} onClick={() => onConfirm(dept as Department, reason.trim())}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
