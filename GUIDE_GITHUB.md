# Mettre ce dossier en ligne sur GitHub — guide pas à pas

Objectif : obtenir un lien du type
`https://github.com/votre-compte/blockchain-transactions-bancaires` à citer dans votre CV,
votre projet de recherche et vos mails aux professeurs.

---

## Étape 1 — Créer un compte et un dépôt GitHub

1. Créez un compte gratuit sur <https://github.com>.
2. En haut à droite, cliquez sur **+** puis **New repository**.
3. Remplissez :
   - **Repository name** : `blockchain-transactions-bancaires`
   - **Description** : *Blockchain Node.js pour la securisation des transactions bancaires*
   - Cochez **Public** (pour que les professeurs puissent le voir).
   - **Ne cochez rien d'autre** (pas de README, pas de .gitignore : ils sont déjà dans le dossier).
4. Cliquez sur **Create repository**. Laissez la page ouverte : elle affiche l'adresse du dépôt.

---

## Étape 2 — Installer Git (une seule fois)

- **Windows** : installez *Git for Windows* depuis <https://git-scm.com/download/win>, puis ouvrez **Git Bash**.
- **Linux (Ubuntu/Kali)** : `sudo apt install git`
- **macOS** : `git --version` (propose l'installation si absent).

Configurez votre identité (à faire une seule fois) :

```bash
git config --global user.name "Gaby Béatrice Tchounla Nguenle"
git config --global user.email "gabytchounla41@gmail.com"
```

---

## Étape 3 — Envoyer le dossier sur GitHub

Ouvrez un terminal **dans le dossier `blockchain-transactions-bancaires`** (celui qui contient
`README.md`), puis tapez ligne par ligne :

```bash
git init
git add .
git commit -m "Code initial : blockchain Node.js et API Express"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/blockchain-transactions-bancaires.git
git push -u origin main
```

Remplacez `VOTRE-COMPTE` par votre identifiant GitHub.

Lors du `git push`, GitHub demande une authentification. Le mot de passe
classique ne marche plus : il faut un **jeton d'accès personnel** (*personal
access token*).

### Créer le jeton
1. Sur GitHub : votre photo (en haut à droite) → **Settings** →
   tout en bas à gauche **Developer settings** →
   **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
2. Donnez un nom (ex. « mon pc »), une expiration (ex. 90 jours), et cochez la
   case **repo**.
3. Cliquez **Generate token** et **copiez-le immédiatement** (il ne sera plus
   affiché).
4. Quand `git push` demande le mot de passe, **collez le jeton** à la place.

---

## Étape 4 — Vérifier

Rechargez la page de votre dépôt sur GitHub. Vous devez voir vos fichiers et le
README affiché en bas. Le lien à partager est l'adresse de la page, par exemple :

```
https://github.com/VOTRE-COMPTE/blockchain-transactions-bancaires
```

---

## Mettre à jour plus tard

Après chaque modification ou nouvelle mesure, depuis le même dossier :

```bash
git add .
git commit -m "Décrivez le changement en quelques mots"
git push
```

---

## Conseils

- Le fichier `.gitignore` empêche d'envoyer vos gros fichiers de données
  (`data/*.csv`) et les figures. C'est voulu : le code se partage, les mesures
  restent chez vous. Pour partager un petit jeu d'exemple, retirez la ligne
  correspondante du `.gitignore`.
- Remplacez l'année et le nom dans le fichier `LICENSE` si besoin.
- Dans vos mails aux professeurs, écrivez par exemple :
  « *Code and reproducible experiments: https://github.com/VOTRE-COMPTE/blockchain-transactions-bancaires* ».
- Alternative sans ligne de commande : sur la page du dépôt vide, cliquez
  **uploading an existing file**, puis glissez-déposez les fichiers. Pratique,
  mais Git est préférable pour les mises à jour futures.
