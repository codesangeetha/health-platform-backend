import { IEmailService } from './email.service.interface';
import { AppError } from '@/shared/errors/app-error';
import * as https from 'https';

interface BrevoEmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  htmlContent: string;
}

interface BrevoEmailResponse {
  messageId: string;
}

export class BrevoEmailService implements IEmailService {
  private readonly apiKey: string;
  private readonly apiUrl = 'api.brevo.com';
  private readonly endpoint = '/v3/smtp/email';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(toEmail: string, subject: string, message: string): Promise<void> {
    const emailData: BrevoEmailRequest = {
      sender: {
        name: 'Health Platform',
        email: 'sangeetharenganath98@gmail.com',
      },
      to: [
        {
          email: toEmail,
          name: 'User',
        },
      ],
      subject,
      htmlContent: this.convertTextToHtml(message),
    };

    const postData = JSON.stringify(emailData);

    const options: https.RequestOptions = {
      hostname: this.apiUrl,
      port: 443,
      path: this.endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    try {
      await this.makeRequest(options, postData);
      console.log('Email sent successfully via Brevo');
    } catch (error) {
      console.error('Error sending email via Brevo:', error);
      throw new AppError('Failed to send email via Brevo', 'EMAIL_SEND_FAILED', 500);
    }
  }

  private makeRequest(options: https.RequestOptions, postData: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`Brevo API error: ${res.statusCode} - ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  private convertTextToHtml(text: string): string {
    // Basic HTML conversion - you can enhance this based on your needs
    return `<html><head></head><body><p>${text.replace(/\n/g, '</p><p>')}</p></body></html>`;
  }
}
