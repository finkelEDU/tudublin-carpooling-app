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