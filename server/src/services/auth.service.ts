import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { pool } from '../database/connection';
import type { User } from '../types/user.types';
import type { RegisterInput } from '../utils/validation';
import crypto from 'crypto';

export class AuthService {
  private pool;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';
  private readonly RESET_TOKEN_EXPIRY = 3600000; // 1 heure en millisecondes

  constructor(dbPool: typeof pool) {
    this.pool = dbPool;
    console.log('AuthService initialisé avec le secret JWT:', this.JWT_SECRET.substring(0, 10) + '...');
  }

  async register(input: RegisterInput): Promise<User> {
    // Hash du mot de passe
    const hashedPassword = await argon2.hash(input.mot_de_passe);

    // Insertion dans la base de données
    const [result] = await this.pool.execute(
      'INSERT INTO Utilisateur (nom_utilisateur, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
      [input.nom_utilisateur, input.email, hashedPassword, input.role]
    );

    return {
      ...input,
      mot_de_passe: hashedPassword,
    };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    // Recherche de l'utilisateur
    const [users] = (await this.pool.execute('SELECT * FROM Utilisateur WHERE email = ?', [
      email,
    ])) as [User[], any];

    if (!users.length) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = users[0];

    // Vérification du mot de passe
    const isValid = await argon2.verify(user.mot_de_passe, password);
    if (!isValid) {
      throw new Error('Mot de passe incorrect');
    }

    // Création du token JWT
    console.log('Création du token avec le secret:', this.JWT_SECRET.substring(0, 10) + '...');
    const token = jwt.sign(
      {
        userId: user.id_utilisateur,
        email: user.email,
        role: user.role,
      },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token créé avec succès');

    // On ne renvoie pas le mot de passe
    const { mot_de_passe, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async createPasswordResetToken(email: string): Promise<string | null> {
    // Vérifier si l'utilisateur existe
    const [users] = await this.pool.execute('SELECT * FROM Utilisateur WHERE email = ?', [email]);

    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await argon2.hash(resetToken);

    // Stocker le token et sa date d'expiration
    await this.pool.execute(
      'UPDATE Utilisateur SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [hashedToken, new Date(Date.now() + this.RESET_TOKEN_EXPIRY), email]
    );

    return resetToken;
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    // Récupérer l'utilisateur et vérifier le token
    const [users] = (await this.pool.execute(
      'SELECT * FROM Utilisateur WHERE email = ? AND reset_token_expires > NOW()',
      [email]
    )) as [User[], any];

    if (!users.length) {
      throw new Error('Token invalide ou expiré');
    }

    const user = users[0];

    if (!user.reset_token) {
      throw new Error('Aucune demande de réinitialisation en cours');
    }

    // Vérifier le token
    const isValidToken = await argon2.verify(user.reset_token, token);
    if (!isValidToken) {
      throw new Error('Token invalide');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await argon2.hash(newPassword);

    // Mettre à jour le mot de passe et supprimer le token de réinitialisation
    await this.pool.execute(
      'UPDATE Utilisateur SET mot_de_passe = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
      [hashedPassword, email]
    );
  }
}
