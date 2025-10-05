import React, { createContext, useContext, useState, useEffect } from 'react';
import { Blockchain } from '../blockchain/Blockchain';
import { VoteData } from '../blockchain/Block';

interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  manifesto: string;
  image?: string;
}

interface Voter {
  id: string;
  name: string;
  studentId: string;
  department: string;
  hasVoted: boolean;
}

interface BlockchainContextType {
  blockchain: Blockchain;
  candidates: Candidate[];
  voters: Voter[];
  currentElection: {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  } | null;
  addCandidate: (candidate: Candidate) => void;
  registerVoter: (voter: Voter) => void;
  castVote: (voterId: string, candidateId: string) => boolean;
  getResults: () => { candidateId: string; votes: number }[];
  getWinner: () => Candidate | null;
  hasVoted: (voterId: string) => boolean;
  clearCurrentVoter: () => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blockchain, setBlockchain] = useState<Blockchain>(() => {
    // Try to load blockchain from localStorage
    const savedBlockchain = localStorage.getItem('blockchain');
    if (savedBlockchain) {
      try {
        return Blockchain.deserialize(savedBlockchain);
      } catch (error) {
        console.error('Failed to load blockchain from localStorage:', error);
        return new Blockchain();
      }
    }
    return new Blockchain();
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const savedCandidates = localStorage.getItem('candidates');
    return savedCandidates ? JSON.parse(savedCandidates) : [];
  });

  const [voters, setVoters] = useState<Voter[]>(() => {
    const savedVoters = localStorage.getItem('voters');
    return savedVoters ? JSON.parse(savedVoters) : [];
  });

  const [currentElection, setCurrentElection] = useState<BlockchainContextType['currentElection']>(() => {
    const savedElection = localStorage.getItem('currentElection');
    if (savedElection) {
      const parsedElection = JSON.parse(savedElection);
      return {
        ...parsedElection,
        startDate: new Date(parsedElection.startDate),
        endDate: new Date(parsedElection.endDate)
      };
    }
    return {
      id: 'election-2025',
      title: 'Student Council Elections 2025',
      description: 'Annual elections for the student council positions',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
      isActive: true
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('blockchain', blockchain.serialize());
    localStorage.setItem('candidates', JSON.stringify(candidates));
    localStorage.setItem('voters', JSON.stringify(voters));
    localStorage.setItem('currentElection', JSON.stringify(currentElection));
  }, [blockchain, candidates, voters, currentElection]);

  // Add a new candidate
  const addCandidate = (candidate: Candidate) => {
    setCandidates([...candidates, candidate]);
  };

  // Register a new voter
  const registerVoter = (voter: Voter) => {
    // Check if voter with this student ID already exists
    const existingVoter = voters.find(v => v.studentId === voter.studentId);
    if (existingVoter) {
      throw new Error('A voter with this Student ID is already registered.');
    }
    setVoters([...voters, voter]);
  };

  // Cast a vote for a candidate
  const castVote = (voterId: string, candidateId: string): boolean => {
    // Check if voter has already voted
    if (blockchain.hasVoted(voterId)) {
      return false;
    }

    // Create a new vote
    const vote: VoteData = {
      voterId,
      candidateId,
      timestamp: Date.now()
    };

    // Add the vote to the blockchain
    blockchain.addVote(vote);
    blockchain.minePendingVotes(voterId); // In a real system, this would be handled by miners

    // Update voter status
    setVoters(
      voters.map(voter => 
        voter.id === voterId ? { ...voter, hasVoted: true } : voter
      )
    );

    // Update the blockchain state to trigger a re-render
    setBlockchain(blockchain);
    
    return true;
  };

  // Get election results
  const getResults = () => {
    return candidates.map(candidate => ({
      candidateId: candidate.id,
      votes: blockchain.getVotesForCandidate(candidate.id)
    }));
  };

  // Get the winner of the election
  const getWinner = (): Candidate | null => {
    const results = getResults();
    if (results.length === 0) return null;

    const winningResult = results.reduce((max, current) => 
      current.votes > max.votes ? current : max
    );

    const winner = candidates.find(c => c.id === winningResult.candidateId);
    return winner || null;
  };

  // Check if a voter has already voted
  const hasVoted = (voterId: string): boolean => {
    return blockchain.hasVoted(voterId);
  };

  // Clear current voter from localStorage
  const clearCurrentVoter = () => {
    localStorage.removeItem('currentVoter');
  };

  const value = {
    blockchain,
    candidates,
    voters,
    currentElection,
    addCandidate,
    registerVoter,
    castVote,
    getResults,
    getWinner,
    hasVoted,
    clearCurrentVoter
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};