import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

export async function sendVerificationEmail(to, token){
	const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;
	
	await transporter.sendMail({
		from: process.env.EMAIL_USER,
		to,
		subject: "Email Verification Needed",
		html: `
			<h1>Verify</h2>
			<p>Welcome! Please click the link below to activate your account:</p>
			<a href="${verifyUrl}">${verifyUrl}</a>
			`
	});
}

export async function sendResetEmail(to, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  });
}