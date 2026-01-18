import nodemailer from 'nodemailer';
import {
  SMTP_USER,
  SMTP_PASSWORD
} from '@/secrets';

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});