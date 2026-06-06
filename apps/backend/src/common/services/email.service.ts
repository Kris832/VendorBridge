import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Template } from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: this.configService.get<string>('SMTP_USER')
        ? {
            user: this.configService.get<string>('SMTP_USER'),
            pass: this.configService.get<string>('SMTP_PASS'),
          }
        : undefined,
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: any[],
  ) {
    try {
      return await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string, verificationLink: string) {
    const html = `
      <h2>Welcome to VendorBridge, ${firstName}!</h2>
      <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    return this.sendEmail(email, 'Welcome to VendorBridge', html);
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    const html = `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    return this.sendEmail(email, 'Password Reset Request', html);
  }

  async sendRFQNotification(vendorEmail: string, rfqNumber: string, title: string, deadlineDate: Date) {
    const html = `
      <h2>New RFQ Published</h2>
      <p>A new Request for Quotation has been published:</p>
      <p><strong>RFQ Number:</strong> ${rfqNumber}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Deadline:</strong> ${deadlineDate.toLocaleDateString()}</p>
      <p><a href="${process.env.FRONTEND_URL}/quotations/new">Submit Quotation</a></p>
    `;

    return this.sendEmail(vendorEmail, `New RFQ: ${rfqNumber}`, html);
  }

  async sendPOEmail(vendorEmail: string, poNumber: string, vendorName: string, attachmentPath?: string) {
    const html = `
      <h2>Purchase Order Issued</h2>
      <p>Dear ${vendorName},</p>
      <p>A new Purchase Order has been issued for you:</p>
      <p><strong>PO Number:</strong> ${poNumber}</p>
      <p>Please find the attached Purchase Order PDF.</p>
      <p>Best regards,<br>VendorBridge Team</p>
    `;

    const attachments = attachmentPath
      ? [
          {
            filename: `${poNumber}.pdf`,
            path: attachmentPath,
          },
        ]
      : undefined;

    return this.sendEmail(vendorEmail, `Purchase Order: ${poNumber}`, html, attachments);
  }

  async sendInvoiceEmail(vendorEmail: string, invoiceNumber: string, vendorName: string, attachmentPath?: string) {
    const html = `
      <h2>Invoice Generated</h2>
      <p>Dear ${vendorName},</p>
      <p>An invoice has been generated:</p>
      <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
      <p>Please find the attached Invoice PDF.</p>
      <p>Best regards,<br>VendorBridge Team</p>
    `;

    const attachments = attachmentPath
      ? [
          {
            filename: `${invoiceNumber}.pdf`,
            path: attachmentPath,
          },
        ]
      : undefined;

    return this.sendEmail(vendorEmail, `Invoice: ${invoiceNumber}`, html, attachments);
  }
}
