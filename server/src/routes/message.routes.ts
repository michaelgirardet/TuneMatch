import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

const messageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide"),
  recipientId: z.number()
});

type AuthRequestHandler = RequestHandler<{ id?: string }, any, any, any, { user?: AuthRequest['user'] }>;

// Récupérer les conversations de l'utilisateur
const getConversations: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [rows] = await req.app.locals.pool.execute(
      `SELECT DISTINCT 
        u.id,
        u.nom_utilisateur,
        u.photo_profil,
        (
          SELECT m.contenu 
          FROM messages m 
          WHERE (m.id_expediteur = ? AND m.id_destinataire = u.id) 
             OR (m.id_expediteur = u.id AND m.id_destinataire = ?)
          ORDER BY m.date_envoi DESC 
          LIMIT 1
        ) as dernier_message,
        (
          SELECT m.date_envoi 
          FROM messages m 
          WHERE (m.id_expediteur = ? AND m.id_destinataire = u.id) 
             OR (m.id_expediteur = u.id AND m.id_destinataire = ?)
          ORDER BY m.date_envoi DESC 
          LIMIT 1
        ) as derniere_date
      FROM users u
      WHERE u.id IN (
        SELECT DISTINCT 
          CASE 
            WHEN m.id_expediteur = ? THEN m.id_destinataire
            ELSE m.id_expediteur
          END
        FROM messages m
        WHERE m.id_expediteur = ? OR m.id_destinataire = ?
      )
      ORDER BY derniere_date DESC`,
      [userId, userId, userId, userId, userId, userId, userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
};

// Récupérer les messages d'une conversation
const getMessages: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const otherUserId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [rows] = await req.app.locals.pool.execute(
      `SELECT m.*, 
        u_exp.nom_utilisateur as expediteur_nom,
        u_exp.photo_profil as expediteur_photo,
        u_dest.nom_utilisateur as destinataire_nom,
        u_dest.photo_profil as destinataire_photo
      FROM messages m
      JOIN users u_exp ON m.id_expediteur = u_exp.id
      JOIN users u_dest ON m.id_destinataire = u_dest.id
      WHERE (m.id_expediteur = ? AND m.id_destinataire = ?)
         OR (m.id_expediteur = ? AND m.id_destinataire = ?)
      ORDER BY m.date_envoi ASC`,
      [userId, otherUserId, otherUserId, userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

// Envoyer un message
const sendMessage: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const message = messageSchema.parse(req.body);

    // Vérifier si le destinataire existe
    const [userRows] = await req.app.locals.pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [message.recipientId]
    );

    if (!userRows[0]) {
      return res.status(404).json({ error: 'Destinataire non trouvé' });
    }

    const [result] = await req.app.locals.pool.execute(
      'INSERT INTO messages (id_expediteur, id_destinataire, contenu) VALUES (?, ?, ?)',
      [userId, message.recipientId, message.content]
    );

    // Créer une notification pour le destinataire
    await req.app.locals.pool.execute(
      'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
      [message.recipientId, 'message', `Nouveau message de ${req.user?.username}`, (result as any).insertId]
    );

    res.status(201).json({
      message: 'Message envoyé avec succès',
      messageId: (result as any).insertId
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
    }
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};

router.get('/conversations', auth, getConversations);
router.get('/:id', auth, getMessages);
router.post('/', auth, sendMessage);

export default router; 