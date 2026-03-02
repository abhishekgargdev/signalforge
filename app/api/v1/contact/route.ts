import { NextRequest } from 'next/server';
import { standardError, standardResponse } from '@/lib/auth';
import { sendEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();
    if (!name || !email || !message) {
      return standardError('VALIDATION_ERROR', 'Name, email, and message are required', 400);
    }

    const inbox = process.env.MAIL_FROM || process.env.SMTP_USER;
    if (!inbox) return standardError('MAIL_NOT_CONFIGURED', 'SMTP is not configured', 500);

    await sendEmail({
      to: inbox,
      subject: `SignalForge contact from ${name}`,
      title: 'New contact message',
      rows: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Message', value: message.replace(/</g, '&lt;') },
      ],
    });

    await sendEmail({
      to: email,
      subject: 'We received your SignalForge message',
      title: 'Message received',
      rows: [
        { label: 'Name', value: name },
        { label: 'Summary', value: 'Your note is in the SignalForge inbox. We will reply to this address.' },
      ],
    });

    return standardResponse({ sent: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not send email';
    return standardError('CONTACT_ERROR', message, 500);
  }
}
