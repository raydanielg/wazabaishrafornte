import { NextResponse } from "next/server";

/**
 * Contact form endpoint. Validates input and forwards to the configured
 * support channel (env CONTACT_FORWARD_URL, e.g. a webhook or the backend).
 * Without a forward target it still validates and acknowledges — the
 * message is logged server-side for the dev environment.
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, contact, subject, message } = body ?? {};
  if (
    typeof name !== "string" ||
    typeof contact !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !contact.trim() ||
    !subject.trim() ||
    !message.trim() ||
    name.length > 120 ||
    contact.length > 120 ||
    subject.length > 200 ||
    message.length > 4000
  ) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const forward = process.env.CONTACT_FORWARD_URL;
  if (forward) {
    try {
      await fetch(forward, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          subject: subject.trim(),
          message: message.trim(),
          source: "landing-contact",
        }),
      });
    } catch (e) {
      console.error("[contact] forward failed:", e);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }
  } else {
    console.log("[contact] message received:", {
      name: name.trim(),
      contact: contact.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
  }

  return NextResponse.json({ ok: true });
}
