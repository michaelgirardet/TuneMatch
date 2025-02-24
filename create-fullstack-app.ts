#!/usr/bin/env node
import { execSync } from 'child_process';

const repoUrl = 'https://github.com/votre-username/fullstack-template.git';
const projectName = process.argv[2];

if (!projectName) {
  console.error('Veuillez spécifier un nom de projet');
  process.exit(1);
}

console.log(`🚀 Création du projet ${projectName}...`);

try {
  execSync(`git clone ${repoUrl} ${projectName}`);
  execSync(`cd ${projectName} && rm -rf .git && git init`);
  console.log('✅ Template cloné avec succès !');
} catch (error) {
  console.error('❌ Erreur:', error);
} 