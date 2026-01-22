import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendInvitationEmailParams = {
  email: string;
  projectName: string;
  token: string;
};

export async function sendInvitationEmail({
  email,
  projectName,
  token,
}: SendInvitationEmailParams) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

  const result = await resend.emails.send({
    from: "Project App <onboarding@resend.dev>",
    to: email,
    subject: `You're invited to join "${projectName}"`,
    html: `
      <h2>Project Invitation</h2>
      <p>You have been invited to join <b>${projectName}</b>.</p>
      <a href="${inviteUrl}">Accept Invitation</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  // console.log("MAIL SENT RESULT : ", result)

  
}
