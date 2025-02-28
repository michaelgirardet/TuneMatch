import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${email}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Réinitialisation de votre mot de passe TuneMatch',
    html: `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien est valable pendant 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
  }
}; 