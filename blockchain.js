// =============================================================================
// blockchain.js
// -----------------------------------------------------------------------------
// Implémentation de la classe Blockchain décrite dans le mémoire
// « La technologie blockchain pour la sécurisation des transactions bancaires ».
//
// La chaîne est une suite de blocs. Chaque bloc contient des transactions, et
// est relié au précédent par son empreinte (hash SHA-256). Modifier un bloc
// ancien changerait son empreinte et casserait toute la chaîne : c'est ce qui
// rend les enregistrements infalsifiables.
//
// Méthodes principales (noms repris du mémoire) :
//   createNewBlock       : crée et ajoute un nouveau bloc à la chaîne
//   getLastBlock         : renvoie le dernier bloc de la chaîne
//   createNewTransaction : prépare une transaction en attente
//   hashBlock            : calcule l'empreinte SHA-256 d'un bloc
//   proofOfWork          : trouve le nonce qui valide le bloc (preuve de travail)
//   chainIsValid         : vérifie que la chaîne entière est cohérente
// =============================================================================

const crypto = require("crypto");

class Blockchain {
  constructor(difficulte = 4) {
    this.chain = [];                 // la chaîne de blocs
    this.pendingTransactions = [];   // transactions pas encore inscrites dans un bloc
    // La difficulté = nombre de zéros exigés au début de l'empreinte.
    // Plus elle est élevée, plus le minage est long (preuve de travail).
    this.difficulte = difficulte;

    // Bloc de genèse : le tout premier bloc, créé manuellement.
    this.createNewBlock(100, "0", "0");
  }

  // ---------------------------------------------------------------------------
  // Crée un nouveau bloc contenant les transactions en attente, puis l'ajoute.
  // ---------------------------------------------------------------------------
  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,                       // preuve de travail
      hash: hash,                         // empreinte de ce bloc
      previousBlockHash: previousBlockHash, // empreinte du bloc précédent
    };

    this.pendingTransactions = [];        // on vide les transactions en attente
    this.chain.push(newBlock);
    return newBlock;
  }

  // ---------------------------------------------------------------------------
  // Renvoie le dernier bloc de la chaîne.
  // ---------------------------------------------------------------------------
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // ---------------------------------------------------------------------------
  // Prépare une nouvelle transaction (montant, expéditeur, destinataire).
  // Elle reste "en attente" jusqu'au prochain minage.
  // Renvoie l'index du bloc dans lequel elle sera inscrite.
  // ---------------------------------------------------------------------------
  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient,
      transactionId: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock().index + 1;
  }

  // ---------------------------------------------------------------------------
  // Calcule l'empreinte SHA-256 d'un bloc, à partir de son contenu.
  // ---------------------------------------------------------------------------
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const donnees = previousBlockHash + String(nonce) + JSON.stringify(currentBlockData);
    return crypto.createHash("sha256").update(donnees).digest("hex");
  }

  // ---------------------------------------------------------------------------
  // Preuve de travail : on incrémente le nonce jusqu'à obtenir une empreinte
  // qui commence par un nombre fixé de zéros (la difficulté). C'est ce calcul
  // coûteux qui sécurise la chaîne contre la fraude.
  // Renvoie le nonce valide.
  // ---------------------------------------------------------------------------
  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    const prefixe = "0".repeat(this.difficulte);
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, this.difficulte) !== prefixe) {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
  }

  // ---------------------------------------------------------------------------
  // Mine un nouveau bloc : trouve la preuve de travail, calcule l'empreinte,
  // puis ajoute le bloc à la chaîne.
  // ---------------------------------------------------------------------------
  mineBlock() {
    const lastBlock = this.getLastBlock();
    const previousBlockHash = lastBlock.hash;
    const currentBlockData = {
      transactions: this.pendingTransactions,
      index: lastBlock.index + 1,
    };
    const nonce = this.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    return this.createNewBlock(nonce, previousBlockHash, blockHash);
  }

  // ---------------------------------------------------------------------------
  // Vérifie l'intégrité de toute la chaîne :
  //   - chaque bloc pointe bien vers l'empreinte du bloc précédent ;
  //   - l'empreinte recalculée de chaque bloc commence par les zéros exigés.
  // Renvoie true si la chaîne est valide, false sinon.
  // ---------------------------------------------------------------------------
  chainIsValid() {
    const prefixe = "0".repeat(this.difficulte);
    for (let i = 1; i < this.chain.length; i++) {
      const bloc = this.chain[i];
      const blocPrecedent = this.chain[i - 1];

      // 1) Le lien vers le bloc précédent est-il correct ?
      if (bloc.previousBlockHash !== blocPrecedent.hash) {
        return false;
      }

      // 2) L'empreinte du bloc est-elle une preuve de travail valide ?
      const hashRecalcule = this.hashBlock(
        bloc.previousBlockHash,
        { transactions: bloc.transactions, index: bloc.index },
        bloc.nonce
      );
      if (hashRecalcule.substring(0, this.difficulte) !== prefixe) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;
