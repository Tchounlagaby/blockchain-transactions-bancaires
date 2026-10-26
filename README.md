# Blockchain pour la sécurisation des transactions bancaires

Implémentation en **Node.js** d'une blockchain simple, accompagnée d'une **API
Express**, reproduisant le système décrit dans le mémoire de master
**« La technologie blockchain pour la sécurisation des transactions bancaires »**
(Institut Universitaire du Golfe de Guinée, Université de Douala, Cameroun).

Chaque bloc contient des transactions et est relié au précédent par son
empreinte **SHA-256**. La **preuve de travail** (proof-of-work) rend la chaîne
infalsifiable : modifier une transaction ancienne casse toute la chaîne, ce qui
est immédiatement détecté.

> Auteure : Gaby Béatrice Tchounla Nguenle.

---

## 1. Contenu

```
blockchain-transactions-bancaires/
├── README.md
├── LICENSE                 ← licence MIT
├── package.json            ← dépendances et commandes npm
├── .gitignore
├── src/
│   ├── blockchain.js       ← la classe Blockchain (blocs, hash, preuve de travail)
│   └── api.js              ← le serveur Express et ses points de terminaison
├── examples/
│   ├── demo.js             ← démonstration sans serveur (mine + test de fraude)
│   └── requetes.http       ← exemples de requêtes pour Postman / VS Code
└── docs/
    └── GUIDE_GITHUB.md     ← comment mettre ce dossier en ligne sur GitHub
```

---

## 2. Installation

Nécessite **Node.js 18 ou plus** (téléchargeable sur <https://nodejs.org>).

```bash
git clone https://github.com/<votre-compte>/blockchain-transactions-bancaires.git
cd blockchain-transactions-bancaires
npm install
```

---

## 3. Utilisation

### 3.1 Démonstration rapide (sans serveur)

```bash
npm run demo
```

Ce scénario crée des transactions, mine deux blocs, affiche la chaîne, puis
**tente une fraude** sur un bloc ancien pour montrer qu'elle est détectée.

### 3.2 Lancer l'API (serveur)

```bash
npm start
```

Le serveur démarre sur <http://localhost:3000>. Points de terminaison :

| Méthode | Adresse | Rôle |
| --- | --- | --- |
| GET | `/` | message d'accueil |
| GET | `/blockchain` | renvoie toute la chaîne |
| POST | `/transaction` | enregistre une transaction en attente |
| GET | `/mine` | mine un bloc avec les transactions en attente |
| GET | `/valid` | indique si la chaîne est valide (non falsifiée) |

### 3.3 Tester avec Postman

Comme dans le mémoire, vous pouvez utiliser **Postman** :

1. `GET http://localhost:3000/blockchain` — pour voir la chaîne.
2. `POST http://localhost:3000/transaction` — onglet **Body** → **raw** → **JSON** :
   ```json
   { "amount": 10, "sender": "Alice", "recipient": "Bob" }
   ```
3. `GET http://localhost:3000/mine` — pour inscrire la transaction dans un bloc.
4. `GET http://localhost:3000/valid` — pour vérifier l'intégrité.

Le fichier `examples/requetes.http` contient ces requêtes prêtes à l'emploi.

---

## 4. Comment ça marche

- **Bloc** : `{ index, timestamp, transactions, nonce, hash, previousBlockHash }`.
- **Hachage (SHA-256)** : `hashBlock()` calcule l'empreinte d'un bloc à partir de
  l'empreinte précédente, du nonce et des données.
- **Preuve de travail** : `proofOfWork()` cherche le `nonce` qui donne une
  empreinte commençant par un nombre fixé de zéros (la *difficulté*).
- **Validation** : `chainIsValid()` vérifie, pour chaque bloc, le lien vers le
  bloc précédent et la validité de la preuve de travail.

La partie **réseau** du mémoire (VPN IPsec, topologies sous Cisco Packet Tracer)
ne contient pas de code source : elle se reproduit dans Packet Tracer à partir
des schémas du mémoire.

---

## 5. Licence

Code publié sous licence **MIT** (voir `LICENSE`). Réutilisation et citation
libres.
