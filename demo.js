// =============================================================================
// demo.js
// -----------------------------------------------------------------------------
// Petit scénario de démonstration SANS serveur : crée des transactions, mine
// des blocs, affiche la chaîne, puis prouve l'infalsifiabilité en tentant de
// modifier un bloc ancien.
//
// Lancement :
//   node examples/demo.js
// =============================================================================

const Blockchain = require("../src/blockchain");

const banque = new Blockchain(4); // difficulté 4 (empreinte commençant par 0000)

console.log("1) Création de transactions puis minage d'un premier bloc...");
banque.createNewTransaction(100, "Alice", "Bob");
banque.createNewTransaction(50, "Bob", "Carole");
banque.mineBlock();

console.log("2) Nouvelles transactions puis minage d'un second bloc...");
banque.createNewTransaction(25, "Carole", "David");
banque.mineBlock();

console.log("\n=== Chaîne complète ===");
console.log(JSON.stringify(banque.chain, null, 2));

console.log("\n3) La chaîne est-elle valide ?",
  banque.chainIsValid() ? "OUI" : "NON");

console.log("\n4) Tentative de FRAUDE : on modifie en douce le montant d'une");
console.log("   transaction déjà inscrite dans le bloc 2...");
banque.chain[1].transactions[0].amount = 999999;

console.log("   La chaîne est-elle encore valide ?",
  banque.chainIsValid() ? "OUI" : "NON (la fraude est détectée)");
