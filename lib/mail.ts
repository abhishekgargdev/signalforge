import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';

export type EmailTemplate = 'contact-inbox' | 'contact-receipt' | 'verify-email' | 'reset-password';

function transport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass },
  });
}

export async function renderTemplate(template: EmailTemplate, data: Record<string, string>) {
  const dir = path.join(process.cwd(), 'emails');
  const bodyPath = path.join(dir, `${template}.ejs`);
  const layoutPath = path.join(dir, 'layout.ejs');
  const body = ejs.render(fs.readFileSync(bodyPath, 'utf8'), data, { filename: bodyPath });
  return ejs.render(fs.readFileSync(layoutPath, 'utf8'), { title: data.title, body }, { filename: layoutPath });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, string>;
}) {
  const html = await renderTemplate(options.template, options.data);
  const mailer = transport();
  if (!mailer) {
    throw new Error('SMTP is not configured');
  }
  await mailer.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    html,
  });
}
