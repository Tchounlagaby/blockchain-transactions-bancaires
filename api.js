// =============================================================================
// api.js
// -----------------------------------------------------------------------------
// Serveur / API de la blockchain, construit avec Express.js (comme dans le
// mémoire). Il expose des points de terminaison (endpoints) que l'on peut
// appeler depuis un navigateur ou depuis Postman :
//
//   GET  /              -> message d'accueil
//   GET  /blockchain    -> renvoie toute la chaîne
//   POST /transaction   -> enregistre une nouvelle transaction (en attente)
//   GET  /mine          -> mine un bloc contenant les transactions en attente
//   GET  /valid         -> indique si la chaîne est valide (non falsifiée)
//
// Lancement :
//   npm start           (ou : node src/api.js)
// =============================================================================

const express = require("express");
const Blockchain = require("./blockchain");

const app = express();
const PORT = process.env.PORT || 3000;

// body-parser est intégré à Express depuis la version 4.16 : cette ligne
// permet de lire les données JSON envoyées dans le corps des requêtes POST.
app.use(express.json());

// On crée notre blockchain (difficulté 4 = l'empreinte doit commencer par 0000).
const banque = new Blockchain(4);

// --- GET /  : simple message d'accueil ---------------------------------------
app.get("/", (req, res) => {
  res.send("Blockchain bancaire — API en fonctionnement. Essayez /blockchain");
});

// --- GET /blockchain : renvoie toute la chaîne -------------------------------
app.get("/blockchain", (req, res) => {
  res.json(banque);
});

// --- POST /transaction : enregistre une nouvelle transaction -----------------
// Corps attendu (JSON) : { "amount": 10, "sender": "Alice", "recipient": "Bob" }
app.post("/transaction", (req, res) => {
  const { amount, sender, recipient } = req.body;
  if (amount === undefined || !sender || !recipient) {
    return res.status(400).json({
      note: "Données manquantes. Envoyez amount, sender et recipient.",
    });
  }
  const blockIndex = banque.createNewTransaction(amount, sender, recipient);
  res.json({ note: `Transaction ajoutée au bloc n° ${blockIndex}.` });
});

// --- GET /mine : mine un bloc avec les transactions en attente ---------------
app.get("/mine", (req, res) => {
  if (banque.pendingTransactions.length === 0) {
    return res.json({ note: "Aucune transaction en attente à miner." });
  }
  const nouveauBloc = banque.mineBlock();
  res.json({ note: "Nouveau bloc miné avec succès.", block: nouveauBloc });
});

// --- GET /valid : vérifie l'intégrité de la chaîne ---------------------------
app.get("/valid", (req, res) => {
  const valide = banque.chainIsValid();
  res.json({
    valide: valide,
    note: valide
      ? "La chaîne est valide : aucune falsification détectée."
      : "ATTENTION : la chaîne a été falsifiée !",
  });
});

// On ne démarre le serveur que si ce fichier est lancé directement
// (et pas lorsqu'il est importé par les tests).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur blockchain démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;
