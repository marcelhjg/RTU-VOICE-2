"use client";
/**
 * components/console/ConsoleModals.tsx
 * -----------------------------------------------------------------
 * The pop-ups used by the Admin page:
 *   1) ComplaintDetailsModal -> read-only details of one complaint
 *   2) RejectComplaintModal  -> confirm rejecting a complaint
 *   3) AssignDepartmentModal -> choose a department for a complaint
 *   4) ReassignModal         -> move a complaint to another department + reason
 */
import { useEffect, useState } from "react";
import type { Complaint, Department } from "@/types/complaint";
import { DEPARTMENTS } from "@/types/complaint";
import { fileSize, mediumDate, shortId } from "@/lib/format";
import { getEvidence } from "@/lib/evidenceStorage";
import Button from "../Button";
import Modal from "../Modal";
import Select from "../Select";
import { StatusBadge } from "../StatusBadge";
import Textarea from "../Textarea";

// 1) Shows every detail of a complaint (view only).
export function ComplaintDetailsModal({ complaint, onClose }: { complaint: Complaint; onClose: () => void }) {
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
  const [evidenceType, setEvidenceType] = useState<string | null>(null);
  const [evidenceLoaded, setEvidenceLoaded] = useState(!complaint.evidence);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    setEvidenceUrl(null);
    setEvidenceType(null);
    setEvidenceLoaded(!complaint.evidence);
    if (!complaint.evidence) return;

    setEvidenceLoaded(false);
    void getEvidence(complaint.id)
      .then((blob) => {
        if (!active || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setEvidenceUrl(objectUrl);
        setEvidenceType(blob.type);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setEvidenceLoaded(true);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [complaint.id, complaint.evidence]);

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
        <div className="kv kv-stack">
          <dt>Evidence</dt>
          <dd>
            {complaint.evidence ? (
              <div className="evidence-file">
                {evidenceUrl && evidenceType?.startsWith("image/") && (
                  <img className="evidence-image" src={evidenceUrl} alt={`Evidence for ${complaint.title}`} />
                )}
                {evidenceUrl && evidenceType === "application/pdf" && (
                  <iframe className="evidence-pdf" src={evidenceUrl} title={`Evidence for ${complaint.title}`} />
                )}
                <div className="evidence-meta">
                  <span>{complaint.evidence.name} ({fileSize(complaint.evidence.size)})</span>
                  {evidenceUrl && <a href={evidenceUrl} target="_blank" rel="noreferrer">Open file</a>}
                  {evidenceLoaded && !evidenceUrl && <span>Preview unavailable for this attachment.</span>}
                </div>
              </div>
            ) : (
              "No file attached."
            )}
          </dd>
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

// 2) Admin confirms the complaint before its status changes to Rejected.
export function RejectComplaintModal({
  complaint,
  onClose,
  onConfirm,
}: {
  complaint: Complaint;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title="Confirm Rejection" onClose={onClose} className="modal-md">
      <p className="modal-note">
        Are you sure you want to reject this complaint? Its status will change to <strong>Rejected</strong>.
      </p>
      <div className="modal-actions">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="reject" onClick={onConfirm}>
          Reject Complaint
        </Button>
      </div>
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
