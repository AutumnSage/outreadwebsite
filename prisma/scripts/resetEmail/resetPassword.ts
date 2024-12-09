import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { PasswordResetEmail } from './PasswordResetEmail';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


dotenv.config({ path: path.join(__dirname, '../../../', '.env') });

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY as string,
});

async function sendPasswordResetEmail(email: string): Promise<nodemailer.SentMessageInfo> {
    const resetLink = `https://outread.ai/reset-password`
    const downloadLink = 'https://apps.apple.com/app/outread/id6503236023'; // Replace with your actual App Store link
    const emailComponent = PasswordResetEmail({ resetLink, downloadLink }) as React.ReactElement;
    if (!emailComponent) {
        throw new Error('PasswordResetEmail did not return a valid React element');
    }
    const emailHtml = await render(emailComponent);

    const sentFrom = new Sender("noreply@outread.ai", "Outread");

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([
            new Recipient(email)
        ])
        .setSubject("Outread New iOS App – Action Required: Password Reset")
        .setHtml(emailHtml)

    return emailParams
}

async function sendPasswordResetEmails(): Promise<void> {
    // const emails: string[] = ['sirohijanhvi@gmail.com', 'dhruvsinghsirohi@gmail.com', 'singhanshika2000@gmail.com'];

    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({ where: { role: 'PAID_USER' } });
    const emails: string[] = users.map(user => user.email);
    // const emails: string[] = ["thealexhu@gmail.com"]
    console.log(emails.length, 'emails found in database');
    let idx = 0;
    const bulkEmails = [];
    for (let email of emails) {
        console.log("index : ", idx++);
        try {
            bulkEmails.push(await sendPasswordResetEmail(email));
            console.log('Password reset email sent to:', email);
        } catch (error) {
            console.error('Failed to send password reset email to:', email);
        }
    }

    // const resolvedEmails = await Promise.all(bulkEmails);
    await mailerSend.email.sendBulk(bulkEmails);
    console.log('Password reset emails sent to all users');
}
sendPasswordResetEmails();