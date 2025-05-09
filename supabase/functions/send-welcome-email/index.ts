
// supabase/functions/send-welcome-email/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { email, type } = await req.json();

  // Choose message based on user type
  const subject = type === "borrower" ? "Welcome to BorrowBase, Borrower!" : "Welcome to BorrowBase, Lender!";
  const body = `
    Hey there 👋,

    Thanks for signing up to BorrowBase as a ${type}.
    We're excited to have you onboard.

    Let us know if you have any questions — we're here to help.

    🔒 Safety Tip: Always use our platform for messaging and meeting in safe public places.

    - Team BorrowBase 🚀
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer re_YuFsZoVy_LgxEAVK8GDFzpowmMJV5gce6",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BorrowBase <info@borrowbase.co.uk>",
      to: [email],
      subject,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
    }),
  });

  return new Response("Email sent", { status: 200 });
});
