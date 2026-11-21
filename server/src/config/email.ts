import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}) => {
  const from = process.env.EMAIL_FROM || `"PizzaVibe Kitchen" <${process.env.EMAIL_USER}>`;
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    replyTo,
  });
};

export default transporter;
