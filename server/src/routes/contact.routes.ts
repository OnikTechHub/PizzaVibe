import { Router, Request, Response } from 'express';
import { sendEmail } from '../config/email.js';

const router = Router();

// Simple email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 * Receives contact form submissions, validates inputs, and sends notification email via Nodemailer
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Field presence and type checks
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (at least 2 characters).',
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid subject (at least 3 characters).',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a descriptive message (at least 10 characters).',
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    const adminRecipient = process.env.EMAIL_USER || 'onikdas.dev@gmail.com';
    const submissionTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // 1. Send notification email to Admin (Onik Das)
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 28px 32px; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #fecaca; margin: 6px 0 0; font-size: 13px; font-weight: 500; }
    .content { padding: 32px; }
    .meta-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
    .meta-row:last-child { margin-bottom: 0; }
    .meta-label { color: #64748b; font-weight: 600; }
    .meta-value { color: #0f172a; font-weight: 700; text-align: right; }
    .message-title { font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .message-body { background-color: #ffffff; border-left: 4px solid #dc2626; border-radius: 0 8px 8px 0; padding: 16px 20px; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #fff1f2; white-space: pre-wrap; }
    .footer { padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
    .badge { display: inline-block; background-color: #fee2e2; color: #991b1b; font-weight: 700; font-size: 11px; padding: 3px 10px; rounded-full; border-radius: 9999px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 PizzaVibe Kitchen Inquiry</h1>
      <p>New message received via website contact form</p>
    </div>
    <div class="content">
      <div style="margin-bottom: 20px;">
        <span class="badge">Chattogram Dispatch Branch</span>
      </div>

      <div class="meta-box">
        <div class="meta-row">
          <span class="meta-label">Customer Name:</span>
          <span class="meta-value">${cleanName}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Customer Email:</span>
          <span class="meta-value"><a href="mailto:${cleanEmail}" style="color: #dc2626; text-decoration: none;">${cleanEmail}</a></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Subject:</span>
          <span class="meta-value">${cleanSubject}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Received At:</span>
          <span class="meta-value">${submissionTime} (BST)</span>
        </div>
      </div>

      <div class="message-title">Message Content:</div>
      <div class="message-body">${cleanMessage}</div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanSubject)} - PizzaVibe Kitchen" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 9999px;">
          Reply to Customer Directly
        </a>
      </div>
    </div>
    <div class="footer">
      PizzaVibe Kitchen &bull; GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh<br>
      Automated notification generated by PizzaVibe Backend API
    </div>
  </div>
</body>
</html>
`;

    // Attempt to send notification email to Admin
    await sendEmail({
      to: adminRecipient,
      subject: `[PizzaVibe Contact] ${cleanSubject} - from ${cleanName}`,
      html: adminEmailHtml,
      text: `New contact form submission from ${cleanName} (${cleanEmail}):\n\nSubject: ${cleanSubject}\nTime: ${submissionTime}\n\nMessage:\n${cleanMessage}`,
      replyTo: cleanEmail,
    });

    // 2. Optionally send an acknowledgment receipt to the customer
    try {
      const customerReceiptHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #dc2626; padding: 24px 28px; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; }
    .content { padding: 28px; line-height: 1.6; font-size: 14px; color: #334155; }
    .quote-box { background-color: #f1f5f9; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-style: italic; color: #475569; }
    .footer { padding: 18px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 PizzaVibe Kitchen</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${cleanName}</strong>,</p>
      <p>Thank you for reaching out to the PizzaVibe Kitchen team! We have received your inquiry regarding <strong>"${cleanSubject}"</strong>.</p>
      <div class="quote-box">"${cleanMessage.slice(0, 150)}${cleanMessage.length > 150 ? '...' : ''}"</div>
      <p>Our team in Chattogram is reviewing your message and will get back to you within 24 hours. If your inquiry is regarding an urgent live order, feel free to give us a call at <strong>+880 1828347761</strong>.</p>
      <p style="margin-top: 20px;">Warm regards,<br><strong>The PizzaVibe Kitchen Team</strong><br>GEC Circle, CDA Avenue, Chattogram</p>
    </div>
    <div class="footer">
      &copy; 2026 PizzaVibe. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
      await sendEmail({
        to: cleanEmail,
        subject: `We have received your message - PizzaVibe Kitchen`,
        html: customerReceiptHtml,
        text: `Hello ${cleanName},\n\nThank you for reaching out to PizzaVibe! We have received your message regarding "${cleanSubject}" and our team will get back to you shortly.\n\nWarm regards,\nThe PizzaVibe Kitchen Team`,
      });
    } catch (receiptErr) {
      // Non-blocking if customer receipt fails, main admin email is what matters
      console.warn('[Contact Route] Customer auto-receipt error (non-fatal):', receiptErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Our team will get back to you shortly.',
    });
  } catch (error) {
    console.error('[Contact Route Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact us directly at onikdas.dev@gmail.com.',
    });
  }
});

export default router;
