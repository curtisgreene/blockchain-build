const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(){
    return new Block(0, "1/1/2018", "Genesis Block", '');
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid(){ //starts looping at 1 index because the 0 index is the Genesis block
    for( let i = 1; i < this.chain.length; i++ ){
      let currentBlock = this.chain[i];
      let previousHash = this.chain[i-1];
      if( currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }
      if( currentBlock.previousHash !== previousHash.hash ){
        return false;
      }
    }
    return true;
  }
}

let navcoin = new Blockchain();
navcoin.addBlock( new Block(1, '3/23/2018', { amount: 10}));
navcoin.addBlock( new Block(2, '3/24/2018', { amount: 100}));
// console.log(JSON.stringify(navcoin, null, 4))
console.log("Is chain valid? " + navcoin.isChainValid());
navcoin.chain[1].data = "Hella shit coins";
console.log("Is chain valid? " + navcoin.isChainValid());
