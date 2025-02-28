import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number.parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe TuneMatch',
      html: `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <a href="${resetLink}">Réinitialiser mon mot de passe</a>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    });
  }
}
