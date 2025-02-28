# Template Full Stack Next.js + Express + MySQL

## 🚀 Vue d'ensemble

Template moderne et sécurisé pour application web full stack avec :
- **Frontend** : Next.js, TypeScript, Tailwind CSS
- **Backend** : Express.js, TypeScript, MySQL
- **Sécurité** : JWT, Helmet, Rate Limiting
- **Tests** : Jest, Cypress

## 📦 Installation

1. Cloner le projet :
```bash
git clone <url-du-projet>
cd mon-projet
```

2. Installer les dépendances :
```bash
# Installation de toutes les dépendances (client + serveur)
npm run install-all
```

3. Configuration :
```bash
# Copier les fichiers d'exemple
cd server && cp .env.example .env
cd ../client && cp .env.example .env.local
```

4. Configurer la base de données :
```bash
# Initialiser la base de données
cd server && npm run init-db
```

## 🔧 Développement

Lancer le projet en développement :
```bash
# Lancer le client et le serveur
npm run dev

# Lancer uniquement le client (port 3000)
cd client && npm run dev

# Lancer uniquement le serveur (port 5000)
cd server && npm run dev
```

## 🧪 Tests

```bash
# Tests unitaires
cd server && npm test
cd client && npm test

# Tests E2E avec Cypress
cd client && npm run cypress
```

## 📝 Scripts disponibles

### Client (port 3000)
- `npm run dev` : Mode développement
- `npm run build` : Build de production
- `npm start` : Démarrer en production
- `npm run cypress` : Tests E2E
- `npm test` : Tests unitaires

### Serveur (port 5000)
- `npm run dev` : Mode développement
- `npm run build` : Build de production
- `npm start` : Démarrer en production
- `npm run init-db` : Initialiser la BDD
- `npm test` : Tests unitaires

## 🗄️ Structure du projet

```
mon-projet/
├── client/                # Frontend Next.js
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── pages/       # Pages de l'application
│   │   ├── hooks/       # Hooks personnalisés
│   │   └── services/    # Services API
│   └── cypress/         # Tests E2E
│
├── server/               # Backend Express
    ├── src/
    │   ├── controllers/ # Contrôleurs
    │   ├── middleware/  # Middleware Express
    │   ├── services/    # Services métier
    │   └── routes/      # Routes API
    └── tests/           # Tests unitaires
```

## 🔒 Variables d'environnement

### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Serveur (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=mon_projet
JWT_SECRET=votre_secret
```

## 🚀 Déploiement

1. Build des applications :
```bash
# Build client et serveur
npm run build
```

2. Démarrer en production :
```bash
# Démarrer client et serveur
npm start
```

## 📚 Documentation API

La documentation Swagger est disponible sur :
```
http://localhost:5000/api-docs
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT
