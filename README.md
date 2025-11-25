# PharmaCare Pro - Guide de Déploiement

Ce guide vous explique comment déployer l'application **PharmaCare Pro** sur Vercel.

## 📋 Prérequis

1.  Un compte [GitHub](https://github.com), GitLab ou Bitbucket.
2.  Un compte [Vercel](https://vercel.com).
3.  Une clé API Google Gemini (pour l'assistant IA).

## 🚀 Méthode 1 : Déploiement via GitHub (Recommandé)

Cette méthode permet de mettre à jour votre site automatiquement à chaque fois que vous modifiez le code.

1.  **Créer un dépôt Git :**
    *   Créez un nouveau repository sur GitHub.
    *   Poussez (push) tous les fichiers de ce projet vers ce repository.

2.  **Importer dans Vercel :**
    *   Connectez-vous sur Vercel.
    *   Cliquez sur **"Add New..."** > **"Project"**.
    *   Sélectionnez votre repository GitHub (PharmaCare Pro).
    *   Vercel va détecter automatiquement qu'il s'agit d'un projet `Vite`.

3.  **Configurer la Clé API :**
    *   Dans la section **"Environment Variables"** de la configuration Vercel :
    *   Ajoutez une nouvelle variable :
        *   **Key** : `API_KEY`
        *   **Value** : Votre clé API Google Gemini (commençant par `AIza...`).
    *   Cliquez sur **Add**.

4.  **Déployer :**
    *   Cliquez sur **"Deploy"**.
    *   Attendez quelques secondes... Votre application est en ligne ! 🎉

## 🛠️ Méthode 2 : Déploiement via Vercel CLI (Ligne de commande)

Si vous avez installé Vercel CLI sur votre ordinateur.

1.  Ouvrez votre terminal dans le dossier du projet.
2.  Exécutez la commande :
    ```bash
    vercel
    ```
3.  Suivez les instructions à l'écran (Set up and deploy? [Y], Link to existing project? [N], etc.).
4.  Pour configurer la variable d'environnement via la CLI :
    ```bash
    vercel env add API_KEY
    ```
    (Entrez votre clé API quand demandé, choisissez 'Production', 'Preview' et 'Development').
5.  Redéployez pour appliquer la clé :
    ```bash
    vercel --prod
    ```

## ⚠️ Note Importante sur l'API Key

L'application utilise l'IA de Google Gemini via le SDK `@google/genai`. 
Le fichier `vite.config.ts` a été configuré pour injecter votre `API_KEY` sécurisée dans l'application lors de la construction (Build) sur Vercel.

Sans cette variable d'environnement configurée dans Vercel, l'assistant IA ne pourra pas répondre aux questions.

## 📦 Commandes Locales

Pour tester l'application sur votre ordinateur avant de déployer :

1.  Installer les dépendances :
    ```bash
    npm install
    ```
2.  Lancer le serveur de développement :
    ```bash
    npm run dev
    ```
3.  Construire pour la production (test local) :
    ```bash
    npm run build
    ```
