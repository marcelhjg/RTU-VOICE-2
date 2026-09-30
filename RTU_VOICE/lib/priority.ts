/**
 * lib/priority.ts
 * -----------------------------------------------------------------
 * Decides how urgent a complaint is: High, Mid or Low.
 * Right now it is only a simple keyword check (a stand-in). Later it
 * will be replaced by the real AI (NLP) priority detection.
 */
import type { Priority } from "@/types/complaint";

// Words that make a complaint HIGH priority (safety, harassment, emergencies).
const HIGH = ["harass", "threat", "assault", "abuse", "bully", "violence", "sexual", "blackmail", "unsafe", "danger", "fire", "emergency", "urgent", "panganib", "banta"];
// Words that make a complaint MID priority (something broken or not working).
const MID = ["broken", "leak", "overflow", "outage", "flood", "not working", "delay", "sira", "hindi gumagana", "no water", "walang"];

/**
 * MOCK ONLY. The real system sends the approved complaint text to the AI service
 * (OpenRouter) and receives High / Mid / Low. This keyword check stands in for it
 * so the admin flow can be demonstrated without a backend.
 */
export function mockPriority(text: string): Priority {
  const t = text.toLowerCase();
  if (HIGH.some((k) => t.includes(k))) return "High"; // any HIGH word found
  if (MID.some((k) => t.includes(k))) return "Mid"; // otherwise any MID word found
  return "Low"; // nothing matched
}
