import { NextResponse } from 'next/server';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { PrismaClient, User } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || "",
});


const CHUNK_SIZE = 500; // Maximum number of emails per bulk send

async function sendEmailsInChunks(bulkEmail: EmailParams[]) {
    for (let i = 0; i < bulkEmail.length; i += CHUNK_SIZE) {
        const chunk = bulkEmail.slice(i, i + CHUNK_SIZE);
        await mailerSend.email.sendBulk(chunk);
        console.log(`Sent emails ${i + 1} to ${Math.min(i + CHUNK_SIZE, bulkEmail.length)}`);
    }
}

const verifyRecaptcha = async (token: string) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verifyUrl, { method: 'POST' });
    const data = await response.json();

    // For reCAPTCHA v3, we need to check the score
    if (data.success && data.score >= 0.5) {
        return true;
    }
    return false;
};

const sendContactFormEmail = async (name: string, email: string, message: string) => {
    const noreply = new Sender("noreply@outread.ai", "Contacted From Received");

    const emailParams = new EmailParams()
        .setFrom(noreply)
        .setTo([{ email: "janhvi@outread.ai", name: "Outread Team" }])
        .setSubject("New Contact Form Submission")
        .setHtml(`<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`)

    await mailerSend.email.send(emailParams);

    // Send a copy to the email address used for contact form
    const emailParamsCopy = new EmailParams()
        .setFrom(noreply)
        .setTo([{ email: email, name: name }])
        .setSubject("Outread Contact Form Submission")
        .setHtml(`<p>Hello ${name},</p><p>Thank you for contacting us. We'll get back to you as soon as possible.</p><p>Best regards,<br>The Outread Team</p>`);

    await mailerSend.email.send(emailParamsCopy);
};

const sendWelcomeEmail = async (email: string) => {
    const sentFrom = new Sender("noreply@outread.ai", "Outread");

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([{ email: email, name: "New Subscriber" }])
        .setSubject("Welcome to Outread!")
        .setHtml(`
            <h1>Welcome to Outread Newsletter!</h1>
            <p>Thank you for subscribing to our newsletter. We're excited to share weekly summaries and updates with you!</p>
            <p>Stay tuned for our next issue.</p>
            <p>Best regards,<br>The Outread Team</p>
        `)

    await mailerSend.email.send(emailParams);
};

const sendNewsletter = async (target: "ALL" | "PAID" | "NON_PAID" | "NEWSLETTER" | "TEST" | "INVESTORS", subject: string, templateId: string, testTarget?: string) => {
    const sentFrom = new Sender("noreply@outread.ai", "Outread");

    const prisma = new PrismaClient()
    let sendTargets: string[] // Change this line

    if (target === 'ALL') {
        sendTargets = (await prisma.user.findMany()).map((user) => user.email)
    } else if (target === 'PAID') {
        sendTargets = (await prisma.user.findMany({
            where: { role: 'PAID_USER' }
        })).map((user) => user.email)
    } else if (target === "NEWSLETTER") {
        sendTargets = (await prisma.newsletterSubscriber.findMany()).map((user) => user.email)
    }
    else if (target === "TEST") {
        sendTargets = [testTarget!]
    }
    else if (target === "INVESTORS") {
        const csvFilePath = path.resolve('./app/api/sendEmail/investors.csv');
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
        const records = parse(fileContent, { columns: true, skip_empty_lines: true });
        sendTargets = records.map((record: any) => record.Email);
    }
    else {
        sendTargets = (await prisma.user.findMany({
            where: { role: 'USER' }
        })).map((user) => user.email)
    }

    const bulkEmail: EmailParams[] = sendTargets.map((email) => {
        const recipient = new Recipient(email)
        return new EmailParams()
            .setFrom(sentFrom)
            .setTo([recipient])
            .setSubject(subject,)
            .setTemplateId(templateId)
    })

    try {
        await sendEmailsInChunks(bulkEmail)
    } catch (e) {
        console.log(e)
    }
};

export async function POST(req: Request) {
    const body = await req.json();

    console.log('Trying to send email')
    try {
        if (body.type === 'newsletter') {
            await sendWelcomeEmail(body.email);
            return NextResponse.json({ message: 'Welcome email sent successfully' }, { status: 200 });
        } else if (body.type === 'contact') {
            // Verify reCAPTCHA token
            // const isValidRecaptcha = await verifyRecaptcha(body.recaptchaToken);
            // if (!isValidRecaptcha) {
            //     return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
            // }
            await sendContactFormEmail(body.name, body.email, body.message);
            return NextResponse.json({ message: 'Contact form email sent successfully' }, { status: 200 });
        } else if (body.type === "sendNewsletter") {
            await sendNewsletter(body.target, body.subject, body.templateId, body.testTarget)
            return NextResponse.json({ message: 'Newsletter sent successfully' }, { status: 200 });
        }
        else {
            return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
