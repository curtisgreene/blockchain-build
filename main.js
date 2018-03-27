const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock(){
    return new Block(0, "1/1/2018", "Genesis Block", '');
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
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
console.log("Mining new coin 1...");
navcoin.addBlock( new Block(1, '3/23/2018', { amount: 10}));
console.log("Mining new coin 2...");
navcoin.addBlock( new Block(2, '3/24/2018', { amount: 100}));
