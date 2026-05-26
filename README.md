# Alfred AI — Assistant Personnel Intelligent

> Chatbot IA intégré sur [eamc.fr](https://eamc.fr) — Propulsé par Claude API (Anthropic)

![Alfred AI](https://img.shields.io/badge/AI-Claude%20Haiku-orange)
![PHP](https://img.shields.io/badge/PHP-8.2-blue)
![Docker](https://img.shields.io/badge/Docker-Deployed-blue)
![SSL](https://img.shields.io/badge/SSL-Let's%20Encrypt-green)

## Aperçu

**Alfred AI** est un assistant personnel intelligent déployé sur le portfolio de Ekolle Alfred Mbondo Céleste. Il répond aux visiteurs sur les services, projets et compétences d'Alfred en temps réel.

🌐 **Demo live :** [eamc.fr](https://eamc.fr) — bouton flottant en bas à droite

## Fonctionnalités

- Bouton flottant animé avec effet pulse
- Interface de chat moderne (fond gris perle, header noir/or EAMC)
- Suggestions de questions rapides
- Effet "typing" animé pendant la réponse
- Reset automatique de la conversation à la fermeture
- Responsive mobile
- Intégration Claude Haiku API (Anthropic)

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Backend | PHP 8.2 |
| IA | Claude Haiku (Anthropic API) |
| Frontend | HTML/CSS/JavaScript vanilla |
| Serveur | Apache (Docker container) |
| Proxy | Nginx + SSL Let's Encrypt |
| Hébergement | VPS Debian |

## Architecture

eamc.fr (Nginx container)
└── bouton flottant chatbot
└── fetch → https://chat.eamc.fr/api.php
└── Claude Haiku API (Anthropic)

## Installation

1. Cloner le repo
2. Copier `api.php` sur votre serveur PHP
3. Remplacer `VOTRE_CLE_API_ICI` par votre clé Anthropic
4. Intégrer le widget dans votre HTML via `chat.js`

## Sécurité

- La clé API n'est jamais exposée côté client
- Headers CORS configurés
- Gestion des requêtes OPTIONS (preflight)

## Auteur

**Ekolle Alfred Mbondo Céleste**
- Portfolio : [eamc.fr](https://eamc.fr)
- LinkedIn : [linkedin.com/in/alfred-ekolle](https://linkedin.com/in/alfred-ekolle)
- GitHub : [github.com/alfred17106](https://github.com/alfred17106)
- Email : alfred@eamc.fr
