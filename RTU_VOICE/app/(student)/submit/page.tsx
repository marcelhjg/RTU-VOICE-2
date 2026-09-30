"use client";
/**
 * app/(student)/submit/page.tsx  (URL: /submit)
 * -----------------------------------------------------------------
 * SUBMIT A COMPLAINT: the form students fill in (title, category,
 * description, evidence file). On success a pop-up shows the tracking ID.
 * Rules: evidence is required, max 5MB, image or PDF only.
 */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent, KeyboardEvent } from "react";
import Button from "@/components/Button";
import { CheckIcon, CloseIcon, CopyIcon, UploadIcon } from "@/components/Icons";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import { StatusBadge } from "@/components/StatusBadge";
import Textarea from "@/components/Textarea";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/lib/complaints";
import { fileSize } from "@/lib/format";
import { CATEGORIES } from "@/types/complaint";
import type { Category, Complaint, EvidenceFile } from "@/types/complaint";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB file limit
const MAX_CHARS = 2000; // max characters in the description

// Error messages for the fields that can be wrong.
interface Errors {
  title?: string;
  description?: string;
  evidence?: string;
}

export default function SubmitPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { submit } = useComplaints();

  // Form values. The category starts as the first one in the list (see CATEGORIES in types/complaint.ts).
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  // Extra state: the chosen file, fake upload progress, drag highlight, errors,
  // the created complaint (shows the success pop-up), and the "Copied" label.
  const [file, setFile] = useState<EvidenceFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [created, setCreated] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  // Mock upload progress.
  useEffect(() => {
    if (!file) return;
    let p = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + 20);
      setProgress(p);
      if (p >= 100) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
  }, [file]);

  // Check the chosen file (size and type). If OK, keep its name and size.
  const accept = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_BYTES) return setErrors((e) => ({ ...e, evidence: "File is too large. The maximum size is 5MB." }));
    if (!f.type.startsWith("image/") && f.type !== "application/pdf")
      return setErrors((e) => ({ ...e, evidence: "Use an image or a PDF file." }));
    setErrors((e) => ({ ...e, evidence: undefined }));
    setProgress(0);
    setFile({ name: f.name, size: f.size });
  };

  // Dropping a file onto the upload box.
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    accept(e.dataTransfer.files?.[0]);
  };
  // Keyboard support: Enter or Space opens the file picker.
  const onZoneKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      picker.current?.click();
    }
  };

  // Runs when "Submit Complaint" is pressed: validate, then save the complaint.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (!title.trim()) found.title = "Enter a subject for your complaint";
    if (description.trim().length < 10) found.description = "Describe the issue in at least 10 characters";
    if (!file) found.evidence = "Attach supporting evidence";
    setErrors(found);
    if (Object.keys(found).length > 0 || !user) return;
    setCreated(submit({ title: title.trim(), category, description: description.trim(), evidence: file ?? undefined, ownerEmail: user.email }));
  };

  // "Copy ID" button in the success pop-up.
  const copyId = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <form className="card form-card" onSubmit={onSubmit} noValidate>
        <h1 className="form-title">Submit a Complaint</h1>
        <p className="page-sub">Required fields are marked with an asterisk (*).</p>

        <Input id="title" label="Title *" placeholder="Subject of your complaint" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} maxLength={120} />
        {/* Category dropdown; its choices come from CATEGORIES in types/complaint.ts */}
        <Select id="category" label="Category *" options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value as Category)} />
        <Textarea
          id="description"
          label="Complaint *"
          placeholder="Describe the issue, including dates, locations, and any people involved."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_CHARS}
          counter
          error={errors.description}
        />

        {/* Evidence upload: click, press Enter, or drag a file into the box */}
        <div className="field">
          <span className="label" id="evidence-label">
            Evidence (5MB maximum) *
          </span>
          <input ref={picker} type="file" accept="image/*,application/pdf" hidden onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />
          <div
            className={`drop ${dragging ? "drag" : ""} ${errors.evidence ? "drop-error" : ""}`}
            role="button"
            tabIndex={0}
            aria-labelledby="evidence-label"
            onClick={() => picker.current?.click()}
            onKeyDown={onZoneKey}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <UploadIcon />
            <span>
              Drag files here or <strong className="accent">Browse</strong>
            </span>
          </div>
          {errors.evidence && (
            <p className="field-error" role="alert">
              {errors.evidence}
            </p>
          )}
          {file && (
            <div className="file-wrap">
              <div className="file">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{fileSize(file.size)}</span>
                <button type="button" className="file-x" aria-label={`Remove ${file.name}`} onClick={() => { setFile(null); setProgress(0); }}>
                  <CloseIcon />
                </button>
              </div>
              <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit">Submit Complaint</Button>
        </div>
      </form>

      {/* Success pop-up with the tracking ID (shown only after a complaint is created) */}
      {created && (
        <Modal title="Complaint submitted" dismissible={false} className="modal-sm modal-center">
          <span className="ok-badge">
            <CheckIcon />
          </span>
          <h2 className="modal-title center">Complaint submitted</h2>
          <StatusBadge status="Pending" />
          <p className="modal-note center">Your report has been received and is waiting for review.</p>
          <p className="trk">{created.id}</p>
          <div className="modal-grid">
            <Button variant="outline" onClick={copyId}>
              {copied ? "Copied" : "Copy ID"} <CopyIcon />
            </Button>
            <Button href={`/track?id=${created.id}`}>Track This</Button>
            <Button variant="outline" href="/dashboard" className="span-2">
              Dashboard
            </Button>
          </div>
          <p className="save-note">Save this ID. You need it to track.</p>
        </Modal>
      )}
    </>
  );
}
