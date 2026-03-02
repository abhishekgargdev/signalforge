import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';

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

export async function renderEmail(title: string, bodyHtml: string) {
  const layoutPath = path.join(process.cwd(), 'emails', 'layout.ejs');
  const layout = fs.readFileSync(layoutPath, 'utf8');
  return ejs.render(layout, { title, body: bodyHtml });
}

export async function sendEmail(options: { to: string; subject: string; title: string; rows: { label: string; value: string }[]; action?: { href: string; label: string } }) {
  const rows = options.rows
    .map(
      (row) =>
        `<tr><td style="padding:8px 0;color:#94a3b8;width:140px;vertical-align:top;">${row.label}</td><td style="padding:8px 0;color:#f8fafc;">${row.value}</td></tr>`
    )
    .join('');
  const action = options.action
    ? `<p style="margin:18px 0 0;"><a href="${options.action.href}" style="display:inline-block;background:#22c55e;color:#052e16;text-decoration:none;font-weight:700;padding:10px 16px;border-radius:8px;">${options.action.label}</a></p>`
    : '';
  const body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>${action}`;
  const html = await renderEmail(options.title, body);
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
