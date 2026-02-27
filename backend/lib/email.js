import nodemailer from 'nodemailer';

function createTransporter() {
    if (!process.env.EMAIL_HOST) {
        return null; // dev: log to console
    }
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: parseInt(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

export async function sendPasswordResetEmail(toEmail, resetUrl) {
    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || 'noreply@writingapp.local';

    if (!transporter) {
        console.log(`[DEV] Password reset email to ${toEmail}: ${resetUrl}`);
        return;
    }

    await transporter.sendMail({
        from,
        to: toEmail,
        subject: 'Reset your password',
        text: `You requested a password reset. Click the link below to reset your password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
        html: `<p>You requested a password reset. Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, ignore this email.</p>`,
    });
}
