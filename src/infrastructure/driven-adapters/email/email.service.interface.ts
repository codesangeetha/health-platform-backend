export interface IEmailService {
  sendEmail(toEmail: string, subject: string, message: string): Promise<void>;
}