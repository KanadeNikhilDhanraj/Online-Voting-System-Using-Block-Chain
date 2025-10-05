import { Block, VoteData } from './Block';

export class Blockchain {
  chain: Block[];
  difficulty: number;
  pendingVotes: VoteData[];
  miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingVotes = [];
    this.miningReward = 0; // No mining reward for voting system
  }

  createGenesisBlock(): Block {
    return new Block(0, Date.now(), {
      voterId: 'genesis',
      candidateId: 'genesis',
      timestamp: Date.now(),
    });
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  minePendingVotes(miningRewardAddress: string): void {
    // Create a new block with all pending votes
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingVotes[0] // In a real system, we would include multiple votes in a block
    );
    block.previousHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);
    
    // Clear the pending votes and add the reward transaction if needed
    this.pendingVotes = [];
  }

  addVote(vote: VoteData): void {
    this.pendingVotes.push(vote);
  }

  getVotesForCandidate(candidateId: string): number {
    let count = 0;
    
    for (const block of this.chain) {
      if (block.data && block.data.candidateId === candidateId) {
        count++;
      }
    }
    
    return count;
  }

  getAllVotes(): VoteData[] {
    const votes: VoteData[] = [];
    
    for (const block of this.chain) {
      if (block.index > 0) { // Skip genesis block
        votes.push(block.data);
      }
    }
    
    return votes;
  }

  getTotalVotes(): number {
    return this.getAllVotes().length;
  }

  hasVoted(voterId: string): boolean {
    for (const block of this.chain) {
      if (block.data && block.data.voterId === voterId) {
        return true;
      }
    }
    
    for (const pendingVote of this.pendingVotes) {
      if (pendingVote.voterId === voterId) {
        return true;
      }
    }
    
    return false;
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  // Serialize the blockchain to JSON for storage
  serialize(): string {
    return JSON.stringify(this.chain);
  }

  // Deserialize the blockchain from JSON
  static deserialize(serialized: string): Blockchain {
    const blockchain = new Blockchain();
    const parsedChain = JSON.parse(serialized);
    
    blockchain.chain = parsedChain.map((blockData: any) => {
      const block = new Block(
        blockData.index,
        blockData.timestamp,
        blockData.data,
        blockData.previousHash
      );
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;
      return block;
    });
    
    return blockchain;
  }
}