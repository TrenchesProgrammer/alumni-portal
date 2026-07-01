import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactExchangeEmails(student: any, alumni: any) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD is not set. Email contact sharing is disabled.");
    return;
  }

  const studentEmail = {
    from: `"Alumni Portal" <${process.env.GMAIL_USER}>`,
    to: student.email,
    subject: `Mentorship Accepted: Connect with ${alumni.full_name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Mentorship Accepted! 🎉</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${student.full_name},</p>
          <p>Great news! <strong>${alumni.full_name}</strong> has accepted your mentorship request.</p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Mentor Contact Details</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 8px;">📧 <strong>Email:</strong> <a href="mailto:${alumni.email}">${alumni.email}</a></li>
            ${alumni.linkedin_url ? `<li style="margin-bottom: 8px;">💼 <strong>LinkedIn:</strong> <a href="${alumni.linkedin_url}">${alumni.linkedin_url}</a></li>` : ''}
            ${alumni.github_url ? `<li style="margin-bottom: 8px;">💻 <strong>GitHub:</strong> <a href="${alumni.github_url}">${alumni.github_url}</a></li>` : ''}
          </ul>
          
          <p style="margin-top: 24px;">Don't hesitate to reach out to them to start your mentorship journey. Good luck!</p>
          <p>Best,<br>The Alumni Portal Team</p>
        </div>
      </div>
    `,
  };

  const alumniEmail = {
    from: `"Alumni Portal" <${process.env.GMAIL_USER}>`,
    to: alumni.email,
    subject: `New Mentee: Connect with ${student.full_name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">New Mentorship Match! 🤝</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${alumni.full_name},</p>
          <p>You have just accepted a mentorship request from <strong>${student.full_name}</strong>. Thank you for giving back to the community!</p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Mentee Contact Details</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 8px;">📧 <strong>Email:</strong> <a href="mailto:${student.email}">${student.email}</a></li>
            ${student.linkedin_url ? `<li style="margin-bottom: 8px;">💼 <strong>LinkedIn:</strong> <a href="${student.linkedin_url}">${student.linkedin_url}</a></li>` : ''}
            ${student.github_url ? `<li style="margin-bottom: 8px;">💻 <strong>GitHub:</strong> <a href="${student.github_url}">${student.github_url}</a></li>` : ''}
          </ul>
          
          <p style="margin-top: 24px;">They should be reaching out to you shortly, but feel free to initiate contact.</p>
          <p>Best,<br>The Alumni Portal Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(studentEmail);
    await transporter.sendMail(alumniEmail);
    console.log(`Successfully sent mentorship emails between ${student.email} and ${alumni.email}`);
  } catch (error) {
    console.error("Failed to send mentorship emails:", error);
  }
}
