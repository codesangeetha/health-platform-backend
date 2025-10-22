import { IEmailService } from './email.service.interface';
import { MailtrapClient } from 'mailtrap';
import { AppError } from '@/shared/errors/app-error';

export class MailtrapEmailService implements IEmailService {
  private client: MailtrapClient;

  constructor(
    private readonly token: string
  ) {
    this.client = new MailtrapClient({ token:"56e6859635ef3ff97ee36dc32acfd0a2" });
  }

  async sendEmail(toEmail: string, subject: string, message: string): Promise<void> {
    console.log("mail");
    const sender = {
      email: "mailtrap@demomailtrap.com",
      name: "Health Platform",
    };

    const recipients = [
      {
        email: toEmail,
      },
    ];

    try {
      const response = await this.client.send({
        from: sender,
        to: recipients,
        subject,
        text: message,
        category: "Password Reset",
      });

      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new AppError('Failed to send reset email', 'EMAIL_SEND_FAILED', 500);
    }
  }
}