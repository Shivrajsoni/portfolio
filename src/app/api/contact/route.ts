import { NextRequest, NextResponse } from "next/server";

async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  try {
    const { Resend } = await import("resend");
    return new Resend(process.env.RESEND_API_KEY);
  } catch {
    return null;
  }
}

const RECIPIENT = process.env.CONTACT_EMAIL ?? process.env.RECIPIENT_EMAIL;

// Simple rate limit for contact: 5 submissions per 15 min per IP
const contactLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 5;

  const entry = contactLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    contactLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";

  if (!checkContactRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 },
    );
  }

  const resend = await getResend();
  if (!resend || !RECIPIENT) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured. Set RESEND_API_KEY and CONTACT_EMAIL (or RECIPIENT_EMAIL) in environment.",
      },
      { status: 503 },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const from =
    process.env.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: [RECIPIENT],
    replyTo: email,
    subject: `Contact: ${name || "Someone"}`,
    html: [
      `<p><strong>Name:</strong> ${name || "—"}</p>`,
      `<p><strong>Email:</strong> ${email}</p>`,
      message
        ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`
        : "",
    ].join(""),
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to send email." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, id: data?.id });
}
