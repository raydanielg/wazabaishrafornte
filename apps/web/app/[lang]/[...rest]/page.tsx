import { notFound } from "next/navigation";

/** Unknown localized routes → proper 404 (§79). */
export default function CatchAll() {
  notFound();
}
