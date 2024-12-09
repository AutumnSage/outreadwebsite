import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


dotenv.config({ path: path.join(__dirname, '../../../', '.env') });



function sendPasswordResetEmail(email: string) {
    const sentFrom = new Sender("noreply@outread.ai", "Outread");

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([

            new Recipient(email)
        ])
        .setReplyTo(sentFrom)
        .setSubject("Outread App Launched!")
        .setTemplateId("pq3enl6voy5g2vwr")

    return emailParams
}

(async function sendPasswordResetEmails(): Promise<void> {

    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY as string,
    });
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
            bulkEmails.push(sendPasswordResetEmail(email));
            console.log('Password reset email sent to:', email);
        } catch (error) {
            console.error('Failed to send password reset email to:', email);
        }
    }

    // const resolvedEmails = await Promise.all(bulkEmails);
    const result = await mailerSend.email.sendBulk(bulkEmails);
    console.log(result)
    console.log('Password reset emails sent to all users');
})()